import { Product } from "../models/product.model.js";
import { Operation } from "../models/operation.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    console.log("➡️ Starting dashboard stats fetch for user:", req.user?._id);

    // 1. Total Products
    const totalProducts = await Product.countDocuments({ owner: req.user._id });

    // 2. Pending Receipts (Incoming)
    const pendingReceipts = await Operation.countDocuments({
      type: "RECEIPT",
      status: { $in: ["DRAFT", "READY"] },
      owner: req.user._id,
    });

    // 3. Pending Deliveries (Outgoing)
    const pendingDeliveries = await Operation.countDocuments({
      type: "DELIVERY",
      status: { $in: ["DRAFT", "READY"] },
      owner: req.user._id,
    });

    // 4. Internal Transfers Scheduled
    const internalTransfers = await Operation.countDocuments({
      type: "INTERNAL_TRANSFER",
      status: { $in: ["DRAFT", "READY"] },
      owner: req.user._id,
    });

    // 5. Low Stock Items
    const lowStockItems = await Product.aggregate([
      {
        $match: { owner: req.user._id }
      },
      {
        $lookup: {
          from: "stockquants",
          localField: "_id",
          foreignField: "product",
          as: "stockData",
        },
      },
      {
        $addFields: {
          totalStock: { $sum: "$stockData.quantity" },
        },
      },
      {
        $match: {
          $expr: { $lt: ["$totalStock", "$minStockLevel"] },
        },
      },
      {
        $count: "lowStockCount",
      },
    ]);

    const lowStockCount = lowStockItems[0]?.lowStockCount || 0;

    // 6. Out of Stock Items
    const outOfStockItems = await Product.aggregate([
      {
        $match: { owner: req.user._id }
      },
      {
        $lookup: {
          from: "stockquants",
          localField: "_id",
          foreignField: "product",
          as: "stockData",
        },
      },
      {
        $addFields: {
          totalStock: { $sum: "$stockData.quantity" },
        },
      },
      {
        $match: {
          totalStock: { $lte: 0 },
        },
      },
      {
        $count: "outOfStockCount",
      },
    ]);

    const outOfStockCount = outOfStockItems[0]?.outOfStockCount || 0;

    // --- Recent Activity (Combined) ---
    // Fetch recent Operations
    const recentOps = await Operation.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("reference type status createdAt")
      .lean();

    // Fetch recent Products
    const recentProducts = await Product.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("name sku createdAt")
      .lean();

    // Normalize
    const normalizedOps = recentOps.map((op) => ({
      _id: op._id,
      type: op.type,
      reference: op.reference,
      status: op.status,
      createdAt: op.createdAt,
    }));

    const normalizedProds = recentProducts.map((prod) => ({
      _id: prod._id,
      type: "NEW_PRODUCT",
      reference: prod.name,
      status: "ACTIVE",
      createdAt: prod.createdAt,
    }));

    // Merge & Sort
    const recentOperations = [...normalizedOps, ...normalizedProds]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    // --- Stock Movement Trends (Last 30 Days + 7 Days Prediction) ---
    const historyDays = 30; // Historical data
    const futureDays = 7;   // Predicted future days
    const trendStartDate = new Date();
    trendStartDate.setHours(0, 0, 0, 0);
    trendStartDate.setDate(trendStartDate.getDate() - (historyDays - 1));

    const stockMovementRaw = await Operation.aggregate([
      {
        $match: {
          createdAt: { $gte: trendStartDate },
          status: "DONE",
          owner: req.user._id,
        },
      },
      { $unwind: "$lines" },
      {
        $project: {
          type: 1,
          quantity: {
            $cond: {
              if: { $gt: ["$lines.doneQuantity", 0] },
              then: "$lines.doneQuantity",
              else: { $ifNull: ["$lines.demandQuantity", 0] }
            }
          },
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
      },
      {
        $group: {
          _id: { date: "$date", type: "$type" },
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    console.log("📊 Stock Movement Raw Data:", stockMovementRaw);

    const stockMovementMap = stockMovementRaw.reduce((acc, item) => {
      const dateKey = item._id.date;
      if (!acc[dateKey]) {
        acc[dateKey] = {
          receipts: 0,
          deliveries: 0,
          internalTransfers: 0,
          adjustments: 0,
        };
      }

      switch (item._id.type) {
        case "RECEIPT":
          acc[dateKey].receipts = item.totalQuantity;
          break;
        case "DELIVERY":
          acc[dateKey].deliveries = item.totalQuantity;
          break;
        case "INTERNAL_TRANSFER":
          acc[dateKey].internalTransfers = item.totalQuantity;
          break;
        case "ADJUSTMENT":
          acc[dateKey].adjustments = item.totalQuantity;
          break;
      }
      return acc;
    }, {});

    // Generate historical data array
    const stockMovements = Array.from({ length: historyDays }).map((_, index) => {
      const current = new Date(trendStartDate);
      current.setDate(trendStartDate.getDate() + index);
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const movement = stockMovementMap[dateKey] || {
        receipts: 0,
        deliveries: 0,
        internalTransfers: 0,
        adjustments: 0,
      };
      return {
        date: dateKey,
        ...movement,
        isPrediction: false,
      };
    });

    // Calculate averages for prediction (based on last 14 days for better accuracy)
    const recentData = stockMovements.slice(-14);
    const dataLength = recentData.length || 1; // Prevent division by zero
    const avgReceipts = recentData.reduce((sum, d) => sum + (d.receipts || 0), 0) / dataLength;
    const avgDeliveries = recentData.reduce((sum, d) => sum + (d.deliveries || 0), 0) / dataLength;
    const avgTransfers = recentData.reduce((sum, d) => sum + (d.internalTransfers || 0), 0) / dataLength;
    const avgAdjustments = recentData.reduce((sum, d) => sum + (d.adjustments || 0), 0) / dataLength;

    // Add prediction for future days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 1; i <= futureDays; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const fYear = futureDate.getFullYear();
      const fMonth = String(futureDate.getMonth() + 1).padStart(2, '0');
      const fDay = String(futureDate.getDate()).padStart(2, '0');
      const dateKey = `${fYear}-${fMonth}-${fDay}`;

      // Add some variation to predictions (±20%)
      const variation = () => 0.8 + Math.random() * 0.4;

      stockMovements.push({
        date: dateKey,
        receipts: Math.round((avgReceipts || 0) * variation()),
        deliveries: Math.round((avgDeliveries || 0) * variation()),
        internalTransfers: Math.round((avgTransfers || 0) * variation()),
        adjustments: Math.round((avgAdjustments || 0) * variation()),
        isPrediction: true,
      });
    }

    const stats = {
      totalProducts,
      pendingReceipts,
      pendingDeliveries,
      internalTransfers,
      lowStockCount,
      lowStockItems: lowStockCount,
      outOfStockCount,
      recentOperations,
      stockMovements,
    };

    // 12. Calculate Financials (Manager Only)
    // Check if user exists and has role MANAGER
    if (req.user && req.user.role === "MANAGER") {
      const financialRaw = await Operation.aggregate([
        {
          $match: {
            createdAt: { $gte: trendStartDate },
            status: "DONE",
            type: "DELIVERY",
            owner: req.user._id, // Filter for manager's own operations
          },
        },
        { $unwind: "$lines" },
        {
          $lookup: {
            from: "products",
            localField: "lines.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            quantity: {
              $cond: {
                if: { $gt: ["$lines.doneQuantity", 0] },
                then: "$lines.doneQuantity",
                else: { $ifNull: ["$lines.demandQuantity", 0] }
              }
            },
            salesPrice: { $ifNull: ["$productDetails.salesPrice", 0] },
            costPrice: { $ifNull: ["$productDetails.costPrice", 0] },
          },
        },
        {
          $addFields: {
            lineRevenue: { $multiply: ["$quantity", "$salesPrice"] },
            lineCost: { $multiply: ["$quantity", "$costPrice"] },
          },
        },
        {
          $group: {
            _id: "$date",
            dailyRevenue: { $sum: "$lineRevenue" },
            dailyCost: { $sum: "$lineCost" },
          },
        },
        {
          $addFields: {
            dailyProfit: { $subtract: ["$dailyRevenue", "$dailyCost"] },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      console.log("💰 Financial Raw Data:", financialRaw);

      const financialMap = financialRaw.reduce((acc, item) => {
        acc[item._id] = {
          revenue: item.dailyRevenue,
          cost: item.dailyCost,
          profit: item.dailyProfit,
        };
        return acc;
      }, {});

      stats.financialTrends = Array.from({ length: historyDays }).map(
        (_, index) => {
          const current = new Date(trendStartDate);
          current.setDate(trendStartDate.getDate() + index);
          const year = current.getFullYear();
          const month = String(current.getMonth() + 1).padStart(2, '0');
          const day = String(current.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;

          const data = financialMap[dateKey] || {
            revenue: 0,
            cost: 0,
            profit: 0,
          };
          return {
            date: dateKey,
            ...data,
          };
        }
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Dashboard stats fetched successfully")
      );
  } catch (error) {
    console.error("🔥 Error fetching dashboard stats:", error);
    console.error("Stack:", error.stack);
    throw new ApiError(
      500,
      "Failed to fetch dashboard stats: " + error.message
    );
  }
});

export { getDashboardStats };

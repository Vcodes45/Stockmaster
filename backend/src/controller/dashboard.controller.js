import Product from "../models/product.model.js";
import Operation from "../models/operation.model.js";
import StockQuant from "../models/stockQuant.model.js";

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Products
    const totalProducts = await Product.countDocuments();

    // 2. Pending Receipts (Incoming)
    const pendingReceipts = await Operation.countDocuments({
      type: "RECEIPT",
      status: { $in: ["DRAFT", "READY"] },
    });

    // 3. Pending Deliveries (Outgoing)
    const pendingDeliveries = await Operation.countDocuments({
      type: "DELIVERY",
      status: { $in: ["DRAFT", "READY"] },
    });

    // 4. Low Stock Items (Complex Aggregation)
    // We need to compare current stock (StockQuant) with minStockLevel (Product)
    // This is a simplified check finding products with NO stock records or stock < 5 (placeholder)
    // Real implementation requires $lookup aggregation
    const lowStockCount = 0; // Placeholder for advanced aggregation

    res.status(200).json({
      totalProducts,
      pendingReceipts,
      pendingDeliveries,
      lowStockCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

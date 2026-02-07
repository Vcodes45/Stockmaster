import { Product } from "../models/product.model.js";
import { Location } from "../models/location.model.js";
import { Operation } from "../models/operation.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { StockLedger } from "../models/stockLedger.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    description,
    category,
    unitOfMeasure,
    minStockLevel,
    costPrice,
    salesPrice,
    initialStock,
    initialStockLocationId,
  } = req.body;

  if (!name || !sku || !category) {
    throw new ApiError(400, "Name, SKU, and category are required");
  }

  // Check if product with same SKU already exists
  const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
  if (existingProduct) {
    throw new ApiError(409, "Product with this SKU already exists");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create the Product
    const [newProduct] = await Product.create(
      [
        {
          name,
          sku: sku.toUpperCase(),
          description,
          category,
          unitOfMeasure: unitOfMeasure || "Units",
          minStockLevel: minStockLevel || 0,
          costPrice: costPrice || 0,
          salesPrice: salesPrice || 0,
        },
      ],
      { session }
    );

    // 2. Handle Initial Stock (If provided)
    if (initialStock && initialStock > 0 && initialStockLocationId) {
      // Find 'Inventory Loss' or 'Virtual' location for the source
      const virtualSource = await Location.findOne(
        { type: "INVENTORY_LOSS" },
        null,
        { session }
      );

      if (!virtualSource) {
        throw new ApiError(
          404,
          "Virtual source location (INVENTORY_LOSS) not found. Please create one first."
        );
      }

      // Verify destination location exists
      const destinationLocation = await Location.findById(
        initialStockLocationId,
        null,
        { session }
      );
      if (!destinationLocation) {
        throw new ApiError(404, "Destination location not found");
      }

      // Create adjustment operation and update stock directly
      const reference = `INV-ADJ-${sku.toUpperCase()}-INIT-${Date.now()}`;

      await Operation.create(
        [
          {
            reference,
            type: "ADJUSTMENT",
            sourceLocation: virtualSource._id,
            destinationLocation: initialStockLocationId,
            status: "DONE",
            lines: [
              {
                product: newProduct._id,
                demandQuantity: initialStock,
                doneQuantity: initialStock,
              },
            ],
          },
        ],
        { session }
      );

      // Update stock quantities
      await StockQuant.findOneAndUpdate(
        { product: newProduct._id, location: virtualSource._id },
        { $inc: { quantity: -initialStock } },
        { upsert: true, new: true, session }
      );

      await StockQuant.findOneAndUpdate(
        { product: newProduct._id, location: initialStockLocationId },
        { $inc: { quantity: initialStock } },
        { upsert: true, new: true, session }
      );

      // Create ledger entry
      await StockLedger.create(
        [
          {
            product: newProduct._id,
            quantity: initialStock,
            sourceLocation: virtualSource._id,
            destinationLocation: initialStockLocationId,
            operationReference: reference,
            date: new Date(),
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    const populatedProduct = await Product.findById(newProduct._id).populate(
      "category"
    );

    const productResponse = populatedProduct.toObject();
    productResponse.totalStock = initialStock || 0;

    return res
      .status(201)
      .json(
        new ApiResponse(201, productResponse, "Product created successfully")
      );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const getProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(query)
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();

  const productIds = products.map((product) => product._id);
  let stockTotals = [];

  if (productIds.length > 0) {
    stockTotals = await StockQuant.aggregate([
      { $match: { product: { $in: productIds } } },
      { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
    ]);
  }

  const stockMap = stockTotals.reduce((acc, item) => {
    acc[item._id.toString()] = item.totalQuantity;
    return acc;
  }, {});

  const productsWithStock = products.map((product) => ({
    ...product,
    totalStock: stockMap[product._id.toString()] || 0,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(200, productsWithStock, "Products fetched successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Get stock quantities across all locations
  const stockQuantities = await StockQuant.find({ product: id }).populate(
    "location"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { product, stockQuantities },
        "Product details fetched successfully"
      )
    );
});

export { createProduct, getProducts, getProductById };

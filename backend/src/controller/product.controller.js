import Product from "../models/product.model.js";
import Location from "../models/location.model.js";
import Operation from "../models/operation.model.js";

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      unitOfMeasure,
      initialStock,
      initialStockLocationId,
    } = req.body;

    // 1. Create the Product
    const newProduct = await Product.create({
      name,
      sku,
      category,
      unitOfMeasure,
    });

    // 2. Handle Initial Stock (If provided)
    if (initialStock && initialStock > 0 && initialStockLocationId) {
      // Find 'Inventory Loss' or 'Virtual' location for the source
      const virtualSource = await Location.findOne({ type: "INVENTORY_LOSS" });

      if (virtualSource) {
        await Operation.create({
          reference: `INV-ADJ-${sku}-INIT`,
          type: "ADJUSTMENT",
          sourceLocation: virtualSource._id,
          destinationLocation: initialStockLocationId,
          status: "DONE", // Auto-validate
          lines: [
            {
              product: newProduct._id,
              demandQuantity: initialStock,
              doneQuantity: initialStock,
            },
          ],
        });
        // NOTE: Ideally, you would call the 'validate' logic here to update StockQuant,
        // but for simplicity, we assume the Operations Validating logic handles it separately
        // or you trigger it manually.
      }
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

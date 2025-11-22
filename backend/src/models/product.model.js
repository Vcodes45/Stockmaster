import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true, // Stock Keeping Unit must be unique
      uppercase: true,
    },
    description: {
      type: String,
    },
    // RELATIONSHIP: Link to the Category Model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Must match the name in mongoose.model('Category'...)
      required: true,
    },
    unitOfMeasure: {
      type: String,
      required: true,
      default: "Units", // e.g., kg, meters, liters, box
    },
    minStockLevel: {
      type: Number,
      default: 0, // Used for Low Stock Alerts
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    salesPrice: {
      type: Number,
      default: 0,
    },
    // NOTE: Do not store "currentStock" here if you want multi-warehouse support.
  },
  { timestamps: true }
);

// Add index for efficient querying
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

export const Product = mongoose.model("Product", productSchema);

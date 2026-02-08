import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      uppercase: true,
    },
    description: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
      required: true,
    },
    unitOfMeasure: {
      type: String,
      required: true,
      default: "Units", 
    },
    minStockLevel: {
      type: Number,
      default: 0, 
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    salesPrice: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


productSchema.index({ name: 1 });
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ category: 1 });

export const Product = mongoose.model("Product", productSchema);

import mongoose, { Schema } from "mongoose";

const stockQuantSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    quantity: { 
      type: Number, 
      required: true, 
      default: 0 
    },
  },
  { timestamps: true }
);

// Composite index to ensure one record per product per location
stockQuantSchema.index({ product: 1, location: 1 }, { unique: true });

// Additional indexes for queries
stockQuantSchema.index({ quantity: 1 }); // For low stock queries

export const StockQuant = mongoose.model("StockQuant", stockQuantSchema);

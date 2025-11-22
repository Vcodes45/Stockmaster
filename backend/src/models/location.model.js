import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // e.g., "Main Warehouse", "Rack B", "Vendor Location"
    },
    type: {
      type: String,
      enum: ["INTERNAL", "CUSTOMER", "VENDOR", "INVENTORY_LOSS", "VIEW"],
      default: "INTERNAL",
      required: true,
      index: true,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);

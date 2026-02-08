import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);

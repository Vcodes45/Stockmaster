import mongoose, { Schema } from "mongoose";

const stockLedgerSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { 
    type: Number, 
    required: true 
  }, // Positive for add, negative for remove (conceptually)

  sourceLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  destinationLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },

  operationReference: { 
    type: String, 
    required: true 
  }, // Links back to WH/IN/001
  date: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

// Add indexes for efficient querying
stockLedgerSchema.index({ product: 1, date: -1 });
stockLedgerSchema.index({ operationReference: 1 });
stockLedgerSchema.index({ sourceLocation: 1 });
stockLedgerSchema.index({ destinationLocation: 1 });

export const StockLedger = mongoose.model("StockLedger", stockLedgerSchema);

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
  }, 

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
  }, 
  date: { 
    type: Date, 
    default: Date.now 
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });


stockLedgerSchema.index({ product: 1, date: -1 });
stockLedgerSchema.index({ operationReference: 1 });
stockLedgerSchema.index({ sourceLocation: 1 });
stockLedgerSchema.index({ destinationLocation: 1 });

export const StockLedger = mongoose.model("StockLedger", stockLedgerSchema);

import mongoose, { Schema } from "mongoose";

const operationLineSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  demandQuantity: {
    type: Number,
    required: true,
    min: [0, "Demand quantity cannot be negative"],
  }, 
  doneQuantity: {
    type: Number,
    default: 0,
    min: [0, "Done quantity cannot be negative"],
  },
});

const operationSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
    }, 
    type: {
      type: String,
      enum: ["RECEIPT", "DELIVERY", "INTERNAL_TRANSFER", "ADJUSTMENT"],
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
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

    scheduledDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["DRAFT", "READY", "DONE", "CANCELLED"],
      default: "DRAFT",
    },
    lines: [operationLineSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


operationSchema.index({ type: 1 });
operationSchema.index({ status: 1 });
operationSchema.index({ scheduledDate: 1 });
operationSchema.index({ reference: 1 }, { unique: true });

export const Operation = mongoose.model("Operation", operationSchema);

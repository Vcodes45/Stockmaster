import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["VENDOR", "CUSTOMER"], 
      required: true 
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

// Add index for efficient querying by type
contactSchema.index({ type: 1 });
contactSchema.index({ name: 1 });

export const Contact = mongoose.model("Contact", contactSchema);

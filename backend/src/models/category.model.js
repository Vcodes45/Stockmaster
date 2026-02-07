import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Add unique index
categorySchema.index({ name: 1 }, { unique: true });

export const Category = mongoose.model("Category", categorySchema);

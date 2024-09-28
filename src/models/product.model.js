import mongoose, { Schema } from "mongoose";

const productSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Password is required"],
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: [{ type: String }],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "published"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

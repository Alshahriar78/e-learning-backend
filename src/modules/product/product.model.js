// src/modules/product/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    fileUrl: { type: String, required: true }, // download link / storage URL
    imageUrl: { type: String }, // product image URL
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

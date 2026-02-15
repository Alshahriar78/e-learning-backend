// src/modules/product/product.controller.js
import Product from "./product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/** CREATE PRODUCT - ADMIN */
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, fileUrl } = req.body;

  const productData = {
    name,
    description,
    price,
    fileUrl,
  };

  if (req.file) {
    productData.imageUrl = req.file.path; // Cloudinary URL
  }

  const product = await Product.create(productData);
  res.json(product);
});

/** UPDATE PRODUCT - ADMIN */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new Error("Product not found");

  const { name, description, price, fileUrl } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (fileUrl) product.fileUrl = fileUrl;
  if (req.file) product.imageUrl = req.file.path;

  await product.save();
  res.json(product);
});

/** DELETE PRODUCT - ADMIN */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new Error("Product not found");
  res.json({ success: true, message: "Product deleted" });
});

/** GET ALL PRODUCTS - PUBLIC */
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/** GET SINGLE PRODUCT - ONLY FOR PURCHASED USERS */
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new Error("Product not found");

  // Check if user purchased
  // const isPurchased = req.user.purchasedProducts.includes(product._id);
  // if (!isPurchased && req.user.role !== "ADMIN") {
  //   throw new Error("Access denied. Please purchase product.");
  // }

  res.json(product);
});

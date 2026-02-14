// src/modules/product/product.routes.js
import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
} from "./product.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";
import  upload  from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", protect, getProduct);

// Admin routes
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // product image field
  createProduct
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;

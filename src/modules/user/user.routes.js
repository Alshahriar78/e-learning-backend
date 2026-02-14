// src/modules/user/user.routes.js
import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getMyCourses,
  getMyProducts,
  getAllUsers,
  updateUserRole,
} from "./user.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Logged-in user routes
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/me/courses", protect, getMyCourses);
router.get("/me/products", protect, getMyProducts);

// Admin routes
router.get("/", protect, adminOnly, getAllUsers);
router.patch("/:id/role", protect, adminOnly, updateUserRole);

export default router;

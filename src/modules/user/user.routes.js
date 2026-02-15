// src/modules/user/user.routes.js
import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getMyCourses,
  getMyProducts,
  getAllUsers,
  updateUserRole,
  getUserDashboard
} from "./user.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Logged-in user routes
router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);
router.get("/me/courses", protect, getMyCourses);
router.get("/me/products", protect, getMyProducts);

// Admin routes
router.get("/", protect, adminOnly, getAllUsers);
router.patch("/:id/role", protect, adminOnly, updateUserRole);

// Dashboard for logged-in user
router.get("/dashboard", protect, getUserDashboard); 

export default router;

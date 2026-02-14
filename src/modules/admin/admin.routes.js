// src/modules/admin/admin.routes.js
import express from "express";
import {
  getDashboardStats,
  getRecentUsers,
  getRecentOrders,
  getCourseStats,
  getProductStats,
} from "./admin.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// Lists
router.get("/recent-users", protect, adminOnly, getRecentUsers);
router.get("/recent-orders", protect, adminOnly, getRecentOrders);

// Analytics
router.get("/course-stats", protect, adminOnly, getCourseStats);
router.get("/product-stats", protect, adminOnly, getProductStats);

export default router;

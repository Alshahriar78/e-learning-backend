// src/modules/order/order.routes.js
import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  approveOrder,
} from "./order.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/approve", protect, adminOnly, approveOrder);

export default router;

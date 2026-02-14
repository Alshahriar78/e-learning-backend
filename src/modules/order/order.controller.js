// src/modules/order/order.controller.js
import Order from "./order.model.js";
import Product from "../product/product.model.js";
import User from "../user/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/** CREATE ORDER - USER */
/** CREATE ORDER - USER */
export const createOrder = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!products || products.length === 0) {
    throw new Error("No products selected");
  }

  const productDocs = await Product.find({ _id: { $in: products } });
  if (productDocs.length === 0) {
    throw new Error("Invalid products");
  }

  const totalAmount = productDocs.reduce((sum, p) => sum + p.price, 0);

  const order = await Order.create({
    user: req.user._id,
    products,
    totalAmount,
    status: "PENDING",
  });

  res.status(201).json({
    success: true,
    message: "Order created. Waiting for admin approval.",
    order,
  });
});

/** APPROVE ORDER - ADMIN */
export const approveOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found");

  if (order.status === "PAID") {
    throw new Error("Order already approved");
  }

  // Update order status
  order.status = "PAID";
  await order.save();

  // Grant product access to user
  await User.findByIdAndUpdate(order.user, {
    $addToSet: {
      purchasedProducts: { $each: order.products },
    },
  });

  res.json({
    success: true,
    message: "Order approved successfully",
    order,
  });
});


/** GET USER ORDERS */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("products");
  res.json(orders);
});

/** GET ALL ORDERS - ADMIN */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("products user", "name email");
  res.json(orders);
});

// src/modules/admin/admin.controller.js
import User from "../user/user.model.js";
import Course from "../course/course.model.js";
import Product from "../product/product.model.js";
import Order from "../order/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * GET /api/admin/dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCourses,
    totalProducts,
    totalOrders,
    revenueResult,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments({ status: "PAID" }),
    Order.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]),
  ]);

  res.json({
    totalUsers,
    totalCourses,
    totalProducts,
    totalOrders,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
  });
});

/**
 * GET /api/admin/recent-users
 */
export const getRecentUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("-password");

  res.json(users);
});

/**
 * GET /api/admin/recent-orders
 */
export const getRecentOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email")
    .populate("products", "name price");

  res.json(orders);
});

/**
 * GET /api/admin/course-stats
 */
export const getCourseStats = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .select("title students price isFree");

  const stats = courses.map(course => ({
    courseId: course._id,
    title: course.title,
    students: course.students.length,
    revenue: course.isFree
      ? 0
      : course.students.length * course.price,
  }));

  res.json(stats);
});

/**
 * GET /api/admin/product-stats
 */
export const getProductStats = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: "PAID" }).populate("products");

  const productMap = {};

  orders.forEach(order => {
    order.products.forEach(product => {
      if (!productMap[product._id]) {
        productMap[product._id] = {
          productId: product._id,
          name: product.name,
          sold: 0,
          revenue: 0,
        };
      }
      productMap[product._id].sold += 1;
      productMap[product._id].revenue += product.price;
    });
  });

  res.json(Object.values(productMap));
});

// src/modules/user/user.controller.js
import User from "./user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * GET /api/users/me
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

/**
 * PUT /api/users/me
 */
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (password) user.password = password;

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
  });
});

/**
 * GET /api/users/me/courses
 */
export const getMyCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("enrolledCourses");

  res.json(user.enrolledCourses);
});

/**
 * GET /api/users/me/products
 */
export const getMyProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("purchasedProducts");

  res.json(user.purchasedProducts);
});

/**
 * ADMIN: GET /api/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/**
 * ADMIN: PATCH /api/users/:id/role
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["USER", "ADMIN"].includes(role)) {
    throw new Error("Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json(user);
});

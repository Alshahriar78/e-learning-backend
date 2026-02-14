import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourse,
} from "./course.controller.js";
import { adminOnly } from "../../middlewares/role.middleware.js";
import { protect} from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * ADMIN ROUTES
 */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("thumbnail"),
  createCourse
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  upload.single("thumbnail"),
  updateCourse
);

router.delete("/:id", protect, adminOnly, deleteCourse);

/**
 * PUBLIC / USER ROUTES
 */
router.get("/", getCourses);
router.get("/:id", protect, getCourse);

export default router;

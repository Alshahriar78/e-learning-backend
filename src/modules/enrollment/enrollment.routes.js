import express from "express";
import {
  enrollCourse,
  markEnrollmentPaid,
  getMyEnrollments,
  checkEnrollmentStatus,
  getAllEnrollments,
} from "./enrollment.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * USER
 */
router.post("/", protect, enrollCourse);
router.get("/my-courses", protect, getMyEnrollments);
router.get("/status/:courseId", protect, checkEnrollmentStatus);

/**
 * ADMIN / PAYMENT SYSTEM
 */
router.patch("/:id/status", protect, adminOnly, markEnrollmentPaid);
router.get("/", protect, adminOnly, getAllEnrollments);

export default router;

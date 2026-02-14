import Enrollment from "./enrollment.model.js";
import Course from "../course/course.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * ENROLL IN A COURSE (USER)
 * status = PENDING (after payment → PAID)
 */
export const enrollCourse = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const existingEnrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (existingEnrollment) {
    return res.status(400).json({
      message: "Already enrolled or enrollment exists",
      enrollment: existingEnrollment,
    });
  }

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    status: "PENDING",
  });

  res.status(201).json(enrollment);
});

/**
 * CONFIRM PAYMENT (ADMIN / PAYMENT WEBHOOK)
 */
export const markEnrollmentPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const enrollment = await Enrollment.findById(id);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }

  enrollment.status = "PAID";
  enrollment.paidAt = new Date();
  await enrollment.save();

  res.json({
    message: "Enrollment marked as PAID",
    enrollment,
  });
});

/**
 * GET MY ENROLLED COURSES (USER)
 */
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({
    user: req.user._id,
    status: "PAID",
  }).populate("course");

  res.json(enrollments);
});

/**
 * CHECK ENROLLMENT STATUS (USER)
 */
export const checkEnrollmentStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: courseId,
  });

  res.json({
    enrolled: !!enrollment,
    status: enrollment?.status || null,
  });
});

/**
 * GET ALL ENROLLMENTS (ADMIN)
 */
export const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate("user", "name email")
    .populate("course", "title price");

  res.json(enrollments);
});

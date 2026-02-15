import Course from "./course.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/** CREATE COURSE - ADMIN */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, isFree, category } = req.body;

  const course = await Course.create({
    title,
    description,
    price,
    isFree,
    category,
    thumbnail: req.file?.path ,
  });

  res.status(201).json(course);
});

/** UPDATE COURSE - ADMIN */
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new Error("Course not found");

  Object.assign(course, req.body);

  if (req.file) course.thumbnail = req.file.path;

  await course.save();
  res.json(course);
});

/** DELETE COURSE - ADMIN */
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new Error("Course not found");

  res.json({ success: true, message: "Course deleted" });
});

/** GET ALL COURSES - PUBLIC */
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({})
    .populate("category", "name slug"); // only what you need

  res.json(courses);
});


/** GET SINGLE COURSE (PAID CHECK) */
export const getCourse = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const course = await Course.findById(id)
  .populate("category");

  if (!course) throw new Error("Course not found");

  // Free course → allowed
  if (course.isFree) return res.json(course);

  

  res.json(course);
});

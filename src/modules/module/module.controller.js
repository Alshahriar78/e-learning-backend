import Module from "./module.model.js";
import Course from "../course/course.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * CREATE MODULE (ADMIN / INSTRUCTOR)
 */

export const createModule = asyncHandler(async (req, res) => {
  const { title, description, course, order, isPublished } = req.body;

  if (!title || !course) {
    return res.status(400).json({ message: "Title and course are required" });
  }

  // Check course exists
  const courseExists = await Course.findById(course);
  if (!courseExists) {
    return res.status(404).json({ message: "Course not found" });
  }

  const module = await Module.create({
    title,
    description,
    course,
    order,
    isPublished,
  });

  res.status(201).json(module);
});

/**
 * GET ALL MODULES OF A COURSE (USER / ADMIN)
 */
export const getModulesByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const modules = await Module.find({ course: courseId })
    .sort({ order: 1 })
    .populate("course", "title");

  res.json(modules);
});

export const getAllModules = asyncHandler(async (req, res) => {
  // Populate the 'course' field from Course collection
  const modules = await Module.find()
    .populate("course", "title description") // fetch only 'name' and 'description'
    .sort({ order: 1 }); // optional: sort modules by order

  // Map response to include only required fields
  const response = modules.map(mod => ({
    id:mod._id,
    title: mod.title,
    description: mod.description,
    course: mod.course ? {
      id: mod.course._id,
      name: mod.course.title,
      description: mod.course.description
    } : null,
  }));

  res.json(response);
});
/**
 * GET SINGLE MODULE
 */
export const getModuleById = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id).populate(
    "course",
    "title"
  );

  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  res.json(module);
});

/**
 * UPDATE MODULE (ADMIN / INSTRUCTOR)
 */
export const updateModule = asyncHandler(async (req, res) => {
  const { title, description, order, isPublished } = req.body;

  const module = await Module.findById(req.params.id);

  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  if (title !== undefined) module.title = title;
  if (description !== undefined) module.description = description;
  if (order !== undefined) module.order = order;
  if (isPublished !== undefined) module.isPublished = isPublished;

  const updatedModule = await module.save();
  res.json(updatedModule);
});

/**
 * DELETE MODULE (ADMIN)
 */
export const deleteModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  await module.deleteOne();
  res.json({ message: "Module deleted successfully" });
});

/**
 * PUBLISH / UNPUBLISH MODULE
 */
export const togglePublishModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  module.isPublished = !module.isPublished;
  await module.save();

  res.json({
    message: `Module ${
      module.isPublished ? "published" : "unpublished"
    } successfully`,
    module,
  });
});

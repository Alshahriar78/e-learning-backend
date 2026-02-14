import Category from "./category.model.js";
import slugify from "slugify";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * CREATE CATEGORY (ADMIN)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  console.log(req.body)

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const slug = slugify(name, { lower: true, strict: true });

  const categoryExists = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (categoryExists) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = await Category.create({
    name,
    description,
    slug,
    isActive,
  });

  res.status(201).json(category);
});

/**
 * GET ALL CATEGORIES (ADMIN / USER)
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

/**
 * GET SINGLE CATEGORY
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(category);
});

/**
 * UPDATE CATEGORY (ADMIN)
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true });
  }

  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

/**
 * DELETE CATEGORY (ADMIN)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted successfully" });
});

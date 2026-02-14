import express from "express";
import {
  createModule,
  getModulesByCourse,
  getModuleById,
  updateModule,
  deleteModule,
  togglePublishModule,
  getAllModules,
} from "./module.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * ADMIN / INSTRUCTOR
 */
router.post("/", protect, adminOnly, createModule);
router.patch("/:id", protect, adminOnly, updateModule);
router.delete("/:id", protect, adminOnly, deleteModule);
router.patch("/:id/publish", protect, adminOnly, togglePublishModule);

/**
 * USER / ADMIN
 */
router.get("/",protect, adminOnly, getAllModules);
router.get("/course/:courseId", protect, getModulesByCourse);
router.get("/:id", protect, getModuleById);

export default router;

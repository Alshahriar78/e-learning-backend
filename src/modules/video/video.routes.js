import express from "express";
import {
  createVideo,
  getVideosByModule,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllVideos,
} from "./video.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * ADMIN
 */
router.post("/", protect, adminOnly, createVideo);
router.put("/:id", protect, adminOnly, updateVideo);
router.delete("/:id", protect, adminOnly, deleteVideo);
router.get("/", protect, adminOnly, getAllVideos);

/**
 * USER (PAID ACCESS)
 */
router.get("/module/:moduleId", protect, getVideosByModule);
router.get("/:id", protect, getVideoById);

export default router;

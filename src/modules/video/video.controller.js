import Video from "./video.model.js";
import Module from "../module/module.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * CREATE VIDEO (ADMIN)
 */
export const createVideo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    module,
    videoUrl,
    duration,
    order,
    thumbnail,
    isPreview,
    resources,
  } = req.body;

  if (!title || !module || !videoUrl) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const moduleExists = await Module.findById(module).populate("course");
  if (!moduleExists) {
    return res.status(404).json({ message: "Module not found" });
  }

  const video = await Video.create({
    title,
    description,
    module,
    videoUrl,
    duration,
    order,
    thumbnail,
    isPreview,
    resources,
  });

  res.status(201).json(video);
});


export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .populate({
      path: "module",
      select: "title description order",
      populate: {
        path: "course",
        select: "title description price isFree",
        populate: {
          path: "category",
          select: "name slug",
        },
      },
    })
    .sort({ order: 1 });

  res.json(videos);
});

/**
 * GET VIDEOS BY MODULE
 * - Preview videos: anyone logged in
 * - Paid videos: only PAID enrolled users
 */
export const getVideosByModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user._id;

  const module = await Module.findById(moduleId).populate("course");
  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }

  // Check enrollment
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: module.course._id,
    status: "PAID",
  });

  let filter = { module: moduleId };

  // If not enrolled → only preview videos
  if (!enrollment) {
    filter.isPreview = true;
  }

  const videos = await Video.find(filter).sort({ order: 1 });

  res.json({
    enrolled: !!enrollment,
    videos,
  });
});

/**
 * GET SINGLE VIDEO
 * - Preview: allowed
 * - Non-preview: only PAID users
 */
export const getVideoById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const video = await Video.findById(req.params.id).populate({
    path: "module",
    populate: { path: "course" },
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  // Preview video is free
  if (video.isPreview) {
    return res.json(video);
  }

  // Check PAID enrollment
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: video.module.course._id,
    status: "PAID",
  });

  if (!enrollment) {
    return res.status(403).json({
      message: "Access denied. Please enroll to watch this video.",
    });
  }

  res.json(video);
});

/**
 * UPDATE VIDEO (ADMIN)
 */
export const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  Object.assign(video, req.body);
  await video.save();

  res.json(video);
});

/**
 * DELETE VIDEO (ADMIN)
 */
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  await video.deleteOne();
  res.json({ message: "Video deleted successfully" });
});

// src/modules/video/video.model.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    module: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Module", 
      required: true 
    },
    videoUrl: { type: String, required: true },
    duration: { type: Number }, // Duration in seconds
    order: { type: Number, default: 0 }, // For ordering videos within a module
    thumbnail: { type: String },
    isPreview: { type: Boolean, default: false }, // Free preview video
    resources: [{ 
      title: String, 
      url: String, 
      type: String // pdf, doc, link, etc.
    }],
  },
  { timestamps: true }
);

// Index for efficient querying
videoSchema.index({ module: 1, order: 1 });

export default mongoose.model("Video", videoSchema);
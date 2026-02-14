// src/modules/module/module.model.js
import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Course", 
      required: true 
    },
    order: { type: Number, default: 0 }, // For ordering modules within a course
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for efficient querying
moduleSchema.index({ course: 1, order: 1 });

export default mongoose.model("Module", moduleSchema);
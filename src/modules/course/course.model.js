// src/modules/course/course.model.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    thumbnail: { type: String }, 
    isPublished: { type: Boolean, default: false },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
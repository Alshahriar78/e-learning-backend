// src/middlewares/upload.middleware.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "elearning";
    if (file.mimetype.startsWith("image/")) folder += "/images";
    else if (file.mimetype.startsWith("video/")) folder += "/videos";

    return {
      folder,
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

 const upload = multer({ storage });

 export default upload;

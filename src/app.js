import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import courseRoutes from "./modules/course/course.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./modules/user/user.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import moduleRoutes from "./modules/module/module.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import videoRoutes from "./modules/video/video.routes.js";
import enrollmentRoutes from "./modules/enrollment/enrollment.routes.js";




const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://e-learning-admin-1ylq.onrender.com/",
  "https://your-frontend-domain.com"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/enrollments", enrollmentRoutes);




app.use(errorHandler);

export default app;

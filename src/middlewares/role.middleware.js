// src/middlewares/role.middleware.js
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    throw new Error("Admin only access");
  }
  next();
};

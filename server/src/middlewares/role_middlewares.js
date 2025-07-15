import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin is allowed to perform this action");
  }
  next();
};

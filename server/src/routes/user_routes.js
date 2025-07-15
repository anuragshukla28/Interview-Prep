import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserAvatar
} from "../controllers/user_ctrl.js";
import { verifyToken } from "../middlewares/auth_middlewares.js";
import {upload } from "../middlewares/multer_middlewares.js"
import { updateProfile } from "../controllers/user_ctrl.js";

const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", upload.single("avatar"), registerUser);

// POST /api/v1/auth/login
router.post("/login", loginUser);

// POST /api/v1/auth/logout
router.post("/logout", verifyToken, logoutUser);

// GET /api/v1/auth/me
router.get("/me", verifyToken, getCurrentUser);

router.post("/update-avatar", verifyToken, upload.single("avatar"), updateUserAvatar);

router.put("/profile", verifyToken, updateProfile);

export default router;

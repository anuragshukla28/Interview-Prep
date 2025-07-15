import express from "express";
import { updateProgress, getUserProgress } from "../controllers/progress_ctrl.js";
import { verifyToken } from "../middlewares/auth_middlewares.js";

const router = express.Router();

router.post("/", verifyToken, updateProgress);
router.get("/", verifyToken, getUserProgress);

export default router;

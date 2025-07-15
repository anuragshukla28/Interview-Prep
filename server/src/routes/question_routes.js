import express from "express";
import {
  createQuestion,
  getQuestions,
  markSolved,
  unmarkSolved,
} from "../controllers/question_ctrl.js";
import { verifyToken } from "../middlewares/auth_middlewares.js";
import { isAdmin } from "../middlewares/role_middlewares.js";

const router = express.Router();

// Admin can add
router.post("/", verifyToken, isAdmin, createQuestion);

// Anyone can view
router.get("/", verifyToken,getQuestions);

// Authenticated users can mark/unmark
router.post("/:id/solve", verifyToken, markSolved);
router.post("/:id/unsolve", verifyToken, unmarkSolved);

export default router;

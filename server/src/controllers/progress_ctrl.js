import { Progress } from "../models/progress_models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Update progress
export const updateProgress = asyncHandler(async (req, res) => {
  const { questionId, status } = req.body;

  if (!questionId || !status) {
    throw new ApiError(400, "Question ID and status are required");
  }

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, question: questionId },
    { status, lastUpdated: new Date() },
    { upsert: true, new: true }
  );

  res.status(200).json(new ApiResponse(200, progress, "Progress updated"));
});

// Get all progress for user
export const getUserProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.find({ user: req.user._id }).populate("question");
  res.status(200).json(new ApiResponse(200, progress, "Progress fetched"));
});

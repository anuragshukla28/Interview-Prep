import { Question } from "../models/questions_models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add new question (Admin)
export const createQuestion = asyncHandler(async (req, res) => {
  const { title, link, platform, tags } = req.body;

  if (!title || !link || !platform) {
    throw new ApiError(400, "All fields are required");
  }

  const parsedTags = Array.isArray(tags)
    ? tags
    : tags?.split(",").map((tag) => tag.trim()).filter(Boolean);

  const question = await Question.create({
    title,
    link,
    platform,
    tags: parsedTags,
  });

  res
    .status(201)
    .json(new ApiResponse(201, question, "Question added successfully"));
});


// Get all questions
export const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find();
  res.status(200).json(new ApiResponse(200, questions));
});

// Mark as solved
export const markSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const alreadySolved = user.solvedQuestions.some(
    (qid) => qid.toString() === id
  );

  if (!alreadySolved) {
    user.solvedQuestions.push(id);
    await user.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Marked as solved"));
});

// Unmark
export const unmarkSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  user.solvedQuestions = user.solvedQuestions.filter((qid) => qid.toString() !== id);
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Unmarked as solved"));
});
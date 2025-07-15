import { Resource } from "../models/resource_models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Add resource (admin)
export const addResource = asyncHandler(async (req, res) => {
  const { title, type, url } = req.body;

  if (!title || !type || !url) {
    throw new ApiError(400, "All fields are required");
  }

  const resource = await Resource.create({
    title,
    type,
    url,
    description: req.body.description || "",
    tags: req.body.tags || [],
    addedBy: req.user._id
  });

  res.status(201).json(new ApiResponse(201, resource, "Resource added successfully"));
});
// Get all resources
export const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find();
  res.status(200).json(new ApiResponse(200, resources));
});

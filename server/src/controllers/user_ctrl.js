import jwt from 'jsonwebtoken'
import { User } from "../models/user_models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import{uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js";

// @desc    Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const avatarLocalPath = req.file?.path;

  if (!fullName || !email || !password || !avatarLocalPath) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const avatarCloud = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarCloud?.url) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.create({ fullName, email, password, avatar: avatarCloud.url });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(new ApiResponse(201, { user, accessToken }, "User registered successfully"));
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set accessToken in cookies (for protected routes)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax", // "None" if using HTTPS and cross-site
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set refreshToken
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user, accessToken }, "Login successful"));
});

// @desc    Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken");

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});


// @desc    Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, "User fetched"));
});


export const updateUserAvatar = asyncHandler(async (req,res)=>{
  const avatarLocalPath= req.file?.path
 
  if(!avatarLocalPath){
   throw new ApiError(400,"File is required");
  }
  const avatar=await uploadOnCloudinary(avatarLocalPath)
 
  if(!avatar.url){
   throw new ApiError(400,"Something Went Wrong while uploading avatar");
  }
 
  const user = await User.findByIdAndUpdate(
   req?.user._id,
   {
     $set:{
       avatar:avatar.url
     }
   },{
     new:true
   }
  ).select("-password -refreshToken")
 
  res.status(200).json(new ApiResponse(200,user,"Avatar updated Successfully"))
 
 
 })

 // @desc Update user profile info
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bio, github, linkedin } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { bio, github, linkedin },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated"));
});

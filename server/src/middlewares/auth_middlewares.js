import  jwt  from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user_models.js"
import {asyncHandler} from "../utils/asyncHandler.js"


export const verifyToken=asyncHandler(async (req, _,next)=>{
    const token=req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token){
        throw new ApiError(401,"Unauthorized")
    }

    try {
   const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

   const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
   if(!user){
    throw new ApiError(401,"Unauthorized")
   }

   req.user=user
   console.log("Cookies received:", req.cookies);
   next()

    } catch (error) {
        throw new ApiError (401,error?.message || "Invalid Access Token")
        
    }

})
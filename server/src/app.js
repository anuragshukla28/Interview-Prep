import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import cookieParser from "cookie-parser";

import { resourceRoutes } from "./routes/resource_routes.js";
import authRoutes from "./routes/user_routes.js";
import questionRoutes from "./routes/question_routes.js";
import progressRoutes from "./routes/progress_routes.js";

dotenv.config();

const app =express()

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials: true,
    })
)

//common middleware
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/progress", progressRoutes);






export {app}
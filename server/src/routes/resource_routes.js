// src/routes/resource_routes.js
import express from "express";
import { addResource, getResources } from "../controllers/resource_ctrl.js";
import { verifyToken } from "../middlewares/auth_middlewares.js";
import { isAdmin } from "../middlewares/role_middlewares.js";

const router = express.Router();

// Add resource (admin)
router.post("/", verifyToken, isAdmin, addResource);

// Get all
router.get("/",verifyToken, getResources);

// ✅ Named export
export const resourceRoutes = router;

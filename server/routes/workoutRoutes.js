import express from "express";

import { getWorkouts } from "../controllers/workoutController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getWorkouts);

export default router;
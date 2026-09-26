
import express from "express";

import {
  getWorkouts,
  getWorkoutById,
  getExercises,
  getExerciseById,
} from "../controllers/workoutController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getWorkouts);

router.get(
  "/exercises",
  authMiddleware,
  getExercises
);

router.get(
  "/exercises/:id",
  authMiddleware,
  getExerciseById
);

router.get(
  "/:id",
  authMiddleware,
  getWorkoutById
);

export default router;

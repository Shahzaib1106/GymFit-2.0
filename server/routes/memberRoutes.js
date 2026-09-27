import express from "express";

import {
  getMyProfile,
  getDashboard,
  startWorkout,
  completeWorkout,
} from "../controllers/memberController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  getMyProfile
);

router.get(
  "/dashboard",
  authMiddleware,
  getDashboard
);

router.post(
  "/workouts/start",
  authMiddleware,
  startWorkout
);

router.patch(
  "/workouts/:logId/complete",
  authMiddleware,
  completeWorkout
);

export default router;
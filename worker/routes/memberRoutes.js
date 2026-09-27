import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getDashboard,
  startWorkout,
  completeWorkout,
} from "../controllers/memberController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getMyProfile);

router.patch("/profile", updateMyProfile);

router.patch(
  "/password",
  changeMyPassword
);

router.get(
  "/dashboard",
  getDashboard
);

router.post(
  "/workouts/start",
  startWorkout
);

router.patch(
  "/workouts/:logId/complete",
  completeWorkout
);

export default router;

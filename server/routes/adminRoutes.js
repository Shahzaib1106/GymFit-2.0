import express from "express";

import {
  getDashboard,
  getMembers,
  updateMemberStatus,
  deleteMember,
  getWorkoutLogs,
  getAdminWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/adminController.js";

import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getDashboard);

router.get("/members", getMembers);

router.patch(
  "/members/:id/status",
  updateMemberStatus
);

router.delete(
  "/members/:id",
  deleteMember
);

router.get("/workouts", getAdminWorkouts);

router.post("/workouts", createWorkout);

router.patch(
  "/workouts/:id",
  updateWorkout
);

router.delete(
  "/workouts/:id",
  deleteWorkout
);

router.get(
  "/workout-logs",
  getWorkoutLogs
);

export default router;
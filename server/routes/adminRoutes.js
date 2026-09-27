import express from "express";

import {
  getDashboard,
  getMembers,
  getWorkoutLogs,
} from "../controllers/adminController.js";

import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getDashboard);
router.get("/members", getMembers);
router.get("/workout-logs", getWorkoutLogs);

export default router;
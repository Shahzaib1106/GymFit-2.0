import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getDashboard,
} from "../controllers/memberController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getMyProfile);
router.patch("/profile", updateMyProfile);
router.patch("/password", changeMyPassword);
router.get("/dashboard", getDashboard);

export default router;

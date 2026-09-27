
import express from "express";

import {
  getMyProfile,
  getDashboard,
} from "../controllers/memberController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
GET /api/member/profile
*/
router.get(
  "/profile",
  authMiddleware,
  getMyProfile
);

/*
GET /api/member/dashboard
*/
router.get(
  "/dashboard",
  authMiddleware,
  getDashboard
);

export default router;

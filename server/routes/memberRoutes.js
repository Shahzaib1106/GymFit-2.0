import express from "express";

import { getMyProfile } from "../controllers/memberController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getMyProfile);

export default router;
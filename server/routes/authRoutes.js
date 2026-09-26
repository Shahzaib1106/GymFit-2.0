import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
============================================================
PUBLIC AUTH ROUTES
============================================================
*/

router.post("/register", register);

router.post("/login", login);

/*
============================================================
PROTECTED AUTH ROUTES
============================================================
*/

router.get("/me", authMiddleware, getMe);

export default router;
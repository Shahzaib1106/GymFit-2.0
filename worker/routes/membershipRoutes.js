import express from "express";

import {
  getMembershipPlans,
  getMyMembership,
  subscribeMembership,
  getPaymentHistory,
} from "../controllers/membershipController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/plans", getMembershipPlans);
router.get("/my", getMyMembership);
router.post("/subscribe", subscribeMembership);
router.get("/payments", getPaymentHistory);

export default router;


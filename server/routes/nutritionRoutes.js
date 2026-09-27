import express from "express";

import {
  getNutritionLogs,
  createNutritionLog,
  deleteNutritionLog,
} from "../controllers/nutritionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNutritionLogs);

router.post("/", createNutritionLog);

router.delete("/:id", deleteNutritionLog);

export default router;
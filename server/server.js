/* global process */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import memberRoutes from "./routes/memberRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

/*
============================================================
MIDDLEWARE
============================================================
*/

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
============================================================
ROOT
============================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GymFit 2.0 API is running",
    version: "1.0.0",
  });
});

/*
============================================================
HEALTH CHECK
============================================================
*/

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.json({
      success: true,
      message: "API and database are working",
      database: "PostgreSQL",
      time: result.rows[0].current_time,
    });
  } catch (error) {
    console.error(
      "Database health check failed:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/*
============================================================
AUTH ROUTES
============================================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/workouts", workoutRoutes);
/*
============================================================
404 HANDLER
============================================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
============================================================
GLOBAL ERROR HANDLER
============================================================
*/

app.use((error, req, res) => {
  console.error("Server error:", error);

  res.status(error.status || 500).json({
    success: false,
    message:
      error.message || "Internal server error",
  });
});

/*
============================================================
START SERVER
============================================================
*/

app.listen(PORT, () => {
  console.log(`
========================================
  GymFit 2.0 Backend
========================================
  Server:  http://localhost:${PORT}
  Health:  http://localhost:${PORT}/api/health
  Auth:    http://localhost:${PORT}/api/auth
========================================
  `);
});
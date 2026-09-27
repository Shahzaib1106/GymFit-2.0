import "dotenv/config";
import process from "node:process";
import cors from "cors";
import express from "express";

import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GymFit 2.0 Backend is running.",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      success: true,
      message: "GymFit 2.0 API is healthy.",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
    path: req.originalUrl,
  });
});

app.use((err, req, res) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("PostgreSQL database connected");

    app.listen(PORT, () => {
      console.log("========================================");
      console.log("  GymFit 2.0 Backend");
      console.log("========================================");
      console.log(`  Server:  http://localhost:${PORT}`);
      console.log(`  Health:  http://localhost:${PORT}/api/health`);
      console.log(`  Auth:    http://localhost:${PORT}/api/auth`);
      console.log(`  Member:  http://localhost:${PORT}/api/member`);
      console.log(`  Workout: http://localhost:${PORT}/api/workouts`);
      console.log(`  Admin:   http://localhost:${PORT}/api/admin`);
      console.log("========================================");
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
};

startServer();
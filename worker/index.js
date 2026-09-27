import express from "express";
import { httpServerHandler } from "cloudflare:node";

import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";

const app = express();

const allowedOrigins = [
  "https://gymfit-2-0.pages.dev",
  "https://f2fc7e2e.gymfit-2-0.pages.dev",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  next();
});

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    system: "GymFit 2.0 API",
    status: "online",
    platform: "Cloudflare Workers",
  });
});

app.get("/api/health", async (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    database: "connected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/membership", membershipRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

app.listen(3000);

export default httpServerHandler({
  port: 3000,
});

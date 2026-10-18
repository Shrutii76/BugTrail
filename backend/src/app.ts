import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// 1. CORS: allow the BugTrail frontend to access the backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. Parse incoming JSON request bodies
app.use(express.json({ limit: "1mb" }));

// 3. Parse cookies from incoming requests
app.use(cookieParser());

// Health-check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "BugTrail API is running",
  });
});

export default app;

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import path from "path";
import { notionRouter, getEntries } from "./notion";
import { imageRouter } from "./image";
import { erasRouter } from "./eras";

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS — restrict to allowed origin
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:8080",
  })
);

// Body size limit
app.use(express.json({ limit: "100kb" }));

// API authentication middleware — requires API_SECRET env var
function apiAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const secret = process.env.API_SECRET;
  if (!secret) {
    // If no secret is configured, skip auth (development convenience)
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

app.use("/api", apiAuth);
app.use("/api/notion", notionRouter);
app.use("/api/image", imageRouter);
app.use("/api/eras", erasRouter);

// Serve generated era images
app.use("/era-images", express.static(path.resolve(import.meta.dirname, "../public/era-images")));

// In production, serve the built frontend
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(import.meta.dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // Warm the entries cache so the first page load is instant
  getEntries().then((entries) => {
    console.log(`[cache] Warmed cache with ${entries.length} entries`);
  }).catch((err) => {
    console.error("[cache] Failed to warm cache:", err.message);
  });
});

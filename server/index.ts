import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { notionRouter, getEntries } from "./notion";
import { chatRouter } from "./chat";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/notion", notionRouter);
app.use("/api/chat", chatRouter);

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

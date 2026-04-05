import { Router, Request, Response } from "express";

export const pollenRouter = Router();

// GET /api/pollen?lat=...&lng=...
pollenRouter.get("/", async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.GOOGLE_POLLEN_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "Pollen API not configured" });
      return;
    }

    const { lat, lng } = req.query;
    if (!lat || !lng) {
      res.status(400).json({ error: "lat and lng query params required" });
      return;
    }

    const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=${apiKey}&location.longitude=${lng}&location.latitude=${lat}&days=1`;

    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.text();
      console.error("[pollen] API error:", err);
      res.status(502).json({ error: "Pollen API request failed" });
      return;
    }

    const data = await response.json();
    // Extract the overall pollen index from today's forecast
    const today = data.dailyInfo?.[0];
    if (!today) {
      res.json({ level: null, index: null });
      return;
    }

    // Get the tree, grass, and weed indices — use the highest
    const pollenTypes = today.pollenTypeInfo || [];
    let maxIndex = 0;
    let maxLevel = "None";

    for (const pType of pollenTypes) {
      const idx = pType.indexInfo?.value ?? 0;
      if (idx > maxIndex) {
        maxIndex = idx;
        maxLevel = pType.indexInfo?.category ?? "None";
      }
    }

    res.json({
      level: maxLevel,
      index: maxIndex,
    });
  } catch (err: unknown) {
    console.error("[pollen] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

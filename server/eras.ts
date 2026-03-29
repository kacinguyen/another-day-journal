import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export const erasRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Era {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  coreVibe: string;
  moodBaseline: string;
  keyEntities: string[];
  palette: string;
  imagePrompt: string;
}

const ERAS_JSON_PATH = path.resolve(
  import.meta.dirname,
  "../exports/eras-q1-2025.json"
);
const IMAGE_DIR = path.resolve(import.meta.dirname, "../public/era-images");

const PATCH_STYLE = `Render in the style of a Studio Ghibli film background painting. Soft watercolor textures, warm gentle lighting, lush painterly detail with a dreamy nostalgic atmosphere. Rich but gentle colors — soft greens, warm yellows, pastel skies, earthy browns. Hand-painted feel with visible brushstrokes and delicate shading. The image should fill the entire square edge to edge with no border, no frame, no drop shadow, no bevel, no vignette, no edge treatment of any kind. The scene extends fully to all four edges. No text, no words, no letters.`;

// Abstract symbolic prompts per era — override the detailed JSON prompts
const ERA_SYMBOLS: Record<number, string> = {
  1: "A small cozy house with a lit window, surrounded by cardboard boxes. A crescent moon above.",
  2: "A steaming pot on a stovetop next to a seashell. Ocean wave curling in the background.",
  3: "Pickleball paddles crossed like an X, surrounded by small stars and a mountain silhouette.",
  4: "A single umbrella in the rain with a small heart floating away. A bridge in the distance.",
  5: "A window looking out at a winding road disappearing into hills. A tiny golden key in the corner.",
  6: "A laptop screen next to a coffee cup with a ski slope mountain behind them.",
  7: "Two backpacks at the edge of a glacial lake with jagged mountain peaks. A guanaco silhouette on a ridge.",
};

async function loadEras(): Promise<Era[]> {
  const raw = await fs.readFile(ERAS_JSON_PATH, "utf-8");
  return JSON.parse(raw).eras;
}

function getImagePath(eraId: number): string {
  return path.join(IMAGE_DIR, `era-${eraId}.png`);
}

async function imageExists(eraId: number): Promise<boolean> {
  try {
    await fs.access(getImagePath(eraId));
    return true;
  } catch {
    return false;
  }
}

// GET /api/eras — return all eras with imageUrl if cached
erasRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const eras = await loadEras();
    const enriched = await Promise.all(
      eras.map(async (era) => ({
        ...era,
        imageUrl: (await imageExists(era.id))
          ? `/era-images/era-${era.id}.png`
          : null,
      }))
    );
    res.json(enriched);
  } catch (error: any) {
    console.error("Error loading eras:", error);
    res.status(500).json({ error: "Failed to load eras" });
  }
});

// POST /api/eras/:id/generate-image — generate a single patch
erasRouter.post(
  "/:id/generate-image",
  async (req: Request, res: Response) => {
    try {
      const eraId = parseInt(req.params.id, 10);
      const eras = await loadEras();
      const era = eras.find((e) => e.id === eraId);

      if (!era) {
        res.status(404).json({ error: "Era not found" });
        return;
      }

      const symbolPrompt = ERA_SYMBOLS[eraId] || era.imagePrompt;

      const prompt = symbolPrompt + "\n\n" + PATCH_STYLE;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
        config: {
          responseModalities: ["IMAGE"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) {
        res.status(500).json({ error: "No response from Gemini" });
        return;
      }

      let imageBytes: string | undefined;
      for (const part of parts) {
        if (part.inlineData) {
          imageBytes = part.inlineData.data!;
          break;
        }
      }

      if (!imageBytes) {
        res.status(500).json({ error: "No image was generated" });
        return;
      }

      await fs.mkdir(IMAGE_DIR, { recursive: true });
      const filePath = getImagePath(eraId);

      // Normalize to 1024x1024 square with rounded corners
      const size = 1024;
      const radius = 32;
      const roundedMask = Buffer.from(
        `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
      );
      // First pass: get dimensions and crop 3% off each edge to remove
      // any shadows/borders Imagen bakes into the image
      const rawBuffer = Buffer.from(imageBytes, "base64");
      const metadata = await sharp(rawBuffer).metadata();
      const w = metadata.width!;
      const h = metadata.height!;
      const cropPx = Math.round(Math.min(w, h) * 0.03);

      const normalized = await sharp(rawBuffer)
        .extract({
          left: cropPx,
          top: cropPx,
          width: w - cropPx * 2,
          height: h - cropPx * 2,
        })
        .resize(size, size, { fit: "cover" })
        .ensureAlpha()
        .composite([{ input: roundedMask, blend: "dest-in" }])
        .png()
        .toBuffer();

      await fs.writeFile(filePath, normalized);

      const imageUrl = `/era-images/era-${eraId}.png`;
      res.json({ imageUrl, image: normalized.toString("base64"), mimeType: "image/png" });
    } catch (error: any) {
      console.error("Error generating era image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  }
);


import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

export const imageRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/image/generate
imageRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const { content, mood, activities, emotions } = req.body;

    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "Journal content is required" });
      return;
    }

    const prompt = buildImagePrompt({ content, mood, activities, emotions });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      res.status(500).json({ error: "No response from Gemini" });
      return;
    }

    for (const part of parts) {
      if (part.inlineData) {
        res.json({
          image: part.inlineData.data,
          mimeType: part.inlineData.mimeType || "image/png",
        });
        return;
      }
    }

    res.status(500).json({ error: "No image was generated" });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

function buildImagePrompt(entry: {
  content: string;
  mood?: string;
  activities?: string[];
  emotions?: string[];
}): string {
  let prompt =
    "Generate an artistic, evocative illustration that captures the essence of this journal entry. " +
    "The style should be warm, painterly, and emotionally resonant — like a visual diary page.\n\n";

  prompt += `Journal entry: "${entry.content}"\n`;

  if (entry.mood) {
    prompt += `Mood: ${entry.mood}\n`;
  }
  if (entry.emotions?.length) {
    prompt += `Emotions: ${entry.emotions.join(", ")}\n`;
  }
  if (entry.activities?.length) {
    prompt += `Activities: ${entry.activities.join(", ")}\n`;
  }

  prompt +=
    "\nDo not include any text or words in the image. Focus on color, atmosphere, and symbolism.";

  return prompt;
}

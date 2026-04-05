import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

export const reflectRouter = Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/reflect/questions
reflectRouter.post("/questions", async (req: Request, res: Response) => {
  try {
    const { content, mood, emotions, moodFactors } = req.body;

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      res.status(400).json({
        error: "Please write a bit more before digging deeper (at least a sentence or two).",
      });
      return;
    }

    const prompt = buildReflectionPrompt({ content, mood, emotions, moodFactors });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      res.status(500).json({ error: "No response from AI" });
      return;
    }

    // Parse questions (one per line, strip numbering)
    const questions = text
      .split("\n")
      .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((line) => line.length > 0 && line.endsWith("?"));

    res.json({ questions: questions.slice(0, 3) });
  } catch (err: unknown) {
    console.error("[reflect] Error generating questions:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

function buildReflectionPrompt({
  content,
  mood,
  emotions,
  moodFactors,
}: {
  content: string;
  mood?: string;
  emotions?: string[];
  moodFactors?: string[];
}): string {
  let context = `Journal entry:\n"${content.slice(0, 1500)}"`;
  if (mood) context += `\nMood: ${mood}`;
  if (emotions?.length) context += `\nEmotions: ${emotions.join(", ")}`;
  if (moodFactors?.length) context += `\nMood factors: ${moodFactors.join(", ")}`;

  return `You are a thoughtful, empathetic journaling coach. Based on the following journal entry, generate exactly 3 follow-up questions that encourage deeper self-reflection.

Guidelines:
- Questions should be specific to what the person wrote, not generic
- Help them explore their feelings, motivations, and experiences more deeply
- Be warm and curious, not clinical
- Keep each question concise (under 20 words)
- Return only the questions, one per line, numbered 1-3

${context}`;
}

import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { getEntries } from "./notion";

export const chatRouter = Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Format journal entries as context for the AI
function formatJournalContext(entries: any[]) {
  if (!entries.length) return "";

  return entries
    .map((entry) => {
      const entryDate = new Date(entry.created_at);
      const formattedDate = entryDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let emotionsText = "";
      if (entry.emotions) {
        if (Array.isArray(entry.emotions)) {
          emotionsText = entry.emotions.join(", ");
        } else if (typeof entry.emotions === "object") {
          emotionsText = JSON.stringify(entry.emotions);
        } else {
          emotionsText = String(entry.emotions);
        }
      }

      const people = entry.social_interactions?.people || [];
      const eventTypes = entry.social_interactions?.eventTypes || [];

      let context = `=== JOURNAL ENTRY FROM ${formattedDate} ===\n`;
      if (entry.mood) context += `Mood: ${entry.mood}\n`;
      if (emotionsText) context += `Emotions: ${emotionsText}\n`;
      if (entry.energy_level != null) context += `Energy Level: ${entry.energy_level}/100\n`;
      if (entry.content) context += `Journal Text: ${entry.content}\n`;
      if (Array.isArray(entry.activities) && entry.activities.length > 0)
        context += `Activities: ${entry.activities.join(", ")}\n`;
      if (people.length > 0) context += `People I spent time with: ${people.join(", ")}\n`;
      if (eventTypes.length > 0) context += `Events/Social contexts: ${eventTypes.join(", ")}\n`;

      return context;
    })
    .join("\n\n");
}

// POST /api/chat
chatRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "No message provided" });
      return;
    }

    const journalEntries = await getEntries();
    const journalContext = formatJournalContext(journalEntries);

    const systemPrompt = `You are a helpful AI assistant for a journaling app called Another Day. You have access to the user's journal entries which provide context about their life, moods, activities, and experiences.

${journalEntries.length > 0 ? "Here are the user's journal entries (formatted with dates, moods, emotions, activities, and other details):" : "The user has not created any journal entries yet."}

${journalContext}

When responding to the user:
1. If they have journal entries, reference specific details from their entries when relevant
2. If they ask about patterns or insights, analyze the information from their entries
3. Be supportive, empathetic, and thoughtful

IMPORTANT: If the user has journal entries (${journalEntries.length} found), DO NOT say they don't have any entries. Instead, use the information provided above to give personalized responses.`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

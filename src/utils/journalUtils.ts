
import { JournalEntryData } from "@/components/journal/types/journal-types";

/**
 * Retrieves journal entries from local storage
 * @returns Array of journal entries or empty array if none exist
 */
export const getJournalEntries = (): JournalEntryData[] => {
  const savedEntries = localStorage.getItem("journalEntries");
  return savedEntries ? JSON.parse(savedEntries) : [];
};

/**
 * Saves journal entries to local storage
 * @param entries Array of journal entries to save
 */
export const saveJournalEntries = (entries: JournalEntryData[]) => {
  localStorage.setItem("journalEntries", JSON.stringify(entries));
};

/**
 * Example entry for demonstration purposes
 */
export const dummyEntry: JournalEntryData = {
  id: "dummy-entry",
  date: new Date(),
  mood: "good",
  emotions: ["grateful", "happy", "content"],
  energy: 85,
  eventTypes: ["cafe", "outdoors"],
  content: "Today was a great day. I went for a morning coffee and then had a relaxing walk in the park.",
  activities: ["Reading", "Walking"],
  people: ["Alex", "Sam"],
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * Returns the appropriate emoji for a given mood
 */
export const getMoodEmoji = (mood: string) => {
  switch (mood) {
    case "great": return "😄";
    case "good": return "🙂";
    case "neutral": return "😐";
    case "bad": return "🙁";
    case "awful": return "😞";
    default: return "❓";
  }
};

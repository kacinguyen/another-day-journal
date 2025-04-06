
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { MoodType } from "@/components/journal/MoodPicker";
import { EmotionType } from "@/components/journal/types/emotion-types";
import { format } from "date-fns";
import { JournalEntryDB } from "./types";

/**
 * Maps a database journal entry to the application JournalEntryData format
 */
export function mapDbToJournalEntry(entry: JournalEntryDB): JournalEntryData {
  // Parse the social_interactions object
  const socialInteractions = entry.social_interactions as { 
    people?: string[], 
    eventTypes?: string[] 
  } | null;

  // Handle emotions array conversion - ensure it's an array of strings (EmotionType)
  const emotions: EmotionType[] = Array.isArray(entry.emotions) 
    ? (entry.emotions as any[]).map(emotion => 
        typeof emotion === 'string' ? emotion as EmotionType : String(emotion) as EmotionType
      )
    : [];

  return {
    id: entry.id,
    date: new Date(entry.created_at),
    content: entry.content || "",
    mood: (entry.mood as MoodType) || "neutral", // Cast to MoodType with default
    energy: entry.energy_level !== null ? entry.energy_level : null,
    activities: entry.activities || [],
    people: socialInteractions?.people || [],
    eventTypes: socialInteractions?.eventTypes || [],
    emotions: emotions,
  };
}

/**
 * Maps a JournalEntryData to the format expected by the database
 */
export function mapJournalEntryToDb(entry: JournalEntryData, userId: string): Omit<JournalEntryDB, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    content: entry.content || "",
    mood: entry.mood,
    energy_level: entry.energy,
    activities: entry.activities,
    emotions: entry.emotions,
    social_interactions: {
      people: entry.people,
      eventTypes: entry.eventTypes,
    }
  };
}

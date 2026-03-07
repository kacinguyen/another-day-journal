
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { MoodType } from "@/components/journal/MoodPicker";
import { EventType } from "@/components/journal/event/types";
import { EmotionType } from "@/components/journal/types/emotion-types";

/**
 * Database representation of a journal entry
 * Maps to the Notion database schema
 */
export interface JournalEntryDB {
  id: string;
  content: string | null;
  mood: string | null;
  energy_level: number | null;
  activities: string[] | null;
  emotions: string[] | null;
  social_interactions: {
    people?: string[];
    eventTypes?: string[];
  } | null;
  created_at: string;
  updated_at: string;
}

/**
 * Import statistics for journal entries
 */
export interface ImportStats {
  total: number;
  success: number;
  failed: number;
}

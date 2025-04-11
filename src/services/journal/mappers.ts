
import { JournalEntryData } from "@/components/journal/types/journal-types";

/**
 * Map a database journal entry to the JournalEntryData type
 */
export const mapDbToJournalEntry = (dbEntry: any): JournalEntryData => {
  return {
    id: dbEntry.id,
    date: new Date(dbEntry.created_at),
    content: dbEntry.content || "",
    mood: dbEntry.mood || null,
    energy: dbEntry.energy_level !== null ? dbEntry.energy_level : null,
    activities: dbEntry.activities || [],
    people: dbEntry.social_interactions?.people || [],
    eventTypes: dbEntry.social_interactions?.eventTypes || [],
    emotions: dbEntry.emotions?.list || [],
    createdAt: new Date(dbEntry.created_at),
    updatedAt: new Date(dbEntry.updated_at)
  };
};

/**
 * Map a JournalEntryData object to the database format
 */
export const mapJournalEntryToDb = (entry: JournalEntryData, userId: string) => {
  return {
    id: entry.id,
    user_id: userId,
    content: entry.content,
    mood: entry.mood,
    energy_level: entry.energy,
    activities: entry.activities,
    social_interactions: {
      people: entry.people,
      eventTypes: entry.eventTypes
    },
    emotions: {
      list: entry.emotions
    }
  };
};

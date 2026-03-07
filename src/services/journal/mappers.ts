
import { JournalEntryData } from "@/components/journal/types/journal-types";

/**
 * Map a database journal entry to the JournalEntryData type
 */
// Parse a date string as local time. Date-only strings like "2026-02-19" are
// treated as UTC by the Date constructor, which shifts to the previous day in
// negative-offset timezones (e.g. US). Appending T12:00:00 avoids this.
function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // If it's a date-only string (YYYY-MM-DD), parse as local noon to avoid timezone shift
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr + "T12:00:00");
  }
  return new Date(dateStr);
}

export const mapDbToJournalEntry = (dbEntry: any): JournalEntryData => {
  return {
    id: dbEntry.id,
    date: parseLocalDate(dbEntry.created_at),
    content: dbEntry.content || "",
    mood: dbEntry.mood || null,
    energy: dbEntry.energy_level !== null ? dbEntry.energy_level : null,
    activities: dbEntry.activities || [],
    people: dbEntry.social_interactions?.people || [],
    eventTypes: dbEntry.social_interactions?.eventTypes || [],
    emotions: dbEntry.emotions || [],
    createdAt: parseLocalDate(dbEntry.created_at),
    updatedAt: new Date(dbEntry.updated_at)
  };
};

/**
 * Map a JournalEntryData object to the format expected by the API
 */
export const mapJournalEntryToDb = (entry: JournalEntryData) => {
  // Format date using local year/month/day to avoid UTC shift
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return {
    date: entry.date instanceof Date
      ? formatLocalDate(entry.date)
      : String(entry.date),
    content: entry.content,
    mood: entry.mood,
    energy_level: entry.energy,
    activities: entry.activities,
    emotions: entry.emotions,
    people: entry.people,
    event_types: entry.eventTypes,
  };
};

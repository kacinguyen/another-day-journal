
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { toast } from "sonner";
import { format } from "date-fns";
import { mapDbToJournalEntry, mapJournalEntryToDb } from "./mappers";
import { apiGet, apiPost, apiPatch, apiDelete } from "../api";
import { JournalEntryDB } from "./types";

/**
 * Save a journal entry
 * Creates a new entry or updates an existing one if id is provided
 */
export const saveJournalEntry = async (entry: JournalEntryData): Promise<JournalEntryData | null> => {
  try {
    if (!entry.mood) {
      toast("Mood selection is required", {
        description: "Please select your mood before saving",
      });
      return null;
    }

    const entryData = mapJournalEntryToDb(entry);

    let result: JournalEntryDB;

    if (entry.id) {
      result = await apiPatch<JournalEntryDB>(`/notion/entries/${entry.id}`, entryData);
    } else {
      // Include created_at for new entries
      result = await apiPost<JournalEntryDB>("/notion/entries", {
        ...entryData,
        created_at: entry.date instanceof Date
          ? entry.date.toISOString()
          : new Date().toISOString(),
      });
    }

    return mapDbToJournalEntry(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in saveJournalEntry:", message);
    toast("Failed to save entry", {
      description: message,
    });
    return null;
  }
};

/**
 * Fetch journal entries, optionally filtered to entries on or after `since` (YYYY-MM-DD).
 * Pass `all: true` to fetch the full history (bypasses the server's 1-month default).
 * Returns entries sorted by updated_at (most recently edited first).
 */
export const fetchJournalEntries = async (
  options?: { since?: string; all?: boolean }
): Promise<JournalEntryData[]> => {
  try {
    const params = new URLSearchParams();
    if (options?.all) {
      params.set("all", "true");
    } else if (options?.since) {
      params.set("since", options.since);
    }
    const query = params.toString() ? `?${params}` : "";
    const data = await apiGet<JournalEntryDB[]>(`/notion/entries${query}`);

    const entries = data.map(mapDbToJournalEntry);

    // Filter entries to keep only the latest entry for each date
    const uniqueEntriesByDate = new Map<string, JournalEntryData>();

    entries.forEach(entry => {
      const dateString = format(entry.date, 'yyyy-MM-dd');

      if (!uniqueEntriesByDate.has(dateString) ||
          entry.updatedAt > uniqueEntriesByDate.get(dateString)!.updatedAt) {
        uniqueEntriesByDate.set(dateString, entry);
      }
    });

    return Array.from(uniqueEntriesByDate.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error("Error in fetchJournalEntries:", error);
    return [];
  }
};

/**
 * Fetch the body content of a single journal entry (lazy-loaded).
 */
export const fetchEntryContent = async (id: string): Promise<string> => {
  try {
    const data = await apiGet<{ content: string }>(`/notion/entries/${id}/content`);
    return data.content;
  } catch (error) {
    console.error("Error fetching entry content:", error);
    return "";
  }
};

/**
 * Delete a journal entry (archives it in Notion)
 */
export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  try {
    await apiDelete(`/notion/entries/${entryId}`);
    return true;
  } catch (error) {
    console.error("Error in deleteJournalEntry:", error);
    toast("Failed to delete journal entry", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
};

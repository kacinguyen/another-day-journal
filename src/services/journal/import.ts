
import { toast } from "sonner";
import { format } from "date-fns";
import { parseJournalCsv } from "@/utils/csvUtils";
import { ImportStats, JournalEntryDB } from "./types";
import { mapJournalEntryToDb } from "./mappers";
import { apiGet, apiPost, apiPatch } from "../api";

/**
 * Import journal entries from CSV
 * Parses CSV content and saves entries to the database
 */
export const importJournalEntries = async (csvContent: string): Promise<ImportStats> => {
  try {
    // Parse CSV data
    const { entries, errors } = parseJournalCsv(csvContent);

    if (entries.length === 0) {
      if (errors.length > 0) {
        toast("Failed to parse CSV", {
          description: errors[0],
        });
      } else {
        toast("No valid entries found in CSV", {
          description: "Please check your CSV format and try again",
        });
      }
      return { total: 0, success: 0, failed: 0 };
    }

    if (errors.length > 0) {
      console.warn("CSV parsing errors:", errors);
    }

    // Fetch existing entries for dedup checking
    const existingEntries = await apiGet<JournalEntryDB[]>("/notion/entries");

    let successCount = 0;
    let failedCount = 0;

    for (const entry of entries) {
      try {
        const entryData = mapJournalEntryToDb(entry);
        const dateString = format(entry.date, 'yyyy-MM-dd');

        // Check if an entry already exists for this date
        const existing = existingEntries.find(e => {
          const existingDate = new Date(e.created_at);
          return format(existingDate, 'yyyy-MM-dd') === dateString;
        });

        if (existing) {
          await apiPatch(`/notion/entries/${existing.id}`, entryData);
        } else {
          await apiPost("/notion/entries", {
            ...entryData,
            created_at: entry.date.toISOString(),
          });
        }
        successCount++;
      } catch (error) {
        console.error("Error importing entry:", error);
        failedCount++;
      }
    }

    return {
      total: entries.length,
      success: successCount,
      failed: failedCount,
    };
  } catch (error) {
    console.error("Error in importJournalEntries:", error);
    toast("An error occurred", {
      description: "Could not import journal entries. Please try again later.",
    });
    return { total: 0, success: 0, failed: 0 };
  }
};

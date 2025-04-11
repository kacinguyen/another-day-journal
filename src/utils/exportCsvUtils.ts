
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { format } from "date-fns";

/**
 * Convert journal entries to CSV format
 * 
 * @param entries Array of journal entries to convert
 * @returns CSV string with headers and entry data
 */
export const journalEntriesToCsv = (entries: JournalEntryData[]): string => {
  if (!entries.length) return "";
  
  // Define CSV headers
  const headers = [
    "date",
    "mood",
    "energy",
    "content",
    "activities",
    "people",
    "eventTypes",
    "emotions"
  ].join(",");
  
  // Convert each entry to a CSV row
  const rows = entries.map(entry => {
    // Format the date
    const dateStr = format(entry.date, "yyyy-MM-dd");
    
    // Format arrays as pipe-separated values for easier re-import
    const activities = entry.activities?.join("|") || "";
    const people = entry.people?.join("|") || "";
    const eventTypes = entry.eventTypes?.join("|") || "";
    const emotions = entry.emotions?.join("|") || "";
    
    // Escape content to handle commas and newlines
    const content = entry.content ? `"${entry.content.replace(/"/g, '""')}"` : "";
    
    // Combine all fields into a CSV row
    return [
      dateStr,
      entry.mood || "",
      entry.energy || "",
      content,
      activities,
      people,
      eventTypes,
      emotions
    ].join(",");
  });
  
  // Combine headers and rows into a single CSV string
  return [headers, ...rows].join("\n");
};

/**
 * Generate a filename for the exported CSV
 * 
 * @returns Filename string with current date
 */
export const generateCsvFilename = (): string => {
  const date = format(new Date(), "yyyy-MM-dd");
  return `journal_entries_${date}.csv`;
};

/**
 * Export journal entries to a downloadable CSV file
 * 
 * @param entries Array of journal entries to export
 */
export const exportJournalEntriesToCsv = (entries: JournalEntryData[]): void => {
  // Convert entries to CSV
  const csv = journalEntriesToCsv(entries);
  
  if (!csv) {
    console.error("No entries to export");
    return;
  }
  
  // Create a Blob with the CSV data
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute("href", url);
  link.setAttribute("download", generateCsvFilename());
  link.style.visibility = "hidden";
  
  // Add to document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

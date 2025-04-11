
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { MoodType } from "@/components/journal/MoodPicker";
import { EventType } from "@/components/journal/event/types";
import { EmotionType } from "@/components/journal/types/emotion-types";
import { parse } from "date-fns";

/**
 * Parse CSV data into JournalEntryData objects
 * Expected CSV format:
 * date,content,mood,energy,activities,people,eventTypes,emotions
 * 2024-01-01,This is a journal entry,happy,80,reading|running,John|Jane,social|work,joy|excitement
 */
export const parseJournalCsv = (csvContent: string): {
  entries: JournalEntryData[];
  errors: string[];
} => {
  const lines = csvContent.split("\n").filter(line => line.trim());
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const entries: JournalEntryData[] = [];
  const errors: string[] = [];

  // Validate headers
  const requiredHeaders = ["date", "mood"];
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    errors.push(`CSV is missing required headers: ${missingHeaders.join(", ")}`);
    return { entries, errors };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length < 2) continue; // Skip empty rows
      
      const entry: Partial<JournalEntryData> = {};
      
      // Map CSV columns to entry properties
      headers.forEach((header, index) => {
        const value = values[index] || "";
        
        switch (header) {
          case "date":
            try {
              // Try different date formats
              let date: Date | null = null;
              const formats = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy"];
              
              for (const format of formats) {
                try {
                  date = parse(value, format, new Date());
                  if (!isNaN(date.getTime())) break;
                } catch (e) {
                  // Try next format
                }
              }
              
              if (date && !isNaN(date.getTime())) {
                entry.date = date;
              } else {
                throw new Error(`Invalid date format: ${value}`);
              }
            } catch (e) {
              throw new Error(`Invalid date format: ${value}`);
            }
            break;
          
          case "content":
            entry.content = value;
            break;
            
          case "mood":
            // Validate mood
            const validMoods = ["happy", "sad", "anxious", "angry", "neutral", "excited", "tired"];
            if (value && !validMoods.includes(value.toLowerCase())) {
              throw new Error(`Invalid mood: ${value}. Valid moods are: ${validMoods.join(", ")}`);
            }
            entry.mood = (value ? value.toLowerCase() : "neutral") as MoodType;
            break;
            
          case "energy":
            const energyLevel = parseInt(value);
            entry.energy = isNaN(energyLevel) ? 50 : Math.min(100, Math.max(0, energyLevel));
            break;
            
          case "activities":
            entry.activities = value ? value.split("|").map(a => a.trim()).filter(Boolean) : [];
            break;
            
          case "people":
            entry.people = value ? value.split("|").map(p => p.trim()).filter(Boolean) : [];
            break;
            
          case "eventtypes":
          case "event_types":
          case "event types":
            entry.eventTypes = value 
              ? value.split("|").map(t => t.trim()).filter(Boolean) as EventType[]
              : [];
            break;
            
          case "emotions":
            entry.emotions = value 
              ? value.split("|").map(e => e.trim()).filter(Boolean) as EmotionType[]
              : [];
            break;
        }
      });
      
      // Validate required fields
      if (!entry.date) {
        throw new Error(`Row ${i}: Missing required field: date`);
      }
      
      if (!entry.mood) {
        throw new Error(`Row ${i}: Missing required field: mood`);
      }
      
      // Set default values for optional fields
      entry.content = entry.content || "";
      entry.energy = entry.energy ?? 50;
      entry.activities = entry.activities || [];
      entry.people = entry.people || [];
      entry.eventTypes = entry.eventTypes || [];
      entry.emotions = entry.emotions || [];
      
      // Add valid entry to the list
      entries.push(entry as JournalEntryData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      errors.push(`Row ${i}: ${errorMessage}`);
    }
  }
  
  return { entries, errors };
};

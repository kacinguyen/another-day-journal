
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { MoodType } from "@/components/journal/MoodPicker";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { mapDbToJournalEntry, mapJournalEntryToDb } from "./mappers";

/**
 * Save a journal entry to Supabase
 * Creates a new entry or updates an existing one if id is provided
 * 
 * @param entry The journal entry data to save
 * @returns The saved entry or null if the operation failed
 */
export const saveJournalEntry = async (entry: JournalEntryData): Promise<JournalEntryData | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast("You must be logged in to save journal entries", {
        description: "Please log in and try again",
      });
      return null;
    }

    // Validate only the mood is required
    if (!entry.mood) {
      toast("Mood selection is required", {
        description: "Please select your mood before saving",
      });
      return null;
    }

    // Format the date correctly for storage
    const entryDate = format(entry.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    const currentTimestamp = new Date().toISOString();

    // Prepare entry data for database
    const entryData = mapJournalEntryToDb(entry, user.id);

    let result;

    if (entry.id) {
      // Update existing entry
      result = await supabase
        .from('journal_entries')
        .update({
          ...entryData,
          updated_at: currentTimestamp
        })
        .eq('id', entry.id)
        .select()
        .single();
    } else {
      // Insert new entry with the specific date
      result = await supabase
        .from('journal_entries')
        .insert({
          ...entryData,
          created_at: entryDate,
          updated_at: currentTimestamp
        })
        .select()
        .single();
    }

    if (result.error) {
      toast("Failed to save journal entry", {
        description: result.error.message,
      });
      console.error("Error saving journal entry:", result.error);
      return null;
    }

    return mapDbToJournalEntry(result.data);
  } catch (error) {
    console.error("Error in saveJournalEntry:", error);
    toast("An error occurred", {
      description: "Please try again later",
    });
    return null;
  }
};

/**
 * Fetch all journal entries for the current user
 * Returns entries sorted by updated_at (most recently edited first)
 * 
 * @returns Array of journal entries
 */
export const fetchJournalEntries = async (): Promise<JournalEntryData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Error fetching journal entries:", error);
      toast("Failed to load journal entries", {
        description: error.message,
      });
      return [];
    }

    // Convert database entries to JournalEntryData
    const entries = data.map(mapDbToJournalEntry);
    
    // Filter entries to keep only the latest entry for each date
    const uniqueEntriesByDate = new Map<string, JournalEntryData>();
    
    // Group entries by date string (ignoring time)
    entries.forEach(entry => {
      const dateString = format(entry.date, 'yyyy-MM-dd');
      
      // If this date isn't in our map yet, or this entry is newer than what we have
      if (!uniqueEntriesByDate.has(dateString) || 
          entry.updatedAt > uniqueEntriesByDate.get(dateString)!.updatedAt) {
        uniqueEntriesByDate.set(dateString, entry);
      }
    });
    
    // Convert map back to array and sort by updatedAt (newest first)
    return Array.from(uniqueEntriesByDate.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error("Error in fetchJournalEntries:", error);
    return [];
  }
};

/**
 * Delete a journal entry
 * 
 * @param entryId The ID of the entry to delete
 * @returns true if deletion was successful, false otherwise
 */
export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error("Error deleting journal entry:", error);
      toast("Failed to delete journal entry", {
        description: error.message,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteJournalEntry:", error);
    return false;
  }
};

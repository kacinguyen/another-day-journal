
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { parseJournalCsv } from "@/utils/csvUtils";
import { ImportStats } from "./types";
import { mapJournalEntryToDb } from "./mappers";

/**
 * Import journal entries from CSV
 * Parses CSV content and saves entries to the database
 * 
 * @param csvContent CSV content as string
 * @returns Statistics about the import operation
 */
export const importJournalEntries = async (csvContent: string): Promise<ImportStats> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast("You must be logged in to import journal entries", {
        description: "Please log in and try again",
      });
      return { total: 0, success: 0, failed: 0 };
    }

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
    
    // Log parsing errors if any
    if (errors.length > 0) {
      console.warn("CSV parsing errors:", errors);
    }

    // Import each entry
    let successCount = 0;
    let failedCount = 0;
    
    for (const entry of entries) {
      try {
        // Format the date correctly for storage
        const entryDate = format(entry.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        
        // Prepare entry data for Supabase
        const entryData = mapJournalEntryToDb(entry, user.id);
        
        // Check if an entry already exists for this date
        const { data: existingEntries } = await supabase
          .from('journal_entries')
          .select('id, created_at')
          .eq('user_id', user.id)
          .gte('created_at', new Date(entry.date.setHours(0, 0, 0, 0)).toISOString())
          .lt('created_at', new Date(entry.date.setHours(23, 59, 59, 999)).toISOString());
          
        if (existingEntries && existingEntries.length > 0) {
          // Update existing entry
          const { error } = await supabase
            .from('journal_entries')
            .update({
              ...entryData,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingEntries[0].id);
            
          if (error) {
            console.error("Error updating entry:", error);
            failedCount++;
          } else {
            successCount++;
          }
        } else {
          // Insert new entry
          const { error } = await supabase
            .from('journal_entries')
            .insert({
              ...entryData,
              created_at: entryDate,
              updated_at: new Date().toISOString()
            });
            
          if (error) {
            console.error("Error inserting entry:", error);
            failedCount++;
          } else {
            successCount++;
          }
        }
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

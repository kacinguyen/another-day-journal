
import { useState, useCallback } from "react";
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { fetchJournalEntries, saveJournalEntry } from "@/services/journalService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

/**
 * Custom hook to manage journal entries fetching and saving
 * 
 * This hook encapsulates the logic for loading, refreshing, and saving journal entries
 */
export function useJournalEntries() {
  // State for journal entries and loading status
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  /**
   * Load journal entries from the server
   */
  const loadEntries = useCallback(async () => {
    if (!user) return [];
    
    setLoading(true);
    const journalEntries = await fetchJournalEntries();
    setEntries(journalEntries);
    setLoading(false);
    
    return journalEntries;
  }, [user]);

  /**
   * Refresh entries data from the server
   */
  const refreshEntries = useCallback(async () => {
    await loadEntries();
    toast({
      title: "Entries Refreshed",
      description: "Journal entries have been updated."
    });
  }, [loadEntries, toast]);

  /**
   * Handles saving a new journal entry or updating an existing one
   */
  const saveEntry = async (entryData: JournalEntryData) => {
    const savedEntry = await saveJournalEntry(entryData);
    
    if (savedEntry) {
      // Update the entries list
      const updatedEntries = entryData.id
        ? entries.map(entry => entry.id === entryData.id ? savedEntry : entry)
        : [savedEntry, ...entries];
      
      // Make sure entries are unique by date
      const uniqueEntries = new Map<string, JournalEntryData>();
      updatedEntries.forEach(entry => {
        const dateString = format(entry.date, 'yyyy-MM-dd');
        if (!uniqueEntries.has(dateString) || 
            entry.updatedAt > uniqueEntries.get(dateString)!.updatedAt) {
          uniqueEntries.set(dateString, entry);
        }
      });
      
      const finalEntries = Array.from(uniqueEntries.values())
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        
      setEntries(finalEntries);
      
      toast({
        title: entryData.id ? "Entry Updated" : "Entry Created",
        description: "Your journal entry has been saved successfully."
      });
      
      return savedEntry;
    }
    
    return null;
  };

  /**
   * Find an entry for a specific date
   */
  const findEntryForDate = useCallback((entriesList: JournalEntryData[], date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entriesList.find(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === dateString;
    });
  }, []);

  /**
   * Check if a specific day has an entry
   */
  const isDayWithEntry = useCallback((day: Date) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  }, [entries]);

  return {
    entries,
    loading,
    loadEntries,
    refreshEntries,
    saveEntry,
    findEntryForDate,
    isDayWithEntry
  };
}


import { useState, useEffect, useCallback } from "react";
import { JournalEntryData } from "@/components/journal/JournalEntry";
import { fetchJournalEntries, saveJournalEntry } from "@/services/journalService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

/**
 * Custom hook to manage journal entries state and operations
 * 
 * This hook encapsulates all the logic for fetching, saving and managing journal entries
 */
export function useJournalLog() {
  // State for journal entries and loading status
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEntry, setCurrentEntry] = useState<JournalEntryData | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load journal entries
  const loadEntries = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const journalEntries = await fetchJournalEntries();
    setEntries(journalEntries);
    
    // Set the initial entry for today's date
    const todayEntry = findEntryForDate(journalEntries, new Date());
    updateCurrentEntry(todayEntry);
    
    setLoading(false);
  }, [user]);

  // Load journal entries when component mounts or user changes
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

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
   * Find an entry for the selected date or return undefined if none exists
   */
  const findEntryForDate = useCallback((entriesList: JournalEntryData[], date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entriesList.find(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === dateString;
    });
  }, []);

  /**
   * Update the current entry state based on selected date
   */
  const updateCurrentEntry = useCallback((entry: JournalEntryData | undefined) => {
    if (entry) {
      // Use the existing entry
      setCurrentEntry(entry);
    } else {
      // Create a new empty entry for the selected date
      setCurrentEntry(undefined);
    }
  }, []);

  /**
   * Handles saving a new journal entry or updating an existing one
   */
  const handleSaveEntry = async (entryData: JournalEntryData) => {
    // Ensure we're using the selected date rather than today's date
    // This fixes the issue where entries were always saving for the current date
    const dataToSave = {
      ...entryData,
      date: selectedDate
    };
    
    const savedEntry = await saveJournalEntry(dataToSave);
    
    if (savedEntry) {
      // Update the entries list
      const updatedEntries = dataToSave.id
        ? entries.map(entry => entry.id === dataToSave.id ? savedEntry : entry)
        : [savedEntry, ...entries];
      
      // Make sure entries are unique by date
      const uniqueEntries = new Map<string, JournalEntryData>();
      updatedEntries.forEach(entry => {
        const dateString = format(entry.date, 'yyyy-MM-dd');
        if (!uniqueEntries.has(dateString) || 
            entry.date > uniqueEntries.get(dateString)!.date) {
          uniqueEntries.set(dateString, entry);
        }
      });
      
      const finalEntries = Array.from(uniqueEntries.values())
        .sort((a, b) => b.date.getTime() - a.date.getTime());
        
      setEntries(finalEntries);
      setCurrentEntry(savedEntry);
      
      toast({
        title: dataToSave.id ? "Entry Updated" : "Entry Created",
        description: "Your journal entry has been saved successfully."
      });
    }
  };

  /**
   * Handle date selection in the calendar
   */
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date) return;
    
    // Update the selected date
    setSelectedDate(date);
    
    // Find an entry for this date or create a new empty one
    const entry = findEntryForDate(entries, date);
    updateCurrentEntry(entry);
  }, [entries, findEntryForDate, updateCurrentEntry]);

  /**
   * Handle clicking on a previous entry in the list
   */
  const handleEntryClick = (entry: JournalEntryData) => {
    // Update the selected date to match the entry's date
    setSelectedDate(entry.date);
    
    // Set the current entry
    setCurrentEntry(entry);
  };

  // Determine whether to show the example entry
  const showDummyEntry = entries.length === 0 && !loading;

  // Prepare the initial data for the journal entry form
  const getInitialData = () => {
    if (currentEntry) {
      return currentEntry;
    }
    
    // Return a new empty entry with the selected date
    return {
      date: selectedDate,
      content: "",
      mood: null,
      energy: 50,
      activities: [],
      people: [],
      eventTypes: [],
      emotions: []
    };
  };

  // Highlight dates that have journal entries
  const isDayWithEntry = (day: Date) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

  return {
    entries,
    loading,
    selectedDate,
    setSelectedDate,
    showDummyEntry,
    handleDateSelect,
    handleSaveEntry,
    handleEntryClick,
    getInitialData,
    isDayWithEntry,
    refreshEntries
  };
}

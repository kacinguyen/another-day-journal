
import { useState, useEffect } from "react";
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

  // Load journal entries when component mounts or user changes
  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;
      
      setLoading(true);
      const journalEntries = await fetchJournalEntries();
      setEntries(journalEntries);
      
      // Set the initial entry for today's date
      const todayEntry = findEntryForDate(new Date());
      updateCurrentEntry(todayEntry);
      
      setLoading(false);
    };

    loadEntries();
  }, [user]);

  /**
   * Find an entry for the selected date or return undefined if none exists
   */
  const findEntryForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entries.find(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === dateString;
    });
  };

  /**
   * Update the current entry state based on selected date
   */
  const updateCurrentEntry = (entry: JournalEntryData | undefined) => {
    if (entry) {
      // Use the existing entry
      setCurrentEntry(entry);
    } else {
      // Create a new empty entry for the selected date
      setCurrentEntry(undefined);
    }
  };

  /**
   * Handles saving a new journal entry or updating an existing one
   */
  const handleSaveEntry = async (entryData: JournalEntryData) => {
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
            entry.date > uniqueEntries.get(dateString)!.date) {
          uniqueEntries.set(dateString, entry);
        }
      });
      
      const finalEntries = Array.from(uniqueEntries.values())
        .sort((a, b) => b.date.getTime() - a.date.getTime());
        
      setEntries(finalEntries);
      setCurrentEntry(savedEntry);
      
      toast({
        title: entryData.id ? "Entry Updated" : "Entry Created",
        description: "Your journal entry has been saved successfully."
      });
    }
  };

  /**
   * Handle date selection in the calendar
   */
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Update the selected date
    setSelectedDate(date);
    
    // Find an entry for this date or create a new empty one
    const entry = findEntryForDate(date);
    updateCurrentEntry(entry);
    
    // If an entry exists, show a toast notification
    if (entry) {
      toast({
        title: "Journal Entry Found",
        description: `Loaded entry for ${format(date, 'MMMM d, yyyy')}`
      });
    } else {
      toast({
        title: "New Journal Entry",
        description: `Create a new entry for ${format(date, 'MMMM d, yyyy')}`
      });
    }
    
    // Scroll to the entry form
    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
      journalForm.scrollIntoView({
        behavior: 'smooth'
      });
    }
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
    showDummyEntry,
    handleDateSelect,
    handleSaveEntry,
    getInitialData,
    isDayWithEntry
  };
}

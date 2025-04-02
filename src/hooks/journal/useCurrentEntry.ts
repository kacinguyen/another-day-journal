
import { useState, useCallback } from "react";
import { JournalEntryData } from "@/components/journal/types/journal-types";

/**
 * Custom hook to manage the current journal entry being viewed or edited
 * 
 * This hook handles the state and operations related to the current entry
 */
export function useCurrentEntry() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEntry, setCurrentEntry] = useState<JournalEntryData | undefined>(undefined);

  /**
   * Update the current entry state based on selected date
   */
  const updateCurrentEntry = useCallback((entry: JournalEntryData | undefined) => {
    setCurrentEntry(entry);
  }, []);

  /**
   * Handle date selection in the calendar
   */
  const handleDateSelect = useCallback((date: Date | undefined, entries: JournalEntryData[], findEntryForDate: (entries: JournalEntryData[], date: Date) => JournalEntryData | undefined) => {
    if (!date) return;
    
    // Update the selected date
    setSelectedDate(date);
    
    // Find an entry for this date or create a new empty one
    const entry = findEntryForDate(entries, date);
    updateCurrentEntry(entry);
  }, [updateCurrentEntry]);

  /**
   * Handle clicking on a previous entry in the list
   */
  const handleEntryClick = useCallback((entry: JournalEntryData) => {
    // Update the selected date to match the entry's date
    setSelectedDate(entry.date);
    
    // Set the current entry
    setCurrentEntry(entry);
  }, []);

  /**
   * Prepare the initial data for the journal entry form
   */
  const getInitialData = useCallback(() => {
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
  }, [currentEntry, selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    currentEntry,
    updateCurrentEntry,
    handleDateSelect,
    handleEntryClick,
    getInitialData
  };
}

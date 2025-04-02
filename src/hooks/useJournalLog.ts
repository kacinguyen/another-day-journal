
import { useEffect, useCallback } from "react";
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { useJournalEntries } from "./journal/useJournalEntries";
import { useCurrentEntry } from "./journal/useCurrentEntry";

/**
 * Custom hook to manage journal entries state and operations
 * 
 * This hook provides a unified interface for:
 * - Loading and refreshing journal entries
 * - Managing the current selected date and entry
 * - Saving journal entries
 * - Handling date selection and entry clicking
 */
export function useJournalLog() {
  // Use the journal entries hook for data loading and saving
  const {
    entries,
    loading,
    loadEntries,
    refreshEntries,
    saveEntry,
    findEntryForDate,
    isDayWithEntry
  } = useJournalEntries();

  // Use the current entry hook for managing the currently selected entry
  const {
    selectedDate,
    setSelectedDate,
    currentEntry,
    updateCurrentEntry,
    handleDateSelect: handleEntryDateSelect,
    handleEntryClick,
    getInitialData
  } = useCurrentEntry();

  // Load journal entries when the hook is initialized
  useEffect(() => {
    const initializeEntries = async () => {
      const journalEntries = await loadEntries();
      
      // Set the initial entry for today's date
      const todayEntry = findEntryForDate(journalEntries, new Date());
      updateCurrentEntry(todayEntry);
    };
    
    initializeEntries();
  }, [loadEntries, findEntryForDate, updateCurrentEntry]);

  /**
   * Handle date selection in the calendar
   * Wrapper around the useCurrentEntry hook's handleDateSelect
   */
  const handleDateSelect = useCallback((date: Date | undefined) => {
    handleEntryDateSelect(date, entries, findEntryForDate);
  }, [entries, findEntryForDate, handleEntryDateSelect]);

  /**
   * Handles saving a new journal entry or updating an existing one
   */
  const handleSaveEntry = async (entryData: JournalEntryData) => {
    // Ensure we're using the selected date rather than today's date
    const dataToSave = {
      ...entryData,
      date: selectedDate
    };
    
    const savedEntry = await saveEntry(dataToSave);
    
    if (savedEntry) {
      // Update the current entry to the saved one
      updateCurrentEntry(savedEntry);
    }
  };

  // Determine whether to show the example entry
  const showDummyEntry = entries.length === 0 && !loading;

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

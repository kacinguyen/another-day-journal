
import { useState, useCallback } from "react";
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { format } from "date-fns";

/**
 * A hook to manage the current journal entry state
 */
export function useCurrentEntry() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentEntry, setCurrentEntry] = useState<JournalEntryData | null>(null);

  /**
   * Update the current entry
   */
  const updateCurrentEntry = useCallback((entry: JournalEntryData | null | undefined) => {
    setCurrentEntry(entry || null);
  }, []);

  /**
   * Handle date selection
   * 
   * @param date The selected date
   * @param entries The list of journal entries
   * @param findEntryForDate Function to find an entry for a specific date
   */
  const handleDateSelect = useCallback(
    (
      date: Date | undefined,
      entries: JournalEntryData[],
      findEntryForDate: (entries: JournalEntryData[], date: Date) => JournalEntryData | undefined
    ) => {
      if (!date) return;
      
      setSelectedDate(date);
      
      const entry = findEntryForDate(entries, date);
      updateCurrentEntry(entry);
    },
    [updateCurrentEntry]
  );

  /**
   * Handle entry click from the list
   * 
   * @param entry The clicked journal entry
   */
  const handleEntryClick = useCallback((entry: JournalEntryData) => {
    setSelectedDate(new Date(entry.date));
    updateCurrentEntry(entry);
  }, [updateCurrentEntry]);

  /**
   * Get initial data for a new entry
   */
  const getInitialData = useCallback((): JournalEntryData => {
    if (currentEntry && format(currentEntry.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) {
      return currentEntry;
    }

    // Return a new empty entry with the selected date
    const now = new Date();
    return {
      date: selectedDate,
      content: "",
      mood: null,
      energy: null,
      activities: [],
      people: [],
      eventTypes: [],
      emotions: [],
      createdAt: now,
      updatedAt: now
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

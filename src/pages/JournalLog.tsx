
import React, { useEffect } from "react";
import JournalLayout from "@/pages/journal/JournalLayout";
import JournalContent from "@/pages/journal/JournalContent";
import { useJournalLog } from "@/hooks/useJournalLog";
import { useLocation } from "react-router-dom";

/**
 * JournalLog Component
 * 
 * This page displays the journal entry form and a list of previous entries.
 * It manages the state of journal entries and handles saving new entries.
 * 
 * Features:
 * - Calendar for date selection
 * - Journal entry form for creating/editing entries
 * - List of previous entries
 * - Automatic loading of entries for selected date
 * - CSV import functionality for bulk uploading entries
 */
const JournalLog: React.FC = () => {
  const location = useLocation();
  
  const {
    entries,
    loading,
    selectedDate,
    showDummyEntry,
    handleDateSelect,
    handleSaveEntry,
    handleEntryClick,
    getInitialData,
    isLoadingContent,
    isDayWithEntry,
    setSelectedDate,
    refreshEntries,
    handleMonthChange
  } = useJournalLog();
  
  // Handle incoming selectedDate from state when navigating from insights
  useEffect(() => {
    if (location.state?.selectedDate) {
      const date = new Date(location.state.selectedDate);
      handleDateSelect(date);
      // Clean up location state to avoid reapplying on refresh
      history.replaceState({}, document.title);
    }
  }, [location.state, handleDateSelect]);
  
  // Get dates that have entries for the calendar highlighting
  const datesWithEntries = entries.map(entry => new Date(entry.date));
  
  return (
    <JournalLayout 
      title="Journal Log"
      description="Reflect on your day, record your mood, energy levels, activities, and social interactions."
    >
      <JournalContent
        entries={entries}
        loading={loading}
        selectedDate={selectedDate}
        showDummyEntry={showDummyEntry}
        handleDateSelect={handleDateSelect}
        handleSaveEntry={handleSaveEntry}
        handleEntryClick={handleEntryClick}
        getInitialData={getInitialData}
        isLoadingContent={isLoadingContent}
        datesWithEntries={datesWithEntries}
        refreshEntries={refreshEntries}
        onMonthChange={handleMonthChange}
      />
    </JournalLayout>
  );
};

export default JournalLog;


import React from "react";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalCalendar from "@/components/journal/JournalCalendar";
import PreviousEntriesList from "@/components/journal/PreviousEntriesList";
import { useJournalLog } from "@/hooks/useJournalLog";
import { format } from "date-fns";

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
 */
const JournalLog: React.FC = () => {
  const {
    entries,
    loading,
    selectedDate,
    showDummyEntry,
    handleDateSelect,
    handleSaveEntry,
    getInitialData,
    isDayWithEntry
  } = useJournalLog();
  
  // Get dates that have entries for the calendar highlighting
  const datesWithEntries = entries.map(entry => new Date(entry.date));
  
  return (
    <div className="page-container animate-fade-up">
      <div className="space-y-1 mb-8">
        <div className="inline-block">
          <span className="text-xs font-medium text-journal-accent-foreground bg-journal-accent/10 px-2 py-0.5 rounded-full">Today</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Journal Log</h1>
        <p className="text-muted-foreground max-w-2xl">
          Reflect on your day, record your mood, energy levels, activities, and social interactions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Previous Entries Section */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="space-y-6">
            {/* Calendar Card */}
            <JournalCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              datesWithEntries={datesWithEntries}
            />
            
            {/* Previous Entries Card */}
            <PreviousEntriesList
              entries={entries}
              loading={loading}
              showDummyEntry={showDummyEntry}
            />
          </div>
        </div>
        
        {/* Journal Entry Form Section */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div id="journal-form">
            <JournalEntry 
              onSave={handleSaveEntry} 
              initialData={getInitialData()} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalLog;

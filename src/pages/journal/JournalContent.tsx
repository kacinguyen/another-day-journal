
import React from "react";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalCalendar from "@/components/journal/JournalCalendar";
import PreviousEntriesList from "@/components/journal/PreviousEntriesList";
import { JournalEntryData } from "@/components/journal/types/journal-types";

interface JournalContentProps {
  entries: JournalEntryData[];
  loading: boolean;
  selectedDate: Date;
  showDummyEntry: boolean;
  handleDateSelect: (date: Date | undefined) => void;
  handleSaveEntry: (data: JournalEntryData) => void;
  handleEntryClick: (entry: JournalEntryData) => void;
  getInitialData: () => JournalEntryData;
  datesWithEntries: Date[];
  refreshEntries: () => void;
}

/**
 * JournalContent Component
 * 
 * Main content area for the Journal Log page
 * Displays the calendar, entry form, and previous entries list
 */
const JournalContent: React.FC<JournalContentProps> = ({
  entries,
  loading,
  selectedDate,
  showDummyEntry,
  handleDateSelect,
  handleSaveEntry,
  handleEntryClick,
  getInitialData,
  datesWithEntries
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Previous Entries Section */}
      <div className="lg:col-span-4 order-2 lg:order-1">
        <div className="space-y-6">
          {/* Calendar Card */}
          <JournalCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            datesWithEntries={datesWithEntries}
            entries={entries}
          />
          
          {/* Previous Entries Card */}
          <PreviousEntriesList
            entries={entries}
            loading={loading}
            showDummyEntry={showDummyEntry}
            onEntryClick={handleEntryClick}
          />
        </div>
      </div>
      
      {/* Journal Entry Form Section */}
      <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col space-y-6">
        <div id="journal-form" className="w-full max-w-3xl mx-auto">
          <JournalEntry 
            onSave={handleSaveEntry} 
            initialData={getInitialData()} 
          />
        </div>
      </div>
    </div>
  );
};

export default JournalContent;

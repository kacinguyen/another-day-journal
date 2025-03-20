
import React from "react";
import JournalEntry from "@/components/journal/JournalEntry";
import JournalCalendar from "@/components/journal/JournalCalendar";
import PreviousEntriesList from "@/components/journal/PreviousEntriesList";
import ImportCsv from "@/components/journal/ImportCsv";
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { Card } from "@/components/ui/card";

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
  datesWithEntries,
  refreshEntries
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
        
        {/* Import CSV Card - now with the same width constraints as the journal form */}
        <Card className="w-full max-w-3xl mx-auto border rounded-md p-4">
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-medium">Import Journal Entries</h3>
            <ImportCsv onImportComplete={refreshEntries} />
            <p className="text-xs text-muted-foreground">
              Import journal entries from a CSV file. The CSV must include at least
              "date" and "mood" columns.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JournalContent;

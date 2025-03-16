
import React from "react";
import { Card } from "@/components/ui/card";
import JournalEntriesTable from "@/components/journal/JournalEntriesTable";
import ExampleJournalEntry from "@/components/journal/ExampleJournalEntry";
import { JournalEntryData } from "@/components/journal/JournalEntry";

interface PreviousEntriesListProps {
  entries: JournalEntryData[];
  loading: boolean;
  showDummyEntry: boolean;
}

/**
 * PreviousEntriesList Component
 * 
 * Displays a list of previous journal entries
 * Shows a dummy entry when no entries exist
 */
const PreviousEntriesList: React.FC<PreviousEntriesListProps> = ({
  entries,
  loading,
  showDummyEntry
}) => {
  return (
    <Card className="border rounded-lg p-4 bg-card shadow-sm h-full">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Previous Entries</h2>
        
        {entries.length > 0 ? (
          <JournalEntriesTable entries={entries} />
        ) : (
          <div>
            {showDummyEntry ? (
              <ExampleJournalEntry />
            ) : (
              <div className="text-sm text-muted-foreground">
                {loading ? "Loading entries..." : "Your previous journal entries will appear here."}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PreviousEntriesList;

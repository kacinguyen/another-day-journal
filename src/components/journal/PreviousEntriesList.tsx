
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import JournalEntriesTable from "@/components/journal/JournalEntriesTable";
import ExampleJournalEntry from "@/components/journal/ExampleJournalEntry";
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface PreviousEntriesListProps {
  entries: JournalEntryData[];
  loading: boolean;
  showDummyEntry: boolean;
  onEntryClick?: (entry: JournalEntryData) => void;
}

/**
 * PreviousEntriesList Component
 * 
 * Displays a list of previous journal entries
 * Shows a dummy entry when no entries exist
 * Initially shows only the 3 most recent entries
 * Includes a "See more" button to load additional entries
 */
const PreviousEntriesList: React.FC<PreviousEntriesListProps> = ({
  entries,
  loading,
  showDummyEntry,
  onEntryClick
}) => {
  // State to track how many entries to display
  const [displayCount, setDisplayCount] = useState(3);
  
  // Handler for the "See more" button
  const handleSeeMore = () => {
    setDisplayCount(prevCount => prevCount + 3);
  };
  
  // Get only the entries we want to display
  const displayedEntries = entries.slice(0, displayCount);
  
  // Check if we have more entries to show
  const hasMoreEntries = entries.length > displayCount;

  return (
    <Card className="border rounded-lg p-4 bg-card shadow-sm h-full flex flex-col max-h-[calc(100vh-15rem)] overflow-hidden">
      <div className="space-y-4 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold">Previous Entries</h2>
        
        {entries.length > 0 ? (
          <div className="space-y-4">
            <JournalEntriesTable 
              entries={displayedEntries} 
              onEntryClick={onEntryClick} 
            />
            
            {hasMoreEntries && displayCount < 6 && (
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={handleSeeMore}
                  className="text-sm flex items-center gap-1"
                >
                  See more <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {displayCount > 3 && (
              <div className="text-sm text-muted-foreground text-center p-2 bg-muted/30 rounded-md">
                Use the calendar to find and view your past entries
              </div>
            )}
          </div>
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

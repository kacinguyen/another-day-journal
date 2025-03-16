
import React, { useState, useEffect } from "react";
import JournalEntry, { JournalEntryData } from "@/components/journal/JournalEntry";
import { useToast } from "@/hooks/use-toast";
import { getJournalEntries, saveJournalEntries } from "@/utils/journalUtils";
import JournalEntriesTable from "@/components/journal/JournalEntriesTable";
import ExampleJournalEntry from "@/components/journal/ExampleJournalEntry";

/**
 * JournalLog Component
 * 
 * This page displays the journal entry form and a list of previous entries.
 * It manages the state of journal entries and handles saving new entries.
 */
const JournalLog: React.FC = () => {
  // State for journal entries and loading status
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load journal entries from localStorage on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntries(getJournalEntries());
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handles saving a new journal entry or updating an existing one
   */
  const handleSaveEntry = (entryData: JournalEntryData) => {
    const newEntry = {
      ...entryData,
      id: entryData.id || Date.now().toString(),
    };
    
    const updatedEntries = entryData.id
      ? entries.map(entry => (entry.id === entryData.id ? newEntry : entry))
      : [newEntry, ...entries];
    
    setEntries(updatedEntries);
    saveJournalEntries(updatedEntries);
    
    toast({
      title: entryData.id ? "Entry Updated" : "Entry Created",
      description: "Your journal entry has been saved successfully.",
    });
  };

  // Determine whether to show the example entry
  const showDummyEntry = entries.length === 0 && !loading;

  return (
    <div className="page-container animate-fade-up">
      <div className="space-y-1 mb-8">
        <div className="inline-block">
          <span className="text-xs font-medium text-journal-accent-foreground bg-journal-accent/10 px-2 py-0.5 rounded-full">
            Today's Entry
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Journal Log</h1>
        <p className="text-muted-foreground max-w-2xl">
          Reflect on your day, record your mood, energy levels, activities, and social interactions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Previous Entries Section */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="border rounded-lg p-6 bg-card shadow-sm h-full">
            <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
            
            {entries.length > 0 ? (
              <JournalEntriesTable entries={entries} />
            ) : (
              <div>
                {showDummyEntry ? (
                  <ExampleJournalEntry />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Your previous journal entries will appear here.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Journal Entry Form Section */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div id="journal-form">
            <JournalEntry onSave={handleSaveEntry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalLog;

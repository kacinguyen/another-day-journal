import React, { useState, useEffect } from "react";
import JournalEntry, { JournalEntryData } from "@/components/journal/JournalEntry";
import { useToast } from "@/hooks/use-toast";
import { getJournalEntries, saveJournalEntries } from "@/utils/journalUtils";
import JournalEntriesTable from "@/components/journal/JournalEntriesTable";
import ExampleJournalEntry from "@/components/journal/ExampleJournalEntry";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    toast
  } = useToast();

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
      id: entryData.id || Date.now().toString()
    };
    const updatedEntries = entryData.id ? entries.map(entry => entry.id === entryData.id ? newEntry : entry) : [newEntry, ...entries];
    setEntries(updatedEntries);
    saveJournalEntries(updatedEntries);
    toast({
      title: entryData.id ? "Entry Updated" : "Entry Created",
      description: "Your journal entry has been saved successfully."
    });
  };

  /**
   * Find an entry for the selected date or return undefined if none exists
   */
  const findEntryForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entries.find(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === dateString;
    });
  };

  /**
   * Handle date selection in the calendar
   */
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const entry = findEntryForDate(date);
    if (entry) {
      // Scroll to the entry form
      const journalForm = document.getElementById('journal-form');
      if (journalForm) {
        journalForm.scrollIntoView({
          behavior: 'smooth'
        });
      }
      toast({
        title: "Journal Entry Found",
        description: `Found entry for ${format(date, 'MMMM d, yyyy')}`
      });
    }
  };

  // Highlight dates that have journal entries
  const isDayWithEntry = (day: Date) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

  // Determine whether to show the example entry
  const showDummyEntry = entries.length === 0 && !loading;
  return <div className="page-container animate-fade-up">
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
            <Card className="border rounded-lg p-4 bg-card shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Journal Calendar</h2>
                <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} className="rounded-md bg-white mx-auto w-full" modifiers={{
                hasEntry: entries.map(entry => new Date(entry.date))
              }} modifiersStyles={{
                hasEntry: {
                  fontWeight: 'bold',
                  border: '2px solid currentColor',
                  color: 'var(--primary)'
                }
              }} />
              </div>
            </Card>
            
            {/* Previous Entries Card */}
            <Card className="border rounded-lg p-4 bg-card shadow-sm h-full">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Previous Entries</h2>
                
                {entries.length > 0 ? <JournalEntriesTable entries={entries} /> : <div>
                    {showDummyEntry ? <ExampleJournalEntry /> : <div className="text-sm text-muted-foreground">
                        Your previous journal entries will appear here.
                      </div>}
                  </div>}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Journal Entry Form Section */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div id="journal-form">
            <JournalEntry onSave={handleSaveEntry} initialData={findEntryForDate(selectedDate)} />
          </div>
        </div>
      </div>
    </div>;
};
export default JournalLog;
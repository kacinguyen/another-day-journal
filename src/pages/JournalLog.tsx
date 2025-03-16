import React, { useState, useEffect } from "react";
import JournalEntry, { JournalEntryData } from "@/components/journal/JournalEntry";
import { useToast } from "@/hooks/use-toast";
import JournalEntriesTable from "@/components/journal/JournalEntriesTable";
import ExampleJournalEntry from "@/components/journal/ExampleJournalEntry";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fetchJournalEntries, saveJournalEntry } from "@/services/journalService";
import { useAuth } from "@/context/AuthContext";

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
  const [currentEntry, setCurrentEntry] = useState<JournalEntryData | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load journal entries from Supabase when the component mounts or user changes
  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;
      
      setLoading(true);
      const journalEntries = await fetchJournalEntries();
      setEntries(journalEntries);
      
      // Set the initial entry for today's date
      const todayEntry = findEntryForDate(new Date());
      updateCurrentEntry(todayEntry);
      
      setLoading(false);
    };

    loadEntries();
  }, [user]);

  /**
   * Update the current entry state based on selected date
   */
  const updateCurrentEntry = (entry: JournalEntryData | undefined) => {
    if (entry) {
      // Use the existing entry
      setCurrentEntry(entry);
    } else {
      // Create a new empty entry for the selected date
      setCurrentEntry(undefined);
    }
  };

  /**
   * Handles saving a new journal entry or updating an existing one
   */
  const handleSaveEntry = async (entryData: JournalEntryData) => {
    const savedEntry = await saveJournalEntry(entryData);
    
    if (savedEntry) {
      // Update the entries list
      const updatedEntries = entryData.id
        ? entries.map(entry => entry.id === entryData.id ? savedEntry : entry)
        : [savedEntry, ...entries];
      
      // Make sure entries are unique by date
      const uniqueEntries = new Map<string, JournalEntryData>();
      updatedEntries.forEach(entry => {
        const dateString = format(entry.date, 'yyyy-MM-dd');
        if (!uniqueEntries.has(dateString) || 
            entry.date > uniqueEntries.get(dateString)!.date) {
          uniqueEntries.set(dateString, entry);
        }
      });
      
      const finalEntries = Array.from(uniqueEntries.values())
        .sort((a, b) => b.date.getTime() - a.date.getTime());
        
      setEntries(finalEntries);
      setCurrentEntry(savedEntry);
      
      toast({
        title: entryData.id ? "Entry Updated" : "Entry Created",
        description: "Your journal entry has been saved successfully."
      });
    }
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
    
    // Update the selected date
    setSelectedDate(date);
    
    // Find an entry for this date or create a new empty one
    const entry = findEntryForDate(date);
    updateCurrentEntry(entry);
    
    // If an entry exists, show a toast notification
    if (entry) {
      toast({
        title: "Journal Entry Found",
        description: `Loaded entry for ${format(date, 'MMMM d, yyyy')}`
      });
    } else {
      toast({
        title: "New Journal Entry",
        description: `Create a new entry for ${format(date, 'MMMM d, yyyy')}`
      });
    }
    
    // Scroll to the entry form
    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
      journalForm.scrollIntoView({
        behavior: 'smooth'
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
  
  // Prepare the initial data for the journal entry form
  const getInitialData = () => {
    if (currentEntry) {
      return currentEntry;
    }
    
    // Return a new empty entry with the selected date
    return {
      date: selectedDate,
      content: "",
      mood: null,
      energy: 50,
      activities: [],
      people: [],
      eventTypes: [],
      emotions: []
    };
  };
  
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
            <Card className="border rounded-lg p-4 bg-card shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Calendar</h2>
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={handleDateSelect} 
                  className="rounded-md bg-white mx-auto w-full pointer-events-auto" 
                  modifiers={{
                    hasEntry: entries.map(entry => new Date(entry.date))
                  }} 
                  modifiersStyles={{
                    hasEntry: {
                      fontWeight: 'bold',
                      border: '2px solid currentColor',
                      color: 'var(--primary)'
                    }
                  }} 
                />
              </div>
            </Card>
            
            {/* Previous Entries Card */}
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

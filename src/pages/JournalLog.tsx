
import React, { useState, useEffect } from "react";
import JournalEntry, { JournalEntryData } from "@/components/journal/JournalEntry";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

// Mock function to get entries - would be replaced by actual API call
const getJournalEntries = (): JournalEntryData[] => {
  const savedEntries = localStorage.getItem("journalEntries");
  return savedEntries ? JSON.parse(savedEntries) : [];
};

// Mock function to save entries - would be replaced by actual API call
const saveJournalEntries = (entries: JournalEntryData[]) => {
  localStorage.setItem("journalEntries", JSON.stringify(entries));
};

const JournalLog = () => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setEntries(getJournalEntries());
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Function to get a mood emoji based on the mood type
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "great": return "😄";
      case "good": return "🙂";
      case "neutral": return "😐";
      case "bad": return "🙁";
      case "awful": return "😞";
      default: return "❓";
    }
  };

  return (
    <div className="page-container animate-fade-up">
      <div className="flex flex-col gap-8">
        <div className="space-y-1">
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
        
        <JournalEntry onSave={handleSaveEntry} />
        
        {entries.length > 0 ? (
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
            
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Mood</TableHead>
                      <TableHead>Energy</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Activities</TableHead>
                      <TableHead>People</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {getMoodEmoji(entry.mood)} {entry.mood}
                          </span>
                        </TableCell>
                        <TableCell>{entry.energy}%</TableCell>
                        <TableCell className="max-w-xs truncate">{entry.content}</TableCell>
                        <TableCell>{entry.activities.join(", ")}</TableCell>
                        <TableCell>{entry.people.join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        ) : (
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
            <div className="text-sm text-muted-foreground">
              Your previous journal entries will appear here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalLog;

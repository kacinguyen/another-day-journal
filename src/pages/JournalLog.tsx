
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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  PartyPopper, 
  UtensilsCrossed, 
  Coffee, 
  Home, 
  Film, 
  Book, 
  Music, 
  Gamepad, 
  ShoppingBag, 
  TreeDeciduous,
  Calendar 
} from "lucide-react";

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

  // Function to get an event icon based on the event type
  const getEventIcon = (eventType: string | null) => {
    if (!eventType) return null;
    
    switch (eventType) {
      case "party": return <PartyPopper className="h-4 w-4" />;
      case "restaurant": return <UtensilsCrossed className="h-4 w-4" />;
      case "cafe": return <Coffee className="h-4 w-4" />;
      case "home": return <Home className="h-4 w-4" />;
      case "movie": return <Film className="h-4 w-4" />;
      case "reading": return <Book className="h-4 w-4" />;
      case "music": return <Music className="h-4 w-4" />;
      case "gaming": return <Gamepad className="h-4 w-4" />;
      case "shopping": return <ShoppingBag className="h-4 w-4" />;
      case "outdoors": return <TreeDeciduous className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

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
        <div className="lg:col-span-5 order-2 lg:order-1">
          <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
          
          {entries.length > 0 ? (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Mood</TableHead>
                      <TableHead>Energy</TableHead>
                      <TableHead>Event</TableHead>
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
                        <TableCell>
                          {entry.eventType && (
                            <div className="flex items-center gap-1.5">
                              {getEventIcon(entry.eventType)}
                              <span className="capitalize">{entry.eventType}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{entry.content}</TableCell>
                        <TableCell>{entry.activities.join(", ")}</TableCell>
                        <TableCell>{entry.people.join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <div className="text-sm text-muted-foreground">
              Your previous journal entries will appear here.
            </div>
          )}
        </div>
        
        <div className="lg:col-span-7 order-1 lg:order-2">
          <JournalEntry onSave={handleSaveEntry} />
        </div>
      </div>
    </div>
  );
};

export default JournalLog;

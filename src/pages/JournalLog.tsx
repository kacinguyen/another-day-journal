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
import { Badge } from "@/components/ui/badge";
import { 
  PartyPopper, 
  UtensilsCrossed, 
  Coffee, 
  Home, 
  ShoppingBag, 
  TreeDeciduous,
  Calendar,
  Briefcase,
  Plane,
  Users,
  Tag,
  Zap,
  Thermometer,
  BatteryLow,
  Trophy,
  AlertTriangle,
  Sparkles,
  Heart,
  Cloud,
  Smile,
  Check
} from "lucide-react";

const getJournalEntries = (): JournalEntryData[] => {
  const savedEntries = localStorage.getItem("journalEntries");
  return savedEntries ? JSON.parse(savedEntries) : [];
};

const saveJournalEntries = (entries: JournalEntryData[]) => {
  localStorage.setItem("journalEntries", JSON.stringify(entries));
};

const JournalLog = () => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "party": return <PartyPopper className="h-4 w-4" />;
      case "restaurant": return <UtensilsCrossed className="h-4 w-4" />;
      case "cafe": return <Coffee className="h-4 w-4" />;
      case "home": return <Home className="h-4 w-4" />;
      case "shopping": return <ShoppingBag className="h-4 w-4" />;
      case "outdoors": return <TreeDeciduous className="h-4 w-4" />;
      case "office": return <Briefcase className="h-4 w-4" />;
      case "workFromHome": return <Home className="h-4 w-4" />;
      case "travel": return <Plane className="h-4 w-4" />;
      case "hangout": return <Users className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />; // Use Tag icon for custom event types
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "excited": return <Zap className="h-4 w-4" />;
      case "stressed": return <Thermometer className="h-4 w-4" />;
      case "tired": return <BatteryLow className="h-4 w-4" />;
      case "proud": return <Trophy className="h-4 w-4" />;
      case "anxious": return <AlertTriangle className="h-4 w-4" />;
      case "bored": return <Coffee className="h-4 w-4" />;
      case "enthusiastic": return <Sparkles className="h-4 w-4" />;
      case "grateful": return <Heart className="h-4 w-4" />;
      case "depressed": return <Cloud className="h-4 w-4" />;
      case "happy": return <Smile className="h-4 w-4" />;
      case "content": return <Check className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
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
      
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[600px] rounded-lg border"
      >
        {/* Journal Entry Panel - 75% */}
        <ResizablePanel defaultSize={75} minSize={40}>
          <div className="p-6">
            <JournalEntry onSave={handleSaveEntry} />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Previous Entries Panel - 25% */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
            
            {entries.length > 0 ? (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Mood</TableHead>
                        <TableHead>Emotions</TableHead>
                        <TableHead>Energy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              {getMoodEmoji(entry.mood)} {entry.mood}
                            </span>
                          </TableCell>
                          <TableCell>
                            {entry.emotions && entry.emotions.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {entry.emotions.slice(0, 2).map(emotion => (
                                  <Badge 
                                    key={emotion} 
                                    variant="outline" 
                                    className="flex items-center gap-1 py-0.5 text-xs"
                                  >
                                    {getEmotionIcon(emotion)}
                                    <span className="capitalize">{emotion}</span>
                                  </Badge>
                                ))}
                                {entry.emotions.length > 2 && (
                                  <Badge variant="outline" className="py-0.5 text-xs">
                                    +{entry.emotions.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">None</span>
                            )}
                          </TableCell>
                          <TableCell>{entry.energy}%</TableCell>
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default JournalLog;

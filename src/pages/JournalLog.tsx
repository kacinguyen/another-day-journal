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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Check,
  ArrowRight
} from "lucide-react";

const getJournalEntries = (): JournalEntryData[] => {
  const savedEntries = localStorage.getItem("journalEntries");
  return savedEntries ? JSON.parse(savedEntries) : [];
};

const saveJournalEntries = (entries: JournalEntryData[]) => {
  localStorage.setItem("journalEntries", JSON.stringify(entries));
};

const dummyEntry: JournalEntryData = {
  id: "dummy-entry",
  date: new Date().toISOString(),
  mood: "good",
  emotions: ["grateful", "happy", "content"],
  energy: 85,
  eventTypes: ["cafe", "outdoors"],
  content: "Today was a great day. I went for a morning coffee and then had a relaxing walk in the park.",
  activities: ["Reading", "Walking"],
  people: ["Alex", "Sam"]
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
      default: return <Tag className="h-4 w-4" />;
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
                      <TableHead>Emotions</TableHead>
                      <TableHead>Energy</TableHead>
                      <TableHead>Events</TableHead>
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
                        <TableCell>
                          {entry.emotions && entry.emotions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {entry.emotions.map(emotion => (
                                <Badge 
                                  key={emotion} 
                                  variant="outline" 
                                  className="flex items-center gap-1 py-0.5 text-xs"
                                >
                                  {getEmotionIcon(emotion)}
                                  <span className="capitalize">{emotion}</span>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </TableCell>
                        <TableCell>{entry.energy}%</TableCell>
                        <TableCell>
                          {entry.eventTypes && entry.eventTypes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {entry.eventTypes.map(eventType => (
                                <Badge 
                                  key={eventType} 
                                  variant="outline" 
                                  className="flex items-center gap-1 py-0.5 text-xs"
                                >
                                  {getEventIcon(eventType)}
                                  <span className="capitalize">{eventType}</span>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
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
            <div>
              {showDummyEntry ? (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">Example Entry</CardTitle>
                    <CardDescription>Here's what your journal entries will look like</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Date</h3>
                        <p>{format(new Date(dummyEntry.date), 'MMM dd, yyyy')}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Mood</h3>
                        <span className="flex items-center gap-1">
                          {getMoodEmoji(dummyEntry.mood)} {dummyEntry.mood}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Emotions</h3>
                        <div className="flex flex-wrap gap-1">
                          {dummyEntry.emotions.map(emotion => (
                            <Badge 
                              key={emotion} 
                              variant="outline" 
                              className="flex items-center gap-1 py-0.5 text-xs"
                            >
                              {getEmotionIcon(emotion)}
                              <span className="capitalize">{emotion}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Energy</h3>
                        <p>{dummyEntry.energy}%</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Events</h3>
                        <div className="flex flex-wrap gap-1">
                          {dummyEntry.eventTypes.map(eventType => (
                            <Badge 
                              key={eventType} 
                              variant="outline" 
                              className="flex items-center gap-1 py-0.5 text-xs"
                            >
                              {getEventIcon(eventType)}
                              <span className="capitalize">{eventType}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Content</h3>
                        <p>{dummyEntry.content}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Activities</h3>
                        <p>{dummyEntry.activities.join(", ")}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">People</h3>
                        <p>{dummyEntry.people.join(", ")}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => document.getElementById('journal-form')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Create Your First Entry <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Your previous journal entries will appear here.
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div id="journal-form">
            <JournalEntry onSave={handleSaveEntry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalLog;

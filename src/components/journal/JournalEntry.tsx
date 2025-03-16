
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MoodPicker from "./MoodPicker";
import EnergyTracker from "./EnergyTracker";
import ActivitySelector from "./ActivitySelector";
import SocialTracker from "./SocialTracker";
import EventTracker, { EventType } from "./EventTracker";
import EmotionTracker, { EmotionType } from "./EmotionTracker";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export type MoodType = "great" | "good" | "neutral" | "bad" | "awful";

export interface JournalEntryData {
  id?: string;
  date: Date;
  content: string;
  mood: MoodType;
  energy: number;
  activities: string[];
  people: string[];
  eventTypes: EventType[];
  emotions: EmotionType[];
}

interface JournalEntryProps {
  onSave: (data: JournalEntryData) => void;
  initialData?: Partial<JournalEntryData>;
}

const JournalEntry: React.FC<JournalEntryProps> = ({
  onSave,
  initialData = {}
}) => {
  const [date, setDate] = useState<Date>(initialData.date || new Date());
  const [content, setContent] = useState(initialData.content || "");
  const [mood, setMood] = useState<MoodType>(initialData.mood || "neutral");
  const [energy, setEnergy] = useState(initialData.energy || 50);
  const [activities, setActivities] = useState<string[]>(initialData.activities || []);
  const [people, setPeople] = useState<string[]>(initialData.people || []);
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialData.eventTypes || []);
  const [emotions, setEmotions] = useState<EmotionType[]>(initialData.emotions || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddActivity = (activity: string) => {
    setActivities([...activities, activity]);
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleAddPerson = (person: string) => {
    setPeople([...people, person]);
  };

  const handleRemovePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (content.trim() === "") return;
    
    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      onSave({
        id: initialData.id,
        date,
        content,
        mood,
        energy,
        activities,
        people,
        eventTypes,
        emotions
      });
      
      setIsSaving(false);
      
      // Display animation effect on save success
      const saveButton = document.getElementById("save-button");
      if (saveButton) {
        saveButton.classList.add("animate-pulse");
        setTimeout(() => {
          saveButton.classList.remove("animate-pulse");
        }, 1000);
      }
    }, 600);
  };

  return (
    <Card className="glass-card w-full max-w-3xl mx-auto overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Journal Entry
              </h2>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 pl-3 text-left font-normal flex items-center"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="rounded-md bg-white p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="relative">
              <Label htmlFor="content" className="sr-only">Journal Content</Label>
              <Textarea
                id="content"
                placeholder="What's on your mind today? How was your day?"
                className="min-h-40 resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 opacity-50 text-xs">
                {content.length} characters
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MoodPicker value={mood} onChange={setMood} />
              <EmotionTracker values={emotions} onChange={setEmotions} />
              <EnergyTracker value={energy} onChange={setEnergy} />
            </div>
            
            <div className="space-y-6">
              <EventTracker values={eventTypes} onChange={setEventTypes} />
              <ActivitySelector
                activities={activities}
                onAddActivity={handleAddActivity}
                onRemoveActivity={handleRemoveActivity}
              />
              <SocialTracker
                people={people}
                onAddPerson={handleAddPerson}
                onRemovePerson={handleRemovePerson}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button
              id="save-button"
              onClick={handleSave}
              disabled={content.trim() === "" || isSaving}
              className="relative overflow-hidden transition-all duration-300"
            >
              <div className="flex items-center gap-1.5">
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Entry"}</span>
              </div>
              {isSaving && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-1 w-full absolute bottom-0 left-0 bg-white/20 animate-pulse"></span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalEntry;

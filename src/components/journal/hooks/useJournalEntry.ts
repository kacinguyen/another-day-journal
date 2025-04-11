
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { JournalEntryData } from "../types/journal-types";
import { MoodType } from "../MoodPicker";
import { EventType } from "../event/types";
import { EmotionType } from "../types/emotion-types";

/**
 * Custom hook to manage journal entry state and operations
 */
export const useJournalEntry = (
  initialData: JournalEntryData,
  onSave: (data: JournalEntryData) => void
) => {
  const [date, setDate] = useState<Date>(initialData.date || new Date());
  const [content, setContent] = useState(initialData.content || "");
  const [mood, setMood] = useState<MoodType>(initialData.mood || null);
  const [energy, setEnergy] = useState<number | null>(initialData.energy !== undefined ? initialData.energy : null);
  const [activities, setActivities] = useState<string[]>(initialData.activities || []);
  const [people, setPeople] = useState<string[]>(initialData.people || []);
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialData.eventTypes || []);
  const [emotions, setEmotions] = useState<EmotionType[]>(initialData.emotions || []);
  const [isSaving, setIsSaving] = useState(false);

  // Update state when initialData changes
  useEffect(() => {
    const currentDateStr = format(date, 'yyyy-MM-dd');
    const newDateStr = format(initialData.date, 'yyyy-MM-dd');
    const isNewDate = currentDateStr !== newDateStr;
    
    if (isNewDate || initialData.id) {
      setDate(initialData.date);
      setContent(initialData.content || "");
      setMood(initialData.mood || null);
      setEnergy(initialData.energy !== undefined ? initialData.energy : null);
      setActivities(initialData.activities || []);
      setPeople(initialData.people || []);
      setEventTypes(initialData.eventTypes || []);
      setEmotions(initialData.emotions || []);
    } 
    else if (!initialData.id) {
      setDate(initialData.date);
    }
  }, [initialData]);

  // Handle activity management
  const handleAddActivity = (activity: string) => {
    setActivities([...activities, activity]);
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  // Handle people management
  const handleAddPerson = (person: string) => {
    setPeople([...people, person]);
  };

  const handleRemovePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  // Handle clear operation
  const handleClear = () => {
    // Keep the date but reset all other fields
    setContent("");
    setMood(null);
    setEnergy(null);
    setActivities([]);
    setPeople([]);
    setEventTypes([]);
    setEmotions([]);
  };

  // Handle save operation
  const handleSave = (user: any) => {
    if (!user) {
      return;
    }
    
    // Only mood is required now
    if (mood === null) return;
    
    setIsSaving(true);
    
    const entryData: JournalEntryData = {
      id: initialData.id,
      date,
      content,
      mood,
      energy,
      activities,
      people,
      eventTypes,
      emotions
    };
    
    onSave(entryData);
    
    setTimeout(() => {
      setIsSaving(false);
      
      const saveButton = document.getElementById("save-button");
      if (saveButton) {
        saveButton.classList.add("animate-pulse");
        setTimeout(() => {
          saveButton.classList.remove("animate-pulse");
        }, 1000);
      }
    }, 600);
  };

  // Check if the form is valid - only mood is required now
  const isFormValid = mood !== null;

  return {
    date,
    content,
    mood,
    energy,
    activities,
    people,
    eventTypes,
    emotions,
    isSaving,
    isFormValid,
    setContent,
    setMood,
    setEnergy,
    setEventTypes,
    setEmotions,
    handleAddActivity,
    handleRemoveActivity,
    handleAddPerson,
    handleRemovePerson,
    handleClear,
    handleSave
  };
};

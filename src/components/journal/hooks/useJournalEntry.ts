import { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { JournalEntryData } from "../types/journal-types";
import { MoodType } from "../MoodPicker";
import { EventType } from "../EventTracker";
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
  const [energy, setEnergy] = useState(initialData.energy || 50);
  const [activities, setActivities] = useState<string[]>(initialData.activities || []);
  const [people, setPeople] = useState<string[]>(initialData.people || []);
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialData.eventTypes || []);
  const [emotions, setEmotions] = useState<EmotionType[]>(initialData.emotions || []);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const isModified = useRef(false);
  const autoSaveTimerRef = useRef<number | null>(null);
  const currentEntryRef = useRef<JournalEntryData>({...initialData});

  useEffect(() => {
    const currentDateStr = format(date, 'yyyy-MM-dd');
    const newDateStr = format(initialData.date, 'yyyy-MM-dd');
    const isNewDate = currentDateStr !== newDateStr;
    
    if (isNewDate || initialData.id) {
      setDate(initialData.date);
      setContent(initialData.content || "");
      setMood(initialData.mood || null);
      setEnergy(initialData.energy || 50);
      setActivities(initialData.activities || []);
      setPeople(initialData.people || []);
      setEventTypes(initialData.eventTypes || []);
      setEmotions(initialData.emotions || []);
      
      currentEntryRef.current = {...initialData};
      
      isModified.current = false;
    } 
    else if (!initialData.id) {
      setDate(initialData.date);
    }
  }, [initialData]);

  const debouncedAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current !== null) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = window.setTimeout(() => {
      if (isModified.current && autoSaveEnabled && mood !== null) {
        handleSave(undefined, true);
        isModified.current = false;
      }
    }, 2000);
  }, [autoSaveEnabled, mood]);

  useEffect(() => {
    const entryData = {
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
    
    if (JSON.stringify(entryData) !== JSON.stringify(currentEntryRef.current)) {
      isModified.current = true;
      currentEntryRef.current = {...entryData};
      
      if (mood !== null) {
        debouncedAutoSave();
      }
    }
  }, [content, mood, energy, activities, people, eventTypes, emotions, debouncedAutoSave]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current !== null) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

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

  const handleClear = () => {
    setContent("");
    setMood(null);
    setEnergy(50);
    setActivities([]);
    setPeople([]);
    setEventTypes([]);
    setEmotions([]);
  };

  const handleSave = (user: any, isAutoSave = false) => {
    if (!isAutoSave && !user) {
      return;
    }
    
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
    setLastSaved(new Date());
    
    setTimeout(() => {
      setIsSaving(false);
      
      if (!isAutoSave) {
        const saveButton = document.getElementById("save-button");
        if (saveButton) {
          saveButton.classList.add("animate-pulse");
          setTimeout(() => {
            saveButton.classList.remove("animate-pulse");
          }, 1000);
        }
      }
    }, 600);
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };

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
    autoSaveEnabled,
    lastSaved,
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
    handleSave,
    toggleAutoSave
  };
};

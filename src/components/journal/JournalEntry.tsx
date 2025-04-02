
import React, { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useJournalEntry } from "./hooks/useJournalEntry";
import EntryHeader from "./entry/EntryHeader";
import EntryContent from "./entry/EntryContent";
import TrackerLeftColumn from "./entry/TrackerLeftColumn";
import TrackerRightColumn from "./entry/TrackerRightColumn";
import SaveButton from "./entry/SaveButton";
import ClearButton from "./entry/ClearButton";
import { JournalEntryProps } from "./types/journal-types";

// Reexport JournalEntryData type for backward compatibility
export type { JournalEntryData } from "./types/journal-types";

/**
 * JournalEntry Component
 * 
 * Main component for creating and editing journal entries.
 * Handles user input for various aspects of a journal entry including:
 * - Text content
 * - Mood selection
 * - Energy level tracking
 * - Emotion selection
 * - Activities
 * - Social interactions
 * - Events
 * 
 * The component manages state through the useJournalEntry hook and
 * provides a unified interface for saving entries.
 * 
 * Features:
 * - Auto-save functionality that saves changes after 2 seconds of inactivity
 * - Manual save button
 * - Form validation
 */
const JournalEntry: React.FC<JournalEntryProps> = ({
  onSave,
  initialData
}) => {
  const { user } = useAuth();
  
  const {
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
    handleSave
  } = useJournalEntry(initialData, onSave);
  
  // Memoize the save handler
  const handleSaveWithUser = useCallback(() => {
    handleSave(user);
  }, [handleSave, user]);
  
  return (
    <Card className="w-full max-w-3xl mx-auto border rounded-lg p-4 bg-card shadow-sm">
      <CardContent className="space-y-6 p-0">
        <div className="space-y-6">
          <div className="space-y-2">
            <EntryHeader date={date} />
            
            <EntryContent 
              content={content}
              onChange={setContent}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrackerLeftColumn
              mood={mood}
              emotions={emotions}
              energy={energy}
              onMoodChange={setMood}
              onEmotionsChange={setEmotions}
              onEnergyChange={setEnergy}
            />
            
            <TrackerRightColumn
              eventTypes={eventTypes}
              activities={activities}
              people={people}
              onEventTypesChange={setEventTypes}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onAddPerson={handleAddPerson}
              onRemovePerson={handleRemovePerson}
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <ClearButton 
              onClear={handleClear}
              disabled={!content && !mood && energy === 50 && activities.length === 0 && 
                       people.length === 0 && eventTypes.length === 0 && emotions.length === 0}
            />
            <SaveButton
              onClick={handleSaveWithUser}
              disabled={!isFormValid || isSaving || !user}
              isSaving={isSaving}
              autoSaveEnabled={autoSaveEnabled}
              lastSaved={lastSaved}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalEntry;

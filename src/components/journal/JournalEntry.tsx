
import React, { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useJournalEntry } from "./hooks/useJournalEntry";
import EntryHeader from "./entry/EntryHeader";
import EntryContent from "./entry/EntryContent";
import TrackerLeftColumn from "./entry/TrackerLeftColumn";
import TrackerRightColumn from "./entry/TrackerRightColumn";
import SaveButton from "./entry/SaveButton";
import ClearButton from "./entry/ClearButton";
import GenerateImageButton from "./entry/GenerateImageButton";
import { JournalEntryProps } from "./types/journal-types";

// Reexport JournalEntryData type for backward compatibility
export type { JournalEntryData } from "./types/journal-types";

const JournalEntry: React.FC<JournalEntryProps> = ({
  onSave,
  initialData,
  isLoadingContent: isLoadingContentProp
}) => {
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
    isLoadingContent,
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
  } = useJournalEntry(initialData, onSave, isLoadingContentProp);

  const handleSaveClick = useCallback(() => {
    handleSave();
  }, [handleSave]);

  return (
    <Card className="w-full max-w-3xl mx-auto border rounded-lg p-4 bg-card shadow-sm">
      <CardContent className="space-y-6 p-0">
        <div className="space-y-6">
          <div className="space-y-2">
            <EntryHeader date={date} />

            <EntryContent
              content={content}
              onChange={setContent}
              isLoading={isLoadingContent}
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

          <div className="flex justify-between items-center pt-2">
            <ClearButton
              onClear={handleClear}
              disabled={!content && !mood && (energy === null || energy === 50) && activities.length === 0 &&
                       people.length === 0 && eventTypes.length === 0 && emotions.length === 0}
            />
            <div className="flex items-center gap-2">
              <GenerateImageButton
                content={content}
                mood={mood ?? undefined}
                activities={activities}
                emotions={emotions}
              />
              <SaveButton
                onClick={handleSaveClick}
                disabled={!isFormValid || isSaving}
                isSaving={isSaving}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalEntry;

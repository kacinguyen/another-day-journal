
import React, { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { EventType, EventOption } from "./event/types";
import { useEventTags } from "./event/useEventTags";
import EventOptionTag from "./event/EventOptionTag";
import AddTagInput from "./event/AddTagInput";

interface EventTrackerProps {
  values: EventType[];
  onChange: (values: EventType[]) => void;
}

/**
 * EventTracker Component
 * 
 * Allows users to select event types and create custom event tags
 */
const EventTracker: React.FC<EventTrackerProps> = ({ values, onChange }) => {
  const { user } = useAuth();
  
  const {
    allEventOptions,
    showInput,
    newTagName,
    addNewCustomTag,
    removeCustomTag,
    handleInputChange,
    toggleShowInput,
    resetInput
  } = useEventTags(user?.id, values);

  /**
   * Toggles an event in the selected values array
   */
  const handleToggleEvent = useCallback((event: EventType) => {
    if (values.includes(event)) {
      onChange(values.filter(v => v !== event));
    } else {
      onChange([...values, event]);
    }
  }, [values, onChange]);

  /**
   * Adds a new custom tag
   */
  const handleAddNewTag = async () => {
    if (newTagName.trim() === "" || !user?.id) return;
    
    const newTagValue = newTagName.toLowerCase().replace(/\s+/g, '');
    
    // Check if the tag already exists
    if (allEventOptions.some(option => option.value === newTagValue)) {
      // Add the existing tag if it's not already selected
      if (!values.includes(newTagValue)) {
        handleToggleEvent(newTagValue);
      }
    } else {
      const newTag = await addNewCustomTag(newTagValue, newTagName.trim());
      
      // Select the new tag
      if (newTag && !values.includes(newTag.value)) {
        handleToggleEvent(newTag.value);
      }
    }
    
    // Reset and close input
    resetInput();
  };

  /**
   * Removes a custom tag
   */
  const handleRemoveTag = async (option: EventOption, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Remove from selected values if present
    if (values.includes(option.value)) {
      onChange(values.filter(v => v !== option.value));
    }
    
    // Remove from database and UI
    await removeCustomTag(option);
  };

  /**
   * Handles keyboard events for the new tag input
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    } else if (e.key === "Escape") {
      resetInput();
    }
  };
  
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Event Tags</label>
      
      <div className="flex flex-wrap gap-2">
        {allEventOptions.map(option => (
          <EventOptionTag
            key={option.value}
            option={option}
            isSelected={values.includes(option.value)}
            onToggle={handleToggleEvent}
            onRemove={option.isCustom ? handleRemoveTag : undefined}
          />
        ))}
        
        <AddTagInput
          showInput={showInput}
          inputValue={newTagName}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onAddTag={handleAddNewTag}
          onShowInput={toggleShowInput}
        />
      </div>
    </div>
  );
};

// Re-export EventType to maintain backward compatibility
export type { EventType } from "./event/types";
export default EventTracker;

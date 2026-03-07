
import React, { useCallback } from "react";
import { EventType, EventOption } from "./event/types";
import { useEventTags } from "./event/useEventTags";
import EventOptionTag from "./event/EventOptionTag";
import AddTagInput from "./event/AddTagInput";

interface EventTrackerProps {
  values: EventType[];
  onChange: (values: EventType[]) => void;
}

const EventTracker: React.FC<EventTrackerProps> = ({ values, onChange }) => {
  const {
    allEventOptions,
    showInput,
    newTagName,
    addNewCustomTag,
    removeCustomTag,
    handleInputChange,
    toggleShowInput,
    resetInput
  } = useEventTags(values);

  const handleToggleEvent = useCallback((event: EventType) => {
    if (values.includes(event)) {
      onChange(values.filter(v => v !== event));
    } else {
      onChange([...values, event]);
    }
  }, [values, onChange]);

  const handleAddNewTag = async () => {
    if (newTagName.trim() === "") return;

    const newTagValue = newTagName.toLowerCase().replace(/\s+/g, '');

    if (allEventOptions.some(option => option.value === newTagValue)) {
      if (!values.includes(newTagValue)) {
        handleToggleEvent(newTagValue);
      }
    } else {
      const newTag = await addNewCustomTag(newTagValue, newTagName.trim());

      if (newTag && !values.includes(newTag.value)) {
        handleToggleEvent(newTag.value);
      }
    }

    resetInput();
  };

  const handleRemoveTag = async (option: EventOption, e: React.MouseEvent) => {
    e.stopPropagation();

    if (values.includes(option.value)) {
      onChange(values.filter(v => v !== option.value));
    }

    await removeCustomTag(option);
  };

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

export type { EventType } from "./event/types";
export default EventTracker;

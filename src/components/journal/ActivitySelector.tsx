
import React from "react";
import { ActivityOption, ActivityTag, AddActivityInput, useActivityTags } from "./activity";

interface ActivitySelectorProps {
  activities: string[];
  onAddActivity: (activity: string) => void;
  onRemoveActivity: (index: number) => void;
  suggestions?: string[];
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities,
  onAddActivity,
  onRemoveActivity,
  suggestions = []
}) => {
  const {
    allActivityOptions,
    showInput,
    inputValue,
    isActivitySelected,
    handleToggleActivity,
    removeCustomTag,
    addNewActivity,
    handleInputChange,
    toggleShowInput,
    handleKeyDown
  } = useActivityTags(activities);

  const onToggleActivity = (option: ActivityOption) => {
    handleToggleActivity(option, onAddActivity, onRemoveActivity);
  };

  const onRemoveTag = (option: ActivityOption, e: React.MouseEvent) => {
    removeCustomTag(option, e, onRemoveActivity);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e, onAddActivity);
  };

  const onAddNewActivity = () => {
    addNewActivity(onAddActivity);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Activities</label>

      <div className="flex flex-wrap gap-2">
        {allActivityOptions.map((option) => (
          <ActivityTag
            key={option.value}
            option={option}
            isSelected={isActivitySelected(option.value)}
            onToggle={onToggleActivity}
            onRemove={option.isCustom ? onRemoveTag : undefined}
          />
        ))}

        <AddActivityInput
          showInput={showInput}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onKeyDown={onKeyDown}
          onAddActivity={onAddNewActivity}
          onShowInput={toggleShowInput}
        />
      </div>
    </div>
  );
};

export default ActivitySelector;

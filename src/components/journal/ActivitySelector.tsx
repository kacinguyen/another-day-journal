
import React from "react";
import { ActivityOption, ActivityTag, AddActivityInput, useActivityTags } from "./activity";
import { useAuth } from "@/context/AuthContext";

interface ActivitySelectorProps {
  activities: string[];
  onAddActivity: (activity: string) => void;
  onRemoveActivity: (index: number) => void;
  suggestions?: string[];
}

/**
 * ActivitySelector Component
 * 
 * Allows users to select activities and create custom activity tags
 */
const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities,
  onAddActivity,
  onRemoveActivity,
  suggestions = [] // This parameter is currently unused but kept for API compatibility
}) => {
  const { user } = useAuth();
  
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
  } = useActivityTags(user?.id, activities);

  /**
   * Wrapper for handling the toggle of an activity
   */
  const onToggleActivity = (option: ActivityOption) => {
    handleToggleActivity(option, onAddActivity, onRemoveActivity);
  };

  /**
   * Wrapper for removing a custom tag
   */
  const onRemoveTag = (option: ActivityOption, e: React.MouseEvent) => {
    removeCustomTag(option, e, onRemoveActivity);
  };

  /**
   * Wrapper for handling key down events
   */
  const onKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e, onAddActivity);
  };

  /**
   * Wrapper for adding a new activity
   */
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

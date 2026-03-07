
import { useState, useEffect, useCallback } from "react";
import { Tag } from "lucide-react";
import { ActivityOption } from "./types";
import { DEFAULT_ACTIVITY_OPTIONS } from "./defaultOptions";

/**
 * Hook for managing activity tags
 * Custom tags are managed locally — Notion auto-creates multi-select options when entries are saved
 */
export function useActivityTags(activities: string[]) {
  const [customActivities, setCustomActivities] = useState<ActivityOption[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const allActivityOptions = [...DEFAULT_ACTIVITY_OPTIONS, ...customActivities];

  // Normalize existing activities to convert any string activities to proper option format
  useEffect(() => {
    const normalizeExistingActivities = () => {
      activities.forEach(activity => {
        const normalized = activity.toLowerCase().replace(/\s+/g, '');
        const exists = [...DEFAULT_ACTIVITY_OPTIONS, ...customActivities]
          .some(option => option.value === normalized);

        if (!exists) {
          const newCustomActivity = {
            value: normalized,
            label: activity,
            icon: <Tag className="h-4 w-4" />,
            isCustom: true
          };
          setCustomActivities(prev => [...prev, newCustomActivity]);
        }
      });
    };

    normalizeExistingActivities();
  }, []);

  const isActivitySelected = useCallback((value: string) => {
    return activities.some(
      activity =>
        activity.toLowerCase() === value.toLowerCase() ||
        activity === allActivityOptions.find(opt => opt.value === value)?.label
    );
  }, [activities, allActivityOptions]);

  const handleToggleActivity = useCallback((option: ActivityOption,
    onAddActivity: (activity: string) => void,
    onRemoveActivity: (index: number) => void) => {

    if (isActivitySelected(option.value)) {
      const indexToRemove = activities.findIndex(
        activity =>
          activity.toLowerCase() === option.value.toLowerCase() ||
          activity === option.label
      );
      if (indexToRemove >= 0) {
        onRemoveActivity(indexToRemove);
      }
    } else {
      onAddActivity(option.label);
    }
  }, [activities, isActivitySelected]);

  const removeCustomTag = useCallback(async (option: ActivityOption, e: React.MouseEvent,
    onRemoveActivity: (index: number) => void) => {
    e.stopPropagation();

    if (!option.isCustom) return;

    if (isActivitySelected(option.value)) {
      const indexToRemove = activities.findIndex(
        activity =>
          activity.toLowerCase() === option.value.toLowerCase() ||
          activity === option.label
      );
      if (indexToRemove >= 0) {
        onRemoveActivity(indexToRemove);
      }
    }

    setCustomActivities(prev => prev.filter(tag => tag.value !== option.value));
  }, [activities, isActivitySelected]);

  const addNewActivity = useCallback(async (
    onAddActivity: (activity: string) => void
  ) => {
    if (inputValue.trim() === "") return;

    const newActivityValue = inputValue.toLowerCase().replace(/\s+/g, '');

    const existingOption = allActivityOptions.find(
      option => option.value === newActivityValue || option.label.toLowerCase() === inputValue.toLowerCase()
    );

    if (existingOption) {
      if (!isActivitySelected(existingOption.value)) {
        handleToggleActivity(existingOption, onAddActivity, () => {});
      }
    } else {
      const newActivity: ActivityOption = {
        value: newActivityValue,
        label: inputValue.trim(),
        icon: <Tag className="h-4 w-4" />,
        isCustom: true
      };

      setCustomActivities(prev => [...prev, newActivity]);
      onAddActivity(inputValue.trim());
    }

    setInputValue("");
    setShowInput(false);
  }, [inputValue, allActivityOptions, isActivitySelected, handleToggleActivity]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const toggleShowInput = useCallback(() => {
    setShowInput(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, onAddActivity: (activity: string) => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewActivity(onAddActivity);
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  }, [addNewActivity]);

  return {
    allActivityOptions,
    showInput,
    inputValue,
    isLoadingTags: false,
    isActivitySelected,
    handleToggleActivity,
    removeCustomTag,
    addNewActivity,
    handleInputChange,
    toggleShowInput,
    handleKeyDown
  };
}

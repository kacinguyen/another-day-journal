
import { useState, useEffect, useCallback } from "react";
import { Tag } from "lucide-react";
import { ActivityOption } from "./types";
import { DEFAULT_ACTIVITY_OPTIONS } from "./defaultOptions";
import { 
  fetchCustomTags, 
  addCustomActivityTag, 
  removeCustomActivityTag 
} from "@/services/journal/tagsService";

/**
 * Hook for managing activity tags
 */
export function useActivityTags(userId: string | undefined, activities: string[]) {
  const [customActivities, setCustomActivities] = useState<ActivityOption[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Combine default and custom options
  const allActivityOptions = [...DEFAULT_ACTIVITY_OPTIONS, ...customActivities];

  // Load custom tags when user changes
  useEffect(() => {
    const loadCustomTags = async () => {
      if (!userId) return;
      
      setIsLoadingTags(true);
      try {
        const customTags = await fetchCustomTags(userId);
        if (customTags?.activities) {
          const customOptions = Object.values(customTags.activities).map(tag => ({
            value: tag.value,
            label: tag.label,
            icon: <Tag className="h-4 w-4" />,
            isCustom: true
          }));
          setCustomActivities(customOptions);
        }
      } catch (error) {
        console.error("Error loading custom activity tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    
    loadCustomTags();
  }, [userId]);

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

  /**
   * Check if an activity is selected
   */
  const isActivitySelected = useCallback((value: string) => {
    return activities.some(
      activity => 
        activity.toLowerCase() === value.toLowerCase() || 
        activity === allActivityOptions.find(opt => opt.value === value)?.label
    );
  }, [activities, allActivityOptions]);

  /**
   * Toggle an activity selection
   */
  const handleToggleActivity = useCallback((option: ActivityOption, 
    onAddActivity: (activity: string) => void, 
    onRemoveActivity: (index: number) => void) => {
    
    if (isActivitySelected(option.value)) {
      // Find the index to remove
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

  /**
   * Remove a custom tag
   */
  const removeCustomTag = useCallback(async (option: ActivityOption, e: React.MouseEvent,
    onRemoveActivity: (index: number) => void) => {
    e.stopPropagation();
    
    if (!userId || !option.isCustom) return;
    
    // Remove from selected values if present
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
    
    // Remove from UI
    setCustomActivities(prev => prev.filter(tag => tag.value !== option.value));
    
    // Remove from database
    await removeCustomActivityTag(userId, option.value);
  }, [userId, activities, isActivitySelected]);

  /**
   * Add a new custom activity
   */
  const addNewActivity = useCallback(async (
    onAddActivity: (activity: string) => void
  ) => {
    if (inputValue.trim() === "" || !userId) return;
    
    const newActivityValue = inputValue.toLowerCase().replace(/\s+/g, '');
    
    // Check if the activity already exists
    const existingOption = allActivityOptions.find(
      option => option.value === newActivityValue || option.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (existingOption) {
      // Add the existing activity if it's not already selected
      if (!isActivitySelected(existingOption.value)) {
        handleToggleActivity(existingOption, onAddActivity, () => {});
      }
    } else {
      // Create the new custom activity
      const newActivity: ActivityOption = {
        value: newActivityValue,
        label: inputValue.trim(),
        icon: <Tag className="h-4 w-4" />,
        isCustom: true
      };
      
      // Add to UI immediately
      setCustomActivities(prev => [...prev, newActivity]);
      
      // Select the new activity
      onAddActivity(inputValue.trim());
      
      // Save to database
      await addCustomActivityTag(userId, {
        value: newActivityValue,
        label: inputValue.trim()
      });
    }
    
    // Reset and close input
    setInputValue("");
    setShowInput(false);
  }, [userId, inputValue, allActivityOptions, isActivitySelected, handleToggleActivity]);

  // Input related handlers
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
    isLoadingTags,
    isActivitySelected,
    handleToggleActivity,
    removeCustomTag,
    addNewActivity,
    handleInputChange,
    toggleShowInput,
    handleKeyDown
  };
}

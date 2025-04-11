
import { useState, useEffect, useCallback } from "react";
import { EventOption, EventType } from "./types";
import { DEFAULT_EVENT_OPTIONS } from "./defaultOptions";
import { 
  fetchCustomTags, 
  addCustomEventTag, 
  removeCustomEventTag 
} from "@/services/journal/tagsService";
import { Tag } from "lucide-react";
import { toast } from "sonner";

/**
 * Hook for managing event tags
 */
export function useEventTags(userId: string | undefined, initialValues: EventType[]) {
  const [customEventOptions, setCustomEventOptions] = useState<EventOption[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  // Combine default and custom options
  const allEventOptions = [...DEFAULT_EVENT_OPTIONS, ...customEventOptions];

  /**
   * Load custom tags when user changes
   */
  useEffect(() => {
    loadCustomTags();
  }, [userId]);

  /**
   * Fetches and loads custom tags from the database
   */
  const loadCustomTags = async () => {
    if (!userId) return;
    
    setIsLoadingTags(true);
    try {
      const customTags = await fetchCustomTags(userId);
      if (customTags?.events) {
        const customOptions = Object.values(customTags.events).map(tag => ({
          value: tag.value,
          label: tag.label,
          icon: <Tag className="h-4 w-4" />,
          isCustom: true
        }));
        setCustomEventOptions(customOptions);
      }
    } catch (error) {
      console.error("Error loading custom tags:", error);
      toast.error("Failed to load custom tags");
    } finally {
      setIsLoadingTags(false);
    }
  };

  /**
   * Adds a new custom tag
   */
  const addNewCustomTag = useCallback(async (value: string, label: string) => {
    if (!userId) return;

    // Create the new custom tag
    const newTag: EventOption = {
      value,
      label,
      icon: <Tag className="h-4 w-4" />,
      isCustom: true
    };
    
    // Add to UI immediately
    setCustomEventOptions(prev => [...prev, newTag]);
    
    try {
      // Save to database
      await addCustomEventTag(userId, {
        value,
        label
      });
      
      toast.success("Tag added successfully");
      return newTag;
    } catch (error) {
      // Rollback UI change on error
      setCustomEventOptions(prev => prev.filter(tag => tag.value !== value));
      console.error("Error adding custom tag:", error);
      toast.error("Failed to add custom tag");
      return null;
    }
  }, [userId]);

  /**
   * Removes a custom tag
   */
  const removeCustomTag = useCallback(async (option: EventOption) => {
    if (!userId || !option.isCustom) return;
    
    // Store original state for potential rollback
    const originalState = [...customEventOptions];
    
    // Remove from UI
    setCustomEventOptions(prev => prev.filter(tag => tag.value !== option.value));
    
    try {
      // Remove from database
      await removeCustomEventTag(userId, option.value);
      toast.success("Tag removed successfully");
    } catch (error) {
      // Rollback UI change on error
      setCustomEventOptions(originalState);
      console.error("Error removing custom tag:", error);
      toast.error("Failed to remove tag");
    }
  }, [userId, customEventOptions]);

  // Input related handlers
  const handleInputChange = useCallback((value: string) => {
    setNewTagName(value);
  }, []);

  const toggleShowInput = useCallback(() => {
    setShowInput(prev => !prev);
  }, []);

  const resetInput = useCallback(() => {
    setNewTagName("");
    setShowInput(false);
  }, []);

  return {
    allEventOptions,
    customEventOptions,
    isLoadingTags,
    showInput,
    newTagName,
    addNewCustomTag,
    removeCustomTag,
    handleInputChange,
    toggleShowInput,
    resetInput,
    setShowInput
  };
}

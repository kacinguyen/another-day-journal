
import { useState, useCallback } from "react";
import { EventOption, EventType } from "./types";
import { DEFAULT_EVENT_OPTIONS } from "./defaultOptions";
import { Tag } from "lucide-react";
import { toast } from "sonner";

/**
 * Hook for managing event tags
 * Custom tags are managed locally — Notion auto-creates multi-select options when entries are saved
 */
export function useEventTags(initialValues: EventType[]) {
  const [customEventOptions, setCustomEventOptions] = useState<EventOption[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const allEventOptions = [...DEFAULT_EVENT_OPTIONS, ...customEventOptions];

  const addNewCustomTag = useCallback(async (value: string, label: string) => {
    const newTag: EventOption = {
      value,
      label,
      icon: <Tag className="h-4 w-4" />,
      isCustom: true
    };

    setCustomEventOptions(prev => [...prev, newTag]);
    toast.success("Tag added successfully");
    return newTag;
  }, []);

  const removeCustomTag = useCallback(async (option: EventOption) => {
    if (!option.isCustom) return;
    setCustomEventOptions(prev => prev.filter(tag => tag.value !== option.value));
    toast.success("Tag removed successfully");
  }, []);

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

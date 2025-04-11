
import React, { useState, useEffect } from "react";
import { 
  PartyPopper, 
  UtensilsCrossed, 
  Coffee, 
  Home, 
  ShoppingBag, 
  TreeDeciduous,
  Briefcase,
  Plane,
  Users,
  Plus,
  Tag,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchCustomTags, addCustomEventTag, removeCustomEventTag } from "@/services/journal/tagsService";

export type EventType = 
  | "party" 
  | "restaurant" 
  | "cafe" 
  | "home" 
  | "shopping" 
  | "outdoors" 
  | "office"
  | "workFromHome"
  | "travel"
  | "hangout"
  | "other"
  | string; // Allow custom event types

interface EventTrackerProps {
  values: EventType[];
  onChange: (values: EventType[]) => void;
}

interface EventOption {
  value: EventType;
  label: string;
  icon: React.ReactNode;
  isCustom?: boolean;
}

/**
 * Default event options with predefined icons and labels
 */
const DEFAULT_EVENT_OPTIONS: EventOption[] = [
  { value: "party", label: "Party", icon: <PartyPopper className="h-4 w-4" /> },
  { value: "restaurant", label: "Restaurant", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { value: "cafe", label: "Cafe", icon: <Coffee className="h-4 w-4" /> },
  { value: "home", label: "Staying Home", icon: <Home className="h-4 w-4" /> },
  { value: "shopping", label: "Shopping", icon: <ShoppingBag className="h-4 w-4" /> },
  { value: "outdoors", label: "Outdoors", icon: <TreeDeciduous className="h-4 w-4" /> },
  { value: "office", label: "Office", icon: <Briefcase className="h-4 w-4" /> },
  { value: "workFromHome", label: "WFH", icon: <Home className="h-4 w-4" /> },
  { value: "travel", label: "Travel", icon: <Plane className="h-4 w-4" /> },
  { value: "hangout", label: "Hangout", icon: <Users className="h-4 w-4" /> },
];

const EventTracker: React.FC<EventTrackerProps> = ({ values, onChange }) => {
  const { user } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [customEventOptions, setCustomEventOptions] = useState<EventOption[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const allEventOptions = [...DEFAULT_EVENT_OPTIONS, ...customEventOptions];

  /**
   * Load custom tags when user changes
   */
  useEffect(() => {
    loadCustomTags();
  }, [user]);

  /**
   * Fetches and loads custom tags from the database
   */
  const loadCustomTags = async () => {
    if (!user?.id) return;
    
    setIsLoadingTags(true);
    try {
      const customTags = await fetchCustomTags(user.id);
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
    } finally {
      setIsLoadingTags(false);
    }
  };

  /**
   * Toggles an event in the selected values array
   */
  const handleToggleEvent = (event: EventType) => {
    if (values.includes(event)) {
      onChange(values.filter(v => v !== event));
    } else {
      onChange([...values, event]);
    }
  };

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
      await addNewCustomTag(newTagValue, newTagName.trim());
    }
    
    // Reset and close input
    setNewTagName("");
    setShowInput(false);
  };

  /**
   * Creates and adds a new custom tag
   */
  const addNewCustomTag = async (value: string, label: string) => {
    if (!user?.id) return;

    // Create the new custom tag
    const newTag: EventOption = {
      value,
      label,
      icon: <Tag className="h-4 w-4" />,
      isCustom: true
    };
    
    // Add to UI immediately
    setCustomEventOptions(prev => [...prev, newTag]);
    
    // Select the new tag
    if (!values.includes(value)) {
      handleToggleEvent(value);
    }
    
    // Save to database
    await addCustomEventTag(user.id, {
      value,
      label
    });
  };

  /**
   * Removes a custom tag
   */
  const handleRemoveTag = async (option: EventOption, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id || !option.isCustom) return;
    
    // Remove from selected values if present
    if (values.includes(option.value)) {
      onChange(values.filter(v => v !== option.value));
    }
    
    // Remove from UI
    setCustomEventOptions(prev => prev.filter(tag => tag.value !== option.value));
    
    // Remove from database
    await removeCustomEventTag(user.id, option.value);
  };

  /**
   * Handles keyboard events for the new tag input
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setNewTagName("");
    }
  };

  /**
   * Renders a single event option tag
   */
  const renderEventOption = (option: EventOption) => (
    <div 
      key={option.value}
      className={`
        inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors
        ${values.includes(option.value) 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
        ${option.isCustom ? 'border border-dashed border-primary/30' : ''}
      `}
      onClick={() => handleToggleEvent(option.value)}
    >
      {option.icon}
      <span className="text-xs font-medium">{option.label}</span>
      {option.isCustom && (
        <X 
          className="h-3 w-3 ml-1 hover:text-destructive cursor-pointer" 
          onClick={(e) => handleRemoveTag(option, e)}
        />
      )}
    </div>
  );

  /**
   * Renders the add new tag input or button
   */
  const renderAddTagControl = () => {
    if (showInput) {
      return (
        <div className="flex gap-2 w-full md:w-auto animate-fade-in">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter tag name..."
            className="flex-1 h-8 min-w-[140px]"
            autoFocus
          />
          <Button 
            onClick={handleAddNewTag} 
            variant="outline"
            size="sm"
            className="h-8 px-2"
          >
            Add
          </Button>
        </div>
      );
    }
    
    return (
      <div 
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors bg-secondary/50 hover:bg-secondary border border-dashed border-primary/30"
        onClick={() => setShowInput(true)}
      >
        <Plus className="h-4 w-4" />
        <span className="text-xs font-medium">Add tag</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Event Tags</label>
      
      <div className="flex flex-wrap gap-2">
        {allEventOptions.map(renderEventOption)}
        {renderAddTagControl()}
      </div>
    </div>
  );
};

export default EventTracker;


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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

const EventTracker: React.FC<EventTrackerProps> = ({ values, onChange }) => {
  const { user } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [customEventOptions, setCustomEventOptions] = useState<EventOption[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const defaultEventOptions: EventOption[] = [
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

  const allEventOptions = [...defaultEventOptions, ...customEventOptions];

  // Load custom tags when user changes
  useEffect(() => {
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
    
    loadCustomTags();
  }, [user]);

  const handleToggleEvent = (event: EventType) => {
    if (values.includes(event)) {
      onChange(values.filter(v => v !== event));
    } else {
      onChange([...values, event]);
    }
  };

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
      // Create the new custom tag
      const newTag: EventOption = {
        value: newTagValue,
        label: newTagName.trim(),
        icon: <Tag className="h-4 w-4" />,
        isCustom: true
      };
      
      // Add to UI immediately
      setCustomEventOptions(prev => [...prev, newTag]);
      
      // Select the new tag
      if (!values.includes(newTagValue)) {
        handleToggleEvent(newTagValue);
      }
      
      // Save to database
      await addCustomEventTag(user.id, {
        value: newTagValue,
        label: newTagName.trim()
      });
    }
    
    // Reset and close input
    setNewTagName("");
    setShowInput(false);
  };

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setNewTagName("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Event Tags</label>
      
      <div className="flex flex-wrap gap-2">
        {allEventOptions.map((option) => (
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
        ))}

        {/* Add new tag button or input field */}
        {showInput ? (
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
        ) : (
          <div 
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors bg-secondary/50 hover:bg-secondary border border-dashed border-primary/30"
            onClick={() => setShowInput(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs font-medium">Add tag</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTracker;

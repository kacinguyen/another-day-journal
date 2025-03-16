
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Book, Dumbbell, Utensils, Pencil, Brain, Plus, Tag, X, Tv, TreeDeciduous, Building, Cake, Bike } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivitySelectorProps {
  activities: string[];
  onAddActivity: (activity: string) => void;
  onRemoveActivity: (index: number) => void;
  suggestions?: string[];
}

interface ActivityOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  isCustom?: boolean;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities,
  onAddActivity,
  onRemoveActivity,
  suggestions = ["Reading", "Weight Lifting", "Hiking", "Writing", "Cooking", "Learning", "Meditating", "TV & Content", "Crafts", "Building", "Baking", "Biking"]
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [customActivities, setCustomActivities] = useState<ActivityOption[]>([]);

  const defaultActivityOptions: ActivityOption[] = [
    { value: "reading", label: "Reading", icon: <Book className="h-4 w-4" /> },
    { value: "weightLifting", label: "Weight Lifting", icon: <Dumbbell className="h-4 w-4" /> },
    { value: "hiking", label: "Hiking", icon: <TreeDeciduous className="h-4 w-4" /> },
    { value: "tvContent", label: "TV & Content", icon: <Tv className="h-4 w-4" /> },
    { value: "cooking", label: "Cooking", icon: <Utensils className="h-4 w-4" /> },
    { value: "writing", label: "Writing", icon: <Pencil className="h-4 w-4" /> },
    { value: "crafts", label: "Crafts", icon: <Pencil className="h-4 w-4" /> },
    { value: "building", label: "Building", icon: <Building className="h-4 w-4" /> },
    { value: "baking", label: "Baking", icon: <Cake className="h-4 w-4" /> },
    { value: "biking", label: "Biking", icon: <Bike className="h-4 w-4" /> },
    { value: "learning", label: "Learning", icon: <Brain className="h-4 w-4" /> },
  ];

  // Convert existing activities to proper format
  const normalizeExistingActivities = () => {
    activities.forEach(activity => {
      const normalized = activity.toLowerCase().replace(/\s+/g, '');
      const exists = [...defaultActivityOptions, ...customActivities]
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

  // Call once on initial render
  React.useEffect(() => {
    normalizeExistingActivities();
  }, []);

  const allActivityOptions = [...defaultActivityOptions, ...customActivities];

  const isActivitySelected = (value: string) => {
    // Check if the activity is selected by checking either the exact value or label match
    return activities.some(
      activity => 
        activity.toLowerCase() === value.toLowerCase() || 
        activity === allActivityOptions.find(opt => opt.value === value)?.label
    );
  };

  const handleToggleActivity = (option: ActivityOption) => {
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
  };

  const handleAddNewActivity = () => {
    if (inputValue.trim() === "") return;
    
    const newActivityValue = inputValue.toLowerCase().replace(/\s+/g, '');
    
    // Check if the activity already exists
    const existingOption = allActivityOptions.find(
      option => option.value === newActivityValue || option.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (existingOption) {
      // Add the existing activity if it's not already selected
      if (!isActivitySelected(existingOption.value)) {
        handleToggleActivity(existingOption);
      }
    } else {
      // Add the new custom activity
      const newActivity: ActivityOption = {
        value: newActivityValue,
        label: inputValue.trim(),
        icon: <Tag className="h-4 w-4" />,
        isCustom: true
      };
      
      setCustomActivities([...customActivities, newActivity]);
      
      // Select the new activity
      onAddActivity(inputValue.trim());
    }
    
    // Reset and close input
    setInputValue("");
    setShowInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewActivity();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Activities</label>
      
      <div className="flex flex-wrap gap-2">
        {allActivityOptions.map((option) => (
          <div 
            key={option.value}
            className={`
              inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors
              ${isActivitySelected(option.value) 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
              ${option.isCustom ? 'border border-dashed border-primary/30' : ''}
            `}
            onClick={() => handleToggleActivity(option)}
          >
            {option.icon}
            <span className="text-xs font-medium">{option.label}</span>
          </div>
        ))}

        {/* Add new activity button or input field */}
        {showInput ? (
          <div className="flex gap-2 w-full md:w-auto animate-fade-in">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter activity..."
              className="flex-1 h-8 min-w-[140px]"
              autoFocus
            />
            <Button 
              onClick={handleAddNewActivity} 
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
            <span className="text-xs font-medium">Add Activity</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySelector;


import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  suggestions = ["Reading", "Cooking", "Learning", "Weight Lifting", "Cycling", "Hiking", "Writing", "Building"]
}) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleAddActivity = () => {
    if (inputValue.trim() !== "" && !activities.includes(inputValue.trim())) {
      onAddActivity(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddActivity();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Activities</label>
      
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an activity..."
          className="flex-1"
        />
        <Button 
          onClick={handleAddActivity} 
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          Add
        </Button>
      </div>
      
      {activities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 min-h-9">
          {activities.map((activity, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-3 py-1.5 h-auto text-sm gap-1.5 animate-fade-in"
            >
              {activity}
              <button
                onClick={() => onRemoveActivity(index)}
                className="rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {activities.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add activities you did today
        </p>
      )}
      
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1.5">Suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions
              .filter(s => !activities.includes(s))
              .slice(0, 6)
              .map((suggestion, i) => (
                <Badge
                  key={i}
                  variant="outline" 
                  className={cn(
                    "cursor-pointer hover:bg-muted",
                    activities.includes(suggestion) && "opacity-50"
                  )}
                  onClick={() => {
                    if (!activities.includes(suggestion)) {
                      onAddActivity(suggestion);
                    }
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySelector;

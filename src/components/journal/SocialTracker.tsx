
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Users, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialTrackerProps {
  people: string[];
  onAddPerson: (person: string) => void;
  onRemovePerson: (index: number) => void;
}

const SocialTracker: React.FC<SocialTrackerProps> = ({
  people,
  onAddPerson,
  onRemovePerson
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  
  const suggestions = ["Satya", "Shrivu"];

  const handleAddPerson = () => {
    if (inputValue.trim() !== "" && !people.includes(inputValue.trim())) {
      onAddPerson(inputValue.trim());
      setInputValue("");
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPerson();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center gap-1.5">
        <Users className="h-4 w-4" />
        People I spent time with
      </label>
      
      {showInput ? (
        <div className="flex gap-2 animate-fade-in">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter name..."
            className="flex-1"
            autoFocus
          />
          <Button 
            onClick={handleAddPerson} 
            variant="outline"
            size="sm"
            className="shrink-0"
          >
            Add
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-1"
          onClick={() => setShowInput(true)}
        >
          <Plus className="h-4 w-4" />
          Add person
        </Button>
      )}
      
      {people.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 min-h-9">
          {people.map((person, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-3 py-1.5 h-auto text-sm gap-1.5 animate-fade-in"
            >
              {person}
              <button
                onClick={() => onRemovePerson(index)}
                className="rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggestions - Updated to match ActivitySelector style */}
      {showInput && suggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1.5">Suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions
              .filter(s => !people.includes(s))
              .map((suggestion, i) => (
                <Badge
                  key={i}
                  variant="outline" 
                  className={cn(
                    "cursor-pointer hover:bg-muted",
                    people.includes(suggestion) && "opacity-50"
                  )}
                  onClick={() => {
                    if (!people.includes(suggestion)) {
                      onAddPerson(suggestion);
                      setShowInput(false);
                    }
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
          </div>
        </div>
      )}
      
      {people.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add people you spent time with today
        </p>
      )}
    </div>
  );
};

export default SocialTracker;

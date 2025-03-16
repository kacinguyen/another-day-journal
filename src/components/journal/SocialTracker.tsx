
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
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
  const [inputValue, setInputValue] = React.useState("");
  
  const suggestions = ["Satya", "Shrivu"];

  const handleAddPerson = () => {
    if (inputValue.trim() !== "" && !people.includes(inputValue.trim())) {
      onAddPerson(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPerson();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">People I spent time with</label>
      
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a person..."
          className="flex-1"
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
      
      {people.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add people you spent time with today
        </p>
      )}
      
      {suggestions.length > 0 && (
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

export default SocialTracker;

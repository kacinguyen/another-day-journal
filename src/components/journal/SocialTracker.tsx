
import React, { useState } from "react";
import { 
  Users, 
  Heart, 
  User, 
  Briefcase, 
  UserPlus, 
  Tag, 
  Plus,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialTrackerProps {
  people: string[];
  onAddPerson: (person: string) => void;
  onRemovePerson: (index: number) => void;
}

interface PersonOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  isCustom?: boolean;
}

const SocialTracker: React.FC<SocialTrackerProps> = ({
  people,
  onAddPerson,
  onRemovePerson
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [customPeople, setCustomPeople] = useState<PersonOption[]>([]);

  const defaultPeopleOptions: PersonOption[] = [
    { value: "friends", label: "Friends", icon: <Users className="h-4 w-4" /> },
    { value: "family", label: "Family", icon: <Heart className="h-4 w-4" /> },
    { value: "partner", label: "Partner", icon: <Heart className="h-4 w-4" /> },
    { value: "coworkers", label: "Co-workers", icon: <Briefcase className="h-4 w-4" /> },
  ];

  // Convert existing people to proper format
  const normalizeExistingPeople = () => {
    people.forEach(person => {
      const normalized = person.toLowerCase().replace(/\s+/g, '');
      const exists = [...defaultPeopleOptions, ...customPeople]
        .some(option => option.value === normalized);
      
      if (!exists) {
        const newCustomPerson = {
          value: normalized,
          label: person,
          icon: <User className="h-4 w-4" />,
          isCustom: true
        };
        setCustomPeople(prev => [...prev, newCustomPerson]);
      }
    });
  };

  // Call once on initial render
  React.useEffect(() => {
    normalizeExistingPeople();
  }, []);

  const allPeopleOptions = [...defaultPeopleOptions, ...customPeople];

  const isPersonSelected = (value: string) => {
    // Check if the person is selected by checking either the exact value or label match
    return people.some(
      person => 
        person.toLowerCase() === value.toLowerCase() || 
        person === allPeopleOptions.find(opt => opt.value === value)?.label
    );
  };

  const handleTogglePerson = (option: PersonOption) => {
    if (isPersonSelected(option.value)) {
      // Find the index to remove
      const indexToRemove = people.findIndex(
        person => 
          person.toLowerCase() === option.value.toLowerCase() || 
          person === option.label
      );
      if (indexToRemove >= 0) {
        onRemovePerson(indexToRemove);
      }
    } else {
      onAddPerson(option.label);
    }
  };

  const handleAddNewPerson = () => {
    if (inputValue.trim() === "") return;
    
    const newPersonValue = inputValue.toLowerCase().replace(/\s+/g, '');
    
    // Check if the person already exists
    const existingOption = allPeopleOptions.find(
      option => option.value === newPersonValue || option.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (existingOption) {
      // Add the existing person if it's not already selected
      if (!isPersonSelected(existingOption.value)) {
        handleTogglePerson(existingOption);
      }
    } else {
      // Add the new custom person
      const newPerson: PersonOption = {
        value: newPersonValue,
        label: inputValue.trim(),
        icon: <User className="h-4 w-4" />,
        isCustom: true
      };
      
      setCustomPeople([...customPeople, newPerson]);
      
      // Select the new person
      onAddPerson(inputValue.trim());
    }
    
    // Reset and close input
    setInputValue("");
    setShowInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewPerson();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  // Helper for suggestions
  const suggestions = ["Satya", "Shrivu"];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">People I spent time with</label>
      
      <div className="flex flex-wrap gap-2">
        {allPeopleOptions.map((option) => (
          <div 
            key={option.value}
            className={`
              inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors
              ${isPersonSelected(option.value) 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
              ${option.isCustom ? 'border border-dashed border-primary/30' : ''}
            `}
            onClick={() => handleTogglePerson(option)}
          >
            {option.icon}
            <span className="text-xs font-medium">{option.label}</span>
          </div>
        ))}

        {/* Add new person button or input field */}
        {showInput ? (
          <div className="flex gap-2 w-full md:w-auto animate-fade-in">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name..."
              className="flex-1 h-8 min-w-[140px]"
              autoFocus
            />
            <Button 
              onClick={handleAddNewPerson} 
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
            <UserPlus className="h-4 w-4" />
            <span className="text-xs font-medium">Add Person</span>
          </div>
        )}
      </div>
      
      {/* Individual people suggestions */}
      {suggestions.length > 0 && !showInput && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1.5">Suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions
              .filter(s => !people.some(p => p.toLowerCase() === s.toLowerCase()))
              .map((suggestion, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer 
                    bg-secondary/50 hover:bg-secondary text-xs"
                  onClick={() => onAddPerson(suggestion)}
                >
                  <User className="h-3 w-3" />
                  {suggestion}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialTracker;

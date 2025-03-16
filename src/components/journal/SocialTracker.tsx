
import React, { useState, useEffect } from "react";
import { 
  Users, 
  Heart, 
  User, 
  Briefcase, 
  UserPlus, 
  Plus,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * SocialTracker Component
 * 
 * Allows users to select people they spent time with from predefined options
 * or add custom people. The component maintains a list of selected people
 * and provides UI for adding, removing, and toggling selections.
 * 
 * @param people - Array of currently selected people
 * @param onAddPerson - Callback when a person is added
 * @param onRemovePerson - Callback when a person is removed
 */
interface SocialTrackerProps {
  people: string[];
  onAddPerson: (person: string) => void;
  onRemovePerson: (index: number) => void;
}

/**
 * Represents a person option with display and selection properties
 */
interface PersonOption {
  value: string;     // Unique identifier
  label: string;     // Display name
  icon: React.ReactNode; // Icon component
  isCustom?: boolean; // Whether this is a custom-added person
}

/**
 * Default predefined person categories
 */
const DEFAULT_PEOPLE_OPTIONS: PersonOption[] = [
  { value: "friends", label: "Friends", icon: <Users className="h-4 w-4" /> },
  { value: "family", label: "Family", icon: <Heart className="h-4 w-4" /> },
  { value: "partner", label: "Partner", icon: <Heart className="h-4 w-4" /> },
  { value: "coworkers", label: "Co-workers", icon: <Briefcase className="h-4 w-4" /> },
];

const SocialTracker: React.FC<SocialTrackerProps> = ({
  people,
  onAddPerson,
  onRemovePerson
}) => {
  // State for controlling the add person input
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // State for tracking custom-added people
  const [customPeople, setCustomPeople] = useState<PersonOption[]>([]);

  // Combine default and custom people options
  const allPeopleOptions = [...DEFAULT_PEOPLE_OPTIONS, ...customPeople];

  /**
   * Normalize and add existing people to custom options if needed
   */
  const normalizeExistingPeople = () => {
    people.forEach(person => {
      const normalized = person.toLowerCase().replace(/\s+/g, '');
      const exists = allPeopleOptions.some(option => option.value === normalized);
      
      if (!exists) {
        addToCustomPeople(normalized, person);
      }
    });
  };

  /**
   * Helper to add a person to the custom people list
   */
  const addToCustomPeople = (value: string, label: string) => {
    const newCustomPerson = {
      value,
      label,
      icon: <User className="h-4 w-4" />,
      isCustom: true
    };
    setCustomPeople(prev => [...prev, newCustomPerson]);
  };

  // Initialize existing people on component mount
  useEffect(() => {
    normalizeExistingPeople();
  }, []);

  /**
   * Check if a person is currently selected
   */
  const isPersonSelected = (value: string): boolean => {
    return people.some(
      person => 
        person.toLowerCase() === value.toLowerCase() || 
        person === allPeopleOptions.find(opt => opt.value === value)?.label
    );
  };

  /**
   * Toggle a person's selection status
   */
  const handleTogglePerson = (option: PersonOption): void => {
    if (isPersonSelected(option.value)) {
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

  /**
   * Add a new custom person from input
   */
  const handleAddNewPerson = (): void => {
    if (inputValue.trim() === "") return;
    
    const newPersonValue = inputValue.toLowerCase().replace(/\s+/g, '');
    
    // Check if person already exists
    const existingOption = allPeopleOptions.find(
      option => option.value === newPersonValue || 
                option.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (existingOption) {
      // Use existing person if not already selected
      if (!isPersonSelected(existingOption.value)) {
        handleTogglePerson(existingOption);
      }
    } else {
      // Add as new custom person
      addToCustomPeople(newPersonValue, inputValue.trim());
      onAddPerson(inputValue.trim());
    }
    
    // Reset input state
    setInputValue("");
    setShowInput(false);
  };

  /**
   * Handle keyboard events in the input field
   */
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewPerson();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  /**
   * Render a person option button
   */
  const renderPersonOption = (option: PersonOption) => {
    const isSelected = isPersonSelected(option.value);
    
    return (
      <div 
        key={option.value}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors",
          isSelected 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          option.isCustom ? "border border-dashed border-primary/30" : ""
        )}
        onClick={() => handleTogglePerson(option)}
      >
        {option.icon}
        <span className="text-xs font-medium">{option.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">People I spent time with</label>
      
      <div className="flex flex-wrap gap-2">
        {/* Render all person options */}
        {allPeopleOptions.map(renderPersonOption)}

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
            <span className="text-xs font-medium">Add person</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialTracker;

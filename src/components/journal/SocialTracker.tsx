
import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { PersonOption } from "./social/types";
import { DEFAULT_PEOPLE_OPTIONS } from "./social/defaultOptions";
import PersonOptionButton from "./social/PersonOptionButton";
import AddPersonForm from "./social/AddPersonForm";
import AddPersonButton from "./social/AddPersonButton";

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

const SocialTracker: React.FC<SocialTrackerProps> = ({
  people,
  onAddPerson,
  onRemovePerson
}) => {
  // State for controlling the add person input
  const [showInput, setShowInput] = useState(false);
  
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
  const handleAddNewPerson = (inputValue: string): void => {
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
    setShowInput(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">People I spent time with</label>
      
      <div className="flex flex-wrap gap-2">
        {/* Render all person options */}
        {allPeopleOptions.map(option => (
          <PersonOptionButton
            key={option.value}
            option={option}
            isSelected={isPersonSelected(option.value)}
            onToggle={handleTogglePerson}
          />
        ))}

        {/* Add new person button or input field */}
        {showInput ? (
          <AddPersonForm
            onAddPerson={handleAddNewPerson}
            onCancel={() => setShowInput(false)}
          />
        ) : (
          <AddPersonButton onClick={() => setShowInput(true)} />
        )}
      </div>
    </div>
  );
};

export default SocialTracker;

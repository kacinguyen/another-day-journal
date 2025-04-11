
import React from "react";
import { usePeopleTags } from "./social/usePeopleTags";
import { PersonOptionButton, AddPersonButton, AddPersonForm } from "./social";
import { PersonOption } from "./social/types";

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
  const {
    allPeopleOptions,
    showInput,
    setShowInput,
    isPersonSelected,
    addNewPerson
  } = usePeopleTags(people);

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
    const newPersonLabel = addNewPerson(inputValue);
    
    if (newPersonLabel && !isPersonSelected(newPersonLabel)) {
      onAddPerson(newPersonLabel);
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

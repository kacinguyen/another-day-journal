
import { useState, useEffect, useCallback } from "react";
import { User } from "lucide-react";
import { PersonOption } from "./types";
import { DEFAULT_PEOPLE_OPTIONS } from "./defaultOptions";

/**
 * Custom hook for managing people tags in the SocialTracker
 * Handles tracking custom people, selection state, and UI interactions
 * 
 * @param initialPeople - Array of initially selected people
 */
export function usePeopleTags(initialPeople: string[] = []) {
  // State for controlling the add person input
  const [showInput, setShowInput] = useState(false);
  
  // State for tracking custom-added people
  const [customPeople, setCustomPeople] = useState<PersonOption[]>([]);
  
  // Combine default and custom people options
  const allPeopleOptions = [...DEFAULT_PEOPLE_OPTIONS, ...customPeople];

  /**
   * Normalize and add existing people to custom options if needed
   * This ensures any previously selected people that aren't in default options
   * are properly added to the custom people list
   */
  const normalizeExistingPeople = useCallback(() => {
    initialPeople.forEach(person => {
      const normalized = person.toLowerCase().replace(/\s+/g, '');
      const exists = allPeopleOptions.some(option => 
        option.value === normalized || 
        option.label.toLowerCase() === person.toLowerCase()
      );
      
      if (!exists) {
        addToCustomPeople(normalized, person);
      }
    });
  }, [initialPeople, allPeopleOptions]);

  /**
   * Helper to add a person to the custom people list
   */
  const addToCustomPeople = useCallback((value: string, label: string) => {
    const newCustomPerson = {
      value,
      label,
      icon: <User className="h-4 w-4" />,
      isCustom: true
    };
    setCustomPeople(prev => [...prev, newCustomPerson]);
  }, []);

  /**
   * Check if a person is currently selected
   */
  const isPersonSelected = useCallback((value: string): boolean => {
    return initialPeople.some(
      person => 
        person.toLowerCase() === value.toLowerCase() || 
        person === allPeopleOptions.find(opt => opt.value === value)?.label
    );
  }, [initialPeople, allPeopleOptions]);

  /**
   * Add a new custom person
   */
  const addNewPerson = useCallback((inputValue: string): string | null => {
    if (inputValue.trim() === "") return null;
    
    const newPersonValue = inputValue.toLowerCase().replace(/\s+/g, '');
    
    // Check if person already exists
    const existingOption = allPeopleOptions.find(
      option => option.value === newPersonValue || 
                option.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (existingOption) {
      // Return existing person label
      return existingOption.label;
    } else {
      // Add as new custom person
      addToCustomPeople(newPersonValue, inputValue.trim());
      return inputValue.trim();
    }
  }, [allPeopleOptions, addToCustomPeople]);

  // Initialize existing people on component mount
  useEffect(() => {
    normalizeExistingPeople();
  }, [normalizeExistingPeople]);

  return {
    allPeopleOptions,
    showInput,
    setShowInput,
    isPersonSelected,
    addNewPerson
  };
}

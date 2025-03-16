
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddPersonFormProps {
  onAddPerson: (personName: string) => void;
  onCancel: () => void;
}

const AddPersonForm: React.FC<AddPersonFormProps> = ({ onAddPerson, onCancel }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddPerson = () => {
    if (inputValue.trim()) {
      onAddPerson(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPerson();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
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
        onClick={handleAddPerson} 
        variant="outline"
        size="sm"
        className="h-8 px-2"
      >
        Add
      </Button>
    </div>
  );
};

export default AddPersonForm;

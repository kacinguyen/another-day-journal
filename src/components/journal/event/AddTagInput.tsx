
import React from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddTagInputProps {
  showInput: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onAddTag: () => void;
  onShowInput: () => void;
}

/**
 * Component to either show an "Add tag" button or an input field for new tag creation
 */
const AddTagInput: React.FC<AddTagInputProps> = ({
  showInput,
  inputValue,
  onInputChange,
  onKeyDown,
  onAddTag,
  onShowInput
}) => {
  if (showInput) {
    return (
      <div className="flex gap-2 w-full md:w-auto animate-fade-in">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter tag name..."
          className="flex-1 h-8 min-w-[140px]"
          autoFocus
        />
        <Button 
          onClick={onAddTag} 
          variant="outline"
          size="sm"
          className="h-8 px-2"
        >
          Add
        </Button>
      </div>
    );
  }
  
  return (
    <div 
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors bg-secondary/50 hover:bg-secondary border border-dashed border-primary/30"
      onClick={onShowInput}
    >
      <Plus className="h-4 w-4" />
      <span className="text-xs font-medium">Add tag</span>
    </div>
  );
};

export default AddTagInput;

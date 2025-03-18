
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSaving: boolean;
}

/**
 * Button component for saving journal entries
 */
const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  disabled, 
  isSaving 
}) => {
  return (
    <Button
      id="save-button"
      onClick={onClick}
      disabled={disabled}
      className="relative overflow-hidden transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground"
    >
      <div className="flex items-center gap-1.5">
        <Save className="h-4 w-4" />
        <span>{isSaving ? "Saving..." : "Save entry"}</span>
      </div>
      {isSaving && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-1 w-full absolute bottom-0 left-0 bg-white/20 animate-pulse"></span>
        </span>
      )}
    </Button>
  );
};

export default SaveButton;


import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { format } from "date-fns";

interface SaveButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSaving: boolean;
  autoSaveEnabled?: boolean;
  lastSaved?: Date | null;
}

/**
 * Button component for saving journal entries
 */
const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  disabled, 
  isSaving,
  autoSaveEnabled = false,
  lastSaved = null
}) => {
  // Format last saved time
  const lastSavedText = lastSaved 
    ? `Auto-saved ${format(lastSaved, 'h:mm a')}` 
    : 'Auto-save on';
  
  return (
    <div className="flex flex-col items-end">
      <Button
        id="save-button"
        onClick={onClick}
        disabled={disabled}
        className="relative overflow-hidden transition-all duration-300"
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
      
      {autoSaveEnabled && (
        <span className="text-xs text-muted-foreground mt-1">
          {isSaving ? "Auto-saving..." : lastSavedText}
        </span>
      )}
    </div>
  );
};

export default SaveButton;

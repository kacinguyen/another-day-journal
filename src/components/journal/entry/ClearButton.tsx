
import React from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
}

/**
 * ClearButton component
 * 
 * Button that shows a confirmation dialog before clearing an entry
 */
const ClearButton: React.FC<ClearButtonProps> = ({ onClear, disabled = false }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1 text-muted-foreground hover:text-gray-600 hover:bg-gray-100 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-700"
          disabled={disabled}
          id="clear-button"
        >
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Journal Entry</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all fields in the current entry. This action won't be saved until you click "Save Entry".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onClear}
            className="bg-destructive hover:bg-destructive/90"
          >
            Clear Entry
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearButton;

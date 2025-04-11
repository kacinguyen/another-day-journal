
import React from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon, PlusCircleIcon, SendIcon } from "lucide-react";

export interface SavedPromptProps {
  id: string;
  text: string;
  onSelect: (text: string) => void;
  onDelete: (id: string) => void;
}

export const SavedPrompt: React.FC<SavedPromptProps> = ({ 
  id, 
  text, 
  onSelect,
  onDelete 
}) => {
  return (
    <div className="group flex items-start gap-2 rounded-md border border-border p-3 hover:bg-accent/50">
      <div className="flex-1">
        <p className="text-sm font-medium line-clamp-2">{text}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 shrink-0" 
          onClick={() => onSelect(text)}
          title="Use this prompt"
        >
          <SendIcon className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 shrink-0 text-destructive hover:text-destructive" 
          onClick={() => onDelete(id)}
          title="Delete prompt"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

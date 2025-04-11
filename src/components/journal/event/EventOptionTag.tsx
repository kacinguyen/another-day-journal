
import React from "react";
import { X } from "lucide-react";
import { EventOption } from "./types";

interface EventOptionTagProps {
  option: EventOption;
  isSelected: boolean;
  onToggle: (value: string) => void;
  onRemove?: (option: EventOption, e: React.MouseEvent) => void;
}

/**
 * Renders a single event option tag
 */
const EventOptionTag: React.FC<EventOptionTagProps> = ({ 
  option, 
  isSelected, 
  onToggle, 
  onRemove 
}) => {
  return (
    <div 
      key={option.value}
      className={`
        inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
        ${option.isCustom ? 'border border-dashed border-primary/30' : ''}
      `}
      onClick={() => onToggle(option.value)}
    >
      {option.icon}
      <span className="text-xs font-medium">{option.label}</span>
      {onRemove && (
        <X 
          className="h-3 w-3 ml-1 hover:text-destructive cursor-pointer" 
          onClick={(e) => onRemove(option, e)}
        />
      )}
    </div>
  );
};

export default EventOptionTag;

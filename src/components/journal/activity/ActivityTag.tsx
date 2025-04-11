
import React from "react";
import { X } from "lucide-react";
import { ActivityTagProps } from "./types";

/**
 * ActivityTag Component
 * 
 * Displays a selectable tag for an activity with optional remove button for custom tags
 */
const ActivityTag: React.FC<ActivityTagProps> = ({ option, isSelected, onToggle, onRemove }) => {
  return (
    <div 
      className={`
        inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
        ${option.isCustom ? 'border border-dashed border-primary/30' : ''}
      `}
      onClick={() => onToggle(option)}
    >
      {option.icon}
      <span className="text-xs font-medium">{option.label}</span>
      {option.isCustom && onRemove && (
        <X 
          className="h-3 w-3 ml-1 hover:text-destructive cursor-pointer" 
          onClick={(e) => onRemove(option, e)}
        />
      )}
    </div>
  );
};

export default ActivityTag;

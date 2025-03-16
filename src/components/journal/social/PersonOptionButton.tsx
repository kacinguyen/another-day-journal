
import React from "react";
import { PersonOption } from "./types";
import { cn } from "@/lib/utils";

interface PersonOptionButtonProps {
  option: PersonOption;
  isSelected: boolean;
  onToggle: (option: PersonOption) => void;
}

const PersonOptionButton: React.FC<PersonOptionButtonProps> = ({
  option,
  isSelected,
  onToggle
}) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer transition-colors",
        isSelected 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        option.isCustom ? "border border-dashed border-primary/30" : ""
      )}
      onClick={() => onToggle(option)}
    >
      {option.icon}
      <span className="text-xs font-medium">{option.label}</span>
    </div>
  );
};

export default PersonOptionButton;

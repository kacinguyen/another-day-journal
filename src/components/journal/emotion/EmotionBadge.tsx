
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EmotionOption, EmotionType } from "../types/emotion-types";

interface EmotionBadgeProps {
  emotion: EmotionOption;
  isSelected: boolean;
  onToggle: (emotion: EmotionType) => void;
}

const EmotionBadge: React.FC<EmotionBadgeProps> = ({ 
  emotion, 
  isSelected, 
  onToggle 
}) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "cursor-pointer border flex items-center gap-1 px-2 py-1 capitalize transition-all hover:scale-105",
        emotion.color,
        isSelected ? emotion.activeColor : "bg-background"
      )}
      onClick={() => onToggle(emotion.value)}
    >
      {emotion.icon}
      <span>{emotion.value}</span>
    </Badge>
  );
};

export default EmotionBadge;


import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmotionType } from "../types/emotion-types";

interface CustomEmotionBadgeProps {
  emotion: EmotionType;
  onToggle: (emotion: EmotionType) => void;
  onRemove: (emotion: EmotionType) => void;
}

const CustomEmotionBadge: React.FC<CustomEmotionBadgeProps> = ({ 
  emotion, 
  onToggle, 
  onRemove 
}) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        "cursor-pointer border flex items-center gap-1 px-2 py-1 capitalize transition-all hover:scale-105",
        "text-purple-500 border-purple-500 hover:bg-purple-100 dark:hover:bg-purple-950",
        "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
      )}
      onClick={() => onToggle(emotion)}
    >
      <Tag className="h-3.5 w-3.5" />
      <span>{emotion}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(emotion);
        }}
        className="ml-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 p-0.5"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </Badge>
  );
};

export default CustomEmotionBadge;

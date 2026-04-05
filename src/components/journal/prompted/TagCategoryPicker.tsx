import React from "react";
import { User, MapPin, Calendar, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TagCategory } from "./InlineTagMark";

interface TagCategoryPickerProps {
  onSelect: (category: TagCategory) => void;
}

const categories: { value: TagCategory; label: string; icon: React.ElementType; colorClass: string }[] = [
  { value: "person", label: "Person", icon: User, colorClass: "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300" },
  { value: "place", label: "Place", icon: MapPin, colorClass: "hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300" },
  { value: "event", label: "Event", icon: Calendar, colorClass: "hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950 dark:hover:text-purple-300" },
  { value: "activity", label: "Activity", icon: Dumbbell, colorClass: "hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-950 dark:hover:text-orange-300" },
];

const TagCategoryPicker: React.FC<TagCategoryPickerProps> = ({ onSelect }) => {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-md">
      {categories.map(({ value, label, icon: Icon, colorClass }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium",
            "text-muted-foreground transition-colors",
            colorClass
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default TagCategoryPicker;

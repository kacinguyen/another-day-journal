import React, { useEffect, useRef, useState } from "react";
import { User, MapPin, Calendar, Activity, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TagCategory } from "./InlineTagMark";

interface TagCategoryPickerProps {
  onSelect: (category: TagCategory, displayName?: string) => void;
  selectedText?: string;
}

const categories: { value: TagCategory; label: string; icon: React.ElementType; colorClass: string }[] = [
  { value: "person", label: "Person", icon: User, colorClass: "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300" },
  { value: "place", label: "Place", icon: MapPin, colorClass: "hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300" },
  { value: "event", label: "Event", icon: Calendar, colorClass: "hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950 dark:hover:text-purple-300" },
  { value: "activity", label: "Activity", icon: Activity, colorClass: "hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-950 dark:hover:text-orange-300" },
];

const TagCategoryPicker: React.FC<TagCategoryPickerProps> = ({ onSelect, selectedText }) => {
  const [chosenCategory, setChosenCategory] = useState<TagCategory | null>(null);
  const [nameValue, setNameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chosenCategory && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [chosenCategory]);

  const handleCategoryClick = (category: TagCategory) => {
    setChosenCategory(category);
    setNameValue(selectedText || "");
  };

  const handleConfirm = () => {
    if (!chosenCategory) return;
    const trimmed = nameValue.trim();
    const displayName = trimmed && trimmed !== selectedText ? trimmed : undefined;
    onSelect(chosenCategory, displayName);
  };

  const handleCancel = () => {
    if (!chosenCategory) return;
    onSelect(chosenCategory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (chosenCategory) {
    const config = categories.find((c) => c.value === chosenCategory)!;
    const Icon = config.icon;
    return (
      <div className="flex items-center gap-1.5 rounded-lg border bg-popover p-1 shadow-md">
        <div className={cn("flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium", config.colorClass.replace(/hover:/g, ""))}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tag name..."
          className="w-32 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={handleConfirm}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-md">
      {categories.map(({ value, label, icon: Icon, colorClass }) => (
        <button
          key={value}
          onClick={() => handleCategoryClick(value)}
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


import React from "react";
import { Smile, Meh, Frown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type MoodType = "great" | "good" | "neutral" | "bad" | "awful";

interface MoodPickerProps {
  value: MoodType;
  onChange: (mood: MoodType) => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ value, onChange }) => {
  const moods = [
    {
      value: "great" as MoodType,
      label: "Great",
      icon: <Heart className="h-5 w-5" />,
      color: "text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300",
      activeColor: "bg-pink-100 dark:bg-pink-950"
    },
    {
      value: "good" as MoodType,
      label: "Good",
      icon: <Smile className="h-5 w-5" />,
      color: "text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300",
      activeColor: "bg-green-100 dark:bg-green-950"
    },
    {
      value: "neutral" as MoodType,
      label: "Neutral",
      icon: <Meh className="h-5 w-5" />,
      color: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300",
      activeColor: "bg-blue-100 dark:bg-blue-950"
    },
    {
      value: "bad" as MoodType,
      label: "Bad",
      icon: <Frown className="h-5 w-5" />,
      color: "text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300",
      activeColor: "bg-orange-100 dark:bg-orange-950"
    },
    {
      value: "awful" as MoodType,
      label: "Awful",
      icon: <Frown className="h-5 w-5 transform rotate-180" />,
      color: "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300",
      activeColor: "bg-red-100 dark:bg-red-950"
    }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">How was your day?</label>
      <div className="flex items-center justify-between gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 transform hover:scale-105 w-[72px] h-[72px]",
              mood.color,
              value === mood.value ? 
                cn("ring-2 ring-offset-1 scale-105", mood.activeColor) : 
                "bg-muted/50"
            )}
          >
            <div className="mb-1">{mood.icon}</div>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodPicker;

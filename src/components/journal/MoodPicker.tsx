
import React from "react";
import { Smile, Meh, Frown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { moodColors, sizing } from "@/styles/tokens";

export type { MoodType } from "@/components/journal/types/mood-types";
import type { MoodType } from "@/components/journal/types/mood-types";

interface MoodPickerProps {
  value: MoodType;
  onChange: (mood: MoodType) => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ value, onChange }) => {
  const moods = [
    {
      value: "awful" as MoodType,
      label: "Awful",
      icon: <Frown className="h-5 w-5 transform rotate-180" />,
      ...moodColors.awful,
    },
    {
      value: "bad" as MoodType,
      label: "Bad",
      icon: <Frown className="h-5 w-5" />,
      ...moodColors.bad,
    },
    {
      value: "neutral" as MoodType,
      label: "Neutral",
      icon: <Meh className="h-5 w-5" />,
      ...moodColors.neutral,
    },
    {
      value: "good" as MoodType,
      label: "Good",
      icon: <Smile className="h-5 w-5" />,
      ...moodColors.good,
    },
    {
      value: "great" as MoodType,
      label: "Great",
      icon: <Heart className="h-5 w-5" />,
      ...moodColors.great,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">How was your day?</label>
      <div className="flex items-center justify-start gap-3">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300",
              sizing.moodButton,
              mood.text,
              mood.textHover,
              value === mood.value ?
                cn("border-2 border-current", mood.bg) :
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

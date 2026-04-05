import React from "react";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Users,
  Heart,
  Activity,
  Wallet,
  Cloud,
  Moon,
  GraduationCap,
  Home,
  Dumbbell,
} from "lucide-react";

interface MoodFactorPickerProps {
  selected: string[];
  onToggle: (factor: string) => void;
}

const moodFactors = [
  { value: "work", label: "Work", icon: Briefcase },
  { value: "family", label: "Family", icon: Home },
  { value: "community", label: "Community", icon: Users },
  { value: "health", label: "Health", icon: Activity },
  { value: "relationships", label: "Relationships", icon: Heart },
  { value: "finance", label: "Finance", icon: Wallet },
  { value: "weather", label: "Weather", icon: Cloud },
  { value: "sleep", label: "Sleep", icon: Moon },
  { value: "learning", label: "Learning", icon: GraduationCap },
  { value: "fitness", label: "Fitness", icon: Dumbbell },
];

const MoodFactorPicker: React.FC<MoodFactorPickerProps> = ({
  selected,
  onToggle,
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-medium">
        What's impacting your mood?
      </p>
      <div className="flex flex-wrap gap-2">
        {moodFactors.map(({ value, label, icon: Icon }) => {
          const isSelected = selected.includes(value);
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                "border",
                isSelected
                  ? "bg-foreground text-background border-foreground"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodFactorPicker;

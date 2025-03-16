
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Thermometer, 
  BatteryLow, 
  Trophy, 
  AlertTriangle, 
  Coffee, 
  Sparkles, 
  Heart, 
  Cloud, 
  Smile, 
  Check,
  Plus,
  X,
  Tag
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type EmotionType = 
  | "excited" 
  | "stressed" 
  | "tired" 
  | "proud" 
  | "anxious" 
  | "bored" 
  | "enthusiastic" 
  | "grateful" 
  | "depressed" 
  | "happy" 
  | "content"
  | string; // Allow for custom emotions

interface EmotionTrackerProps {
  values: EmotionType[];
  onChange: (emotions: EmotionType[]) => void;
}

const predefinedEmotions = [
  {
    value: "excited" as EmotionType,
    icon: <Zap className="h-3.5 w-3.5" />,
    color: "text-amber-500 border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950",
    activeColor: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  },
  {
    value: "stressed" as EmotionType,
    icon: <Thermometer className="h-3.5 w-3.5" />,
    color: "text-red-500 border-red-500 hover:bg-red-100 dark:hover:bg-red-950",
    activeColor: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
  },
  {
    value: "tired" as EmotionType,
    icon: <BatteryLow className="h-3.5 w-3.5" />,
    color: "text-gray-500 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
    activeColor: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  },
  {
    value: "proud" as EmotionType,
    icon: <Trophy className="h-3.5 w-3.5" />,
    color: "text-yellow-500 border-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-950",
    activeColor: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300",
  },
  {
    value: "anxious" as EmotionType,
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color: "text-orange-500 border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-950",
    activeColor: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
  },
  {
    value: "bored" as EmotionType,
    icon: <Coffee className="h-3.5 w-3.5" />,
    color: "text-neutral-500 border-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    activeColor: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  },
  {
    value: "enthusiastic" as EmotionType,
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-indigo-500 border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-950",
    activeColor: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
  },
  {
    value: "grateful" as EmotionType,
    icon: <Heart className="h-3.5 w-3.5" />,
    color: "text-pink-500 border-pink-500 hover:bg-pink-100 dark:hover:bg-pink-950",
    activeColor: "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300",
  },
  {
    value: "depressed" as EmotionType,
    icon: <Cloud className="h-3.5 w-3.5" />,
    color: "text-blue-500 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950",
    activeColor: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  },
  {
    value: "happy" as EmotionType,
    icon: <Smile className="h-3.5 w-3.5" />,
    color: "text-green-500 border-green-500 hover:bg-green-100 dark:hover:bg-green-950",
    activeColor: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
  },
  {
    value: "content" as EmotionType,
    icon: <Check className="h-3.5 w-3.5" />,
    color: "text-teal-500 border-teal-500 hover:bg-teal-100 dark:hover:bg-teal-950",
    activeColor: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300",
  }
];

const EmotionTracker: React.FC<EmotionTrackerProps> = ({ values, onChange }) => {
  const [showInput, setShowInput] = useState(false);
  const [customEmotion, setCustomEmotion] = useState("");
  
  // Find custom emotions (ones that are not in the predefined list)
  const customEmotions = values.filter(
    emotion => !predefinedEmotions.some(e => e.value === emotion)
  );
  
  const toggleEmotion = (emotion: EmotionType) => {
    if (values.includes(emotion)) {
      onChange(values.filter(e => e !== emotion));
    } else {
      onChange([...values, emotion]);
    }
  };
  
  const handleAddCustomEmotion = () => {
    if (customEmotion.trim() !== "" && !values.includes(customEmotion.trim().toLowerCase())) {
      onChange([...values, customEmotion.trim().toLowerCase()]);
      setCustomEmotion("");
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomEmotion();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setCustomEmotion("");
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">What specific emotions did you feel?</label>
      <div className="flex flex-wrap gap-2">
        {predefinedEmotions.map((emotion) => (
          <Badge
            key={emotion.value}
            variant="outline"
            className={cn(
              "cursor-pointer border flex items-center gap-1 px-2 py-1 capitalize transition-all hover:scale-105",
              emotion.color,
              values.includes(emotion.value) ? emotion.activeColor : "bg-background"
            )}
            onClick={() => toggleEmotion(emotion.value)}
          >
            {emotion.icon}
            <span>{emotion.value}</span>
          </Badge>
        ))}
        
        {/* Display custom emotions */}
        {customEmotions.map((emotion) => (
          <Badge
            key={emotion}
            variant="outline"
            className={cn(
              "cursor-pointer border flex items-center gap-1 px-2 py-1 capitalize transition-all hover:scale-105",
              "text-purple-500 border-purple-500 hover:bg-purple-100 dark:hover:bg-purple-950",
              "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
            )}
            onClick={() => toggleEmotion(emotion)}
          >
            <Tag className="h-3.5 w-3.5" />
            <span>{emotion}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(values.filter(v => v !== emotion));
              }}
              className="ml-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 p-0.5"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
        
        {/* "Add emotion" button or input field */}
        {showInput ? (
          <div className="flex gap-2 w-full md:w-auto animate-fade-in">
            <Input
              value={customEmotion}
              onChange={(e) => setCustomEmotion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter emotion..."
              className="flex-1 h-8 min-w-[140px]"
              autoFocus
            />
            <Button 
              onClick={handleAddCustomEmotion} 
              variant="outline"
              size="sm"
              className="h-8 px-2"
            >
              Add
            </Button>
          </div>
        ) : (
          <Badge
            variant="outline"
            className="cursor-pointer border border-dashed border-primary/30 bg-secondary/50 hover:bg-secondary flex items-center gap-1 px-2 py-1 text-muted-foreground hover:text-foreground"
            onClick={() => setShowInput(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add emotion</span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default EmotionTracker;

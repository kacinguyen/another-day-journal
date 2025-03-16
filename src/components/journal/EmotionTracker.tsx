
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { EmotionType } from "./types/emotion-types";
import { predefinedEmotions } from "./data/emotionOptions";
import EmotionBadge from "./emotion/EmotionBadge";
import CustomEmotionBadge from "./emotion/CustomEmotionBadge";
import EmotionInputForm from "./emotion/EmotionInputForm";

interface EmotionTrackerProps {
  values: EmotionType[];
  onChange: (emotions: EmotionType[]) => void;
}

const EmotionTracker: React.FC<EmotionTrackerProps> = ({ values, onChange }) => {
  const [showInput, setShowInput] = useState(false);
  
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
  
  const handleAddCustomEmotion = (emotionText: string) => {
    if (!values.includes(emotionText)) {
      onChange([...values, emotionText]);
    }
    setShowInput(false);
  };

  const handleRemoveEmotion = (emotion: EmotionType) => {
    onChange(values.filter(v => v !== emotion));
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">What specific emotions did you feel?</label>
      <div className="flex flex-wrap gap-2">
        {/* Predefined emotions */}
        {predefinedEmotions.map((emotion) => (
          <EmotionBadge
            key={emotion.value}
            emotion={emotion}
            isSelected={values.includes(emotion.value)}
            onToggle={toggleEmotion}
          />
        ))}
        
        {/* Custom emotions */}
        {customEmotions.map((emotion) => (
          <CustomEmotionBadge
            key={emotion}
            emotion={emotion}
            onToggle={toggleEmotion}
            onRemove={handleRemoveEmotion}
          />
        ))}
        
        {/* "Add emotion" button or input field */}
        {showInput ? (
          <EmotionInputForm 
            onAddEmotion={handleAddCustomEmotion}
            onCancel={() => setShowInput(false)}
          />
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

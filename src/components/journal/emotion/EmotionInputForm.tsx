
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmotionInputFormProps {
  onAddEmotion: (emotion: string) => void;
  onCancel: () => void;
}

const EmotionInputForm: React.FC<EmotionInputFormProps> = ({ 
  onAddEmotion, 
  onCancel 
}) => {
  const [customEmotion, setCustomEmotion] = useState("");

  const handleSubmit = () => {
    if (customEmotion.trim() !== "") {
      onAddEmotion(customEmotion.trim().toLowerCase());
      setCustomEmotion("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
      setCustomEmotion("");
    }
  };

  return (
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
        onClick={handleSubmit} 
        variant="outline"
        size="sm"
        className="h-8 px-2"
      >
        Add
      </Button>
    </div>
  );
};

export default EmotionInputForm;

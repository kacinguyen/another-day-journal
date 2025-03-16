
import React from "react";
import MoodPicker, { MoodType } from "../MoodPicker";
import EmotionTracker from "../EmotionTracker";
import EnergyTracker from "../EnergyTracker";
import { EmotionType } from "../types/emotion-types";

interface TrackerLeftColumnProps {
  mood: MoodType;
  emotions: EmotionType[];
  energy: number;
  onMoodChange: (mood: MoodType) => void;
  onEmotionsChange: (emotions: EmotionType[]) => void;
  onEnergyChange: (energy: number) => void;
}

/**
 * Component that contains mood, emotion, and energy trackers
 */
const TrackerLeftColumn: React.FC<TrackerLeftColumnProps> = ({
  mood,
  emotions,
  energy,
  onMoodChange,
  onEmotionsChange,
  onEnergyChange
}) => {
  return (
    <div className="space-y-6">
      <MoodPicker value={mood} onChange={onMoodChange} />
      <EmotionTracker values={emotions} onChange={onEmotionsChange} />
      <EnergyTracker value={energy} onChange={onEnergyChange} />
    </div>
  );
};

export default TrackerLeftColumn;

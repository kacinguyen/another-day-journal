
import { MoodType } from "../MoodPicker";
import { EventType } from "../EventTracker";
import { EmotionType } from "./emotion-types";

export interface JournalEntryData {
  id?: string;
  date: Date;
  content: string;
  mood: MoodType;
  energy: number;
  activities: string[];
  people: string[];
  eventTypes: EventType[];
  emotions: EmotionType[];
}

export interface JournalEntryProps {
  onSave: (data: JournalEntryData) => void;
  initialData: JournalEntryData;
}


import { MoodType } from "./mood-types";
import { EventType } from "../event/types";
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
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntryProps {
  onSave: (data: JournalEntryData) => void;
  initialData: JournalEntryData;
  isLoadingContent?: boolean;
}

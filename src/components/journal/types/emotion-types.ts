
// Define types for emotion tracking
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

export interface EmotionOption {
  value: EmotionType;
  icon: React.ReactNode;
  color: string;
  activeColor: string;
}

export interface EmotionTrackerProps {
  values: EmotionType[];
  onChange: (emotions: EmotionType[]) => void;
}


import { ReactNode } from "react";

export type EventType = 
  | "party" 
  | "restaurant" 
  | "cafe" 
  | "home" 
  | "shopping" 
  | "outdoors" 
  | "office"
  | "workFromHome"
  | "travel"
  | "hangout"
  | "other"
  | string; // Allow custom event types

export interface EventTrackerProps {
  values: EventType[];
  onChange: (values: EventType[]) => void;
}

export interface EventOption {
  value: EventType;
  label: string;
  icon: ReactNode;
  isCustom?: boolean;
}

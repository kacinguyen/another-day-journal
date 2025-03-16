
import { ReactNode } from "react";

/**
 * Represents a person option with display and selection properties
 */
export interface PersonOption {
  value: string;      // Unique identifier
  label: string;      // Display name
  icon: ReactNode;    // Icon component
  isCustom?: boolean; // Whether this is a custom-added person
}

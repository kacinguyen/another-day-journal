
// Tags are auto-managed by Notion multi-select fields.
// No explicit tag CRUD is needed — when an entry is saved with a new tag value,
// Notion automatically creates the multi-select option.

// This file is kept for backward compatibility but all functions are no-ops or derived.
export interface CustomTags {
  events?: Record<string, {
    label: string;
    value: string;
  }>;
  activities?: Record<string, {
    label: string;
    value: string;
  }>;
}

/**
 * Fetches custom tags — returns empty since Notion auto-manages tags
 */
export const fetchCustomTags = async (): Promise<CustomTags | null> => {
  return { events: {}, activities: {} };
};

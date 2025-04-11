
/**
 * This file serves as the main entry point for journal-related services.
 * It re-exports functions from individual modules to maintain the existing API
 * while improving internal code organization.
 */

// Re-export all journal service functions to maintain the existing API
export { saveJournalEntry, fetchJournalEntries, deleteJournalEntry } from './journal/core';
export { importJournalEntries } from './journal/import';
export { 
  fetchCustomTags, 
  addCustomEventTag, 
  removeCustomEventTag,
  addCustomActivityTag,
  removeCustomActivityTag
} from './journal/tagsService';

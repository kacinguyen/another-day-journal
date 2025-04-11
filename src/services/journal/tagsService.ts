
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Define the structure for custom tags
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
 * Fetches the user's custom tags from their profile
 */
export const fetchCustomTags = async (userId: string): Promise<CustomTags | null> => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('custom_tags')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching custom tags:', error);
      return null;
    }

    // If there are no custom tags yet, return empty object
    return data?.custom_tags || { events: {}, activities: {} };
  } catch (error) {
    console.error('Error in fetchCustomTags:', error);
    return null;
  }
};

/**
 * Saves custom tags to the user's profile
 */
export const saveCustomTags = async (
  userId: string, 
  customTags: CustomTags
): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ custom_tags: customTags })
      .eq('id', userId);

    if (error) {
      console.error('Error saving custom tags:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveCustomTags:', error);
    return false;
  }
};

/**
 * Adds a new custom event tag
 */
export const addCustomEventTag = async (
  userId: string,
  tag: { value: string; label: string }
): Promise<boolean> => {
  if (!userId) return false;

  try {
    // Get current custom tags
    const customTags = await fetchCustomTags(userId);
    if (!customTags) return false;

    // Initialize events object if it doesn't exist
    if (!customTags.events) {
      customTags.events = {};
    }

    // Add new tag
    customTags.events[tag.value] = tag;

    // Save updated tags
    return await saveCustomTags(userId, customTags);
  } catch (error) {
    console.error('Error in addCustomEventTag:', error);
    return false;
  }
};

/**
 * Adds a new custom activity tag
 */
export const addCustomActivityTag = async (
  userId: string,
  tag: { value: string; label: string }
): Promise<boolean> => {
  if (!userId) return false;

  try {
    // Get current custom tags
    const customTags = await fetchCustomTags(userId);
    if (!customTags) return false;

    // Initialize activities object if it doesn't exist
    if (!customTags.activities) {
      customTags.activities = {};
    }

    // Add new tag
    customTags.activities[tag.value] = tag;

    // Save updated tags
    return await saveCustomTags(userId, customTags);
  } catch (error) {
    console.error('Error in addCustomActivityTag:', error);
    return false;
  }
};

/**
 * Removes a custom event tag
 */
export const removeCustomEventTag = async (
  userId: string,
  tagValue: string
): Promise<boolean> => {
  if (!userId) return false;

  try {
    // Get current custom tags
    const customTags = await fetchCustomTags(userId);
    if (!customTags || !customTags.events) return false;

    // Remove tag if it exists
    if (customTags.events[tagValue]) {
      delete customTags.events[tagValue];
      // Save updated tags
      return await saveCustomTags(userId, customTags);
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeCustomEventTag:', error);
    return false;
  }
};

/**
 * Removes a custom activity tag
 */
export const removeCustomActivityTag = async (
  userId: string,
  tagValue: string
): Promise<boolean> => {
  if (!userId) return false;

  try {
    // Get current custom tags
    const customTags = await fetchCustomTags(userId);
    if (!customTags || !customTags.activities) return false;

    // Remove tag if it exists
    if (customTags.activities[tagValue]) {
      delete customTags.activities[tagValue];
      // Save updated tags
      return await saveCustomTags(userId, customTags);
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeCustomActivityTag:', error);
    return false;
  }
};

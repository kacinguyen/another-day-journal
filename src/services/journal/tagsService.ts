
import { supabase } from "@/integrations/supabase/client";
import { EventType } from "@/components/journal/EventTracker";

interface CustomTagsData {
  activities?: string[];
  events?: string[];
}

/**
 * Save custom tags for the current user
 */
export async function saveCustomTags(type: 'activities' | 'events', tags: string[]): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Cannot save custom tags: No authenticated user");
      return false;
    }

    // First get existing tags
    const { data: existingData } = await supabase
      .from('profiles')
      .select('custom_tags')
      .eq('id', user.id)
      .single();
    
    // Prepare the new tags object
    const existingTags: CustomTagsData = existingData?.custom_tags || {};
    
    // Update the specific tag type
    existingTags[type] = tags;
    
    // Save back to profile
    const { error } = await supabase
      .from('profiles')
      .update({ custom_tags: existingTags })
      .eq('id', user.id);
    
    if (error) {
      console.error("Error saving custom tags:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveCustomTags:", error);
    return false;
  }
}

/**
 * Load custom tags for the current user
 */
export async function loadCustomTags(): Promise<CustomTagsData> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Cannot load custom tags: No authenticated user");
      return { activities: [], events: [] };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('custom_tags')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error loading custom tags:", error);
      return { activities: [], events: [] };
    }
    
    return data?.custom_tags || { activities: [], events: [] };
  } catch (error) {
    console.error("Error in loadCustomTags:", error);
    return { activities: [], events: [] };
  }
}

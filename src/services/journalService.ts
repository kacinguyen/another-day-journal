
import { JournalEntryData, MoodType } from "@/components/journal/JournalEntry";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Save a journal entry to Supabase
export const saveJournalEntry = async (entry: JournalEntryData): Promise<JournalEntryData | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast("You must be logged in to save journal entries", {
        description: "Please log in and try again",
      });
      return null;
    }

    // Convert date to ISO string
    const entryData = {
      user_id: user.id,
      content: entry.content,
      mood: entry.mood,
      energy_level: entry.energy,
      activities: entry.activities,
      emotions: entry.emotions,
      social_interactions: {
        people: entry.people,
        eventTypes: entry.eventTypes,
      },
      created_at: entry.id ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let result;

    if (entry.id) {
      // Update existing entry
      result = await supabase
        .from('journal_entries')
        .update(entryData)
        .eq('id', entry.id)
        .select()
        .single();
    } else {
      // Insert new entry
      result = await supabase
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single();
    }

    if (result.error) {
      toast("Failed to save journal entry", {
        description: result.error.message,
      });
      console.error("Error saving journal entry:", result.error);
      return null;
    }

    return {
      id: result.data.id,
      date: new Date(result.data.created_at),
      content: result.data.content,
      mood: result.data.mood as MoodType, // Cast string to MoodType
      energy: result.data.energy_level,
      activities: result.data.activities || [],
      people: result.data.social_interactions?.people || [],
      eventTypes: result.data.social_interactions?.eventTypes || [],
      emotions: result.data.emotions || [],
    };
  } catch (error) {
    console.error("Error in saveJournalEntry:", error);
    toast("An error occurred", {
      description: "Please try again later",
    });
    return null;
  }
};

// Fetch all journal entries for the current user
export const fetchJournalEntries = async (): Promise<JournalEntryData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching journal entries:", error);
      toast("Failed to load journal entries", {
        description: error.message,
      });
      return [];
    }

    // Convert database entries to JournalEntryData
    return data.map(entry => {
      // Parse the social_interactions object
      const socialInteractions = entry.social_interactions as { 
        people?: string[], 
        eventTypes?: string[] 
      } | null;

      return {
        id: entry.id,
        date: new Date(entry.created_at),
        content: entry.content || "",
        mood: (entry.mood as MoodType) || "neutral", // Cast to MoodType with default
        energy: entry.energy_level || 50,
        activities: entry.activities || [],
        people: socialInteractions?.people || [],
        eventTypes: socialInteractions?.eventTypes || [],
        emotions: Array.isArray(entry.emotions) ? entry.emotions : [],
      };
    });
  } catch (error) {
    console.error("Error in fetchJournalEntries:", error);
    return [];
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error("Error deleting journal entry:", error);
      toast("Failed to delete journal entry", {
        description: error.message,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteJournalEntry:", error);
    return false;
  }
};

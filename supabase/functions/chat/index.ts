
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'REDACTED_SUPABASE_URL';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || 'REDACTED_SUPABASE_ANON_KEY';

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch journal entries for a user
async function fetchJournalEntries(userId: string) {
  try {
    console.log(`FETCH: Starting to fetch journal entries for user ${userId}`);
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("ERROR: Error fetching journal entries:", error);
      return [];
    }
    
    console.log(`SUCCESS: Found ${data?.length || 0} journal entries`);
    
    // Log more detailed information about the entries
    if (data && data.length > 0) {
      console.log("SAMPLE: First entry date:", new Date(data[0].created_at).toISOString());
      console.log("SAMPLE: First entry mood:", data[0].mood);
      
      // Log a few entries to see date patterns
      data.slice(0, 3).forEach((entry, i) => {
        console.log(`ENTRY ${i}: Date=${new Date(entry.created_at).toISOString()}, Mood=${entry.mood}`);
      });
      
      // Check for entries in March specifically
      const marchEntries = data.filter(entry => {
        const date = new Date(entry.created_at);
        return date.getMonth() === 2; // March is month 2 (0-indexed)
      });
      
      console.log(`MARCH ENTRIES: Found ${marchEntries.length} entries from March`);
    } else {
      console.log("WARNING: No journal entries found for this user");
    }
    
    return data || [];
  } catch (err) {
    console.error("EXCEPTION: Error fetching journal entries:", err);
    return [];
  }
}

// Format journal entries as context for the AI
function formatJournalContext(entries: any[]) {
  if (!entries.length) {
    console.log("FORMATTING: No journal entries found to format");
    return "";
  }
  
  console.log(`FORMATTING: Starting to format ${entries.length} journal entries for context`);
  
  const formattedEntries = entries.map(entry => {
    try {
      // Use a proper date formatting
      const entryDate = new Date(entry.created_at);
      const formattedDate = entryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Format emotions with proper handling for different data types
      let emotionsText = "";
      if (entry.emotions) {
        if (Array.isArray(entry.emotions)) {
          emotionsText = entry.emotions.join(", ");
        } else if (typeof entry.emotions === 'object') {
          emotionsText = JSON.stringify(entry.emotions);
        } else {
          emotionsText = String(entry.emotions);
        }
      }
      
      // Extract social interactions with careful checks
      let peopleText = "";
      let eventsText = "";
      
      if (entry.social_interactions) {
        let social = entry.social_interactions;
        
        // Handle string or object format
        if (typeof social === 'string') {
          try {
            social = JSON.parse(social);
          } catch (e) {
            console.log("WARNING: Could not parse social_interactions JSON:", e);
          }
        }
        
        if (social && typeof social === 'object') {
          if (social.people && Array.isArray(social.people) && social.people.length > 0) {
            peopleText = social.people.join(", ");
          }
          
          if (social.eventTypes && Array.isArray(social.eventTypes) && social.eventTypes.length > 0) {
            eventsText = social.eventTypes.join(", ");
          }
        }
      }
      
      // Build the context with all available information
      let context = `=== JOURNAL ENTRY FROM ${formattedDate} ===\n`;
      
      if (entry.mood) {
        context += `Mood: ${entry.mood}\n`;
      }
      
      if (emotionsText) {
        context += `Emotions: ${emotionsText}\n`;
      }
      
      if (entry.energy_level !== null && entry.energy_level !== undefined) {
        context += `Energy Level: ${entry.energy_level}/100\n`;
      }
      
      if (entry.content) {
        context += `Journal Text: ${entry.content}\n`;
      }
      
      if (Array.isArray(entry.activities) && entry.activities.length > 0) {
        context += `Activities: ${entry.activities.join(", ")}\n`;
      }
      
      if (peopleText) {
        context += `People I spent time with: ${peopleText}\n`;
      }
      
      if (eventsText) {
        context += `Events/Social contexts: ${eventsText}\n`;
      }
      
      return context;
    } catch (error) {
      console.error("ERROR: Failed to format entry:", error);
      return `=== ERROR FORMATTING ENTRY ===\nEntry ID: ${entry.id}\nDate: ${entry.created_at}\n`;
    }
  }).join("\n\n");
  
  // Log the first part of the formatted context
  const previewLength = Math.min(500, formattedEntries.length);
  console.log(`CONTEXT PREVIEW (${previewLength} chars of ${formattedEntries.length}):`);
  console.log(formattedEntries.substring(0, previewLength) + "...");
  
  return formattedEntries;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user info and message from request
    const { message, history, userId } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'No user ID provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`REQUEST: Processing request for user ${userId}`);
    
    // Fetch journal entries for context
    const journalEntries = await fetchJournalEntries(userId);
    const journalContext = formatJournalContext(journalEntries);
    
    // Build messages for OpenAI
    const systemPrompt = `You are a helpful AI assistant for a journaling app called Journal Flow. You have access to the user's journal entries which provide context about their life, moods, activities, and experiences.

${journalEntries.length > 0 ? "Here are the user's journal entries (formatted with dates, moods, emotions, activities, and other details):" : "The user has not created any journal entries yet."}

${journalContext}

When responding to the user:
1. If they have journal entries, reference specific details from their entries when relevant
2. If they ask about patterns or insights, analyze the information from their entries
3. Be supportive, empathetic, and thoughtful

IMPORTANT: If the user has journal entries (${journalEntries.length} found), DO NOT say they don't have any entries. Instead, use the information provided above to give personalized responses.`;

    console.log("SYSTEM PROMPT: Length =", systemPrompt.length);
    
    // Create conversation history
    const messages = [
      { role: "system", content: systemPrompt },
      // Include conversation history if available
      ...(history || []),
      { role: "user", content: message }
    ];
    
    console.log("OPENAI: Sending request to OpenAI API");
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OPENAI ERROR:', errorData);
      
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("SUCCESS: Got response from OpenAI");
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('ERROR: Error in chat function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

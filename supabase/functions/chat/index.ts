
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
    console.log(`Fetching journal entries for user ${userId}`);
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching journal entries:", error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} journal entries`);
    if (data && data.length > 0) {
      console.log("First entry created_at:", data[0].created_at);
      console.log("First entry sample:", JSON.stringify(data[0]).substring(0, 200) + "...");
    }
    
    return data || [];
  } catch (err) {
    console.error("Exception fetching journal entries:", err);
    return [];
  }
}

// Format journal entries as context for the AI
function formatJournalContext(entries: any[]) {
  if (!entries.length) {
    console.log("No journal entries found to format");
    return "You don't have any journal entries yet.";
  }
  
  console.log(`Formatting ${entries.length} journal entries for context`);
  
  return entries.map(entry => {
    const date = new Date(entry.created_at).toLocaleDateString();
    
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
      const social = typeof entry.social_interactions === 'string' 
        ? JSON.parse(entry.social_interactions) 
        : entry.social_interactions;
      
      if (social.people && Array.isArray(social.people) && social.people.length > 0) {
        peopleText = social.people.join(", ");
      }
      
      if (social.eventTypes && Array.isArray(social.eventTypes) && social.eventTypes.length > 0) {
        eventsText = social.eventTypes.join(", ");
      }
    }
    
    // Build the context with all available information
    let context = `=== ENTRY FROM ${date} ===\n`;
    
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
  }).join("\n\n");
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
    
    console.log(`Processing request for user ${userId}`);
    
    // Fetch journal entries for context
    const journalEntries = await fetchJournalEntries(userId);
    const journalContext = formatJournalContext(journalEntries);
    
    // Build messages for OpenAI
    const systemPrompt = `You are a helpful AI assistant for a journaling app called Journal Flow. You have access to the user's journal entries which provide context about their life, moods, activities, and experiences.

Here are the user's journal entries (formatted with dates, moods, activities, and other details):

${journalContext}

Use these entries as context when responding to the user. If relevant, you can refer to specific details from their entries, patterns in their moods or activities, or insights that might be helpful. Be supportive, empathetic, and insightful.

If the user asks about specific dates or events mentioned in their journal, provide that information. If they ask about patterns or insights across multiple entries, analyze the information and provide thoughtful observations.

Important: If the user has journal entries, never say they don't have any. Instead, use the entries shown above to respond contextually. If asked about something not in their entries, you can acknowledge what you do know from their journal and then ask for more information.`;

    // Create conversation history
    const messages = [
      { role: "system", content: systemPrompt },
      // Include conversation history if available
      ...(history || []),
      { role: "user", content: message }
    ];
    
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
      console.error('OpenAI API error:', errorData);
      
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in chat function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

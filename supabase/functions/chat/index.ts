
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
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching journal entries:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Exception fetching journal entries:", err);
    return [];
  }
}

// Format journal entries as context for the AI
function formatJournalContext(entries: any[]) {
  if (!entries.length) return "You don't have any journal entries yet.";
  
  return entries.map(entry => {
    const date = new Date(entry.created_at).toLocaleDateString();
    const emotions = Array.isArray(entry.emotions) ? entry.emotions.join(", ") : "";
    
    let context = `Date: ${date}\nMood: ${entry.mood || 'Unknown'}\n`;
    
    if (emotions) {
      context += `Emotions: ${emotions}\n`;
    }
    
    if (entry.energy_level) {
      context += `Energy: ${entry.energy_level}/100\n`;
    }
    
    if (entry.content) {
      context += `Entry: ${entry.content}\n`;
    }
    
    if (Array.isArray(entry.activities) && entry.activities.length > 0) {
      context += `Activities: ${entry.activities.join(", ")}\n`;
    }
    
    // Add social interactions if available
    if (entry.social_interactions) {
      const social = entry.social_interactions;
      
      if (social.people && social.people.length > 0) {
        context += `People: ${social.people.join(", ")}\n`;
      }
      
      if (social.eventTypes && social.eventTypes.length > 0) {
        context += `Events: ${social.eventTypes.join(", ")}\n`;
      }
    }
    
    return context;
  }).join("\n\n---------\n\n");
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
    
    // Fetch journal entries for context
    const journalEntries = await fetchJournalEntries(userId);
    const journalContext = formatJournalContext(journalEntries);
    
    // Build messages for OpenAI
    const systemPrompt = `You are a helpful AI assistant for a journaling app. You have access to the user's journal entries which provide context about their life, moods, activities, and experiences.

Here are the user's journal entries:

${journalContext}

Use these entries as context when responding to the user. If relevant, you can refer to specific entries, patterns in their moods or activities, or insights that might be helpful. Be supportive, empathetic, and insightful. Respect the user's privacy and provide thoughtful responses that show you understand their history as documented in their journal.

If the user asks about something not covered in their journal entries, you can still be helpful, but acknowledge when you don't have specific information about their experience.`;

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

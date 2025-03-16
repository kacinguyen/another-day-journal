
import { useState, useCallback } from "react";
import { Message } from "@/components/chat/types";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  // This function sends a message to the AI and gets a response
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use the conversation feature.",
        variant: "destructive",
      });
      return;
    }

    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Format message history for the API
      const historyFormatted = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role, 
          content: msg.content
        }));

      // Get access token from the current session
      const accessToken = session.access_token;
      
      // Call the edge function with authorization header
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          message: content,
          history: historyFormatted,
          userId: user.id,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.response) {
        // Add AI response to chat
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error in conversation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get a response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, session, toast]);

  // Function to clear the conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  };
}

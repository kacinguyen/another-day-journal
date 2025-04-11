
import { useState, useCallback, useEffect } from "react";
import { Message } from "@/components/chat/types";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Initialize with a new conversation or load from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem("savedConversations");
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
        
        // Set the most recent conversation as active
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
        } else {
          createNewConversation();
        }
      } catch (e) {
        console.error("Error parsing saved conversations:", e);
        createNewConversation();
      }
    } else {
      createNewConversation();
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("savedConversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  // Get the active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;
  
  // Create a new conversation
  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: `Conversation ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    
    toast({
      description: "Started a new conversation",
    });
    
    return newConversation.id;
  }, [toast]);

  // Rename a conversation
  const renameConversation = useCallback((id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { 
              ...conv, 
              title: newTitle.trim(),
              updatedAt: new Date()
            } 
          : conv
      )
    );
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== id);
      
      // If we're deleting the active conversation, set a new active conversation
      if (id === activeConversationId && filtered.length > 0) {
        setActiveConversationId(filtered[0].id);
      } else if (filtered.length === 0) {
        // If no conversations left, create a new one
        setTimeout(() => createNewConversation(), 0);
      }
      
      return filtered;
    });
    
    toast({
      description: "Conversation deleted",
      variant: "destructive",
    });
  }, [activeConversationId, createNewConversation, toast]);

  // Switch to a different conversation
  const switchConversation = useCallback((id: string) => {
    if (conversations.some(c => c.id === id)) {
      setActiveConversationId(id);
    }
  }, [conversations]);

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

    // Ensure we have an active conversation
    if (!activeConversationId) {
      createNewConversation();
      return;
    }

    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    // Update the active conversation with the new message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date(),
            // If this is the first message, use part of it as the title
            title: conv.messages.length === 0 
              ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
              : conv.title
          }
        : conv
    ));

    setIsLoading(true);

    try {
      // Get the active conversation messages
      const activeConv = conversations.find(c => c.id === activeConversationId);
      if (!activeConv) throw new Error("Active conversation not found");
      
      // Format message history for the API
      const historyFormatted = activeConv.messages
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
        
        // Update the conversation with the assistant's response
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, assistantMessage],
                updatedAt: new Date()
              }
            : conv
        ));
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
  }, [conversations, activeConversationId, user, session, toast, createNewConversation]);

  // Function to clear the active conversation
  const clearConversation = useCallback(() => {
    if (!activeConversationId) return;
    
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? {
            ...conv,
            messages: [],
            updatedAt: new Date()
          }
        : conv
    ));
    
    toast({
      description: "Conversation cleared",
    });
  }, [activeConversationId, toast]);

  return {
    conversations,
    activeConversationId,
    messages: activeConversation ? activeConversation.messages : [],
    isLoading,
    sendMessage,
    clearConversation,
    createNewConversation,
    switchConversation,
    deleteConversation,
    renameConversation
  };
}

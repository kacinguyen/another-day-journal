
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleX } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import { useConversation } from "@/hooks/useConversation";
import { useAuth } from "@/context/AuthContext";

const Conversations = () => {
  const { messages, isLoading, sendMessage, clearConversation } = useConversation();
  const { user } = useAuth();

  // Force scroll to top when this component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container animate-fade-up">
      <div className="space-y-1 mb-6">
        <div className="inline-block">
          <span className="text-xs font-medium text-journal-accent-foreground bg-journal-accent/10 px-2 py-0.5 rounded-full">
            AI Assistant
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground max-w-2xl">
          Chat with an AI assistant that has access to your journal entries for personalized responses.
        </p>
      </div>
      
      {!user ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Sign in to use this feature</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to have conversations with the AI assistant.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              disabled={messages.length === 0 || isLoading}
              className="text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground"
            >
              <CircleX className="mr-2 h-4 w-4" />
              Clear conversation
            </Button>
          </div>
          
          <Card className="w-full h-[600px]">
            <ChatInterface 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={sendMessage} 
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Conversations;

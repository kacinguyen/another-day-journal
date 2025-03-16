
import React from "react";
import { Message, ChatProps } from "./types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatInterface: React.FC<ChatProps> = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 h-[500px]">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-muted-foreground">
              Start a conversation with your journal assistant
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
          
          {isLoading && (
            <ChatMessage 
              message={{ 
                id: 'loading', 
                role: 'assistant', 
                content: '', 
                timestamp: new Date() 
              }} 
              isLoading={true} 
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;

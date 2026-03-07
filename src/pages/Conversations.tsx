
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import { useConversation } from "@/hooks/useConversation";
import { PromptManager } from "@/components/chat/PromptManager";
import { fetchJournalEntries } from "@/services/journalService";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";

const Conversations = () => {
  const { messages, isLoading, sendMessage, clearConversation } = useConversation();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Warm the server-side cache so the first chat message is fast
    queryClient.prefetchQuery({
      queryKey: ['journal-entries'],
      queryFn: () => fetchJournalEntries(),
    });
  }, [queryClient]);

  const handleSelectPrompt = (promptText: string) => {
    if (promptText.trim() !== "") {
      sendMessage(promptText);
    }
  };

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

        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[600px] rounded-lg border"
        >
          <ResizablePanel
            defaultSize={25}
            minSize={20}
            maxSize={40}
            className="bg-background"
          >
            <PromptManager onSelectPrompt={handleSelectPrompt} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={75}>
            <div className="h-[600px]">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                onSendMessage={sendMessage}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Conversations;

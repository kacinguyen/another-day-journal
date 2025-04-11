
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Conversation } from "@/hooks/useConversation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Pencil, Save, Trash2, Check, X } from "lucide-react";

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onNewConversation: () => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  activeConversationId,
  onSwitchConversation,
  onDeleteConversation,
  onRenameConversation,
  onNewConversation
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = (id: string) => {
    onRenameConversation(id, editTitle);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium mb-3">Conversations</h3>
        <Button 
          size="sm" 
          className="w-full" 
          onClick={onNewConversation}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No conversations yet.
              <br />
              Start a new conversation to begin.
            </div>
          ) : (
            conversations.map(conversation => (
              <div 
                key={conversation.id} 
                className={`group flex items-start gap-2 p-3 rounded-md border ${
                  conversation.id === activeConversationId 
                    ? "bg-accent border-accent-foreground/20" 
                    : "border-border hover:bg-accent/50"
                }`}
              >
                {editingId === conversation.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveEdit(conversation.id);
                        } else if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => saveEdit(conversation.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={cancelEdit}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onSwitchConversation(conversation.id)}
                    >
                      <p className="text-sm font-medium line-clamp-1">
                        {conversation.title || "Untitled conversation"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conversation.messages.length === 0 
                          ? "No messages" 
                          : `${conversation.messages.length} message${conversation.messages.length === 1 ? "" : "s"}`}
                        {" · "}
                        {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 shrink-0" 
                        onClick={() => startEditing(conversation.id, conversation.title)}
                        title="Rename"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 shrink-0 text-destructive hover:text-destructive" 
                        onClick={() => onDeleteConversation(conversation.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

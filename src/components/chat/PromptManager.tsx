
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SavedPrompt } from "./SavedPrompt";
import { PlusCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface PromptData {
  id: string;
  text: string;
}

interface PromptManagerProps {
  onSelectPrompt: (text: string) => void;
}

export const PromptManager: React.FC<PromptManagerProps> = ({ onSelectPrompt }) => {
  const [newPrompt, setNewPrompt] = useState("");
  const [prompts, setPrompts] = useState<PromptData[]>(() => {
    const savedPrompts = localStorage.getItem("savedPrompts");
    return savedPrompts ? JSON.parse(savedPrompts) : [];
  });
  const { toast } = useToast();

  // Save prompts to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("savedPrompts", JSON.stringify(prompts));
  }, [prompts]);

  const addPrompt = () => {
    if (newPrompt.trim() === "") return;
    
    const prompt: PromptData = {
      id: uuidv4(),
      text: newPrompt.trim()
    };
    
    setPrompts(prev => [prompt, ...prev]);
    setNewPrompt("");
    
    toast({
      description: "Prompt saved successfully",
    });
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(prompt => prompt.id !== id));
    
    toast({
      description: "Prompt deleted",
      variant: "destructive",
    });
  };

  const handleSelect = (text: string) => {
    onSelectPrompt(text);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium mb-3">Saved Prompts</h3>
        <div className="flex gap-2">
          <Input
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="Save a new prompt..."
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addPrompt();
              }
            }}
          />
          <Button 
            size="sm" 
            onClick={addPrompt}
            disabled={newPrompt.trim() === ""}
          >
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {prompts.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No saved prompts yet.
              <br />
              Save prompts for quick access later.
            </div>
          ) : (
            prompts.map(prompt => (
              <SavedPrompt
                key={prompt.id}
                id={prompt.id}
                text={prompt.text}
                onSelect={handleSelect}
                onDelete={deletePrompt}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

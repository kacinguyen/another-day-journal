
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EntryContentProps {
  content: string;
  onChange: (content: string) => void;
  isLoading?: boolean;
}

/**
 * Component that handles the journal entry content textarea
 */
const EntryContent: React.FC<EntryContentProps> = ({ content, onChange, isLoading }) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <Label htmlFor="content" className="sr-only">Journal Content</Label>
        <Textarea
          id="content"
          placeholder={isLoading ? "Loading content..." : "What's on your mind today? How was your day?"}
          className="min-h-40 resize-y"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="text-right text-xs text-muted-foreground">
        {isLoading ? "Loading..." : `${content.length} characters`}
      </div>
    </div>
  );
};

export default EntryContent;


import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EntryContentProps {
  content: string;
  onChange: (content: string) => void;
}

/**
 * Component that handles the journal entry content textarea
 */
const EntryContent: React.FC<EntryContentProps> = ({ content, onChange }) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <Label htmlFor="content" className="sr-only">Journal Content</Label>
        <Textarea
          id="content"
          placeholder="What's on your mind today? How was your day?"
          className="min-h-40 resize-y"
          value={content}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="text-right text-xs text-muted-foreground">
        {content.length} characters
      </div>
    </div>
  );
};

export default EntryContent;

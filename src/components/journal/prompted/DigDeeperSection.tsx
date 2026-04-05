import React from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DigDeeperSectionProps {
  questions: string[];
  isLoading: boolean;
}

const DigDeeperSection: React.FC<DigDeeperSectionProps> = ({
  questions,
  isLoading,
}) => {
  if (!isLoading && questions.length === 0) return null;

  return (
    <div className="space-y-2 pt-4 border-t border-dashed border-muted-foreground/20">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Sparkles className="h-3.5 w-3.5" />
        Reflect a little deeper...
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 rounded-md bg-muted/50 animate-pulse"
              style={{ width: `${60 + i * 10}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {questions.map((question, i) => (
            <div
              key={i}
              className="flex items-start gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {question}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DigDeeperSection;

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { Era } from "@/types/era";

interface EraCardProps {
  era: Era;
  isGenerating: boolean;
  onGenerate: () => void;
}

function formatDateRange(start: string, end: string): string {
  return `${format(parseISO(start), "MMM d")} – ${format(parseISO(end), "MMM d, yyyy")}`;
}

const EraCard = ({ era, isGenerating, onGenerate }: EraCardProps) => {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{era.title}</CardTitle>
            <CardDescription className="mt-1">
              {formatDateRange(era.startDate, era.endDate)}
            </CardDescription>
          </div>
          <Badge variant="secondary">{era.moodBaseline}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {era.coreVibe}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {era.keyEntities.map((entity) => (
            <Badge key={entity} variant="outline" className="text-xs font-normal">
              {entity}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Palette:</span>
          <span className="text-xs italic text-muted-foreground">{era.palette}</span>
        </div>

        {/* Image area */}
        {era.imageUrl ? (
          <img
            src={era.imageUrl}
            alt={`Illustration for "${era.title}"`}
            className="w-full rounded-lg"
          />
        ) : (
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            variant="outline"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        )}

        {/* Collapsible prompt */}
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPrompt ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Image prompt
        </button>
        {showPrompt && (
          <p className="text-xs text-muted-foreground bg-muted rounded-md p-3 leading-relaxed">
            {era.imagePrompt}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EraCard;

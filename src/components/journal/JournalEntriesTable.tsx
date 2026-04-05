
import React from "react";
import { format } from "date-fns";
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMoodEmoji } from "@/utils/journalUtils";
import { surface, sizing } from "@/styles/tokens";
import {
  PartyPopper,
  UtensilsCrossed,
  Coffee,
  Home,
  ShoppingBag,
  TreeDeciduous,
  Briefcase,
  Plane,
  Users,
  Tag,
  Zap,
  Thermometer,
  BatteryLow,
  Trophy,
  AlertTriangle,
  Sparkles,
  Heart,
  Cloud,
  Smile,
  Check,
  Clock
} from "lucide-react";

/**
 * Component to display a list of journal entries
 */
export const JournalEntriesTable: React.FC<{ 
  entries: JournalEntryData[];
  onEntryClick?: (entry: JournalEntryData) => void;
}> = ({ entries, onEntryClick }) => {
  /**
   * Returns the appropriate icon component for an event type
   */
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "party": return <PartyPopper className="h-4 w-4" />;
      case "restaurant": return <UtensilsCrossed className="h-4 w-4" />;
      case "cafe": return <Coffee className="h-4 w-4" />;
      case "home": return <Home className="h-4 w-4" />;
      case "shopping": return <ShoppingBag className="h-4 w-4" />;
      case "outdoors": return <TreeDeciduous className="h-4 w-4" />;
      case "office": return <Briefcase className="h-4 w-4" />;
      case "workFromHome": return <Home className="h-4 w-4" />;
      case "travel": return <Plane className="h-4 w-4" />;
      case "hangout": return <Users className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  /**
   * Returns the appropriate icon component for an emotion
   */
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "excited": return <Zap className="h-4 w-4" />;
      case "stressed": return <Thermometer className="h-4 w-4" />;
      case "tired": return <BatteryLow className="h-4 w-4" />;
      case "proud": return <Trophy className="h-4 w-4" />;
      case "anxious": return <AlertTriangle className="h-4 w-4" />;
      case "bored": return <Coffee className="h-4 w-4" />;
      case "enthusiastic": return <Sparkles className="h-4 w-4" />;
      case "grateful": return <Heart className="h-4 w-4" />;
      case "depressed": return <Cloud className="h-4 w-4" />;
      case "happy": return <Smile className="h-4 w-4" />;
      case "content": return <Check className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 60) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + "..." 
      : content;
  };

  // Format a date relative to now (e.g., "2 hours ago", "yesterday", etc.)
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <ScrollArea className={`${sizing.entriesScroll} pr-4`}>
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card 
            key={entry.id} 
            className={`p-4 cursor-pointer ${surface.hover} transition-colors`}
            onClick={() => onEntryClick && onEntryClick(entry)}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                <span className="flex items-center gap-1 text-sm">
                  {getMoodEmoji(entry.mood)} {entry.mood}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated {formatRelativeTime(entry.updatedAt)}</span>
              </div>
              
              {entry.emotions && entry.emotions.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium mb-1">Emotions</h3>
                  <div className="flex flex-wrap gap-1">
                    {entry.emotions.slice(0, 2).map(emotion => (
                      <Badge 
                        key={emotion} 
                        variant="outline" 
                        className="flex items-center gap-1 py-0.5 text-xs"
                      >
                        {getEmotionIcon(emotion)}
                        <span className="capitalize">{emotion}</span>
                      </Badge>
                    ))}
                    {entry.emotions.length > 2 && (
                      <Badge variant="outline" className="py-0.5 text-xs">
                        +{entry.emotions.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-xs font-medium mb-1">Content</h3>
                <p className="text-sm">{truncateContent(entry.content)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default JournalEntriesTable;


import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { JournalEntryData } from "@/components/journal/JournalEntry";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getMoodEmoji } from "@/utils/journalUtils";
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
  Check
} from "lucide-react";

/**
 * Component to display a table of journal entries
 */
export const JournalEntriesTable: React.FC<{ entries: JournalEntryData[] }> = ({ entries }) => {
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

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mood</TableHead>
              <TableHead>Emotions</TableHead>
              <TableHead>Energy</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Activities</TableHead>
              <TableHead>People</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    {getMoodEmoji(entry.mood)} {entry.mood}
                  </span>
                </TableCell>
                <TableCell>
                  {entry.emotions && entry.emotions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {entry.emotions.map(emotion => (
                        <Badge 
                          key={emotion} 
                          variant="outline" 
                          className="flex items-center gap-1 py-0.5 text-xs"
                        >
                          {getEmotionIcon(emotion)}
                          <span className="capitalize">{emotion}</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </TableCell>
                <TableCell>{entry.energy}%</TableCell>
                <TableCell>
                  {entry.eventTypes && entry.eventTypes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {entry.eventTypes.map(eventType => (
                        <Badge 
                          key={eventType} 
                          variant="outline" 
                          className="flex items-center gap-1 py-0.5 text-xs"
                        >
                          {getEventIcon(eventType)}
                          <span className="capitalize">{eventType}</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">{entry.content}</TableCell>
                <TableCell>{entry.activities.join(", ")}</TableCell>
                <TableCell>{entry.people.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default JournalEntriesTable;

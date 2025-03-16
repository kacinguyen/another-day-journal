import React from "react";
import { format } from "date-fns";
import { dummyEntry, getMoodEmoji, } from "@/utils/journalUtils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
 * Component to display an example journal entry
 */
const ExampleJournalEntry: React.FC = () => {
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Example Entry</CardTitle>
        <CardDescription>Here's what your journal entries will look like</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{format(new Date(dummyEntry.date), 'MMM dd, yyyy')}</span>
            <span className="flex items-center gap-1 text-sm">
              {getMoodEmoji(dummyEntry.mood)} {dummyEntry.mood}
            </span>
          </div>
          
          <div>
            <h3 className="text-xs font-medium mb-1">Emotions</h3>
            <div className="flex flex-wrap gap-1">
              {dummyEntry.emotions.slice(0, 2).map(emotion => (
                <Badge 
                  key={emotion} 
                  variant="outline" 
                  className="flex items-center gap-1 py-0.5 text-xs"
                >
                  {getEmotionIcon(emotion)}
                  <span className="capitalize">{emotion}</span>
                </Badge>
              ))}
              {dummyEntry.emotions.length > 2 && (
                <Badge variant="outline" className="py-0.5 text-xs">
                  +{dummyEntry.emotions.length - 2} more
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-medium mb-1">Content</h3>
            <p className="text-sm">{truncateContent(dummyEntry.content)}</p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full mt-2"
            onClick={() => document.getElementById('journal-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Create your first entry <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExampleJournalEntry;

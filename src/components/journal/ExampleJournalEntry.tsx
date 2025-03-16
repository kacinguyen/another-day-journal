
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

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Example Entry</CardTitle>
        <CardDescription>Here's what your journal entries will look like</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Date</h3>
            <p>{format(new Date(dummyEntry.date), 'MMM dd, yyyy')}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Mood</h3>
            <span className="flex items-center gap-1">
              {getMoodEmoji(dummyEntry.mood)} {dummyEntry.mood}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Emotions</h3>
            <div className="flex flex-wrap gap-1">
              {dummyEntry.emotions.map(emotion => (
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
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Energy</h3>
            <p>{dummyEntry.energy}%</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Events</h3>
            <div className="flex flex-wrap gap-1">
              {dummyEntry.eventTypes.map(eventType => (
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
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Content</h3>
            <p>{dummyEntry.content}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Activities</h3>
            <p>{dummyEntry.activities.join(", ")}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">People</h3>
            <p>{dummyEntry.people.join(", ")}</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => document.getElementById('journal-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Create Your First Entry <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExampleJournalEntry;


import React from "react";
import { 
  PartyPopper, 
  UtensilsCrossed, 
  Coffee, 
  Home, 
  Film, 
  Book, 
  Music, 
  Gamepad, 
  ShoppingBag, 
  TreeDeciduous 
} from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type EventType = 
  | "party" 
  | "restaurant" 
  | "cafe" 
  | "home" 
  | "movie" 
  | "reading" 
  | "music" 
  | "gaming" 
  | "shopping" 
  | "outdoors" 
  | "other";

interface EventTrackerProps {
  value: EventType | null;
  onChange: (value: EventType | null) => void;
}

interface EventOption {
  value: EventType;
  label: string;
  icon: React.ReactNode;
}

const EventTracker: React.FC<EventTrackerProps> = ({ value, onChange }) => {
  const eventOptions: EventOption[] = [
    { value: "party", label: "Party", icon: <PartyPopper className="h-4 w-4" /> },
    { value: "restaurant", label: "Restaurant", icon: <UtensilsCrossed className="h-4 w-4" /> },
    { value: "cafe", label: "Cafe", icon: <Coffee className="h-4 w-4" /> },
    { value: "home", label: "Staying Home", icon: <Home className="h-4 w-4" /> },
    { value: "movie", label: "Movie", icon: <Film className="h-4 w-4" /> },
    { value: "reading", label: "Reading", icon: <Book className="h-4 w-4" /> },
    { value: "music", label: "Music", icon: <Music className="h-4 w-4" /> },
    { value: "gaming", label: "Gaming", icon: <Gamepad className="h-4 w-4" /> },
    { value: "shopping", label: "Shopping", icon: <ShoppingBag className="h-4 w-4" /> },
    { value: "outdoors", label: "Outdoors", icon: <TreeDeciduous className="h-4 w-4" /> },
  ];

  const handleValueChange = (newValue: string) => {
    if (newValue === "") {
      onChange(null);
    } else {
      onChange(newValue as EventType);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Event Type</label>
      
      <TooltipProvider delayDuration={300}>
        <ToggleGroup 
          type="single" 
          value={value || ""} 
          onValueChange={handleValueChange}
          className="flex flex-wrap justify-start gap-2"
        >
          {eventOptions.map((option) => (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value={option.value} 
                  aria-label={option.label}
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {option.icon}
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{option.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </TooltipProvider>
      
      {value && (
        <p className="text-xs text-muted-foreground">
          Selected: {eventOptions.find(o => o.value === value)?.label || value}
        </p>
      )}
    </div>
  );
};

export default EventTracker;

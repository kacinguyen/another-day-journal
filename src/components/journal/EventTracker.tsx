
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
  values: EventType[];
  onChange: (values: EventType[]) => void;
}

interface EventOption {
  value: EventType;
  label: string;
  icon: React.ReactNode;
}

const EventTracker: React.FC<EventTrackerProps> = ({ values, onChange }) => {
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

  const handleToggleEvent = (event: EventType) => {
    if (values.includes(event)) {
      onChange(values.filter(v => v !== event));
    } else {
      onChange([...values, event]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Event Tags</label>
      
      <div className="flex flex-wrap gap-2">
        {eventOptions.map((option) => (
          <TooltipProvider key={option.value} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`
                    inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer
                    ${values.includes(option.value) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
                  `}
                  onClick={() => handleToggleEvent(option.value)}
                >
                  {option.icon}
                  <span className="text-xs font-medium">{option.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle {option.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs text-muted-foreground">Selected: </span>
          {values.map(value => {
            const eventOption = eventOptions.find(o => o.value === value);
            return (
              <Badge 
                key={value} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {eventOption?.icon}
                {eventOption?.label}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventTracker;

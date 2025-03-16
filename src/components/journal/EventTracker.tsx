
import React, { useState } from "react";
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
  Plus,
  Tag
} from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export type EventType = 
  | "party" 
  | "restaurant" 
  | "cafe" 
  | "home" 
  | "shopping" 
  | "outdoors" 
  | "office"
  | "workFromHome"
  | "travel"
  | "hangout"
  | "other"
  | string; // Allow custom event types

interface EventTrackerProps {
  values: EventType[];
  onChange: (values: EventType[]) => void;
}

interface EventOption {
  value: EventType;
  label: string;
  icon: React.ReactNode;
  isCustom?: boolean;
}

const EventTracker: React.FC<EventTrackerProps> = ({ values, onChange }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [customEventOptions, setCustomEventOptions] = useState<EventOption[]>([]);

  const defaultEventOptions: EventOption[] = [
    { value: "party", label: "Party", icon: <PartyPopper className="h-4 w-4" /> },
    { value: "restaurant", label: "Restaurant", icon: <UtensilsCrossed className="h-4 w-4" /> },
    { value: "cafe", label: "Cafe", icon: <Coffee className="h-4 w-4" /> },
    { value: "home", label: "Staying Home", icon: <Home className="h-4 w-4" /> },
    { value: "shopping", label: "Shopping", icon: <ShoppingBag className="h-4 w-4" /> },
    { value: "outdoors", label: "Outdoors", icon: <TreeDeciduous className="h-4 w-4" /> },
    { value: "office", label: "Office", icon: <Briefcase className="h-4 w-4" /> },
    { value: "workFromHome", label: "WFH", icon: <Home className="h-4 w-4" /> },
    { value: "travel", label: "Travel", icon: <Plane className="h-4 w-4" /> },
    { value: "hangout", label: "Hangout", icon: <Users className="h-4 w-4" /> },
  ];

  const allEventOptions = [...defaultEventOptions, ...customEventOptions];

  const handleToggleEvent = (event: EventType) => {
    if (values.includes(event)) {
      onChange(values.filter(v => v !== event));
    } else {
      onChange([...values, event]);
    }
  };

  const handleAddNewTag = () => {
    if (newTagName.trim() === "") return;
    
    const newTagValue = newTagName.toLowerCase().replace(/\s+/g, '');
    
    // Check if the tag already exists
    if (allEventOptions.some(option => option.value === newTagValue)) {
      // Add the existing tag if it's not already selected
      if (!values.includes(newTagValue)) {
        handleToggleEvent(newTagValue);
      }
    } else {
      // Add the new custom tag
      const newTag: EventOption = {
        value: newTagValue,
        label: newTagName.trim(),
        icon: <Tag className="h-4 w-4" />,
        isCustom: true
      };
      
      setCustomEventOptions([...customEventOptions, newTag]);
      
      // Select the new tag
      if (!values.includes(newTagValue)) {
        handleToggleEvent(newTagValue);
      }
    }
    
    // Reset and close dialog
    setNewTagName("");
    setIsAddingTag(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Event Tags</label>
      
      <div className="flex flex-wrap gap-2">
        {allEventOptions.map((option) => (
          <TooltipProvider key={option.value} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`
                    inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer
                    ${values.includes(option.value) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
                    ${option.isCustom ? 'border border-dashed border-primary/30' : ''}
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

        {/* Add new tag button */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer bg-secondary/50 hover:bg-secondary border border-dashed border-primary/30"
                onClick={() => setIsAddingTag(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs font-medium">Add Tag</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Create a new custom event tag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Add new tag dialog */}
      <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <label htmlFor="tagName" className="text-sm font-medium">Tag Name</label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter a name for your new event tag"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddingTag(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddNewTag} disabled={!newTagName.trim()}>
              <Plus className="mr-1 h-4 w-4" /> Add Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventTracker;

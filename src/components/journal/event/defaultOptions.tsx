
import React from "react";
import { 
  PartyPopper, 
  UtensilsCrossed, 
  Coffee, 
  Home, 
  ShoppingBag, 
  TreeDeciduous,
  Briefcase,
  Plane,
  Users
} from "lucide-react";
import { EventOption } from "./types";

/**
 * Default event options with predefined icons and labels
 */
export const DEFAULT_EVENT_OPTIONS: EventOption[] = [
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


import React from "react";
import { Users, Heart, Briefcase } from "lucide-react";
import { PersonOption } from "./types";

/**
 * Default predefined person categories
 */
export const DEFAULT_PEOPLE_OPTIONS: PersonOption[] = [
  { value: "friends", label: "Friends", icon: <Users className="h-4 w-4" /> },
  { value: "family", label: "Family", icon: <Heart className="h-4 w-4" /> },
  { value: "partner", label: "Partner", icon: <Heart className="h-4 w-4" /> },
  { value: "coworkers", label: "Co-workers", icon: <Briefcase className="h-4 w-4" /> },
];


import React from "react";
import { Book, Dumbbell, Utensils, Pencil, Brain, Tv, TreeDeciduous, Code, Cake, Bike } from "lucide-react";
import { ActivityOption } from "./types";

/**
 * Default activity options with icons
 */
export const DEFAULT_ACTIVITY_OPTIONS: ActivityOption[] = [
  { value: "reading", label: "Reading", icon: <Book className="h-4 w-4" /> },
  { value: "weightLifting", label: "Weight Lifting", icon: <Dumbbell className="h-4 w-4" /> },
  { value: "hiking", label: "Hiking", icon: <TreeDeciduous className="h-4 w-4" /> },
  { value: "tvContent", label: "TV & Content", icon: <Tv className="h-4 w-4" /> },
  { value: "cooking", label: "Cooking", icon: <Utensils className="h-4 w-4" /> },
  { value: "writing", label: "Writing", icon: <Pencil className="h-4 w-4" /> },
  { value: "crafts", label: "Crafts", icon: <Pencil className="h-4 w-4" /> },
  { value: "building", label: "Building", icon: <Code className="h-4 w-4" /> },
  { value: "baking", label: "Baking", icon: <Cake className="h-4 w-4" /> },
  { value: "biking", label: "Biking", icon: <Bike className="h-4 w-4" /> },
  { value: "learning", label: "Learning", icon: <Brain className="h-4 w-4" /> },
];


import React from "react";
import { 
  Zap, 
  Thermometer, 
  BatteryLow, 
  Trophy, 
  AlertTriangle, 
  Coffee, 
  Sparkles, 
  Heart, 
  Cloud, 
  Smile, 
  Check,
} from "lucide-react";
import { EmotionOption, EmotionType } from "../types/emotion-types";

export const predefinedEmotions: EmotionOption[] = [
  {
    value: "excited" as EmotionType,
    icon: <Zap className="h-3.5 w-3.5" />,
    color: "text-amber-500 border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950",
    activeColor: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  },
  {
    value: "stressed" as EmotionType,
    icon: <Thermometer className="h-3.5 w-3.5" />,
    color: "text-red-500 border-red-500 hover:bg-red-100 dark:hover:bg-red-950",
    activeColor: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
  },
  {
    value: "tired" as EmotionType,
    icon: <BatteryLow className="h-3.5 w-3.5" />,
    color: "text-gray-500 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
    activeColor: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  },
  {
    value: "proud" as EmotionType,
    icon: <Trophy className="h-3.5 w-3.5" />,
    color: "text-yellow-500 border-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-950",
    activeColor: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300",
  },
  {
    value: "anxious" as EmotionType,
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color: "text-orange-500 border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-950",
    activeColor: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
  },
  {
    value: "bored" as EmotionType,
    icon: <Coffee className="h-3.5 w-3.5" />,
    color: "text-neutral-500 border-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800",
    activeColor: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
  },
  {
    value: "enthusiastic" as EmotionType,
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-indigo-500 border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-950",
    activeColor: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
  },
  {
    value: "grateful" as EmotionType,
    icon: <Heart className="h-3.5 w-3.5" />,
    color: "text-pink-500 border-pink-500 hover:bg-pink-100 dark:hover:bg-pink-950",
    activeColor: "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300",
  },
  {
    value: "depressed" as EmotionType,
    icon: <Cloud className="h-3.5 w-3.5" />,
    color: "text-blue-500 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950",
    activeColor: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  },
  {
    value: "happy" as EmotionType,
    icon: <Smile className="h-3.5 w-3.5" />,
    color: "text-green-500 border-green-500 hover:bg-green-100 dark:hover:bg-green-950",
    activeColor: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
  },
  {
    value: "content" as EmotionType,
    icon: <Check className="h-3.5 w-3.5" />,
    color: "text-teal-500 border-teal-500 hover:bg-teal-100 dark:hover:bg-teal-950",
    activeColor: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300",
  }
];

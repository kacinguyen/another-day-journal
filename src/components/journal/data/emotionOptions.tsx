
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
import { getEmotionColor } from "@/styles/tokens";

export const predefinedEmotions: EmotionOption[] = [
  {
    value: "excited" as EmotionType,
    icon: <Zap className="h-3.5 w-3.5" />,
    ...getEmotionColor("excited"),
  },
  {
    value: "stressed" as EmotionType,
    icon: <Thermometer className="h-3.5 w-3.5" />,
    ...getEmotionColor("stressed"),
  },
  {
    value: "tired" as EmotionType,
    icon: <BatteryLow className="h-3.5 w-3.5" />,
    ...getEmotionColor("tired"),
  },
  {
    value: "proud" as EmotionType,
    icon: <Trophy className="h-3.5 w-3.5" />,
    ...getEmotionColor("proud"),
  },
  {
    value: "anxious" as EmotionType,
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    ...getEmotionColor("anxious"),
  },
  {
    value: "bored" as EmotionType,
    icon: <Coffee className="h-3.5 w-3.5" />,
    ...getEmotionColor("bored"),
  },
  {
    value: "enthusiastic" as EmotionType,
    icon: <Sparkles className="h-3.5 w-3.5" />,
    ...getEmotionColor("enthusiastic"),
  },
  {
    value: "grateful" as EmotionType,
    icon: <Heart className="h-3.5 w-3.5" />,
    ...getEmotionColor("grateful"),
  },
  {
    value: "depressed" as EmotionType,
    icon: <Cloud className="h-3.5 w-3.5" />,
    ...getEmotionColor("depressed"),
  },
  {
    value: "happy" as EmotionType,
    icon: <Smile className="h-3.5 w-3.5" />,
    ...getEmotionColor("happy"),
  },
  {
    value: "content" as EmotionType,
    icon: <Check className="h-3.5 w-3.5" />,
    ...getEmotionColor("content"),
  },
];

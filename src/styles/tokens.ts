// ─── Design Tokens ───────────────────────────────────────────────────────────
// Single source of truth for domain-specific colors, typography, sizing,
// and reusable surface styles. Components import from here instead of
// hardcoding Tailwind classes.
//
// All values are complete Tailwind class strings so the content scanner
// picks them up — never concatenate partial class names at runtime.
// ─────────────────────────────────────────────────────────────────────────────

import type { MoodType } from "@/components/journal/types/mood-types";
import type { EmotionType } from "@/components/journal/types/emotion-types";

// ─── Mood Palette ────────────────────────────────────────────────────────────

interface MoodColorSet {
  text: string;
  textHover: string;
  bg: string;
}

export const moodColors: Record<NonNullable<MoodType>, MoodColorSet> = {
  great: {
    text: "text-pink-500 dark:text-pink-400",
    textHover: "hover:text-pink-600 dark:hover:text-pink-300",
    bg: "bg-pink-100 dark:bg-pink-950",
  },
  good: {
    text: "text-green-500 dark:text-green-400",
    textHover: "hover:text-green-600 dark:hover:text-green-300",
    bg: "bg-green-100 dark:bg-green-950",
  },
  neutral: {
    text: "text-blue-500 dark:text-blue-400",
    textHover: "hover:text-blue-600 dark:hover:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-950",
  },
  bad: {
    text: "text-orange-500 dark:text-orange-400",
    textHover: "hover:text-orange-600 dark:hover:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-950",
  },
  awful: {
    text: "text-red-500 dark:text-red-400",
    textHover: "hover:text-red-600 dark:hover:text-red-300",
    bg: "bg-red-100 dark:bg-red-950",
  },
} as const;

// ─── Energy Palette ──────────────────────────────────────────────────────────

export const energyColors = {
  high: "text-green-500",       // >= 75
  good: "text-blue-500",        // >= 50
  low: "text-orange-500",       // >= 25
  exhausted: "text-red-500",    // < 25
} as const;

export function getEnergyLevel(value: number): keyof typeof energyColors {
  if (value >= 75) return "high";
  if (value >= 50) return "good";
  if (value >= 25) return "low";
  return "exhausted";
}

// ─── Emotion Palette ─────────────────────────────────────────────────────────

interface EmotionColorSet {
  color: string;
  activeColor: string;
}

export const emotionColors: Record<string, EmotionColorSet> = {
  excited: {
    color: "text-amber-500 border-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950",
    activeColor: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  },
  stressed: {
    color: "text-red-500 border-red-500 hover:bg-red-100 dark:hover:bg-red-950",
    activeColor: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
  },
  tired: {
    color: "text-gray-500 border-gray-500 hover:bg-muted/80",
    activeColor: "bg-muted text-gray-700 dark:text-gray-300",
  },
  proud: {
    color: "text-yellow-500 border-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-950",
    activeColor: "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300",
  },
  anxious: {
    color: "text-orange-500 border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-950",
    activeColor: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
  },
  bored: {
    color: "text-neutral-500 border-neutral-500 hover:bg-muted/80",
    activeColor: "bg-muted text-neutral-700 dark:text-neutral-300",
  },
  enthusiastic: {
    color: "text-indigo-500 border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-950",
    activeColor: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
  },
  grateful: {
    color: "text-pink-500 border-pink-500 hover:bg-pink-100 dark:hover:bg-pink-950",
    activeColor: "bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300",
  },
  depressed: {
    color: "text-blue-500 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950",
    activeColor: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  },
  happy: {
    color: "text-green-500 border-green-500 hover:bg-green-100 dark:hover:bg-green-950",
    activeColor: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
  },
  content: {
    color: "text-teal-500 border-teal-500 hover:bg-teal-100 dark:hover:bg-teal-950",
    activeColor: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300",
  },
} as const;

/** Fallback for custom emotions not in the predefined palette. */
export const defaultEmotionColor: EmotionColorSet = {
  color: "text-muted-foreground border-muted-foreground hover:bg-muted/80",
  activeColor: "bg-muted text-foreground",
};

export function getEmotionColor(emotion: string): EmotionColorSet {
  return emotionColors[emotion] ?? defaultEmotionColor;
}

// ─── Surface Tokens ──────────────────────────────────────────────────────────
// Use instead of hardcoded gray-100 / gray-800 hover states.

export const surface = {
  hover: "hover:bg-muted/80",
  active: "active:bg-muted",
} as const;

// ─── Typography Scale ────────────────────────────────────────────────────────

export const heading = {
  page: "text-3xl font-semibold tracking-tight",
  section: "text-xl font-semibold",
  subsection: "text-lg font-medium",
  label: "text-sm font-medium",
} as const;

// ─── Sizing Constants ────────────────────────────────────────────────────────

export const sizing = {
  moodButton: "w-[72px] h-[72px]",
  entriesScroll: "h-[500px]",
} as const;

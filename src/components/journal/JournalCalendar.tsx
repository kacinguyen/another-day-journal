
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { getMoodEmoji } from "@/utils/journalUtils";
import { JournalEntryData } from "./types/journal-types";

interface JournalCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  datesWithEntries: Date[];
  entries: JournalEntryData[];
  onMonthChange?: (month: Date) => void;
}

/**
 * JournalCalendar Component
 * 
 * Displays a calendar for selecting journal entry dates
 * Highlights dates that already have journal entries with mood-based colors
 */
const JournalCalendar: React.FC<JournalCalendarProps> = ({
  selectedDate,
  onDateSelect,
  datesWithEntries,
  entries,
  onMonthChange
}) => {
  // Create a map of dates to mood types for styling
  const dateMoodMap = new Map<string, string>();
  
  entries.forEach(entry => {
    const dateStr = new Date(entry.date).toDateString();
    if (entry.mood) {
      dateMoodMap.set(dateStr, entry.mood);
    }
  });

  // Create a custom CSS modifier for each date based on its mood
  const getDayClassName = (date: Date) => {
    const dateStr = date.toDateString();
    const mood = dateMoodMap.get(dateStr);
    
    if (!mood) return "";
    
    switch(mood) {
      case "great":
        return "great-day";
      case "good":
        return "good-day";
      case "neutral":
        return "neutral-day";
      case "bad":
        return "bad-day";
      case "awful":
        return "awful-day";
      default:
        return "";
    }
  };
  
  // Create mood-specific modifiers for each date
  const modifiers = {
    greatDay: datesWithEntries.filter(date => 
      dateMoodMap.get(date.toDateString()) === "great"
    ),
    goodDay: datesWithEntries.filter(date => 
      dateMoodMap.get(date.toDateString()) === "good"
    ),
    neutralDay: datesWithEntries.filter(date => 
      dateMoodMap.get(date.toDateString()) === "neutral"
    ),
    badDay: datesWithEntries.filter(date => 
      dateMoodMap.get(date.toDateString()) === "bad"
    ),
    awfulDay: datesWithEntries.filter(date => 
      dateMoodMap.get(date.toDateString()) === "awful"
    )
  };
  
  // Custom class names for each mood type, including selected state styles
  const modifiersClassNames = {
    greatDay: "bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-900 aria-selected:!bg-pink-100 dark:aria-selected:!bg-pink-950 aria-selected:!text-pink-800 dark:aria-selected:!text-pink-200 aria-selected:!border-2 aria-selected:!border-pink-800 dark:aria-selected:!border-pink-200",
    goodDay: "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900 aria-selected:!bg-green-100 dark:aria-selected:!bg-green-950 aria-selected:!text-green-800 dark:aria-selected:!text-green-200 aria-selected:!border-2 aria-selected:!border-green-800 dark:aria-selected:!border-green-200",
    neutralDay: "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900 aria-selected:!bg-blue-100 dark:aria-selected:!bg-blue-950 aria-selected:!text-blue-800 dark:aria-selected:!text-blue-200 aria-selected:!border-2 aria-selected:!border-blue-800 dark:aria-selected:!border-blue-200",
    badDay: "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-900 aria-selected:!bg-orange-100 dark:aria-selected:!bg-orange-950 aria-selected:!text-orange-800 dark:aria-selected:!text-orange-200 aria-selected:!border-2 aria-selected:!border-orange-800 dark:aria-selected:!border-orange-200",
    awfulDay: "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900 aria-selected:!bg-red-100 dark:aria-selected:!bg-red-950 aria-selected:!text-red-800 dark:aria-selected:!text-red-200 aria-selected:!border-2 aria-selected:!border-red-800 dark:aria-selected:!border-red-200"
  };

  return (
    <Card className="border rounded-lg p-4 bg-card shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          onMonthChange={onMonthChange}
          className="rounded-md bg-white mx-auto w-full pointer-events-auto"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </div>
    </Card>
  );
};

export default JournalCalendar;


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
  entries
}) => {
  // Create a map of dates to mood types for styling
  const dateMoodMap = new Map<string, string>();
  
  entries.forEach(entry => {
    const dateStr = new Date(entry.date).toDateString();
    if (entry.mood) {
      dateMoodMap.set(dateStr, entry.mood);
    }
  });
  
  // Create mood-specific modifiers for each date
  const modifiers = {
    hasEntry: datesWithEntries,
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

  // Styles for the modifiers
  const modifiersClassNames = {
    hasEntry: "font-bold",
    greatDay: "bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200",
    goodDay: "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200",
    neutralDay: "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200",
    badDay: "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200",
    awfulDay: "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200"
  };

  return (
    <Card className="border rounded-lg p-4 bg-card shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <Calendar 
          mode="single" 
          selected={selectedDate} 
          onSelect={onDateSelect} 
          className="rounded-md bg-white mx-auto w-full pointer-events-auto"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </div>
    </Card>
  );
};

export default JournalCalendar;

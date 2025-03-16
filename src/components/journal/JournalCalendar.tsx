
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

interface JournalCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  datesWithEntries: Date[];
}

/**
 * JournalCalendar Component
 * 
 * Displays a calendar for selecting journal entry dates
 * Highlights dates that already have journal entries
 */
const JournalCalendar: React.FC<JournalCalendarProps> = ({
  selectedDate,
  onDateSelect,
  datesWithEntries
}) => {
  return (
    <Card className="border rounded-lg p-4 bg-card shadow-sm">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <Calendar 
          mode="single" 
          selected={selectedDate} 
          onSelect={onDateSelect} 
          className="rounded-md bg-white mx-auto w-full pointer-events-auto" 
          modifiers={{
            hasEntry: datesWithEntries
          }} 
          modifiersStyles={{
            hasEntry: {
              fontWeight: 'bold',
              border: '2px solid currentColor',
              color: 'var(--primary)'
            }
          }} 
        />
      </div>
    </Card>
  );
};

export default JournalCalendar;


import React, { useMemo } from 'react';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowUp } from 'lucide-react';

interface PositiveActivitiesCardProps {
  entries: JournalEntryData[];
}

const PositiveActivitiesCard: React.FC<PositiveActivitiesCardProps> = ({ entries }) => {
  const positiveActivities = useMemo(() => {
    // Filter entries with "great" or "good" moods
    const positiveEntries = entries.filter(entry => 
      entry.mood === 'great' || entry.mood === 'good'
    );
    
    // Count activities across positive entries
    const activityCounts = new Map<string, number>();
    
    positiveEntries.forEach(entry => {
      if (entry.activities && entry.activities.length) {
        entry.activities.forEach(activity => {
          const count = activityCounts.get(activity) || 0;
          activityCounts.set(activity, count + 1);
        });
      }
    });
    
    // Convert to array and sort by count
    return Array.from(activityCounts.entries())
      .map(([activity, count]) => ({ activity, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 activities
  }, [entries]);

  if (!positiveActivities.length) {
    return (
      <div className="text-muted-foreground">
        No activities recorded for days with positive moods yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {positiveActivities.map(({ activity, count }) => (
          <div key={activity} className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              {activity}
            </span>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
              <ArrowUp className="h-3 w-3 mr-1" />
              {count} {count === 1 ? 'time' : 'times'}
            </Badge>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        These activities correlate with your positive moods
      </p>
    </div>
  );
};

export default PositiveActivitiesCard;

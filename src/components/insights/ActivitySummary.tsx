
import React, { useMemo } from 'react';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { Badge } from '@/components/ui/badge';

interface ActivitySummaryProps {
  entries: JournalEntryData[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ entries }) => {
  const activityStats = useMemo(() => {
    // Create a map of activities and their counts
    const activityCounts = new Map<string, number>();
    
    entries.forEach(entry => {
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
      .slice(0, 5); // Top 5 activities
  }, [entries]);

  if (!activityStats.length) {
    return <div className="text-muted-foreground">No activities recorded yet</div>;
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {activityStats.map(({ activity, count }) => (
          <li key={activity} className="flex justify-between items-center">
            <span>{activity}</span>
            <Badge variant="secondary">{count} {count === 1 ? 'time' : 'times'}</Badge>
          </li>
        ))}
      </ul>
      
      {activityStats.length < 5 && (
        <p className="text-xs text-muted-foreground mt-4">
          Keep journaling to see more activity insights!
        </p>
      )}
    </div>
  );
};

export default ActivitySummary;

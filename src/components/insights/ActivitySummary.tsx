
import React, { useMemo } from 'react';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Dumbbell, 
  Music, 
  Utensils, 
  Pencil, 
  Brain, 
  Tag, 
  Tv, 
  TreeDeciduous, 
  Code, 
  Cake, 
  Bike,
  Activity
} from 'lucide-react';

interface ActivitySummaryProps {
  entries: JournalEntryData[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ entries }) => {
  // Map of activity keywords to icons
  const activityIcons = {
    'reading': <Book className="h-4 w-4" />,
    'weight lifting': <Dumbbell className="h-4 w-4" />,
    'hiking': <TreeDeciduous className="h-4 w-4" />,
    'tv': <Tv className="h-4 w-4" />,
    'cooking': <Utensils className="h-4 w-4" />,
    'writing': <Pencil className="h-4 w-4" />,
    'learning': <Brain className="h-4 w-4" />,
    'biking': <Bike className="h-4 w-4" />,
    'baking': <Cake className="h-4 w-4" />,
    'building': <Code className="h-4 w-4" />,
    'music': <Music className="h-4 w-4" />
  };

  // Function to get the appropriate icon for an activity
  const getActivityIcon = (activity: string) => {
    const lowercaseActivity = activity.toLowerCase();
    
    // Check if any of the activity keywords are in the activity name
    for (const [keyword, icon] of Object.entries(activityIcons)) {
      if (lowercaseActivity.includes(keyword)) {
        return icon;
      }
    }
    
    // Default icon if no match is found
    return <Activity className="h-4 w-4" />;
  };

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
            <span className="flex items-center gap-2">
              {getActivityIcon(activity)}
              {activity}
            </span>
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


import React, { useMemo } from 'react';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowUp, Users, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PositiveActivitiesCardProps {
  entries: JournalEntryData[];
}

interface CountItem {
  name: string;
  count: number;
}

const PositiveActivitiesCard: React.FC<PositiveActivitiesCardProps> = ({ entries }) => {
  const positiveInsights = useMemo(() => {
    // Filter entries with "great" or "good" moods
    const positiveEntries = entries.filter(entry => 
      entry.mood === 'great' || entry.mood === 'good'
    );
    
    // Count activities across positive entries
    const activityCounts = new Map<string, number>();
    const peopleCounts = new Map<string, number>();
    const eventCounts = new Map<string, number>();
    
    positiveEntries.forEach(entry => {
      // Track activities
      if (entry.activities && entry.activities.length) {
        entry.activities.forEach(activity => {
          const count = activityCounts.get(activity) || 0;
          activityCounts.set(activity, count + 1);
        });
      }
      
      // Track people
      if (entry.people && entry.people.length) {
        entry.people.forEach(person => {
          const count = peopleCounts.get(person) || 0;
          peopleCounts.set(person, count + 1);
        });
      }
      
      // Track events
      if (entry.eventTypes && entry.eventTypes.length) {
        entry.eventTypes.forEach(event => {
          const count = eventCounts.get(event) || 0;
          eventCounts.set(event, count + 1);
        });
      }
    });
    
    // Helper function to convert Map to sorted array
    const mapToSortedArray = (map: Map<string, number>): CountItem[] => {
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 items
    };
    
    return {
      activities: mapToSortedArray(activityCounts),
      people: mapToSortedArray(peopleCounts),
      events: mapToSortedArray(eventCounts)
    };
  }, [entries]);

  const { activities, people, events } = positiveInsights;
  const hasNoData = activities.length === 0 && people.length === 0 && events.length === 0;

  if (hasNoData) {
    return (
      <div className="text-muted-foreground">
        No data recorded for days with positive moods yet
      </div>
    );
  }

  return (
    <Tabs defaultValue="activities" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="activities" disabled={activities.length === 0}>
          <Activity className="h-4 w-4 mr-2" />
          Activities
        </TabsTrigger>
        <TabsTrigger value="people" disabled={people.length === 0}>
          <Users className="h-4 w-4 mr-2" />
          People
        </TabsTrigger>
        <TabsTrigger value="events" disabled={events.length === 0}>
          <Calendar className="h-4 w-4 mr-2" />
          Events
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="activities" className="mt-0">
        {activities.length === 0 ? (
          <div className="text-muted-foreground">No activities recorded yet</div>
        ) : (
          <CorrelationList 
            items={activities} 
            icon={<Activity className="h-4 w-4 text-green-500" />} 
            label="Activities"
          />
        )}
      </TabsContent>
      
      <TabsContent value="people" className="mt-0">
        {people.length === 0 ? (
          <div className="text-muted-foreground">No people recorded yet</div>
        ) : (
          <CorrelationList 
            items={people} 
            icon={<Users className="h-4 w-4 text-blue-500" />} 
            label="People"
          />
        )}
      </TabsContent>
      
      <TabsContent value="events" className="mt-0">
        {events.length === 0 ? (
          <div className="text-muted-foreground">No events recorded yet</div>
        ) : (
          <CorrelationList 
            items={events} 
            icon={<Calendar className="h-4 w-4 text-purple-500" />} 
            label="Events"
          />
        )}
      </TabsContent>
      
      <p className="text-xs text-muted-foreground mt-4">
        These correlate with your positive moods (great & good)
      </p>
    </Tabs>
  );
};

// Helper component to render the correlation lists
interface CorrelationListProps {
  items: CountItem[];
  icon: React.ReactNode;
  label: string;
}

const CorrelationList: React.FC<CorrelationListProps> = ({ items, icon, label }) => {
  return (
    <div className="space-y-3">
      {items.map(({ name, count }) => (
        <div key={name} className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            {icon}
            {name}
          </span>
          <Badge 
            variant="outline" 
            className={`
              ${label === 'Activities' ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' : ''}
              ${label === 'People' ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : ''}
              ${label === 'Events' ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300' : ''}
            `}
          >
            <ArrowUp className="h-3 w-3 mr-1" />
            {count} {count === 1 ? 'time' : 'times'}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default PositiveActivitiesCard;


import React, { useMemo } from 'react';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface EnergySummaryProps {
  entries: JournalEntryData[];
}

const EnergySummary: React.FC<EnergySummaryProps> = ({ entries }) => {
  const stats = useMemo(() => {
    if (!entries.length) return { average: 0, high: 0, low: 0, highDate: new Date(), lowDate: new Date() };

    // Filter entries with energy values
    const entriesWithEnergy = entries.filter(entry => typeof entry.energy === 'number');
    
    if (!entriesWithEnergy.length) return { average: 0, high: 0, low: 0, highDate: new Date(), lowDate: new Date() };

    // Calculate stats
    const sum = entriesWithEnergy.reduce((acc, entry) => acc + entry.energy, 0);
    const average = Math.round(sum / entriesWithEnergy.length);
    
    // Find entry with highest energy
    const highestEntry = entriesWithEnergy.reduce((prev, current) => 
      (prev.energy > current.energy) ? prev : current
    );
    
    // Find entry with lowest energy
    const lowestEntry = entriesWithEnergy.reduce((prev, current) => 
      (prev.energy < current.energy) ? prev : current
    );

    return { 
      average, 
      high: highestEntry.energy, 
      low: lowestEntry.energy,
      highDate: highestEntry.date,
      lowDate: lowestEntry.date
    };
  }, [entries]);

  const getEnergyLabel = (value: number) => {
    if (value >= 80) return 'High';
    if (value >= 50) return 'Medium';
    if (value >= 20) return 'Low';
    return 'Very Low';
  };

  const getEnergyColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 50) return 'text-blue-500';
    if (value >= 20) return 'text-amber-500';
    return 'text-red-500';
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  if (!entries.length) {
    return <div className="text-muted-foreground">No energy data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Average Energy</span>
          <span className={`font-medium ${getEnergyColor(stats.average)}`}>
            {stats.average}% - {getEnergyLabel(stats.average)}
          </span>
        </div>
        <Progress value={stats.average} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Highest</div>
          <div className="text-2xl font-semibold text-green-500">{stats.high}%</div>
          <div className="text-sm">
            Recorded on{" "}
            <Link 
              to="/" 
              state={{ selectedDate: stats.highDate }} 
              className="text-blue-500 hover:underline"
            >
              {formatDate(stats.highDate)}
            </Link>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Lowest</div>
          <div className="text-2xl font-semibold text-amber-500">{stats.low}%</div>
          <div className="text-sm">
            Recorded on{" "}
            <Link 
              to="/" 
              state={{ selectedDate: stats.lowDate }} 
              className="text-blue-500 hover:underline"
            >
              {formatDate(stats.lowDate)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergySummary;

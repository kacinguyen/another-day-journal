
import React, { useMemo } from 'react';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { Progress } from '@/components/ui/progress';

interface EnergySummaryProps {
  entries: JournalEntryData[];
}

const EnergySummary: React.FC<EnergySummaryProps> = ({ entries }) => {
  const stats = useMemo(() => {
    if (!entries.length) return { average: 0, high: 0, low: 0 };

    // Filter entries with energy values
    const entriesWithEnergy = entries.filter(entry => typeof entry.energy === 'number');
    
    if (!entriesWithEnergy.length) return { average: 0, high: 0, low: 0 };

    // Calculate stats
    const sum = entriesWithEnergy.reduce((acc, entry) => acc + entry.energy, 0);
    const average = Math.round(sum / entriesWithEnergy.length);
    const high = Math.max(...entriesWithEnergy.map(entry => entry.energy));
    const low = Math.min(...entriesWithEnergy.map(entry => entry.energy));

    return { average, high, low };
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
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Lowest</div>
          <div className="text-2xl font-semibold text-amber-500">{stats.low}%</div>
        </div>
      </div>
    </div>
  );
};

export default EnergySummary;

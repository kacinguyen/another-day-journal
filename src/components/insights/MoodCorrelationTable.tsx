
import React, { useMemo } from 'react';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MoodCorrelationTableProps {
  entries: JournalEntryData[];
  type: 'activities' | 'people' | 'events';
}

interface CorrelationItem {
  name: string;
  correlation: number;
  count: number;
}

// Helper function to calculate Pearson correlation
const calculatePearsonCorrelation = (binaryArray: number[], moodValues: number[]): number => {
  if (binaryArray.length !== moodValues.length || binaryArray.length === 0) return 0;
  
  // Calculate means
  const binaryMean = binaryArray.reduce((sum, val) => sum + val, 0) / binaryArray.length;
  const moodMean = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
  
  // Calculate numerator and denominators for correlation formula
  let numerator = 0;
  let denominatorBinary = 0;
  let denominatorMood = 0;
  
  for (let i = 0; i < binaryArray.length; i++) {
    const binaryDiff = binaryArray[i] - binaryMean;
    const moodDiff = moodValues[i] - moodMean;
    
    numerator += binaryDiff * moodDiff;
    denominatorBinary += binaryDiff * binaryDiff;
    denominatorMood += moodDiff * moodDiff;
  }
  
  // Avoid division by zero
  if (denominatorBinary === 0 || denominatorMood === 0) return 0;
  
  // Calculate correlation coefficient
  return numerator / (Math.sqrt(denominatorBinary) * Math.sqrt(denominatorMood));
};

// Map mood to numeric values for correlation calculation
const getMoodValue = (mood: string | null): number => {
  switch (mood) {
    case 'great': return 5;
    case 'good': return 4;
    case 'neutral': return 3;
    case 'bad': return 2;
    case 'terrible': return 1;
    default: return 0;
  }
};

const MoodCorrelationTable: React.FC<MoodCorrelationTableProps> = ({ entries, type }) => {
  const correlations = useMemo(() => {
    if (entries.length === 0) return [];
    
    // Extract all unique items (activities, people, or events)
    const itemsSet = new Set<string>();
    const countMap = new Map<string, number>();
    
    entries.forEach(entry => {
      let items: string[] = [];
      
      if (type === 'activities') items = entry.activities || [];
      else if (type === 'people') items = entry.people || [];
      else if (type === 'events') items = entry.eventTypes || [];
      
      items.forEach(item => {
        itemsSet.add(item);
        countMap.set(item, (countMap.get(item) || 0) + 1);
      });
    });
    
    const uniqueItems = Array.from(itemsSet);
    
    // Calculate correlation for each item
    const correlationData: CorrelationItem[] = uniqueItems.map(item => {
      // Create binary array (1 if item present, 0 if not)
      const binaryArray = entries.map(entry => {
        let items: string[] = [];
        
        if (type === 'activities') items = entry.activities || [];
        else if (type === 'people') items = entry.people || [];
        else if (type === 'events') items = entry.eventTypes || [];
        
        return items.includes(item) ? 1 : 0;
      });
      
      // Convert moods to numeric values
      const moodValues = entries.map(entry => getMoodValue(entry.mood));
      
      // Calculate correlation
      const correlation = calculatePearsonCorrelation(binaryArray, moodValues);
      
      return {
        name: item,
        correlation: correlation,
        count: countMap.get(item) || 0
      };
    });
    
    // Sort by absolute correlation value (strongest correlations first)
    return correlationData
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
      .slice(0, 10); // Show top 10 correlations
      
  }, [entries, type]);

  if (correlations.length === 0) {
    return <div className="text-muted-foreground">Not enough data to calculate correlations</div>;
  }

  const getCorrelationStrength = (value: number): string => {
    const abs = Math.abs(value);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    if (abs >= 0.3) return 'Weak';
    return 'Very weak';
  };

  const getCorrelationIcon = (value: number) => {
    if (value >= 0.7) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value >= 0.5) return <ArrowUpRight className="h-4 w-4 text-green-400" />;
    if (value >= 0.3) return <ArrowUpRight className="h-4 w-4 text-green-300" />;
    if (value <= -0.7) return <TrendingDown className="h-4 w-4 text-red-500" />;
    if (value <= -0.5) return <ArrowDownRight className="h-4 w-4 text-red-400" />;
    if (value <= -0.3) return <ArrowDownRight className="h-4 w-4 text-red-300" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Correlation</TableHead>
          <TableHead className="text-center">Strength</TableHead>
          <TableHead className="text-right">Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {correlations.map((item) => (
          <TableRow key={item.name}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-right flex items-center justify-end gap-1">
              {getCorrelationIcon(item.correlation)}
              {item.correlation.toFixed(2)}
            </TableCell>
            <TableCell className="text-center">
              <span 
                className={`text-xs px-2 py-0.5 rounded-full ${
                  item.correlation > 0 
                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' 
                    : item.correlation < 0
                      ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {getCorrelationStrength(item.correlation)}
              </span>
            </TableCell>
            <TableCell className="text-right">{item.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MoodCorrelationTable;

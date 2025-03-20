
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { JournalEntryData } from '@/components/journal/types/journal-types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Map mood values to numeric values for charting
const moodToValue = {
  'awful': 1,
  'bad': 2,
  'neutral': 3,
  'good': 4,
  'great': 5,
};

// Map numeric values back to mood names for display
const valueToMood = {
  1: 'Awful',
  2: 'Bad',
  3: 'Neutral',
  4: 'Good',
  5: 'Great',
};

interface MoodChartProps {
  entries: JournalEntryData[];
}

const MoodChart: React.FC<MoodChartProps> = ({ entries }) => {
  const chartData = useMemo(() => {
    // Sort entries by date (oldest first)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Convert mood to numeric value and format date
    return sortedEntries.map(entry => ({
      date: format(new Date(entry.date), 'MMM dd'),
      value: entry.mood ? moodToValue[entry.mood] : null,
      fullDate: entry.date,
    })).filter(item => item.value !== null); // Filter out entries with no mood
  }, [entries]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">No mood data available</p>
    </div>;
  }

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{format(new Date(data.fullDate), 'MMMM dd, yyyy')}</p>
          <p>Mood: <span className="font-semibold">{valueToMood[data.value]}</span></p>
        </div>
      );
    }
    return null;
  };

  const config = {
    mood: {
      label: "Mood",
    },
  };

  return (
    <ChartContainer config={config} className="w-full h-full">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date"
          tickMargin={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[1, 5]}
          tickCount={5}
          tickFormatter={(value) => valueToMood[value] || ''}
          tickMargin={10}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip 
          content={<ChartTooltipContent nameKey="mood" />}
        />
        <ReferenceLine y={3} stroke="#ddd" strokeDasharray="3 3" />
        <Line
          type="monotone"
          dataKey="value"
          name="mood"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 7, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default MoodChart;

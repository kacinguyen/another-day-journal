
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Battery, BatteryFull, BatteryMedium, BatteryLow, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnergyTrackerProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const EnergyTracker: React.FC<EnergyTrackerProps> = ({ value, onChange }) => {
  // Get the appropriate icon and text based on energy level
  const getEnergyInfo = () => {
    if (!value) {
      return {
        icon: <Battery className="h-5 w-5 text-muted-foreground" />,
        text: "Not Set",
        color: "text-muted-foreground"
      };
    } else if (value >= 75) {
      return {
        icon: <BatteryFull className="h-5 w-5 text-green-500" />,
        text: "High Energy",
        color: "text-green-500"
      };
    } else if (value >= 50) {
      return {
        icon: <BatteryMedium className="h-5 w-5 text-blue-500" />,
        text: "Good Energy",
        color: "text-blue-500"
      };
    } else if (value >= 25) {
      return {
        icon: <BatteryLow className="h-5 w-5 text-orange-500" />,
        text: "Low Energy",
        color: "text-orange-500"
      };
    } else {
      return {
        icon: <Battery className="h-5 w-5 text-red-500" />,
        text: "Exhausted",
        color: "text-red-500"
      };
    }
  };

  const energyInfo = getEnergyInfo();
  
  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Energy Level</label>
        <div className="flex items-center gap-1.5">
          {energyInfo.icon}
          <span className={cn("text-sm font-medium", energyInfo.color)}>
            {energyInfo.text}
          </span>
          {value !== null && (
            <span className="ml-1 text-sm text-muted-foreground">
              ({value}%)
            </span>
          )}
          {value !== null && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-1"
              onClick={handleClear}
              title="Clear energy level"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      {value !== null ? (
        <>
          <Slider
            value={[value]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onChange(values[0])}
            className="py-2"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onChange(50)}
        >
          Set Energy Level
        </Button>
      )}
    </div>
  );
};

export default EnergyTracker;

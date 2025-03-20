
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  isActive 
}) => {
  return (
    <Card className={`h-full transition-all duration-200 ${isActive ? 'shadow-md' : ''}`}>
      <CardContent className="p-4 flex flex-col items-start h-full">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h3 className="text-lg font-semibold w-full break-words">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

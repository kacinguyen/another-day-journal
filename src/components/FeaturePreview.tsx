
import React, { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface FeaturePreviewProps {
  children: React.ReactNode;
  previewImage: string;
  previewAlt: string;
  className?: string;
}

const FeaturePreview: React.FC<FeaturePreviewProps> = ({ 
  children, 
  previewImage, 
  previewAlt,
  className 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div
      className={cn("h-full", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Content that triggers the preview */}
      {children}
      
      {/* Hidden element that passes the hover state to parent */}
      <span className="sr-only" data-hovering={isHovering} />
    </div>
  );
};

export default FeaturePreview;

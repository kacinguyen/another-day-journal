
import React from "react";
import { cn } from "@/lib/utils";

interface FeaturePreviewProps {
  children: React.ReactNode;
  previewImage: string;
  previewAlt: string;
  className?: string;
  onHover: (isHovering: boolean) => void;
}

const FeaturePreview: React.FC<FeaturePreviewProps> = ({ 
  children, 
  previewImage, 
  previewAlt,
  className,
  onHover
}) => {
  return (
    <div
      className={cn("h-full", className)}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {children}
    </div>
  );
};

export default FeaturePreview;

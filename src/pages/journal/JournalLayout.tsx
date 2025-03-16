
import React from "react";
import { format } from "date-fns";

interface JournalLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * JournalLayout Component
 * 
 * Layout wrapper for journal-related pages with consistent header styling
 */
const JournalLayout: React.FC<JournalLayoutProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="page-container animate-fade-up">
      <div className="space-y-1 mb-8">
        <div className="inline-block">
          <span className="text-xs font-medium text-journal-accent-foreground bg-journal-accent/10 px-2 py-0.5 rounded-full">Today</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>
      
      {children}
    </div>
  );
};

export default JournalLayout;

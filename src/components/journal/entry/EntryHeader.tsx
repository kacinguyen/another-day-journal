
import React from "react";
import { format } from "date-fns";

interface EntryHeaderProps {
  date: Date;
}

/**
 * Component that displays the journal entry header with title and date
 */
const EntryHeader: React.FC<EntryHeaderProps> = ({ date }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold tracking-tight">
        Journal Entry
      </h2>
      <span className="text-sm text-muted-foreground">
        {format(date, "PPP")}
      </span>
    </div>
  );
};

export default EntryHeader;

import React, { useMemo } from "react";
import { format, isSameMonth } from "date-fns";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { moodColors } from "@/styles/tokens";
import type { JournalEntryData } from "@/components/journal/types/journal-types";
import type { MoodType } from "@/components/journal/types/mood-types";

interface RecentEntriesProps {
  entries: JournalEntryData[];
  loading: boolean;
  activeEntryId?: string | null;
  onEntryClick: (entry: JournalEntryData) => void;
  onNewEntry: () => void;
}

const RecentEntries: React.FC<RecentEntriesProps> = ({
  entries,
  loading,
  activeEntryId,
  onEntryClick,
  onNewEntry,
}) => {
  const currentMonthEntries = useMemo(() => {
    const now = new Date();
    return entries
      .filter((e) => isSameMonth(new Date(e.date), now))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries]);

  const today = new Date();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {format(today, "MMMM yyyy")}
        </h2>
        <button
          onClick={onNewEntry}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium",
            "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            !activeEntryId && "text-foreground bg-muted"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          New entry
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : currentMonthEntries.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No entries this month yet.
        </p>
      ) : (
        <div className="space-y-2">
          {currentMonthEntries.map((entry) => {
            const date = new Date(entry.date);
            const isActive = activeEntryId === entry.id;
            const moodColor =
              entry.mood && moodColors[entry.mood as NonNullable<MoodType>];

            return (
              <button
                key={entry.id}
                onClick={() => onEntryClick(entry)}
                className={cn(
                  "w-full text-left rounded-lg p-3 transition-all duration-200",
                  "hover:bg-muted/80 group",
                  isActive
                    ? "bg-muted ring-1 ring-foreground/10"
                    : "bg-muted/40"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Date block */}
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[42px]",
                      moodColor ? moodColor.bg : "bg-muted"
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {format(date, "EEE")}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {format(date, "dd")}
                    </span>
                  </div>

                  {/* Content preview */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
                      {[
                        entry.mood,
                        ...(entry.emotions?.slice(0, 2) || []),
                      ]
                        .filter(Boolean)
                        .join(" · ") || "No content"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentEntries;


import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJournalEntries } from "@/hooks/journal/useJournalEntries";
import { apiGet } from "@/services/api";
import { moodColors } from "@/styles/tokens";
import type { JournalEntryData } from "@/components/journal/types/journal-types";
import type { MoodType } from "@/components/journal/types/mood-types";

const JournalLog: React.FC = () => {
  const navigate = useNavigate();
  const { entries, fetchEntriesForMonth } = useJournalEntries();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMonthRef = useRef<HTMLButtonElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryData | null>(null);
  const [entryContent, setEntryContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");

  // Build entry lookup map
  const dateEntryMap = useMemo(() => {
    const map = new Map<string, JournalEntryData>();
    entries.forEach((entry) => {
      map.set(new Date(entry.date).toDateString(), entry);
    });
    return map;
  }, [entries]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const numRows = Math.ceil(calendarDays.length / 7);

  // Month sidebar: Jan of current year through Dec, plus any earlier months with entries
  const monthItems = useMemo(() => {
    const now = new Date();
    const janThisYear = new Date(now.getFullYear(), 0, 1);
    let earliest = janThisYear;
    entries.forEach((e) => {
      const d = new Date(e.date);
      if (d < earliest) earliest = d;
    });
    const start = startOfMonth(earliest);
    const end = new Date(now.getFullYear(), 11, 1); // December of current year
    const months: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      months.push(cursor);
      cursor = addMonths(cursor, 1);
    }
    return months;
  }, [entries]);

  const handleMonthSelect = useCallback(
    (month: Date) => {
      const direction = month > currentMonth ? "down" : "up";
      setTransitionClass(
        direction === "down" ? "calendar-exit-up" : "calendar-exit-down"
      );

      setTimeout(() => {
        setCurrentMonth(month);
        fetchEntriesForMonth(month);
        setSelectedDate(null);
        setSelectedEntry(null);
        setEntryContent(null);

        setTransitionClass(
          direction === "down" ? "calendar-enter-up" : "calendar-enter-down"
        );
        setTimeout(() => setTransitionClass(""), 250);
      }, 150);
    },
    [fetchEntriesForMonth, currentMonth]
  );

  // Scroll wheel on calendar changes month with animation
  const changeMonth = useCallback(
    (direction: "up" | "down") => {
      // Start exit animation
      setTransitionClass(
        direction === "down" ? "calendar-exit-up" : "calendar-exit-down"
      );

      setTimeout(() => {
        // Change month
        setCurrentMonth((prev) => {
          const next = direction === "down" ? addMonths(prev, 1) : subMonths(prev, 1);
          fetchEntriesForMonth(next);
          return next;
        });
        setSelectedDate(null);
        setSelectedEntry(null);
        setEntryContent(null);

        // Start enter animation
        setTransitionClass(
          direction === "down" ? "calendar-enter-up" : "calendar-enter-down"
        );

        setTimeout(() => setTransitionClass(""), 250);
      }, 150);
    },
    [fetchEntriesForMonth]
  );

  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 450);

      if (e.deltaY > 0) {
        changeMonth("down");
      } else if (e.deltaY < 0) {
        changeMonth("up");
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [changeMonth]);

  // Scroll wheel on sidebar also changes month
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 450);

      if (e.deltaY > 0) {
        changeMonth("down");
      } else if (e.deltaY < 0) {
        changeMonth("up");
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [changeMonth]);

  // Auto-scroll sidebar to active month
  useEffect(() => {
    activeMonthRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [currentMonth]);

  const handleDayClick = useCallback(
    async (date: Date) => {
      setSelectedDate(date);

      const entry = dateEntryMap.get(date.toDateString());
      if (entry) {
        setSelectedEntry(entry);
        setEntryContent(null);

        if (entry.content) {
          setEntryContent(entry.content);
        } else if (entry.id) {
          setLoadingContent(true);
          try {
            const data = await apiGet<{ content: string }>(
              `/notion/entries/${entry.id}/content`
            );
            setEntryContent(data.content);
          } catch {
            setEntryContent("Failed to load content.");
          } finally {
            setLoadingContent(false);
          }
        }
      } else {
        setSelectedEntry(null);
        setEntryContent(null);
      }
    },
    [dateEntryMap]
  );

  const moodColor = selectedEntry?.mood
    ? moodColors[selectedEntry.mood as NonNullable<MoodType>]
    : null;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Left sidebar: Month navigation */}
      <div
        ref={sidebarRef}
        className="w-40 shrink-0 pt-8 pl-6 pr-4 hidden lg:block overflow-y-auto scrollbar-hide"
      >
        <nav className="space-y-1">
          {monthItems.map((month) => {
            const isActive = isSameMonth(month, currentMonth);
            return (
              <button
                key={month.toISOString()}
                ref={isActive ? activeMonthRef : undefined}
                onClick={() => handleMonthSelect(month)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-md text-sm",
                  "flex items-center gap-2 transition-all duration-200",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-px transition-all duration-200",
                    isActive ? "w-5 bg-foreground" : "w-2 bg-muted-foreground/30"
                  )}
                />
                {format(month, "MMM yyyy")}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main calendar area */}
      <div ref={calendarRef} className="flex-1 px-6 lg:px-10 pt-8 pb-4 flex flex-col min-h-0">
        {/* Month title */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h1 className={cn("text-3xl font-semibold tracking-tight", transitionClass)}>
            {format(currentMonth, "MMMM yyyy")}
          </h1>
          <button
            onClick={() => navigate("/compose")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Compose
          </button>
        </div>

        {/* Calendar grid — fills remaining height (includes day headers) */}
        <div
          className={cn("grid grid-cols-7 gap-1.5 flex-1 min-h-0", transitionClass)}
          style={{ gridTemplateRows: `auto repeat(${numRows}, 1fr)` }}
        >
          {/* Day-of-week headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-muted-foreground text-center py-1"
            >
              {day}
            </div>
          ))}
          {calendarDays.map((day) => {
            const entry = dateEntryMap.get(day.toDateString());
            const inMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dayMoodColor = entry?.mood
              ? moodColors[entry.mood as NonNullable<MoodType>]
              : null;

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "rounded-xl transition-all duration-200 relative min-h-0",
                  "flex flex-col items-start justify-start p-2 overflow-hidden",
                  inMonth ? "text-foreground" : "text-muted-foreground/30",
                  entry && inMonth
                    ? dayMoodColor?.bg ?? "bg-muted/60"
                    : "bg-muted/40 hover:bg-muted/60",
                  isSelected && "ring-2 ring-foreground/20",
                  isToday(day) && !isSelected && "ring-1 ring-foreground/10"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isToday(day) && "font-bold",
                    entry && inMonth && dayMoodColor?.text
                  )}
                >
                  {format(day, "d")}
                </span>
                {entry && inMonth && entry.content && (
                  <span className="text-[10px] leading-tight mt-1 text-muted-foreground line-clamp-2 text-left">
                    {entry.content.slice(0, 40)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Right sidebar: Entry preview */}
      {selectedEntry && (
        <div className="w-72 shrink-0 border-l pt-8 pr-6 pl-5 pb-4 overflow-y-auto hidden lg:block">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {format(new Date(selectedEntry.date), "EEE, MMM d")}
              </h3>
              <button
                onClick={() => { setSelectedEntry(null); setSelectedDate(null); }}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Close
              </button>
            </div>

            {selectedEntry.mood && (
              <div
                className={cn(
                  "inline-block text-xs font-medium capitalize px-2.5 py-1 rounded-full",
                  moodColor?.bg,
                  moodColor?.text
                )}
              >
                {selectedEntry.mood}
              </div>
            )}

            {selectedEntry.emotions?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedEntry.emotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}

            {loadingContent ? (
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
              </div>
            ) : entryContent ? (
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {entryContent}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No content</p>
            )}

            {(selectedEntry.activities?.length > 0 ||
              selectedEntry.people?.length > 0) && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedEntry.activities?.map((a) => (
                  <span
                    key={a}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {a}
                  </span>
                ))}
                {selectedEntry.people?.map((p) => (
                  <span
                    key={p}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() =>
                navigate("/compose", {
                  state: {
                    entry: {
                      ...selectedEntry,
                      content: entryContent ?? selectedEntry.content,
                    },
                  },
                })
              }
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit in Compose
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalLog;

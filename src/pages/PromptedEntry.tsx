import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import PromptedCarousel from "@/components/journal/prompted/PromptedCarousel";
import TaggableEditor from "@/components/journal/prompted/TaggableEditor";
import TagsSidebar from "@/components/journal/prompted/TagsSidebar";
import FloatingToolbar from "@/components/journal/prompted/FloatingToolbar";
import DigDeeperSection from "@/components/journal/prompted/DigDeeperSection";
import RecentEntries from "@/components/journal/prompted/RecentEntries";
import { usePromptedEntry } from "@/components/journal/prompted/usePromptedEntry";
import { useJournalEntries } from "@/hooks/journal/useJournalEntries";
import { getReflectionQuestions } from "@/services/reflectService";
import { apiGet } from "@/services/api";
import type { JournalEntryData } from "@/components/journal/types/journal-types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const PromptedEntry: React.FC = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { entries, loading, saveEntry } = useJournalEntries();
  const [digDeeperQuestions, setDigDeeperQuestions] = useState<string[]>([]);
  const [isDiggingDeeper, setIsDiggingDeeper] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [editorFocused, setEditorFocused] = useState(false);

  const {
    mood,
    emotions,
    moodFactors,
    content,
    inlineTags,
    isSaving,
    editingEntryId,
    editingEntryDate,
    editingCreatedAt,
    setMood,
    setContent,
    setIsSaving,
    toggleEmotion,
    toggleMoodFactor,
    updateInlineTags,
    loadEntry,
    handleClear,
    setEditingEntryDate,
  } = usePromptedEntry();

  // Load entry or date from calendar navigation state
  useEffect(() => {
    const navState = location.state as { entry?: JournalEntryData; date?: string } | null;
    if (navState?.entry) {
      loadEntry(navState.entry, navState.entry.content ?? "");
      setEditorKey((k) => k + 1);
      history.replaceState({}, document.title);
    } else if (navState?.date) {
      setEditingEntryDate(new Date(navState.date));
      history.replaceState({}, document.title);
    }
  }, [location.state, loadEntry, setEditingEntryDate]);

  const handleNewEntry = useCallback(() => {
    handleClear();
    setEditorKey((k) => k + 1);
    setDigDeeperQuestions([]);
  }, [handleClear]);

  const handleEntryClick = useCallback(
    async (entry: JournalEntryData) => {
      // If already editing this entry, do nothing
      if (editingEntryId === entry.id) return;

      let entryContent = entry.content;

      // Lazy-load content if not present — cached by React Query
      if (!entryContent && entry.id) {
        try {
          entryContent = await queryClient.fetchQuery({
            queryKey: ["entry-content", entry.id],
            queryFn: () =>
              apiGet<{ content: string }>(
                `/notion/entries/${entry.id}/content`
              ).then((d) => d.content),
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
        } catch {
          toast.error("Failed to load entry content");
          return;
        }
      }

      loadEntry(entry, entryContent ?? "");
      // Force TipTap editor to remount with new content
      setEditorKey((k) => k + 1);
      setDigDeeperQuestions([]);
    },
    [editingEntryId, loadEntry, queryClient]
  );

  const handleFinish = useCallback(async () => {
    if (!mood) {
      toast.error("Please select how you're feeling first");
      return;
    }

    setIsSaving(true);
    const now = new Date();

    const entryData: JournalEntryData = {
      id: editingEntryId ?? undefined,
      date: editingEntryDate ?? now,
      content,
      mood,
      energy: null,
      activities: inlineTags
        .filter((t) => t.category === "activity")
        .map((t) => t.text),
      people: inlineTags
        .filter((t) => t.category === "person")
        .map((t) => t.text),
      eventTypes: inlineTags
        .filter((t) => t.category === "event")
        .map((t) => t.text) as JournalEntryData["eventTypes"],
      emotions,
      moodFactors,
      inlineTags,
      createdAt: editingEntryDate ?? now,
      updatedAt: now,
    };

    try {
      const saved = await saveEntry(entryData);
      if (!saved) {
        // saveEntry already showed an error toast via the service layer
        return;
      }
      // Update content cache so switching back to this entry is instant
      if (saved?.id) {
        queryClient.setQueryData(["entry-content", saved.id], content);
      }
      // Stay on compose — update editingEntryId so future saves are updates
      if (saved?.id && !editingEntryId) {
        loadEntry({ ...entryData, id: saved.id }, content);
      }
    } catch {
      toast.error("Failed to save entry");
    } finally {
      setIsSaving(false);
    }
  }, [
    mood,
    content,
    emotions,
    moodFactors,
    inlineTags,
    editingEntryId,
    editingEntryDate,
    saveEntry,
    setIsSaving,
    loadEntry,
    queryClient,
  ]);

  const handleDigDeeper = useCallback(async () => {
    if (!content || content.trim().length < 10) {
      toast.error("Write a bit more before digging deeper");
      return;
    }
    setIsDiggingDeeper(true);
    try {
      const questions = await getReflectionQuestions({
        content,
        mood: mood ?? undefined,
        emotions,
        moodFactors,
      });
      setDigDeeperQuestions(questions);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate questions";
      toast.error(message);
    } finally {
      setIsDiggingDeeper(false);
    }
  }, [content, mood, emotions, moodFactors]);

  const now = new Date();
  const displayDate = editingEntryDate ? new Date(editingEntryDate) : now;
  const displayTime = editingCreatedAt ? new Date(editingCreatedAt) : now;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left sidebar: Recent entries */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <RecentEntries
              entries={entries}
              loading={loading}
              activeEntryId={editingEntryId}
              onEntryClick={handleEntryClick}
              onNewEntry={handleNewEntry}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            {/* Header */}
            <div className="mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {format(displayTime, "h:mm a")} &middot;{" "}
                    {format(displayDate, "EEEE, MMMM d, yyyy")}
                    <CalendarIcon className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    className="p-3"
                    mode="single"
                    selected={displayDate}
                    onSelect={(date) => date && setEditingEntryDate(date)}
                    initialFocus
                    classNames={{
                      month: "space-y-4 w-[320px]",
                      day: "h-10 w-10 rounded-lg p-0 font-normal aria-selected:opacity-100",
                    }}
                  />
                </PopoverContent>
              </Popover>
              <h1 className="text-3xl font-semibold tracking-tight mt-1">
                {editingEntryId ? format(displayDate, "MMMM d") : `${getGreeting()}, Kaci`}
              </h1>
            </div>

            {/* Prompted questions */}
            <div className="mb-6">
              <PromptedCarousel
                mood={mood}
                emotions={emotions}
                moodFactors={moodFactors}
                onMoodChange={setMood}
                onEmotionToggle={toggleEmotion}
                onMoodFactorToggle={toggleMoodFactor}
              />
            </div>

            <Separator className="mb-6" />

            {/* Editor */}
            <div className="relative pb-20">
              <TaggableEditor
                key={editorKey}
                content={content}
                onContentChange={setContent}
                onTagsChange={updateInlineTags}
                onFocusChange={setEditorFocused}
              />
              <DigDeeperSection
                questions={digDeeperQuestions}
                isLoading={isDiggingDeeper}
              />

              {/* Floating toolbar */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
                <FloatingToolbar
                  visible={editorFocused || content.length > 0}
                  onDigDeeper={handleDigDeeper}
                  onFinish={handleFinish}
                  isDiggingDeeper={isDiggingDeeper}
                  isSaving={isSaving}
                  canFinish={mood !== null}
                />
              </div>
            </div>
          </div>

          {/* Right sidebar: Tags */}
          <div className="lg:col-span-2 order-3">
            <TagsSidebar tags={inlineTags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptedEntry;

import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
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
    setMood,
    setContent,
    setIsSaving,
    toggleEmotion,
    toggleMoodFactor,
    updateInlineTags,
    loadEntry,
    handleClear,
  } = usePromptedEntry();

  // Load entry from calendar navigation state
  useEffect(() => {
    const navEntry = (location.state as { entry?: JournalEntryData })?.entry;
    if (navEntry) {
      loadEntry(navEntry, navEntry.content ?? "");
      setEditorKey((k) => k + 1);
      // Clear navigation state so it doesn't reload on re-render
      history.replaceState({}, document.title);
    }
  }, [location.state, loadEntry]);

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

      // Lazy-load content if not present
      if (!entryContent && entry.id) {
        try {
          const data = await apiGet<{ content: string }>(
            `/notion/entries/${entry.id}/content`
          );
          entryContent = data.content;
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
    [editingEntryId, loadEntry]
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
      toast.success(
        editingEntryId ? "Entry updated" : "Journal entry saved"
      );
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

  const today = new Date();
  const displayDate = editingEntryDate ? new Date(editingEntryDate) : today;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
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
              <p className="text-sm text-muted-foreground">
                {format(displayDate, "h:mm a")} &middot;{" "}
                {format(displayDate, "EEEE, MMMM d, yyyy")}
              </p>
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

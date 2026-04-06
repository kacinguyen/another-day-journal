import { useState, useCallback } from "react";
import { MoodType } from "@/components/journal/types/mood-types";
import { EmotionType } from "@/components/journal/types/emotion-types";
import { InlineTag, JournalEntryData } from "@/components/journal/types/journal-types";

export type { InlineTag };

export interface PromptedEntryState {
  mood: MoodType;
  emotions: EmotionType[];
  moodFactors: string[];
  content: string;
  inlineTags: InlineTag[];
  isSaving: boolean;
  editingEntryId: string | null;
  editingEntryDate: Date | null;
  editingCreatedAt: Date | null;
}

export function usePromptedEntry() {
  const [mood, setMood] = useState<MoodType>(null);
  const [emotions, setEmotions] = useState<EmotionType[]>([]);
  const [moodFactors, setMoodFactors] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [inlineTags, setInlineTags] = useState<InlineTag[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryDate, setEditingEntryDate] = useState<Date | null>(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState<Date | null>(null);

  const toggleEmotion = useCallback((emotion: EmotionType) => {
    setEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  }, []);

  const toggleMoodFactor = useCallback((factor: string) => {
    setMoodFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  }, []);

  const addInlineTag = useCallback((tag: InlineTag) => {
    setInlineTags((prev) => {
      // Avoid duplicates at the same offset
      const exists = prev.some(
        (t) => t.startOffset === tag.startOffset && t.endOffset === tag.endOffset
      );
      if (exists) return prev;
      return [...prev, tag];
    });
  }, []);

  const removeInlineTag = useCallback((index: number) => {
    setInlineTags((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateInlineTags = useCallback((tags: InlineTag[]) => {
    setInlineTags(tags);
  }, []);

  const handleClear = useCallback(() => {
    setMood(null);
    setEmotions([]);
    setMoodFactors([]);
    setContent("");
    setInlineTags([]);
    setEditingEntryId(null);
    setEditingEntryDate(null);
    setEditingCreatedAt(null);
  }, []);

  const loadEntry = useCallback((entry: JournalEntryData, loadedContent?: string) => {
    setEditingEntryId(entry.id ?? null);
    setEditingEntryDate(entry.date);
    setEditingCreatedAt(entry.updatedAt ?? entry.createdAt);
    setMood(entry.mood ?? null);
    setEmotions(entry.emotions ?? []);
    setMoodFactors(entry.moodFactors ?? []);
    setContent(loadedContent ?? entry.content ?? "");
    setInlineTags(entry.inlineTags ?? []);
  }, []);

  return {
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
    setEmotions,
    setContent,
    setIsSaving,
    toggleEmotion,
    toggleMoodFactor,
    addInlineTag,
    removeInlineTag,
    updateInlineTags,
    handleClear,
    loadEntry,
  };
}


import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JournalEntryData } from "@/components/journal/types/journal-types";
import { fetchJournalEntries, saveJournalEntry } from "@/services/journalService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ENTRIES_QUERY_KEY = ['journal-entries'];

/**
 * Custom hook to manage journal entries fetching and saving.
 * Uses React Query for caching — navigating between pages is instant after first load.
 */
export function useJournalEntries() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading: loading } = useQuery({
    queryKey: ENTRIES_QUERY_KEY,
    queryFn: () => fetchJournalEntries(),
  });

  const saveMutation = useMutation({
    mutationFn: saveJournalEntry,
    onSuccess: (savedEntry) => {
      if (savedEntry) {
        // Optimistically update the cache, then invalidate to refetch
        queryClient.setQueryData<JournalEntryData[]>(ENTRIES_QUERY_KEY, (old = []) => {
          const existsInList = old.some(entry => entry.id === savedEntry.id);
          const updated = existsInList
            ? old.map(entry => entry.id === savedEntry.id ? savedEntry : entry)
            : [savedEntry, ...old];

          // Deduplicate by date, keeping the most recently updated
          const uniqueEntries = new Map<string, JournalEntryData>();
          updated.forEach(entry => {
            const dateString = format(entry.date, 'yyyy-MM-dd');
            if (!uniqueEntries.has(dateString) ||
                entry.updatedAt > uniqueEntries.get(dateString)!.updatedAt) {
              uniqueEntries.set(dateString, entry);
            }
          });

          return Array.from(uniqueEntries.values())
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        });

        // Invalidate so next access refetches (hits server cache — fast)
        queryClient.invalidateQueries({ queryKey: ENTRIES_QUERY_KEY });
      }
    },
  });

  /**
   * Load journal entries — triggers a refetch via React Query
   */
  const loadEntries = useCallback(async () => {
    const result = await queryClient.fetchQuery({
      queryKey: ENTRIES_QUERY_KEY,
      queryFn: () => fetchJournalEntries(),
    });
    return result;
  }, [queryClient]);

  /**
   * Refresh entries data from the server
   */
  const refreshEntries = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ENTRIES_QUERY_KEY });
    toast({
      title: "Entries Refreshed",
      description: "Journal entries have been updated."
    });
  }, [queryClient, toast]);

  /**
   * Handles saving a new journal entry or updating an existing one
   */
  const saveEntry = async (entryData: JournalEntryData) => {
    const savedEntry = await saveMutation.mutateAsync(entryData);

    if (savedEntry) {
      toast({
        title: entryData.id ? "Entry Updated" : "Entry Created",
        description: "Your journal entry has been saved successfully."
      });
      return savedEntry;
    }

    return null;
  };

  /**
   * Fetch entries for a given month and merge them into the cache.
   * Additive only — never removes existing cached entries.
   */
  const fetchEntriesForMonth = useCallback(async (month: Date) => {
    const since = format(new Date(month.getFullYear(), month.getMonth(), 1), 'yyyy-MM-dd');
    const fetched = await fetchJournalEntries({ since });

    queryClient.setQueryData<JournalEntryData[]>(ENTRIES_QUERY_KEY, (old = []) => {
      const merged = [...old, ...fetched];
      const unique = new Map<string, JournalEntryData>();
      merged.forEach(entry => {
        const dateString = format(entry.date, 'yyyy-MM-dd');
        if (!unique.has(dateString) ||
            entry.updatedAt > unique.get(dateString)!.updatedAt) {
          unique.set(dateString, entry);
        }
      });
      return Array.from(unique.values())
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    });
  }, [queryClient]);

  /**
   * Find an entry for a specific date
   */
  const findEntryForDate = useCallback((entriesList: JournalEntryData[], date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entriesList.find(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === dateString;
    });
  }, []);

  /**
   * Check if a specific day has an entry
   */
  const isDayWithEntry = useCallback((day: Date) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  }, [entries]);

  return {
    entries,
    loading,
    loadEntries,
    refreshEntries,
    saveEntry,
    findEntryForDate,
    isDayWithEntry,
    fetchEntriesForMonth
  };
}

const CACHE_TTL_MS = 5 * 60_000; // 5 minutes (safe because mutations invalidate)

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Keyed cache: stores entries per `since` value (undefined = all entries)
const cache = new Map<string, CacheEntry<any[]>>();

function cacheKey(since?: string): string {
  return since ?? "__all__";
}

export function getCachedEntries(since?: string): any[] | null {
  const entry = cache.get(cacheKey(since));
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(cacheKey(since));
    return null;
  }
  return entry.data;
}

export function setCachedEntries(entries: any[], since?: string): void {
  cache.set(cacheKey(since), { data: entries, timestamp: Date.now() });
}

export function invalidateEntriesCache(): void {
  cache.clear();
}

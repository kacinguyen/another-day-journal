# Caching & Data Loading — Problems, Decisions, and Approaches

## The Problem

The app uses Notion as its database. Notion's API has two relevant characteristics:

1. **No content in database queries.** Querying a database returns page properties (mood, date, activities, etc.) but NOT the page body content. To get content, you must call `blocks.children.list` for each page individually.

2. **Rate limit of 3 requests/second.** Notion enforces this strictly and will return 429 errors if exceeded.

This creates an **N+1 problem**: loading 20 journal entries requires 1 database query + 20 block fetches = 21 API calls. At 3 req/sec, that's a minimum of ~7 seconds just from rate limiting — before accounting for network latency.

### How it manifested

- **Every page load triggered a full fetch.** Opening the journal page, navigating to Insights, or sending a chat message each independently fetched all entries from Notion.
- **No shared state between pages.** The Journal page used `useState` while Insights used React Query. Navigating between them threw away fetched data and started over.
- **Chat was especially slow.** Every single message re-fetched all entries to build the AI's context, even though journal data rarely changes mid-conversation.

## Decisions and Tradeoffs

### Server-side in-memory cache

**Decision:** Cache the full entries array in server memory with a TTL.

**Why in-memory, not Redis/SQLite:**
- Single-server deployment — no need for distributed cache
- Journal data is small (tens of entries, not thousands)
- Simplicity — zero dependencies, ~25 lines of code
- If the server restarts, warming the cache takes one Notion fetch cycle

**Why TTL-based, not event-driven:**
- Notion has no webhooks for database changes (edits made directly in Notion wouldn't trigger our mutation handlers)
- TTL provides a natural consistency window — stale data resolves itself
- We invalidate on our own mutations anyway, so TTL is just a safety net for external changes

**TTL choice — 5 minutes:**
- Initially chose 60 seconds, increased to 5 minutes
- Since our own POST/PATCH/DELETE invalidate the cache immediately, the TTL only matters for changes made directly in Notion's UI
- 5 minutes is acceptable staleness for a personal journal app
- Shorter TTL = more Notion API calls = slower cold loads and closer to rate limits

### Rate-limit-safe batching

**Decision:** Fetch block content in batches of 3 with 350ms delays between batches.

**Why 3:** Notion's rate limit is 3 req/sec. Batching at exactly the limit maximizes throughput.

**Why 350ms delay (not 1000ms):** The requests in each batch take some time to complete. 350ms between batch starts, combined with request latency, keeps us under 3 req/sec in practice without being overly conservative.

**Alternative considered — parallel with retry:** Could fire all requests and retry on 429. Rejected because retry-based approaches create unpredictable latency spikes and waste requests.

### Shared `getEntries()` function

**Decision:** Single function used by both the REST endpoint and the chat handler.

**Before:** `server/notion.ts` and `server/chat.ts` each had their own fetch-all-entries implementation. This meant:
- Two completely independent code paths hitting Notion
- Chat couldn't benefit from entries already fetched by the REST endpoint
- Cache only helped one path

**After:** One `getEntries()` function. Chat messages during a conversation hit the cache populated by the initial page load — typically zero Notion calls.

### React Query for client-side caching

**Decision:** Replace `useState` in `useJournalEntries` with React Query's `useQuery`/`useMutation`.

**Why this matters:** The Journal page and Insights page both need the same data. With `useState`, each page fetched independently. React Query deduplicates by query key — both pages use `['journal-entries']`, so navigating between them is instant after the first load.

**Configuration:**
- `staleTime: 5 minutes` — don't refetch if data is less than 5 min old
- `gcTime: 30 minutes` — keep data in memory for 30 min even if no component is using it

**Optimistic updates on save:** When saving an entry, we immediately update the React Query cache with `setQueryData` so the UI reflects the change before the server responds. Then `invalidateQueries` triggers a background refetch to ensure consistency.

**A subtle bug we hit:** The optimistic update initially checked `savedEntry.id` to decide if the entry was new or existing. But Notion returns an `id` for newly created entries too, so new entries were never added to the list. Fixed by checking whether any existing entry in the list has that `id`.

### Cache warming on server startup

**Decision:** Call `getEntries()` immediately after the server starts listening.

**Why:** Without this, the first user to load the page pays the full Notion fetch cost. With warming, the cache is populated before any browser request arrives. The server logs confirm: `[cache] Warmed cache with N entries`.

**Non-blocking:** The warm runs asynchronously — the server is ready to accept requests immediately. If a request arrives before warming completes, it will trigger its own fetch (and populate the cache for subsequent requests).

### Month-filtered Notion query

**Decision:** Add an optional `?since=YYYY-MM-DD` parameter to `GET /entries`.

**Why:** When the cache is cold (server restart, TTL expiry), fetching all entries is slow. Fetching just the current month means fewer pages and fewer block fetches — proportionally faster.

**How it interacts with caching:** Filtered requests bypass the cache (since the cache stores the full dataset). Unfiltered requests populate the cache. This means:
- Journal page can use `?since` for fast cold starts
- Insights page fetches all (populating the cache)
- Subsequent requests from any page hit the cache

## Architecture Overview

```
Browser                          Server                          Notion API
───────                          ──────                          ──────────
                                 ┌─────────────────┐
Journal ──useQuery──┐            │  In-memory cache │
                    │            │  (5 min TTL)     │
Insights ─useQuery──┼──fetch──►  │                  │──miss──►  database.query
                    │            │  getEntries()    │            blocks.children.list
Chat ─────useQuery──┘            │                  │            (batched, 3/sec)
                                 └─────────────────┘
                                     ▲
React Query cache                    │ invalidate on
(5 min staleTime)                    │ POST/PATCH/DELETE
```

## Timezone Bug (Date Off-by-One)

Not directly a caching issue, but discovered during this work.

**Problem:** Entering a journal entry for Feb 19 would show it on Feb 18.

**Root cause:** JavaScript's `new Date("2026-02-19")` parses date-only strings as UTC midnight. In US timezones (UTC-5 to UTC-8), that's the previous evening — Feb 18 at 4-7pm local.

**Fix (inbound):** Parse date-only strings as local noon: `new Date("2026-02-19T12:00:00")`. Noon gives ±12 hours of buffer — safe for any timezone.

**Fix (outbound):** Format dates using `getFullYear()`/`getMonth()`/`getDate()` (local time) instead of `toISOString().split("T")[0]` (UTC).

**Lesson:** Never use `new Date()` with a date-only string when the calendar date matters. Either append a time component or construct the date manually with `new Date(year, month, day)`.

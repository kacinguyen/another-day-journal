import { Router, Request, Response, NextFunction } from "express";
import { Client } from "@notionhq/client";
import { getCachedEntries, setCachedEntries, invalidateEntriesCache } from "./cache";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export const notionRouter = Router();

// Notion uses UUIDs (with or without dashes)
const UUID_RE = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Middleware: validate :id param as UUID
function validateId(req: Request, res: Response, next: NextFunction) {
  if (!UUID_RE.test(req.params.id as string)) {
    res.status(400).json({ error: "Invalid entry ID format" });
    return;
  }
  next();
}

// Types
interface JournalEntryDB {
  id: string;
  content: string | null;
  mood: string | null;
  energy_level: number | null;
  activities: string[] | null;
  emotions: string[] | null;
  social_interactions: {
    people?: string[];
    eventTypes?: string[];
  } | null;
  created_at: string;
  updated_at: string;
}

// Helper: extract plain text from rich text array
function richTextToString(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join("") || "";
}

// Helper: fetch page body content (blocks)
async function fetchPageContent(pageId: string): Promise<string> {
  const blocks: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response: any = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks
    .map((block: any) => {
      const richText = block[block.type]?.rich_text;
      return richText ? richTextToString(richText) : "";
    })
    .filter(Boolean)
    .join("\n");
}

// Helper: fetch page content in batches to respect Notion rate limits (3 req/sec)
async function fetchPageContentBatched(pages: any[]): Promise<Map<string, string>> {
  const BATCH_SIZE = 3;
  const contentMap = new Map<string, string>();

  for (let i = 0; i < pages.length; i += BATCH_SIZE) {
    const batch = pages.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (page: any) => {
        const content = await fetchPageContent(page.id);
        return { id: page.id, content };
      })
    );
    results.forEach(({ id, content }) => contentMap.set(id, content));

    // Small delay between batches to stay under rate limit
    if (i + BATCH_SIZE < pages.length) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  return contentMap;
}

// Helper: query Notion pages with an optional date filter
async function fetchPages(filter?: object): Promise<any[]> {
  const pages: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const query: any = {
      database_id: DATABASE_ID,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      start_cursor: cursor,
    };
    if (filter) query.filter = filter;

    const response: any = await notion.databases.query(query);
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return pages;
}

// Build a date filter for entries on or after a given date
function monthFilter(since: string): object {
  return {
    property: "date",
    date: { on_or_after: since },
  };
}

// Shared entry fetcher with caching. Optionally filter to a date range.
// Content is NOT fetched by default — use includeContent to fetch page body text.
async function getEntries(since?: string, includeContent = false): Promise<JournalEntryDB[]> {
  const cacheKey = includeContent ? `${since ?? "all"}:withContent` : since;
  const cached = getCachedEntries(cacheKey);
  if (cached) {
    console.log(`[cache] Serving entries from cache (since=${since ?? "all"}, content=${includeContent})`);
    return cached;
  }

  const filterLabel = since ? ` (since ${since})` : "";
  console.log(`[cache] Cache miss — fetching from Notion${filterLabel}, content=${includeContent}`);

  const filter = since ? monthFilter(since) : undefined;
  const pages = await fetchPages(filter);

  let entries: JournalEntryDB[];
  if (includeContent) {
    const contentMap = await fetchPageContentBatched(pages);
    entries = pages.map((page) => pageToEntry(page, contentMap.get(page.id) || undefined));
  } else {
    entries = pages.map((page) => pageToEntry(page));
  }

  setCachedEntries(entries, cacheKey);

  return entries;
}

// Helper: convert a Notion page to our flat JournalEntryDB shape
function pageToEntry(page: any, content?: string): JournalEntryDB {
  const props = page.properties;

  // Properties in this DB are rich_text, not multi_select
  const parseRichTextList = (text: string) =>
    text ? text.split(",").map((s: string) => s.trim()).filter(Boolean) : [];

  const activitiesText = richTextToString(props.activities?.rich_text || []);
  const emotionsText = richTextToString(props.emotions?.rich_text || []);
  const peopleText = richTextToString(props.people?.rich_text || []);
  const eventTypesText = richTextToString(props.eventTypes?.rich_text || []);

  return {
    id: page.id,
    content: content ?? null,
    mood: props.mood?.select?.name || null,
    energy_level: parseInt(richTextToString(props.energy?.rich_text || [])) || null,
    activities: parseRichTextList(activitiesText),
    emotions: parseRichTextList(emotionsText),
    social_interactions: {
      people: parseRichTextList(peopleText),
      eventTypes: parseRichTextList(eventTypesText),
    },
    created_at: props.date?.date?.start || page.created_time,
    updated_at: page.last_edited_time,
  };
}

// Helper: convert flat entry data to Notion properties
function entryToNotionProperties(data: any) {
  const properties: any = {};

  if (data.date !== undefined) {
    properties["Name"] = {
      title: [{ text: { content: new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) } }],
    };
    properties["date"] = {
      date: { start: data.date },
    };
  }

  if (data.mood !== undefined) {
    properties["mood"] = data.mood
      ? { select: { name: data.mood } }
      : { select: null };
  }

  if (data.energy_level !== undefined) {
    properties["energy"] = {
      rich_text: [{ text: { content: String(data.energy_level ?? "") } }],
    };
  }

  if (data.activities !== undefined) {
    properties["activities"] = {
      rich_text: [{ text: { content: (data.activities || []).join(", ") } }],
    };
  }

  if (data.emotions !== undefined) {
    properties["emotions"] = {
      rich_text: [{ text: { content: (data.emotions || []).join(", ") } }],
    };
  }

  if (data.people !== undefined) {
    properties["people"] = {
      rich_text: [{ text: { content: (data.people || []).join(", ") } }],
    };
  }

  if (data.event_types !== undefined) {
    properties["eventTypes"] = {
      rich_text: [{ text: { content: (data.event_types || []).join(", ") } }],
    };
  }

  return properties;
}

// Helper: update page body content (replaces all blocks)
async function updatePageContent(pageId: string, content: string) {
  // Delete existing blocks
  const existing: any = await notion.blocks.children.list({ block_id: pageId });
  await Promise.all(
    existing.results.map((block: any) =>
      notion.blocks.delete({ block_id: block.id })
    )
  );

  // Add new content as paragraph blocks
  if (content) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: content.split("\n").map((line) => ({
        object: "block" as const,
        type: "paragraph" as const,
        paragraph: {
          rich_text: [{ type: "text" as const, text: { content: line } }],
        },
      })),
    });
  }
}

// GET /api/notion/entries — fetch entries (cached).
// Defaults to last month. Use ?since=YYYY-MM-DD to override, or ?all=true for everything.
notionRouter.get("/entries", async (req: Request, res: Response) => {
  try {
    let since: string | undefined;

    if (req.query.all === "true") {
      since = undefined;
    } else if (req.query.since) {
      const raw = req.query.since as string;
      if (!DATE_RE.test(raw)) {
        res.status(400).json({ error: "Invalid 'since' format. Expected YYYY-MM-DD." });
        return;
      }
      since = raw;
    } else {
      // Default to 1 month ago
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      since = d.toISOString().slice(0, 10);
    }

    const entries = await getEntries(since);
    res.json(entries);
  } catch (error: any) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/notion/entries/:id/content — fetch page body content for a single entry
notionRouter.get("/entries/:id/content", validateId, async (req: Request, res: Response) => {
  try {
    const content = await fetchPageContent(req.params.id);
    res.json({ content });
  } catch (error: any) {
    console.error("Error fetching entry content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/notion/entries — create a new entry
notionRouter.post("/entries", async (req: Request, res: Response) => {
  try {
    const properties = entryToNotionProperties(req.body);
    const content = req.body.content || "";

    const children = content
      ? content.split("\n").map((line: string) => ({
          object: "block" as const,
          type: "paragraph" as const,
          paragraph: {
            rich_text: [{ type: "text" as const, text: { content: line } }],
          },
        }))
      : [];

    const page = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties,
      children,
    });

    const entry = pageToEntry(page, content);
    invalidateEntriesCache();
    res.json(entry);
  } catch (error: any) {
    console.error("Error creating entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/notion/entries/:id — update an existing entry
notionRouter.patch("/entries/:id", validateId, async (req: Request, res: Response) => {
  try {
    const properties = entryToNotionProperties(req.body);

    const page = await notion.pages.update({
      page_id: req.params.id,
      properties,
    });

    // Update page body content if provided
    if (req.body.content !== undefined) {
      await updatePageContent(req.params.id, req.body.content || "");
    }

    const content = await fetchPageContent(req.params.id);
    const entry = pageToEntry(page, content);
    invalidateEntriesCache();
    res.json(entry);
  } catch (error: any) {
    console.error("Error updating entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/notion/entries/:id — archive a page
notionRouter.delete("/entries/:id", validateId, async (req: Request, res: Response) => {
  try {
    await notion.pages.update({
      page_id: req.params.id,
      archived: true,
    });
    invalidateEntriesCache();
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/notion/tags — fetch database schema for available tag options
notionRouter.get("/tags", async (_req: Request, res: Response) => {
  try {
    const db = await notion.databases.retrieve({ database_id: DATABASE_ID });
    const props = (db as any).properties;

    const tags = {
      activities: props.activities?.multi_select?.options?.map((o: any) => o.name) || [],
      emotions: props.emotions?.multi_select?.options?.map((o: any) => o.name) || [],
      people: props.people?.multi_select?.options?.map((o: any) => o.name) || [],
      event_types: props.event_types?.multi_select?.options?.map((o: any) => o.name) || [],
    };

    res.json(tags);
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export for reuse in chat
export { notion, DATABASE_ID, pageToEntry, fetchPageContent, getEntries };

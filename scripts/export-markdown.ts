import { mkdir, writeFile } from "fs/promises";
import { resolve, join } from "path";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  timeoutMs: 120_000,
});
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

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

function richTextToString(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join("") || "";
}

function parseRichTextList(text: string): string[] {
  return text ? text.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function pageToEntry(page: any, content?: string): JournalEntryDB {
  const props = page.properties;
  return {
    id: page.id,
    content: content ?? null,
    mood: props.mood?.select?.name || null,
    energy_level:
      parseInt(richTextToString(props.energy?.rich_text || [])) || null,
    activities: parseRichTextList(
      richTextToString(props.activities?.rich_text || [])
    ),
    emotions: parseRichTextList(
      richTextToString(props.emotions?.rich_text || [])
    ),
    social_interactions: {
      people: parseRichTextList(
        richTextToString(props.people?.rich_text || [])
      ),
      eventTypes: parseRichTextList(
        richTextToString(props.eventTypes?.rich_text || [])
      ),
    },
    created_at: props.date?.date?.start || page.created_time,
    updated_at: page.last_edited_time,
  };
}

async function fetchAllPages(): Promise<any[]> {
  const pages: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const query: any = {
      database_id: DATABASE_ID,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      start_cursor: cursor,
    };
    const response: any = await notion.databases.query(query);
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
    console.log(`  Fetched ${pages.length} pages...`);
  } while (cursor);

  return pages;
}

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

// --- Markdown generation ---

function escapeYaml(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function toFrontmatter(entry: JournalEntryDB): string {
  const lines: string[] = ["---"];

  lines.push(`date: ${escapeYaml(entry.created_at.slice(0, 10))}`);
  if (entry.mood) lines.push(`mood: ${escapeYaml(entry.mood)}`);
  if (entry.energy_level != null) lines.push(`energy: ${entry.energy_level}`);

  if (entry.activities?.length) {
    lines.push("activities:");
    entry.activities.forEach((a) => lines.push(`  - ${escapeYaml(a)}`));
  }
  if (entry.emotions?.length) {
    lines.push("emotions:");
    entry.emotions.forEach((e) => lines.push(`  - ${escapeYaml(e)}`));
  }

  const people = entry.social_interactions?.people;
  if (people?.length) {
    lines.push("people:");
    people.forEach((p) => lines.push(`  - ${escapeYaml(p)}`));
  }

  const eventTypes = entry.social_interactions?.eventTypes;
  if (eventTypes?.length) {
    lines.push("eventTypes:");
    eventTypes.forEach((t) => lines.push(`  - ${escapeYaml(t)}`));
  }

  lines.push(`createdAt: ${escapeYaml(entry.created_at)}`);
  lines.push(`updatedAt: ${escapeYaml(entry.updated_at)}`);
  lines.push("---");

  return lines.join("\n");
}

function getFilename(
  entry: JournalEntryDB,
  usedDates: Map<string, number>
): string {
  const date = entry.created_at.slice(0, 10);
  const count = usedDates.get(date) ?? 0;
  usedDates.set(date, count + 1);
  return count === 0 ? `${date}.md` : `${date}-${count + 1}.md`;
}

function buildMarkdown(entry: JournalEntryDB): string {
  const frontmatter = toFrontmatter(entry);
  const body = entry.content?.trim() ?? "";
  return body ? `${frontmatter}\n\n${body}\n` : `${frontmatter}\n`;
}

// --- Main ---

async function main() {
  const outputDir = resolve(process.cwd(), "exports");
  await mkdir(outputDir, { recursive: true });

  console.log("Fetching all journal pages from Notion...");
  const pages = await fetchAllPages();
  console.log(`Found ${pages.length} pages.\n`);

  if (pages.length === 0) {
    console.log("No entries to export.");
    return;
  }

  // Fetch content and write files in batches of 3 (respecting rate limits)
  const BATCH_SIZE = 3;
  const entries: JournalEntryDB[] = [];

  console.log("Fetching page content...");
  for (let i = 0; i < pages.length; i += BATCH_SIZE) {
    const batch = pages.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (page: any) => {
        const content = await fetchPageContent(page.id);
        return pageToEntry(page, content);
      })
    );
    entries.push(...results);
    console.log(
      `  [${Math.min(i + BATCH_SIZE, pages.length)}/${pages.length}] content fetched`
    );
    if (i + BATCH_SIZE < pages.length) {
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  // Sort by date for deterministic filenames
  entries.sort((a, b) => a.created_at.localeCompare(b.created_at));

  console.log("\nWriting markdown files...");
  const usedDates = new Map<string, number>();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const filename = getFilename(entry, usedDates);
    await writeFile(join(outputDir, filename), buildMarkdown(entry), "utf-8");
    console.log(`  [${i + 1}/${entries.length}] ${filename}`);
  }

  console.log(`\nExported ${entries.length} entries to ${outputDir}`);
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});

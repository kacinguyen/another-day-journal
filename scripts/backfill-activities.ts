import { readdir, readFile, writeFile, appendFile } from "fs/promises";
import { join } from "path";

const EXPORTS_DIR = join(process.cwd(), "exports");
const CHANGELOG_PATH = join(EXPORTS_DIR, "CHANGELOG.md");

// Activity keyword rules: [activityLabel, patterns (case-insensitive)]
// Patterns are tested against the full journal body text
const ACTIVITY_RULES: [string, RegExp[]][] = [
  [
    "Reading",
    [
      /\breading\s+(a |the |my |some |this )?(book|novel|kindle|series)/i,
      /\bread\s+(a |the |my |some |this )?(book|novel|chapter)/i,
      /\bfinished\s+(reading|the\s+book|golden\s+son|red\s+rising)/i,
      /\bdog\s*ear\s*books\b/i,
      /\bon\s+my\s+kindle\b/i,
    ],
  ],
  [
    "Weight Lifting",
    [
      /\bweight\s*(lift|train)/i,
      /\blift(ed|ing|s)?\s*(weights|heavy)/i,
      /\bdeadlift/i,
      /\bbench\s*press/i,
      /\bsquat(s|ted|ting)?\b/i,
    ],
  ],
  [
    "Hiking",
    [
      /\bhik(e|ed|ing|es)\b/i,
      /\btrail\b/i,
      /\btorrey\s*pines\b/i,
    ],
  ],
  [
    "TV & Content",
    [
      /\bwatch(ed|ing)\s+(a |an |the |some |netflix|hulu|disney|apple|youtube|tv|episode|show|movie|film|documentary|fixer|oscars|zootopia|dinosaur|black\s+mirror|industry|always\s+sunny)/i,
      /\bnetflix\b/i,
      /\bepisodes?\b/i,
      /\bmovies?\b/i,
      /\bdocumentary\b/i,
      /\bfixer\s+upper/i,
      /\boscars?\b/i,
      /\byoutube\b/i,
      /\bapple\s*tv/i,
      /\bhulu\b/i,
      /\bdisney\s*\+/i,
    ],
  ],
  [
    "Cooking",
    [
      /\bcook(ed|ing|s)?\b/i,
      /\bmade\s+(dinner|lunch|breakfast|food|tacos|pasta|chicken|soup|pho|rice|curry|salad|steak)/i,
      /\bsheet\s*pan\b/i,
      /\bair[- ]?fr(ied|y)/i,
      /\bmade\s+.{0,20}\s+for\s+(dinner|lunch)/i,
      /\bprepped?\s+(meals?|food|dinner|lunch)/i,
    ],
  ],
  [
    "Writing",
    [
      /\b(wrote|writing|writ(e|ten))\s+(a(n)?\s+)?(article|blog|substack|essay|post|piece)/i,
      /\bsubstack\b/i,
      /\b(chunk|lot|day)\s+of\s+writing\b/i,
      /\bwriting\s+(my|the|a)\b/i,
    ],
  ],
  [
    "Crafts",
    [
      /\bcrochet/i,
      /\bknit(ting|ted)?\b/i,
      /\bcraft(s|ing|ed)?\b/i,
      /\bsew(ing|ed|n)?\b/i,
    ],
  ],
  [
    "Building",
    [
      /\bside\s+project/i,
      /\bcod(e|ed|ing)\b/i,
      /\bvibecod(e|ed|ing)\b/i,
      /\bbuil(d|t|ding)\s+(a |an |the |my |some |out )?(app|site|website|feature|tool|portfolio|system|prototype)/i,
      /\bportfolio\b/i,
      /\bclaude\s+code\b/i,
      /\bprogramm(ed|ing)\b/i,
      /\blovable\b/i,
      /\bframer\b/i,
      /\b(built|building|worked\s+on)\s+(my |the |a )?(pachi|cafecina)/i,
      /\bworked\s+on\s+my\s+project/i,
    ],
  ],
  [
    "Baking",
    [
      /\bbak(e|ed|ing|es)\b/i,
      /\b(made|baked)\s+.{0,20}(brownies|cookies|cake|bread|muffins|scones)/i,
    ],
  ],
  [
    "Biking",
    [/\bbik(e|ed|ing|es)\b/i, /\bcycl(e|ed|ing)\b/i],
  ],
  [
    "Learning",
    [
      /\blecture\b/i,
      /\bcourse\b/i,
      /\bclass(es)?\b(?!.*(yoga|gym|spin))/i,
      /\bstud(y|ied|ying)\b/i,
      /\blearn(ed|ing)?\s+(about|how|to)\b/i,
    ],
  ],
  [
    "Gym",
    [
      /\bpersonal\s+train(er|ing)\b/i,
      /\bgym\b/i,
      /\bwork(ed)?\s*out\b/i,
      /\btraining\s+sess?ion\b/i,
      /\btraining\s+sesh\b/i,
    ],
  ],
  [
    "Walking",
    [
      /\bwalk(ed|ing|s)?\s+(around|to|through|along|in)\b/i,
      /\bstroll(ed)?\b/i,
      /\bwent\s+for\s+a\s+walk\b/i,
    ],
  ],
  [
    "Exercise",
    [
      /\bexercis(e|ed|ing)\b(?!.*\b(values|team|closing|group)\b)/i,
      /\b(went|go|going)\s+(for|on)\s+a\s+run\b/i,
      /\bwent\s+running\b/i,
      /\b(short|long|usual|morning)\s+run\b/i,
      /\bjog(ged|ging)?\b/i,
      /\bsoulcycle\b/i,
      /\bpilates\b/i,
    ],
  ],
  [
    "Skiing",
    [/\bski(ed|ing|s)?\b/i, /\bslopes?\b/i],
  ],
  [
    "Cleaning",
    [
      /\bclean(ed|ing|s)?\s+(the|my|our|up|out)\b/i,
      /\bvacuum(ed|ing)?\b/i,
      /\bspring\s*clean/i,
      /\bchores?\b/i,
      /\btid(y|ied|ying)\b/i,
    ],
  ],
  [
    "Shopping",
    [
      /\b(went|go)\s+(to\s+)?(shopping|the\s+store|whole\s+foods|target|uniqlo|costco)/i,
      /\bshopping\b/i,
    ],
  ],
];

interface ParsedEntry {
  filename: string;
  frontmatterRaw: string;
  body: string;
  hasActivities: boolean;
  existingActivities: string[];
}

function parseFile(content: string, filename: string): ParsedEntry {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    return { filename, frontmatterRaw: "", body: content, hasActivities: false, existingActivities: [] };
  }

  const frontmatterRaw = fmMatch[1];
  const body = content.slice(fmMatch[0].length).trim();
  const hasActivities = /^activities:/m.test(frontmatterRaw);

  const existingActivities: string[] = [];
  if (hasActivities) {
    const actMatch = frontmatterRaw.match(/activities:\n((?:  - .*\n?)*)/);
    if (actMatch) {
      for (const line of actMatch[1].split("\n")) {
        const m = line.match(/^\s+-\s+"(.+)"/);
        if (m) existingActivities.push(m[1]);
      }
    }
  }

  return { filename, frontmatterRaw, body, hasActivities, existingActivities };
}

function inferActivities(body: string): string[] {
  if (!body) return [];

  const matched: string[] = [];
  for (const [label, patterns] of ACTIVITY_RULES) {
    if (patterns.some((p) => p.test(body))) {
      matched.push(label);
    }
  }
  return matched;
}

function stripActivities(content: string): string {
  return content.replace(/^activities:\n(  - .*\n?)*/m, "");
}

function insertActivities(content: string, activities: string[]): string {
  const actYaml = `activities:\n${activities.map((a) => `  - "${a}"`).join("\n")}`;

  const fmMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/);
  if (!fmMatch) return content;

  const lines = fmMatch[2].split("\n");
  let insertIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^(energy|mood|date):/.test(lines[i])) {
      insertIdx = i + 1;
    }
    if (insertIdx === i && /^\s+-/.test(lines[i])) {
      insertIdx = i + 1;
    }
  }

  if (insertIdx === -1) insertIdx = lines.length;
  lines.splice(insertIdx, 0, actYaml);

  return `${fmMatch[1]}${lines.join("\n")}${fmMatch[3]}${content.slice(fmMatch[0].length)}`;
}

// --- Changelog ---

interface ChangeRecord {
  filename: string;
  action: "added" | "updated" | "removed";
  oldActivities: string[];
  newActivities: string[];
}

function formatChangelog(
  records: ChangeRecord[],
  noMatch: string[],
  skippedManual: number,
  runDate: string
): string {
  const lines: string[] = [
    `## ${runDate}`,
    "",
  ];

  const added = records.filter((r) => r.action === "added");
  const updated = records.filter((r) => r.action === "updated");
  const removed = records.filter((r) => r.action === "removed");

  lines.push(`**${added.length}** entries tagged | **${updated.length}** entries re-tagged | **${removed.length}** entries untagged | **${skippedManual}** manually-tagged entries preserved | **${noMatch.length}** entries with no detected activities`);
  lines.push("");

  if (added.length > 0) {
    lines.push("### Added");
    for (const r of added) {
      lines.push(`- \`${r.filename}\` → ${r.newActivities.join(", ")}`);
    }
    lines.push("");
  }

  if (updated.length > 0) {
    lines.push("### Updated");
    for (const r of updated) {
      lines.push(`- \`${r.filename}\`: ~~${r.oldActivities.join(", ")}~~ → ${r.newActivities.join(", ")}`);
    }
    lines.push("");
  }

  if (removed.length > 0) {
    lines.push("### Removed (no activities detected on re-run)");
    for (const r of removed) {
      lines.push(`- \`${r.filename}\`: ~~${r.oldActivities.join(", ")}~~`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// --- Main ---

// Track which files were tagged by a previous script run vs manually by the user.
// Files originally exported by export-markdown.ts had activities from Notion (manual).
// Files updated by this script are "inferred" — safe to overwrite on re-run.
// Heuristic: if the file was in the "Already tagged" set on the FIRST run, it's manual.
// We use a marker comment in the frontmatter to distinguish.
const INFERRED_MARKER = "# activities inferred by backfill script";

function hasInferredMarker(content: string): boolean {
  return content.includes(INFERRED_MARKER);
}

function addInferredMarker(actYaml: string): string {
  return actYaml.replace("activities:", `activities: ${INFERRED_MARKER}`);
}

async function main() {
  const files = (await readdir(EXPORTS_DIR))
    .filter((f) => f.endsWith(".md"))
    .sort();

  const changes: ChangeRecord[] = [];
  let skippedManual = 0;
  const noMatch: string[] = [];
  const runDate = new Date().toISOString().slice(0, 10);

  for (const filename of files) {
    const filepath = join(EXPORTS_DIR, filename);
    const content = await readFile(filepath, "utf-8");
    const entry = parseFile(content, filename);

    // Skip files with manually-tagged activities (from Notion export)
    if (entry.hasActivities && !hasInferredMarker(content)) {
      skippedManual++;
      continue;
    }

    const inferred = inferActivities(entry.body);
    const oldActivities = entry.existingActivities;

    if (inferred.length === 0) {
      if (entry.hasActivities && hasInferredMarker(content)) {
        // Previously inferred, now no match — strip activities
        const stripped = stripActivities(content);
        await writeFile(filepath, stripped, "utf-8");
        changes.push({ filename, action: "removed", oldActivities, newActivities: [] });
        console.log(`[removed] ${filename}: ${oldActivities.join(", ")}`);
      } else {
        noMatch.push(filename);
      }
      continue;
    }

    const same =
      oldActivities.length === inferred.length &&
      oldActivities.every((a, i) => a === inferred[i]);

    if (same) {
      skippedManual++; // no change needed
      continue;
    }

    // Build new file content
    let newContent = entry.hasActivities ? stripActivities(content) : content;
    newContent = insertActivities(newContent, inferred);
    // Add marker so we know this was script-inferred
    newContent = newContent.replace(
      "activities:",
      `activities: ${INFERRED_MARKER}`
    );

    await writeFile(filepath, newContent, "utf-8");

    const action = oldActivities.length > 0 ? "updated" : "added";
    changes.push({ filename, action, oldActivities, newActivities: inferred });
    console.log(
      action === "updated"
        ? `[updated] ${filename}: ${oldActivities.join(", ")} → ${inferred.join(", ")}`
        : `[added] ${filename} → ${inferred.join(", ")}`
    );
  }

  // Write changelog
  const changelogEntry = formatChangelog(changes, noMatch, skippedManual, runDate);
  const existingChangelog = await readFile(CHANGELOG_PATH, "utf-8").catch(() => "");
  const header = existingChangelog ? "" : "# Activity Backfill Changelog\n\n";
  await writeFile(
    CHANGELOG_PATH,
    `${header}${changelogEntry}\n${existingChangelog.replace(/^# Activity Backfill Changelog\n\n/, "")}`,
    "utf-8"
  );

  console.log(`\n--- Summary ---`);
  console.log(`Added: ${changes.filter((c) => c.action === "added").length}`);
  console.log(`Updated: ${changes.filter((c) => c.action === "updated").length}`);
  console.log(`Removed: ${changes.filter((c) => c.action === "removed").length}`);
  console.log(`Manually tagged (preserved): ${skippedManual}`);
  console.log(`No activities detected: ${noMatch.length}`);
  console.log(`\nChangelog written to ${CHANGELOG_PATH}`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

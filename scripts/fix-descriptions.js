// One-off fix for descriptions imported from WordPress: page SEO descriptions full of raw
// image/link markup, and post excerpts (used as their Google description and card text)
// cut off mid-word. Each is rebuilt from the first sentences of the page's or post's own
// text. Descriptions that were written by hand are left alone.
//
// Run on the server from the project folder:
//   sudo node scripts/fix-descriptions.js --dry-run   (only show what would change)
//   sudo node scripts/fix-descriptions.js             (save; a backup is written first)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const configPath = path.join(dataDir, "site-config.json");
const backupsDir = path.join(dataDir, "backups");
const dryRun = process.argv.includes("--dry-run");
const MAX_LENGTH = 160;

// Includes link targets the excerpt cut off partway, e.g. "Teen Patti game(htt"
const hasMarkup = (text) => /\(\s*https?:|\(\s*h(?:t(?:t(?:ps?)?)?)?$|!\[|!\(|\n/.test(text || "");
const endsCleanly = (text) => /[.!?…"'”)]$/.test(String(text || "").trim());
const squash = (text) => String(text || "").replace(/\s+/g, " ").trim();
// Letters and digits only, for comparing text that WordPress left odd punctuation in
const words = (text) => String(text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Markdown with images and link targets removed, keeping link text
function stripMarkup(markdown) {
  return String(markdown || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\(\s*https?:[^)]*\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[*_`]/g, "");
}

// Text paragraphs of a Markdown document, without headings, images or lists
function paragraphs(markdown) {
  return String(markdown || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block && !/^(#|!|[-*+]\s|\d+[.)]\s|\||---|>)/.test(block))
    .map((block) => squash(stripMarkup(block)).replace(/\s+([,.;:!?])/g, "$1"))
    .filter((block) => block.length > 40);
}

// As many whole opening sentences as fit in MAX_LENGTH characters
function describe(markdown) {
  const text = paragraphs(markdown).join(" ");
  if (!text) return null;
  let out = "";
  for (const sentence of text.match(/[^.!?]+[.!?]+(?=\s|$)/g) || []) {
    const next = squash(`${out} ${sentence}`);
    if (next.length > MAX_LENGTH) break;
    out = next;
  }
  if (out.length >= 70) return out;
  // Too little real text (e.g. an importer placeholder) to describe the page
  if (text.length < 70) return null;
  if (text.length <= MAX_LENGTH) return text;
  return `${text.slice(0, MAX_LENGTH - 1).replace(/\s+\S*$/, "")}…`;
}

// Broken = missing, has WordPress markup, is the importer's placeholder, or is the start of
// the text (headings included) cut off mid-sentence
function isBroken(description, source) {
  if (!description || hasMarkup(description)) return true;
  if (/^Official details and guide for /i.test(description)) return true;
  if (endsCleanly(description)) return false;
  return words(stripMarkup(source)).includes(words(description).slice(0, 50));
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const changes = [];

for (const page of config.pages || []) {
  if (page.isHome) continue;
  const source = [page.content, ...(page.sections || []).map((s) => s?.data?.content)]
    .filter((v) => typeof v === "string")
    .join("\n\n");
  const current = page.seo?.description || "";
  if (!isBroken(current, source)) continue;
  const next = describe(source);
  if (!next || next === current) continue;
  changes.push({ url: `/${String(page.slug || "").replace(/^\/+/, "")}`, current, next });
  if (!dryRun) page.seo = { ...(page.seo || {}), description: next };
}

for (const post of config.posts || []) {
  const current = post.excerpt || "";
  if (!isBroken(current, post.content)) continue;
  const next = describe(post.content);
  if (!next || next === current) continue;
  changes.push({ url: `/blog/${post.slug}`, current, next });
  if (!dryRun) post.excerpt = next;
}

for (const { url, current, next } of changes) {
  console.log(`\n${url}\n  was: ${squash(current).slice(0, 170)}\n  now: ${next}`);
}
console.log(`\n${changes.length} descriptions ${dryRun ? "would change (dry run, nothing saved)" : "updated"}.`);

if (!dryRun && changes.length) {
  // Same name format as the server's rolling backups, so it shows in the admin backup list
  fs.mkdirSync(backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(configPath, path.join(backupsDir, `site-config-${stamp}.json`));
  fs.writeFileSync(configPath, JSON.stringify(config));
  console.log("Saved. The live site picks this up within about 10 seconds.");
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const wpPagesPath = path.join(rootDir, "src", "data", "wpPages.json");
const wpPostsPath = path.join(rootDir, "src", "data", "wpPosts.json");
const publicSitemapPath = path.join(rootDir, "public", "sitemap.xml");

const wpPages = JSON.parse(fs.readFileSync(wpPagesPath, "utf-8"));
const wpPosts = JSON.parse(fs.readFileSync(wpPostsPath, "utf-8"));

const baseUrl = "https://teenpattistars.me";
const currentDate = new Date().toISOString().split("T")[0];

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

const urlMap = new Map();

function addUrl(urlPath, priority, changefreq, rawDate) {
  const clean = urlPath.replace(/^\/+|\/+$/g, "");
  const loc = clean ? `${baseUrl}/${clean}` : `${baseUrl}/`;
  let lastmod = currentDate;
  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      lastmod = d.toISOString().split("T")[0];
    }
  }
  if (!urlMap.has(loc)) {
    urlMap.set(loc, { loc, priority, changefreq, lastmod });
  }
}

// 1. Core static hub entries
addUrl("", "1.0", "daily", currentDate);
addUrl("how-to-play", "0.9", "weekly", currentDate);
addUrl("vip-club", "0.9", "weekly", currentDate);
addUrl("blog", "0.9", "daily", currentDate);
addUrl("faq", "0.8", "weekly", currentDate);
addUrl("sitemap", "0.7", "weekly", currentDate);

// 2. High priority key hub pages
const highPrioritySlugs = new Set([
  "our-games",
  "players-guide",
  "teen-patti-games",
  "loyalty-programs",
  "welcome-bonuses",
  "leaderboards-and-tournaments",
  "deposit-bonuses",
  "cashback-offers",
  "refer-a-friend-bonuses",
]);

const utilitySlugs = new Set([
  "privacy-policy",
  "about-us",
  "contact-us",
  "sitemap",
]);

wpPages.forEach((p) => {
  const clean = (p.slug || "").replace(/^\/+|\/+$/g, "");
  if (!clean || clean === "home") return;
  if (clean === "blogs") {
    addUrl("blog", "0.9", "daily", p.date || currentDate);
    return;
  }
  const isHigh = highPrioritySlugs.has(clean);
  const isLow = utilitySlugs.has(clean);
  const priority = isHigh ? "0.9" : isLow ? "0.6" : "0.8";
  const changefreq = isHigh ? "weekly" : isLow ? "monthly" : "weekly";
  addUrl(clean, priority, changefreq, p.date || currentDate);
});

// 3. Blog posts
const defPosts = [
  { slug: "top-5-teen-patti-strategies", date: "2026-01-10" },
  { slug: "instant-upi-payouts-technology", date: "2026-01-18" },
  { slug: "diwali-mega-tournament-guide", date: "2026-02-02" },
];

[...wpPosts, ...defPosts].forEach((post) => {
  const clean = (post.slug || "").replace(/^\/+|\/+$/g, "").replace(/^blogs?\//, "");
  if (!clean) return;
  addUrl(`blog/${clean}`, "0.8", "monthly", post.date || currentDate);
});

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

const entries = Array.from(urlMap.values())
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n");

const xmlContent = `${xmlHeader}${entries}\n</urlset>\n`;

fs.writeFileSync(publicSitemapPath, xmlContent, "utf-8");
console.log(`✅ Generated public/sitemap.xml with ${urlMap.size} URLs (domain: ${baseUrl})`);

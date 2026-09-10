import fs from "fs";
import path from "path";

const postXmlPath = "C:\\Users\\sylver083\\Downloads\\tpsme.post.xml";
const pageXmlPath = "C:\\Users\\sylver083\\Downloads\\tpsme.pages.xml";

function decodeEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

function htmlToMarkdown(html) {
  if (!html) return "";
  let md = html.replace(/<!--\s*\/?wp:[^\>]*-->/gi, "");
  md = decodeEntities(md);

  // Simple and robust HTML to Markdown conversions for Node
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n# $1\n\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n\n##### $1\n\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n\n###### $1\n\n");
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, " **$1** ");
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, " **$1** ");
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, " *$1* ");
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, " *$1* ");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, " `$1` ");
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "\n\n> $1\n\n");
  md = md.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, "\n\n![$2]($1)\n\n");
  md = md.replace(/<img\s+[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>/gi, "\n\n![$1]($2)\n\n");
  md = md.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, "\n\n![Image]($1)\n\n");
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");

  // Remove remaining HTML tags
  md = md.replace(/<[^>]*>/g, "");
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

function parseXmlFile(filePath, expectedType) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return [];
  }

  const xml = fs.readFileSync(filePath, "utf-8");
  console.log(`Parsing ${filePath} (${(xml.length / 1024 / 1024).toFixed(2)} MB)...`);

  // Build attachment map
  const attachments = {};
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    const postTypeMatch = itemContent.match(/<wp:post_type>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_type>/);
    const postIdMatch = itemContent.match(/<wp:post_id>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_id>/);
    const attachmentUrlMatch = itemContent.match(/<wp:attachment_url>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:attachment_url>/);

    if (postTypeMatch && postTypeMatch[1].trim() === "attachment" && postIdMatch && attachmentUrlMatch) {
      attachments[postIdMatch[1].trim()] = attachmentUrlMatch[1].trim();
    }
  }

  const items = [];
  const seenSlugs = new Set();
  itemRegex.lastIndex = 0;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const postTypeMatch = itemContent.match(/<wp:post_type>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_type>/);
    const postType = postTypeMatch ? postTypeMatch[1].trim() : "";

    const statusMatch = itemContent.match(/<wp:status>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:status>/);
    const status = statusMatch ? statusMatch[1].trim() : "publish";

    if (status === "trash" || status === "auto-draft") continue;
    if (expectedType && postType !== expectedType && postType !== "post" && postType !== "page") continue;

    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const title = decodeEntities(titleMatch ? titleMatch[1].trim() : "Untitled");

    const slugMatch = itemContent.match(/<wp:post_name>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_name>/);
    let slug = slugMatch ? slugMatch[1].trim() : "";
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    if (!slug || seenSlugs.has(slug)) {
      continue;
    }
    seenSlugs.add(slug);

    const contentMatch = itemContent.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/);
    const rawContent = contentMatch ? contentMatch[1] : "";

    const excerptMatch = itemContent.match(/<excerpt:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/excerpt:encoded>/);
    const rawExcerpt = excerptMatch ? excerptMatch[1] : "";

    const authorMatch = itemContent.match(/<dc:creator>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:creator>/);
    const author = authorMatch ? authorMatch[1].trim() : "Teen Patti Editorial Team";

    const dateMatch = itemContent.match(/<wp:post_date>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:post_date>/);
    const postDate = dateMatch ? dateMatch[1].trim().split(" ")[0] : new Date().toISOString().split("T")[0];

    // Category detection
    const catMatches = itemContent.matchAll(/<category\s+domain=["']category["'][^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g);
    let category = "";
    for (const cm of catMatches) {
      const cat = cm[1].trim();
      if (cat && !cat.toLowerCase().includes("uncategorized")) {
        category = cat;
        break;
      }
    }

    if (!category) {
      const s = slug.toLowerCase();
      const t = title.toLowerCase();
      if (s.includes("privacy") || s.includes("terms") || s.includes("disclaimer") || s.includes("responsible") || s.includes("policy")) {
        category = "Legal & Compliance";
      } else if (s.includes("promo") || s.includes("bonus") || s.includes("cashback") || s.includes("recharge") || s.includes("refund")) {
        category = "Bonuses & Offers";
      } else if (s.includes("india") || s.includes("mumbai") || s.includes("delhi") || s.includes("gujarat") || s.includes("rajasthan") || s.includes("bihar") || s.includes("bangalore") || s.includes("hyderabad") || s.includes("chennai") || s.includes("kolkata") || s.includes("pune") || s.includes("jaipur") || s.includes("surat") || s.includes("ahmedabad") || s.includes("chhattisgarh") || s.includes("tamil-nadu")) {
        category = "Teen Patti India";
      } else if (s.includes("game") || s.includes("roulette") || s.includes("dragon") || s.includes("crash") || s.includes("dice") || s.includes("baccarat") || s.includes("saloon") || s.includes("andar-bahar") || s.includes("jhandi") || s.includes("lottery") || s.includes("coin-flip") || s.includes("monopoly") || s.includes("cowboy") || s.includes("rummy") || s.includes("sic-bo") || s.includes("poker") || s.includes("7-up-down") || s.includes("fan-tan") || s.includes("supercard") || s.includes("black-reds") || s.includes("bac-bo") || s.includes("fruit-party") || s.includes("mines") || s.includes("deal-or-no-deal") || s.includes("dream-catcher") || s.includes("football-studio") || s.includes("mega-ball") || s.includes("ak47")) {
        category = "Game Rules & Guide";
      } else if (s.includes("about") || s.includes("contact")) {
        category = "About Us";
      } else {
        category = expectedType === "page" ? "Official Guide" : "Strategy & News";
      }
    }

    // Cover image
    let coverImage = "";
    const metaMatches = itemContent.matchAll(/<wp:postmeta>[\s\S]*?<wp:meta_key>(?:<!\[CDATA\[)?_thumbnail_id(?:\]\]>)?<\/wp:meta_key>[\s\S]*?<wp:meta_value>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/wp:meta_value>[\s\S]*?<\/wp:postmeta>/g);
    for (const mm of metaMatches) {
      const thumbId = mm[1].trim();
      if (attachments[thumbId]) {
        coverImage = attachments[thumbId];
        break;
      }
    }

    if (!coverImage) {
      const imgMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        coverImage = imgMatch[1];
      }
    }

    if (!coverImage) {
      coverImage = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80";
    }

    const mdContent = htmlToMarkdown(rawContent);
    const plainExcerpt = stripHtml(rawExcerpt) || mdContent.replace(/[#*`_>\[\]]/g, "").slice(0, 160);

    const words = mdContent.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.ceil(words / 200));

    items.push({
      id: `wp_${slug.replace(/[^a-z0-9_]/gi, "_")}`,
      title,
      slug,
      excerpt: plainExcerpt.slice(0, 160) + (plainExcerpt.length > 160 ? "..." : ""),
      content: mdContent,
      author,
      date: postDate,
      category,
      readTime: `${readMinutes} min read`,
      coverColor: "from-amber-500/20 to-emerald-500/20",
      coverImage,
      badge: category,
      status: "published",
      wpType: postType,
    });
  }

  console.log(`Parsed ${items.length} items from ${filePath}`);
  return items;
}

const parsedPosts = parseXmlFile(postXmlPath, "post");
const parsedPages = parseXmlFile(pageXmlPath, "page");

// Ensure data dir exists
const dataDir = path.resolve("src", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, "wpPosts.json"), JSON.stringify(parsedPosts, null, 2));
fs.writeFileSync(path.join(dataDir, "wpPages.json"), JSON.stringify(parsedPages, null, 2));

console.log(`Saved ${parsedPosts.length} posts to src/data/wpPosts.json`);
console.log(`Saved ${parsedPages.length} pages to src/data/wpPages.json`);

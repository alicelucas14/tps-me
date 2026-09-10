/**
 * Utility for parsing and importing WordPress content (XML exports, REST API, or raw HTML/Gutenberg blocks)
 * and converting it into clean, high-performance Markdown for Teen Patti Stars.
 */

export interface ParsedWordPressPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Converted Markdown
  rawHtml?: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  coverImage?: string;
  badge: string;
  status: "published" | "draft";
  wpId?: string;
  wpType?: string;
}

/**
 * Converts WordPress HTML / Gutenberg blocks into clean Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return "";

  // 1. Remove Gutenberg block annotations <!-- wp:... --> and <!-- /wp:... -->
  let md = html.replace(/<!--\s*\/?wp:[^\>]*-->/gi, "");

  // 2. Decode common HTML entities
  md = decodeHtmlEntities(md);

  // 3. Create a detached DOM tree for robust tree traversal
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${md}</body>`, "text/html");

  function nodeToMarkdown(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const childrenMd = Array.from(el.childNodes).map(nodeToMarkdown).join("");

    switch (tag) {
      case "h1":
        return `\n\n# ${childrenMd.trim()}\n\n`;
      case "h2":
        return `\n\n## ${childrenMd.trim()}\n\n`;
      case "h3":
        return `\n\n### ${childrenMd.trim()}\n\n`;
      case "h4":
        return `\n\n#### ${childrenMd.trim()}\n\n`;
      case "h5":
        return `\n\n##### ${childrenMd.trim()}\n\n`;
      case "h6":
        return `\n\n###### ${childrenMd.trim()}\n\n`;

      case "strong":
      case "b":
        return childrenMd.trim() ? ` **${childrenMd.trim()}** ` : "";

      case "em":
      case "i":
        return childrenMd.trim() ? ` *${childrenMd.trim()}* ` : "";

      case "code":
        if (el.parentElement?.tagName.toLowerCase() === "pre") {
          return childrenMd;
        }
        return ` \`${childrenMd.trim()}\` `;

      case "pre":
        return `\n\n\`\`\`\n${el.textContent?.trim() || ""}\n\`\`\`\n\n`;

      case "blockquote":
        return `\n\n> ${childrenMd.trim().replace(/\n/g, "\n> ")}\n\n`;

      case "a": {
        const href = el.getAttribute("href") || "#";
        const linkText = childrenMd.trim() || href;
        return `[${linkText}](${href})`;
      }

      case "img": {
        const src = el.getAttribute("src") || "";
        const alt = el.getAttribute("alt") || "Image";
        return src ? `\n\n![${alt}](${src})\n\n` : "";
      }

      case "ul": {
        const items = Array.from(el.children)
          .filter((c) => c.tagName.toLowerCase() === "li")
          .map((li) => `- ${Array.from(li.childNodes).map(nodeToMarkdown).join("").trim()}`)
          .join("\n");
        return `\n\n${items}\n\n`;
      }

      case "ol": {
        const items = Array.from(el.children)
          .filter((c) => c.tagName.toLowerCase() === "li")
          .map((li, idx) => `${idx + 1}. ${Array.from(li.childNodes).map(nodeToMarkdown).join("").trim()}`)
          .join("\n");
        return `\n\n${items}\n\n`;
      }

      case "p":
        return `\n\n${childrenMd.trim()}\n\n`;

      case "br":
        return "\n";

      case "hr":
        return "\n\n---\n\n";

      case "figure":
        return `\n\n${childrenMd.trim()}\n\n`;

      case "figcaption":
        return `\n*${childrenMd.trim()}*\n`;

      case "table": {
        // Basic table conversion
        const rows = Array.from(el.querySelectorAll("tr"));
        if (rows.length === 0) return childrenMd;

        let tableText = "\n\n";
        rows.forEach((row, rIdx) => {
          const cells = Array.from(row.querySelectorAll("th, td")).map((c) =>
            (c.textContent || "").replace(/\|/g, "\\|").trim()
          );
          tableText += `| ${cells.join(" | ")} |\n`;
          if (rIdx === 0) {
            tableText += `| ${cells.map(() => "---").join(" | ")} |\n`;
          }
        });
        return `${tableText}\n`;
      }

      default:
        return childrenMd;
    }
  }

  let result = nodeToMarkdown(doc.body);

  // Clean up repeated empty lines and trailing spaces
  result = result
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return result;
}

/**
 * Parses a standard WordPress WXR XML export file
 */
export function parseWordPressXml(xmlString: string): ParsedWordPressPost[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const parserError = xmlDoc.querySelector("parsererror");
  if (parserError) {
    throw new Error(`Invalid XML file: ${parserError.textContent?.slice(0, 100)}`);
  }

  // Find all attachments first to map thumbnail IDs to URLs
  const attachmentsMap: Record<string, string> = {};
  const items = Array.from(xmlDoc.getElementsByTagName("item"));

  items.forEach((item) => {
    const postType = getTagValue(item, "wp:post_type");
    const postId = getTagValue(item, "wp:post_id");
    const attachmentUrl = getTagValue(item, "wp:attachment_url");
    if (postType === "attachment" && postId && attachmentUrl) {
      attachmentsMap[postId] = attachmentUrl;
    }
  });

  const parsedPosts: ParsedWordPressPost[] = [];

  items.forEach((item) => {
    const postType = getTagValue(item, "wp:post_type");
    const status = getTagValue(item, "wp:status");

    // Only process posts (and allow published or draft)
    if (postType !== "post" && postType !== "page") {
      return;
    }

    const title = getTagValue(item, "title") || "Untitled Post";
    let slug = getTagValue(item, "wp:post_name");
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const rawContent = getTagValue(item, "content:encoded") || "";
    const rawExcerpt = getTagValue(item, "excerpt:encoded") || "";
    const postDateRaw = getTagValue(item, "wp:post_date") || new Date().toISOString();
    const formattedDate = formatDate(postDateRaw);
    const author = getTagValue(item, "dc:creator") || "Teen Patti Editorial Team";

    // Extract categories
    const categories: string[] = [];
    const categoryEls = Array.from(item.getElementsByTagName("category"));
    categoryEls.forEach((c) => {
      const domain = c.getAttribute("domain");
      if (domain === "category" && c.textContent) {
        const catName = c.textContent.trim();
        if (catName && !catName.toLowerCase().includes("uncategorized")) {
          categories.push(catName);
        }
      }
    });

    const category = categories[0] || (postType === "page" ? "Page" : "Strategy Guide");

    // Convert HTML to Markdown
    const content = htmlToMarkdown(rawContent);

    // Compute Excerpt
    let excerpt = rawExcerpt
      ? stripHtml(rawExcerpt)
      : content
          .replace(/[#*`>_~\[\]]/g, "")
          .split("\n")
          .find((l) => l.trim().length > 20) || "";
    excerpt = excerpt.slice(0, 160) + (excerpt.length > 160 ? "..." : "");

    // Find thumbnail / featured image
    let coverImage: string | undefined = undefined;

    // Check postmeta for _thumbnail_id
    const postmetas = Array.from(item.getElementsByTagName("wp:postmeta"));
    postmetas.forEach((meta) => {
      const key = getTagValue(meta, "wp:meta_key");
      const val = getTagValue(meta, "wp:meta_value");
      if (key === "_thumbnail_id" && val && attachmentsMap[val]) {
        coverImage = attachmentsMap[val];
      }
    });

    // Fallback: extract first image from raw HTML content
    if (!coverImage) {
      const imgMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        coverImage = imgMatch[1];
      }
    }

    // Fallback preset if still empty
    if (!coverImage) {
      coverImage = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80";
    }

    // Read time calculation
    const words = content.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.ceil(words / 200));
    const readTime = `${readMinutes} min read`;

    parsedPosts.push({
      title,
      slug,
      excerpt,
      content,
      rawHtml: rawContent,
      author,
      date: formattedDate,
      category,
      readTime,
      coverImage,
      badge: "WordPress Import",
      status: status === "publish" ? "published" : "draft",
      wpId: getTagValue(item, "wp:post_id"),
      wpType: postType,
    });
  });

  return parsedPosts;
}

/**
 * Parses raw HTML pasted by user into a single post ready for review
 */
export function parseRawHtmlPost(titleInput: string, rawHtml: string): ParsedWordPressPost {
  const content = htmlToMarkdown(rawHtml);
  const words = content.split(/\s+/).length;
  const readMinutes = Math.max(1, Math.ceil(words / 200));
  const readTime = `${readMinutes} min read`;

  let coverImage = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80";
  const imgMatch = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    coverImage = imgMatch[1];
  }

  const plainText = stripHtml(rawHtml);
  const excerpt = plainText.slice(0, 160) + (plainText.length > 160 ? "..." : "");
  const title = titleInput.trim() || "Imported WordPress Post";
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return {
    title,
    slug,
    excerpt,
    content,
    rawHtml,
    author: "Teen Patti Strategy Team",
    date: new Date().toISOString().split("T")[0],
    category: "Strategy Guide",
    readTime,
    coverImage,
    badge: "Imported",
    status: "published",
  };
}

/**
 * Fetches and parses a live WordPress post via WP REST API
 */
export async function fetchWordPressPostByUrl(targetUrl: string): Promise<ParsedWordPressPost[]> {
  const cleanUrl = targetUrl.trim();
  let apiUrl = "";

  try {
    const urlObj = new URL(cleanUrl);
    
    // Check if it's already a WP REST API endpoint
    if (urlObj.pathname.includes("/wp-json/wp/v2/")) {
      apiUrl = cleanUrl;
    } else {
      // Extract possible slug from URL pathname (e.g. /my-post-name/)
      const pathSegments = urlObj.pathname.split("/").filter(Boolean);
      const possibleSlug = pathSegments[pathSegments.length - 1];

      if (possibleSlug && !possibleSlug.includes(".php") && !possibleSlug.includes(".html")) {
        apiUrl = `${urlObj.origin}/wp-json/wp/v2/posts?slug=${possibleSlug}&_embed`;
      } else {
        // Fallback: list latest 10 posts from site
        apiUrl = `${urlObj.origin}/wp-json/wp/v2/posts?per_page=10&_embed`;
      }
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching from ${apiUrl}`);
    }

    const data = await response.json();
    const rawPosts = Array.isArray(data) ? data : [data];

    return rawPosts.map((wp: any) => {
      const title = decodeHtmlEntities(wp.title?.rendered || "Untitled Post");
      const rawContent = wp.content?.rendered || "";
      const rawExcerpt = wp.excerpt?.rendered || "";
      const content = htmlToMarkdown(rawContent);
      const plainExcerpt = stripHtml(rawExcerpt) || content.slice(0, 150);

      // Featured image from _embedded
      let coverImage = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80";
      const featuredMedia = wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      if (featuredMedia) {
        coverImage = featuredMedia;
      } else {
        const imgMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
          coverImage = imgMatch[1];
        }
      }

      // Author name
      const author = wp._embedded?.author?.[0]?.name || "Teen Patti Editorial Team";

      // Category
      const termCategories = wp._embedded?.["wp:term"]?.[0] || [];
      const category = termCategories[0]?.name || "Strategy Guide";

      const words = content.split(/\s+/).length;
      const readMinutes = Math.max(1, Math.ceil(words / 200));
      const readTime = `${readMinutes} min read`;

      return {
        title,
        slug: wp.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: plainExcerpt.slice(0, 160),
        content,
        rawHtml: rawContent,
        author,
        date: (wp.date || "").split("T")[0] || new Date().toISOString().split("T")[0],
        category,
        readTime,
        coverImage,
        badge: "WP API",
        status: "published",
        wpId: String(wp.id),
      };
    });
  } catch (err: any) {
    throw new Error(`Failed to fetch WordPress post: ${err.message || err}`);
  }
}

/* ——— Helper Utilities ——— */

function getTagValue(parent: Element, tagName: string): string {
  const el = parent.getElementsByTagName(tagName)[0];
  return el ? el.textContent?.trim() || "" : "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(str: string): string {
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

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.split(" ")[0] || dateStr;
    return d.toISOString().split("T")[0];
  } catch {
    return dateStr;
  }
}

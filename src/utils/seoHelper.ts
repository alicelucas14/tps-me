import type { SiteConfig } from "../store/siteStore";

export const DEFAULT_BASE_URL = "https://teenpattistars.com";

/**
 * Dynamically updates document title, description, canonical link, OpenGraph tags, and JSON-LD structured data.
 */
export function updateRouteMeta({
  title,
  description,
  path = "",
  ogImage = "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
  type = "website",
  jsonLd,
}: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  type?: "website" | "article";
  jsonLd?: object;
}) {
  if (typeof document === "undefined") return;

  const fullTitle = title
    ? `${title} | Teen Patti Stars`
    : "Teen Patti Stars — India's Premium Real-Money Card Experience";
  const metaDesc =
    description ||
    "Play Teen Patti for real money with instant 30-second UPI payouts, certified RNG fair tables, and ₹25 Crore tournament prize pools.";
  const canonicalUrl = `${DEFAULT_BASE_URL}${path}`;

  // 1. Title
  document.title = fullTitle;

  // 2. Meta description
  updateMetaTag("name", "description", metaDesc);

  // 3. Canonical link
  let linkCanonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (!linkCanonical) {
    linkCanonical = document.createElement("link");
    linkCanonical.rel = "canonical";
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.href = canonicalUrl;

  // 4. OpenGraph
  updateMetaTag("property", "og:title", fullTitle);
  updateMetaTag("property", "og:description", metaDesc);
  updateMetaTag("property", "og:url", canonicalUrl);
  updateMetaTag("property", "og:image", ogImage);
  updateMetaTag("property", "og:type", type);

  // 5. Twitter
  updateMetaTag("name", "twitter:title", fullTitle);
  updateMetaTag("name", "twitter:description", metaDesc);
  updateMetaTag("name", "twitter:image", ogImage);

  // 6. Dynamic JSON-LD Schema
  if (jsonLd) {
    let script = document.getElementById("dynamic-jsonld-schema") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "dynamic-jsonld-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }
}

function updateMetaTag(attributeName: "name" | "property", attributeValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attributeName, attributeValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Generates dynamic, RFC-compliant XML Sitemap containing all custom pages and blog posts.
 */
export function generateDynamicSitemapXml(config: SiteConfig, baseUrl: string = DEFAULT_BASE_URL): string {
  const currentDate = new Date().toISOString().split("T")[0];

  const staticEntries = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily", lastmod: currentDate },
    { loc: `${baseUrl}/#/how-to-play`, priority: "0.9", changefreq: "weekly", lastmod: currentDate },
    { loc: `${baseUrl}/#/vip-club`, priority: "0.9", changefreq: "weekly", lastmod: currentDate },
    { loc: `${baseUrl}/#/blog`, priority: "0.8", changefreq: "daily", lastmod: currentDate },
    { loc: `${baseUrl}/#/sitemap`, priority: "0.7", changefreq: "monthly", lastmod: currentDate },
  ];

  // Map custom pages
  const pageEntries = (config.pages || [])
    .filter((p) => p.slug !== "/" && p.slug !== "/how-to-play" && p.slug !== "/vip-club")
    .map((p) => ({
      loc: `${baseUrl}/#${p.slug}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: p.createdAt || currentDate,
    }));

  // Map blog posts
  const postEntries = (config.posts || []).map((post) => ({
    loc: `${baseUrl}/#/blog/${post.slug}`,
    priority: "0.8",
    changefreq: "monthly",
    lastmod: currentDate,
  }));

  const allUrls = [...staticEntries, ...pageEntries, ...postEntries];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod || currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

/**
 * Generates an AI-friendly robots.txt allowing all major AI search bots.
 */
export function generateDynamicRobotsTxt(baseUrl: string = DEFAULT_BASE_URL): string {
  return `# Robots.txt for Teen Patti Stars
# Optimized for Web Search Engines & Generative AI Crawlers

User-agent: *
Allow: /
Disallow: /admin
Disallow: /#/admin

# Explicitly permit AI Crawlers & LLM Indexers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Amazonbot
Allow: /

# XML Sitemap & AI Documentation
Sitemap: ${baseUrl}/sitemap.xml
`;
}

/**
 * Generates an LLMs.txt markdown file for modern AI Search Engines (Perplexity, ChatGPT, Gemini, Claude).
 */
export function generateDynamicLlmsTxt(config: SiteConfig, baseUrl: string = DEFAULT_BASE_URL): string {
  const pagesList = (config.pages || [])
    .map((p) => `- [${p.title}](${baseUrl}/#${p.slug === "/" ? "" : p.slug}): ${p.seo?.description || "Interactive page"}`)
    .join("\n");

  const postsList = (config.posts || [])
    .map((p) => `- [${p.title}](${baseUrl}/#/blog/${p.slug}) (${p.category}): ${p.excerpt}`)
    .join("\n");

  return `# Teen Patti Stars — AI & LLM Site Guide (llms.txt)
> India's premier certified real-money Teen Patti card gaming platform.

## Website Overview
- **Name**: Teen Patti Stars
- **Category**: Real-Money Skill Gaming & Card Strategy
- **Website URL**: ${baseUrl}/
- **Withdrawals**: Automated instant UPI payouts (GPay, PhonePe, Paytm, BHIM) in under 30 seconds
- **Certifications**: RNG (Random Number Generator) certified for fair card distribution, SSL 256-bit encryption
- **Supported Platforms**: Web, Android APK, iOS

## Core Site Sections & Pages
${pagesList}
- [HTML Sitemap & Directory](${baseUrl}/#/sitemap): Full site map and directory index.

## Official Strategy Articles & Guides
${postsList}

## Trust & Fair Play Standards
1. **Collusion Protection**: Algorithmic table detection and real-time risk assessment.
2. **Instant Banking**: Direct RazorpayX and Cashfree merchant nodes for instant bank credit.
3. **Responsible Gaming**: Self-exclusion, deposit limits, and 18+ strict age verification.
`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
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

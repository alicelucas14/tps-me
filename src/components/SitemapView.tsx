import { useState, useMemo } from "react";
import {
  BookOpen,
  FileText,
  Globe,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Terminal,
  Search,
  Copy,
  Check,
  CheckCircle2,
  Layers,
  Sparkle,
} from "lucide-react";
import { useSiteStore } from "../store/siteStore";
import { DEFAULT_BASE_URL } from "../utils/seoHelper";

export function SitemapView({ onBack }: { onBack: () => void }) {
  const { publishedConfig, draftConfig } = useSiteStore();
  const pages = publishedConfig.pages?.length ? publishedConfig.pages : (draftConfig.pages || []);
  const posts = publishedConfig.posts?.length ? publishedConfig.posts : (draftConfig.posts || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pages" | "posts">("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const domain = DEFAULT_BASE_URL; // "https://teenpattistars.me"

  const filteredPages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }, [pages, searchQuery]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  const totalUrlsCount = pages.length + posts.length + 3; // + home, faq, sitemap

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Domain: teenpattistars.me</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="text-center md:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-300">
              <Globe className="h-3.5 w-3.5" />
              SEO, Crawlers & AI Index Directory
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Website <span className="gradient-text-gold">Sitemap</span>
            </h1>
            <p className="mt-2 text-sm text-white/60 max-w-2xl leading-relaxed">
              Complete index of all live pages, regional guides, real-money card rules, and AI crawler documentation files hosted on <span className="text-emerald-300 font-mono">teenpattistars.me</span>.
            </p>
          </div>

          {/* Direct Raw File Links */}
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-end">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-950/20"
            >
              <FileText className="h-4 w-4" />
              <span>sitemap.xml</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all"
            >
              <Terminal className="h-4 w-4" />
              <span>robots.txt</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-lg shadow-amber-950/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>llms.txt (AI)</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <button
              onClick={() => handleCopy(`${domain}/sitemap.xml`)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white/90 hover:bg-white/10 transition-all"
              title="Copy XML Sitemap URL for Google Search Console"
            >
              {copiedUrl === `${domain}/sitemap.xml` ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-white/60" />
                  <span>Copy XML URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>Total URLs</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalUrlsCount}</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">RFC 0.9 XML Indexed</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>Core Landing Pages</span>
            </div>
            <div className="text-2xl font-bold text-white">{pages.length}</div>
            <div className="text-[11px] text-blue-400/80 mt-0.5">Games, Guides & Regions</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span>Published Articles</span>
            </div>
            <div className="text-2xl font-bold text-white">{posts.length}</div>
            <div className="text-[11px] text-amber-400/80 mt-0.5">Strategy & Tournament</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
              <span>Canonical Domain</span>
            </div>
            <div className="text-base font-bold text-white truncate font-mono">teenpattistars.me</div>
            <div className="text-[11px] text-purple-400/80 mt-0.5">HTTPS SSL 256-Bit</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-2 p-1 rounded-2xl border border-white/10 bg-white/[0.03]">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300 border border-amber-400/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              All URLs ({pages.length + posts.length})
            </button>
            <button
              onClick={() => setActiveTab("pages")}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === "pages"
                  ? "bg-gradient-to-r from-emerald-400/20 to-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Landing Pages ({pages.length})
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === "posts"
                  ? "bg-gradient-to-r from-blue-400/20 to-blue-500/20 text-blue-300 border border-blue-400/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Blog Posts ({posts.length})
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, keyword, or slug (e.g. rummy, hyderabad)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* 1. Core Pages Section */}
          {(activeTab === "all" || activeTab === "pages") && (
            <div className={`rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl ${activeTab === "pages" ? "md:col-span-2" : ""}`}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Main Website Pages</h2>
                    <p className="text-[11px] text-white/50">
                      {filteredPages.length} {searchQuery ? "matching" : "indexed"} landing pages
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  Priority 0.9 – 1.0
                </span>
              </div>

              <ul className="mt-4 divide-y divide-white/5 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPages.length === 0 ? (
                  <li className="py-8 text-center text-xs text-white/40">
                    No pages matching "{searchQuery}"
                  </li>
                ) : (
                  filteredPages.map((p) => {
                    const cleanSlug = p.slug === "/" || p.isHome ? "" : p.slug.replace(/^\/+/, "");
                    const fullHref = cleanSlug ? `/${cleanSlug}` : "/";
                    const fullUrl = cleanSlug ? `${domain}/${cleanSlug}` : `${domain}/`;

                    return (
                      <li key={p.id} className="py-3 group">
                        <div className="flex items-center justify-between gap-3">
                          <a
                            href={fullHref}
                            className="flex-1 min-w-0"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                                {p.title}
                              </span>
                              {p.isHome && (
                                <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 shrink-0">
                                  Home
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-xs text-white/40 mt-0.5 truncate group-hover:text-emerald-400/70 transition-colors">
                              {fullUrl}
                            </div>
                          </a>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleCopy(fullUrl)}
                              className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                              title="Copy Full URL"
                            >
                              {copiedUrl === fullUrl ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              Live
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}

          {/* 2. Blog Articles & Strategy Guides Section */}
          {(activeTab === "all" || activeTab === "posts") && (
            <div className={`rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl ${activeTab === "posts" ? "md:col-span-2" : ""}`}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Strategy Guides & Blog Posts</h2>
                    <p className="text-[11px] text-white/50">
                      {filteredPosts.length} {searchQuery ? "matching" : "published"} articles
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                  Priority 0.8
                </span>
              </div>

              <ul className="mt-4 divide-y divide-white/5 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPosts.length === 0 ? (
                  <li className="py-8 text-center text-xs text-white/40">
                    No articles matching "{searchQuery}"
                  </li>
                ) : (
                  filteredPosts.map((post) => {
                    const cleanPostSlug = (post.slug || "").replace(/^\/+|\/+$/g, "").replace(/^blogs?\//, "");
                    const fullHref = `/blog/${cleanPostSlug}`;
                    const fullUrl = `${domain}/blog/${cleanPostSlug}`;

                    return (
                      <li key={post.id} className="py-3 group">
                        <div className="flex items-center justify-between gap-3">
                          <a
                            href={fullHref}
                            className="flex-1 min-w-0"
                          >
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                                {post.title}
                              </span>
                              <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                                {post.category || "Guide"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-white/40 font-mono">
                              <span className="truncate max-w-[280px] group-hover:text-amber-400/70 transition-colors">
                                {fullUrl}
                              </span>
                              <span className="shrink-0 font-sans text-white/30 text-[10px] ml-2">
                                {post.date}
                              </span>
                            </div>
                          </a>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleCopy(fullUrl)}
                              className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                              title="Copy Post URL"
                            >
                              {copiedUrl === fullUrl ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>

        {/* AI & Search Engine Crawl Status Banner */}
        <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">Search Engine & AI Web Crawler Indexing Verified</span>
                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    Active
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/60 max-w-2xl leading-relaxed">
                  Every page and post emits RFC-compliant schema metadata, OpenGraph tags, and canonical references rooted at <strong className="text-emerald-300">https://teenpattistars.me</strong>. Googlebot, Bingbot, GPTBot, ClaudeBot, and PerplexityBot are permitted with zero cloaking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f5c242] to-[#e6a817] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
              >
                <span>Inspect XML</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

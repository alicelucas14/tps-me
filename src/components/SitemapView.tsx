import { BookOpen, FileText, Globe, ArrowLeft, ExternalLink, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { useSiteStore } from "../store/siteStore";

export function SitemapView({ onBack }: { onBack: () => void }) {
  const { publishedConfig, draftConfig } = useSiteStore();
  const pages = publishedConfig.pages?.length ? publishedConfig.pages : (draftConfig.pages || []);
  const posts = publishedConfig.posts?.length ? publishedConfig.posts : (draftConfig.posts || []);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-300">
              <Globe className="h-3.5 w-3.5" />
              SEO & AI Index Directory
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Website <span className="gradient-text-gold">Sitemap</span>
            </h1>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Complete index of all live pages, strategy guides, tournament recaps, and AI crawler documentation files.
            </p>
          </div>

          {/* Direct Raw File Links */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>sitemap.xml</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>robots.txt</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>llms.txt (AI)</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          
          {/* 1. Core Pages Section */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Main Website Pages</h2>
                <p className="text-[11px] text-white/50">{pages.length} indexed landing pages</p>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-white/5">
              {pages.map((p) => (
                <li key={p.id} className="py-3">
                  <a
                    href={p.slug === "/" || p.isHome ? "/" : `/${p.slug.replace(/^\/+/, "")}`}
                    className="group flex items-center justify-between hover:text-emerald-300"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {p.title}
                        </span>
                        {p.isHome && (
                          <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                            Front Page
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-white/40 mt-0.5">
                        https://teenpattistars.me/{p.slug === "/" || p.isHome ? "" : p.slug.replace(/^\/+/, "")}
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Indexed
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Blog Articles & Strategy Guides Section */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Strategy Guides & Blog Posts</h2>
                <p className="text-[11px] text-white/50">{posts.length} published articles</p>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-white/5">
              {posts.map((post) => (
                <li key={post.id} className="py-3">
                  <a
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col justify-between hover:text-emerald-300 gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {post.title}
                      </span>
                      <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <span className="font-mono truncate max-w-[280px]">
                        https://teenpattistars.me/blog/{post.slug}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI & Search Engine Crawl Status Banner */}
        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">AI Search Engine & Crawler Optimization Active</div>
                <p className="text-xs text-white/60">
                  Dynamic JSON-LD schemas (WebSite, Organization, FAQPage, MobileApplication, BlogPosting) are automatically emitted for all pages and posts.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check,
  Crown,
  Download,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  FolderOpen,
  MessageCircle,
} from "lucide-react";
import { useSiteStore, type PostConfig } from "../store/siteStore";
import { MarkdownRenderer } from "./MarkdownRenderer";

const POSTS_PER_PAGE = 12;

export function BlogView({
  activeSlug,
  onBack,
  onNavigatePost,
}: {
  activeSlug?: string;
  onBack: () => void;
  onNavigatePost?: (slug: string) => void;
}) {
  const { publishedConfig, draftConfig } = useSiteStore();
  const allPosts = publishedConfig.posts?.length ? publishedConfig.posts : (draftConfig.posts || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  const activePost = activeSlug
    ? allPosts.find((p) => p.slug === activeSlug || p.id === activeSlug)
    : null;

  // Extract all categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allPosts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [allPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result = allPosts;

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          (p.content && p.content.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allPosts, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, page]);

  if (activePost) {
    return (
      <SinglePostView
        post={activePost}
        allPosts={allPosts}
        onBack={onBack}
        onNavigatePost={onNavigatePost}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          onBack();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            <BookOpen className="h-3.5 w-3.5" />
            Official Strategy, News & Guides
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Teen Patti <span className="gradient-text-gold">Chronicles</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60">
            Explore {allPosts.length} in-depth strategy guides, winning hand breakdowns, high-stakes tournament recaps, and game updates.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-4">
          <div className="mx-auto max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={`Search across ${allPosts.length} articles and guides...`}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 backdrop-blur-xl transition-all focus:border-emerald-400/60 focus:bg-white/[0.05] focus:outline-none shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-bold text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between text-xs text-white/50 border-b border-white/5 pb-3">
          <div>
            Showing <span className="font-semibold text-white">{filteredPosts.length}</span> articles
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </div>
          <div>
            Page {page} of {totalPages}
          </div>
        </div>

        {/* Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/[0.04] shadow-lg"
              >
                {post.coverImage && (
                  <div className="relative h-44 w-full overflow-hidden bg-black/40 border-b border-white/10">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06090c] via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                      {post.category || "Strategy"}
                    </span>
                    <span className="text-xs text-white/40">{post.readTime || "3 min"}</span>
                  </div>

                  <h2 className="mt-4 text-lg font-bold leading-snug text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-auto px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5 text-xs text-white/40">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20 font-bold text-emerald-300 text-[10px]">
                      {(post.author || "T")[0]}
                    </div>
                    <span className="truncate max-w-[120px] text-white/80">{post.author || "Team"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-white/30" />
            <h3 className="mt-3 text-base font-bold text-white">No articles matched your search</h3>
            <p className="mt-1 text-xs text-white/50">Try searching for different keywords or resetting filters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && page > 3) {
                  pageNum = page - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                }
                if (pageNum <= 0 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold transition-colors ${
                      page === pageNum
                        ? "bg-emerald-500 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 disabled:opacity-30"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SinglePostView({
  post,
  allPosts,
  onBack,
  onNavigatePost,
  onSelectCategory,
}: {
  post: PostConfig;
  allPosts: PostConfig[];
  onBack: () => void;
  onNavigatePost?: (slug: string) => void;
  onSelectCategory?: (category: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  // Filter 4 related posts (prefer matching category)
  const relatedPosts = useMemo(() => {
    const others = allPosts.filter((p) => p.slug !== post.slug && p.id !== post.id);
    const inSameCat = others.filter((p) => p.category === post.category);
    const rest = others.filter((p) => p.category !== post.category);
    return [...inSameCat, ...rest].slice(0, 4);
  }, [allPosts, post]);

  // Categories with counts
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    allPosts.forEach((p) => {
      const cat = p.category || "General";
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [allPosts]);

  // Adjacent posts for bottom pager
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug || p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Read "${post.title}" on Teen Patti Stars:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${post.title}*\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <article className="min-h-screen pt-28 pb-20 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Breadcrumbs & Back Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Articles</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="h-3 w-3" />
            <a href="/blog" className="hover:text-white transition-colors">Blog & Chronicles</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-emerald-400">{post.category || "Strategy"}</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Post Content + Rich Sticky Sidebar */}
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px]">
          {/* Main Article Content */}
          <div className="min-w-0 space-y-8">
            <div>
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {post.category || "Strategy Guide"}
                </span>
                <span className="text-xs text-white/50">{post.readTime || "4 min read"}</span>
                <span className="text-xs text-white/30">·</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                  <Calendar className="h-3 w-3 text-white/40" />
                  {post.date}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:leading-[1.15]">
                {post.title}
              </h1>

              {/* Excerpt Lead */}
              {post.excerpt && (
                <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Verification Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 font-bold text-white text-sm shadow-md">
                    {(post.author || "T")[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <span>{post.author || "Teen Patti Editorial Team"}</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-white/50">Verified Strategy Contributor</div>
                  </div>
                </div>

                {/* Inline Quick Share Icons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-all"
                    title="Copy Link"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    title="Share to WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleShareTwitter}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                    title="Share to X"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.coverImage && (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-[500px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Markdown Body */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.015] p-6 md:p-8 backdrop-blur-sm">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Article End Share Bar */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                <span>Found this strategy helpful? Share it with your table crew:</span>
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-all"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "Link Copied to Clipboard!" : "Copy Article Link"}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share on X</span>
                </button>
              </div>
            </div>

            {/* Prev / Next Article Navigation Cards */}
            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              {prevPost ? (
                <a
                  href={`/blog/${prevPost.slug}`}
                  onClick={(e) => {
                    if (onNavigatePost) {
                      e.preventDefault();
                      onNavigatePost(prevPost.slug);
                    }
                  }}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-emerald-500/40 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous Article</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {prevPost.title}
                  </div>
                </a>
              ) : <div />}

              {nextPost ? (
                <a
                  href={`/blog/${nextPost.slug}`}
                  onClick={(e) => {
                    if (onNavigatePost) {
                      e.preventDefault();
                      onNavigatePost(nextPost.slug);
                    }
                  }}
                  className="group flex flex-col justify-between text-right rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-emerald-500/40 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    <span>Next Article</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {nextPost.title}
                  </div>
                </a>
              ) : <div />}
            </div>
          </div>

          {/* RIGHT SIDEBAR (STICKY ON DESKTOP) */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Widget 1: Real Money Game CTA Card */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/90 via-[#061811] to-[#04080a] p-6 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-md">
                    <Crown className="h-5 w-5 text-[#f5c242]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Diwali Mega Edition
                    </span>
                    <h3 className="text-base font-bold text-white">
                      Play Real Teen Patti
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-white/70">
                  Join 50 lakh+ verified card players on India's most refined table platform. Instant 30-second UPI payouts.
                </p>

                <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Welcome Bonus
                  </span>
                  <div className="text-lg font-black text-white">
                    Get ₹500 Free Chips
                  </div>
                </div>

                <a
                  href="#download"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd96b] via-[#f5c242] to-[#c98a1a] py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download App Free</span>
                </a>

                <div className="mt-4 space-y-1.5 text-[11px] text-white/60">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Instant UPI & IMPS in 28s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>iTech Labs RNG Certified · 0 Bots</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Trending & Related Articles */}
            <div className="rounded-3xl border border-white/10 bg-[#080d10] p-5 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Trending Articles
                </h4>
              </div>

              <div className="space-y-3">
                {relatedPosts.map((rPost) => (
                  <a
                    key={rPost.id}
                    href={`/blog/${rPost.slug}`}
                    onClick={(e) => {
                      if (onNavigatePost) {
                        e.preventDefault();
                        onNavigatePost(rPost.slug);
                      }
                    }}
                    className="group flex items-start gap-3 rounded-xl p-2 transition-all hover:bg-white/5"
                  >
                    {rPost.coverImage && (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/40 border border-white/10">
                        <img
                          src={rPost.coverImage}
                          alt={rPost.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        {rPost.category || "Strategy"}
                      </span>
                      <h5 className="text-xs font-semibold text-white/90 group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                        {rPost.title}
                      </h5>
                      <span className="text-[10px] text-white/40 mt-1 block">
                        {rPost.date}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Widget 3: Popular Categories */}
            <div className="rounded-3xl border border-white/10 bg-[#080d10] p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <FolderOpen className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Explore Topics
                </h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categoryCounts.map(([cat, count]) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(cat);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
                  >
                    <span>{cat}</span>
                    <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[9px] font-bold text-white/50">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 4: Trust & Compliance Badges */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-4 text-center space-y-2 text-[11px] text-white/40">
              <div className="flex items-center justify-center gap-2 font-semibold text-white/60">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>100% Fair Play Guaranteed</span>
              </div>
              <p>
                Real-money gaming restricted to 18+ users. Compliant with IT rules and state-level skill game standards.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

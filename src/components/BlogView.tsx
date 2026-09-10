import { useState, useMemo } from "react";
import { ArrowLeft, Calendar, BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteStore, type PostConfig } from "../store/siteStore";
import { MarkdownRenderer } from "./MarkdownRenderer";

const POSTS_PER_PAGE = 12;

export function BlogView({ activeSlug, onBack }: { activeSlug?: string; onBack: () => void }) {
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
    return <SinglePostView post={activePost} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
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
                href={`/#/blog/${post.slug}`}
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

function SinglePostView({ post, onBack }: { post: PostConfig; onBack: () => void }) {
  return (
    <article className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Articles</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            {post.category || "Strategy"}
          </span>
          <span className="text-xs text-white/50">{post.readTime || "3 min read"}</span>
          <span className="text-xs text-white/50">·</span>
          <span className="text-xs text-white/50">{post.date}</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          {post.title}
        </h1>

        {post.coverImage && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full max-h-[460px] object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 font-bold text-white text-sm">
            {(post.author || "T")[0]}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{post.author || "Teen Patti Strategy Team"}</div>
            <div className="text-xs text-white/50">Published on Teen Patti Stars Official Blog</div>
          </div>
        </div>

        <div className="mt-8">
          <MarkdownRenderer content={post.content} />
        </div>
      </div>
    </article>
  );
}

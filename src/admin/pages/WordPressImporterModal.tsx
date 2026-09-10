import { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Code,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Layers,
  Check,
  RotateCcw,
  Globe,
  BookOpen,
} from "lucide-react";
import {
  parseWordPressXml,
  fetchWordPressPostByUrl,
  parseRawHtmlPost,
  type ParsedWordPressPost,
} from "../../utils/wordpressParser";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";
import { useSiteStore } from "../../store/siteStore";

interface WordPressImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: "posts" | "pages";
  onImportComplete?: () => void;
}

type ImportSource = "xml" | "url" | "html";
type ImportDestination = "posts" | "pages";

export function WordPressImporterModal({
  isOpen,
  onClose,
  defaultDestination = "posts",
  onImportComplete,
}: WordPressImporterModalProps) {
  const { draftConfig, createPost, batchCreatePosts, createCustomPage, batchCreatePages } = useSiteStore();

  // Mode & source state
  const [source, setSource] = useState<ImportSource>("xml");
  const [destination, setDestination] = useState<ImportDestination>(defaultDestination);
  const [xmlContent, setXmlContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [htmlTitle, setHtmlTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsed items queue
  const [parsedPosts, setParsedPosts] = useState<ParsedWordPressPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Step-by-step editing state for active post in queue
  const [activeTitle, setActiveTitle] = useState("");
  const [activeSlug, setActiveSlug] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeAuthor, setActiveAuthor] = useState("");
  const [activeCoverImage, setActiveCoverImage] = useState("");
  const [activeExcerpt, setActiveExcerpt] = useState("");
  const [activeMarkdown, setActiveMarkdown] = useState("");
  const [activeStatus, setActiveStatus] = useState<"published" | "draft">("published");

  // Track import results per item index (imported | skipped | pending)
  const [importStatus, setImportStatus] = useState<Record<number, "imported" | "skipped">>({});
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const loadPostAtIndex = (idx: number, postsList: ParsedWordPressPost[]) => {
    if (idx < 0 || idx >= postsList.length) return;
    const p = postsList[idx];
    setCurrentIndex(idx);
    setActiveTitle(p.title);
    setActiveSlug(p.slug);
    setActiveCategory(p.category);
    setActiveAuthor(p.author);
    setActiveCoverImage(p.coverImage || "");
    setActiveExcerpt(p.excerpt);
    setActiveMarkdown(p.content);
    setActiveStatus(p.status || "published");
  };

  // Handle XML File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setXmlContent(content);
      handleParseXml(content);
    };
    reader.readAsText(file);
  };

  // Parse XML String
  const handleParseXml = (xmlStr?: string) => {
    const str = xmlStr || xmlContent;
    if (!str.trim()) {
      setError("Please select a WordPress XML export file or paste the XML content.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = parseWordPressXml(str);
      if (items.length === 0) {
        setError("No valid posts or pages found in this WordPress XML export.");
        setIsLoading(false);
        return;
      }

      // Detect if mostly pages or posts
      const pageCount = items.filter((i) => i.wpType === "page").length;
      if (pageCount > items.length / 2 && defaultDestination !== "posts") {
        setDestination("pages");
      }

      setParsedPosts(items);
      setImportStatus({});
      loadPostAtIndex(0, items);
    } catch (err: any) {
      setError(err.message || "Failed to parse WordPress XML.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch WP REST API URL
  const handleFetchUrl = async () => {
    if (!urlInput.trim()) {
      setError("Please provide a WordPress post URL or REST API endpoint.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = await fetchWordPressPostByUrl(urlInput);
      if (items.length === 0) {
        setError("No items returned from this WordPress URL.");
        setIsLoading(false);
        return;
      }
      setParsedPosts(items);
      setImportStatus({});
      loadPostAtIndex(0, items);
    } catch (err: any) {
      setError(err.message || "Failed to fetch from WordPress URL.");
    } finally {
      setIsLoading(false);
    }
  };

  // Parse Raw HTML
  const handleParseHtml = () => {
    if (!htmlContent.trim()) {
      setError("Please paste the WordPress HTML/Gutenberg block content.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const post = parseRawHtmlPost(htmlTitle, htmlContent);
      setParsedPosts([post]);
      setImportStatus({});
      loadPostAtIndex(0, [post]);
    } catch (err: any) {
      setError(err.message || "Failed to parse HTML.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step-by-Step Import: Save Current Active Item & Advance
  const handleImportCurrentStep = () => {
    if (!parsedPosts[currentIndex]) return;

    if (destination === "pages") {
      // Create as custom page
      createCustomPage(
        activeTitle,
        activeSlug.startsWith("/") ? activeSlug : `/${activeSlug}`,
        activeMarkdown,
        activeExcerpt
      );
    } else {
      // Create as blog post
      createPost({
        title: activeTitle,
        slug: activeSlug.replace(/^\//, ""),
        excerpt: activeExcerpt,
        content: activeMarkdown,
        author: activeAuthor,
        date: new Date().toISOString().split("T")[0],
        category: activeCategory,
        readTime: `${Math.max(1, Math.ceil(activeMarkdown.split(/\s+/).length / 200))} min read`,
        coverColor: "from-amber-500/20 to-emerald-500/20",
        coverImage: activeCoverImage || undefined,
        badge: "WP Import",
        status: activeStatus,
      });
    }

    setImportStatus((prev) => ({ ...prev, [currentIndex]: "imported" }));

    // Advance to next item if available
    if (currentIndex + 1 < parsedPosts.length) {
      loadPostAtIndex(currentIndex + 1, parsedPosts);
    }
  };

  // Skip Current Item & Advance
  const handleSkipCurrentStep = () => {
    setImportStatus((prev) => ({ ...prev, [currentIndex]: "skipped" }));
    if (currentIndex + 1 < parsedPosts.length) {
      loadPostAtIndex(currentIndex + 1, parsedPosts);
    }
  };

  // Batch Import All Remaining Items
  const handleBatchImportAll = () => {
    const unimported = parsedPosts.filter((_, idx) => !importStatus[idx]);
    if (unimported.length === 0) return;

    if (destination === "pages") {
      batchCreatePages(
        unimported.map((p) => ({
          title: p.title,
          slug: p.slug,
          content: p.content,
          excerpt: p.excerpt,
        }))
      );
    } else {
      batchCreatePosts(
        unimported.map((p) => ({
          title: p.title,
          slug: p.slug.replace(/^\//, ""),
          excerpt: p.excerpt,
          content: p.content,
          author: p.author,
          date: p.date || new Date().toISOString().split("T")[0],
          category: p.category,
          readTime: p.readTime,
          coverColor: "from-amber-500/20 to-emerald-500/20",
          coverImage: p.coverImage || undefined,
          badge: "WP Batch Import",
          status: p.status,
        }))
      );
    }

    const updatedStatus = { ...importStatus };
    parsedPosts.forEach((_, idx) => {
      updatedStatus[idx] = "imported";
    });
    setImportStatus(updatedStatus);
  };

  const importedCount = Object.values(importStatus).filter((s) => s === "imported").length;
  const skippedCount = Object.values(importStatus).filter((s) => s === "skipped").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#070b0e] shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 text-white shadow-lg">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">WordPress Step-by-Step Importer</h2>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  Pages & Posts XML · REST API · HTML
                </span>
              </div>
              <p className="text-xs text-white/50">
                Import pages and articles from your previous WordPress website with HTML-to-Markdown conversion.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (importedCount > 0 && onImportComplete) onImportComplete();
              onClose();
            }}
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* STAGE 1: Source Input (Shown when no items parsed yet) */}
          {parsedPosts.length === 0 ? (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Destination Selector: Posts vs Pages */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-4">
                <div>
                  <div className="text-xs font-bold text-amber-300">Import Destination</div>
                  <p className="text-[11px] text-white/50">
                    Select whether to import content as Blog Articles or as Standalone Website Pages.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDestination("posts")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      destination === "posts"
                        ? "bg-amber-400 text-black font-bold shadow"
                        : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Blog Posts (Articles)</span>
                  </button>

                  <button
                    onClick={() => setDestination("pages")}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      destination === "pages"
                        ? "bg-emerald-400 text-black font-bold shadow"
                        : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Website Pages (Landing / Legal)</span>
                  </button>
                </div>
              </div>

              {/* Source Mode Tabs */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5">
                {[
                  { id: "xml", label: "WordPress XML Export (.xml)", icon: FileText },
                  { id: "url", label: "Live WordPress URL / API", icon: LinkIcon },
                  { id: "html", label: "Paste Raw HTML / Blocks", icon: Code },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSource(t.id as ImportSource);
                        setError(null);
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                        source === t.id
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: XML UPLOAD */}
              {source === "xml" && (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/[0.03] p-8 text-center transition-all hover:border-emerald-400 hover:bg-emerald-500/[0.06] cursor-pointer"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-300">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="mt-3 text-sm font-bold text-white">
                      Click to choose your WordPress Export XML file ({destination === "pages" ? "Pages" : "Posts"})
                    </div>
                    <p className="mt-1 text-xs text-white/50 max-w-sm">
                      Generated from WordPress Dashboard $\rightarrow$ Tools $\rightarrow$ Export $\rightarrow$ {destination === "pages" ? "Pages" : "Posts"}
                    </p>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <span className="bg-[#070b0e] px-4 text-xs font-semibold uppercase text-white/30">
                      Or paste raw XML text
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={xmlContent}
                    onChange={(e) => setXmlContent(e.target.value)}
                    placeholder="Paste <rss version='2.0' ...><channel><item>...</item></channel></rss> here..."
                    className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleParseXml()}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{isLoading ? "Parsing Content..." : `Parse XML & Import as ${destination === "pages" ? "Pages" : "Posts"}`}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: URL / REST API */}
              {source === "url" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                    <label className="text-xs font-semibold text-white">
                      WordPress URL or WP REST API Endpoint
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/privacy-policy/ or https://example.com/wp-json/wp/v2/pages"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                    <p className="text-[11px] text-white/50">
                      Fetches directly from WordPress public REST API (`/wp-json/wp/v2/posts` or `/wp-json/wp/v2/pages`).
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleFetchUrl}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>{isLoading ? "Fetching Content..." : "Fetch from WordPress"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: RAW HTML */}
              {source === "html" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-white">Title</label>
                      <input
                        type="text"
                        value={htmlTitle}
                        onChange={(e) => setHtmlTitle(e.target.value)}
                        placeholder="e.g. Terms of Service or Teen Patti Master Guide"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white">WordPress HTML / Gutenberg Blocks</label>
                      <textarea
                        rows={8}
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        placeholder="<!-- wp:paragraph --><p>Paste raw WordPress content here...</p><!-- /wp:paragraph -->"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleParseHtml}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Convert to Markdown & Review</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-300">
                  {error}
                </div>
              )}
            </div>
          ) : (
            /* STAGE 2: Step-by-Step Review & Import Queue */
            <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
              
              {/* LEFT SIDEBAR: Item Queue List */}
              <div className="w-full md:w-72 border-r border-white/10 bg-black/30 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">
                      Queue ({parsedPosts.length} {destination === "pages" ? "pages" : "posts"})
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      {importedCount} imported · {skippedCount} skipped
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setParsedPosts([]);
                      setImportStatus({});
                    }}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] text-white/60 hover:bg-white/10"
                    title="Load another file or URL"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                  {parsedPosts.map((p, idx) => {
                    const status = importStatus[idx];
                    const isSelected = idx === currentIndex;
                    const existsAlready = destination === "pages"
                      ? (draftConfig.pages || []).some((dp) => dp.slug === (p.slug.startsWith("/") ? p.slug : `/${p.slug}`) || dp.title.toLowerCase() === p.title.toLowerCase())
                      : (draftConfig.posts || []).some((dp) => dp.slug === p.slug.replace(/^\//, "") || dp.title.toLowerCase() === p.title.toLowerCase());

                    return (
                      <button
                        key={idx}
                        onClick={() => loadPostAtIndex(idx, parsedPosts)}
                        className={`w-full text-left p-3.5 transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-emerald-500/15 border-l-2 border-emerald-400"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="mt-0.5">
                          {status === "imported" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : status === "skipped" ? (
                            <div className="grid h-4 w-4 place-items-center rounded-full bg-white/10 text-[9px] font-bold text-white/40">
                              -
                            </div>
                          ) : (
                            <div className="grid h-4 w-4 place-items-center rounded-full bg-amber-400/20 text-[9px] font-bold text-amber-300">
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold truncate ${isSelected ? "text-white" : "text-white/70"}`}>
                            {p.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                            <span className="truncate max-w-[100px]">{p.slug}</span>
                            <span>·</span>
                            {existsAlready ? (
                              <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                                Updates Existing
                              </span>
                            ) : (
                              <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Destination Toggle & Batch Import Button */}
                <div className="p-3 border-t border-white/10 bg-white/[0.01] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-white/60">
                    <span>Target:</span>
                    <span className="font-bold text-amber-300 uppercase">
                      {destination === "pages" ? "Website Page" : "Blog Post"}
                    </span>
                  </div>
                  <button
                    onClick={handleBatchImportAll}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20 active:scale-95 transition-all"
                  >
                    <Layers className="h-3.5 w-3.5 text-amber-300" />
                    <span>Batch Import All ({parsedPosts.length - importedCount})</span>
                  </button>
                </div>
              </div>

              {/* RIGHT MAIN: Step-by-Step Interactive Editor */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#06090c]">
                
                {/* Step Navigation Bar */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-300">
                      {destination === "pages" ? "Page" : "Post"} {currentIndex + 1} of {parsedPosts.length}
                    </span>
                    {importStatus[currentIndex] === "imported" && (
                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Already Imported
                      </span>
                    )}
                    {importStatus[currentIndex] === "skipped" && (
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/50">
                        Skipped
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                        showPreview
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {showPreview ? "Edit Markdown" : "Live Preview"}
                    </button>
                    
                    <button
                      disabled={currentIndex === 0}
                      onClick={() => loadPostAtIndex(currentIndex - 1, parsedPosts)}
                      className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:bg-white/5 disabled:opacity-30"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      disabled={currentIndex >= parsedPosts.length - 1}
                      onClick={() => loadPostAtIndex(currentIndex + 1, parsedPosts)}
                      className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:bg-white/5 disabled:opacity-30"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Fields & Markdown Editor */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-medium text-white/60">Title</label>
                      <input
                        type="text"
                        value={activeTitle}
                        onChange={(e) => setActiveTitle(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-white/60">Slug (URL)</label>
                      <input
                        type="text"
                        value={activeSlug}
                        onChange={(e) => setActiveSlug(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] font-medium text-white/60">Category / Type</label>
                      <input
                        type="text"
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-white/60">Author</label>
                      <input
                        type="text"
                        value={activeAuthor}
                        onChange={(e) => setActiveAuthor(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-white/60">Destination</label>
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value as ImportDestination)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="posts">Blog Post (Archive & Guide)</option>
                        <option value="pages">Website Page (Landing / Policy)</option>
                      </select>
                    </div>
                  </div>

                  {destination === "posts" && (
                    <div>
                      <label className="text-[11px] font-medium text-white/60">Cover / Featured Image URL</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="url"
                          value={activeCoverImage}
                          onChange={(e) => setActiveCoverImage(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none"
                        />
                        {activeCoverImage && (
                          <div className="h-9 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                            <img
                              src={activeCoverImage}
                              alt="Cover"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-medium text-white/60">Short Summary / Excerpt</label>
                    <textarea
                      rows={2}
                      value={activeExcerpt}
                      onChange={(e) => setActiveExcerpt(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  {/* Body Content Editor / Preview */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium text-white/60">
                        {showPreview ? "Live Formatted Preview" : "Converted Markdown Content (Editable)"}
                      </label>
                      <span className="text-[10px] text-emerald-300">
                        HTML automatically converted to clean Markdown
                      </span>
                    </div>

                    {showPreview ? (
                      <div className="mt-1 min-h-[220px] max-h-[360px] overflow-y-auto rounded-xl border border-white/10 bg-black/60 p-5">
                        <MarkdownRenderer content={activeMarkdown} />
                      </div>
                    ) : (
                      <textarea
                        rows={9}
                        value={activeMarkdown}
                        onChange={(e) => setActiveMarkdown(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs leading-relaxed text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                {/* Footer Controls for Step-by-Step Action */}
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/[0.02]">
                  <div className="text-xs text-white/50">
                    {importedCount} of {parsedPosts.length} imported
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSkipCurrentStep}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/60 hover:bg-white/5 hover:text-white"
                    >
                      Skip Item
                    </button>

                    <button
                      onClick={handleImportCurrentStep}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95"
                    >
                      <Check className="h-4 w-4" />
                      <span>
                        {currentIndex + 1 === parsedPosts.length
                          ? `Import & Finish (${destination === "pages" ? "Page" : "Post"})`
                          : `Import as ${destination === "pages" ? "Page" : "Post"} & Next →`}
                      </span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

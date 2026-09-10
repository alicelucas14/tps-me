import { useState, useRef } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  User,
  Eye,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Columns,
  Check,
  X,
  Upload,
} from "lucide-react";
import { useSiteStore, type PostConfig } from "../../store/siteStore";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";
import { WordPressImporterModal } from "./WordPressImporterModal";

const PRESET_IMAGES = [
  {
    label: "Teen Patti Golden Table",
    url: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "High-Roller Poker Chips",
    url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "VIP Luxury Cards",
    url: "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Mobile Instant Banking & UPI",
    url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Championship Trophy Gala",
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
  },
];

const PRESET_BACKLINKS = [
  { label: "Home Page (Front Page)", url: "/" },
  { label: "How to Play Guide (Rules & Hands)", url: "/#/how-to-play" },
  { label: "VIP Club & Cashback Rewards", url: "/#/vip-club" },
  { label: "Blog & Chronicles Archive", url: "/#/blog" },
  { label: "Instant App Download", url: "/#download" },
];

export function PostsManager() {
  const { draftConfig, createPost, updatePost, deletePost } = useSiteStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWpImportModal, setShowWpImportModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Post form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("Teen Patti Strategy Team");
  const [category, setCategory] = useState("Strategy Guide");
  const [readTime, setReadTime] = useState("3 min read");
  const [badge, setBadge] = useState("New");

  // Editor View Mode: split | editor | preview
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [showMeta, setShowMeta] = useState(true);

  // Sub-dialog modals for inserting Images & Links
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Sub-dialog fields
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openCreateModal = () => {
    setEditingPostId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent(
      `Teen Patti is fundamentally a game of mathematical discipline, psychological observation, and bankroll management.\n\n` +
      `![Teen Patti High Roller Table](https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80)\n\n` +
      `### 1. Bankroll Management & Odds\n` +
      `Never risk more than 5% of your total session bankroll on a single hand. Set hard session loss limits and lock in winnings before table dynamics shift.\n\n` +
      `### 2. Learn the Official Rules\n` +
      `Before playing with real money, make sure you understand hand hierarchies and variations by reading our [Official How to Play Guide](/#/how-to-play).\n\n` +
      `### 3. Unlock VIP Cashback\n` +
      `High-volume card players can also earn up to 10% daily rakeback through the [Teen Patti VIP Club](/#/vip-club).`
    );
    setCoverImage("https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80");
    setAuthor("Teen Patti Strategy Team");
    setCategory("Strategy Guide");
    setReadTime("4 min read");
    setBadge("New");
    setShowAddModal(true);
  };

  const openEditModal = (post: PostConfig) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage || "");
    setAuthor(post.author);
    setCategory(post.category);
    setReadTime(post.readTime);
    setBadge(post.badge);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (editingPostId) {
      updatePost(editingPostId, {
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage,
        author,
        category,
        readTime,
        badge,
      });
    } else {
      createPost({
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage,
        author,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        category,
        readTime,
        coverColor: "from-emerald-600 to-teal-900",
        badge,
        status: "published",
      });
    }

    setShowAddModal(false);
  };

  // Helper to insert snippet at cursor in textarea
  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + before + placeholder + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousContent = textarea.value;
    const selectedText = previousContent.substring(start, end) || placeholder;

    const updated =
      previousContent.substring(0, start) +
      before +
      selectedText +
      after +
      previousContent.substring(end);

    setContent(updated);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleInsertImage = () => {
    if (!imgUrl) return;
    const alt = imgAlt.trim() || "Illustration";
    insertText(`\n\n![${alt}](${imgUrl})\n\n`);
    setShowImageModal(false);
    setImgUrl("");
    setImgAlt("");
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    const text = linkText.trim() || "Read more";
    insertText(`[${text}](${linkUrl})`);
    setShowLinkModal(false);
    setLinkText("");
    setLinkUrl("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Blog Posts & Guides</h2>
          <p className="text-xs text-white/50">
            Publish strategy articles, tournament announcements, rich media, and SEO backlinks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowWpImportModal(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 shadow transition-all hover:bg-emerald-500/20 active:scale-95"
          >
            <Upload className="h-4 w-4" />
            <span>Import from WordPress</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Write New Post</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {draftConfig.posts.map((post) => (
          <div
            key={post.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all hover:border-emerald-400/30 shadow-lg"
          >
            {post.coverImage && (
              <div className="h-32 w-full overflow-hidden bg-black/40 border-b border-white/10">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-medium text-white/40">
                    {post.readTime}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-emerald-300">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/60">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{post.date}</span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-4 pt-1 flex items-center justify-end gap-1.5 border-t border-white/5">
              <a
                href={`/#/blog/${post.slug}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-xs text-white/50 hover:text-white"
                title="View Post"
              >
                <Eye className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => openEditModal(post)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-500/10"
              >
                <Edit2 className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete post "${post.title}"?`)) deletePost(post.id);
                }}
                className="p-1.5 text-rose-400 hover:text-rose-300"
                title="Delete Post"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EXPANDED PRO WRITER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6 backdrop-blur-md">
          <div className="flex h-[94vh] w-full max-w-6xl flex-col rounded-2xl border border-white/10 bg-[#080d10] shadow-2xl overflow-hidden">
            
            {/* Top Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0c1216] px-6 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-md">
                  <BookOpen className="h-4 w-4 text-[#ffd96b]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingPostId ? "Edit Article & Strategy Guide" : "Write New Article & Strategy Guide"}
                  </h3>
                  <p className="text-[11px] text-white/50">
                    Add rich media images, headings, formatting, and SEO backlinks.
                  </p>
                </div>
              </div>

              {/* View Switcher & Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMeta(!showMeta)}
                  className={`hidden sm:flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    showMeta
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/50 hover:text-white"
                  }`}
                  title="Toggle Post Details (Title, Cover, Author, SEO)"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{showMeta ? "Hide Meta" : "Show Meta"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 p-0.5">
                  <button
                    onClick={() => setViewMode("split")}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      viewMode === "split" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                    }`}
                    title="Side-by-Side Editor and Live Preview"
                  >
                    <Columns className="h-3.5 w-3.5" />
                    <span>Split View</span>
                  </button>
                  <button
                    onClick={() => setViewMode("editor")}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      viewMode === "editor" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Editor Only</span>
                  </button>
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                      viewMode === "preview" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Only</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Post Metadata Controls */}
            {showMeta && (
              <div className="border-b border-white/10 bg-[#0a0f13] px-6 py-3 transition-all shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Post Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Master High-Stakes Teen Patti in 2026"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!editingPostId) {
                          setSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, "")
                          );
                        }
                      }}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#06090c] px-3 py-1.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="Strategy Guide">Strategy Guide</option>
                      <option value="Engineering & Trust">Engineering & Trust</option>
                      <option value="Tournaments">Tournaments</option>
                      <option value="VIP & Rewards">VIP & Rewards</option>
                      <option value="Game Updates">Game Updates</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Author
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Excerpt & Cover Photo row */}
                <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Excerpt / SEO Description
                    </label>
                    <input
                      type="text"
                      placeholder="Brief 1-2 sentence preview for search results and cards..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                        Cover Header Image URL
                      </label>
                      <button
                        onClick={() => setCoverImage(PRESET_IMAGES[0].url)}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        Use Sample Cover
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* RICH TOOLBAR */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 bg-[#06090c] px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mr-2">
                Formatting:
              </span>

              <button
                onClick={() => insertText("# ", "", "Main Heading")}
                className="flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/15 hover:text-white"
                title="Heading 1"
              >
                <Heading1 className="h-3.5 w-3.5 text-emerald-400" />
                <span>H1</span>
              </button>

              <button
                onClick={() => insertText("## ", "", "Subheading")}
                className="flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/15 hover:text-white"
                title="Heading 2"
              >
                <Heading2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>H2</span>
              </button>

              <button
                onClick={() => insertText("### ", "", "Section Title")}
                className="flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/15 hover:text-white"
                title="Heading 3"
              >
                <Heading3 className="h-3.5 w-3.5 text-emerald-400" />
                <span>H3</span>
              </button>

              <div className="h-4 w-px bg-white/10 mx-1" />

              <button
                onClick={() => insertText("**", "**", "bold text")}
                className="rounded bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
                title="Bold Text"
              >
                <Bold className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => insertText("*", "*", "italic text")}
                className="rounded bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
                title="Italic Text"
              >
                <Italic className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => insertText("- ", "", "List item")}
                className="rounded bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
                title="Bullet List"
              >
                <List className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => insertText("1. ", "", "Ordered item")}
                className="rounded bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
                title="Numbered List"
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => insertText("> ", "", "Important quote or tip...")}
                className="rounded bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
                title="Callout Blockquote"
              >
                <Quote className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => insertText("\n```\n", "\n```\n", "code block")}
                className="rounded bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
                title="Code Block"
              >
                <Code className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => insertText("\n\n---\n\n")}
                className="rounded bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
                title="Horizontal Divider"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <div className="h-4 w-px bg-white/10 mx-1" />

              {/* INSERT IMAGE BUTTON */}
              <button
                onClick={() => {
                  setImgUrl(PRESET_IMAGES[0].url);
                  setImgAlt("Teen Patti Card Table");
                  setShowImageModal(true);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/25 active:scale-95"
                title="Insert an Image into the article"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>+ Insert Image</span>
              </button>

              {/* INSERT BACKLINK BUTTON */}
              <button
                onClick={() => {
                  setLinkText("Official How to Play Guide");
                  setLinkUrl("/#/how-to-play");
                  setShowLinkModal(true);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 transition-all hover:bg-amber-500/25 active:scale-95"
                title="Insert a Backlink or Internal Page Link"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>+ Insert Backlink</span>
              </button>
            </div>

            {/* MAIN WORKSPACE: SPLIT SCREEN / EDITOR / PREVIEW */}
            <div className={`flex-1 min-h-0 overflow-hidden ${
              viewMode === "split"
                ? "grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10"
                : "flex flex-col h-full"
            }`}>
              
              {/* Left Pane: Markdown Textarea */}
              {(viewMode === "split" || viewMode === "editor") && (
                <div className="relative flex flex-col h-full min-h-0 bg-[#05080a] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-1.5 text-[11px] text-white/40 shrink-0">
                    <span>Markdown Content Editor</span>
                    <span>{content.length} characters · ~{Math.max(1, Math.ceil(content.split(/\s+/).length / 180))} min read</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write article content using markdown or insert images & links using the toolbar above..."
                    className="flex-1 min-h-0 w-full resize-none bg-transparent p-5 font-mono text-xs leading-relaxed text-white/90 placeholder-white/20 focus:outline-none overflow-y-auto custom-scrollbar"
                  />
                </div>
              )}

              {/* Right Pane: Live Visual Preview */}
              {(viewMode === "split" || viewMode === "preview") && (
                <div className="relative flex flex-col h-full min-h-0 bg-[#090d10] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-1.5 text-[11px] text-emerald-400 font-semibold shrink-0">
                    <span>Live Rendered Preview</span>
                    <span className="text-white/40 text-[10px]">What visitors will see</span>
                  </div>
                  
                  <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {/* Simulated Article Layout */}
                    <div className="mx-auto max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                          {category}
                        </span>
                        <span className="text-[11px] text-white/40">{readTime}</span>
                      </div>

                      <h1 className="mt-3 text-2xl md:text-3xl font-bold leading-tight text-white">
                        {title || "Untitled Article"}
                      </h1>

                      {coverImage && (
                        <div className="my-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
                          <img src={coverImage} alt={title} className="w-full max-h-64 object-cover" />
                        </div>
                      )}

                      <div className="my-4 flex items-center gap-2.5 border-y border-white/10 py-3 text-xs text-white/60">
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/20 font-bold text-emerald-300 text-xs">
                          {author[0] || "A"}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{author}</div>
                          <div className="text-[10px] text-white/40">Teen Patti Stars Chronicles</div>
                        </div>
                      </div>

                      {/* Live Markdown Render Output */}
                      <div className="mt-6 pb-12">
                        <MarkdownRenderer content={content} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#0c1216] px-6 py-3.5">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{editingPostId ? "Save & Update Article" : "Publish Article to Blog"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: INSERT IMAGE */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1014] p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <ImageIcon className="h-5 w-5" />
              <h4 className="text-sm font-bold text-white">Insert Image into Article</h4>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Enter an image URL or choose one of our high-resolution preset photos.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70">Image Web URL (https://...)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Image Caption / Alt Text</label>
                <input
                  type="text"
                  placeholder="e.g. Pro Teen Patti Final Table Chips"
                  value={imgAlt}
                  onChange={(e) => setImgAlt(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Or Select a Quick Royalty-Free Photo:</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setImgUrl(preset.url);
                        setImgAlt(preset.label);
                      }}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-all ${
                        imgUrl === preset.url
                          ? "border-emerald-400 bg-emerald-500/20 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="h-8 w-8 rounded object-cover" />
                      <span className="truncate text-[11px] font-medium">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertImage}
                disabled={!imgUrl}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Insert Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: INSERT BACKLINK */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1014] p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400">
              <LinkIcon className="h-5 w-5" />
              <h4 className="text-sm font-bold text-white">Insert Backlink / Link</h4>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Link directly to other pages on your site or external resources.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70">Anchor Text (Clickable text)</label>
                <input
                  type="text"
                  placeholder="e.g. Read our How to Play Guide"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Target URL / Route</label>
                <input
                  type="text"
                  placeholder="e.g. /#/how-to-play or https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Quick Internal Page Presets:</label>
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {PRESET_BACKLINKS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setLinkUrl(preset.url);
                        if (!linkText) setLinkText(preset.label);
                      }}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                        linkUrl === preset.url
                          ? "border-amber-400 bg-amber-500/20 text-white font-semibold"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span className="font-mono text-[10px] text-white/40">{preset.url}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
              <button
                onClick={() => setShowLinkModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLink}
                disabled={!linkUrl}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Insert Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WordPress Importer Modal */}
      <WordPressImporterModal
        isOpen={showWpImportModal}
        onClose={() => setShowWpImportModal(false)}
      />
    </div>
  );
}

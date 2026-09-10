import { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Eye,
  Upload,
  Search,
  X,
  Edit3,
  Save,
} from "lucide-react";
import { useSiteStore, type PageConfig } from "../../store/siteStore";
import { WordPressImporterModal } from "./WordPressImporterModal";
import { MarkdownEditor } from "../components/MarkdownEditor";

export function PagesManager({ onEditWithBuilder }: { onEditWithBuilder: (pageId: string) => void }) {
  const { draftConfig, createPage, deletePage, updatePageMeta } = useSiteStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWpImportModal, setShowWpImportModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "home" | "custom">("all");

  // Page Editing Modal State
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");

  const filteredPages = useMemo(() => {
    return (draftConfig.pages || []).filter((page) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) {
        if (filterType === "home") return page.isHome;
        if (filterType === "custom") return !page.isHome;
        return true;
      }

      // Title & Slug match
      const matchesTitle = page.title.toLowerCase().includes(q);
      const matchesSlug = page.slug.toLowerCase().includes(q);

      // Explicit custom page sections (if page defines its own section items)
      const matchesSection =
        Array.isArray(page.sections) &&
        page.sections.some(
          (s) =>
            s.label?.toLowerCase().includes(q) ||
            s.type?.toLowerCase().includes(q)
        );

      const matchesSearch = matchesTitle || matchesSlug || matchesSection;

      if (!matchesSearch) return false;

      if (filterType === "home") return page.isHome;
      if (filterType === "custom") return !page.isHome;
      return true;
    });
  }, [draftConfig.pages, searchQuery, filterType]);

  const handleCreate = () => {
    if (!newTitle) return;
    const slug = newSlug || `/${newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const pageId = createPage(newTitle, slug);
    setShowAddModal(false);
    setNewTitle("");
    setNewSlug("");
    onEditWithBuilder(pageId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>All Pages</span>
            <span className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              {draftConfig.pages?.length || 0} total
            </span>
          </h2>
          <p className="text-xs text-white/50">
            Create, search, and manage landing pages, rule guides, and custom marketing layouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowWpImportModal(true)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 shadow transition-all hover:bg-emerald-500/20 active:scale-95"
          >
            <Upload className="h-4 w-4" />
            <span>Import Pages XML</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Page</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR & FILTER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search pages by title, slug, or keyword (e.g. '/terms', 'VIP', 'Guide')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-9 py-2 text-xs text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/50 hover:text-white"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(
            [
              { id: "all", label: "All Pages" },
              { id: "home", label: "Front Page" },
              { id: "custom", label: "Custom Pages" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === item.id
                  ? "bg-emerald-500 text-white shadow"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] uppercase text-white/50">
            <tr>
              <th className="px-5 py-3.5">Page Title</th>
              <th className="px-5 py-3.5">Slug / URL</th>
              <th className="px-5 py-3.5">Sections</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {filteredPages.length > 0 ? (
              filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-white/[0.01]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-400" />
                      <span className="font-semibold text-white">{page.title}</span>
                      {page.isHome && (
                        <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                          Front Page
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-white/60">{page.slug}</td>
                  <td className="px-5 py-4 text-white/70">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
                      {page.sections?.length || 0} blocks
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Published
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/40">{page.createdAt || "2026-01-01"}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingPage(page);
                          setEditTitle(page.title);
                          setEditSlug(page.slug);
                          setEditExcerpt(page.excerpt || "");
                          setEditContent(page.content || "");
                        }}
                        className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                        title="Edit Page Title, Slug, and Text Content"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit Text</span>
                      </button>

                      <button
                        onClick={() => onEditWithBuilder(page.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ffd96b] to-[#c98a1a] px-2.5 py-1 text-[11px] font-bold text-[#1a1205] shadow hover:brightness-110 active:scale-95"
                        title="Edit this page visually in Elementor"
                      >
                        <Layers className="h-3 w-3" />
                        <span>Edit in Elementor</span>
                      </button>

                      <a
                        href={page.slug.startsWith("/") ? page.slug : `/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-white/50 hover:text-white"
                        title="Preview Page"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </a>

                      {!page.isHome && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${page.title}"?`)) deletePage(page.id);
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-300"
                          title="Delete Page"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="mx-auto max-w-sm space-y-2">
                    <FileText className="mx-auto h-8 w-8 text-white/20" />
                    <div className="text-sm font-semibold text-white/80">
                      No matching pages found
                    </div>
                    <p className="text-xs text-white/40">
                      No page titles or URLs match your query "{searchQuery}".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterType("all");
                      }}
                      className="mt-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                    >
                      Clear Search & Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f12] p-6 shadow-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Create New Page</h3>
            </div>
            <p className="mt-1 text-xs text-white/50">
              Provide a title and slug. You'll be able to edit all sections visually with Elementor.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] text-white/60">Page Title</label>
                <input
                  type="text"
                  placeholder="e.g. VIP High Roller Gala"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug || newSlug.startsWith("/")) {
                      setNewSlug(`/${e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. /vip-gala"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Create & Open Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WordPress Importer for Pages */}
      <WordPressImporterModal
        isOpen={showWpImportModal}
        onClose={() => setShowWpImportModal(false)}
        defaultDestination="pages"
      />

      {/* EDIT PAGE CONTENT MODAL */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-white/10 bg-[#0a0f12] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/40">
              <div className="flex items-center gap-2.5">
                <Edit3 className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Edit Page: {editingPage.title}
                  </h3>
                  <p className="text-xs text-white/50">
                    Update page title, URL slug, summary, and full markdown text content.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingPage(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white/70">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">
                  Page Subtitle / Excerpt Lead
                </label>
                <input
                  type="text"
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  placeholder="Short overview sentence..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <MarkdownEditor
                  label="Full Page Markdown Content & Body Text"
                  value={editContent}
                  onChange={setEditContent}
                  rows={12}
                  minHeight="min-h-[260px]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-6 py-3.5">
              <span className="text-xs text-white/40 font-mono">
                Slug: {editSlug}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingPage(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updatePageMeta(editingPage.id, {
                      title: editTitle,
                      slug: editSlug,
                      excerpt: editExcerpt,
                      content: editContent,
                    });
                    setEditingPage(null);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Page Content</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

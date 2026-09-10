import { useState } from "react";
import { FileText, Plus, Trash2, Sparkles, Layers, Eye, Upload } from "lucide-react";
import { useSiteStore } from "../../store/siteStore";
import { WordPressImporterModal } from "./WordPressImporterModal";

export function PagesManager({ onEditWithBuilder }: { onEditWithBuilder: (pageId: string) => void }) {
  const { draftConfig, createPage, deletePage } = useSiteStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWpImportModal, setShowWpImportModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

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
          <h2 className="text-xl font-bold text-white">All Pages</h2>
          <p className="text-xs text-white/50">
            Create and manage landing pages, rule guides, and custom marketing layouts.
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
            {draftConfig.pages.map((page) => (
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
                      onClick={() => onEditWithBuilder(page.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ffd96b] to-[#c98a1a] px-2.5 py-1 text-[11px] font-bold text-[#1a1205] shadow hover:brightness-110 active:scale-95"
                      title="Edit this page visually in Elementor"
                    >
                      <Layers className="h-3 w-3" />
                      <span>Edit in Elementor</span>
                    </button>

                    <a
                      href={`/#${page.slug === "/" ? "" : page.slug}`}
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
            ))}
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
    </div>
  );
}

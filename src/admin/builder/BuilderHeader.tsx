import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  UploadCloud,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
  FileText,
} from "lucide-react";
import { useSiteStore, type DeviceMode } from "../../store/siteStore";

export function BuilderHeader({ onExit }: { onExit: () => void }) {
  const {
    draftConfig,
    deviceMode,
    setDeviceMode,
    previewOnly,
    setPreviewOnly,
    undo,
    redo,
    historyIndex,
    history,
    hasUnsavedChanges,
    publish,
    resetToDefaults,
    toggleColorMode,
    setCurrentPageId,
  } = useSiteStore();

  const isLight = draftConfig.theme.colorMode === "light";
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const activePage =
    draftConfig.pages.find((p) => p.id === draftConfig.currentPageId) ||
    draftConfig.pages[0];

  return (
    <header className="relative z-50 flex h-14 w-full items-center justify-between border-b border-white/10 bg-[#080d10] px-4 backdrop-blur-xl">
      {/* LEFT: Branding, Navigation & Page Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
          title="Back to Admin Dashboard"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </button>

        {/* Direct Link to Live Site */}
        <button
          onClick={() => {
            const path = activePage?.slug === "/" ? "" : activePage?.slug;
            window.location.hash = path ? `#${path}` : "";
            window.location.pathname = "/";
            window.location.reload();
          }}
          className="hidden sm:flex h-8 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20"
          title="View the Live Public Website"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>View Live Site</span>
        </button>

        <div className="hidden h-4 w-px bg-white/10 sm:block" />

        {/* Page Switcher Dropdown & Add Page Button */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2 py-1">
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px] text-white/50">Page:</span>
            <select
              value={draftConfig.currentPageId}
              onChange={(e) => setCurrentPageId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {draftConfig.pages.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#080d10] text-white">
                  {p.title} ({p.slug})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              const title = prompt("Enter new page title (e.g., 'Terms of Service' or 'Tournaments Guide'):");
              if (!title) return;
              const slug = prompt("Enter page slug (e.g., '/terms' or '/tournaments'):", `/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
              if (title) {
                const newId = useSiteStore.getState().createPage(title, slug || `/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
                useSiteStore.getState().setCurrentPageId(newId);
              }
            }}
            className="flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 text-[11px] font-semibold text-white/80 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30"
            title="Create a New Page"
          >
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span className="hidden md:inline">+ New Page</span>
          </button>
        </div>
      </div>

      {/* CENTER: Device Mode & View Toggles */}
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
        {(
          [
            { id: "desktop", label: "Desktop", icon: Monitor },
            { id: "tablet", label: "Tablet", icon: Tablet },
            { id: "mobile", label: "Mobile", icon: Smartphone },
          ] as const
        ).map((d) => {
          const Icon = d.icon;
          const isActive = deviceMode === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setDeviceMode(d.id as DeviceMode)}
              className={`flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
              title={`${d.label} Preview`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{d.label}</span>
            </button>
          );
        })}

        <div className="mx-1 h-3 w-px bg-white/10" />

        <button
          onClick={() => setPreviewOnly(!previewOnly)}
          className={`flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-all ${
            previewOnly
              ? "bg-amber-400 text-[#1a1205]"
              : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
          title={previewOnly ? "Show Editor UI" : "Preview Mode (Hide Editor UI)"}
        >
          {previewOnly ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <span className="hidden lg:inline">{previewOnly ? "Editing" : "Preview"}</span>
        </button>
      </div>

      {/* RIGHT: History, Theme Mode, Reset, and Publish */}
      <div className="flex items-center gap-2">
        {/* Theme Mode Toggle */}
        <button
          onClick={toggleColorMode}
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
          title={`Switch Theme to ${isLight ? "Dark" : "Light"} Mode`}
        >
          {isLight ? <Moon className="h-4 w-4 text-amber-300" /> : <Sun className="h-4 w-4 text-amber-300" />}
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="grid h-7 w-7 place-items-center rounded text-white/70 transition-all hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="grid h-7 w-7 place-items-center rounded text-white/70 transition-all hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={() => {
            if (confirm("Reset all pages and templates to factory default?")) {
              resetToDefaults();
            }
          }}
          className="hidden h-8 items-center gap-1 rounded-lg border border-white/10 px-2 text-xs text-white/50 transition-all hover:bg-rose-500/10 hover:text-rose-300 sm:flex"
          title="Reset to Default"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Status indicator */}
        <div className="hidden items-center gap-1.5 px-2 text-xs lg:flex">
          <span
            className={`h-2 w-2 rounded-full ${
              hasUnsavedChanges
                ? "bg-amber-400 shadow-[0_0_8px_rgba(245,194,66,0.8)] animate-pulse"
                : "bg-emerald-400"
            }`}
          />
          <span className="text-[11px] text-white/60">
            {hasUnsavedChanges ? "Draft edited" : "Published"}
          </span>
        </div>

        {/* Publish Action */}
        <button
          onClick={() => {
            publish();
            const note = document.createElement("div");
            note.className =
              "fixed bottom-5 right-5 z-[9999] rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black shadow-2xl animate-bounce";
            note.innerText = "✓ Changes published to Live Site!";
            document.body.appendChild(note);
            setTimeout(() => note.remove(), 2500);
          }}
          className="flex h-8 items-center gap-2 rounded-lg bg-gradient-to-r from-[#ffd96b] via-[#f5c242] to-[#c98a1a] px-3.5 text-xs font-bold text-[#1a1205] shadow-[0_4px_16px_rgba(245,194,66,0.4)] transition-all hover:brightness-110 active:scale-95"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
}

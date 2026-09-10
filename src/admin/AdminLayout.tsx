import { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  Trophy,
  Gift,
  Settings,
  ExternalLink,
  Crown,
  Menu,
  X,
  Sparkles,
  FileText,
  BookOpen,
} from "lucide-react";
import { DashboardOverview } from "./pages/DashboardOverview";
import { PagesManager } from "./pages/PagesManager";
import { PostsManager } from "./pages/PostsManager";
import { TournamentsManager } from "./pages/TournamentsManager";
import { BonusesManager } from "./pages/BonusesManager";
import { SettingsManager } from "./pages/SettingsManager";
import { VisualEditor } from "./builder/VisualEditor";
import { useSiteStore } from "../store/siteStore";

export type AdminPage =
  | "dashboard"
  | "pages"
  | "posts"
  | "builder"
  | "tournaments"
  | "bonuses"
  | "settings";

export function AdminLayout({ onExitToSite }: { onExitToSite: () => void }) {
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setCurrentPageId } = useSiteStore();

  const handleEditWithBuilder = (pageId: string) => {
    setCurrentPageId(pageId);
    setCurrentPage("builder");
  };

  // If in Visual Editor mode, render the full-screen Elementor studio
  if (currentPage === "builder") {
    return <VisualEditor onExit={() => setCurrentPage("pages")} />;
  }

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "pages" as const, label: "All Pages", icon: FileText },
    { id: "posts" as const, label: "Blog & Posts", icon: BookOpen },
    {
      id: "builder" as const,
      label: "Elementor Builder",
      icon: Layers,
      highlight: true,
    },
    { id: "tournaments" as const, label: "Tournaments & Tables", icon: Trophy },
    { id: "bonuses" as const, label: "Bonuses & Offers", icon: Gift },
    { id: "settings" as const, label: "Settings & Compliance", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#05080a] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#080d10] transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-md">
            <Crown className="h-4 w-4 text-[#f5c242]" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight text-white">
              Stars <span className="text-emerald-400">Admin</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-white/40">
              Management Suite
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-transparent text-emerald-300 border border-emerald-500/30 font-semibold"
                    : item.highlight
                    ? "border border-amber-400/30 bg-amber-400/5 text-amber-200 hover:bg-amber-400/10"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      item.highlight ? "text-amber-400" : "text-current"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="rounded bg-gradient-to-r from-[#ffd96b] to-[#c98a1a] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#1a1205]">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Exit to Site */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={onExitToSite}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
              <span>Go to Live Site</span>
            </div>
            <span className="text-[10px] text-white/40">/</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#080d10]/60 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">
              {currentPage === "dashboard" && "Platform Operations HQ"}
              {currentPage === "pages" && "Pages Management"}
              {currentPage === "posts" && "Blog & News Posts"}
              {currentPage === "tournaments" && "Tournaments Management"}
              {currentPage === "bonuses" && "Bonuses & Rewards"}
              {currentPage === "settings" && "Compliance & Gateways"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage("builder")}
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffd96b] to-[#c98a1a] px-3.5 py-1.5 text-xs font-bold text-[#1a1205] shadow transition-all hover:brightness-110 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Edit Page Layout</span>
            </button>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 font-bold text-[10px] text-[#05080a]">
                SU
              </div>
              <span className="text-xs font-semibold text-white">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {currentPage === "dashboard" && (
            <DashboardOverview onOpenEditor={() => setCurrentPage("builder")} />
          )}
          {currentPage === "pages" && (
            <PagesManager onEditWithBuilder={handleEditWithBuilder} />
          )}
          {currentPage === "posts" && <PostsManager />}
          {currentPage === "tournaments" && <TournamentsManager />}
          {currentPage === "bonuses" && <BonusesManager />}
          {currentPage === "settings" && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}

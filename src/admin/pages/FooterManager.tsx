import { useState } from "react";
import {
  Crown,
  Save,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Globe,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useSiteStore,
  defaultFooterConfig,
  FooterConfig,
  FooterColumnItem,
  FooterLinkItem,
  FooterSocialItem,
} from "../../store/siteStore";

export function FooterManager() {
  const { draftConfig, updateFooter, publish } = useSiteStore();
  const footer: FooterConfig = draftConfig.footer || defaultFooterConfig;

  const [activeTab, setActiveTab] = useState<"columns" | "brand" | "socials" | "compliance">("columns");
  const [saved, setSaved] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Helper to mutate footer in draft and store
  const mutateFooter = (updater: (prev: FooterConfig) => FooterConfig) => {
    updateFooter(updater);
  };

  const handleSave = () => {
    publish();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset the footer back to official system defaults?")) {
      mutateFooter(() => JSON.parse(JSON.stringify(defaultFooterConfig)));
      publish();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  // --- Column & Link Operations ---
  const handleAddColumn = () => {
    const newCol: FooterColumnItem = {
      id: `col_${Date.now()}`,
      title: "New Navigation Menu",
      links: [
        {
          id: `l_${Date.now()}`,
          label: "New Link",
          href: "/",
        },
      ],
    };
    mutateFooter((prev) => ({
      ...prev,
      columns: [...(prev.columns || []), newCol],
    }));
  };

  const handleUpdateColumnTitle = (colIndex: number, newTitle: string) => {
    mutateFooter((prev) => {
      const nextCols = [...prev.columns];
      nextCols[colIndex] = { ...nextCols[colIndex], title: newTitle };
      return { ...prev, columns: nextCols };
    });
  };

  const handleDeleteColumn = (colIndex: number) => {
    if (window.confirm("Delete this entire footer column and its links?")) {
      mutateFooter((prev) => {
        const nextCols = prev.columns.filter((_, idx) => idx !== colIndex);
        return { ...prev, columns: nextCols };
      });
    }
  };

  const handleAddLink = (colIndex: number) => {
    const newLink: FooterLinkItem = {
      id: `link_${Date.now()}`,
      label: "New Page Link",
      href: "/#",
    };
    mutateFooter((prev) => {
      const nextCols = [...prev.columns];
      nextCols[colIndex] = {
        ...nextCols[colIndex],
        links: [...(nextCols[colIndex].links || []), newLink],
      };
      return { ...prev, columns: nextCols };
    });
  };

  const handleUpdateLink = (
    colIndex: number,
    linkIndex: number,
    field: keyof FooterLinkItem,
    value: string | undefined
  ) => {
    mutateFooter((prev) => {
      const nextCols = [...prev.columns];
      const nextLinks = [...nextCols[colIndex].links];
      nextLinks[linkIndex] = { ...nextLinks[linkIndex], [field]: value };
      nextCols[colIndex] = { ...nextCols[colIndex], links: nextLinks };
      return { ...prev, columns: nextCols };
    });
  };

  const handleDeleteLink = (colIndex: number, linkIndex: number) => {
    mutateFooter((prev) => {
      const nextCols = [...prev.columns];
      const nextLinks = nextCols[colIndex].links.filter((_, idx) => idx !== linkIndex);
      nextCols[colIndex] = { ...nextCols[colIndex], links: nextLinks };
      return { ...prev, columns: nextCols };
    });
  };

  const handleMoveLink = (colIndex: number, linkIndex: number, direction: "up" | "down") => {
    mutateFooter((prev) => {
      const nextCols = [...prev.columns];
      const links = [...nextCols[colIndex].links];
      const targetIndex = direction === "up" ? linkIndex - 1 : linkIndex + 1;
      if (targetIndex < 0 || targetIndex >= links.length) return prev;
      const temp = links[linkIndex];
      links[linkIndex] = links[targetIndex];
      links[targetIndex] = temp;
      nextCols[colIndex] = { ...nextCols[colIndex], links };
      return { ...prev, columns: nextCols };
    });
  };

  // --- Social Profile Operations ---
  const handleUpdateSocialUrl = (socialIndex: number, url: string) => {
    mutateFooter((prev) => {
      const nextSocials = [...prev.socials];
      nextSocials[socialIndex] = { ...nextSocials[socialIndex], url };
      return { ...prev, socials: nextSocials };
    });
  };

  const handleAddSocial = () => {
    const newSocial: FooterSocialItem = {
      id: `soc_${Date.now()}`,
      name: "Community",
      url: "https://t.me",
      path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z",
    };
    mutateFooter((prev) => ({
      ...prev,
      socials: [...(prev.socials || []), newSocial],
    }));
  };

  const handleDeleteSocial = (socialIndex: number) => {
    mutateFooter((prev) => {
      const nextSocials = prev.socials.filter((_, idx) => idx !== socialIndex);
      return { ...prev, socials: nextSocials };
    });
  };

  // --- Badges Operations ---
  const handleAddBadge = () => {
    const text = window.prompt("Enter new compliance badge text (e.g. 'ISO 27001 Certified' or 'Govt Regulated'):");
    if (text && text.trim()) {
      mutateFooter((prev) => ({
        ...prev,
        badges: [...(prev.badges || []), text.trim()],
      }));
    }
  };

  const handleDeleteBadge = (badgeIndex: number) => {
    mutateFooter((prev) => {
      const nextBadges = prev.badges.filter((_, idx) => idx !== badgeIndex);
      return { ...prev, badges: nextBadges };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save / Reset controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>Website Footer Manager</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Live Editor
            </span>
          </h2>
          <p className="text-xs text-white/50">
            Edit the public website footer: brand description, navigation menus, social links, legal disclaimers, and compliance badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
            title="Reset to default footer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              showLivePreview
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-white/10 bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{showLivePreview ? "Hide Preview" : "Show Preview"}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saved ? "Published Live!" : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("columns")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "columns"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Navigation Columns ({footer.columns?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("brand")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "brand"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <Crown className="h-4 w-4 text-[#f5c242]" />
          <span>Brand & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab("socials")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "socials"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Social Links ({footer.socials?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("compliance")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "compliance"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Compliance & Legal</span>
        </button>
      </div>

      {/* TAB 1: COLUMNS & NAVIGATION LINKS */}
      {activeTab === "columns" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/60">
              Customize the navigation columns and links displayed in the footer. You can edit URLs or link to any custom pages.
            </p>
            <button
              onClick={handleAddColumn}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Column</span>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {footer.columns?.map((col, colIndex) => (
              <div
                key={col.id || colIndex}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#080d10] p-4 shadow-md transition-all hover:border-white/20"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => handleUpdateColumnTitle(colIndex, e.target.value)}
                    className="flex-1 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 focus:border-emerald-500 focus:outline-none"
                    placeholder="Column Title"
                  />
                  <button
                    onClick={() => handleDeleteColumn(colIndex)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                    title="Delete this column"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Column Links List */}
                <div className="mt-3 flex-1 space-y-2.5">
                  {col.links?.map((link, linkIndex) => (
                    <div
                      key={link.id || linkIndex}
                      className="group rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-all hover:border-white/15 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                          Link #{linkIndex + 1}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => handleMoveLink(colIndex, linkIndex, "up")}
                            disabled={linkIndex === 0}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleMoveLink(colIndex, linkIndex, "down")}
                            disabled={linkIndex === (col.links?.length || 0) - 1}
                            className="p-1 text-white/40 hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(colIndex, linkIndex)}
                            className="p-1 text-rose-400/60 hover:text-rose-400 transition-colors"
                            title="Remove link"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div>
                          <label className="text-[10px] font-medium text-white/50 block mb-0.5">
                            Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) =>
                              handleUpdateLink(colIndex, linkIndex, "label", e.target.value)
                            }
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                            placeholder="e.g. Frequently Asked Questions"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-white/50 block mb-0.5">
                            Target URL / Path
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) =>
                                handleUpdateLink(colIndex, linkIndex, "href", e.target.value)
                              }
                              className="flex-1 rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-xs text-emerald-300 font-mono placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                              placeholder="/faq or #download"
                            />
                            {/* Quick Select Page Dropdown */}
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const selectedPage = draftConfig.pages?.find(
                                    (p) => p.slug === e.target.value
                                  );
                                  handleUpdateLink(colIndex, linkIndex, "href", e.target.value);
                                  if (selectedPage && (!link.label || link.label === "New Page Link")) {
                                    handleUpdateLink(colIndex, linkIndex, "label", selectedPage.title);
                                  }
                                }
                              }}
                              className="rounded-lg border border-white/10 bg-[#121c22] px-1.5 py-1 text-[11px] text-white/70 focus:border-emerald-500 focus:outline-none max-w-[90px]"
                              title="Pick an existing page"
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Pick...
                              </option>
                              {draftConfig.pages?.map((p) => (
                                <option key={p.id} value={p.slug}>
                                  {p.title} ({p.slug})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <label className="flex items-center gap-1.5 text-[10px] text-white/60 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={link.target === "_blank"}
                              onChange={(e) =>
                                handleUpdateLink(
                                  colIndex,
                                  linkIndex,
                                  "target",
                                  e.target.checked ? "_blank" : undefined
                                )
                              }
                              className="rounded border-white/20 bg-black text-emerald-500 focus:ring-0"
                            />
                            <span>Open in new tab</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Link Button */}
                <button
                  onClick={() => handleAddLink(colIndex)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] py-2 text-xs font-semibold text-white/60 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-300"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Link to {col.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BRAND & BIO */}
      {activeTab === "brand" && (
        <div className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#080d10] p-6 shadow-md">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 text-[#f5c242] shadow-lg">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Footer Brand Identity & Bio</h3>
              <p className="text-xs text-white/50">
                Customize how the company name, badges, and trust summary appear in the left footer column.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Brand Title Prefix
              </label>
              <input
                type="text"
                value={footer.brandTitle || "Teen Patti"}
                onChange={(e) =>
                  mutateFooter((prev) => ({ ...prev, brandTitle: e.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                placeholder="Teen Patti"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Brand Accent Word (Golden Text)
              </label>
              <input
                type="text"
                value={footer.brandAccent || "Stars"}
                onChange={(e) =>
                  mutateFooter((prev) => ({ ...prev, brandAccent: e.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-amber-300 font-bold placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                placeholder="Stars"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Brand Subtitle Badge
            </label>
            <input
              type="text"
              value={footer.brandSubtitle || "Premium Edition"}
              onChange={(e) =>
                mutateFooter((prev) => ({ ...prev, brandSubtitle: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none"
              placeholder="Premium Edition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Company / Brand Bio Text
            </label>
            <textarea
              rows={4}
              value={footer.description}
              onChange={(e) =>
                mutateFooter((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-white leading-relaxed placeholder-white/30 focus:border-emerald-500 focus:outline-none"
              placeholder="India's most refined real-money Teen Patti experience..."
            />
          </div>
        </div>
      )}

      {/* TAB 3: SOCIAL LINKS */}
      {activeTab === "socials" && (
        <div className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#080d10] p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Social Media Profiles</h3>
              <p className="text-xs text-white/50">
                Direct players to your official social channels.
              </p>
            </div>
            <button
              onClick={handleAddSocial}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Social Profile</span>
            </button>
          </div>

          <div className="space-y-3">
            {footer.socials?.map((social, idx) => (
              <div
                key={social.id || idx}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-3"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={social.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        mutateFooter((prev) => {
                          const next = [...prev.socials];
                          next[idx] = { ...next[idx], name: newName };
                          return { ...prev, socials: next };
                        });
                      }}
                      className="font-bold text-xs text-white bg-transparent border-none focus:outline-none"
                      placeholder="Network Name"
                    />
                    <button
                      onClick={() => handleDeleteSocial(idx)}
                      className="text-rose-400/60 hover:text-rose-400 p-1 transition-colors"
                      title="Delete profile"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => handleUpdateSocialUrl(idx, e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-xs text-emerald-300 font-mono placeholder-white/30 focus:border-emerald-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE & LEGAL */}
      {activeTab === "compliance" && (
        <div className="max-w-2xl space-y-6 rounded-2xl border border-white/10 bg-[#080d10] p-6 shadow-md">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-sm font-bold text-white">Legal, Regulatory & Trust Badges</h3>
            <p className="text-xs text-white/50">
              Manage Indian regulatory notices, responsible gaming badges, CIN registration numbers, and system status indicators.
            </p>
          </div>

          {/* Badges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white/80">
                Compliance Badges
              </label>
              <button
                onClick={handleAddBadge}
                className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="h-3 w-3" />
                <span>Add Badge</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {footer.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/80"
                >
                  <span>{badge}</span>
                  <button
                    onClick={() => handleDeleteBadge(idx)}
                    className="text-white/40 hover:text-rose-400"
                    title="Remove badge"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              Legal Disclaimer Paragraph
            </label>
            <textarea
              rows={4}
              value={footer.disclaimer}
              onChange={(e) =>
                mutateFooter((prev) => ({ ...prev, disclaimer: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-white/80 leading-relaxed focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Copyright & CIN */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Copyright Notice
              </label>
              <input
                type="text"
                value={footer.copyright}
                onChange={(e) =>
                  mutateFooter((prev) => ({ ...prev, copyright: e.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Corporate CIN / Registration
              </label>
              <input
                type="text"
                value={footer.cinNumber}
                onChange={(e) =>
                  mutateFooter((prev) => ({ ...prev, cinNumber: e.target.value }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* System Status Text */}
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              System Operational Status Text
            </label>
            <input
              type="text"
              value={footer.systemStatusText || "All systems operational"}
              onChange={(e) =>
                mutateFooter((prev) => ({ ...prev, systemStatusText: e.target.value }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-emerald-300 font-semibold focus:border-emerald-500 focus:outline-none"
              placeholder="All systems operational"
            />
          </div>
        </div>
      )}

      {/* LIVE PREVIEW BOX */}
      {showLivePreview && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Real-Time Live Footer Preview</span>
            </h3>
            <span className="text-[10px] text-white/40">
              Updates in real-time as you edit above
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#030507] p-6 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">
              {/* Brand Preview */}
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-800">
                    <Crown className="h-4 w-4 text-[#f5c242]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {footer.brandTitle || "Teen Patti"}{" "}
                      <span className="gradient-text-gold">{footer.brandAccent || "Stars"}</span>
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40">
                      {footer.brandSubtitle || "Premium Edition"}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-white/50 max-w-sm">
                  {footer.description}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  {footer.socials?.map((s) => (
                    <div
                      key={s.id || s.name}
                      className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                        <path d={s.path} />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columns Preview */}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {footer.columns?.map((col) => (
                  <div key={col.id || col.title}>
                    <h5 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-white/80">
                      {col.title}
                    </h5>
                    <ul className="space-y-2">
                      {col.links?.map((item) => (
                        <li key={item.id || item.label}>
                          <span className="text-xs text-white/50 hover:text-white cursor-pointer">
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges & Disclaimer */}
            <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {footer.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase text-white/70"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">
                {footer.disclaimer}
              </p>
            </div>

            {/* Bottom Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-4 text-[10px] text-white/40">
              <div>
                {footer.copyright} {footer.cinNumber}
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{footer.systemStatusText || "All systems operational"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

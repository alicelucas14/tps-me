import {
  LayoutGrid,
  ListTree,
  Sliders,
  Palette,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Sparkles,
  Layers,
  Heading,
  HelpCircle,
  CreditCard,
  MessageSquareQuote,
  Shield,
  Gamepad2,
  Megaphone,
  PaintBucket,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useSiteStore, type SectionConfig, type EditorTab, type BackgroundConfig } from "../../store/siteStore";
import {
  COLOR_PRESETS,
  GRADIENT_PRESETS,
  IMAGE_PRESETS,
} from "../../utils/backgroundPresets";
import { MarkdownEditor } from "../components/MarkdownEditor";

export function LeftPanel() {
  const {
    draftConfig,
    activeTab,
    setActiveTab,
    selectedSectionId,
    setSelectedSectionId,
    toggleSectionVisibility,
    moveSection,
    duplicateSection,
    deleteSection,
    addSection,
    updateSectionProperty,
    updateSectionData,
    updateTheme,
    updateSeo,
  } = useSiteStore();

  const selectedSection = draftConfig.sections.find((s) => s.id === selectedSectionId);

  return (
    <aside className="relative flex h-[calc(100vh-3.5rem)] w-96 shrink-0 flex-col border-r border-white/10 bg-[#0a0f12] text-white">
      {/* Top Tab Switcher */}
      <div className="grid grid-cols-3 border-b border-white/10 bg-[#06090c] p-1.5 text-xs">
        {[
          { id: "content", label: "Inspect", icon: Sliders },
          { id: "navigator", label: "Tree", icon: ListTree },
          { id: "settings", label: "Theme", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as EditorTab)}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 transition-all ${
                isActive
                  ? "bg-white/10 text-white shadow font-semibold"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "navigator" && (
          <NavigatorTree
            sections={draftConfig.sections || []}
            selectedId={selectedSectionId}
            onSelect={(id) => {
              setSelectedSectionId(id);
              setActiveTab("content");
            }}
            onToggleVisibility={toggleSectionVisibility}
            onMove={moveSection}
            onDuplicate={duplicateSection}
            onDelete={deleteSection}
          />
        )}
        {activeTab === "content" && (
          <SectionInspector
            section={selectedSection}
            onUpdateProperty={(key, value) => {
              if (selectedSection) updateSectionProperty(selectedSection.id, key, value);
            }}
            onUpdateData={(updater) => {
              if (selectedSection) updateSectionData(selectedSection.id, updater);
            }}
            onSwitchToNavigator={() => setActiveTab("navigator")}
          />
        )}
        {activeTab === "settings" && (
          <GlobalThemeSettings
            theme={draftConfig.theme}
            seo={draftConfig.seo}
            onUpdateTheme={updateTheme}
            onUpdateSeo={updateSeo}
          />
        )}
      </div>

      {/* Quick Footer inside Left Dock */}
      {selectedSection && activeTab === "content" && (
        <div className="flex items-center justify-between border-t border-white/10 bg-[#06090c] px-4 py-2.5 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="truncate font-medium text-white">{selectedSection.label}</span>
          </div>
          <button
            onClick={() => setActiveTab("navigator")}
            className="text-[11px] text-emerald-400 hover:underline"
          >
            Switch section
          </button>
        </div>
      )}
    </aside>
  );
}

/* ——— Widgets Catalog Tab ——— */
function WidgetsCatalog({ onAdd }: { onAdd: (type: SectionConfig["type"]) => void }) {
  const widgetList = [
    {
      type: "announcement" as const,
      name: "Announcement Bar",
      desc: "Top promotional banner with CTA",
      icon: Megaphone,
      accent: "gold",
    },
    {
      type: "hero" as const,
      name: "Hero Header",
      desc: "Main title, CTA buttons, and app mockup",
      icon: Heading,
      accent: "emerald",
    },
    {
      type: "social_proof" as const,
      name: "Social Proof & Stats",
      desc: "Publications marquee and counter stats",
      icon: Layers,
      accent: "gold",
    },
    {
      type: "features" as const,
      name: "Features Grid",
      desc: "Bento card grid with icons and accents",
      icon: Sparkles,
      accent: "emerald",
    },
    {
      type: "showcase" as const,
      name: "Live Table Showcase",
      desc: "Interactive felt simulation and features",
      icon: Gamepad2,
      accent: "emerald",
    },
    {
      type: "benefits" as const,
      name: "Benefits & Security",
      desc: "Deep-dive rows with security graphics",
      icon: Shield,
      accent: "emerald",
    },
    {
      type: "testimonials" as const,
      name: "Player Reviews",
      desc: "Quotes, star ratings, and VIP badges",
      icon: MessageSquareQuote,
      accent: "gold",
    },
    {
      type: "pricing" as const,
      name: "VIP & Pricing Tiers",
      desc: "Membership comparison cards",
      icon: CreditCard,
      accent: "gold",
    },
    {
      type: "rich_text" as const,
      name: "Rich Text Document",
      desc: "Clean article headings, lead paragraph, and formatted markdown body",
      icon: FileText,
      accent: "emerald",
    },
    {
      type: "faq" as const,
      name: "FAQ Accordion",
      desc: "Expandable questions with support box",
      icon: HelpCircle,
      accent: "emerald",
    },
    {
      type: "final_cta" as const,
      name: "Final App CTA",
      desc: "Download buttons, QR mock, and bonus code",
      icon: Sparkles,
      accent: "gold",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Add Sections</h3>
        <p className="text-xs text-white/50">
          Click any widget to append it to your page layout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {widgetList.map((w) => {
          const Icon = w.icon;
          return (
            <button
              key={w.type}
              onClick={() => onAdd(w.type)}
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left transition-all hover:border-emerald-400/40 hover:bg-emerald-400/5 active:scale-[0.99]"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/80 group-hover:border-emerald-400/30 group-hover:bg-emerald-400/10 group-hover:text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-emerald-200">
                    {w.name}
                  </span>
                  <Plus className="h-3.5 w-3.5 text-white/30 group-hover:text-emerald-400" />
                </div>
                <p className="truncate text-[11px] text-white/40">{w.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ——— Navigator / Tree Tab ——— */
function NavigatorTree({
  sections,
  selectedId,
  onSelect,
  onToggleVisibility,
  onMove,
  onDuplicate,
  onDelete,
}: {
  sections: SectionConfig[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Page Structure</h3>
          <p className="text-xs text-white/50">Reorder, hide, duplicate, or inspect.</p>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
          {sections.length}
        </span>
      </div>

      <div className="space-y-1.5">
        {sections.map((sec, index) => {
          const isSelected = sec.id === selectedId;
          return (
            <div
              key={sec.id}
              className={`group flex items-center justify-between rounded-xl border p-2 text-xs transition-all ${
                isSelected
                  ? "border-emerald-400/50 bg-emerald-500/10 text-white shadow"
                  : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {/* Click label to select */}
              <button
                onClick={() => onSelect(sec.id)}
                className="flex flex-1 items-center gap-2 overflow-hidden text-left"
              >
                <span className="font-mono text-[10px] text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`truncate font-medium ${
                    !sec.visible ? "line-through opacity-40" : ""
                  }`}
                >
                  {sec.label}
                </span>
              </button>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                {/* Inspect Section */}
                <button
                  onClick={() => onSelect(sec.id)}
                  className="grid h-6 w-6 place-items-center rounded hover:bg-emerald-500/20 text-emerald-400"
                  title="Inspect & Edit Section"
                >
                  <Sliders className="h-3 w-3" />
                </button>

                {/* Reorder Up/Down */}
                <button
                  onClick={() => onMove(index, index - 1)}
                  disabled={index === 0}
                  className="grid h-6 w-6 place-items-center rounded hover:bg-white/10 disabled:opacity-20"
                  title="Move Up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onMove(index, index + 1)}
                  disabled={index === sections.length - 1}
                  className="grid h-6 w-6 place-items-center rounded hover:bg-white/10 disabled:opacity-20"
                  title="Move Down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {/* Hide / Show */}
                <button
                  onClick={() => onToggleVisibility(sec.id)}
                  className={`grid h-6 w-6 place-items-center rounded hover:bg-white/10 ${
                    !sec.visible ? "text-amber-400" : "text-white/60"
                  }`}
                  title={sec.visible ? "Hide Section" : "Show Section"}
                >
                  {sec.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => onDuplicate(sec.id)}
                  className="grid h-6 w-6 place-items-center rounded hover:bg-white/10 text-white/60"
                  title="Duplicate Section"
                >
                  <Copy className="h-3 w-3" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm(`Delete "${sec.label}"?`)) onDelete(sec.id);
                  }}
                  className="grid h-6 w-6 place-items-center rounded hover:bg-rose-500/20 text-rose-400"
                  title="Delete Section"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ——— Section Inspector Tab ——— */
function SectionInspector({
  section,
  onUpdateProperty,
  onUpdateData,
  onSwitchToNavigator,
}: {
  section?: SectionConfig;
  onUpdateProperty: (key: string, value: any) => void;
  onUpdateData: (updater: (prev: any) => any) => void;
  onSwitchToNavigator: () => void;
}) {
  if (!section) {
    return (
      <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
        <Sliders className="mb-3 h-8 w-8 text-white/30" />
        <h4 className="text-sm font-semibold text-white">No Section Selected</h4>
        <p className="mt-1 text-xs text-white/50">
          Select a section on the canvas or tree to customize its content and styles.
        </p>
        <button
          onClick={onSwitchToNavigator}
          className="mt-4 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
        >
          View Section Tree
        </button>
      </div>
    );
  }

  const d = section.data || {};

  return (
    <div className="space-y-5">
      {/* Section Header Info */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
            Editing {section.type.replace("_", " ")}
          </span>
          <span className="font-mono text-[10px] text-white/40">{section.id}</span>
        </div>
        <div className="mt-2">
          <label className="text-[11px] text-white/50">Section Title Label</label>
          <input
            type="text"
            value={section.label}
            onChange={(e) => {
              const siteStore = useSiteStore.getState();
              siteStore.updateSectionLabel(section.id, e.target.value);
            }}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Form Fields by Type */}
      {section.type === "announcement" && (
        <div className="space-y-3">
          <InputField
            label="Banner Announcement Text"
            value={d.text}
            onChange={(v) => onUpdateProperty("text", v)}
          />
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="Badge"
              value={d.badge}
              onChange={(v) => onUpdateProperty("badge", v)}
            />
            <SelectField
              label="Color Theme"
              value={d.bgColor || "gold"}
              options={[
                { label: "Gold / Amber", value: "gold" },
                { label: "Emerald Green", value: "emerald" },
                { label: "Ruby Red", value: "ruby" },
              ]}
              onChange={(v) => onUpdateProperty("bgColor", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="Link Text"
              value={d.linkText}
              onChange={(v) => onUpdateProperty("linkText", v)}
            />
            <InputField
              label="Link Target"
              value={d.linkUrl}
              onChange={(v) => onUpdateProperty("linkUrl", v)}
            />
          </div>
        </div>
      )}

      {section.type === "hero" && (
        <div className="space-y-3">
          <InputField
            label="Eyebrow Badge"
            value={d.eyebrow}
            onChange={(v) => onUpdateProperty("eyebrow", v)}
          />
          <InputField
            label="Title Prefix"
            value={d.titlePrefix}
            onChange={(v) => onUpdateProperty("titlePrefix", v)}
          />
          <InputField
            label="Title Accent (Italic Glow)"
            value={d.titleAccent}
            onChange={(v) => onUpdateProperty("titleAccent", v)}
          />
          <InputField
            label="Title Suffix"
            value={d.titleSuffix}
            onChange={(v) => onUpdateProperty("titleSuffix", v)}
          />
          <TextAreaField
            label="Hero Subtitle"
            value={d.subtitle}
            onChange={(v) => onUpdateProperty("subtitle", v)}
          />

          <div className="border-t border-white/10 pt-3">
            <h5 className="mb-2 text-xs font-semibold text-white/80">Call To Action Buttons</h5>
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Primary Button"
                value={d.primaryCtaText}
                onChange={(v) => onUpdateProperty("primaryCtaText", v)}
              />
              <InputField
                label="Primary Link"
                value={d.primaryCtaLink}
                onChange={(v) => onUpdateProperty("primaryCtaLink", v)}
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <InputField
                label="Secondary Button"
                value={d.secondaryCtaText}
                onChange={(v) => onUpdateProperty("secondaryCtaText", v)}
              />
              <InputField
                label="Secondary Link"
                value={d.secondaryCtaLink}
                onChange={(v) => onUpdateProperty("secondaryCtaLink", v)}
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 space-y-3">
            <h5 className="text-xs font-semibold text-white/80">Hero Right Graphic & Visual</h5>
            
            <SelectField
              label="Visual Presentation Type"
              value={d.visualType || "3d-mockup"}
              options={[
                { label: "Interactive 3D Phone & Cards", value: "3d-mockup" },
                { label: "Custom Uploaded Image / Banner", value: "custom-image" },
                { label: "None - Clean Centered Text Only", value: "none" },
              ]}
              onChange={(v) => onUpdateProperty("visualType", v)}
            />

            {d.visualType === "custom-image" ? (
              <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <InputField
                  label="Custom Image URL (https://...)"
                  value={d.customImageUrl || ""}
                  placeholder="https://images.unsplash.com/..."
                  onChange={(v) => onUpdateProperty("customImageUrl", v)}
                />

                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] text-white/50 w-full">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => onUpdateProperty("customImageUrl", "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80")}
                    className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-white/20"
                  >
                    Golden Table
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateProperty("customImageUrl", "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80")}
                    className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-white/20"
                  >
                    Poker Chips
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateProperty("customImageUrl", "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80")}
                    className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-white/20"
                  >
                    VIP Cards
                  </button>
                </div>

                <InputField
                  label="Image Alt Description"
                  value={d.customImageAlt || ""}
                  placeholder="Teen Patti Stars App Graphic"
                  onChange={(v) => onUpdateProperty("customImageAlt", v)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <InputField
                  label="Table Title"
                  value={d.tableTitle || "Diwali Mega Table"}
                  onChange={(v) => onUpdateProperty("tableTitle", v)}
                />
                <InputField
                  label="Prize Pool"
                  value={d.tablePrize || "₹25 Cr"}
                  onChange={(v) => onUpdateProperty("tablePrize", v)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {section.type === "rich_text" && (
        <div className="space-y-4">
          <InputField
            label="Eyebrow Badge"
            value={d.eyebrow}
            onChange={(v) => onUpdateProperty("eyebrow", v)}
          />
          <InputField
            label="Document Title"
            value={d.title}
            onChange={(v) => onUpdateProperty("title", v)}
          />
          <InputField
            label="Title Accent (Italic)"
            value={d.titleAccent}
            onChange={(v) => onUpdateProperty("titleAccent", v)}
          />
          <TextAreaField
            label="Lead Paragraph / Subtitle"
            value={d.subtitle}
            onChange={(v) => onUpdateProperty("subtitle", v)}
          />
          <TextAreaField
            label="Article Body (Markdown / Text)"
            value={d.content}
            rows={12}
            onChange={(v) => onUpdateProperty("content", v)}
          />
        </div>
      )}

      {section.type === "social_proof" && (
        <div className="space-y-4">
          <InputField
            label="Section Eyebrow"
            value={d.eyebrow}
            onChange={(v) => onUpdateProperty("eyebrow", v)}
          />

          <div className="border-t border-white/10 pt-3">
            <h5 className="mb-2 text-xs font-semibold text-white/80">Key Statistics (4 metrics)</h5>
            <div className="space-y-2">
              {(d.stats || []).map((st: any, i: number) => (
                <div key={st.id || i} className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2">
                  <InputField
                    label={`Stat #${i + 1} Value`}
                    value={st.value}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newStats = [...prev.stats];
                        newStats[i] = { ...newStats[i], value: val };
                        return { ...prev, stats: newStats };
                      });
                    }}
                  />
                  <InputField
                    label="Label"
                    value={st.label}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newStats = [...prev.stats];
                        newStats[i] = { ...newStats[i], label: val };
                        return { ...prev, stats: newStats };
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "features" && (
        <div className="space-y-4">
          <InputField
            label="Eyebrow"
            value={d.eyebrow}
            onChange={(v) => onUpdateProperty("eyebrow", v)}
          />
          <InputField
            label="Title"
            value={d.title}
            onChange={(v) => onUpdateProperty("title", v)}
          />
          <InputField
            label="Title Accent"
            value={d.titleAccent}
            onChange={(v) => onUpdateProperty("titleAccent", v)}
          />
          <TextAreaField
            label="Subtitle"
            value={d.subtitle}
            onChange={(v) => onUpdateProperty("subtitle", v)}
          />

          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-semibold text-white/80">Feature Cards</h5>
              <button
                onClick={() => {
                  onUpdateData((prev) => ({
                    ...prev,
                    items: [
                      ...(prev.items || []),
                      {
                        id: `f_${Date.now()}`,
                        title: "New Feature",
                        desc: "Feature description goes here.",
                        icon: "Zap",
                        accent: "emerald",
                      },
                    ],
                  }));
                }}
                className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px] text-white hover:bg-white/20"
              >
                <Plus className="h-3 w-3" /> Add Card
              </button>
            </div>

            <div className="space-y-2.5">
              {(d.items || []).map((item: any, i: number) => (
                <div key={item.id || i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-300">
                      Card #{i + 1}
                    </span>
                    <button
                      onClick={() => {
                        onUpdateData((prev) => ({
                          ...prev,
                          items: prev.items.filter((_: any, idx: number) => idx !== i),
                        }));
                      }}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <InputField
                    label="Title"
                    value={item.title}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newItems = [...prev.items];
                        newItems[i] = { ...newItems[i], title: val };
                        return { ...prev, items: newItems };
                      });
                    }}
                  />
                  <TextAreaField
                    label="Description"
                    value={item.desc}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newItems = [...prev.items];
                        newItems[i] = { ...newItems[i], desc: val };
                        return { ...prev, items: newItems };
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "pricing" && (
        <div className="space-y-4">
          <InputField
            label="Eyebrow"
            value={d.eyebrow}
            onChange={(v) => onUpdateProperty("eyebrow", v)}
          />
          <InputField
            label="Title"
            value={d.title}
            onChange={(v) => onUpdateProperty("title", v)}
          />
          <InputField
            label="Title Accent"
            value={d.titleAccent}
            onChange={(v) => onUpdateProperty("titleAccent", v)}
          />
          <InputField
            label="Bottom Banner Note"
            value={d.bannerText}
            onChange={(v) => onUpdateProperty("bannerText", v)}
          />

          <div className="border-t border-white/10 pt-3">
            <h5 className="mb-2 text-xs font-semibold text-white/80">Pricing Tiers</h5>
            <div className="space-y-3">
              {(d.items || []).map((plan: any, i: number) => (
                <div key={plan.id || i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300">
                      {plan.name} Tier
                    </span>
                    <label className="flex items-center gap-1 text-[10px] text-white/60">
                      <input
                        type="checkbox"
                        checked={plan.featured}
                        onChange={(e) => {
                          onUpdateData((prev) => {
                            const newItems = [...prev.items];
                            newItems[i] = { ...newItems[i], featured: e.target.checked };
                            return { ...prev, items: newItems };
                          });
                        }}
                      />
                      Popular
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Price Display"
                      value={plan.price}
                      onChange={(val) => {
                        onUpdateData((prev) => {
                          const newItems = [...prev.items];
                          newItems[i] = { ...newItems[i], price: val };
                          return { ...prev, items: newItems };
                        });
                      }}
                    />
                    <InputField
                      label="Period (e.g. /month)"
                      value={plan.period || ""}
                      onChange={(val) => {
                        onUpdateData((prev) => {
                          const newItems = [...prev.items];
                          newItems[i] = { ...newItems[i], period: val };
                          return { ...prev, items: newItems };
                        });
                      }}
                    />
                  </div>
                  <InputField
                    label="Tagline"
                    value={plan.tagline}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newItems = [...prev.items];
                        newItems[i] = { ...newItems[i], tagline: val };
                        return { ...prev, items: newItems };
                      });
                    }}
                  />
                  <InputField
                    label="Button Text"
                    value={plan.cta}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newItems = [...prev.items];
                        newItems[i] = { ...newItems[i], cta: val };
                        return { ...prev, items: newItems };
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "faq" && (
        <div className="space-y-4">
          <InputField
            label="Eyebrow"
            value={d.eyebrow}
            onChange={(v) => onUpdateProperty("eyebrow", v)}
          />
          <InputField
            label="Title"
            value={d.title}
            onChange={(v) => onUpdateProperty("title", v)}
          />
          <InputField
            label="Title Accent"
            value={d.titleAccent}
            onChange={(v) => onUpdateProperty("titleAccent", v)}
          />

          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-semibold text-white/80">FAQ Items</h5>
              <button
                onClick={() => {
                  onUpdateData((prev) => ({
                    ...prev,
                    items: [
                      ...(prev.items || []),
                      {
                        id: `q_${Date.now()}`,
                        q: "New question?",
                        a: "Answer goes here.",
                      },
                    ],
                  }));
                }}
                className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px] text-white hover:bg-white/20"
              >
                <Plus className="h-3 w-3" /> Add FAQ
              </button>
            </div>

            <div className="space-y-2.5">
              {(d.items || []).map((faq: any, i: number) => (
                <div key={faq.id || i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-300">
                      Q#{i + 1}
                    </span>
                    <button
                      onClick={() => {
                        onUpdateData((prev) => ({
                          ...prev,
                          items: prev.items.filter((_: any, idx: number) => idx !== i),
                        }));
                      }}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <InputField
                    label="Question"
                    value={faq.q}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newItems = [...prev.items];
                        newItems[i] = { ...newItems[i], q: val };
                        return { ...prev, items: newItems };
                      });
                    }}
                  />
                  <TextAreaField
                    label="Answer"
                    value={faq.a}
                    onChange={(val) => {
                      onUpdateData((prev) => {
                        const newItems = [...prev.items];
                        newItems[i] = { ...newItems[i], a: val };
                        return { ...prev, items: newItems };
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section.type === "final_cta" && (
        <div className="space-y-3">
          <InputField
            label="Badge"
            value={d.badge}
            onChange={(v) => onUpdateProperty("badge", v)}
          />
          <InputField
            label="Title Prefix"
            value={d.titlePrefix}
            onChange={(v) => onUpdateProperty("titlePrefix", v)}
          />
          <InputField
            label="Title Accent"
            value={d.titleAccent}
            onChange={(v) => onUpdateProperty("titleAccent", v)}
          />
          <TextAreaField
            label="Subtitle"
            value={d.subtitle}
            onChange={(v) => onUpdateProperty("subtitle", v)}
          />
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="Android CTA"
              value={d.androidCta}
              onChange={(v) => onUpdateProperty("androidCta", v)}
            />
            <InputField
              label="iOS CTA"
              value={d.iosCta}
              onChange={(v) => onUpdateProperty("iosCta", v)}
            />
          </div>
          <InputField
            label="Bonus Code Promo Text"
            value={d.promoCode}
            onChange={(v) => onUpdateProperty("promoCode", v)}
          />
        </div>
      )}
    </div>
  );
}

/* ——— Global Theme & SEO Settings Tab ——— */
function GlobalThemeSettings({
  theme,
  seo,
  onUpdateTheme,
  onUpdateSeo,
}: {
  theme: any;
  seo: any;
  onUpdateTheme: any;
  onUpdateSeo: any;
}) {
  const bg: BackgroundConfig = theme.background || {
    type: "color",
    color: theme.colorMode === "light" ? "#f8fafc" : "#05080a",
    gradient: "linear-gradient(135deg, #05080a 0%, #062b1e 50%, #05080a 100%)",
    imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=2000&q=80",
    imageOverlayOpacity: 65,
    imageOverlayColor: "#05080a",
    imageBlur: 0,
    imageSize: "cover",
    imagePosition: "center",
    imageAttachment: "fixed",
  };

  const updateBg = (updater: Partial<BackgroundConfig> | ((prev: BackgroundConfig) => BackgroundConfig)) => {
    onUpdateTheme((prev: any) => {
      const currentBg = prev.background || bg;
      const nextBg = typeof updater === "function" ? updater(currentBg) : { ...currentBg, ...updater };
      return {
        ...prev,
        background: nextBg,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* GLOBAL BACKGROUND SECTION */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Palette className="h-4 w-4 text-emerald-400" />
            <span>Global Background</span>
          </h3>
          <p className="text-xs text-white/50">
            Set custom site-wide background color, gradients, or high-res casino images.
          </p>
        </div>

        {/* Segmented Style Switcher: Color | Gradient | Image */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/40 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => updateBg({ type: "color" })}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              bg.type === "color"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <PaintBucket className="h-3.5 w-3.5" />
            <span>Color</span>
          </button>
          <button
            type="button"
            onClick={() => updateBg({ type: "gradient" })}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              bg.type === "gradient"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Gradient</span>
          </button>
          <button
            type="button"
            onClick={() => updateBg({ type: "image" })}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              bg.type === "image"
                ? "bg-emerald-500 text-white shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Image</span>
          </button>
        </div>

        {/* SOLID COLOR CONTROLS */}
        {bg.type === "color" && (
          <div className="space-y-3.5 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div>
              <label className="text-[11px] font-medium text-white/60">Color Palette Presets</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isActive = (bg.color || "#05080a").toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateBg({ color: preset.value })}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                        isActive
                          ? "border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/50"
                          : "border-white/10 bg-black/40 hover:border-white/20"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 shrink-0 rounded-full border ${preset.border || "border-white/20"}`}
                        style={{ backgroundColor: preset.value }}
                      />
                      <span className="truncate text-[11px] font-medium text-white/80">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Input */}
            <div className="border-t border-white/10 pt-3">
              <label className="text-[11px] font-medium text-white/60">Custom Hex Color</label>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="relative flex h-9 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/15">
                  <input
                    type="color"
                    value={bg.color || "#05080a"}
                    onChange={(e) => updateBg({ color: e.target.value })}
                    className="absolute -inset-2 h-14 w-14 cursor-pointer border-0 p-0"
                  />
                </div>
                <input
                  type="text"
                  value={bg.color || "#05080a"}
                  onChange={(e) => updateBg({ color: e.target.value })}
                  placeholder="#05080a"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* GRADIENT CONTROLS */}
        {bg.type === "gradient" && (
          <div className="space-y-3.5 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div>
              <label className="text-[11px] font-medium text-white/60">Luxury Gradient Presets</label>
              <div className="mt-2 space-y-2">
                {GRADIENT_PRESETS.map((preset) => {
                  const isActive = bg.gradient === preset.value;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateBg({ gradient: preset.value })}
                      className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
                        isActive
                          ? "border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/50"
                          : "border-white/10 bg-black/40 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-6 w-10 rounded-md border border-white/20 shadow-inner"
                          style={{ background: preset.value }}
                        />
                        <span className="text-xs font-medium text-white">{preset.name}</span>
                      </div>
                      {isActive && <Check className="h-4 w-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <label className="text-[11px] font-medium text-white/60">Custom CSS Gradient</label>
              <textarea
                rows={2}
                value={bg.gradient || ""}
                onChange={(e) => updateBg({ gradient: e.target.value })}
                placeholder="linear-gradient(135deg, #05080a 0%, #062b1e 100%)"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* IMAGE BACKGROUND CONTROLS */}
        {bg.type === "image" && (
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div>
              <label className="text-[11px] font-medium text-white/60">Curated Casino & Velvet Themes</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {IMAGE_PRESETS.map((preset) => {
                  const isActive = bg.imageUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        updateBg({
                          imageUrl: preset.url,
                          imageOverlayOpacity: preset.recommendedOverlayOpacity,
                        })
                      }
                      className={`group relative overflow-hidden rounded-lg border text-left transition-all ${
                        isActive
                          ? "border-emerald-400 ring-2 ring-emerald-400/50"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <span className="absolute bottom-1.5 left-2 right-2 truncate text-[10px] font-bold text-white">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Image URL */}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <label className="text-[11px] font-medium text-white/60">Custom Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bg.imageUrl || ""}
                  onChange={(e) => updateBg({ imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/20 focus:border-emerald-400 focus:outline-none"
                />
                {bg.imageUrl && (
                  <button
                    type="button"
                    onClick={() => updateBg({ imageUrl: "" })}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Image Tuning Sliders: Overlay Opacity & Blur */}
            <div className="border-t border-white/10 pt-3 space-y-3">
              {/* Overlay Opacity Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-white/60">Dark Overlay Readability Tint</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {bg.imageOverlayOpacity ?? 60}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={95}
                  step={5}
                  value={bg.imageOverlayOpacity ?? 60}
                  onChange={(e) => updateBg({ imageOverlayOpacity: Number(e.target.value) })}
                  className="mt-1.5 w-full accent-emerald-400"
                />
              </div>

              {/* Blur Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-white/60">Background Image Blur</span>
                  <span className="font-mono text-emerald-400 font-bold">{bg.imageBlur ?? 0}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={16}
                  step={1}
                  value={bg.imageBlur ?? 0}
                  onChange={(e) => updateBg({ imageBlur: Number(e.target.value) })}
                  className="mt-1.5 w-full accent-emerald-400"
                />
              </div>

              {/* Size & Attachment Selectors */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <SelectField
                  label="Display Size"
                  value={bg.imageSize || "cover"}
                  options={[
                    { label: "Cover (Fill Screen)", value: "cover" },
                    { label: "Contain (Fit Aspect)", value: "contain" },
                    { label: "Repeat (Tile Pattern)", value: "repeat" },
                  ]}
                  onChange={(v) => updateBg({ imageSize: v as any })}
                />
                <SelectField
                  label="Scroll Attachment"
                  value={bg.imageAttachment || "fixed"}
                  options={[
                    { label: "Fixed (Parallax Feel)", value: "fixed" },
                    { label: "Scroll with Page", value: "scroll" },
                  ]}
                  onChange={(v) => updateBg({ imageAttachment: v as any })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* THEME TOKENS */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Theme & Layout Tokens</h3>

        <SelectField
          label="Theme Appearance Mode"
          value={theme.colorMode || "dark"}
          options={[
            { label: "Dark Mode (Obsidian & Emerald/Gold)", value: "dark" },
            { label: "Light Mode (Porcelain & Slate/Emerald)", value: "light" },
          ]}
          onChange={(v) => onUpdateTheme((prev: any) => ({ ...prev, colorMode: v }))}
        />

        <SelectField
          label="Primary Color Scheme"
          value={theme.primaryGradient}
          options={[
            { label: "Emerald & Gold (Default Royal)", value: "emerald-gold" },
            { label: "Royal Sapphire & Gold", value: "royal-sapphire" },
            { label: "Midnight Ruby & Crimson", value: "midnight-ruby" },
          ]}
          onChange={(v) => onUpdateTheme((prev: any) => ({ ...prev, primaryGradient: v }))}
        />

        <SelectField
          label="Card Corner Radius"
          value={theme.borderRadius}
          options={[
            { label: "Medium (16px / rounded-xl)", value: "rounded-xl" },
            { label: "Large (24px / rounded-2xl)", value: "rounded-2xl" },
            { label: "Extra Large (32px / rounded-3xl)", value: "rounded-3xl" },
          ]}
          onChange={(v) => onUpdateTheme((prev: any) => ({ ...prev, borderRadius: v }))}
        />

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div>
            <div className="text-xs font-medium text-white">Film Noise Texture</div>
            <div className="text-[11px] text-white/50">Adds subtle luxury overlay grain</div>
          </div>
          <input
            type="checkbox"
            checked={theme.noiseOverlay}
            onChange={(e) =>
              onUpdateTheme((prev: any) => ({ ...prev, noiseOverlay: e.target.checked }))
            }
            className="h-4 w-4 rounded accent-emerald-500"
          />
        </div>
      </div>

      {/* SEO & SOCIAL SHARING */}
      <div className="border-t border-white/10 pt-4">
        <h3 className="text-sm font-semibold text-white">SEO & Social Sharing</h3>
        <p className="text-xs text-white/50">Search engine title and description tags.</p>

        <div className="mt-3 space-y-3">
          <InputField
            label="Page Title Tag"
            value={seo.title}
            onChange={(v) => onUpdateSeo((prev: any) => ({ ...prev, title: v }))}
          />
          <TextAreaField
            label="Meta Description"
            value={seo.description}
            onChange={(v) => onUpdateSeo((prev: any) => ({ ...prev, description: v }))}
          />
        </div>
      </div>
    </div>
  );
}

/* ——— Reusable Form Helper Inputs ——— */
function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="text-[11px] font-medium text-white/60">{label}</label>
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/20 transition-all focus:border-emerald-400 focus:bg-black/60 focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}) {
  return (
    <MarkdownEditor
      label={label}
      value={value}
      onChange={onChange}
      rows={rows}
    />
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="text-[11px] font-medium text-white/60">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-[#06090c] px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

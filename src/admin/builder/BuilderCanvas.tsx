import { useState } from "react";
import {
  Edit3,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Plus,
} from "lucide-react";
import { useSiteStore, type SectionConfig } from "../../store/siteStore";

// Components
import { Navbar } from "../../components/Navbar";
import { AnnouncementBanner } from "../../components/AnnouncementBanner";
import { Hero } from "../../components/Hero";
import { SocialProof } from "../../components/SocialProof";
import { Features } from "../../components/Features";
import { ProductShowcase } from "../../components/ProductShowcase";
import { Benefits } from "../../components/Benefits";
import { Testimonials } from "../../components/Testimonials";
import { Pricing } from "../../components/Pricing";
import { FAQ } from "../../components/FAQ";
import { FinalCTA } from "../../components/FinalCTA";
import { GlobalBackground } from "../../components/GlobalBackground";
import { Footer } from "../../components/Footer";

export function BuilderCanvas() {
  const {
    draftConfig,
    deviceMode,
    previewOnly,
    selectedSectionId,
    setSelectedSectionId,
    moveSection,
    duplicateSection,
    deleteSection,
    addSection,
  } = useSiteStore();

  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  // Device frame constraints
  const frameStyles = {
    desktop: "w-full",
    tablet: "w-[768px] min-h-[1024px] my-6 rounded-[36px] border-[10px] border-[#1e293b] shadow-2xl shadow-black/80 overflow-hidden",
    mobile: "w-[390px] min-h-[844px] my-8 rounded-[44px] border-[12px] border-[#1e293b] shadow-2xl shadow-black/80 overflow-hidden",
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#030608] custom-scrollbar">
      <div className="flex min-h-full justify-center p-0 md:p-4">
        <div
          className={`relative transition-all duration-300 ${frameStyles[deviceMode]}`}
        >
          {/* Mock Phone Notch on Mobile preview */}
          {deviceMode === "mobile" && !previewOnly && (
            <div className="sticky top-0 z-50 flex h-7 items-center justify-between bg-black px-6 text-[10px] font-semibold text-white">
              <span>9:41</span>
              <div className="h-4 w-20 rounded-full bg-[#1e293b]" />
              <span>100%</span>
            </div>
          )}

          {/* Actual Site Render */}
          <div
            data-theme={draftConfig.theme.colorMode || "dark"}
            className={`relative min-h-screen transition-colors duration-300 ${
              draftConfig.theme.colorMode === "light"
                ? "theme-light text-[#0f172a]"
                : "text-white"
            }`}
          >
            {/* Dynamic Global Background Layer */}
            <GlobalBackground
              background={draftConfig.theme.background}
              colorMode={draftConfig.theme.colorMode || "dark"}
              isCanvas={true}
            />

            {/* Global noise texture if enabled */}
            {draftConfig.theme.noiseOverlay && (
              <div className="pointer-events-none fixed inset-0 z-[1] noise" />
            )}

            <div className="relative z-[2]">
              <Navbar />

              <main>
                {draftConfig.sections.map((sec, index) => {
                  if (!sec.visible && previewOnly) return null;

                  const isSelected = sec.id === selectedSectionId;
                  const isHovered = sec.id === hoveredSectionId;

                  return (
                    <div
                      key={sec.id}
                      onMouseEnter={() => setHoveredSectionId(sec.id)}
                      onMouseLeave={() => setHoveredSectionId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!previewOnly) {
                          setSelectedSectionId(sec.id);
                        }
                      }}
                      className={`relative transition-all ${
                        !sec.visible && !previewOnly ? "opacity-35 grayscale" : ""
                      } ${
                        !previewOnly
                          ? isSelected
                            ? "outline outline-2 outline-emerald-400 outline-offset-[-2px] shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                            : isHovered
                            ? "outline outline-1 outline-emerald-400/40 outline-offset-[-1px]"
                            : ""
                          : ""
                      }`}
                    >
                      {/* Elementor Floating Action Bar on Hover/Select */}
                      {!previewOnly && (isSelected || isHovered) && (
                        <div
                          className={`absolute left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-emerald-400/40 bg-[#06090c]/95 px-3 py-1 text-xs text-white shadow-2xl backdrop-blur-xl ${
                            index === 0 ? "top-16" : "top-2"
                          }`}
                        >
                          <span className="font-semibold text-emerald-300">
                            {sec.label}
                          </span>

                          <div className="mx-1.5 h-3 w-px bg-white/20" />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSectionId(sec.id);
                            }}
                            className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 hover:bg-emerald-500/30"
                            title="Edit this section"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(index, index - 1);
                            }}
                            disabled={index === 0}
                            className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(index, index + 1);
                            }}
                            disabled={index === draftConfig.sections.length - 1}
                            className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSection(sec.id);
                            }}
                            className="p-1 text-white/70 hover:text-white"
                            title="Duplicate"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete "${sec.label}"?`)) deleteSection(sec.id);
                            }}
                            className="p-1 text-rose-400 hover:text-rose-300"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Render Section Component */}
                      <RenderSectionContent section={sec} />
                    </div>
                  );
                })}

                {/* Quick Add Section Button at the bottom of canvas */}
                {!previewOnly && (
                  <div className="my-12 flex justify-center px-4">
                    <button
                      onClick={() => addSection("announcement")}
                      className="group flex items-center gap-2 rounded-full border border-dashed border-emerald-400/40 bg-emerald-500/5 px-6 py-3 text-xs font-semibold text-emerald-300 transition-all hover:border-emerald-400 hover:bg-emerald-500/10 active:scale-95"
                    >
                      <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                      <span>+ Add New Section or Widget</span>
                    </button>
                  </div>
                )}
              </main>

              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderSectionContent({ section }: { section: SectionConfig }) {
  switch (section.type) {
    case "announcement":
      return <AnnouncementBanner data={section.data} />;
    case "hero":
      return <Hero dynamicData={section.data} />;
    case "social_proof":
      return <SocialProof dynamicData={section.data} />;
    case "features":
      return <Features dynamicData={section.data} />;
    case "showcase":
      return <ProductShowcase dynamicData={section.data} />;
    case "benefits":
      return <Benefits dynamicData={section.data} />;
    case "testimonials":
      return <Testimonials dynamicData={section.data} />;
    case "pricing":
      return <Pricing dynamicData={section.data} />;
    case "faq":
      return <FAQ dynamicData={section.data} />;
    case "final_cta":
      return <FinalCTA dynamicData={section.data} />;
    default:
      return null;
  }
}

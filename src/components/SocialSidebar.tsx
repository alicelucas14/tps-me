import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ExternalLink, Share2 } from "lucide-react";
import { useSiteStore, defaultFooterConfig, type FooterSocialItem } from "../store/siteStore";

interface SocialPlatform {
  id: string;
  name: string;
  shortName: string;
  actionText: string;
  defaultUrl: string;
  brandColor: string;
  hoverBg: string;
  glowColor: string;
  gradient?: string;
  svgPath: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "facebook",
    name: "Facebook",
    shortName: "FB",
    actionText: "Follow Page",
    defaultUrl: "https://facebook.com",
    brandColor: "#1877F2",
    hoverBg: "hover:bg-[#1877F2]",
    glowColor: "rgba(24, 119, 242, 0.45)",
    svgPath:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    id: "youtube",
    name: "YouTube",
    shortName: "YT",
    actionText: "Subscribe",
    defaultUrl: "https://youtube.com",
    brandColor: "#FF0000",
    hoverBg: "hover:bg-[#FF0000]",
    glowColor: "rgba(255, 0, 0, 0.45)",
    svgPath:
      "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    id: "x",
    name: "X (Twitter)",
    shortName: "X",
    actionText: "Follow Updates",
    defaultUrl: "https://x.com",
    brandColor: "#ffffff",
    hoverBg: "hover:bg-neutral-800",
    glowColor: "rgba(255, 255, 255, 0.35)",
    svgPath:
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    id: "instagram",
    name: "Instagram",
    shortName: "IG",
    actionText: "Follow Us",
    defaultUrl: "https://instagram.com",
    brandColor: "#E1306C",
    hoverBg: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]",
    glowColor: "rgba(225, 48, 108, 0.45)",
    svgPath:
      "M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    id: "telegram",
    name: "Telegram",
    shortName: "TG",
    actionText: "Join Channel",
    defaultUrl: "https://t.me",
    brandColor: "#229ED9",
    hoverBg: "hover:bg-[#229ED9]",
    glowColor: "rgba(34, 158, 217, 0.45)",
    svgPath:
      "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    shortName: "WA",
    actionText: "Chat on WhatsApp",
    defaultUrl: "https://wa.me",
    brandColor: "#25D366",
    hoverBg: "hover:bg-[#25D366]",
    glowColor: "rgba(37, 211, 102, 0.45)",
    svgPath:
      "M17.507 14.307l-.009.075c-.238-.12-1.406-.697-1.624-.777-.219-.079-.378-.12-.538.12-.159.239-.617.777-.756.936-.139.16-.279.179-.518.06-.239-.12-1.009-.372-1.923-1.187-.711-.634-1.191-1.418-1.33-1.657-.14-.239-.015-.368.105-.487.108-.107.239-.279.359-.418.12-.14.16-.239.24-.398.079-.16.039-.299-.02-.419-.06-.119-.538-1.295-.737-1.773-.194-.464-.391-.401-.538-.409l-.458-.008c-.16 0-.418.06-.638.3-.219.239-.837.818-.837 1.994 0 1.176.857 2.311.977 2.471.12.16 1.686 2.574 4.084 3.609.57.246 1.016.393 1.363.504.573.183 1.095.157 1.507.096.46-.069 1.406-.575 1.605-1.131.199-.557.199-1.036.14-1.136-.06-.099-.22-.16-.459-.279zM12 2.163c-5.424 0-9.837 4.413-9.837 9.837 0 1.733.452 3.425 1.312 4.915L2 22l5.244-1.375c1.439.785 3.064 1.2 4.756 1.2 5.424 0 9.837-4.413 9.837-9.837 0-5.424-4.413-9.825-9.837-9.825zm0 17.925c-1.47 0-2.91-.396-4.165-1.144l-.299-.178-3.095.812.826-3.017-.195-.31c-.822-1.309-1.257-2.827-1.257-4.388 0-4.482 3.646-8.128 8.13-8.128 4.484 0 8.13 3.646 8.13 8.128 0 4.482-3.646 8.127-8.13 8.127z",
  },
];

export function SocialSidebar() {
  const { publishedConfig } = useSiteStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Sync social URLs from store/footer settings if customized
  const storeSocials = useMemo(() => {
    let list: FooterSocialItem[] = publishedConfig?.footer?.socials || defaultFooterConfig.socials || [];
    try {
      const savedStr = typeof window !== "undefined" ? localStorage.getItem("tps_brand_footer_v1") : null;
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        if (parsed?.socials && Array.isArray(parsed.socials)) {
          list = parsed.socials;
        }
      }
    } catch {}
    return list;
  }, [publishedConfig?.footer?.socials]);

  // Resolve active URL for each platform
  const items = useMemo(() => {
    return SOCIAL_PLATFORMS.map((platform) => {
      const matched = storeSocials.find((s) => {
        const sName = (s.name || "").toLowerCase();
        const pId = platform.id.toLowerCase();
        return (
          sName.includes(pId) ||
          (pId === "x" && (sName.includes("twitter") || sName === "x")) ||
          (pId === "whatsapp" && sName.includes("what"))
        );
      });

      return {
        ...platform,
        url: matched?.url?.trim() || platform.defaultUrl,
      };
    });
  }, [storeSocials]);

  return (
    <>
      {/* ========================================================
          DESKTOP & TABLET FLOATING SIDEBAR (MD and UP)
          Fixed on the right edge, vertically centered
          ======================================================== */}
      <aside
        aria-label="Social Media Channels"
        className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300"
      >
        <div className="relative flex items-center">
          {/* Main Social Dock Container */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{
              x: isCollapsed ? "calc(100% - 10px)" : 0,
              opacity: 1,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative flex flex-col items-center rounded-l-2xl border-y border-l border-white/10 bg-[#060a0e]/90 p-2 shadow-2xl backdrop-blur-xl"
            style={{
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(245, 194, 66, 0.08)",
            }}
          >
            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Social Bar" : "Collapse Social Bar"}
              className="group absolute -left-7 top-1/2 -translate-y-1/2 flex h-8 w-7 items-center justify-center rounded-l-xl border-y border-l border-white/10 bg-[#080e14]/95 text-white/60 shadow-lg backdrop-blur-md transition-all hover:bg-emerald-500/20 hover:text-white hover:border-emerald-400/40"
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? (
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>

            {/* Subtle Golden Brand Indicator Header */}
            <div className="mb-2 flex flex-col items-center pt-1 pb-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#f5c242]/80 select-none">
                Socials
              </span>
              <div className="mt-1 h-0.5 w-4 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400" />
            </div>

            {/* List of Social Network Buttons */}
            <div className="flex flex-col gap-2">
              {items.map((item) => {
                const isHovered = hoveredId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Tooltip Flyout (Appears to the left of the button on hover) */}
                    <AnimatePresence>
                      {isHovered && !isCollapsed && (
                        <motion.a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: 10, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 8, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="pointer-events-auto absolute right-[100%] mr-3 flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-white/15 bg-[#0a1117]/95 px-3 py-1.5 shadow-2xl backdrop-blur-xl text-white hover:border-white/30"
                          style={{
                            boxShadow: `0 8px 25px -4px ${item.glowColor}, 0 0 15px rgba(0,0,0,0.8)`,
                          }}
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold leading-tight text-white flex items-center gap-1.5">
                              {item.name}
                              <ExternalLink className="h-3 w-3 text-white/50" />
                            </span>
                            <span className="text-[10px] font-medium text-emerald-400/90 leading-tight">
                              {item.actionText}
                            </span>
                          </div>
                          {/* Triangle pointer */}
                          <div
                            className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 border-r border-t border-white/15 bg-[#0a1117]"
                          />
                        </motion.a>
                      )}
                    </AnimatePresence>

                    {/* Social Icon Button */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${item.name} page`}
                      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 ${item.hoverBg} hover:border-transparent hover:text-white hover:scale-110 active:scale-95`}
                      style={{
                        boxShadow: isHovered
                          ? `0 0 20px ${item.glowColor}`
                          : "none",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                        fill="currentColor"
                      >
                        <path d={item.svgPath} />
                      </svg>
                    </a>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </aside>

      {/* ========================================================
          MOBILE FLOATING TRIGGER & SPEED-DIAL (SCREEN < MD)
          Floating button docked at bottom-right or side
          ======================================================== */}
      <div className="md:hidden fixed right-3 bottom-20 z-40">
        {/* Expanded Mobile Socials Menu */}
        <AnimatePresence>
          {mobileExpanded && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileExpanded(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              />

              {/* Popup Drawer / Speed Dial List */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative z-40 mb-3 flex flex-col gap-2 rounded-2xl border border-white/15 bg-[#090f14]/95 p-3 shadow-2xl backdrop-blur-2xl"
                style={{
                  boxShadow: "0 10px 40px rgba(0,0,0,0.9), 0 0 25px rgba(245, 194, 66, 0.15)",
                }}
              >
                <div className="px-2 pt-1 pb-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Connect With Us
                  </span>
                  <span className="text-[10px] text-white/40">Official Channels</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {items.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileExpanded(false)}
                      className={`flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-white/80 transition-all active:scale-95 ${item.hoverBg} hover:text-white`}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: item.brandColor }}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                          <path d={item.svgPath} />
                        </svg>
                      </div>
                      <div className="flex flex-col overflow-hidden text-left">
                        <span className="truncate text-xs font-bold text-white">
                          {item.name.replace(" (Twitter)", "")}
                        </span>
                        <span className="truncate text-[9px] text-white/50">
                          {item.actionText}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Action Button (FAB) */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMobileExpanded(!mobileExpanded)}
          aria-label="Open Social Channels"
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-gradient-to-br from-[#0c141c] to-[#04070a] text-amber-400 shadow-2xl shadow-black/80 backdrop-blur-xl"
          style={{
            boxShadow: "0 0 20px rgba(245, 194, 66, 0.25), 0 8px 25px rgba(0,0,0,0.8)",
          }}
        >
          {/* Subtle pulsating golden halo */}
          <span className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-amber-400/10" />

          {mobileExpanded ? (
            <ChevronRight className="h-5 w-5 text-white rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Share2 className="h-5 w-5 text-[#f5c242]" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
}

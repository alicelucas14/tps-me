import { Sparkles, ArrowRight } from "lucide-react";
import type { AnnouncementSectionData } from "../store/siteStore";

export function AnnouncementBanner({ data }: { data: AnnouncementSectionData }) {
  const bgStyles = {
    gold: "from-amber-500/20 via-amber-400/10 to-amber-600/20 border-amber-400/30 text-amber-200",
    emerald: "from-emerald-500/20 via-emerald-400/10 to-emerald-600/20 border-emerald-400/30 text-emerald-200",
    ruby: "from-rose-500/20 via-rose-400/10 to-rose-600/20 border-rose-400/30 text-rose-200",
  };

  const badgeStyles = {
    gold: "bg-amber-400 text-[#1a1205]",
    emerald: "bg-emerald-400 text-[#05080a]",
    ruby: "bg-rose-400 text-white",
  };

  return (
    <div className="relative z-40 w-full px-4 pt-20 md:pt-24">
      <div className="mx-auto max-w-5xl">
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-gradient-to-r p-3.5 backdrop-blur-xl shadow-lg transition-all ${
            bgStyles[data.bgColor || "gold"]
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                badgeStyles[data.bgColor || "gold"]
              }`}
            >
              {data.badge || "NEW"}
            </span>
            <span className="text-xs font-medium text-white/90 md:text-sm">
              {data.text}
            </span>
          </div>

          {data.linkText && (
            <a
              href={data.linkUrl || "#download"}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white transition-all hover:bg-white/20"
            >
              <Sparkles className="h-3 w-3" />
              <span>{data.linkText}</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

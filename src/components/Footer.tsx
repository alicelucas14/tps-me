import { Crown } from "lucide-react";
import { useSiteStore, defaultFooterConfig } from "../store/siteStore";

export function Footer() {
  const { publishedConfig } = useSiteStore();
  const footer = publishedConfig?.footer || defaultFooterConfig;

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#030507]">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 shadow-lg">
                <Crown className="h-5 w-5 text-[#f5c242]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold tracking-tight text-white">
                  {footer.brandTitle || "Teen Patti"}{" "}
                  <span className="gradient-text-gold">{footer.brandAccent || "Stars"}</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {footer.brandSubtitle || "Premium Edition"}
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-white/50">
              {footer.description}
            </p>

            {/* Social */}
            {footer.socials && footer.socials.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {footer.socials.map((s) => (
                  <a
                    key={s.id || s.name}
                    href={s.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {footer.columns &&
              footer.columns.map((col) => (
                <div key={col.id || col.title}>
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/80">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links &&
                      col.links.map((item) => (
                        <li key={item.id || item.label}>
                          <a
                            href={item.href}
                            target={item.target}
                            rel={item.target ? "noreferrer" : undefined}
                            className="text-sm text-white/50 transition-colors hover:text-white"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        {/* Legal & disclaimers */}
        <div className="mt-16 rounded-2xl border border-white/5 bg-white/[0.015] p-6">
          {footer.badges && footer.badges.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {footer.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    badge.toLowerCase().includes("rng") || badge.toLowerCase().includes("seo")
                      ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/70"
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          {footer.disclaimer && (
            <p className="text-xs leading-relaxed text-white/40">
              <span className="font-semibold text-white/60">Disclaimer:</span>{" "}
              {footer.disclaimer.replace(/^Disclaimer:\s*/i, "")}
            </p>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 md:flex-row md:items-center">
          <div className="text-xs text-white/40">
            {footer.copyright} {footer.cinNumber}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            <a href="/sitemap" className="hover:text-white">
              HTML Sitemap
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <a href="/sitemap.xml" target="_blank" className="hover:text-emerald-400">
              XML Sitemap
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <a href="/llms.txt" target="_blank" className="hover:text-amber-400">
              llms.txt (AI)
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <a href="/admin" className="hover:text-emerald-400 font-medium">
              Admin HQ
            </a>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-emerald-300">
                {footer.systemStatusText || "All systems operational"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

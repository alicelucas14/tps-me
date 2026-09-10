import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Crown, Download, Sun, Moon } from "lucide-react";
import { cn } from "../utils/cn";
import { useSiteStore, defaultFooterConfig } from "../store/siteStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How to Play", href: "/players-guide" },
  { label: "VIP Club", href: "/loyalty-programs" },
  { label: "Blog & News", href: "/blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { publishedConfig, toggleColorMode } = useSiteStore();
  const brand = publishedConfig.footer || defaultFooterConfig;

  const isLight = publishedConfig.theme.colorMode === "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 md:px-5",
            scrolled
              ? "glass-strong border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
              : "border border-transparent"
          )}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            {brand.logoType === "image" && brand.logoImageUrl ? (
              <img
                src={brand.logoImageUrl}
                alt={`${brand.brandTitle || "Teen Patti"} ${brand.brandAccent || "Stars"}`}
                className="h-9 w-auto max-h-9 max-w-[200px] object-contain"
              />
            ) : (
              <>
                <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)] shrink-0">
                  <Crown className="h-4.5 w-4.5 text-[#f5c242]" strokeWidth={2.5} />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className={cn("text-[15px] font-semibold tracking-tight", isLight ? "text-slate-900" : "text-white")}>
                    {brand.brandTitle || "Teen Patti"}{" "}
                    {brand.brandAccent && <span className="gradient-text-gold">{brand.brandAccent}</span>}
                  </span>
                  {brand.brandSubtitle && (
                    <span className={cn("text-[10px] uppercase tracking-[0.18em]", isLight ? "text-slate-500" : "text-white/40")}>
                      {brand.brandSubtitle}
                    </span>
                  )}
                </div>
              </>
            )}
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  isLight
                    ? "text-slate-700 hover:text-slate-950 hover:bg-black/5"
                    : "text-white/70 hover:text-white"
                )}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA & Theme Mode Switcher */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleColorMode}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border transition-all",
                isLight
                  ? "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
                  : "border-white/10 bg-white/5 text-white/80 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
              )}
              title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
              aria-label="Toggle theme mode"
            >
              {isLight ? (
                <Moon className="h-4 w-4 text-slate-700" />
              ) : (
                <Sun className="h-4 w-4 text-amber-300" />
              )}
            </button>

            <a
              href="#download"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isLight ? "text-slate-700 hover:text-slate-950" : "text-white/80 hover:text-white"
              )}
            >
              Sign In
            </a>
            <a
              href="#download"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-b from-[#ffd96b] via-[#f5c242] to-[#c98a1a] px-5 text-sm font-semibold text-[#1a1205] btn-gold-glow transition-all hover:brightness-110"
            >
              <Download className="h-4 w-4" />
              Get the App
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleColorMode}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-lg border",
                isLight
                  ? "border-slate-300 bg-slate-100 text-slate-800"
                  : "border-white/10 bg-white/5 text-white/80"
              )}
              aria-label="Toggle theme mode"
            >
              {isLight ? (
                <Moon className="h-4 w-4 text-slate-700" />
              ) : (
                <Sun className="h-4 w-4 text-amber-300" />
              )}
            </button>

            <button
              className={cn(
                "grid h-10 w-10 place-items-center rounded-lg border",
                isLight
                  ? "border-slate-300 bg-slate-100 text-slate-800"
                  : "border-white/10 bg-white/5 text-white"
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mt-2 overflow-hidden rounded-2xl border p-3 md:hidden",
                isLight
                  ? "border-slate-200 bg-white/95 text-slate-900 shadow-xl backdrop-blur-xl"
                  : "glass-strong border-white/10 text-white"
              )}
            >
              <div className="flex flex-col">
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium",
                      isLight ? "text-slate-800 hover:bg-slate-100" : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {l.label}
                  </a>
                ))}
                <div className={cn("mt-2 flex flex-col gap-2 border-t p-2", isLight ? "border-slate-200" : "border-white/10")}>
                  <a
                    href="#download"
                    className={cn(
                      "rounded-xl px-4 py-3 text-center text-sm font-medium",
                      isLight ? "text-slate-700 hover:bg-slate-100" : "text-white/80 hover:bg-white/5"
                    )}
                  >
                    Sign In
                  </a>
                  <a
                    href="#download"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#ffd96b] via-[#f5c242] to-[#c98a1a] px-5 py-3 text-sm font-semibold text-[#1a1205]"
                  >
                    <Download className="h-4 w-4" />
                    Get the App
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

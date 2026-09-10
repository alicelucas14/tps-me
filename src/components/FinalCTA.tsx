import { motion } from "framer-motion";
import { Download, Sparkles, QrCode } from "lucide-react";
import { FadeIn } from "./ui";
import type { FinalCTASectionData } from "../store/siteStore";

export function FinalCTA({ dynamicData }: { dynamicData?: FinalCTASectionData }) {
  const d: FinalCTASectionData = dynamicData || {
    badge: "Limited · ₹500 welcome bonus ends Sunday",
    titlePrefix: "Your seat at the table is ",
    titleAccent: "waiting.",
    titleSuffix: "",
    subtitle:
      "Download Teen Patti Stars, complete 60-second KYC, and start playing with ₹500 on us. 50 lakh Indians already have.",
    androidCta: "Download for Android",
    iosCta: "App Store (iOS)",
    promoCode: "₹500 BONUS",
    smsText: "Or text STARS to 56161 for a download link",
  };

  return (
    <section id="download" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0a1f1a] via-[#05080a] to-[#05080a] p-8 md:p-16">
          {/* Ambient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px] animate-float-slow" />
            <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-amber-400/10 blur-[120px] animate-float-med" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage:
                  "radial-gradient(ellipse at center, black 40%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 40%, transparent 80%)",
              }}
            />
          </div>

          {/* Decorative cards */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: -12 }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -left-8 top-20 hidden h-32 w-24 rotate-[-12deg] rounded-xl bg-white/5 opacity-20 shadow-2xl lg:block"
          />
          <motion.div
            animate={{ y: [0, 12, 0], rotate: 15 }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute -right-4 bottom-20 hidden h-28 w-20 rotate-[15deg] rounded-xl bg-white/5 opacity-20 shadow-2xl lg:block"
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            {/* LEFT */}
            <div>
              {d.badge && (
                <FadeIn>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-medium text-amber-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    {d.badge}
                  </div>
                </FadeIn>
              )}

              <FadeIn delay={0.05}>
                <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {d.titlePrefix}
                  <span className="italic font-display gradient-text-gold font-normal">
                    {d.titleAccent}
                  </span>
                  {d.titleSuffix}
                </h2>
              </FadeIn>

              <FadeIn delay={0.1}>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/60">
                  {d.subtitle}
                </p>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#download"
                    className="group inline-flex h-14 items-center gap-3 rounded-full bg-gradient-to-b from-[#ffd96b] via-[#f5c242] to-[#c98a1a] px-7 text-[15px] font-semibold text-[#1a1205] btn-gold-glow transition-all hover:brightness-110"
                  >
                    <Download className="h-5 w-5" />
                    {d.androidCta || "Download for Android"}
                  </a>
                  <a
                    href="#download"
                    className="group inline-flex h-14 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 text-[15px] font-medium text-white transition-all hover:bg-white/10 hover:border-white/25"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M17.05 12.04c-.02-2.44 2-3.62 2.09-3.68-1.14-1.67-2.92-1.9-3.55-1.92-1.51-.15-2.95.89-3.71.89-.77 0-1.95-.87-3.21-.85-1.66.02-3.19.97-4.04 2.46-1.73 3-.44 7.42 1.24 9.85.82 1.19 1.79 2.52 3.06 2.47 1.23-.05 1.69-.79 3.18-.79 1.48 0 1.9.79 3.2.77 1.32-.02 2.15-1.21 2.96-2.4.94-1.38 1.33-2.71 1.35-2.78-.03-.01-2.58-1-2.61-3.93M14.3 4.83c.68-.82 1.13-1.96 1.01-3.1-.98.04-2.16.65-2.86 1.47-.62.72-1.17 1.88-1.03 2.99 1.09.09 2.2-.55 2.88-1.36" />
                    </svg>
                    {d.iosCta || "App Store (iOS)"}
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-white/40">
                  <span>Available on</span>
                  <span className="font-medium text-white/70">Android 7+</span>
                  <span>·</span>
                  <span className="font-medium text-white/70">iOS 14+</span>
                  <span>·</span>
                  <span className="font-medium text-white/70">Web</span>
                </div>
              </FadeIn>
            </div>

            {/* RIGHT: QR */}
            <FadeIn delay={0.15}>
              <div className="mx-auto w-full max-w-sm">
                <div className="glass-strong relative overflow-hidden rounded-3xl border border-white/10 p-6">
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                  <div className="flex items-center gap-3 border-b border-white/5 pb-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-400/20">
                      <QrCode className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Scan to download
                      </div>
                      <div className="text-xs text-white/50">
                        Point your camera here
                      </div>
                    </div>
                  </div>

                  {/* QR mock */}
                  <div className="my-6 rounded-2xl bg-white p-5">
                    <div className="grid grid-cols-12 gap-0.5">
                      {Array.from({ length: 144 }).map((_, i) => {
                        const row = Math.floor(i / 12);
                        const col = i % 12;
                        const corner =
                          (row < 3 && col < 3) ||
                          (row < 3 && col > 8) ||
                          (row > 8 && col < 3);
                        const filled = corner || (i * 7 + 13) % 3 === 0;
                        return (
                          <div
                            key={i}
                            className={`aspect-square ${
                              filled ? "bg-[#05080a]" : "bg-transparent"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {d.promoCode && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
                      <div className="text-xs text-white/60">Auto-applied</div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        {d.promoCode}
                      </div>
                    </div>
                  )}
                </div>

                {d.smsText && (
                  <div className="mt-4 text-center text-xs text-white/40">
                    {d.smsText}
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

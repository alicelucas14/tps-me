import { motion } from "framer-motion";
import { Download, Play, ShieldCheck, Zap, Star } from "lucide-react";
import { Button, Eyebrow, FadeIn, PlayingCard } from "./ui";
import type { HeroSectionData } from "../store/siteStore";

export function Hero({ dynamicData }: { dynamicData?: HeroSectionData }) {
  const d: HeroSectionData = dynamicData || {
    eyebrow: "Diwali Edition · ₹25 Cr Prize Pool Live",
    titlePrefix: "India's most ",
    titleAccent: "refined",
    titleSuffix: " Teen Patti experience.",
    subtitle:
      "Play with 50 lakh+ verified players. Instant UPI payouts in under 30 seconds. Fair-play RNG certified. Zero bots. Pure thrill.",
    primaryCtaText: "Download Free · Get ₹500",
    primaryCtaLink: "#download",
    secondaryCtaText: "Watch 45-sec Tour",
    secondaryCtaLink: "#showcase",
    trustText: "50L+ players already in",
    ratingText: "4.8 · 2.1L reviews",
    tableTitle: "Diwali Mega Table",
    tablePrize: "₹25 Cr",
    tablePlayers: "4,218 playing now",
  };

  const isNoVisual = d.visualType === "none";

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(245,194,66,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(16,185,129,0.1),transparent_60%)]" />
        <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        {/* Floating orbs */}
        <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-emerald-500/20 blur-[120px] animate-float-slow" />
        <div className="absolute right-[10%] top-[40%] h-80 w-80 rounded-full bg-amber-400/10 blur-[140px] animate-float-med" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <div className={`grid items-center gap-12 ${isNoVisual ? "grid-cols-1" : "lg:grid-cols-12"}`}>
          {/* LEFT / CENTER copy */}
          <div className={isNoVisual ? "mx-auto max-w-4xl text-center" : "lg:col-span-6"}>
            <FadeIn>
              <Eyebrow className={`mb-6 ${isNoVisual ? "mx-auto" : ""}`}>
                <span className="text-white/80">{d.eyebrow}</span>
              </Eyebrow>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h1 className="text-balance text-[44px] font-semibold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-[72px]">
                {d.titlePrefix}
                <span className="italic font-display gradient-text-emerald font-normal">
                  {d.titleAccent}
                </span>
                {d.titleSuffix}
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className={`mt-6 text-lg leading-relaxed text-white/65 md:text-xl ${isNoVisual ? "mx-auto max-w-2xl" : "max-w-xl"}`}>
                {d.subtitle}
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.15}>
              <div className={`mt-9 flex flex-wrap items-center gap-3 ${isNoVisual ? "justify-center" : ""}`}>
                <Button href={d.primaryCtaLink || "#download"} size="lg">
                  <Download className="h-4.5 w-4.5" />
                  {d.primaryCtaText}
                </Button>
                <Button href={d.secondaryCtaLink || "#showcase"} variant="outline" size="lg">
                  <Play className="h-4 w-4 fill-current" />
                  {d.secondaryCtaText}
                </Button>
              </div>
            </FadeIn>

            {/* Trust row */}
            <FadeIn delay={0.2}>
              <div className={`mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50 ${isNoVisual ? "justify-center" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-full border-2 border-[#05080a] bg-gradient-to-br from-emerald-300 to-amber-400"
                      />
                    ))}
                  </div>
                  <span>
                    <span className="text-white">{d.trustText}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span>
                    <span className="text-white">{d.ratingText}</span>
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT visual (hidden if visualType === 'none') */}
          {!isNoVisual && (
            <div className="relative lg:col-span-6">
              <FadeIn delay={0.1} y={0}>
                {d.visualType === "custom-image" && d.customImageUrl ? (
                  <div className="relative mx-auto w-full max-w-[560px]">
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[100px] animate-glow" />
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-[0_40px_120px_-30px_rgba(16,185,129,0.4)] backdrop-blur-xl"
                    >
                      <img
                        src={d.customImageUrl}
                        alt={d.customImageAlt || d.titlePrefix + d.titleAccent}
                        className="w-full h-auto object-cover max-h-[500px]"
                      />
                    </motion.div>
                  </div>
                ) : (
                  <HeroVisual tableTitle={d.tableTitle} tablePrize={d.tablePrize} tablePlayers={d.tablePlayers} />
                )}
              </FadeIn>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroVisual({
  tableTitle = "Diwali Mega Table",
  tablePrize = "₹25 Cr",
  tablePlayers = "4,218 playing now",
}: {
  tableTitle?: string;
  tablePrize?: string;
  tablePlayers?: string;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Glow behind */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[100px] animate-glow" />
      </div>

      {/* Phone mockup */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative mx-auto w-[68%] max-w-[300px]"
      >
        <div className="relative rounded-[44px] border border-white/10 bg-gradient-to-b from-[#0f171a] to-[#05080a] p-2 shadow-[0_40px_120px_-30px_rgba(16,185,129,0.4)]">
          <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-900/40 via-[#05080a] to-[#05080a]">
            {/* status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] font-semibold text-white/70">
              <span>9:41</span>
              <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
              <span>100%</span>
            </div>

            {/* App UI */}
            <div className="px-4 pb-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">
                    Balance
                  </div>
                  <div className="text-lg font-semibold text-white">₹ 24,580</div>
                </div>
                <button className="rounded-full bg-gradient-to-b from-[#ffd96b] to-[#c98a1a] px-3 py-1.5 text-[11px] font-semibold text-[#1a1205]">
                  + Add Cash
                </button>
              </div>

              {/* Featured table */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-600/20 via-emerald-800/10 to-transparent p-4">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3),transparent_60%)]" />
                <div className="relative">
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-300">
                      Live
                    </span>
                    <span className="text-[10px] text-white/60">
                      {tablePlayers}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {tableTitle}
                  </div>
                  <div className="text-[10px] text-white/50">
                    Boot ₹500 · Prize {tablePrize}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full border-2 border-emerald-900 bg-gradient-to-br from-amber-300 to-rose-400"
                        />
                      ))}
                      <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-emerald-900 bg-white/10 text-[9px] font-semibold text-white">
                        +8
                      </div>
                    </div>
                    <button className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-emerald-900">
                      Join
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "Classic", icon: "♠" },
                  { label: "Joker", icon: "★" },
                  { label: "Muflis", icon: "♦" },
                ].map((g) => (
                  <div
                    key={g.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] py-2 text-center text-[10px] font-medium text-white/70"
                  >
                    <div className="mb-0.5 text-base">{g.icon}</div>
                    {g.label}
                  </div>
                ))}
              </div>

              {/* Recent win ticker */}
              <div className="mt-3 overflow-hidden rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  <span className="text-[10px] text-white/70">
                    <span className="text-amber-300 font-semibold">Priya from Mumbai</span>{" "}
                    just won <span className="text-white font-semibold">₹ 1,24,000</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute -left-8 top-16 w-24 animate-card-drift"
          style={{ ["--rot" as any]: "-12deg" }}
        >
          <PlayingCard rank="A" suit="♠" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="absolute -right-4 top-24 w-20 animate-card-drift"
          style={{ ["--rot" as any]: "14deg", animationDelay: "1s" } as any}
        >
          <PlayingCard rank="K" suit="♥" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute -bottom-2 left-4 w-20 animate-card-drift"
          style={{ ["--rot" as any]: "-8deg", animationDelay: "2s" } as any}
        >
          <PlayingCard rank="J" suit="♦" />
        </motion.div>

        {/* Floating stat card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="glass-strong absolute -right-4 bottom-10 hidden w-52 rounded-2xl border border-white/10 p-3.5 shadow-2xl md:block"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">
                Instant Payout
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-white">₹50,000</span>
                <span className="text-[10px] text-emerald-400">in 28s</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="glass-strong absolute -left-2 top-0 hidden w-44 rounded-2xl border border-white/10 p-3 shadow-2xl md:block"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <div className="text-[11px] font-medium text-white/80">
              RNG · Fair Play Certified
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

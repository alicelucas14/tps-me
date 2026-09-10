import { motion } from "framer-motion";
import { FadeIn, SectionHeading, PlayingCard } from "./ui";
import { Trophy, Users2, Wallet, Sparkles } from "lucide-react";
import type { ProductShowcaseSectionData } from "../store/siteStore";

const iconMap: Record<string, any> = {
  Trophy,
  Users2,
  Wallet,
  Sparkles,
};

export function ProductShowcase({
  dynamicData,
}: {
  dynamicData?: ProductShowcaseSectionData;
}) {
  const d: ProductShowcaseSectionData = dynamicData || {
    eyebrow: "The Experience",
    title: "A table that feels",
    titleAccent: "alive.",
    subtitle:
      "Immersive 3D felts, live dealer expressions, real-time chip animations, and cinematic sound — designed by ex-Netflix and MPL studios.",
    potAmount: "₹ 1,24,500",
    activeTablesCount: "4,218 tables",
    features: [
      {
        id: "sf1",
        icon: "Trophy",
        title: "200+ daily tournaments",
        desc: "From ₹10 micro-events to ₹1Cr Sunday Showdowns. Filter by boot, variant, and skill level.",
      },
      {
        id: "sf2",
        icon: "Users2",
        title: "Private tables with friends",
        desc: "Create a table, share a link, play with your circle — voice chat built in. No rake for private games.",
      },
      {
        id: "sf3",
        icon: "Wallet",
        title: "Smart bankroll tools",
        desc: "Daily deposit limits, session timers, loss alerts. Play responsibly with built-in guardrails.",
      },
      {
        id: "sf4",
        icon: "Sparkles",
        title: "Premium themes",
        desc: "Royal Jaipur, Midnight Goa, Mumbai Skyline — collect themes with your wins.",
      },
    ],
  };

  return (
    <section id="showcase" className="relative overflow-hidden py-24 md:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(16,185,129,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <SectionHeading
          eyebrow={d.eyebrow}
          title={d.title}
          titleAccent={d.titleAccent}
          subtitle={d.subtitle}
        />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT: Product visual */}
          <FadeIn delay={0.05}>
            <TableVisual
              potAmount={d.potAmount}
              activeTablesCount={d.activeTablesCount}
            />
          </FadeIn>

          {/* RIGHT: feature list */}
          <div className="space-y-4">
            {d.features.map((item, i) => {
              const Icon = iconMap[item.icon] || Trophy;
              return (
                <FadeIn key={item.id || item.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.4 }}
                    className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-emerald-400/30 hover:bg-white/[0.04]"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                      <Icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold tracking-tight text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/60">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TableVisual({
  potAmount = "₹ 1,24,500",
  activeTablesCount = "4,218 tables",
}: {
  potAmount?: string;
  activeTablesCount?: string;
}) {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[620px]">
      {/* Table felt */}
      <div className="absolute inset-0 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0a1f1a] via-[#041512] to-[#020806] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
        {/* Radial felt */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_60%)]" />

        {/* Diamond pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #f5c242 1px, transparent 1px), radial-gradient(circle at 80% 80%, #f5c242 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Center emblem */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid h-40 w-40 place-items-center">
            <div className="absolute inset-0 rounded-full border border-amber-400/20" />
            <div className="absolute inset-4 rounded-full border border-amber-400/10" />
            <div className="font-display text-5xl italic text-amber-400/20">★</div>
          </div>
        </div>

        {/* Player seats */}
        {[
          { top: "8%", left: "50%", name: "You", amount: "₹24,580", you: true },
          { top: "35%", left: "8%", name: "Arjun K.", amount: "₹18,200" },
          { top: "75%", left: "15%", name: "Meera S.", amount: "₹42,100" },
          { top: "75%", left: "85%", name: "Rahul D.", amount: "₹9,400" },
          { top: "35%", left: "92%", name: "Divya P.", amount: "₹31,050" },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: p.top, left: p.left }}
          >
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-xl ${
                p.you
                  ? "border-amber-400/50 bg-amber-400/10 shadow-[0_0_30px_-5px_rgba(245,194,66,0.5)]"
                  : "border-white/15 bg-black/40"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full border-2 ${
                  p.you ? "border-amber-400" : "border-white/20"
                } bg-gradient-to-br from-emerald-300 to-amber-400`}
              />
              <div className="text-left">
                <div
                  className={`text-[10px] font-semibold leading-none ${
                    p.you ? "text-amber-200" : "text-white/80"
                  }`}
                >
                  {p.name}
                </div>
                <div className="mt-0.5 text-[9px] leading-none text-white/50">
                  {p.amount}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Floating cards on table */}
        <div className="absolute left-1/2 top-[44%] flex -translate-x-1/2 gap-1.5">
          <div className="w-10">
            <PlayingCard rank="A" suit="♠" />
          </div>
          <div className="w-10">
            <PlayingCard rank="K" suit="♠" />
          </div>
          <div className="w-10">
            <PlayingCard rank="Q" suit="♥" />
          </div>
        </div>

        {/* Pot */}
        <div className="absolute left-1/2 top-[62%] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/50 px-3 py-1.5 backdrop-blur">
            <span className="text-[10px] uppercase tracking-wider text-amber-300">
              Pot
            </span>
            <span className="text-sm font-semibold text-white">{potAmount}</span>
          </div>
        </div>

        {/* Top HUD */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
          </span>
          <span className="text-[10px] font-medium text-white/80">
            LIVE · {activeTablesCount}
          </span>
        </div>
      </div>

      {/* Floating side cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="absolute -left-6 bottom-10 hidden w-20 rotate-[-15deg] md:block"
      >
        <PlayingCard rank="10" suit="♣" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="absolute -right-4 top-12 hidden w-20 rotate-[18deg] md:block"
      >
        <PlayingCard rank="A" suit="♥" />
      </motion.div>
    </div>
  );
}

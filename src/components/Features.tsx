import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Users,
  Crown,
  Gift,
  Banknote,
  Sparkles,
  Trophy,
} from "lucide-react";
import { FadeIn, SectionHeading } from "./ui";
import type { FeaturesSectionData } from "../store/siteStore";

const iconMap: Record<string, any> = {
  Zap,
  Banknote,
  ShieldCheck,
  Users,
  Crown,
  Gift,
  Sparkles,
  Trophy,
};

export function Features({ dynamicData }: { dynamicData?: FeaturesSectionData }) {
  const d: FeaturesSectionData = dynamicData || {
    eyebrow: "Why Stars",
    title: "Built for players who",
    titleAccent: "expect more.",
    subtitle:
      "Every feature engineered for the serious Teen Patti enthusiast. No gimmicks — just the smoothest, fairest, most rewarding card experience in India.",
    items: [
      {
        id: "f1",
        icon: "Zap",
        title: "Lightning-fast tables",
        desc: "Sub-200ms response times on every deal. No lag. No delays. Just pure, uninterrupted play — even on 4G.",
        accent: "emerald",
      },
      {
        id: "f2",
        icon: "Banknote",
        title: "Instant UPI payouts",
        desc: "Winnings to your bank in under 30 seconds via UPI, Paytm, GPay, or PhonePe. No minimum. No paperwork.",
        accent: "gold",
      },
      {
        id: "f3",
        icon: "ShieldCheck",
        title: "RNG & fair play certified",
        desc: "Audited by iTech Labs. Zero bots. Zero collusion detection. Every shuffle is provably random.",
        accent: "emerald",
      },
      {
        id: "f4",
        icon: "Users",
        title: "50L+ real players",
        desc: "Join the largest Teen Patti community in India. From ₹1 boot tables to ₹10L high-roller rooms.",
        accent: "gold",
      },
      {
        id: "f5",
        icon: "Crown",
        title: "VIP Royal Club",
        desc: "Personal relationship manager, private tables, exclusive Diwali galas in Goa, and priority withdrawals.",
        accent: "emerald",
      },
      {
        id: "f6",
        icon: "Gift",
        title: "Daily rewards & rakeback",
        desc: "Spin the Wheel every 4 hours. Up to 30% rakeback for loyal players. Bonus on every deposit.",
        accent: "gold",
      },
    ],
  };

  return (
    <section id="features" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <SectionHeading
          eyebrow={d.eyebrow}
          title={d.title}
          titleAccent={d.titleAccent}
          subtitle={d.subtitle}
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {d.items.map((f, i) => (
            <FadeIn key={f.id || f.title} delay={i * 0.05}>
              <FeatureCard feature={f} index={i} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: FeaturesSectionData["items"][number];
  index: number;
}) {
  const isGold = feature.accent === "gold";
  const Icon = iconMap[feature.icon] || Zap;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-7 transition-all hover:border-white/20"
    >
      {/* Hover gradient */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
          isGold
            ? "bg-[radial-gradient(ellipse_at_top,rgba(245,194,66,0.08),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]"
        }`}
      />

      {/* Icon */}
      <div className="relative mb-5">
        <div
          className={`relative grid h-12 w-12 place-items-center rounded-xl ${
            isGold
              ? "bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/20"
              : "bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-400/20"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${isGold ? "text-amber-300" : "text-emerald-300"}`}
            strokeWidth={2}
          />
          <div
            className="absolute -inset-px rounded-xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-60"
            style={{
              background: isGold
                ? "radial-gradient(circle, rgba(245,194,66,0.6), transparent)"
                : "radial-gradient(circle, rgba(16,185,129,0.6), transparent)",
            }}
          />
        </div>
      </div>

      <h3 className="relative mb-2 text-xl font-semibold tracking-tight text-white">
        {feature.title}
      </h3>
      <p className="relative text-[15px] leading-relaxed text-white/60">
        {feature.desc}
      </p>

      {/* Number */}
      <div className="absolute right-6 top-6 font-display text-5xl text-white/[0.04]">
        {String(index + 1).padStart(2, "0")}
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Check, X, Crown, Sparkles, Zap, Star } from "lucide-react";
import { FadeIn, SectionHeading } from "./ui";
import type { PricingSectionData } from "../store/siteStore";

const iconMap: Record<string, any> = {
  Zap,
  Sparkles,
  Crown,
  Star,
};

export function Pricing({ dynamicData }: { dynamicData?: PricingSectionData }) {
  const d: PricingSectionData = dynamicData || {
    eyebrow: "Membership Tiers",
    title: "Play at",
    titleAccent: "your level.",
    subtitle:
      "Start free. Upgrade when you're ready. No contracts. Cancel any time. Every tier includes instant UPI payouts and fair-play certification.",
    bannerText:
      "First month free on Silver & Royal when you deposit ₹1,000+ this week.",
    items: [
      {
        id: "p1",
        name: "Classic",
        price: "Free",
        tagline: "Perfect to start your journey",
        icon: "Zap",
        featured: false,
        cta: "Download Free",
        perks: [
          "₹500 welcome bonus on signup",
          "Access to ₹1 – ₹100 boot tables",
          "Daily login rewards & spin",
          "Standard UPI withdrawals (< 5 min)",
          "Email support",
        ],
        limits: ["Private tables: 1/month", "Rakeback: 5%"],
      },
      {
        id: "p2",
        name: "Silver",
        price: "₹499",
        period: "/month",
        tagline: "For the regular player",
        icon: "Sparkles",
        featured: false,
        cta: "Start Silver",
        perks: [
          "Everything in Classic",
          "₹1,000 monthly bonus credit",
          "Priority UPI withdrawals (< 60s)",
          "Private tables: unlimited",
          "Rakeback: 15%",
          "Exclusive Silver tournaments",
        ],
        limits: [],
      },
      {
        id: "p3",
        name: "Royal",
        price: "₹2,999",
        period: "/month",
        tagline: "For the serious competitor",
        icon: "Crown",
        featured: true,
        cta: "Go Royal",
        perks: [
          "Everything in Silver",
          "₹10,000 monthly bonus credit",
          "Instant priority withdrawals (< 20s)",
          "Personal relationship manager",
          "Rakeback: 30%",
          "Invitations to live Goa events",
          "Access to Royal-only tables",
          "Custom avatar & themes",
        ],
        limits: [],
      },
      {
        id: "p4",
        name: "Legend",
        price: "Custom",
        tagline: "For the top 0.1%",
        icon: "Star",
        featured: false,
        cta: "Contact Concierge",
        perks: [
          "Everything in Royal",
          "Unlimited monthly credit",
          "Private jets to Goa events",
          "Dedicated dealer for your tables",
          "Bespoke rewards & gifts",
          "Invitation-only masterclasses",
        ],
        limits: [],
      },
    ],
  };

  return (
    <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,194,66,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <SectionHeading
          eyebrow={d.eyebrow}
          title={d.title}
          titleAccent={d.titleAccent}
          subtitle={d.subtitle}
        />

        <div className="grid gap-5 lg:grid-cols-4">
          {d.items.map((p, i) => (
            <FadeIn key={p.id || p.name} delay={i * 0.06}>
              <PricingCard plan={p} />
            </FadeIn>
          ))}
        </div>

        {d.bannerText && (
          <FadeIn delay={0.2}>
            <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-center text-sm text-white/60">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{d.bannerText}</span>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: PricingSectionData["items"][number] }) {
  const Icon = iconMap[plan.icon] || Zap;
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 ${
        plan.featured
          ? "border-amber-400/40 bg-gradient-to-b from-amber-500/10 via-[#05080a] to-[#05080a] shadow-[0_30px_80px_-20px_rgba(245,194,66,0.25)]"
          : "border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01]"
      }`}
    >
      {plan.featured && (
        <>
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <div className="absolute right-5 top-5 rounded-full bg-gradient-to-b from-[#ffd96b] to-[#c98a1a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1a1205]">
            Most Popular
          </div>
        </>
      )}

      {/* Icon */}
      <div
        className={`mb-5 grid h-12 w-12 place-items-center rounded-xl ${
          plan.featured
            ? "bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30"
            : "border border-white/10 bg-white/[0.04]"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            plan.featured ? "text-amber-300" : "text-white/70"
          }`}
        />
      </div>

      <h3 className="text-2xl font-semibold tracking-tight text-white">
        {plan.name}
      </h3>
      <p className="mt-1 text-sm text-white/50">{plan.tagline}</p>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-1">
        <span
          className={`text-5xl font-semibold tracking-tight ${
            plan.featured ? "gradient-text-gold" : "text-white"
          }`}
        >
          {plan.price}
        </span>
        {plan.period && (
          <span className="text-sm text-white/40">{plan.period}</span>
        )}
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <ul className="space-y-3">
        {(plan.perks || []).map((perk) => (
          <li key={perk} className="flex items-start gap-2.5">
            <div
              className={`mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full ${
                plan.featured ? "bg-amber-400/20" : "bg-emerald-400/15"
              }`}
              style={{ width: 18, height: 18 }}
            >
              <Check
                className={`h-2.5 w-2.5 ${
                  plan.featured ? "text-amber-300" : "text-emerald-400"
                }`}
                strokeWidth={3.5}
              />
            </div>
            <span className="text-[14px] leading-tight text-white/80">{perk}</span>
          </li>
        ))}
        {(plan.limits || []).map((l) => (
          <li key={l} className="flex items-start gap-2.5 opacity-50">
            <div className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-white/5">
              <X className="h-2.5 w-2.5 text-white/40" strokeWidth={3} />
            </div>
            <span className="text-[14px] leading-tight text-white/50">{l}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <a
          href="#download"
          className={`group flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all ${
            plan.featured
              ? "bg-gradient-to-b from-[#ffd96b] via-[#f5c242] to-[#c98a1a] text-[#1a1205] btn-gold-glow hover:brightness-110"
              : "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25"
          }`}
        >
          {plan.cta}
        </a>
      </div>
    </motion.div>
  );
}

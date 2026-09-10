import { FadeIn } from "./ui";
import { Check, ShieldCheck, Banknote, Lock } from "lucide-react";
import type { BenefitsSectionData } from "../store/siteStore";

const iconMap: Record<string, any> = {
  ShieldCheck,
  Banknote,
  Lock,
};

export function Benefits({ dynamicData }: { dynamicData?: BenefitsSectionData }) {
  const items = dynamicData?.items || [
    {
      id: "b1",
      icon: "ShieldCheck",
      kicker: "100% Legit",
      title: "Licensed, regulated, and audited.",
      desc: "Teen Patti Stars operates under a Curacao gaming license with iTech Labs RNG certification. Every hand is verifiable. Every rupee is accounted for.",
      bullets: [
        "iTech Labs RNG Certificate #TPS-2025-041",
        "SSL 256-bit encryption, PCI-DSS compliant",
        "KYC via Aadhaar in under 60 seconds",
      ],
      stat1Label: "Audit frequency",
      stat1Value: "Weekly",
      stat2Label: "RNG seed",
      stat2Value: "Quantum",
      visual: "security" as const,
    },
    {
      id: "b2",
      icon: "Banknote",
      kicker: "Fastest in India",
      title: "Withdraw winnings before your chai gets cold.",
      desc: "Our instant payout engine processes UPI withdrawals in an average of 28 seconds. No paperwork, no waiting. Works 24×7, even on bank holidays.",
      bullets: [
        "UPI, IMPS, Paytm, GPay, PhonePe supported",
        "₹100 minimum withdrawal, no cap",
        "99.94% payout success rate in 2025",
      ],
      stat1Label: "Avg payout time",
      stat1Value: "28s",
      stat2Label: "Paid in 2025",
      stat2Value: "₹240 Cr",
      visual: "payout" as const,
    },
    {
      id: "b3",
      icon: "Lock",
      kicker: "Play Safe",
      title: "Built for the long game. Not the quick fix.",
      desc: "We'd rather have you play for 10 years than burn out in 10 days. That's why we built the strongest responsible gaming toolkit in the industry.",
      bullets: [
        "Daily / weekly deposit & loss limits",
        "Cool-off periods & self-exclusion",
        "AI-based problem gambling detection",
      ],
      stat1Label: "18+ verified",
      stat1Value: "100%",
      stat2Label: "Support",
      stat2Value: "24×7",
      visual: "safety" as const,
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-amber-400/5 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="space-y-24 md:space-y-32">
          {items.map((b, i) => (
            <BenefitRow key={b.id || b.title} benefit={b} index={i} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitRow({
  benefit,
  reversed,
}: {
  benefit: any;
  index: number;
  reversed: boolean;
}) {
  const Icon = iconMap[benefit.icon] || ShieldCheck;

  return (
    <div
      className={`grid items-center gap-12 lg:grid-cols-2 ${
        reversed ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <FadeIn>
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-300">
            <Icon className="h-3.5 w-3.5" />
            {benefit.kicker}
          </div>
          <h3 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            {benefit.title}
          </h3>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/60">
            {benefit.desc}
          </p>

          <ul className="mt-7 space-y-3">
            {benefit.bullets.map((b: string) => (
              <li key={b} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15">
                  <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
                </div>
                <span className="text-[15px] text-white/80">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-white/40">
                {benefit.stat1Label}
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {benefit.stat1Value}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-white/40">
                {benefit.stat2Label}
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {benefit.stat2Value}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <BenefitVisual kind={benefit.visual as "security" | "payout" | "safety"} />
      </FadeIn>
    </div>
  );
}

function BenefitVisual({ kind }: { kind: "security" | "payout" | "safety" }) {
  if (kind === "security") {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-900/20 via-white/[0.02] to-transparent p-8">
          <div className="relative grid h-full place-items-center">
            <div className="relative">
              {/* Shield */}
              <svg viewBox="0 0 120 140" className="h-48 w-40" fill="none">
                <defs>
                  <linearGradient id="shield-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>
                <path
                  d="M60 5 L110 22 L110 70 Q110 110 60 135 Q10 110 10 70 L10 22 Z"
                  fill="url(#shield-g)"
                  opacity="0.2"
                />
                <path
                  d="M60 5 L110 22 L110 70 Q110 110 60 135 Q10 110 10 70 L10 22 Z"
                  stroke="url(#shield-g)"
                  strokeWidth="2"
                />
                <path
                  d="M40 70 L55 85 L82 55"
                  stroke="#f5c242"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Orbiting tags */}
            {[
              { label: "RNG Certified", top: "5%", left: "50%" },
              { label: "SSL 256-bit", top: "50%", left: "2%" },
              { label: "PCI-DSS", top: "50%", left: "98%" },
              { label: "Aadhaar KYC", top: "95%", left: "50%" },
            ].map((t) => (
              <div
                key={t.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/30 bg-[#05080a] px-3 py-1 text-[11px] font-medium text-emerald-300 shadow-lg"
                style={{ top: t.top, left: t.left }}
              >
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kind === "payout") {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[460px]">
        <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-900/10 via-white/[0.02] to-transparent p-8">
          <div className="relative flex h-full flex-col items-center justify-center">
            {/* Receipt / payout card */}
            <div className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#05080a] shadow-[0_30px_60px_-20px_rgba(245,194,66,0.2)]">
              <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-wider text-white/60">
                    Withdrawal
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                    Completed
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  Amount
                </div>
                <div className="mt-1 text-4xl font-semibold tracking-tight text-white">
                  ₹ 25,000<span className="text-white/40">.00</span>
                </div>
                <div className="mt-4 space-y-2 border-t border-white/5 pt-4 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-white/50">To</span>
                    <span className="text-white/90">UPI · ****@ybl</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">UTR</span>
                    <span className="text-white/90 font-mono">42910837291</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Processed in</span>
                    <span className="font-semibold text-emerald-300">28 seconds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -right-4 top-8">
              <div className="h-14 w-14 rounded-full border-4 border-dashed border-amber-400/40 bg-gradient-to-br from-amber-300 to-amber-600 shadow-xl" />
            </div>
            <div className="absolute -left-4 bottom-10">
              <div className="h-12 w-12 rounded-full border-4 border-dashed border-emerald-400/40 bg-gradient-to-br from-emerald-300 to-emerald-600 shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // safety
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8">
        <div className="grid h-full grid-cols-2 gap-3">
          {[
            { label: "Daily deposit limit", value: "₹5,000", sub: "Set by you" },
            { label: "Session timer", value: "45 min", sub: "Auto-logout" },
            { label: "Loss alert", value: "₹2,000", sub: "Notification" },
            { label: "Self-exclusion", value: "Available", sub: "24×7 support" },
          ].map((c) => (
            <div
              key={c.label}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                {c.label}
              </div>
              <div>
                <div className="text-2xl font-semibold text-white">{c.value}</div>
                <div className="text-[11px] text-emerald-300">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

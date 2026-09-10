import { FadeIn } from "./ui";
import type { SocialProofSectionData } from "../store/siteStore";

export function SocialProof({ dynamicData }: { dynamicData?: SocialProofSectionData }) {
  const logos = dynamicData?.logos || [
    "TechCrunch",
    "YourStory",
    "Economic Times",
    "Inc42",
    "Business Standard",
    "Mint",
    "Forbes India",
  ];

  const stats = dynamicData?.stats || [
    { id: "s1", value: "50L+", label: "Verified Players" },
    { id: "s2", value: "₹240Cr", label: "Paid Out in 2025" },
    { id: "s3", value: "<30s", label: "Avg UPI Withdrawal" },
    { id: "s4", value: "4.8★", label: "Play Store Rating" },
  ];

  const eyebrow =
    dynamicData?.eyebrow || "Featured in & trusted by India's leading publications";

  return (
    <section className="relative border-y border-white/5 bg-white/[0.015] py-14">
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Logos */}
        <FadeIn>
          <div className="mb-10 text-center text-xs uppercase tracking-[0.22em] text-white/40">
            {eyebrow}
          </div>
        </FadeIn>

        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-16">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center text-2xl font-semibold tracking-tight text-white/30 transition-colors hover:text-white/60"
              >
                {logo === "YourStory" && <span className="mr-1.5 text-rose-400/60">◆</span>}
                {logo === "Forbes India" && (
                  <span className="font-display italic text-white/40">Forbes </span>
                )}
                {logo === "Forbes India" ? "India" : logo}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.id || s.label}
                className="group relative bg-[#05080a] p-8 text-center transition-colors hover:bg-white/[0.02]"
              >
                <div className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-wider text-white/50">
                  {s.label}
                </div>
                {/* Hover glow */}
                <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { FadeIn, SectionHeading } from "./ui";
import type { TestimonialsSectionData } from "../store/siteStore";

export function Testimonials({
  dynamicData,
}: {
  dynamicData?: TestimonialsSectionData;
}) {
  const d: TestimonialsSectionData = dynamicData || {
    eyebrow: "Player Stories",
    title: "Loved by",
    titleAccent: "50 lakh Indians.",
    subtitle:
      "Real stories from real players. From casual Friday-night friends to ₹1Cr tournament champions.",
    items: [
      {
        id: "t1",
        name: "Arjun Mehta",
        role: "Mumbai · Playing since 2022",
        quote:
          "I've tried every Teen Patti app in India. Stars is the only one that feels genuinely premium. Payouts hit my account in 20 seconds — no exaggeration.",
        avatar: "AM",
        rating: 5,
        color: "from-emerald-400 to-teal-500",
        badge: "Royal VIP",
      },
      {
        id: "t2",
        name: "Priya Nair",
        role: "Bangalore · Won ₹4.2L this year",
        quote:
          "The Diwali tournament last year changed my life. ₹2.4L in one night, and the team actually called to congratulate me. Who does that anymore?",
        avatar: "PN",
        rating: 5,
        color: "from-amber-400 to-rose-400",
        badge: "Top 1%",
      },
      {
        id: "t3",
        name: "Rahul Desai",
        role: "Delhi · Casual player",
        quote:
          "I play ₹50 tables with my college friends every Friday. The private tables and voice chat are unmatched. Zero ads. Zero popups. Just the game.",
        avatar: "RD",
        rating: 5,
        color: "from-indigo-400 to-purple-500",
        badge: "Verified",
      },
      {
        id: "t4",
        name: "Sneha Kapoor",
        role: "Pune · VIP Royal Club",
        quote:
          "The relationship manager is a game-changer. Instant priority withdrawals, invitations to live Goa events. This is what premium feels like.",
        avatar: "SK",
        rating: 5,
        color: "from-rose-400 to-pink-500",
        badge: "Royal VIP",
      },
      {
        id: "t5",
        name: "Vikram Singh",
        role: "Jaipur · Pro tournament player",
        quote:
          "The RNG is the cleanest I've seen. After 3,000+ hours on Stars, I've never once doubted a deal. That's more than I can say for competitors.",
        avatar: "VS",
        rating: 5,
        color: "from-cyan-400 to-blue-500",
        badge: "Verified",
      },
      {
        id: "t6",
        name: "Anjali Reddy",
        role: "Hyderabad · ₹1.8L won this month",
        quote:
          "What won me over was the responsible gaming tools. I set my limits and the app actually respects them. Other apps push you to deposit more. Stars doesn't.",
        avatar: "AR",
        rating: 5,
        color: "from-fuchsia-400 to-purple-500",
        badge: "Verified",
      },
    ],
  };

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <SectionHeading
          eyebrow={d.eyebrow}
          title={d.title}
          titleAccent={d.titleAccent}
          subtitle={d.subtitle}
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {d.items.map((t, i) => (
            <FadeIn key={t.id || t.name} delay={(i % 3) * 0.07}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-7"
              >
                {/* Quote icon */}
                <Quote
                  className="absolute right-5 top-5 h-8 w-8 text-white/5"
                  strokeWidth={1.5}
                />

                {/* Rating */}
                <div className="mb-4 flex items-center gap-0.5">
                  {[...Array(t.rating || 5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="mb-6 text-[15px] leading-relaxed text-white/80">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-white/5 pt-5">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
                      t.color || "from-emerald-400 to-teal-500"
                    } text-sm font-semibold text-white shadow-lg`}
                  >
                    {t.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold text-white">
                        {t.name}
                      </div>
                      {t.badge && (
                        <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-white/50">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

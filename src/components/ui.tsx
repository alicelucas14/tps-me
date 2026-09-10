import { motion, type Variants } from "framer-motion";
import { cn } from "../utils/cn";
import type { ReactNode, ButtonHTMLAttributes } from "react";

/* ——— Fade In (scroll reveal) ——— */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ——— Buttons ——— */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "gold" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

export function Button({
  children,
  variant = "gold",
  size = "md",
  className,
  href,
  ...rest
}: BtnProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 whitespace-nowrap select-none cursor-pointer";
  const sizes = {
    sm: "h-10 px-5 text-sm",
    md: "h-12 px-6 text-[15px]",
    lg: "h-14 px-8 text-base",
  } as const;
  const variants = {
    gold: "bg-gradient-to-b from-[#ffd96b] via-[#f5c242] to-[#c98a1a] text-[#1a1205] btn-gold-glow hover:brightness-110 active:scale-[0.98]",
    outline:
      "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25",
    ghost: "text-white/80 hover:text-white",
  } as const;

  const cls = cn(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button {...rest} className={cls}>
      {children}
    </button>
  );
}

/* ——— Eyebrow ——— */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      {children}
    </div>
  );
}

/* ——— Section Wrapper ——— */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative w-full py-24 md:py-32", className)}>
      <div className="mx-auto w-full max-w-7xl px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  titleAccent,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  titleAccent?: string;
}) {
  return (
    <div className={cn("mb-16 md:mb-20", center && "text-center mx-auto max-w-3xl")}>
      {eyebrow && (
        <FadeIn>
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-300",
              center && "mx-auto mb-6"
            )}
          >
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            {eyebrow}
          </div>
        </FadeIn>
      )}
      <FadeIn delay={0.05}>
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
          {title}
          {titleAccent && (
            <span className="gradient-text-gold italic font-display font-normal">
              {" "}
              {titleAccent}
            </span>
          )}
        </h2>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={0.1}>
          <p className="mt-5 text-balance text-lg leading-relaxed text-white/60 md:text-xl">
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
}

/* ——— Card ——— */
export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl",
        hover && "card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ——— Playing Card Graphic ——— */
export function PlayingCard({
  suit,
  rank,
  className,
  tilt = 0,
}: {
  suit: "♥" | "♦" | "♠" | "♣";
  rank: string;
  className?: string;
  tilt?: number;
}) {
  const isRed = suit === "♥" || suit === "♦";
  return (
    <div
      className={cn(
        "relative aspect-[2.5/3.5] w-full overflow-hidden rounded-xl shadow-2xl",
        "bg-gradient-to-br from-white to-slate-100",
        "border border-white/50",
        className
      )}
      style={{
        transform: `rotate(${tilt}deg)`,
        boxShadow:
          "0 30px 60px -15px rgba(0,0,0,0.6), 0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {/* pattern back */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 0 2px, transparent 2px 8px)",
        }}
      />
      <div
        className={cn(
          "flex h-full flex-col justify-between p-3 font-display",
          isRed ? "text-rose-600" : "text-slate-900"
        )}
      >
        <div className="flex items-center gap-0.5 text-2xl font-bold leading-none">
          <span>{rank}</span>
          <span>{suit}</span>
        </div>
        <div className="text-center text-5xl leading-none">{suit}</div>
        <div className="flex rotate-180 items-center gap-0.5 text-2xl font-bold leading-none">
          <span>{rank}</span>
          <span>{suit}</span>
        </div>
      </div>
    </div>
  );
}

/* ——— Gold Chip ——— */
export function GoldChip({ amount, className }: { amount: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full",
        "bg-gradient-to-b from-[#ffd96b] via-[#f5c242] to-[#c98a1a]",
        "px-3 py-1.5 text-sm font-semibold text-[#1a1205]",
        "shadow-[0_8px_24px_-8px_rgba(245,194,66,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <circle cx="12" cy="12" r="10" opacity="0.25" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="currentColor">₹</text>
      </svg>
      {amount}
    </div>
  );
}

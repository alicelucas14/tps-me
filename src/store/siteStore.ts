import { create } from "zustand";
import rawWpPosts from "../data/wpPosts.json";
import rawWpPages from "../data/wpPages.json";

export type DeviceMode = "desktop" | "tablet" | "mobile";
export type EditorTab = "elements" | "navigator" | "content" | "style" | "settings";

export interface HeroSectionData {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  titleSuffix: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  trustText: string;
  ratingText: string;
  tableTitle: string;
  tablePrize: string;
  tablePlayers: string;
  visualType?: "3d-mockup" | "custom-image";
  customImageUrl?: string;
  customImageAlt?: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface SocialProofSectionData {
  eyebrow: string;
  logos: string[];
  stats: StatItem[];
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  accent: "emerald" | "gold";
}

export interface FeaturesSectionData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface ShowcaseFeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface ProductShowcaseSectionData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  potAmount: string;
  activeTablesCount: string;
  features: ShowcaseFeatureItem[];
}

export interface BenefitItem {
  id: string;
  kicker: string;
  title: string;
  desc: string;
  icon: string;
  bullets: string[];
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  visual: "security" | "payout" | "safety";
}

export interface BenefitsSectionData {
  items: BenefitItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
  badge: string;
  color: string;
}

export interface TestimonialsSectionData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface PricingPlanItem {
  id: string;
  name: string;
  price: string;
  period?: string;
  tagline: string;
  icon: string;
  featured: boolean;
  cta: string;
  perks: string[];
  limits: string[];
}

export interface PricingSectionData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  bannerText: string;
  items: PricingPlanItem[];
}

export interface FAQItemData {
  id: string;
  q: string;
  a: string;
}

export interface FAQSectionData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  supportTitle: string;
  supportSubtitle: string;
  whatsappCta: string;
  emailCta: string;
  items: FAQItemData[];
}

export interface FinalCTASectionData {
  badge: string;
  titlePrefix: string;
  titleAccent: string;
  titleSuffix: string;
  subtitle: string;
  androidCta: string;
  iosCta: string;
  promoCode: string;
  smsText: string;
}

export interface AnnouncementSectionData {
  text: string;
  badge: string;
  linkText: string;
  linkUrl: string;
  bgColor: "gold" | "emerald" | "ruby";
}

export interface RichTextSectionData {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  content: string;
}

export interface SectionConfig<T = any> {
  id: string;
  type:
    | "announcement"
    | "hero"
    | "social_proof"
    | "features"
    | "showcase"
    | "benefits"
    | "testimonials"
    | "pricing"
    | "faq"
    | "final_cta"
    | "rich_text";
  label: string;
  visible: boolean;
  data: T;
  customCss?: string;
}

export interface PostConfig {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  coverColor: string;
  coverImage?: string;
  badge: string;
  status: "published" | "draft";
}

export interface PageConfig {
  id: string;
  slug: string;
  title: string;
  isHome?: boolean;
  status: "published" | "draft";
  sections: SectionConfig[];
  seo: {
    title: string;
    description: string;
  };
  createdAt: string;
}

export type BackgroundType = "color" | "gradient" | "image";

export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  gradient?: string;
  imageUrl?: string;
  imageOverlayOpacity?: number; // 0 to 100
  imageOverlayColor?: string;
  imageBlur?: number; // 0 to 20 px
  imageSize?: "cover" | "contain" | "repeat" | "auto";
  imagePosition?: string;
  imageAttachment?: "fixed" | "scroll";
}

export interface SiteThemeConfig {
  colorMode: "dark" | "light";
  primaryGradient: "emerald-gold" | "royal-sapphire" | "midnight-ruby";
  borderRadius: "rounded-xl" | "rounded-2xl" | "rounded-3xl";
  noiseOverlay: boolean;
  background?: BackgroundConfig;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  target?: string;
}

export interface FooterColumnItem {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface FooterSocialItem {
  id: string;
  name: string;
  url: string;
  path: string;
}

export interface FooterConfig {
  brandTitle: string;
  brandAccent: string;
  brandSubtitle: string;
  logoType?: "icon" | "image";
  logoImageUrl?: string;
  description: string;
  socials: FooterSocialItem[];
  columns: FooterColumnItem[];
  badges: string[];
  disclaimer: string;
  copyright: string;
  cinNumber: string;
  systemStatusText: string;
}

export interface SiteConfig {
  pages: PageConfig[];
  posts: PostConfig[];
  currentPageId: string;
  sections: SectionConfig[]; // active sections for currentPageId
  theme: SiteThemeConfig;
  footer?: FooterConfig;
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

const defaultLandingSections: SectionConfig[] = [
  {
    id: "sec_hero",
    type: "hero",
    label: "Hero Header",
    visible: true,
    data: {
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
    } as HeroSectionData,
  },
  {
    id: "sec_social",
    type: "social_proof",
    label: "Social Proof & Stats",
    visible: true,
    data: {
      eyebrow: "Featured in & trusted by India's leading publications",
      logos: [
        "TechCrunch",
        "YourStory",
        "Economic Times",
        "Inc42",
        "Business Standard",
        "Mint",
        "Forbes India",
      ],
      stats: [
        { id: "s1", value: "50L+", label: "Verified Players" },
        { id: "s2", value: "₹240Cr", label: "Paid Out in 2025" },
        { id: "s3", value: "<30s", label: "Avg UPI Withdrawal" },
        { id: "s4", value: "4.8★", label: "Play Store Rating" },
      ],
    } as SocialProofSectionData,
  },
  {
    id: "sec_features",
    type: "features",
    label: "Features Grid",
    visible: true,
    data: {
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
    } as FeaturesSectionData,
  },
  {
    id: "sec_showcase",
    type: "showcase",
    label: "Table Experience Showcase",
    visible: true,
    data: {
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
    } as ProductShowcaseSectionData,
  },
  {
    id: "sec_benefits",
    type: "benefits",
    label: "Detailed Benefits & Security",
    visible: true,
    data: {
      items: [
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
          visual: "security",
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
          visual: "payout",
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
          visual: "safety",
        },
      ],
    } as BenefitsSectionData,
  },
  {
    id: "sec_testimonials",
    type: "testimonials",
    label: "Player Reviews",
    visible: true,
    data: {
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
    } as TestimonialsSectionData,
  },
  {
    id: "sec_pricing",
    type: "pricing",
    label: "Membership & VIP Pricing",
    visible: true,
    data: {
      eyebrow: "Membership Tiers",
      title: "Play at",
      titleAccent: "your level.",
      subtitle:
        "Start free. Upgrade when you're ready. No contracts. Cancel any time. Every tier includes instant UPI payouts and fair-play certification.",
      bannerText: "First month free on Silver & Royal when you deposit ₹1,000+ this week.",
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
    } as PricingSectionData,
  },
  {
    id: "sec_faq",
    type: "faq",
    label: "Frequently Asked Questions",
    visible: true,
    data: {
      eyebrow: "FAQ",
      title: "Everything you need",
      titleAccent: "to know.",
      subtitle:
        "Still have questions? Our 24×7 support team replies in under 2 minutes on WhatsApp.",
      supportTitle: "Talk to a human in under 2 minutes.",
      supportSubtitle:
        "Our India-based support team is online 24×7 — in Hindi, English, and 8 regional languages.",
      whatsappCta: "Chat on WhatsApp",
      emailCta: "support@teenpattistars.in",
      items: [
        {
          id: "q1",
          q: "Is Teen Patti Stars legal in India?",
          a: "Yes. Teen Patti is classified as a game of skill by the Supreme Court of India and is legal in most states. We operate under a Curacao gaming license and comply with all IT Act and FEMA regulations. Note: a few states (Telangana, Andhra Pradesh, Tamil Nadu, Karnataka, Odisha, Assam) restrict real-money gaming — we geo-block users from these states.",
        },
        {
          id: "q2",
          q: "How fast are withdrawals really?",
          a: "Our median UPI payout is 28 seconds. 99.94% of all withdrawals in 2025 were processed in under 5 minutes. We support UPI, IMPS, Paytm, GPay, and PhonePe. No paperwork, no minimum limit beyond ₹100, and no cap on daily withdrawals for verified users.",
        },
        {
          id: "q3",
          q: "Is the game fair? How do I know there are no bots?",
          a: "Every shuffle is generated by a Quantum RNG seed audited weekly by iTech Labs (Certificate #TPS-2025-041). We run a real-time collusion detection engine and employ former cybersecurity analysts from Flipkart and Razorpay to monitor gameplay. Third-party audits are published on our transparency page every quarter.",
        },
        {
          id: "q4",
          q: "What is the ₹500 welcome bonus?",
          a: "New verified players receive ₹500 in bonus credits after completing KYC (Aadhaar + PAN). Bonus credits can be used on any table with a 5× rollover before withdrawal. There is no deposit required to claim the welcome bonus — though a ₹100 first deposit unlocks an additional ₹200 bonus.",
        },
        {
          id: "q5",
          q: "Can I play with friends privately?",
          a: "Yes. Create a private table in under 10 seconds, set the boot, invite friends via a shareable link or WhatsApp, and play with voice chat built in. Private tables are rake-free for all users. Works on both Android and iOS.",
        },
        {
          id: "q6",
          q: "What happens if I suspect someone is cheating?",
          a: "Report any suspicious player in-app. Our trust & safety team investigates within 2 hours. If cheating is confirmed, the offending account is banned and forfeited chips are redistributed to affected players. We've refunded over ₹4.2 Cr to players via this program.",
        },
        {
          id: "q7",
          q: "Do you support responsible gaming?",
          a: "Absolutely. Every user can set daily deposit limits, weekly loss limits, session timers, and self-exclusion periods. Our AI detects problem-gambling patterns and proactively reaches out. We partner with HOPE Foundation and donate 0.5% of rake to gaming addiction support.",
        },
        {
          id: "q8",
          q: "Which devices are supported?",
          a: "Teen Patti Stars runs natively on Android 7+ and iOS 14+. The app is under 45 MB, works on 4G, and supports low-end devices. We also offer a web version at play.stars for desktop players.",
        },
      ],
    } as FAQSectionData,
  },
  {
    id: "sec_final_cta",
    type: "final_cta",
    label: "Final Call to Action",
    visible: true,
    data: {
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
    } as FinalCTASectionData,
  },
];

export const defaultPages: PageConfig[] = [
  {
    id: "page_home",
    slug: "/",
    title: "Home (Landing Page)",
    isHome: true,
    status: "published",
    sections: defaultLandingSections,
    seo: {
      title: "Teen Patti Stars — India's Premium Real-Money Card Experience",
      description:
        "Play with 50L+ verified players, instant UPI payouts in 28s, and VIP tournaments.",
    },
    createdAt: "2026-01-01",
  },
  {
    id: "page_rules",
    slug: "/how-to-play",
    title: "How to Play & Hand Rankings",
    status: "published",
    sections: [
      {
        id: "sec_rules_hero",
        type: "hero",
        label: "Rules Header",
        visible: true,
        data: {
          eyebrow: "Beginner & Pro Guide",
          titlePrefix: "Master the art of ",
          titleAccent: "Teen Patti",
          titleSuffix: " rules.",
          subtitle:
            "From hand rankings (Trail vs Pure Sequence) to betting rounds and blind play strategies. Everything you need to play like a champion.",
          primaryCtaText: "Start Playing Now",
          primaryCtaLink: "#download",
          secondaryCtaText: "Hand Rankings Chart",
          secondaryCtaLink: "#features",
          trustText: "100% Skill & Strategy Guide",
          ratingText: "50L+ active players",
          tableTitle: "Practice Boot Room",
          tablePrize: "Free Chips",
          tablePlayers: "Instant Table Access",
        },
      },
      {
        id: "sec_rules_faq",
        type: "faq",
        label: "Rules & Strategy FAQ",
        visible: true,
        data: {
          eyebrow: "Frequently Asked Questions",
          title: "Rules, Variations &",
          titleAccent: "Side-Show Rules",
          subtitle: "Clear answers to the most common Teen Patti rules and situations.",
          supportTitle: "Need help with hand rankings?",
          supportSubtitle: "Our live table coaches are available 24/7 on WhatsApp.",
          whatsappCta: "Ask a Coach",
          emailCta: "rules@teenpattistars.in",
          items: [
            {
              id: "r1",
              q: "What is the highest hand in Teen Patti?",
              a: "Trail / Trio / Set (Three cards of the same rank, e.g. A-A-A) is the highest possible hand. Three Aces (A-A-A) beats three Kings (K-K-K).",
            },
            {
              id: "r2",
              q: "What is a Pure Sequence vs a Normal Sequence?",
              a: "A Pure Sequence (Straight Flush) consists of 3 consecutive cards of the SAME suit (e.g. A-K-Q of Spades). A Normal Sequence (Straight) is 3 consecutive cards of different suits.",
            },
            {
              id: "r3",
              q: "How does a Side-Show work?",
              a: "A seen player can request a side-show with the player who bet immediately before them. The requested player can accept or reject. If accepted, both secretly compare cards, and the player with the lower hand must pack.",
            },
            {
              id: "r4",
              q: "What is Blind vs Seen play?",
              a: "A blind player bets without looking at their cards and puts in the current boot/stake. A seen player looks at their cards and must bet 2x the blind amount to stay in the hand.",
            },
          ],
        },
      },
      {
        id: "sec_rules_cta",
        type: "final_cta",
        label: "Rules Final CTA",
        visible: true,
        data: {
          badge: "Practice Mode Ready",
          titlePrefix: "Put your knowledge into ",
          titleAccent: "action.",
          titleSuffix: "",
          subtitle: "Join ₹1 boot tables or start in free training mode today.",
          androidCta: "Download Free App",
          iosCta: "Play in Browser",
          promoCode: "₹500 BONUS",
          smsText: "Text STARS to 56161 for instant download",
        },
      },
    ],
    seo: {
      title: "Teen Patti Rules & Hand Rankings — Teen Patti Stars",
      description: "Complete guide on how to play Teen Patti, hand hierarchies, and strategies.",
    },
    createdAt: "2026-01-15",
  },
  {
    id: "page_vip",
    slug: "/vip-club",
    title: "VIP Royal Club",
    status: "published",
    sections: [
      {
        id: "sec_vip_hero",
        type: "hero",
        label: "VIP Hero Header",
        visible: true,
        data: {
          eyebrow: "By Invitation & Merit",
          titlePrefix: "Enter India's most exclusive ",
          titleAccent: "Royal Club.",
          titleSuffix: "",
          subtitle:
            "Dedicated relationship managers, luxury Goa tournament galas, up to 30% instant rakeback, and private high-roller rooms.",
          primaryCtaText: "Apply for VIP Tier",
          primaryCtaLink: "#pricing",
          secondaryCtaText: "VIP Benefits Tour",
          secondaryCtaLink: "#showcase",
          trustText: "Top 0.1% Club Members",
          ratingText: "₹240Cr paid out",
          tableTitle: "Royal Goa High Roller",
          tablePrize: "₹50 Lakh",
          tablePlayers: "VIPs Only",
        },
      },
      {
        id: "sec_vip_pricing",
        type: "pricing",
        label: "VIP Tiers Comparison",
        visible: true,
        data: {
          eyebrow: "Royal Memberships",
          title: "Elevate your",
          titleAccent: "privileges.",
          subtitle: "Explore the perks of Silver, Royal, and bespoke Legend tiers.",
          bannerText: "VIP Concierge available 24x7 for custom limits and private tournaments.",
          items: defaultLandingSections.find((s) => s.type === "pricing")?.data.items || [],
        },
      },
      {
        id: "sec_vip_cta",
        type: "final_cta",
        label: "VIP Final CTA",
        visible: true,
        data: {
          badge: "Concierge Priority",
          titlePrefix: "Your private table is ",
          titleAccent: "reserved.",
          titleSuffix: "",
          subtitle: "Experience luxury real-money gaming designed for India's high rollers.",
          androidCta: "Join Royal Club",
          iosCta: "Contact Concierge",
          promoCode: "ROYALVIP",
          smsText: "Direct VIP Hotline: +91 98765 43210",
        },
      },
    ],
    seo: {
      title: "VIP Royal Club — Teen Patti Stars",
      description: "Exclusive VIP perks, relationship managers, and live Goa gala tournaments.",
    },
    createdAt: "2026-02-01",
  },
  {
    id: "page_faq",
    slug: "/faq",
    title: "Frequently Asked Questions (FAQ)",
    status: "published",
    sections: [
      {
        id: "sec_faq_hero",
        type: "hero",
        label: "FAQ Header",
        visible: true,
        data: {
          eyebrow: "Help & Support Desk",
          titlePrefix: "Frequently Asked ",
          titleAccent: "Questions",
          titleSuffix: "",
          subtitle: "Get answers to all questions about instant UPI payouts, RNG fair play, card variations, and welcome bonuses.",
          primaryCtaText: "Instant Download",
          primaryCtaLink: "#download",
          secondaryCtaText: "Back to Home",
          secondaryCtaLink: "/",
          trustText: "24/7 Support Active",
          ratingText: "< 2 min response",
          tableTitle: "Support Hub",
          tablePrize: "24/7 Live",
          tablePlayers: "Online",
        },
      },
      {
        id: "sec_faq_main",
        type: "faq",
        label: "FAQ Knowledgebase",
        visible: true,
        data: defaultLandingSections.find((s) => s.type === "faq")?.data || {
          eyebrow: "FAQ",
          title: "Everything you need",
          titleAccent: "to know.",
          subtitle: "Still have questions? Our 24x7 support team replies in under 2 minutes on WhatsApp.",
        },
      },
    ],
    seo: {
      title: "Frequently Asked Questions (FAQ) — Teen Patti Stars",
      description: "Answers on instant UPI payouts, RNG fair play, card variations, welcome bonuses, and table security.",
    },
    createdAt: "2026-02-15",
  },
];

export const defaultPosts: PostConfig[] = [
  {
    id: "post_1",
    slug: "top-5-teen-patti-strategies",
    title: "Top 5 Strategies for Winning High-Stakes Teen Patti in 2026",
    excerpt:
      "Learn how professional card players manage bankroll, leverage blind betting, and read table momentum in competitive games.",
    content: `Teen Patti is fundamentally a game of mathematical discipline, psychological observation, and bankroll management.

### 1. Bankroll Management: The Golden Rule
Never risk more than 5% of your total session bankroll on a single hand. Set hard session loss limits and lock in winnings before table dynamics shift.

### 2. The Power of Controlled Blind Play
Playing blind for 2-3 rounds keeps pot odds favorable and forces seen opponents to commit double stakes. However, blind play must always be modulated based on table position.

### 3. Side-Show Psychology
Request side-shows with the player immediately preceding you when holding strong pairs or intermediate sequences. Avoid requesting side-shows against known aggressive high-rollers.

### 4. Reading Table Tells
Observe bet timings and reaction speeds. Players who instantly double-up often hold set trails, whereas delayed bets often signal draw attempts.

### 5. Knowing When to Pack
The hallmark of a master player is the ability to fold a decent hand when mathematical probability turns against them. Discard pride and preserve capital for the next deal.`,
    author: "Vikram Singh, Pro Champion",
    date: "Feb 24, 2026",
    category: "Strategy Guide",
    readTime: "4 min read",
    coverColor: "from-emerald-600 to-teal-900",
    badge: "Popular",
    status: "published",
  },
  {
    id: "post_2",
    slug: "instant-upi-payouts-technology",
    title: "Under the Hood: How Instant UPI Payouts Work in Under 30 Seconds",
    excerpt:
      "A deep dive into our direct NPCI bank integration, automated risk scoring, and zero-paperwork instant payout architecture.",
    content: `When a player hits "Withdraw", every millisecond counts. Here is how Teen Patti Stars processes payouts faster than any gaming app in India.

### Direct Webhook Pipeline with Banking Gateways
We maintain direct API pipelines with RazorpayX and Cashfree Banking nodes in Mumbai, bypassing intermediate batch queues.

### Real-time Automated KYC & Anti-Fraud Engines
Withdrawals under ₹50,000 undergo automated algorithmic checks for collusion or anomalous gameplay in sub-200ms. Once verified, the IMPS/UPI mandate is dispatched immediately.

### 99.94% Success Rate
Even on national bank holidays and Sunday evenings, our multi-gateway failover routing guarantees instant credit to GPay, PhonePe, Paytm, and BHIM UPI accounts.`,
    author: "Engineering Team",
    date: "Jan 18, 2026",
    category: "Engineering & Trust",
    readTime: "3 min read",
    coverColor: "from-amber-600 to-rose-900",
    badge: "Tech Spotlight",
    status: "published",
  },
  {
    id: "post_3",
    slug: "diwali-mega-tournament-guide",
    title: "Diwali ₹25 Crore Mega Gala: Tournament Schedule & Registration",
    excerpt:
      "All details on the upcoming ₹25 Cr festival tournament, satellite qualifier boots, and grand finale schedule in Goa.",
    content: `The biggest festival in India deserves the grandest Teen Patti tournament of the decade.

### Key Dates & Satellite Schedule
- **Daily Satellites**: Starting from ₹10 boot every hour.
- **Weekly Mega Qualifiers**: Sunday 8:00 PM IST with ₹1 Cr guaranteed.
- **Diwali Finale**: November 12, 9:00 PM IST — ₹25 Crore Grand Prize Pool.

### VIP Hospitality in Goa
Top 50 finalists receive complimentary 5-star hotel accommodations at Taj Exotica Goa with all-inclusive passes to the Royal Gala Dinner.`,
    author: "Tournament Director",
    date: "Feb 02, 2026",
    category: "Tournaments",
    readTime: "2 min read",
    coverColor: "from-purple-600 to-indigo-900",
    badge: "Events",
    status: "published",
  },
];

const convertedWpPages: PageConfig[] = (rawWpPages as any[]).map((p, idx) => ({
  id: p.id || `page_wp_${idx}`,
  slug: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
  title: p.title,
  status: "published" as const,
  createdAt: p.date || "2026-01-01",
  seo: {
    title: `${p.title} | Teen Patti Stars`,
    description: p.excerpt || `Official details and guide for ${p.title}`,
  },
  sections: [
    {
      id: `sec_text_wp_${idx}`,
      type: "rich_text" as const,
      label: "Page Document & Content",
      visible: true,
      data: {
        eyebrow: "Official Document",
        title: p.title,
        titleAccent: "Overview",
        subtitle: p.excerpt || `Official details regarding ${p.title}.`,
        content: p.content || `Content for ${p.title}`,
      } as RichTextSectionData,
    },
  ],
}));

export const allSitePosts: PostConfig[] = [
  ...(rawWpPosts as PostConfig[]),
  ...defaultPosts.filter((dp) => !(rawWpPosts as any[]).some((wp) => wp.slug === dp.slug)),
];

export const allSitePages: PageConfig[] = [
  ...defaultPages,
  ...convertedWpPages.filter((cp) => !defaultPages.some((dp) => dp.slug === cp.slug)),
];

export const defaultFooterConfig: FooterConfig = {
  brandTitle: "Teen Patti",
  brandAccent: "Stars",
  brandSubtitle: "Premium Edition",
  logoType: "icon",
  logoImageUrl: "",
  description:
    "India's most refined real-money Teen Patti experience. Trusted by 50 lakh+ players across the country. Built with obsession in Bangalore.",
  socials: [
    {
      id: "soc_x",
      name: "X (Twitter)",
      url: "https://x.com",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    },
    {
      id: "soc_ig",
      name: "Instagram",
      url: "https://instagram.com",
      path: "M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    },
    {
      id: "soc_yt",
      name: "YouTube",
      url: "https://youtube.com",
      path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    },
    {
      id: "soc_dc",
      name: "Discord",
      url: "https://discord.com",
      path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z",
    },
  ],
  columns: [
    {
      id: "col_product",
      title: "Product",
      links: [
        { id: "l1", label: "Instant Download", href: "#download" },
        { id: "l2", label: "Our Games", href: "/our-games" },
        { id: "l3", label: "VIP Loyalty Club", href: "/loyalty-programs" },
        { id: "l4", label: "Tournaments", href: "/leaderboards-and-tournaments" },
      ],
    },
    {
      id: "col_resources",
      title: "Resources",
      links: [
        { id: "l5", label: "Player's Guide", href: "/players-guide" },
        { id: "l6", label: "Blog & Chronicles", href: "/blog" },
        { id: "l7", label: "Teen Patti Variations", href: "/teen-patti-games" },
        { id: "l8", label: "HTML Sitemap", href: "/sitemap" },
      ],
    },
    {
      id: "col_search",
      title: "AI & Search",
      links: [
        { id: "l9", label: "XML Sitemap", href: "/sitemap.xml", target: "_blank" },
        { id: "l10", label: "AI Search Guide (llms.txt)", href: "/llms.txt", target: "_blank" },
        { id: "l11", label: "Robots Policy (robots.txt)", href: "/robots.txt", target: "_blank" },
        { id: "l12", label: "Contact Us", href: "/contact-us" },
      ],
    },
    {
      id: "col_legal",
      title: "Legal",
      links: [
        { id: "l13", label: "Privacy Policy", href: "/privacy-policy" },
        { id: "l14", label: "Bonus & Promotions", href: "/welcome-bonuses" },
        { id: "l15", label: "About Us", href: "/about-us" },
        { id: "l16", label: "Frequently Asked Questions (FAQ)", href: "/faq" },
      ],
    },
  ],
  badges: ["18+ Only", "RNG Certified", "SSL Secured", "Curacao Licensed", "AI SEO Indexed (llms.txt)"],
  disclaimer:
    "Disclaimer: Teen Patti Stars involves an element of financial risk and may be addictive. Please play responsibly and at your own risk. This game is restricted to users 18 years and above. Real-money gaming is prohibited in the states of Telangana, Andhra Pradesh, Tamil Nadu, Karnataka, Odisha, and Assam. By using this platform, you confirm that you are of legal age and not a resident of restricted jurisdictions. T&C apply.",
  copyright: "© 2026 Teen Patti Stars Technologies Pvt. Ltd. All rights reserved.",
  cinNumber: "CIN: U72900KA2021PTC147283",
  systemStatusText: "All systems operational",
};

export const defaultSiteConfig: SiteConfig = {
  pages: allSitePages,
  posts: allSitePosts,
  currentPageId: "page_home",
  sections: defaultLandingSections,
  footer: defaultFooterConfig,
  theme: {
    colorMode: "dark",
    primaryGradient: "emerald-gold",
    borderRadius: "rounded-2xl",
    noiseOverlay: true,
    background: {
      type: "color",
      color: "#05080a",
      gradient: "linear-gradient(135deg, #05080a 0%, #062b1e 50%, #05080a 100%)",
      imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=2000&q=80",
      imageOverlayOpacity: 65,
      imageOverlayColor: "#05080a",
      imageBlur: 0,
      imageSize: "cover",
      imagePosition: "center",
      imageAttachment: "fixed",
    },
  },
  seo: {
    title: "Teen Patti Stars — India's Premium Real-Money Card Experience",
    description:
      "Play with 50L+ verified players, instant UPI payouts in 28s, and VIP tournaments.",
    ogImage: "",
  },
};

const LOCAL_STORAGE_KEY_PUBLISHED = "tps_site_config_published_v8";
const LOCAL_STORAGE_KEY_DRAFT = "tps_site_config_draft_v8";
const THEME_MODE_KEY = "tps_color_mode";

function safeLocalStorageSet(key: string, value: any) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch {
    // Gracefully ignore QuotaExceededError or private browsing
  }
}

function loadInitialConfig(): { published: SiteConfig; draft: SiteConfig } {
  try {
    const publishedStr = localStorage.getItem(LOCAL_STORAGE_KEY_PUBLISHED);
    const draftStr = localStorage.getItem(LOCAL_STORAGE_KEY_DRAFT);
    let published = publishedStr ? JSON.parse(publishedStr) : defaultSiteConfig;
    let draft = draftStr ? JSON.parse(draftStr) : published;

    // Load lightweight saved theme preference if present
    const savedThemeMode = localStorage.getItem(THEME_MODE_KEY) as "dark" | "light" | null;
    if (savedThemeMode) {
      if (published.theme) published.theme.colorMode = savedThemeMode;
      if (draft.theme) draft.theme.colorMode = savedThemeMode;
    }

    const deduplicatePages = (pagesList: PageConfig[]) => {
      const map = new Map<string, PageConfig>();
      (pagesList || []).forEach((p) => {
        const clean = (p.slug || "").replace(/^\/+|\/+$/g, "").toLowerCase();
        // If a page with this slug exists, prefer the one with more customized sections or newer
        if (!map.has(clean) || p.isHome) {
          map.set(clean, p);
        } else {
          const existing = map.get(clean)!;
          if ((p.sections?.length || 0) !== (existing.sections?.length || 0)) {
            // Keep the version that has been edited
            map.set(clean, p);
          }
        }
      });
      return Array.from(map.values());
    };

    // ensure pages and posts arrays exist and include all imported items
    if (!published.pages) {
      published.pages = allSitePages;
    } else {
      // Merge missing allSitePages into published.pages without creating duplicates
      allSitePages.forEach((ap) => {
        const apClean = ap.slug.replace(/^\/+|\/+$/g, "").toLowerCase();
        if (!published.pages.some((p: PageConfig) => p.slug.replace(/^\/+|\/+$/g, "").toLowerCase() === apClean)) {
          published.pages.push(ap);
        }
      });
    }
    published.pages = deduplicatePages(published.pages);

    if (!published.posts || published.posts.length < allSitePosts.length) {
      published.posts = allSitePosts;
    }
    if (!published.currentPageId) published.currentPageId = "page_home";
    if (!published.sections) published.sections = defaultLandingSections;
    if (!published.theme) published.theme = defaultSiteConfig.theme;
    if (!published.theme.background) published.theme.background = defaultSiteConfig.theme.background;
    if (!published.footer) published.footer = defaultFooterConfig;

    if (!draft.pages) {
      draft.pages = published.pages;
    } else {
      allSitePages.forEach((ap) => {
        const apClean = ap.slug.replace(/^\/+|\/+$/g, "").toLowerCase();
        if (!draft.pages.some((p: PageConfig) => p.slug.replace(/^\/+|\/+$/g, "").toLowerCase() === apClean)) {
          draft.pages.push(ap);
        }
      });
    }
    draft.pages = deduplicatePages(draft.pages);

    if (!draft.posts || draft.posts.length < allSitePosts.length) {
      draft.posts = allSitePosts;
    }
    if (!draft.currentPageId) draft.currentPageId = "page_home";
    if (!draft.sections) draft.sections = defaultLandingSections;
    if (!draft.theme) draft.theme = defaultSiteConfig.theme;
    if (!draft.theme.background) draft.theme.background = defaultSiteConfig.theme.background;
    if (!draft.footer) draft.footer = defaultFooterConfig;

    return { published, draft };
  } catch {
    return { published: defaultSiteConfig, draft: defaultSiteConfig };
  }
}

interface SiteStoreState {
  publishedConfig: SiteConfig;
  draftConfig: SiteConfig;
  history: SiteConfig[];
  historyIndex: number;
  hasUnsavedChanges: boolean;

  // Builder UI state
  selectedSectionId: string | null;
  activeTab: EditorTab;
  deviceMode: DeviceMode;
  previewOnly: boolean;

  // Actions
  setSelectedSectionId: (id: string | null) => void;
  setActiveTab: (tab: EditorTab) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setPreviewOnly: (preview: boolean) => void;

  // Multi-Page Management
  setCurrentPageId: (pageId: string) => void;
  createPage: (title: string, slug: string) => string;
  createCustomPage: (title: string, slug: string, content?: string, excerpt?: string) => string;
  batchCreatePages: (pagesList: { title: string; slug: string; content?: string; excerpt?: string }[]) => void;
  updatePageMeta: (pageId: string, data: Partial<PageConfig>) => void;
  deletePage: (pageId: string) => void;

  // Blog / Post Management
  createPost: (post: Omit<PostConfig, "id">) => void;
  batchCreatePosts: (posts: Omit<PostConfig, "id">[]) => void;
  updatePost: (id: string, post: Partial<PostConfig>) => void;
  deletePost: (id: string) => void;

  // Section mutations (current active page)
  toggleColorMode: () => void;
  setColorMode: (mode: "dark" | "light") => void;
  updateSectionData: <T = any>(sectionId: string, updater: (prev: T) => T) => void;
  updateSectionProperty: (sectionId: string, key: string, value: any) => void;
  updateSectionLabel: (sectionId: string, label: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  deleteSection: (sectionId: string) => void;
  addSection: (type: SectionConfig["type"]) => void;
  updateTheme: (themeUpdater: (prev: SiteConfig["theme"]) => SiteConfig["theme"]) => void;
  updateFooter: (footerUpdater: (prev: FooterConfig) => FooterConfig) => void;
  updateSeo: (seoUpdater: (prev: SiteConfig["seo"]) => SiteConfig["seo"]) => void;

  // State operations
  undo: () => void;
  redo: () => void;
  publish: () => void;
  discardDraft: () => void;
  resetToDefaults: () => void;
  importConfig: (config: SiteConfig) => void;
}

export const useSiteStore = create<SiteStoreState>((set, get) => {
  const initial = loadInitialConfig();

  const pushHistory = (newDraft: SiteConfig) => {
    const { history, historyIndex } = get();
    const newHistory = [...history.slice(0, historyIndex + 1), newDraft];
    const trimmedHistory = newHistory.slice(-20);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DRAFT, JSON.stringify(newDraft));
      localStorage.setItem(LOCAL_STORAGE_KEY_PUBLISHED, JSON.stringify(newDraft));
    } catch (e) {
      console.error(e);
    }
    set({
      draftConfig: newDraft,
      publishedConfig: newDraft,
      history: trimmedHistory,
      historyIndex: trimmedHistory.length - 1,
      hasUnsavedChanges: false,
    });
  };

  return {
    publishedConfig: initial.published,
    draftConfig: initial.draft,
    history: [initial.draft],
    historyIndex: 0,
    hasUnsavedChanges: JSON.stringify(initial.published) !== JSON.stringify(initial.draft),

    selectedSectionId: "sec_hero",
    activeTab: "content",
    deviceMode: "desktop",
    previewOnly: false,

    setSelectedSectionId: (id) =>
      set({ selectedSectionId: id, activeTab: id ? "content" : "elements" }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setDeviceMode: (mode) => set({ deviceMode: mode }),
    setPreviewOnly: (preview) => set({ previewOnly: preview }),

    // Switch Page in Builder
    setCurrentPageId: (pageId) => {
      const { draftConfig } = get();
      const page = draftConfig.pages.find((p) => p.id === pageId);
      if (!page) return;
      const newDraft = {
        ...draftConfig,
        currentPageId: pageId,
        sections: page.sections || [],
      };
      set({
        draftConfig: newDraft,
        selectedSectionId: page.sections?.[0]?.id || null,
      });
    },

    // Create New Page
    createPage: (title, slug) => {
      const { draftConfig } = get();
      const newId = `page_${Date.now()}`;
      const cleanSlug = slug.startsWith("/") ? slug : `/${slug}`;
      const newPage: PageConfig = {
        id: newId,
        slug: cleanSlug,
        title,
        status: "published",
        sections: [
          {
            id: `sec_hero_${Date.now()}`,
            type: "hero",
            label: "Page Header",
            visible: true,
            data: {
              eyebrow: "New Page",
              titlePrefix: `${title} - `,
              titleAccent: "Stars",
              titleSuffix: "",
              subtitle: `Welcome to the ${title} page. Customize this layout with the visual builder.`,
              primaryCtaText: "Get Started",
              primaryCtaLink: "#download",
              secondaryCtaText: "Learn More",
              secondaryCtaLink: "#features",
              trustText: "50L+ active players",
              ratingText: "4.8 rating",
              tableTitle: "Featured Table",
              tablePrize: "₹10 Lakh",
              tablePlayers: "Live Now",
            },
          },
          {
            id: `sec_faq_${Date.now()}`,
            type: "faq",
            label: "Questions & Details",
            visible: true,
            data: {
              eyebrow: "FAQ",
              title: "Frequently Asked",
              titleAccent: "Questions",
              subtitle: "Learn more about our platform and services.",
              supportTitle: "Need help?",
              supportSubtitle: "Our support team is active 24/7 on WhatsApp.",
              whatsappCta: "Chat Support",
              emailCta: "support@teenpattistars.in",
              items: [
                {
                  id: "q_new_1",
                  q: "What is this page about?",
                  a: "This page was created using the Admin Panel Page Manager and can be customized with the Elementor-style builder.",
                },
              ],
            },
          },
          {
            id: `sec_cta_${Date.now()}`,
            type: "final_cta",
            label: "Action Banner",
            visible: true,
            data: {
              badge: "Official Experience",
              titlePrefix: "Join India's most refined ",
              titleAccent: "card game.",
              titleSuffix: "",
              subtitle: "Play with verified players and get instant 30-second payouts.",
              androidCta: "Download App",
              iosCta: "Play Online",
              promoCode: "₹500 BONUS",
              smsText: "Text STARS to 56161",
            },
          },
        ],
        seo: {
          title: `${title} — Teen Patti Stars`,
          description: `Learn more about ${title} on Teen Patti Stars.`,
        },
        createdAt: new Date().toISOString().split("T")[0],
      };

      const newPages = [...draftConfig.pages, newPage];
      const newDraft = {
        ...draftConfig,
        pages: newPages,
        currentPageId: newId,
        sections: newPage.sections,
      };
      pushHistory(newDraft);
      set({ selectedSectionId: newPage.sections[0]?.id || null });
      return newId;
    },

    createCustomPage: (title, slug, content, excerpt) => {
      const { draftConfig } = get();
      const cleanSlug = slug.startsWith("/") ? slug : `/${slug}`;
      const existingPageIndex = draftConfig.pages.findIndex(
        (p) => p.slug === cleanSlug || (p.title.toLowerCase() === title.toLowerCase() && !p.isHome)
      );

      if (existingPageIndex !== -1) {
        // Update existing page without creating duplicate
        const existing = draftConfig.pages[existingPageIndex];
        const updatedPages = [...draftConfig.pages];
        updatedPages[existingPageIndex] = {
          ...existing,
          title,
          seo: {
            ...existing.seo,
            title: `${title} | Teen Patti Stars`,
            description: excerpt || existing.seo.description,
          },
          sections: existing.sections.map((sec) => {
            if (sec.type === "faq" && content) {
              return {
                ...sec,
                data: {
                  ...sec.data,
                  title,
                  items: [
                    {
                      id: `q_1_${Date.now()}`,
                      q: `Overview: ${title}`,
                      a: content,
                    },
                  ],
                },
              };
            }
            if (sec.type === "hero") {
              return {
                ...sec,
                data: {
                  ...sec.data,
                  titlePrefix: `${title} - `,
                  subtitle: excerpt || sec.data.subtitle,
                },
              };
            }
            return sec;
          }),
        };
        pushHistory({ ...draftConfig, pages: updatedPages });
        return existing.id;
      }

      const newId = `page_${Date.now()}`;
      const newPage: PageConfig = {
        id: newId,
        slug: cleanSlug,
        title,
        status: "published",
        createdAt: new Date().toISOString().split("T")[0],
        seo: {
          title: `${title} | Teen Patti Stars`,
          description: excerpt || `Official guide and rules for ${title}`,
        },
        sections: [
          {
            id: `sec_text_${Date.now()}`,
            type: "rich_text",
            label: "Page Document & Content",
            visible: true,
            data: {
              eyebrow: "Official Document",
              title: title,
              titleAccent: "Overview",
              subtitle: excerpt || `Official details regarding ${title}.`,
              content: content || `Welcome to ${title}.`,
            } as RichTextSectionData,
          },
        ],
      };

      const newPages = [...draftConfig.pages, newPage];
      const newDraft = {
        ...draftConfig,
        pages: newPages,
      };
      pushHistory(newDraft);
      return newId;
    },

    batchCreatePages: (pagesList) => {
      const { draftConfig } = get();
      let currentPages = [...draftConfig.pages];

      pagesList.forEach((p, idx) => {
        const cleanSlug = p.slug.startsWith("/") ? p.slug : `/${p.slug}`;
        const existingIdx = currentPages.findIndex(
          (cp) => cp.slug === cleanSlug || (cp.title.toLowerCase() === p.title.toLowerCase() && !cp.isHome)
        );

        if (existingIdx !== -1) {
          // Update in place without duplicating
          currentPages[existingIdx] = {
            ...currentPages[existingIdx],
            title: p.title,
            seo: {
              ...currentPages[existingIdx].seo,
              title: `${p.title} | Teen Patti Stars`,
              description: p.excerpt || currentPages[existingIdx].seo.description,
            },
          };
        } else {
          // Add new unique page
          const pageId = `page_${Date.now()}_${idx}`;
          currentPages.push({
            id: pageId,
            slug: cleanSlug,
            title: p.title,
            status: "published",
            createdAt: new Date().toISOString().split("T")[0],
            seo: {
              title: `${p.title} | Teen Patti Stars`,
              description: p.excerpt || `Official details for ${p.title}`,
            },
            sections: [
              {
                id: `sec_text_${Date.now()}_${idx}`,
                type: "rich_text",
                label: "Page Document & Content",
                visible: true,
                data: {
                  eyebrow: "Official Document",
                  title: p.title,
                  titleAccent: "Overview",
                  subtitle: p.excerpt || `Official details regarding ${p.title}.`,
                  content: p.content || `Content for ${p.title}`,
                } as RichTextSectionData,
              },
            ],
          });
        }
      });

      pushHistory({ ...draftConfig, pages: currentPages });
    },

    updatePageMeta: (pageId, data) => {
      const { draftConfig } = get();
      const newPages = draftConfig.pages.map((p) =>
        p.id === pageId ? { ...p, ...data } : p
      );
      pushHistory({ ...draftConfig, pages: newPages });
    },

    deletePage: (pageId) => {
      const { draftConfig } = get();
      if (pageId === "page_home") return; // cannot delete home
      const newPages = draftConfig.pages.filter((p) => p.id !== pageId);
      const fallbackId = "page_home";
      const fallbackPage = newPages.find((p) => p.id === fallbackId) || newPages[0];
      const newDraft = {
        ...draftConfig,
        pages: newPages,
        currentPageId: fallbackId,
        sections: fallbackPage?.sections || [],
      };
      pushHistory(newDraft);
    },

    // Post / Blog Management
    createPost: (postData) => {
      const { draftConfig } = get();
      const existingIdx = draftConfig.posts.findIndex(
        (p) => p.slug === postData.slug || p.title.toLowerCase() === postData.title.toLowerCase()
      );

      if (existingIdx !== -1) {
        // Deduplicate & update existing post
        const updatedPosts = [...draftConfig.posts];
        updatedPosts[existingIdx] = {
          ...updatedPosts[existingIdx],
          ...postData,
        };
        pushHistory({ ...draftConfig, posts: updatedPosts });
        return;
      }

      const newPost: PostConfig = {
        ...postData,
        id: `post_${Date.now()}`,
      };
      const newPosts = [newPost, ...draftConfig.posts];
      pushHistory({ ...draftConfig, posts: newPosts });
    },

    batchCreatePosts: (postsList) => {
      const { draftConfig } = get();
      let currentPosts = [...draftConfig.posts];

      postsList.forEach((p, idx) => {
        const existingIdx = currentPosts.findIndex(
          (cp) => cp.slug === p.slug || cp.title.toLowerCase() === p.title.toLowerCase()
        );

        if (existingIdx !== -1) {
          // Deduplicate & update existing
          currentPosts[existingIdx] = {
            ...currentPosts[existingIdx],
            ...p,
          };
        } else {
          // Append unique post
          currentPosts.unshift({
            ...p,
            id: `post_${Date.now()}_${idx}`,
          });
        }
      });

      pushHistory({ ...draftConfig, posts: currentPosts });
    },

    updatePost: (id, postData) => {
      const { draftConfig } = get();
      const newPosts = draftConfig.posts.map((p) =>
        p.id === id ? { ...p, ...postData } : p
      );
      pushHistory({ ...draftConfig, posts: newPosts });
    },

    deletePost: (id) => {
      const { draftConfig } = get();
      const newPosts = draftConfig.posts.filter((p) => p.id !== id);
      pushHistory({ ...draftConfig, posts: newPosts });
    },

    toggleColorMode: () => {
      const { draftConfig, publishedConfig } = get();
      const currentMode = draftConfig.theme?.colorMode || "dark";
      const nextMode: "dark" | "light" = currentMode === "dark" ? "light" : "dark";
      const newDraft: SiteConfig = {
        ...draftConfig,
        theme: {
          ...draftConfig.theme,
          colorMode: nextMode,
        },
      };
      const newPublished: SiteConfig = {
        ...publishedConfig,
        theme: {
          ...publishedConfig.theme,
          colorMode: nextMode,
        },
      };
      safeLocalStorageSet(THEME_MODE_KEY, nextMode);
      safeLocalStorageSet(LOCAL_STORAGE_KEY_PUBLISHED, newPublished);
      safeLocalStorageSet(LOCAL_STORAGE_KEY_DRAFT, newDraft);
      set({ draftConfig: newDraft, publishedConfig: newPublished });
    },

    setColorMode: (mode) => {
      const { draftConfig, publishedConfig } = get();
      const newDraft = {
        ...draftConfig,
        theme: {
          ...draftConfig.theme,
          colorMode: mode,
        },
      };
      const newPublished = {
        ...publishedConfig,
        theme: {
          ...publishedConfig.theme,
          colorMode: mode,
        },
      };
      safeLocalStorageSet(THEME_MODE_KEY, mode);
      safeLocalStorageSet(LOCAL_STORAGE_KEY_PUBLISHED, newPublished);
      safeLocalStorageSet(LOCAL_STORAGE_KEY_DRAFT, newDraft);
      set({ draftConfig: newDraft, publishedConfig: newPublished });
    },

    updateSectionData: (sectionId, updater) => {
      const { draftConfig } = get();
      const newSections = draftConfig.sections.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, data: updater(sec.data) };
        }
        return sec;
      });

      // Also sync into active page
      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );

      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
    },

    updateSectionProperty: (sectionId, key, value) => {
      const { draftConfig } = get();
      const newSections = draftConfig.sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            data: {
              ...sec.data,
              [key]: value,
            },
          };
        }
        return sec;
      });

      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );

      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
    },

    updateSectionLabel: (sectionId, label) => {
      const { draftConfig } = get();
      const newSections = draftConfig.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, label } : sec
      );
      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );
      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
    },

    toggleSectionVisibility: (sectionId) => {
      const { draftConfig } = get();
      const newSections = draftConfig.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, visible: !sec.visible } : sec
      );
      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );
      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
    },

    moveSection: (fromIndex, toIndex) => {
      const { draftConfig } = get();
      if (toIndex < 0 || toIndex >= draftConfig.sections.length) return;
      const newSections = [...draftConfig.sections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);
      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );
      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
    },

    duplicateSection: (sectionId) => {
      const { draftConfig } = get();
      const index = draftConfig.sections.findIndex((s) => s.id === sectionId);
      if (index === -1) return;
      const original = draftConfig.sections[index];
      const newId = `sec_${Date.now()}`;
      const duplicate: SectionConfig = {
        ...original,
        id: newId,
        label: `${original.label} (Copy)`,
        data: JSON.parse(JSON.stringify(original.data)),
      };
      const newSections = [...draftConfig.sections];
      newSections.splice(index + 1, 0, duplicate);
      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );
      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
      set({ selectedSectionId: newId });
    },

    deleteSection: (sectionId) => {
      const { draftConfig, selectedSectionId } = get();
      const newSections = draftConfig.sections.filter((s) => s.id !== sectionId);
      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );
      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
      if (selectedSectionId === sectionId) {
        set({ selectedSectionId: newSections[0]?.id || null });
      }
    },

    addSection: (type) => {
      const { draftConfig } = get();
      const newId = `sec_${Date.now()}`;
      let newSection: SectionConfig;

      if (type === "announcement") {
        newSection = {
          id: newId,
          type: "announcement",
          label: "Announcement Banner",
          visible: true,
          data: {
            text: "🎉 Flash Weekend: 100% Instant Deposit Match up to ₹10,000 using code STARS100!",
            badge: "NEW",
            linkText: "Claim Now",
            linkUrl: "#download",
            bgColor: "gold",
          } as AnnouncementSectionData,
        };
      } else {
        const defaultSample = defaultLandingSections.find((s) => s.type === type);
        newSection = {
          id: newId,
          type,
          label: `${defaultSample?.label || type} (New)`,
          visible: true,
          data: defaultSample ? JSON.parse(JSON.stringify(defaultSample.data)) : {},
        };
      }

      const newSections = [...draftConfig.sections, newSection];
      const newPages = draftConfig.pages.map((p) =>
        p.id === draftConfig.currentPageId ? { ...p, sections: newSections } : p
      );
      pushHistory({ ...draftConfig, sections: newSections, pages: newPages });
      set({ selectedSectionId: newId, activeTab: "content" });
    },

    updateTheme: (themeUpdater) => {
      const { draftConfig } = get();
      pushHistory({ ...draftConfig, theme: themeUpdater(draftConfig.theme) });
    },

    updateFooter: (footerUpdater) => {
      const { draftConfig } = get();
      const currentFooter = draftConfig.footer || defaultFooterConfig;
      const updatedFooter = footerUpdater(currentFooter);
      pushHistory({ ...draftConfig, footer: updatedFooter });
    },

    updateSeo: (seoUpdater) => {
      const { draftConfig } = get();
      pushHistory({ ...draftConfig, seo: seoUpdater(draftConfig.seo) });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        const draft = history[nextIndex];
        safeLocalStorageSet(LOCAL_STORAGE_KEY_DRAFT, draft);
        set({ draftConfig: draft, historyIndex: nextIndex });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        const draft = history[nextIndex];
        safeLocalStorageSet(LOCAL_STORAGE_KEY_DRAFT, draft);
        set({ draftConfig: draft, historyIndex: nextIndex });
      }
    },

    publish: () => {
      const { draftConfig } = get();
      safeLocalStorageSet(LOCAL_STORAGE_KEY_PUBLISHED, draftConfig);
      set({ publishedConfig: draftConfig, hasUnsavedChanges: false });
    },

    discardDraft: () => {
      const { publishedConfig } = get();
      safeLocalStorageSet(LOCAL_STORAGE_KEY_DRAFT, publishedConfig);
      set({
        draftConfig: publishedConfig,
        history: [publishedConfig],
        historyIndex: 0,
        hasUnsavedChanges: false,
      });
    },

    resetToDefaults: () => {
      safeLocalStorageSet(LOCAL_STORAGE_KEY_PUBLISHED, defaultSiteConfig);
      safeLocalStorageSet(LOCAL_STORAGE_KEY_DRAFT, defaultSiteConfig);
      set({
        publishedConfig: defaultSiteConfig,
        draftConfig: defaultSiteConfig,
        history: [defaultSiteConfig],
        historyIndex: 0,
        hasUnsavedChanges: false,
        selectedSectionId: "sec_hero",
      });
    },

    importConfig: (config) => {
      pushHistory(config);
      safeLocalStorageSet(LOCAL_STORAGE_KEY_PUBLISHED, config);
      set({ publishedConfig: config, hasUnsavedChanges: false });
    },
  };
});

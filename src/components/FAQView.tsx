import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Plus,
  HelpCircle,
  ShieldCheck,
  Zap,
  Gift,
  Gamepad2,
  HeartHandshake,
  MessageSquare,
  Mail,
  ChevronRight,
} from "lucide-react";

interface FAQCategoryItem {
  id: string;
  category: "all" | "legal" | "payouts" | "bonuses" | "gameplay" | "responsible";
  q: string;
  a: string;
}

const ALL_FAQS: FAQCategoryItem[] = [
  {
    id: "faq_legal_1",
    category: "legal",
    q: "Is Teen Patti Stars 100% legal to play in India?",
    a: "Yes. In India, game-of-skill tournaments and card games played with strategy are protected under Indian law and distinguished from pure chance gambling by multiple Supreme Court precedents. Teen Patti Stars operates strictly under full IT Act, KYC, and FEMA compliance under an international gaming license. Please note: state regulations currently restrict real-money gaming in Andhra Pradesh, Telangana, Assam, Odisha, and Nagaland — users from these regions are geo-restricted from cash tables.",
  },
  {
    id: "faq_payout_1",
    category: "payouts",
    q: "How fast are UPI withdrawals processed?",
    a: "Our automated payout gateway handles instant UPI and IMPS transactions in an average time of under 30 seconds. Over 99.8% of daily withdrawals are settled directly to your linked Google Pay, PhonePe, Paytm, or bank account 24×7 without manual hold times or withdrawal charges.",
  },
  {
    id: "faq_legal_2",
    category: "legal",
    q: "How is fair play guaranteed? Are there any bots on the tables?",
    a: "We maintain a 100% zero-bot guarantee. Every card deal is generated using an independently certified Quantum Random Number Generator (RNG) certified by iTech Labs. Our real-time machine-learning anti-collusion system monitors player behavior and table IP patterns 24/7 to prevent table manipulation or multi-accounting.",
  },
  {
    id: "faq_bonus_1",
    category: "bonuses",
    q: "How do I claim the ₹500 welcome bonus?",
    a: "Upon completing fast mobile verification and basic KYC, the ₹500 welcome bonus credit is automatically credited to your promotional balance. You can immediately join designated beginner cash tables and promotional tournaments with this balance.",
  },
  {
    id: "faq_gameplay_1",
    category: "gameplay",
    q: "What Teen Patti game variations are available?",
    a: "You can play Classic Teen Patti, Muflis (Low Card wins), AK47 (Aces, Kings, 4s, 7s are wild cards), Joker / Royal Teen Patti, 4x Boot, and Blind Pot variations. We also host fast-paced SNG (Sit & Go) and Multi-Table Tournaments (MTT).",
  },
  {
    id: "faq_payout_2",
    category: "payouts",
    q: "What is the minimum deposit and withdrawal limit?",
    a: "The minimum deposit amount is ₹100, and the minimum withdrawal amount is ₹100. There are no limits on the maximum daily withdrawal for fully KYC-verified VIP players.",
  },
  {
    id: "faq_gameplay_2",
    category: "gameplay",
    q: "Can I create private tables to play exclusively with friends?",
    a: "Yes! You can launch a custom private table in under 10 seconds, choose your preferred boot amount and point multiplier, and invite friends via a shareable WhatsApp link or 6-digit room code with in-app voice chat enabled.",
  },
  {
    id: "faq_bonus_2",
    category: "bonuses",
    q: "How does the Refer-and-Earn affiliate reward work?",
    a: "When your friends join using your unique referral code or link, you earn an instant ₹100 cash bonus on their first deposit plus lifetime rakeback commission on their table play, credited daily to your wallet.",
  },
  {
    id: "faq_responsible_1",
    category: "responsible",
    q: "What responsible gaming tools are available for players?",
    a: "We provide comprehensive player protection tools including daily/weekly deposit limits, self-exclusion periods (from 24 hours to permanent cooling off), session duration alerts, and automatic loss limit enforcement.",
  },
  {
    id: "faq_legal_3",
    category: "legal",
    q: "What documents are required for KYC verification?",
    a: "KYC requires an official government-issued ID (Aadhaar, PAN Card, Voter ID, or Passport) and your UPI ID / Bank account details matching your name for fast tax compliance (TDS) and secure payouts.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "legal", label: "Legality & Fair Play", icon: ShieldCheck },
  { id: "payouts", label: "Withdrawals & UPI", icon: Zap },
  { id: "bonuses", label: "Bonuses & Offers", icon: Gift },
  { id: "gameplay", label: "Gameplay & Rules", icon: Gamepad2 },
  { id: "responsible", label: "Responsible Gaming", icon: HeartHandshake },
];

export function FAQView({ onBack }: { onBack: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<string | null>("faq_legal_1");

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-emerald-400">Help Center</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Frequently Asked Questions</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/40 via-white/[0.02] to-transparent p-8 md:p-12 backdrop-blur-2xl text-center shadow-2xl">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <HelpCircle className="h-3.5 w-3.5" />
            Help & Knowledge Base
          </span>

          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked <span className="gradient-text-gold">Questions</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-white/60 leading-relaxed">
            Find immediate answers on UPI withdrawals, RNG card verification, game variations, welcome bonuses, and fair play standards.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search topics (e.g. 'UPI withdrawal', 'fair play', 'bonus')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-400/50 focus:bg-white/10 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "border border-emerald-400/40 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/10"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-8 space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-white/60 text-sm">
                No questions found matching "<strong>{searchQuery}</strong>".
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = openIndex === item.id;
              return (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-emerald-400/30 bg-gradient-to-br from-emerald-500/[0.08] to-transparent shadow-lg shadow-emerald-500/5"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm md:text-base font-medium text-white">
                      {item.q}
                    </span>
                    <div
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-emerald-400/40 bg-emerald-400/20 text-emerald-300"
                          : "border-white/15 bg-white/5 text-white/60"
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <div className="border-t border-white/5 px-6 pt-4 pb-6 text-sm leading-relaxed text-white/70">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* 24/7 Human Support Card */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-white/[0.02] to-transparent p-8 md:p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            Still Have Questions?
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Connect with our 24×7 Player Support
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/60 leading-relaxed">
            Our support desk is online 24 hours a day in English, Hindi, and 6 regional languages with an average response time of under 2 minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href="mailto:support@teenpattistars.in"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>support@teenpattistars.in</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

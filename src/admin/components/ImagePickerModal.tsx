import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Search,
  Check,
  X,
  Trash2,
  Sparkles,
  Layers,
  Trophy,
  CreditCard,
  Smartphone,
  HelpCircle,
  FolderOpen,
  Eye,
  Copy,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { compressImageFile, validateImageFile } from "../../utils/imageCompressor";

export interface GalleryImageItem {
  id: string;
  title: string;
  category: "cards" | "chips" | "tables" | "tournaments" | "banking" | "strategy" | "mobile" | "players";
  url: string;
  tags: string[];
}

export const CURATED_GALLERY_IMAGES: GalleryImageItem[] = [
  // 🎴 Teen Patti & Cards
  {
    id: "tp_1",
    title: "VIP Luxury Cards Spread",
    category: "cards",
    url: "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    tags: ["teen patti", "cards", "vip", "luxury", "gold", "deck", "spread"],
  },
  {
    id: "tp_2",
    title: "Ace of Spades Showdown",
    category: "cards",
    url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
    tags: ["ace", "spades", "royal flush", "pure sequence", "cards", "teen patti"],
  },
  {
    id: "tp_3",
    title: "Classic Cards & Dealer Hand",
    category: "cards",
    url: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1200&q=80",
    tags: ["dealer", "cards", "classic", "table", "hand", "chaal"],
  },
  {
    id: "tp_4",
    title: "Neon Cyber Card Table",
    category: "cards",
    url: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
    tags: ["neon", "cyber", "glow", "cards", "chips", "night"],
  },
  {
    id: "tp_5",
    title: "High Stakes Card Deck",
    category: "cards",
    url: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
    tags: ["deck", "cards", "stakes", "high roller", "teen patti"],
  },
  {
    id: "tp_6",
    title: "Luxury Felt Hand Distribution",
    category: "cards",
    url: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=80",
    tags: ["distribution", "cards", "felt", "live dealer"],
  },
  {
    id: "tp_7",
    title: "Vintage Royal Cards Lounge",
    category: "cards",
    url: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=1200&q=80",
    tags: ["vintage", "royal", "lounge", "cards", "club"],
  },
  {
    id: "tp_8",
    title: "Precision Dealing Moment",
    category: "cards",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    tags: ["dealing", "precision", "cards", "blind", "chaal"],
  },

  // 🪙 Poker & Chips
  {
    id: "chip_1",
    title: "Golden Table & Chip Mountains",
    category: "chips",
    url: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    tags: ["chips", "gold", "mountain", "pot", "big win", "poker", "teen patti"],
  },
  {
    id: "chip_2",
    title: "High-Roller Stacks & Cards",
    category: "chips",
    url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80",
    tags: ["high roller", "chips", "vip", "stacks", "bet"],
  },
  {
    id: "chip_3",
    title: "All-In Poker Chips Tower",
    category: "chips",
    url: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1200&q=80",
    tags: ["all in", "chips", "tower", "poker", "chaal"],
  },
  {
    id: "chip_4",
    title: "Ceramic Luxury Chips Array",
    category: "chips",
    url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
    tags: ["ceramic", "chips", "luxury", "colors", "tokens"],
  },
  {
    id: "chip_5",
    title: "Gold & Black VIP Tokens",
    category: "chips",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tags: ["gold", "black", "vip", "tokens", "chips", "elite"],
  },
  {
    id: "chip_6",
    title: "Pushing Chips into Center Pot",
    category: "chips",
    url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80",
    tags: ["push", "pot", "betting", "action", "chips"],
  },

  // 👑 Luxury Tables & Felt
  {
    id: "table_1",
    title: "Executive High-Stakes Lounge",
    category: "tables",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["executive", "lounge", "table", "strategy", "vip"],
  },
  {
    id: "table_2",
    title: "Emerald Velvet Club Table",
    category: "tables",
    url: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=1200&q=80",
    tags: ["emerald", "velvet", "club", "luxury", "table"],
  },
  {
    id: "table_3",
    title: "Casino Night Atmosphere & Lights",
    category: "tables",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    tags: ["casino", "night", "lights", "glamour", "atmosphere"],
  },
  {
    id: "table_4",
    title: "Golden Aura Ornate Felt",
    category: "tables",
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    tags: ["gold", "ornate", "felt", "royalty", "art"],
  },

  // 🏆 Tournaments & Trophies
  {
    id: "tour_1",
    title: "Championship Golden Cup",
    category: "tournaments",
    url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    tags: ["championship", "cup", "trophy", "winner", "tournament", "first place"],
  },
  {
    id: "tour_2",
    title: "Grand Tournament Arena Lights",
    category: "tournaments",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    tags: ["arena", "lights", "stage", "tournament", "leaderboard"],
  },
  {
    id: "tour_3",
    title: "Confetti Victory Celebration",
    category: "tournaments",
    url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    tags: ["celebration", "victory", "confetti", "party", "winner"],
  },
  {
    id: "tour_4",
    title: "Competitive Gaming Stage",
    category: "tournaments",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    tags: ["competitive", "gaming", "stage", "esports", "live"],
  },
  {
    id: "tour_5",
    title: "Gold Coins & Jackpot Prize Pool",
    category: "tournaments",
    url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80",
    tags: ["gold coins", "prize pool", "jackpot", "cash", "wealth"],
  },

  // ⚡ Instant UPI & Banking
  {
    id: "bank_1",
    title: "Instant Mobile UPI & Digital Transfer",
    category: "banking",
    url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    tags: ["upi", "banking", "mobile", "instant", "payout", "withdrawal", "deposit"],
  },
  {
    id: "bank_2",
    title: "Cashout & Real-Money Winnings",
    category: "banking",
    url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    tags: ["cashout", "money", "winnings", "rupees", "cash"],
  },
  {
    id: "bank_3",
    title: "Bank-Grade Encryption & Vault Security",
    category: "banking",
    url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80",
    tags: ["security", "vault", "encryption", "safe", "rng", "certified"],
  },
  {
    id: "bank_4",
    title: "24/7 Verified Customer Support",
    category: "banking",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    tags: ["support", "verified", "help", "chat", "24/7"],
  },
  {
    id: "bank_5",
    title: "Safe Instant Payment Gateway",
    category: "banking",
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    tags: ["gateway", "payment", "fast", "upi", "imps", "paytm"],
  },

  // 📱 Mobile App Gameplay & Tech
  {
    id: "mob_1",
    title: "Playing Real-Time Card Game on Phone",
    category: "mobile",
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    tags: ["mobile", "phone", "app", "gameplay", "hand", "touch"],
  },
  {
    id: "mob_2",
    title: "Modern Smartphone Gaming Experience",
    category: "mobile",
    url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80",
    tags: ["smartphone", "screen", "technology", "interface", "app"],
  },
  {
    id: "mob_3",
    title: "Lucky Spin Wheel & Daily Bonus",
    category: "mobile",
    url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    tags: ["wheel", "lucky", "spin", "bonus", "reward", "jackpot"],
  },

  // 🎯 Strategy & Brain
  {
    id: "strat_1",
    title: "Card Game Strategy & Probability Analysis",
    category: "strategy",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    tags: ["strategy", "probability", "analysis", "tactics", "math", "guide"],
  },
  {
    id: "strat_2",
    title: "Friends Enjoying Table Card Game",
    category: "players",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    tags: ["friends", "fun", "social", "table", "multiplayer", "rummy"],
  },
  {
    id: "strat_3",
    title: "Focused Pro Player Calculating Odds",
    category: "players",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    tags: ["player", "pro", "winner", "happy", "champion"],
  },
  {
    id: "strat_4",
    title: "Elite VIP Card Master Focus",
    category: "players",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    tags: ["master", "vip", "elite", "focus", "portrait"],
  },
];

const CATEGORIES = [
  { id: "all", label: "🌟 All Photos", icon: Layers },
  { id: "cards", label: "🎴 Teen Patti & Cards", icon: Sparkles },
  { id: "chips", label: "🪙 Poker & Chips", icon: FolderOpen },
  { id: "tables", label: "👑 Luxury Tables", icon: Eye },
  { id: "tournaments", label: "🏆 Tournaments", icon: Trophy },
  { id: "banking", label: "⚡ Fast UPI & Cashout", icon: CreditCard },
  { id: "mobile", label: "📱 Mobile App", icon: Smartphone },
  { id: "strategy", label: "🎯 Strategy & Players", icon: HelpCircle },
];

export interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  onSelectImage: (imageUrl: string) => void;
  title?: string;
  subtitle?: string;
  aspectRatioHint?: string;
}

export function ImagePickerModal({
  isOpen,
  onClose,
  currentImage = "",
  onSelectImage,
  title = "Choose Any Image You Want",
  subtitle = "Upload your own picture from your computer, pick from the gaming gallery, or paste any web link.",
  aspectRatioHint = "Recommended: 16:9 or 4:3 high-res image (PNG, JPG, WebP)",
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload" | "url">("gallery");

  // Selection state
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImage || "");
  const [customUrlInput, setCustomUrlInput] = useState<string>("");
  const [urlTestStatus, setUrlTestStatus] = useState<"idle" | "loading" | "valid" | "error">("idle");

  // Gallery state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessName, setUploadSuccessName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync currentImage on open
  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentImage || "");
      if (currentImage && !currentImage.startsWith("data:image/")) {
        setCustomUrlInput(currentImage);
      } else {
        setCustomUrlInput("");
      }
      setUrlTestStatus("idle");
      setUploadError(null);
      setUploadSuccessName(null);
    }
  }, [isOpen, currentImage]);

  // Handle Clipboard Paste (Ctrl+V) anywhere when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            setActiveTab("upload");
            await processUploadedFile(file);
            return;
          }
        }
      }

      // If user pasted a URL text in clipboard
      const text = e.clipboardData?.getData("text/plain")?.trim();
      if (text && (text.startsWith("http://") || text.startsWith("https://")) && (text.match(/\.(jpeg|jpg|gif|png|webp|svg|avif)/i) || text.includes("unsplash.com") || text.includes("images."))) {
        setActiveTab("url");
        setCustomUrlInput(text);
        testAndSelectUrl(text);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  // Filter gallery
  const filteredGallery = useMemo(() => {
    let list = CURATED_GALLERY_IMAGES;
    if (selectedCategory !== "all") {
      if (selectedCategory === "strategy") {
        list = list.filter((item) => item.category === "strategy" || item.category === "players");
      } else {
        list = list.filter((item) => item.category === selectedCategory);
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  // Upload processor with client compression
  const processUploadedFile = async (file: File) => {
    try {
      setIsCompressing(true);
      setUploadError(null);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || "Invalid file format");
        return;
      }

      const compressedDataUrl = await compressImageFile(file, {
        maxWidth: 1600,
        maxHeight: 1000,
        quality: 0.85,
        mimeType: "image/webp",
      });

      setSelectedUrl(compressedDataUrl);
      setUploadSuccessName(file.name);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to process image file");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
    e.target.value = "";
  };

  // Test and validate URL
  const testAndSelectUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlTestStatus("idle");
      return;
    }
    setUrlTestStatus("loading");
    const testImg = new window.Image();
    testImg.onload = () => {
      setUrlTestStatus("valid");
      setSelectedUrl(trimmed);
    };
    testImg.onerror = () => {
      setUrlTestStatus("error");
      // Still allow selecting if the user wants to force it
      setSelectedUrl(trimmed);
    };
    testImg.src = trimmed;
  };

  const handleConfirm = () => {
    onSelectImage(selectedUrl);
    onClose();
  };

  const handleClear = () => {
    setSelectedUrl("");
    setCustomUrlInput("");
    onSelectImage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-white/15 bg-[#080d11] text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 p-2 text-black shadow-md">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Universal Picker
                </span>
              </h2>
              <p className="text-[11px] text-white/50">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TABS HEADER */}
        <div className="flex border-b border-white/10 bg-black/40 px-5 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === "gallery"
                ? "border-emerald-400 text-emerald-300"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Curated Gaming Gallery</span>
            <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] text-white/70">
              {CURATED_GALLERY_IMAGES.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === "upload"
                ? "border-emerald-400 text-emerald-300"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload From Computer</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 text-[10px]">
              Direct
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex items-center gap-2 pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === "url"
                ? "border-emerald-400 text-emerald-300"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Paste Web URL</span>
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: CURATED GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              {/* Search & Categories Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cards, chips, gold tables, trophies, UPI cashout..."
                    className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-8 py-2 text-xs text-white placeholder-white/35 focus:border-emerald-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-white/40 shrink-0">
                  Showing {filteredGallery.length} photos
                </div>
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                        isActive
                          ? "bg-emerald-500 text-black font-semibold shadow-md"
                          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Gallery Grid */}
              {filteredGallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                  {filteredGallery.map((item) => {
                    const isCurrent = selectedUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedUrl(item.url)}
                        className={`group relative cursor-pointer overflow-hidden rounded-xl border transition-all ${
                          isCurrent
                            ? "border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg scale-[1.02]"
                            : "border-white/10 bg-black/40 hover:border-white/30 hover:scale-[1.01]"
                        }`}
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                          <img
                            src={item.url}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {isCurrent && (
                            <div className="absolute inset-0 bg-emerald-500/25 flex items-center justify-center">
                              <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg">
                                <Check className="h-3 w-3 stroke-[3]" />
                                Selected
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-gradient-to-t from-black via-black/80 to-transparent">
                          <div className="text-[11px] font-medium text-white truncate">
                            {item.title}
                          </div>
                          <div className="mt-0.5 text-[9px] text-white/40 uppercase tracking-wider">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                  <Search className="mx-auto h-7 w-7 text-white/30" />
                  <p className="mt-2 text-xs font-semibold text-white">No images match your search</p>
                  <p className="mt-1 text-[11px] text-white/40">Try searching for other terms like "cards", "chips", or "gold".</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-300"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD FROM DEVICE */}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif,image/gif"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processUploadedFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
                  isDragging
                    ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                    : "border-white/20 bg-white/[0.02] hover:border-emerald-400/60 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/15 p-4 text-emerald-400 group-hover:scale-110 transition-transform">
                    {isCompressing ? (
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-400 border-t-transparent" />
                    ) : (
                      <Upload className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {isCompressing
                        ? "Optimizing and preparing image..."
                        : "Click to browse or drag & drop your image file here"}
                    </h3>
                    <p className="mt-1 text-xs text-white/50">
                      Supports PNG, JPG, WebP, GIF, SVG, and AVIF up to 25MB
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/70">
                      Auto-compressed to fast WebP
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] text-emerald-400 font-medium">
                      💡 Tip: Press Ctrl+V to paste directly from clipboard
                    </span>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Uploaded Preview if currently a data URL */}
              {selectedUrl && selectedUrl.startsWith("data:image/") && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <Check className="h-4 w-4" />
                      <span>Custom Image Ready</span>
                      {uploadSuccessName && (
                        <span className="text-white/60 font-normal">({uploadSuccessName})</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUrl("")}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="mt-3 relative aspect-[16/9] max-h-56 w-full overflow-hidden rounded-xl bg-black/60 border border-white/10">
                    <img
                      src={selectedUrl}
                      alt="Uploaded preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PASTE WEB URL */}
          {activeTab === "url" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Image Web Address (URL)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={(e) => {
                        setCustomUrlInput(e.target.value);
                        testAndSelectUrl(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/... or https://i.imgur.com/..."
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/35 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => testAndSelectUrl(customUrlInput)}
                    className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-all"
                  >
                    Load & Test
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-white/40">
                  Paste any valid image link from Pinterest, Google, Cloudinary, Imgur, or your CDN.
                </p>
              </div>

              {/* Status feedback */}
              {urlTestStatus === "loading" && (
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                  <span>Checking image URL...</span>
                </div>
              )}

              {urlTestStatus === "valid" && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Check className="h-4 w-4" />
                  <span>Image URL loaded successfully!</span>
                </div>
              )}

              {urlTestStatus === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    Could not verify this image URL directly (it may have hotlink protection or be private). You can still apply it if you know it works.
                  </span>
                </div>
              )}

              {/* URL Preview */}
              {selectedUrl && !selectedUrl.startsWith("data:image/") && (
                <div className="rounded-2xl border border-white/15 bg-black/60 p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                    <span className="font-semibold text-white">Live Image Preview</span>
                    <a
                      href={selectedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:underline text-[11px]"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="mt-3 relative aspect-[16/9] max-h-64 w-full overflow-hidden rounded-xl bg-black/40 border border-white/10">
                    <img
                      src={selectedUrl}
                      alt="URL Preview"
                      className="h-full w-full object-contain"
                      onError={() => setUrlTestStatus("error")}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 bg-black/60 px-5 py-3">
          {/* Current Selection summary */}
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            {selectedUrl ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-black">
                  <img
                    src={selectedUrl}
                    alt="Active choice"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {selectedUrl.startsWith("data:image/")
                      ? "Custom Device Upload"
                      : "Selected Photo"}
                  </div>
                  <div className="text-[10px] text-emerald-400 truncate">
                    {selectedUrl.startsWith("data:image/")
                      ? "Ready to apply"
                      : selectedUrl.slice(0, 45) + "..."}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/40">No image currently selected</div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {selectedUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Image</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-black shadow-lg hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/20 transition-all"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Apply & Select Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

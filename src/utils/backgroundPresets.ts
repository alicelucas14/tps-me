export interface ColorPreset {
  id: string;
  name: string;
  value: string;
  border?: string;
}

export interface GradientPreset {
  id: string;
  name: string;
  value: string;
  preview: string;
}

export interface ImagePreset {
  id: string;
  name: string;
  url: string;
  category: string;
  recommendedOverlayOpacity: number;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "obsidian", name: "Obsidian Royal", value: "#05080a" },
  { id: "emerald-felt", name: "Emerald Felt", value: "#041812" },
  { id: "deep-navy", name: "Midnight Sapphire", value: "#06101e" },
  { id: "ruby-wine", name: "Midnight Bordeaux", value: "#18060b" },
  { id: "charcoal", name: "Charcoal Slate", value: "#0f172a" },
  { id: "pure-black", name: "Deep Onyx", value: "#000000" },
  { id: "cyber-indigo", name: "Cyber Indigo", value: "#09091f" },
  { id: "light-porcelain", name: "Light Porcelain", value: "#f8fafc", border: "border-slate-300" },
  { id: "light-linen", name: "Champagne Linen", value: "#faf7f0", border: "border-amber-200" },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: "emerald-glow",
    name: "Casino Emerald Velvet",
    value: "linear-gradient(135deg, #05080a 0%, #062b1e 50%, #05080a 100%)",
    preview: "from-[#05080a] via-[#062b1e] to-[#05080a]",
  },
  {
    id: "sapphire-night",
    name: "Royal Sapphire Depth",
    value: "linear-gradient(135deg, #05080a 0%, #081d3d 50%, #05080a 100%)",
    preview: "from-[#05080a] via-[#081d3d] to-[#05080a]",
  },
  {
    id: "imperial-ruby",
    name: "Imperial Ruby Glow",
    value: "linear-gradient(135deg, #0a0406 0%, #2b0b15 50%, #0a0406 100%)",
    preview: "from-[#0a0406] via-[#2b0b15] to-[#0a0406]",
  },
  {
    id: "gold-aurora",
    name: "High Roller Gold",
    value: "linear-gradient(135deg, #080703 0%, #2a2008 50%, #05080a 100%)",
    preview: "from-[#080703] via-[#2a2008] to-[#05080a]",
  },
  {
    id: "radial-table",
    name: "Casino Center Table Spotlight",
    value: "radial-gradient(circle at 50% 15%, #152922 0%, #05080a 80%)",
    preview: "from-[#152922] to-[#05080a]",
  },
  {
    id: "cyber-neon",
    name: "Cyber Emerald Nebula",
    value: "linear-gradient(135deg, #020b08 0%, #063828 50%, #0a1824 100%)",
    preview: "from-[#020b08] via-[#063828] to-[#0a1824]",
  },
];

export const IMAGE_PRESETS: ImagePreset[] = [
  {
    id: "poker-table",
    name: "Luxury Poker Felt & Chips",
    category: "Casino Table",
    url: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=2000&q=80",
    recommendedOverlayOpacity: 65,
  },
  {
    id: "vip-bokeh",
    name: "High-Roller Gold Bokeh & Lighting",
    category: "VIP Lounge",
    url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=2000&q=80",
    recommendedOverlayOpacity: 70,
  },
  {
    id: "green-felt",
    name: "Emerald Casino Table Fabric",
    category: "Felt Texture",
    url: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=2000&q=80",
    recommendedOverlayOpacity: 60,
  },
  {
    id: "cyber-cards",
    name: "Cyber Neon Cards & Ambient Atmosphere",
    category: "Modern Vibe",
    url: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=2000&q=80",
    recommendedOverlayOpacity: 65,
  },
  {
    id: "macau-night",
    name: "Macau & Vegas Night Casino Lights",
    category: "Atmospheric",
    url: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=2000&q=80",
    recommendedOverlayOpacity: 75,
  },
  {
    id: "dark-mesh",
    name: "Abstract Dark Luxury Geometry",
    category: "Minimal Pattern",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80",
    recommendedOverlayOpacity: 70,
  },
];

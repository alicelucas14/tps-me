import { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Save,
  Check,
  Globe,
  Sparkles,
  Download,
  ExternalLink,
  Copy,
  Palette,
  Image as ImageIcon,
  PaintBucket,
  Edit3,
  RotateCcw,
  X,
  Code,
  FileCode,
} from "lucide-react";
import { useSiteStore } from "../../store/siteStore";
import {
  generateDynamicSitemapXml,
  generateDynamicRobotsTxt,
  generateDynamicLlmsTxt,
} from "../../utils/seoHelper";

export function SettingsManager() {
  const { draftConfig } = useSiteStore();
  const [saved, setSaved] = useState(false);
  const [gatewayEnabled, setGatewayEnabled] = useState(true);
  const [autoKyc, setAutoKyc] = useState(true);
  const [geoBlock, setGeoBlock] = useState(true);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Custom SEO / AI file content states
  const [customSitemap, setCustomSitemap] = useState<string | null>(null);
  const [customLlms, setCustomLlms] = useState<string | null>(null);
  const [customRobots, setCustomRobots] = useState<string | null>(null);

  // Editor Modal State
  const [activeEditingFile, setActiveEditingFile] = useState<
    "sitemap" | "llms" | "robots" | null
  >(null);
  const [editorContent, setEditorContent] = useState<string>("");

  const pagesCount = (draftConfig.pages || []).length;
  const postsCount = (draftConfig.posts || []).length;
  const totalIndexedUrls = pagesCount + postsCount + 2;

  // Auto-generated defaults
  const autoSitemapXml = generateDynamicSitemapXml(draftConfig);
  const autoRobotsTxt = generateDynamicRobotsTxt();
  const autoLlmsTxt = generateDynamicLlmsTxt(draftConfig);

  // Active contents (custom override if set, else auto-generated)
  const activeSitemapXml = customSitemap ?? autoSitemapXml;
  const activeRobotsTxt = customRobots ?? autoRobotsTxt;
  const activeLlmsTxt = customLlms ?? autoLlmsTxt;

  const handleOpenEditor = (fileType: "sitemap" | "llms" | "robots") => {
    setActiveEditingFile(fileType);
    if (fileType === "sitemap") setEditorContent(activeSitemapXml);
    if (fileType === "llms") setEditorContent(activeLlmsTxt);
    if (fileType === "robots") setEditorContent(activeRobotsTxt);
  };

  const handleSaveEditorContent = () => {
    if (activeEditingFile === "sitemap") setCustomSitemap(editorContent);
    if (activeEditingFile === "llms") setCustomLlms(editorContent);
    if (activeEditingFile === "robots") setCustomRobots(editorContent);
    setActiveEditingFile(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetToAuto = () => {
    if (activeEditingFile === "sitemap") {
      setEditorContent(autoSitemapXml);
      setCustomSitemap(null);
    }
    if (activeEditingFile === "llms") {
      setEditorContent(autoLlmsTxt);
      setCustomLlms(null);
    }
    if (activeEditingFile === "robots") {
      setEditorContent(autoRobotsTxt);
      setCustomRobots(null);
    }
  };

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(type);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            System, SEO & AI Engine Settings
          </h2>
          <p className="text-xs text-white/50">
            Payment gateways, KYC compliance, XML Sitemaps, and Generative AI (LLMs.txt) crawling configurations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saved ? "Saved Successfully" : "Save Configurations"}</span>
        </button>
      </div>

      {/* SEO & AI SEARCH ENGINE HUB */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>SEO & Generative AI Indexing Hub</span>
                <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  {totalIndexedUrls} URLs Active
                </span>
              </h3>
              <p className="text-xs text-white/50">
                Edit RFC Sitemaps, Schema.org JSON-LD graphs, and modern LLMs.txt for Perplexity & ChatGPT.
              </p>
            </div>
          </div>

          <a
            href="/sitemap"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open HTML Sitemap</span>
          </a>
        </div>

        {/* 3 Core SEO / AI Files Generator Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Card 1: sitemap.xml */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  sitemap.xml
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                    customSitemap
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-emerald-400/10 text-emerald-300"
                  }`}
                >
                  {customSitemap ? "Custom Edited" : `${pagesCount} pgs + ${postsCount} posts`}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                Structured XML sitemap notifying Google and Bing crawlers about all created pages & strategy guides.
              </p>
            </div>

            <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
              <button
                onClick={() => handleOpenEditor("sitemap")}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit XML Code</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeSitemapXml, "sitemap")}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10"
                >
                  {copiedFile === "sitemap" ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedFile === "sitemap" ? "Copied" : "Copy XML"}</span>
                </button>
                <button
                  onClick={() =>
                    handleDownload(
                      activeSitemapXml,
                      "sitemap.xml",
                      "application/xml"
                    )
                  }
                  className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                  title="Download sitemap.xml"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: llms.txt (AI Search) */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">
                  llms.txt
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                    customLlms
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {customLlms ? "Custom Edited" : "AI Standard"}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                Machine-readable documentation for Perplexity, ChatGPT, Claude, and Gemini AI search citation.
              </p>
            </div>

            <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
              <button
                onClick={() => handleOpenEditor("llms")}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit LLMs Code</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeLlmsTxt, "llms")}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10"
                >
                  {copiedFile === "llms" ? (
                    <Check className="h-3 w-3 text-amber-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedFile === "llms" ? "Copied" : "Copy LLMs"}</span>
                </button>
                <button
                  onClick={() =>
                    handleDownload(activeLlmsTxt, "llms.txt", "text/plain")
                  }
                  className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                  title="Download llms.txt"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: robots.txt */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-400">
                  robots.txt
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                    customRobots
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-sky-400/10 text-sky-300"
                  }`}
                >
                  {customRobots ? "Custom Edited" : "Search & AI Allowed"}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                Allows Googlebot, Bingbot, GPTBot, and PerplexityBot while securing the admin directory.
              </p>
            </div>

            <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
              <button
                onClick={() => handleOpenEditor("robots")}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Robots Rules</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeRobotsTxt, "robots")}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-white/80 hover:bg-white/10"
                >
                  {copiedFile === "robots" ? (
                    <Check className="h-3 w-3 text-sky-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedFile === "robots" ? "Copied" : "Copy Robots"}</span>
                </button>
                <button
                  onClick={() =>
                    handleDownload(activeRobotsTxt, "robots.txt", "text/plain")
                  }
                  className="p-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"
                  title="Download robots.txt"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CODE EDITOR MODAL */}
      {activeEditingFile && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-[#080d10] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <FileCode className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Editing File:</span>
                    <span className="font-mono text-emerald-400">
                      {activeEditingFile === "sitemap"
                        ? "sitemap.xml"
                        : activeEditingFile === "llms"
                        ? "llms.txt"
                        : "robots.txt"}
                    </span>
                  </h3>
                  <p className="text-[11px] text-white/50">
                    Modify lines directly or click reset to restore auto-generated output.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToAuto}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                  title="Reset back to auto-generated default"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Auto Defaults</span>
                </button>
                <button
                  onClick={() => setActiveEditingFile(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Code Textarea Body */}
            <div className="relative flex-1 p-4 bg-[#040608]">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="h-[55vh] w-full resize-none rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-300 focus:border-emerald-400 focus:outline-none custom-scrollbar leading-relaxed"
                placeholder="Enter file contents here..."
                spellCheck={false}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-5 py-3 text-xs">
              <span className="text-white/40">
                {editorContent.split("\n").length} lines · {editorContent.length} chars
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveEditingFile(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditorContent}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Payment Gateways */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Instant UPI Settlement Engine</h3>
              <p className="text-xs text-white/50">Razorpay / Cashfree API Gateway</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-white/60">UPI Merchant VPA</label>
              <input
                type="text"
                defaultValue="teenpattistars@hdfcbank"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60">Minimum Withdrawal Limit (₹)</label>
              <input
                type="number"
                defaultValue="100"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-white/80">Auto Payouts under ₹50,000</span>
              <input
                type="checkbox"
                checked={gatewayEnabled}
                onChange={(e) => setGatewayEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* KYC & Compliance */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Legal & Compliance Guardrails</h3>
              <p className="text-xs text-white/50">KYC verification & Geo-blocking</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Instant Aadhaar / PAN KYC</div>
                <div className="text-[11px] text-white/40">Verify player age 18+ within 60 seconds</div>
              </div>
              <input
                type="checkbox"
                checked={autoKyc}
                onChange={(e) => setAutoKyc(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div>
                <div className="text-xs font-semibold text-white">Restricted State Geo-Block</div>
                <div className="text-[11px] text-white/40">Block Telangana, AP, TN, KA, Assam, Odisha</div>
              </div>
              <input
                type="checkbox"
                checked={geoBlock}
                onChange={(e) => setGeoBlock(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
            </div>

            <div className="border-t border-white/5 pt-3">
              <label className="text-[11px] text-white/60">Support WhatsApp Number</label>
              <input
                type="text"
                defaultValue="+91 98765 43210"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global Background & Theme Overview Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-400/10 text-purple-300">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Global Visual Theme & Background</h3>
              <p className="text-xs text-white/50">Active styling configured for the public landing pages</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[11px] font-bold capitalize text-emerald-300">
              {draftConfig.theme.background?.type || "Color"} Mode
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
            <div className="text-[11px] font-medium text-white/50">Background Type</div>
            <div className="mt-1 flex items-center gap-2">
              {draftConfig.theme.background?.type === "image" ? (
                <ImageIcon className="h-4 w-4 text-emerald-400" />
              ) : draftConfig.theme.background?.type === "gradient" ? (
                <Sparkles className="h-4 w-4 text-amber-400" />
              ) : (
                <PaintBucket className="h-4 w-4 text-sky-400" />
              )}
              <span className="text-xs font-bold text-white capitalize">
                {draftConfig.theme.background?.type || "Color"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
            <div className="text-[11px] font-medium text-white/50">Active Background Value</div>
            <div className="mt-1 flex items-center gap-2 truncate">
              {draftConfig.theme.background?.type === "image" ? (
                <span className="truncate text-xs font-mono text-white/80">
                  {draftConfig.theme.background?.imageUrl ? "Custom Casino Image" : "Default Image"}
                </span>
              ) : draftConfig.theme.background?.type === "gradient" ? (
                <span className="truncate text-xs font-mono text-white/80">Custom CSS Gradient</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: draftConfig.theme.background?.color || "#05080a" }}
                  />
                  <span className="text-xs font-mono text-white/80">
                    {draftConfig.theme.background?.color || "#05080a"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
            <div className="text-[11px] font-medium text-white/50">Visual Customizer</div>
            <div className="mt-1 text-xs text-white/70">
              Edit colors, overlays, and presets in the Visual Editor.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

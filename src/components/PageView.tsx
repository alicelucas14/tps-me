import React from "react";
import { ArrowLeft, Calendar, FileText, Share2, CheckCircle2, ChevronRight, Download } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

export interface PageViewProps {
  page: {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    author?: string;
    date?: string;
    category?: string;
    readTime?: string;
    coverImage?: string;
    badge?: string;
  };
  onBack: () => void;
}

export function PageView({ page, onBack }: PageViewProps) {
  const cleanSlug = page.slug.replace(/^\/+|\/+$/g, "");
  const formattedCategory = page.category || "Official Guide";

  // Sanitize excerpt to remove raw markdown images, broken link tails, and dangling URLs
  const cleanExcerpt = (page.excerpt || "")
    .replace(/!?\[?[^\]]*\]?\((https?:\/\/[^)]+)\)/gi, "")
    .replace(/\[[^\]]*$/g, "")
    .replace(/\(https?:?[^)]*(\)?|$)/gi, "")
    .replace(/https?:[^\s)]+/gi, "")
    .replace(/[,(:;\\/-]+$/, "")
    .replace(/\s+/g, " ")
    .trim();

  // If content starts with a featured image matching coverImage, strip it to prevent duplicate images
  let bodyContent = page.content || cleanExcerpt || "No content available.";
  if (page.coverImage) {
    const escapedCover = page.coverImage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const topImageRegex = new RegExp(`^\\s*!?\\[?[^\\]]*\\]?\\(${escapedCover}\\)\\s*`, "i");
    bodyContent = bodyContent.replace(topImageRegex, "").trim();
  }

  return (
    <article className="min-h-screen pt-28 pb-24 px-4 md:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Navigation Breadcrumb & Back */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="h-3 w-3" />
            <span className="text-emerald-400">{formattedCategory}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate max-w-[180px] text-white/70">{page.title}</span>
          </div>
        </div>

        {/* Page Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <FileText className="h-3.5 w-3.5" />
              {page.badge || formattedCategory}
            </span>
            {page.readTime && (
              <span className="text-xs text-white/50">{page.readTime}</span>
            )}
            {page.date && (
              <>
                <span className="text-xs text-white/30">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-white/50">
                  <Calendar className="h-3 w-3" />
                  {page.date}
                </span>
              </>
            )}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-5xl leading-tight">
            {page.title}
          </h1>

          {cleanExcerpt.length > 10 && (
            <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed max-w-3xl">
              {cleanExcerpt}
            </p>
          )}

          {/* Author / Official verification badge */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 text-sm font-bold text-white shadow-md">
                {(page.author || "T")[0]}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  <span>{page.author || "Teen Patti Stars Editorial"}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="text-[11px] text-white/50">Verified Official Content</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#download"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Get ₹500 Bonus</span>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Cover Image if Available */}
        {page.coverImage && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
            <img
              src={page.coverImage}
              alt={page.title}
              className="w-full max-h-[480px] object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Main Body Content */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10 backdrop-blur-xl shadow-xl">
          <MarkdownRenderer content={bodyContent} />
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-emerald-950/40 via-black to-amber-950/30 p-8 text-center backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to Play <span className="gradient-text-gold">{page.title}</span> on Real Tables?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
            Join 50L+ verified players, instant 30-second UPI payouts, and RNG-certified fair play tables.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="#download"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Download className="h-4 w-4" />
              <span>Download Free & Get ₹500</span>
            </a>
            <button
              onClick={onBack}
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Explore More Games
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

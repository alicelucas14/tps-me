import { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { Hero } from "./components/Hero";
import { SocialProof } from "./components/SocialProof";
import { Features } from "./components/Features";
import { ProductShowcase } from "./components/ProductShowcase";
import { Benefits } from "./components/Benefits";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { BlogView } from "./components/BlogView";
import { PageView } from "./components/PageView";
import { SitemapView } from "./components/SitemapView";
import { FAQView } from "./components/FAQView";
import { GlobalBackground } from "./components/GlobalBackground";
import { AdminLayout } from "./admin/AdminLayout";
import { useSiteStore } from "./store/siteStore";
import { updateRouteMeta } from "./utils/seoHelper";
import rawWpPages from "./data/wpPages.json";

const SECTION_ANCHORS = new Set([
  "download",
  "showcase",
  "features",
  "pricing",
  "testimonials",
  "benefits",
  "social",
]);

function getActiveRouteString(): string {
  if (typeof window === "undefined") return "home";

  const rawHash = window.location.hash.replace(/^#\/?/, "").replace(/\/+$/, "").trim();
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, "").trim();

  // If hash is an in-page section anchor (e.g. #download, #pricing)
  if (rawHash && SECTION_ANCHORS.has(rawHash.toLowerCase())) {
    return pathname && pathname !== "/" ? pathname : "home";
  }

  // If user visits ANY route using a hash (e.g. #admin, /#admin, #/blog, /#/privacy-policy)
  if (rawHash && rawHash !== "/" && !SECTION_ANCHORS.has(rawHash.toLowerCase())) {
    const cleanPath = `/${rawHash}`;
    window.history.replaceState(null, "", cleanPath);
    return rawHash;
  }

  // If there's an empty hash like "/#" or "#", clean it from the address bar
  if (window.location.hash === "#" || window.location.hash === "#/") {
    const cleanPath = pathname ? `/${pathname}` : "/";
    window.history.replaceState(null, "", cleanPath);
  }

  if (pathname.startsWith("admin")) {
    return "admin";
  }

  if (pathname && pathname !== "/") {
    if (SECTION_ANCHORS.has(pathname.toLowerCase())) {
      return "home";
    }
    return pathname;
  }

  return "home";
}

export default function App() {
  const [route, setRoute] = useState<string>(getActiveRouteString);

  const { publishedConfig, draftConfig } = useSiteStore();
  const colorMode = publishedConfig.theme?.colorMode || draftConfig.theme?.colorMode || "dark";

  const allPages = useMemo(() => {
    return publishedConfig.pages?.length ? publishedConfig.pages : (draftConfig.pages || []);
  }, [publishedConfig.pages, draftConfig.pages]);

  const allPosts = useMemo(() => {
    return publishedConfig.posts?.length ? publishedConfig.posts : (draftConfig.posts || []);
  }, [publishedConfig.posts, draftConfig.posts]);

  // Clean navigation helper - guarantees no hash in URL
  const navigateTo = (path: string) => {
    const clean = path.replace(/^#\/?/, "").replace(/^\/+|\/+$/g, "").trim();
    const targetUrl = clean ? `/${clean}` : "/";
    window.history.pushState(null, "", targetUrl);
    setRoute(clean || "home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Listen to popstate and storage events for instant live site sync across tabs
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getActiveRouteString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tps_site_config_published_v7" || e.key === "tps_site_config_draft_v7") {
        window.location.reload();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    window.addEventListener("storage", handleStorageChange);

    // Global click listener to intercept internal standard links for smooth clean SPA navigation
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // In-page section anchors like #download or #faq
      if (href.startsWith("#") && !href.startsWith("#/")) {
        const targetId = href.replace(/^#/, "");
        if (SECTION_ANCHORS.has(targetId.toLowerCase())) {
          e.preventDefault();
          const currentActive = getActiveRouteString();
          if (currentActive !== "home" && currentActive !== "") {
            navigateTo("/");
            setTimeout(() => {
              const el = document.getElementById(targetId);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 150);
          } else {
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
          return;
        }
      }

      // Special static assets
      if (href.startsWith("/sitemap.xml") || href.startsWith("/robots.txt") || href.startsWith("/llms.txt")) {
        return;
      }

      // Internal links like /privacy-policy, /#/privacy-policy, /#admin, /blog
      if (href.startsWith("/") || href.startsWith("#/")) {
        e.preventDefault();
        const cleanHref = href
          .replace(/^#\/?/, "")
          .replace(/^\/+|\/+$/g, "")
          .replace(/^#\/?/, "");
        navigateTo(cleanHref);
      } else if (href.includes("teenpattistars.me/") || href.includes("teenpattistars.com/")) {
        try {
          const parsed = new URL(href);
          const cleanPath = parsed.pathname.replace(/^\/+|\/+$/g, "").replace(/^#\/?/, "");
          e.preventDefault();
          navigateTo(cleanPath);
        } catch {}
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // Set html theme
  useEffect(() => {
    if (route === "admin") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", colorMode);
    }
  }, [colorMode, route]);

  // Resolve current active view / content
  const resolved = useMemo(() => {
    if (route === "admin") return { type: "admin" as const };
    if (route === "sitemap" || route === "sitemap.xml") return { type: "sitemap" as const };

    const clean = (route || "").replace(/^blog\//, "").replace(/^#\/?|\/+$/g, "").replace(/^\/+|\/+$/g, "");
    const leaf = clean.split("/").filter(Boolean).pop() || clean;

    if (route === "faq" || route === "faq.html" || route === "#faq" || clean === "faq" || leaf === "faq") {
      return { type: "faq" as const };
    }
    if (
      route === "blog" ||
      route === "blogs" ||
      clean === "blog" ||
      clean === "blogs" ||
      leaf === "blog" ||
      leaf === "blogs"
    ) {
      return { type: "blog" as const, slug: undefined };
    }
    if (route === "home" || route === "" || route === "/" || route === "#" || clean === "" || clean === "home") {
      const homePage = allPages.find((p) => p.isHome) || allPages[0];
      return { type: "home" as const, page: homePage };
    }

    // Common route aliases
    const ROUTE_ALIASES: Record<string, string> = {
      "how-to-play": "players-guide",
      "guide": "players-guide",
      "rules": "teen-patti-games",
      "vip-club": "loyalty-programs",
      "vip": "loyalty-programs",
      "loyalty": "loyalty-programs",
      "tournaments": "leaderboards-and-tournaments",
      "bonuses": "welcome-bonuses",
      "terms-and-conditions": "privacy-policy",
      "terms-of-service": "privacy-policy",
      "responsible-gaming": "players-guide",
      "games": "our-games",
    };

    const resolvedClean = ROUTE_ALIASES[clean] || clean;
    const resolvedLeaf = ROUTE_ALIASES[leaf] || leaf;

    // 1. Explicit blog route
    if (route.startsWith("blog/") || route.startsWith("blogs/")) {
      const cleanPostSlug = clean.replace(/^blogs\//, "").replace(/^blog\//, "");
      const post = allPosts.find(
        (p) =>
          p.slug === clean ||
          p.id === clean ||
          p.slug === leaf ||
          p.id === leaf ||
          p.slug === cleanPostSlug
      );
      if (post) return { type: "blog-single" as const, post, slug: post.slug };
    }

    // 2. Match against configured pages in siteStore (Elementor Builder Page Layout)
    const matchedStorePage = allPages.find((p) => {
      const pSlug = (p.slug || "").replace(/^\/+|\/+$/g, "");
      if (p.isHome || pSlug === "home" || pSlug === "") return false;
      return (
        pSlug === clean ||
        pSlug === leaf ||
        pSlug === resolvedClean ||
        pSlug === resolvedLeaf ||
        p.id === clean ||
        p.id === leaf ||
        (clean !== "home" && p.title && p.title.toLowerCase().trim() === clean.toLowerCase().trim())
      );
    });

    if (matchedStorePage) {
      return { type: "page-sections" as const, page: matchedStorePage };
    }

    // 3. Fallback to raw WordPress article view if not configured in Elementor
    const rawWpPage = (rawWpPages as any[]).find((p) => {
      const pSlug = (p.slug || "").replace(/^\/+|\/+$/g, "");
      if (pSlug === "home" || pSlug === "") return false;
      return (
        pSlug === clean ||
        pSlug === leaf ||
        pSlug === resolvedClean ||
        pSlug === resolvedLeaf ||
        p.id === clean ||
        p.id === leaf ||
        (clean !== "home" && p.title && p.title.toLowerCase().trim() === clean.toLowerCase().trim())
      );
    });

    if (rawWpPage) {
      return { type: "page-view" as const, page: rawWpPage };
    }

    // 4. Match against blog posts (direct slug without blog/ prefix)
    const directPost = allPosts.find((p) => {
      const pSlug = (p.slug || "").replace(/^\/+|\/+$/g, "");
      return (
        pSlug === clean ||
        pSlug === leaf ||
        pSlug === resolvedClean ||
        pSlug === resolvedLeaf ||
        p.id === clean ||
        p.id === leaf
      );
    });

    if (directPost) {
      return { type: "blog-single" as const, post: directPost, slug: directPost.slug };
    }

    // 5. If specific non-home path not found, return not-found view instead of home hero
    return { type: "not-found" as const, slug: clean };
  }, [route, allPages, allPosts]);

  // Dynamic SEO & Metadata
  useEffect(() => {
    if (resolved.type === "admin") {
      updateRouteMeta({
        title: "Admin Command HQ | Teen Patti Stars",
        description: "Manage Teen Patti Stars website, pages, tournaments, and SEO settings.",
        path: "/admin",
      });
      return;
    }

    if (resolved.type === "faq") {
      updateRouteMeta({
        title: "Frequently Asked Questions (FAQ) | Teen Patti Stars",
        description: "Find instant answers on instant UPI payouts, RNG fair play, card variations, welcome bonuses, and table security.",
        path: "/faq",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is Teen Patti Stars 100% legal to play in India?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Game-of-skill tournaments and card games played with strategy are protected under Indian law and distinguished from pure chance gambling by multiple Supreme Court precedents.",
              },
            },
            {
              "@type": "Question",
              name: "How fast are UPI withdrawals processed?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our automated payout gateway handles instant UPI and IMPS transactions in an average time of under 30 seconds.",
              },
            },
          ],
        },
      });
      return;
    }

    if (resolved.type === "sitemap") {
      updateRouteMeta({
        title: "Website Sitemap & AI Index Directory | Teen Patti Stars",
        description: "Complete index of all live pages, strategy guides, tournament recaps, and AI crawler documentation files.",
        path: "/sitemap",
      });
      return;
    }

    if (resolved.type === "blog") {
      updateRouteMeta({
        title: "Teen Patti Chronicles & Strategy Guides | Teen Patti Stars",
        description: "Master Teen Patti with expert card strategies, table math, VIP guides, and tournament recaps.",
        path: "/blog",
      });
      return;
    }

    if (resolved.type === "blog-single" && resolved.post) {
      const post = resolved.post;
      updateRouteMeta({
        title: `${post.title} | Teen Patti Stars`,
        description: post.excerpt,
        path: `/blog/${post.slug}`,
        ogImage: post.coverImage || "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
        type: "article",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage || "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
          author: {
            "@type": "Person",
            name: post.author || "Teen Patti Stars Editorial",
          },
          publisher: {
            "@type": "Organization",
            name: "Teen Patti Stars",
            url: "https://teenpattistars.me/",
          },
          datePublished: post.date,
          articleSection: post.category,
          mainEntityOfPage: `https://teenpattistars.me/blog/${post.slug}`,
        },
      });
      return;
    }

    if (resolved.type === "page-view" && resolved.page) {
      const page = resolved.page;
      const cleanSlug = (page.slug || "").replace(/^\/+|\/+$/g, "");
      updateRouteMeta({
        title: `${page.title} | Teen Patti Stars`,
        description: page.excerpt || `Complete official guide and information for ${page.title}`,
        path: `/${cleanSlug}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.excerpt,
          url: `https://teenpattistars.me/${cleanSlug}`,
        },
      });
      return;
    }

    if (resolved.type === "page-sections" && resolved.page) {
      const page = resolved.page;
      const cleanSlug = (page.slug || "").replace(/^\/+|\/+$/g, "");
      updateRouteMeta({
        title: page.seo?.title || `${page.title} | Teen Patti Stars`,
        description: page.seo?.description || `Play Teen Patti on ${page.title}`,
        path: cleanSlug ? `/${cleanSlug}` : "/",
      });
      return;
    }

    // Default Home
    updateRouteMeta({
      title: "Teen Patti Stars — India's Most Refined Real-Money Card Experience",
      description: "Play with 50 lakh+ verified players. Instant UPI payouts in under 30 seconds. Fair-play RNG certified. Zero bots. Pure thrill.",
      path: "/",
    });
  }, [resolved]);

  // Admin Studio Mode
  if (resolved.type === "admin") {
    return (
      <div data-theme="dark" className="bg-[#05080a] text-white">
        <AdminLayout
          onExitToSite={() => {
            navigateTo("/");
          }}
        />
      </div>
    );
  }

  const sectionsToRender =
    resolved.type === "page-sections"
      ? (resolved.page?.sections || [])
      : publishedConfig.sections || [];

  return (
    <div
      data-theme={colorMode}
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
        colorMode === "light" ? "theme-light text-[#0f172a]" : "text-white"
      }`}
    >
      {/* Dynamic Global Background Layer */}
      <GlobalBackground
        background={publishedConfig.theme.background}
        colorMode={colorMode}
      />

      {/* Global noise overlay */}
      {publishedConfig.theme.noiseOverlay && (
        <div className="pointer-events-none fixed inset-0 z-[1] noise" />
      )}

      <div className="relative z-[2]">
        <Navbar />

        <main>
          {resolved.type === "faq" ? (
            <FAQView onBack={() => navigateTo("/")} />
          ) : resolved.type === "sitemap" ? (
            <SitemapView onBack={() => navigateTo("/")} />
          ) : resolved.type === "blog" ? (
            <BlogView
              onBack={() => navigateTo("/")}
              onNavigatePost={(slug) => navigateTo(`blog/${slug}`)}
            />
          ) : resolved.type === "blog-single" ? (
            <BlogView
              activeSlug={resolved.slug}
              onBack={() => navigateTo("blog")}
              onNavigatePost={(slug) => navigateTo(`blog/${slug}`)}
            />
          ) : resolved.type === "page-view" ? (
            <PageView
              page={resolved.page}
              onBack={() => navigateTo("/")}
            />
          ) : resolved.type === "not-found" ? (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
              <div className="max-w-lg text-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 backdrop-blur-xl">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-2xl font-bold mb-6">
                  404
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Page Not Found</h2>
                <p className="text-sm text-white/60 mb-8 leading-relaxed">
                  The page <code className="text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 font-mono">/{resolved.slug}</code> doesn't exist or has moved.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => navigateTo("/")}
                    className="rounded-full bg-gradient-to-r from-[#f5c242] to-[#e6a817] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => navigateTo("blog")}
                    className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition-all"
                  >
                    Browse Blog
                  </button>
                </div>
              </div>
            </div>
          ) : (
            sectionsToRender.map((sec) => {
              if (!sec.visible) return null;

              switch (sec.type) {
                case "announcement":
                  return <AnnouncementBanner key={sec.id} data={sec.data} />;
                case "hero":
                  return <Hero key={sec.id} dynamicData={sec.data} />;
                case "social_proof":
                  return <SocialProof key={sec.id} dynamicData={sec.data} />;
                case "features":
                  return <Features key={sec.id} dynamicData={sec.data} />;
                case "showcase":
                  return <ProductShowcase key={sec.id} dynamicData={sec.data} />;
                case "benefits":
                  return <Benefits key={sec.id} dynamicData={sec.data} />;
                case "testimonials":
                  return <Testimonials key={sec.id} dynamicData={sec.data} />;
                case "pricing":
                  return <Pricing key={sec.id} dynamicData={sec.data} />;
                case "faq":
                  return <FAQ key={sec.id} dynamicData={sec.data} />;
                case "final_cta":
                  return <FinalCTA key={sec.id} dynamicData={sec.data} />;
                default:
                  return null;
              }
            })
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

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
import { GlobalBackground } from "./components/GlobalBackground";
import { AdminLayout } from "./admin/AdminLayout";
import { useSiteStore, type PageConfig, type PostConfig } from "./store/siteStore";
import { updateRouteMeta } from "./utils/seoHelper";
import rawWpPages from "./data/wpPages.json";
import rawWpPosts from "./data/wpPosts.json";

function getActiveRouteString(): string {
  if (typeof window === "undefined") return "home";

  const rawHash = window.location.hash.replace(/^#\/?|\/+$/g, "");
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, "");

  // If user visits an old hash route like /#/privacy-policy, clean it up to /privacy-policy
  if (rawHash && rawHash !== "/") {
    const cleanPath = `/${rawHash}`;
    window.history.replaceState(null, "", cleanPath);
    return rawHash;
  }

  if (pathname.startsWith("admin")) {
    return "admin";
  }

  if (pathname && pathname !== "/") {
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

  // Clean navigation helper
  const navigateTo = (path: string) => {
    const clean = path.replace(/^\/+|\/+$/g, "");
    const targetUrl = clean ? `/${clean}` : "/";
    window.history.pushState(null, "", targetUrl);
    setRoute(clean || "home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Listen to popstate and intercept internal clicks
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getActiveRouteString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);

    // Global click listener to intercept internal standard links for smooth clean SPA navigation
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // In-page section anchors like #download or #faq
      if (href.startsWith("#") && !href.startsWith("#/")) {
        return;
      }

      // Special static assets
      if (href.startsWith("/sitemap.xml") || href.startsWith("/robots.txt") || href.startsWith("/llms.txt")) {
        return;
      }

      // Internal links like /privacy-policy or /#/privacy-policy or /blog
      if (href.startsWith("/") && !href.startsWith("//")) {
        e.preventDefault();
        const cleanHref = href.replace(/^#\/?|\/+$/g, "").replace(/^\/+|\/+$/g, "");
        navigateTo(cleanHref);
      } else if (href.includes("teenpattistars.me/") || href.includes("teenpattistars.com/")) {
        try {
          const parsed = new URL(href);
          const cleanPath = parsed.pathname.replace(/^\/+|\/+$/g, "");
          e.preventDefault();
          navigateTo(cleanPath);
        } catch {}
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
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
    if (route === "blog") return { type: "blog" as const, slug: undefined };
    if (route === "home" || route === "" || route === "/" || route === "#") {
      const homePage = allPages.find((p) => p.isHome) || allPages[0];
      return { type: "home" as const, page: homePage };
    }

    const clean = route.replace(/^blog\//, "").replace(/^\/+|\/+$/g, "");
    const leaf = clean.split("/").filter(Boolean).pop() || clean;

    // 1. Explicit blog route
    if (route.startsWith("blog/")) {
      const post = allPosts.find((p) => p.slug === clean || p.id === clean || p.slug === leaf || p.id === leaf);
      if (post) return { type: "blog-single" as const, post, slug: post.slug };
    }

    // 2. Match against raw WordPress pages directly (contains full markdown content)
    const rawWpPage = (rawWpPages as any[]).find((p) => {
      const pSlug = (p.slug || "").replace(/^\/+|\/+$/g, "");
      if (pSlug === "home" || pSlug === "") return false;
      return (
        pSlug === clean ||
        pSlug === leaf ||
        p.id === clean ||
        p.id === leaf ||
        (clean !== "home" && p.title && p.title.toLowerCase().trim() === clean.toLowerCase().trim())
      );
    });

    if (rawWpPage) {
      return { type: "page-view" as const, page: rawWpPage };
    }

    // 3. Match against configured pages in siteStore
    const matchedStorePage = allPages.find((p) => {
      const pSlug = (p.slug || "").replace(/^\/+|\/+$/g, "");
      if (p.isHome || pSlug === "home" || pSlug === "") return false;
      return (
        pSlug === clean ||
        pSlug === leaf ||
        p.id === clean ||
        p.id === leaf ||
        (clean !== "home" && p.title && p.title.toLowerCase().trim() === clean.toLowerCase().trim())
      );
    });

    if (matchedStorePage) {
      // If it's a page that has rich text content or was imported from WP, render PageView
      const rawMatch = (rawWpPages as any[]).find(
        (rp) => rp.slug === matchedStorePage.slug.replace(/^\/+|\/+$/g, "") || rp.id === matchedStorePage.id
      );
      if (rawMatch) {
        return { type: "page-view" as const, page: rawMatch };
      }
      return { type: "page-sections" as const, page: matchedStorePage };
    }

    // 4. Match against blog posts (direct slug without blog/ prefix)
    const directPost = allPosts.find((p) => {
      const pSlug = (p.slug || "").replace(/^\/+|\/+$/g, "");
      return pSlug === clean || pSlug === leaf || p.id === clean || p.id === leaf;
    });

    if (directPost) {
      return { type: "blog-single" as const, post: directPost, slug: directPost.slug };
    }

    // 5. Default Home Page
    const homePage = allPages.find((p) => p.isHome) || allPages[0];
    return { type: "home" as const, page: homePage };
  }, [route, allPages, allPosts]);

  // Dynamic SEO & Metadata
  useEffect(() => {
    if (resolved.type === "admin") {
      updateRouteMeta({
        title: "Admin Command HQ | Teen Patti Stars",
        description: "Manage Teen Patti Stars website, pages, tournaments, and SEO settings.",
        path: "/#admin",
      });
      return;
    }

    if (resolved.type === "sitemap") {
      updateRouteMeta({
        title: "Website Sitemap & AI Index Directory | Teen Patti Stars",
        description: "Complete index of all live pages, strategy guides, tournament recaps, and AI crawler documentation files.",
        path: "/#/sitemap",
      });
      return;
    }

    if (resolved.type === "blog") {
      updateRouteMeta({
        title: "Teen Patti Chronicles & Strategy Guides | Teen Patti Stars",
        description: "Master Teen Patti with expert card strategies, table math, VIP guides, and tournament recaps.",
        path: "/#/blog",
      });
      return;
    }

    if (resolved.type === "blog-single" && resolved.post) {
      const post = resolved.post;
      updateRouteMeta({
        title: `${post.title} | Teen Patti Stars`,
        description: post.excerpt,
        path: `/#/blog/${post.slug}`,
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
          mainEntityOfPage: `https://teenpattistars.me/#/blog/${post.slug}`,
        },
      });
      return;
    }

    if (resolved.type === "page-view" && resolved.page) {
      const page = resolved.page;
      updateRouteMeta({
        title: `${page.title} | Teen Patti Stars`,
        description: page.excerpt || `Complete official guide and information for ${page.title}`,
        path: `/#/${page.slug}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.excerpt,
          url: `https://teenpattistars.me/#/${page.slug}`,
        },
      });
      return;
    }

    if (resolved.type === "page-sections" && resolved.page) {
      const page = resolved.page;
      updateRouteMeta({
        title: page.seo?.title || `${page.title} | Teen Patti Stars`,
        description: page.seo?.description || `Play Teen Patti on ${page.title}`,
        path: page.slug === "/" ? "" : `/#${page.slug}`,
      });
      return;
    }

    // Default Home
    updateRouteMeta({
      title: "Teen Patti Stars — India's Most Refined Real-Money Card Experience",
      description: "Play with 50 lakh+ verified players. Instant UPI payouts in under 30 seconds. Fair-play RNG certified. Zero bots. Pure thrill.",
      path: "/#",
    });
  }, [resolved]);

  // Admin Studio Mode
  if (resolved.type === "admin") {
    return (
      <div data-theme="dark" className="bg-[#05080a] text-white">
        <AdminLayout
          onExitToSite={() => {
            window.location.hash = "";
            setRoute("home");
          }}
        />
      </div>
    );
  }

  const sectionsToRender =
    resolved.type === "page-sections" && resolved.page?.sections?.length
      ? resolved.page.sections
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
          {resolved.type === "sitemap" ? (
            <SitemapView
              onBack={() => {
                window.location.hash = "";
                setRoute("home");
              }}
            />
          ) : resolved.type === "blog" ? (
            <BlogView
              onBack={() => {
                window.location.hash = "";
                setRoute("home");
              }}
            />
          ) : resolved.type === "blog-single" ? (
            <BlogView
              activeSlug={resolved.slug}
              onBack={() => {
                window.location.hash = "#/blog";
                setRoute("blog");
              }}
            />
          ) : resolved.type === "page-view" ? (
            <PageView
              page={resolved.page}
              onBack={() => {
                window.location.hash = "";
                setRoute("home");
              }}
            />
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

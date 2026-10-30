import { useEffect } from "react";
import { useSiteStore } from "../store/siteStore";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// GA4 measurement IDs look like G-XXXXXXXXXX (legacy UA-123456-1 also accepted).
// Anything else is ignored so the setting can never inject script into the page.
const GA_ID_PATTERN = /^(G-[A-Z0-9]{4,20}|UA-\d{4,10}-\d{1,4})$/i;

export function GoogleAnalytics() {
  const { publishedConfig, draftConfig } = useSiteStore();

  const rawId = (
    publishedConfig?.seo?.googleAnalyticsId ||
    draftConfig?.seo?.googleAnalyticsId ||
    ""
  ).trim();
  const gaId = GA_ID_PATTERN.test(rawId) ? rawId.toUpperCase() : "";

  useEffect(() => {
    if (!gaId) {
      // Remove any existing GA tags if ID was cleared
      document.getElementById("ga-gtag-script")?.remove();
      return;
    }

    // Standard gtag bootstrap, done in JS rather than by building an inline <script> from config text
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function gtag() {
        // gtag.js expects the arguments object itself, not an array
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
    }
    // One config call per ID: it records the initial page_view
    window.gtag("config", gaId);

    let scriptTag = document.getElementById("ga-gtag-script") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "ga-gtag-script";
      scriptTag.async = true;
      document.head.appendChild(scriptTag);
    }
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  }, [gaId]);

  return null;
}

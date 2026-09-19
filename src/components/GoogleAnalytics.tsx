import { useEffect } from "react";
import { useSiteStore } from "../store/siteStore";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function GoogleAnalytics() {
  const { publishedConfig, draftConfig } = useSiteStore();

  const gaId = (
    publishedConfig?.seo?.googleAnalyticsId ||
    draftConfig?.seo?.googleAnalyticsId ||
    ""
  ).trim();

  useEffect(() => {
    if (!gaId) {
      // Remove any existing GA tags if ID was cleared
      const scriptTag = document.getElementById("ga-gtag-script");
      const inlineScriptTag = document.getElementById("ga-gtag-inline");
      if (scriptTag) scriptTag.remove();
      if (inlineScriptTag) inlineScriptTag.remove();
      return;
    }

    // 1. Inject gtag.js external script if not already present
    let scriptTag = document.getElementById("ga-gtag-script") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "ga-gtag-script";
      scriptTag.async = true;
      scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(scriptTag);
    } else {
      scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    }

    // 2. Inject inline gtag configuration script
    let inlineScriptTag = document.getElementById("ga-gtag-inline") as HTMLScriptElement | null;
    const inlineCode = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId.replace(/'/g, "\\'")}');
    `;

    if (!inlineScriptTag) {
      inlineScriptTag = document.createElement("script");
      inlineScriptTag.id = "ga-gtag-inline";
      inlineScriptTag.innerHTML = inlineCode;
      document.head.appendChild(inlineScriptTag);
    } else {
      inlineScriptTag.innerHTML = inlineCode;
    }

    // Trigger page view config call if gtag is already available
    if (typeof window.gtag === "function") {
      window.gtag("config", gaId);
    }
  }, [gaId]);

  return null;
}

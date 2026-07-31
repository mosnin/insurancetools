"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * No default GA4 property is baked in: Insurance Tools has no production
 * analytics property of its own yet. Set NEXT_PUBLIC_GA_ID to enable GA;
 * leaving it unset renders nothing, no request, no reserved space.
 *
 * NEXT_PUBLIC_ vars are inlined at build time, so changing this requires a
 * rebuild, not just a restart.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/**
 * Typed helper for reporting events to GA4. Safe to call from anywhere,
 * including before gtag has loaded or when GA is not configured at all.
 * Tool components can use this to report calculator usage, for example:
 *   trackEvent("calculate", { tool: "mortgage-calculator" });
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params ?? {});
  } catch {
    // Never let analytics failures break the app.
  }
}

function reportPageView(url: string): void {
  if (!GA_ID) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_ID,
    });
  } catch {
    // Never let analytics failures break the app.
  }
}

/**
 * Tracks client-side route changes made by the App Router (pushState based
 * navigation does not trigger a full page load, so GA's automatic pageview
 * on script load only covers the very first render). Must stay wrapped in
 * Suspense by the caller since useSearchParams opts the tree out of static
 * rendering otherwise.
 */
function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    reportPageView(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Loads GA4 (gtag.js) and tracks App Router client-side navigations.
 * Renders nothing when NEXT_PUBLIC_GA_ID is not set.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
          window.gtag = gtag;
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";

export interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
  /** Optional layout hint passed through to data-ad-layout (e.g. "in-article"). */
  layout?: string;
  /** Enables data-full-width-responsive (default true). */
  fullWidthResponsive?: boolean;
  /** Explicit min-height override in pixels. Ignored when ads are disabled. */
  minHeight?: number;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Renders a single Google AdSense unit. Renders null entirely (no
 * placeholder, no reserved space) when NEXT_PUBLIC_ADSENSE_ID is not set,
 * so the layout has no empty ad holes on sites that have not connected
 * AdSense yet.
 */
export function AdUnit({
  slot,
  format = "auto",
  className = "",
  layout,
  fullWidthResponsive = true,
  minHeight,
}: AdUnitProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!publisherId) return;
    // Guard against double-push in React strict mode (effects run twice
    // in development) and across accidental re-mounts of the same node.
    if (pushedRef.current) return;
    const node = insRef.current;
    if (!node || node.getAttribute("data-adsbygoogle-status")) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // AdSense script not loaded yet or blocked, fail silently.
    }
  }, [publisherId]);

  if (!publisherId) {
    return null;
  }

  return (
    <div className={className} role="complementary" aria-label="Advertisement">
      <span className="block text-center text-[10px] uppercase tracking-wide text-slate-400 mb-1">
        Advertisement
      </span>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: minHeight ?? 90 }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

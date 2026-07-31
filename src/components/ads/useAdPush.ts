"use client";

import { useEffect, useRef, type RefObject } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Shared push logic for AdSense <ins> tags. Pushes exactly once per mount
 * and is safe under React strict mode's double-invoked effects.
 */
export function useAdPush(enabled: boolean): RefObject<HTMLModElement | null> {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (pushedRef.current) return;
    const node = insRef.current;
    if (!node || node.getAttribute("data-adsbygoogle-status")) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // AdSense script not loaded yet or blocked, fail silently.
    }
  }, [enabled]);

  return insRef;
}

export function getAdSenseId(): string | undefined {
  return process.env.NEXT_PUBLIC_ADSENSE_ID;
}

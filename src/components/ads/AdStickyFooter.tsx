"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AdLabel } from "./AdLabel";
import { getAdSenseId, useAdPush } from "./useAdPush";

export interface AdStickyFooterProps {
  slot: string;
  className?: string;
}

/**
 * Sticky bottom anchor ad for mobile only, hidden on desktop where a
 * fixed footer bar is more intrusive than useful. Dismissible, once
 * closed it stays closed for the rest of the session. Renders null when
 * AdSense is not connected.
 */
export function AdStickyFooter({ slot, className = "" }: AdStickyFooterProps) {
  const publisherId = getAdSenseId();
  const [dismissed, setDismissed] = useState(false);
  const insRef = useAdPush(Boolean(publisherId) && !dismissed);

  if (!publisherId || dismissed) return null;

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)] ${className}`}
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="relative flex items-center justify-center px-6 pt-1">
        <AdLabel className="mb-0" />
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss advertisement"
          className="absolute right-1 top-1 p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: 50 }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}

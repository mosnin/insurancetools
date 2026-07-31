"use client";

import { AdLabel } from "./AdLabel";
import { getAdSenseId, useAdPush } from "./useAdPush";

export interface AdSidebarProps {
  slot: string;
  className?: string;
}

/**
 * Vertical sidebar unit. Sticks to the viewport while scrolling on
 * desktop and is hidden entirely on mobile, where there is no sidebar
 * rail to place it in. Renders null when AdSense is not connected.
 */
export function AdSidebar({ slot, className = "" }: AdSidebarProps) {
  const publisherId = getAdSenseId();
  const insRef = useAdPush(Boolean(publisherId));

  if (!publisherId) return null;

  return (
    <div
      className={`hidden lg:block lg:sticky lg:top-24 w-full ${className}`}
      role="complementary"
      aria-label="Advertisement"
    >
      <AdLabel />
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: 250 }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="vertical"
        data-full-width-responsive="true"
      />
    </div>
  );
}

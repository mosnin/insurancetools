"use client";

import { AdLabel } from "./AdLabel";
import { getAdSenseId, useAdPush } from "./useAdPush";

export interface AdMultiplexProps {
  slot: string;
  className?: string;
}

/**
 * Multiplex unit, a grid of related-content style ad cards. Works well
 * at the end of an article or tool page. Renders null when AdSense is
 * not connected.
 */
export function AdMultiplex({ slot, className = "" }: AdMultiplexProps) {
  const publisherId = getAdSenseId();
  const insRef = useAdPush(Boolean(publisherId));

  if (!publisherId) return null;

  return (
    <div className={`w-full ${className}`} role="complementary" aria-label="Advertisement">
      <AdLabel />
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: 200 }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="autorelaxed"
      />
    </div>
  );
}

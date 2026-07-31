"use client";

import { AdLabel } from "./AdLabel";
import { getAdSenseId, useAdPush } from "./useAdPush";

export interface AdLeaderboardProps {
  slot: string;
  className?: string;
}

/**
 * Horizontal leaderboard unit, typically placed above the fold near the
 * top of a page. Renders null when AdSense is not connected.
 */
export function AdLeaderboard({ slot, className = "" }: AdLeaderboardProps) {
  const publisherId = getAdSenseId();
  const insRef = useAdPush(Boolean(publisherId));

  if (!publisherId) return null;

  return (
    <div
      className={`w-full ${className}`}
      style={{ minHeight: 100 }}
      role="complementary"
      aria-label="Advertisement"
    >
      <AdLabel />
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}

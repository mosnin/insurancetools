"use client";

import { AdLabel } from "./AdLabel";
import { getAdSenseId, useAdPush } from "./useAdPush";

export interface AdInArticleProps {
  slot: string;
  className?: string;
}

/**
 * Fluid in-article ad unit, meant to be dropped between paragraphs or
 * sections of long-form content. Renders null when AdSense is not
 * connected.
 */
export function AdInArticle({ slot, className = "" }: AdInArticleProps) {
  const publisherId = getAdSenseId();
  const insRef = useAdPush(Boolean(publisherId));

  if (!publisherId) return null;

  return (
    <div className={`my-8 ${className}`} role="complementary" aria-label="Advertisement">
      <AdLabel />
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
    </div>
  );
}

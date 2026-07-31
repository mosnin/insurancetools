import { ExternalLink } from "lucide-react";
import { CONTENT_LAST_UPDATED_LABEL, CONTENT_LAST_UPDATED_ISO } from "@/lib/content-freshness";
import { getCategoryAuthority } from "@/lib/sources";

export interface LastUpdatedProps {
  /**
   * The tool's category slug, e.g. "taxes" or "banking". Optional only for
   * backward compatibility during rollout; every call site should pass it.
   * When present and recognized, a second line links to the federal body
   * whose published figures the category's calculators are checked against.
   */
  category?: string;
}

/**
 * Visible freshness and authority line shown at the top of every tool
 * article.
 *
 * Financial content is dated by nature: contribution limits, tax brackets,
 * and rate assumptions all move year to year. Showing when the article was
 * last reviewed tells a reader whether the figures can still be trusted, and
 * it is one of the signals search engines use to judge whether a page is
 * current for a query where freshness matters.
 *
 * The second line is the site's answer to "who reviewed this": not a named
 * person, since no one on this team is a licensed advisor and a fabricated
 * reviewer byline is worse than none. Instead it names and links the actual
 * federal body that publishes the rates or rules the category's calculators
 * are built on, sourced from `src/lib/sources.ts`. `toolStructuredData` in
 * `src/lib/seo.ts` cites the same authority in the page's JSON-LD, so the
 * visible claim and the structured data cannot drift apart.
 *
 * The <time> element carries the machine readable date so the visible text
 * and the page's structured data cannot drift apart.
 */
export function LastUpdated({ category }: LastUpdatedProps) {
  const authority = category ? getCategoryAuthority(category) : null;

  return (
    <div className="mb-6 space-y-1">
      <p className="text-sm text-slate-500">
        Last updated:{" "}
        <time dateTime={CONTENT_LAST_UPDATED_ISO}>{CONTENT_LAST_UPDATED_LABEL}</time>
      </p>
      {authority && (
        <p className="text-sm text-slate-500">
          Figures checked against{" "}
          <a
            href={authority.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-blue-600 hover:text-blue-700"
          >
            {authority.shortName}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </p>
      )}
    </div>
  );
}

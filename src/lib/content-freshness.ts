/**
 * Single source of truth for when the tool articles were last reviewed.
 *
 * Kept in one place so the visible "Last updated" line, the JSON-LD
 * dateModified, and the sitemap all report the same date. Bump this when a
 * content pass actually revises the articles, not on every deploy: a
 * freshness date that moves without the content moving is noise to a reader
 * and a signal search engines learn to discount.
 */
export const CONTENT_LAST_UPDATED_ISO = "2026-07-28";

export const CONTENT_LAST_UPDATED_LABEL = "July 28, 2026";

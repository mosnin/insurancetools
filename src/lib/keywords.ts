/**
 * Keyword density toolkit for the content pipeline.
 *
 * Plain TypeScript, zero dependencies, so it can run both inside the Next.js
 * app and as a standalone Node script (for example an audit script run over
 * every tool page source file).
 */

/* --------------------------------------------------------------------- */
/* Word counting                                                          */
/* --------------------------------------------------------------------- */

/** Count words in a block of prose (whitespace separated, empty tokens dropped). */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Count how many times a (possibly multi-word) keyword phrase appears in
 * text, case-insensitively, on word boundaries.
 */
export function countKeywordOccurrences(text: string, keyword: string): number {
  const trimmed = keyword.trim();
  if (!trimmed) return 0;
  const pattern = new RegExp(`\\b${escapeRegExp(trimmed).replace(/\s+/g, "\\s+")}\\b`, "gi");
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

/* --------------------------------------------------------------------- */
/* Density                                                                */
/* --------------------------------------------------------------------- */

/**
 * Keyword density as a percentage of total word count. A multi-word keyword
 * counts each occurrence as that many words, matching how density is
 * conventionally reported for phrase keywords.
 */
export function keywordDensity(text: string, keyword: string): number {
  const totalWords = countWords(text);
  if (totalWords === 0) return 0;
  const keywordWordCount = countWords(keyword) || 1;
  const occurrences = countKeywordOccurrences(text, keyword);
  return ((occurrences * keywordWordCount) / totalWords) * 100;
}

export interface KeywordDensityResult {
  keyword: string;
  occurrences: number;
  density: number;
  withinSingleKeywordLimit: boolean;
}

export interface DensityAnalysis {
  wordCount: number;
  perKeyword: KeywordDensityResult[];
  combinedDensity: number;
  combinedWithinTarget: boolean;
  pass: boolean;
  notes: string[];
}

export interface DensityTargets {
  /** Lower bound for combined focus + long-tail keyword density, in percent. */
  minCombinedPercent: number;
  /** Upper bound for combined focus + long-tail keyword density, in percent. */
  maxCombinedPercent: number;
  /** Upper bound for any single keyword's density, in percent. */
  maxSingleKeywordPercent: number;
}

/** Client's target band: combined density 2 to 3 percent, no single keyword over 1.8 percent. */
export const DEFAULT_DENSITY_TARGETS: DensityTargets = {
  minCombinedPercent: 2,
  maxCombinedPercent: 3,
  maxSingleKeywordPercent: 1.8,
};

/**
 * Analyze keyword density for a list of keywords (typically the focus
 * keyword followed by its long-tail variants) against real prose, and
 * report a pass or fail against the target band.
 */
export function analyzeDensity(
  text: string,
  keywords: string[],
  targets: DensityTargets = DEFAULT_DENSITY_TARGETS
): DensityAnalysis {
  const wordCount = countWords(text);

  const perKeyword: KeywordDensityResult[] = keywords.map((keyword) => {
    const occurrences = countKeywordOccurrences(text, keyword);
    const density = keywordDensity(text, keyword);
    return {
      keyword,
      occurrences,
      density,
      withinSingleKeywordLimit: density <= targets.maxSingleKeywordPercent,
    };
  });

  const combinedDensity = perKeyword.reduce((sum, k) => sum + k.density, 0);
  const combinedWithinTarget =
    combinedDensity >= targets.minCombinedPercent && combinedDensity <= targets.maxCombinedPercent;

  const notes: string[] = [];
  if (!combinedWithinTarget) {
    notes.push(
      `Combined density ${combinedDensity.toFixed(2)} percent is outside the ${targets.minCombinedPercent} to ${targets.maxCombinedPercent} percent target band.`
    );
  }
  const overLimit = perKeyword.filter((k) => !k.withinSingleKeywordLimit);
  if (overLimit.length > 0) {
    notes.push(
      `Keywords over the ${targets.maxSingleKeywordPercent} percent single keyword limit: ${overLimit
        .map((k) => `${k.keyword} (${k.density.toFixed(2)}%)`)
        .join(", ")}.`
    );
  }

  return {
    wordCount,
    perKeyword,
    combinedDensity,
    combinedWithinTarget,
    pass: combinedWithinTarget && overLimit.length === 0,
    notes,
  };
}

/* --------------------------------------------------------------------- */
/* TSX prose extraction                                                   */
/* --------------------------------------------------------------------- */

/**
 * Extract human-readable prose out of a TSX page source file so real
 * on-page word count and keyword density can be measured (as opposed to
 * counting JSX markup, imports, and code as "words").
 *
 * This is a best-effort, dependency-free extractor: it strips import and
 * export statements, comments, JSX tags, and JSX expression containers
 * (`{...}`), then collapses whitespace. It is intended for auditing
 * long-form article copy, not for parsing arbitrary TypeScript.
 */
export function stripJsxToText(source: string): string {
  let text = source;

  // Drop import / export statement lines.
  text = text.replace(/^\s*(import|export)\s.*$/gm, " ");

  // Drop block comments, then line comments.
  text = text.replace(/\/\*[\s\S]*?\*\//g, " ");
  text = text.replace(/\/\/.*$/gm, " ");

  // Repeatedly strip JSX expression containers, innermost first, so nested
  // braces (e.g. `{formatCurrency(tool.value)}`) are fully removed.
  for (let i = 0; i < 8; i++) {
    const before = text;
    text = text.replace(/\{[^{}]*\}/g, " ");
    if (text === before) break;
  }

  // Strip remaining tags, keeping their inner text (already unwrapped by
  // the regex only matching the tag markers themselves).
  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, " ");

  // Decode the handful of HTML entities that show up in hand-written copy.
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  return text.replace(/\s+/g, " ").trim();
}

/* --------------------------------------------------------------------- */
/* House style: no em dashes or en dashes                                 */
/* --------------------------------------------------------------------- */

// U+2014 (em dash) and U+2013 (en dash). Written as escape sequences on
// purpose so no literal dash character appears in this source file.
const DASH_PATTERN = /[\u2014\u2013]/;

/** Detect em dashes (U+2014) or en dashes (U+2013) anywhere in text. */
export function hasEmDash(text: string): boolean {
  return DASH_PATTERN.test(text);
}

/** Return the 1-indexed line numbers that contain an em dash or en dash. */
export function findEmDashLines(text: string): number[] {
  return text
    .split("\n")
    .map((line, i) => (DASH_PATTERN.test(line) ? i + 1 : -1))
    .filter((lineNumber) => lineNumber !== -1);
}

import { TOOLS } from "@/lib/tools";
import { CATEGORY_ORDER, CATEGORY_CONTENT } from "@/lib/category-content";
import type { Tool } from "@/types";

/**
 * Fast, dependency free, client safe search index.
 *
 * Two indexes live here: one over TOOLS (the calculator registry, empty at
 * launch) and one over the category taxonomy (12 categories, populated from
 * day one). Every search surface on the site currently reads from the
 * category index, since that's the real, non-empty content today; the tool
 * index is built and ready for the moment calculators start shipping into
 * TOOLS, at which point search results will include both.
 */

interface SearchEntry {
  tool: Tool;
  name: string;
  description: string;
  keywords: string[];
  category: string;
  categorySlug: string;
  haystack: string;
}

/** Lowercase, strip punctuation to spaces, collapse whitespace. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split a normalized query into individual search terms. */
function tokenize(query: string): string[] {
  const normalized = normalize(query);
  return normalized.length ? normalized.split(" ") : [];
}

function buildIndex(): SearchEntry[] {
  return TOOLS.map((tool) => {
    const name = normalize(tool.name);
    const description = normalize(tool.description);
    const keywords = tool.keywords.map(normalize);
    const category = normalize(tool.category);
    const haystack = [name, description, keywords.join(" "), category].join(" ");
    return {
      tool,
      name,
      description,
      keywords,
      category,
      categorySlug: tool.categorySlug,
      haystack,
    };
  });
}

const SEARCH_INDEX: SearchEntry[] = buildIndex();

export interface SearchOptions {
  /** Restrict results to a single categorySlug (e.g. "auto"). */
  category?: string;
  /** Maximum number of results to return. Omit for no limit. */
  limit?: number;
}

/** Per-term match weight against a single entry. Higher is better, 0 means "no match". */
function termScore(entry: SearchEntry, term: string): number {
  if (entry.name === term) return 300;
  if (entry.name.startsWith(term)) return 220;
  if (wordStartsWith(entry.name, term)) return 180;
  if (entry.name.includes(term)) return 150;
  if (entry.keywords.some((k) => k === term)) return 110;
  if (entry.keywords.some((k) => k.includes(term))) return 80;
  if (entry.category.includes(term)) return 50;
  if (entry.description.includes(term)) return 30;
  return 0;
}

/** True if `term` matches the start of any whitespace separated word in `text`. */
function wordStartsWith(text: string, term: string): boolean {
  return text.split(" ").some((word) => word.startsWith(term));
}

/**
 * Search TOOLS by relevance. Scoring priority: exact name match, then name
 * prefix match, then name substring match, then keyword match, then
 * description match. Multi-word queries require every term to match
 * somewhere (name, description, keywords, or category) before a tool is
 * included. Ties are broken alphabetically by tool name.
 */
export function searchTools(query: string, opts: SearchOptions = {}): Tool[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const fullQuery = terms.join(" ");
  const pool = opts.category
    ? SEARCH_INDEX.filter((entry) => entry.categorySlug === opts.category)
    : SEARCH_INDEX;

  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of pool) {
    const allTermsMatch = terms.every((term) => entry.haystack.includes(term));
    if (!allTermsMatch) continue;

    let score = 0;

    if (entry.name === fullQuery) score += 1000;
    else if (entry.name.startsWith(fullQuery)) score += 700;
    else if (entry.name.includes(fullQuery)) score += 400;

    for (const term of terms) {
      score += termScore(entry, term);
    }

    scored.push({ entry, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.tool.name.localeCompare(b.entry.tool.name);
  });

  const results = scored.map((s) => s.entry.tool);
  return typeof opts.limit === "number" ? results.slice(0, opts.limit) : results;
}

/** Popular/representative tools to show as suggestions on empty or no-result states. */
export function getPopularTools(limit = 8): Tool[] {
  return TOOLS.slice(0, limit);
}

/* --------------------------------------------------------------------- */
/* Category search: the index every search surface actually uses today.  */
/* --------------------------------------------------------------------- */

export interface CategoryResult {
  slug: string;
  name: string;
  description: string;
  href: string;
}

interface CategoryEntry {
  result: CategoryResult;
  haystack: string;
}

function buildCategoryIndex(): CategoryEntry[] {
  return CATEGORY_ORDER.map((slug) => {
    const content = CATEGORY_CONTENT[slug];
    const haystack = normalize(
      [content.displayName, content.focusKeyword, content.secondaryKeywords.join(" "), content.intro].join(" ")
    );
    return {
      result: {
        slug,
        name: `${content.displayName} Insurance`,
        description: content.intro,
        href: `/tools/${slug}`,
      },
      haystack,
    };
  });
}

const CATEGORY_INDEX: CategoryEntry[] = buildCategoryIndex();

export interface CategorySearchOptions {
  limit?: number;
}

/** Search the category taxonomy by relevance. Every term must match somewhere in the category's name, keywords, or intro. */
export function searchCategories(query: string, opts: CategorySearchOptions = {}): CategoryResult[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const results = CATEGORY_INDEX.filter((entry) => terms.every((term) => entry.haystack.includes(term))).map(
    (entry) => entry.result
  );
  return typeof opts.limit === "number" ? results.slice(0, opts.limit) : results;
}

/** Every category, in taxonomy order, for empty-state suggestions. */
export function getAllCategories(limit?: number): CategoryResult[] {
  const results = CATEGORY_INDEX.map((entry) => entry.result);
  return typeof limit === "number" ? results.slice(0, limit) : results;
}

/* --------------------------------------------------------------------- */
/* Unified search: tools and categories together.                        */
/* --------------------------------------------------------------------- */

export interface SearchResult {
  name: string;
  description: string;
  href: string;
  slug: string;
  /** Category label shown as the result's meta tag. */
  meta: string;
  kind: "tool" | "category";
}

function toolToResult(tool: Tool): SearchResult {
  return {
    name: tool.name,
    description: tool.description,
    href: `/tools/${tool.categorySlug}/${tool.slug}`,
    slug: tool.slug,
    meta: tool.category,
    kind: "tool",
  };
}

function categoryToResult(category: CategoryResult): SearchResult {
  return {
    name: category.name,
    description: category.description,
    href: category.href,
    slug: category.slug,
    meta: "Category",
    kind: "category",
  };
}

/**
 * Search tools and categories together, tools ranked first since a direct
 * tool match is more specific and more useful than its parent category.
 * Falls back to category-only results while the tool registry is thin, so
 * every query still returns something browsable.
 */
export function searchAll(query: string, opts: { limit?: number } = {}): SearchResult[] {
  const tools = searchTools(query).map(toolToResult);
  const categories = searchCategories(query).map(categoryToResult);
  const results = [...tools, ...categories];
  return typeof opts.limit === "number" ? results.slice(0, opts.limit) : results;
}

/** Empty-state suggestions: any live tools first, then every category. */
export function getStartingResults(limit?: number): SearchResult[] {
  const tools = getPopularTools().map(toolToResult);
  const categories = getAllCategories().map(categoryToResult);
  const results = [...tools, ...categories];
  return typeof limit === "number" ? results.slice(0, limit) : results;
}

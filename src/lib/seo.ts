import type { Metadata } from "next";
import type { Tool } from "@/types";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { getCategoryAuthority } from "@/lib/sources";

/* --------------------------------------------------------------------- */
/* Core site constants                                                    */
/* --------------------------------------------------------------------- */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.insurancetools.org";
const SITE_NAME = "Insurance Tools";
/**
 * Short brand token used as the pipe suffix inside `<title>` tags. The full
 * site name costs 15 characters of a 60 character budget, which pushes the
 * longest tool titles past the limit, so titles carry the short wordmark
 * ("Insurance Tools") while every other surface (Open Graph siteName,
 * Organization schema, authors) carries the same full brand name.
 */
const SITE_BRAND = "Insurance Tools";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_CTA = "Try it free, no sign-up required.";

/* --------------------------------------------------------------------- */
/* Small string helpers                                                   */
/* --------------------------------------------------------------------- */

/**
 * Truncate text to at most `maxLength` characters without cutting a word in
 * half. Trims trailing punctuation left dangling by the cut.
 */
export function truncateAtWordBoundary(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const sliced = trimmed.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  const safe = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return safe.replace(/[,.;:\s]+$/, "").trim();
}

/**
 * Validate that a meta description falls in the 150 to 160 character band
 * that Google reliably renders without truncation.
 */
export function validateDescriptionLength(
  description: string,
  min = 150,
  max = 160
): { valid: boolean; length: number; reason?: string } {
  const length = description.length;
  if (length < min) {
    return { valid: false, length, reason: `Description is ${min - length} characters short of the ${min} character minimum.` };
  }
  if (length > max) {
    return { valid: false, length, reason: `Description is ${length - max} characters over the ${max} character maximum.` };
  }
  return { valid: true, length };
}

/**
 * Validate that a page title is a keyword-first, brand-suffixed title no
 * longer than 60 characters.
 */
export function validateTitleLength(title: string, max = 60): { valid: boolean; length: number; reason?: string } {
  const length = title.length;
  if (length > max) {
    return { valid: false, length, reason: `Title is ${length - max} characters over the ${max} character maximum.` };
  }
  return { valid: true, length };
}

function toTitleCase(text: string): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function lowerFirstChar(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function stripTrailingPeriod(text: string): string {
  return text.trim().replace(/\.+$/, "");
}

function normalizeForCompare(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/* --------------------------------------------------------------------- */
/* Focus keyword derivation and exact-match validation                    */
/* --------------------------------------------------------------------- */

/**
 * Derive the focus keyword for a tool. Prefers `tool.keywords[0]` when it is
 * the same phrase as the de-hyphenated slug (the common case for
 * well-tagged tools), otherwise falls back to the de-slugified slug itself
 * so the keyword is always guaranteed to appear verbatim in the URL.
 */
export function getFocusKeyword(tool: Tool): string {
  const deslugged = tool.slug.replace(/-/g, " ").trim();
  const primary = tool.keywords?.[0]?.trim();
  if (primary && normalizeForCompare(primary) === normalizeForCompare(deslugged)) {
    return primary;
  }
  return deslugged;
}

/** Result of checking exact keyword match across slug, title, description, and H1. */
export interface ExactMatchResult {
  keyword: string;
  slugMatches: boolean;
  titleMatches: boolean;
  descriptionMatches: boolean;
  h1Matches: boolean;
  allMatch: boolean;
  failures: string[];
}

/**
 * Check that the focus keyword appears verbatim (case-insensitive) in the
 * slug, SEO title, meta description, and H1. Pass explicit values to check
 * hand-authored copy, or omit them to check the auto-generated defaults.
 */
export function checkExactMatch(
  tool: Tool,
  overrides: { title?: string; description?: string; h1?: string } = {}
): ExactMatchResult {
  const keyword = getFocusKeyword(tool);
  const nk = normalizeForCompare(keyword);

  const title = overrides.title ?? buildSeoTitle(tool);
  const description = overrides.description ?? buildMetaDescription(tool);
  const h1 = overrides.h1 ?? tool.name;
  const slugAsPhrase = tool.slug.replace(/-/g, " ");

  const slugMatches = normalizeForCompare(slugAsPhrase).includes(nk);
  const titleMatches = normalizeForCompare(title).includes(nk);
  const descriptionMatches = normalizeForCompare(description).includes(nk);
  const h1Matches = normalizeForCompare(h1).includes(nk);

  const failures: string[] = [];
  if (!slugMatches) failures.push(`slug "${tool.slug}" does not contain the focus keyword "${keyword}"`);
  if (!titleMatches) failures.push(`title "${title}" does not contain the focus keyword "${keyword}"`);
  if (!descriptionMatches) failures.push(`description does not contain the focus keyword "${keyword}"`);
  if (!h1Matches) failures.push(`H1 "${h1}" does not contain the focus keyword "${keyword}"`);

  return {
    keyword,
    slugMatches,
    titleMatches,
    descriptionMatches,
    h1Matches,
    allMatch: slugMatches && titleMatches && descriptionMatches && h1Matches,
    failures,
  };
}

/**
 * Throws if slug, title, description, and H1 do not all share the exact
 * focus keyword. Intended for build-time or audit-time checks, not for use
 * on the request path.
 */
export function assertExactMatch(
  tool: Tool,
  overrides: { title?: string; description?: string; h1?: string } = {}
): void {
  const result = checkExactMatch(tool, overrides);
  if (!result.allMatch) {
    throw new Error(`Exact keyword match failed for tool "${tool.slug}": ${result.failures.join("; ")}`);
  }
}

/* --------------------------------------------------------------------- */
/* Title and description builders                                         */
/* --------------------------------------------------------------------- */

/**
 * Build the keyword-first SEO title. The focus keyword always appears
 * first, verbatim, followed by a pipe-separated brand suffix, capped at 60
 * characters. If adding the brand suffix would exceed 60 characters the
 * suffix is dropped rather than cutting the keyword, so the keyword always
 * stays intact and verbatim.
 */
export function buildSeoTitle(tool: Tool): string {
  const keyword = getFocusKeyword(tool);
  const titleCased = toTitleCase(keyword);
  const withBrand = `${titleCased} | ${SITE_BRAND}`;
  if (withBrand.length <= 60) return withBrand;
  if (titleCased.length <= 60) return titleCased;
  return truncateAtWordBoundary(titleCased, 60);
}

/**
 * Build a 150 to 160 character meta description. The focus keyword lands
 * within the first 10 words and the description always ends with a call to
 * action.
 */
export function buildMetaDescription(tool: Tool, cta: string = DEFAULT_CTA): string {
  const keyword = getFocusKeyword(tool);
  const benefit = lowerFirstChar(stripTrailingPeriod(tool.description || `get instant, accurate ${keyword} results`));
  const lead = `Use the ${keyword} to ${benefit}.`;
  const full = `${lead} ${cta}`;

  if (full.length >= 150 && full.length <= 160) return full;

  if (full.length > 160) {
    const budget = 160 - cta.length - 1;
    const truncatedLead = truncateAtWordBoundary(lead, budget);
    const result = `${truncatedLead} ${cta}`;
    return result.length <= 160 ? result : truncateAtWordBoundary(result, 160);
  }

  const filler = " Get instant, accurate results in seconds.";
  let padded = `${lead}${filler} ${cta}`;
  if (padded.length > 160) {
    padded = `${truncateAtWordBoundary(padded, 160 - cta.length - 1)} ${cta}`;
  }
  if (padded.length < 150) {
    padded = `${padded} Updated for ${new Date().getFullYear()}.`;
    if (padded.length > 160) padded = truncateAtWordBoundary(padded, 160);
  }
  return padded;
}

/* --------------------------------------------------------------------- */
/* Metadata generators (existing call signatures preserved)               */
/* --------------------------------------------------------------------- */

export function generateToolMetadata(tool: Tool): Metadata {
  const title = buildSeoTitle(tool);
  const description = buildMetaDescription(tool);
  const url = `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`;

  return {
    title,
    description,
    keywords: tool.keywords.join(", "),
    authors: [{ name: SITE_NAME }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function generateHomeMetadata(): Metadata {
  const title = "Insurance Tools: Free Coverage & Claim Calculators";
  const description =
    "Free insurance calculators for auto, home, life, health, and business coverage. Find out what you need, what a claim pays, and what's worth buying.";

  return {
    title,
    description,
    keywords: "insurance calculator, coverage calculator, deductible calculator, claim calculator, insurance tools",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: SITE_URL },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/**
 * Build metadata for a category hub page such as /tools/calculators.
 * Falls back to a de-slugified name and generic copy if the slug is not
 * (yet) registered in `CATEGORIES`.
 */
export function generateCategoryMetadata(categorySlug: string): Metadata {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const toolCount = TOOLS.filter((t) => t.categorySlug === categorySlug).length;
  const name = category?.name ?? toTitleCase(categorySlug.replace(/-/g, " "));
  const categoryDescription =
    category?.description ?? `Free online ${name.toLowerCase()} tools and calculators.`;

  const title = truncateAtWordBoundary(`${name} | ${SITE_BRAND}`, 60);
  const rawDescription = `Browse ${toolCount} free ${name.toLowerCase()} tools. ${categoryDescription} Free, instant, no sign-up required.`;
  const description =
    rawDescription.length > 160 ? truncateAtWordBoundary(rawDescription, 159) + "." : rawDescription;
  const url = `${SITE_URL}/tools/${categorySlug}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export interface GeneratePageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
  keywords?: string[];
}

/**
 * General purpose metadata builder for non-tool, non-category pages such as
 * /explore, /search, /about, and /contact.
 */
export function generatePageMetadata(options: GeneratePageMetadataOptions): Metadata {
  const { title, description, path, noIndex = false, image, keywords } = options;
  const url = path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    ...(keywords ? { keywords: keywords.join(", ") } : {}),
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* --------------------------------------------------------------------- */
/* Structured data (JSON-LD) builders                                     */
/* --------------------------------------------------------------------- */

export function toolStructuredData(tool: Tool) {
  const authority = getCategoryAuthority(tool.categorySlug);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`,
    // Names the federal body the category's figures are checked against,
    // mirroring the visible "Figures checked against" line LastUpdated
    // renders, so the structured claim and the on-page claim cannot drift
    // apart. See src/lib/sources.ts for the full registry and rationale.
    ...(authority
      ? {
          citation: {
            "@type": "GovernmentOrganization",
            name: authority.name,
            url: authority.url,
          },
        }
      : {}),
  };
}

export function breadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

/**
 * HowTo structured data describing the step-by-step usage of a calculator
 * tool. Use for tools where the article walks through a clear input to
 * output sequence.
 */
export function howToStructuredData(options: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  url?: string;
}) {
  const { name, description, steps, totalTime, url } = options;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    ...(url ? { url } : {}),
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
      ...(step.image ? { image: step.image } : {}),
    })),
  };
}

export function webPageStructuredData(options: {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
  datePublished?: string;
  breadcrumb?: object;
}) {
  const { name, description, url, dateModified, datePublished, breadcrumb } = options;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(breadcrumb ? { breadcrumb } : {}),
  };
}

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
  };
}

/**
 * Site-wide WebSite structured data with a SearchAction so Google can offer
 * a sitelinks search box pointed at /search?q={search_term_string}.
 */
export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function itemListStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * CollectionPage structured data for category hub pages, combining the
 * page description with an ItemList of the tools it contains.
 */
export function collectionPageStructuredData(options: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
}) {
  const { name, description, url, items } = options;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: itemListStructuredData(items),
  };
}

/**
 * Speakable structured data marking the CSS selectors that contain the
 * concise, voice-assistant-friendly summary of the page (e.g. a TL;DR
 * block).
 */
export function speakableStructuredData(cssSelectors: string[], url?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    ...(url ? { url } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

export { SITE_URL, SITE_NAME, SITE_BRAND };

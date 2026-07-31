import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";
import { CATEGORY_ORDER } from "@/lib/category-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.insurancetools.org";

/**
 * Category slugs come from the authoritative `CATEGORY_ORDER` list rather
 * than the live `TOOLS` registry, since every category hub page exists and
 * is indexable from launch even before it has any tools in it.
 */
function getCategorySlugs(): string[] {
  return [...CATEGORY_ORDER];
}

/**
 * De-duplicate the registry by slug, keeping the first entry for each.
 *
 * `TOOLS` currently carries eight slugs twice. Seven are exact repeats
 * within one category, which emitted the same `<loc>` twice and had Search
 * Console reporting duplicate sitemap URLs. The eighth,
 * `college-savings-calculator`, is registered under both `calculators` and
 * `planners` while only the `calculators` page exists, so the planners URL
 * 308-redirected and a sitemap should never list a redirect.
 *
 * Keeping the first match makes the sitemap agree with `getToolBySlug`,
 * which resolves the same way, so the URL we submit is always the URL the
 * rest of the site links to. The registry duplicates are a separate data
 * issue worth cleaning up at the source.
 */
function getUniqueTools() {
  const seen = new Set<string>();
  return TOOLS.filter((tool) => {
    if (seen.has(tool.slug)) return false;
    seen.add(tool.slug);
    return true;
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const categorySlugs = getCategorySlugs();

  // Tier 1: home page.
  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Tier 2: primary discovery / navigation pages.
  const discovery: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Tier 3: category hub pages, one per unique categorySlug in TOOLS.
  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Tier 4: individual tool pages, the largest and most numerous tier.
  const toolPages: MetadataRoute.Sitemap = getUniqueTools().map((tool) => ({
    url: `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Tier 5: search and static informational pages.
  const secondary: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...home, ...discovery, ...categoryPages, ...toolPages, ...secondary];
}

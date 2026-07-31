import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.insurancetools.org";

/**
 * Note on `/search?q=`: it is deliberately NOT disallowed here.
 *
 * The search results page already returns `noindex` for any query (see
 * `generateMetadata` in `src/app/search/page.tsx`), and a URL blocked in
 * robots.txt is never fetched, so Google would never see that directive.
 * Blocking it would instead leave the URLs eligible to appear as bare,
 * snippet-less results whenever anything links to them. Letting crawlers
 * fetch the page and read `noindex` is what actually keeps result pages out
 * of the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

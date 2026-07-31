import { CATEGORY_ORDER, CATEGORY_CONTENT } from "@/lib/category-content";
import type { Tool } from "@/types";

/**
 * Explore page data, derived from the real category taxonomy in
 * src/lib/category-content.ts. The calculator library ships into TOOLS
 * category by category, so `tools` is empty for every category today;
 * ExploreCategory keeps the field so category pages and cards don't need
 * to change shape once tools start appearing.
 */

export interface ExploreCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
}

export const EXPLORE_CATEGORIES: ExploreCategory[] = CATEGORY_ORDER.map((slug) => {
  const content = CATEGORY_CONTENT[slug];
  return {
    slug,
    name: content.displayName,
    description: content.intro,
    icon: content.icon,
    tools: [],
  };
});

export const TOTAL_CATEGORY_COUNT = EXPLORE_CATEGORIES.length;

export const EXPLORE_FAQS = [
  {
    question: "What is the Explore page and how is Insurance Tools organized?",
    answer:
      "The Explore page is the central hub for every insurance calculator category on the site. It links to all 12 categories, auto, home, life, health, business, renters, travel, pet, claims, deductibles, coverage, and state requirements. You can browse by category or search to jump straight to the one you need. Every tool, as it ships, is free to use and requires no sign-up.",
  },
  {
    question: "How do I find the right insurance calculator for my situation?",
    answer:
      "Start with the category cards on this page, since each one groups tools by purpose, such as Claims for an active loss or Coverage for figuring out how much insurance to buy in the first place. If you already know what you're looking for, use the search box to jump straight to the matching category.",
  },
  {
    question: "Are these insurance calculators free and accurate?",
    answer:
      "Yes, every calculator on this site is completely free, requires no account, and runs entirely in your browser. The underlying math follows standard coverage, deductible, and claims methodology checked against public guidance. That said, results are estimates for planning purposes, not a quote or insurance advice, and real policies vary based on underwriting, state rules, and insurer.",
  },
  {
    question: "What's the difference between a coverage calculator and a claims calculator?",
    answer:
      "Coverage calculators answer questions before you buy or renew a policy, how much liability coverage, how much life insurance, what deductible makes sense. Claims calculators answer questions after a loss has happened, what a payout might look like, how depreciation affects a settlement. Both are listed separately so you can quickly tell which kind of tool you need.",
  },
  {
    question: "Can I use these tools on mobile, and do I need to create an account?",
    answer:
      "Every tool on Insurance Tools is fully responsive and works on phones, tablets, and desktops without any app to download. No account, email address, or payment information is ever required. Your inputs stay in your browser and are not stored on our servers, so you can experiment freely with different numbers.",
  },
  {
    question: "How often are new insurance calculators added to this site?",
    answer:
      "New calculators are added regularly, category by category, as we build out the full library described in the site's roadmap. The Explore page always reflects the current, complete catalog, so bookmarking this page is the most reliable way to see what's new.",
  },
  {
    question: "Where can I verify the coverage rules behind these calculators?",
    answer:
      "For authoritative details on coverage types and consumer protections, the NAIC at naic.org is a strong starting point, alongside HealthCare.gov for health plan terminology and your state's Department of Insurance for state-specific requirements. We link to these and other public resources throughout the site so you can confirm the assumptions behind any calculation.",
  },
];

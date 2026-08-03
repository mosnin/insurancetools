import { TOOLS, getToolBySlug } from "@/lib/tools";
import { CATEGORY_CONTENT, CATEGORY_ORDER, type CategorySlug } from "@/lib/category-content";
import type { Tool } from "@/types";

/**
 * Homepage-only content data: category metadata, curated tool picks, and
 * FAQ copy. Kept separate from src/lib/tools.ts and src/lib/category-content.ts
 * so the homepage can present a curated, hand-ranked view of the catalog
 * without touching those registries directly.
 */

export interface HomeCategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string;
  /** Curated, ordered slugs to feature in the category preview card. Empty until tools ship. */
  featuredSlugs: string[];
}

const FEATURED_SLUGS_BY_CATEGORY: Partial<Record<CategorySlug, string[]>> = {
  auto: [
    "car-insurance-coverage-calculator",
    "500-vs-1000-deductible-calculator",
    "gap-insurance-calculator",
    "total-loss-payout-calculator",
  ],
  home: [
    "home-replacement-cost-calculator",
    "dwelling-coverage-calculator",
    "water-damage-claim-calculator",
    "home-insurance-underinsurance-calculator",
  ],
  life: [
    "life-insurance-needs-calculator",
    "dime-method-calculator",
    "income-replacement-calculator",
    "term-length-calculator",
  ],
  health: [
    "break-even-medical-spending-calculator",
    "health-plan-comparison-calculator",
    "hsa-savings-calculator",
    "ppo-vs-hdhp-calculator",
  ],
  business: [
    "general-liability-coverage-calculator",
    "professional-liability-errors-omissions-calculator",
    "cyber-insurance-coverage-calculator",
    "workers-compensation-cost-estimator",
  ],
  renters: [
    "renters-insurance-coverage-calculator",
    "renters-personal-property-value-calculator",
    "renters-liability-coverage-calculator",
    "roommate-renters-insurance-split-calculator",
  ],
  travel: [
    "trip-cancellation-coverage-calculator",
    "travel-medical-insurance-calculator",
    "medical-evacuation-coverage-calculator",
    "cruise-travel-insurance-value-calculator",
  ],
  pet: [
    "pet-insurance-value-calculator",
    "accident-only-vs-comprehensive-pet-calculator",
    "pet-wellness-plan-value-calculator",
    "multi-pet-insurance-discount-calculator",
  ],
  claims: [
    "insurance-claim-payout-calculator",
    "deductible-claim-calculator",
    "claim-underpayment-calculator",
    "settlement-negotiation-target-calculator",
  ],
};

export const CATEGORY_META: HomeCategoryMeta[] = CATEGORY_ORDER.map((slug) => ({
  slug,
  name: CATEGORY_CONTENT[slug].displayName,
  description: CATEGORY_CONTENT[slug].intro,
  featuredSlugs: FEATURED_SLUGS_BY_CATEGORY[slug] ?? [],
}));

export function getCategoryFeaturedTools(meta: HomeCategoryMeta): Tool[] {
  return meta.featuredSlugs.map((slug) => getToolBySlug(slug)).filter((t): t is Tool => Boolean(t));
}

export function getCategoryToolCount(categorySlug: string): number {
  return TOOLS.filter((t) => t.categorySlug === categorySlug).length;
}

export const TOTAL_TOOL_COUNT = TOOLS.length;
export const TOTAL_CATEGORY_COUNT = CATEGORY_META.length;

export interface HomeFaqItem {
  question: string;
  answer: string;
}

/**
 * Homepage FAQs. Every answer runs a few sentences so the same data can
 * back both the visible accordion and the FAQPage structured data without
 * editing.
 */
export const HOME_FAQS: HomeFaqItem[] = [
  {
    question: "Are these free insurance calculators really free to use?",
    answer:
      "Yes. Every tool on Insurance Tools is free to use as many times as you like, with no account, no email address, and no payment. The site is supported by advertising rather than subscriptions or paywalls, so nothing sits behind a signup wall. Bookmark any calculator and come back to it whenever your numbers change.",
  },
  {
    question: "Do these calculators replace advice from an insurance agent?",
    answer:
      "No. These tools help you understand coverage math, model claim scenarios, and compare options before you talk to an agent or buy a policy. They are not a substitute for advice from a licensed insurance professional, and they do not generate quotes tied to a specific carrier. Use the output to arrive at that conversation better prepared, not to replace it.",
  },
  {
    question: "What does Insurance Tools do that a generic quote comparison site does not?",
    answer:
      "Quote comparison sites start from the assumption you already know what coverage you want. These calculators sit one step earlier: figuring out how much coverage you actually need, what a claim might pay, and whether a given deductible or upgrade is worth its cost. That's the decision that should happen before you request a quote, not after.",
  },
  {
    question: "How is Insurance Tools organized?",
    answer:
      "Around twelve categories: auto, home, life, health, business, renters, travel, and pet coverage, plus four categories that cut across all of them, claims, deductibles, coverage needs, and state requirements. Each category groups calculators around the specific decisions people in that category actually face.",
  },
  {
    question: "Do I need an account or a download to use these calculators?",
    answer:
      "No. Every tool runs in your browser and calculates as you type, with nothing to install and no account to create. The figures you enter stay on your device, are not sent to our servers, and are not shared with third parties. That's what makes it safe to test sensitive numbers such as income, home value, or medical spending.",
  },
  {
    question: "How do I find the right calculator for my situation?",
    answer:
      "Type your question into the spotlight search at the top of this page, which matches on category names and descriptions across the site. If you'd rather browse, start from the category that matches your goal: coverage calculators if you're figuring out how much insurance to buy, deductible calculators if you're comparing plan options, or claims calculators if you're estimating a payout.",
  },
  {
    question: "Are the figures behind these calculators kept current?",
    answer:
      "Calculators tied to published rules, thresholds, or state requirements are checked against the current guidance from bodies like the NAIC, HealthCare.gov, and individual state insurance departments, and revised when that guidance changes. Where a figure is time sensitive, the relevant page names the source it's checked against.",
  },
  {
    question: "Can I use these calculators for business insurance decisions?",
    answer:
      "Yes. The business category covers general liability, professional liability, cyber, and workers' compensation coverage, with profession-specific guidance planned for contractors, consultants, and other small business owners. These tools handle the coverage math reliably, but requirements vary by state and industry, so confirm anything that affects a policy purchase with a licensed agent.",
  },
  {
    question: "Is anything on Insurance Tools insurance advice?",
    answer:
      "No. Everything here is math applied to the numbers you supply, provided for educational and informational purposes only. We do not know your full financial picture, your risk tolerance, or your state's specific requirements, and none of these tools attempt to recommend a specific policy or insurer. Use the output to understand your options and to arrive better prepared for a conversation with a licensed agent.",
  },
];

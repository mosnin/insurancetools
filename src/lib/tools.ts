import type { Tool, Category } from "@/types";

/**
 * The tool registry. Insurance Tools launched with the site framework in
 * place and the calculator library empty — every calculator that ships
 * gets added here, which automatically wires it into search, the mega
 * menu, category pages, and the sitemap.
 */
export const TOOLS: Tool[] = [
  {
    slug: "car-insurance-coverage-calculator",
    name: "Car Insurance Coverage Calculator",
    description:
      "Find out how much auto liability coverage you need based on your assets and income, plus whether collision, gap, and umbrella coverage are worth adding.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "car insurance coverage calculator",
      "how much car insurance do i need",
      "auto insurance coverage calculator",
      "liability coverage calculator",
      "how much liability insurance do i need for my car",
      "full coverage vs liability calculator",
      "car insurance liability limits calculator",
      "recommended car insurance coverage amounts",
    ],
    relatedTools: [],
  },
];

export const CATEGORIES: Category[] = [
  {
    slug: "auto",
    name: "Auto",
    description: "Liability limits, deductibles, gap insurance, and claim payouts for your car.",
    icon: "Car",
    tools: TOOLS.filter((t) => t.categorySlug === "auto"),
  },
  {
    slug: "home",
    name: "Home",
    description: "Dwelling coverage, replacement cost, and homeowners claim tools.",
    icon: "Home",
    tools: TOOLS.filter((t) => t.categorySlug === "home"),
  },
  {
    slug: "life",
    name: "Life",
    description: "Income replacement, term length, and life insurance needs calculators.",
    icon: "HeartPulse",
    tools: TOOLS.filter((t) => t.categorySlug === "life"),
  },
  {
    slug: "health",
    name: "Health",
    description: "Plan comparisons, deductibles, HSA savings, and out-of-pocket cost tools.",
    icon: "Stethoscope",
    tools: TOOLS.filter((t) => t.categorySlug === "health"),
  },
  {
    slug: "business",
    name: "Business",
    description: "General liability, E&O, cyber, and workers' comp coverage calculators.",
    icon: "Briefcase",
    tools: TOOLS.filter((t) => t.categorySlug === "business"),
  },
  {
    slug: "renters",
    name: "Renters",
    description: "Personal property coverage and liability tools for tenants.",
    icon: "Building2",
    tools: TOOLS.filter((t) => t.categorySlug === "renters"),
  },
  {
    slug: "travel",
    name: "Travel",
    description: "Trip cancellation, medical evacuation, and travel policy value calculators.",
    icon: "Plane",
    tools: TOOLS.filter((t) => t.categorySlug === "travel"),
  },
  {
    slug: "pet",
    name: "Pet",
    description: "Vet bill coverage, wellness plans, and pet insurance value calculators.",
    icon: "PawPrint",
    tools: TOOLS.filter((t) => t.categorySlug === "pet"),
  },
  {
    slug: "claims",
    name: "Claims",
    description: "Payout estimators for total loss, depreciation, and settlement scenarios.",
    icon: "FileCheck2",
    tools: TOOLS.filter((t) => t.categorySlug === "claims"),
  },
  {
    slug: "deductibles",
    name: "Deductibles",
    description: "Compare deductible levels and find the break-even point for your budget.",
    icon: "Wallet",
    tools: TOOLS.filter((t) => t.categorySlug === "deductibles"),
  },
  {
    slug: "coverage",
    name: "Coverage",
    description: "Figure out how much coverage you actually need before you buy.",
    icon: "ShieldCheck",
    tools: TOOLS.filter((t) => t.categorySlug === "coverage"),
  },
  {
    slug: "state-requirements",
    name: "State Requirements",
    description: "Minimum coverage rules and requirements by state.",
    icon: "MapPin",
    tools: TOOLS.filter((t) => t.categorySlug === "state-requirements"),
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedTools
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];
}

/**
 * Returns up to `max` tools from the same category for the Recommended Tools carousel.
 * Prioritizes explicitly listed relatedTools, then fills with other category tools.
 * Always excludes the current tool. Pulls dynamically from TOOLS so new tools appear automatically.
 */
export function getCategoryCarousel(currentSlug: string, categorySlug: string, max = 4): Tool[] {
  const categoryTools = TOOLS.filter(
    (t) => t.categorySlug === categorySlug && t.slug !== currentSlug
  );
  const currentTool = TOOLS.find((t) => t.slug === currentSlug);
  const related = currentTool?.relatedTools ?? [];

  const sorted = [
    ...categoryTools.filter((t) => related.includes(t.slug)),
    ...categoryTools.filter((t) => !related.includes(t.slug)),
  ];

  return sorted.slice(0, max);
}

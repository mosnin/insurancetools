import type { LucideIcon } from "lucide-react";
import {
  Car,
  Home,
  HeartPulse,
  Stethoscope,
  Briefcase,
  Building2,
  Plane,
  PawPrint,
  FileCheck2,
  Wallet,
  ShieldCheck,
  MapPin,
} from "lucide-react";

// Navigation data for the header mega menu and footer link blocks.
// Every href below is generated from the real category registry
// (src/lib/tools.ts and src/lib/category-content.ts), so there are no dead
// links: every entry resolves to /tools/<categorySlug> or, once a tool
// ships, /tools/<categorySlug>/<slug>.

export interface NavTool {
  name: string;
  href: string;
  slug: string;
}

export interface NavCategory {
  /** Sub-category label shown as a column heading inside the mega menu. */
  name: string;
  /** Real category slug this sub-category belongs to, e.g. "auto". */
  categorySlug: string;
  /** Link to the full category listing page. */
  href: string;
  tools: NavTool[];
}

export interface NavItem {
  label: string;
  /** Short tagline shown in the mega menu header and used for SEO context. */
  description: string;
  /** Primary link for this top-level item (its main category page). */
  href: string;
  /** All real category slugs represented under this top-level item. */
  categorySlugs: string[];
  categories: NavCategory[];
  /** Highlighted, popular tools shown in the mega menu featured panel. */
  featured: NavTool[];
  icon: LucideIcon;
}

/**
 * Insurance Tools launched with this taxonomy in place and the calculator
 * library empty. Every NavItem below maps to exactly one category slug
 * (see CATEGORY_ORDER in src/lib/category-content.ts); `tools` and
 * `featured` arrays fill in automatically as calculators ship.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Auto",
    description: "Liability limits, deductibles, gap insurance, and claim payouts for your car.",
    href: "/tools/auto",
    categorySlugs: ["auto"],
    icon: Car,
    categories: [
      { name: "Auto Insurance", categorySlug: "auto", href: "/tools/auto", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Home",
    description: "Dwelling coverage, replacement cost, and homeowners claim tools.",
    href: "/tools/home",
    categorySlugs: ["home"],
    icon: Home,
    categories: [
      { name: "Home Insurance", categorySlug: "home", href: "/tools/home", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Life",
    description: "Income replacement, term length, and life insurance needs calculators.",
    href: "/tools/life",
    categorySlugs: ["life"],
    icon: HeartPulse,
    categories: [
      { name: "Life Insurance", categorySlug: "life", href: "/tools/life", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Health",
    description: "Plan comparisons, deductibles, HSA savings, and out-of-pocket cost tools.",
    href: "/tools/health",
    categorySlugs: ["health"],
    icon: Stethoscope,
    categories: [
      { name: "Health Insurance", categorySlug: "health", href: "/tools/health", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Business",
    description: "General liability, E&O, cyber, and workers' comp coverage calculators.",
    href: "/tools/business",
    categorySlugs: ["business"],
    icon: Briefcase,
    categories: [
      { name: "Business Insurance", categorySlug: "business", href: "/tools/business", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Renters",
    description: "Personal property coverage and liability tools for tenants.",
    href: "/tools/renters",
    categorySlugs: ["renters"],
    icon: Building2,
    categories: [
      { name: "Renters Insurance", categorySlug: "renters", href: "/tools/renters", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Travel",
    description: "Trip cancellation, medical evacuation, and travel policy value calculators.",
    href: "/tools/travel",
    categorySlugs: ["travel"],
    icon: Plane,
    categories: [
      { name: "Travel Insurance", categorySlug: "travel", href: "/tools/travel", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Pet",
    description: "Vet bill coverage, wellness plans, and pet insurance value calculators.",
    href: "/tools/pet",
    categorySlugs: ["pet"],
    icon: PawPrint,
    categories: [
      { name: "Pet Insurance", categorySlug: "pet", href: "/tools/pet", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Claims",
    description: "Payout estimators for total loss, depreciation, and settlement scenarios.",
    href: "/tools/claims",
    categorySlugs: ["claims"],
    icon: FileCheck2,
    categories: [
      { name: "Claims & Settlements", categorySlug: "claims", href: "/tools/claims", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Deductibles",
    description: "Compare deductible levels and find the break-even point for your budget.",
    href: "/tools/deductibles",
    categorySlugs: ["deductibles"],
    icon: Wallet,
    categories: [
      { name: "Deductible Comparisons", categorySlug: "deductibles", href: "/tools/deductibles", tools: [] },
    ],
    featured: [],
  },
  {
    label: "Coverage",
    description: "Figure out how much coverage you actually need before you buy.",
    href: "/tools/coverage",
    categorySlugs: ["coverage"],
    icon: ShieldCheck,
    categories: [
      { name: "Coverage Needs", categorySlug: "coverage", href: "/tools/coverage", tools: [] },
    ],
    featured: [],
  },
  {
    label: "State Requirements",
    description: "Minimum coverage rules and requirements by state.",
    href: "/tools/state-requirements",
    categorySlugs: ["state-requirements"],
    icon: MapPin,
    categories: [
      { name: "State Requirements", categorySlug: "state-requirements", href: "/tools/state-requirements", tools: [] },
    ],
    featured: [],
  },
];

/** Flat list of every tool linked from the mega menu, useful for quick lookups. */
export const ALL_NAV_TOOLS: NavTool[] = NAV_ITEMS.flatMap((item) =>
  item.categories.flatMap((cat) => cat.tools)
);

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Curated footer link backbone. Every category link below is generated from
// the real category registry (CATEGORY_ORDER in category-content.ts). This
// links to category hubs rather than individual tools since the calculator
// library launches empty; once tools ship, swap in their direct links.
export const FOOTER_TOOL_COLUMNS: FooterColumn[] = [
  {
    title: "Personal Insurance",
    links: [
      { name: "Auto Insurance Calculators", href: "/tools/auto" },
      { name: "Home Insurance Calculators", href: "/tools/home" },
      { name: "Life Insurance Calculators", href: "/tools/life" },
      { name: "Health Insurance Calculators", href: "/tools/health" },
      { name: "Renters Insurance Calculators", href: "/tools/renters" },
    ],
  },
  {
    title: "More Coverage",
    links: [
      { name: "Business Insurance Calculators", href: "/tools/business" },
      { name: "Travel Insurance Calculators", href: "/tools/travel" },
      { name: "Pet Insurance Calculators", href: "/tools/pet" },
    ],
  },
  {
    title: "Decisions & Claims",
    links: [
      { name: "Claims Calculators", href: "/tools/claims" },
      { name: "Deductible Calculators", href: "/tools/deductibles" },
      { name: "Coverage Calculators", href: "/tools/coverage" },
      { name: "State Requirement Calculators", href: "/tools/state-requirements" },
    ],
  },
];

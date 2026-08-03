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
      {
        name: "Auto Insurance",
        categorySlug: "auto",
        href: "/tools/auto",
        tools: [
          { name: "Car Insurance Coverage Calculator", href: "/tools/auto/car-insurance-coverage-calculator", slug: "car-insurance-coverage-calculator" },
          { name: "Liability-Only vs. Full Coverage Calculator", href: "/tools/auto/liability-only-vs-full-coverage-calculator", slug: "liability-only-vs-full-coverage-calculator" },
          { name: "$500 vs $1,000 Deductible Calculator", href: "/tools/auto/500-vs-1000-deductible-calculator", slug: "500-vs-1000-deductible-calculator" },
          { name: "Uninsured Motorist Coverage Calculator", href: "/tools/auto/uninsured-motorist-coverage-calculator", slug: "uninsured-motorist-coverage-calculator" },
          { name: "Gap Insurance Calculator", href: "/tools/auto/gap-insurance-calculator", slug: "gap-insurance-calculator" },
          { name: "Rental Reimbursement Coverage Calculator", href: "/tools/auto/rental-reimbursement-calculator", slug: "rental-reimbursement-calculator" },
          { name: "Roadside Assistance Value Calculator", href: "/tools/auto/roadside-assistance-value-calculator", slug: "roadside-assistance-value-calculator" },
          { name: "Total Loss Payout Calculator", href: "/tools/auto/total-loss-payout-calculator", slug: "total-loss-payout-calculator" },
          { name: "Diminished Value Calculator", href: "/tools/auto/diminished-value-calculator", slug: "diminished-value-calculator" },
          { name: "Teen Driver Insurance Cost Planner", href: "/tools/auto/teen-driver-cost-planner", slug: "teen-driver-cost-planner" },
          { name: "Multi-Car Discount Savings Calculator", href: "/tools/auto/multi-car-discount-savings-calculator", slug: "multi-car-discount-savings-calculator" },
          { name: "Low-Mileage Discount Estimator", href: "/tools/auto/low-mileage-discount-estimator", slug: "low-mileage-discount-estimator" },
          { name: "Pay-Per-Mile Insurance Savings Calculator", href: "/tools/auto/pay-per-mile-savings-calculator", slug: "pay-per-mile-savings-calculator" },
          { name: "Car Insurance Affordability Calculator", href: "/tools/auto/car-insurance-affordability-calculator", slug: "car-insurance-affordability-calculator" },
          { name: "New Car vs. Used Car Insurance Cost Calculator", href: "/tools/auto/new-car-vs-used-car-insurance-cost-calculator", slug: "new-car-vs-used-car-insurance-cost-calculator" },
          { name: "SR-22 Filing Cost Calculator", href: "/tools/auto/sr22-filing-cost-calculator", slug: "sr22-filing-cost-calculator" },
          { name: "Lease vs. Buy Insurance Cost Calculator", href: "/tools/auto/lease-vs-buy-insurance-requirement-calculator", slug: "lease-vs-buy-insurance-requirement-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Car Insurance Coverage Calculator", href: "/tools/auto/car-insurance-coverage-calculator", slug: "car-insurance-coverage-calculator" },
      { name: "$500 vs $1,000 Deductible Calculator", href: "/tools/auto/500-vs-1000-deductible-calculator", slug: "500-vs-1000-deductible-calculator" },
      { name: "Gap Insurance Calculator", href: "/tools/auto/gap-insurance-calculator", slug: "gap-insurance-calculator" },
      { name: "Total Loss Payout Calculator", href: "/tools/auto/total-loss-payout-calculator", slug: "total-loss-payout-calculator" },
      { name: "Liability-Only vs. Full Coverage Calculator", href: "/tools/auto/liability-only-vs-full-coverage-calculator", slug: "liability-only-vs-full-coverage-calculator" },
    ],
  },
  {
    label: "Home",
    description: "Dwelling coverage, replacement cost, and homeowners claim tools.",
    href: "/tools/home",
    categorySlugs: ["home"],
    icon: Home,
    categories: [
      {
        name: "Home Insurance",
        categorySlug: "home",
        href: "/tools/home",
        tools: [
          { name: "Home Replacement Cost Calculator", href: "/tools/home/home-replacement-cost-calculator", slug: "home-replacement-cost-calculator" },
          { name: "Dwelling Coverage Calculator", href: "/tools/home/dwelling-coverage-calculator", slug: "dwelling-coverage-calculator" },
          { name: "Personal Property Coverage Calculator", href: "/tools/home/personal-property-coverage-calculator", slug: "personal-property-coverage-calculator" },
          { name: "Home Insurance Deductible Calculator", href: "/tools/home/home-insurance-deductible-calculator", slug: "home-insurance-deductible-calculator" },
          { name: "Roof Replacement Claim Calculator", href: "/tools/home/roof-replacement-claim-calculator", slug: "roof-replacement-claim-calculator" },
          { name: "Water Damage Claim Calculator", href: "/tools/home/water-damage-claim-calculator", slug: "water-damage-claim-calculator" },
          { name: "Additional Living Expenses Calculator", href: "/tools/home/additional-living-expenses-calculator", slug: "additional-living-expenses-calculator" },
          { name: "Home Inventory Value Calculator", href: "/tools/home/home-inventory-value-calculator", slug: "home-inventory-value-calculator" },
          { name: "Flood Insurance Need Calculator", href: "/tools/home/flood-insurance-need-calculator", slug: "flood-insurance-need-calculator" },
          { name: "Ordinance and Law Coverage Calculator", href: "/tools/home/ordinance-and-law-coverage-calculator", slug: "ordinance-and-law-coverage-calculator" },
          { name: "Home Insurance Underinsurance Calculator", href: "/tools/home/home-insurance-underinsurance-calculator", slug: "home-insurance-underinsurance-calculator" },
          { name: "Scheduled Jewelry Coverage Calculator", href: "/tools/home/scheduled-jewelry-coverage-calculator", slug: "scheduled-jewelry-coverage-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Home Replacement Cost Calculator", href: "/tools/home/home-replacement-cost-calculator", slug: "home-replacement-cost-calculator" },
      { name: "Dwelling Coverage Calculator", href: "/tools/home/dwelling-coverage-calculator", slug: "dwelling-coverage-calculator" },
      { name: "Water Damage Claim Calculator", href: "/tools/home/water-damage-claim-calculator", slug: "water-damage-claim-calculator" },
      { name: "Home Insurance Underinsurance Calculator", href: "/tools/home/home-insurance-underinsurance-calculator", slug: "home-insurance-underinsurance-calculator" },
      { name: "Flood Insurance Need Calculator", href: "/tools/home/flood-insurance-need-calculator", slug: "flood-insurance-need-calculator" },
    ],
  },
  {
    label: "Life",
    description: "Income replacement, term length, and life insurance needs calculators.",
    href: "/tools/life",
    categorySlugs: ["life"],
    icon: HeartPulse,
    categories: [
      {
        name: "Life Insurance",
        categorySlug: "life",
        href: "/tools/life",
        tools: [
          { name: "Life Insurance Needs Calculator", href: "/tools/life/life-insurance-needs-calculator", slug: "life-insurance-needs-calculator" },
          { name: "DIME Method Life Insurance Calculator", href: "/tools/life/dime-method-calculator", slug: "dime-method-calculator" },
          { name: "Income Replacement Calculator", href: "/tools/life/income-replacement-calculator", slug: "income-replacement-calculator" },
          { name: "Term Life Insurance Length Calculator", href: "/tools/life/term-length-calculator", slug: "term-length-calculator" },
          { name: "Funeral & Final Expense Calculator", href: "/tools/life/funeral-final-expense-calculator", slug: "funeral-final-expense-calculator" },
          { name: "Mortgage Protection Insurance Calculator", href: "/tools/life/mortgage-protection-calculator", slug: "mortgage-protection-calculator" },
          { name: "Term vs. Whole Life Insurance Cost Calculator", href: "/tools/life/term-vs-whole-life-cost-calculator", slug: "term-vs-whole-life-cost-calculator" },
          { name: "Stay-at-Home Parent Life Insurance Calculator", href: "/tools/life/stay-at-home-parent-coverage-calculator", slug: "stay-at-home-parent-coverage-calculator" },
          { name: "Business Owner Life Insurance Calculator", href: "/tools/life/business-owner-life-insurance-calculator", slug: "business-owner-life-insurance-calculator" },
          { name: "Life Insurance Affordability Calculator", href: "/tools/life/life-insurance-affordability-calculator", slug: "life-insurance-affordability-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Life Insurance Needs Calculator", href: "/tools/life/life-insurance-needs-calculator", slug: "life-insurance-needs-calculator" },
      { name: "DIME Method Life Insurance Calculator", href: "/tools/life/dime-method-calculator", slug: "dime-method-calculator" },
      { name: "Income Replacement Calculator", href: "/tools/life/income-replacement-calculator", slug: "income-replacement-calculator" },
      { name: "Term Life Insurance Length Calculator", href: "/tools/life/term-length-calculator", slug: "term-length-calculator" },
      { name: "Term vs. Whole Life Insurance Cost Calculator", href: "/tools/life/term-vs-whole-life-cost-calculator", slug: "term-vs-whole-life-cost-calculator" },
    ],
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

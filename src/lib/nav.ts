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
      {
        name: "Health Insurance",
        categorySlug: "health",
        href: "/tools/health",
        tools: [
          { name: "Health Plan Comparison Calculator", href: "/tools/health/health-plan-comparison-calculator", slug: "health-plan-comparison-calculator" },
          { name: "Premium vs. Deductible Calculator", href: "/tools/health/premium-vs-deductible-calculator", slug: "premium-vs-deductible-calculator" },
          { name: "PPO vs. HDHP Calculator", href: "/tools/health/ppo-vs-hdhp-calculator", slug: "ppo-vs-hdhp-calculator" },
          { name: "HSA Savings Calculator", href: "/tools/health/hsa-savings-calculator", slug: "hsa-savings-calculator" },
          { name: "Out-of-Pocket Maximum Calculator", href: "/tools/health/out-of-pocket-maximum-calculator", slug: "out-of-pocket-maximum-calculator" },
          { name: "Coinsurance Calculator", href: "/tools/health/coinsurance-calculator", slug: "coinsurance-calculator" },
          { name: "Copay vs. Coinsurance Plan Calculator", href: "/tools/health/copay-vs-coinsurance-plan-calculator", slug: "copay-vs-coinsurance-plan-calculator" },
          { name: "Medical Bill Responsibility Calculator", href: "/tools/health/medical-bill-responsibility-calculator", slug: "medical-bill-responsibility-calculator" },
          { name: "Family Health Plan Cost Calculator", href: "/tools/health/family-plan-cost-calculator", slug: "family-plan-cost-calculator" },
          { name: "COBRA Cost Calculator", href: "/tools/health/cobra-cost-calculator", slug: "cobra-cost-calculator" },
          { name: "Break-Even Medical Spending Calculator", href: "/tools/health/break-even-medical-spending-calculator", slug: "break-even-medical-spending-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Break-Even Medical Spending Calculator", href: "/tools/health/break-even-medical-spending-calculator", slug: "break-even-medical-spending-calculator" },
      { name: "Health Plan Comparison Calculator", href: "/tools/health/health-plan-comparison-calculator", slug: "health-plan-comparison-calculator" },
      { name: "HSA Savings Calculator", href: "/tools/health/hsa-savings-calculator", slug: "hsa-savings-calculator" },
      { name: "PPO vs. HDHP Calculator", href: "/tools/health/ppo-vs-hdhp-calculator", slug: "ppo-vs-hdhp-calculator" },
      { name: "COBRA Cost Calculator", href: "/tools/health/cobra-cost-calculator", slug: "cobra-cost-calculator" },
    ],
  },
  {
    label: "Business",
    description: "General liability, E&O, cyber, and workers' comp coverage calculators.",
    href: "/tools/business",
    categorySlugs: ["business"],
    icon: Briefcase,
    categories: [
      {
        name: "Business Insurance",
        categorySlug: "business",
        href: "/tools/business",
        tools: [
          { name: "General Liability Insurance Calculator", href: "/tools/business/general-liability-coverage-calculator", slug: "general-liability-coverage-calculator" },
          { name: "Professional Liability (E&O) Calculator", href: "/tools/business/professional-liability-errors-omissions-calculator", slug: "professional-liability-errors-omissions-calculator" },
          { name: "Cyber Insurance Coverage Calculator", href: "/tools/business/cyber-insurance-coverage-calculator", slug: "cyber-insurance-coverage-calculator" },
          { name: "Business Interruption Insurance Calculator", href: "/tools/business/business-interruption-calculator", slug: "business-interruption-calculator" },
          { name: "Workers' Compensation Cost Estimator", href: "/tools/business/workers-compensation-cost-estimator", slug: "workers-compensation-cost-estimator" },
          { name: "Commercial Property Insurance Calculator", href: "/tools/business/commercial-property-coverage-calculator", slug: "commercial-property-coverage-calculator" },
          { name: "Product Liability Insurance Calculator", href: "/tools/business/product-liability-exposure-calculator", slug: "product-liability-exposure-calculator" },
          { name: "Contractor Insurance Calculator", href: "/tools/business/contractor-insurance-calculator", slug: "contractor-insurance-calculator" },
          { name: "Restaurant Insurance Calculator", href: "/tools/business/restaurant-insurance-calculator", slug: "restaurant-insurance-calculator" },
          { name: "Consultant Insurance Calculator", href: "/tools/business/consultant-insurance-calculator", slug: "consultant-insurance-calculator" },
          { name: "Freelancer Insurance Calculator", href: "/tools/business/freelancer-insurance-calculator", slug: "freelancer-insurance-calculator" },
          { name: "E-Commerce Business Insurance Calculator", href: "/tools/business/ecommerce-business-insurance-calculator", slug: "ecommerce-business-insurance-calculator" },
          { name: "Landlord Insurance Calculator", href: "/tools/business/landlord-insurance-calculator", slug: "landlord-insurance-calculator" },
          { name: "Commercial Auto Insurance Calculator", href: "/tools/business/commercial-auto-insurance-calculator", slug: "commercial-auto-insurance-calculator" },
        ],
      },
    ],
    featured: [
      { name: "General Liability Insurance Calculator", href: "/tools/business/general-liability-coverage-calculator", slug: "general-liability-coverage-calculator" },
      { name: "Professional Liability (E&O) Calculator", href: "/tools/business/professional-liability-errors-omissions-calculator", slug: "professional-liability-errors-omissions-calculator" },
      { name: "Cyber Insurance Coverage Calculator", href: "/tools/business/cyber-insurance-coverage-calculator", slug: "cyber-insurance-coverage-calculator" },
      { name: "Workers' Compensation Cost Estimator", href: "/tools/business/workers-compensation-cost-estimator", slug: "workers-compensation-cost-estimator" },
      { name: "Commercial Property Insurance Calculator", href: "/tools/business/commercial-property-coverage-calculator", slug: "commercial-property-coverage-calculator" },
    ],
  },
  {
    label: "Renters",
    description: "Personal property coverage and liability tools for tenants.",
    href: "/tools/renters",
    categorySlugs: ["renters"],
    icon: Building2,
    categories: [
      {
        name: "Renters Insurance",
        categorySlug: "renters",
        href: "/tools/renters",
        tools: [
          { name: "Renters Insurance Coverage Calculator", href: "/tools/renters/renters-insurance-coverage-calculator", slug: "renters-insurance-coverage-calculator" },
          { name: "Renters Personal Property Value Calculator", href: "/tools/renters/renters-personal-property-value-calculator", slug: "renters-personal-property-value-calculator" },
          { name: "Renters Liability Coverage Calculator", href: "/tools/renters/renters-liability-coverage-calculator", slug: "renters-liability-coverage-calculator" },
          { name: "Additional Living Expenses Calculator for Renters", href: "/tools/renters/additional-living-expenses-renters-calculator", slug: "additional-living-expenses-renters-calculator" },
          { name: "Roommate Renters Insurance Split Calculator", href: "/tools/renters/roommate-renters-insurance-split-calculator", slug: "roommate-renters-insurance-split-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Renters Insurance Coverage Calculator", href: "/tools/renters/renters-insurance-coverage-calculator", slug: "renters-insurance-coverage-calculator" },
      { name: "Renters Personal Property Value Calculator", href: "/tools/renters/renters-personal-property-value-calculator", slug: "renters-personal-property-value-calculator" },
      { name: "Renters Liability Coverage Calculator", href: "/tools/renters/renters-liability-coverage-calculator", slug: "renters-liability-coverage-calculator" },
      { name: "Roommate Renters Insurance Split Calculator", href: "/tools/renters/roommate-renters-insurance-split-calculator", slug: "roommate-renters-insurance-split-calculator" },
    ],
  },
  {
    label: "Travel",
    description: "Trip cancellation, medical evacuation, and travel policy value calculators.",
    href: "/tools/travel",
    categorySlugs: ["travel"],
    icon: Plane,
    categories: [
      {
        name: "Travel Insurance",
        categorySlug: "travel",
        href: "/tools/travel",
        tools: [
          { name: "Trip Cancellation Insurance Calculator", href: "/tools/travel/trip-cancellation-coverage-calculator", slug: "trip-cancellation-coverage-calculator" },
          { name: "Travel Medical Insurance Calculator", href: "/tools/travel/travel-medical-insurance-calculator", slug: "travel-medical-insurance-calculator" },
          { name: "Medical Evacuation Insurance Calculator", href: "/tools/travel/medical-evacuation-coverage-calculator", slug: "medical-evacuation-coverage-calculator" },
          { name: "Cruise Travel Insurance Calculator", href: "/tools/travel/cruise-travel-insurance-value-calculator", slug: "cruise-travel-insurance-value-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Trip Cancellation Insurance Calculator", href: "/tools/travel/trip-cancellation-coverage-calculator", slug: "trip-cancellation-coverage-calculator" },
      { name: "Travel Medical Insurance Calculator", href: "/tools/travel/travel-medical-insurance-calculator", slug: "travel-medical-insurance-calculator" },
      { name: "Medical Evacuation Insurance Calculator", href: "/tools/travel/medical-evacuation-coverage-calculator", slug: "medical-evacuation-coverage-calculator" },
      { name: "Cruise Travel Insurance Calculator", href: "/tools/travel/cruise-travel-insurance-value-calculator", slug: "cruise-travel-insurance-value-calculator" },
    ],
  },
  {
    label: "Pet",
    description: "Vet bill coverage, wellness plans, and pet insurance value calculators.",
    href: "/tools/pet",
    categorySlugs: ["pet"],
    icon: PawPrint,
    categories: [
      {
        name: "Pet Insurance",
        categorySlug: "pet",
        href: "/tools/pet",
        tools: [
          { name: "Pet Insurance Value Calculator", href: "/tools/pet/pet-insurance-value-calculator", slug: "pet-insurance-value-calculator" },
          { name: "Accident-Only vs. Comprehensive Pet Calculator", href: "/tools/pet/accident-only-vs-comprehensive-pet-calculator", slug: "accident-only-vs-comprehensive-pet-calculator" },
          { name: "Pet Wellness Plan Value Calculator", href: "/tools/pet/pet-wellness-plan-value-calculator", slug: "pet-wellness-plan-value-calculator" },
          { name: "Multi-Pet Insurance Discount Calculator", href: "/tools/pet/multi-pet-insurance-discount-calculator", slug: "multi-pet-insurance-discount-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Pet Insurance Value Calculator", href: "/tools/pet/pet-insurance-value-calculator", slug: "pet-insurance-value-calculator" },
      { name: "Accident-Only vs. Comprehensive Pet Calculator", href: "/tools/pet/accident-only-vs-comprehensive-pet-calculator", slug: "accident-only-vs-comprehensive-pet-calculator" },
      { name: "Pet Wellness Plan Value Calculator", href: "/tools/pet/pet-wellness-plan-value-calculator", slug: "pet-wellness-plan-value-calculator" },
      { name: "Multi-Pet Insurance Discount Calculator", href: "/tools/pet/multi-pet-insurance-discount-calculator", slug: "multi-pet-insurance-discount-calculator" },
    ],
  },
  {
    label: "Claims",
    description: "Payout estimators for total loss, depreciation, and settlement scenarios.",
    href: "/tools/claims",
    categorySlugs: ["claims"],
    icon: FileCheck2,
    categories: [
      {
        name: "Claims & Settlements",
        categorySlug: "claims",
        href: "/tools/claims",
        tools: [
          { name: "Insurance Claim Payout Calculator", href: "/tools/claims/insurance-claim-payout-calculator", slug: "insurance-claim-payout-calculator" },
          { name: "Deductible Claim Calculator", href: "/tools/claims/deductible-claim-calculator", slug: "deductible-claim-calculator" },
          { name: "Insurance Depreciation Calculator", href: "/tools/claims/depreciation-claim-calculator", slug: "depreciation-claim-calculator" },
          { name: "Recoverable Depreciation Calculator", href: "/tools/claims/recoverable-depreciation-calculator", slug: "recoverable-depreciation-calculator" },
          { name: "Property Total Loss Settlement Calculator", href: "/tools/claims/property-total-loss-settlement-calculator", slug: "property-total-loss-settlement-calculator" },
          { name: "Lost Wages Claim Calculator", href: "/tools/claims/lost-wages-claim-calculator", slug: "lost-wages-claim-calculator" },
          { name: "Rental Car Reimbursement Tracker", href: "/tools/claims/rental-car-reimbursement-tracker-calculator", slug: "rental-car-reimbursement-tracker-calculator" },
          { name: "Business Interruption Claim Calculator", href: "/tools/claims/business-interruption-claim-calculator", slug: "business-interruption-claim-calculator" },
          { name: "Contents Depreciation Calculator", href: "/tools/claims/contents-depreciation-calculator", slug: "contents-depreciation-calculator" },
          { name: "Insurance Claim Underpayment Calculator", href: "/tools/claims/claim-underpayment-calculator", slug: "claim-underpayment-calculator" },
          { name: "Settlement Negotiation Target Calculator", href: "/tools/claims/settlement-negotiation-target-calculator", slug: "settlement-negotiation-target-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Insurance Claim Payout Calculator", href: "/tools/claims/insurance-claim-payout-calculator", slug: "insurance-claim-payout-calculator" },
      { name: "Deductible Claim Calculator", href: "/tools/claims/deductible-claim-calculator", slug: "deductible-claim-calculator" },
      { name: "Insurance Claim Underpayment Calculator", href: "/tools/claims/claim-underpayment-calculator", slug: "claim-underpayment-calculator" },
      { name: "Settlement Negotiation Target Calculator", href: "/tools/claims/settlement-negotiation-target-calculator", slug: "settlement-negotiation-target-calculator" },
      { name: "Property Total Loss Settlement Calculator", href: "/tools/claims/property-total-loss-settlement-calculator", slug: "property-total-loss-settlement-calculator" },
    ],
  },
  {
    label: "Deductibles",
    description: "Compare deductible levels and find the break-even point for your budget.",
    href: "/tools/deductibles",
    categorySlugs: ["deductibles"],
    icon: Wallet,
    categories: [
      {
        name: "Deductible Comparisons",
        categorySlug: "deductibles",
        href: "/tools/deductibles",
        tools: [
          { name: "Deductible Comparison Calculator", href: "/tools/deductibles/deductible-comparison-calculator", slug: "deductible-comparison-calculator" },
          { name: "Per-Occurrence vs. Aggregate Deductible Calculator", href: "/tools/deductibles/per-occurrence-vs-annual-aggregate-deductible-calculator", slug: "per-occurrence-vs-annual-aggregate-deductible-calculator" },
          { name: "Percentage Deductible Calculator", href: "/tools/deductibles/percentage-deductible-calculator", slug: "percentage-deductible-calculator" },
          { name: "Deductible Savings Calculator", href: "/tools/deductibles/deductible-savings-calculator", slug: "deductible-savings-calculator" },
          { name: "Multi-Policy Deductible Stacking Calculator", href: "/tools/deductibles/multi-policy-deductible-stacking-calculator", slug: "multi-policy-deductible-stacking-calculator" },
          { name: "Deductible Affordability Calculator", href: "/tools/deductibles/deductible-affordability-calculator", slug: "deductible-affordability-calculator" },
        ],
      },
    ],
    featured: [
      { name: "Deductible Comparison Calculator", href: "/tools/deductibles/deductible-comparison-calculator", slug: "deductible-comparison-calculator" },
      { name: "Deductible Savings Calculator", href: "/tools/deductibles/deductible-savings-calculator", slug: "deductible-savings-calculator" },
      { name: "Percentage Deductible Calculator", href: "/tools/deductibles/percentage-deductible-calculator", slug: "percentage-deductible-calculator" },
      { name: "Deductible Affordability Calculator", href: "/tools/deductibles/deductible-affordability-calculator", slug: "deductible-affordability-calculator" },
    ],
  },
  {
    label: "Coverage",
    description: "Figure out how much coverage you actually need before you buy.",
    href: "/tools/coverage",
    categorySlugs: ["coverage"],
    icon: ShieldCheck,
    categories: [
      {
        name: "Coverage Needs",
        categorySlug: "coverage",
        href: "/tools/coverage",
        tools: [
          { name: "How Much Coverage Do I Need? Calculator", href: "/tools/coverage/how-much-insurance-coverage-do-i-need-calculator", slug: "how-much-insurance-coverage-do-i-need-calculator" },
          { name: "Coverage Gap Calculator", href: "/tools/coverage/coverage-gap-calculator", slug: "coverage-gap-calculator" },
          { name: "Policy Upgrade Value Calculator", href: "/tools/coverage/policy-upgrade-value-calculator", slug: "policy-upgrade-value-calculator" },
          { name: "Umbrella Policy Need Calculator", href: "/tools/coverage/umbrella-policy-need-calculator", slug: "umbrella-policy-need-calculator" },
          { name: "Net Worth Protection Calculator", href: "/tools/coverage/net-worth-protection-calculator", slug: "net-worth-protection-calculator" },
        ],
      },
    ],
    featured: [
      { name: "How Much Coverage Do I Need? Calculator", href: "/tools/coverage/how-much-insurance-coverage-do-i-need-calculator", slug: "how-much-insurance-coverage-do-i-need-calculator" },
      { name: "Coverage Gap Calculator", href: "/tools/coverage/coverage-gap-calculator", slug: "coverage-gap-calculator" },
      { name: "Umbrella Policy Need Calculator", href: "/tools/coverage/umbrella-policy-need-calculator", slug: "umbrella-policy-need-calculator" },
      { name: "Net Worth Protection Calculator", href: "/tools/coverage/net-worth-protection-calculator", slug: "net-worth-protection-calculator" },
    ],
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

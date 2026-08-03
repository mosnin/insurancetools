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
  {
    slug: "liability-only-vs-full-coverage-calculator",
    name: "Liability-Only vs. Full Coverage Calculator",
    description:
      "Compare your liability-only and full coverage premium quotes to see the exact annual savings, whether a loan requires full coverage, and how long it would take those savings to equal your car's value.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "liability only vs full coverage calculator",
      "is full coverage worth it",
      "liability only car insurance calculator",
      "full coverage insurance cost calculator",
      "when to drop full coverage",
      "liability only insurance savings",
      "how much does full coverage cost vs liability",
    ],
    relatedTools: ["car-insurance-coverage-calculator", "500-vs-1000-deductible-calculator"],
  },
  {
    slug: "500-vs-1000-deductible-calculator",
    name: "$500 vs $1,000 Deductible Calculator",
    description:
      "Compare your premium at a $500 and a $1,000 deductible, see the exact break-even point in years, and weigh it against how often you actually file claims.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "500 vs 1000 deductible calculator",
      "car insurance deductible comparison",
      "which deductible should i choose",
      "deductible break even calculator",
      "raise deductible savings",
      "500 dollar vs 1000 dollar deductible",
    ],
    relatedTools: ["liability-only-vs-full-coverage-calculator", "car-insurance-coverage-calculator"],
  },
  {
    slug: "uninsured-motorist-coverage-calculator",
    name: "Uninsured Motorist Coverage Calculator",
    description:
      "Find out how much UM/UIM coverage you need by matching it to your own liability limits, plus see any dollar gap versus what you currently carry.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "uninsured motorist coverage calculator",
      "UM UIM calculator",
      "how much uninsured motorist coverage do i need",
      "underinsured motorist calculator",
      "uninsured motorist limit calculator",
      "what does uninsured motorist coverage cover",
    ],
    relatedTools: ["car-insurance-coverage-calculator", "gap-insurance-calculator"],
  },
  {
    slug: "gap-insurance-calculator",
    name: "Gap Insurance Calculator",
    description:
      "Find out whether your loan or lease balance outpaces your car's depreciating value now and over time, with a clear gap-insurance worth-it verdict.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "gap insurance calculator",
      "do i need gap insurance",
      "loan balance vs car value calculator",
      "gap coverage cost calculator",
      "gap insurance worth it",
      "what does gap insurance cover",
    ],
    relatedTools: ["total-loss-payout-calculator", "lease-vs-buy-insurance-requirement-calculator"],
  },
  {
    slug: "rental-reimbursement-calculator",
    name: "Rental Reimbursement Coverage Calculator",
    description:
      "Use this rental reimbursement coverage calculator to size a daily and total rental car limit from your own local rate and repair timeline, then check an existing policy for gaps.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "rental reimbursement coverage calculator",
      "how much rental car coverage do i need",
      "rental reimbursement insurance calculator",
      "rental car coverage calculator",
      "daily rental limit calculator",
    ],
    relatedTools: ["roadside-assistance-value-calculator", "car-insurance-coverage-calculator"],
  },
  {
    slug: "roadside-assistance-value-calculator",
    name: "Roadside Assistance Value Calculator",
    description:
      "Compare the annual cost of a roadside assistance policy add-on, a standalone membership, and paying per incident to see which is cheapest based on your own numbers.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "roadside assistance value calculator",
      "is roadside assistance worth it",
      "AAA vs insurance roadside assistance",
      "roadside assistance cost calculator",
      "roadside assistance addon worth it",
      "how much does a tow cost",
    ],
    relatedTools: ["rental-reimbursement-calculator", "car-insurance-coverage-calculator"],
  },
  {
    slug: "total-loss-payout-calculator",
    name: "Total Loss Payout Calculator",
    description:
      "Estimate what a totaled car settlement may actually pay out, including the actual cash value, a common sales tax add-back, title fees, and your deductible.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "total loss payout calculator",
      "car total loss settlement calculator",
      "totaled car insurance payout",
      "what does insurance pay for a totaled car",
      "total loss calculator car insurance",
      "actual cash value calculator",
      "total loss settlement estimate",
    ],
    relatedTools: ["gap-insurance-calculator", "diminished-value-calculator"],
  },
  {
    slug: "diminished-value-calculator",
    name: "Diminished Value Calculator",
    description:
      "Estimate your car's diminished value after an accident using the 17c formula, with full step-by-step math for base loss, damage severity, and mileage.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "diminished value calculator",
      "17c diminished value formula",
      "diminished value claim calculator",
      "how to calculate diminished value",
      "car diminished value after accident",
      "inherent diminished value calculator",
      "17c formula car accident",
      "diminished value after repair",
    ],
    relatedTools: ["total-loss-payout-calculator", "car-insurance-coverage-calculator"],
  },
  {
    slug: "teen-driver-cost-planner",
    name: "Teen Driver Insurance Cost Planner",
    description:
      "Plug in your own quote to see exactly what adding a teen driver adds to your bill, in dollars, once your insurer's surcharge and discounts are factored in.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "teen driver insurance cost planner",
      "adding teen driver to insurance calculator",
      "teen driver insurance cost calculator",
      "teen driver discount checklist",
      "how much does adding a teen driver cost",
    ],
    relatedTools: ["multi-car-discount-savings-calculator", "car-insurance-affordability-calculator"],
  },
  {
    slug: "multi-car-discount-savings-calculator",
    name: "Multi-Car Discount Savings Calculator",
    description:
      "This multi-car discount calculator turns your insurer's quoted percentage into real dollars, comparing separate per-vehicle premiums against one bundled multi-car policy.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "multi car discount calculator",
      "bundle car insurance savings calculator",
      "multiple vehicle discount calculator",
      "multi car insurance discount",
      "how much do you save bundling cars",
    ],
    relatedTools: ["teen-driver-cost-planner", "low-mileage-discount-estimator"],
  },
  {
    slug: "low-mileage-discount-estimator",
    name: "Low-Mileage Discount Estimator",
    description:
      "Find out how much a low-mileage discount could save you by entering your premium, mileage, and insurer-quoted discount percentage, plus guidance on how insurers commonly define low mileage.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "low mileage discount calculator",
      "low mileage car insurance savings",
      "annual mileage insurance discount",
      "low mileage discount estimator",
      "does driving less save on insurance",
    ],
    relatedTools: ["pay-per-mile-savings-calculator", "multi-car-discount-savings-calculator"],
  },
  {
    slug: "pay-per-mile-savings-calculator",
    name: "Pay-Per-Mile Insurance Savings Calculator",
    description:
      "This pay per mile insurance calculator compares your traditional annual premium against a per-mile program's base fee and mileage rate, then finds the exact breakeven mileage.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "pay per mile insurance calculator",
      "pay per mile vs traditional insurance",
      "per mile car insurance savings",
      "is pay per mile insurance worth it",
      "usage based insurance calculator",
    ],
    relatedTools: ["low-mileage-discount-estimator", "car-insurance-affordability-calculator"],
  },
  {
    slug: "car-insurance-affordability-calculator",
    name: "Car Insurance Affordability Calculator",
    description:
      "See a suggested monthly car insurance budget based on your take-home income and car payment, then compare it against your actual premium and a simple debt-to-income check.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "car insurance affordability calculator",
      "how much should i spend on car insurance",
      "insurance budget calculator",
      "car insurance percentage of income",
      "can i afford this car insurance",
      "car payment and insurance budget",
      "affordable car insurance based on income",
    ],
    relatedTools: ["car-insurance-coverage-calculator", "500-vs-1000-deductible-calculator"],
  },
  {
    slug: "new-car-vs-used-car-insurance-cost-calculator",
    name: "New Car vs. Used Car Insurance Cost Calculator",
    description:
      "Compare two real insurance quotes side by side and see which one is actually high relative to what each vehicle is worth, using the same 10% rule check used across the site.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "new car vs used car insurance cost calculator",
      "does a new car cost more to insure",
      "insurance cost by vehicle value",
      "new vs used car insurance comparison",
      "car value and insurance premium",
    ],
    relatedTools: ["diminished-value-calculator", "car-insurance-affordability-calculator"],
  },
  {
    slug: "sr22-filing-cost-calculator",
    name: "SR-22 Filing Cost Calculator",
    description:
      "Use this SR-22 filing cost calculator to total your filing fee and monthly surcharge over your required filing period, then confirm the exact figures with your state.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "sr22 cost calculator",
      "how much does sr22 cost",
      "sr22 insurance cost",
      "sr22 filing fee calculator",
    ],
    relatedTools: ["car-insurance-affordability-calculator", "car-insurance-coverage-calculator"],
  },
  {
    slug: "lease-vs-buy-insurance-requirement-calculator",
    name: "Lease vs. Buy Insurance Cost Calculator",
    description:
      "Run the lease vs buy car insurance cost calculator to see what full coverage and gap insurance add over liability-only, based on your own premiums and loan or lease term.",
    category: "Auto",
    categorySlug: "auto",
    keywords: [
      "lease vs buy car insurance cost calculator",
      "does leasing a car require full coverage",
      "lease car insurance requirements",
      "lease vs buy insurance cost",
      "gap insurance for leased car",
    ],
    relatedTools: ["gap-insurance-calculator", "liability-only-vs-full-coverage-calculator"],
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

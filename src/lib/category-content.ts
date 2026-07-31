import type { Metadata } from "next";
import type { Tool } from "@/types";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ArticleSubsection {
  heading: string;
  paragraphs: string[];
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  subsections?: ArticleSubsection[];
}

export interface CategoryFAQItem {
  question: string;
  answer: string;
}

export interface CategoryExternalLink {
  label: string;
  url: string;
  note: string;
}

export interface CategoryRelatedCategory {
  slug: string;
  label: string;
}

export interface CategoryRelatedTool {
  slug: string;
  categorySlug: string;
  label: string;
}

export interface ToolGroupRule {
  heading: string;
  keywords: string[];
}

export interface CategoryContent {
  slug: string;
  displayName: string;
  icon: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  article: ArticleSection[];
  faqs: CategoryFAQItem[];
  externalLinks: CategoryExternalLink[];
  relatedCategories: CategoryRelatedCategory[];
  relatedTools: CategoryRelatedTool[];
  groupRules: ToolGroupRule[];
}

// ─── Category metadata (authoritative list of the 12 category slugs) ──────
// Mirrors the CATEGORIES export in src/lib/tools.ts. Insurance Tools
// launched with this taxonomy in place and the calculator library empty;
// every category below is ready to receive tools without further wiring.

export const CATEGORY_ORDER = [
  "auto",
  "home",
  "life",
  "health",
  "business",
  "renters",
  "travel",
  "pet",
  "claims",
  "deductibles",
  "coverage",
  "state-requirements",
] as const;

export type CategorySlug = (typeof CATEGORY_ORDER)[number];

// ─── Content ────────────────────────────────────────────────────────────────

export const CATEGORY_CONTENT: Record<CategorySlug, CategoryContent> = {
  auto: {
    slug: "auto",
    displayName: "Auto",
    icon: "Car",
    focusKeyword: "auto insurance calculators",
    secondaryKeywords: [
      "car insurance coverage calculator",
      "liability coverage calculator",
      "deductible calculator",
      "gap insurance calculator",
      "uninsured motorist coverage",
    ],
    title: "Auto Insurance Calculators: Coverage, Deductibles & Claims",
    metaDescription:
      "Auto insurance calculators for liability limits, deductibles, gap coverage, and claim payouts. Figure out what you actually need before you buy or renew.",
    h1: "Auto Insurance Calculators",
    intro:
      "Auto policies bundle together liability, collision, comprehensive, and half a dozen optional coverages, each priced and structured differently. These calculators break that bundle apart so you can size each piece to your actual risk instead of accepting a default that may leave you underinsured or paying for coverage you don't need.",
    article: [
      {
        heading: "Why Auto Coverage Limits Deserve More Than the State Minimum",
        paragraphs: [
          "Every state sets a minimum liability requirement, but that number reflects a legal floor, not a realistic estimate of what an at-fault accident actually costs. Medical bills and vehicle repair costs from a serious collision routinely exceed minimum limits, leaving the at-fault driver personally exposed for the difference. Sizing liability coverage against your actual assets, not the state minimum, is the single highest-leverage decision in an auto policy.",
          "Collision and comprehensive coverage raise a different question: is the vehicle worth enough that a claim payout would meaningfully offset the cost of keeping that coverage? Once a car's actual cash value drops far enough, the math can flip in favor of dropping optional coverage entirely, which only a direct comparison of premium against payout will reveal.",
        ],
      },
      {
        heading: "Deductibles, Gap Coverage, and the Extras That Change the Math",
        paragraphs: [
          "A higher deductible lowers your premium but raises what you pay out of pocket after a claim, and the right trade-off depends on how much cash you'd have on hand after an accident, not just which option is cheaper on paper. Gap insurance matters specifically for financed or leased vehicles, since a total loss payout is based on actual cash value, which can fall below the remaining loan balance in the first few years of ownership.",
          "Rental reimbursement, roadside assistance, and uninsured or underinsured motorist coverage are easy to skip when building a quote, but each protects against a specific and common scenario. Running the numbers on what each would actually pay out relative to its cost turns that decision from a guess into an informed trade-off.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much auto liability coverage do I actually need?",
        answer:
          "Enough to cover a realistic worst-case accident without exposing your savings or future wages to a lawsuit. State minimums are a legal floor, not a safety target; most financial guidance points toward limits well above minimum once you own a home, have savings, or have significant income to protect.",
      },
      {
        question: "Is a $500 or $1,000 deductible better?",
        answer:
          "It depends on how much emergency cash you'd have available after a claim and how the premium difference compares to that gap over several years without a claim. A higher deductible only pays off if the accumulated premium savings exceed the extra out-of-pocket cost in a typical claim year.",
      },
      {
        question: "When does gap insurance make sense?",
        answer:
          "Gap insurance is most valuable in the first two to three years of a new car loan or lease, when the loan balance is likely to exceed the vehicle's actual cash value. Once the loan balance drops below the car's market value, gap coverage stops paying out anything a standard policy wouldn't already cover.",
      },
      {
        question: "Do these calculators use my specific insurer's rates?",
        answer:
          "No. These are decision tools that work from the coverage math and figures you enter, not a quote engine tied to a specific carrier. They help you decide what to shop for; you still compare actual quotes from insurers for final pricing.",
      },
    ],
    externalLinks: [
      {
        label: "NAIC: Auto Insurance Basics",
        url: "https://content.naic.org/consumer/auto-insurance",
        note: "Consumer guidance on coverage types, liability limits, and shopping for a policy.",
      },
      {
        label: "III: Understanding Your Auto Policy",
        url: "https://www.iii.org/article/what-does-my-personal-auto-policy-cover",
        note: "Plain-language breakdown of what each part of a standard auto policy actually covers.",
      },
    ],
    relatedCategories: [
      { slug: "deductibles", label: "Deductible Calculators" },
      { slug: "claims", label: "Claims Calculators" },
      { slug: "coverage", label: "Coverage Calculators" },
      { slug: "state-requirements", label: "State Requirement Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  home: {
    slug: "home",
    displayName: "Home",
    icon: "Home",
    focusKeyword: "home insurance calculators",
    secondaryKeywords: [
      "home replacement cost calculator",
      "dwelling coverage calculator",
      "personal property coverage",
      "home insurance deductible calculator",
      "flood insurance need calculator",
    ],
    title: "Homeowners Insurance Calculators: Coverage & Replacement Cost",
    metaDescription:
      "Homeowners insurance calculators for dwelling coverage, replacement cost, personal property, and deductibles. Size your policy to your actual home.",
    h1: "Homeowners Insurance Calculators",
    intro:
      "The most common homeowners insurance mistake is confusing market value with rebuilding cost, and the second most common is underestimating personal property. These calculators work from construction and inventory math instead of the number on a real estate listing.",
    article: [
      {
        heading: "Replacement Cost Is Not Market Value",
        paragraphs: [
          "A home's market value includes land, location, and neighborhood demand, none of which a policy needs to rebuild the structure after a covered loss. Replacement cost is driven by local construction pricing per square foot, which routinely diverges sharply from what the home would sell for. Underinsuring against market value instead of rebuild cost is the single most common way homeowners discover a coverage gap only after a claim.",
          "Ordinance and law coverage extends this further: if a rebuild has to meet current building codes that didn't exist when the home was originally built, standard replacement cost coverage may not fund the difference. That gap is worth pricing out before a loss, not after.",
        ],
      },
      {
        heading: "Personal Property, Scheduled Items, and Additional Living Expenses",
        paragraphs: [
          "Personal property coverage is usually set as a percentage of dwelling coverage by default, which has no relationship to what you actually own. A home inventory, even a rough one, is the only reliable way to check whether that default is enough, and high-value items like jewelry or collectibles typically need a separate scheduled endorsement to be fully covered.",
          "Additional living expenses coverage pays for temporary housing while a home is being rebuilt after a covered loss, and it's easy to underestimate how long that process takes and what it costs in a given market. Sizing that coverage against realistic local rental costs, not a rough guess, avoids a second financial shock stacked on top of the original loss.",
        ],
      },
    ],
    faqs: [
      {
        question: "What's the difference between replacement cost and actual cash value?",
        answer:
          "Replacement cost pays what it takes to rebuild or repair with materials of similar kind and quality, with no deduction for depreciation. Actual cash value pays replacement cost minus depreciation, which can be significantly less for an older roof, appliances, or fixtures.",
      },
      {
        question: "Do I need separate flood insurance?",
        answer:
          "Yes. Standard homeowners policies exclude flood damage almost universally. Flood coverage is a separate policy, most commonly through the National Flood Insurance Program or a private flood carrier, and is worth pricing even outside a designated flood zone since a meaningful share of flood claims come from outside mapped high-risk areas.",
      },
      {
        question: "How much personal property coverage do I need?",
        answer:
          "Enough to replace everything you own, which for most households is higher than the default percentage a policy assigns automatically. A home inventory that totals the replacement cost of your belongings room by room is the most reliable way to check the default against reality.",
      },
      {
        question: "What is ordinance and law coverage and do I need it?",
        answer:
          "It pays the added cost of rebuilding to current building code when your home's original construction predates that code. Older homes in areas with frequently updated codes are the most likely to have a meaningful gap without this coverage.",
      },
    ],
    externalLinks: [
      {
        label: "III: Homeowners Insurance Basics",
        url: "https://www.iii.org/article/homeowners-insurance-basics",
        note: "Overview of what a standard homeowners policy covers and how replacement cost works.",
      },
      {
        label: "FEMA: National Flood Insurance Program",
        url: "https://www.floodsmart.gov/",
        note: "Official source for flood risk and flood insurance, which homeowners policies exclude.",
      },
    ],
    relatedCategories: [
      { slug: "deductibles", label: "Deductible Calculators" },
      { slug: "claims", label: "Claims Calculators" },
      { slug: "coverage", label: "Coverage Calculators" },
      { slug: "renters", label: "Renters Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  life: {
    slug: "life",
    displayName: "Life",
    icon: "HeartPulse",
    focusKeyword: "life insurance calculators",
    secondaryKeywords: [
      "life insurance needs calculator",
      "income replacement calculator",
      "DIME method calculator",
      "term length calculator",
      "term vs whole life calculator",
    ],
    title: "Life Insurance Calculators: Coverage Needs & Term Length",
    metaDescription:
      "Life insurance calculators for income replacement, the DIME method, term length, and coverage needs. Find the amount that actually protects your family.",
    h1: "Life Insurance Calculators",
    intro:
      "Life insurance need is a math problem before it's a shopping decision: debts, income replacement years, and future obligations like education all combine into a single target coverage amount. These calculators work through that math using the same methods financial professionals use, so the number you land on is defensible, not guessed.",
    article: [
      {
        heading: "Income Replacement and the DIME Method",
        paragraphs: [
          "The most common approach to sizing life insurance multiplies remaining income-earning years by annual income needed for dependents, adjusted for existing savings and assets. The DIME method (Debt, Income, Mortgage, Education) breaks the target into four specific buckets, which makes it easier to see exactly which obligation is driving the total and to adjust any single piece as circumstances change.",
          "Neither method is exact, and both are far better starting points than a round number picked because it sounded reasonable. Running the actual figures, even roughly, routinely reveals that a common flat coverage amount is significantly higher or lower than what a household actually needs.",
        ],
      },
      {
        heading: "Term Length and Term vs. Whole Life",
        paragraphs: [
          "Term length should match the years remaining until the obligation it's protecting against goes away: a mortgage payoff date, the age a child finishes college, or the number of years until retirement income sources replace earned income. A term that's too short leaves a household exposed right as coverage lapses; a term that's needlessly long pays for years of coverage no longer needed.",
          "Term and whole life solve different problems. Term is priced to protect against a temporary, quantifiable need at the lowest cost per dollar of coverage; whole life combines a smaller death benefit with a savings component and permanent coverage, at meaningfully higher cost. Comparing the two side by side against your specific goal, rather than a generic rule of thumb, is the only way to know which one actually fits.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much life insurance do I actually need?",
        answer:
          "Enough to replace lost income for as many years as your dependents would need it, plus cover outstanding debts and future obligations like a mortgage or education costs, minus assets already available to cover those costs. Income-replacement and DIME calculators both work through this math directly rather than relying on a flat multiple of salary.",
      },
      {
        question: "What term length should I choose?",
        answer:
          "Match it to the years remaining on the obligation it protects: a 20-year mortgage often pairs with a 20-year term, while replacing income until retirement might call for a term running until your expected retirement age.",
      },
      {
        question: "Is term or whole life insurance better?",
        answer:
          "For most people, term life provides more coverage per dollar for a defined period, which fits a temporary need like income replacement while raising children. Whole life adds a savings component and permanent coverage at significantly higher cost, and tends to make more sense for a permanent need such as estate planning or a special-needs dependent.",
      },
      {
        question: "Do stay-at-home parents need life insurance?",
        answer:
          "Often yes. A stay-at-home parent's unpaid labor, including childcare, has a real replacement cost, and losing that labor without insurance can force the surviving parent into expensive paid alternatives on top of grief and lost income from reduced work capacity.",
      },
    ],
    externalLinks: [
      {
        label: "III: How Much Life Insurance Do I Need?",
        url: "https://www.iii.org/article/how-much-life-insurance-do-i-need",
        note: "Overview of income-replacement and needs-based approaches to sizing coverage.",
      },
      {
        label: "NAIC: Life Insurance Buyer's Guide",
        url: "https://content.naic.org/consumer/life-insurance",
        note: "Regulator guidance on term vs. permanent life insurance and how policies work.",
      },
    ],
    relatedCategories: [
      { slug: "coverage", label: "Coverage Calculators" },
      { slug: "health", label: "Health Calculators" },
      { slug: "business", label: "Business Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  health: {
    slug: "health",
    displayName: "Health",
    icon: "Stethoscope",
    focusKeyword: "health insurance calculators",
    secondaryKeywords: [
      "health plan comparison calculator",
      "PPO vs HDHP calculator",
      "HSA savings calculator",
      "out of pocket maximum calculator",
      "plan break-even calculator",
    ],
    title: "Health Insurance Calculators: Plans, Deductibles & HSA",
    metaDescription:
      "Health insurance calculators for comparing plans, deductibles, coinsurance, and HSA savings. Find the plan that actually costs less for your situation.",
    h1: "Health Insurance Calculators",
    intro:
      "Comparing two health plans by premium alone misses most of the actual cost difference, which lives in the deductible, coinsurance, and out-of-pocket maximum. These calculators model total annual cost across a range of medical spending scenarios so you can see exactly where one plan overtakes the other.",
    article: [
      {
        heading: "The Plan Break-Even Question",
        paragraphs: [
          "Every pair of health plans has a break-even point: an annual medical spending level below which the lower-premium plan wins, and above which the lower-deductible plan wins. That crossover point is the single most useful number in a plan comparison, because it turns 'which plan is better' into 'how much medical care do I expect to use this year,' a question you can actually estimate.",
          "A high-deductible health plan paired with an HSA can be the cheaper option even for moderate medical spenders once the HSA's tax advantages and employer contributions are factored in, which a premium-only comparison would never surface.",
        ],
      },
      {
        heading: "Deductibles, Coinsurance, and the Out-of-Pocket Maximum",
        paragraphs: [
          "The out-of-pocket maximum is the real worst-case number in a health plan, since it caps total spending regardless of how expensive a medical event becomes. Comparing out-of-pocket maximums across plan options tells you your maximum exposure in a bad year, which matters more than the deductible alone for anyone weighing financial risk.",
          "Coinsurance, the percentage you pay after meeting the deductible, is easy to overlook when a plan's marketing leads with a low deductible. A plan with a lower deductible but higher coinsurance can cost more in a moderately expensive year than a plan with the reverse trade-off, which only shows up when you model a realistic claim scenario.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I know if an HDHP is cheaper than a PPO for me?",
        answer:
          "Run your expected annual medical spending through both plans' full cost structure: premium, deductible, coinsurance, and out-of-pocket maximum. The HDHP usually wins at low to moderate spending, especially with HSA contributions factored in, while a PPO with a lower deductible can win in a year with major medical expenses.",
      },
      {
        question: "What's the difference between a deductible and an out-of-pocket maximum?",
        answer:
          "The deductible is what you pay before coinsurance kicks in; the out-of-pocket maximum is the total you'll pay in a year, including deductible and coinsurance, before the plan covers 100% of costs. The out-of-pocket maximum is your real worst-case exposure.",
      },
      {
        question: "Is an HSA worth it if I'm generally healthy?",
        answer:
          "Often yes, since HSA contributions are tax-advantaged going in, growing, and coming out for qualified medical expenses, and unused funds roll over indefinitely rather than expiring like an FSA. Even low medical spenders benefit from the triple tax advantage over time.",
      },
      {
        question: "How is coinsurance different from a copay?",
        answer:
          "A copay is a fixed dollar amount per visit or prescription; coinsurance is a percentage of the total cost you pay after meeting your deductible. Coinsurance exposure scales with how expensive the underlying care is, while a copay does not.",
      },
    ],
    externalLinks: [
      {
        label: "HealthCare.gov: Glossary of Health Coverage Terms",
        url: "https://www.healthcare.gov/glossary/",
        note: "Official definitions for deductible, coinsurance, out-of-pocket maximum, and related terms.",
      },
      {
        label: "IRS: Health Savings Accounts",
        url: "https://www.irs.gov/publications/p969",
        note: "Rules and contribution limits governing HSA eligibility and tax treatment.",
      },
    ],
    relatedCategories: [
      { slug: "deductibles", label: "Deductible Calculators" },
      { slug: "coverage", label: "Coverage Calculators" },
      { slug: "life", label: "Life Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  business: {
    slug: "business",
    displayName: "Business",
    icon: "Briefcase",
    focusKeyword: "business insurance calculators",
    secondaryKeywords: [
      "general liability coverage calculator",
      "professional liability calculator",
      "cyber insurance coverage calculator",
      "workers compensation cost estimator",
      "business interruption calculator",
    ],
    title: "Business Insurance Calculators: Liability, Cyber & Workers' Comp",
    metaDescription:
      "Business insurance calculators for general liability, professional liability, cyber coverage, and workers' compensation. Size coverage to your actual exposure.",
    h1: "Business Insurance Calculators",
    intro:
      "Business insurance needs vary enormously by industry, revenue, payroll, and how the business is structured, which is why a generic coverage amount rarely fits. These calculators start from the exposure your specific business actually carries, whether that's a client lawsuit, a data breach, or an employee injury.",
    article: [
      {
        heading: "Liability Coverage Sized to Real Exposure",
        paragraphs: [
          "General liability protects against third-party bodily injury and property damage claims, while professional liability (errors and omissions) covers claims arising from advice or services you provide. The right limit for each depends on client contract requirements, industry norms, and the realistic size of a claim your business could face, not a single default figure applied across every business type.",
          "Cyber insurance has become relevant to businesses that store almost any customer data, not just tech companies, since breach notification costs, credit monitoring obligations, and regulatory fines can accumulate quickly even from a small-scale incident.",
        ],
      },
      {
        heading: "Workers' Compensation and Business Interruption",
        paragraphs: [
          "Workers' compensation costs scale with payroll and job classification risk, and estimating it accurately before hiring or expanding helps a growing business budget correctly rather than being surprised by a premium jump. Rules and requirements also vary meaningfully by state, so a national estimate is only a starting point.",
          "Business interruption coverage replaces lost income and covers ongoing expenses when a covered event forces a temporary shutdown. Sizing it requires estimating both how long a realistic disruption would last and what fixed costs would keep accruing during that period, numbers that are worth calculating before a disruption forces the question.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do freelancers and consultants need business insurance?",
        answer:
          "Often yes, particularly professional liability coverage, since a single client dispute over advice or deliverables can trigger legal costs far exceeding the price of a policy. Many client contracts require proof of coverage before work can begin.",
      },
      {
        question: "How much general liability coverage is standard?",
        answer:
          "Common limits range widely by industry and client requirements; the right figure depends on your specific contract obligations and worst-case claim exposure, not a single industry-wide default. Many commercial leases and client contracts specify a minimum limit directly.",
      },
      {
        question: "What does cyber insurance actually cover?",
        answer:
          "Typically breach notification costs, credit monitoring for affected customers, legal and regulatory response costs, and sometimes business interruption from a cyber event. Coverage scope varies significantly between insurers, so comparing what's actually included matters as much as the limit.",
      },
      {
        question: "Is workers' compensation required for a small business?",
        answer:
          "Requirements vary by state and by employee count, and most states require coverage once a business has even one employee. Check your specific state's requirement, since penalties for operating without required coverage can be significant.",
      },
    ],
    externalLinks: [
      {
        label: "SBA: Get Business Insurance",
        url: "https://www.sba.gov/business-guide/manage-your-business/get-business-insurance",
        note: "Federal guidance on common business insurance types and how to evaluate coverage needs.",
      },
      {
        label: "III: Business Insurance Basics",
        url: "https://www.iii.org/article/business-insurance-basics",
        note: "Overview of general liability, property, and other core commercial coverage types.",
      },
    ],
    relatedCategories: [
      { slug: "claims", label: "Claims Calculators" },
      { slug: "coverage", label: "Coverage Calculators" },
      { slug: "life", label: "Life Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  renters: {
    slug: "renters",
    displayName: "Renters",
    icon: "Building2",
    focusKeyword: "renters insurance calculators",
    secondaryKeywords: [
      "renters insurance coverage calculator",
      "personal property coverage calculator",
      "renters liability calculator",
      "additional living expenses calculator",
    ],
    title: "Renters Insurance Calculators: Coverage for Tenants",
    metaDescription:
      "Renters insurance calculators for personal property coverage and liability limits. Find out how much coverage you need without over- or under-insuring.",
    h1: "Renters Insurance Calculators",
    intro:
      "A landlord's policy covers the building, not your belongings or your liability, which is exactly what renters insurance fills in. These calculators help size personal property and liability coverage to what you actually own and the risk you actually carry.",
    article: [
      {
        heading: "Personal Property Coverage Starts With an Inventory",
        paragraphs: [
          "Renters consistently underestimate the replacement cost of everything they own, from furniture and electronics to clothing and kitchenware, because no single purchase felt significant on its own. A rough room-by-room inventory almost always produces a higher total than a guessed coverage amount, which is the gap these calculators are built to close.",
          "Replacement cost coverage, which pays to buy new items rather than depreciated value, costs modestly more than actual cash value coverage but closes a real gap: actual cash value on a five-year-old couch or laptop pays a fraction of what a replacement actually costs.",
        ],
      },
      {
        heading: "Liability and Additional Living Expenses",
        paragraphs: [
          "Liability coverage protects against a guest's injury in your rental or damage you accidentally cause to someone else's property, and it's frequently the most underpriced part of a renters policy relative to the protection it provides. Additional living expenses coverage pays for temporary housing if your rental becomes uninhabitable, a scenario worth pricing out against realistic local short-term rental costs.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I really need renters insurance if I don't own much?",
        answer:
          "Most renters own more, in total replacement value, than they estimate, and liability coverage protects against risks unrelated to how much you own, such as a guest injury or accidental damage to the unit. Many leases also require proof of renters insurance regardless of belongings.",
      },
      {
        question: "Does renters insurance cover my roommate's belongings?",
        answer:
          "Generally no, unless a roommate is specifically named on the policy. Roommates typically need their own separate policy or need to be added as a named insured for their property to be covered.",
      },
      {
        question: "What's the difference between replacement cost and actual cash value for renters insurance?",
        answer:
          "Replacement cost pays to buy new items at today's prices; actual cash value pays the depreciated value of what was lost. The difference is largest for older electronics, furniture, and appliances.",
      },
    ],
    externalLinks: [
      {
        label: "III: Renters Insurance Basics",
        url: "https://www.iii.org/article/renters-insurance-basics",
        note: "Overview of personal property, liability, and additional living expenses coverage for tenants.",
      },
      {
        label: "HUD: Renters' Rights and Resources",
        url: "https://www.hud.gov/topics/rental_assistance",
        note: "Federal housing resources relevant to tenants evaluating coverage needs.",
      },
    ],
    relatedCategories: [
      { slug: "home", label: "Home Calculators" },
      { slug: "coverage", label: "Coverage Calculators" },
      { slug: "claims", label: "Claims Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  travel: {
    slug: "travel",
    displayName: "Travel",
    icon: "Plane",
    focusKeyword: "travel insurance calculators",
    secondaryKeywords: [
      "trip cancellation coverage calculator",
      "travel medical insurance calculator",
      "travel insurance value calculator",
    ],
    title: "Travel Insurance Calculators: Trip Value & Coverage",
    metaDescription:
      "Travel insurance calculators for trip cancellation coverage and travel medical protection. Find out whether a policy is worth it for your specific trip.",
    h1: "Travel Insurance Calculators",
    intro:
      "Whether travel insurance is worth buying depends almost entirely on trip cost, refundability, and destination, three variables these calculators weigh directly instead of relying on a blanket recommendation.",
    article: [
      {
        heading: "When Trip Cancellation Coverage Pays for Itself",
        paragraphs: [
          "Trip cancellation coverage is most valuable when a large share of trip cost is non-refundable and the traveler has a realistic chance of needing to cancel, whether from illness, work conflict, or family emergency. Comparing the policy cost against the non-refundable portion of the trip is the direct way to see whether the coverage is likely to pay for itself.",
          "For fully refundable bookings, cancellation coverage adds little value; the calculation changes sharply once flights, tours, or lodging become non-refundable deposits.",
        ],
      },
      {
        heading: "Travel Medical and Evacuation Coverage",
        paragraphs: [
          "Domestic health insurance frequently provides limited or no coverage outside the country, which makes travel medical coverage relevant even for travelers who are well covered at home. Medical evacuation coverage specifically addresses a scenario domestic plans essentially never cover: transport to adequate care from a remote or under-resourced location, which can cost tens of thousands of dollars without insurance.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is travel insurance worth it for a domestic trip?",
        answer:
          "It depends mainly on how much of the trip cost is non-refundable and how comprehensive your existing health coverage is while traveling domestically. For a fully refundable trip with strong existing health coverage, the case is weaker than for a non-refundable international trip.",
      },
      {
        question: "Does my regular health insurance cover me abroad?",
        answer:
          "Often not, or only partially. Many domestic health plans, including Medicare, provide little to no coverage outside the country, which is the main reason travel medical coverage is worth pricing even for well-insured travelers.",
      },
      {
        question: "What does medical evacuation coverage actually pay for?",
        answer:
          "Transport from the location of a medical emergency to the nearest facility capable of providing adequate care, which can be extremely costly from remote destinations and is rarely included in standard health insurance.",
      },
    ],
    externalLinks: [
      {
        label: "U.S. Department of State: Travel Insurance Guidance",
        url: "https://travel.state.gov/content/travel/en/international-travel/before-you-go/your-health-abroad/insurance-providers-overseas.html",
        note: "Federal guidance on travel medical insurance for U.S. citizens traveling abroad.",
      },
    ],
    relatedCategories: [
      { slug: "health", label: "Health Calculators" },
      { slug: "coverage", label: "Coverage Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  pet: {
    slug: "pet",
    displayName: "Pet",
    icon: "PawPrint",
    focusKeyword: "pet insurance calculators",
    secondaryKeywords: [
      "pet insurance value calculator",
      "vet bill coverage calculator",
      "pet wellness plan calculator",
    ],
    title: "Pet Insurance Calculators: Vet Bills & Policy Value",
    metaDescription:
      "Pet insurance calculators comparing premium cost against expected vet bills and coverage limits. Find out whether a policy is worth it for your pet.",
    h1: "Pet Insurance Calculators",
    intro:
      "Pet insurance value depends on your pet's age, breed-specific health risk, and how much emergency vet care would actually cost in your area, all of which these calculators weigh directly against the policy's premium and reimbursement structure.",
    article: [
      {
        heading: "Premium vs. Expected Vet Costs",
        paragraphs: [
          "Pet insurance functions like any insurance product: you're paying a predictable premium to avoid an unpredictable, potentially large cost. Younger pets generally cost less to insure and are less likely to have pre-existing conditions that get excluded from coverage, which is why starting a policy early tends to produce better long-run value than waiting until a health issue appears.",
          "Breed matters more in pet insurance than in most other insurance categories, since certain breeds carry well-documented elevated risk for specific conditions, and that risk should factor directly into whether coverage, and which coverage limit, makes sense.",
        ],
      },
      {
        heading: "Reimbursement Rates, Deductibles, and Annual Limits",
        paragraphs: [
          "Pet policies typically reimburse a percentage of vet costs after a deductible, up to an annual limit, and all three numbers interact to determine real-world value in an actual claim. A policy with a low premium but a low annual limit can leave a meaningful gap in a serious illness or injury, which only becomes visible when you model an actual claim scenario rather than comparing premiums alone.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is pet insurance worth it for a healthy young pet?",
        answer:
          "Often yes, specifically because insuring early avoids pre-existing condition exclusions that apply once a health issue has already appeared, and premiums are typically lower for younger, healthier animals.",
      },
      {
        question: "What's the difference between an accident-only and a comprehensive pet policy?",
        answer:
          "Accident-only plans cover injuries like broken bones or swallowed objects; comprehensive plans also cover illnesses, which represent the majority of expensive vet claims over a pet's lifetime, at a correspondingly higher premium.",
      },
      {
        question: "Do wellness plans add value on top of insurance?",
        answer:
          "Wellness plans reimburse routine care like vaccines and checkups and are priced more like a subscription than insurance against an unpredictable event. Whether they're worth it depends on comparing the annual plan cost directly against your pet's typical routine care spending.",
      },
    ],
    externalLinks: [
      {
        label: "NAIC: Pet Insurance Consumer Guidance",
        url: "https://content.naic.org/consumer/pet-insurance",
        note: "Regulator guidance on how pet insurance policies are structured and what to check before buying.",
      },
    ],
    relatedCategories: [
      { slug: "coverage", label: "Coverage Calculators" },
      { slug: "deductibles", label: "Deductible Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  claims: {
    slug: "claims",
    displayName: "Claims",
    icon: "FileCheck2",
    focusKeyword: "insurance claim calculators",
    secondaryKeywords: [
      "insurance claim payout calculator",
      "total loss settlement calculator",
      "depreciation claim calculator",
      "actual cash value payout calculator",
    ],
    title: "Insurance Claim Calculators: Payouts & Settlements",
    metaDescription:
      "Insurance claim calculators for total loss, depreciation, and settlement estimates. Understand what a claim might actually pay before you file.",
    h1: "Insurance Claim Calculators",
    intro:
      "Whether you're filing a claim or deciding if one is worth filing, knowing roughly what a payout will look like changes the decision. These calculators model claim math directly: depreciation, deductibles, and settlement structure, so the number you expect is grounded in how insurers actually calculate payouts.",
    article: [
      {
        heading: "How Depreciation Shapes a Payout",
        paragraphs: [
          "Actual cash value claims subtract depreciation from replacement cost, and that depreciation is often steeper than claimants expect, particularly for roofing, appliances, and older vehicles. Recoverable depreciation, available on some replacement-cost policies, refunds that gap once repairs are actually completed, but only if you know to claim it and complete repairs within the policy's window.",
          "Understanding the depreciation schedule an insurer is likely to apply, before a claim is filed, helps set a realistic expectation for payout size and flags when a settlement offer looks unusually low relative to the loss.",
        ],
      },
      {
        heading: "Total Loss and Settlement Comparisons",
        paragraphs: [
          "A vehicle or property is typically declared a total loss when repair cost exceeds a set percentage of its value, and the resulting payout is based on that pre-loss value, not the cost of repairs avoided. For financed property, that payout can fall short of the remaining loan balance, which is exactly the gap gap insurance is designed to close.",
          "When a settlement offer arrives, comparing it against an independent estimate of fair market or replacement value, rather than accepting the first number, is a legitimate and common step. These tools help build that independent comparison.",
        ],
      },
    ],
    faqs: [
      {
        question: "What's the difference between actual cash value and replacement cost claims?",
        answer:
          "Actual cash value pays replacement cost minus depreciation; replacement cost pays the full cost to repair or replace with no deduction, though some replacement-cost policies pay the depreciated amount first and reimburse the difference (recoverable depreciation) after repairs are completed.",
      },
      {
        question: "When is a vehicle declared a total loss?",
        answer:
          "Typically when the estimated repair cost exceeds a set percentage of the vehicle's pre-loss actual cash value, a threshold that varies by state and insurer. The payout is based on that pre-loss value, not repair cost avoided.",
      },
      {
        question: "Can I negotiate a claim settlement offer?",
        answer:
          "Yes. Settlement offers are a starting position, not a final number, and providing independent documentation of value or repair cost, such as comparable sales or contractor estimates, is a standard and legitimate way to support a higher offer.",
      },
      {
        question: "What is recoverable depreciation?",
        answer:
          "On some replacement-cost policies, the initial payout withholds depreciation, which the insurer then reimburses once repairs are actually completed within the policy's specified window. Missing that window can mean forfeiting the recoverable portion entirely.",
      },
    ],
    externalLinks: [
      {
        label: "NAIC: Filing an Insurance Claim",
        url: "https://content.naic.org/consumer/filing-a-claim",
        note: "Regulator guidance on the claims process and what to expect from an insurer.",
      },
    ],
    relatedCategories: [
      { slug: "auto", label: "Auto Calculators" },
      { slug: "home", label: "Home Calculators" },
      { slug: "deductibles", label: "Deductible Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  deductibles: {
    slug: "deductibles",
    displayName: "Deductibles",
    icon: "Wallet",
    focusKeyword: "insurance deductible calculators",
    secondaryKeywords: [
      "deductible comparison calculator",
      "500 vs 1000 deductible calculator",
      "deductible savings calculator",
      "deductible break even calculator",
    ],
    title: "Insurance Deductible Calculators: Compare Your Options",
    metaDescription:
      "Deductible calculators comparing premium savings against out-of-pocket risk across auto, home, and health policies. Find your break-even point.",
    h1: "Deductible Calculators",
    intro:
      "A deductible is a trade: pay less now, or pay less later if you file a claim. These calculators find the break-even point between deductible options so the choice is based on your own risk tolerance and cash position, not a guess.",
    article: [
      {
        heading: "The Break-Even Math Behind Every Deductible Choice",
        paragraphs: [
          "Raising a deductible lowers the premium by a predictable amount, and that premium savings, accumulated over several years without a claim, is what you're weighing against the extra out-of-pocket cost in the year you do file one. The break-even point is the number of claim-free years needed for the accumulated savings to match the higher deductible, and it's the single clearest way to compare two deductible levels.",
          "That math looks different depending on how often you expect to file a claim. A driver or homeowner with a strong claims history and healthy emergency savings is a better candidate for a higher deductible than someone without a cash buffer to absorb a larger out-of-pocket cost.",
        ],
      },
      {
        heading: "Deductibles Across Policy Types",
        paragraphs: [
          "Auto and home deductibles are typically a flat dollar amount per claim, while health plan deductibles apply annually across all claims combined, which changes the calculation meaningfully for anyone with predictable recurring medical costs. Comparing deductible options within the correct structure for that policy type, rather than applying auto logic to a health plan or vice versa, avoids a mismatched conclusion.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I choose a $500 or $1,000 auto deductible?",
        answer:
          "Compare the premium savings from raising the deductible against how many claim-free years it takes for those savings to exceed the extra $500 you'd pay out of pocket on a claim. If you have the cash buffer and a low expected claim frequency, the higher deductible often wins over time.",
      },
      {
        question: "Does a higher deductible always save money?",
        answer:
          "Only if you don't file a claim often enough for the extra out-of-pocket cost to outweigh the accumulated premium savings. Someone who expects to file a claim in most years is generally better off with a lower deductible despite the higher premium.",
      },
      {
        question: "Is a health insurance deductible the same as an auto deductible?",
        answer:
          "Structurally different: an auto or home deductible applies per claim, while a health plan deductible applies once per year across all covered medical spending combined, after which coinsurance or full coverage typically applies.",
      },
    ],
    externalLinks: [
      {
        label: "III: How Deductibles Work",
        url: "https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work",
        note: "Explains deductible mechanics across policy types and how they affect premium.",
      },
    ],
    relatedCategories: [
      { slug: "auto", label: "Auto Calculators" },
      { slug: "home", label: "Home Calculators" },
      { slug: "health", label: "Health Calculators" },
      { slug: "claims", label: "Claims Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  coverage: {
    slug: "coverage",
    displayName: "Coverage",
    icon: "ShieldCheck",
    focusKeyword: "insurance coverage calculators",
    secondaryKeywords: [
      "how much coverage do I need calculator",
      "coverage gap calculator",
      "underinsurance calculator",
      "policy upgrade value calculator",
    ],
    title: "Insurance Coverage Calculators: How Much Do You Need?",
    metaDescription:
      "Coverage calculators that answer the question before you buy: how much insurance do you actually need. Built for auto, home, life, and business policies.",
    h1: "Coverage Calculators",
    intro:
      "Before comparing quotes, the real question is how much coverage you need in the first place, a number most people never calculate directly. These calculators work from your actual assets, income, and obligations to answer that question across every major policy type.",
    article: [
      {
        heading: "Why 'How Much Coverage' Comes Before 'Which Policy'",
        paragraphs: [
          "Shopping for insurance by comparing premiums first, without first sizing the coverage amount you actually need, routinely produces either an underinsured policy that leaves real exposure on the table, or an overinsured one that wastes premium on coverage that will never pay out proportionally. Working out the target coverage amount first turns every subsequent quote comparison into an apples-to-apples decision.",
          "That target isn't static. A coverage amount that made sense five years ago may be badly out of date after a home renovation, a new dependent, a paid-off debt, or a change in income, which is why revisiting the underlying calculation periodically matters as much as getting it right once.",
        ],
      },
      {
        heading: "Is a Coverage Upgrade Worth It?",
        paragraphs: [
          "When an insurer offers a coverage upgrade or add-on, the honest question is whether the added premium is proportional to the added protection in a realistic claim scenario, not whether the upgrade sounds reasonable in isolation. Modeling the specific scenario the upgrade protects against, and what it would actually pay in that scenario, turns a vague upsell into a concrete comparison.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I know if I'm underinsured?",
        answer:
          "Compare your current coverage limits against a direct calculation of your actual exposure: net worth and future income for liability coverage, replacement cost for property, and income-replacement need for life insurance. A meaningful gap between the calculated need and your current limit is the sign of underinsurance.",
      },
      {
        question: "How often should I recalculate my coverage needs?",
        answer:
          "After any major life change, income change, home renovation, big purchase, or new dependent, and at minimum once a year at renewal, since coverage needs drift even without a single obvious trigger.",
      },
      {
        question: "Is it worth paying more for higher coverage limits?",
        answer:
          "Usually the marginal cost of raising a liability limit is small relative to the added protection, since insurers price the first layer of coverage highest. Comparing the added premium against the added protection directly, rather than assuming higher always costs proportionally more, usually favors higher limits.",
      },
    ],
    externalLinks: [
      {
        label: "NAIC: Insurance Basics for Consumers",
        url: "https://content.naic.org/consumer",
        note: "Regulator hub covering coverage types and how to evaluate insurance needs.",
      },
    ],
    relatedCategories: [
      { slug: "deductibles", label: "Deductible Calculators" },
      { slug: "claims", label: "Claims Calculators" },
      { slug: "life", label: "Life Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },

  "state-requirements": {
    slug: "state-requirements",
    displayName: "State Requirements",
    icon: "MapPin",
    focusKeyword: "state insurance requirement calculators",
    secondaryKeywords: [
      "state minimum coverage calculator",
      "state liability requirement calculator",
      "state insurance requirements by state",
    ],
    title: "State Insurance Requirement Calculators",
    metaDescription:
      "Calculators for state-specific minimum insurance requirements, from auto liability limits to workers' compensation rules that vary by state.",
    h1: "State Requirement Calculators",
    intro:
      "Minimum coverage requirements, especially for auto and workers' compensation, vary by state and change periodically. These calculators check your coverage against your specific state's current requirement rather than a generic national figure.",
    article: [
      {
        heading: "Why State Minimums Are Only a Starting Point",
        paragraphs: [
          "Every state sets its own minimum liability limits for auto insurance, and some states additionally require uninsured or underinsured motorist coverage, personal injury protection, or specific minimums that neighboring states don't. Knowing your specific state's rule is the necessary first step, but as with any insurance decision, the minimum is a legal floor, not a recommendation for adequate protection.",
          "Business insurance requirements, particularly workers' compensation, vary even more by state, with different employee-count thresholds and industry-specific rules. A requirement calculator sized to your actual state avoids either under-complying with a legal minimum or over-assuming a stricter rule from a different state.",
        ],
      },
      {
        heading: "Requirements Change",
        paragraphs: [
          "State insurance requirements are periodically revised by state legislatures and insurance departments, so a figure that was accurate a few years ago may no longer be current. Checking your specific state's insurance department directly, alongside these calculators, is the most reliable way to confirm you're working from the current requirement.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do all states require the same minimum auto insurance?",
        answer:
          "No. Minimum liability limits, and whether uninsured motorist or personal injury protection coverage is required, vary by state. Always confirm your specific state's current requirement rather than assuming a national standard applies.",
      },
      {
        question: "Where can I find my state's official insurance requirements?",
        answer:
          "Your state's Department of Insurance is the authoritative source, and the NAIC maintains a directory linking to every state insurance department's official site.",
      },
      {
        question: "Does workers' compensation have to follow the same requirement in every state?",
        answer:
          "No. Requirements vary by state, including the employee-count threshold at which coverage becomes mandatory and how certain industries or business structures are treated, so a multi-state business needs to confirm requirements separately for each state it operates in.",
      },
    ],
    externalLinks: [
      {
        label: "NAIC: State Insurance Departments",
        url: "https://content.naic.org/state-insurance-departments",
        note: "Directory of official state insurance department websites for current requirements.",
      },
    ],
    relatedCategories: [
      { slug: "auto", label: "Auto Calculators" },
      { slug: "business", label: "Business Calculators" },
      { slug: "coverage", label: "Coverage Calculators" },
    ],
    relatedTools: [],
    groupRules: [],
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getCategoryContent(slug: string): CategoryContent | undefined {
  return CATEGORY_CONTENT[slug as CategorySlug];
}

/**
 * Deduplicates tools by slug (defensive: TOOLS may contain a rare duplicate
 * entry) and groups them into logical sub-sections using each category's
 * keyword-based groupRules. Categories with no groupRules (small categories,
 * or every category today, since the tool library is empty at launch) are
 * returned as a single ungrouped section.
 */
export function groupCategoryTools(categorySlug: string, tools: Tool[]) {
  const seen = new Set<string>();
  const deduped = tools.filter((t) => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });

  const content = getCategoryContent(categorySlug);
  const rules = content?.groupRules ?? [];

  if (!rules.length) {
    return [{ heading: `All ${content?.displayName ?? categorySlug} Tools`, tools: deduped }];
  }

  const buckets: { heading: string; tools: Tool[] }[] = rules.map((r) => ({
    heading: r.heading,
    tools: [],
  }));
  const fallback: Tool[] = [];

  for (const tool of deduped) {
    const hay = tool.slug;
    const idx = rules.findIndex((r) => r.keywords.some((k) => hay.includes(k)));
    if (idx >= 0) {
      buckets[idx].tools.push(tool);
    } else {
      fallback.push(tool);
    }
  }

  const nonEmpty = buckets.filter((b) => b.tools.length > 0);
  if (fallback.length) {
    nonEmpty.push({ heading: `More ${content?.displayName ?? ""} Tools`.trim(), tools: fallback });
  }
  return nonEmpty;
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Build the full Next.js Metadata object for a category landing page from
 * its hand-authored CategoryContent record: keyword-first title, 150-160
 * character meta description, canonical URL, OpenGraph, Twitter, and robots
 * directives (matching the shape used across the rest of the site).
 */
export function buildCategoryMetadata(content: CategoryContent): Metadata {
  const url = `${SITE_URL}/tools/${content.slug}`;

  return {
    title: content.title,
    description: content.metaDescription,
    keywords: [content.focusKeyword, ...content.secondaryKeywords].join(", "),
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
      title: content.title,
      description: content.metaDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.metaDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

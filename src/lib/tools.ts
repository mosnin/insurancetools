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
  {
    slug: "home-replacement-cost-calculator",
    name: "Home Replacement Cost Calculator",
    description:
      "Estimate your home's rebuild cost from your own square footage and a local construction cost per square foot you research yourself, plus an optional feature adjustment for upgrades or extra structures.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "home replacement cost calculator",
      "how to calculate home replacement cost",
      "dwelling replacement cost calculator",
      "rebuild cost calculator",
      "home insurance replacement cost estimator",
      "replacement cost vs market value",
    ],
    relatedTools: ["dwelling-coverage-calculator", "home-insurance-underinsurance-calculator"],
  },
  {
    slug: "dwelling-coverage-calculator",
    name: "Dwelling Coverage Calculator",
    description:
      "Turn your home rebuild cost into a recommended Coverage A dwelling limit, with an optional inflation buffer and a detached structures value you control.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "dwelling coverage calculator",
      "how much dwelling coverage do i need",
      "coverage A calculator",
      "home insurance dwelling limit calculator",
      "dwelling coverage estimate",
    ],
    relatedTools: ["home-replacement-cost-calculator", "home-insurance-underinsurance-calculator"],
  },
  {
    slug: "personal-property-coverage-calculator",
    name: "Personal Property Coverage Calculator",
    description:
      "Add up what your belongings would cost to replace by category, then see how that total compares to the illustrative default personal property limit many homeowners policies set.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "personal property coverage calculator",
      "how much personal property coverage do i need",
      "home contents coverage calculator",
      "personal property insurance estimate",
      "homeowners contents value calculator",
    ],
    relatedTools: ["home-inventory-value-calculator", "scheduled-jewelry-coverage-calculator"],
  },
  {
    slug: "home-insurance-deductible-calculator",
    name: "Home Insurance Deductible Calculator",
    description:
      "Compare your homeowners premium at two deductible levels, find the exact break-even point in years, and weigh it against how often you actually file claims.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "home insurance deductible calculator",
      "homeowners deductible comparison",
      "which home insurance deductible should i choose",
      "home insurance deductible break even calculator",
      "raise home deductible savings",
    ],
    relatedTools: ["dwelling-coverage-calculator", "water-damage-claim-calculator"],
  },
  {
    slug: "roof-replacement-claim-calculator",
    name: "Roof Replacement Claim Calculator",
    description:
      "Calculate your roof replacement claim payout: enter RCV, roof age, insurer useful-life, and deductible to see your ACV payout plus any recoverable depreciation.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "roof replacement claim calculator",
      "roof claim payout calculator",
      "roof depreciation calculator",
      "actual cash value roof claim",
      "recoverable depreciation roof",
    ],
    relatedTools: ["water-damage-claim-calculator", "home-insurance-deductible-calculator"],
  },
  {
    slug: "water-damage-claim-calculator",
    name: "Water Damage Claim Calculator",
    description:
      "Estimate your water damage insurance claim payout from repair cost, deductible, and any policy sublimit, with guidance on sudden vs. gradual vs. flood damage.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "water damage claim calculator",
      "water damage insurance payout calculator",
      "water damage claim estimate",
      "sudden water damage coverage calculator",
      "water damage deductible calculator",
    ],
    relatedTools: ["roof-replacement-claim-calculator", "flood-insurance-need-calculator"],
  },
  {
    slug: "additional-living-expenses-calculator",
    name: "Additional Living Expenses Calculator",
    description:
      "Free ALE calculator that estimates additional living expenses from your local hotel rate, displacement length, and extra daily costs, then compares the total against your current loss of use limit.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "additional living expenses calculator",
      "ALE coverage calculator",
      "loss of use coverage calculator",
      "temporary housing insurance calculator",
      "how much ALE coverage do i need",
    ],
    relatedTools: ["water-damage-claim-calculator", "roof-replacement-claim-calculator"],
  },
  {
    slug: "home-inventory-value-calculator",
    name: "Home Inventory Value Calculator",
    description:
      "Build an itemized home inventory value calculator: add each belonging with a quantity and value, and watch your total update live for insurance and claims records.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "home inventory value calculator",
      "home inventory calculator",
      "household inventory value estimator",
      "home contents inventory tool",
      "how to make a home inventory",
    ],
    relatedTools: ["personal-property-coverage-calculator", "scheduled-jewelry-coverage-calculator"],
  },
  {
    slug: "flood-insurance-need-calculator",
    name: "Flood Insurance Need Calculator",
    description:
      "Totals your uninsured flood exposure from dwelling and personal property value, since homeowners insurance excludes flood damage, and compares it to an optional premium quote.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "flood insurance need calculator",
      "do i need flood insurance",
      "flood insurance exposure calculator",
      "is my home at risk of flood",
      "flood insurance value calculator",
    ],
    relatedTools: ["home-replacement-cost-calculator", "water-damage-claim-calculator"],
  },
  {
    slug: "ordinance-and-law-coverage-calculator",
    name: "Ordinance and Law Coverage Calculator",
    description:
      "Enter your own contractor-estimated code-upgrade cost and current ordinance & law limit to see if your homeowners policy has a rebuild-to-code coverage gap.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "ordinance and law coverage calculator",
      "ordinance or law coverage calculator",
      "building code upgrade coverage",
      "ordinance and law insurance need",
      "code upgrade cost home insurance",
    ],
    relatedTools: ["dwelling-coverage-calculator", "home-insurance-underinsurance-calculator"],
  },
  {
    slug: "home-insurance-underinsurance-calculator",
    name: "Home Insurance Underinsurance Calculator",
    description:
      "Check your existing home insurance dwelling limit against your replacement cost to see the coverage gap in dollars and percent, plus whether a coinsurance penalty could apply.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "home insurance underinsurance calculator",
      "am i underinsured on my home",
      "home insurance coverage gap calculator",
      "underinsured homeowners calculator",
      "dwelling coverage shortfall calculator",
    ],
    relatedTools: ["home-replacement-cost-calculator", "dwelling-coverage-calculator"],
  },
  {
    slug: "scheduled-jewelry-coverage-calculator",
    name: "Scheduled Jewelry Coverage Calculator",
    description:
      "Find out how much of your jewelry, watches, and heirlooms exceeds your policy's theft sublimit and would need a scheduled floater to be fully covered.",
    category: "Home",
    categorySlug: "home",
    keywords: [
      "scheduled jewelry coverage calculator",
      "do i need a jewelry floater",
      "jewelry insurance rider calculator",
      "scheduled personal property jewelry",
      "jewelry insurance sublimit calculator",
    ],
    relatedTools: ["personal-property-coverage-calculator", "home-inventory-value-calculator"],
  },
  {
    slug: "life-insurance-needs-calculator",
    name: "Life Insurance Needs Calculator",
    description:
      "Calculate your life insurance needs with a transparent, line-by-line formula built from your own income, debts, and assets, not a generic income multiplier.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "life insurance needs calculator",
      "how much life insurance do i need",
      "life insurance coverage calculator",
      "life insurance needs analysis",
      "how to calculate life insurance needs",
      "term life insurance amount calculator",
    ],
    relatedTools: ["dime-method-calculator", "income-replacement-calculator"],
  },
  {
    slug: "dime-method-calculator",
    name: "DIME Method Life Insurance Calculator",
    description:
      "Use this DIME method life insurance calculator to add up debt, income replacement, mortgage balance, and education costs into one instant coverage estimate.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "DIME method life insurance calculator",
      "DIME method calculator",
      "DIME life insurance formula",
      "debt income mortgage education calculator",
      "how does the DIME method work",
      "life insurance DIME rule",
    ],
    relatedTools: ["life-insurance-needs-calculator", "mortgage-protection-calculator"],
  },
  {
    slug: "income-replacement-calculator",
    name: "Income Replacement Calculator",
    description:
      "Use this income replacement calculator to find the present value lump sum, invested at your own rate, that funds years of annual income without running out.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "income replacement calculator",
      "life insurance income replacement calculator",
      "present value of future income calculator",
      "how much income replacement insurance do i need",
      "income replacement life insurance",
      "present value income calculator life insurance",
    ],
    relatedTools: ["life-insurance-needs-calculator", "term-length-calculator"],
  },
  {
    slug: "term-length-calculator",
    name: "Term Life Insurance Length Calculator",
    description:
      "Use this term life insurance length calculator to compare your mortgage payoff, your kids' ages, and your retirement date, then get a recommended term length.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "term life insurance length calculator",
      "how long should my term life insurance be",
      "what term length should i choose",
      "20 vs 30 year term life insurance",
      "how many years of term life insurance do i need",
    ],
    relatedTools: ["mortgage-protection-calculator", "term-vs-whole-life-cost-calculator"],
  },
  {
    slug: "funeral-final-expense-calculator",
    name: "Funeral & Final Expense Calculator",
    description:
      "Use this funeral and final expense calculator to add up real burial costs, medical bills, and debts, then find your final expense insurance coverage gap.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "funeral and final expense calculator",
      "final expense insurance calculator",
      "funeral cost calculator",
      "how much does a funeral cost",
      "final expense coverage amount calculator",
      "burial insurance calculator",
    ],
    relatedTools: ["life-insurance-needs-calculator", "dime-method-calculator"],
  },
  {
    slug: "mortgage-protection-calculator",
    name: "Mortgage Protection Insurance Calculator",
    description:
      "Use this mortgage protection insurance calculator to find your level payoff coverage and see your decreasing term balance decline by year 5 and year 10.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "mortgage protection insurance calculator",
      "how much mortgage protection insurance do i need",
      "mortgage life insurance calculator",
      "mortgage protection vs term life",
      "decreasing term mortgage insurance calculator",
      "do i need mortgage protection insurance",
    ],
    relatedTools: ["term-length-calculator", "life-insurance-needs-calculator"],
  },
  {
    slug: "term-vs-whole-life-cost-calculator",
    name: "Term vs. Whole Life Insurance Cost Calculator",
    description:
      "Use this term vs whole life insurance calculator to compare total premiums and test the buy-term-invest-the-difference math against your illustrated cash value.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "term vs whole life insurance calculator",
      "term life vs whole life cost calculator",
      "term vs permanent life insurance",
      "is whole life insurance worth it",
      "whole life vs term life insurance calculator",
      "buy term invest the difference calculator",
    ],
    relatedTools: ["term-length-calculator", "life-insurance-needs-calculator"],
  },
  {
    slug: "stay-at-home-parent-coverage-calculator",
    name: "Stay-at-Home Parent Life Insurance Calculator",
    description:
      "Use this stay at home parent life insurance calculator to price the replacement cost of childcare, housekeeping, and other unpaid work at rates you choose.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "stay at home parent life insurance calculator",
      "does a stay at home parent need life insurance",
      "stay at home parent insurance calculator",
      "value of a stay at home parent",
      "replacement cost of a stay at home parent",
      "life insurance for non-working spouse",
    ],
    relatedTools: ["life-insurance-needs-calculator", "funeral-final-expense-calculator"],
  },
  {
    slug: "business-owner-life-insurance-calculator",
    name: "Business Owner Life Insurance Calculator",
    description:
      "Use this business owner life insurance calculator to size personal coverage for guaranteed debt, a buy-sell agreement, and key-person replacement cost.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "business owner life insurance calculator",
      "how much life insurance does a business owner need",
      "key person insurance calculator",
      "buy-sell agreement life insurance calculator",
      "personally guaranteed business debt life insurance",
      "small business owner life insurance needs",
    ],
    relatedTools: ["life-insurance-needs-calculator", "general-liability-coverage-calculator"],
  },
  {
    slug: "life-insurance-affordability-calculator",
    name: "Life Insurance Affordability Calculator",
    description:
      "Use this life insurance affordability calculator to set a monthly premium budget, then compare a real quote against it and a simple debt-to-income guideline.",
    category: "Life",
    categorySlug: "life",
    keywords: [
      "life insurance affordability calculator",
      "how much should i spend on life insurance",
      "life insurance budget calculator",
      "can i afford life insurance",
      "life insurance percentage of income",
      "affordable life insurance premium calculator",
    ],
    relatedTools: ["life-insurance-needs-calculator", "term-vs-whole-life-cost-calculator"],
  },
  {
    slug: "health-plan-comparison-calculator",
    name: "Health Plan Comparison Calculator",
    description:
      "Use this health plan comparison calculator to see the total annual cost of up to three health plans across your own low, moderate, and high spending scenarios.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "health plan comparison calculator",
      "compare health insurance plans calculator",
      "health plan cost comparison tool",
      "which health insurance plan is cheaper",
      "health insurance plan comparison",
      "total cost of health plan calculator",
    ],
    relatedTools: ["premium-vs-deductible-calculator", "break-even-medical-spending-calculator"],
  },
  {
    slug: "premium-vs-deductible-calculator",
    name: "Premium vs. Deductible Calculator",
    description:
      "Use this premium vs. deductible calculator to compare two health plans and see exactly which one costs less at your own expected annual medical spending level.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "premium vs deductible calculator",
      "high premium low deductible vs low premium high deductible",
      "health insurance premium deductible tradeoff",
      "which health plan saves more money",
      "premium vs deductible health insurance",
      "low deductible vs high deductible calculator",
    ],
    relatedTools: ["health-plan-comparison-calculator", "break-even-medical-spending-calculator"],
  },
  {
    slug: "ppo-vs-hdhp-calculator",
    name: "PPO vs. HDHP Calculator",
    description:
      "Run the PPO vs HDHP calculator to compare total annual cost at your own spending level, then net the HDHP against employer and personal HSA contributions.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "PPO vs HDHP calculator",
      "PPO vs high deductible health plan calculator",
      "should i choose HDHP or PPO",
      "HDHP vs PPO with HSA",
      "which health plan is better PPO or HDHP",
      "HSA eligible plan comparison calculator",
    ],
    relatedTools: ["hsa-savings-calculator", "health-plan-comparison-calculator"],
  },
  {
    slug: "hsa-savings-calculator",
    name: "HSA Savings Calculator",
    description:
      "Use this HSA savings calculator to project how your health savings account balance could grow with compounding, plus estimated tax savings on contributions.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "HSA savings calculator",
      "HSA growth calculator",
      "health savings account calculator",
      "HSA triple tax advantage calculator",
      "how much will my HSA grow",
      "HSA investment calculator",
    ],
    relatedTools: ["ppo-vs-hdhp-calculator", "out-of-pocket-maximum-calculator"],
  },
  {
    slug: "out-of-pocket-maximum-calculator",
    name: "Out-of-Pocket Maximum Calculator",
    description:
      "Calculate the true worst-case annual cost of a health plan by adding your premium to its out-of-pocket maximum, then rank up to three plans side by side.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "out of pocket maximum calculator",
      "worst case health insurance cost calculator",
      "out of pocket max calculator",
      "annual premium plus out of pocket max",
      "health insurance worst case scenario calculator",
      "max out of pocket cost calculator",
    ],
    relatedTools: ["health-plan-comparison-calculator", "hsa-savings-calculator"],
  },
  {
    slug: "coinsurance-calculator",
    name: "Coinsurance Calculator",
    description:
      "Use this coinsurance calculator to see what you'll owe on one medical bill after your deductible, coinsurance percentage, and out-of-pocket max are applied.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "coinsurance calculator",
      "how much will i owe in coinsurance",
      "coinsurance calculator health insurance",
      "20 percent coinsurance calculator",
      "patient responsibility calculator",
      "coinsurance vs copay calculator",
    ],
    relatedTools: ["medical-bill-responsibility-calculator", "copay-vs-coinsurance-plan-calculator"],
  },
  {
    slug: "copay-vs-coinsurance-plan-calculator",
    name: "Copay vs. Coinsurance Plan Calculator",
    description:
      "Compare a copay health plan against a coinsurance plan using your own visit counts, copay amounts, deductible, and expected billed costs to see which plan wins.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "copay vs coinsurance plan calculator",
      "copay plan vs coinsurance plan calculator",
      "which is better copay or coinsurance",
      "copay vs coinsurance health insurance",
      "fixed copay vs percentage coinsurance calculator",
      "copay plan cost calculator",
    ],
    relatedTools: ["coinsurance-calculator", "out-of-pocket-maximum-calculator"],
  },
  {
    slug: "medical-bill-responsibility-calculator",
    name: "Medical Bill Responsibility Calculator",
    description:
      "Use this medical bill responsibility calculator to see what you owe step by step, factoring in deductible and out-of-pocket max you've already met this year.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "medical bill responsibility calculator",
      "how much do i owe on this medical bill",
      "medical bill calculator insurance",
      "what will insurance pay for my bill",
      "patient responsibility after insurance calculator",
      "medical bill out of pocket calculator",
    ],
    relatedTools: ["coinsurance-calculator", "out-of-pocket-maximum-calculator"],
  },
  {
    slug: "family-plan-cost-calculator",
    name: "Family Health Plan Cost Calculator",
    description:
      "Use this free family health plan cost calculator to compare a family-tier premium against separate individual plans and find your exact break-even point.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "family health plan cost calculator",
      "family plan vs individual plans calculator",
      "is it cheaper to have separate health insurance plans",
      "family health insurance cost calculator",
      "employer family plan vs individual plans",
      "how many dependents before family plan is cheaper",
    ],
    relatedTools: ["health-plan-comparison-calculator", "premium-vs-deductible-calculator"],
  },
  {
    slug: "cobra-cost-calculator",
    name: "COBRA Cost Calculator",
    description:
      "Use this COBRA cost calculator to find your exact 102% COBRA premium after a job loss, see your employer's old share, and compare it to a marketplace plan.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "COBRA cost calculator",
      "how much does COBRA cost",
      "COBRA insurance calculator",
      "COBRA premium calculator",
      "COBRA vs marketplace insurance cost",
      "COBRA 102 percent rule",
    ],
    relatedTools: ["health-plan-comparison-calculator", "family-plan-cost-calculator"],
  },
  {
    slug: "break-even-medical-spending-calculator",
    name: "Break-Even Medical Spending Calculator",
    description:
      "Use this break-even medical spending calculator to find the exact spending level where two health plans cost the same, solved from your own plan numbers.",
    category: "Health",
    categorySlug: "health",
    keywords: [
      "break even medical spending calculator",
      "health plan breakeven calculator",
      "at what point does a high deductible plan cost more",
      "medical spending breakeven point",
      "when does low premium plan become worse",
      "health insurance crossover point calculator",
    ],
    relatedTools: ["premium-vs-deductible-calculator", "health-plan-comparison-calculator"],
  },
  {
    slug: "general-liability-coverage-calculator",
    name: "General Liability Insurance Calculator",
    description:
      "Use this general liability insurance calculator to find a common per-occurrence and aggregate coverage tier for your small business, then check any gap.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "general liability insurance calculator",
      "how much general liability insurance do i need",
      "small business general liability calculator",
      "general liability coverage limits calculator",
      "GL insurance calculator",
      "business liability insurance needs",
    ],
    relatedTools: ["professional-liability-errors-omissions-calculator", "contractor-insurance-calculator"],
  },
  {
    slug: "professional-liability-errors-omissions-calculator",
    name: "Professional Liability (E&O) Insurance Calculator",
    description:
      "Use this professional liability insurance calculator to size an E&O limit from your largest contract, active engagements, and any client-required minimum.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "professional liability insurance calculator",
      "errors and omissions insurance calculator",
      "how much E&O insurance do i need",
      "professional liability coverage calculator",
      "E&O insurance coverage limits",
      "malpractice insurance for consultants calculator",
    ],
    relatedTools: ["general-liability-coverage-calculator", "consultant-insurance-calculator"],
  },
  {
    slug: "cyber-insurance-coverage-calculator",
    name: "Cyber Insurance Coverage Calculator",
    description:
      "Use this cyber insurance coverage calculator to size breach-response and business-interruption exposure from your own record count and cost assumptions, free and instant.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "cyber insurance coverage calculator",
      "how much cyber insurance do i need",
      "data breach insurance cost calculator",
      "small business cyber liability calculator",
      "cyber insurance coverage limits",
      "cost per record data breach calculator",
    ],
    relatedTools: ["general-liability-coverage-calculator", "ecommerce-business-insurance-calculator"],
  },
  {
    slug: "business-interruption-calculator",
    name: "Business Interruption Insurance Calculator",
    description:
      "Estimate the business interruption insurance calculator's suggested coverage limit from your fixed costs, net profit, and recovery timeline — not gross revenue.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "business interruption insurance calculator",
      "how much business interruption coverage do i need",
      "business income insurance calculator",
      "business interruption coverage limits",
      "lost revenue insurance calculator",
      "business interruption insurance needs",
    ],
    relatedTools: ["commercial-property-coverage-calculator", "cyber-insurance-coverage-calculator"],
  },
  {
    slug: "workers-compensation-cost-estimator",
    name: "Workers' Compensation Cost Estimator",
    description:
      "Use this workers compensation cost estimator to calculate premium from payroll, your class code rate, and your experience modification factor, step by step.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "workers compensation cost estimator",
      "how much does workers comp insurance cost",
      "workers compensation calculator",
      "workers comp premium estimator",
      "workers compensation class code rate calculator",
      "small business workers comp cost",
    ],
    relatedTools: ["general-liability-coverage-calculator", "contractor-insurance-calculator"],
  },
  {
    slug: "commercial-property-coverage-calculator",
    name: "Commercial Property Insurance Calculator",
    description:
      "Use this commercial property insurance calculator to sum your building, contents, equipment, and inventory into one suggested coverage limit, free and instant.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "commercial property insurance calculator",
      "how much commercial property insurance do i need",
      "business property coverage calculator",
      "building and contents insurance calculator",
      "commercial property replacement cost calculator",
      "business equipment insurance calculator",
    ],
    relatedTools: ["business-interruption-calculator", "restaurant-insurance-calculator"],
  },
  {
    slug: "product-liability-exposure-calculator",
    name: "Product Liability Insurance Calculator",
    description:
      "Use this product liability insurance calculator to turn your own units-shipped, defect-rate, and claim-cost estimates into a rough annual exposure figure for your broker.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "product liability insurance calculator",
      "how much product liability insurance do i need",
      "product liability coverage calculator",
      "manufacturer insurance calculator",
      "product recall insurance cost",
      "product liability exposure estimator",
    ],
    relatedTools: ["general-liability-coverage-calculator", "ecommerce-business-insurance-calculator"],
  },
  {
    slug: "contractor-insurance-calculator",
    name: "Contractor Insurance Calculator",
    description:
      "Use this contractor insurance calculator to size a general liability limit to your largest job, value tools and equipment, and check if workers' comp applies.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "contractor insurance calculator",
      "general contractor insurance calculator",
      "how much insurance does a contractor need",
      "contractor liability insurance calculator",
      "tools and equipment insurance calculator",
      "contractor insurance requirements calculator",
    ],
    relatedTools: ["general-liability-coverage-calculator", "workers-compensation-cost-estimator"],
  },
  {
    slug: "restaurant-insurance-calculator",
    name: "Restaurant Insurance Calculator",
    description:
      "Use this restaurant insurance calculator to build a coverage checklist for liquor liability, spoilage, equipment breakdown, and business interruption risk.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "restaurant insurance calculator",
      "how much insurance does a restaurant need",
      "restaurant liquor liability calculator",
      "restaurant equipment breakdown insurance",
      "food spoilage insurance calculator",
      "restaurant business insurance cost",
    ],
    relatedTools: ["commercial-property-coverage-calculator", "general-liability-coverage-calculator"],
  },
  {
    slug: "consultant-insurance-calculator",
    name: "Consultant Insurance Calculator",
    description:
      "Use this consultant insurance calculator to size an E&O limit from your engagement value and client load, then check general liability and cyber coverage needs.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "consultant insurance calculator",
      "do consultants need insurance",
      "consultant liability insurance calculator",
      "business insurance for consultants",
      "independent consultant insurance cost",
      "consulting E&O insurance calculator",
    ],
    relatedTools: ["professional-liability-errors-omissions-calculator", "freelancer-insurance-calculator"],
  },
  {
    slug: "freelancer-insurance-calculator",
    name: "Freelancer Insurance Calculator",
    description:
      "Try this freelancer insurance calculator to size a combined liability and E&O bundle from your revenue and work type, plus equipment and platform notes.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "freelancer insurance calculator",
      "do freelancers need business insurance",
      "freelancer liability insurance cost",
      "insurance for self employed freelancers",
      "freelancer E&O and GL bundle calculator",
      "gig worker insurance calculator",
    ],
    relatedTools: ["consultant-insurance-calculator", "professional-liability-errors-omissions-calculator"],
  },
  {
    slug: "ecommerce-business-insurance-calculator",
    name: "E-Commerce Business Insurance Calculator",
    description:
      "Use this ecommerce business insurance calculator to size product liability, cyber, and downtime exposure for your online store in one place, free and instant.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "ecommerce business insurance calculator",
      "do online sellers need business insurance",
      "ecommerce product liability insurance",
      "online store insurance calculator",
      "ecommerce cyber insurance calculator",
      "dropshipping insurance requirements",
    ],
    relatedTools: ["cyber-insurance-coverage-calculator", "product-liability-exposure-calculator"],
  },
  {
    slug: "landlord-insurance-calculator",
    name: "Landlord Insurance Calculator",
    description:
      "Use this landlord insurance calculator to size dwelling, loss of rent, and liability coverage for a rental property you own, separate from a homeowners policy.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "landlord insurance calculator",
      "rental property insurance calculator",
      "landlord insurance vs homeowners insurance",
      "loss of rent coverage calculator",
      "dwelling fire policy calculator",
      "rental property liability insurance",
    ],
    relatedTools: ["commercial-property-coverage-calculator", "general-liability-coverage-calculator"],
  },
  {
    slug: "commercial-auto-insurance-calculator",
    name: "Commercial Auto Insurance Calculator",
    description:
      "Use this commercial auto insurance calculator to size a liability limit for business vehicles and see if hired and non-owned auto (HNOA) coverage applies.",
    category: "Business",
    categorySlug: "business",
    keywords: [
      "commercial auto insurance calculator",
      "business vehicle insurance calculator",
      "hired and non-owned auto insurance calculator",
      "fleet insurance liability calculator",
      "do i need commercial auto insurance",
    ],
    relatedTools: ["general-liability-coverage-calculator", "car-insurance-coverage-calculator"],
  },
  {
    slug: "renters-insurance-coverage-calculator",
    name: "Renters Insurance Coverage Calculator",
    description:
      "Use this renters insurance coverage calculator to get a starting personal property range, an ALE estimate, and a place to sanity-check the liability limit and deductible you're considering.",
    category: "Renters",
    categorySlug: "renters",
    keywords: [
      "renters insurance coverage calculator",
      "how much renters insurance do i need",
      "renters insurance calculator",
      "renters insurance coverage amount",
      "personal property and liability calculator for renters",
      "renters insurance needs",
    ],
    relatedTools: ["renters-personal-property-value-calculator", "renters-liability-coverage-calculator"],
  },
  {
    slug: "renters-personal-property-value-calculator",
    name: "Renters Personal Property Value Calculator",
    description:
      "Use this renters personal property value calculator to itemize your belongings room by room and find the right personal property limit for your policy.",
    category: "Renters",
    categorySlug: "renters",
    keywords: [
      "renters personal property value calculator",
      "renters inventory calculator",
      "how much are my belongings worth renter",
      "personal property value for renters insurance",
      "renters contents inventory tool",
      "apartment belongings value calculator",
    ],
    relatedTools: ["renters-insurance-coverage-calculator", "roommate-renters-insurance-split-calculator"],
  },
  {
    slug: "renters-liability-coverage-calculator",
    name: "Renters Liability Coverage Calculator",
    description:
      "This renters liability coverage calculator sizes your liability limit to your assets and risks like guests, a dog, or subletting. Free, instant, no sign-up.",
    category: "Renters",
    categorySlug: "renters",
    keywords: [
      "renters liability coverage calculator",
      "how much liability coverage do renters need",
      "renters insurance liability limit calculator",
      "guest injury renters insurance",
      "dog bite renters insurance calculator",
      "personal liability coverage for tenants",
    ],
    relatedTools: ["renters-insurance-coverage-calculator", "umbrella-policy-need-calculator"],
  },
  {
    slug: "additional-living-expenses-renters-calculator",
    name: "Additional Living Expenses Calculator for Renters",
    description:
      "Use this additional living expenses calculator for renters to estimate loss-of-use costs, plus whether your lease still requires rent while you're displaced.",
    category: "Renters",
    categorySlug: "renters",
    keywords: [
      "additional living expenses calculator for renters",
      "renters insurance loss of use coverage",
      "ALE coverage for renters",
      "temporary housing coverage renters insurance",
      "renters insurance displacement calculator",
      "how much ALE coverage do renters need",
    ],
    relatedTools: ["renters-insurance-coverage-calculator", "additional-living-expenses-calculator"],
  },
  {
    slug: "roommate-renters-insurance-split-calculator",
    name: "Roommate Renters Insurance Split Calculator",
    description:
      "Run the numbers with this roommate renters insurance split calculator: compare one shared policy against separate policies and see the real annual cost gap.",
    category: "Renters",
    categorySlug: "renters",
    keywords: [
      "roommate renters insurance split calculator",
      "should roommates get one renters insurance policy or separate",
      "splitting renters insurance cost with roommates",
      "roommate insurance calculator",
      "shared apartment renters insurance",
      "one policy vs multiple renters insurance policies",
    ],
    relatedTools: ["renters-insurance-coverage-calculator", "renters-personal-property-value-calculator"],
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

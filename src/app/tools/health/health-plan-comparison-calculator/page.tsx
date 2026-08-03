import type { Metadata } from "next";
import Link from "next/link";
import { HealthPlanComparisonCalculatorTool } from "@/components/tools/HealthPlanComparisonCalculatorTool";
import { FAQSection } from "@/components/tools/FAQSection";
import { LastUpdated } from "@/components/tools/LastUpdated";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdInArticle } from "@/components/ads";
import { getToolBySlug } from "@/lib/tools";
import {
  toolStructuredData,
  breadcrumbStructuredData,
  faqStructuredData,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

const tool = getToolBySlug("health-plan-comparison-calculator")!;

const TITLE = "Compare Health Insurance Plans Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this health plan comparison calculator to see the total annual cost of up to three health plans across your own low, moderate, and high spending scenarios.";
const PAGE_URL = `${SITE_URL}/tools/health/health-plan-comparison-calculator`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool.keywords.join(", "),
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
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
};

const faqs = [
  {
    question: "Does this health plan comparison calculator tell me which plan to pick?",
    answer:
      "No. It shows the total annual cost, premium plus your patient responsibility, for each plan you enter at each spending scenario you enter, and highlights which plan is cheapest at each level. It does not know your actual health needs, which doctors are in each plan's network, or which prescriptions each formulary covers, so treat the lowest total cost as one input to your decision, not the whole decision.",
  },
  {
    question: "How is the total annual cost for each plan actually calculated?",
    answer:
      "For each plan and spending scenario, the calculator applies your spending to the deductible first, then applies the coinsurance percentage to whatever spending is left, then caps that patient-responsibility amount at the plan's out-of-pocket maximum if it would otherwise exceed it. That capped figure is added to twelve months of the plan's premium to get one comparable total per plan per scenario.",
  },
  {
    question: "Why does the cheapest plan change between the low and high spending scenarios?",
    answer:
      "A plan with a low premium and a high deductible is usually cheapest when you barely use care, since you are paying mostly premium and little else. A plan with a higher premium but a lower out-of-pocket maximum can become cheaper once your spending is high enough that you would hit that cap, because the low-premium plan keeps accumulating coinsurance costs for longer before its own cap kicks in. The comparison table shows exactly where that trade-off lands for your own numbers.",
  },
  {
    question: "My plan has copays instead of coinsurance for doctor visits. Can I still use this?",
    answer:
      "Not accurately for the copay portion. This calculator models coinsurance, a percentage of the bill, applied after the deductible, which is how most major-medical plans handle hospital and specialty care. Flat-dollar copays for routine visits or prescriptions follow different rules and are not modeled here. If your plan is copay-heavy, treat this tool's output as an approximation for larger claims and add your expected copay spending separately.",
  },
  {
    question: "Does this calculator factor in HSA tax savings for a high-deductible plan?",
    answer:
      "No, deliberately. Tax savings depend on your marginal tax bracket, whether your employer contributes to the HSA, and how much you actually contribute, none of which this comparison tool asks for. The HSA savings calculator on this site is built specifically for that question; run a high-deductible plan's numbers through both tools if the plan you are comparing is HSA-eligible.",
  },
  {
    question: "Can I compare more than three health insurance plans at once?",
    answer:
      "This tool caps at three so the comparison table stays readable on a phone screen without horizontal scrolling through five or six columns. If you are choosing between more than three plans, narrow the field to your top three finalists here, or run pairs of plans through the break-even medical spending calculator to find the exact crossover point between any two.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Health Insurance Tools", href: "/tools/health" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function HealthPlanComparisonCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Health Plan Comparison Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter up to three health insurance plans and see the full-year cost of each one across a low,
            moderate, and high spending scenario you control. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <HealthPlanComparisonCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-health-plan-comparison-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Health Plan Comparison Calculator Does
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Open enrollment materials are good at listing a plan&apos;s premium, deductible, coinsurance
            percentage, and out-of-pocket maximum, and consistently bad at telling you what those four
            numbers add up to for a year that actually happens to you. This health plan comparison
            calculator closes that gap. Enter two or three real plans side by side, along with a few
            spending scenarios of your own choosing, and it runs every plan through every scenario to
            produce one comparable dollar total per combination: twelve months of premium plus what you
            would actually pay out of pocket for care at that spending level. No figure in the result comes
            from a published average; every input is a number you typed in from your own plan documents or
            your own expectations.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Comparison Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the moment you have two or three real plan options in front of you,
            whether from an employer&apos;s open enrollment portal or a marketplace comparison page, and the
            premium alone isn&apos;t enough to decide between them. It is most useful when the plans genuinely
            trade off differently, one with a lower premium and higher deductible, another with a higher
            premium and richer coverage, since that is exactly the shape of decision where the total cost at
            different spending levels can surprise you. If you are only weighing one plan&apos;s deductible
            options rather than comparing separate plans, the narrower premium-vs-deductible calculator on
            this site answers that specific question with less setup, and if you have exactly two plans and
            want the precise dollar amount of spending where one overtakes the other, the break-even medical
            spending calculator finds that single crossover point directly.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How the Deductible, Coinsurance, and Out-of-Pocket Max Waterfall Works
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nearly every major-medical plan applies cost sharing in the same order. First, your medical
            spending is applied against the deductible: you pay the full cost of care, dollar for dollar,
            until you have spent the deductible amount. Second, once the deductible is met, coinsurance
            applies to everything beyond it, meaning the plan pays its share and you pay yours, typically
            expressed as a percentage like 20% or 30%. Third, the out-of-pocket maximum acts as a hard
            ceiling on the first two steps combined: once your deductible payments plus your coinsurance
            payments for the year reach that ceiling, the plan pays 100% of additional covered costs for the
            rest of the year. This calculator runs that exact three-step waterfall for each plan at each
            spending scenario, then adds twelve months of premium on top, since premium is the one cost you
            pay regardless of how much care you use.
          </p>

          <AdInArticle slot="tool-health-plan-comparison-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example: Two Plans, Three Spending Levels</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a high-deductible plan with a $300 monthly premium ($3,600 a year), a $4,000
            deductible, 20% coinsurance, and a $7,000 out-of-pocket maximum, compared against a richer plan
            with a $550 monthly premium ($6,600 a year), a $500 deductible, 20% coinsurance, and a $3,000
            out-of-pocket maximum. At a low spending year of $800, the high-deductible plan costs $4,400
            total ($3,600 premium plus $800 of care, since spending never exceeds the deductible), while the
            richer plan costs $7,160 ($6,600 premium plus $560 of cost sharing) — the cheaper premium wins
            clearly when care is light. At a moderate year of $4,000 in spending, the two plans are close:
            $7,600 for the high-deductible plan versus $7,800 for the richer plan. At a high spending year of
            $20,000, the high-deductible plan&apos;s coinsurance keeps accumulating until it hits its $7,000
            out-of-pocket maximum, landing at $10,600 total, while the richer plan hits its lower $3,000
            out-of-pocket maximum sooner and lands at $9,600 total, becoming the cheaper option once spending
            gets high enough. That crossover, somewhere between a moderate and a high spending year, is
            exactly the kind of answer a premium comparison alone can never show you.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is comparing premiums alone and assuming the cheaper monthly bill is the
            cheaper plan for the year, which the example above shows is only true at low spending levels.
            The second is ignoring the out-of-pocket maximum entirely, treating the deductible and
            coinsurance percentage as the whole story, when the out-of-pocket maximum is often what actually
            decides which plan wins in a bad health year. A third is picking a spending scenario that
            doesn&apos;t reflect a realistic possibility for your own year, whether that&apos;s assuming you&apos;ll
            always be healthy or overestimating how much routine care actually costs; edit the three
            scenarios in the tool above until they reflect a plausible low, typical, and high year for you
            specifically.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a single combined deductible and a single coinsurance percentage per
            plan, which fits most individual major-medical plans but does not model separate in-network and
            out-of-network cost sharing, family versus individual deductible tiers, or plans built primarily
            around flat-dollar copays rather than coinsurance. It does not know provider network overlap,
            prescription drug formularies, or any plan-specific benefit like a wellness credit, and it does
            not model the tax savings available through a health savings account paired with an
            HSA-eligible high-deductible plan; use the HSA savings calculator on this site for that separate
            question. Every premium, deductible, coinsurance rate, out-of-pocket maximum, and spending
            scenario used here is a number you entered, never a published national average, and the result
            is a planning estimate, not a guarantee of what you will actually pay or a recommendation to
            enroll in a specific plan.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Deductible</strong> — the amount you pay for covered health care before your plan
              starts paying its share, reset each plan year.
            </li>
            <li>
              <strong>Coinsurance</strong> — your percentage share of the cost of a covered service after
              you have met your deductible, with the plan paying the remaining percentage.
            </li>
            <li>
              <strong>Out-of-pocket maximum</strong> — the most you have to pay for covered services in a
              plan year; once you reach it, your plan pays 100% of covered costs for the rest of the year.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the government&apos;s own definitions of these terms, see the{" "}
            <a
              href="https://www.healthcare.gov/glossary/deductible/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary entry on deductibles
            </a>
            , the{" "}
            <a
              href="https://www.healthcare.gov/glossary/coinsurance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              glossary entry on coinsurance
            </a>
            , and the{" "}
            <a
              href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              glossary entry on the out-of-pocket maximum
            </a>
            . For broader consumer guidance on how health plans are structured and regulated, the{" "}
            <a
              href="https://content.naic.org/consumer/health-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes plain-language health insurance guidance for consumers.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If you&apos;re weighing a single plan&apos;s deductible options rather than separate
            plans, the{" "}
            <Link href="/tools/health/premium-vs-deductible-calculator" className="text-blue-600 hover:underline">
              premium vs. deductible calculator
            </Link>{" "}
            is the narrower fit. For exactly two plans and the precise spending amount where one overtakes
            the other, use the{" "}
            <Link href="/tools/health/break-even-medical-spending-calculator" className="text-blue-600 hover:underline">
              break-even medical spending calculator
            </Link>
            . And to check a single plan&apos;s out-of-pocket maximum math on its own, the{" "}
            <Link href="/tools/health/out-of-pocket-maximum-calculator" className="text-blue-600 hover:underline">
              out-of-pocket maximum calculator
            </Link>{" "}
            walks through that one number in more detail.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for figuring out coverage, costs,
            claims, and deductibles before you talk to an agent or sign up for a plan. Nothing you type into
            this comparison table is saved or sent anywhere; it exists only to turn your own plan numbers
            into an answer you can actually compare.
          </p>
        </section>
      </div>
    </>
  );
}

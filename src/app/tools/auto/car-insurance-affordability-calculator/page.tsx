import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { CarInsuranceAffordabilityCalculatorTool } from "@/components/tools/CarInsuranceAffordabilityCalculatorTool";
import { FAQSection } from "@/components/tools/FAQSection";
import { LastUpdated } from "@/components/tools/LastUpdated";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdInArticle } from "@/components/ads";
import {
  toolStructuredData,
  breadcrumbStructuredData,
  faqStructuredData,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

/**
 * This tool is not yet wired into the central `src/lib/tools.ts` registry
 * (a separate process owns that file), so the metadata this page needs is
 * defined locally rather than pulled through `getToolBySlug`.
 */
const tool: Tool = {
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
  relatedTools: [],
};

const TITLE = "Car Insurance Affordability Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this car insurance affordability calculator to see a suggested monthly budget from your take-home income and car payment, then check your premium against it.";
const PAGE_URL = `${SITE_URL}/tools/auto/car-insurance-affordability-calculator`;

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
    question: "Is the 15–20% rule for car insurance an official guideline?",
    answer:
      "No. It's a commonly cited budgeting rule of thumb from consumer-finance educators for total transportation costs, meaning your car payment, insurance, fuel, and maintenance combined, not a figure set by a regulator, lender, or insurer. This calculator uses it because it's a reasonable starting point for most households, but your own housing costs, family size, and other priorities can reasonably push your number higher or lower.",
  },
  {
    question: "Why does the calculator subtract my car payment from the budget?",
    answer:
      "Because the 15–20% guideline is meant to cover your entire transportation cost, not insurance alone. If your car payment already uses up most of that range, very little is left for insurance, fuel, and maintenance, which is exactly the situation this tool is built to surface. Drivers who own their car outright naturally get a larger suggested insurance budget, since there's no payment competing for the same share of income.",
  },
  {
    question: "What if my actual premium is above the suggested range?",
    answer:
      "It doesn't automatically mean you're overpaying. Location, driving record, vehicle type, coverage limits, and deductible all affect price, and some of those are worth carrying even at a higher cost. Treat a premium above the range as a prompt to compare quotes, review your deductible, and check whether you're paying for coverage you don't need, not as proof the price itself is wrong.",
  },
  {
    question: "How is this different from a debt-to-income ratio calculator?",
    answer:
      "This tool's main output is a suggested insurance budget, not a loan-approval metric. The debt-to-income figure it shows is a secondary check using the same commonly cited 36% guideline lenders often reference, included here to flag when a car payment and other debt already leave little room for a new or growing insurance premium.",
  },
  {
    question: "Does this calculator know what my car insurance should actually cost?",
    answer:
      "No. It has no access to your driving record, location, vehicle, or any insurer's rates, so it can't predict a price. It only compares a premium you enter against a budgeting guideline. For an actual price, request quotes from licensed insurers, and use this tool's suggested range to judge whether those quotes fit your budget.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Auto Calculators", href: "/tools/auto" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function CarInsuranceAffordabilityCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Car Insurance Affordability Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter your take-home pay and car payment to see a suggested monthly car insurance budget,
            then check your actual or quoted premium against it. Free, instant, and nothing you type
            leaves your browser.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <CarInsuranceAffordabilityCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-affordability-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What &ldquo;Affordable&rdquo; Car Insurance Actually Means
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            &ldquo;Is this car insurance premium affordable?&rdquo; is a question almost every driver asks right
            after getting a quote, and almost no quote form answers it. A premium is a single number; a
            budget is a relationship between that number and everything else competing for the same
            paycheck. This car insurance affordability calculator exists to put those two things side by
            side, using take-home income and an existing car payment to suggest a reasonable range for
            insurance specifically, rather than telling you what the &ldquo;average&rdquo; driver pays, which
            answers a different question than the one you actually have.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Range Is Built</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts from a widely used budgeting guideline: keep total transportation
            costs, meaning your car payment, insurance, fuel, and maintenance added together, to roughly
            15% to 20% of monthly take-home pay. That range is a rule of thumb from consumer-finance
            educators, not a government mandate or an insurer&apos;s underwriting standard, and this tool
            treats it that way throughout. Multiplying your entered take-home income by 0.15 and 0.20
            produces a total transportation budget. The calculator then subtracts your car payment from
            both ends of that range, since a payment and a premium are drawing from the same 15–20%
            pocket, which leaves a suggested insurance-only budget rather than a combined transportation
            figure that doesn&apos;t answer the question you came in with.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            A second check runs alongside the budget range: adding your car payment and any other monthly
            debt together and dividing by your take-home income produces a simple debt-to-income figure.
            When that figure crosses roughly 36%, a threshold commonly cited by lenders and financial
            educators as a general guideline rather than a fixed rule, the calculator shows a caution
            note. The point isn&apos;t to tell you what you can or can&apos;t afford; it&apos;s to surface a signal
            that&apos;s easy to miss when you&apos;re looking at a single insurance quote in isolation.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Take a driver with $4,200 in monthly take-home pay, a $350 car payment, $300 in other monthly
            debt, and a $150 quoted monthly premium. Their total transportation budget lands between
            $630 and $840 (15% and 20% of $4,200). Subtracting the $350 car payment from each end leaves
            a suggested insurance budget of roughly $280 to $490 a month. Their $150 quote is comfortably
            under that range, which leaves room in the transportation budget for fuel and maintenance on
            top of it. Their debt-to-income figure, ($350 car payment plus $300 other debt) divided by
            $4,200, comes out to about 15.5%, well under the 36% guideline, so no caution note appears.
            Change any one input, a larger car payment, a lower income, more existing debt, and both the
            suggested range and the caution note move accordingly.
          </p>

          <AdInArticle slot="tool-affordability-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Common Mistakes When Budgeting for Car Insurance
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is comparing a premium against gross income instead of take-home
            pay, which makes almost any premium look more affordable than it actually is once taxes and
            deductions come out. A second is treating insurance as a budget line that&apos;s separate from
            the car payment, when both are drawing from the same transportation share of a paycheck, so
            a large payment can quietly leave very little room for insurance no matter how competitive
            the quote is. A third is dropping coverage purely to hit a budget number without checking
            what&apos;s actually being reduced, since cutting liability limits or raising a deductible past
            what you could pay out of pocket after a claim can trade a short-term budget win for a much
            larger loss later.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every figure this calculator produces comes from a general budgeting guideline, not a
            personalized financial plan. The 15–20% transportation range and the 36% debt-to-income
            threshold are commonly cited starting points among consumer-finance educators and some
            lenders, not formulas every advisor agrees with, and neither accounts for your housing costs,
            savings goals, dependents, or local cost of living, all of which can reasonably justify
            spending more or less than the suggested range. The tool also has no visibility into your
            actual coverage limits, deductible, driving record, or state&apos;s minimum requirements, so a
            premium landing inside the suggested range says nothing about whether the coverage behind it
            is adequate. Use the output as a planning starting point, not a final answer, and bring it
            into a conversation with a licensed insurance agent or financial professional before making a
            coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Take-home pay</strong> — your income after taxes and other paycheck deductions,
              which is what this calculator uses instead of gross salary.
            </li>
            <li>
              <strong>Debt-to-income ratio</strong> — total monthly debt payments divided by monthly
              income, commonly used by lenders as a rough measure of how much new debt or spending a
              household can reasonably absorb.
            </li>
            <li>
              <strong>Total transportation cost</strong> — a car payment, insurance premium, fuel, and
              routine maintenance added together, the full basis the 15–20% guideline is built around.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            The Consumer Financial Protection Bureau publishes background on{" "}
            <a
              href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              what a debt-to-income ratio is
            </a>{" "}
            and how it&apos;s commonly used, along with a{" "}
            <a
              href="https://www.consumerfinance.gov/consumer-tools/budgeting/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              budgeting tool and worksheet
            </a>{" "}
            for building out a full monthly budget beyond transportation costs. For definitions of the
            coverage types that make up an auto premium, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on how auto policies are structured and priced.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. Once you know roughly what you can afford, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            helps you decide what liability limit and add-ons to request quotes for, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            show how raising or lowering your deductible shifts the premium you&apos;re budgeting for, and
            the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the same how-much-do-I-need question for other policy types.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that turn insurance questions you can&apos;t easily
            answer alone, like whether a quote fits your budget, into a number you can actually use.
            Everything runs in your browser, collects nothing about you, and is meant to leave you better
            prepared for the conversation you have next with a licensed agent.
          </p>
        </section>
      </div>
    </>
  );
}

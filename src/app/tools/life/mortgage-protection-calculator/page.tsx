import type { Metadata } from "next";
import type { Tool } from "@/types";
import Link from "next/link";
import { MortgageProtectionCalculatorTool } from "@/components/tools/MortgageProtectionCalculatorTool";
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
 * This calculator is registered centrally in `src/lib/tools.ts` by a
 * separate integration step. A local literal mirrors that eventual
 * registry entry so this page's metadata and structured data are complete
 * and correct on their own, independent of registry integration timing.
 */
const tool: Tool = {
  slug: "mortgage-protection-calculator",
  name: "Mortgage Protection Insurance Calculator",
  description:
    "Find your flat mortgage protection coverage amount and see how a decreasing term death benefit tied to your loan is projected to decline over the next 5 and 10 years.",
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
};

const TITLE = "Mortgage Protection Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this mortgage protection insurance calculator to find your level payoff coverage and see your decreasing term balance decline by year 5 and year 10.";
const PAGE_URL = `${SITE_URL}/tools/life/mortgage-protection-calculator`;

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
    question: "Is mortgage protection insurance the same thing as life insurance?",
    answer:
      "It's a type of life insurance, but a narrower one. Mortgage protection insurance pays its death benefit toward your mortgage balance specifically, and that benefit is usually structured as decreasing term coverage that shrinks as your loan balance shrinks. A term life insurance policy bought on its own typically pays a level, fixed death benefit directly to whoever you name as beneficiary, who can then choose whether to use it on the mortgage, other debts, income replacement, or anything else.",
  },
  {
    question: "Why does the coverage amount in this calculator go down over time?",
    answer:
      "Because that's how decreasing term mortgage coverage is built: the death benefit is designed to track your loan's own amortization schedule, so it declines every year as your payoff balance declines. This calculator projects that same balance forward using the standard amortization formula and your own remaining balance, term, and rate, so you can see roughly where the real dollar need is headed rather than only the number today.",
  },
  {
    question: "If the death benefit shrinks, does the premium shrink too?",
    answer:
      "Usually not. Most decreasing term mortgage protection policies are sold with a level premium for the life of the policy, even though the payout keeps falling. That combination, a fixed premium paying for a shrinking benefit, is worth understanding clearly before buying, since it means the coverage gets comparatively more expensive per dollar of protection every year you hold it.",
  },
  {
    question: "Should I buy mortgage protection insurance or a separate term life policy?",
    answer:
      "That depends on what you're optimizing for. A separate term life policy is portable, meaning it stays in force if you refinance, sell the home, or switch lenders, and it typically holds a level death benefit rather than a declining one, so your family gets flexibility in how the money is used. Mortgage protection tied to the loan is simpler to set up and sometimes doesn't require a medical exam, but the benefit is narrower in purpose and declines over time. This calculator shows you the balance projection so you can compare that trade-off; it doesn't recommend one product over the other.",
  },
  {
    question: "Does this calculator show real mortgage protection insurance premiums?",
    answer:
      "No. It only projects your loan's own payoff balance using the amortization formula your mortgage is built on. Actual premiums depend on your age, health, coverage amount, and the insurer's underwriting, none of which this tool has access to. Use the balance projection to understand how much coverage you actually need at different points in time, then request quotes for both mortgage protection and standalone term life to compare real pricing.",
  },
  {
    question: "What if my mortgage has an adjustable rate?",
    answer:
      "This calculator assumes your interest rate stays constant for the full remaining term, which matches a fixed-rate mortgage. If you have an adjustable-rate mortgage, treat the projection as a rough guide rather than an exact schedule, since a rate change after an adjustment period will shift your real payment and payoff timeline in ways this tool can't predict.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Life Insurance Tools", href: "/tools/life" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function MortgageProtectionCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Mortgage Protection Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See the flat coverage amount that would pay off your mortgage today, then watch how a
            decreasing term death benefit tied to your loan is projected to shrink over the next 5 and
            10 years. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <MortgageProtectionCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-mortgage-protection-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Mortgage Protection Insurance Calculator Shows You
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A mortgage protection insurance calculator has one job worth doing well: showing you that the
            dollar amount you need to protect isn&apos;t fixed. Enter your remaining mortgage balance,
            remaining amortization term, and interest rate, and this tool gives you two things side by
            side, a flat coverage figure equal to today&apos;s payoff balance, and a projection of where that
            balance is headed at your 5-year and 10-year mark using the same amortization math your
            lender uses to build your payment schedule. Homeowners shopping for either mortgage
            protection insurance or a standalone term life policy sized to the mortgage tend to anchor on
            the flat number alone, which overstates the real need in every year after the first.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is built for two groups: homeowners comparing a mortgage protection policy pitched by
            their lender or loan officer against a standalone term life policy, and anyone who already
            has mortgage protection coverage and wants to see whether the death benefit still matches
            what&apos;s actually owed. If you&apos;re early in a 30-year loan, the gap between today&apos;s balance and
            the balance a decade from now is often large enough to change which product makes more sense
            for your household.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Balance Projection Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator treats your entered remaining balance as the starting principal for a fresh
            amortization schedule over your remaining term, using the standard fixed-rate loan payment
            formula: monthly payment M = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ − 1], where P is your remaining balance,
            r is your monthly interest rate (your annual rate divided by 12), and n is your remaining
            number of months. From that payment, the balance remaining after m months follows B(m) = P ×
            (1+r)ᵐ − M × [((1+r)ᵐ − 1) ÷ r]. The tool runs that formula at m = 60 and m = 120 months to
            show your projected balance at the 5-year and 10-year marks, and reports the loan as paid off
            once the remaining term itself is shorter than that check-in point.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Take a homeowner with a $300,000 remaining balance, 25 years left on the loan, and a 6.5%
            interest rate. The flat coverage figure is $300,000, and the estimated principal-and-interest
            payment on that schedule is about $2,025/month. Running the amortization formula forward, the
            projected balance falls to roughly $271,000 by year 5, a decline of about 10%, and to roughly
            $237,000 by year 10, a decline of about 21%. A decreasing term mortgage protection policy
            written against this loan would track that same downward curve, while a level term life
            policy for $300,000 bought separately would still pay $300,000 in year 10, $63,000 more than
            the loan actually owes by then. Neither answer is automatically wrong; the point is knowing
            which one you&apos;re actually buying.
          </p>

          <AdInArticle slot="tool-mortgage-protection-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake Worth Avoiding</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The mistake this tool is built to head off is assuming that because the premium on a mortgage
            protection policy stays level, the value of the coverage does too. It doesn&apos;t. Most
            decreasing term mortgage protection products are priced with a flat premium for the life of
            the policy while the death benefit itself keeps falling, which means you&apos;re paying the same
            amount every year for a steadily shrinking payout. That&apos;s not necessarily a bad trade if the
            policy was cheap to begin with or came without a medical exam, but it&apos;s a trade you should
            make on purpose, not by default because it was the option presented at closing.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This projection assumes a fixed interest rate for the entire remaining term and a standard
            amortization schedule with no extra principal payments, refinancing, or missed payments along
            the way. It does not know your lender&apos;s actual current payoff figure, which can differ
            slightly from a pure amortization calculation due to escrow, fees, or payment timing, and it
            does not model adjustable-rate mortgages beyond their current fixed period. It also does not
            show real mortgage protection or term life premiums, since actual pricing depends on medical
            underwriting, age, coverage amount, and the insurer offering the policy, none of which this
            tool has access to. Treat the balance figures as planning numbers, and confirm your exact
            current payoff with your loan servicer before making a coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance and Mortgage Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Decreasing term insurance</strong> — life insurance where the death benefit falls
              on a set schedule over the policy term, commonly used for mortgage protection because it
              mirrors a loan&apos;s declining balance.
            </li>
            <li>
              <strong>Level term insurance</strong> — life insurance where the death benefit stays fixed
              for the entire policy term regardless of how any associated debt changes.
            </li>
            <li>
              <strong>Amortization</strong> — the process of paying off a loan through scheduled
              payments that cover both interest and a growing share of principal over time, gradually
              reducing the balance to zero.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how life insurance needs are typically assessed, the{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes consumer guidance on coverage methods and term length. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            maintains broader consumer resources on how life insurance products are structured and
            regulated. For mortgage-side context on amortization and payoff schedules, the{" "}
            <a
              href="https://www.consumerfinance.gov/owning-a-home/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Consumer Financial Protection Bureau
            </a>{" "}
            publishes homeowner tools and explainers. Before buying or changing coverage, a licensed
            insurance agent and your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            can confirm the specifics of any policy you&apos;re considering.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. If you&apos;re deciding how many years of coverage to buy rather than how much, the{" "}
            <Link href="/tools/life/term-length-calculator" className="text-blue-600 hover:underline">
              term length calculator
            </Link>{" "}
            walks through that separately, and the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            looks at your full coverage need beyond just the mortgage, including income replacement and
            other debts.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the moments insurance decisions
            actually get made, like sitting across from a loan officer weighing whether to add a
            mortgage protection rider. Every tool runs entirely in your browser and works without an
            account, so you can bring a real number into that conversation instead of a guess.
          </p>
        </section>
      </div>
    </>
  );
}

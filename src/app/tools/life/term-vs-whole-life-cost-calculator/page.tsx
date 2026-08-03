import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { TermVsWholeLifeCostCalculatorTool } from "@/components/tools/TermVsWholeLifeCostCalculatorTool";
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
 * This tool has not yet been registered in the central tool registry
 * (`src/lib/tools.ts`); that wiring is handled by a separate process. The
 * page builds its own `Tool`-shaped object so metadata and structured data
 * stay correct in the meantime, without editing any file outside this one
 * and its companion component.
 */
const tool: Tool = {
  slug: "term-vs-whole-life-cost-calculator",
  name: "Term vs. Whole Life Insurance Cost Calculator",
  description:
    "Compare total term and whole life premiums over your own horizon and see what investing the premium gap could grow to versus a whole life cash value you enter from your own illustration.",
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
};

const TITLE = "Term vs. Whole Life Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this term vs whole life insurance calculator to compare total premiums and test the buy-term-invest-the-difference math against your illustrated cash value.";
const PAGE_URL = `${SITE_URL}/tools/life/term-vs-whole-life-cost-calculator`;

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
    question: "What does \"buy term and invest the difference\" actually mean?",
    answer:
      "It's a strategy where instead of paying a higher whole life premium, you buy cheaper term coverage and separately invest whatever you would have paid extra for whole life. This calculator runs that math for you: it takes the dollar gap between the two premiums you entered and projects what investing that gap every year, at a return rate you choose, would grow to over your comparison horizon.",
  },
  {
    question: "How is the invested value of the premium gap calculated?",
    answer:
      "The calculator treats the annual premium gap as a fixed yearly contribution and compounds it at your chosen annual return using the standard future-value-of-an-annuity formula. It assumes the full gap is invested every year for the whole horizon with no missed years, no fees, and no taxes, which is a simplification real accounts rarely match exactly.",
  },
  {
    question: "Is a 6% or 8% investment return a safe assumption to use here?",
    answer:
      "No single number is \"safe\" to assume, which is exactly why the field is editable rather than fixed. Market returns vary year to year and are never guaranteed, so the calculator flags any return assumption above 8% as optimistic and encourages you to re-run the comparison at a more conservative rate to see how sensitive the result is to that one input.",
  },
  {
    question: "Does this calculator tell me whether term or whole life is better for me?",
    answer:
      "No. It only compares the numbers you enter using the buy-term-invest-the-difference math. It doesn't know your health, your family's needs, your investing discipline, your tax situation, or whether guaranteed lifelong coverage and guaranteed cash value growth matter more to you than a potentially higher but market-dependent invested balance. Those are personal factors a licensed agent or financial professional can help you weigh.",
  },
  {
    question: "What's the difference between a whole life illustration and a guarantee?",
    answer:
      "An illustration is the insurer's projection of how your policy's cash value and death benefit could perform, often shown at a guaranteed minimum and a non-guaranteed, higher assumed rate. Only the guaranteed column is contractually promised. If you enter a cash-value figure from the non-guaranteed column, treat this calculator's comparison as similarly non-guaranteed on both sides.",
  },
  {
    question: "Why might my invested-difference number look bigger than my cash value number?",
    answer:
      "Whole life cash value typically grows at a conservative, insurer-guaranteed (or close to guaranteed) rate, while an invested premium gap in equities has historically had higher average returns over long periods, along with real year-to-year risk of loss that a whole life cash value doesn't carry. A bigger invested-difference figure in this calculator reflects that risk-return tradeoff, not a guarantee that your own investments will perform the same way.",
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

export default function TermVsWholeLifeCostCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Term vs. Whole Life Insurance Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter the term and whole life premiums from your own quotes, and this term vs whole life
            insurance calculator runs the buy-term-invest-the-difference math against them, so you&apos;re
            comparing real numbers instead of someone else&apos;s example.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <TermVsWholeLifeCostCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-term-vs-whole-life-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Calculator Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool doesn&apos;t guess at what term or whole life insurance costs, because no calculator
            can know that without underwriting you. Instead, you supply two numbers you already have: the
            annual premium from a term life quote and the annual premium from a whole life illustration.
            From there it does three things live as you type: totals what you&apos;d pay into each option
            over a comparison horizon you choose, calculates the dollar gap between the two premiums, and
            projects what investing that gap every year at a return rate you set would grow to by the end
            of the horizon. If you have a cash-value figure from your whole life illustration, you can
            enter that too and see it sitting next to the invested-gap projection.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use It</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is built for someone holding two real pieces of paper: a term life quote and a whole life
            illustration for a similar death benefit, trying to make sense of why one premium is so much
            higher than the other. It&apos;s also useful if you already own a whole life policy and want to
            see, in dollar terms, what the difference between your premium and a comparable term premium
            could have become if invested instead. It is not a tool for choosing a coverage amount; if
            you still need to figure out how much life insurance to buy in the first place, run that
            question through a needs-based calculator first, then bring the resulting term and whole life
            quotes back here.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Buy-Term-Invest-the-Difference Math, Step by Step
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculation happens in four steps. First, it multiplies each premium by your comparison
            horizon to get a total outlay figure for term and for whole life over that period. Second, it
            subtracts the term premium from the whole life premium to find the annual gap, the amount you&apos;d
            free up each year by choosing term instead. Third, it treats that gap as a fixed annual
            contribution and compounds it at your chosen return rate using the standard future-value
            formula for a series of equal annual deposits, the same math behind most retirement
            contribution calculators. Fourth, if you&apos;ve entered a whole life cash-value figure from your
            illustration, it places that number next to the invested-gap total so you can see the two
            paths side by side, in dollars, for the same horizon.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a 35-year-old is quoted $450 a year for a 20-year term policy, and separately illustrated
            at $2,600 a year for a comparable whole life policy. Over 20 years, term totals $9,000 in
            premiums and whole life totals $52,000. The annual gap is $2,150. Investing $2,150 every year
            for 20 years at an assumed 6% annual return compounds to roughly $79,000, using the future-value-of-an-annuity
            formula this calculator runs. If that person&apos;s whole life illustration shows a
            non-guaranteed cash value of around $38,000 at year 20, the invested-gap figure comes out
            about $41,000 higher in this scenario, entirely because of the assumed 6% return applied to
            the premium difference, not because whole life performed poorly. Change the assumed return to
            3% instead, and that same $2,150 annual gap compounds to closer to $59,000, cutting the
            advantage roughly in half. The numbers move a lot based on one input, which is the whole point
            of testing more than one rate.
          </p>

          <AdInArticle slot="tool-term-vs-whole-life-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Comparison Exposes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is picking a single optimistic return rate, running the comparison
            once, and treating the resulting invested-gap number as a settled fact rather than one
            scenario among many. Real market returns vary year to year and are never guaranteed the way a
            whole life cash-value column can be, so the honest way to use this tool is to test a
            conservative rate and an optimistic rate and look at the range, not just the number that makes
            one option look best. The second common mistake runs the opposite direction: assuming whole
            life cash value is automatically the &ldquo;safe&rdquo; choice without checking whether the figure on
            your illustration is from the guaranteed column or the non-guaranteed, higher-assumed-rate
            column, since only the guaranteed figure is contractually promised.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes you invest the entire premium gap every single year of the horizon,
            with no fees, no taxes, and no years skipped, which is a best-case simplification of how
            people actually invest. It compounds annually at a single flat rate rather than modeling the
            real volatility of market returns, so it cannot show you the range of outcomes a Monte Carlo
            projection would. It does not price in whole life&apos;s non-financial features, including
            guaranteed insurability regardless of future health changes and coverage that lasts your
            whole life rather than expiring at the end of a term, both of which some buyers value
            independently of the dollar math. It also does not know your tax situation, though policy
            loans and cash-value growth inside a whole life policy can carry different tax treatment than
            a taxable brokerage account, which is worth a conversation with a tax professional if it
            factors into your decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Term Life, Whole Life, and Cash Value</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Term life insurance</strong> — coverage that lasts a fixed number of years and pays a
              death benefit only if you die during that term, with no cash value component.
            </li>
            <li>
              <strong>Whole life insurance</strong> — permanent coverage that lasts your entire life as long
              as premiums are paid, combining a death benefit with a cash-value account that grows over
              time.
            </li>
            <li>
              <strong>Cash value</strong> — the savings-like component inside a permanent policy like whole
              life, which can grow over time and, depending on the policy, may be borrowed against or
              partially withdrawn while you&apos;re alive.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For a fuller explanation of how life insurance types differ, {" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the Insurance Information Institute
            </a>{" "}
            publishes consumer guidance on coverage types and needs analysis, and{" "}
            <a
              href="https://content.naic.org/consumer/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the National Association of Insurance Commissioners
            </a>{" "}
            covers how life insurance policies work at a regulatory level. The future-value-of-an-annuity
            math this calculator uses to project the invested premium gap follows the same compounding
            approach described in the SEC&apos;s{" "}
            <a
              href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Investor.gov compound interest calculator
            </a>
            . Before buying or replacing a policy, confirm your options with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. If you still need to size your coverage amount before comparing quotes, the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            estimates how much death benefit to shop for, and the{" "}
            <Link href="/tools/life/term-length-calculator" className="text-blue-600 hover:underline">
              term length calculator
            </Link>{" "}
            helps you pick how many years of term coverage actually matches your financial obligations.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that run entirely in your browser so you can work
            through insurance and coverage math on your own terms, without an account, a sales call, or
            your numbers leaving your device. This calculator, like the rest of the library, is meant to
            get you into a conversation with a licensed professional already holding real numbers, not to
            replace that conversation.
          </p>
        </section>
      </div>
    </>
  );
}

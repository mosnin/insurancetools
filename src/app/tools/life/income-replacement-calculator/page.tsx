import type { Metadata } from "next";
import Link from "next/link";
import { IncomeReplacementCalculatorTool } from "@/components/tools/IncomeReplacementCalculatorTool";
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

const tool = getToolBySlug("income-replacement-calculator")!;

const TITLE = "Income Replacement Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this income replacement calculator to find the present value lump sum, invested at your own rate, that funds years of annual income without running out.";
const PAGE_URL = `${SITE_URL}/tools/life/income-replacement-calculator`;

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
    question: "What does this income replacement calculator actually compute?",
    answer:
      "It computes one specific number: the present value of a stream of annual income payments, using the standard present-value-of-an-annuity formula. You enter the annual income you want to replace, how many years you want it replaced for, and a rate you assume the money could earn while it's being drawn down. The result is the lump sum that, invested at that rate today, would be fully used up after paying out that income for that many years. It is not a full life insurance needs calculation on its own, since it doesn't ask about existing debts, savings, or a mortgage balance the way a broader needs calculator does.",
  },
  {
    question: "Why is the present value lower than income times years?",
    answer:
      "Because the lump sum isn't sitting still, it's invested and earning a return while it's being spent down. Each year a withdrawal comes out, but the remaining balance keeps growing, so a smaller starting amount can still fund the same number of years of payments. The higher the rate you assume, the bigger that gap gets between the raw total (income multiplied by years) and the present value this calculator returns. That gap is shown directly in the tool once you enter a rate.",
  },
  {
    question: "What discount rate should I use?",
    answer:
      "This tool doesn't supply one, deliberately. The rate you choose should reflect what you realistically expect a conservative, income-generating investment portfolio to return after taxes, and ideally after inflation as well, not the average long-run return of the stock market. Many people planning around this kind of calculation use a rate in the low single digits to stay conservative, since a rate that's too optimistic understates how much lump sum is actually needed. If you're not sure, that's a good question to bring to a licensed financial professional rather than guess.",
  },
  {
    question: "Does this calculator account for inflation?",
    answer:
      "Not as a separate input. If you want the result to hold up against rising costs over time, the simplest approach is to lower the rate you enter to reflect your expected investment return net of inflation, rather than your raw expected return. For example, if you expect a portfolio to return 6% and expect inflation to average 3%, entering roughly 3% approximates an inflation-adjusted result. This is a simplification, not a substitute for a full inflation-adjusted planning model.",
  },
  {
    question: "Should I add anything on top of the present value figure?",
    answer:
      "That depends on your situation. This calculator includes an optional lump-sum field for costs that aren't part of an ongoing income stream, such as remaining debts, funeral or final expenses, or paying off a mortgage outright. Anything you enter there is added on top of the present value figure rather than folded into the annuity math, since those are one-time costs rather than years of recurring income.",
  },
  {
    question: "How is this different from the site's other life insurance calculators?",
    answer:
      "The life insurance needs calculator and the DIME method calculator both combine several inputs, debts, income, mortgage, and education costs, into one overall coverage recommendation using their own methodologies. This tool does not duplicate that; it isolates a single step, the present value of a chosen income stream at a chosen rate, so you can see exactly how that one assumption moves the number. Many people use this calculator to sanity-check the income-replacement portion of a broader estimate from one of those other tools.",
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

export default function IncomeReplacementCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Income Replacement Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Find the lump sum that would fully replace years of income, once that money is invested
            instead of just stacked in a drawer. Enter your own rate assumption and watch the number
            change instantly.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <IncomeReplacementCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-income-replacement-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Income Replacement Calculator Does
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most people sizing up how much life insurance to buy start with a rough shortcut: take an
            annual income figure and multiply it by the number of years it needs to last. That number is
            useful as a ceiling, but it overstates what&apos;s actually required, because it assumes the
            payout just sits in cash and gets spent down to zero with no growth along the way. This
            income replacement calculator runs the more precise version of that math, called a present
            value calculation, which accounts for the fact that a lump sum can keep earning a return
            while it&apos;s being drawn down for living expenses. The result is typically a smaller number
            than income multiplied by years, and this tool shows you exactly how much smaller, and why.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is aimed at anyone estimating how much life insurance coverage would be needed to
            replace their income, or a partner&apos;s income, for a defined stretch of years, such as until
            children are grown, a mortgage is paid off, or a surviving spouse reaches retirement age.
            It&apos;s also useful for anyone who has already run a broader needs calculation elsewhere and
            wants to understand the income-replacement piece of that number in isolation, rather than as
            one input buried inside a larger formula. If you want a single combined coverage
            recommendation that also factors in debts, a mortgage balance, and existing savings, the
            site&apos;s life insurance needs calculator and DIME method calculator are built for that
            broader question; this tool is built to make the present-value step transparent on its own.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Formula, Step by Step</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator uses the standard present-value-of-an-ordinary-annuity formula:
          </p>
          <p className="text-slate-900 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4">
            PV = PMT × [(1 − (1 + r)<sup>−n</sup>) / r]
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Here, PMT is the annual income you want to replace, r is your chosen annual rate expressed
            as a decimal (5% becomes 0.05), and n is the number of years the income needs to last. The
            formula finds the single lump sum today that, earning rate r every year, can pay out PMT at
            the end of each year for n years and land at exactly zero. When r is zero, that formula
            divides by zero and breaks down, so the calculator switches to the simpler case for a 0%
            rate assumption: PV = PMT × n, which is the same as the plain multiplication shortcut most
            people start with. Any rate above zero produces a present value below that raw total, and the
            calculator shows you the size of that gap directly.
          </p>

          <AdInArticle slot="tool-income-replacement-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Suppose a household wants to replace $60,000 a year for 20 years, and decides to test a 4%
            annual rate. Plugging into the formula: r = 0.04, n = 20, PMT = $60,000. First,{" "}
            (1 + 0.04)<sup>−20</sup> works out to about 0.4564. Subtracting that from 1 gives 0.5436.
            Dividing by r (0.04) gives an annuity factor of about 13.59. Multiplying that factor by
            $60,000 in annual income gives a present value of roughly $815,700. Compare that to the raw
            shortcut of $60,000 × 20 years, which is $1,200,000. Investing the money at 4% while it&apos;s
            being drawn down closes nearly $384,000 of that gap. If the same household also wants to add
            $25,000 to cover final expenses and a small remaining debt, the calculator adds that on top
            for a total lump sum need of roughly $840,700.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is entering a rate that&apos;s too optimistic, often because it&apos;s
            borrowed from a long-run stock market average without adjusting for the fact that this money
            needs to be drawn down reliably every year, including years when markets fall. A rate that&apos;s
            too high understates the lump sum actually needed. The opposite mistake is entering nothing
            at all and reading the raw income-times-years total as if it were the recommended coverage
            amount, when it&apos;s really just the unrealistic zero-growth ceiling. A third mistake is
            forgetting that this tool doesn&apos;t separately model inflation, so a rate chosen without
            thinking about rising costs over a 20 or 30 year horizon can understate what future years of
            income will actually cost to replace.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes payments happen once a year, at the end of the year, which is the
            standard ordinary annuity convention and a reasonable approximation for planning purposes
            even though real spending happens continuously. It assumes a constant rate of return every
            single year, when real investment returns vary year to year and can be negative in a given
            year even if the long-run average is positive. It does not model taxes on investment
            earnings, sequence-of-returns risk, or a step-up or step-down in the income amount over time.
            It does not separately model inflation; if that matters to you, use a rate that already
            reflects your expected return net of inflation. None of this is a guarantee of any particular
            investment outcome, and this tool does not recommend an insurance coverage amount, a
            specific policy, or an investment strategy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terminology Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Present value</strong> — the amount of money today that is equivalent to a series
              of future payments, once you account for the fact that money can be invested and grow over
              time.
            </li>
            <li>
              <strong>Discount rate</strong> — the assumed annual rate of return used to calculate
              present value; a higher discount rate produces a lower present value, since the money is
              assumed to grow faster while it&apos;s being drawn down.
            </li>
            <li>
              <strong>Annuity</strong> — a series of equal payments made at regular intervals; this
              calculator treats years of replaced income as an ordinary annuity paid annually.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how insurers and financial educators think about sizing income replacement
            coverage, the{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes consumer guidance on life insurance needs analysis, and the{" "}
            <a
              href="https://content.naic.org/consumer/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            explains how life insurance policies work more broadly. For the present-value math itself,
            the U.S. Securities and Exchange Commission&apos;s investor education site,{" "}
            <a
              href="https://www.investor.gov/introduction-investing/investing-basics/glossary/present-value"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Investor.gov
            </a>
            , defines present value and how a discount rate is applied to it. Before buying coverage
            based on any figure from this page, a licensed insurance agent or financial professional can
            help you choose an appropriate rate and confirm the final number.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. For a broader coverage estimate that also factors in debts and savings, try the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            or the{" "}
            <Link href="/tools/life/dime-method-calculator" className="text-blue-600 hover:underline">
              DIME method calculator
            </Link>
            . Once you have a coverage amount in mind, the{" "}
            <Link href="/tools/life/term-length-calculator" className="text-blue-600 hover:underline">
              term length calculator
            </Link>{" "}
            can help you think through how many years of coverage to actually buy.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific numbers that come up
            when planning insurance coverage, from present-value math like this to claims, deductibles,
            and everyday coverage decisions. Nothing you type is stored or sent anywhere; every result
            here is meant to be a starting point you bring into a conversation with a licensed
            professional, not a final answer.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { TermLengthCalculatorTool } from "@/components/tools/TermLengthCalculatorTool";
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

const tool = getToolBySlug("term-length-calculator")!;

const TITLE = "Term Life Insurance Length Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this term life insurance length calculator to compare your mortgage payoff, your kids' ages, and your retirement date, then get a recommended term length.";
const PAGE_URL = `${SITE_URL}/tools/life/term-length-calculator`;

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
    question: "Why doesn't this tool just tell everyone to buy a 20-year term?",
    answer:
      "Because a flat recommendation would be right for some households and wrong for others. A 20-year term leaves a 34-year-old with a newborn and a 28-year mortgage exposed for years after the policy expires, while it leaves a 50-year-old with a paid-off house and grown kids paying for coverage they no longer need. This calculator instead works out how many years you actually need protection for, based on your own mortgage, your own children's ages, and your own retirement timeline, and recommends covering the longest of those.",
  },
  {
    question: "My mortgage, my kids, and my retirement horizon all point to different numbers. Which one wins?",
    answer:
      "The calculator recommends covering the longest of the horizons you select, since a policy that ends after your mortgage is paid off but before your youngest child is financially independent would leave a real gap. It's not double-counting the shorter horizons — one policy sized to the longest need also covers the shorter ones along the way. If the gap between your shortest and longest horizon is large, some households instead ladder two smaller policies at different lengths to save on premium; that's a conversation worth having with a licensed agent.",
  },
  {
    question: "Why round up to 10, 15, 20, 25, or 30 years instead of giving me an exact number?",
    answer:
      "Because that's genuinely how term life insurance is sold. Term policies are underwritten and priced in standardized lengths, and 10, 15, 20, 25, and 30 years are the lengths most carriers offer as a stock product. If your calculated need comes out to 24 years, there typically isn't a 24-year term to buy — you'd round up to the nearest length that fully covers the period, which is 25 years in that example. This calculator applies that same rounding automatically so the number it gives you is one you can actually shop for.",
  },
  {
    question: "What if my longest horizon is more than 30 years?",
    answer:
      "Single-policy term lengths beyond 30 years aren't a standard offering from most term life insurers. When your entered numbers add up to more than 30 years, the calculator flags it and caps the recommendation at 30, since that's the longest commonly sold length. In that situation, ask a licensed agent about laddering two policies of different lengths stacked together, or whether covering part of the need with a permanent policy makes sense for your household.",
  },
  {
    question: "What actually goes wrong if I buy a term that's too short?",
    answer:
      "The policy simply expires while the need it was covering is still there — a mortgage still outstanding, a teenager still years from finishing school, or a decade still left before retirement. Buying new coverage at that point means requalifying at an older age, and premiums for a new term policy climb steeply with age; a health change in the intervening years can also mean a much higher rate or, in some cases, being declined outright. Sizing the term to the full horizon up front avoids having to shop for replacement coverage at the worst possible time to be shopping for it.",
  },
  {
    question: "Does this calculator factor in how much coverage I need, not just how long?",
    answer:
      "No — this tool answers the length question only. For the separate question of how large a death benefit to buy, the site's life insurance needs calculator and DIME method calculator both walk through that math using your income, debts, and dependents.",
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

export default function TermLengthCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Term Life Insurance Length Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Skip the generic &ldquo;buy a 20-year term&rdquo; advice. Enter your mortgage, your
            children&apos;s ages, and your retirement plans, and see exactly which years of your life
            actually need to be covered.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <TermLengthCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-term-length-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Term Life Insurance Length Calculator Actually Recommends
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most &ldquo;how long should my term life insurance be&rdquo; content online lands on a
            single generic answer, usually 20 years, because it&apos;s the most commonly purchased
            length rather than because it fits every household. Term length isn&apos;t really a single
            question — it&apos;s shorthand for &ldquo;how many years from now would my family still be
            financially exposed if I weren&apos;t here to keep paying the mortgage, raising the kids, or
            earning a paycheck.&rdquo; Those are three separate clocks, and they rarely read the same
            number. This calculator treats them separately: it works out how many years remain on your
            mortgage, how many years until your youngest child reaches an age you choose, and how many
            years until your planned retirement, then recommends covering whichever of those runs the
            longest, since a policy sized to the shortest of the three would let the others lapse
            uncovered.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone comparing term life insurance quotes and staring at a dropdown
            of 10, 15, 20, 25, and 30-year options without a clear reason to pick one over another. It&apos;s
            especially useful for parents deciding whether the term needs to run past a child&apos;s
            college years, homeowners who want coverage to at least outlast the mortgage, and anyone
            weighing whether to time a policy&apos;s end date around retirement, when income (and the
            need to replace it) typically drops. If you haven&apos;t yet worked out how much coverage to
            buy, only how long it should run, that&apos;s a separate calculation the site&apos;s{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            handles.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How Each Horizon Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The mortgage horizon is simply the number of years you enter as remaining on your loan — the
            calculator doesn&apos;t recompute an amortization schedule, so use your most recent
            statement or servicer portal for an accurate figure. The child-independence horizon subtracts
            your youngest child&apos;s current age from an independence age you choose, defaulting to
            18 but adjustable if you&apos;re planning to support them through college or another
            milestone. The retirement horizon subtracts your current age from your planned retirement
            age, on the reasoning that the financial need for a large death benefit typically eases once
            earned income stops and retirement savings or a pension take over. Once all three horizons
            are calculated, the calculator takes the longest one you&apos;ve selected and rounds it up to
            the nearest term length insurers commonly sell as a standard product — 10, 15, 20, 25, or 30
            years — because that&apos;s the actual menu of choices you&apos;ll see on a real application,
            not an arbitrary number of years.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a 39-year-old with 24 years left on their mortgage, a 7-year-old child they want
            covered through age 18, and a planned retirement at 65. The mortgage horizon is 24 years. The
            child horizon is 11 years (18 minus 7). The retirement horizon is 26 years (65 minus 39). The
            longest of the three is the 26-year retirement horizon, not the mortgage, which is easy to
            overlook if you only think about term length in terms of the house. Twenty-six years doesn&apos;t
            match any standard term length, so the calculator rounds up to the next one available, a
            30-year term, rather than the 25-year term that would fall two years short of the actual
            need. That extra buffer matters: a policy that expired at year 25 would leave this person
            uncovered for their last year before retirement, precisely when replacing income for a
            surviving spouse would still matter most.
          </p>

          <AdInArticle slot="tool-term-length-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Most Common Mistake: Choosing a Term That&apos;s Too Short
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most expensive mistake in term length planning isn&apos;t buying too much
            coverage — it&apos;s buying a term that expires before the need does. A 20-year term bought
            at 32 to cover a newborn runs out at 52, years before that child is done needing support and
            potentially while a mortgage is still outstanding. When the policy lapses, replacing it means
            re-applying at an older age, and premiums for a new term policy rise substantially with age
            even before accounting for any health changes in the intervening years; a diagnosis picked up
            in a routine physical during those two decades can mean a sharply higher rate class or, in
            some cases, no longer qualifying for coverage at standard pricing at all. Sizing the term to
            the longest real horizon up front, even if it costs a little more in year one, is
            substantially cheaper than being forced to requalify in your fifties or sixties.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator only answers the length question — it does not estimate how much coverage to
            buy, and it does not know your health, your budget, or how a specific insurer prices each
            available term length. The mortgage horizon assumes the number of years you enter is
            accurate as of today; refinancing or an extra-payment plan will change it. The retirement
            horizon assumes your plans don&apos;t shift, which is a reasonable planning assumption but
            not a guarantee, and it treats retirement as the point coverage needs ease, which may not fit
            every household&apos;s finances. None of the three horizons account for a second income
            earner, existing coverage you already hold, or non-financial dependents such as a family
            member with a disability. Treat the recommended length as a starting point for a conversation
            with a licensed life insurance agent, who can confirm exactly which term lengths, riders, and
            pricing are available to you.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Term Life Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Level term</strong> — a term policy whose death benefit and premium stay fixed for
              the entire length of the term, so a 30-year level term costs the same in year one as it
              does in year thirty. Nearly all term policies sold today are level term.
            </li>
            <li>
              <strong>Renewable term</strong> — a policy feature that lets you continue coverage after
              the term ends without a new medical exam, usually at a substantially higher premium tied to
              your age at renewal. It guarantees you can keep coverage, but not at the original price.
            </li>
            <li>
              <strong>Convertible term</strong> — a policy feature that lets you convert some or all of a
              term policy into a permanent policy before the term ends, without new medical underwriting.
              It&apos;s the main way to lock in insurability if health changes during the term.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how term and permanent life insurance differ, the{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            outlines common approaches to sizing and structuring coverage, and the{" "}
            <a
              href="https://content.naic.org/consumer/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on how term policies, riders, and conversion features work. The{" "}
            <a
              href="https://www.acli.com/posting-topics/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              American Council of Life Insurers
            </a>{" "}
            tracks industry data on how American households buy and hold life insurance coverage. Before
            buying or changing a policy, confirm exact term lengths, pricing, and underwriting rules with
            your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or a licensed agent. None of these organizations endorse this calculator or its results.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator lives in the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            section. Once you have a term length in mind, the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            works out how large a death benefit to pair with it, the{" "}
            <Link href="/tools/life/mortgage-protection-calculator" className="text-blue-600 hover:underline">
              mortgage protection calculator
            </Link>{" "}
            focuses specifically on the mortgage-payoff horizon used here, and the{" "}
            <Link href="/tools/life/term-vs-whole-life-cost-calculator" className="text-blue-600 hover:underline">
              term vs. whole life cost calculator
            </Link>{" "}
            compares what a term policy at this length costs against a permanent alternative.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific decisions insurance
            shopping actually hinges on, like how long a term policy should run or how much coverage it
            should carry, so you can arrive at an agent conversation already knowing your own numbers.
            Every calculator runs locally in your browser and keeps nothing you type.
          </p>
        </section>
      </div>
    </>
  );
}

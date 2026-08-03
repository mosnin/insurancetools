import type { Metadata } from "next";
import Link from "next/link";
import { CoverageGapCalculatorTool } from "@/components/tools/CoverageGapCalculatorTool";
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

const tool = getToolBySlug("coverage-gap-calculator")!;

const TITLE = "Coverage Gap Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this coverage gap calculator to compare current vs. needed limits across home, auto, life, and umbrella policies, then see which shortfall is largest.";
const PAGE_URL = `${SITE_URL}/tools/coverage/coverage-gap-calculator`;

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
    question: "Does this coverage gap calculator tell me how much insurance I need?",
    answer:
      "No, and that's deliberate. Figuring out a needed amount requires different math for every line of coverage, dwelling replacement cost for a home, an income and debt analysis for life insurance, an asset-protection method for auto liability. This tool only compares the needed figure you already worked out, ideally using this site's dwelling, auto, life, or umbrella calculators, against what you currently carry. Feed it a guessed number and it will still produce a gap, but that gap is only as reliable as the guess.",
  },
  {
    question: "What counts as a coverage gap versus a coverage surplus?",
    answer:
      "A gap is any category where your current limit is lower than the needed amount you entered; the calculator shows it as a negative dollar figure and a percentage shortfall. A surplus is the opposite, current coverage above the needed amount, shown as a positive figure. Neither label is automatically good or bad on its own; a surplus might mean you're paying for coverage you don't need, or it might reflect a conservative needs calculation you're comfortable with.",
  },
  {
    question: "Why does the calculator rank gaps by dollar amount instead of percentage?",
    answer:
      "A 100% gap on a category that only needs $50,000 of coverage is a smaller real-world problem than a 20% gap on a $1,000,000 umbrella limit. Ranking by dollar amount surfaces the shortfall that would actually hurt the most in a real claim or lawsuit, which is usually the more useful place to focus a limited insurance budget first. The tool still shows the percentage next to each result so you can see both angles.",
  },
  {
    question: "I only have needed amounts for two of the four categories. Can I still use this?",
    answer:
      "Yes. Uncheck any category you haven't worked out yet and the calculator ignores it entirely, both in the ranked list and in the total underinsurance figure. Come back and check it once you've run the matching calculator for that line of coverage.",
  },
  {
    question: "Does a large total gap mean I'm in immediate financial danger?",
    answer:
      "It means the coverage you currently carry is lower than the amount your own inputs say you need, nothing more and nothing less. Whether that gap represents urgent risk depends on your circumstances, how likely a large loss is, how quickly you could self-insure part of it, and what a licensed agent says about closing it. Treat the ranked list as a prioritized conversation starter with an agent, not a verdict.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Coverage Tools", href: "/tools/coverage" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function CoverageGapCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Coverage Gap Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Compare what you currently carry against what you actually need across home, auto, life, and
            umbrella coverage, then see which shortfall is largest in dollar terms. Free, instant, and it
            never asks who you are.
          </p>
          <LastUpdated category="coverage" />
        </div>

        <div className="mt-2">
          <CoverageGapCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-coverage-gap-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What a Coverage Gap Actually Is</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A coverage gap is simply the difference between the limit you currently carry on a policy and
            the limit an honest needs analysis says you should carry. It sounds obvious stated that way,
            but most people never actually run that comparison, because their current limit and their
            needed limit live in two different places: a declarations page in a drawer and a calculation
            nobody has done yet. This coverage gap calculator exists to put both numbers side by side, once
            you have them, across the four lines of coverage where an underinsured gap tends to be
            expensive: home dwelling coverage, auto liability, life insurance, and umbrella liability.
            Health insurance, renters, and pet coverage gaps behave differently enough, driven by plan
            design rather than a single dollar limit, that they are handled by their own tools instead of
            being forced into this one.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool, and When</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the second step of a coverage review, not the first. The first step is
            running the dedicated calculator for each line you want to check: the{" "}
            <Link href="/tools/home/dwelling-coverage-calculator" className="text-blue-600 hover:underline">
              Dwelling Coverage Calculator
            </Link>{" "}
            for your home, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              Car Insurance Coverage Calculator
            </Link>{" "}
            for auto liability, the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              Life Insurance Needs Calculator
            </Link>{" "}
            for life insurance, and the{" "}
            <Link href="/tools/coverage/umbrella-policy-need-calculator" className="text-blue-600 hover:underline">
              Umbrella Policy Need Calculator
            </Link>{" "}
            for excess liability. Once you have a needed figure from any of those, come back here, enter it
            alongside your current limit, and let the calculator tell you how large the gap is and how it
            stacks up against your other policies. If you skip that first step and type in a guessed
            &ldquo;needed&rdquo; number instead, the tool will still run the math, but the result is only as
            trustworthy as the guess feeding it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Gap Ranking Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            For each category you enable, the calculator subtracts your current limit from your needed
            limit. A positive result is a gap, coverage you don&apos;t yet have; a negative result is a
            surplus, coverage above what your own analysis calls for. It also expresses that gap as a
            percentage of the needed amount, since a $50,000 shortfall means something different on a
            $100,000 policy than it does on a $1,000,000 one. The four categories are then sorted by dollar
            gap, largest first, which is the ranking shown in the results panel. That ordering is
            intentional: a smaller-percentage gap on a very large policy can represent more real dollars at
            risk than a large-percentage gap on a small one, and dollars at risk in an actual loss or
            lawsuit are what ultimately matter, not the percentage alone. The total underinsurance figure
            at the top of the results simply adds up every positive gap across your selected categories, so
            you have one number for how much shortfall exists across your whole coverage picture.
          </p>

          <AdInArticle slot="tool-coverage-gap-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Multi-Line Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a homeowner who has already run the other calculators on this site and come away with
            four needed figures. Their home&apos;s dwelling coverage should be $340,000, but their policy
            currently lists $280,000, a $60,000 gap, about 18% short. Their auto liability needs analysis
            recommended $300,000 in combined liability limits, but they&apos;re currently carrying only
            $100,000, a $200,000 gap, roughly 67% short. Their life insurance needs analysis called for a
            $750,000 death benefit against employer coverage of $250,000, a $500,000 gap, also about 67%
            short. And they haven&apos;t bought an umbrella policy at all, against a calculated need of
            $1,000,000, a full $1,000,000 gap. Entering all four into this calculator produces a ranked
            list with umbrella first ($1,000,000), life insurance second ($500,000), auto liability third
            ($200,000), and dwelling coverage last ($60,000), for a total of $1,760,000 in underinsurance
            across the four lines. That ranking, not the raw percentages, is what tells this homeowner
            where a limited insurance budget should go first.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is comparing current coverage against a guessed or rounded
            needed amount instead of one built from an actual calculation, which produces a gap number that
            looks precise but rests on nothing. A close second is fixating on whichever policy has the
            largest percentage gap rather than the largest dollar gap, which can lead someone to spend their
            first renewal cycle fixing a small policy while a much larger dollar exposure sits untouched. A
            third is treating a surplus as automatically wasteful and cutting coverage to match the needed
            figure exactly, without accounting for the fact that every needs calculation carries its own
            assumptions and margin for error.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator performs one operation only: subtraction and ranking of the numbers you enter.
            It does not verify that your &ldquo;needed&rdquo; figures were calculated correctly, does not
            know your state&apos;s minimum requirements, does not account for coinsurance penalties, policy
            exclusions, or underwriting limits that might cap how much coverage you can actually buy in a
            category, and does not consider how a gap in one policy might already be partially offset by
            another, such as an umbrella policy extending both auto and home liability at once. It also
            treats every category equally in its dollar ranking, even though the practical urgency of a
            gap depends on how likely that specific loss is for your situation. Use the ranked list as a
            starting point for a conversation with a licensed insurance agent, not as a final purchasing
            decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Coverage gap</strong> — the dollar difference between the coverage limit you
              currently carry and the limit a proper needs analysis says you should carry, with the current
              limit falling short.
            </li>
            <li>
              <strong>Underinsurance</strong> — the broader condition of carrying less coverage than your
              actual risk calls for, which a coverage gap in one or more categories is direct evidence of.
            </li>
            <li>
              <strong>Insurance-to-value ratio</strong> — most commonly used for dwelling coverage, this is
              your current coverage limit divided by your home&apos;s full replacement cost; a ratio well
              below 100% is one specific form of the same shortfall this tool measures across other lines
              of coverage.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how each category&apos;s coverage is defined, the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance covering most personal lines, and the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains dwelling coverage and insurance-to-value in more depth. For life insurance needs
            methodology specifically, see the Institute&apos;s{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              guidance on how much life insurance to buy
            </a>
            . Before changing any policy limit, confirm your state&apos;s specific rules with your{" "}
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
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              Coverage calculators
            </Link>{" "}
            category. Before using it, run the{" "}
            <Link href="/tools/home/dwelling-coverage-calculator" className="text-blue-600 hover:underline">
              Dwelling Coverage Calculator
            </Link>
            , the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              Life Insurance Needs Calculator
            </Link>
            , or the{" "}
            <Link href="/tools/coverage/umbrella-policy-need-calculator" className="text-blue-600 hover:underline">
              Umbrella Policy Need Calculator
            </Link>{" "}
            to get a needed figure for the category you care about most.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that walk through one specific insurance
            question at a time, run entirely in your browser, keep nothing you type, and are designed to
            leave you with numbers worth bringing into a real conversation with a licensed agent.
          </p>
        </section>
      </div>
    </>
  );
}

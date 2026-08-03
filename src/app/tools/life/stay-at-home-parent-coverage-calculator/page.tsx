import type { Metadata } from "next";
import Link from "next/link";
import { StayAtHomeParentCoverageCalculatorTool } from "@/components/tools/StayAtHomeParentCoverageCalculatorTool";
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

const tool = getToolBySlug("stay-at-home-parent-coverage-calculator")!;

const TITLE = "Stay-at-Home Parent Life Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this stay at home parent life insurance calculator to price the replacement cost of childcare, housekeeping, and other unpaid work at rates you choose.";
const PAGE_URL = `${SITE_URL}/tools/life/stay-at-home-parent-coverage-calculator`;

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
    question: "Does a stay-at-home parent need life insurance?",
    answer:
      "Usually yes, even though they don't bring home a paycheck. If that parent died, the surviving spouse would typically have to pay for childcare, housekeeping, meal preparation, transportation, and tutoring that the stay-at-home parent previously handled unpaid, often while also grieving and adjusting a work schedule. This calculator estimates what those services would cost to replace so that gap doesn't get discovered for the first time during an emergency.",
  },
  {
    question: "Where do the hourly rates in this calculator come from?",
    answer:
      "You enter them yourself. This tool intentionally does not supply a default wage, because childcare, cleaning, and similar rates vary hugely by region and by who is actually available to hire nearby. For a data-backed starting point, the Bureau of Labor Statistics Occupational Employment and Wage Statistics program publishes median hourly wages by metro area for comparable paid roles, such as childcare workers and housekeeping cleaners.",
  },
  {
    question: "Should the coverage amount just equal the total from this calculator?",
    answer:
      "Treat the total as one input into a broader life insurance need, not the whole answer. A full needs analysis typically also weighs outstanding debt, a mortgage, college savings goals, and final expenses. If the stay-at-home parent has any part-time or freelance income, that should be evaluated separately as well, since this tool only prices unpaid household and caregiving labor.",
  },
  {
    question: "Why does the tool let me choose a blended rate or a rate per task?",
    answer:
      "Some tasks genuinely cost more to hire out than others; a licensed childcare provider's hourly rate and a house cleaner's hourly rate are rarely the same number. The per-task option gives a more accurate total when you know roughly what each service costs locally. The blended option is faster to fill out and still produces a reasonable estimate when you'd rather use one all-purpose number.",
  },
  {
    question: "How many years of coverage should I plan for?",
    answer:
      "There's no single correct answer, which is why this field is editable rather than fixed. Many families plan coverage until their youngest child no longer needs full-time care and supervision, or until the surviving spouse could realistically restructure work and household routines around the loss. Some choose a shorter window if they expect to remarry, downsize care needs, or lean on family support; others choose longer. Adjust the years field to match your own plan.",
  },
  {
    question: "Does this replace a full life insurance needs calculation for the working spouse?",
    answer:
      "No. This tool is specifically for pricing the replacement cost of a stay-at-home or primarily at-home parent's unpaid labor. The working spouse's own life insurance need is a separate calculation built around income replacement, debt, and future obligations. Insurance Tools' life insurance needs calculator is built for that side of the picture.",
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

export default function StayAtHomeParentCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Stay-at-Home Parent Life Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Price out what it would actually cost to replace a stay-at-home parent&apos;s unpaid
            work, hour by hour, at rates you choose. No account, no fabricated wage defaults.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <StayAtHomeParentCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-stay-at-home-parent-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Coverage Gap Behind &ldquo;They Don&apos;t Earn a Paycheck&rdquo;
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Life insurance shopping conversations tend to start and stop with income replacement,
            which quietly writes the stay-at-home parent out of the picture: no paycheck, the
            reasoning goes, so nothing to replace. That logic misses what actually happens the
            week after a stay-at-home parent dies. Childcare has to be hired, or a working parent
            has to cut hours or leave a job to cover it. Meals, laundry, school pickups, and
            homework help don&apos;t stop needing to happen; they just stop being free. This
            stay-at-home parent life insurance calculator exists to put a number on that gap
            before it becomes a crisis-mode phone call to childcare agencies and cleaning
            services.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator is built for the parent who handles the bulk of childcare and
            household management without a separate paycheck, and for the working spouse trying
            to size a policy for them. It also works for a primarily at-home parent who has some
            part-time income, since the calculator only prices the unpaid labor side; any earned
            income should be evaluated separately with an income-replacement approach. If both
            parents work full time and split household duties fairly evenly, a smaller, more
            targeted version of this same logic, run for whichever tasks fall disproportionately
            on one parent, can still be useful.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Replacement Value Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The method is a straightforward replacement-cost calculation, one commonly used by
            financial planners for valuing unpaid household labor. You enter the weekly hours
            spent on five task categories: childcare, housekeeping, meal preparation,
            transportation and errands, and tutoring or homework help. You then supply an hourly
            rate, either one blended rate applied across every hour or a separate rate for each
            task. The calculator multiplies hours by rate to get a weekly replacement value,
            multiplies that by 52 for an annual figure, and multiplies the annual figure by
            however many years of coverage you want to plan for to produce a total suggested
            coverage amount.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Deliberately absent from that formula is any built-in dollar rate. Childcare, cleaning,
            and comparable services cost meaningfully different amounts in a rural county than in
            a major metro area, and using a single nationwide number would either overstate or
            understate the real cost for most users. If you want a data-backed starting point
            rather than a guess, the Bureau of Labor Statistics&apos; Occupational Employment and
            Wage Statistics program publishes median hourly wages by metro area for the closest
            paid equivalents, such as childcare workers and maids and housekeeping cleaners.
          </p>

          <AdInArticle slot="tool-stay-at-home-parent-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a parent home with two school-age children who spends roughly 30 hours a week
            on childcare, 10 hours on housekeeping, 7 hours on meal preparation, 8 hours on
            transportation and errands, and 5 hours on tutoring and homework help, for 60 total
            weekly hours. Using a blended rate of $20 per hour based on local childcare and
            house-cleaning listings the family checked, the weekly replacement value comes to
            $1,200, or $62,400 a year. Planning for 8 years, roughly until the younger child no
            longer needs after-school supervision, produces a suggested coverage figure of
            $499,200. That number then becomes one input the family brings into a broader
            conversation with a licensed agent about total policy size, alongside any mortgage
            balance, other debt, and college savings goals.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is assuming a non-earning parent doesn&apos;t need
            coverage at all, simply because there&apos;s no income to replace on a pay stub. A close
            second is using a single nationwide average rate pulled from a headline statistic
            instead of checking what childcare and cleaning services actually cost locally, which
            can understate the real gap by a wide margin in higher cost-of-living areas. A third
            is treating the total from this calculator as a complete life insurance need on its
            own, when it&apos;s really one component that still needs to be combined with debt,
            future goals, and the working spouse&apos;s own coverage picture.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the tasks and hours you enter reasonably reflect a typical
            week, and that the rate you supply reflects what it would actually cost to hire
            equivalent help in your area. It does not know your family&apos;s actual finances, debt,
            savings, or the working spouse&apos;s income, and it does not attempt a full
            income-replacement or needs-analysis calculation. It also does not account for the
            practical reality that one hired provider rarely covers every task equally well;
            families sometimes end up paying for multiple specialized services to replace the
            work of one flexible stay-at-home parent, which this simplified model doesn&apos;t
            capture. Treat the output as a planning estimate to bring into a conversation with a
            licensed insurance agent or financial professional, not a guaranteed or final coverage
            figure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Replacement-cost method</strong> — valuing unpaid labor by what it would
              cost to hire someone else to perform the same tasks, rather than by any wage the
              person themselves was paid.
            </li>
            <li>
              <strong>Income replacement</strong> — the separate life insurance approach that
              sizes coverage to replace a working person&apos;s actual lost paycheck, used for the
              earning spouse rather than for unpaid household labor.
            </li>
            <li>
              <strong>Needs analysis</strong> — a fuller life insurance calculation that combines
              income replacement, debt payoff, future expenses like college, and final expenses
              into one total coverage recommendation.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For regional wage data to use as a starting rate, the{" "}
            <a
              href="https://www.bls.gov/oes/current/oes_stru.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Bureau of Labor Statistics Occupational Employment and Wage Statistics program
            </a>{" "}
            publishes median hourly wages by metro area for childcare workers, housekeeping
            cleaners, and other comparable roles. The{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how income replacement and needs-analysis methods fit into an overall life
            insurance decision, and the{" "}
            <a
              href="https://content.naic.org/consumer/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on life insurance policy types and terminology.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. To size coverage for the working spouse&apos;s own income, pair this with the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>
            . If final expenses and funeral costs also need to be planned for, the{" "}
            <Link href="/tools/life/funeral-final-expense-calculator" className="text-blue-600 hover:underline">
              funeral and final expense calculator
            </Link>{" "}
            covers that piece separately.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for coverage, cost, and claims
            questions across every major insurance category. Each tool runs entirely in your
            browser, collects nothing beyond the numbers you type in, and aims to leave you with a
            clearer, better-informed starting point for a conversation with a licensed
            professional.
          </p>
        </section>
      </div>
    </>
  );
}

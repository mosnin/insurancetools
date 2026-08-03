import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { HsaSavingsCalculatorTool } from "@/components/tools/HsaSavingsCalculatorTool";
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
 * Local tool descriptor used only for structured data and metadata on this
 * page. The site-wide tool registry (src/lib/tools.ts) is integrated
 * centrally by a separate process, so this page does not depend on it.
 */
const tool: Tool = {
  slug: "hsa-savings-calculator",
  name: "HSA Savings Calculator",
  description:
    "Project how a health savings account balance could grow over time from a starting balance, annual contributions, and an investment return you choose, plus estimated tax savings on contributions.",
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
};

const TITLE = "HSA Savings Calculator & Growth Projector | Insurance Tools";
const DESCRIPTION =
  "Use this HSA savings calculator to project how your health savings account balance could grow with compounding, plus estimated tax savings on contributions.";
const PAGE_URL = `${SITE_URL}/tools/health/hsa-savings-calculator`;

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
    question: "Do I need to be enrolled in an HDHP to contribute to an HSA?",
    answer:
      "Yes. Federal rules only let you open and contribute to a health savings account while you're enrolled in an HSA-eligible high-deductible health plan (HDHP) and have no disqualifying other coverage. This calculator projects growth on whatever balance and contribution amount you enter, but it doesn't check your plan's eligibility for you — confirm your HDHP qualifies before contributing further, since ineligible contributions can trigger tax penalties.",
  },
  {
    question: "What happens to money left in my HSA at the end of the year?",
    answer:
      "It stays yours and keeps growing. Unlike a flexible spending account (FSA), which is generally use-it-or-lose-it each plan year with only a small optional carryover or grace period an employer may allow, an HSA has no year-end forfeiture rule at all. The full balance rolls over indefinitely, which is exactly why this calculator can project growth over decades instead of a single plan year.",
  },
  {
    question: "Why doesn't this calculator assume a typical investment return for me?",
    answer:
      "Because there isn't one honest number to assume. HSA funds can sit in cash or be invested, usually once the balance clears an administrator's investment threshold, and actual returns depend entirely on what you invest in and how markets perform over your specific time horizon. Rather than quote a market average that may not apply to your account, this tool asks you to enter the return you want to model, so the projection reflects your own assumption rather than a manufactured one.",
  },
  {
    question: "How is the year-end balance in the table actually calculated?",
    answer:
      "Each year, the running balance is multiplied by one plus your entered return rate, then your annual contribution is added, the same future-value-of-an-annuity approach used for other tax-advantaged retirement accounts. The table shows every fifth year plus the first and final year so you can see the compounding curve without scrolling through every single year when you've projected a long time horizon.",
  },
  {
    question: "Does this tool check my contribution against the IRS annual HSA limit?",
    answer:
      "No, deliberately. The IRS sets and adjusts HSA contribution limits annually, and printing a specific figure here risks it going stale the moment the IRS updates it. Check your current limit directly at IRS Publication 969 or with your HSA administrator before finalizing how much you contribute this year, then bring that confirmed number back to this calculator.",
  },
  {
    question: "Is the tax savings estimate the same as my actual tax refund?",
    answer:
      "No. The estimate multiplies your contribution by the marginal tax rate you enter to approximate the value of reducing your taxable income, which is one of an HSA's three tax advantages. Your actual tax outcome depends on your full return, whether contributions come pre-tax through payroll or as an above-the-line deduction you claim yourself, state tax treatment (a few states tax HSA contributions or growth), and other factors this simplified estimate doesn't model.",
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

export default function HsaSavingsCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            HSA Savings Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See how a health savings account balance could compound over the years you choose, using
            your own contribution amount and your own return assumption. No sign-up, no stale IRS
            limits baked in, just your numbers.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <HsaSavingsCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-hsa-savings-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What an HSA Is and Why This HSA Savings Calculator Matters
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A health savings account (HSA) is a tax-advantaged account available only to people
            enrolled in an HSA-eligible high-deductible health plan (HDHP). It&apos;s built around
            what&apos;s often called the triple tax advantage: contributions go in pre-tax or as a tax deduction,
            the balance grows tax-free while invested, and withdrawals for qualified medical expenses
            come out tax-free too. No other common account structure stacks all three benefits at once,
            which is exactly why the growth this HSA savings calculator projects looks different from a
            standard taxable savings account holding the same dollar amounts. Most people open an HSA to
            cover near-term deductibles and copays, then forget it can also compound for years as a
            long-horizon health-cost or even retirement asset, and this tool exists to make that second
            possibility visible.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for anyone currently enrolled in an HSA-eligible HDHP who wants to see where a
            given contribution level leads, whether that&apos;s someone deciding how much to contribute
            during open enrollment, someone weighing whether to invest an HSA balance instead of leaving
            it in cash, or someone comparing an HSA against a traditional PPO plan&apos;s total cost. It
            isn&apos;t useful if you&apos;re not HDHP-enrolled, since federal rules only allow HSA
            contributions during HDHP coverage; if you&apos;re weighing whether an HDHP makes sense for
            your situation in the first place, that&apos;s a separate decision the plan comparison tool
            linked below is built to help with.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Projection Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts with your current balance and, for each year you project forward,
            multiplies the running balance by one plus your entered annual return, then adds your
            annual contribution. That&apos;s the standard future-value approach for a balance that
            compounds while receiving level annual deposits, the same underlying math used for
            retirement account projections. Total contributed and estimated growth are then reported
            separately so you can see how much of the final balance came from your own deposits versus
            compounding. If you enter a marginal tax rate, the tool separately multiplies your annual
            contribution by that rate to estimate the value of the pre-tax contribution benefit, shown
            both per year and summed across the years you&apos;re projecting.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Deliberately absent from this calculation is any assumed market return or any specific
            current-year IRS contribution limit. Investment returns are not guaranteed and vary
            enormously by what the HSA is invested in, so the tool asks you to supply the return you
            want to model rather than presenting a number as if it were reliable. Likewise, the IRS
            adjusts HSA contribution limits annually, so this page doesn&apos;t print a figure that would go
            out of date; check your current limit at IRS Publication 969, linked below, before you
            finalize a contribution amount.
          </p>

          <AdInArticle slot="tool-hsa-savings-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider someone starting with a $3,000 HSA balance who contributes $4,000 a year (their own
            payroll contribution combined with an employer contribution), assumes a 6% annual return
            because that&apos;s the number they&apos;ve chosen to model for their invested balance, and
            projects 20 years forward. Contributing $4,000 annually for 20 years adds $80,000 in
            contributions alone. Compounded at 6% against the starting balance and each year&apos;s
            growing total, the
            projected balance climbs well past that contribution total, since later years compound on a
            much larger base than earlier ones. At a 22% marginal tax rate, that same $4,000 annual
            contribution also represents roughly $880 a year in estimated tax savings, or about $17,600
            across the 20 years of contributions, on top of whatever the balance itself grows to. None of
            these figures are guarantees; they show what a specific, user-chosen assumption produces so
            it can be compared against alternatives.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is contributing to an HSA without confirming HDHP eligibility for
            every month those contributions apply to, which can create excess contributions subject to
            IRS penalties. A close second is leaving the entire HSA balance in a low or zero-interest
            cash sweep account indefinitely instead of investing any portion earmarked for long-term
            use, which is the single biggest reason two people with identical contribution habits end up
            with very different balances decades later. A third is treating an HSA like an FSA and
            rushing to spend down the balance before year end; because HSA funds roll over with no
            forfeiture rule, there&apos;s no year-end deadline pressure at all, and spending down a balance
            that could otherwise compound tax-free is often the more expensive choice.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a level annual contribution and a constant annual return applied
            uniformly across every year projected, which real accounts never do exactly; contributions
            change, and invested balances rise and fall unevenly year to year. It doesn&apos;t verify
            your HDHP eligibility, doesn&apos;t know the current-year IRS contribution limit, doesn&apos;t
            account for HSA administrator fees or investment fund expense ratios, and doesn&apos;t model
            state tax treatment, since a handful of states tax HSA contributions or earnings differently
            than the federal government does. The tax savings estimate is a simplified approximation of
            one benefit among the account&apos;s three tax advantages, not a substitute for running your
            actual
            numbers with a tax professional. Treat every figure here as a planning estimate, not a
            projection you can rely on for a specific financial decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance and Tax Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Health savings account (HSA)</strong> — a tax-advantaged account available only to
              people enrolled in an HSA-eligible high-deductible health plan, used to pay for qualified
              medical expenses.
            </li>
            <li>
              <strong>Triple tax advantage</strong> — the combination of pre-tax or tax-deductible
              contributions, tax-free growth on invested balances, and tax-free withdrawals for
              qualified medical expenses.
            </li>
            <li>
              <strong>Qualified medical expense</strong> — a healthcare cost the IRS allows to be paid
              or reimbursed tax-free from an HSA, such as deductibles, copays, and many other
              out-of-pocket medical costs, as defined in IRS Publication 969.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the full federal rules behind HSA eligibility, contribution limits, and qualified
            expenses, see{" "}
            <a
              href="https://www.irs.gov/publications/p969"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              IRS Publication 969
            </a>
            . For plain-language definitions of the accounts and plans this calculator refers to, the{" "}
            <a
              href="https://www.healthcare.gov/glossary/health-savings-account-hsa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary entry for HSAs
            </a>{" "}
            and its{" "}
            <a
              href="https://www.healthcare.gov/glossary/high-deductible-health-plan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              entry for high-deductible health plans
            </a>{" "}
            are both useful starting points. To understand how an HSA compares to an FSA&apos;s rollover
            rules, see the{" "}
            <a
              href="https://www.healthcare.gov/glossary/flexible-spending-account-fsa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary entry for FSAs
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If you&apos;re still deciding whether an HDHP paired with an HSA makes sense
            compared to a traditional plan, the{" "}
            <Link href="/tools/health/ppo-vs-hdhp-calculator" className="text-blue-600 hover:underline">
              PPO vs. HDHP calculator
            </Link>{" "}
            compares total expected cost across both plan types. Once you know your plan&apos;s
            structure, the{" "}
            <Link
              href="/tools/health/out-of-pocket-maximum-calculator"
              className="text-blue-600 hover:underline"
            >
              out-of-pocket maximum calculator
            </Link>{" "}
            helps you see the most a bad year could cost you, which is useful context for deciding how
            much of your HSA balance to keep liquid versus invest for the long term.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that help people understand their own
            insurance coverage and costs without a sales pitch attached. Every tool runs entirely in your
            browser using only the numbers you type in, and this HSA calculator was built so you can
            compare your own assumptions side by side before deciding how much to contribute or invest.
          </p>
        </section>
      </div>
    </>
  );
}

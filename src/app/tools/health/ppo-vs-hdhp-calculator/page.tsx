import type { Metadata } from "next";
import Link from "next/link";
import { PpoVsHdhpCalculatorTool } from "@/components/tools/PpoVsHdhpCalculatorTool";
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

const tool = getToolBySlug("ppo-vs-hdhp-calculator")!;

const TITLE = "PPO vs. HDHP Calculator: Compare Costs | Insurance Tools";
const DESCRIPTION =
  "Run the PPO vs HDHP calculator to compare total annual cost at your own spending level, then net the HDHP against employer and personal HSA contributions.";
const PAGE_URL = `${SITE_URL}/tools/health/ppo-vs-hdhp-calculator`;

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
    question: "Does the PPO vs HDHP calculator tell me which plan I should pick?",
    answer:
      "It shows which plan is cheaper in total dollars at a spending level you choose, after netting the HDHP against any HSA money, but it doesn't know your doctors' networks, prescription formularies, or how much medical care you'll actually use next year. Run it at a low, moderate, and high spending level to see whether the answer changes, and weigh the dollar difference against network fit before deciding.",
  },
  {
    question: "Why does only the HDHP get an HSA contribution in this calculator?",
    answer:
      "Because that reflects the actual IRS rule: only a high-deductible health plan that meets the IRS's minimum deductible and maximum out-of-pocket thresholds is HSA-eligible (IRS Publication 969). A PPO, even a low-premium one, does not qualify for HSA contributions, though it may pair with a Flexible Spending Account instead, which this calculator does not model since FSA funds typically don't roll over.",
  },
  {
    question: "What is the difference between 'HDHP net of HSA' and 'HDHP effective cost'?",
    answer:
      "“Net of HSA” subtracts your total HSA contributions (employer plus your own) from the HDHP's premium-plus-out-of-pocket total, since that money can be spent directly on the deductible and coinsurance. “Effective cost” goes one step further and also subtracts the tax savings on your own contribution, using the marginal tax rate you enter, since HSA contributions are typically made pre-tax through payroll.",
  },
  {
    question: "Why doesn't the calculator show this year's HSA contribution limit?",
    answer:
      "The IRS updates HSA contribution limits annually and sets separate limits for individual and family coverage, so a number hardcoded into this page would eventually go stale and could understate or overstate what you're allowed to contribute. Enter your own limit from your plan administrator or IRS Publication 969 for the current tax year instead of relying on a fixed figure.",
  },
  {
    question: "What happens if I don't spend all of my HSA contribution this year?",
    answer:
      "Unlike a Flexible Spending Account, an HSA has no use-it-or-lose-it rule. Unused funds roll over indefinitely and can continue to grow, which is why the calculator flags leftover HSA money as banked savings rather than treating it as wasted. For the multi-year growth picture of an HSA balance you don't spend, use the HSA savings calculator linked below.",
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

export default function PpoVsHdhpCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            PPO vs. HDHP Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Compare a PPO and a high-deductible health plan in real dollars at the medical spending level
            you expect, then see how employer and personal HSA money changes the HDHP&apos;s true cost.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <PpoVsHdhpCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-ppo-vs-hdhp-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This PPO vs. HDHP Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Open enrollment usually hands you a side-by-side chart of premiums and deductibles and expects
            you to do the mental math yourself. This PPO vs HDHP calculator does that math for you, at an
            actual spending level rather than in the abstract, and it&apos;s built for anyone facing that choice:
            new hires picking benefits for the first time, employees whose employer just added an HSA seed
            contribution, or a household deciding whether a lower premium is worth a much higher deductible
            once a baby, a surgery, or a chronic condition enters the picture. If you already know you&apos;ll
            barely touch your insurance this year, the answer usually favors the HDHP. If you know you&apos;re
            headed for a high-cost year, the comparison gets more interesting, which is exactly why this
            tool lets you model more than one spending level instead of assuming a single &ldquo;average&rdquo; year.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How HSA Eligibility Changes the Math</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The reason this calculator treats the two plans asymmetrically is a real IRS rule, not a design
            choice: only a health plan that meets the IRS&apos;s minimum annual deductible and maximum
            out-of-pocket thresholds counts as a qualifying high-deductible health plan, and only a
            qualifying HDHP allows you to open and contribute to a Health Savings Account (IRS Publication
            969). A PPO with a lower deductible does not qualify, no matter how the premium compares. That
            asymmetry matters because HSA contributions are typically made pre-tax through payroll,
            meaning every dollar you put in costs you less than a dollar out of pocket once your tax
            bracket is factored in, and the money can be withdrawn tax-free for qualified medical expenses
            at any point, including years after you contributed it. The calculator models this in two
            layers: first it nets your total HSA contributions (employer seed money plus what you
            personally add) against the HDHP&apos;s premium-plus-out-of-pocket total, then, if you enter a
            marginal tax rate, it subtracts the additional tax savings on your own contribution to show an
            effective cost. Neither layer assumes a specific contribution limit for the current year, since
            the IRS updates that figure annually and sets separate limits for individual and family
            coverage; enter your own known limit rather than trust a number baked into a webpage.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a PPO with a $6,000 annual premium, a $1,500 deductible, 20% coinsurance, and a
            $6,000 out-of-pocket maximum, against an HDHP with a $4,200 premium, a $3,300 deductible, the
            same 20% coinsurance, and a $6,900 out-of-pocket maximum. The employer adds $500 to the HSA and
            the employee plans to contribute $2,000 of their own, at a 22% marginal tax rate. Modeled at
            $3,000 of annual medical spending: the PPO&apos;s deductible is met, so the member pays the $1,500
            deductible plus 20% of the remaining $1,500 ($300), for $1,800 out of pocket and a $7,800 total
            cost. The HDHP&apos;s $3,300 deductible isn&apos;t met yet, so the member pays the full $3,000 out of
            pocket, for a $7,200 total cost before HSA money. Netting the $2,500 in combined HSA
            contributions brings the HDHP down to $4,700, and the $440 in tax savings on the personal
            contribution (22% of $2,000) brings the effective cost to $4,260. At this spending level, the
            HDHP comes out about $3,540 cheaper, driven almost entirely by the HSA contributions rather than
            the premium difference alone.
          </p>

          <AdInArticle slot="tool-ppo-vs-hdhp-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is comparing the two plans on premium alone and stopping there, which
            ignores that a lower-premium PPO can still cost more in a moderate spending year once
            out-of-pocket costs are added in. A close second is forgetting to count employer HSA seed money
            as real income; it&apos;s easy to compare &ldquo;my premium plus my HSA contribution&rdquo; against the PPO
            without adding in the employer&apos;s contribution, which understates the HDHP&apos;s actual advantage.
            A third mistake is assuming every high-deductible plan automatically qualifies for an HSA. Some
            plans are marketed as high-deductible without meeting the IRS&apos;s specific thresholds, and
            contributing to an HSA you weren&apos;t actually eligible for can create a tax problem, so eligibility
            is worth confirming on your plan&apos;s summary of benefits, not assumed from the name alone.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the coinsurance percentage you enter applies uniformly to spending above
            the deductible up to the out-of-pocket maximum, which is a simplification; real plans often
            carve out flat copays for office visits or prescriptions that don&apos;t follow the deductible and
            coinsurance structure exactly. It does not model network size, drug formularies, referral
            requirements, or an FSA alternative for the PPO side. It does not verify HSA eligibility or look
            up a current contribution limit, both of which depend on your specific plan design and coverage
            tier and should be confirmed directly with your plan administrator or IRS Publication 969.
            Treat every result here as a planning estimate to bring into open enrollment, not a guarantee of
            what either plan will actually cost you.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>HDHP (high-deductible health plan)</strong> — a health plan with a deductible and
              out-of-pocket maximum at or above IRS-set minimums, which is the qualifying requirement for
              HSA eligibility.
            </li>
            <li>
              <strong>HSA (Health Savings Account)</strong> — a tax-advantaged account available only to
              people enrolled in a qualifying HDHP, funded with pre-tax dollars that roll over year to year
              and can be spent tax-free on qualified medical expenses.
            </li>
            <li>
              <strong>PPO (Preferred Provider Organization)</strong> — a plan type that typically pairs a
              higher premium with a lower deductible and offers in-network and out-of-network coverage
              without requiring a referral to see a specialist.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the underlying rules this calculator is built on, the{" "}
            <a
              href="https://www.irs.gov/publications/p969"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              IRS Publication 969
            </a>{" "}
            covers HSA eligibility, contribution limits, and qualifying HDHP thresholds in detail, and the{" "}
            <a
              href="https://www.irs.gov/publications/p502"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              IRS Publication 502
            </a>{" "}
            lists which medical expenses qualify for tax-free HSA withdrawals. For general plan terminology
            like deductible, coinsurance, and out-of-pocket maximum, the{" "}
            <a
              href="https://www.healthcare.gov/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary
            </a>{" "}
            from the Centers for Medicare and Medicaid Services defines each term this tool uses, and the{" "}
            <a
              href="https://www.cms.gov/marketplace/resources/data/public-use-files"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              CMS Marketplace resources
            </a>{" "}
            page has broader plan-comparison data if you want to see how your specific plans compare to
            national averages.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If the HDHP comes out ahead, the{" "}
            <Link href="/tools/health/hsa-savings-calculator" className="text-blue-600 hover:underline">
              HSA savings calculator
            </Link>{" "}
            shows how that same contribution grows over years rather than just this one year&apos;s math. For a
            side-by-side look at more than two plans at once, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            extends this same approach beyond a single PPO and HDHP.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that run entirely in your browser, from coverage
            planning to claim payouts, so you can work through the numbers privately before you talk to an
            agent, a benefits administrator, or a tax professional. Nothing you type here is collected or
            stored.
          </p>
        </section>
      </div>
    </>
  );
}

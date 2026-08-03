import type { Metadata } from "next";
import Link from "next/link";
import { BusinessInterruptionCalculatorTool } from "@/components/tools/BusinessInterruptionCalculatorTool";
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

const tool = getToolBySlug("business-interruption-calculator")!;

const TITLE = "Business Interruption Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Estimate the business interruption insurance calculator's suggested coverage limit from your fixed costs, net profit, and recovery timeline — not gross revenue.";
const PAGE_URL = `${SITE_URL}/tools/business/business-interruption-calculator`;

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
    question: "Is this the same as a business interruption claim calculator?",
    answer:
      "No, and the distinction matters. This tool is for sizing coverage before a loss happens, using your typical monthly numbers and an estimated recovery period, so you know what limit to request when buying or renewing a policy. A claim calculator is a different tool for a different moment: it would reconstruct what an insurer actually owes after a covered loss, using real financial records from the specific loss period, actual extra expenses incurred, and the policy's specific terms. Insurance Tools plans a separate business-interruption-claim-calculator in the Claims category for that post-loss scenario. Use this one to plan ahead; use that one after a covered event.",
  },
  {
    question: "Why does the calculator use net profit instead of my monthly revenue?",
    answer:
      "Because that's what business income insurance actually pays for. Standard business income coverage is designed to put your business back in the financial position it would have been in without the loss — meaning it covers the fixed costs you're still on the hook for (rent, loan payments, some payroll) plus the profit you would have earned, not the full revenue that would have flowed through the business. Revenue includes variable costs — inventory, materials, hourly labor tied to sales — that a closed business typically isn't paying, so basing coverage on revenue overstates what you'd actually need to recover, and overstating it means paying for coverage you'd likely never collect on.",
  },
  {
    question: "How do I estimate my recovery period without a generic industry average?",
    answer:
      "Start with three things specific to your business: how long your lease or landlord relationship would take to either repair the space or let you relocate, how long it would take to reorder or rebuild specialized equipment given current lead times, and how quickly local contractors in your area are actually available for the type of rebuild you'd need. A retail space in a strip mall with generic fixtures recovers on a very different timeline than a restaurant with custom kitchen equipment or a manufacturer with specialized machinery. This tool intentionally doesn't supply a default recovery period for you, because a fabricated industry average would be more likely to mislead you than help you.",
  },
  {
    question: "What is extra expense coverage, and does this calculator include it?",
    answer:
      "Extra expense coverage pays for costs a business incurs specifically to keep operating, or to shorten the shutdown, that it wouldn't have paid otherwise — renting temporary space, expediting equipment shipping, or running a second shift at a backup location. This calculator estimates business income coverage (fixed costs plus lost profit) only. Extra expense is usually purchased alongside business income coverage as part of the same policy form, and sizing it well means talking through your specific contingency options with a commercial property agent rather than running a separate estimate here.",
  },
  {
    question: "Does the suggested coverage limit include a waiting period or coinsurance penalty?",
    answer:
      "No. Those are policy-specific mechanics this tool doesn't model. Many business income policies include a coinsurance clause that reduces a claim payout if you purchased less coverage than a stated percentage (often 50% to 80%) of your projected annual business income, and many also apply a short waiting period before coverage starts. Both can materially change what a policy actually pays regardless of the limit you buy. Confirm both with whoever quotes your policy before finalizing a coverage amount based on this estimate.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Business Insurance Tools", href: "/tools/business" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function BusinessInterruptionCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Business Interruption Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Estimate how much business income coverage to request before you buy a policy, built on
            the same fixed-costs-plus-lost-profit formula underwriters use — not a guess based on your
            total revenue.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <BusinessInterruptionCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-business-interruption-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Business Interruption Insurance Covers</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Business interruption insurance, more formally called business income coverage, replaces
            the income a business loses when a covered event — typically a fire, storm, or other direct
            physical loss to the property — forces it to shut down or slow operations while repairs
            happen. It&apos;s usually sold as an endorsement or built-in coverage part on a commercial
            property policy rather than as a standalone policy, and it&apos;s specifically designed to keep
            a business solvent through the gap between when the doors close and when normal operations
            resume, sometimes alongside extra expense coverage for costs incurred to shorten that gap.
            This business interruption insurance calculator is a planning tool for that first
            conversation with an agent, not a substitute for it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for business owners and operators who are buying a commercial property
            policy for the first time, renewing an existing one without having revisited the coverage
            limit in years, or simply trying to answer &ldquo;how much business interruption coverage do I
            need&rdquo; before a broker throws out a number. It&apos;s most useful for businesses with a physical
            location that would genuinely have to stop generating revenue during repairs — retail
            shops, restaurants, salons, contractors with a shop or yard, and similar operations. If
            you&apos;re instead trying to figure out what a policy already owes you after a loss has
            happened, this isn&apos;t the right tool; that calculation depends on your actual loss period
            financials and policy terms, which belongs in the planned post-loss claim calculator in the
            Claims category, not a pre-loss estimator like this one.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Formula, and Why It&apos;s Not Gross Revenue</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator adds your monthly fixed costs — rent, loan payments, the payroll you&apos;d keep
            paying key staff, utilities, and other bills that don&apos;t stop just because the business is
            closed — to your monthly net profit, then multiplies that combined monthly figure by the
            number of months you expect recovery to take. That&apos;s the standard business income formula:
            fixed costs plus lost profit, times the recovery period. It deliberately does not multiply
            your gross monthly revenue by the recovery period, because revenue includes variable costs
            a closed business typically stops paying — inventory purchases, materials, hourly labor
            tied directly to sales volume. Sizing coverage off revenue routinely overstates the real
            need, sometimes by a wide margin, which the tool surfaces directly by showing both numbers
            side by side once you&apos;ve entered your figures.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a small retail shop with $8,000 in monthly fixed costs (rent, a loan payment on
            fixtures, base utilities, and the salary of one manager kept on through a closure), $30,000
            in average monthly revenue, and a 15% net profit margin in a normal month. That 15% margin
            works out to $4,500 in monthly net profit. Add that to the $8,000 in fixed costs and the
            business needs about $12,500 a month to stay financially whole while closed. If the owner
            estimates a six-month recovery, based on their specific lease terms and the lead time to
            replace their point-of-sale and refrigeration equipment, the suggested coverage limit comes
            to $75,000. Sizing that same shop off gross revenue instead — six months at $30,000 — would
            suggest $180,000, more than double what the business would actually need to stay solvent
            through the closure.
          </p>

          <AdInArticle slot="tool-business-interruption-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is sizing coverage to gross revenue rather than fixed costs
            plus lost profit, which this tool flags directly by showing the gap between the two
            methods. A close second is underestimating the recovery period by defaulting to a round
            number like three months without checking it against an actual lease, permitting timeline,
            or equipment order lead time — recovery from a total loss involving specialized equipment
            or a hard-to-lease space commonly runs longer than owners expect going in. A third mistake
            is treating the net profit margin as a rough guess rather than pulling it from an actual
            income statement, since a modest error in margin compounds across every month of the
            recovery period.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes your entered fixed costs, revenue, and margin represent a
            reasonably typical operating month, and that your fixed costs would genuinely continue
            unchanged through a shutdown. It does not model coinsurance penalties, waiting periods,
            seasonal revenue swings, growth trends, or extra expense coverage, all of which can change
            what a real policy actually pays or requires you to carry. It also does not supply or
            assume a typical recovery time for your industry or location — that figure varies too much
            by lease terms, equipment availability, and local contractor capacity to responsibly
            generalize, so the number you enter should come from your own research, not an average this
            tool invents for you. Treat the output as a planning estimate to bring into a conversation
            with a licensed commercial property agent, not a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Business income coverage</strong> — the part of a commercial property policy that
              replaces lost net income and continuing fixed costs while a covered loss keeps a business
              from operating normally.
            </li>
            <li>
              <strong>Period of restoration</strong> — the policy-defined window, typically from the
              date of the physical loss until the property is reasonably repaired or replaced, during
              which business income coverage applies.
            </li>
            <li>
              <strong>Extra expense coverage</strong> — pays for reasonable costs incurred specifically
              to avoid or shorten a shutdown, such as temporary space or expedited equipment shipping,
              beyond what the business would have spent otherwise.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            The{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines how business income coverage fits into a broader small-business insurance plan,
            and the{" "}
            <a
              href="https://www.iii.org/article/business-income-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how business income and extra expense coverage typically work together on a
            commercial policy. For definitions of related commercial coverage types, the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer-facing guidance on commercial insurance basics. Confirm your specific
            policy&apos;s coinsurance requirement, waiting period, and period of restoration with your
            insurer or agent before finalizing a limit.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance tools
            </Link>{" "}
            category. If your business owns its building or valuable equipment, the{" "}
            <Link
              href="/tools/business/commercial-property-coverage-calculator"
              className="text-blue-600 hover:underline"
            >
              commercial property coverage calculator
            </Link>{" "}
            helps size the property limit this coverage is typically attached to. If you&apos;re working
            through an actual claim after a loss has already happened rather than planning ahead of
            one, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            are the closer fit once that post-loss tool is available.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the coverage decisions that
            usually get guessed at instead of calculated — business interruption limits, deductibles,
            claims math, and more. Nothing you enter here is stored or sent anywhere; every result
            updates instantly so you can walk into a broker conversation with a number you actually
            understand.
          </p>
        </section>
      </div>
    </>
  );
}

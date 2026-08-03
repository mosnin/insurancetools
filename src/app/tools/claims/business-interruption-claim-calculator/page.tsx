import type { Metadata } from "next";
import Link from "next/link";
import { BusinessInterruptionClaimCalculatorTool } from "@/components/tools/BusinessInterruptionClaimCalculatorTool";
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

const tool = getToolBySlug("business-interruption-claim-calculator")!;

const TITLE = "Business Interruption Claim Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this business interruption claim calculator to turn a real outage's lost revenue and saved expenses into a documented, ready-to-submit claim estimate.";
const PAGE_URL = `${SITE_URL}/tools/claims/business-interruption-claim-calculator`;

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
    question: "How is this different from the business interruption calculator in the Business category?",
    answer:
      "That tool sizes coverage before a loss happens, using typical monthly averages and an assumed recovery period, so you know what limit to request when buying a policy. This tool runs after a loss has happened, or while the outage is still underway, and reconstructs an actual claim amount from the real (or your best documented estimate of) lost revenue for that specific outage, the expenses you avoided during it, and any extra expense you incurred. One is a planning estimate; this one is a claim worksheet.",
  },
  {
    question: "Why doesn't the calculator add continuing expenses on top of lost revenue?",
    answer:
      "Because they're not a separate loss. Lost revenue is the money the business would have collected during the outage, and part of what that money would have paid for was exactly those continuing bills — rent, loan payments, the payroll you kept covering. Business income coverage reimburses the net income you lost, which already accounts for those continuing costs. Adding continuing expenses again on top of lost revenue double-counts them and inflates the claim past what the loss actually cost you.",
  },
  {
    question: "Why does the calculator subtract saved or avoided expenses?",
    answer:
      "Because the business never actually paid them. If a shutdown meant lower utility bills, fewer hourly staff hours, or paused subscriptions and supply orders, that's real money the business kept that it would otherwise have spent. Business income coverage is designed to put you back in the financial position you'd have been in without the loss, not a better one, so insurers net out avoided costs before finalizing a payout. Leaving them out of your own worksheet is one of the more common reasons a self-prepared claim estimate runs high.",
  },
  {
    question: "What counts as lost revenue if I don't have a clean comparable period?",
    answer:
      "Most claims use a same-period comparison: last year's revenue for the same weeks or months, adjusted for any known growth trend, seasonal pattern, or a specific reason last year isn't representative (a new location, a one-time promotion, unusual weather). If your business is too new or too seasonal for a clean same-period comparison, insurers may accept a documented projection built from a trailing average, signed contracts, or a sales trend, but that projection typically needs more support than a same-period comparison does. This tool doesn't generate that figure for you — it only totals what you enter.",
  },
  {
    question: "Do I need a forensic accountant to file a claim like this?",
    answer:
      "Not always. Smaller, well-documented claims are often handled directly between the policyholder and the insurer's adjuster. Larger claims, claims with a disputed loss period, or claims involving a business with complex or seasonal revenue commonly bring in a forensic accountant, either retained by the policyholder or the insurer, specifically to verify the lost-revenue and expense figures. If your estimated claim here is large relative to your business's size, or the insurer's adjuster disputes your numbers, that's a reasonable point to ask about bringing one in.",
  },
  {
    question: "Does this calculator account for a waiting period or coinsurance penalty?",
    answer:
      "No. Both are policy-specific terms this tool doesn't model. Many business income policies apply a short waiting period before coverage starts, and some apply a coinsurance clause that reduces a payout if the policy limit purchased was less than a stated percentage of projected annual business income. Neither shows up in this calculator's total, so confirm both against your actual policy language, or with your adjuster, before treating this estimate as your final claim figure.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Claims Tools", href: "/tools/claims" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function BusinessInterruptionClaimCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Business Interruption Claim Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Turn a real shutdown into a documented claim number: enter the revenue you actually lost, what
            you saved by being closed, and any extra expense you paid to keep going.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <BusinessInterruptionClaimCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-business-interruption-claim-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Post-Loss Claim, Not a Coverage Estimate</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            There are two entirely different questions a business owner asks about business interruption
            insurance, and they call for two different calculations. Before a loss, the question is
            &ldquo;how much coverage should I buy,&rdquo; answered with typical monthly averages and an assumed
            recovery timeline — that&apos;s what the{" "}
            <Link href="/tools/business/business-interruption-calculator" className="text-blue-600 hover:underline">
              business interruption calculator
            </Link>{" "}
            in the Business category does. After a loss, or while one is still playing out, the question
            changes to &ldquo;what does my policy actually owe me,&rdquo; and that requires real numbers from the
            actual outage: revenue you actually lost compared with a real comparable period, expenses you
            actually avoided, and extra costs you actually paid. This business interruption claim
            calculator is built for that second, post-loss moment, and it will not substitute an assumed
            average for a number you should be pulling from your own records.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool fits a business owner who has already experienced a covered shutdown — a fire, a
            burst pipe, storm damage, a forced closure order — and needs to put a number together before
            or during a conversation with their insurer&apos;s adjuster. It also works mid-outage, once enough
            of the loss period has passed to estimate lost revenue with reasonable confidence, so you can
            sanity-check an early settlement offer or track how the claim is growing as the shutdown
            continues. It is not the right tool if you haven&apos;t had a loss yet and are simply trying to
            decide how much business income coverage to buy; use the pre-loss sizing calculator for that
            instead, since it works from assumptions rather than a specific loss period.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Math: Lost Revenue Minus Saved Expenses
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Standard business income coverage is built to put a business back in the same financial
            position it would have been in without the loss, no better and no worse. That single idea
            explains both halves of the calculation. Lost revenue — what you would have collected in a
            comparable period minus what you actually collected during the outage — already includes the
            money that would have gone toward continuing bills like rent, loan payments, and the payroll
            you kept covering. Those continuing expenses are shown in this calculator for your own
            documentation, but they are a reference figure, not a second number to add into the claim
            total, because doing so would reimburse the same dollars twice. The one figure that genuinely
            reduces the claim is money the business saved by being closed: lower utility usage, hourly
            staff who were laid off or furloughed, subscriptions or supply orders that were paused. Since
            the business never spent that money, reimbursing it on top of lost revenue would leave the
            business better off than before the loss, which is exactly what business income coverage is
            not designed to do. Extra expense — money spent specifically to shorten the shutdown or keep
            partially operating, like renting temporary space or expediting equipment — is typically
            covered as an addition on top of the net business income claim, since it&apos;s a real, separate
            cost the business incurred trying to reduce the loss.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A small print shop floods after a pipe bursts and closes for 45 days for repairs and equipment
            replacement. Comparing the same 45-day window to the prior year, adjusted for a modest known
            growth trend, the owner documents $90,000 in lost revenue. During the closure, the owner kept
            paying $22,000 in rent, a loan payment on the building, and one manager&apos;s salary — that
            $22,000 is part of what the $90,000 in lost revenue would have covered, so it is not added
            again. The owner did lay off two hourly staff and cut utility usage to a minimum, saving
            $6,000 they would otherwise have spent. They also paid $4,000 to rent a small temporary space
            to keep taking phone and online orders during the repair. The net business income claim comes
            to $84,000 ($90,000 lost revenue minus $6,000 saved), and adding the $4,000 in extra expense
            brings the estimated total claim to $88,000 — a materially different, and more defensible,
            number than simply submitting the full $90,000 in lost revenue without netting anything out.
          </p>

          <AdInArticle slot="tool-business-interruption-claim-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake in a self-prepared claim worksheet is listing continuing expenses as
            a separate line item added to lost revenue, which overstates the claim by exactly the amount
            of those continuing bills — this tool keeps that figure visible but structurally separate from
            the total for that reason. A close second is forgetting to net out saved or avoided expenses
            at all, particularly smaller ones like reduced utility bills or paused software subscriptions
            that are easy to overlook next to a large lost-revenue figure. A third is picking a comparable
            period that isn&apos;t actually comparable — using a month with a one-time promotion, a different
            number of operating days, or a since-closed second location — which distorts the lost-revenue
            figure the entire claim is built on.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the lost revenue, continuing expenses, saved expenses, and extra
            expense you enter are accurate and drawn from your own financial records or a documented,
            defensible projection, not a rough guess — it has no way to verify any of these figures and
            does not supply typical percentages or industry benchmarks for what a business &ldquo;usually&rdquo;
            loses or saves during a shutdown, since no such figure would be honest across different
            business types, locations, and loss causes. It also does not model a policy&apos;s waiting period,
            coinsurance penalty, or specific period-of-restoration definition, all of which can change what
            an insurer actually pays regardless of the underlying loss math. Real claims, especially larger
            ones or ones involving a disputed loss period, are commonly supported by financial statements,
            tax returns, and point-of-sale records, and often involve a forensic accountant retained by the
            policyholder, the insurer, or both, to verify the lost-revenue and expense figures. Treat this
            tool&apos;s output as a documented starting point for that conversation, not a final settlement
            figure, and involve a public adjuster or attorney if the claim is large or contested.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Period of restoration</strong> — the policy-defined window, typically from the date
              of the physical loss until the property is reasonably repaired or replaced, during which
              business income coverage applies to the claim.
            </li>
            <li>
              <strong>Extra expense coverage</strong> — reimburses reasonable costs a business incurs
              specifically to avoid or shorten a shutdown, such as temporary space or expedited shipping,
              beyond what it would have spent otherwise; typically added on top of the net business income
              claim rather than netted against it.
            </li>
            <li>
              <strong>Saved or avoided expenses</strong> — normal operating costs a business did not incur
              because it was shut down or operating at reduced capacity; insurers subtract these from lost
              revenue since the business never actually paid them.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            The{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on the claims process, including what documentation an insurer can
            reasonably request. The{" "}
            <a
              href="https://www.iii.org/article/business-income-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how business income and extra expense coverage are structured on a commercial policy.
            The{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines how business interruption coverage fits into a broader small-business insurance and
            recovery plan. Confirm your policy&apos;s specific period of restoration, coinsurance
            requirement, and documentation standards with your insurer or an attorney before finalizing a
            claim.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            category. If you haven&apos;t had a loss yet and are instead deciding how much coverage to buy,
            the{" "}
            <Link href="/tools/business/business-interruption-calculator" className="text-blue-600 hover:underline">
              business interruption calculator
            </Link>{" "}
            in the Business category is the pre-loss sizing tool for that decision. Once you have a total
            claim figure, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            helps you work through how a deductible or coinsurance penalty could adjust the amount an
            insurer ultimately pays.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools is a free library of browser-based calculators for the coverage and claims
            math people usually have to guess at. Every number here comes from what you type in, nothing
            is saved or transmitted, and each tool is built to help you arrive at a claim, adjuster, or
            agent conversation with a documented figure instead of a rough guess.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { Sr22FilingCostCalculatorTool } from "@/components/tools/Sr22FilingCostCalculatorTool";
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

const tool: Tool = {
  slug: "sr22-filing-cost-calculator",
  name: "SR-22 Filing Cost Calculator",
  description:
    "Total your SR-22 filing fee and monthly insurance surcharge across your required filing period to see the real cost of carrying an SR-22.",
  category: "Auto",
  categorySlug: "auto",
  keywords: [
    "sr22 filing cost calculator",
    "sr22 cost calculator",
    "how much does sr22 cost",
    "sr22 insurance cost",
    "sr22 filing fee calculator",
  ],
  relatedTools: ["car-insurance-coverage-calculator"],
};

const TITLE = "SR-22 Filing Cost Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this SR-22 filing cost calculator to total your filing fee and monthly surcharge over your required filing period, then confirm the exact figures with your state.";
const PAGE_URL = `${SITE_URL}/tools/auto/sr22-filing-cost-calculator`;

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
    question: "Does this SR-22 filing cost calculator tell me what my state charges?",
    answer:
      "No. SR-22 filing fees, monthly surcharge amounts, and required filing lengths are all set individually by each state, and a handful of states use a different certificate or no SR-22 system at all. This tool only adds up the fee, surcharge, and duration you type in. Get your actual figures from your insurer's quote, your state's DMV or Department of Insurance, or the court order that required the filing, then plug them in here to see the total.",
  },
  {
    question: "What is an SR-22, in general terms?",
    answer:
      "An SR-22 is typically a certificate that an insurance company files with a state on a driver's behalf, confirming the driver carries the minimum liability coverage that state requires. It's usually required after certain violations, such as a DUI conviction, a serious at-fault accident without insurance, or driving without insurance. It is a proof-of-coverage filing, not a separate insurance policy, but insurers commonly charge a filing fee and add a monthly surcharge for the added underwriting risk. Exact triggers and rules differ by state.",
  },
  {
    question: "Why is there a monthly surcharge on top of my regular premium?",
    answer:
      "Insurers generally treat an SR-22 requirement as a signal of higher risk, since it's usually tied to a violation on your driving record, and price that risk into your policy as an added surcharge on top of your base premium. This calculator asks specifically for that added surcharge amount, not your entire monthly premium, so the total reflects only the cost attributable to the SR-22 requirement itself.",
  },
  {
    question: "How do I find out how many months my SR-22 needs to stay active?",
    answer:
      "That length is set by the state or court that required the filing, commonly ranging from about one to five years depending on the state and the underlying violation, though this tool does not assume any specific number for you. Check your court paperwork, DMV notice, or ask your insurer directly, then enter that figure into the calculator so the total reflects your actual required period rather than a guess.",
  },
  {
    question: "What happens if my SR-22 filing lapses before the required period ends?",
    answer:
      "In general, insurers are required to notify the state if an SR-22 policy is canceled or lapses, which can reset the required filing clock or lead to a suspended license, depending on the state. This calculator doesn't model that risk since it depends entirely on state procedure. If you're at risk of missing a payment, contact your insurer or state DMV before the coverage lapses rather than after.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Auto Calculators", href: "/tools/auto" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function Sr22FilingCostCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            SR-22 Filing Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Add up what an SR-22 requirement actually costs you: the one-time filing fee, the monthly
            surcharge tied to it, and how many months you&apos;re required to carry it. Enter your own
            numbers below and the total updates instantly.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <Sr22FilingCostCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-sr22-cost-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Needs an SR-22 Filing Cost Estimate</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            If a court or your state&apos;s DMV has already told you an SR-22 is required, the paperwork
            usually explains why, but rarely spells out what the requirement will cost over its full
            length. This SR-22 filing cost calculator is built for that gap: drivers who have a filing
            fee quote and a surcharge amount from an insurer but haven&apos;t sat down to multiply it out
            across the months they&apos;re required to carry it. It&apos;s also useful for comparing quotes
            between insurers once you know your required filing period, since two insurers can quote
            very different filing fees and surcharges for the same underlying requirement.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">What an SR-22 Generally Is</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            An SR-22 is commonly described as a certificate of financial responsibility: a document an
            insurance company files with a state confirming that a driver holds at least the minimum
            liability coverage the state requires. It is filed on the driver&apos;s behalf by their insurer,
            not obtained independently, and it is not a type of insurance policy in its own right, it
            rides on top of a standard auto policy. States that use the SR-22 system typically require it
            after specific events, such as a DUI or DWI conviction, driving without insurance, an at-fault
            accident with no coverage, or accumulating too many points on a license. The exact triggers,
            the certificate&apos;s name (some states use an FR-44 or another form entirely), and whether a
            state uses this system at all are all determined at the state level, which is exactly why this
            calculator asks for your figures instead of assuming any.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Total Cost Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The math behind this calculator is intentionally simple, because the inputs are the part that
            actually varies. It takes the one-time filing fee you enter, adds it to your monthly SR-22
            surcharge multiplied by the number of months you&apos;re required to carry the filing, and shows
            you the sum: <strong>total cost = filing fee + (monthly surcharge × required months)</strong>.
            The monthly surcharge should reflect only the portion of your premium added specifically
            because of the SR-22 requirement, not your entire monthly insurance bill, since folding in your
            base premium would overstate what the requirement itself is costing you. The calculator also
            shows the surcharge subtotal and an average monthly cost separately, so you can see how much of
            the total is a one-time hit versus an ongoing monthly cost.
          </p>

          <AdInArticle slot="tool-sr22-cost-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say an insurer quotes a $25 one-time filing fee to submit the SR-22, plus a $40 monthly
            surcharge specifically for carrying it, and the driver&apos;s state or court has ordered the
            filing to stay active for 36 months. Entering those three numbers gives a surcharge subtotal
            of $1,440 (40 × 36) and a total cost of $1,465 ($25 + $1,440) across the full filing period,
            or roughly $40.69 a month on average once the one-time fee is spread across the term. Change
            any one input, a shorter required period, a different insurer&apos;s surcharge, and the total
            updates immediately, which makes it easier to compare two insurance quotes side by side instead
            of eyeballing which monthly number looks smaller.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is entering a full monthly premium instead of just the added SR-22
            surcharge, which inflates the total and makes it impossible to compare what the filing itself
            is actually adding to the cost of insurance. A second is guessing at the required filing length
            instead of checking the court order or DMV notice, since carrying insurance one month short of
            the actual requirement can restart the clock or suspend a license in some states. A third is
            assuming the filing fee is a recurring charge; in most cases it&apos;s billed once when the
            certificate is first filed, not every renewal, though it&apos;s worth confirming that with your
            specific insurer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator makes no assumptions about what any state charges, requires, or names its
            SR-22 equivalent, and it does not default the required filing period to any number, because
            that duration is set by state law and by the specifics of the case that triggered the
            requirement in the first place. It simply totals the three numbers you supply. It does not
            account for how a lapse or cancellation might affect your required timeline, does not estimate
            your base insurance premium, and does not tell you whether your state uses the SR-22 system at
            all, some states use an FR-44 form or a different mechanism entirely, and a few don&apos;t use
            this kind of filing at all. Treat every result here as a planning total built from your own
            figures, and confirm your state&apos;s exact requirement, fee schedule, and filing duration with
            your state&apos;s Department of Insurance or DMV, or with the court that ordered the filing,
            before relying on the number.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Certificate of financial responsibility</strong> — a filing an insurer submits to a
              state confirming a driver carries at least the state&apos;s minimum required liability coverage.
            </li>
            <li>
              <strong>SR-22 surcharge</strong> — the added amount an insurer charges on top of a driver&apos;s
              base premium specifically because an SR-22 filing is on the policy.
            </li>
            <li>
              <strong>Filing period</strong> — the length of time a state or court requires the SR-22 (or
              equivalent certificate) to remain continuously active on a policy.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For general guidance on auto coverage terminology used throughout this page, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer-facing auto insurance guidance, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how standard policy provisions like liability coverage work. Because SR-22
            requirements, fees, and durations are state-specific, confirm your exact requirement directly
            with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or your state&apos;s DMV before you budget around this estimate.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. Since SR-22 rules are set at the state level, the{" "}
            <Link href="/tools/state-requirements" className="text-blue-600 hover:underline">
              state requirements
            </Link>{" "}
            hub is the next stop for tools covering state-specific minimums. If you&apos;re also reviewing
            how much liability coverage to carry once your SR-22 period is behind you, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            sizes a limit to your actual assets and income, and the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the how-much-do-I-need question across other policy types.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific insurance questions
            people are actually trying to answer, from filing costs to coverage limits to claim payouts.
            Nothing you type into a calculator here is saved or sent anywhere; every result is meant to
            give you real numbers to bring into a conversation with your insurer, your state&apos;s
            regulator, or a licensed agent.
          </p>
        </section>
      </div>
    </>
  );
}

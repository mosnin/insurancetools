import type { Metadata } from "next";
import Link from "next/link";
import { DiminishedValueCalculatorTool } from "@/components/tools/DiminishedValueCalculatorTool";
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

const tool = getToolBySlug("diminished-value-calculator")!;

const TITLE = "17c Diminished Value Calculator | Insurance Tools";
const DESCRIPTION =
  "Run the 17c diminished value formula on your own vehicle and see every step of the math, from base loss through damage severity and mileage. One commonly referenced methodology, not a guaranteed payout.";
const PAGE_URL = `${SITE_URL}/tools/auto/diminished-value-calculator`;

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
    question: "What is the 17c diminished value formula and where did it come from?",
    answer:
      "The 17c formula is a step-by-step method for estimating a vehicle's inherent diminished value after an accident: cap the base loss at 10% of the vehicle's pre-accident value, then reduce that figure with a damage severity multiplier and a mileage multiplier. It gets its name from paragraph 17(c) of an internal claims memo produced during Mabry v. State Farm, a 2001 Georgia class action over unpaid diminished value claims. It has since become the most widely cited formula among consumer advocates and some claims adjusters, but it was never adopted as a mandatory national standard, and other appraisal methods exist.",
  },
  {
    question: "Will my insurance company actually pay the amount this calculator shows?",
    answer:
      "Not necessarily. This calculator shows what the 17c formula produces from your inputs, not a number any insurer has agreed to pay. Insurers frequently use their own internal diminished value formulas, negotiate case by case, or dispute the claim entirely, and some states limit or do not recognize first-party diminished value claims at all. Treat this figure as a starting point for a conversation or negotiation, not as a settlement amount.",
  },
  {
    question: "Does diminished value apply if the accident was my fault?",
    answer:
      "Generally, diminished value claims are strongest against an at-fault third party's liability insurer, since most states require an insurer to make you whole for the loss the other driver caused. Filing a diminished value claim against your own insurer after an at-fault accident (a first-party claim) is far less consistent from state to state, and many policies and some state regulators restrict or exclude it. Check your policy language and your state insurance department before assuming either type of claim applies to your situation.",
  },
  {
    question: "Why does the calculator show $0 for very high mileage or severe structural damage?",
    answer:
      "The 17c formula's mileage multiplier steps down to 0.00 once a vehicle passes 100,000 miles, and its damage tiers historically valued structural or frame damage at the lowest multiplier available. That reflects the formula's original assumptions, not a universal truth about the car's actual loss in resale value. Some independent appraisers and some insurers use different methodologies that would still assign value in exactly these situations, so a $0 result here does not necessarily mean a licensed appraiser would agree.",
  },
  {
    question: "Is the 17c formula the only way to calculate diminished value?",
    answer:
      "No. It is the most commonly referenced formula in consumer guides because it originated from a real legal dispute and produces a repeatable, transparent calculation, but professional appraisers also use comparable-sales analysis, which compares actual resale prices of similar accident-history and clean-history vehicles, and some states or insurers apply their own proprietary formulas. If a meaningful amount of money is at stake, an independent vehicle appraisal is worth the cost before relying on any single formula.",
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

export default function DiminishedValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Diminished Value Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Estimate how much resale value a repaired vehicle lost using the 17c formula, the
            step-by-step method most often cited in diminished value claims. See every step of the
            math, not just a final number.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <DiminishedValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-diminished-value-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Diminished Value Calculator Is For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A car that has been in an accident is worth less when you go to sell or trade it, even
            after a flawless repair, because a vehicle history report will always show the accident.
            That gap between what the car would have sold for and what it sells for now is diminished
            value, and it is a real, recoverable loss in many states when someone else caused the
            accident. This calculator is built for a driver holding a repair estimate or a completed
            repair bill, trying to put a defensible number on that loss before calling the at-fault
            driver&apos;s insurer, filing a first-party claim, or simply deciding whether it&apos;s worth pursuing
            at all.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">What the 17c Formula Actually Is</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The formula gets its unusual name from paragraph 17(c) of an internal State Farm claims
            training document that surfaced during <em>Mabry v. State Farm Mutual Automobile Insurance
            Co.</em>, a 2001 Georgia class action over insurers systematically underpaying or denying
            diminished value claims. The document laid out a specific calculation the company had used
            internally, and once it became public through litigation, consumer advocates and public
            adjusters adopted it as a transparent, repeatable starting point for estimating diminished
            value. It is not a state or federal regulation, it is not written into most insurance
            policies, and no law requires any insurer to accept it. What it offers is consistency: the
            same inputs always produce the same output, which makes it useful for comparison even
            though it is only one of several methodologies appraisers and insurers actually use.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculation runs in three steps. First, it caps the maximum possible loss at 10% of the
            vehicle&apos;s pre-accident value, on the reasoning that even a totaled-and-rebuilt vehicle
            rarely loses more than a tenth of its value once repaired. Second, it multiplies that base
            loss by a damage severity factor, from 1.00 for severe damage down to 0.25 for structural or
            frame damage, which sounds backwards until you remember frame damage was historically
            treated as excluded from coverage entirely, so 0.25 was already a concession. Third, it
            multiplies the result by a mileage factor that steps down as the odometer climbs, on the
            theory that a high-mileage vehicle was already worth less before the accident, so an
            accident has less remaining value left to diminish.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Suppose a five-year-old sedan was worth $22,000 immediately before a collision, had 32,000
            miles on it, and needed moderate panel and mechanical repair after the crash (not
            structural). The base loss is 10% of $22,000, or $2,200. Moderate damage carries a 0.75
            multiplier, bringing the figure to $1,650. That mileage falls in the 20,000&ndash;39,999 band,
            which carries a 0.80 multiplier, bringing the final estimate to $1,320. That number is a
            starting point for a demand or a first-party claim, not a settlement, and the insurer
            reviewing it may counter with their own internal figure, a lower comparable-sales estimate,
            or a denial depending on the state and the policy involved.
          </p>

          <AdInArticle slot="tool-diminished-value-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes When Estimating Diminished Value</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is treating the 17c output as a guaranteed payout instead of a
            negotiating anchor, then being surprised when an insurer offers less or nothing. A close
            second is using the vehicle&apos;s value <em>before</em> any prior damage or the current price paid,
            rather than its actual fair market value immediately before this specific accident, which
            inflates the base loss. A third is skipping documentation entirely; a diminished value claim
            is far stronger with a copy of the repair estimate, before-and-after photos, and, for larger
            claims, an independent written appraisal, than with a number from any calculator alone.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes you want the 17c formula specifically, since it is the most widely
            referenced method for a first estimate. It does not know your state&apos;s rules on first-party
            versus third-party diminished value claims, your insurer&apos;s own internal formula, whether
            your state courts or insurance department even recognize formulaic diminished value claims,
            or your vehicle&apos;s actual condition beyond the damage tier you select. Some states, and some
            insurers regardless of state, reject diminished value claims altogether or cap them well
            below what this formula produces. The pre-accident value you enter is only as accurate as
            your own estimate of fair market value; an inflated or understated figure changes every
            downstream number. Treat the result as a planning figure to bring into a claim or a
            conversation with a licensed appraiser or attorney, never as a promised outcome.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Diminished value</strong> — the drop in a vehicle&apos;s resale or trade-in value that
              persists after an accident and repair, driven mainly by the accident showing up on a
              vehicle history report.
            </li>
            <li>
              <strong>Inherent diminished value</strong> — diminished value that remains even after a
              complete, high-quality repair, as opposed to value lost from a repair that was done
              poorly.
            </li>
            <li>
              <strong>First-party vs. third-party claim</strong> — a first-party claim is filed against
              your own insurer; a third-party claim is filed against the at-fault driver&apos;s liability
              insurer. States treat diminished value very differently depending on which type applies.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how claims and settlements generally work, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on filing a claim, and the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NAIC&apos;s auto insurance consumer guide
            </a>{" "}
            explains how liability coverage and claim payouts fit together. The{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down what a standard auto policy does and does not pay for. Because diminished value
            rules vary sharply by state, confirm your own state&apos;s treatment of these claims with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            before relying on any formula.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you&apos;re still deciding how much liability coverage to carry before an accident
            ever happens, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            covers that question. Once a claim is actually in progress, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            cover related settlement and payout questions beyond diminished value alone.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance formulas and
            claim methodologies into something you can actually run yourself, no account or download
            required. Each tool shows its math in the open so you can bring a defensible, well-reasoned
            number into your next call with an adjuster, agent, or appraiser.
          </p>
        </section>
      </div>
    </>
  );
}

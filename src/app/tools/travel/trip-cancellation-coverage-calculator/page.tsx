import type { Metadata } from "next";
import Link from "next/link";
import { TripCancellationCoverageCalculatorTool } from "@/components/tools/TripCancellationCoverageCalculatorTool";
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

const tool = getToolBySlug("trip-cancellation-coverage-calculator")!;

const TITLE = "Trip Cancellation Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Compare a quoted trip cancellation insurance premium against your actual non-refundable trip cost, see what percentage it protects, and learn what standard coverage does and doesn't pay for.";
const PAGE_URL = `${SITE_URL}/tools/travel/trip-cancellation-coverage-calculator`;

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
    question: "Is trip cancellation insurance worth it for my trip?",
    answer:
      "That depends on how much of your trip cost is truly non-refundable and how the quoted premium compares to that amount, not on any general statistic about how often trips get cancelled. Nobody publishes a reliable figure for that because it varies enormously by traveler, destination, and trip type, so this calculator deliberately avoids inventing one. Instead, look at the percentage this tool shows: a policy priced at a small fraction of your at-risk cost is a cheap way to transfer a large potential loss, while a policy priced close to your at-risk cost is protecting less value per dollar spent.",
  },
  {
    question: "What does standard trip cancellation coverage actually pay for?",
    answer:
      "Standard, or \"named reason,\" trip cancellation coverage pays out only for the specific covered reasons listed in the policy, typically things like a documented illness or injury to you or a traveling companion, a death in the family, a natural disaster at your destination, or your job terminating you unexpectedly. Every policy lists its own covered reasons, and they don't include changing your mind, finding a better trip, or general anxiety about traveling.",
  },
  {
    question: "What is \"cancel for any reason\" (CFAR) coverage, and how is it different?",
    answer:
      "CFAR is an upgrade you purchase in addition to standard trip cancellation coverage, sold and priced separately by the insurer. It lets you cancel for a reason the base policy doesn't list, including simply not wanting to go anymore, but it comes with real restrictions: it typically has to be purchased within a short window of your initial trip deposit, it usually only reimburses a percentage of your trip cost rather than the full amount, and you generally have to cancel by a set number of days before departure to qualify. It also costs meaningfully more than standard coverage because it removes the insurer's ability to decline a claim based on the reason for cancelling.",
  },
  {
    question: "Why does the calculator ask for the non-refundable portion separately from the total trip cost?",
    answer:
      "Because insurance only protects money you'd actually lose. Many trips mix refundable deposits (money you'd get back anyway if you cancelled) with non-refundable payments like prepaid non-refundable flights, locked-in tour packages, or forfeited hotel deposits. If you entered your full trip cost as the amount \"at risk,\" the calculator would overstate what the policy is protecting and make the premium look cheaper relative to your real exposure than it actually is.",
  },
  {
    question: "Does travel insurance replace my regular health insurance while I'm abroad?",
    answer:
      "No, and trip cancellation coverage specifically has nothing to do with medical care at all; it only reimburses prepaid trip costs when you cancel or cut a trip short for a covered reason. Medical coverage during travel is a separate type of policy, often bundled into the same plan but priced and triggered independently. The U.S. Department of State publishes general guidance on why domestic health plans often don't cover care received overseas, which is a separate question from whether your trip cost itself is protected.",
  },
  {
    question: "What is \"primary\" versus \"secondary\" coverage in a travel insurance policy?",
    answer:
      "Primary coverage pays out directly without requiring you to first file a claim with another insurer, such as your credit card's travel protection or your health plan. Secondary coverage only pays after those other sources have paid what they cover, reimbursing the remaining gap. It's a contract detail buried in the policy's fine print, not something this calculator can see, so it's worth confirming directly with the issuer, especially if you're already relying on a credit card's built-in trip protection.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Travel Insurance Tools", href: "/tools/travel" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function TripCancellationCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Trip Cancellation Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See what a quoted trip cancellation insurance premium is actually buying you, measured against
            the specific portion of your trip you&apos;d lose if you had to cancel. Free, instant, and it
            never asks for your itinerary.
          </p>
          <LastUpdated category="travel" />
        </div>

        <div className="mt-2">
          <TripCancellationCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-trip-cancellation-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Trip Cancellation Insurance Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the moment right after a travel insurance quote lands in your inbox and
            before you decide whether to buy it. If you&apos;ve already put down non-refundable deposits on
            flights, a cruise, or a tour package, and a quote is asking you to weigh a fixed premium against
            an uncertain future, this calculator turns that into a concrete comparison instead of a gut
            feeling. It&apos;s equally useful if you&apos;re trying to decide between a standard trip
            cancellation policy and a pricier &ldquo;cancel for any reason&rdquo; upgrade, since seeing the
            premium as a percentage of your actual at-risk cost makes the trade-off easier to reason about
            than the flat dollar amount on a quote page.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Risk-Transfer Comparison Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Unlike a health or auto insurance calculator, this isn&apos;t modeling a repeatable event with a
            known frequency. You take a given trip once, and either you complete it or you don&apos;t. There
            is no dependable, general figure for how likely any specific traveler is to cancel any specific
            trip, and any calculator that quotes you one is presenting a fabricated number dressed up as
            data. So instead of guessing at odds, this calculator does something more honest: it isolates
            the dollar amount you&apos;d actually lose if a covered cancellation happened (your non-refundable
            cost, not your full trip cost, since refundable deposits come back regardless of insurance), then
            shows what fraction of that specific exposure the quoted premium represents. A premium that costs
            a small slice of your at-risk amount is a cheap way to remove a large potential loss from your
            personal balance sheet. A premium that costs a large slice of it is protecting comparatively
            little value for the money, and self-insuring, simply accepting the risk yourself, may be the
            more rational choice. Either way, the decision comes down to your own tolerance for that specific
            dollar loss, not a probability this tool has no honest way to know.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a traveler books a $4,000 international trip: $2,400 in flights that became non-refundable
            once ticketed, and a $1,600 tour package deposit, of which $800 is non-refundable within 60 days
            of departure and $800 remains refundable until final payment. Their true at-risk amount is
            $3,200, not the full $4,000, since $800 would come back regardless of any insurance policy. A
            travel insurer quotes them $220 for standard trip cancellation coverage. Run through this
            calculator, that premium is about 6.9% of the $3,200 at-risk amount and about 5.5% of the full
            trip cost, meaning roughly $14.50 of non-refundable trip cost is protected for every $1 of
            premium spent. Whether that trade is worth it depends on how the traveler feels about
            potentially absorbing a $3,200 loss versus paying $220 now to transfer that risk to the insurer,
            for the specific covered reasons the policy lists, not for a general change of plans.
          </p>

          <AdInArticle slot="tool-trip-cancellation-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Mistake This Tool Is Built to Prevent</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common misunderstanding about trip cancellation insurance is assuming the
            standard policy covers a simple change of mind. It doesn&apos;t. Standard coverage reimburses
            only for the named reasons written into the policy, things like a documented illness or injury,
            a death in the immediate family, jury duty, or a natural disaster affecting the destination.
            Deciding you no longer want to go, finding a cheaper trip elsewhere, or general nervousness about
            travel are not covered reasons under a standard policy, no matter how reasonable they feel in the
            moment. The only product that pays out for an unlisted reason is a &ldquo;cancel for any
            reason&rdquo; (CFAR) upgrade, purchased separately, usually within a short window after the
            initial trip deposit, and typically reimbursing a percentage of trip cost rather than the full
            amount. A second, smaller mistake is entering the full trip cost as the amount at risk instead of
            isolating the non-refundable portion, which makes a policy look like it&apos;s protecting more
            value than it actually is.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the numbers you enter, your total trip cost, your non-refundable
            portion, and your quoted premium, are accurate, and it has no way to verify any of them against
            an actual policy document. It does not know which specific reasons your quoted policy covers,
            whether your destination or trip type is eligible, whether pre-existing medical condition
            exclusions apply, or how your particular insurer defines a &ldquo;covered event.&rdquo; It also
            cannot and does not estimate how likely you are to need to cancel; no general-purpose figure for
            that exists, and this tool won&apos;t manufacture one. Treat the percentages here as a way to
            frame the trade-off, not as a final answer, and read the policy&apos;s actual list of covered
            reasons before buying.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terminology Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Cancel for any reason (CFAR)</strong> — an optional upgrade, purchased separately from
              standard trip cancellation coverage, that lets you cancel for a reason the base policy
              doesn&apos;t list. It usually must be purchased within a short window of the initial deposit,
              typically reimburses a percentage of trip cost rather than the full amount, and generally
              requires cancelling a set number of days before departure.
            </li>
            <li>
              <strong>Covered reason</strong> — one of the specific events named in a standard trip
              cancellation policy that qualifies for reimbursement, such as a documented illness, an injury,
              a death in the family, or a natural disaster at the destination. Anything outside that list is
              not reimbursed under standard coverage.
            </li>
            <li>
              <strong>Primary vs. secondary coverage</strong> — primary coverage pays a claim directly;
              secondary coverage only pays after other applicable coverage, such as a credit card&apos;s
              travel protection, has paid what it covers, reimbursing whatever gap remains.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on travel coverage generally, the{" "}
            <a
              href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/your-health-abroad/insurance-providers-overseas.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of State
            </a>{" "}
            explains why domestic health coverage often doesn&apos;t extend overseas and what to look for in
            supplemental travel coverage. The{" "}
            <a
              href="https://www.iii.org/article/travel-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down the different components of a typical travel insurance policy, including
            cancellation, interruption, and medical coverage. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes general consumer guidance on reading policy terms and filing claims that applies
            across travel and other personal lines. Confirm any policy&apos;s exact covered reasons and CFAR
            eligibility window directly with the issuer before buying.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/travel" className="text-blue-600 hover:underline">
              Travel insurance calculators
            </Link>{" "}
            category. If your policy also needs to cover medical care abroad, the{" "}
            <Link href="/tools/travel/travel-medical-insurance-calculator" className="text-blue-600 hover:underline">
              travel medical insurance calculator
            </Link>{" "}
            handles that separate question, and if you&apos;re weighing a cruise-specific plan, the{" "}
            <Link href="/tools/travel/cruise-travel-insurance-value-calculator" className="text-blue-600 hover:underline">
              cruise travel insurance value calculator
            </Link>{" "}
            is built around the coverage quirks specific to cruise itineraries.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for weighing insurance decisions, trip
            cancellation coverage included, using your own numbers instead of a generic rule of thumb.
            Nothing you type here is stored or transmitted; every calculation runs locally in your browser
            so you can compare a quote honestly before you buy.
          </p>
        </section>
      </div>
    </>
  );
}

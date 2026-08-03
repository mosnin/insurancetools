import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { CruiseTravelInsuranceValueCalculatorTool } from "@/components/tools/CruiseTravelInsuranceValueCalculatorTool";
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
  slug: "cruise-travel-insurance-value-calculator",
  name: "Cruise Travel Insurance Calculator",
  description:
    "Checks your non-refundable cruise fare against a checklist of cruise-specific coverage features, including missed port, cabin confinement, and itinerary change protection.",
  category: "Travel",
  categorySlug: "travel",
  keywords: [
    "cruise travel insurance calculator",
    "is cruise insurance worth it",
    "missed port insurance cruise",
    "cabin confinement coverage cruise",
    "cruise cancellation insurance cost",
  ],
  relatedTools: ["trip-cancellation-coverage-calculator", "travel-medical-insurance-calculator"],
};

const TITLE = "Cruise Travel Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this cruise travel insurance calculator to check your non-refundable fare against missed port, cabin confinement, and itinerary change coverage first.";
const PAGE_URL = `${SITE_URL}/tools/travel/cruise-travel-insurance-value-calculator`;

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
    question: "Is cruise insurance worth it if I already have a generic trip insurance policy?",
    answer:
      "It depends on what that generic policy actually includes. Most standard trip cancellation and trip interruption plans were written with hotel-and-flight vacations in mind, and they don't automatically include cruise-specific features like missed port coverage, cabin confinement coverage, or itinerary change coverage. Run your fare and situation through this calculator, then check your policy's certificate of coverage against the checklist it produces before assuming you're covered.",
  },
  {
    question: "What is missed port insurance for a cruise, exactly?",
    answer:
      "It's coverage tied to missing embarkation or a scheduled port because of a covered delay, most commonly a delayed or cancelled connecting flight. Some cruise-specific policies pay to get you to the next port to rejoin the ship, others reimburse a portion of the missed portion of the cruise. The exact structure varies by insurer, which is why this tool flags relevance rather than promising a specific payout.",
  },
  {
    question: "What is cabin confinement coverage and is it a real benefit?",
    answer:
      "Yes, it's a real and documented coverage feature offered by some cruise-specific travel insurance policies. It pays a benefit if the ship's own onboard medical staff quarantines you to your cabin, typically due to a contagious illness such as a norovirus outbreak. It's one of the more overlooked cruise-specific benefits because most travelers have never needed to use it, but it addresses a genuinely cruise-specific risk that land-based trip insurance was never built around.",
  },
  {
    question: "Should I buy the cruise line's own insurance or a separate travel insurance policy?",
    answer:
      "They're not the same product. Cruise line insurance is sold at booking, is usually administered by the cruise line or its underwriting partner, and often pays out in future cruise credit rather than cash, with a narrower list of covered cancellation reasons. Third-party travel insurance is purchased independently, more commonly pays cash, and can bundle in the cruise-specific riders this tool checks for, plus broader medical and evacuation coverage. Compare both against your actual itinerary rather than defaulting to whichever one is offered first.",
  },
  {
    question: "What counts as my non-refundable cruise fare for this calculator?",
    answer:
      "Enter the portion of your cruise fare you would actually lose if you cancelled today, based on your cruise line's cancellation penalty schedule, not the full price you paid. Most cruise lines use a tiered penalty schedule that increases the closer you get to departure, so the non-refundable amount typically grows the closer your sail date is.",
  },
  {
    question: "Does a longer cruise need a different insurance approach than a short one?",
    answer:
      "The per-day exposure this tool calculates is meant to make that comparison easier: a 14-night cruise with the same total fare as a 4-night cruise carries less value at risk per day, but a longer itinerary usually visits more ports, which raises the odds that at least one gets changed or skipped. That's part of why itinerary change coverage tends to matter more as cruise length grows, even when the total fare doesn't.",
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

export default function CruiseTravelInsuranceValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Cruise Travel Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Check your non-refundable cruise fare against a checklist of cruise-specific coverage
            features insurers offer but generic trip insurance often skips. Free, instant, and it never
            asks who you are.
          </p>
          <LastUpdated category="travel" />
        </div>

        <div className="mt-2">
          <CruiseTravelInsuranceValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-cruise-travel-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why a Cruise Needs Different Insurance Math
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A cruise vacation carries a shape of risk that a hotel-and-flight trip doesn&apos;t. You board a
            ship on a fixed schedule, at a fixed port, and once you&apos;re aboard you&apos;re committed to
            wherever the itinerary takes you next, on a timeline you don&apos;t control. That creates three
            genuinely cruise-specific exposures that a general-purpose trip insurance policy was never
            written around: missing the ship because a connecting flight to the port ran late, being
            confined to your cabin by the ship&apos;s own medical staff if you get sick onboard, and losing
            a port you booked the trip specifically to see because the cruise line changed the route.
            This cruise travel insurance calculator keeps the same non-refundable-fare-at-risk math used
            across this site&apos;s trip cancellation tooling, then layers a checklist on top so you know
            exactly which named coverage features to go looking for, instead of assuming a standard
            policy already includes them.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone who has already paid a deposit or full fare on a cruise and is
            now shopping for a travel insurance policy to protect it, especially travelers flying in from
            out of state or overseas to reach the port, cruisers on multi-port itineraries where a
            specific stop matters to them, and anyone booking during a season when illness outbreaks or
            weather-driven itinerary changes are more common. If you&apos;re comparing a generic annual
            travel policy against a cruise-specific one, run your fare and situation through here first
            so you know which features to actually check for in the fine print rather than assuming
            they&apos;re bundled in.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Calculation and Checklist Work</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The core number is your non-refundable cruise fare, the portion you&apos;d actually forfeit if
            you cancelled today under your cruise line&apos;s penalty schedule. The calculator divides that
            figure by your cruise length to show a per-day value at risk, which makes it easier to
            compare a short, expensive cruise against a longer, cheaper one on the same footing. It also
            buckets your total fare into a rough exposure tier, since a $600 weekend cruise and a $6,000
            two-week cruise call for different levels of concern about the fare itself, even before
            cruise-specific features enter the picture.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The three checkboxes map directly to the three cruise-specific features this tool covers:
            missed connection or missed port coverage, itinerary change coverage, and cabin confinement
            coverage. Checking a box tells the calculator that scenario applies to your trip, and the
            checklist responds by flagging that feature as a priority to confirm in any policy you&apos;re
            considering. The tool deliberately does not calculate a specific dollar payout for any of
            these three features, because actual benefit amounts, waiting periods, and exclusions vary
            by insurer and by plan tier. What it gives you instead is a clear, specific list of what to
            ask about or search for in a policy&apos;s certificate of coverage before you buy.
          </p>

          <AdInArticle slot="tool-cruise-travel-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a traveler with a $2,400 non-refundable fare on a 7-night Caribbean cruise, flying in
            the morning of embarkation with a single connection. They check &ldquo;tight connection to
            embarkation&rdquo; and &ldquo;a changed port would bother me&rdquo; because two of the five stops are
            ports they specifically booked the cruise to visit, but leave the illness concern unchecked.
            The calculator shows $2,400 at risk, roughly $343 per day, and lands in the &ldquo;moderate
            financial exposure&rdquo; tier. The checklist flags missed connection/missed port coverage and
            itinerary change coverage as relevant to confirm, while noting cabin confinement coverage is
            still worth a quick check even though it wasn&apos;t flagged as a priority. That&apos;s a materially
            more specific starting point for comparing policies than a generic &ldquo;do I need travel
            insurance&rdquo; search would produce.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is assuming that any travel insurance policy, or even the
            cruise line&apos;s own add-on protection, automatically includes cruise-specific features simply
            because it was purchased for a cruise. Many policies marketed broadly as &ldquo;trip insurance&rdquo;
            are built around flight delays and hotel cancellations and either omit cabin confinement and
            missed port coverage entirely or bury them as an optional, separately priced upgrade. The
            fix is simple but easy to skip under booking-day time pressure: read the certificate of
            coverage for the three specific feature names this tool checks, rather than trusting a
            marketing page that says &ldquo;cruise coverage included.&rdquo;
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the fare you enter is genuinely non-refundable under your cruise
            line&apos;s cancellation schedule; it does not look up any specific cruise line&apos;s penalty
            tiers for you. The exposure tiers are a rough, informational grouping, not an underwriting
            standard used by any insurer. The checklist tells you which features are worth confirming
            based on your own answers; it cannot tell you whether a specific policy actually includes
            them, what the payout would be, or what exclusions apply, since those details vary by insurer
            and change over time. Treat every result here as a planning aid to bring into a comparison of
            actual policy documents, not as a substitute for reading the certificate of coverage or
            speaking with a licensed travel insurance agent.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Missed connection / missed port coverage</strong> — reimburses added expense or
              compensates for a missed portion of the cruise when a covered delay causes you to miss the
              ship or a scheduled port.
            </li>
            <li>
              <strong>Cabin confinement coverage</strong> — pays a benefit if the ship&apos;s onboard medical
              staff quarantines you to your cabin, most commonly during a contagious illness outbreak.
            </li>
            <li>
              <strong>Cruise line&apos;s own insurance vs. third-party travel insurance</strong> — cruise
              line add-ons are sold at booking, are typically administered by the cruise line or its
              underwriter, and often pay in future cruise credit; third-party travel insurance is bought
              independently, more commonly pays cash, and can bundle in cruise-specific riders alongside
              broader medical and evacuation coverage.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For broader guidance on travel medical coverage while abroad, the{" "}
            <a
              href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/your-health-abroad/insurance-providers-overseas.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of State
            </a>{" "}
            publishes an overview of travel insurance providers and what overseas medical coverage
            typically requires. The{" "}
            <a
              href="https://wwwnc.cdc.gov/travel/page/cruise-ship-travel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              CDC&apos;s Travelers&apos; Health program
            </a>{" "}
            covers health considerations specific to cruise ship travel, and the{" "}
            <a
              href="https://www.cdc.gov/nceh/vsp/default.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              CDC Vessel Sanitation Program
            </a>{" "}
            monitors and reports on gastrointestinal illness aboard cruise ships, the exact category of
            event cabin confinement coverage responds to. For general travel insurance concepts, the{" "}
            <a
              href="https://www.iii.org/article/travel-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how trip cancellation, interruption, and medical benefits typically work together.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/travel" className="text-blue-600 hover:underline">
              Travel insurance tools
            </Link>{" "}
            category. For the underlying non-refundable-fare math applied to non-cruise trips, see the{" "}
            <Link href="/tools/travel/trip-cancellation-coverage-calculator" className="text-blue-600 hover:underline">
              trip cancellation coverage calculator
            </Link>
            . Once you&apos;ve sized your cancellation exposure, the{" "}
            <Link href="/tools/travel/travel-medical-insurance-calculator" className="text-blue-600 hover:underline">
              travel medical insurance calculator
            </Link>{" "}
            helps you check the medical and evacuation side of the same trip.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific coverage questions
            general advice columns tend to skip over. This one exists because a cruise is not just a
            trip with a boat attached to it, and the insurance decisions around it deserve tools that
            treat it that way.
          </p>
        </section>
      </div>
    </>
  );
}

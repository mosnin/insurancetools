import type { Metadata } from "next";
import Link from "next/link";
import { MedicalEvacuationCoverageCalculatorTool } from "@/components/tools/MedicalEvacuationCoverageCalculatorTool";
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

const tool = getToolBySlug("medical-evacuation-coverage-calculator")!;

const TITLE = "Medical Evacuation Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this medical evacuation insurance calculator to check your policy's evacuation sublimit against your trip's remoteness and get a clear action checklist.";
const PAGE_URL = `${SITE_URL}/tools/travel/medical-evacuation-coverage-calculator`;

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
    question: "Does this medical evacuation insurance calculator tell me what an evacuation will cost?",
    answer:
      "No, and deliberately so. A real medical evacuation's cost depends on your exact location, distance to an adequate hospital, aircraft or vessel availability, and how many transport legs are needed, all of which vary too widely for a single figure to be honest. Instead of guessing a dollar amount, the tool turns your destination's remoteness and your own known sublimit into a prioritized checklist of what to confirm with your insurer before you travel.",
  },
  {
    question: "What counts as \"very remote\" for this tool's self-assessment?",
    answer:
      "Think backcountry hiking or mountaineering routes, open-water sailing or expedition cruising to isolated ports, high-altitude trekking well above where vehicles can reach, or any itinerary where the nearest adequate hospital is a flight, not a drive, away. If any single leg of your trip fits that description, treat the whole trip as remote for planning purposes, since a policy that looks fine for the rest of the itinerary may not have been priced with that leg in mind.",
  },
  {
    question: "I already have travel medical insurance. Isn't evacuation automatically included?",
    answer:
      "Sometimes, but not always at a limit that matches a genuine remote-area evacuation, and that gap is the single most common mistake this tool is built to catch. Many bundled travel medical and trip-cancellation plans include a modest built-in evacuation benefit, priced for routine cases, not for a multi-leg helicopter-and-air-ambulance evacuation from a remote region. Check your policy's declarations page for the specific evacuation or medical transport sublimit rather than assuming a brochure phrase like \"emergency evacuation included\" means an unlimited or even adequate benefit.",
  },
  {
    question: "What's the difference between medical evacuation and repatriation?",
    answer:
      "Medical evacuation moves you to the nearest facility capable of treating your condition, which might still be in the country you're visiting. Repatriation is the separate step of returning you to your home country once you're stable enough to travel, either for continued care or, in the worst case, to return remains. Some policies cover both at the same limit, some cap them separately, and some cover only one, which is exactly the kind of distinction worth confirming before departure rather than after an emergency.",
  },
  {
    question: "Do I need a separate evacuation membership if I already have travel insurance?",
    answer:
      "It depends on your destination and your existing sublimit, which is exactly what this checklist walks through. Dedicated evacuation memberships are built specifically around organizing and funding transport from remote or high-altitude locations, and they typically emphasize logistics and coordination, arranging the aircraft and medical escort, in addition to a dollar limit. For accessible, urban travel, a standalone membership is less commonly necessary. For genuinely remote or high-altitude trips, it's worth pricing one alongside your existing coverage rather than assuming your bundled sublimit was built for that scenario.",
  },
  {
    question: "Is this tool's checklist a guarantee that I'm adequately covered?",
    answer:
      "No. It's a planning checklist built from your own remoteness self-assessment and whatever sublimit you've entered, not a review of your actual policy document or a substitute for speaking with your insurer. Only your policy's specific terms, exclusions, and per-incident limits determine what an evacuation claim would actually pay. Use this tool to know which questions to ask before you travel, then confirm the answers directly with your insurer or a licensed travel insurance agent.",
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

export default function MedicalEvacuationCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Medical Evacuation Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Answer two honest questions about your trip and your policy, and get a prioritized checklist
            for whether your current evacuation coverage actually fits a remote or high-altitude itinerary.
          </p>
          <LastUpdated category="travel" />
        </div>

        <div className="mt-2">
          <MedicalEvacuationCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-medical-evacuation-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why Remote Destinations Change the Math
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A sprained ankle in a city with a modern hospital a short taxi ride away is an inconvenience.
            The same injury on a high-altitude trekking route, days from a road, or aboard a ship between
            isolated ports, can require a helicopter, a chartered aircraft, a medical escort, and more than
            one leg of transport before you reach equivalent care. This isn&apos;t a hypothetical risk;
            it&apos;s the well-documented reason government travel health guidance and outdoor recreation
            organizations routinely recommend that travelers heading somewhere remote look specifically at
            their medical evacuation coverage rather than assuming a general travel insurance policy has it
            handled. This calculator doesn&apos;t attempt to price that scenario, since a real evacuation&apos;s
            cost depends on exactly where you are and what transport is actually available there. What it
            does is turn the honest, well-established shape of that risk into a checklist you can act on
            before you leave, not after something goes wrong.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Checklist Is Built For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is aimed at travelers whose itinerary includes at least one leg that a standard
            travel medical policy wasn&apos;t necessarily priced around: backcountry and wilderness hikers,
            high-altitude trekkers heading well above where vehicles can reach, expedition travelers on
            multi-week trips through areas with limited medical infrastructure, and cruise passengers whose
            route includes remote or isolated ports where the ship&apos;s medical bay is the only care for
            hours or days. It&apos;s equally useful for someone who already bought a travel medical or
            trip-cancellation bundle and simply hasn&apos;t checked what the evacuation portion of it actually
            covers, which describes most travelers, since evacuation sublimits are rarely the headline
            feature on a policy&apos;s marketing page.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Checklist Is Built</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You tell the tool two things: how remote your destination or activity is, using a plain
            self-assessment rather than a scored risk model, and whether you already know your current
            policy&apos;s stated evacuation or medical transport sublimit. From there, the tool prioritizes a
            short list of items to confirm, weighted by remoteness. If you haven&apos;t checked your sublimit
            yet, that becomes the top item regardless of destination, since you can&apos;t evaluate coverage
            you haven&apos;t looked up. If your trip is very remote or involves high altitude, the checklist
            adds items about repatriation, about whether your provider coordinates transport logistics or
            only reimburses after the fact, and about whether a dedicated evacuation membership is worth
            pricing alongside your existing policy. Every item reflects commonly cited travel insurance
            guidance about what remote-area coverage should include, not a computed dollar recommendation,
            because inventing a specific evacuation cost figure would be less honest than telling you what
            to go check.
          </p>

          <AdInArticle slot="tool-medical-evacuation-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a traveler booking a two-week trek that spends several days above 14,000 feet, well
            past where a vehicle could reach in an emergency. Their existing coverage is a trip-cancellation
            bundle purchased mainly to protect the cost of flights and permits, and they haven&apos;t looked at
            its evacuation section closely. Selecting &ldquo;very remote / wilderness / high altitude&rdquo; and
            leaving the sublimit field at $0 produces a high-priority result: confirm the exact evacuation
            sublimit in writing, check specifically whether repatriation is included alongside the initial
            evacuation, ask whether the insurer coordinates transport logistics directly or only reimburses
            afterward, and price a dedicated evacuation membership built for high-altitude and wilderness
            scenarios. That&apos;s a materially more useful starting point than assuming the bundled policy
            &ldquo;probably covers it,&rdquo; which is the exact assumption that leaves trekkers exposed on this kind
            of itinerary.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Checklist Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is treating trip-cancellation insurance and medical evacuation coverage
            as the same product because they&apos;re often sold in the same bundle. Trip-cancellation
            coverage protects non-refundable trip costs; evacuation coverage protects your ability to get to
            adequate medical care, and the two can carry very different limits within one policy. A second
            mistake is reading &ldquo;emergency evacuation included&rdquo; on a marketing page and assuming that
            means an adequate, uncapped, or even clearly stated dollar limit, when the actual sublimit is
            often buried several pages into the policy document. A third is assuming a policy priced for a
            standard international trip automatically extends the same evacuation logistics to a high
            altitude, open-water, or backcountry leg of that same trip, when insurers sometimes price or
            structure that portion differently.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The remoteness selector is a self-assessment prompt, not a scored geographic risk model; it
            asks you to judge your own itinerary honestly rather than looking up your coordinates against a
            database. The checklist priorities reflect commonly cited, general travel insurance guidance
            about what remote-area coverage should include, not a review of any specific policy you hold or
            a substitute for reading your policy&apos;s actual terms, exclusions, and per-incident limits. This
            tool cannot see your policy document, does not know your insurer&apos;s claims process, and does
            not estimate a dollar cost for an evacuation, since real costs vary too widely by region and
            circumstance to state honestly as a single figure. Confirm every item on the checklist directly
            with your insurer or a licensed travel insurance agent before you rely on it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Medical evacuation</strong> — transport to the nearest medical facility capable of
              treating your condition, which may still be within the country you&apos;re visiting.
            </li>
            <li>
              <strong>Repatriation</strong> — the separate step of returning you to your home country once
              you are stable, for continued care or, in the worst case, to return remains.
            </li>
            <li>
              <strong>Evacuation sublimit</strong> — the specific dollar cap a policy places on evacuation
              or medical transport benefits, which can be lower than the policy&apos;s overall medical limit.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            The{" "}
            <a
              href="https://travel.state.gov/content/travel/en/international-travel/before-you-go/your-health-abroad/insurance-providers-overseas.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of State
            </a>{" "}
            publishes guidance on evaluating travel medical and evacuation insurance before an international
            trip. The{" "}
            <a
              href="https://wwwnc.cdc.gov/travel/page/insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              CDC&apos;s travel health insurance guidance
            </a>{" "}
            explains what travel medical and medical evacuation policies typically address, including for
            travelers heading to areas with limited medical infrastructure. The National Association of
            Insurance Commissioners&apos;{" "}
            <a
              href="https://content.naic.org/consumer/travel-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              travel insurance consumer guide
            </a>{" "}
            covers how evacuation benefits are typically structured within a bundled travel policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/travel" className="text-blue-600 hover:underline">
              Travel insurance tools
            </Link>{" "}
            category. If your main concern is routine medical costs abroad rather than remote-area
            evacuation specifically, the{" "}
            <Link href="/tools/travel/travel-medical-insurance-calculator" className="text-blue-600 hover:underline">
              travel medical insurance calculator
            </Link>{" "}
            estimates that broader exposure. If you&apos;re also weighing whether to insure the trip cost
            itself against cancellation, the{" "}
            <Link href="/tools/travel/trip-cancellation-coverage-calculator" className="text-blue-600 hover:underline">
              trip cancellation coverage calculator
            </Link>{" "}
            covers that separate decision.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools is a free library of browser-based calculators for planning insurance coverage
            before you buy it, from routine policy comparisons to trip-specific risks like this one.
            Nothing you enter here leaves your browser, so you can work through the checklist honestly
            before you call an insurer or a licensed travel insurance agent.
          </p>
        </section>
      </div>
    </>
  );
}

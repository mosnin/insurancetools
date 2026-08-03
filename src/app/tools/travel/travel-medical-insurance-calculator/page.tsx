import type { Metadata } from "next";
import Link from "next/link";
import { TravelMedicalInsuranceCalculatorTool } from "@/components/tools/TravelMedicalInsuranceCalculatorTool";
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

const tool = getToolBySlug("travel-medical-insurance-calculator")!;

const TITLE = "Travel Medical Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this travel medical insurance calculator to estimate your worst-case medical exposure abroad and see how much protection a small premium actually buys.";
const PAGE_URL = `${SITE_URL}/tools/travel/travel-medical-insurance-calculator`;

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
    question: "Does my regular U.S. health insurance cover me when I travel internationally?",
    answer:
      "It depends entirely on your specific plan, so you need to confirm the answer with your own insurer before you travel. Original Medicare generally does not cover care received outside the United States except in a few narrow situations. Many employer and marketplace plans built around a PPO or HMO network also stop providing normal in-network benefits once you leave the country, sometimes leaving you with only out-of-network or emergency-only terms. Call the member services number on your insurance card and ask specifically about international coverage before you assume anything.",
  },
  {
    question: "Where does this calculator get its daily medical cost estimate?",
    answer:
      "It doesn't generate one for you, and that's intentional. Actual medical costs vary enormously by country and by the specific care needed, and publishing a single number as if it applied everywhere would be misleading. Instead, you enter your own worst-case daily estimate, informed by research on your specific destination through resources like the U.S. Department of State's country-specific pages or a quote from a travel medical insurer. The calculator's job is the exposure math, not the cost research.",
  },
  {
    question: "Why does the calculator use a spending ceiling instead of just multiplying days by cost?",
    answer:
      "A straight multiplication can produce an unrealistically large number over a long trip, which makes the exposure estimate less useful for decision-making. The ceiling represents a more realistic worst-case cap, such as a single serious hospitalization or medical evacuation, rather than assuming every day of the trip involves that same daily cost. You can raise or lower the ceiling yourself depending on how cautious you want the estimate to be.",
  },
  {
    question: "Is medical evacuation included in the exposure this tool estimates?",
    answer:
      "Not automatically. Medical evacuation, transport to a facility capable of treating you or transport back to the United States, is frequently priced and sold as a separate benefit or a separate policy entirely, and it can cost far more than routine treatment. If evacuation coverage matters to your trip, check that specifically when comparing policies rather than assuming a standard travel medical plan includes it at a meaningful limit.",
  },
  {
    question: "What does primary versus secondary coverage mean for a travel medical policy?",
    answer:
      "Primary coverage pays claims directly without requiring you to bill another insurer first, which matters abroad because your domestic health plan often can't be billed by a foreign provider at all. Secondary coverage only pays after another applicable insurance has paid or denied a claim, which can slow down reimbursement in a country where you're expected to pay a foreign hospital directly. When comparing travel medical quotes, check which structure you're being offered.",
  },
  {
    question: "Is a travel medical insurance calculator result a guarantee of what I'll pay?",
    answer:
      "No. This is a planning estimate built from numbers you supply, not a prediction of actual costs or a substitute for reading a policy's specific terms, exclusions, and limits. Pre-existing condition exclusions, sport and activity exclusions, and per-incident limits can all reduce what an actual policy would pay in a real claim. Review the policy document itself, and ask the insurer directly about anything that affects your specific trip.",
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

export default function TravelMedicalInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Travel Medical Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Estimate what a medical emergency abroad could actually cost you out of pocket, and see how
            much protection a travel medical insurance policy buys for the premium you&apos;ve been quoted.
          </p>
          <LastUpdated category="travel" />
        </div>

        <div className="mt-2">
          <TravelMedicalInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-travel-medical-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Assumption That Gets Travelers in Trouble
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Ask most U.S. travelers whether their health insurance covers them overseas, and the honest
            answer is that they&apos;ve never actually checked. That gap matters because it&apos;s a
            well-documented one, not a rare edge case. Original Medicare, which covers a large share of
            American travelers over 65, generally does not pay for care received outside the United
            States except in a small number of specific situations, a limitation Medicare itself
            publishes. Employer and marketplace plans built around a PPO or HDHP network face a quieter
            version of the same problem: the network that makes your plan affordable at home usually
            doesn&apos;t exist once you cross a border, which can leave you paying full retail price for
            care that would have been a modest copay domestically. This travel medical insurance
            calculator exists to put a number on that gap before a trip, not after a hospital bill
            arrives.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone booking international travel who has not specifically confirmed
            their own health plan&apos;s international terms, which in practice is most people. It&apos;s
            especially relevant for Medicare beneficiaries planning a trip abroad, since the coverage gap
            there is both common and well documented, and for anyone whose employer plan is a narrow
            regional network rather than a national PPO. It&apos;s also useful for comparing two travel
            medical quotes side by side: run the same trip length and cost assumption through both, and
            compare the leverage each premium buys.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Exposure Estimate Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator multiplies your trip length in days by a worst-case daily medical cost figure
            that you supply, then caps the result at an exposure ceiling you also control. The daily cost
            figure is deliberately left to you rather than generated by the tool, because actual medical
            costs vary enormously by country, by facility, and by the specific care required, and
            presenting a single average as if it applied everywhere would be a fabrication rather than a
            useful estimate. Research your destination&apos;s costs through your travel medical insurer&apos;s
            quote tool or the U.S. Department of State&apos;s country-specific information pages before
            entering a number here. The ceiling exists so a long trip doesn&apos;t produce an unrealistically
            enormous total; it represents a single serious event, such as a hospitalization, rather than
            every day of the trip costing the same worst-case amount. Once you enter a quoted premium, the
            calculator shows the leverage that premium buys against the exposure, which is the real
            argument for travel medical coverage: a relatively small, fixed cost standing in for a much
            larger, unpredictable one.
          </p>

          <AdInArticle slot="tool-travel-medical-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a 10-day trip where the traveler estimates a worst-case daily medical cost of $2,500
            based on research into their destination&apos;s typical hospital rates, with a $250,000 exposure
            ceiling left at the default. The raw calculation, 10 days times $2,500, comes to $25,000, which
            stays well under the ceiling so it isn&apos;t capped. A travel medical policy quoted at $85 for
            the trip is being compared against that $25,000 of estimated exposure, which works out to
            roughly 294 times leverage: an $85 premium standing in for a potential $25,000 out-of-pocket
            cost. That ratio, not the premium amount by itself, is the number worth paying attention to
            when deciding whether a quoted policy is worth buying.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming a domestic PPO network extends internationally simply
            because the plan is described as having a large or national network; &ldquo;national&rdquo; almost
            always means national to the United States. A close second is confusing travel medical
            insurance with trip cancellation insurance, two different products often bundled into the
            same policy but covering entirely different risks, medical costs versus non-refundable trip
            expenses. A third is assuming any travel medical policy automatically includes medical
            evacuation at a meaningful limit, when evacuation coverage is frequently priced and sold
            separately and can be the single largest cost in a genuine emergency abroad.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator treats the daily cost and exposure ceiling you enter as reasonable planning
            inputs, not verified facts about any specific country&apos;s healthcare system; it does not look
            up, store, or fabricate country-specific medical pricing data. It does not know the specific
            terms, exclusions, or per-incident limits of any travel medical policy you&apos;re considering,
            including pre-existing condition exclusions or activity-based exclusions that could reduce
            what a real claim would pay. It also does not evaluate your existing domestic health plan;
            confirm your plan&apos;s exact international terms directly with your insurer rather than relying
            on any general statement here, since coverage details vary by plan even within the same
            insurer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Travel medical insurance</strong> — a short-term policy that pays for eligible
              medical treatment during a specific trip, separate from trip cancellation or baggage
              coverage.
            </li>
            <li>
              <strong>Medical evacuation coverage</strong> — pays to transport you to an adequate medical
              facility or back to your home country when local care isn&apos;t sufficient; often sold
              separately from routine treatment coverage.
            </li>
            <li>
              <strong>Primary vs. secondary coverage</strong> — primary coverage pays a claim directly,
              while secondary coverage pays only after another applicable insurance has paid or denied the
              claim first.
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
            publishes guidance on travel medical insurance and lists providers by destination. The{" "}
            <a
              href="https://www.medicare.gov/coverage/travel-outside-the-united-states"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Medicare.gov coverage page
            </a>{" "}
            explains exactly when Original Medicare does and does not pay for care outside the United
            States. The{" "}
            <a
              href="https://wwwnc.cdc.gov/travel/page/insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              CDC&apos;s travel health insurance guidance
            </a>{" "}
            covers what travel medical and medical evacuation policies typically address. The National
            Association of Insurance Commissioners&apos;{" "}
            <a
              href="https://content.naic.org/consumer/travel-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              travel insurance consumer guide
            </a>{" "}
            explains how travel medical coverage differs from trip cancellation coverage within a bundled
            policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/travel" className="text-blue-600 hover:underline">
              Travel insurance tools
            </Link>{" "}
            category. If evacuation cost is your main concern rather than routine treatment, the{" "}
            <Link href="/tools/travel/medical-evacuation-coverage-calculator" className="text-blue-600 hover:underline">
              medical evacuation coverage calculator
            </Link>{" "}
            looks at that risk specifically. If you&apos;re also weighing whether to insure the trip cost
            itself, the{" "}
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
            Insurance Tools builds free, browser-based calculators that help travelers, homeowners, and
            drivers understand coverage before they buy it. Nothing you type into this calculator is
            collected or sent anywhere, so you can run your own numbers freely before calling an agent or
            comparing quotes.
          </p>
        </section>
      </div>
    </>
  );
}

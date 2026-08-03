import type { Metadata } from "next";
import Link from "next/link";
import { FloodInsuranceNeedCalculatorTool } from "@/components/tools/FloodInsuranceNeedCalculatorTool";
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

const tool = getToolBySlug("flood-insurance-need-calculator")!;

const TITLE = "Flood Insurance Need Calculator | Insurance Tools";
const DESCRIPTION =
  "The flood insurance need calculator totals your uninsured flood exposure from dwelling and personal property value, since standard homeowners policies exclude flood damage entirely.";
const PAGE_URL = `${SITE_URL}/tools/home/flood-insurance-need-calculator`;

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
    question: "Does this flood insurance need calculator tell me if I'm in a flood zone?",
    answer:
      "No, and it deliberately doesn't try to guess. Determining your actual FEMA flood zone requires official geographic and elevation data tied to your specific address, which a browser-based tool has no access to. This calculator only totals your uninsured financial exposure from the dwelling and personal property values you enter. To check your actual flood zone, use FloodSmart.gov's address lookup tool or ask a licensed insurance agent.",
  },
  {
    question: "Why doesn't my homeowners policy already cover flood damage?",
    answer:
      "Flood damage is a standard, explicit exclusion in virtually every homeowners insurance policy sold in the United States. Homeowners insurance covers sudden water damage from things like a burst pipe or a storm-damaged roof, but rising water from outside the home, whether from heavy rain, storm surge, or an overflowing river, falls under a separate flood policy, typically through the National Flood Insurance Program or a private flood insurer. This is one of the most common coverage gaps homeowners discover only after a claim is denied.",
  },
  {
    question: "I'm not in a high-risk flood zone. Do I still need this calculator?",
    answer:
      "It's still useful. Flood risk is not confined to FEMA's mapped high-risk zones; heavy rainfall, flash flooding, and drainage failures can cause significant flood losses well outside those boundaries, which is part of why FEMA maps are periodically revised and why many flood claims come from policyholders outside the highest-risk designations. This calculator doesn't tell you your risk level, but it does show you exactly how much you'd be exposed to if a flood occurred and you had no flood policy at all.",
  },
  {
    question: "What should I enter for dwelling value?",
    answer:
      "Use the estimated cost to rebuild your home at current construction prices, not its market value or purchase price. Market value includes land, which doesn't need to be rebuilt after a flood, so using it would overstate or understate your real exposure. If you have a recent replacement cost estimate from your homeowners insurer, that figure works well here.",
  },
  {
    question: "Is the premium comparison in this tool an actual flood insurance quote?",
    answer:
      "No. The premium field only works with a number you already have, whether from an NFIP quote, a private flood insurer, or a rough estimate, and shows what fraction of your total exposure that premium would protect. It doesn't generate a quote of its own. Get an actual quote from FloodSmart.gov or a licensed agent once you know your flood zone.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Home Calculators", href: "/tools/home" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function FloodInsuranceNeedCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Flood Insurance Need Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See exactly how much of your home and belongings would go uninsured in a flood, since
            standard homeowners policies exclude flood damage entirely. Free, instant, and it never
            asks who you are.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <FloodInsuranceNeedCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-flood-need-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs a Flood Insurance Need Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most homeowners find out flood damage isn&apos;t covered at the worst possible time: after
            water is already in the house and a claim has already been filed. This calculator exists for
            the moment before that happens. It&apos;s built for homeowners who&apos;ve never priced flood
            insurance because they assumed their homeowners policy already handled it, buyers evaluating
            a home in an area they&apos;re unfamiliar with, and anyone who&apos;s seen a flood insurance quote
            and wants to know whether the price makes sense relative to what it would actually protect.
            None of those situations require you to already know your FEMA flood zone. What they require
            is a clear, honest number for what&apos;s at stake if a flood happens and you&apos;re not covered,
            which is exactly what this tool produces.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why Homeowners Insurance Doesn&apos;t Cover This
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every standard homeowners insurance policy sold in the United States carries an explicit
            flood exclusion. It&apos;s not a gap in coverage that varies by insurer or state; it&apos;s a
            structural feature of how the product is built. Homeowners policies pay for sudden, accidental
            water damage from sources inside the home, a burst supply line, an overflowing bathtub, wind-
            driven rain through a damaged roof. What they do not pay for is rising water from outside the
            home: floodwater from heavy rainfall, storm surge, snowmelt, or an overflowing river or lake.
            That distinction is the entire reason a separate flood insurance market exists, built primarily
            around the National Flood Insurance Program (NFIP), with a smaller private flood insurance
            market alongside it. If you&apos;ve never bought a separate flood policy, the number this
            calculator produces is effectively your current flood coverage: zero.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Flood Risk Isn&apos;t Confined to Mapped High-Risk Zones
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            It&apos;s tempting to treat FEMA&apos;s flood maps as a simple yes-or-no answer: inside the
            high-risk zone, buy flood insurance; outside it, skip it. The reality is messier. Flood maps
            are built from historical data and modeling that gets revised periodically as development,
            drainage patterns, and rainfall trends change, and they are better at describing riverine and
            coastal flood risk than the flash flooding and drainage failures that heavy rainfall can cause
            almost anywhere. A meaningful share of flood losses nationally occur outside the highest-risk
            mapped zones, which is well documented by flood insurance regulators and researchers even
            though the exact share shifts from year to year and event to event. That&apos;s the practical
            reason this calculator focuses on exposure rather than pretending to hand you a risk score:
            the map isn&apos;t the whole story, and the dollar amount at stake doesn&apos;t change based on
            which side of a boundary line your home happens to sit on.
          </p>

          <AdInArticle slot="tool-flood-need-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Enter your home&apos;s dwelling value, meaning the cost to rebuild the structure at current
            construction prices, not what it would sell for and not what you paid. If your homeowners
            insurer has already given you a replacement cost estimate, use that number here. Next, enter
            your personal property value: a rough total for furniture, appliances, electronics, and
            belongings inside the home. The calculator adds the two together instantly to show your total
            uninsured flood exposure. If you&apos;ve already gotten a flood insurance premium quote, enter
            it in the third field to see it expressed as a percentage of the exposure it would protect,
            which makes the price easier to evaluate than the raw dollar figure alone.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a homeowner with a $280,000 rebuild cost on the structure and roughly $60,000 in
            furniture, electronics, and other belongings. Their total uninsured flood exposure is
            $340,000, the full amount they&apos;d have to cover out of pocket, through savings, a loan, or
            federal disaster assistance (which is typically a loan, not a grant, and rarely covers the
            full loss) if a flood struck and they carried no flood policy. Suppose they then get an NFIP
            quote of $900 a year. That premium works out to roughly 0.26% of their exposure, or about
            $378 of coverage for every dollar of annual premium, a comparison that makes the cost of the
            policy concrete against what it&apos;s actually protecting rather than an abstract monthly bill.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming homeowners insurance already covers flood damage until a
            denied claim proves otherwise. A close second is using a home&apos;s market value instead of its
            rebuild cost, which inflates the exposure number by including land value that doesn&apos;t need
            to be reconstructed after a flood. A third is underestimating personal property, since most
            homeowners have never actually itemized what&apos;s inside their home and tend to guess low until
            they try to list it room by room. A fourth is treating a flood insurance premium as expensive
            in isolation, without ever comparing it against the size of the exposure it&apos;s removing.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the dwelling and personal property values you enter are reasonably
            accurate estimates; it does not verify them against any appraisal, insurer record, or public
            data source. It does not determine your FEMA flood zone, your property&apos;s elevation, local
            drainage conditions, historical flood events at your address, or whether flood insurance is
            required by your mortgage lender, all of which depend on data this browser-based tool cannot
            access. It also does not account for basement or below-grade coverage limitations, which NFIP
            policies handle differently than main living areas, or for additional living expenses during
            a flood-related displacement. Treat the exposure figure as a planning number that motivates
            checking your actual flood zone and getting a real quote, not as a substitute for either.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Flood exclusion</strong> — the standard clause in homeowners and renters policies
              that removes coverage for damage caused by flooding, requiring a separate flood policy.
            </li>
            <li>
              <strong>National Flood Insurance Program (NFIP)</strong> — the federal program, managed by
              FEMA, that underwrites most residential flood insurance policies in the United States.
            </li>
            <li>
              <strong>Dwelling value</strong> — the cost to rebuild a home&apos;s structure at current
              construction prices, distinct from market value or purchase price.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            To check your actual flood zone and get a real quote, use{" "}
            <a
              href="https://www.floodsmart.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              FloodSmart.gov
            </a>
            , the National Flood Insurance Program&apos;s official site. For a plain-language explainer of
            what standard homeowners insurance does and doesn&apos;t cover, see the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>
            , and for general consumer guidance on coverage types and definitions, the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes a consumer resource center worth reviewing before you buy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. Once you know your exposure, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            can help you size other policy limits the same way, and if you&apos;re working through an
            actual flood damage claim rather than planning ahead of one, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            are the closer fit.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that make coverage gaps, costs, and
            claims easier to understand before you talk to an agent, not instead of talking to one. No
            account, no data collection beyond what you type in, and no pretending to know more about
            your specific property than a public tool honestly can.
          </p>
        </section>
      </div>
    </>
  );
}

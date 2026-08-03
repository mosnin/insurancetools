import type { Metadata } from "next";
import Link from "next/link";
import { LowMileageDiscountEstimatorTool } from "@/components/tools/LowMileageDiscountEstimatorTool";
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

const tool = getToolBySlug("low-mileage-discount-estimator")!;

const TITLE = "Low-Mileage Discount Calculator | Insurance Tools";
const DESCRIPTION =
  "Run a low mileage discount calculator on your own premium and mileage to see the dollar savings from a low-mileage discount, plus how insurers typically define low mileage.";
const PAGE_URL = `${SITE_URL}/tools/auto/low-mileage-discount-estimator`;

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
    question: "Does this low mileage discount calculator know my insurer's actual discount rate?",
    answer:
      "No, and it doesn't try to guess one. Low-mileage discount percentages and the mileage thresholds that trigger them are set individually by each insurer, and they aren't published in a single standardized table. Enter the percentage from your own quote, declarations page, or a conversation with your agent, and the calculator does the multiplication against your premium so you can see the dollar impact instantly.",
  },
  {
    question: "What mileage counts as \"low mileage\" for insurance purposes?",
    answer:
      "It depends on the insurer. Many low-mileage programs are built around roughly 7,500 miles a year as a comfortable qualifying level, with some extending consideration up to around 12,000 miles a year, but there's no single rule every company follows, and some insurers use usage-based or telematics programs instead of a flat annual cutoff. Ask your insurer directly what their threshold is rather than assuming a number.",
  },
  {
    question: "How do I get an accurate annual mileage estimate if I've never tracked it?",
    answer:
      "Write down your odometer reading today, then check it again after two to three weeks of your normal driving routine and multiply the difference by roughly 17 to 26 to annualize it, or simply wait a full month and multiply by 12. A rough guess that undercounts your driving can create problems later if an insurer verifies mileage through an odometer check or a telematics device, so it's worth the short wait to get a number you trust.",
  },
  {
    question: "Will a low-mileage discount replace the need to compare quotes from other insurers?",
    answer:
      "No. A low-mileage discount lowers the premium your current insurer already quoted you, but a different insurer might price your risk lower to begin with, discount or not. Use this calculator to understand what a specific discount is worth in dollars, and use that figure alongside quotes from other companies rather than instead of them.",
  },
  {
    question: "Does driving less always lower my car insurance cost?",
    answer:
      "Usually, but not automatically. Annual mileage is one factor among many insurers weigh, including your driving record, location, vehicle, and coverage limits, so a lower mileage figure doesn't guarantee a lower price on its own, and not every insurer offers a distinct low-mileage discount at all. It's still worth asking, since it costs nothing to check and the potential savings can be meaningful for genuinely low-mileage drivers.",
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

export default function LowMileageDiscountEstimatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Low-Mileage Discount Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter your premium, your actual annual mileage, and the discount percentage from your own
            quote to see exactly what a low-mileage discount is worth in dollars — not a generic estimate.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <LowMileageDiscountEstimatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-low-mileage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Some drivers rack up far fewer miles than the assumptions baked into a standard quote: retirees
            who no longer commute, remote workers who left the daily drive behind, a second car that mostly
            sits in the driveway, or anyone who switched to biking, walking, or transit for most trips.
            None of that shows up automatically on a policy unless it&apos;s reported, which is exactly the gap
            this calculator is built to close. If you already have a discount percentage from a quote or
            your current declarations page, this tool turns that percentage into an actual dollar figure in
            seconds, so you can judge whether it&apos;s worth the paperwork to report your mileage or switch
            coverage.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Math Behind the Estimate</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculation itself is intentionally simple: your entered annual premium, multiplied by the
            discount percentage you supply, equals your estimated annual savings. Divide that by 12 for a
            monthly figure, and subtract it from your original premium to see roughly where your policy
            would land after the discount. What this tool deliberately does not do is invent that discount
            percentage for you. Insurers set their own low-mileage thresholds and their own discount rates,
            and those numbers aren&apos;t published in one place a calculator could reliably pull from, so
            asking you to enter the figure from your own quote keeps the output honest rather than
            confidently wrong.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The mileage field feeds a separate, purely informational note rather than the math itself. It
            compares your entered mileage against ranges commonly cited for low-mileage programs, roughly
            under 7,500 miles a year on the low end and up to around 12,000 miles a year on the higher end,
            while being explicit that these are commonly cited figures, not a rule every insurer follows.
            Your actual eligibility depends entirely on your insurer&apos;s specific program.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a driver pays $1,400 a year for their policy and now works from home, driving closer to
            6,000 miles a year instead of the 12,000-mile estimate on file. Their insurer quotes a 10%
            low-mileage discount once verified mileage is reported. Plugging in $1,400, 6,000 miles, and
            10% produces an estimated annual savings of $140, or about $11.67 a month, bringing the
            estimated premium down to roughly $1,260 a year. That $140 might not be dramatic on its own,
            but stacked across several years of a policy, or combined with other discounts, it&apos;s a
            concrete number worth the few minutes it takes to report an odometer reading.
          </p>

          <AdInArticle slot="tool-low-mileage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is underestimating annual mileage out of habit, carrying forward a
            number from years ago without rechecking it, or rounding down because a lower figure sounds
            better without verifying it against an actual odometer reading. Insurers that verify mileage
            through periodic odometer checks, photo submissions, or telematics devices can catch a low
            estimate that doesn&apos;t hold up, which can complicate a claim or trigger a premium correction
            later. A second common mistake is assuming every insurer offers the same discount at the same
            threshold; some don&apos;t offer a distinct low-mileage discount at all, folding usage into a
            broader telematics or pay-per-mile program instead, so it&apos;s worth asking directly rather than
            assuming the discount exists.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the discount percentage you enter is accurate and applies to your full
            annual premium, which is a simplification; some insurers apply a low-mileage discount only to
            certain coverage components rather than the entire policy. It does not know your insurer&apos;s
            actual mileage threshold, verification requirements, or whether a low-mileage program exists on
            your specific policy. The mileage-band note is informational only, describing commonly cited
            ranges rather than a fixed industry standard, and it should never be treated as confirmation
            that you qualify. Treat every figure here as a planning estimate to bring into a conversation
            with your insurer or a licensed agent, not as a guaranteed savings amount.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Worth Knowing</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Low-mileage discount</strong> — a premium reduction some insurers offer to drivers
              whose verified annual mileage falls under a threshold the insurer sets.
            </li>
            <li>
              <strong>Usage-based insurance</strong> — a broader category of pricing that adjusts premiums
              based on actual driving data, such as mileage, speed, or braking, often collected through a
              telematics app or plug-in device rather than a flat annual estimate.
            </li>
            <li>
              <strong>Annual mileage estimate</strong> — the figure a driver reports at policy setup or
              renewal describing expected yearly driving distance, used by insurers as one input among
              several when pricing risk.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how mileage and usage-based pricing fit into a standard auto policy, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on how auto insurers price coverage, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the factors that commonly affect a personal auto premium. The{" "}
            <a
              href="https://www.iii.org/article/usage-based-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s overview of usage-based insurance
            </a>{" "}
            covers how telematics-driven programs differ from a flat low-mileage discount. Before assuming
            a discount applies, confirm your insurer&apos;s specific program and reporting requirements
            through your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or a licensed agent.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you&apos;re also reviewing your liability limits and other coverage decisions, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            sizes a liability limit to your actual assets and income, and the{" "}
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
            Insurance Tools builds free, browser-based calculators for the specific questions that come up
            when shopping for or reviewing insurance coverage. Nothing you type here is stored or sent
            anywhere — every result is computed on your device so you can experiment freely before ever
            talking to an agent.
          </p>
        </section>
      </div>
    </>
  );
}

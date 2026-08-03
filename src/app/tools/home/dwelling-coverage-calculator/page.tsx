import type { Metadata } from "next";
import Link from "next/link";
import { DwellingCoverageCalculatorTool } from "@/components/tools/DwellingCoverageCalculatorTool";
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

const tool = getToolBySlug("dwelling-coverage-calculator")!;

const TITLE = "Dwelling Coverage Calculator (Coverage A) | Insurance Tools";
const DESCRIPTION =
  "Use this dwelling coverage calculator to turn your rebuild cost into a Coverage A limit, with an optional inflation buffer and detached structures option.";
const PAGE_URL = `${SITE_URL}/tools/home/dwelling-coverage-calculator`;

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
    question: "Where do I get the rebuild cost this dwelling coverage calculator asks for?",
    answer:
      "This calculator does not estimate a rebuild cost for you, because a credible number depends on your home's square footage, construction materials, finishes, and local labor costs, none of which a generic formula can guess accurately. Get it from a licensed appraiser, a contractor's written estimate, your insurer's own replacement cost estimator, or InsuranceTools' replacement cost calculator, then bring that figure here to build your Coverage A recommendation.",
  },
  {
    question: "Is dwelling coverage the same as my home's market value?",
    answer:
      "No, and confusing the two is one of the most common homeowners insurance mistakes. Market value includes the land underneath your home and reflects what a buyer would pay in your local market, while dwelling coverage only needs to reflect what it would cost to rebuild the structure itself. In many markets these two numbers are far apart in either direction, so using market value to set Coverage A can leave you significantly over- or under-insured.",
  },
  {
    question: "Should I fold my shed or detached garage into Coverage A or keep it as Coverage B?",
    answer:
      "Most standard homeowners policies already include a set percentage of your Coverage A limit, commonly around 10%, as automatic Coverage B (Other Structures) protection, so check your declarations page before adding a detached structure's value into Coverage A manually. This calculator lets you do either: leave the checkbox unchecked to see the amount flagged as a separate Coverage B figure to compare against your policy, or check it if you specifically want that value folded into your dwelling limit instead.",
  },
  {
    question: "Why would I add a cost-inflation buffer instead of just using my rebuild cost as-is?",
    answer:
      "Rebuild costs move with material and labor prices, and if a total loss happens toward the end of your policy term, the rebuild cost you set the limit with a year earlier may no longer be accurate. Some homeowners choose to build in a cushion of a few percentage points for this reason. It is a personal choice this calculator lets you model, not a mandated figure, and it does not replace reviewing your limit at each renewal.",
  },
  {
    question: "What happens if I insure my home for less than the rebuild cost?",
    answer:
      "Underinsuring the dwelling is the single most consequential mistake this calculator is built to help you avoid. If your Coverage A limit is meaningfully below your actual rebuild cost, a total loss can leave you paying the shortfall out of pocket, and many policies also apply a coinsurance-style penalty that reduces even partial claim payouts when the dwelling is underinsured relative to its replacement cost. Review your limit any time you renovate, and at every renewal.",
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

export default function DwellingCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Dwelling Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Turn a rebuild cost you already have into a clear Coverage A recommendation, with a plain
            breakdown of every dollar in the total. Free, instant, and nothing you type leaves your
            browser.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <DwellingCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-dwelling-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Needs a Dwelling Coverage Number</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator is built for a specific, recurring moment: you already have a rebuild cost in
            hand, maybe from a contractor walkthrough, an insurer&apos;s replacement cost worksheet, or
            InsuranceTools&apos; own replacement cost calculator, and you need to translate that number into
            an actual Coverage A limit to compare against a renewal notice or a new quote. It&apos;s also
            useful after a kitchen remodel, a finished basement, or an addition, since a rebuild cost set
            before that work almost never reflects the home as it stands today. What this tool does not
            do is estimate the rebuild cost itself; that number depends on details specific to your home,
            like framing type, roofline complexity, and local construction wages, that a generic
            calculator has no way of knowing accurately.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Coverage A vs. Coverage B, and Why This Tool Asks</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard homeowners policy splits property coverage into named parts. Coverage A, dwelling
            coverage, insures the main structure of your home. Coverage B, other structures, insures
            detached structures on the same property, a detached garage, a shed, a fence, or a freestanding
            workshop, and most policies set Coverage B automatically as a percentage of Coverage A, often
            around 10%, without you having to buy it separately. That default percentage is frequently
            enough, but not always; a large detached workshop or a guest house can easily exceed it. This
            calculator gives you both paths rather than assuming one: leave detached structures out of your
            Coverage A total and it flags that value as a figure to check against your policy&apos;s existing
            Coverage B limit, or fold it directly into Coverage A if that&apos;s specifically what you want
            reflected in the dwelling number.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Recommended Number Is Built</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The math is intentionally simple and fully visible. Start with the rebuild cost you enter.
            Apply your chosen cost-inflation buffer, expressed as a percentage and defaulting to 0%, which
            adds a cushion some homeowners choose against rising material and labor costs between now and
            a future renewal; it is not a figure any insurer or regulator requires, and the calculator
            never applies one unless you set it yourself. Then, only if you&apos;ve checked the box to include
            detached structures in Coverage A, add the dollar value you entered for those structures. The
            result is your recommended dwelling coverage, shown alongside a breakdown of exactly which
            pieces built that total, so nothing about the final figure is a black box.
          </p>

          <AdInArticle slot="tool-dwelling-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a contractor quotes $310,000 to rebuild your home from the ground up, matching its current
            square footage and finishes. You also have a detached garage worth roughly $22,000 that you
            want reflected in your dwelling limit rather than relying on your policy&apos;s automatic
            Coverage B percentage, so you check the box to include it. You add a 5% buffer, reasoning that
            material costs have been climbing and you don&apos;t want your limit to fall behind before your
            next renewal. The calculator applies the 5% buffer to the $310,000 rebuild cost first, adding
            $15,500, then adds the $22,000 garage value, for a recommended dwelling coverage of $347,500.
            Every one of those three numbers, rebuild cost, buffer amount, and detached structures value,
            stays visible in the breakdown so you can see exactly how the site arrived at $347,500 instead
            of just being handed a total.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is setting Coverage A to a home&apos;s market value or purchase price
            instead of its rebuild cost, two figures that can differ by tens of thousands of dollars in
            either direction depending on local land values. A close second is never revisiting the limit
            after a renovation, so a policy purchased before a finished basement or an addition quietly
            underinsures the home it&apos;s now protecting. A third is double-counting detached structures,
            adding their value into Coverage A while a policy&apos;s automatic Coverage B percentage already
            covers them, which this tool&apos;s optional checkbox is specifically designed to help you catch
            rather than guess at.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the rebuild cost you enter is accurate and current; it has no way to
            verify it and does not generate one from square footage or location. It does not know your
            specific policy&apos;s existing Coverage B percentage, any state-specific extended replacement
            cost endorsement, ordinance-or-law coverage for bringing a rebuild up to current code, or an
            insurer&apos;s own underwriting minimums. The cost-inflation buffer is a voluntary planning figure
            you choose, not a number backed by a published inflation index, and it should not be mistaken
            for a mandated cushion. Treat the output here as a starting number to bring into a
            conversation with a licensed insurance agent, not as a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Coverage A (dwelling coverage)</strong> — the part of a homeowners policy that pays
              to repair or rebuild the main structure of your home after a covered loss.
            </li>
            <li>
              <strong>Coverage B (other structures)</strong> — pays to repair or rebuild detached
              structures on your property, such as a garage, shed, or fence, usually set as a percentage
              of Coverage A automatically.
            </li>
            <li>
              <strong>Replacement cost</strong> — what it would cost to rebuild your home today at current
              material and labor prices, as opposed to its market value or what you originally paid.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For more on how dwelling coverage fits into a full homeowners policy, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the coverage parts of a standard policy, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on coverage types more broadly. For the mechanics of replacement
            cost versus actual cash value, the{" "}
            <a
              href="https://www.iii.org/article/replacement-cost-vs-actual-cash-value-whats-difference"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s replacement cost guide
            </a>{" "}
            is a useful next read. Before finalizing a limit, confirm any state-specific requirements with
            your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. If you&apos;re still building your rebuild cost estimate, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the how-much-do-I-need question for other policy types, and once your dwelling limit is
            set, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to pair it with.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance math into plain,
            visible numbers instead of a locked-away quote form. Every tool runs entirely on your device,
            collects nothing about who you are, and is meant to leave you with a specific figure worth
            bringing into a real conversation with a licensed agent.
          </p>
        </section>
      </div>
    </>
  );
}

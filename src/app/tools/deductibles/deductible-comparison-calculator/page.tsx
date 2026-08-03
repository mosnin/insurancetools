import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { DeductibleComparisonCalculatorTool } from "@/components/tools/DeductibleComparisonCalculatorTool";
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

/**
 * This tool has not been added to the central registry (`src/lib/tools.ts`)
 * yet — that wiring is handled by a separate integration pass. The tool
 * object below matches the `Tool` shape locally so this page can drive the
 * shared SEO helpers (`toolStructuredData`, metadata) without depending on
 * `getToolBySlug`, which would return `undefined` for an unregistered slug.
 */
const tool: Tool = {
  slug: "deductible-comparison-calculator",
  name: "Deductible Comparison Calculator",
  description:
    "Compare 3 or more insurance deductible and premium options side by side, see the exact break-even years for every pair, and find which choice costs least at your own claim-frequency assumption.",
  category: "Deductibles",
  categorySlug: "deductibles",
  keywords: [
    "deductible comparison calculator",
    "compare insurance deductibles calculator",
    "which deductible level should i choose",
    "deductible break even calculator",
    "3 way deductible comparison",
    "insurance deductible options calculator",
  ],
  relatedTools: ["deductible-savings-calculator", "deductible-affordability-calculator"],
};

const TITLE = "Deductible Comparison Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this deductible comparison calculator to compare 3+ deductible and premium options, see the break-even years, and find the lowest-cost pick for any policy.";
const PAGE_URL = `${SITE_URL}/tools/deductibles/deductible-comparison-calculator`;

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
    question: "Does this work for home, auto, or renters deductibles, or just one type?",
    answer:
      "It works for any of them. The math behind a deductible comparison is identical no matter which policy the deductible sits on: you're always trading a lower premium against a larger out-of-pocket cost on the next claim. Enter the deductible and premium figures from any quote, whether it's auto collision coverage, a homeowners wind/hail deductible, or a renters policy, and the calculator treats them the same way.",
  },
  {
    question: "How many deductible options can I compare at once?",
    answer:
      "Start with three, which is the most common number of tiers an insurer quotes, and add up to six with the \"Add another deductible option\" button if your quote sheet lists more. You can also remove options down to two. Every pair you enter gets its own break-even calculation, so adding options doesn't replace the comparisons you already have, it adds to them.",
  },
  {
    question: "What does \"break-even point\" mean in this calculator?",
    answer:
      "It's the number of years of premium savings it takes for a higher-deductible option to make up the extra amount you'd pay out of pocket on a single claim, compared to a lower-deductible option. If your break-even point is 4 years and you expect to file a claim less often than every 4 years, the higher deductible tends to save you money over time. If you expect to file more often than that, the lower deductible tends to cost less.",
  },
  {
    question: "Where does the claim-frequency number come from?",
    answer:
      "From you. This calculator does not estimate, look up, or predict how often you'll file a claim on any policy, because that depends on your driving record, your home's condition, your location, and plain chance, none of which this tool has access to. It only takes the number of years you enter and shows you the arithmetic that follows from it, plus a table of outcomes across other common frequency assumptions so you aren't locked into a single guess.",
  },
  {
    question: "Why do two options sometimes show \"no premium savings\"?",
    answer:
      "Insurers don't always price every deductible tier as a straight discount ladder. If a higher deductible you entered has the same premium as a lower one, or an even higher premium due to underwriting quirks, there's no trade-off to evaluate: the lower deductible costs the same or less every year and exposes you to less risk per claim, so it wins outright regardless of how often you file a claim.",
  },
  {
    question: "Is the option with the lowest effective annual cost always the right choice?",
    answer:
      "Not automatically. This calculator ranks options by expected annual cost given your claim-frequency assumption, but it can't see your emergency savings. A deductible that wins on the math can still be the wrong pick if you couldn't comfortably pay it out of pocket the week a claim happens. Weigh the ranked result here against your own ability to self-insure the gap between deductible levels before you commit.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Deductible Tools", href: "/tools/deductibles" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function DeductibleComparisonCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Deductible Comparison Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Compare three, four, or more deductible and premium options from any insurance quote in one
            place. See the break-even point between every pair and which option actually costs the
            least at how often you expect to file a claim.
          </p>
          <LastUpdated category="deductibles" />
        </div>

        <div className="mt-2">
          <DeductibleComparisonCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-deductible-comparison-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Deductible Comparison Calculator Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most deductible calculators handle exactly two numbers: a lower deductible and a higher one.
            That works fine when a quote only offers two tiers, but plenty of quotes, especially
            homeowners and commercial policies, list three, four, or more deductible levels at once, and
            comparing them two at a time in your head gets unreliable fast. This tool takes every option
            you enter, however many there are, and runs the full set of pairwise comparisons
            automatically: every deductible against every other deductible, each with its own break-even
            point in years. It then goes a step further and ranks all of your options by expected annual
            cost at a claim-frequency assumption you control, so you get both the pairwise mechanics and
            a single bottom-line answer in the same view.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Break-Even Math Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every deductible comparison reduces to the same trade: a higher deductible almost always
            comes with a lower premium, and the gap between two deductibles is money you&apos;d pay yourself
            if you filed a claim. The break-even point answers a simple question: how many years of that
            premium savings does it take to equal the extra out-of-pocket cost? Divide the dollar
            difference between the two deductibles by the annual premium savings, and the result is the
            number of claim-free years the higher deductible needs to have already paid for itself. If
            you expect to file a claim less often than that, the higher deductible tends to win over
            time. If you expect to file more often, the lower deductible tends to win, because you&apos;d be
            paying the larger out-of-pocket amount before the savings caught up.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The ranked list takes this one layer further by converting each option into a single
            annualized figure: the premium, plus the deductible divided by your assumed years between
            claims. That amortizes the deductible&apos;s cost the same way the premium is already annual,
            which is what makes it possible to rank three or more options against each other instead of
            only comparing pairs.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Three-Option Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a homeowner is quoted three windstorm deductible tiers: $1,000 for $1,900 a year, $2,500
            for $1,650 a year, and $5,000 for $1,450 a year. Comparing $1,000 to $2,500 first: the
            premium savings is $250 a year and the deductible gap is $1,500, so the break-even point is
            6 years. Comparing $2,500 to $5,000: the premium savings is only $200 a year against a $2,500
            deductible gap, an 12.5-year break-even. If this homeowner expects a windstorm claim roughly
            every 8 years based on their region&apos;s storm history, the $2,500 deductible has already paid
            for itself against the $1,000 option by year 6, but the $5,000 option hasn&apos;t caught up to the
            $2,500 option until year 12.5. At an 8-year claim assumption, the $2,500 deductible comes out
            ahead of both the $1,000 and the $5,000 tiers, which is exactly the kind of result a two-way
            comparison tool would miss entirely, since it can only ever look at one pair.
          </p>

          <AdInArticle slot="tool-deductible-comparison-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator is built for anyone staring at a quote sheet with more than two deductible
            options and no easy way to compare all of them at once: a homeowner choosing between a flat
            deductible and a percentage-based wind/hail tier, a small business owner picking a
            commercial property deductible, a driver comparing three collision deductible levels, or
            anyone renewing a policy who&apos;s been offered a new set of tiers and wants to check whether
            switching still makes sense. It&apos;s equally useful for someone who only has two options today
            but wants room to add a third if their insurer offers one later, without switching to a
            different calculator.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is picking the deductible tier with the lowest premium on the quote
            sheet without ever checking what the deductible itself would cost on a claim, treating the
            monthly bill as the only variable that matters. A close second is comparing options two at a
            time from memory and losing track of how a middle-tier option stacks up against both ends,
            which is exactly the blind spot a three-plus option comparison closes. A third mistake is
            assuming past claim frequency predicts future claim frequency with precision; your own
            estimate is a reasonable planning input, not a guarantee, and it&apos;s worth stress-testing your
            decision against a few different frequency assumptions rather than just one, which is why the
            claim-frequency scenario table above shows more than a single year count.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every deductible and premium figure in this calculator comes from you; nothing here is a
            fabricated or industry-average number, and the tool does not look up or assume typical
            deductible amounts, typical premiums, or typical claim frequency for any line of insurance.
            The break-even and annualized cost figures also assume a single claim per claim event and a
            level premium over time, which won&apos;t hold exactly if a claim itself triggers a premium
            increase at your next renewal, an outcome this tool has no way to model since it depends on
            your specific insurer&apos;s underwriting rules. It also doesn&apos;t account for whether you could
            actually afford a given deductible out of pocket the week a claim happens, which matters as
            much as the long-run math. Treat every result here as a planning input to bring into a
            conversation with a licensed insurance agent, not a final decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Deductible</strong> — the dollar amount you pay out of pocket on a covered claim
              before your insurer pays the remainder, for that specific loss.
            </li>
            <li>
              <strong>Break-even point</strong> — the number of years it takes for a higher deductible&apos;s
              premium savings to equal the extra out-of-pocket cost it creates compared to a lower
              deductible, on a single claim.
            </li>
            <li>
              <strong>Self-insuring the gap</strong> — covering the dollar difference between two
              deductible levels yourself, out of savings, instead of paying a higher premium to have the
              insurer cover more of that gap.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For more on how deductibles work generally, the{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the mechanics behind deductible design across policy types, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on coverage terms. If your comparison involves a
            homeowners wind/hail or hurricane deductible, the Institute&apos;s{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              homeowners insurance basics
            </a>{" "}
            page covers how those percentage-based deductibles typically work. Before changing a policy,
            confirm the exact premiums quoted for each deductible tier with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or a licensed agent, since this tool cannot see live pricing.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            category. Once you&apos;ve settled on a deductible level, the{" "}
            <Link href="/tools/deductibles/deductible-savings-calculator" className="text-blue-600 hover:underline">
              deductible savings calculator
            </Link>{" "}
            can total up what that choice saves over several years, and the{" "}
            <Link href="/tools/deductibles/deductible-affordability-calculator" className="text-blue-600 hover:underline">
              deductible affordability calculator
            </Link>{" "}
            checks whether you could actually cover a given deductible out of pocket today. If you&apos;re
            weighing coverage amounts rather than deductibles, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover that side of the same policy.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance quotes into
            numbers you can actually compare. Nothing you type into this comparison tool is saved or
            sent anywhere; it exists to help you walk into a policy decision, or a renewal, already
            knowing which option holds up under your own numbers.
          </p>
        </section>
      </div>
    </>
  );
}

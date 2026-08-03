import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { InsuranceClaimPayoutCalculatorTool } from "@/components/tools/InsuranceClaimPayoutCalculatorTool";
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
 * This tool is not yet in the central registry (src/lib/tools.ts), so its
 * metadata is described locally rather than via getToolBySlug. The shape
 * matches the Tool type exactly so toolStructuredData renders the same
 * SoftwareApplication schema every registered tool gets.
 */
const tool: Tool = {
  slug: "insurance-claim-payout-calculator",
  name: "Insurance Claim Payout Calculator",
  description:
    "See both your Actual Cash Value and Replacement Cost Value claim payout side by side, with your deductible applied to each, so you know what to expect from either policy type.",
  category: "Claims",
  categorySlug: "claims",
  keywords: [
    "insurance claim payout calculator",
    "how much will my insurance claim pay",
    "ACV vs RCV calculator",
    "insurance settlement calculator",
    "claim payout estimator",
    "actual cash value vs replacement cost value",
  ],
  relatedTools: ["deductible-claim-calculator", "depreciation-claim-calculator"],
};

const TITLE = "Free Insurance Claim Payout Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this insurance claim payout calculator to see your Actual Cash Value and Replacement Cost payout side by side, with your deductible applied to both.";
const PAGE_URL = `${SITE_URL}/tools/claims/insurance-claim-payout-calculator`;

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
    question: "How do I know if my policy pays ACV or RCV?",
    answer:
      "Check your policy's declarations page or coverage summary for the words \"actual cash value\" or \"replacement cost\" next to the coverage in question. Many basic or named-peril policies default to ACV unless you've added a replacement cost endorsement, while most standard homeowners and many auto physical damage coverages pay replacement cost on the dwelling or vehicle itself but ACV on contents or older items. When the language isn't clear, ask your agent directly which basis applies to the specific item you're claiming, before you assume either way.",
  },
  {
    question: "What is recoverable depreciation and how do I actually collect it?",
    answer:
      "Recoverable depreciation is the dollar gap between your RCV and ACV payout figures above. On a replacement-cost policy, insurers typically issue the ACV amount first, then release the withheld depreciation as a second payment once you complete the repair or replacement and submit receipts or a contractor invoice proving the cost. If you never finish the replacement, or your policy doesn't include the recoverable depreciation provision, that second check never arrives.",
  },
  {
    question: "Why did my actual claim check come in different from this estimate?",
    answer:
      "Straight-line depreciation, the method this calculator uses, is a simplification. Real adjusters often apply per-category depreciation tables, factor in condition and local market pricing, or use a different useful-life assumption than the one you entered here. Weather damage, partial losses, and coinsurance penalties can also change the final number. Treat this tool's output as a planning estimate to compare against your adjuster's worksheet, not a substitute for it.",
  },
  {
    question: "Can my Actual Cash Value payout really be $0?",
    answer:
      "Yes, in two situations this calculator flags directly. First, if the item has reached the end of its entered useful life, its ACV depreciates to $0 before the deductible is even applied. Second, if your deductible is larger than the item's ACV, the payout can't go negative, so the claim pays nothing even though the item still has some replacement value. Both are legitimate outcomes under an ACV policy, not calculation errors.",
  },
  {
    question: "Does this calculator work for auto, home, renters, and business claims alike?",
    answer:
      "Yes. The underlying math, replacement cost minus straight-line depreciation, applies the same way whether the property is a couch, a used car, a rental unit's furnishings, or a piece of business equipment. What changes between those claim types is the useful-life estimate you should enter and whether your specific policy line typically offers an RCV option at all, which is why the tool asks you to supply useful life rather than guessing it for you.",
  },
  {
    question: "Should I take the ACV payout now or wait for a replacement-cost settlement?",
    answer:
      "That depends on your policy type and your plans. If your policy only pays ACV, there's no RCV payment to wait for. If your policy includes replacement cost coverage with a recoverable depreciation provision, you'll typically need to complete the repair or replacement within a window your policy defines, often 180 days to two years, to collect the withheld depreciation, so confirm that deadline with your insurer before deciding to delay.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Claims Tools", href: "/tools/claims" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function InsuranceClaimPayoutCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Insurance Claim Payout Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See what a claim actually pays under both settlement types insurers use, Actual Cash Value and
            Replacement Cost Value, side by side, with your deductible already subtracted from each.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <InsuranceClaimPayoutCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-insurance-claim-payout-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            ACV and RCV Are Not the Same Check
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every property claim settles on one of two bases, and the difference between them can be worth
            thousands of dollars on the exact same loss. <strong>Actual Cash Value (ACV)</strong> pays what
            the damaged or destroyed item is worth today, after depreciation, the same way a used-car
            valuation accounts for age and wear. <strong>Replacement Cost Value (RCV)</strong> pays what it
            costs to buy the item new right now, with no deduction for age. <strong>Recoverable
            depreciation</strong> is the dollar difference between those two figures, and it only becomes
            collectible on an RCV policy, and only after you actually replace or repair the item and prove
            the cost. This insurance claim payout calculator computes all three at once from four numbers
            you control, so you can see exactly what changes depending on which type of policy you hold,
            rather than discovering the distinction for the first time when a check arrives lower than
            expected.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run This Before Filing</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone holding a damaged item and a policy they haven&apos;t read closely
            enough to know which settlement basis applies, whether that&apos;s a homeowner with water-damaged
            furniture, a renter with a stolen laptop, a driver with a totaled car, or a small business owner
            with damaged equipment. It&apos;s also useful before you file, not just after: knowing your likely
            ACV number ahead of time tells you whether a claim is even worth the deductible and the possible
            effect on your future premium, and knowing your likely RCV number tells you what to expect if
            you plan to actually replace the item and collect the second, recoverable-depreciation check.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Two Payouts Are Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts from the item&apos;s replacement cost, the age you enter, and a useful-life
            estimate you supply yourself, since real depreciation schedules vary widely by item category and
            no single universal table would be accurate across a couch, a roof, and a laptop. It applies
            straight-line depreciation: age divided by useful life gives a depreciation percentage, capped at
            100% once an item reaches the end of its useful life, and that percentage times the replacement
            cost gives the dollar depreciation. Subtracting depreciation from replacement cost produces the
            ACV figure. Your deductible is then subtracted from both the ACV and the full replacement cost to
            produce the two payout figures shown side by side, and the recoverable depreciation figure is
            simply the gap between them.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a covered water leak ruins a living room furniture set with a $3,000 replacement cost. The
            set is five years old, and the policyholder estimates a 12-year useful life for furniture of this
            type based on the manufacturer&apos;s expected lifespan. Depreciation works out to 5 ÷ 12, or about
            42%, which is $1,250 off the replacement cost, leaving an ACV of $1,750. With a $500 deductible,
            an ACV policy would pay $1,250 ($1,750 minus the deductible), while an RCV policy would pay
            $2,500 up front ($3,000 minus the deductible) and hold back the remaining $1,250 as recoverable
            depreciation until the set is actually replaced and the receipt is submitted. Same loss, same
            deductible, an $1,250 difference in what arrives depending entirely on the policy&apos;s settlement
            basis.
          </p>

          <AdInArticle slot="tool-insurance-claim-payout-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Assumption That Costs Claimants the Most</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most expensive mistake in this process is assuming a policy pays replacement cost when
            it actually pays actual cash value, then budgeting a repair or replacement around the higher
            number. This shows up most often with contents coverage on older homeowners and renters policies,
            with older vehicles carrying only state-minimum physical damage coverage, and with any policy
            where an RCV endorsement was available but never added at the time of purchase. The fix is simple
            but easy to skip: confirm the settlement basis in writing, from your declarations page or your
            agent, for the specific coverage you&apos;re about to claim against, before you commit to a repair
            budget based on an assumption.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes straight-line depreciation over the useful life you enter, which is a
            transparent simplification, not the exact method every insurer&apos;s claims manual uses. Real
            adjusters may apply category-specific depreciation schedules, condition-based adjustments, regional
            pricing, or coinsurance penalties on underinsured property, none of which this tool has visibility
            into. It also doesn&apos;t know whether your specific policy carries an RCV endorsement, what your
            state requires for claims handling timelines, or the deadline your policy sets for collecting
            recoverable depreciation after a repair. Treat every figure here as a planning estimate to bring
            into a conversation with your insurer or a licensed claims professional, not as a final settlement
            number.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            For claims-handling guidance beyond what&apos;s covered here, {" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the National Association of Insurance Commissioners
            </a>{" "}
            publishes a consumer guide to filing a claim, and the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains replacement cost and actual cash value coverage in more depth. Deductible mechanics
            referenced above are covered further by the Insurance Information Institute&apos;s{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              explainer on how deductibles work
            </a>
            . If a claims dispute isn&apos;t resolving through your insurer, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state insurance department
            </a>{" "}
            is the regulator to contact.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            category. If you&apos;re trying to decide what deductible to carry in the first place, the{" "}
            <Link href="/tools/claims/deductible-claim-calculator" className="text-blue-600 hover:underline">
              deductible claim calculator
            </Link>{" "}
            models how that choice affects your net payout, and the{" "}
            <Link href="/tools/claims/depreciation-claim-calculator" className="text-blue-600 hover:underline">
              depreciation claim calculator
            </Link>{" "}
            goes deeper on category-specific depreciation if straight-line isn&apos;t the right fit for your
            item. If you&apos;re still shopping for coverage rather than settling a claim, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            are the better starting point.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the moments insurance actually gets
            used, buying coverage, comparing deductibles, and working through what a claim will pay. Nothing
            you enter leaves your browser, and every tool is designed to make you a more informed party in a
            conversation with a licensed agent or claims adjuster, not a replacement for one.
          </p>
        </section>
      </div>
    </>
  );
}

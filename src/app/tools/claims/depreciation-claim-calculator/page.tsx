import type { Metadata } from "next";
import Link from "next/link";
import { DepreciationClaimCalculatorTool } from "@/components/tools/DepreciationClaimCalculatorTool";
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

const tool = getToolBySlug("depreciation-claim-calculator")!;

const TITLE = "Insurance Depreciation Calculator: How ACV Is Calculated | Insurance Tools";
const DESCRIPTION =
  "Use this insurance depreciation calculator to see the exact straight-line math behind an item's depreciation and actual cash value, explained step by step.";
const PAGE_URL = `${SITE_URL}/tools/claims/depreciation-claim-calculator`;

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
    question: "Why does my insurer subtract depreciation from a claim payout at all?",
    answer:
      "Most standard policies pay actual cash value (ACV) up front for a damaged or stolen item, and ACV is defined as replacement cost minus depreciation. The logic is that a 6-year-old item wasn't worth the same as a brand-new one the moment before it was damaged, so paying full replacement cost immediately would hand you more value than you lost. If your policy carries replacement-cost coverage, the withheld amount often isn't gone for good; see the recoverable depreciation calculator for how that second payment typically works.",
  },
  {
    question: "Is straight-line depreciation the only method insurers use?",
    answer:
      "No. Straight-line depreciation, spreading the loss in value evenly across an item's useful life, is the most common method and the one this calculator models, but it isn't universal. Some insurers apply accelerated depreciation schedules to certain categories, or use condition-based adjustments instead of a strict age-over-useful-life ratio. Your claim documentation or your adjuster can tell you which method was actually applied to your settlement.",
  },
  {
    question: "Do I need to know my insurer's exact useful-life figure to use this calculator?",
    answer:
      "Yes, and that's intentional. Useful life varies by item type, by insurer, and sometimes by the specific adjuster handling a claim, so this tool never guesses or hard-codes a number for you. Look for the useful-life figure on your claim worksheet or ask your adjuster directly, then enter that exact number here to see the same math they used.",
  },
  {
    question: "If my item is past its useful life, is it worth exactly $0?",
    answer:
      "Not necessarily. This calculator caps depreciation at 100% and floors actual cash value at $0, which mirrors the strict formula, but some insurers apply a small residual or salvage value to fully depreciated items rather than zeroing them out entirely. If your item shows $0 here and that seems off for something you know has some resale value, that's worth raising with your adjuster rather than assuming the formula is the final word.",
  },
  {
    question: "How is this different from the recoverable depreciation calculator?",
    answer:
      "This tool shows the underlying depreciation math for a single item, replacement cost, age, useful life, and the resulting actual cash value, as a teaching tool you can check against your claim paperwork. The recoverable depreciation calculator picks up from there: it estimates the second payment you may be owed after completing a repair or replacement on a replacement-cost policy, which is a separate step in the claims process.",
  },
  {
    question: "Can I use this for any type of item, not just home contents?",
    answer:
      "Yes. The math is general: it works for electronics, furniture, appliances, tools, and most other personal property categories, as long as you know or can find the replacement cost and useful-life figures your insurer is applying. It doesn't model roof or vehicle-specific depreciation nuances; use the dedicated roof replacement claim calculator or a vehicle diminished-value tool for those specific items instead.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
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

export default function DepreciationClaimCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Insurance Depreciation Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See exactly how an insurer turns an item&apos;s age into a dollar reduction, one step at a time,
            from replacement cost down to actual cash value. Free, instant, and nothing you type leaves
            your browser.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <DepreciationClaimCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-depreciation-claim-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What Depreciation Means on an Insurance Claim
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            When an insurer settles a claim on an actual cash value (ACV) basis, it isn&apos;t paying you
            what a brand-new replacement costs today. It&apos;s paying that replacement cost minus an amount
            for the wear the item already had before the loss happened, called depreciation. This
            insurance depreciation calculator exists to make that subtraction visible instead of buried
            in a settlement letter. Enter what the item would cost to replace new, how old it is, and the
            useful life your insurer is applying, and the tool walks through the exact arithmetic that
            turns those three numbers into the actual cash value figure on your claim.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is a general, single-item tool on purpose. It isn&apos;t built around roofs, vehicles, or
            any one product category, because depreciation math itself doesn&apos;t change based on what the
            item is; only the useful-life figure does, and that figure always comes from your insurer or
            your own research, never from a fixed table baked into this page. Use it for a damaged
            appliance, a stolen laptop, water-damaged furniture, or anything else your claim paperwork
            lists a replacement cost and an age for.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Anyone holding a claim worksheet with a depreciation line item they don&apos;t fully understand
            is the core audience here. That includes homeowners and renters checking a contents
            settlement, someone verifying a repair estimate on a damaged item before signing off, and
            anyone who wants to sanity-check an adjuster&apos;s math against the standard formula before
            asking a question about it. It&apos;s a verification and learning tool, not a substitute for your
            actual claim documentation, so treat the number it produces as a way to understand your
            settlement rather than a replacement for it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Straight-Line Depreciation Formula</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Straight-line depreciation spreads an item&apos;s loss of value evenly across its useful life,
            meaning the same percentage of value is assumed to disappear every year until the item
            reaches the end of that useful life. The calculation happens in three steps. First, divide
            the item&apos;s current age by its useful life to get a ratio, capped at 100% once the item has
            reached or passed the end of its useful life, since depreciation can&apos;t reduce a payout by
            more than the full replacement cost. Second, multiply the replacement cost value by that
            percentage to get the dollar amount being depreciated. Third, subtract that depreciation
            amount from the replacement cost to arrive at actual cash value, which is floored at $0
            rather than allowed to go negative.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Written out as a formula: Depreciation = Replacement Cost x (Age &divide; Useful Life), capped
            at 100%. Actual Cash Value = Replacement Cost &minus; Depreciation. That&apos;s the entire
            calculation this tool runs, displayed with your own numbers plugged in so you can follow each
            step rather than trusting a single output figure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a laptop has a replacement cost of $1,200, is 3 years old, and your insurer applies a
            5-year useful life to laptops in its claim guidelines. The ratio is 3 divided by 5, or 0.6,
            meaning 60% depreciation. Sixty percent of $1,200 is $720 in depreciation. Subtracting $720
            from $1,200 leaves an actual cash value of $480. That&apos;s the number that should appear on your
            claim worksheet before any deductible is applied, and it&apos;s exactly what this calculator would
            show for those same three inputs.
          </p>

          <AdInArticle slot="tool-depreciation-claim-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps You Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common misunderstanding is assuming that once an item passes its useful life, it&apos;s
            worth exactly $0 and there&apos;s nothing left to discuss. The strict straight-line formula does
            floor actual cash value at $0, but plenty of insurers apply a small residual or salvage value
            to fully depreciated items instead of zeroing them out, so a $0 result here is a starting
            point for a conversation with your adjuster, not necessarily the final word. A second mistake
            is treating the ACV number as the end of the story on a replacement-cost policy: if your
            policy carries recoverable depreciation, the amount withheld here may come back to you as a
            second payment once you complete the repair or replacement and submit proof, which the{" "}
            <Link href="/tools/claims/recoverable-depreciation-calculator" className="text-blue-600 hover:underline">
              recoverable depreciation calculator
            </Link>{" "}
            is built to estimate. A third mistake is assuming every item type depreciates on the same
            schedule an insurer applied to a different item on the same claim; useful life is
            item-specific, and reusing one item&apos;s figure for another can produce a misleading result.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes straight-line depreciation, the most commonly used method, applied
            evenly across the useful-life figure you provide. It does not know or generate a universal
            useful-life table for any item category, since that figure genuinely varies by insurer, by
            item condition, and sometimes by state claims regulations, and inventing one here would give
            you a number that might not match your actual settlement at all. Some insurers depreciate
            certain items, particularly building materials or specialized equipment with irregular wear
            patterns, on a non-straight-line schedule this tool doesn&apos;t model. It also doesn&apos;t apply a
            deductible or estimate a full payout; for that, pair this tool with the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>
            . Treat every figure here as a way to check and understand your claim math, not as a claim
            determination.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Straight-line depreciation</strong> — a method that spreads an item&apos;s loss of
              value evenly across each year of its useful life, rather than depreciating it faster early
              on or later near the end.
            </li>
            <li>
              <strong>Useful life</strong> — the number of years an insurer expects a given item category
              to remain functional before it&apos;s considered fully depreciated; it varies by item type and by
              insurer, and is never a single fixed number across the industry.
            </li>
            <li>
              <strong>Salvage value</strong> — the residual worth an item may still carry even after it
              has reached the end of its useful life, which is why some insurers don&apos;t reduce a fully
              depreciated item&apos;s actual cash value all the way to $0.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how claims are typically filed and evaluated, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on the claims process, and the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how replacement cost and actual cash value coverage differ. The NAIC&apos;s{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              consumer coverage guidance
            </a>{" "}
            covers general policy terminology, and if a settlement dispute involves state-specific claims
            rules, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            is the authority to contact.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            category. Once you understand how your item&apos;s depreciation was calculated, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            estimates what a full settlement might look like after a deductible, and the{" "}
            <Link href="/tools/claims/recoverable-depreciation-calculator" className="text-blue-600 hover:underline">
              recoverable depreciation calculator
            </Link>{" "}
            shows what you may be able to claim back once repairs are complete on a replacement-cost
            policy.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that run entirely in your browser, aimed at making
            insurance math, coverage limits, claim settlements, and everyday policy decisions, easier to
            see and check for yourself. Nothing you enter is stored or transmitted, and every tool is
            designed to leave you better prepared for a conversation with a licensed professional, not to
            replace one.
          </p>
        </section>
      </div>
    </>
  );
}

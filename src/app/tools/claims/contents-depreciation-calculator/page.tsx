import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { ContentsDepreciationCalculatorTool } from "@/components/tools/ContentsDepreciationCalculatorTool";
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
 * Local tool descriptor used only for structured data and metadata on this
 * page. The site-wide tool registry (src/lib/tools.ts) is integrated
 * centrally by a separate process, so this page does not depend on it.
 */
const tool: Tool = {
  slug: "contents-depreciation-calculator",
  name: "Contents Depreciation Calculator",
  description:
    "Build an itemized contents depreciation calculator worksheet: add each damaged or destroyed item with its replacement cost, age, and useful life, and get a running actual cash value and replacement cost claim total.",
  category: "Claims",
  categorySlug: "claims",
  keywords: [
    "contents depreciation calculator",
    "home contents claim depreciation",
    "itemized depreciation calculator insurance",
    "personal property claim depreciation",
    "how to calculate depreciation on damaged items",
    "contents claim worksheet",
  ],
  relatedTools: ["depreciation-claim-calculator", "home-inventory-value-calculator"],
};

const TITLE = "Contents Depreciation Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this contents depreciation calculator to itemize every damaged item, apply its own age and useful life, and total the ACV and RCV value of a personal property claim.";
const PAGE_URL = `${SITE_URL}/tools/claims/contents-depreciation-calculator`;

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
    question: "What is the difference between this tool and a single-item depreciation calculator?",
    answer:
      "A single-item depreciation calculator answers one question at a time: what is this one damaged item worth after depreciation? This contents depreciation calculator is built for the more realistic version of a loss, where a burst pipe, fire, or theft damages or destroys a dozen or more items at once, each with its own age and useful life. It adds a row per item and sums the actual cash value and replacement cost across the entire list, which is closer to how a proof of loss actually gets assembled.",
  },
  {
    question: "Why do I have to enter a useful life for every single item instead of the tool just knowing it?",
    answer:
      "Because useful life genuinely varies by item type, and a single blended rate applied to an entire household would misstate almost every item on the list. A leather sofa, a refrigerator, and a laptop do not wear out at the same pace, and insurers themselves do not use one universal number across every category. Rather than fabricate a lookup table that would be wrong for a meaningful share of items, this tool asks you to enter the useful life for each row, ideally pulled from your insurer's own depreciation schedule if they've shared one, or your own reasonable estimate of how long that item was expected to last.",
  },
  {
    question: "What does the ACV total on this worksheet actually represent?",
    answer:
      "It's the straight-line estimate of what your damaged or destroyed items were worth immediately before the loss, after subtracting depreciation for their age relative to their useful life. If your policy settles personal property claims on an actual cash value basis, this total is the figure closest to what you'd expect from that settlement. If your policy pays replacement cost, this total instead represents the holdback amount insurers commonly withhold until you submit proof that you actually repaired or replaced the items.",
  },
  {
    question: "Will my insurer's depreciation number match this worksheet exactly?",
    answer:
      "Not necessarily, and this tool doesn't claim otherwise. Adjusters sometimes use non-linear depreciation curves, category-specific depreciation caps, or condition adjustments that push an item's value up or down from a pure straight-line calculation. This worksheet gives you a transparent, defensible starting estimate you can compare against your insurer's number, not a guarantee that the two will match to the dollar.",
  },
  {
    question: "What is an itemized statement, and why does an adjuster ask for one?",
    answer:
      "An itemized statement lists each damaged or destroyed item individually, with a description, its age, its original or replacement cost, and any supporting documentation like a receipt or photo, rather than a single lump-sum estimate for the whole loss. Adjusters ask for this level of detail because a lump sum is hard to verify and hard to dispute if it's wrong, while an item-by-item list lets both sides check the math on any single line. This calculator produces that same row-by-row structure so you can copy it directly into your own claim paperwork.",
  },
  {
    question: "Can I use this worksheet if my items were only damaged, not destroyed?",
    answer:
      "Yes. Enter the item's full replacement cost, age, and useful life as if you were valuing it new, and treat the resulting ACV or RCV figure as the value of the loss for that item, whether that means full replacement or the cost to repair it back to its prior condition. This tool calculates value, not repair estimates, so for repairable items you'll still need a contractor's or specialist's repair quote to compare against the depreciated value here.",
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

export default function ContentsDepreciationCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Contents Depreciation Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Build an item-by-item worksheet for a personal property claim: add every damaged or destroyed
            item, give each one its own age and useful life, and watch the total actual cash value and
            replacement cost update as you go.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <ContentsDepreciationCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-contents-depreciation-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Itemized Depreciation Matters for a Contents Claim</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A house fire, a burst supply line, or a break-in rarely destroys just one thing. It destroys a
            room&apos;s worth of belongings at once, a sofa here, a television there, a dresser full of clothing,
            and each of those items carries a different age and a different expected lifespan. A single
            blended depreciation rate applied across the whole loss, the kind of shortcut that shows up in
            hastily assembled claim estimates, systematically overstates depreciation on items that were
            new or nearly new and understates it on items that were already close to the end of their
            useful life. This contents depreciation calculator exists because the fix is straightforward
            once you see it: calculate depreciation per item, using that item&apos;s own age and useful life,
            then add the results together. The output is a worksheet you can actually hand to an adjuster
            or compare line by line against a settlement offer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator is built for anyone assembling or reviewing a personal property claim after a
            covered loss, whether that&apos;s a policyholder documenting damage before an adjuster&apos;s visit, a
            homeowner or renter comparing a settlement letter against their own numbers, or anyone who
            simply wants a clear, defensible estimate of what a room full of damaged belongings is actually
            worth. It&apos;s a fit specifically when more than one item is involved; for valuing a single damaged
            item on its own, a simpler single-item depreciation calculator is a faster tool for that
            narrower job.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Build the Worksheet</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Add one row for every damaged or destroyed item. For each row, enter the replacement cost (what
            it would cost to buy the same or a similar item new today, not what you originally paid), the
            item&apos;s age in years, and its useful life in years, meaning how many years of service you&apos;d
            reasonably expect from that type of item before it&apos;s fully worn out. The calculator applies
            straight-line depreciation to each row individually: it divides age by useful life to get a
            depreciation percentage, applies that percentage to the replacement cost to find the dollar
            amount of depreciation, and subtracts that from the replacement cost to get the item&apos;s actual
            cash value. Every row&apos;s actual cash value and replacement cost then feed into the running
            totals at the top of the tool, so the worksheet stays complete as you add or remove items.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Suppose a burst pipe damages a home office and an adjoining living room. The claimant lists a
            sofa with a $1,800 replacement cost, 4 years old, with a 10-year useful life; a home office
            desk at $650, 6 years old, with a 15-year useful life; an area rug at $900, 2 years old, with a
            7-year useful life; and a laptop at $1,200, 3 years old, with a 5-year useful life. The sofa
            depreciates 40% (4/10 years), leaving an ACV of $1,080. The desk depreciates 40% (6/15 years),
            leaving an ACV of $390. The rug depreciates about 29% (2/7 years), leaving an ACV of roughly
            $643. The laptop depreciates 60% (3/5 years), leaving an ACV of $480. Added together, the total
            replacement cost across all four items is $4,550, and the total actual cash value is
            approximately $2,593, a holdback of roughly $1,957 that a replacement-cost policy would
            typically pay only after the claimant submits receipts showing the items were actually replaced.
          </p>

          <AdInArticle slot="tool-contents-depreciation-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Most Common Mistake This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake in a hand-assembled contents claim is applying one depreciation
            rate, often something like a flat 20% or 30%, to the entire list of damaged items regardless of
            what each one actually is or how old it actually is. That shortcut might land close to correct
            for a handful of items and be wildly off for the rest, since a five-year-old couch and a
            five-year-old laptop have depreciated by very different amounts relative to their expected
            lifespans. It also tends to disadvantage claimants who lost several newer, higher-value items
            in the same loss, since a blended rate spreads depreciation evenly instead of recognizing that
            newer items should carry a smaller depreciation deduction than older ones.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator applies straight-line depreciation only, dividing an item&apos;s age by the useful
            life you enter and applying that fraction directly to its replacement cost. It does not model
            non-linear depreciation curves, category-specific depreciation caps, condition-based
            adjustments, or a minimum salvage value floor, all of which some insurers apply in their own
            claims software. It has no built-in table of useful life by item category; that number must
            come from you, ideally cross-checked against your insurer&apos;s own depreciation schedule if one
            has been shared with you, because a single universal number would misrepresent a meaningful
            share of real household items. Treat every total here as a documentation aid and a starting
            point for comparison, not as a final claim amount or a substitute for your insurer&apos;s actual
            settlement calculation.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Contents claim</strong> — a claim for damage to or loss of personal property (belongings
              inside a home or rented unit), as distinct from a claim for damage to the structure itself.
            </li>
            <li>
              <strong>Proof of loss</strong> — a sworn, itemized statement a policyholder submits to an
              insurer documenting exactly what was damaged or destroyed and what it was worth, used to
              support a claim payout.
            </li>
            <li>
              <strong>Itemized statement</strong> — a line-by-line list of individual items, each with its
              own description, age, and value, rather than a single lump-sum figure for an entire loss.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For guidance on how the claims process generally works, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on filing and documenting a claim, and the{" "}
            <a
              href="https://www.iii.org/article/how-file-home-insurance-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            outlines what documentation insurers typically expect. For the actual cash value and
            replacement cost definitions this tool relies on, the Insurance Information Institute&apos;s{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              homeowners insurance basics
            </a>{" "}
            guide is a useful reference. If your claim involves a dispute over an insurer&apos;s
            settlement offer, your{" "}
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
              Claims calculators
            </Link>{" "}
            category. If your loss is a single item rather than a whole room, the{" "}
            <Link href="/tools/claims/depreciation-claim-calculator" className="text-blue-600 hover:underline">
              depreciation claim calculator
            </Link>{" "}
            is the faster tool for that narrower job. Before a loss ever happens, the{" "}
            <Link href="/tools/home/home-inventory-value-calculator" className="text-blue-600 hover:underline">
              home inventory value calculator
            </Link>{" "}
            helps you build a running record of what you own, which makes assembling a worksheet like this
            one considerably faster if you ever need it.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the numbers behind coverage,
            deductibles, and claims, including worksheets like this one that are meant to be filled out,
            copied, and brought into an actual conversation with an adjuster or agent rather than just read.
          </p>
        </section>
      </div>
    </>
  );
}

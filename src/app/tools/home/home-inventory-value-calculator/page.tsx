import type { Metadata } from "next";
import Link from "next/link";
import { HomeInventoryValueCalculatorTool } from "@/components/tools/HomeInventoryValueCalculatorTool";
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

const tool = getToolBySlug("home-inventory-value-calculator")!;

const TITLE = "Home Inventory Value Calculator | Insurance Tools";
const DESCRIPTION =
  "Build an itemized home inventory value calculator: add each belonging with a quantity and value, and watch your total update live for insurance and claims records.";
const PAGE_URL = `${SITE_URL}/tools/home/home-inventory-value-calculator`;

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
    question: "How is this different from a quick personal property estimate?",
    answer:
      "A rough estimate groups everything you own into a handful of broad categories, like furniture or electronics, and applies a shortcut percentage to guess a total. This calculator works the opposite way: you add a row for each belonging, or each group of similar belongings, with a quantity and a value, and it sums quantity times value across every row. That bottom-up total is closer to what a claims adjuster expects to see in a proof-of-loss inventory, because it is traceable back to specific items rather than a single guessed percentage.",
  },
  {
    question: "Does the calculator save my inventory?",
    answer:
      "No. Everything you type stays in your browser tab for this session only. Nothing is uploaded or stored. Use the copy button to save an itemized text version somewhere you control, such as a document or spreadsheet, before you close the tab, since refreshing the page clears the list back to the starting placeholder rows.",
  },
  {
    question: "Should I use replacement cost or actual cash value for each item?",
    answer:
      "Use whichever figure matches how your homeowners or renters policy pays out personal property claims, since that keeps the total consistent with what you would actually be reimbursed. Replacement cost is what a similar new item costs today; actual cash value subtracts depreciation for age and condition. Most newer homeowners and renters policies default to replacement cost coverage, but check your declarations page, since some policies still pay actual cash value unless you added a replacement cost endorsement.",
  },
  {
    question: "What if my total is higher than my personal property coverage limit?",
    answer:
      "That gap is exactly what this tool is meant to surface. Personal property coverage is often set as a percentage of your dwelling coverage by default, which does not automatically track what you actually own. If your itemized total exceeds your limit, that is a reason to ask your agent about raising the limit or adding a scheduled endorsement for specific high-value items like jewelry, art, or musical instruments, which typically carry lower built-in sublimits regardless of your overall personal property limit.",
  },
  {
    question: "Do I need to list every single item I own?",
    answer:
      "Not literally every item, but aim for completeness within reason. Group low-value, similar items into one row, for example one row for kitchen small appliances rather than five rows, and give higher-value individual items their own row so their value is not averaged away. The goal is a total you would be comfortable defending with photos or receipts if you ever had to file a claim.",
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

export default function HomeInventoryValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Home Inventory Value Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Add what you actually own, row by row, and let this home inventory value calculator total it
            up as you go. No spreadsheet setup, no sign-up, and nothing you type leaves your browser.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <HomeInventoryValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-home-inventory-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Needs an Itemized Home Inventory</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Anyone who has ever tried to reconstruct what they owned after a fire, a burst pipe, or a
            break-in knows how unreliable memory is under stress. You remember the television and the
            sofa; you forget the contents of every kitchen drawer, the linen closet, the garage shelving,
            and the box of tools you have not opened in a year. This home inventory value calculator
            exists for the moment before that happens, not after. It is built for homeowners setting a
            personal property coverage limit for the first time, renters figuring out whether a renters
            policy actually covers what they own, and anyone updating an inventory after a move, a
            renovation, or a round of new purchases. If you already filed a claim and are working backward
            from memory, this tool still helps, but it works best as a record you keep current before
            anything happens.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Bottom-Up Beats Guessing</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A lot of online personal property calculators ask for a handful of broad numbers, like total
            furniture value or total electronics value, and multiply by a rule-of-thumb percentage. That
            approach is fast, but it produces a number nobody can defend later, and it tends to drift
            toward round, guessed figures rather than anything traceable. This tool takes the opposite
            approach. You add one row per item or per small group of similar items, enter a quantity and
            an estimated value for that item, and the calculator multiplies quantity by value and adds
            every row together into a single running total. The result is not just a bigger or smaller
            number than a rough estimate; it is a different kind of number, one built from individually
            identifiable items instead of an averaged guess. That distinction matters most at claim time,
            when an itemized list with specific items, quantities, and values is far more useful to an
            adjuster than a single lump-sum figure with no supporting detail.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use the Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tool starts with three example rows, sofa, television, and laptop, so the layout is clear
            before you type anything; their values start at zero, and nothing about them is assumed on
            your behalf. Rename them to match what you actually own, or delete them entirely with the
            trash icon on each row. Click &ldquo;Add item&rdquo; to create a new row for each additional
            belonging or group of similar belongings, entering a short name, a quantity, and an estimated
            value per unit. The running total at the top updates immediately as you type, so you can watch
            it move room by room, closet by closet, without waiting for a submit button. Work through your
            home methodically, one room at a time, rather than trying to recall everything from memory in
            one sitting; most people find they remember far more when they are standing in the room. As
            you go, take photos of higher-value items and pull receipts or purchase confirmations where
            you still have them, since a photo or receipt is the difference between an estimate and
            documentation an insurer can act on quickly. When you are done, use the copy button to save an
            itemized text version of your list and total somewhere durable, like a document or email to
            yourself, since the tool does not store anything once you close the tab.
          </p>

          <AdInArticle slot="tool-home-inventory-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a renter working through their living room and bedroom ends up with these rows: a sofa
            (1 at $900), a television (1 at $650), a laptop (1 at $1,100), a bed frame and mattress (1 at
            $1,400), a dresser (1 at $350), and a set of kitchen small appliances grouped into one row
            (4 at $75 each, totaling $300). Adding each line total, $900 plus $650 plus $1,100 plus $1,400
            plus $350 plus $300, produces a running total of $4,700 from just two rooms. That number alone
            is useful: it tells the renter whether their policy&apos;s personal property limit, often the
            headline figure on a renters policy, is anywhere close to sufficient once the rest of the home
            is added in. Continuing through the kitchen, closets, and any storage space typically pushes
            the total well past what a first guess from memory would have produced.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is stopping after the obvious, expensive items, the electronics and
            furniture, and skipping the accumulated value of everyday belongings like clothing, kitchenware,
            and tools, which adds up faster than most people expect. A second is entering purchase price
            instead of a current, consistent valuation basis, mixing replacement cost figures for some rows
            with rough guesses for others, which makes the total harder to defend later. A third is never
            revisiting the list after the first pass; an inventory built once and never updated understates
            what you own within a year or two as new purchases pile up. A fourth is skipping photos and
            receipts entirely, since a list of numbers with no supporting documentation is far weaker
            evidence than the same list backed by a phone full of photos.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator only totals the numbers you enter; it has no independent way to verify an
            item&apos;s value, check current market prices, or know your policy&apos;s coverage limit, special
            sublimits, or deductible. It does not distinguish automatically between replacement cost and
            actual cash value, so the total reflects whichever basis you used consistently across rows. It
            does not account for depreciation an insurer might apply at claim time under an actual-cash-value
            policy, and it does not know about category sublimits many policies place on jewelry, art,
            collectibles, firearms, or business property kept at home, which can cap reimbursement well
            below an item&apos;s listed value regardless of your overall personal property limit. Treat the
            total as a planning and documentation aid, not a substitute for reading your policy&apos;s
            declarations page or asking a licensed agent whether your current limit and endorsements match
            what this inventory shows.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Personal property coverage</strong> — the part of a homeowners or renters policy that
              reimburses you for belongings damaged, destroyed, or stolen, up to a stated limit.
            </li>
            <li>
              <strong>Replacement cost</strong> — what it would cost to buy a similar new item today, without
              subtracting for age or wear.
            </li>
            <li>
              <strong>Actual cash value</strong> — replacement cost minus depreciation, reflecting an item&apos;s
              age and condition at the time of loss.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how personal property coverage fits into a broader homeowners policy, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes an overview of what a standard policy covers, and{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the National Association of Insurance Commissioners
            </a>{" "}
            maintains consumer guidance on coverage types and claims, including how to document belongings
            before filing a claim. For renters specifically, the{" "}
            <a
              href="https://www.iii.org/article/renters-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s renters insurance basics
            </a>{" "}
            explains how personal property limits typically work on a renters policy. Confirm your own
            policy&apos;s specific limits and endorsements with your insurer or a licensed agent before relying
            on this total for coverage decisions.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. Once you know what your belongings are worth, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            help you check whether your overall policy limits still make sense, and renters comparing the
            same question against a rental unit can use the{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              renters insurance calculators
            </Link>{" "}
            to see how personal property coverage works on that type of policy.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the numbers that actually drive
            insurance decisions, from coverage limits to claim math to inventories like this one. Nothing
            you enter is uploaded anywhere, and every tool is designed to leave you better prepared for a
            conversation with a licensed agent, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

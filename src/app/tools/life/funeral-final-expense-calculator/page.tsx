import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { FuneralFinalExpenseCalculatorTool } from "@/components/tools/FuneralFinalExpenseCalculatorTool";
import { FAQSection } from "@/components/tools/FAQSection";
import { LastUpdated } from "@/components/tools/LastUpdated";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdInArticle } from "@/components/ads";
import { toolStructuredData, breadcrumbStructuredData, faqStructuredData, SITE_URL, SITE_NAME } from "@/lib/seo";

/**
 * This calculator is new enough that it has not yet been added to the
 * central tool registry (`src/lib/tools.ts`), which another process owns.
 * The fields below mirror the shape that registry entry will eventually
 * take so `toolStructuredData` and the page metadata stay correct either
 * way.
 */
const tool: Tool = {
  slug: "funeral-final-expense-calculator",
  name: "Funeral & Final Expense Calculator",
  description:
    "Add up your own funeral, burial, and final expense costs line by line, compare them against savings or existing coverage, and see the coverage gap a final expense policy would need to close.",
  category: "Life",
  categorySlug: "life",
  keywords: [
    "funeral and final expense calculator",
    "final expense insurance calculator",
    "funeral cost calculator",
    "how much does a funeral cost",
    "final expense coverage amount calculator",
    "burial insurance calculator",
  ],
  relatedTools: ["life-insurance-needs-calculator", "dime-method-calculator"],
};

const TITLE = "Funeral & Final Expense Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this funeral and final expense calculator to add up real burial costs, medical bills, and debts, then find your final expense insurance coverage gap.";
const PAGE_URL = `${SITE_URL}/tools/life/funeral-final-expense-calculator`;

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
    question: "Does this tool tell me the average cost of a funeral?",
    answer:
      "No, and on purpose. Funeral costs swing widely by region, funeral home, and the choices a family makes, so a single national average printed on a calculator would be more misleading than useful for your specific situation. Instead, every line item starts at $0 and you fill in your own estimate, ideally from an itemized general price list from a local funeral home. If you want a benchmark to sanity-check your numbers against, the National Funeral Directors Association publishes a periodic median cost survey you can consult directly.",
  },
  {
    question: "How much final expense or burial insurance coverage should I buy?",
    answer:
      "Start with the coverage gap this calculator shows, which is your total estimated costs minus any savings or coverage you already have earmarked. Most final expense policies are sold in round face amounts, commonly somewhere between about $2,000 and $50,000, so the tool rounds the gap up to the nearest $1,000 as a starting point. Treat it as a number to bring into a conversation with a licensed agent, not a final purchase amount, since your actual costs and any other funds available to your family may differ from what you entered.",
  },
  {
    question: "What's the difference between final expense insurance and a regular term life policy?",
    answer:
      "Final expense insurance, sometimes marketed as burial insurance, is a small whole life policy built specifically to cover funeral, burial, and immediate end-of-life costs. Face amounts are much smaller than a typical term policy, underwriting is often simplified, and premiums are level for life rather than expiring after a term. If you're also trying to replace years of lost income for dependents, that's a much larger need this calculator isn't built for; see the life insurance needs calculator or the DIME method calculator for that instead.",
  },
  {
    question: "What is guaranteed issue life insurance, and does this calculator assume I'll use it?",
    answer:
      "Guaranteed issue life insurance is sold without health questions or a medical exam, so acceptance is guaranteed within an insurer's age limits. That convenience usually comes with a higher premium per dollar of coverage and a graded death benefit, meaning the full face amount typically isn't paid for deaths from natural causes during the first two to three years. This calculator only estimates a coverage amount; it doesn't assume any particular underwriting type, since whether guaranteed issue makes sense depends on your health and how quickly you want full coverage in force.",
  },
  {
    question: "Should I include my mortgage or car loan in this calculator?",
    answer:
      "Generally no. This tool is scoped to immediate, relatively small final expenses: funeral and burial or cremation costs, outstanding medical bills, and debts you'd want cleared quickly, like credit cards. A mortgage balance is a much larger, longer-term obligation that belongs in a full life insurance needs calculation instead of a final expense estimate. The life insurance needs calculator and the DIME method calculator, both linked below, are built for that larger number.",
  },
  {
    question: "Will Social Security help pay for a funeral?",
    answer:
      "Social Security does pay a one-time lump-sum death payment to an eligible surviving spouse or child, but it's a fixed, modest amount that hasn't kept pace with funeral costs and won't come close to covering most of the line items in this calculator. Check the Social Security Administration's survivors benefits page for current amounts and eligibility rules rather than assuming it will offset the totals shown here.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Life Insurance Tools", href: "/tools/life" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function FuneralFinalExpenseCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Funeral &amp; Final Expense Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            A funeral and final expense calculator that adds up your own costs line by line instead of
            quoting a generic average, then shows the coverage gap a small final expense or burial policy
            would need to close.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <FuneralFinalExpenseCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-funeral-final-expense-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Calculator Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This funeral and final expense calculator builds your total from the bottom up. Rather than
            starting from a single dollar figure meant to represent &ldquo;the average funeral,&rdquo; it gives you
            seven separate line items, funeral home services, a casket or urn, burial or cremation costs, a
            headstone, administrative fees, outstanding medical bills, and other debts, and lets you enter
            what you actually expect to pay or owe for each one. Add in any savings or coverage already set
            aside, and the tool shows the gap that&apos;s left, plus a suggested face amount for a final
            expense or burial policy sized to close it. Every number on the results panel comes directly
            from what you typed; nothing is preloaded with a figure meant to look like a typical cost.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator is built for older adults, and the adult children helping them plan, who are
            sizing a small final expense or burial policy rather than a large term life policy meant to
            replace years of income. If you&apos;re past the stage of needing coverage for a mortgage or young
            dependents and instead want to make sure funeral costs and a few remaining bills don&apos;t become
            a burden on your family, this is the right scope of tool. It&apos;s also useful for anyone doing
            estate or pre-need planning who wants a concrete number before calling a funeral home or an
            insurance agent, and for families evaluating whether an existing small policy or burial fund is
            still enough.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Fill In Each Line Item</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Funeral home services covers the basic services fee, staff time, use of the facility, and
            transportation, which is usually the largest single line on a funeral home&apos;s general price
            list; ask for that itemized list directly rather than guessing. Casket or urn should reflect
            whichever applies to the arrangement you&apos;re planning for, since prices for each range widely
            by material and style. Burial plot, vault, and cremation fee covers cemetery costs on the
            burial side or the crematory&apos;s own charge on the cremation side; only one of these usually
            applies to a given plan. Headstone or grave marker can be left at $0 if a marker isn&apos;t part of
            the plan yet. Obituary, death certificates, and administrative fees are often overlooked but add
            up: newspaper notices and certified copies of the death certificate typically run a modest but
            real amount per copy, and multiple copies are usually needed for banks, insurers, and other
            institutions. Outstanding medical bills and other outstanding debts are the two fields most
            people forget entirely, covered in more detail below.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a family planning ahead for an aging parent. They get a general price list from a
            local funeral home showing $4,200 for services and staff, $1,800 for a casket, $2,600 for a
            cemetery plot and vault, and $900 for a modest headstone. They estimate $350 for an obituary and
            extra death certificate copies. The parent has no major outstanding medical bills right now but
            carries about $2,400 in credit card debt they&apos;d want cleared quickly rather than left to the
            estate. That totals $12,250. The family already has $3,000 set aside in a dedicated savings
            account for this purpose, leaving a coverage gap of $9,250, which the calculator rounds up to a
            suggested $10,000 final expense policy face amount, a round figure that&apos;s easy to shop with
            when they call an agent for quotes.
          </p>

          <AdInArticle slot="tool-funeral-final-expense-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is forgetting outstanding medical bills and other debts
            entirely, since people tend to think of &ldquo;final expenses&rdquo; as only the funeral itself. In
            reality, the last months of a serious illness can generate meaningful medical bills even with
            good health insurance, and unresolved debts like credit cards don&apos;t disappear when someone
            dies, they typically become a claim against the estate. A second mistake is anchoring on a
            single published average cost as if it applies everywhere, when funeral costs in a major
            metropolitan area can run substantially higher than in a smaller town, and cremation costs are
            usually well below full burial costs. A third is buying coverage without accounting for savings
            or a policy that already exists, which leads to paying for more coverage than is actually
            needed.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the numbers you enter are reasonably accurate estimates of your actual
            expected costs; it has no independent source of funeral pricing and does not look up costs for
            your city or funeral home. The suggested face amount is a simple rounding of your entered
            coverage gap up to the nearest $1,000, reflecting how final expense policies are typically sold
            in round increments, and it doesn&apos;t account for inflation between now and when a policy would
            actually be used, insurer-specific minimum face amounts, or premium cost, which depends heavily
            on age, health, and the underwriting type an insurer offers. It also doesn&apos;t model taxes on an
            estate or state-specific probate rules that can affect how quickly debts get paid. Treat every
            figure here as a planning number for a conversation with a licensed insurance agent or, for
            estate questions, an attorney, not as a guaranteed outcome or an insurance quote.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Final expense insurance</strong> — a small whole life policy, usually with a face
              amount from a few thousand dollars up to around $50,000, built specifically to cover funeral,
              burial, and other immediate end-of-life costs rather than to replace income.
            </li>
            <li>
              <strong>Burial insurance</strong> — a marketing term generally used interchangeably with final
              expense insurance; both describe the same type of small, permanent policy sold to pay for
              funeral and burial costs.
            </li>
            <li>
              <strong>Guaranteed issue</strong> — a policy sold without health questions or a medical exam,
              with acceptance guaranteed within an insurer&apos;s age limits, usually priced higher per dollar
              of coverage and paired with a graded death benefit for the first few years.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For a published benchmark on funeral costs to compare your own numbers against, the{" "}
            <a
              href="https://nfda.org/news/statistics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Funeral Directors Association
            </a>{" "}
            periodically surveys member funeral homes and publishes median cost figures. The{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how final expense coverage fits alongside other life insurance types, and the{" "}
            <a
              href="https://content.naic.org/consumer/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on how life insurance policies, including guaranteed issue
            products, work. For the Social Security survivor death payment mentioned in the FAQ, see the{" "}
            <a
              href="https://www.ssa.gov/benefits/survivors/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Social Security Administration&apos;s survivors benefits page
            </a>
            . Before buying a policy, confirm licensing and any state-specific rules with your{" "}
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
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. If you also need to size coverage for lost income and dependents rather than just
            final expenses, the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            and the{" "}
            <Link href="/tools/life/dime-method-calculator" className="text-blue-600 hover:underline">
              DIME method calculator
            </Link>{" "}
            are built for that larger, longer-horizon question.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the numbers that matter most when
            planning coverage, from a single final expense estimate to a full year-by-year needs analysis.
            Every calculator runs on your own device, keeps whatever you type private to your session, and
            aims to leave you better prepared for the conversation with a licensed agent, not to replace it.
          </p>
        </section>
      </div>
    </>
  );
}

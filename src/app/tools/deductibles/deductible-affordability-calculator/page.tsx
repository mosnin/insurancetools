import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { DeductibleAffordabilityCalculatorTool } from "@/components/tools/DeductibleAffordabilityCalculatorTool";
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
 * This tool is not yet wired into the central `src/lib/tools.ts` registry
 * (a separate process owns that file), so the metadata this page needs is
 * defined locally rather than pulled through `getToolBySlug`.
 */
const tool: Tool = {
  slug: "deductible-affordability-calculator",
  name: "Deductible Affordability Calculator",
  description:
    "Check how much of your liquid emergency savings a single deductible would use, and what every deductible you carry would use combined if more than one claim hit at once.",
  category: "Deductibles",
  categorySlug: "deductibles",
  keywords: [
    "deductible affordability calculator",
    "can i afford my deductible",
    "deductible vs emergency fund calculator",
    "is my deductible too high",
    "deductible affordability check",
    "how much deductible can i afford",
  ],
  relatedTools: ["deductible-savings-calculator", "deductible-comparison-calculator"],
};

const TITLE = "Deductible Affordability Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this deductible affordability calculator to see what share of your liquid emergency savings a deductible would use, alone and if every policy claims at once.";
const PAGE_URL = `${SITE_URL}/tools/deductibles/deductible-affordability-calculator`;

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
    question: "What counts as liquid emergency savings for this calculator?",
    answer:
      "Cash you could actually get your hands on within a few days without penalty: a savings or checking account balance, a money market fund, or similar. It deliberately excludes a 401(k) or IRA, since withdrawing from those usually means taxes, penalties, or a delay you don't have when a claim needs paying now, and it excludes home equity, which isn't cash until you borrow against it or sell.",
  },
  {
    question: "Is there a specific percentage of my savings a deductible should never exceed?",
    answer:
      "This tool doesn't set one, on purpose. You'll see reputable-sounding rules of thumb elsewhere online, but how much of your available cash you're comfortable committing to a single deductible depends on your other expenses, your job stability, and what else that money is earmarked for. The calculator shows you the exact percentage your numbers produce; deciding whether that percentage feels comfortable is yours to make, ideally alongside a financial professional.",
  },
  {
    question: "Why does the calculator add up deductibles across different policies?",
    answer:
      "Because claims don't always arrive one at a time. A wind storm can damage your roof and your car in the same afternoon; a bad month can bring a health claim and a home claim close together. Looking only at your single largest deductible hides that combined exposure. Adding every deductible you entered gives you a realistic worst-case number to plan around, even though it won't happen on most years.",
  },
  {
    question: "I chose a high deductible to lower my premium. Does this tool tell me if that was a mistake?",
    answer:
      "It doesn't grade the decision, but it does show you the trade-off you accepted. A higher deductible almost always means a lower premium, and that's often a good deal if you have the cash reserve to back it up. This calculator's job is to check the second half of that equation, the cash reserve, since a lower premium isn't actually a saving if paying the deductible would put you in debt.",
  },
  {
    question: "What should I do if my deductibles would use up most of my emergency fund?",
    answer:
      "There's no single right move, but common options include building your emergency fund before your next renewal, lowering the deductible on the policy that worries you most even at a higher premium, or accepting the trade-off deliberately because you have other resources to fall back on, like a low-interest credit line. What matters is that the choice is made on purpose rather than discovered for the first time after a loss.",
  },
  {
    question: "Does a lower deductible always mean better coverage?",
    answer:
      "No — a lower deductible mainly means a higher premium and less cash needed at claim time, not broader coverage. The coverage limits, exclusions, and what's actually insured are separate questions from the deductible entirely. This tool only checks affordability of the deductible itself; pair it with your policy's coverage details when deciding what to change.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
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

export default function DeductibleAffordabilityCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Deductible Affordability Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter your liquid emergency savings and the deductibles you carry to see exactly what share of
            your available cash a claim would use, alone and in a worst-case, multiple-claim scenario.
            Free, instant, and nothing you type leaves your browser.
          </p>
          <LastUpdated category="deductibles" />
        </div>

        <div className="mt-2">
          <DeductibleAffordabilityCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-deductible-affordability-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why a Lower Premium Isn&apos;t Automatically the Right Call
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Raising a deductible is one of the most reliable ways to lower an insurance premium, which is
            exactly why so many shopping guides recommend it without asking the follow-up question: could
            you actually pay that deductible today? A deductible affordability calculator like this one
            exists to answer that second question directly, because the math on a quote comparison page
            only ever shows one side of the trade. A $2,000 deductible might save real money every year it
            goes unused, but the year it doesn&apos;t go unused, that $2,000 has to come from somewhere, and
            for a lot of households the honest answer is &ldquo;a credit card&rdquo; rather than &ldquo;a
            savings account.&rdquo; This tool checks the side of the decision that a premium quote never
            shows you.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run This Check</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is most useful for anyone who has chosen, or is considering choosing, a higher deductible
            to reduce a premium, and for anyone who&apos;s never actually sat down and compared their
            deductibles against their savings at all. It&apos;s also worth running whenever your emergency
            fund changes meaningfully, after a job change, a large purchase, or a year of aggressive
            saving, since a deductible that was comfortable last year might not be this year, and one that
            felt tight last year might now be easy. Households carrying several policies at once, home,
            auto, and anything else with its own deductible, benefit the most, since it&apos;s easy to check
            each policy&apos;s deductible against a premium in isolation and never notice what they add up to
            together.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Liquidity Check Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator takes the liquid emergency savings you enter, cash you could access within a
            few days without tax penalties or a sale, and compares it against two numbers. The first is
            your single largest deductible, which answers &ldquo;what happens if exactly one claim hits.&rdquo;
            The second adds every deductible you entered together, which answers a less comfortable but
            more realistic question: what happens if more than one claim lands close together, a home
            claim and an auto claim from the same storm, or simply an unlucky stretch of a few months.
            Both numbers are expressed as a percentage of your entered savings, along with the dollar
            amount left over, or the dollar shortfall, in each scenario. The tool does not assign a pass or
            fail grade to either percentage; it reports the math and leaves the comfort judgment to you,
            since what&apos;s reasonable for one household&apos;s finances isn&apos;t reasonable for another&apos;s.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a household with $4,000 in liquid emergency savings, a $2,000 homeowners deductible,
            and a $1,000 auto deductible, with no other policies entered. Their single largest deductible,
            the $2,000 homeowners deductible, is 50% of their emergency fund on its own, leaving $2,000 in
            reserve if only that policy is claimed against. Their combined deductibles come to $3,000,
            which is 75% of their fund, leaving only $1,000 if both a home claim and an auto claim land in
            the same stretch of time. Neither number is automatically a problem, but a household seeing
            that 75% figure for the first time now has real information: that emergency fund isn&apos;t
            actually free for anything else if two claims arrive close together, which is worth knowing
            before it happens rather than during it.
          </p>

          <AdInArticle slot="tool-deductible-affordability-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is choosing whichever premium is cheapest, or whichever deductible is
            highest, purely from a quote comparison page, without ever checking it against actual cash
            reserves. A close second is checking only the single largest deductible and assuming that
            covers the worst case, when the real worst case for a household carrying several policies is
            more than one deductible coming due around the same time. A third is treating retirement
            accounts or home equity as part of the emergency fund in this kind of check; both can
            eventually become cash, but neither is cash on the day a claim needs paying, which is the
            entire point of a liquidity check like this one.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator only compares numbers you enter; it has no knowledge of your actual account
            balances, your other monthly obligations, your income stability, or how likely you are to
            file a claim in any given year. It intentionally avoids stating a fixed &ldquo;safe&rdquo;
            percentage of savings a deductible should stay under, since no single threshold fits every
            household&apos;s expenses, debt, and risk tolerance, and presenting one as a rule would be more
            misleading than useful. The combined-deductible figure is a worst-case planning number, not a
            prediction that multiple claims will happen at once; most years, only one policy or none is
            claimed against. Treat every result here as a starting point for your own judgment, not a
            verdict, and bring it into a conversation with a licensed insurance agent or financial
            professional before changing a deductible.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Liquid emergency savings</strong> — cash you could access within a few days without
              a tax penalty or a sale, such as a savings or checking account balance, as distinct from
              retirement accounts or home equity.
            </li>
            <li>
              <strong>Self-insuring</strong> — deliberately carrying a higher deductible (or skipping
              coverage entirely) because you&apos;ve decided you can cover that portion of a loss yourself,
              in exchange for a lower premium.
            </li>
            <li>
              <strong>Cash-flow risk</strong> — the risk that you technically have enough net worth to
              cover a cost, but not enough accessible cash at the moment it&apos;s actually due.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            The Consumer Financial Protection Bureau publishes guidance on{" "}
            <a
              href="https://www.consumerfinance.gov/consumer-tools/save-and-invest/emergency-savings/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              building emergency savings
            </a>{" "}
            and what it means to have accessible cash on hand for a financial shock. The{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how deductibles work across policy types, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on coverage and cost trade-offs. For help finding a
            licensed agent to discuss a specific policy change, the{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              directory of state insurance departments
            </a>{" "}
            is a reliable starting point.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            category. If you&apos;re trying to decide between two specific deductible amounts on the same
            policy, the{" "}
            <Link href="/tools/deductibles/deductible-comparison-calculator" className="text-blue-600 hover:underline">
              deductible comparison calculator
            </Link>{" "}
            lines them up side by side, and the{" "}
            <Link href="/tools/deductibles/deductible-savings-calculator" className="text-blue-600 hover:underline">
              deductible savings calculator
            </Link>{" "}
            shows the premium side of that same decision, how much raising your deductible would actually
            save. Once you&apos;ve settled on an affordable deductible, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            can help with the rest of the policy.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the insurance decisions that are
            easy to get wrong on a quote page alone. Nothing you enter here is stored or sent anywhere, and
            every result is meant as a starting point for a conversation with a licensed agent, not a
            replacement for one.
          </p>
        </section>
      </div>
    </>
  );
}

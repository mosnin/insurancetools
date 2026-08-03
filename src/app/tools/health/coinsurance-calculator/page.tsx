import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { CoinsuranceCalculatorTool } from "@/components/tools/CoinsuranceCalculatorTool";
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
 * This tool is not yet wired into the central registry in `src/lib/tools.ts`
 * (that file is integrated by a separate process), so a local Tool-shaped
 * object is built here for structured data and metadata rather than calling
 * `getToolBySlug`, which would return `undefined` until registration lands.
 */
const tool: Tool = {
  slug: "coinsurance-calculator",
  name: "Coinsurance Calculator",
  description:
    "Calculate exactly what you'll owe on a single medical bill after your deductible, your plan's coinsurance percentage, and any remaining out-of-pocket maximum.",
  category: "Health",
  categorySlug: "health",
  keywords: [
    "coinsurance calculator",
    "how much will i owe in coinsurance",
    "coinsurance calculator health insurance",
    "20 percent coinsurance calculator",
    "patient responsibility calculator",
    "coinsurance vs copay calculator",
  ],
  relatedTools: ["medical-bill-responsibility-calculator", "copay-vs-coinsurance-plan-calculator"],
};

const TITLE = "Coinsurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this coinsurance calculator to see what you'll owe on one medical bill after your deductible, coinsurance percentage, and out-of-pocket max are applied.";
const PAGE_URL = `${SITE_URL}/tools/health/coinsurance-calculator`;

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
    question: "What's the actual difference between coinsurance and a copay?",
    answer:
      "A copay is a flat dollar amount, such as $30 for a primary care visit, that stays the same no matter what the visit costs. Coinsurance is a percentage of the bill, such as 20%, so the dollar amount you owe changes with the size of the charge. Some plans use a copay for routine visits and coinsurance for bigger-ticket care like surgery or imaging, which is why the same plan can show both terms on different lines of a benefits summary.",
  },
  {
    question: "Does this calculator know what my coinsurance percentage is?",
    answer:
      "No, and it never guesses. Coinsurance percentages vary by plan, by network status, and sometimes by the type of service, so this tool always asks you to enter your own plan's percentage from your insurance card, your summary of benefits and coverage, or your insurer's member portal. Treating any percentage as a universal default would give you a wrong answer on purpose.",
  },
  {
    question: "What happens if I haven't met my deductible yet?",
    answer:
      "The calculator applies the bill to your remaining deductible first, dollar for dollar, before any coinsurance percentage applies. Only the portion of the bill left over after your deductible is satisfied gets split between you and your insurer at your coinsurance rate. If your remaining deductible is larger than the bill itself, the entire bill goes toward the deductible and no coinsurance applies yet.",
  },
  {
    question: "How does the out-of-pocket maximum change the result?",
    answer:
      "Your annual out-of-pocket maximum is a hard ceiling on what you pay for covered care in a plan year, combining deductible, copays, and coinsurance together. If you enter how much room you have left under that ceiling, the calculator caps your responsibility there even if the deductible-plus-coinsurance math would otherwise charge you more, and shows you exactly how much that cap saved you on this bill.",
  },
  {
    question: "Why might my real bill differ from this estimate?",
    answer:
      "This tool assumes the amount you enter is your plan's negotiated allowed amount and that the service is fully in-network and covered. Out-of-network providers, non-covered services, billing errors, and balance billing from providers who aren't part of the negotiated rate can all change what actually lands on your final bill. Your Explanation of Benefits from your insurer is the authoritative record, not this calculator.",
  },
  {
    question: "Is this the same as the medical bill responsibility calculator?",
    answer:
      "No. This calculator is intentionally narrow: it walks through one bill at a time. The medical bill responsibility calculator models a fuller plan-year waterfall across multiple bills and running deductible or out-of-pocket totals. Use this one when you have a single bill or estimate in front of you and want a fast, focused answer.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Health Insurance Tools", href: "/tools/health" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function CoinsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Coinsurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter one bill, your deductible status, and your plan&apos;s coinsurance percentage to see exactly
            what you owe and what your insurer covers, capped at your out-of-pocket max if you have one.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <CoinsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-coinsurance-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Coinsurance Actually Is</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Coinsurance is the percentage of a covered medical bill you&apos;re responsible for after your
            deductible has been met, with your insurer picking up the rest. It&apos;s frequently confused with
            a copay, which is a flat dollar amount charged regardless of the bill&apos;s size, and the two often
            sit side by side on the same plan: a $25 copay for an office visit, say, but 20% coinsurance for
            an outpatient procedure. This coinsurance calculator exists because coinsurance math involves
            more moving parts than a copay does. It depends on where you are in your deductible, what
            percentage your specific plan charges, and how close you are to your annual out-of-pocket
            maximum, and getting any one of those numbers wrong changes the answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the moment you have one specific bill, or a cost estimate from a
            provider, and want to know your share before the invoice arrives or before you schedule a
            procedure. It&apos;s narrower on purpose: it handles a single bill cleanly rather than trying to
            project a whole plan year at once. If you&apos;re instead trying to track cumulative spending
            across several bills over a year, the{" "}
            <Link href="/tools/health/medical-bill-responsibility-calculator" className="text-blue-600 hover:underline">
              medical bill responsibility calculator
            </Link>{" "}
            is built for that broader job. Use this one when someone hands you a bill, an estimate, or a
            pre-authorization amount and you just need a fast, accurate answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Waterfall Calculation Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator processes your bill in the same order your insurer does. First, if you haven&apos;t
            met your deductible yet, the bill is applied to whatever deductible remains, dollar for dollar,
            up to the full amount of the bill. Second, whatever is left over after the deductible is split
            using your coinsurance percentage: your entered percentage is charged to you, and the remainder
            goes to your insurer. Third, if you&apos;ve told the calculator how much room you have left under
            your annual out-of-pocket maximum, your total responsibility for this bill is capped there, even
            if the deductible-plus-coinsurance math would otherwise charge you more. Each step only ever
            applies to the amount actually remaining, so a bill smaller than your remaining deductible never
            triggers coinsurance at all, and a bill that would push you past your out-of-pocket max gets
            capped rather than overcharged.
          </p>

          <AdInArticle slot="tool-coinsurance-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say you receive a $2,500 bill for an outpatient procedure. You&apos;ve got $500 left on your
            deductible for the year, your plan charges 20% coinsurance, and you have $3,000 remaining under
            your out-of-pocket maximum. The first $500 of the bill goes entirely toward your deductible.
            That leaves $2,000, split 20/80: you owe $400 in coinsurance, and your insurer covers the
            remaining $1,600. Your total responsibility for this bill comes to $900 ($500 deductible plus
            $400 coinsurance), well under your $3,000 of remaining out-of-pocket room, so no cap applies.
            Change the deductible status to already met, and the math shifts: the full $2,500 is now subject
            to 20% coinsurance, meaning you&apos;d owe $500 instead, all of it coinsurance rather than deductible.
            Small changes to your inputs move the final number in ways that are easy to miscalculate by hand.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common error is confusing the coinsurance percentage with the insurer&apos;s share
            instead of your own. A plan described as &ldquo;20% coinsurance&rdquo; means you pay 20% and your insurer
            pays 80%, not the reverse, but the phrasing on benefit summaries doesn&apos;t always make that
            explicit, and it&apos;s an easy number to flip in your head under stress. A second frequent mistake
            is forgetting that coinsurance only applies after the deductible, so people sometimes multiply
            the full bill by their coinsurance percentage without first subtracting whatever deductible
            still applies, which overstates what they actually owe.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the billed amount you enter matches your plan&apos;s negotiated allowed
            amount, that the service is in-network, and that the coinsurance percentage and deductible figures
            you enter are current and correct for this specific service. It does not know your plan&apos;s
            covered-service list, whether prior authorization was required, or whether a provider might
            balance bill you for charges above the allowed amount, all of which can change your final bill
            in ways this tool cannot see. Treat the result as a planning estimate to compare against your
            Explanation of Benefits, not as a substitute for it, and contact your insurer directly if a real
            bill doesn&apos;t match what you expected.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Coinsurance</strong> — the percentage of a covered bill you pay after your deductible
              is met, with your insurer paying the remaining percentage.
            </li>
            <li>
              <strong>Copay</strong> — a fixed dollar amount charged for a specific type of service,
              regardless of the total bill, separate from and often used alongside coinsurance.
            </li>
            <li>
              <strong>Allowed amount</strong> — the maximum amount your insurer will pay for a covered
              service, based on its negotiated rate with the provider; coinsurance is calculated against
              this figure, not necessarily the provider&apos;s original list price.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For official definitions of these terms, see{" "}
            <a
              href="https://www.healthcare.gov/glossary/coinsurance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov&apos;s coinsurance glossary entry
            </a>
            , its{" "}
            <a
              href="https://www.healthcare.gov/glossary/co-payment/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              copayment glossary entry
            </a>
            , and its{" "}
            <a
              href="https://www.healthcare.gov/glossary/allowed-amount/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              allowed amount glossary entry
            </a>
            . For how the annual out-of-pocket maximum caps this figure, see{" "}
            <a
              href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              its out-of-pocket maximum glossary entry
            </a>
            , and for the deductible mechanics this calculator applies first, see the{" "}
            <a
              href="https://www.healthcare.gov/glossary/deductible/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              deductible glossary entry
            </a>
            , all maintained by the Centers for Medicare and Medicaid Services.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If you&apos;re tracking spending across more than one bill this year, the{" "}
            <Link href="/tools/health/medical-bill-responsibility-calculator" className="text-blue-600 hover:underline">
              medical bill responsibility calculator
            </Link>{" "}
            handles the fuller plan-year waterfall. If you&apos;re still choosing between plans and want to
            weigh copay-heavy against coinsurance-heavy designs before you enroll, the{" "}
            <Link href="/tools/health/copay-vs-coinsurance-plan-calculator" className="text-blue-600 hover:underline">
              copay vs. coinsurance plan calculator
            </Link>{" "}
            is the better starting point.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn confusing insurance math into a
            clear number you can actually use. Every tool runs entirely in your browser, keeps your figures
            private, and is designed to leave you better prepared for a conversation with your insurer or a
            licensed agent, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

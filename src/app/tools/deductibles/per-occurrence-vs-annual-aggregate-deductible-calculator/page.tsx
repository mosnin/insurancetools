import type { Metadata } from "next";
import Link from "next/link";
import { PerOccurrenceVsAnnualAggregateDeductibleCalculatorTool } from "@/components/tools/PerOccurrenceVsAnnualAggregateDeductibleCalculatorTool";
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

const tool = getToolBySlug("per-occurrence-vs-annual-aggregate-deductible-calculator")!;

const TITLE = "Per Occurrence vs Aggregate Deductible Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this per occurrence vs aggregate deductible calculator to see the real dollar difference between per-occurrence and annual aggregate deductible structures.";
const PAGE_URL = `${SITE_URL}/tools/deductibles/per-occurrence-vs-annual-aggregate-deductible-calculator`;

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
    question: "What is an annual aggregate deductible?",
    answer:
      "An annual aggregate deductible is a single dollar cap on the total amount a policyholder pays out of pocket across every claim combined during one policy year, rather than a separate deductible applied to each individual claim. Once the running total the policyholder has paid reaches that cap, the insurer covers 100% of every additional covered loss for the remainder of the policy year.",
  },
  {
    question: "What's the actual difference between per-occurrence and aggregate deductibles?",
    answer:
      "A per-occurrence deductible resets and applies in full to every single claim, so a policyholder with three claims in one year pays the deductible amount up to three separate times. An annual aggregate deductible caps the total across all of those claims combined, so the policyholder never pays more than the aggregate amount in a single year no matter how many claims occur. The two structures cost exactly the same when there is only one claim in the year; the difference only shows up once a second or third claim happens.",
  },
  {
    question: "Is an annual aggregate deductible the same thing as a self-insured retention (SIR)?",
    answer:
      "They're related but not identical. Both cap what a policyholder absorbs before broader coverage responds, and both are common on commercial policies. An aggregate deductible is still part of the insurer's own policy limit structure, while a self-insured retention typically sits below the insurance policy entirely and the policyholder (or a third-party administrator they hire) handles and pays those claims directly, often including defense costs, before the policy responds at all. Your policy's declarations page will state which one actually applies.",
  },
  {
    question: "Which deductible structure is cheaper if my business only files one claim a year?",
    answer:
      "Neither, mathematically. When there is exactly one claim in the policy year, a per-occurrence deductible and an annual aggregate deductible of the same dollar amount produce an identical out-of-pocket total, because there's nothing left to aggregate. The structural choice only starts to matter financially once multiple claims occur in the same policy year, which is exactly what this calculator is built to show with more than one claim entered.",
  },
  {
    question: "Why would a business ever choose per-occurrence over an aggregate cap?",
    answer:
      "Insurers generally price per-occurrence deductibles lower in premium than an aggregate structure with the same headline deductible amount, because the insurer's own maximum exposure to frequent, smaller claims is higher under an aggregate cap. A business with very few expected claims in a typical year may find the lower premium worth the added exposure if multiple claims happen to hit in the same year. This calculator doesn't compare premiums, only claim outcomes, so weigh its output against actual quotes for each structure.",
  },
  {
    question: "Does this calculator account for multiple policy years or a reinstated aggregate?",
    answer:
      "No. It models a single policy year using the claim amounts you enter, and the aggregate cap resets at the start of a new policy year in the real world just as it does here between separate calculations. It also doesn't model per-claim sublimits, coinsurance, or policy-specific aggregate reinstatement provisions, all of which vary by insurer and by policy and should be confirmed directly in your policy's declarations page.",
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

export default function PerOccurrenceVsAnnualAggregateDeductibleCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Per-Occurrence vs. Annual Aggregate Deductible Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter your deductible and a few hypothetical claims for the year to see, in real dollars, what
            a per-occurrence deductible structure costs you compared with an annual aggregate cap on the
            same claims. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="deductibles" />
        </div>

        <div className="mt-2">
          <PerOccurrenceVsAnnualAggregateDeductibleCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-per-occurrence-vs-aggregate-deductible-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why the Deductible Structure Matters as Much as the Amount
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most people comparing insurance quotes look at the deductible as a single number: higher
            deductible, lower premium, and vice versa. That comparison quietly assumes the deductible works
            the same way on every policy, and on commercial and business policies in particular, it often
            doesn&apos;t. A per occurrence vs aggregate deductible calculator like this one exists because the
            same $10,000 figure can mean something very different depending on whether it resets for every
            claim or caps your total exposure for the entire year. This tool is built mainly for business
            owners and risk managers comparing commercial policy structures, general liability, property,
            professional liability, and similar lines, where aggregate deductibles show up regularly and
            the choice between the two structures has a real financial consequence once more than one claim
            happens in a policy year.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How Each Deductible Structure Is Calculated
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Under a per-occurrence deductible, the calculator applies your entered deductible amount
            separately to every claim you list. For each claim, your out-of-pocket cost is whichever is
            smaller: the deductible itself, or the claim amount (a claim smaller than the deductible never
            triggers the insurer to pay anything). Add up that per-claim amount across every claim in the
            year and you get the total per-occurrence out-of-pocket figure.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Under an annual aggregate deductible, the same dollar figure instead acts as a single ceiling on
            what you pay across the whole year combined. The calculator tracks a running total: each claim
            is paid out of pocket up to whatever portion of the aggregate cap hasn&apos;t already been used up
            by earlier claims. Once the running total reaches the cap, every remaining claim for the rest of
            the year is paid in full by the insurer, with no further deductible applied. The order claims
            arrive in doesn&apos;t change the final total you pay, only how quickly the cap gets reached.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example With Multiple Claims</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Take a $10,000 deductible and three claims in one policy year: $4,000, $12,000, and $25,000.
            Under a per-occurrence structure, the first claim is fully absorbed at $4,000 (under the
            deductible), and the second and third claims each hit the full $10,000 deductible, for a total
            of $24,000 out of pocket across the year. Under an annual aggregate structure with the same
            $10,000 cap, the first claim uses $4,000 of the cap, the second claim uses the remaining $6,000
            and hits the cap exactly, and the third claim is covered in full by the insurer because the cap
            was already met. Total out of pocket under the aggregate structure: $10,000. That&apos;s a $14,000
            difference from the exact same deductible figure, driven entirely by which structure the policy
            uses, not by the deductible amount itself.
          </p>

          <AdInArticle slot="tool-per-occurrence-vs-aggregate-deductible-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake When Comparing Quotes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The mistake this tool most often catches is assuming &ldquo;deductible&rdquo; always means per-occurrence
            when comparing two quotes side by side. A business owner comparing a $15,000 per-occurrence
            deductible against a $15,000 aggregate deductible from a different insurer might treat those as
            equivalent because the number matches, when in a year with two or more claims they can produce
            very different total costs. The fix isn&apos;t complicated: read the declarations page, or ask the
            agent directly, whether the quoted deductible is per-occurrence or aggregate before comparing
            the premium savings against the deductible amount alone.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator applies one entered deductible figure under both structures purely to isolate
            the effect of the structure itself; it does not know whether your actual policy uses a
            per-occurrence or aggregate deductible, and every claim amount you enter is hypothetical unless
            you type in figures from your own claim history. It models a single policy year and does not
            account for aggregate reinstatement provisions, per-claim sublimits, coinsurance, or
            policy-specific exclusions, all of which vary by insurer and by policy. It also does not compare
            premiums between the two structures, only the claims-side out-of-pocket outcome, since premium
            pricing depends on underwriting factors this tool has no access to. Treat every result as a
            planning input to bring into a conversation with a licensed insurance agent or broker, not as a
            substitute for reading your actual policy documents.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Per-occurrence deductible</strong> — a deductible that applies separately and in full
              to each individual claim, with no memory of how many other claims occurred in the same policy
              year.
            </li>
            <li>
              <strong>Annual aggregate deductible</strong> — a deductible structured as a single cap on the
              total the policyholder pays across all claims combined in one policy year, after which the
              insurer pays 100% of further covered losses for the rest of that year.
            </li>
            <li>
              <strong>Self-insured retention (SIR)</strong> — an amount the policyholder (or a third-party
              administrator acting on their behalf) pays and handles directly, typically including defense
              costs, before the insurance policy responds at all; distinct from a deductible, which usually
              sits inside the insurer&apos;s own claim-handling process from the start.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For further reading on how deductibles function generally, the{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the mechanics behind deductible structures, and the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines the business insurance basics that commercial deductible structures sit inside. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on coverage terminology, and your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            can confirm whether any state-specific rules apply to your policy&apos;s deductible structure.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            category. If you&apos;re still deciding on a deductible amount before worrying about structure, the{" "}
            <Link href="/tools/deductibles/deductible-comparison-calculator" className="text-blue-600 hover:underline">
              deductible comparison calculator
            </Link>{" "}
            compares premium savings against different deductible levels. Business owners evaluating a
            commercial policy more broadly may also want the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              business insurance calculators
            </Link>{" "}
            for coverage types beyond the deductible itself.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that walk through the specific mechanics
            behind coverage decisions, not just generic estimates. Every tool runs entirely in your browser,
            keeps whatever numbers you enter to yourself, and aims to leave you better prepared for the
            conversation you eventually have with a licensed agent or broker.
          </p>
        </section>
      </div>
    </>
  );
}

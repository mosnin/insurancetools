import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { CobraCostCalculatorTool } from "@/components/tools/CobraCostCalculatorTool";
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
  slug: "cobra-cost-calculator",
  name: "COBRA Cost Calculator",
  description:
    "Find your exact COBRA premium at the 102% rate (or 150% during a disability extension), see what your employer used to pay, and compare the total against a marketplace plan.",
  category: "Health",
  categorySlug: "health",
  keywords: [
    "COBRA cost calculator",
    "how much does COBRA cost",
    "COBRA insurance calculator",
    "COBRA premium calculator",
    "COBRA vs marketplace insurance cost",
    "COBRA 102 percent rule",
  ],
  relatedTools: ["health-plan-comparison-calculator", "family-plan-cost-calculator"],
};

const TITLE = "COBRA Cost Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this COBRA cost calculator to find your exact 102% COBRA premium after a job loss, see your employer's old share, and compare it to a marketplace plan.";
const PAGE_URL = `${SITE_URL}/tools/health/cobra-cost-calculator`;

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
    question: "Why is my COBRA premium so much higher than what was deducted from my paycheck?",
    answer:
      "Because your paycheck deduction was never the full cost of your coverage. While you were employed, your employer was quietly paying a share of the premium on your behalf, often the larger share. COBRA lets you keep the exact same plan, but the law only requires your former employer to let you pay for it, not to keep contributing toward it. Once you elect COBRA, you take over the employer's former share plus your own, plus a 2% administrative charge, which is why the number on your COBRA bill is usually two to four times the payroll deduction you were used to seeing.",
  },
  {
    question: "What actually counts as a qualifying event for COBRA?",
    answer:
      "The Department of Labor lists a specific set of triggers: voluntary or involuntary job loss (other than for gross misconduct), a reduction in work hours that drops you below plan eligibility, divorce or legal separation from the covered employee, a covered employee becoming entitled to Medicare, death of the covered employee, or a dependent child losing dependent status under the plan's rules. Not every job change qualifies, and the specific event you experienced also determines how long your continuation coverage can run, so check your COBRA election notice for the qualifying event your plan administrator recorded.",
  },
  {
    question: "How long does COBRA coverage actually last?",
    answer:
      "For the most common qualifying event, job loss or a reduction in hours, COBRA generally runs 18 months. Certain other qualifying events, such as divorce, a covered employee's death, or a dependent losing eligible status, can extend continuation coverage up to 36 months for the affected dependents. These are the general federal timeframes the Department of Labor publishes; your plan administrator confirms the exact length that applies to your specific qualifying event, and some circumstances can extend or cut short the period.",
  },
  {
    question: "Is the 150% premium cap the same thing as the general COBRA rule?",
    answer:
      "No, and this calculator keeps the two separate on purpose. The general rule, which applies to the large majority of COBRA participants, caps the premium at 102% of the total cost. The 150% cap only applies to specific months during an approved Social Security disability extension, and it doesn't apply to every month of that extension or to every family member automatically. Check the checkbox in the calculator only if your plan administrator has confirmed you qualify for this specific extension; otherwise leave it unchecked and the tool applies the standard 102% rate.",
  },
  {
    question: "Is COBRA always more expensive than a marketplace plan?",
    answer:
      "Not always, which is exactly why this calculator includes a side-by-side comparison field instead of assuming an answer. COBRA can be the more expensive option once you're paying the full premium yourself, but a marketplace plan's sticker price without subsidies can also land higher than COBRA, particularly for older enrollees or richer employer plans. Losing job-based coverage is itself a qualifying life event that can open a special enrollment period for marketplace coverage, so it's worth pulling an actual marketplace quote to compare rather than assuming either option wins by default.",
  },
  {
    question: "Do state mini-COBRA laws change any of these numbers?",
    answer:
      "They can. Federal COBRA generally applies to employers with 20 or more employees. Many states run their own continuation coverage laws, often called mini-COBRA, covering smaller employers or, in some states, extending continuation periods beyond the federal minimums. This calculator applies the federal 102%/150% premium structure, which is the most consistent number across states, but it doesn't model every state's mini-COBRA variation. Confirm your specific state's rules with your plan administrator or your state insurance department if your former employer has fewer than 20 employees.",
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

export default function CobraCostCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            COBRA Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Find out exactly what COBRA continuation coverage will cost once you take over your
            employer&apos;s old share of the premium, and see how that number stacks up against a
            marketplace plan. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <CobraCostCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-cobra-cost-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What COBRA Is and Who Qualifies
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            COBRA continuation coverage is a federal right, created by the Consolidated Omnibus Budget
            Reconciliation Act and administered by the U.S. Department of Labor, that lets someone who
            loses job-based group health coverage keep that exact same plan for a limited time by paying
            for it themselves. It exists because losing employer coverage often happens at the worst
            possible moment to also switch doctors, prescriptions, or in-progress treatment, so COBRA
            trades a higher premium for continuity rather than forcing an immediate plan change. Not
            every change in employment status triggers it: the Department of Labor defines a specific
            list of qualifying events, including voluntary or involuntary job loss for reasons other than
            gross misconduct, a reduction in hours that drops an employee below the plan&apos;s eligibility
            threshold, divorce or legal separation from a covered employee, a covered employee becoming
            entitled to Medicare, the covered employee&apos;s death, or a dependent child aging out of
            dependent status. This calculator is built for the moment right after one of those events,
            when a COBRA election notice has arrived with a premium figure that looks nothing like the
            payroll deduction you were used to.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How the 102% Rule, and the 150% Disability Extension, Actually Work
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Under the COBRA statute (29 U.S.C. § 1162), a plan may charge a qualified beneficiary up to
            102% of the applicable premium for continuation coverage. That applicable premium is the
            total cost of the plan, meaning the portion your employer used to contribute plus the portion
            that came out of your paycheck, added together. The extra 2% is not profit; it&apos;s an
            administrative charge the law permits to cover the cost of running continuation coverage.
            This calculator applies that 102% rate by default to whatever total premium you enter, then
            separately shows how much of your new bill is simply your old employer&apos;s contribution
            becoming your own responsibility.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            There is a documented exception, and this tool keeps it clearly separate rather than folding
            it into the general rule. For certain months during an approved Social Security disability
            extension, the statute allows the premium cap to rise to 150% of the total premium instead of
            102%. This only applies to specific months of an approved disability extension, not to every
            COBRA participant or every month of coverage, which is why the calculator only switches to the
            150% rate when the disability extension checkbox is explicitly selected, and defaults back to
            the standard 102% rule otherwise.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider someone who was paying $150 a month toward their employer plan through payroll
            deduction, while their employer quietly covered the rest of a $650 total monthly premium.
            After a layoff, their COBRA election notice lists that same $650 figure as the applicable
            premium. At the standard 102% rate, their new COBRA bill is $663 a month, a jump of $513 over
            what they were used to paying, not because the plan changed, but because the $500 their
            employer used to contribute is now entirely their own responsibility, plus a $13 administrative
            charge. Run against a marketplace plan quote of $520 a month for comparable coverage, this
            person would save roughly $143 a month, or about $1,716 a year, by shopping the marketplace
            instead of electing COBRA, though that marketplace plan may carry a different network or
            deductible structure worth weighing against the convenience of keeping their existing plan.
          </p>

          <AdInArticle slot="tool-cobra-cost-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is assuming COBRA will cost roughly what was already being
            deducted from a paycheck, then being blindsided by a bill two to four times that size once the
            employer&apos;s former contribution is added in. A close second is forgetting that losing
            job-based coverage is itself a qualifying life event that opens a special enrollment period for
            marketplace coverage, and electing COBRA by default without ever pulling a marketplace quote to
            compare. A third is treating the 150% disability extension rate as if it applied generally,
            rather than confirming with a plan administrator whether that specific, narrower rule actually
            applies to the months in question.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator applies the federal 102% and 150% premium caps directly from the COBRA
            statute, which are documented, fixed rules rather than estimates. Duration figures cited above,
            generally 18 months for the common job-loss or reduced-hours qualifying event and up to 36
            months for certain other qualifying events such as divorce or a dependent losing eligibility,
            are the Department of Labor&apos;s published general framework; the exact period that applies to
            your situation is set by your specific qualifying event and confirmed on your COBRA election
            notice. This tool does not know your plan&apos;s exact billing schedule, grace periods, or
            payment deadlines, and it does not model state mini-COBRA laws, which can extend continuation
            coverage requirements to smaller employers or lengthen coverage periods in some states.
            Marketplace premiums entered for comparison are whatever figure you supply; this tool does not
            look up subsidy eligibility, which depends on household income and can substantially change
            what a marketplace plan actually costs you. Confirm your exact premium, deadlines, and any
            state-specific rules with your plan administrator before making a coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Qualifying event</strong> — a specific life event defined by the COBRA statute, such
              as job loss, reduced hours, divorce, or a dependent losing eligibility, that triggers the
              right to elect continuation coverage.
            </li>
            <li>
              <strong>Continuation coverage</strong> — the COBRA term for keeping an existing employer group
              health plan after a qualifying event, paid for entirely by the qualified beneficiary rather
              than shared with an employer.
            </li>
            <li>
              <strong>Special enrollment period</strong> — a window outside the annual open enrollment
              period during which a qualifying life event, including the loss of job-based coverage, allows
              someone to enroll in a new marketplace plan.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the full federal rules behind continuation coverage, qualifying events, and premium limits,
            see the{" "}
            <a
              href="https://www.dol.gov/general/topic/health-plans/cobra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of Labor&apos;s COBRA continuation coverage overview
            </a>
            . For a plain-language comparison of COBRA against marketplace coverage after a job loss, see{" "}
            <a
              href="https://www.healthcare.gov/unemployed/cobra-coverage/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov&apos;s guidance on COBRA and job-based insurance
            </a>
            . For definitions of the qualifying life events that open marketplace enrollment, see the{" "}
            <a
              href="https://www.healthcare.gov/glossary/qualifying-life-event/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary entry for qualifying life events
            </a>{" "}
            and its{" "}
            <a
              href="https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              entry on the special enrollment period
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If you&apos;re weighing COBRA against a spouse&apos;s or partner&apos;s employer plan
            instead of the individual marketplace, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            can help you weigh premiums, deductibles, and out-of-pocket costs side by side. If your COBRA
            decision covers a spouse or children rather than just yourself, the{" "}
            <Link href="/tools/health/family-plan-cost-calculator" className="text-blue-600 hover:underline">
              family plan cost calculator
            </Link>{" "}
            estimates total household coverage costs across the whole family rather than a single person.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free, browser-based calculators for figuring out what coverage,
            claims, and continuation options actually cost, without collecting your personal information
            to do it. This calculator was built so anyone holding a COBRA election notice can see the real
            math behind the premium in minutes, rather than guessing at why it looks so much higher than
            their old paycheck deduction.
          </p>
        </section>
      </div>
    </>
  );
}

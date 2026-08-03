import type { Metadata } from "next";
import Link from "next/link";
import { FamilyPlanCostCalculatorTool } from "@/components/tools/FamilyPlanCostCalculatorTool";
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

const tool = getToolBySlug("family-plan-cost-calculator")!;

const TITLE = "Family Health Plan Cost Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this free family health plan cost calculator to compare a family-tier premium against separate individual plans and find your exact break-even point.";
const PAGE_URL = `${SITE_URL}/tools/health/family-plan-cost-calculator`;

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
    question: "Does this family health plan cost calculator tell me which plan has better coverage?",
    answer:
      "No. It only compares what you'd pay in premiums for one family plan versus separate individual plans for each dependent. It doesn't know either plan's deductible, copay structure, provider network, or out-of-pocket maximum, all of which matter as much as the premium. Pull those details from each plan's summary of benefits and coverage before you decide, especially if anyone in the household has ongoing medical needs.",
  },
  {
    question: "Why does my employer's family plan use a flat rate instead of pricing per dependent?",
    answer:
      "Both structures are common and employers choose based on their own cost-sharing strategy. A flat family tier is simpler to communicate and tends to favor larger households, since the fourth or fifth dependent adds nothing to the premium. Per-dependent pricing is more common with level-funded or self-insured employer plans and can favor smaller households, since you're only paying for the dependents you actually add. Check your plan's rate sheet or ask HR which structure applies before assuming either one.",
  },
  {
    question: "What counts as a dependent who'd otherwise need a separate plan?",
    answer:
      "Typically a spouse who could enroll in their own employer's plan instead, or a child who could go on a separate marketplace or other-parent's plan. If a dependent has no realistic separate coverage option, such as a child with no other available plan, the comparison is less relevant for that person since staying on the family plan isn't really optional for them.",
  },
  {
    question: "How is the break-even number of dependents calculated?",
    answer:
      "For a flat family-tier premium, the calculator finds the number of dependents at which the sum of separate individual premiums equals the flat family rate, then rounds up to the next whole dependent, since you can't add a fractional person to a plan. Above that count, the family plan costs less; below it, separate plans cost less. For per-dependent pricing there's no crossover point, since the marginal cost per dependent stays the same regardless of how many you add.",
  },
  {
    question: "Should I switch plans outside of open enrollment if this calculator shows savings?",
    answer:
      "Generally you can only change health plan elections during your employer's open enrollment period or after a qualifying life event, such as marriage, birth of a child, or loss of other coverage. If this calculator shows meaningful savings, use that as a reason to compare plans carefully at your next open enrollment rather than assuming you can switch immediately.",
  },
  {
    question: "Why do you ask for a separate premium per dependent instead of one household figure?",
    answer:
      "Because a spouse's own employer premium and a marketplace premium for a child are rarely the same number, and lumping them together would hide which comparison is actually driving the result. If your dependents have meaningfully different separate-plan costs, run the calculator once per dependent group and add the results together for a more accurate total.",
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

export default function FamilyPlanCostCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Family Health Plan Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Find out whether one family plan actually costs less than keeping each household member on
            their own separate individual plan, and exactly how many dependents it takes to break even.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <FamilyPlanCostCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-family-plan-cost-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs a Family Health Plan Cost Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the specific moment when two working adults each have access to their
            own employer&apos;s health coverage and have to decide who covers whom. Maybe your employer just
            sent an open enrollment packet showing a family-tier premium, and your spouse&apos;s employer
            offers a competing individual rate. Maybe you&apos;re adding a new child and wondering whether
            it&apos;s cheaper to add them to your plan or keep everyone split across two employers&apos; plans.
            Either way, the premium math is rarely obvious just from staring at two rate sheets side by
            side, which is exactly the gap this family health plan cost calculator is meant to close.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Break-Even Point Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Employer health plans price dependents one of two ways, and this calculator supports both
            because the math is genuinely different for each. Under a flat family-tier structure, one
            premium covers you plus every dependent you add, so the calculator compares that flat monthly
            rate against the sum of what each dependent would pay on a separate individual plan, plus
            what you&apos;d pay for your own individual coverage. It then solves for the exact number of
            dependents at which the two totals cross, rounding up to the next whole person since you
            can&apos;t enroll a fraction of a dependent. Below that count, separate plans win; at or above
            it, the family plan wins.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Under a per-dependent structure, each additional dependent adds a fixed charge to your own
            individual premium, so there&apos;s no single break-even count to solve for. Instead, the
            calculator compares that fixed per-dependent add-on directly against the separate individual
            plan premium: whichever number is smaller wins for every dependent you add, from the first
            one on. The tool tells you which side of that comparison you&apos;re on and by how much, using
            only the numbers you type in.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say your individual premium is $410 a month, your employer&apos;s flat family-tier premium is
            $1,180 a month, and you have two dependents (a spouse and one child) who could each get
            separate coverage for roughly $360 a month apiece. Separate coverage for everyone would run
            $410 + (2 &times; $360) = $1,130 a month, or $13,560 a year. The family plan at $1,180 a
            month comes to $14,160 a year, meaning separate plans actually win by $600 a year at this
            household size. Solving for the break-even point shows the family plan only overtakes
            separate plans once you have at least three dependents on it &mdash; a third child or
            additional dependent would push the math the other way. That&apos;s the kind of answer that
            isn&apos;t obvious from comparing two premiums by eye, and it changes entirely if either
            employer&apos;s rates change at the next open enrollment.
          </p>

          <AdInArticle slot="tool-family-plan-cost-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is comparing premiums alone and stopping there. A cheaper
            family plan with a $6,000 deductible and a $12,000 out-of-pocket maximum can cost a household
            with a chronic condition or a planned surgery far more in a bad year than a pricier plan with
            a $1,500 deductible, even after the premium difference. A second mistake is assuming a spouse&apos;s
            employer plan premium stays flat when it&apos;s actually a tiered rate that changes as you add or
            remove that spouse from other coverage. A third is running this comparison once at hire and
            never revisiting it, even though family-tier premiums, per-dependent add-ons, and separate
            plan rates typically change every plan year.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every number this calculator uses comes from what you type in; it does not know your actual
            employer&apos;s rate sheet, your spouse&apos;s plan options, or any typical premium difference
            between family and individual coverage, because no such figure is reliable enough across
            employers to bake into a calculator. It compares premiums only and does not model deductibles,
            copays, coinsurance, provider networks, or out-of-pocket maximums, all of which can outweigh a
            premium difference in a year with significant medical care. It also assumes each dependent&apos;s
            separate plan premium is roughly constant, which won&apos;t hold if, say, a spouse&apos;s employer
            uses its own tiered pricing that changes as household composition changes. Treat the result as
            a starting point for a conversation with your HR or benefits team, not a final enrollment
            decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Family-tier premium</strong> &mdash; a single flat monthly rate that covers the
              employee plus all enrolled dependents together, regardless of how many dependents are added.
            </li>
            <li>
              <strong>Dependent</strong> &mdash; a spouse, domestic partner, or child eligible to enroll
              under a policyholder&apos;s health plan, subject to that plan&apos;s own eligibility rules.
            </li>
            <li>
              <strong>Open enrollment</strong> &mdash; the annual window during which employees can enroll
              in, change, or drop health plan coverage without a qualifying life event.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For plan terminology beyond what&apos;s covered here,{" "}
            <a
              href="https://www.healthcare.gov/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov&apos;s glossary
            </a>{" "}
            defines premium, deductible, and out-of-pocket maximum in plain language. The{" "}
            <a
              href="https://www.cms.gov/marketplace/private-health-insurance/definitions-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Centers for Medicare &amp; Medicaid Services
            </a>{" "}
            publishes the underlying marketplace rules that shape how individual and family plans are
            priced. For your rights around enrolling a spouse or child outside open enrollment after a
            qualifying life event, the{" "}
            <a
              href="https://www.dol.gov/general/topic/health-plans/portability"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of Labor
            </a>{" "}
            explains special enrollment protections under federal law.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If you&apos;re still deciding between specific plan options rather than family versus
            individual coverage, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            lines up two plans side by side, and the{" "}
            <Link href="/tools/health/premium-vs-deductible-calculator" className="text-blue-600 hover:underline">
              premium vs. deductible calculator
            </Link>{" "}
            helps weigh a lower premium against a higher deductible within a single plan.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that run entirely in your browser, so you can work
            through decisions like this one with your own numbers before you ever talk to HR, a benefits
            broker, or an insurance agent. Nothing you type here is collected or stored.
          </p>
        </section>
      </div>
    </>
  );
}

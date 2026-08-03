import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { BreakEvenMedicalSpendingCalculatorTool } from "@/components/tools/BreakEvenMedicalSpendingCalculatorTool";
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
 * This tool is not yet in the central TOOLS registry (src/lib/tools.ts) --
 * that file is integrated separately. The object below carries the same
 * shape so this page can build its own structured data and metadata without
 * depending on that registration landing first.
 */
const tool: Tool = {
  slug: "break-even-medical-spending-calculator",
  name: "Break-Even Medical Spending Calculator",
  description:
    "Solve for the exact annual medical spending dollar amount where two health plans cost the same, using each plan's premium, deductible, coinsurance, and out-of-pocket maximum.",
  category: "Health",
  categorySlug: "health",
  keywords: [
    "break even medical spending calculator",
    "health plan breakeven calculator",
    "at what point does a high deductible plan cost more",
    "medical spending breakeven point",
    "when does low premium plan become worse",
    "health insurance crossover point calculator",
  ],
  relatedTools: ["premium-vs-deductible-calculator", "health-plan-comparison-calculator"],
};

const TITLE = "Break-Even Medical Spending Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this break-even medical spending calculator to find the exact spending level where two health plans cost the same, solved from your own plan numbers.";
const PAGE_URL = `${SITE_URL}/tools/health/break-even-medical-spending-calculator`;

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
    question: "How is this different from the health plan comparison calculator?",
    answer:
      "The health plan comparison calculator builds a scenario table across several spending levels for up to three plans, so you see who wins at low, moderate, and high spending. This break-even calculator solves for exactly two plans and gives you the one precise dollar figure where they cost the same, computed algebraically from your premium, deductible, coinsurance, and out-of-pocket max, rather than read off a table between two rows.",
  },
  {
    question: "Why does the crossover point sometimes fall in an unexpected segment?",
    answer:
      "Because each plan's cost curve has its own deductible and its own point where coinsurance stops (the out-of-pocket maximum), the crossover doesn't have to land inside a matching phase for both plans. It's common for one plan to still be below its deductible while the other is already partway into its coinsurance phase at the exact spending level where their running totals happen to match. The calculator solves for that mixed case directly instead of assuming both plans are in the same phase.",
  },
  {
    question: "What does it mean if the calculator says there's no crossover point?",
    answer:
      "It means one plan costs less than the other at every spending level from $0 up through a very high spending level, so there's no dollar amount of medical care that flips the answer. This happens when one plan has both the lower premium and cost-sharing terms that never fall behind, for example a plan that beats the other on premium, deductible, and out-of-pocket maximum all at once.",
  },
  {
    question: "Does the crossover point account for my out-of-pocket maximum?",
    answer:
      "Yes. A common mistake when estimating a break-even point by hand is stopping the math at the deductible and coinsurance rate, which quietly ignores that both plans eventually flatten out once spending passes the out-of-pocket maximum. This calculator builds the out-of-pocket max into each plan's cost curve as its own segment, so the solved crossover reflects what actually happens at high spending, not just the early part of the curve.",
  },
  {
    question: "Can I trust the exact dollar figure this tool gives me?",
    answer:
      "It's mathematically exact for the linear cost model and the numbers you entered, but it's still a planning estimate, not a guarantee. Real medical bills don't move in perfectly smooth dollar increments, provider networks and negotiated rates vary, and this tool has no visibility into your actual claims history. Use the figure to judge how much medical care would need to happen before your plan preference should flip, not as a prediction of your actual spending.",
  },
  {
    question: "Should I use my premium alone to pick a plan?",
    answer:
      "No. The lower-premium plan almost always wins at very low spending, since patient cost-sharing hasn't kicked in yet, which is exactly why a premium-only comparison is misleading for anyone who expects a moderate or high medical spending year. The break-even point tells you the spending level where that early premium advantage stops being decisive.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Health Calculators", href: "/tools/health" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function BreakEvenMedicalSpendingCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Break-Even Medical Spending Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Find the exact annual medical spending amount where two health plans stop being a toss-up and
            start clearly favoring one over the other, solved directly from your own plan numbers rather
            than estimated from a table of scenarios.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <BreakEvenMedicalSpendingCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-break-even-medical-spending-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Break-Even Medical Spending Calculator Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most plan comparisons stop at &ldquo;which premium is lower&rdquo; or, at best, check a couple of
            spending scenarios and call it done. This calculator instead solves an equation: given two
            plans&apos; monthly premium, annual deductible, coinsurance percentage, and out-of-pocket maximum,
            it finds the single exact annual medical spending figure at which their total yearly cost is
            identical. Below that number one plan wins; above it, the other plan wins. That crossover point
            turns a vague &ldquo;which plan is better&rdquo; question into a concrete one: how much medical care do
            you realistically expect to use this year, relative to that dollar figure?
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone staring at two open-enrollment options who has already ruled out a
            third or fourth choice and just needs to settle the final decision between exactly two plans,
            typically a lower-premium, higher-deductible plan against a higher-premium, lower-deductible
            one. It&apos;s also useful mid-year if your medical spending is tracking higher than expected and you
            want to know at what point your current plan choice stops being the cheaper one, or for anyone
            who has read a general explanation of high-deductible versus PPO plans and wants their own exact
            number instead of a rule of thumb.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Crossover Is Solved</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Each plan&apos;s total annual cost, as a function of annual medical spending x, is a piecewise
            linear curve with three segments. Below the deductible, the patient pays x dollar for dollar, so
            patient cost equals x. Between the deductible and the point where the out-of-pocket maximum is
            reached, the patient pays the deductible plus the coinsurance percentage times the spending
            above the deductible. Above that point, the patient&apos;s cost is flat at the out-of-pocket
            maximum, since that&apos;s the entire purpose of an out-of-pocket cap. Adding twelve months of
            premium to whichever segment applies gives TotalCost(x) for that plan.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator lists every breakpoint from both plans together: $0, each plan&apos;s deductible, and
            each plan&apos;s out-of-pocket-max crossover point. Between any two adjacent breakpoints, both plans&apos;
            cost curves are straight lines, which means the difference TotalCost_A(x) minus TotalCost_B(x) is
            also a straight line across that stretch. The tool evaluates that difference at every breakpoint,
            walks the list looking for the point where the difference flips from positive to negative (or
            hits exactly zero), and then solves the linear equation within that one segment for the exact x
            where the difference equals zero. That last step is ordinary algebra: given two points on a
            line, (x&#8321;, y&#8321;) and (x&#8322;, y&#8322;), the line crosses zero at x&#8321; − y&#8321; × (x&#8322; − x&#8321;) / (y&#8322; − y&#8321;).
          </p>

          <AdInArticle slot="tool-break-even-medical-spending-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Suppose Plan A costs $450 a month ($5,400 a year), with a $500 deductible, 20% coinsurance, and a
            $4,000 out-of-pocket maximum. Plan B costs $300 a month ($3,600 a year), with a $3,000
            deductible, 20% coinsurance, and a $6,500 out-of-pocket maximum. At $0 in medical spending, Plan
            B is $1,800 cheaper for the year, purely on premium. Plan A&apos;s cost curve reaches its
            out-of-pocket max at $18,000 of spending ($500 deductible plus $3,500 of coinsurance-covered
            spending divided by 20%); Plan B reaches its cap at $20,500. Checking the breakpoints in order,
            the running cost difference is still $1,800 in Plan B&apos;s favor at $500 of spending, but has
            flipped to $200 in Plan A&apos;s favor by $3,000 of spending, so the crossover falls inside that
            segment. Solving the line between those two points gives an exact crossover of $2,750: at that
            spending level, Plan A has paid $500 plus 20% of $2,250 above its deductible ($950 in patient
            cost, $6,350 total), and Plan B, still below its own deductible, has paid $2,750 in patient cost
            plus its $3,600 premium, also $6,350 total. Below $2,750 of annual spending, Plan B is cheaper.
            Above it, Plan A is cheaper, because its lower deductible and lower out-of-pocket maximum start
            paying off once spending climbs.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake This Tool Avoids</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common error when estimating a break-even point by hand is stopping the math at the
            deductible and coinsurance rate and never accounting for the out-of-pocket maximum. That produces
            a crossover estimate that keeps rising indefinitely with coinsurance, when in reality both
            plans&apos; costs flatten out once spending passes their respective caps. Ignoring the cap can make
            a high-deductible plan look like it keeps getting relatively more expensive forever as spending
            rises, when its cost actually stops growing at its out-of-pocket maximum. This calculator
            builds the cap into each plan&apos;s curve as its own segment from the start, so the answer already
            accounts for it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a single, standard deductible-then-coinsurance-then-out-of-pocket-max
            structure with no separate copay tiers, no drug-specific cost sharing, and no network
            distinctions, which covers most major-medical plans but not every plan design. It does not
            account for an HSA&apos;s tax advantages or employer contributions, mid-year plan switches, family
            versus individual deductible structures, or the fact that real medical bills rarely land on a
            perfectly smooth dollar figure the way a linear model does. Treat the crossover point as a
            precise answer to a simplified model, not a guarantee about what a specific year of care will
            actually cost you. When the numbers are close, or the decision carries real financial weight,
            confirm exact terms against each plan&apos;s Summary of Benefits and Coverage and talk it through
            with a licensed insurance agent.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terminology Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Piecewise cost function</strong> — a function built from separate straight-line
              segments, each valid over its own range of spending, rather than one formula that applies at
              every spending level.
            </li>
            <li>
              <strong>Marginal cost of care</strong> — how much an additional dollar of medical spending
              actually costs the patient at a given point on the curve: the full dollar before the
              deductible, the coinsurance rate between the deductible and the out-of-pocket max, and zero
              once the out-of-pocket max is reached.
            </li>
            <li>
              <strong>Cost-sharing</strong> — the general term for the portion of covered medical costs the
              patient pays directly, made up of the deductible and coinsurance (or copays, in plans that use
              them) up to the out-of-pocket maximum.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For official definitions of these terms, the{" "}
            <a
              href="https://www.healthcare.gov/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary
            </a>{" "}
            is the authoritative federal reference. The{" "}
            <a
              href="https://www.cms.gov/marketplace/about-us/other-resources"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Centers for Medicare and Medicaid Services
            </a>{" "}
            oversees the marketplace rules that shape how deductibles, coinsurance, and out-of-pocket
            maximums are structured. The{" "}
            <a
              href="https://www.irs.gov/publications/p969"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              IRS guidance on Health Savings Accounts
            </a>{" "}
            covers the HSA tax rules this calculator intentionally leaves out. Before enrolling in a plan,
            confirm the exact terms in that plan&apos;s own Summary of Benefits and Coverage.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If you only need to check one spending scenario rather than solve for the exact
            crossover, the{" "}
            <Link href="/tools/health/premium-vs-deductible-calculator" className="text-blue-600 hover:underline">
              premium vs. deductible calculator
            </Link>{" "}
            is the faster tool. If you&apos;re weighing three plans or want to see costs across several spending
            levels at once, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            builds that full scenario table.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that do the actual math behind insurance
            decisions instead of offering a generic rule of thumb. Nothing you type into this calculator is
            saved or sent anywhere; every figure comes from you, and every result is meant to be brought
            into a conversation with a licensed agent, not treated as the final word.
          </p>
        </section>
      </div>
    </>
  );
}

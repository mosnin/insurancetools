import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { PremiumVsDeductibleCalculatorTool } from "@/components/tools/PremiumVsDeductibleCalculatorTool";
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

const tool: Tool = {
  slug: "premium-vs-deductible-calculator",
  name: "Premium vs. Deductible Calculator",
  description:
    "Compare two health plans side by side on premium, deductible, and coinsurance to see which one costs less at your own expected annual medical spending.",
  category: "Health",
  categorySlug: "health",
  keywords: [
    "premium vs deductible calculator",
    "high premium low deductible vs low premium high deductible",
    "health insurance premium deductible tradeoff",
    "which health plan saves more money",
    "premium vs deductible health insurance",
    "low deductible vs high deductible calculator",
  ],
  relatedTools: ["health-plan-comparison-calculator", "break-even-medical-spending-calculator"],
};

const TITLE = "Premium vs. Deductible Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this premium vs. deductible calculator to compare two health plans and see exactly which one costs less at your own expected annual medical spending level.";
const PAGE_URL = `${SITE_URL}/tools/health/premium-vs-deductible-calculator`;

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
    question: "Is a low premium and high deductible always the cheaper choice?",
    answer:
      "Only if you end up spending less than the crossover point this calculator solves for. A low-premium, high-deductible plan wins in years you stay healthy, because you're not overpaying in premiums for coverage you never use. It stops winning once your medical spending climbs high enough that the extra deductible and coinsurance you're covering out of pocket outweighs what you saved on premiums all year. There's no single right answer independent of how much you actually expect to spend.",
  },
  {
    question: "How is this different from the health plan comparison calculator?",
    answer:
      "This tool is intentionally narrow: exactly two plans, one spending scenario you choose, built to answer a single head-to-head question quickly. The health plan comparison calculator handles three or more plans at once and is built for comparing a full slate of open enrollment options rather than a single A-versus-B decision. Use this one when you've already narrowed your choice to two plans; use that one when you're still weighing a longer list.",
  },
  {
    question: "What does the crossover spending point actually tell me?",
    answer:
      "It's the annual medical spending level at which both plans cost exactly the same total amount, once premiums and out-of-pocket costs are added together. Below that number, whichever plan wins at low spending stays cheaper; above it, the other plan takes over. It's a useful sanity check on your own spending estimate: if the crossover point is close to your entered figure, small changes in how much care you actually use this year could flip which plan turns out cheaper.",
  },
  {
    question: "Does this calculator account for my out-of-pocket maximum?",
    answer:
      "No. It applies your entered coinsurance percentage to every dollar of spending above the deductible with no ceiling, which will overstate your cost at very high spending levels compared to a real plan that caps your annual out-of-pocket exposure. If you're comparing plans for a year where you expect major medical spending, factor each plan's actual out-of-pocket maximum in separately, since it can meaningfully change which plan is cheaper at the high end.",
  },
  {
    question: "Where do I find my plan's premium, deductible, and coinsurance numbers?",
    answer:
      "They're listed on the plan's Summary of Benefits and Coverage, which insurers and marketplace listings are required to provide, or on your open enrollment portal if the coverage is through an employer. The monthly premium is what you pay out of your paycheck or bill each month; the deductible and coinsurance percentage are usually listed together under a plan's cost-sharing details.",
  },
  {
    question: "Should I use my highest-spending year or an average year as my estimate?",
    answer:
      "Try both. Run the calculator once with a conservative, low-spending estimate and again with your highest recent year of medical spending, then compare the two results against the crossover point. If the same plan wins in both scenarios, the decision is fairly safe. If the two scenarios disagree, that's exactly the situation where the crossover point matters most, since your actual spending this year is what will decide which plan was the better bet.",
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

export default function PremiumVsDeductibleCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Premium vs. Deductible Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter two health plans and one expected spending number, and this premium vs. deductible
            calculator totals the real annual cost of each so you can see which plan actually wins, and
            how close the decision really is.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <PremiumVsDeductibleCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-premium-vs-deductible-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Focused Two-Plan Comparison</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most people narrowing a health plan decision aren&apos;t staring at a full menu of ten options;
            they&apos;re down to two finalists and trying to decide between the one with the lower monthly
            bill and the one with the lower deductible. This premium vs. deductible calculator is built
            for exactly that moment. It takes Plan A and Plan B, along with a single expected annual
            medical spending figure you supply yourself, and totals what each plan would actually cost you
            for the year, not just what shows up on the enrollment page as the sticker price. If you&apos;re
            instead comparing three or more plans at once, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            is the better fit; this tool is deliberately narrower so a two-way decision doesn&apos;t get
            buried in extra columns you don&apos;t need.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Premium Alone Is the Wrong Comparison</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tradeoff between premium and deductible exists because insurers price plans to balance
            predictable monthly revenue against unpredictable claims. A plan with a lower monthly premium
            shifts more of that risk onto you through a higher deductible and often a higher coinsurance
            percentage once you&apos;ve met it. A plan with a higher premium is, in effect, pre-paying some of
            that risk so your bill is smaller and more predictable if you end up needing care. Neither
            structure is inherently better; which one actually costs you less depends entirely on how much
            covered medical care you use during the plan year, which is exactly the number most people
            guess at instead of estimating deliberately.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator adds each plan&apos;s annual premium (monthly premium times twelve) to your
            patient responsibility at the spending level you enter. Below the deductible, you&apos;re paying
            dollar for dollar out of pocket, so patient responsibility equals your spending. Once spending
            passes the deductible, you pay the deductible in full plus your coinsurance percentage of
            everything above it. Add those two pieces together for each plan and you get a real,
            comparable total annual cost, which is the number that should actually decide between two
            plans, not the premium by itself.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say Plan A runs $420 a month ($5,040 a year) with a $2,000 deductible and 20% coinsurance
            after that, while Plan B runs $260 a month ($3,120 a year) with a $6,000 deductible and 30%
            coinsurance after that. At $4,000 in expected annual spending, Plan A costs $5,040 plus $2,000
            plus 20% of the remaining $2,000 ($400), totaling $7,440. Plan B costs $3,120 plus the full
            $4,000 spending (since it&apos;s still under Plan B&apos;s $6,000 deductible), totaling $7,120. Plan
            B wins by $320 at this spending level, but the two plans are close enough that a modest change
            in actual medical spending could flip the answer, which is exactly what the crossover point in
            the tool is built to reveal.
          </p>

          <AdInArticle slot="tool-premium-vs-deductible-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Mistake This Tool Is Built to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake in choosing between two health plans is comparing premiums
            only, because it&apos;s the number displayed most prominently during enrollment and the easiest
            one to compare at a glance. That comparison silently ignores the deductible and coinsurance
            entirely, which is often the larger cost driver for anyone who ends up needing more than
            routine preventive care during the year. A related mistake is picking the plan that won last
            year&apos;s comparison without rerunning the numbers, since a single high-cost event, a new
            prescription, or a planned procedure can shift your expected spending enough to change which
            plan actually wins this year.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes your entered coinsurance percentage applies uniformly to every dollar
            of spending above the deductible for the entire year, with no out-of-pocket maximum capping
            your total exposure. Real plans almost always include an out-of-pocket maximum, so this tool
            will overstate your cost at very high spending levels compared to what you&apos;d actually pay
            once that cap kicks in. It also doesn&apos;t model copays for specific services like office
            visits or prescriptions, network status, or plan-specific exclusions, all of which vary by
            plan and can shift the real numbers in either direction. Every dollar figure used here comes
            from what you type in; the tool never assumes a &ldquo;typical&rdquo; premium, deductible, or spending
            level on your behalf. Treat the result as a planning estimate, and confirm the exact terms
            against each plan&apos;s Summary of Benefits and Coverage before enrolling.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Premium</strong> — the amount you pay, usually monthly, to keep a health plan active,
              regardless of how much care you use.
            </li>
            <li>
              <strong>Deductible</strong> — the amount you pay out of pocket for covered care before your
              plan starts sharing costs through coinsurance.
            </li>
            <li>
              <strong>Coinsurance</strong> — the percentage of a covered cost you continue to pay after
              you&apos;ve met your deductible, with your plan covering the rest up to any out-of-pocket
              maximum.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For official definitions of these terms, see the{" "}
            <a
              href="https://www.healthcare.gov/glossary/premium/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary entry on premiums
            </a>
            , its{" "}
            <a
              href="https://www.healthcare.gov/glossary/co-insurance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              entry on coinsurance
            </a>
            , and its page on{" "}
            <a
              href="https://www.healthcare.gov/choose-a-plan/your-total-costs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              total plan costs
            </a>
            . The{" "}
            <a
              href="https://content.naic.org/consumer/health-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            also publishes broader consumer guidance on how health coverage is structured. None of these
            sources publish a &ldquo;correct&rdquo; premium or deductible amount, since actual plan pricing varies
            by insurer, state, and individual circumstances, which is exactly why every dollar figure in
            this calculator has to come from you.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If your decision involves more than two plans, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            handles a full slate at once. If breakeven spending is the whole question rather than a side
            note, the{" "}
            <Link href="/tools/health/break-even-medical-spending-calculator" className="text-blue-600 hover:underline">
              break-even medical spending calculator
            </Link>{" "}
            walks through that math in more depth.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance cost-sharing math
            you&apos;d otherwise do by hand into an instant, side-by-side comparison. Nothing you type is
            stored or sent anywhere; every result exists only to help you walk into enrollment already
            knowing which numbers matter.
          </p>
        </section>
      </div>
    </>
  );
}

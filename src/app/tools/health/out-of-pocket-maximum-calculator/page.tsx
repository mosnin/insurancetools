import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { OutOfPocketMaximumCalculatorTool } from "@/components/tools/OutOfPocketMaximumCalculatorTool";
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
  slug: "out-of-pocket-maximum-calculator",
  name: "Out-of-Pocket Maximum Calculator",
  description:
    "Calculate the true worst-case annual cost of a health plan by adding your premium to its out-of-pocket maximum, then rank up to three plans side by side.",
  category: "Health",
  categorySlug: "health",
  keywords: [
    "out of pocket maximum calculator",
    "worst case health insurance cost calculator",
    "out of pocket max calculator",
    "annual premium plus out of pocket max",
    "health insurance worst case scenario calculator",
    "max out of pocket cost calculator",
  ],
  relatedTools: ["health-plan-comparison-calculator", "hsa-savings-calculator"],
};

const TITLE = "Free Out-of-Pocket Maximum Calculator | Insurance Tools";
const DESCRIPTION = tool.description;
const PAGE_URL = `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`;

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
    question: "Does the out-of-pocket maximum include my monthly premiums?",
    answer:
      "No. The out-of-pocket maximum, by definition, only counts deductibles, copays, and coinsurance you pay for covered care. Your premium is a separate, ongoing cost you pay whether or not you use any care, which is exactly why this calculator adds twelve months of premium to the out-of-pocket maximum instead of treating the OOP max alone as your worst-case cost.",
  },
  {
    question: "Does my out-of-pocket maximum cap what I'd pay to an out-of-network doctor or hospital?",
    answer:
      "Generally no. The federal out-of-pocket maximum requirement applies to in-network essential health benefits. Many plans apply no cap at all to out-of-network care, or a separate and often much higher one, and an out-of-network provider can also bill you for the difference between their charge and what your plan pays, a practice called balance billing. If out-of-network care is a real possibility for you, the worst-case figure this tool produces understates your actual risk.",
  },
  {
    question: "What if my plan doesn't cover a service at all, like cosmetic surgery or certain therapies?",
    answer:
      "Spending on a service your plan excludes entirely doesn't count toward the out-of-pocket maximum, because there's no covered claim for it to apply to. You'd pay the full cost of that care on top of the worst-case number this calculator shows, which only represents your ceiling for covered, in-network essential health benefits.",
  },
  {
    question: "Why compare worst-case cost instead of just picking the plan with the lowest premium?",
    answer:
      "The lowest premium wins in a healthy year and can lose badly in a bad one. This calculator is built for the second question: if you or a covered family member had a genuinely expensive medical year, which plan limits the total damage? A plan with a higher premium but a meaningfully lower out-of-pocket maximum can produce a lower worst-case total even though it costs more every month you don't use it.",
  },
  {
    question: "Is the plan with the lowest worst-case cost always the right plan to pick?",
    answer:
      "Not necessarily. Most years don't reach the out-of-pocket maximum at all, so a plan optimized purely for the worst case can cost more in an ordinary year than a plan with a higher OOP max but a lower premium. Use this calculator alongside your realistic expectations for the coming year, and use the health plan comparison calculator if you want to model costs at several spending levels instead of just the ceiling.",
  },
  {
    question: "Where do I find my plan's actual out-of-pocket maximum?",
    answer:
      "It's printed on your plan's Summary of Benefits and Coverage document, usually in the same section as the deductible and coinsurance figures, and your insurer's member portal typically lists it as well. Look specifically for the in-network figure, since some plans list a separate and higher combined or out-of-network maximum in the same document.",
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

export default function OutOfPocketMaximumCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Out-of-Pocket Maximum Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Use this out of pocket maximum calculator to find the one number that matters in a genuinely
            bad medical year: premium plus out-of-pocket maximum, ranked across up to three plans.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <OutOfPocketMaximumCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-oop-maximum-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why &ldquo;Worst Case&rdquo; Is the Number That Matters
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most health plan comparisons start and end with the monthly premium, because it&apos;s the number
            quoted first and the easiest to compare across options. That habit works fine in a healthy
            year and falls apart in a bad one, which is exactly the year a health plan exists to protect
            you from. This out of pocket maximum calculator is built around a narrower, more useful
            question than a full cost comparison: if this were the worst medical year you could reasonably
            have, what is the absolute ceiling this plan puts on your spending? Add twelve months of
            premium, which you pay regardless of how much care you use, to the plan&apos;s stated
            out-of-pocket maximum, and you have a real, calculable number rather than a guess.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is a different tool than a full plan comparison. If you want to see how several plans
            stack up across a range of spending levels, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            models the deductible, coinsurance, and out-of-pocket maximum waterfall at low, moderate, and
            high spending scenarios you define. This calculator skips that waterfall entirely and answers
            one question only: what&apos;s the ceiling, and which plan has the lowest one?
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How an Out-of-Pocket Maximum Actually Works
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            An out-of-pocket maximum is the most a plan can require you to pay in a single plan year for
            covered care before it starts paying 100% of further costs. Under federal rules, that
            protection applies specifically to in-network care for essential health benefits, the core
            categories of care every ACA-compliant plan is required to cover. Once your covered, in-network
            spending on those benefits reaches the stated maximum, the plan picks up the rest for the
            remainder of the plan year. That&apos;s a real, enforceable ceiling, not a marketing estimate,
            which is why premium plus out-of-pocket maximum is a defensible worst-case number rather than a
            rough guess.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The honest caveat is in the words &ldquo;in-network&rdquo; and &ldquo;essential health benefits.&rdquo; The
            out-of-pocket maximum does not cap what you&apos;d pay for an out-of-network provider, and it
            provides no protection at all for a service your plan simply doesn&apos;t cover. A member who ends
            up at an out-of-network hospital during an emergency, or who needs a treatment their plan
            excludes, can face costs well beyond the number this calculator produces. This tool works from
            the figures you enter from your own plan, and it does not, and cannot, guarantee that every
            dollar you might spend in a bad year falls inside those categories.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider three plans a household is choosing between during open enrollment. Plan A costs $350
            a month with a $6,000 out-of-pocket maximum, giving a worst case of $4,200 in premium plus
            $6,000, or $10,200 for the year. Plan B costs $220 a month with a $9,100 out-of-pocket maximum,
            for a worst case of $2,640 plus $9,100, or $11,740. Plan C costs only $140 a month but carries a
            $17,400 out-of-pocket maximum, giving a worst case of $1,680 plus $17,400, or $19,080. Ranked
            by worst-case cost, Plan A is actually the safest option despite having the highest premium,
            beating Plan C&apos;s ceiling by nearly $8,900. A household that picked Plan C purely for the lower
            monthly bill would be exposed to almost double the worst-case cost of Plan A in a genuinely bad
            year.
          </p>

          <AdInArticle slot="tool-oop-maximum-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming the out-of-pocket maximum already includes the premium,
            and then comparing OOP max figures across plans as if they were a complete worst-case number
            on their own. They aren&apos;t; the premium is always additional. A second mistake is assuming the
            out-of-pocket maximum protects against any bill you might receive, including an out-of-network
            emergency room visit or a specialist who happens to be outside the plan&apos;s network. It doesn&apos;t,
            and that gap can be the largest cost in an actual bad year. A third mistake is picking the
            plan with the lowest premium without ever checking its out-of-pocket maximum at all, which is
            the exact blind spot this calculator is built to close.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the out-of-pocket maximum you enter is your plan&apos;s in-network figure,
            since that&apos;s the number the federal cap actually governs, and it assumes all the care in a
            worst-case year would be in-network and covered as an essential health benefit. It does not
            model deductibles, coinsurance percentages, or spending scenarios below the maximum; for that
            level of detail, use the health plan comparison calculator instead. It does not fetch or verify
            any current dollar figure on your behalf, and it never presents a fabricated or generic
            out-of-pocket maximum as if it applied to your specific plan. Every premium and OOP max used
            in the result is a number you typed in, sourced from your own plan documents, and the result is
            an estimate to bring into your own decision, not a quote or a guarantee.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Out-of-pocket maximum</strong> — the most you can be required to pay in a plan year
              for covered, in-network care before the plan pays 100% of further costs for that care.
            </li>
            <li>
              <strong>In-network</strong> — a provider or facility that has a contract with your plan to
              accept negotiated rates; care from an out-of-network provider is typically billed at higher
              rates and may not count toward your out-of-pocket maximum at all.
            </li>
            <li>
              <strong>Essential health benefits</strong> — the core categories of care, such as emergency
              services, hospitalization, and prescription drugs, that ACA-compliant plans are required to
              cover, and the category the federal out-of-pocket maximum protection applies to.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the federal definitions this calculator relies on, see the{" "}
            <a
              href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              out-of-pocket maximum/limit glossary entry
            </a>{" "}
            and the{" "}
            <a
              href="https://www.healthcare.gov/glossary/essential-health-benefits/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              essential health benefits glossary entry
            </a>{" "}
            on HealthCare.gov, both maintained by the Centers for Medicare and Medicaid Services. For how
            network status affects what you pay, HealthCare.gov also publishes guidance on{" "}
            <a
              href="https://www.healthcare.gov/choose-a-plan/network-coverage/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              provider networks and coverage
            </a>{" "}
            and on how{" "}
            <a
              href="https://www.healthcare.gov/choose-a-plan/your-total-costs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              premiums and out-of-pocket costs add up to your total cost
            </a>{" "}
            of a plan. Confirm your own plan&apos;s exact figures on its Summary of Benefits and Coverage
            before making a decision.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              Health insurance calculators
            </Link>{" "}
            category. If you want to compare plans across several spending levels instead of just the
            worst case, the{" "}
            <Link href="/tools/health/health-plan-comparison-calculator" className="text-blue-600 hover:underline">
              health plan comparison calculator
            </Link>{" "}
            models the full deductible-and-coinsurance waterfall. Once you&apos;ve settled on a plan, the{" "}
            <Link href="/tools/health/hsa-savings-calculator" className="text-blue-600 hover:underline">
              HSA savings calculator
            </Link>{" "}
            can help you see how much of that worst-case exposure a health savings account could offset.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific moments insurance
            decisions actually get made, like comparing plans during open enrollment. Nothing you type
            into this calculator is sent anywhere, and every figure it shows traces back to numbers you
            entered from your own plan, not a generic industry average.
          </p>
        </section>
      </div>
    </>
  );
}

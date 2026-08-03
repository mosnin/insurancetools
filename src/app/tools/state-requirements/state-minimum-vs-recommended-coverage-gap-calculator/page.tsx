import type { Metadata } from "next";
import Link from "next/link";
import { StateMinimumVsRecommendedCoverageGapCalculatorTool } from "@/components/tools/StateMinimumVsRecommendedCoverageGapCalculatorTool";
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

const tool = getToolBySlug("state-minimum-vs-recommended-coverage-gap-calculator")!;

const TITLE = "State Minimum vs. Recommended Coverage Gap Calculator";
const DESCRIPTION =
  "Use this state minimum vs recommended coverage calculator to enter your own state's liability limits and see the exact dollar gap against a recommended limit.";
const PAGE_URL = `${SITE_URL}/tools/state-requirements/state-minimum-vs-recommended-coverage-gap-calculator`;

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
    question: "Is state minimum car insurance enough coverage for me?",
    answer:
      "For most drivers with any savings, home equity, or steady income, state minimum liability limits are enough to satisfy the law but not enough to cover a serious at-fault accident. Minimums are set as a financial responsibility floor, not a safety recommendation, and they're typically far below what a single serious injury claim can cost. Enter your own assets and income above to see how the asset-protection recommendation compares to the minimum you looked up.",
  },
  {
    question: "Where do I find my state's actual minimum liability requirement?",
    answer:
      "Check your state's Department of Insurance directly, since this calculator does not display or assume any state's figure. The National Association of Insurance Commissioners maintains a directory of every state insurance department's official site, linked directly above the state minimum fields on this page, which is the fastest way to reach the current, authoritative number for your state.",
  },
  {
    question: "How much more coverage than state minimum do I need?",
    answer:
      "It depends entirely on what a judgment against you could actually reach: your savings, investments, home equity, and future wages. This calculator adds those figures together and matches them against standard liability tiers (100/300/100, 250/500/100, and 250/500/250) to recommend the smallest tier that covers your combined exposure, then shows the exact dollar gap against the minimum you entered.",
  },
  {
    question: "Why isn't state minimum insurance enough if it's legal to drive with it?",
    answer:
      "Legal compliance and financial protection answer two different questions. A state minimum satisfies the legal requirement to drive, which is set with an eye toward keeping insurance affordable and accessible for as many drivers as possible. It says nothing about whether that limit would cover an actual serious accident, where medical bills, lost wages, and vehicle damage for the other party can easily exceed a low liability limit, leaving your own assets and wages exposed to the remainder.",
  },
  {
    question: "Does this calculator know what my state's minimum coverage actually is?",
    answer:
      "No, on purpose. State minimum requirements are specific legal figures that vary by state and change periodically, and publishing a static number here risks it going stale or simply being wrong for your state. You enter your own looked-up figures, and every gap calculation on this page is built from those numbers, not from any figure baked into the tool.",
  },
  {
    question: "What's the difference between a state minimum vs full coverage gap and this liability gap?",
    answer:
      "A state minimum vs. full coverage comparison usually looks at whether to add collision and comprehensive coverage for your own vehicle. This tool looks specifically at liability limits, the part of your policy that pays for injuries and damage you cause to other people, and measures the dollar difference between your state's legal floor and a limit sized to protect what you personally own and earn.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "State Requirements Tools", href: "/tools/state-requirements" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function StateMinimumVsRecommendedCoverageGapCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            State Minimum vs. Recommended Coverage Gap Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter your own state&apos;s minimum liability limits, add your assets and income, and see the
            exact dollar gap between the legal floor and a limit sized to protect what you actually have.
            This is a state minimum vs recommended coverage calculator built entirely from your own numbers,
            never a guess at your state&apos;s figure.
          </p>
          <LastUpdated category="state-requirements" />
        </div>

        <div className="mt-2">
          <StateMinimumVsRecommendedCoverageGapCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-state-minimum-gap-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why State Minimum Liability Limits Are a Legal Floor, Not a Financial Plan
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every state that requires drivers to carry liability insurance does so under some version of a
            financial responsibility law: a rule that anyone operating a vehicle must be able to cover the
            damage they cause, usually satisfied by carrying at least a set minimum of insurance. That
            minimum is calibrated with a policy goal in mind, keeping coverage affordable and accessible
            enough that most drivers can legally get behind the wheel, not with the goal of matching what a
            serious accident actually costs. The result is a widely documented and often-cited gap: minimum
            limits are frequently a fraction of a single serious injury claim, let alone a multi-vehicle
            accident with several injured parties. This calculator is built around that distinction. It
            never tells you what your state&apos;s minimum is; it asks you to bring that number from your own
            state&apos;s Department of Insurance, and it compares it against a recommendation sized to your own
            financial picture rather than to a one-size-fits-all figure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for a driver who has already looked up, or is about to look up, their state&apos;s
            minimum liability requirement and wants a concrete answer to the next question: is that number
            actually enough for me? It&apos;s especially useful for anyone who has recently bought a home, opened
            a retirement or investment account, taken on a higher income, or simply been carrying the
            minimum since their first policy without ever revisiting it. If you&apos;re currently shopping quotes
            and the default liability limit on a quote form matches your state&apos;s minimum exactly, that&apos;s a
            strong signal to run your own numbers here before you buy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Find Your Own State&apos;s Actual Minimum</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Minimum liability requirements are set individually by each state and revised from time to time,
            so the only reliable source is your own state&apos;s insurance regulator, not a blog post, a forum
            thread, or a quote form&apos;s pre-filled default. The National Association of Insurance
            Commissioners maintains a directory linking to every state insurance department&apos;s official site,
            available directly above the state minimum fields on this calculator and again in the sources
            below. Look up your state&apos;s current bodily injury per-person, bodily injury per-accident, and
            property damage limits there, then enter those three numbers into the calculator to see your
            personal gap.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Recommended Limit Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The recommended side of the comparison uses the same asset-protection method this site&apos;s car
            insurance coverage calculator is built on. It adds your entered assets, savings, investments,
            and home equity combined, to your annual income, since a judgment against you after an at-fault
            accident isn&apos;t limited to what you currently own; courts can also order wage garnishment,
            reaching future earnings. That combined exposure figure is matched against three standard
            liability tiers available from most insurers, 100/300/100, 250/500/100, and 250/500/250, and the
            calculator recommends the smallest tier that covers your exposure. If your vehicle is worth more
            than $50,000, the property damage portion of the recommendation is raised to at least $250,000,
            since a serious accident involving a higher-value vehicle can exceed a lower property damage
            limit quickly. The gap you see is simply the dollar difference between each part of that
            recommended limit and the state minimum figures you entered.
          </p>

          <AdInArticle slot="tool-state-minimum-gap-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example (Illustrative Numbers Only)</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The figures below are made up for this walkthrough only. They are not the actual minimum
            required in any real state, and you should never treat them as a substitute for your own state&apos;s
            published figure. Suppose a driver looks up their state&apos;s minimum and finds, purely as an
            example, a $20,000 per-person, $40,000 per-accident bodily injury limit and a $15,000 property
            damage limit. They enter $50,000 in combined savings and home equity, $60,000 in annual income,
            and a $20,000 vehicle. Their combined exposure is $110,000, which falls under the calculator&apos;s
            $300,000 floor, so it recommends the 100/300/100 tier. Comparing that recommendation against the
            example state minimum produces a gap of $80,000 in per-person bodily injury coverage
            ($100,000 minus $20,000), $260,000 in per-accident bodily injury coverage ($300,000 minus
            $40,000), and $85,000 in property damage coverage ($100,000 minus $15,000). None of those
            example numbers describe any actual state&apos;s requirement; they exist only to show how the
            calculator turns two sets of user-entered figures into a concrete dollar gap.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is treating &ldquo;legal&rdquo; and &ldquo;adequate&rdquo; as the same thing: assuming that
            because a minimum policy satisfies the law, it must also be enough to protect what you own. A
            close second is guessing at a state&apos;s minimum instead of confirming it with the state&apos;s own
            Department of Insurance, since minimums are revised periodically and a remembered figure from
            years ago, or one read on an unrelated website, may no longer be current. A third is comparing a
            state minimum against a flat recommended number pulled from a generic list rather than one
            actually sized to your own assets, income, and vehicle, which is exactly the substitution this
            calculator is built to avoid.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the three state minimum figures you enter are current and accurate,
            since it has no independent way to verify them and deliberately does not attempt to look them
            up or guess at them. It assumes the asset-protection method, adding assets to a year of income
            and matching against standard liability tiers, is a reasonable way to size a recommended limit,
            which is a common approach among insurance educators but not the only valid one and not a
            guarantee that any specific accident&apos;s costs would stay within the recommended tier. It does not
            account for state-specific coverage mandates such as no-fault or personal injury protection
            rules, does not know your driving record or an insurer&apos;s underwriting rules, and does not
            estimate premiums. Treat every figure here as a planning number to bring into a conversation
            with a licensed insurance agent or your state&apos;s Department of Insurance, not as a final legal or
            financial determination.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Bodily injury liability</strong> — pays for injuries you cause to other people in an
              at-fault accident, expressed as a per-person limit and a separate, higher per-accident limit.
            </li>
            <li>
              <strong>Property damage liability</strong> — pays for damage you cause to someone else&apos;s
              vehicle or property in an at-fault accident.
            </li>
            <li>
              <strong>Financial responsibility law</strong> — the state-level legal requirement that
              drivers demonstrate an ability to pay for damage they cause, most commonly satisfied by
              carrying at least the state&apos;s minimum liability insurance.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            Before relying on any figure from this page, confirm your state&apos;s current minimum with the{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners&apos; directory of state insurance departments
            </a>
            . The NAIC also publishes{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              general consumer guidance on auto liability coverage
            </a>{" "}
            for definitions beyond what&apos;s covered here, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how liability coverage fits into the rest of a standard auto policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator belongs to the{" "}
            <Link href="/tools/state-requirements" className="text-blue-600 hover:underline">
              State Requirements tools
            </Link>{" "}
            category. Once you have a recommended liability number, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            walks through the full recommendation in more depth, including collision, gap, and
            uninsured/underinsured motorist coverage, and the{" "}
            <Link href="/tools/coverage/umbrella-policy-need-calculator" className="text-blue-600 hover:underline">
              umbrella policy need calculator
            </Link>{" "}
            checks whether your exposure calls for protection beyond what an auto policy alone can offer.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the questions insurance shopping
            actually raises, coverage limits, deductibles, claims, and now the gap between what the law
            requires and what your own finances need. Every tool runs in your browser using only the
            numbers you choose to type in, so you can work through a decision before ever picking up the
            phone with an agent.
          </p>
        </section>
      </div>
    </>
  );
}

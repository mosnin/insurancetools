import type { Metadata } from "next";
import Link from "next/link";
import { NetWorthProtectionCalculatorTool } from "@/components/tools/NetWorthProtectionCalculatorTool";
import { FAQSection } from "@/components/tools/FAQSection";
import { LastUpdated } from "@/components/tools/LastUpdated";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdInArticle } from "@/components/ads";
import type { Tool } from "@/types";
import {
  toolStructuredData,
  breadcrumbStructuredData,
  faqStructuredData,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

const tool: Tool = {
  slug: "net-worth-protection-calculator",
  name: "Net Worth Protection Calculator",
  description:
    "Add up your assets and debts to find your net worth, then check whether your auto, home or renters, and umbrella liability limits, added together, actually cover it.",
  category: "Coverage",
  categorySlug: "coverage",
  keywords: [
    "net worth protection calculator",
    "how to protect my net worth with insurance",
    "net worth calculator for insurance",
    "liability insurance based on net worth",
    "asset protection insurance calculator",
    "net worth and liability coverage",
  ],
  relatedTools: ["umbrella-policy-need-calculator", "how-much-insurance-coverage-do-i-need-calculator"],
};

const TITLE = "Net Worth Protection Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this net worth protection calculator to add up your assets and debts, then check whether your liability insurance limits actually cover your net worth.";
const PAGE_URL = `${SITE_URL}/tools/coverage/net-worth-protection-calculator`;

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
    question: "Is this the same as the umbrella policy need calculator?",
    answer:
      "No, and the two are meant to be used in sequence. This tool answers the earlier question: what is my net worth, and does my current liability protection, added up across every policy I already carry, cover it? If a gap shows up here, the umbrella policy need calculator takes that gap and sizes a specific umbrella limit, in $1 million increments, to close it. Use this calculator first to find out if you have a problem, then use the umbrella calculator to size the fix.",
  },
  {
    question: "What should I count as an asset in this net worth calculation?",
    answer:
      "Anything a court could reasonably order sold or garnished to satisfy a judgment: your home's current market value, investment and retirement account balances, vehicles, and cash savings. Leave out personal belongings you'd list at garage-sale prices, since they rarely move the total enough to matter, and this tool is built for a fast planning estimate rather than a full balance sheet.",
  },
  {
    question: "Are retirement accounts really exposed in a lawsuit?",
    answer:
      "It depends on the account type and your state, which is exactly why this calculator counts them toward net worth but flags them separately in the results. Many employer-sponsored retirement plans have federal protection from creditors, while IRAs and other accounts are protected to varying, state-specific degrees. This tool does not know your state's exact exemption rules and this is not legal advice; an attorney in your state can tell you which of your specific accounts are actually reachable.",
  },
  {
    question: "Why does the calculator add my auto, home or renters, and umbrella limits together?",
    answer:
      "Because a single lawsuit arising from one incident, a car accident on your property, a dog bite, a guest's fall, can pursue whichever policies and limits actually apply, and an umbrella policy is specifically designed to sit on top of your auto and home or renters limits rather than replace them. Adding the three together gives a realistic picture of your total liability protection, not just what any one policy provides on its own.",
  },
  {
    question: "My net worth came out negative. Does that mean I don't need liability insurance?",
    answer:
      "No. A negative net worth means this particular calculation finds nothing above zero for a judgment to reach today, so the gap this tool checks for won't show up. It says nothing about your state's minimum liability requirements, which apply regardless of your net worth, and your situation can change quickly as debts are paid down or assets grow. Liability insurance also covers legal defense costs and future income, not just today's asset snapshot.",
  },
  {
    question: "How often should I run this calculator again?",
    answer:
      "Whenever something moves the two sides of this comparison meaningfully: a home value reassessment, a mortgage refinance or payoff, a job change that shifts your retirement contributions, an inheritance, or a liability limit change at a policy renewal. Many people simply recheck it once a year alongside their insurance renewals, since that's already a natural point to compare updated numbers.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Coverage Tools", href: "/tools/coverage" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function NetWorthProtectionCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Net Worth Protection Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            This net worth protection calculator adds up what you own and owe, then checks that total
            against your current auto, home or renters, and umbrella liability limits combined, so you
            know whether a serious lawsuit could reach further than your policies would pay.
          </p>
          <LastUpdated category="coverage" />
        </div>

        <div className="mt-2">
          <NetWorthProtectionCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-net-worth-protection-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who This Net Worth Protection Calculator Is For
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most people size their liability coverage around what a policy costs, not around what they&apos;d
            actually have to lose. This calculator is for the moment that framing stops working: you&apos;ve
            paid down a mortgage, built up a retirement account, or simply had your net worth grow past
            what it was when you first bought your auto and home policies, and you want a straight answer
            on whether your liability limits kept pace. It&apos;s equally useful for a homeowner who has never
            run this comparison and a renter who assumes, incorrectly, that liability exposure is only a
            homeowner&apos;s problem. If you already know you&apos;re underinsured and just need a specific umbrella
            limit, skip ahead to the umbrella policy need calculator; this tool is the step that tells you
            whether you need to.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How the Net Worth and Liability-Adequacy Check Work
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator runs in two stages. First, it builds a net worth figure from four asset
            categories you enter, home value, investment and retirement account balances, vehicles, and
            savings, minus two liability categories, your remaining mortgage balance and any other debts
            like credit cards or loans. That subtraction is standard net worth math, and the home
            component doubles as your home equity once the mortgage balance is subtracted out.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Second, the calculator takes that net worth figure and compares it against a separate number:
            your current total liability protection, meaning your auto liability limit, your home or
            renters liability limit, and any umbrella policy limit, all added together. This reflects a
            widely used asset-protection principle among insurance educators and financial planners: a
            single lawsuit can pursue whichever liability coverage actually applies, so the meaningful
            comparison isn&apos;t net worth against any one policy, it&apos;s net worth against everything your
            policies would pay in total. When net worth exceeds that combined total, the calculator flags
            the dollar gap; when it doesn&apos;t, it shows how much cushion you currently have.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a couple with a home worth $650,000 and a $180,000 mortgage balance, $320,000 combined
            in retirement and investment accounts, $40,000 in vehicles, and $60,000 in savings. Their total
            assets come to $1,070,000; subtracting the $180,000 mortgage and $5,000 in other debts brings
            their net worth to $885,000. Their current policies carry a $300,000 auto liability limit and a
            $300,000 home liability limit, with no umbrella policy, for $600,000 in total liability
            protection. The calculator flags an estimated $285,000 gap between their net worth and what
            their policies would actually pay in a worst-case judgment. That gap is precisely the number an
            umbrella policy is built to close, and it&apos;s a materially different, more specific answer than a
            vague sense that &ldquo;we probably have enough insurance.&rdquo;
          </p>

          <AdInArticle slot="tool-net-worth-protection-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is counting only liquid, easy-to-picture assets, cash and maybe a
            brokerage balance, while leaving out home equity and retirement accounts entirely, which
            understates net worth and makes a real liability gap invisible. A close second is checking
            liability limits one policy at a time instead of adding them up, which misses that an umbrella
            policy is meant to sit on top of the other two, not substitute for either. A third is treating
            every asset as equally exposed: some retirement accounts and, in some states, a portion of home
            equity carry legal protection from creditors that this calculator cannot look up on your
            behalf, which is exactly why that nuance is called out separately below rather than folded
            silently into the math.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes every dollar of positive net worth you enter is theoretically reachable
            in a judgment, which is a simplifying assumption, not a legal fact. In practice, homestead
            exemptions, retirement-account protections, and other creditor-exemption rules vary
            significantly from state to state and can shield some or all of specific assets from certain
            types of judgments; this tool has no visibility into your state&apos;s specific exemption statutes
            and none of this is legal advice. It also has no visibility into your insurer&apos;s underwriting
            rules, any state-specific minimum liability requirement, or the facts of any actual claim.
            Treat the gap or cushion shown here as a planning figure to bring into a conversation with a
            licensed insurance agent and, for the state-law questions, an attorney, not as a final
            determination of what a court could or couldn&apos;t reach.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Net worth</strong> — the value of everything you own minus everything you owe,
              calculated at a single point in time.
            </li>
            <li>
              <strong>Judgment-proof</strong> — a term used, often loosely, to describe someone with too
              few reachable assets or too much legally exempt property for a creditor to meaningfully
              collect a judgment against, even after winning a lawsuit.
            </li>
            <li>
              <strong>Asset protection</strong> — the general practice of structuring insurance coverage,
              account types, and, in some cases, legal entities so that a lawsuit or judgment has less
              reachable property to pursue; liability insurance is one common and comparatively simple tool
              within this broader practice.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how liability coverage and umbrella policies fit together, the{" "}
            <a
              href="https://www.iii.org/article/what-is-umbrella-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains what a personal umbrella policy adds on top of auto and home liability limits, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on how liability coverage types work. Because
            creditor-exemption and homestead-protection rules are set at the state level and vary widely,
            confirm your own state&apos;s specific rules with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or a licensed attorney before drawing conclusions about what&apos;s actually at risk.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            category. If this tool flags a gap, the{" "}
            <Link href="/tools/coverage/umbrella-policy-need-calculator" className="text-blue-600 hover:underline">
              umbrella policy need calculator
            </Link>{" "}
            sizes a specific umbrella limit to close it, and the{" "}
            <Link
              href="/tools/coverage/how-much-insurance-coverage-do-i-need-calculator"
              className="text-blue-600 hover:underline"
            >
              how much insurance coverage do I need calculator
            </Link>{" "}
            steps back further to check your broader coverage picture across policy types, not liability
            limits alone.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that run entirely in your browser, with no account and
            nothing saved, so you can work through a coverage question like this one with your own real
            numbers before it becomes an urgent one. This net worth check is one piece of a larger library
            aimed at turning insurance decisions into numbers you can verify yourself.
          </p>
        </section>
      </div>
    </>
  );
}

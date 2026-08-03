import type { Metadata } from "next";
import Link from "next/link";
import { HomeInsuranceDeductibleCalculatorTool } from "@/components/tools/HomeInsuranceDeductibleCalculatorTool";
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
  slug: "home-insurance-deductible-calculator",
  name: "Home Insurance Deductible Calculator",
  description:
    "Compare your homeowners premium at two deductible levels, find the exact break-even point in years, and weigh it against how often you actually file claims.",
  category: "Home",
  categorySlug: "home",
  keywords: [
    "home insurance deductible calculator",
    "homeowners deductible comparison",
    "which home insurance deductible should i choose",
    "home insurance deductible break even calculator",
    "raise home deductible savings",
  ],
  relatedTools: [],
};

const TITLE = "Home Insurance Deductible Calculator: Should You Raise It? | Insurance Tools";
const DESCRIPTION =
  "Use this home insurance deductible calculator to compare two quotes, find your exact break-even year, and see whether raising your deductible actually pays off.";
const PAGE_URL = `${SITE_URL}/tools/home/home-insurance-deductible-calculator`;

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
    question: "Should I raise my home insurance deductible?",
    answer:
      "It depends on how the numbers work out for your specific policy, not a general rule. A higher deductible almost always lowers your premium, but it also raises what you'd pay out of pocket on your next claim. This calculator turns that trade into a break-even number: how many years of premium savings it takes to make up the extra amount you'd owe. If you expect to go longer between claims than that break-even point, the higher deductible tends to save money over time.",
  },
  {
    question: "How is the home insurance deductible break-even point calculated?",
    answer:
      "Break-even years equals the dollar difference between your two deductible levels, divided by your annual premium savings from choosing the higher one. For example, if raising your deductible from $1,000 to $2,500 saves $150 a year, the break-even point is $1,500 divided by $150, or 10 years. If you expect to file a homeowners claim less often than every 10 years, the higher deductible tends to be the cheaper choice over that stretch.",
  },
  {
    question: "Does this calculator work with a percentage deductible?",
    answer:
      "No. Some homeowners policies, especially in states with wind, hail, or hurricane exposure, use a percentage deductible calculated as a share of your dwelling coverage limit rather than a flat dollar amount. Because that figure moves with your coverage limit instead of staying fixed, it doesn't fit the flat dollar-gap math this tool runs. If a quote shows a percentage deductible, convert it to a dollar amount at your current dwelling limit first, or treat this tool as a guide for dollar-deductible tiers only.",
  },
  {
    question: "Where do I find my premium at each deductible level?",
    answer:
      "Ask your current insurer or agent for a side-by-side quote showing the premium at both deductible levels you're considering, with everything else on the policy held constant, meaning the same dwelling coverage limit, personal property limit, liability limit, and endorsements. Many insurers will show this comparison automatically when you adjust the deductible slider in an online quote tool or on a renewal notice.",
  },
  {
    question: "What counts as a claim for this comparison?",
    answer:
      "Use whatever claim frequency you honestly expect for the kind of loss your deductible applies to, typically wind, fire, water damage, or theft, depending on your policy. Many homeowners go a decade or longer without filing a claim, since filing one can also raise future premiums or trigger non-renewal in some states, which is a separate cost this calculator doesn't model. Estimate conservatively rather than assuming you'll never file one.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Home Calculators", href: "/tools/home" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function HomeInsuranceDeductibleCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Home Insurance Deductible Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Two homeowners quotes, one real question: does the lower premium at a higher deductible
            actually pay off before you expect to file a claim? Enter your own numbers and see the
            break-even point in seconds.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <HomeInsuranceDeductibleCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-home-deductible-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs a Home Insurance Deductible Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Homeowners policies don&apos;t come in two tidy deductible tiers the way auto collision
            coverage usually does. One insurer might quote $1,000 versus $2,500, another might offer
            $500 versus $5,000, and a third might only move the premium a small amount between levels.
            That variety is exactly why a fixed comparison table isn&apos;t useful here: this tool asks
            for your own two quotes and your own dollar gap between them, so the math reflects the
            actual offer sitting in front of you rather than a generic tier that may not match anything
            your insurer quoted. It&apos;s built for homeowners holding two real premium numbers, whether
            from a renewal notice, a new policy quote, or an online rate comparison, who want to know
            which deductible level is the better financial bet rather than which one simply looks
            cheaper on the monthly bill.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Break-Even Math Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Enter your annual premium at the lower deductible and your annual premium at the higher
            deductible; the calculator subtracts the second from the first to get your annual savings
            from raising the deductible. Then enter the dollar gap between the two deductible levels
            themselves, for example $1,500 if you&apos;re comparing a $1,000 deductible against a $2,500
            one. Dividing that dollar gap by your annual savings produces the break-even point in years:
            how long you&apos;d need to hold the higher deductible, collecting the annual savings, before
            those savings add up to more than the extra amount you&apos;d owe out of pocket on your next
            claim. From there, compare that break-even number against how many years you honestly expect
            to go between filed homeowners claims, an estimate only you can reasonably make, since no
            calculator can predict a burst pipe or a hailstorm.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            One limitation worth stating plainly: this tool only handles flat dollar deductibles. Many
            homeowners policies, particularly in coastal, wildfire, or severe-hail regions, apply a
            percentage deductible instead, typically 1% to 5% of the dwelling coverage limit, for named
            storms, hurricanes, or wind and hail losses specifically. Because a percentage deductible
            scales with your dwelling coverage rather than sitting at a fixed dollar figure, it doesn&apos;t
            reduce to the same simple gap calculation this tool runs. If your policy uses one, convert it
            to a dollar amount at your current dwelling limit before comparing, or treat any result here
            as applicable only to the flat-dollar portion of your deductible structure.
          </p>

          <AdInArticle slot="tool-home-deductible-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a homeowner is quoted $1,650 a year at a $1,000 deductible and $1,500 a year at a $2,500
            deductible, a $150 annual difference. The dollar gap between the two deductibles is $1,500.
            Dividing $1,500 by $150 gives a break-even point of 10 years. If this homeowner has filed one
            claim in the past fifteen years, roughly one every 15 years, their claim frequency is longer
            than the 10-year break-even point, so the $2,500 deductible would likely have saved money
            over that stretch. But if the premium gap had only been $50 a year instead of $150, the
            break-even point stretches to 30 years, a much harder bar to clear, and the $1,000 deductible
            would probably have been the safer call. The arithmetic doesn&apos;t change; only the size of
            the premium gap and the claim estimate move the answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is raising a homeowners deductible purely because the new premium
            looks smaller on a renewal notice, without checking how many years of savings it would take
            to offset the larger out-of-pocket exposure. A second is comparing two quotes where more than
            the deductible changed, such as a different dwelling coverage limit or a dropped endorsement,
            which muddies the comparison since it&apos;s no longer an apples-to-apples deductible decision.
            A third is treating a percentage deductible as if it were a flat dollar figure, which can
            badly understate the actual out-of-pocket exposure on a high-value home during a named storm
            or hurricane claim.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the dollar figure you enter as the deductible difference is the full
            cost swing of a single claim, which holds for a straightforward covered loss but doesn&apos;t
            account for multiple claims in one policy period, premium increases that can follow a claim
            regardless of deductible level, or state-specific rules on claim-frequency surcharges and
            non-renewal after repeated claims. It also assumes your entered claim-frequency estimate is
            reasonable; the tool has no way to check it against your home&apos;s actual claim history or
            regional risk factors like wildfire, flood, or hail exposure. Treat the break-even figure as a
            planning input to bring into a conversation with your insurer or a licensed agent, not as a
            final decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Few Terms Used Here</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Deductible</strong> — the amount you pay out of pocket on a covered claim before
              your insurer pays the remainder.
            </li>
            <li>
              <strong>Percentage deductible</strong> — a deductible calculated as a percentage of your
              dwelling coverage limit rather than a flat dollar amount, commonly applied to wind, hail, or
              hurricane losses in higher-risk regions; this calculator does not model it.
            </li>
            <li>
              <strong>Break-even point</strong> — how long premium savings from a higher deductible take
              to equal the extra dollar amount you&apos;d pay out of pocket on a claim.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how deductibles work mechanically, the{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains why deductibles exist and how insurers apply them, and{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on homeowners coverage types, including how deductibles
            fit alongside dwelling, personal property, and liability limits. The{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s homeowners basics guide
            </a>{" "}
            also covers how percentage deductibles are commonly applied in higher-risk regions. Before
            changing a policy, confirm your exact premium at each deductible level directly with your
            insurer or a licensed agent.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator lives in the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category, alongside the broader{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            that cover other policy types. If you&apos;re working through an actual settlement instead of
            planning ahead of a deductible change, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            are the closer fit.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools is a free library of browser-based calculators for coverage, costs, claims,
            and deductibles. Nothing you type here is stored or sent anywhere; the goal is simply to give
            homeowners a clear number to work from before a deductible decision, not after.
          </p>
        </section>
      </div>
    </>
  );
}

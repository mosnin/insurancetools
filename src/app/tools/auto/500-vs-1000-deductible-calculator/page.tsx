import type { Metadata } from "next";
import Link from "next/link";
import { FiveHundredVsThousandDeductibleCalculatorTool } from "@/components/tools/FiveHundredVsThousandDeductibleCalculatorTool";
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
  slug: "500-vs-1000-deductible-calculator",
  name: "$500 vs $1,000 Deductible Calculator",
  description:
    "Compare your premium at a $500 and a $1,000 deductible, see the exact break-even point in years, and weigh it against how often you actually file claims.",
  category: "Auto",
  categorySlug: "auto",
  keywords: [
    "500 vs 1000 deductible calculator",
    "car insurance deductible comparison",
    "which deductible should i choose",
    "deductible break even calculator",
    "raise deductible savings",
    "500 dollar vs 1000 dollar deductible",
  ],
  relatedTools: ["car-insurance-coverage-calculator"],
};

const TITLE = "$500 vs $1,000 Deductible: Which Should You Choose? | Insurance Tools";
const DESCRIPTION =
  "Run your own premium numbers through this $500 vs 1000 deductible calculator to find the exact break-even point in years, then compare it against how often you actually file claims.";
const PAGE_URL = `${SITE_URL}/tools/auto/500-vs-1000-deductible-calculator`;

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
    question: "Is a $500 or $1,000 deductible better for car insurance?",
    answer:
      "Neither is universally better. A $1,000 deductible almost always lowers your premium, but it also doubles what you pay out of pocket if you file a collision or comprehensive claim. This calculator turns that trade into a break-even number: how many years of premium savings it takes to make up the extra $500. If you expect to go longer between at-fault claims than that break-even point, the higher deductible tends to save money over time. If you expect to file sooner, the lower deductible tends to cost less.",
  },
  {
    question: "How is the deductible break-even point calculated?",
    answer:
      "Break-even years equals the extra $500 you'd pay out of pocket at the $1,000 deductible, divided by your annual premium savings from choosing it. For example, if raising your deductible saves you $125 a year, the break-even point is $500 divided by $125, or 4 years. If you expect to file an at-fault claim less often than every 4 years, the $1,000 deductible tends to be the cheaper choice over time.",
  },
  {
    question: "Where do I find my premium at each deductible level?",
    answer:
      "Ask your current insurer for a side-by-side quote at both deductible levels, or check if your insurer's online account lets you preview the premium change before submitting it. Many insurers will also show this comparison on a renewal notice. Use the same coverage limits for both numbers so the only variable that changes is the deductible.",
  },
  {
    question: "Why does the calculator ask how often I file claims instead of just picking a deductible for me?",
    answer:
      "Nobody can predict your future claim frequency with certainty, including this tool. Claim frequency depends on your driving habits, commute, location, vehicle age, and plain luck, none of which a calculator can see. Rather than guess on your behalf, this tool asks you to supply your own honest estimate and then shows you the exact math against it, so the final call stays informed but yours.",
  },
  {
    question: "Does raising my deductible affect anything besides the premium?",
    answer:
      "Yes. A higher deductible means more cash needs to be available immediately after an accident, before repairs can start, since you pay that amount before the insurer pays the rest. It's worth checking that you'd have $1,000 accessible in an emergency fund before choosing the higher deductible purely for the premium savings.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Auto Calculators", href: "/tools/auto" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function FiveHundredVsThousandDeductibleCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            $500 vs $1,000 Deductible Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Two quotes, one question: does the lower premium at a $1,000 deductible actually pay off
            before you expect to file a claim? Enter both premiums and find out in seconds.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <FiveHundredVsThousandDeductibleCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-500-vs-1000-deductible-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The $500 vs $1,000 Deductible Decision, in Plain Numbers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every renewal notice eventually asks the same quiet question: keep the deductible where it
            is, or raise it and pocket the difference every month? The insurer&apos;s quote tool will
            happily show you the new premium, but it won&apos;t tell you whether that lower premium is
            actually a good deal for you specifically. That depends on one thing no insurer can predict:
            how often you&apos;ll file a claim. This $500 vs 1000 deductible calculator exists to close
            that gap. It doesn&apos;t guess your claim frequency for you; it asks you to supply your own
            estimate, then shows you exactly how many years of savings it takes to justify the higher
            deductible, so you can compare that number against your own driving record honestly.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is aimed at drivers who already have two real premium quotes in hand, one at a
            $500 deductible and one at a $1,000 deductible, and want to know which one actually saves
            money rather than which one just looks cheaper on the monthly bill. It&apos;s also useful for
            anyone renewing a policy who noticed the deductible line for the first time and wants to
            understand what raising it would actually cost them the next time they file a claim. It is
            not built for shopping between insurers or comparing coverage types; it isolates a single
            variable, the deductible, so the comparison stays clean.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Break-Even Math Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator subtracts your $1,000-deductible premium from your $500-deductible premium to
            get your annual savings from raising the deductible. It then divides 500 by that savings
            figure, since $500 is the additional amount you&apos;d pay out of pocket on any single
            at-fault claim once you&apos;ve made the switch. The result is a break-even point measured in
            years: how long you&apos;d need to keep the $1,000 deductible, collecting the annual savings,
            before those savings add up to more than the extra $500 you&apos;d owe on your next claim.
            From there, the comparison is simple: line that break-even number up against how many years
            you typically expect to go between at-fault claims, a number only you can reasonably
            estimate, and see which side of the line you land on.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tool also projects a rough 10-year outlook, multiplying your assumed claim frequency
            against the extra out-of-pocket cost per claim and comparing that total to 10 years of
            accumulated premium savings. It&apos;s a directional number, not a forecast, since real claim
            timing is never that even.
          </p>

          <AdInArticle slot="tool-500-vs-1000-deductible-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a driver&apos;s current policy quotes $1,450 a year at a $500 deductible and $1,250 a year
            at a $1,000 deductible, a $200 annual difference. Dividing $500 by $200 gives a break-even
            point of 2.5 years. If this driver has had two at-fault accidents in the last eight years,
            roughly one every four years, their claim frequency is longer than the 2.5-year break-even
            point, so the $1,000 deductible would likely have saved them money over that stretch. But if
            their premium difference had only been $50 a year instead of $200, the break-even point
            stretches to 10 full years, a much harder bar to clear for most drivers, and the $500
            deductible would probably have been the better call. The math is identical in both cases; only
            the size of the premium gap changes the answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes Drivers Make Here</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is raising the deductible purely because the new premium number
            looks smaller, without ever calculating how many claims it would take to erase the savings.
            A second mistake is comparing quotes with different coverage limits alongside the different
            deductible, which muddies the comparison since more than one variable changed at once. A
            third is ignoring cash flow: even when the math favors the $1,000 deductible on paper, it
            only helps if $1,000 would actually be sitting in reach the day after an accident, not tied
            up somewhere illiquid.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the $500 difference between the two deductible levels is the entire
            cost swing of a claim, which holds for a straightforward covered collision or comprehensive
            loss but doesn&apos;t account for multi-claim years, rate increases that can follow a claim
            regardless of deductible, or state-specific claim-frequency surcharge rules that vary by
            insurer. It also assumes your entered claim-frequency estimate is a reasonable one; the tool
            has no way to verify it against your actual driving history. Treat the break-even figure as a
            planning input, not a guarantee, and confirm both premium numbers directly with your insurer
            before changing a policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Few Terms Used Here</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Deductible</strong> — the amount you pay out of pocket on a covered claim before
              your insurer pays the remainder.
            </li>
            <li>
              <strong>Break-even point</strong> — how long premium savings from a higher deductible take
              to equal the extra amount you&apos;d pay out of pocket on a claim.
            </li>
            <li>
              <strong>At-fault claim</strong> — a claim where you (or your policy) are responsible for the
              accident, as opposed to a claim you file against another driver&apos;s liability coverage.
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
            explains why deductibles exist and how insurers apply them, and the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on auto coverage generally, including how deductibles fit
            alongside liability, collision, and comprehensive coverage. Before changing a policy, confirm
            your exact premium at each deductible level directly with your insurer or a licensed agent.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator lives in the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category, alongside the broader{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            that cover other policy types. If you haven&apos;t yet settled on a liability limit to pair
            with your deductible, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            covers that question, and the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            section has similar how-much-do-I-need tools for other insurance types.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that run entirely in your browser, with no account
            and no data collection, so you can work through insurance math on your own terms. This
            deductible comparison is one tool in a growing library aimed at helping people show up
            informed before they talk to an agent, not after.
          </p>
        </section>
      </div>
    </>
  );
}

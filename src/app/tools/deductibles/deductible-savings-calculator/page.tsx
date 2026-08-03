import type { Metadata } from "next";
import Link from "next/link";
import { DeductibleSavingsCalculatorTool } from "@/components/tools/DeductibleSavingsCalculatorTool";
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
  slug: "deductible-savings-calculator",
  name: "Deductible Savings Calculator",
  description:
    "Enter your current premium and a higher-deductible quote to see the exact annual savings, the added out-of-pocket risk, and how long it takes to recoup it.",
  category: "Deductibles",
  categorySlug: "deductibles",
  keywords: [
    "deductible savings calculator",
    "how much do you save raising your deductible",
    "deductible increase savings calculator",
    "raise deductible lower premium calculator",
    "insurance premium savings from deductible",
    "is raising my deductible worth it",
  ],
  relatedTools: ["deductible-comparison-calculator", "deductible-affordability-calculator"],
};

const TITLE = "Deductible Savings Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this deductible savings calculator to compare your current premium against a higher-deductible quote and instantly see your annual savings and payback time.";
const PAGE_URL = `${SITE_URL}/tools/deductibles/deductible-savings-calculator`;

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
    question: "Does this deductible savings calculator tell me if I should raise my deductible?",
    answer:
      "It gives you the two numbers that decision actually depends on: how much a higher deductible saves you per year, and how long that savings takes to offset the extra amount you'd owe out of pocket on a claim. It doesn't guess how often you'll file a claim, since nobody, including this tool, can predict that reliably. Weigh the recoup time against your own claim history and, more importantly, whether you could comfortably pay the higher deductible in cash today.",
  },
  {
    question: "How is the recoup time calculated?",
    answer:
      "Recoup time equals the increase in your deductible divided by your annual premium savings. If raising your deductible by $500 saves you $250 a year, the recoup time is $500 divided by $250, or 2 years. After 2 years of collecting the savings, you've effectively banked enough to cover that extra $500 if a claim happens the following year.",
  },
  {
    question: "Where do I get the higher-deductible premium quote to enter here?",
    answer:
      "Ask your current insurer for a side-by-side quote at the higher deductible level, using the same coverage limits you already carry. Most insurers can show this instantly through an online account or by phone, and many renewal notices already list premium options at two or three deductible levels. Keep every other coverage detail identical between the two quotes so the deductible is the only variable changing.",
  },
  {
    question: "What does it mean if raising my deductible doesn't lower my premium?",
    answer:
      "It means that, based on the two quotes entered, the insurer isn't pricing the higher deductible meaningfully lower right now. That can happen depending on the insurer, your claims history, or how the two quotes were pulled. Ask for an updated quote, double-check that both quotes use the same coverage limits, or compare against a different deductible level before assuming a higher deductible always saves money, because it doesn't automatically.",
  },
  {
    question: "How much cash should I have available before choosing a higher deductible?",
    answer:
      "Enough to cover the full higher deductible amount without financial strain, ideally sitting in an accessible emergency fund rather than tied up in investments or credit you'd need to borrow against. A deductible is due before the insurer pays its share of a covered claim, so the savings only make sense if the cash to cover it is genuinely available. The deductible affordability calculator walks through that specific question in more depth.",
  },
  {
    question: "Is this the same as the deductible comparison calculator?",
    answer:
      "No. This tool is built for a single, fast question: does the exact new deductible quote in front of you save money compared to what you pay now, and how long does that saving take to pay for itself. The deductible comparison calculator instead lays out several deductible tiers side by side so you can weigh three or more options at once. Use this one when you already have two specific quotes; use the comparison tool when you're still deciding among several deductible levels.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
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

export default function DeductibleSavingsCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Deductible Savings Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Two premium numbers are all this deductible savings calculator needs: what you pay now, and
            what you were quoted at a higher deductible. Enter both and see the exact annual savings and
            how long it takes to pay for itself.
          </p>
          <LastUpdated category="deductibles" />
        </div>

        <div className="mt-2">
          <DeductibleSavingsCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-deductible-savings-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why Raising a Deductible Lowers a Premium at All
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A deductible is the slice of every covered claim you agree to pay yourself before your
            insurer pays the rest. Raising it doesn&apos;t change what a claim costs in total; it changes
            who pays for the smaller end of that cost. When you agree to absorb a larger first chunk of
            any claim, the insurer&apos;s expected payout on your policy drops, particularly for the
            frequent, low-dollar claims that make up most filed claims. Pricing reflects that shifted
            risk, which is the entire reason a higher-deductible quote comes back lower than a
            lower-deductible one. It isn&apos;t a discount or a loyalty perk; it&apos;s the insurer charging
            less because you&apos;re carrying more of the small-claim risk yourself.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            That mechanic is standard across auto, home, and most property insurance, but exactly how
            much a given deductible increase lowers a given premium varies by insurer, state, coverage
            limits, and your own claims history. There is no universal savings percentage that applies
            to every policy, which is why this calculator never assumes one. Every figure it shows comes
            from the two premiums you enter yourself, not a typical industry average.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool fits one specific moment best: you already have your current premium and a fresh
            quote at a higher deductible sitting side by side, likely from a renewal notice or a call
            with your agent, and you want a straight answer on whether the lower premium is actually
            worth the added risk. It&apos;s built to be fast rather than exhaustive. If you&apos;re instead
            still choosing among three or more deductible levels with no specific quotes yet, the{" "}
            <Link href="/tools/deductibles/deductible-comparison-calculator" className="text-blue-600 hover:underline">
              deductible comparison calculator
            </Link>{" "}
            is the better starting point, since it&apos;s built to lay several tiers out at once rather
            than isolate a single before-and-after comparison.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Math Behind the Result</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator subtracts your new, higher-deductible premium from your current premium to get
            your annual dollar savings, then divides that figure by your current premium to get a
            percentage. Separately, it subtracts your current deductible from your new deductible to show
            the increased out-of-pocket risk you&apos;d be taking on per claim. Dividing that risk figure by
            your annual savings produces the recoup time in years: how long you&apos;d need to hold the
            higher deductible, banking the annual savings, before that saved money equals the extra
            amount you&apos;d owe on a single claim. Three inputs, three outputs, no assumed averages
            anywhere in between.
          </p>

          <AdInArticle slot="tool-deductible-savings-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say your current policy costs $1,450 a year at a $500 deductible, and your insurer quotes
            $1,300 a year at a $1,000 deductible. Your annual savings is $150, or a little over 10% of
            your current premium. The deductible increase is $500, so dividing $500 by $150 gives a
            recoup time of about 3.3 years. In plain terms: if you go 3.3 years or longer between claims
            after switching, the higher deductible comes out ahead financially. If a claim lands sooner
            than that, you&apos;d have paid more out of pocket on that one claim than you&apos;d yet saved in
            premiums, even though the annual math still favors the higher deductible over a longer stretch.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Mistake That Erases the Savings
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common way this calculation goes wrong isn&apos;t a math error; it&apos;s raising the
            deductible without first confirming the higher amount is actually sitting somewhere
            accessible. A $1,000 deductible that saves $150 a year is a good trade on paper, but it stops
            being a good trade the moment a claim arrives and that $1,000 has to come from a credit card
            at interest, or gets delayed because the cash isn&apos;t there. The savings this calculator shows
            are real, but they only help if the increased risk is one you can actually absorb in cash when
            it&apos;s due. The{" "}
            <Link href="/tools/deductibles/deductible-affordability-calculator" className="text-blue-600 hover:underline">
              deductible affordability calculator
            </Link>{" "}
            checks that side of the decision directly, against your own savings and monthly budget.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the two premiums you enter are priced with identical coverage limits
            and terms aside from the deductible itself; if anything else changed between the quotes, the
            savings figure will be misleading. It has no visibility into your claims history, your
            insurer&apos;s underwriting rules, any deductible-based surcharge your state or insurer may
            apply after a claim, or how often you&apos;re likely to file. The recoup time is a planning
            figure built from a single hypothetical claim, not a forecast of when your next claim will
            actually happen. Confirm both premium numbers directly with your insurer before changing a
            policy, and treat this result as an input to that conversation rather than a final answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Few Terms Used Here</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Premium</strong> — the amount you pay your insurer, typically monthly or annually,
              to keep a policy active, regardless of whether you file a claim.
            </li>
            <li>
              <strong>Deductible</strong> — the amount you pay out of pocket on a covered claim before
              your insurer pays the remainder.
            </li>
            <li>
              <strong>Self-insured risk</strong> — the portion of potential loss you carry yourself
              instead of transferring to an insurer; raising a deductible increases the self-insured
              portion of every future claim in exchange for a lower premium today.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how deductibles function inside a policy, the{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains why insurers use deductibles and how they interact with a policy&apos;s other terms,
            and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on how coverage and pricing decisions like this one fit
            into a policy overall. If you&apos;re weighing this alongside your state&apos;s specific rules, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            is the authoritative source, not this calculator. Before changing a policy, confirm both
            premium numbers directly with your insurer or a licensed agent.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            category. If you&apos;re still choosing among several deductible levels rather than evaluating
            one specific quote, the{" "}
            <Link href="/tools/deductibles/deductible-comparison-calculator" className="text-blue-600 hover:underline">
              deductible comparison calculator
            </Link>{" "}
            lays out multiple tiers side by side, and the{" "}
            <Link href="/tools/deductibles/deductible-affordability-calculator" className="text-blue-600 hover:underline">
              deductible affordability calculator
            </Link>{" "}
            checks whether a higher deductible fits your actual cash reserves before you commit to it.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free calculators that run entirely in your browser, with nothing
            saved and no account required, so you can run your own numbers before a renewal deadline
            forces a decision. This savings calculator is one entry in a wider library built to turn
            insurance paperwork into numbers you can actually check yourself.
          </p>
        </section>
      </div>
    </>
  );
}

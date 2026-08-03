import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { LifeInsuranceAffordabilityCalculatorTool } from "@/components/tools/LifeInsuranceAffordabilityCalculatorTool";
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
 * This tool is not yet wired into the central `src/lib/tools.ts` registry
 * (a separate process owns that file), so the metadata this page needs is
 * defined locally rather than pulled through `getToolBySlug`.
 */
const tool: Tool = {
  slug: "life-insurance-affordability-calculator",
  name: "Life Insurance Affordability Calculator",
  description:
    "See a suggested monthly life insurance premium budget based on your take-home income and an editable percentage guideline, then compare it against a quote and a debt-to-income style check.",
  category: "Life",
  categorySlug: "life",
  keywords: [
    "life insurance affordability calculator",
    "how much should i spend on life insurance",
    "life insurance budget calculator",
    "can i afford life insurance",
    "life insurance percentage of income",
    "affordable life insurance premium calculator",
  ],
  relatedTools: ["life-insurance-needs-calculator", "term-vs-whole-life-cost-calculator"],
};

const TITLE = "Life Insurance Affordability Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this life insurance affordability calculator to set a monthly premium budget, then compare a real quote against it and a simple debt-to-income guideline.";
const PAGE_URL = `${SITE_URL}/tools/life/life-insurance-affordability-calculator`;

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
    question: "Is the 1–3% of income guideline an official rule for life insurance premiums?",
    answer:
      "No. It's a starting point some financial planners cite for keeping total insurance premiums, life insurance included, within a manageable share of income. No regulator, insurer, or lending body sets this figure, which is why this calculator makes the percentage a field you can change rather than a number it enforces. Treat the default as a reasonable place to start testing, not a target you're required to hit.",
  },
  {
    question: "Why does this calculator ask for take-home income instead of gross salary?",
    answer:
      "Because a premium is ultimately paid out of the money that actually lands in your account, not your salary before taxes and deductions. Some versions of the percentage guideline are stated against gross income, which would produce a larger suggested budget than the figure this tool shows. Using take-home pay here is the more conservative choice, and it's worth keeping in mind if you're comparing this result to a rule of thumb you read elsewhere that used gross income instead.",
  },
  {
    question: "My quoted premium is above the suggested budget. Does that mean I should buy less coverage?",
    answer:
      "Not automatically. It's a prompt to look closer, not a verdict. A quote above your budget could reflect a shorter term length, a permanent policy instead of term, a health rating, or simply one insurer's pricing. Before reducing coverage, it's often worth comparing quotes from a few insurers, checking whether a level-premium term policy at a longer duration changes the math, or reviewing whether the coverage amount itself, not just the premium, still fits your household's actual needs.",
  },
  {
    question: "How is this different from a life insurance needs calculator?",
    answer:
      "A needs calculator answers how much coverage you should carry, based on income replacement, debts, and future obligations like a mortgage or college costs. This calculator answers a narrower, budgeting-focused question: whether a given premium fits sustainably into your monthly cash flow. Most people benefit from running both, since a coverage amount that's correct on paper is only useful if the premium behind it is one you can keep paying for the life of the policy.",
  },
  {
    question: "What happens if I stop being able to afford my premium?",
    answer:
      "If a premium goes unpaid past the policy's grace period, the policy can lapse, which typically ends the coverage entirely unless it had built cash value to draw on. That's the core reason this calculator exists: a policy sized for maximum coverage but priced beyond what a household can sustain for years is a common way people end up with no coverage at all, right when they assumed they were protected. If affordability becomes a concern, contact the insurer or a licensed agent before a payment is missed, since options like reducing the coverage amount or adjusting the term are usually easier to arrange while the policy is still active.",
  },
  {
    question: "Does the 36% debt-to-income figure shown here mean I can't get life insurance?",
    answer:
      "No. It's a commonly cited caution line, most often associated with mortgage lending, reused here only as a rough gut-check on how much of your income is already committed before adding a new premium. Life insurers don't generally decline coverage based on a debt-to-income ratio the way a mortgage lender might. It's included so the suggested premium budget doesn't get evaluated in isolation from the rest of what's already leaving your paycheck each month.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Life Insurance Tools", href: "/tools/life" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function LifeInsuranceAffordabilityCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Life Insurance Affordability Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Set a suggested monthly life insurance premium budget from your income and an editable
            percentage guideline, then check a real quote against it. Free, instant, and nothing you
            type leaves your browser.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <LifeInsuranceAffordabilityCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-life-affordability-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Life Insurance Affordability Calculator Does
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most life insurance tools answer &ldquo;how much coverage do I need,&rdquo; which is the right
            question for sizing a policy but the wrong one for deciding whether you can actually keep
            paying for it. This life insurance affordability calculator is built for the moment right
            after you get a quote, when the real question shifts to whether that specific dollar figure
            fits your monthly budget without straining it. It turns your take-home income and an
            editable budgeting percentage into a suggested monthly premium ceiling, then measures a
            quote you&apos;ve actually received against that number instead of a generic average premium
            that has nothing to do with your household.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            It&apos;s most useful for anyone holding a real quote and trying to decide whether it&apos;s
            sustainable, especially first-time buyers comparing term life quotes across insurers, parents
            weighing a larger policy against a tighter monthly budget, and anyone who let a previous
            policy lapse because the premium quietly stopped fitting. It&apos;s less useful as a
            starting point if you don&apos;t yet know how much coverage you need; run the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            first, then bring the resulting coverage amount here once you have a quote for it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How the Suggested Budget Percentage Is Derived
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Some financial planners suggest keeping total insurance premiums, life insurance included,
            to roughly 1% to 3% of income as a starting guideline, on the reasoning that insurance is
            meant to protect a household&apos;s finances, not strain them. That range is not a government
            requirement, an underwriting rule, or a figure this calculator claims is correct for every
            household, which is why the percentage field defaults to 2% but stays fully editable. A
            single parent with no other coverage might reasonably budget higher; someone with strong
            employer-provided life insurance and few dependents might reasonably budget lower. Multiplying
            your entered take-home income by the percentage you choose produces the suggested monthly
            budget, and every other figure on the page updates from that one number the moment you change
            it.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            One nuance worth flagging directly: some versions of this guideline are stated against gross
            (pre-tax) income rather than take-home pay. This calculator deliberately asks for take-home
            income instead, since that&apos;s the money actually available to pay a premium each month, which
            makes the suggested budget here more conservative than the same percentage applied to a gross
            salary figure. If you&apos;ve seen a different number elsewhere, that&apos;s often why.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a household with $5,000 in monthly take-home income, $400 in existing debt payments
            (a car loan and a credit card), a 2% budget percentage, and a $45-a-month quote for a 20-year
            level term policy. The suggested budget comes out to $100 a month (2% of $5,000). The $45
            quote sits comfortably inside that budget, leaving roughly $55 of headroom at the chosen
            percentage. Adding the $45 premium to the $400 in existing debt and dividing by $5,000 income
            produces a combined obligation share of about 8.9%, well under the 36% debt-to-income
            guideline shown as context, so no caution note appears. Raise the quote to $150 instead, and
            the same household would see the budget comparison flip to &ldquo;above suggested budget,&rdquo;
            prompting a second look at term length or coverage amount rather than an assumption that the
            higher price is simply wrong.
          </p>

          <AdInArticle slot="tool-life-affordability-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is choosing a coverage amount based purely on a needs calculation and
            never checking whether the resulting premium is sustainable for the full length of the term,
            which can be twenty or thirty years. A policy that&apos;s technically correctly sized but priced
            beyond a household&apos;s comfortable budget is a common path toward a missed payment years down
            the road. A second, closely related mistake is letting a policy lapse from unaffordability
            rather than contacting the insurer first, since reducing the coverage amount, shortening the
            term, or exploring a different payment schedule is usually possible while the policy is still
            active, but becomes much harder once it has already lapsed and new coverage would require
            requalifying at a current age and health status.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every figure this calculator produces depends on the percentage you enter, which is your own
            assumption, not a fixed rule this tool verifies against any external standard. The suggested
            budget doesn&apos;t know your dependents, other coverage you already carry, your health rating,
            or how many years remain on the term you&apos;re quoting, all of which reasonably affect what a
            sustainable premium looks like for your household. The 36% debt-to-income context line is a
            commonly cited caution threshold borrowed from general lending guidance, not a standard life
            insurers apply when underwriting a policy. Use every number here as a planning input to bring
            into a conversation with a licensed insurance agent or financial professional, not as a final
            answer on what to buy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Life Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Level premium</strong> — a premium that stays the same for the entire length of a
              term policy, which is what makes a sustained affordability check meaningful; the quote you
              enter today is generally the same amount you&apos;d owe in year fifteen of a level-term policy.
            </li>
            <li>
              <strong>Term conversion</strong> — a feature on some term policies letting you convert
              coverage to a permanent policy without a new medical exam, which can matter if your budget
              or health situation changes before the term ends.
            </li>
            <li>
              <strong>Lapse</strong> — what happens when a premium goes unpaid past the policy&apos;s grace
              period, typically ending the death benefit entirely unless the policy had cash value to draw
              from instead.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            The Consumer Financial Protection Bureau publishes general background on{" "}
            <a
              href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              what a debt-to-income ratio is
            </a>{" "}
            and how it&apos;s commonly used as a budgeting signal. The{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes consumer guidance on sizing life insurance coverage, and the{" "}
            <a
              href="https://content.naic.org/consumer/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes definitions of common life insurance terms, including what a policy lapse means and
            how grace periods generally work. Confirm any policy-specific grace period or conversion
            option with your insurer or a licensed agent, since exact terms vary by policy and state.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. If you haven&apos;t settled on a coverage amount yet, start with the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>{" "}
            to size the policy first. Once you know roughly what coverage you want, the{" "}
            <Link href="/tools/life/term-vs-whole-life-cost-calculator" className="text-blue-600 hover:underline">
              term vs. whole life cost calculator
            </Link>{" "}
            shows how policy type changes the premium you&apos;d be budgeting for here.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools is a free library of browser-based calculators built to make insurance
            numbers easier to work with on your own, before you ever have to sit across from a sales
            conversation. Nothing you enter is stored or transmitted, and every tool is designed to leave
            you with a clearer question to bring to a licensed agent, not a final decision made for you.
          </p>
        </section>
      </div>
    </>
  );
}

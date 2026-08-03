import type { Metadata } from "next";
import Link from "next/link";
import { LifeInsuranceNeedsCalculatorTool } from "@/components/tools/LifeInsuranceNeedsCalculatorTool";
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

const tool = getToolBySlug("life-insurance-needs-calculator")!;

const TITLE = "Life Insurance Needs Calculator | Insurance Tools";
const DESCRIPTION =
  "Calculate your life insurance needs with a transparent, line-by-line formula built from your own income, debts, and assets, not a generic income multiplier.";
const PAGE_URL = `${SITE_URL}/tools/life/life-insurance-needs-calculator`;

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
    question: "Does this life insurance needs calculator use a fixed multiple of my income?",
    answer:
      "No. Many online tools recommend a flat multiple, such as 10 times your income, regardless of your actual debts, assets, or family situation. This calculator instead adds up the specific things your household would need money for, your chosen years of income replacement, your debts, final expenses, and any future costs you name, then subtracts the liquid assets and existing coverage you already have. The result reflects your numbers, not a generic ratio.",
  },
  {
    question: "How many years of income should I choose to replace?",
    answer:
      "There's no single correct answer, since it depends on how long your dependents would need support. A common way to think about it is counting the years until your youngest child would be financially independent, or the years remaining until you'd planned to retire and other savings would take over. Some households choose a shorter window and lean more on savings; others choose longer for extra cushion. Try a few different values in the calculator to see how much the estimate moves.",
  },
  {
    question: "Why does the calculator include a $15,000 placeholder for final expenses?",
    answer:
      "It's a starting number to edit, not a fixed cost. Funeral and burial expenses vary widely by region, service choices, and whether a burial or cremation is planned. $15,000 is a reasonable planning figure to adjust from, so replace it with your own estimate, or with a quote from a local funeral provider, if you want a more precise number.",
  },
  {
    question: "Should I count my 401(k) or retirement accounts as a liquid asset?",
    answer:
      "Only if your household could actually access that money quickly and without a steep penalty or tax hit, which is not usually true of retirement accounts before a certain age. Most people limit the liquid assets field to savings, checking, and taxable investment accounts that could be spent right away, and leave retirement accounts out of the offset entirely.",
  },
  {
    question: "How is this different from the DIME method or an income-replacement calculator?",
    answer:
      "The DIME method is a specific formula, debt, income, mortgage, and education, that bundles those four categories in a fixed structure. An income-replacement calculator focuses narrowly on replacing your paycheck alone. This needs calculator is the more general, flexible version: it includes income replacement as one line among several, but lets you add debts, final expenses, and any future expense you name, so the total reflects your whole financial picture rather than one formula's assumptions.",
  },
  {
    question: "Does a bigger number mean I should buy that much coverage today?",
    answer:
      "Treat the estimated coverage gap as a starting point for a conversation, not a purchase order. Term life insurance pricing depends on your age, health, and the insurer's underwriting, and your actual needs will change as your mortgage shrinks, your kids grow up, or your savings grow. Revisit this calculator every few years or after a major life change, and confirm the final number with a licensed insurance agent or financial professional.",
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

export default function LifeInsuranceNeedsCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Life Insurance Needs Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Build your coverage number line by line from your own income, debts, final expenses, and
            assets, so you can see exactly where the total came from instead of trusting a flat
            multiplier.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <LifeInsuranceNeedsCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-life-insurance-needs-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Life Insurance Needs Calculator Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is a general-purpose life insurance needs calculator built for anyone who wants to know
            what their household would actually need, rather than what a marketing rule of thumb says.
            It doesn&apos;t multiply your salary by a fixed number picked by an insurer or a blog post.
            Instead it walks through the specific categories a family typically needs money for after a
            death, income replacement over a period you choose, outstanding debts, final expenses, and
            named future costs, and then subtracts what you already have to cover them. You end up with
            a single coverage gap figure and a visible breakdown showing exactly how it was built.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            It&apos;s built for anyone shopping for a first term life policy, reviewing coverage after a
            mortgage, a new baby, or a raise, or comparing a quote against what they actually need instead
            of accepting whatever amount an insurer&apos;s calculator defaults to. If you specifically want a
            formula structured around debt, income, mortgage, and education, the site&apos;s{" "}
            <Link href="/tools/life/dime-method-calculator" className="text-blue-600 hover:underline">
              DIME method calculator
            </Link>{" "}
            follows that exact four-part structure. If you only want to replace your paycheck and nothing
            else, the{" "}
            <Link href="/tools/life/income-replacement-calculator" className="text-blue-600 hover:underline">
              income-replacement calculator
            </Link>{" "}
            is the narrower fit. This tool sits above both: it&apos;s the flexible, needs-based version for
            households whose situation doesn&apos;t map neatly onto either narrower formula.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Result Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts with income replacement: your annual income you want replaced,
            multiplied by the number of years you choose. It adds your remaining mortgage balance and any
            other debt (credit cards, auto loans, student loans), your final expenses, and any future
            expense you name in a single lump sum, such as a projected college cost. Adding those four
            categories produces a subtotal, the gross need. From that subtotal, the tool subtracts your
            liquid assets, savings and investments your family could spend right away, and any existing
            life insurance you already carry, through work or a separate policy. What&apos;s left is the
            estimated coverage gap, which the panel displays as a running, line-by-line breakdown so you
            can see the contribution of every input rather than a single opaque number.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a parent earning $65,000 a year who wants 15 years of income replaced, covering the
            years until their youngest child is likely to be financially independent. They have a
            $220,000 mortgage balance, $8,000 in other debt, keep the $15,000 final-expenses placeholder
            as-is, and want to add $80,000 for a future college cost. Income replacement alone comes to
            $975,000 (15 years times $65,000). Adding debts, final expenses, and future expenses brings
            the subtotal to $1,298,000. They have $20,000 in liquid savings and $50,000 in existing group
            life coverage through work, a combined offset of $70,000. Subtracting that offset from the
            subtotal leaves an estimated coverage gap of $1,228,000, the amount of additional term
            coverage this scenario points to.
          </p>

          <AdInArticle slot="tool-life-insurance-needs-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is anchoring on a flat multiple of income, buying 8 or 10 times salary
            because that&apos;s the number a quote form suggested, without checking whether it actually
            covers a specific mortgage and a specific number of years of support. A second mistake is
            forgetting to subtract existing coverage, especially employer-provided group life insurance,
            which leads people to buy more than they need. A third is leaving future one-time costs like
            college entirely out of the picture because they feel far off, when they&apos;re one of the
            larger and more predictable expenses a policy is meant to cover.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes that adding up specific, named needs and subtracting specific,
            named resources is a more transparent way to size coverage than applying a fixed multiplier,
            which is a widely used planning approach but not the only valid one. It does not account for
            inflation over the years of income replacement you select, does not model investment growth on
            the proceeds, does not know your health, age, or how an insurer will price a policy for you,
            and does not factor in taxes on income or estate matters. The $15,000 final-expenses figure is
            a placeholder meant to be edited, not a researched average for your area. Treat the result as
            a starting figure to bring into a conversation with a licensed insurance agent or financial
            professional, not as a final purchase amount.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Income replacement</strong> — the portion of a coverage need meant to substitute for
              the earnings your household would lose, spread across a chosen number of years.
            </li>
            <li>
              <strong>Final expenses</strong> — funeral, burial or cremation, and related costs incurred
              shortly after a death.
            </li>
            <li>
              <strong>Term life insurance</strong> — a policy that pays a death benefit if you die during a
              fixed term (such as 15, 20, or 30 years) and typically has no cash value component.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how needs-based coverage estimates are typically built, the{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the income-replacement and needs-analysis approaches this tool models, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes general consumer guidance on how life insurance coverage works. For an independent,
            nonprofit explanation of term versus permanent policies, the{" "}
            <a
              href="https://www.limra.com/en/newsroom/industry-trends/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LIMRA industry research center
            </a>{" "}
            tracks broader life insurance ownership trends. Before buying or changing a policy, confirm
            your specific state&apos;s consumer protections with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. If you want a formula structured strictly around debt, income, mortgage, and
            education, try the{" "}
            <Link href="/tools/life/dime-method-calculator" className="text-blue-600 hover:underline">
              DIME method calculator
            </Link>
            . If you only need to replace lost income and nothing else, the{" "}
            <Link href="/tools/life/income-replacement-calculator" className="text-blue-600 hover:underline">
              income-replacement calculator
            </Link>{" "}
            is a faster, narrower path. Once you have a coverage figure in mind, the{" "}
            <Link href="/tools/life/term-length-calculator" className="text-blue-600 hover:underline">
              term length calculator
            </Link>{" "}
            can help you decide how many years of term to pair it with.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for coverage, cost, and claims
            questions across every major insurance category. There&apos;s no account to create and nothing
            you type ever leaves your browser, so you can run a real scenario before ever talking to an
            agent.
          </p>
        </section>
      </div>
    </>
  );
}

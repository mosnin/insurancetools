import type { Metadata } from "next";
import Link from "next/link";
import { DimeMethodCalculatorTool } from "@/components/tools/DimeMethodCalculatorTool";
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

const tool = getToolBySlug("dime-method-calculator")!;

const TITLE = "DIME Method Life Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this DIME method life insurance calculator to add up debt, income replacement, mortgage balance, and education costs into one instant coverage estimate.";
const PAGE_URL = `${SITE_URL}/tools/life/dime-method-calculator`;

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
    question: "What does DIME stand for in life insurance?",
    answer:
      "DIME is a shorthand for four factors added together to estimate a life insurance need: Debt (non-mortgage debt such as credit cards, car loans, and student loans), Income (your income multiplied by the number of years you want it replaced), Mortgage (your remaining mortgage payoff balance), and Education (an estimate of future education costs, such as college for your children). It's a widely taught starting point for sizing a policy, not a single official standard set by any one organization.",
  },
  {
    question: "How many years of income should I replace with the DIME method?",
    answer:
      "There's no fixed rule — it depends on how long dependents would need that income supplemented, such as until the youngest child finishes school or a spouse reaches retirement age. Many people use somewhere between 10 and 20 years. This calculator lets you set the exact number of years so the income component matches your own household timeline instead of a generic default.",
  },
  {
    question: "Why does the calculator subtract my existing coverage and savings?",
    answer:
      "The DIME total (D + I + M + E) represents the full financial obligation a policy would need to cover, not the amount of new coverage to buy. If you already carry a life insurance policy or hold liquid savings earmarked for this purpose, that amount already offsets part of the total, so subtracting it produces the actual coverage gap rather than double-counting protection you already have. Forgetting this step is one of the most common mistakes people make when doing DIME math by hand.",
  },
  {
    question: "Is the DIME method the best way to calculate how much life insurance I need?",
    answer:
      "It's a reasonable, well-known starting point because it's simple and easy to explain, but it's a flat multiplier method — it doesn't adjust for inflation, investment growth on existing savings, a surviving spouse's own future earnings, or one-time costs like funeral expenses. For a more detailed, customizable estimate, the site's general-purpose life insurance needs calculator models more of those variables individually.",
  },
  {
    question: "Should I count my mortgage as debt and also as its own DIME letter?",
    answer:
      "No. In the DIME method the \"D\" for debt is meant to cover non-mortgage obligations only, since the mortgage balance already has its own dedicated \"M\" line. Including it in both places would overstate your total coverage need, which is why this calculator keeps the two inputs separate.",
  },
  {
    question: "Does this calculator save or send the numbers I enter?",
    answer:
      "No. Every calculation runs in your browser using the values you type in, and nothing is transmitted or stored anywhere. Refreshing the page resets the calculator to its starting example numbers.",
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

export default function DimeMethodCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            DIME Method Life Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Add up Debt, Income replacement, Mortgage, and Education costs into a single life
            insurance coverage estimate using the classic DIME formula. Free, instant, and nothing
            you type is stored anywhere.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <DimeMethodCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-dime-method-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Where the DIME Method Comes From</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            DIME is one of the oldest and most frequently taught shorthand formulas for estimating a
            life insurance need, built around four letters that are also four categories of financial
            obligation: Debt, Income, Mortgage, and Education. Insurance educators and agents reach for
            it because it&apos;s fast to explain and fast to calculate by hand, unlike models that ask
            for a dozen inputs before producing a number. It isn&apos;t owned or certified by a single
            regulator or standards body — it&apos;s simply a widely repeated rule of thumb, which is
            exactly why this calculator treats it as one useful method among several rather than the
            only correct answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool fits anyone who wants a quick, defensible starting number before talking to an
            agent — someone who just took out a mortgage, just had a child, or is comparing a term
            policy quote against what they actually need rather than what a sales script suggests. It&apos;s
            a good fit if your financial picture is fairly linear: a mortgage, some other debt, an
            income to replace, and a rough idea of future education costs. If your situation is more
            layered — a business you own, a blended family, staggered retirement income, or a large
            existing investment portfolio you want factored in — the DIME total is still a useful
            anchor point, but you&apos;ll get a more tailored number from the site&apos;s{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>
            , which was built specifically to handle those more customized scenarios.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Take a household with $15,000 in non-mortgage debt (a car loan and a couple of credit
            cards), $65,000 in annual income they want replaced for 10 years, a $220,000 remaining
            mortgage balance, and a $60,000 estimate for a child&apos;s future education. The DIME
            total is $15,000 (D) plus $650,000 (I, from $65,000 x 10 years) plus $220,000 (M) plus
            $60,000 (E), which comes to $945,000. If that household already carries a $50,000 policy
            through work and has no other liquid savings earmarked for this purpose, subtracting that
            $50,000 leaves an estimated additional coverage need of $895,000. Change any one input —
            say, replacing income for 15 years instead of 10 — and the total shifts by exactly
            $65,000 per extra year, which is the kind of transparent, checkable math DIME is known for.
          </p>

          <AdInArticle slot="tool-dime-method-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes With the DIME Formula</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is forgetting to subtract existing coverage and liquid
            assets from the DIME total, which overstates how much new coverage is actually needed. A
            second is double-counting the mortgage by also folding it into the debt figure, when DIME
            already gives the mortgage its own dedicated line. A third is picking an income
            replacement period without thinking it through — defaulting to a round number like 20
            years without considering when dependents would actually stop needing that support, or a
            surviving spouse would reach retirement. A fourth is treating the education estimate as
            exact when it&apos;s really a placeholder guess; revisiting it as tuition costs or family
            plans change keeps the total realistic.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the DIME method itself — a flat sum of four factors — is a
            reasonable planning shorthand, which is a common but not universal position among
            insurance educators. It does not adjust for inflation over the years of income replacement,
            investment growth on savings already set aside, a surviving spouse&apos;s own future
            earning potential, funeral and final medical expenses, or estate and tax considerations,
            all of which a more detailed needs analysis would typically include. It also has no
            knowledge of your health, age, smoking status, or an insurer&apos;s underwriting rules, all
            of which affect what a policy at this coverage amount would actually cost. Treat the result
            as a starting figure to bring into a conversation with a licensed insurance agent or
            financial professional, not as a final purchase amount.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Income replacement period</strong> — the number of years a life insurance payout
              is intended to substitute for the income the household would lose.
            </li>
            <li>
              <strong>Term life insurance</strong> — a policy that pays a death benefit only if the
              insured dies within a set term (e.g. 10, 20, or 30 years), typically the lowest-cost way
              to buy a large amount of coverage like a DIME-sized estimate.
            </li>
            <li>
              <strong>Coverage gap</strong> — the difference between the total financial obligation a
              policy should cover and the coverage or liquid assets already in place, which is what the
              &ldquo;estimated additional coverage needed&rdquo; figure on this page represents.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on income-replacement methodology beyond DIME, the{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            outlines several common approaches to sizing a policy, and the{" "}
            <a
              href="https://content.naic.org/consumer/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on how term and permanent life insurance work. Industry
            research from{" "}
            <a
              href="https://www.limra.com/en/research/research-abstracts-public/life-insurance-ownership/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LIMRA
            </a>{" "}
            and the{" "}
            <a
              href="https://www.acli.com/posting-topics/life-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              American Council of Life Insurers
            </a>{" "}
            also track how much coverage American households actually carry and where the gaps tend to
            show up. None of these organizations endorse this calculator or its results.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. For a more customized estimate that goes beyond the flat DIME multiplier, try
            the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>
            . If you want to isolate just the income-replacement piece of this math, the{" "}
            <Link href="/tools/life/income-replacement-calculator" className="text-blue-600 hover:underline">
              income replacement calculator
            </Link>{" "}
            breaks that out on its own, and the{" "}
            <Link href="/tools/life/mortgage-protection-calculator" className="text-blue-600 hover:underline">
              mortgage protection calculator
            </Link>{" "}
            focuses specifically on covering the &ldquo;M&rdquo; in DIME.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators for the specific moments where insurance math
            actually matters — buying a policy, filing a claim, or checking a deductible — so you can
            walk into that conversation already knowing your own numbers. Nothing you enter here
            leaves your browser.
          </p>
        </section>
      </div>
    </>
  );
}

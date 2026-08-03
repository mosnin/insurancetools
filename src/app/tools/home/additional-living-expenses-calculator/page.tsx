import type { Metadata } from "next";
import Link from "next/link";
import { AdditionalLivingExpensesCalculatorTool } from "@/components/tools/AdditionalLivingExpensesCalculatorTool";
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

const tool = getToolBySlug("additional-living-expenses-calculator")!;

const TITLE = "Additional Living Expenses Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this additional living expenses calculator to estimate ALE coverage from a local hotel rate, displacement length, and extra daily costs while displaced.";
const PAGE_URL = `${SITE_URL}/tools/home/additional-living-expenses-calculator`;

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
    question: "What does additional living expenses (ALE) coverage actually pay for?",
    answer:
      "ALE, also called loss of use or Coverage D, reimburses the increase in your normal cost of living while a covered loss makes your home temporarily unlivable during repairs or rebuilding. It covers things like a hotel or short-term rental, restaurant meals above what you'd normally spend on groceries, pet boarding, and storage. It does not cover your regular mortgage or rent, and it does not cover upgrades unrelated to being displaced.",
  },
  {
    question: "Why does this calculator ask me to research my own hotel rate instead of estimating one?",
    answer:
      "Temporary housing costs vary enormously by city, season, and property type, and a made-up default number would be more likely to mislead you than help you. A quick search of hotels or short-term rentals near your home for the dates you'd realistically need gives a far more accurate input than any single national average this tool could plug in for you.",
  },
  {
    question: "Where do I find my current ALE or loss of use limit?",
    answer:
      "Check your homeowners declarations page, the summary document your insurer sends when a policy is issued or renewed. Loss of use is usually listed as Coverage D, sometimes shown as a dollar amount and sometimes as a percentage of your dwelling (Coverage A) limit. If you can't locate it, your agent or insurer can read it to you over the phone.",
  },
  {
    question: "Is the 60-day displacement default based on my situation?",
    answer:
      "No. Sixty days is only a round, illustrative starting point so the calculator shows a result before you've entered anything. Actual displacement time depends on the extent of the damage, contractor availability, permitting, and material lead times, and can run anywhere from a few weeks to well over a year after a major loss. Adjust the field to whatever length is realistic for your situation.",
  },
  {
    question: "Does ALE coverage have its own separate limit from my dwelling coverage?",
    answer:
      "Yes, in most policies ALE is a distinct coverage (Coverage D) with its own dollar limit, separate from the dwelling (Coverage A) and personal property (Coverage C) limits, though some policies also cap it by time rather than, or in addition to, a dollar amount. Read your policy's loss of use section or ask your agent whether your limit is dollar-based, time-based, or both.",
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

export default function AdditionalLivingExpensesCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Additional Living Expenses Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Find out how much loss of use coverage a real displacement would actually cost, using your
            own local temporary housing rate instead of a national guess. Free, instant, and it never
            asks who you are.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <AdditionalLivingExpensesCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-ale-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs an Additional Living Expenses Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most homeowners never look closely at their loss of use limit until a fire, burst pipe, or
            storm actually forces them out of the house, and by then it&apos;s too late to change it. This
            tool is built for two different moments: reviewing a policy before renewal to check whether
            the ALE limit is realistic, and sitting in a hotel mid-claim trying to figure out how many
            more weeks the coverage will stretch. If you&apos;re shopping for a new homeowners policy, run a
            realistic displacement scenario through this calculator before you accept whatever loss of
            use limit a quote defaults to, since that default is rarely tailored to your actual local
            housing costs.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What ALE / Loss of Use Coverage Covers, and What It Doesn&apos;t
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Additional living expenses coverage pays for the difference between your normal cost of
            living and what it costs to live somewhere else while your home is uninhabitable due to a
            covered loss. That distinction matters: it reimburses the increase, not the whole bill. If a
            hotel costs $180 a night and you&apos;d normally spend nothing on lodging, the full $180 is an
            increase. If your grocery bill drops because you&apos;re eating out more, ALE typically covers
            only the difference between your restaurant spending and your usual food budget, not the full
            restaurant tab. Typical covered items include temporary housing, an increase in food costs,
            pet boarding, furniture or vehicle storage, and reasonable extra transportation to work or
            school from the temporary location. It generally does not cover your ongoing mortgage or rent
            on the damaged home, home improvements unrelated to the displacement, or costs that would
            exist whether or not you were displaced.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Calculator&apos;s Math Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator adds your entered daily temporary housing cost to your entered extra daily
            costs (dining, boarding, storage, combined into one figure) to get a single combined daily
            rate. It then multiplies that daily rate by your entered displacement length in days to
            produce the estimated total ALE need: (daily housing cost + extra daily costs) &times;
            displacement days. Nothing here is looked up or assumed on your behalf; every number in the
            formula is one you typed in, which is deliberate, since a fabricated national average hotel
            rate would very likely be wrong for your specific city and season. If you enter your current
            ALE limit, the tool compares it against the estimated need and, when the limit falls short,
            shows roughly how many days of displacement that limit would actually cover at your entered
            daily rate.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a kitchen fire forces a family out of their home. A quick search shows extended-stay
            hotels near them running about $140 a night, and they estimate an extra $25 a day in dining
            out and pet boarding above their normal spending, for a combined daily cost of $165. Their
            contractor estimates repairs at roughly 90 days once permitting and materials are accounted
            for, though they leave the calculator&apos;s default at 60 days first to see a conservative
            baseline, then re-run it at 90 to see the fuller picture. At 90 days, the estimated ALE need
            is $14,850 ($165 &times; 90). If their declarations page shows a $10,000 ALE limit, the tool
            flags a $4,850 shortfall and shows that $10,000 would only stretch to about 60 days at their
            actual daily rate, information worth raising with their agent or adjuster well before the
            limit runs out.
          </p>

          <AdInArticle slot="tool-ale-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming ALE coverage automatically scales with a rebuild, when in
            most policies it&apos;s a separate, fixed limit that can run out well before repairs finish. A
            close second is underestimating displacement length, since permitting delays, contractor
            backlogs, and material shortages routinely push repair timelines past initial estimates,
            especially after a widespread event like a regional storm when many homeowners are competing
            for the same contractors. A third is forgetting to track and save receipts during the
            displacement; most insurers require documentation of actual extra expenses to reimburse ALE,
            not just an estimate like the one this calculator produces.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes your entered daily housing cost and extra daily costs stay constant
            for the full displacement period, which real displacements rarely do exactly; costs often
            shift as a family moves from a hotel into a longer-term rental, or as boarding and storage
            needs change over time. It does not know your policy&apos;s actual ALE dollar limit, any
            separate time cap some policies apply, your insurer&apos;s specific documentation requirements,
            or how your adjuster will interpret &ldquo;actual loss sustained&rdquo; language. The 20% of dwelling
            coverage figure referenced in the tool is a commonly cited default, not a rule that applies
            to every policy or every insurer, and some policies set it lower or higher. Treat every number
            here as a planning estimate to bring into a conversation with your agent or adjuster, not as a
            guaranteed payout.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Additional living expenses (ALE) / loss of use</strong> — the homeowners policy
              coverage, often labeled Coverage D, that reimburses the increase in your normal cost of
              living while a covered loss makes your home temporarily uninhabitable.
            </li>
            <li>
              <strong>Actual loss sustained</strong> — the claims-handling principle many insurers use to
              settle ALE claims, reimbursing your documented real extra costs rather than a flat daily
              allowance, which is why saving receipts during a displacement matters.
            </li>
            <li>
              <strong>Dwelling coverage (Coverage A)</strong> — the part of a homeowners policy that pays
              to repair or rebuild the structure itself; some insurers set a policy&apos;s ALE limit as a
              percentage of this figure.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how loss of use fits into a standard homeowners policy, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            outlines the major coverage parts, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on homeowners coverage types. If you&apos;re displaced right
            now and mid-claim, the NAIC&apos;s{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              guidance on filing a claim
            </a>{" "}
            explains what documentation insurers typically expect. Renters facing the same displacement
            question under a renters policy can find the equivalent coverage explained in the{" "}
            <a
              href="https://www.iii.org/article/renters-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s renters insurance basics
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              home insurance calculators
            </Link>{" "}
            category. If you&apos;re already mid-claim rather than planning ahead, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            help estimate what a settlement should cover. Renters facing the same how-long-will-my-hotel-
            budget-last question under a renters policy should see the{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              renters insurance calculators
            </Link>
            , since renters carry their own version of loss of use coverage with different typical limits.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn dense policy language into
            numbers you can actually act on. No account, no email capture, and no data leaves your
            browser: every figure on this page comes from what you typed in, ready to bring straight into
            a conversation with your agent or adjuster.
          </p>
        </section>
      </div>
    </>
  );
}

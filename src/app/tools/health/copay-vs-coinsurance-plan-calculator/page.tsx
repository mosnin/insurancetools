import type { Metadata } from "next";
import Link from "next/link";
import { CopayVsCoinsurancePlanCalculatorTool } from "@/components/tools/CopayVsCoinsurancePlanCalculatorTool";
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

const tool = getToolBySlug("copay-vs-coinsurance-plan-calculator")!;

const TITLE = "Copay vs. Coinsurance Plan Calculator | Insurance Tools";
const DESCRIPTION =
  "Compare a copay health plan against a coinsurance plan using your own visit counts, copay amounts, deductible, and expected billed costs to see which plan wins.";
const PAGE_URL = `${SITE_URL}/tools/health/copay-vs-coinsurance-plan-calculator`;

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
    question: "Is a copay plan always cheaper than a coinsurance plan?",
    answer:
      "No, and that's the entire reason this calculator exists. A copay plan usually wins for a light, predictable year, since a handful of flat-fee visits adds up to a modest total. A coinsurance plan can still come out ahead once the deductible is met and a lower premium has been compounding all year, especially if the billed amount for care stays close to what you entered. There's no universal answer; it depends on your premiums, your copay amounts, your deductible, your coinsurance percentage, and how much care you actually expect to use.",
  },
  {
    question: "What happens if I have a much worse year than I planned for?",
    answer:
      "The comparison above only reflects the visit counts and billed amount you entered, not a worst-case scenario. A major illness, surgery, or extended hospital stay can push Plan B's billed amount far past what you assumed, and it can add more copay-triggering visits to Plan A than expected too. Neither plan's total here is capped at a real out-of-pocket maximum, which is the actual ceiling a policy would enforce. Run the same scenario through the out-of-pocket maximum calculator to see each plan's true worst-case exposure before deciding on cost alone.",
  },
  {
    question: "Does the coinsurance plan's total already include the deductible?",
    answer:
      "Yes. The calculator applies your entered billed amount to the deductible first, in full, and only then applies your coinsurance percentage to whatever billed amount remains. That combined deductible-plus-coinsurance figure is what gets added to twelve months of premium to produce Plan B's annual total, so you don't need to add the deductible in separately.",
  },
  {
    question: "Should prescription costs count toward the copay plan's total?",
    answer:
      "Yes, if your plan actually charges a flat copay per prescription fill, which is common under copay-structured plans. Enter your expected number of fills for the year and the copay per fill, and the calculator adds that to your visit copays. If your plan instead runs prescriptions through the deductible and coinsurance, fold that expected drug cost into Plan B's billed amount instead so it isn't double-counted or left out entirely.",
  },
  {
    question: "What if my plan's coinsurance percentage is described as 80/20 instead of a single number?",
    answer:
      "An \"80/20\" plan means the insurer pays 80% after the deductible and you pay the remaining 20%. Enter your share, the smaller number, into the coinsurance field here. If your plan is described the other way, as the insurer's percentage, subtract it from 100 to get your coinsurance share before entering it.",
  },
  {
    question: "Can I use this to compare more than two plans?",
    answer:
      "Run it once per pair of plans you're actually choosing between. If you're weighing three or more options, compare them two at a time, or note down each plan's annual total from a separate run and rank them afterward. The calculator is intentionally built around one clear head-to-head comparison rather than a multi-plan table, so each result stays easy to read and easy to trust.",
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

export default function CopayVsCoinsurancePlanCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Copay vs. Coinsurance Plan Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Two health plans rarely cost the same once you look past the premium. Enter your own visit
            counts and copay amounts for one plan, and a deductible, coinsurance percentage, and expected
            billed cost for the other, and see which structure actually wins for the year you describe.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <CopayVsCoinsurancePlanCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-copay-vs-coinsurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Copay vs. Coinsurance Plan Calculator Compares
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most plan comparisons stop at the premium, which only tells part of the story. This calculator
            compares two full plan structures for the exact same year of care: a copay plan, where you pay
            a flat, fixed dollar amount every time you use a specific type of care, and a coinsurance plan,
            where you pay a percentage of the bill after a deductible is met. Rather than asking which
            structure is theoretically better, it asks which one is cheaper for the visits, fills, and
            billed amount you actually expect to use, because that answer changes from person to person and
            from year to year.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Comparison</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for open enrollment, when two plan options sit side by side and the only
            numbers on the comparison sheet are the premium, the deductible, and a coinsurance percentage,
            with no obvious answer about which one to pick. It&apos;s also useful mid-year if you&apos;re weighing
            whether to switch plans at your next opportunity, or if you&apos;re self-employed and comparing
            marketplace plans that use different cost-sharing structures entirely. If you can estimate,
            even roughly, how many times you&apos;ll see a doctor and what you&apos;d expect a specialist visit or a
            round of prescriptions to cost, this calculator turns that estimate into a real dollar
            comparison instead of a guess.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How Each Plan&apos;s Annual Cost Is Built
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Plan A&apos;s total is a straight sum. The calculator multiplies your entered primary care visits,
            specialist visits, ER visits, and prescription fills each by their own copay amount, adds those
            four totals together, and then adds twelve months of premium on top. There&apos;s no deductible or
            percentage math involved; every dollar in a copay plan is fixed and known in advance, which is
            exactly what makes it simple to add up and simple to predict.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Plan B runs through the standard deductible-then-coinsurance waterfall. The calculator takes
            your expected total billed amount for the same care and applies it to your deductible first, in
            full, up to the deductible amount. Whatever billed amount remains after that gets multiplied by
            your coinsurance percentage, since that&apos;s your share once the deductible is satisfied. Those two
            pieces, the deductible portion and the coinsurance portion, are added together and then combined
            with twelve months of Plan B&apos;s premium to produce its annual total. Both totals are built the
            same way structurally, premium plus cost-sharing, which is what makes them directly comparable
            side by side.
          </p>

          <AdInArticle slot="tool-copay-vs-coinsurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a plan shopper is comparing two options for the year ahead. Plan A charges $380 a month and
            they expect three primary care visits at a $30 copay, two specialist visits at a $50 copay, no
            ER visits, and six prescription fills at a $20 copay. That&apos;s $4,560 in premium plus $90 plus
            $100 plus $120 in copays, for a Plan A total of $4,870. Plan B charges a lower $280 a month, with
            a $2,000 deductible and 20% coinsurance, and they expect the same care to be billed at $2,600
            total. The first $2,000 of that goes entirely to the deductible, and the remaining $600 is split
            20% to them, or $120. Plan B&apos;s total works out to $3,360 in premium plus $2,120 in cost-sharing,
            for $5,480. In this specific, hypothetical scenario, Plan A comes out about $610 cheaper for the
            year, purely because of how lightly this shopper expects to use care. A heavier year of visits
            or a smaller expected bill on Plan B could flip that result entirely, which is exactly why the
            numbers need to come from your own situation rather than someone else&apos;s example.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Mistake That Skews Every Plan Comparison
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is comparing plans using only an average, expected year and stopping
            there. A copay plan&apos;s cost is genuinely capped by how many times you show up for care, but a
            coinsurance plan&apos;s cost is only capped by a policy&apos;s out-of-pocket maximum, a number this
            calculator does not model. If the billed amount for care in a bad year runs far higher than what
            you entered, Plan B&apos;s coinsurance share keeps growing right along with it, until the
            plan&apos;s actual out-of-pocket maximum finally caps it. Comparing an average year alone can point
            you toward the plan that&apos;s cheaper most years while quietly carrying more financial risk in a
            severe one. Run your numbers here for a typical year, then check both plans&apos; worst-case ceiling
            with the out-of-pocket maximum calculator before treating this result as the whole picture.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes every visit, fill, and billed dollar amount you enter is accurate for
            your plan and your expected usage; it has no data of its own about typical visit counts or
            typical costs, and it never invents one on your behalf. It assumes Plan A&apos;s costs are pure
            copays with no separate deductible layered underneath, which is common but not universal, so
            check your plan&apos;s summary of benefits if you&apos;re unsure. It does not model an out-of-pocket
            maximum, network status, prior authorization requirements, or the possibility that a specific
            provider is out of network, all of which can change your actual cost. Treat this as a planning
            comparison to bring into open enrollment, not a guarantee of what either plan will cost you.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Copay, Coinsurance, and Cost-Sharing, Defined
          </h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Copay (copayment)</strong> — a fixed dollar amount you pay for a covered service, such
              as $30 for a primary care visit, regardless of what the provider actually billed.
            </li>
            <li>
              <strong>Coinsurance</strong> — your share of a covered service&apos;s cost after your deductible is
              met, expressed as a percentage, such as 20%, with the plan covering the rest.
            </li>
            <li>
              <strong>Cost-sharing</strong> — the general term for the portion of care costs you pay
              yourself, which includes deductibles, copays, and coinsurance together.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the government&apos;s own definitions of these terms, see{" "}
            <a
              href="https://www.healthcare.gov/glossary/co-payment/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov&apos;s glossary entry on copayments
            </a>{" "}
            and its{" "}
            <a
              href="https://www.healthcare.gov/glossary/co-insurance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              entry on coinsurance
            </a>
            . The broader{" "}
            <a
              href="https://www.healthcare.gov/glossary/cost-sharing/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              cost-sharing glossary entry
            </a>{" "}
            explains how these pieces fit together, and the{" "}
            <a
              href="https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              out-of-pocket maximum entry
            </a>{" "}
            covers the real ceiling this calculator does not model on its own.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              health insurance calculators
            </Link>{" "}
            category. If you&apos;d rather see one plan&apos;s cost across a full range of medical spending instead
            of a single scenario, the{" "}
            <Link href="/tools/health/coinsurance-calculator" className="text-blue-600 hover:underline">
              coinsurance calculator
            </Link>{" "}
            breaks that down in more detail. Before enrolling based on this comparison, check each plan&apos;s
            worst-case exposure with the{" "}
            <Link href="/tools/health/out-of-pocket-maximum-calculator" className="text-blue-600 hover:underline">
              out-of-pocket maximum calculator
            </Link>
            , since a severe year is exactly where a copay-versus-coinsurance comparison alone can mislead
            you.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific decisions insurance
            actually forces you to make, like choosing between two differently structured health plans.
            Nothing you enter is stored or sent anywhere, and every result is meant to be a starting point
            for open enrollment, not a substitute for reading your plan&apos;s actual summary of benefits.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MedicalBillResponsibilityCalculatorTool } from "@/components/tools/MedicalBillResponsibilityCalculatorTool";
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

const tool = getToolBySlug("medical-bill-responsibility-calculator")!;

const TITLE = "Medical Bill Responsibility Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this medical bill responsibility calculator to see what you owe step by step, factoring in deductible and out-of-pocket max you've already met this year.";
const PAGE_URL = `${SITE_URL}/tools/health/medical-bill-responsibility-calculator`;

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
    question: "Why does this calculator ask what I've already paid toward my deductible and out-of-pocket max?",
    answer:
      "Because a single bill almost never lands on a plan year that hasn't started yet. If you've already paid $500 toward a $2,000 deductible from an earlier visit this year, only the remaining $1,500 is left to satisfy before coinsurance kicks in on a new bill. Tools that only ask for the deductible total and ignore what you've already met will overstate what you owe on every bill after your first one of the year.",
  },
  {
    question: "What does this calculator mean by the allowed amount on my bill?",
    answer:
      "The allowed amount is the price your insurer and an in-network provider have already agreed on for a service, which is usually lower than the provider's list price (sometimes called the billed charge). Your explanation of benefits (EOB) shows this figure, and it's the number this calculator expects you to enter, since deductible and coinsurance math is based on the allowed amount, not the sticker price on the original bill.",
  },
  {
    question: "What happens if this bill pushes me past my out-of-pocket max?",
    answer:
      "The calculator caps your responsibility at whatever is left of your out-of-pocket max before this bill, and shows you the portion above that line, which your plan should cover instead. It also shows your new total met for the year so you can see how close you are to fully covered status for any remaining care in this plan year. Confirm the exact cutover with your insurer, since some plans track deductible and out-of-pocket max separately for in-network versus out-of-network care.",
  },
  {
    question: "Does this calculator account for out-of-network billing or balance billing?",
    answer:
      "No, and that's a real limitation worth understanding before you rely on the result. This tool assumes the bill is in-network at the allowed amount your insurer already negotiated. Out-of-network providers can sometimes bill you for the difference between their charge and what your insurer paid, a practice called balance billing, which this calculator does not model. Federal surprise billing protections limit this in many emergency and certain in-network facility situations, but not every scenario is covered, so check your EOB and your state's rules if a bill looks out of network.",
  },
  {
    question: "How is this different from a simple coinsurance calculator?",
    answer:
      "A basic coinsurance calculator usually assumes your deductible is either fully met or not met at all, and it stops at the coinsurance math. This tool is built for the more common real-world case: you're partway through your plan year, you've already paid something toward both your deductible and your out-of-pocket max, and you want to see the full waterfall for one specific new bill, from remaining deductible through coinsurance to the out-of-pocket max cap, with every step shown separately.",
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

export default function MedicalBillResponsibilityCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Medical Bill Responsibility Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Take one real medical bill and see, step by step, exactly how much of it lands on your
            deductible, how much falls under coinsurance, and how much your insurer should pay, based on
            what you&apos;ve already met this plan year.
          </p>
          <LastUpdated category="health" />
        </div>

        <div className="mt-2">
          <MedicalBillResponsibilityCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-medical-bill-responsibility-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Medical Bill Responsibility Calculator Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A medical bill responsibility calculator that only knows your deductible and coinsurance rate
            can only tell you what a bill would cost on day one of your plan year, before you&apos;ve paid
            anything toward either number. That&apos;s rarely the situation you&apos;re actually in. By the time a
            new bill from a specialist visit, an ER trip, or a follow-up procedure shows up, you&apos;ve
            usually already put some money toward your deductible and your out-of-pocket max from earlier
            care this year. This tool takes that mid-year reality as its starting point. You enter your
            annual deductible and coinsurance rate alongside how much of the deductible and the
            out-of-pocket max you&apos;ve already met, plus the new bill&apos;s allowed amount, and it walks the
            bill through every stage of the waterfall separately: what&apos;s left of your deductible, how
            much of the bill fills that gap, what remainder is subject to coinsurance, your coinsurance
            share, and finally whether the out-of-pocket max caps what you actually owe.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for someone holding an actual bill or explanation of benefits (EOB) in hand,
            not someone shopping for a plan. If you&apos;ve received a statement from a provider or a
            &ldquo;this is not a bill&rdquo; EOB from your insurer and you want to know whether the amount they say
            you owe lines up with your plan&apos;s deductible, coinsurance, and out-of-pocket max, this
            calculator reconstructs that math in front of you. It&apos;s also useful before a scheduled
            procedure, once you have a cost estimate from your provider, so you can see roughly what
            you&apos;d owe given where you already stand on your deductible and out-of-pocket max this year,
            rather than assuming the full coinsurance rate applies to the whole bill.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Mid-Year Waterfall Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculation runs in a fixed order because that&apos;s the order insurers apply it. First, your
            remaining deductible is whatever&apos;s left of your annual deductible after subtracting what
            you&apos;ve already met this year. Second, your new bill fills that remaining deductible first,
            dollar for dollar, up to either the bill amount or the remaining deductible, whichever is
            smaller. Third, whatever&apos;s left of the bill after the deductible portion becomes subject to
            your coinsurance rate. Fourth, your coinsurance share is that remainder multiplied by your
            coinsurance percentage, with the insurer covering the rest of that portion. Fifth, the
            calculator adds the deductible portion and the coinsurance portion together to get your total
            new responsibility for this bill, then checks that total against what&apos;s left of your annual
            out-of-pocket max after what you&apos;ve already paid this year. If the bill would push your total
            past that remaining out-of-pocket max, the calculator caps what you owe at that ceiling and
            shows you the difference the insurer should absorb instead.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a plan has a $2,000 annual deductible, with $500 already met from an earlier visit, a 20%
            coinsurance rate, and a $6,000 out-of-pocket max with $1,200 already met. A new bill for $3,500
            arrives. The remaining deductible is $1,500 ($2,000 minus $500), so the first $1,500 of the
            bill fills that deductible. The remaining $2,000 of the bill ($3,500 minus $1,500) is subject
            to the 20% coinsurance rate, producing a $400 coinsurance share. Total new responsibility
            before any out-of-pocket max check is $1,900 ($1,500 plus $400). The remaining out-of-pocket
            max before this bill is $4,800 ($6,000 minus $1,200), which is well above the $1,900 owed, so
            no cap applies here and the full $1,900 stands. The insurer&apos;s share of this bill is $1,600
            ($3,500 minus $1,900). Change the numbers already met this year and every downstream figure
            shifts with them, which is exactly the point of walking the waterfall step by step instead of
            applying a flat coinsurance percentage to the whole bill.
          </p>

          <AdInArticle slot="tool-medical-bill-responsibility-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is applying the coinsurance rate to the entire bill amount,
            ignoring that a portion of it should first go toward any remaining deductible, which usually
            has no coinsurance discount at all. A close second is forgetting what&apos;s already been paid
            toward the deductible and out-of-pocket max earlier in the year, which makes an estimate look
            far higher than what a plan will actually charge on a bill arriving in, say, October rather
            than January. A third is confusing the provider&apos;s billed charge with the allowed amount your
            insurer has already negotiated. Deductible and coinsurance math runs on the allowed amount from
            your EOB, not the larger number sometimes printed at the top of a provider statement.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the bill you enter is for in-network care at the allowed amount your
            insurer has already negotiated with the provider, and that your plan applies a single combined
            deductible and out-of-pocket max rather than separate in-network and out-of-network tracks. It
            does not model out-of-network billing or balance billing, where a provider bills you directly
            for the gap between their charge and what your insurer paid; federal protections limit balance
            billing in many emergency and certain facility-based situations, but not universally, so a bill
            that looks out of network deserves a direct call to your insurer rather than this tool. It also
            does not know about copays that apply separately from coinsurance on some plans, prior
            authorization denials, or bills still pending insurer adjudication. Every number you enter
            should come from your own plan summary and EOB, never from an assumption about what&apos;s typical,
            since deductibles, coinsurance rates, and out-of-pocket maximums vary widely between plans.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Explanation of benefits (EOB)</strong> — a statement your insurer sends after
              processing a claim, showing the billed charge, the allowed amount, what the plan paid, and
              what you&apos;re responsible for. It is not a bill itself.
            </li>
            <li>
              <strong>Allowed amount</strong> — the negotiated price an in-network provider and your
              insurer agreed to for a service, which deductible and coinsurance calculations are based on.
            </li>
            <li>
              <strong>Balance billing</strong> — when an out-of-network provider bills you for the
              difference between their charge and what your insurer paid, a scenario this calculator does
              not model.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For plan terminology beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.healthcare.gov/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              HealthCare.gov glossary
            </a>{" "}
            defines deductible, coinsurance, and out-of-pocket maximum in plain language, and{" "}
            <a
              href="https://www.cms.gov/marketplace/resources/glossary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              CMS.gov&apos;s marketplace glossary
            </a>{" "}
            covers how these figures interact under ACA-compliant plans. If a bill or collection notice
            feels wrong or a debt collector is involved, the{" "}
            <a
              href="https://www.consumerfinance.gov/consumer-tools/debt-collection/medical-debt/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Consumer Financial Protection Bureau&apos;s medical debt resources
            </a>{" "}
            explain your rights, including how to dispute an error. This tool doesn&apos;t replace a direct
            call to your insurer&apos;s member services line, which can confirm the exact figures on your
            specific bill.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/health" className="text-blue-600 hover:underline">
              health insurance calculators
            </Link>{" "}
            category. If you&apos;re comparing coinsurance on a single simple charge rather than walking a
            full mid-year waterfall, the{" "}
            <Link href="/tools/health/coinsurance-calculator" className="text-blue-600 hover:underline">
              coinsurance calculator
            </Link>{" "}
            is the more direct fit. To plan ahead for the rest of your plan year rather than react to one
            bill, the{" "}
            <Link href="/tools/health/out-of-pocket-maximum-calculator" className="text-blue-600 hover:underline">
              out-of-pocket maximum calculator
            </Link>{" "}
            projects how much more you could owe across the remaining months.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the exact moments insurance gets
            complicated, like holding a real bill and trying to reverse-engineer whether the amount
            charged actually matches your plan. Every tool runs entirely in your browser, keeps the
            numbers you type in private to your session, and is designed to leave you with a clearer
            question to ask your insurer or provider, not a final answer in place of one.
          </p>
        </section>
      </div>
    </>
  );
}

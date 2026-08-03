import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { LostWagesClaimCalculatorTool } from "@/components/tools/LostWagesClaimCalculatorTool";
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

const tool: Tool = {
  slug: "lost-wages-claim-calculator",
  name: "Lost Wages Claim Calculator",
  description:
    "Estimate the gross and net lost wages to document for an accident or injury claim, for hourly, salaried, and self-employed workers, with a partial-income offset for PTO or disability pay already received.",
  category: "Claims",
  categorySlug: "claims",
  keywords: [
    "lost wages claim calculator",
    "how to calculate lost wages for insurance claim",
    "lost income claim calculator",
    "lost wages after accident calculator",
    "missed work insurance claim",
    "wage loss claim calculator",
  ],
  relatedTools: ["insurance-claim-payout-calculator", "settlement-negotiation-target-calculator"],
};

const TITLE = "Lost Wages Claim Calculator: Wage Loss & PTO Offset Guide";
const DESCRIPTION =
  "Use this lost wages claim calculator to estimate gross and net income lost from missed work after an accident, with hourly, salary, and PTO offset math.";
const PAGE_URL = `${SITE_URL}/tools/claims/lost-wages-claim-calculator`;

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
    question: "Does this lost wages claim calculator account for taxes?",
    answer:
      "No. It works with gross figures, meaning pay before taxes and withholdings, because that's what a pay stub or salary figure shows and what most claim documentation starts from. Whether a lost wages settlement is itself taxable depends on the type of claim and your situation, so treat the gross number here as a documentation starting point and ask a tax professional how any eventual payment should be reported.",
  },
  {
    question: "How do I calculate lost wages if I'm paid a salary instead of hourly?",
    answer:
      "Switch the calculator to salary mode and enter your annual salary along with the number of days you typically work in a year, not 365, since that should exclude your usual weekends, holidays, and vacation. Dividing salary by typical work days produces a daily wage that's then multiplied by the days you actually missed, which is a more accurate baseline than dividing by 365 and understating what a missed workday actually cost you.",
  },
  {
    question: "What if I used paid time off or received partial disability pay while I recovered?",
    answer:
      "Enter that amount in the partial income field and the calculator nets it against your gross lost wages automatically, since a claim generally shouldn't ask for income you already received on top of income you're claiming as lost. If the partial income you enter is larger than your gross lost wages, the calculator floors the net figure at $0 and flags it, since that usually means the entered amount covers more days than you actually missed.",
  },
  {
    question: "How is documenting lost income different for self-employed workers?",
    answer:
      "Self-employed and 1099 claimants generally don't have a pay stub or an employer to confirm a daily wage, so lost income is typically documented through tax returns, profit-and-loss statements, and other business financial records instead. This calculator can still produce a rough estimate using an equivalent daily rate you supply, but the actual paperwork path is genuinely different, and the specific records a given claim will accept aren't something a browser tool can look up for you.",
  },
  {
    question: "Does the calculator include missed overtime, tips, bonuses, or commission?",
    answer:
      "Not automatically. It multiplies a base daily wage by days missed, so overtime, tips, bonuses, and commission you would have earned during that period aren't captured unless you fold an estimate of them into the hourly wage or salary figure yourself. If those forms of pay are a meaningful part of your income, adjust your inputs upward and keep separate documentation, such as past pay stubs showing the pattern, to support the adjustment.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Claims Tools", href: "/tools/claims" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function LostWagesClaimCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Lost Wages Claim Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Turn missed workdays into a documented dollar figure, whether you&apos;re paid hourly, on
            salary, or run your own business. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <LostWagesClaimCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-lost-wages-claim-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What a Lost Wages Claim Actually Covers</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A lost wages claim, sometimes called a loss of income claim, is the part of an accident or
            injury claim that reimburses income you didn&apos;t earn because your recovery kept you out of
            work. It sits alongside medical expense claims and property damage claims as its own line
            item, and it needs its own math and its own paperwork, since a treating doctor&apos;s note
            establishes that you couldn&apos;t work while your pay records establish what that time away
            actually cost you. This lost wages claim calculator handles the second half of that: turning a
            wage or salary and a number of missed days into a gross figure, then netting out any partial
            income you already received so the number you bring to an adjuster or attorney reflects what
            you&apos;re actually still owed.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is built for anyone piecing together a lost wages after accident calculation before
            submitting a claim, whether the underlying incident is a car accident, a slip and fall, a
            workplace injury being routed through a liability claim, or any other situation where missed
            work is part of the damages. It works whether you&apos;re paid by the hour, on a fixed salary, or
            you run your own business and don&apos;t have a traditional pay stub at all. If you&apos;ve already
            returned to work part-time, used PTO to stay afloat financially, or received a partial
            disability payment during recovery, this tool is also built to net that against your total
            rather than leaving you to do that subtraction by hand.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How to Calculate Lost Wages: Hourly, Salaried, and Self-Employed
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            For an hourly worker, the math is direct: multiply your hourly rate by the hours in a typical
            workday to get a daily wage, then multiply that daily wage by the number of days you actually
            missed. For a salaried worker, there&apos;s an extra step, because a salary is an annual figure and
            a claim needs a daily one. Dividing by 365 overstates how many days you actually work and
            understates your true daily wage, so this calculator instead asks for the number of days you
            typically work in a year, excluding weekends, holidays, and vacation, and divides your salary by
            that number instead.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Self-employed workers and 1099 contractors face a genuinely different documentation process,
            not just a different formula. Without an employer or a regular pay stub, income is typically
            established through tax returns and profit-and-loss statements rather than a simple hourly rate
            or salary figure. This calculator can still model a rough estimate if you supply an equivalent
            daily rate based on your own business records, but the specific records any particular claim
            will ultimately accept are something to confirm with whoever is evaluating the claim, not
            something a calculator can determine in advance.
          </p>

          <AdInArticle slot="tool-lost-wages-claim-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a salaried claimant earning $55,000 a year who typically works 260 days a year after
            accounting for weekends and standard holidays. That works out to a daily wage of about $211.54.
            After a car accident, they miss 10 workdays while recovering, for a gross lost wages figure of
            about $2,115. During that time, they used 3 days of paid time off, worth roughly $635 at the
            same daily rate, which they enter as partial income received. Netting that against the gross
            figure leaves about $1,481 in lost wages still to document and claim, rather than the full gross
            amount, which would have double-counted the PTO days they were already paid for.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is forgetting to net out PTO used or partial disability pay received
            during recovery, which can lead to claiming the full gross figure when part of it was already
            covered. A close second is dividing an annual salary by 365 instead of actual typical work days,
            which understates the real daily wage and, in turn, understates the total claim. For
            self-employed claimants, the most common mistake is treating the process the same as an hourly
            or salaried employee&apos;s and showing up with an estimate instead of the tax returns or
            profit-and-loss documentation that self-employment income loss typically requires.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a straightforward daily-wage-times-days-missed model and does not
            account for overtime, tips, bonuses, commission, scheduled raises, or seasonal income swings
            unless you fold an estimate of them into the wage or salary figure yourself. It does not know
            your state&apos;s specific claim rules, your insurer&apos;s documentation requirements, or whether a
            given loss of income claim is being handled through a first-party policy, a third-party
            liability claim, or a workers&apos; compensation process, all of which can affect what&apos;s payable
            and how it needs to be proven. Treat every figure here as a planning number to refine with your
            own pay records and, where the claim is disputed or complex, a licensed claims professional or
            attorney.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Lost wages claim (loss of income claim)</strong> — the portion of an accident or
              injury claim that reimburses income you didn&apos;t earn because your recovery kept you out of
              work, separate from medical expenses or property damage.
            </li>
            <li>
              <strong>Wage documentation</strong> — the records used to prove what you actually earn, such
              as recent pay stubs and an employer letter for hourly or salaried workers, or tax returns and
              profit-and-loss statements for self-employed claimants.
            </li>
            <li>
              <strong>PTO offset</strong> — subtracting the value of paid time off or partial disability pay
              already received during recovery from the gross lost wages figure, so a claim isn&apos;t
              requesting income that was already paid out.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how a claim moves from report to payout, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on the claims-filing process, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains what a standard auto policy does and doesn&apos;t pay for, including how coverage for
            lost income can vary by policy. The{" "}
            <a
              href="https://www.dol.gov/general/topic/wages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of Labor
            </a>{" "}
            publishes general guidance on how wages are defined and recorded, and self-employed claimants
            documenting business income loss can start with the{" "}
            <a
              href="https://www.irs.gov/forms-pubs/about-schedule-c-form-1040"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              IRS&apos;s Schedule C instructions
            </a>{" "}
            for the profit-and-loss format most tax returns already use.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              Claims calculators
            </Link>{" "}
            category. Once you&apos;ve documented your lost wages, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            helps you estimate the total claim picture, and the{" "}
            <Link href="/tools/claims/settlement-negotiation-target-calculator" className="text-blue-600 hover:underline">
              settlement negotiation target calculator
            </Link>{" "}
            can help you set a realistic target once you&apos;re ready to negotiate a settlement figure.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn confusing claim and coverage
            math into a clear number you can act on. Every tool runs entirely on your device, keeps what
            you type to yourself, and is designed to leave you better prepared before you talk to an
            adjuster, agent, or attorney.
          </p>
        </section>
      </div>
    </>
  );
}

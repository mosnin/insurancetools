import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { TotalLossPayoutCalculatorTool } from "@/components/tools/TotalLossPayoutCalculatorTool";
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
  slug: "total-loss-payout-calculator",
  name: "Total Loss Payout Calculator",
  description:
    "Estimate what a totaled car settlement may actually pay out, including the actual cash value, a common sales tax add-back, title fees, and your deductible.",
  category: "Auto",
  categorySlug: "auto",
  keywords: [
    "total loss payout calculator",
    "car total loss settlement calculator",
    "totaled car insurance payout",
    "what does insurance pay for a totaled car",
    "total loss calculator car insurance",
    "actual cash value calculator",
    "total loss settlement estimate",
  ],
  relatedTools: [],
};

const TITLE = "Total Loss Payout Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this total loss payout calculator to estimate what a totaled car settlement pays, from actual cash value and tax add-back to fees and your deductible.";
const PAGE_URL = `${SITE_URL}/tools/auto/total-loss-payout-calculator`;

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
    question: "Will this total loss payout calculator match my insurer's exact check?",
    answer:
      "Not exactly, and it isn't meant to. It reproduces the common structure of a total loss settlement, actual cash value plus a possible sales tax add-back and small fees, minus your deductible, using numbers you enter. Your insurer's actual cash value comes from a market valuation report built from comparable local vehicle sales, which this tool has no access to. Use this to sanity-check the shape of a settlement offer, then compare it line by line against your insurer's written explanation.",
  },
  {
    question: "Why would an insurer add sales tax back into a total loss payout?",
    answer:
      "The logic is that a total loss forces you to go buy a replacement vehicle, and most states charge sales tax on that purchase, so some insurers include an amount for tax you'll owe again. This is not a universal rule. It depends on your state's regulations and your insurer's own claims practices, and some insurers only add it back if you actually buy a replacement vehicle rather than take the cash. Ask your adjuster directly whether a tax add-back applies to your claim before assuming either way.",
  },
  {
    question: "What if I think my insurer's actual cash value is too low?",
    answer:
      "You're allowed to challenge it. Pull your own comparables, three to five vehicles of the same year, make, model, mileage, and condition currently for sale near you, and bring them to your adjuster along with any documentation of upgrades, recent maintenance, or low mileage that a generic valuation report might have missed. Many states also let you request a formal appraisal clause or file a complaint with your state insurance department if the disagreement doesn't resolve informally.",
  },
  {
    question: "Is the deductible always subtracted from a total loss payout?",
    answer:
      "Only when the claim runs through your own collision or comprehensive coverage. If another driver was at fault and you're recovering through their liability insurer instead, your deductible typically doesn't apply, since you're not filing under your own policy's collision coverage. Uncheck or zero out the deductible field here if that's your situation.",
  },
  {
    question: "What happens to the payout if I still owe money on the car?",
    answer:
      "If there's a loan or lease on the vehicle, the insurer pays the lienholder first, up to the payout amount, and any remainder comes to you. If you owe more than the vehicle's actual cash value plus tax and fee add-backs, that gap is exactly what gap insurance is designed to cover; without it, you'd still owe the difference to your lender out of pocket even after the claim settles.",
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

export default function TotalLossPayoutCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Total Loss Payout Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            A totaled car settlement is rarely just the sticker number an adjuster quotes over the phone. Enter
            the actual cash value, a possible sales tax add-back, fees, and your deductible to see the full
            breakdown behind an estimated payout.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <TotalLossPayoutCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-total-loss-payout-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">When You&apos;d Reach for This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A car gets declared a total loss when the cost to repair it, or sometimes just the age and mileage
            combined with damage severity, crosses a threshold your insurer sets relative to its value, and the
            insurer decides to pay you out instead of fixing it. The letter or phone call that follows usually
            names a single dollar figure without much explanation of how it was built. This calculator exists for
            the gap between getting that number and actually understanding it: it breaks a total loss payout into
            the pieces insurers commonly use, actual cash value, a possible tax add-back, small fee add-backs, and
            your deductible, so you can check an offer against the math instead of taking a single figure on
            faith. It&apos;s built for anyone who just received, or expects to soon receive, a total loss
            settlement offer on a personal vehicle.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Payout Estimate Is Built</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculation starts with the actual cash value (ACV), the figure your insurer determines your
            vehicle was worth immediately before the loss, based on comparable local sales rather than what you
            paid or what you still owe. From there, the tool optionally adds back sales tax, calculated as your
            entered ACV multiplied by your local tax rate, because in many states and with many insurers, a total
            loss forces you to buy a replacement vehicle and pay sales tax on it all over again. This add-back is
            not universal, so the checkbox defaults to on but is meant to be verified against your own policy and
            state, not assumed. A small dollar amount for title, transfer, and registration fees is added next,
            covering the paperwork costs of titling a replacement vehicle. Finally, your collision or
            comprehensive deductible is subtracted, since that&apos;s the portion of the loss your policy makes
            you absorb whenever a claim runs through your own coverage rather than another driver&apos;s liability
            policy.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The formula in full: estimated payout equals actual cash value, plus the tax add-back if included,
            plus fees, minus your deductible, with the result floored at zero so the tool never shows a negative
            payout. If your deductible is larger than the gross payout before it&apos;s applied, an inline warning
            says so directly rather than quietly displaying a confusing number.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say an adjuster values a five-year-old sedan at $15,000 after a collision that would cost more to
            repair than the car is worth. The owner&apos;s state charges 7% combined sales tax, their insurer
            includes a tax add-back on total losses, title and transfer fees come to about $150, and their
            collision deductible is $500. The math runs: $15,000 actual cash value, plus $1,050 in sales tax add
            back (7% of $15,000), plus $150 in fees, for a gross payout of $16,200, minus the $500 deductible, for
            an estimated payout of $15,700. If that same owner still owed $17,000 on their auto loan, they&apos;d
            be left with a roughly $1,300 gap between the payout and the payoff, exactly the shortfall gap
            insurance is designed to close.
          </p>

          <AdInArticle slot="tool-total-loss-payout-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is accepting the first number an adjuster offers without pulling your
            own comparable vehicle listings first. Insurers use market valuation reports that pull from nearby
            dealer and private-party listings, and those reports occasionally miss upgrades, recent maintenance,
            or unusually low mileage that would justify a higher value. A second mistake is assuming the sales
            tax add-back automatically applies everywhere; some insurers only add it back if you show proof
            you&apos;re buying a replacement vehicle, and a few states handle it differently altogether, so it&apos;s
            worth asking rather than assuming either way. A third mistake is forgetting the lienholder sits ahead
            of you in line: if you have an active loan or lease, the payout goes to your lender first, and only
            what&apos;s left after payoff comes to you directly.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool assumes a straightforward total loss payout structure of actual cash value plus optional tax
            and fee add-backs minus your deductible. It does not calculate actual cash value itself, does not know
            your state&apos;s specific rules on sales tax add-backs, and does not account for diminished value
            claims, rental reimbursement, or other supplemental coverages that can apply separately from the base
            total loss payout. It also can&apos;t verify how your specific insurer built its own valuation report.
            Treat every number here as a planning estimate to compare against your actual settlement paperwork, not
            a guaranteed figure, and bring any real discrepancy to your claims adjuster or, if it doesn&apos;t
            resolve, your state insurance department.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Actual cash value (ACV)</strong> — what your vehicle was worth immediately before the loss,
              based on comparable local sales, factoring in age, mileage, and condition rather than what you paid
              or still owe.
            </li>
            <li>
              <strong>Total loss threshold</strong> — the point, set by your insurer and often influenced by state
              rules, at which repair costs relative to value are high enough that the insurer pays out the vehicle
              instead of repairing it.
            </li>
            <li>
              <strong>Sales tax add-back</strong> — an amount some insurers include in a total loss settlement to
              account for the sales tax you&apos;ll owe again when you purchase a replacement vehicle.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how total loss claims are generally handled, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on filing and settling auto claims, and its{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              auto insurance consumer page
            </a>{" "}
            covers how coverage types like collision and comprehensive interact with a total loss. The{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains what a standard personal auto policy actually pays for. Since sales tax add-back rules and
            total loss thresholds vary by location, confirm the specifics with your{" "}
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
            This calculator belongs to the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you&apos;re weighing whether to raise or lower your deductible before your next renewal,
            the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            can help size your overall liability and collision coverage. For a wider set of settlement and payout
            tools beyond total loss, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            cover related scenarios, and the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            help you plan ahead of the next policy you buy.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the moments insurance actually gets used,
            not just quoted. Every tool on this site runs entirely in your browser, requires no account, and is
            designed to help you walk into a claims conversation already understanding the numbers being
            discussed.
          </p>
        </section>
      </div>
    </>
  );
}

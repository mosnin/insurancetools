import type { Metadata } from "next";
import Link from "next/link";
import { ClaimUnderpaymentCalculatorTool } from "@/components/tools/ClaimUnderpaymentCalculatorTool";
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

const tool = getToolBySlug("claim-underpayment-calculator")!;

const TITLE = "Insurance Claim Underpayment Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this insurance claim underpayment calculator to compare an insurer's settlement offer against your own independent estimate and see the exact dollar and percentage gap.";
const PAGE_URL = `${SITE_URL}/tools/claims/claim-underpayment-calculator`;

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
    question: "Does a gap between the offer and my estimate mean my insurance claim was underpaid?",
    answer:
      "Not by itself. A gap only tells you that two numbers disagree, not why they disagree. Insurers sometimes use different depreciation schedules, different contractor pricing, or apply policy exclusions you may have overlooked, and any of those can produce a legitimate gap. Treat a meaningful gap as a reason to ask questions, not as proof the insurer acted in bad faith.",
  },
  {
    question: "How do I get an independent estimate to compare against the insurer's offer?",
    answer:
      "Run the numbers through the insurance claim payout calculator first, which walks through replacement cost, depreciation, and actual cash value for your specific loss. You can also get a written estimate from a licensed contractor, a public adjuster, or an independent appraiser. The comparison in this tool is only as reliable as the estimate you feed into it, so document how you arrived at that figure.",
  },
  {
    question: "What is bad faith claims handling?",
    answer:
      "Bad faith generally refers to an insurer unreasonably denying, delaying, or underpaying a valid claim without a legitimate basis, which is a specific legal standard that varies by state. A low settlement offer alone does not meet that standard. If you suspect bad faith handling, an attorney licensed in your state or your state insurance regulator is better positioned to evaluate the specifics than any calculator.",
  },
  {
    question: "What should I do if this calculator shows a large gap?",
    answer:
      "Start by requesting a written, itemized explanation of how the insurer calculated its offer, then compare it line by line against your own estimate. If the disagreement holds up after that comparison, an independent appraisal, a public adjuster, or an attorney for larger disputes are the next steps. For suspected bad faith handling, your state's insurance department can also review the file.",
  },
  {
    question: "What is a public adjuster and when should I hire one?",
    answer:
      "A public adjuster is a licensed professional who represents policyholders, not insurers, in preparing and negotiating a claim, typically for a percentage of the settlement. They're most worth considering on larger, more complex claims where the gap between the offer and a defensible estimate is substantial and you don't have the time or expertise to negotiate it yourself.",
  },
  {
    question: "Does my deductible affect this comparison?",
    answer:
      "Yes. An insurer's settlement offer is typically already net of your deductible, so this calculator subtracts your deductible from your own estimate before comparing the two, so you're comparing like figures rather than accidentally flagging your deductible itself as a gap.",
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

export default function ClaimUnderpaymentCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Insurance Claim Underpayment Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Compare an insurer&apos;s settlement offer against your own independently-calculated estimate
            and see the exact dollar and percentage gap between them, so you know whether it&apos;s worth
            pushing back before you sign a release.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <ClaimUnderpaymentCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-claim-underpayment-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What to Do When a Claim Settlement Feels Low
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            An insurer&apos;s offer arrives as a single number, usually with little explanation beyond a
            summary letter. That leaves policyholders in an awkward spot: the offer might be exactly
            right, or it might be missing a covered item, using an unrealistic contractor rate, or
            applying a depreciation schedule you never agreed to. The only way to know which is true is
            to arrive at your own number independently, using your own documentation and pricing, and
            then compare it against what the insurer offered. That comparison is what this insurance
            claim underpayment calculator does. It doesn&apos;t audit your policy or recalculate your loss
            for you; it takes the offer and your own estimate and reports the gap in dollars and as a
            percentage, so you can decide whether that gap is worth investigating further.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for policyholders who have already received a settlement offer, or a
            first-pass offer during negotiation, and have some independent basis for what the loss should
            actually be worth. That independent basis matters: comparing the insurer&apos;s offer against a
            number you pulled from memory or a rough guess doesn&apos;t tell you much. If you haven&apos;t
            calculated your own figure yet, start with the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>
            , which walks through replacement cost, depreciation, and actual cash value for your specific
            situation, then bring that number back here to compare it against the offer you were given.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Gap Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator subtracts your deductible from your own independent estimate to produce a net
            expected value, since a settlement offer is typically already net of the deductible and the
            two figures need to be on equal footing before comparing them. It then subtracts the
            insurer&apos;s offer from that net expected value to get a dollar gap, and divides that gap by
            the net expected value to get a percentage gap. A positive gap means the offer came in below
            your own estimate; a gap at or near zero, or a negative gap, means the offer matched or
            exceeded what you independently calculated. The tool translates the size of that percentage
            gap into a plain-language read, from &ldquo;no meaningful gap&rdquo; up through &ldquo;large gap, worth
            escalating,&rdquo; but the bands are guidance for what to do next, not a verdict on the insurer&apos;s
            conduct.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Legitimate Reasons for a Gap vs. Signals Worth Escalating
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A gap between an offer and your own estimate can come from entirely ordinary sources.
            Insurers frequently use different depreciation assumptions than a homeowner or contractor
            would, price materials and labor against their own vendor networks rather than local retail
            rates, or apply a policy exclusion or sublimit the policyholder didn&apos;t notice when reading
            the declarations page. None of those are wrongdoing; they&apos;re disagreements about
            methodology, and the fix is usually a documented conversation, not a legal filing. What&apos;s
            worth escalating is different: an insurer that refuses to explain how it arrived at a number
            in writing, a pattern of unreturned calls or missed deadlines, or an offer that ignores
            documentation you already submitted. Those are process failures, and they&apos;re the kind of
            thing a state insurance department or an attorney is positioned to look into, not something
            this calculator can determine from two numbers alone.
          </p>

          <AdInArticle slot="tool-claim-underpayment-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a homeowner whose insurer offered $12,000 after a kitchen water damage claim. Using
            the claim payout calculator, the homeowner independently arrived at $15,500 in replacement
            cost for cabinets, flooring, and appliances, based on current local contractor quotes, with a
            $1,000 deductible on the policy. Net of the deductible, the homeowner&apos;s own expected value
            is $14,500, against a $12,000 offer, a gap of $2,500, or about 17%. That falls into this
            tool&apos;s &ldquo;meaningful gap, investigate&rdquo; range. The next reasonable step isn&apos;t to assume the
            insurer acted improperly; it&apos;s to request the insurer&apos;s itemized breakdown, compare it
            against the contractor quotes line by line, and see whether the disagreement is about
            material pricing, scope, or something else entirely before deciding whether to negotiate
            further or bring in a public adjuster.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is treating any gap, however small, as proof the insurer lowballed
            the claim, when small gaps are often just rounding or minor pricing differences that aren&apos;t
            worth a fight. A related mistake runs the opposite direction: assuming the insurer&apos;s number
            must be right simply because it came from a professional estimator, without checking it
            against current local pricing. A third mistake is entering your own estimate into this
            calculator without documenting how you arrived at it, whether that&apos;s a contractor quote, a
            retail receipt, or a specific depreciation method, since an undocumented number is much
            harder to defend if you do end up negotiating with the insurer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the figure you enter as your own estimate is a reasonable, documented
            approximation of your loss, and it has no way to verify that figure, your policy language, or
            the insurer&apos;s actual calculation. It does not know your state&apos;s specific bad faith
            standards, your policy&apos;s exclusions or sublimits, or the facts of your particular claim
            file. The percentage bands shown are a plain-language guide to how large a gap is, not a legal
            threshold, and no gap size shown here constitutes evidence of bad faith or legal wrongdoing on
            its own. Treat the result as a starting point for a conversation with the insurer, and for
            significant or disputed claims, with a licensed attorney or your state insurance regulator.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Bad faith claims handling</strong> — an insurer unreasonably denying, delaying, or
              underpaying a valid claim without a legitimate basis; a legal standard that varies by state
              and is not established by a settlement gap alone.
            </li>
            <li>
              <strong>Public adjuster</strong> — a licensed professional who represents the policyholder,
              not the insurer, in preparing, documenting, and negotiating a claim, typically for a
              percentage of the settlement recovered.
            </li>
            <li>
              <strong>Appraisal clause</strong> — a provision in many property policies allowing either
              the policyholder or the insurer to demand a formal appraisal process, using independent
              appraisers and an umpire, to resolve a disputed claim value without going to court.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For guidance on filing and disputing claims, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on the claims process, and the{" "}
            <a
              href="https://www.iii.org/article/what-do-if-you-disagree-your-claim-settlement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            outlines the options available when a policyholder disagrees with a settlement. The{" "}
            <a
              href="https://www.consumerfinance.gov/complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Consumer Financial Protection Bureau
            </a>{" "}
            accepts complaints related to certain insurance products tied to financial accounts, and every{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state Department of Insurance
            </a>{" "}
            can review a claims-handling complaint directly, which is the right first call if you suspect
            bad faith handling rather than a routine pricing disagreement.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              Claims calculators
            </Link>{" "}
            category. Before you use it, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            helps you build the independent estimate this tool compares against. If the gap here points
            toward negotiating, the{" "}
            <Link href="/tools/claims/settlement-negotiation-target-calculator" className="text-blue-600 hover:underline">
              settlement negotiation target calculator
            </Link>{" "}
            helps you set a realistic counteroffer instead of guessing at one.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that help policyholders understand
            coverage, deductibles, and claims before they call an agent or sign a settlement. Nothing you
            type into this page is sent anywhere, and every result is meant to prepare you for a
            conversation with a licensed professional, not replace one.
          </p>
        </section>
      </div>
    </>
  );
}

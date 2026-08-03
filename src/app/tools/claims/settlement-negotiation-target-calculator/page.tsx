import type { Metadata } from "next";
import Link from "next/link";
import { SettlementNegotiationTargetCalculatorTool } from "@/components/tools/SettlementNegotiationTargetCalculatorTool";
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

const tool = getToolBySlug("settlement-negotiation-target-calculator")!;

const TITLE = "Settlement Negotiation Target Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this settlement negotiation target calculator to turn your documented claim value and the insurer's offer into a suggested counter-offer range you control.";
const PAGE_URL = `${SITE_URL}/tools/claims/settlement-negotiation-target-calculator`;

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
    question: "Where does the cushion percentage in this settlement negotiation target calculator come from?",
    answer:
      "It comes from you, not from us. There is no sourceable, insurance-industry-standard percentage for how much above your documented value to open a counter-offer, so this tool refuses to invent one. It defaults the cushion to 0%, meaning your opening counter equals your documented value unless you deliberately raise or lower it. General negotiation practice suggests opening somewhat above your real target to leave room to concede, but the exact number depends on your claim, your insurer, and your own risk tolerance.",
  },
  {
    question: "What should I use as my documented claim value?",
    answer:
      "Use a number you can back up with paperwork: a contractor's written repair estimate, a body shop estimate, an independent appraisal, or the output of this site's insurance claim payout calculator, not a round number you picked because it sounds fair. Adjusters negotiate against documentation. A counter-offer with no backing estimate behind it is much easier for an insurer to dismiss than one tied to a specific line-itemed bid.",
  },
  {
    question: "What is an appraisal clause, and when should I use it instead of continuing to negotiate?",
    answer:
      "Many property and auto policies include an appraisal clause: a formal, contractual dispute-resolution process where each side hires its own appraiser, the two appraisers pick a neutral umpire, and the resulting decision is generally binding. It exists specifically for disputes over the dollar amount of a covered loss, not over whether something is covered at all. If negotiation has stalled and the gap between your documented value and the insurer's offer isn't closing, check your policy for this clause before assuming your only options are accepting the offer or hiring an attorney.",
  },
  {
    question: "Does a bigger counter-offer number always lead to a better settlement?",
    answer:
      "Not necessarily. An opening counter with no documentation behind it can read as a negotiating tactic rather than a legitimate claim of loss, which can slow things down rather than speed them up. The number this tool suggests is only as credible as the documentation supporting your underlying claim value. A well-documented, moderate counter often moves an adjuster further than a large, unsupported one.",
  },
  {
    question: "Is this tool giving me legal advice on how to negotiate my claim?",
    answer:
      "No. This is a planning calculator that does arithmetic on the numbers you provide; it does not review your policy, your state's claims-handling laws, or the specific facts of your loss. For a claim of meaningful value, one involving injury, or one where negotiation has broken down, talk with a licensed public adjuster or an attorney who can look at your actual policy and your actual claim file.",
  },
  {
    question: "What is a reservation of rights letter, and should it change how I negotiate?",
    answer:
      "A reservation of rights letter is written notice from an insurer that it may later deny or limit coverage on your claim even while it continues to investigate or negotiate, typically because a coverage question hasn't been resolved yet. If you've received one, the coverage decision itself, not just the dollar amount, may still be in play, which is a good moment to involve a licensed professional before relying solely on a negotiation calculator like this one.",
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

export default function SettlementNegotiationTargetCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Settlement Negotiation Target Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Turn your documented claim value and the insurer&apos;s current offer into a suggested
            counter-offer range you set yourself, not a number we made up. Free, instant, and it never
            asks who you are.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <SettlementNegotiationTargetCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-settlement-negotiation-target-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Should Use This Settlement Negotiation Target Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the specific moment after an adjuster has made an offer and before
            you&apos;ve replied. You already have two numbers in hand at that point: the insurer&apos;s offer
            and your own sense of what the claim is actually worth. What&apos;s usually missing isn&apos;t
            information, it&apos;s a clear way to turn both numbers into a counter-offer you can actually send.
            This calculator is for homeowners countering a property claim, drivers countering a total-loss
            or repair estimate, and anyone else mid-negotiation with an insurer who wants their next number
            to be deliberate rather than a guess typed into an email at 11pm. It is not for people who
            haven&apos;t documented their claim yet; get that documentation first, because a counter-offer
            with nothing behind it is just a bigger guess.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Range Is Built</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts from two inputs only you can supply: your independently documented claim
            value and the insurer&apos;s current offer. &ldquo;Independently documented&rdquo; matters here — it
            means a number backed by a contractor bid, a repair shop estimate, an independent appraisal, or
            this site&apos;s own insurance claim payout calculator, not a figure chosen because it feels fair.
            From there, the tool applies a cushion percentage that you set, defaulted to 0%, to your
            documented value to produce a suggested opening counter. At 0%, your opening counter simply
            equals your documented value. If you raise the cushion, the tool is not telling you that
            insurers expect a specific markup; it is applying the general negotiation principle that an
            opening position is often set somewhat above a true target to leave room to concede during
            back-and-forth. Whether, and how much, to use that room is a strategic choice that depends on
            your relationship with the adjuster, how strong your documentation is, and how much time
            pressure you&apos;re under, not a number this calculator is qualified to hand you.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tool then shows the gap at each stage: how far the insurer&apos;s offer sits below your
            documented value, and how far your suggested counter sits above the insurer&apos;s offer. Seeing
            both gaps side by side is the point — it turns three separate numbers into one readable picture
            of where the negotiation currently stands.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a homeowner with wind damage to a roof. A licensed roofing contractor quotes the
            repair at $18,500, and the homeowner enters that as their documented claim value. The insurer&apos;s
            adjuster comes back with an initial offer of $12,000, citing depreciation and a lower per-square
            labor rate than the contractor used. Entered into the calculator, the gap between the offer and
            the documented value is $6,500, meaning the insurer&apos;s offer covers about 65% of the
            contractor&apos;s quote. If the homeowner leaves the cushion at 0%, their suggested counter is the
            full $18,500, backed directly by the contractor&apos;s written estimate. If they instead set a 10%
            cushion, believing they may need room to concede during a follow-up call, the suggested counter
            becomes $20,350, a deliberate choice they made, not a figure this tool asserted was standard.
            Either way, the $6,500 to $8,350 gap between the offer and the counter is now a specific number
            to discuss with the adjuster, backed by a specific document, rather than a vague sense that the
            offer feels low.
          </p>

          <AdInArticle slot="tool-settlement-negotiation-target-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is countering an offer with a number that has no documentation behind
            it at all, just a sense that the insurer&apos;s figure feels too low. An adjuster can dismiss an
            undocumented counter far more easily than one tied to a specific contractor bid, repair
            estimate, or independent appraisal, so build that documentation before you counter, not after.
            A second mistake is not knowing that many policies include a formal appraisal clause as a
            built-in dispute-resolution path once negotiation stalls; some policyholders spend months going
            back and forth over email when their policy already lays out a structured, faster way to
            resolve a dollar-amount disagreement. A third mistake is treating an opening counter as a final
            demand rather than a starting point, which can make a reasonable negotiation feel confrontational
            on both sides.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator performs arithmetic on the numbers you enter; it does not evaluate whether your
            documented value is itself accurate, complete, or supportable, and it does not know your
            policy&apos;s specific language, coverage limits, exclusions, or your state&apos;s claims-handling
            rules. The cushion percentage is entirely your own strategic choice, never an insurance-industry
            benchmark this tool is asserting as fact. Negotiation outcomes depend on the insurer, the
            adjuster, the strength of your documentation, applicable law, and the specific facts of your
            loss, none of which this tool can see. This is not legal advice, and it does not guarantee any
            particular settlement outcome. For a claim of meaningful value, one involving injury, or one
            where negotiation has broken down, consult a licensed public adjuster or an attorney who can
            review your actual policy and claim file.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Appraisal clause</strong> — a formal dispute-resolution provision found in many
              property and auto policies that lets each side hire an independent appraiser to resolve a
              disagreement over the dollar amount of a covered loss; the two appraisers select a neutral
              umpire, and the resulting decision is generally binding.
            </li>
            <li>
              <strong>Proof of loss</strong> — a signed, sworn statement you submit to your insurer
              itemizing the loss and the amount you&apos;re claiming, often required within a set number of
              days after the loss under the policy&apos;s terms.
            </li>
            <li>
              <strong>Reservation of rights letter</strong> — written notice from an insurer that it may
              later deny or limit coverage on a claim even while continuing to investigate or negotiate the
              amount, typically because a coverage question remains unresolved.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For general guidance on how insurers are expected to handle claims, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on filing and negotiating a claim, and the{" "}
            <a
              href="https://www.iii.org/article/how-file-insurance-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the claims process and documentation insurers typically expect. The{" "}
            <a
              href="https://www.consumerfinance.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Consumer Financial Protection Bureau
            </a>{" "}
            publishes broader guidance on your rights as a consumer if a dispute with a financial services
            provider stalls. Before relying on any negotiation strategy, confirm the specific rules in your
            state with your{" "}
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
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              Claims calculators
            </Link>{" "}
            category. Before you get to a negotiation, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            helps you build the documented claim value this tool asks for. If you already suspect the
            insurer&apos;s number is low for a reason tied to depreciation or valuation method rather than a
            round-number disagreement, the{" "}
            <Link href="/tools/claims/claim-underpayment-calculator" className="text-blue-600 hover:underline">
              claim underpayment calculator
            </Link>{" "}
            can help you check that more specifically before you counter.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that help policyholders understand
            coverage, claims, and settlement numbers before they talk to an insurer or an agent. Every tool
            runs entirely in your browser, keeps whatever you type to yourself, and is designed to leave
            you better prepared for the conversation that comes next.
          </p>
        </section>
      </div>
    </>
  );
}

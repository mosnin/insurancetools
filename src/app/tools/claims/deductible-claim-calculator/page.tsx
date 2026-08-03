import type { Metadata } from "next";
import Link from "next/link";
import { DeductibleClaimCalculatorTool } from "@/components/tools/DeductibleClaimCalculatorTool";
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

const tool = getToolBySlug("deductible-claim-calculator")!;

const TITLE = "Deductible Claim Calculator: What You Net | Insurance Tools";
const DESCRIPTION =
  "This deductible claim calculator subtracts your deductible from your loss to show your exact net payout, out-of-pocket cost, and whether filing is worth it.";
const PAGE_URL = `${SITE_URL}/tools/claims/deductible-claim-calculator`;

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
    question: "Will filing a claim near my deductible amount raise my premium?",
    answer:
      "It can, but there's no fixed rule or percentage that applies to every insurer, state, or claim type, so this calculator doesn't attempt to predict a specific increase. What's commonly understood is that insurers may weigh your claims history, including claim frequency and size, when setting a renewal premium. A claim that pays out only a little more than your deductible is exactly the case worth thinking through before filing, since a small net payout combined with a possible history effect can outweigh the benefit. Ask your agent or insurer how they specifically treat claims like yours if you want a real answer rather than a guess.",
  },
  {
    question: "What's a per-occurrence deductible, and does this tool assume one?",
    answer:
      "A per-occurrence deductible applies separately to each individual claim, rather than accumulating across a policy year the way some health insurance deductibles do. This calculator assumes that structure, since it's the standard for auto and home claims: your deductible is subtracted from this specific loss, not from a running total of everything you've filed this year. If your policy uses a different structure, such as an annual aggregate deductible or a percentage-based deductible tied to your dwelling coverage, the math here won't match your policy exactly.",
  },
  {
    question: "Does this calculator handle percentage deductibles like a 2% wind or hurricane deductible?",
    answer:
      "No. Percentage deductibles are calculated as a share of your dwelling coverage limit rather than a flat dollar figure, so a 2% deductible on a $300,000 dwelling limit is $6,000, not a number you'd type in directly. If your policy has one of these, calculate the dollar amount from your declarations page first, then enter that figure as your deductible here so the net payout math lines up with your actual policy.",
  },
  {
    question: "Should I get a repair estimate before running this calculator?",
    answer:
      "Yes, if you can. The accuracy of the net payout figure depends entirely on how close your entered loss amount is to what the damage actually costs to repair or replace. A rough guess can make a marginal claim look clearly worth filing, or the reverse. A contractor's estimate, a body shop quote, or your insurer's own adjuster estimate will all give you a firmer number than a guess based on memory.",
  },
  {
    question: "If I decide not to file, does that loss still show up anywhere?",
    answer:
      "Generally no. If you never submit a claim, most insurers have no record of the loss, and it won't appear on a claims history report such as a CLUE report, since those are built from actual filed claims, not losses you paid for yourself. That's part of why the marginal cases this tool flags matter: choosing to self-pay a small loss keeps your claims history exactly as it was.",
  },
  {
    question: "Why does the calculator ask how many claims I've filed recently if it doesn't change the payout math?",
    answer:
      "The net payout math (loss minus deductible) doesn't change based on your claims history — that part is fixed arithmetic. The claims-filed field feeds a separate, hedged note about claim frequency, since a driver or homeowner deciding whether to file a fourth claim in three years is in a meaningfully different position than someone filing their first, even when the dollar math is identical. The note doesn't quantify any effect; it's a prompt to factor that context in before you decide.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Claims Calculators", href: "/tools/claims" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function DeductibleClaimCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Deductible Claim Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter a specific loss and your deductible to see the net payout you&apos;d actually receive,
            not just the deductible mechanics in the abstract, plus a hedged read on whether a marginal
            claim is worth filing at all.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <DeductibleClaimCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-deductible-claim-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Deductible Claim Calculator Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most deductible content online explains the concept in the abstract: a deductible is the
            amount you pay before insurance covers the rest. That&apos;s true, but it doesn&apos;t answer the
            question someone with an actual repair estimate in hand is really asking, which is: given
            this specific loss and my specific deductible, what would I actually get paid? This calculator
            answers that narrower question directly. You enter your loss or repair cost and your
            deductible, and it computes the net payout as the loss minus the deductible, floored at zero,
            along with your exact out-of-pocket amount and the share of the loss your insurer would cover.
            It&apos;s a companion to, not a replacement for, the deductible-comparison tools in the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              Deductibles category
            </Link>
            , which help you pick a deductible level before you buy a policy. This one is for after a loss
            has already happened.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is built for someone standing in front of an actual repair quote, not a hypothetical one:
            a driver with a body shop estimate after a fender bender, a homeowner with a contractor&apos;s bid
            after storm damage, or anyone else deciding whether a specific loss clears the bar for filing.
            It&apos;s also useful for anyone who&apos;s filed a claim or two recently and wants to weigh a new,
            smaller loss against their existing claims history before adding another one to the pile,
            rather than filing reflexively just because the policy technically covers the damage.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Net Payout Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The math itself is simple by design: net payout equals your loss amount minus your deductible,
            and it never goes below zero, since an insurer doesn&apos;t owe you money when a loss is smaller
            than the deductible that applies to it. The calculator also assumes a single, flat,
            per-occurrence deductible, meaning it applies once to this specific loss rather than
            accumulating across everything you&apos;ve filed this policy year. Where the tool adds more than
            the raw subtraction is the &ldquo;is it worth filing&rdquo; read underneath the numbers. It compares
            your net payout against your deductible as a ratio: a payout under half your deductible is
            flagged as marginal, one between half and double is flagged as worth considering, and anything
            beyond double is flagged as a clearer case for filing. None of these thresholds are a rule from
            an insurer or a regulator; they&apos;re a starting framework for a decision that ultimately depends
            on your own tolerance for the time a claim takes and any effect on your policy going forward.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The claims-filed field feeds a separate note rather than changing the payout arithmetic. If
            you enter two or more claims in the last three years, the tool surfaces a hedged reminder that
            claim frequency is a general consideration some insurers weigh at renewal, without inventing a
            specific percentage or dollar figure for what that effect might be, since that number genuinely
            varies by insurer, state, coverage type, and claim history.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a windstorm knocks a tree limb onto your fence, and a contractor quotes $1,300 to repair
            it. Your homeowners policy carries a $1,000 deductible. The net payout here is $300 ($1,300
            minus $1,000), which is well under half of your deductible, so the calculator flags this as
            marginal. You&apos;d pay $1,000 out of pocket either way and get $300 back from the insurer if you
            file, versus paying the full $1,300 yourself and keeping the claim off your history entirely.
            Now compare that to a $4,200 repair against the same $1,000 deductible: the net payout jumps to
            $3,200, more than triple the deductible, which the calculator marks as a clearer case for
            filing, since the payout meaningfully outweighs the deductible you&apos;re absorbing. Same
            deductible, same policy, very different answer, because the loss amount is what actually
            drives the decision.
          </p>

          <AdInArticle slot="tool-deductible-claim-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is filing a claim for an amount barely above the deductible without
            ever running the net-payout math, simply because the loss is technically covered. A $1,100
            repair against a $1,000 deductible pays out $100; the paperwork and the potential claims-history
            exposure may not be worth $100 to some policyholders, and this tool exists to make that
            trade-off visible before you file rather than after. A second common mistake is the opposite
            error: assuming every claim near the deductible is automatically not worth filing, when a
            marginal read is a prompt to think it through, not an automatic no. A third is entering a
            rough, remembered repair cost instead of an actual quote, which can push a genuinely
            worthwhile claim into the marginal zone or vice versa purely due to a bad input.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a flat, per-occurrence deductible and a loss amount you&apos;re
            reasonably confident in; it does not model percentage-based deductibles, per-item sublimits,
            multiple deductibles that could apply to the same event, or coinsurance provisions that some
            commercial and specialty policies use. It does not know your insurer&apos;s specific underwriting
            rules, your state&apos;s claims-handling regulations, or how any particular company weighs claims
            frequency at renewal, and it deliberately does not quantify a premium-increase estimate, since
            no single figure is accurate across insurers, states, and claim types. The &ldquo;is it worth
            filing&rdquo; read is a starting framework built around the ratio of payout to deductible, not a
            recommendation tailored to your policy. Treat every number here as a planning estimate to bring
            into a conversation with your agent or insurer, not a final claims decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Per-occurrence deductible</strong> — a deductible that applies separately to each
              individual claim or event, rather than accumulating across a policy period.
            </li>
            <li>
              <strong>Claims history</strong> — the record of claims you&apos;ve filed over time, typically
              compiled through reports like a CLUE report, which insurers may reference when underwriting
              or pricing a renewal.
            </li>
            <li>
              <strong>Loss ratio</strong> — a broader industry metric comparing the claims an insurer pays
              out to the premiums it collects; it&apos;s an insurer-level figure, not something calculated per
              policyholder, but it&apos;s useful background for understanding why insurers care about claims
              frequency in aggregate.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how deductibles and claims filing actually work, the{" "}
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
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains deductible mechanics in more depth. Before filing or skipping a claim,
            confirm how your specific policy and state rules apply with your{" "}
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
              claims calculators
            </Link>{" "}
            category. If you&apos;re working through a larger settlement rather than a straightforward
            deductible subtraction, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            models a fuller settlement estimate. If you haven&apos;t filed yet and want to compare deductible
            levels before you buy or renew a policy, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible comparison calculators
            </Link>{" "}
            are the better starting point.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free, browser-based calculators for the specific, practical moments
            insurance decisions actually happen in, from picking a deductible before you buy to deciding
            whether an in-hand repair estimate is worth filing. Every calculator runs locally in your
            browser, collects nothing, and is built to leave you better informed before you call an agent
            or file a claim.
          </p>
        </section>
      </div>
    </>
  );
}

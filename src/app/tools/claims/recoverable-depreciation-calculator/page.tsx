import type { Metadata } from "next";
import Link from "next/link";
import { RecoverableDepreciationCalculatorTool } from "@/components/tools/RecoverableDepreciationCalculatorTool";
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

const tool = getToolBySlug("recoverable-depreciation-calculator")!;

const TITLE = "Recoverable Depreciation Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this recoverable depreciation calculator to see your first ACV check now and your second depreciation check after repairs, based on your RCV and deductible.";
const PAGE_URL = `${SITE_URL}/tools/claims/recoverable-depreciation-calculator`;

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
    question: "What is recoverable depreciation on an insurance claim?",
    answer:
      "It's the portion of your claim your insurer withholds from the first payment on a replacement cost value (RCV) policy, equal to the depreciation between your item's RCV and its actual cash value (ACV). The insurer releases it in a second check once you complete the repair or replacement and send proof, such as a paid invoice or contractor's final bill. It exists because RCV coverage is designed to pay the full cost to repair or replace, but insurers withhold the depreciated portion until they can confirm the work was actually done.",
  },
  {
    question: "How do I actually request my recoverable depreciation check?",
    answer:
      "Complete the repair or replacement, keep the paid invoice or final contractor bill, and send that documentation to your adjuster along with a request to release the recoverable depreciation holdback. Insurers generally don't send this second check automatically the moment repairs finish; you typically have to submit the proof and ask for it. If you're not sure what documentation your insurer wants, ask your adjuster directly before you complete the work so you don't have to track down paperwork later.",
  },
  {
    question: "Is there a deadline to claim recoverable depreciation?",
    answer:
      "Almost always yes, but the exact window is set by your specific policy language and varies by insurer, so this calculator does not state a universal number. Some policies use a window measured in months, others give a year or more. Check your policy's declarations page or call your adjuster to confirm your deadline, and don't assume the deadline you've heard about from another policy or another insurer applies to yours.",
  },
  {
    question: "Why did my insurer only pay part of what I expected on my claim?",
    answer:
      "On an RCV policy, the first check is intentionally the actual cash value minus your deductible, not the full replacement cost. The remaining amount, the recoverable depreciation, is a separate second payment released only after repairs are completed and documented. If your policy is actual cash value only rather than replacement cost, there may be no second check at all, which is worth confirming with your agent if the gap surprises you.",
  },
  {
    question: "What's the difference between recoverable and non-recoverable depreciation?",
    answer:
      "Recoverable depreciation is available to you once you complete repairs and submit proof within your policy's deadline; non-recoverable depreciation is withheld permanently and is never paid out, typically because the policy doesn't include a replacement cost provision for that item or the claim type. Roofs, in particular, are sometimes carved out with a separate, less generous depreciation schedule even on an otherwise full RCV policy, so check that endorsement specifically.",
  },
  {
    question: "Do I need receipts to get the second check, or is an estimate enough?",
    answer:
      "Most insurers require proof that the work was actually completed, such as a paid invoice, a signed contractor completion certificate, or itemized receipts, not just an estimate of what the repair would cost. An estimate is generally sufficient for the first ACV check, but the second, recoverable depreciation check is specifically conditioned on evidence that repair or replacement already happened.",
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

export default function RecoverableDepreciationCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Recoverable Depreciation Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See exactly how your replacement cost value claim splits into two checks: what lands in your
            account now, and what&apos;s waiting once repairs are finished and documented.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <RecoverableDepreciationCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-recoverable-depreciation-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Recoverable Depreciation Actually Is</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            On a replacement cost value (RCV) policy, most insurers don&apos;t hand you the full repair or
            replacement cost the day your claim is approved. Instead, they split the payout into two
            checks. The first is the actual cash value (ACV): the replacement cost minus depreciation for
            age, wear, and condition, minus your deductible. The second is the recoverable depreciation
            itself, the exact gap between RCV and ACV, and it stays withheld until you&apos;ve completed the
            repair or replacement and sent proof. It isn&apos;t a penalty and it isn&apos;t the insurer trying to
            shortchange you; it&apos;s a documented, standard mechanic built into how RCV coverage is priced
            and administered, and it exists on a huge share of homeowners, auto, and business property
            claims. The problem is that plenty of policyholders cash the first check, assume it&apos;s the
            whole settlement, and never come back for the second one.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for anyone holding an RCV claim estimate right now and trying to understand why
            the check they received looks smaller than the number on their adjuster&apos;s worksheet. It&apos;s
            also useful earlier, before you&apos;ve even started repairs, so you know in advance exactly what
            you&apos;re still owed and can budget the repair against the eventual second payment rather than
            being surprised by a shortfall. If you&apos;re instead trying to figure out how depreciation gets
            calculated in the first place for a specific asset like a roof, the site&apos;s{" "}
            <Link href="/tools/claims/depreciation-claim-calculator" className="text-blue-600 hover:underline">
              depreciation claim calculator
            </Link>{" "}
            walks through that age-and-useful-life math directly. This tool assumes you already have RCV and
            ACV figures from your claim paperwork and focuses purely on how the two-check process itself
            divides that money and what you still need to do to collect all of it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Math and Process, Step by Step</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Enter your replacement cost value, your actual cash value, and your deductible. The calculator
            first computes your total entitled payout as RCV minus the deductible, the full amount you&apos;re
            owed once everything is said and done. Your first check is ACV minus the deductible, floored at
            $0 so it never goes negative. Your second check, the recoverable depreciation, is whatever
            remains of the total entitled payout after the first check, which is mathematically the same as
            RCV minus ACV in the typical case, but adjusts automatically if your deductible was larger than
            your ACV: when that happens, the leftover deductible reduces the second check instead of
            creating an impossible negative first payment. That detail matters on lower-value claims with a
            high deductible, where it&apos;s easy to miscalculate the second check by hand.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The step that actually unlocks the second check happens outside this calculator: you have to
            complete the repair or replacement and send your insurer documentation proving it, most
            commonly a paid invoice, itemized receipts, or a contractor&apos;s signed completion certificate.
            An estimate is not proof of completion. Your policy sets a specific window for submitting that
            documentation, and it genuinely varies by insurer and by state, so this tool deliberately does
            not state a single universal deadline. Check your declarations page or call your adjuster and
            confirm your exact window before you assume you have unlimited time.
          </p>

          <AdInArticle slot="tool-recoverable-depreciation-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a homeowner&apos;s adjuster values a wind-damaged fence replacement at $24,000 in replacement
            cost, with $16,800 in actual cash value after depreciation, and the policy carries a $1,000
            deductible. The total entitled payout is $23,000 ($24,000 minus $1,000). The first check is
            $15,800 ($16,800 minus $1,000), issued shortly after the claim is approved. The remaining
            $7,200 is the recoverable depreciation, and it stays with the insurer until the homeowner hires
            a contractor, pays for the new fence, and submits the paid invoice. Once that documentation is
            in, the second check for $7,200 goes out, bringing the total to the full $23,000. A homeowner
            who only looks at the $15,800 check might assume that&apos;s the entire settlement and never
            realize another $7,200 was always available to them.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is not knowing the second check exists at all, cashing the ACV
            payment, and treating the claim as closed. A close second is missing the policy&apos;s deadline for
            submitting repair proof, sometimes because repairs got delayed by a contractor&apos;s schedule or a
            permitting backlog, and the recoverable depreciation is forfeited entirely once that window
            closes. A third is submitting an estimate instead of proof of completion; insurers typically
            need evidence the work actually happened, not just a quote for what it would cost. A fourth is
            assuming every policy carries recoverable depreciation at all, when some policies, or some
            specific endorsements within a policy such as a roof surfacing schedule, are actual cash value
            only with no second check available.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes your policy actually includes a recoverable depreciation provision, not
            an actual-cash-value-only policy, and that the RCV and ACV figures you enter came from your own
            claim paperwork rather than a guess. It applies the deductible once, against your total entitled
            payout, which matches how most RCV claims are structured but is a modeling choice rather than a
            guarantee of how your specific insurer processes the math. It does not know your policy&apos;s
            exact deadline for completing repairs and submitting proof, your insurer&apos;s specific
            documentation requirements, or any state-specific claims-handling regulation that might apply.
            Treat every figure here as a planning estimate to bring into a conversation with your adjuster
            or a licensed public adjuster, not as a final claim determination.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Recoverable depreciation</strong> — the withheld gap between replacement cost value
              and actual cash value that an insurer releases in a second check once repairs are completed
              and documented within the policy&apos;s deadline.
            </li>
            <li>
              <strong>Non-recoverable depreciation</strong> — depreciation that is never paid out, either
              because the policy or a specific endorsement is actual cash value only, or because the
              deadline to submit proof of completion has passed.
            </li>
            <li>
              <strong>Proof of completion</strong> — documentation showing the repair or replacement was
              actually finished, such as a paid invoice, itemized receipts, or a contractor&apos;s signed
              completion certificate; an estimate alone typically does not qualify.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how insurers structure and handle claims, the{" "}
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
              href="https://www.iii.org/article/replacement-cost-vs-actual-cash-value-whats-difference"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the difference between replacement cost and actual cash value coverage in more depth.
            The{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s homeowners insurance basics
            </a>{" "}
            page covers how these claim mechanics fit into a standard policy overall. Since your exact
            deadline and documentation requirements are policy-specific, confirm both with your adjuster or
            your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            if you believe a claim was handled unfairly.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            category. If you need to work out the ACV and depreciation figures from scratch first, start
            with the{" "}
            <Link href="/tools/claims/depreciation-claim-calculator" className="text-blue-600 hover:underline">
              depreciation claim calculator
            </Link>
            . To see how the full settlement compares against other claim scenarios, including total loss,
            the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            covers the broader payout question.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn confusing insurance and claims
            mechanics into numbers you can actually check against your own paperwork. Nothing you type here
            gets sent anywhere; every result is meant to prepare you for the exact conversation you need to
            have with your adjuster or agent, not replace it.
          </p>
        </section>
      </div>
    </>
  );
}

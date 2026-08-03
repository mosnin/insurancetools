import type { Metadata } from "next";
import Link from "next/link";
import { RoofReplacementClaimCalculatorTool } from "@/components/tools/RoofReplacementClaimCalculatorTool";
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

const tool = getToolBySlug("roof-replacement-claim-calculator")!;

const TITLE = "Roof Replacement Claim Calculator: ACV Payout Estimator | Insurance Tools";
const DESCRIPTION =
  "Run the roof replacement claim calculator to see your actual cash value payout, the depreciation your insurer is holding back, and what recoverable depreciation could add later.";
const PAGE_URL = `${SITE_URL}/tools/home/roof-replacement-claim-calculator`;

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
    question: "Does this roof replacement claim calculator give me my actual settlement amount?",
    answer:
      "No. It shows you the standard actual cash value math your insurer's software runs internally, using the replacement cost, age, and useful-life figures you enter. Your real settlement also depends on your specific policy language, any state-specific claims rules, your adjuster's inspection findings, and how your insurer's own depreciation schedule treats your particular roofing material. Use this as a way to check the math on a claim estimate you've already received, not as a substitute for it.",
  },
  {
    question: "Where do I find the useful-life number my insurer is applying to my roof?",
    answer:
      "It's usually printed directly on the claim estimate or repair estimate your adjuster provides, sometimes labeled as the roof's 'expected life' or 'age/life' figure. If you can't find it there, ask your adjuster or claims examiner directly for the useful-life years they used to calculate depreciation. This calculator deliberately doesn't guess this number for you, because it varies by roofing material, region, and insurer, and using the wrong figure would make the whole estimate misleading.",
  },
  {
    question: "What is recoverable depreciation and how do I actually collect it?",
    answer:
      "Recoverable depreciation is the portion of your roof's value your insurer withholds upfront and pays out later, but only if your policy is written on a replacement-cost basis rather than actual cash value. To collect it, you typically need to complete the roof repair and submit the contractor's final invoice or a completion certificate to your insurer within a policy deadline, often 180 days from the initial payment. If your policy is actual cash value only, that depreciation is never paid out, which is why the checkbox in this calculator matters.",
  },
  {
    question: "Why is my actual cash value payout $0 even though my roof has real value?",
    answer:
      "This happens when your deductible is larger than the actual cash value remaining after depreciation is subtracted, which is common on older roofs that have depreciated heavily. The calculator flags this case directly. It doesn't mean the claim was denied; it means the deductible fully absorbed the initial payout, and if you have recoverable depreciation, completing the repair may still unlock a later payment.",
  },
  {
    question: "Does this calculator account for code upgrade coverage or a matching endorsement?",
    answer:
      "No. Ordinance-or-law coverage for bringing an older roof up to current building code, and matching endorsements that pay for replacing undamaged sections so shingle colors and materials match, are separate policy add-ons this tool doesn't model. If your estimate seems short of what a full replacement will actually cost, ask your adjuster whether either of those endorsements applies to your policy before assuming the calculator's number is the final word.",
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

export default function RoofReplacementClaimCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Roof Replacement Claim Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See the actual cash value your roof claim is likely to pay out today, the depreciation your
            insurer is holding back, and what recoverable depreciation could add once the repair is done.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <RoofReplacementClaimCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-roof-claim-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Needs a Roof Replacement Claim Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for homeowners who have a roof damage claim in front of them, whether that&apos;s a
            first estimate from an adjuster after a hailstorm or a contractor&apos;s replacement quote you&apos;re
            trying to reconcile against what your insurer says it will pay. The number on a claim letter
            rarely comes with a visible breakdown, which leaves homeowners guessing at how the insurer
            arrived at a payout that&apos;s noticeably lower than the cost of a new roof. If you&apos;re staring at
            a settlement offer and can&apos;t tell whether the math checks out, or you want to know before a
            claim is even filed roughly what a roof in a given condition might net you, this calculator
            walks through the same arithmetic an adjuster&apos;s software runs.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Actual Cash Value, Replacement Cost, and Recoverable Depreciation
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most homeowners policies pay roof claims in one of two ways. A pure actual cash value (ACV)
            policy pays the roof&apos;s replacement cost minus depreciation, full stop, and that depreciated
            amount is never recovered. A replacement-cost policy also starts with an ACV payment, but
            treats the withheld depreciation as recoverable: once you complete the repair and document it,
            typically with a contractor&apos;s final invoice, the insurer releases a second payment covering
            some or all of what was held back. The gap between those two structures is often thousands of
            dollars on an older roof, which is exactly why the calculator above asks directly whether your
            policy carries recoverable depreciation instead of assuming one or the other.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Depreciation itself is the insurer&apos;s way of accounting for the roof&apos;s remaining service
            life. A 15 year old roof with an expected 25 year lifespan has used up 60% of its useful life,
            so the insurer treats 60% of the replacement cost as already &ldquo;spent&rdquo; and pays out based on
            the remaining 40%. That useful-life figure is set by the insurer, not by this tool, which is
            why the calculator asks you to enter it rather than assuming every asphalt shingle roof lasts
            the same number of years.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Payout Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator divides your roof&apos;s current age by the useful-life figure you enter to get a
            depreciation percentage, capped at 100% so a roof past its expected lifespan doesn&apos;t produce
            a negative value. That percentage is applied to the replacement cost value (RCV) to get the
            depreciated amount, which is subtracted from the RCV to get the actual cash value before your
            deductible. Your deductible comes off last, and if it&apos;s larger than the remaining actual cash
            value, the initial payout floors at $0 rather than going negative. When recoverable
            depreciation is checked, the tool separately shows the withheld amount as a second line item,
            since it belongs to a different payment that arrives only after the repair is finished and
            documented, not as part of the initial check.
          </p>

          <AdInArticle slot="tool-roof-claim-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a contractor quotes $14,000 to fully replace a roof that&apos;s 12 years old, and the
            insurer&apos;s claim paperwork lists a 20 year useful life for that roofing material, with a
            $1,500 deductible on a replacement-cost policy. Depreciation works out to 60% (12 divided by
            20), or $8,400 of the $14,000 RCV. The actual cash value before the deductible is $5,600
            ($14,000 minus $8,400), and after the $1,500 deductible, the initial check is $4,100. Because
            this policy carries recoverable depreciation, the homeowner can potentially recover up to that
            $8,400 in depreciation once the roof is actually replaced and the invoice submitted, for a
            possible total of $12,500 ($14,000 minus the $1,500 deductible) once everything is documented
            and paid.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes on a Roof Claim</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is treating the first ACV check as the final word on the claim
            without realizing recoverable depreciation exists, and letting the completion deadline for
            filing that final invoice pass unused. A close second is guessing at the useful-life figure
            instead of asking for it, which produces a depreciation estimate that doesn&apos;t match what the
            insurer actually calculated. A third is assuming a low ACV payout means the claim was denied
            or undervalued, when it&apos;s often just the deductible absorbing a heavily depreciated older
            roof&apos;s remaining value, exactly the scenario this calculator flags when it happens.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes straight-line depreciation, meaning the roof loses value evenly across
            its useful life, which is the common method insurers use but not the only one in circulation.
            It does not know your policy&apos;s specific deadline for submitting a recoverable depreciation
            invoice, whether your policy includes ordinance-or-law coverage for code upgrades, whether a
            matching endorsement applies to undamaged sections, or any state-specific claims-handling
            regulation that could affect timing or payout. The replacement cost value you enter is only as
            accurate as the contractor estimate or insurer figure behind it. Treat every number here as a
            planning estimate to compare against your actual claim paperwork, not as a substitute for it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Actual cash value (ACV)</strong> — the replacement cost of the roof minus
              depreciation, the amount typically paid out before any repair is completed.
            </li>
            <li>
              <strong>Replacement cost value (RCV)</strong> — the full cost to replace the roof today with
              materials of similar kind and quality, before any depreciation is subtracted.
            </li>
            <li>
              <strong>Recoverable depreciation</strong> — the withheld portion of the RCV that a
              replacement-cost policy pays out after the repair is completed and documented, as opposed to
              non-recoverable depreciation that an actual cash value policy never pays.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how homeowners coverage and replacement cost provisions work, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language overview, and the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            explains what to expect when filing and settling a property claim. For how deductibles fit
            into a payout more generally, the Insurance Information Institute also has a{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              deductible mechanics explainer
            </a>
            , and if a claims dispute ever needs a regulator&apos;s attention, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state insurance department
            </a>{" "}
            is the right first call.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. For other property settlement questions, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            cover payout math beyond roofs, and the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to carry before your next claim happens.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn confusing policy math into
            plain numbers you can check yourself. Nothing you type here is sent anywhere; every result is
            computed on your own device so you can walk into a claims call already knowing what to expect.
          </p>
        </section>
      </div>
    </>
  );
}

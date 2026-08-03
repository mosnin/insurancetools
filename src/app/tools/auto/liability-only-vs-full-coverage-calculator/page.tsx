import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { LiabilityOnlyVsFullCoverageCalculatorTool } from "@/components/tools/LiabilityOnlyVsFullCoverageCalculatorTool";
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
  slug: "liability-only-vs-full-coverage-calculator",
  name: "Liability-Only vs. Full Coverage Calculator",
  description:
    "Compare your liability-only and full coverage premium quotes to see the exact annual savings, whether a loan requires full coverage, and how long it would take those savings to equal your car's value.",
  category: "Auto",
  categorySlug: "auto",
  keywords: [
    "liability only vs full coverage calculator",
    "is full coverage worth it",
    "liability only car insurance calculator",
    "full coverage insurance cost calculator",
    "when to drop full coverage",
    "liability only insurance savings",
    "how much does full coverage cost vs liability",
  ],
  relatedTools: [],
};

const TITLE = "Is Full Coverage Worth It? Liability vs Full Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this liability only vs full coverage calculator to compare your two quotes, see your exact annual savings, and find out how many years it takes to recoup your car's value. Free and instant.";
const PAGE_URL = `${SITE_URL}/tools/auto/liability-only-vs-full-coverage-calculator`;

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
    question: "Is full coverage worth it on an older car?",
    answer:
      "It depends on how the math works out, not on the car's age by itself. Run your full coverage and liability-only quotes through the calculator above: if the premium difference would recoup your car's actual cash value in a handful of years, dropping collision and comprehensive is worth serious consideration. If the payback period is long, or your premiums are already close together, the coverage is probably still doing its job cheaply.",
  },
  {
    question: "Can I drop full coverage while I still have a car loan?",
    answer:
      "Almost never voluntarily. Loan and lease contracts typically require you to carry collision and comprehensive coverage for as long as the lender has a financial interest in the vehicle, since it protects their collateral, not just you. This calculator flags that requirement whenever you enter a remaining balance above $0, instead of showing a savings verdict that doesn't apply to your situation yet.",
  },
  {
    question: "What exactly counts as 'full coverage' in this calculator?",
    answer:
      "In this tool, your full coverage premium is your total annual premium including collision and comprehensive on top of liability, and your liability-only premium is a separate quote for the same driver and vehicle with collision and comprehensive removed. The calculator only looks at the dollar difference between the two figures you enter; it doesn't estimate either premium for you, since pricing varies too much by driver, ZIP code, and insurer to model honestly.",
  },
  {
    question: "How many years of savings should it take before dropping full coverage makes sense?",
    answer:
      "There's no single correct number, but this calculator uses roughly ten years as a rough dividing line between a fast and a slow payback, based on the commonly cited rule that full coverage stops paying for itself once the premium runs near 10% of the vehicle's value each year. Ten years of 10% premiums equal the car's full value, so a payback period noticeably under ten years is the scenario most often cited as worth dropping coverage over.",
  },
  {
    question: "Does this calculator account for the risk of paying for repairs myself?",
    answer:
      "No, and that's an important limitation. The payback period only measures premium dollars against the car's value; it doesn't weigh the risk of an at-fault accident, a hailstorm, or a theft happening before you've banked enough savings to self-insure. A driver who couldn't comfortably cover a full loss out of pocket may reasonably choose to keep full coverage even with a fast payback number.",
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

export default function LiabilityOnlyVsFullCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Liability-Only vs. Full Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter your own two quotes and find out, in dollars, whether dropping collision and
            comprehensive is actually worth it for your car — not a generic rule of thumb, your numbers.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <LiabilityOnlyVsFullCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-liability-vs-full-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Real Question Behind &ldquo;Is Full Coverage Worth It&rdquo;
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every driver who owns their car outright eventually asks some version of the same question:
            am I paying more for collision and comprehensive than that coverage is actually likely to pay
            out? It&apos;s a fair question, and it doesn&apos;t have a universal answer, because it depends on
            three numbers that are specific to you: what your car is actually worth today, what your
            insurer charges you for full coverage, and what that same insurer would charge for liability
            alone. This calculator exists because most advice on this topic stops at a vague percentage
            rule without ever asking you for your own quotes, which means it can&apos;t tell you anything
            about your actual situation. Get a liability-only quote alongside your renewal, plug both
            numbers in above, and you&apos;ll have an answer built on your policy instead of a stranger&apos;s
            average.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Payback Period Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The math itself is simple once you have both quotes. The calculator subtracts your
            liability-only premium from your full coverage premium to get your annual savings from
            dropping collision and comprehensive. If you still owe money on the car, that savings figure
            becomes mostly academic, because lenders and leasing companies generally require full
            coverage until the loan or lease is paid off, so the tool flags that condition first rather
            than pretending the decision is yours alone to make.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Once a loan isn&apos;t in the picture, the calculator divides your car&apos;s actual cash value by
            your annual savings to get a payback period in years — essentially, how long it would take
            the money you&apos;re not spending on full coverage to add up to what the car is worth. This is a
            restatement of the commonly cited &ldquo;10% rule,&rdquo; which says full coverage is worth
            reconsidering once the premium exceeds roughly 10% of the vehicle&apos;s value. A premium at
            exactly 10% of value produces a ten-year payback, so a payback period meaningfully under ten
            years is the situation that rule points toward, and a longer payback period points the other
            way.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Take a driver with an eight-year-old sedan worth $4,200 at trade-in value, no remaining loan
            balance, a $1,400 annual premium with full coverage, and a $780 annual quote for liability
            alone. The savings from dropping full coverage would be $620 a year. Dividing the car&apos;s
            $4,200 value by that $620 annual savings gives a payback period of about 6.8 years, well under
            the ten-year mark, which is the kind of number that makes dropping full coverage a reasonable
            option to weigh seriously. Compare that with a newer car worth $22,000 carrying a $1,700 full
            coverage premium against a $1,100 liability-only quote: the $600 annual savings would take
            roughly 36.7 years to equal the car&apos;s value, a payback period long enough that keeping full
            coverage is clearly the better financial position, independent of any loan.
          </p>

          <AdInArticle slot="tool-liability-vs-full-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes Drivers Make Here</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is using a generic online rule of thumb instead of an actual
            liability-only quote, which can be off by hundreds of dollars in either direction depending on
            the insurer. A second is forgetting that a fast payback period only measures premium dollars
            against the car&apos;s value, not the risk of a large unplanned repair bill or a total loss
            arriving before enough savings have accumulated to cover it. A third is checking this once at
            purchase and never again — a car that didn&apos;t clear the ten-year threshold when it was newer
            often does a few years later as it depreciates and your full coverage premium doesn&apos;t drop as
            quickly as the car&apos;s value does.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the two premium figures you enter are accurate, apples-to-apples
            quotes for the same driver, vehicle, and deductible; it doesn&apos;t generate or verify either
            number itself. The ten-year payback threshold is a widely cited planning heuristic, not a
            formula every insurance professional agrees on, and it says nothing about whether you could
            comfortably absorb a full loss out of pocket if it happened the week after you dropped
            coverage. It also doesn&apos;t know your lender&apos;s exact contract terms, so always confirm your
            loan or lease agreement&apos;s coverage requirement directly rather than relying on this tool for
            that answer. Treat the result as a starting point for a conversation with a licensed agent, not
            a final decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Full coverage</strong> — a common shorthand for a policy that combines liability
              coverage with collision and comprehensive coverage for damage to your own vehicle.
            </li>
            <li>
              <strong>Actual cash value</strong> — what your vehicle would sell for today, after
              depreciation, rather than what you originally paid for it.
            </li>
            <li>
              <strong>Payback period</strong> — how long it would take the money saved from a lower
              premium to add up to a specific dollar amount, in this case your car&apos;s actual cash value.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on what collision and comprehensive coverage actually pay for, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on standard auto policy parts, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how collision and comprehensive differ from liability coverage. Before changing a
            policy, confirm your lender or leasing company&apos;s exact coverage requirement in your loan or
            lease agreement, and check your state&apos;s rules with your{" "}
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
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you&apos;d rather size your liability limit before comparing full coverage against
            liability-only, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            covers that step first. Once you know what you&apos;d be saving, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to pair with whichever coverage you keep, and the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the same how-much-do-I-need question for other policy types.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the coverage decisions people
            actually face — what to buy, what to drop, and what a claim is likely to pay. Nothing you type
            here leaves your browser, and every tool is designed to leave you better prepared for a
            conversation with a licensed agent, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

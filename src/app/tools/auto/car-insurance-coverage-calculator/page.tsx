import type { Metadata } from "next";
import Link from "next/link";
import { CarInsuranceCoverageCalculatorTool } from "@/components/tools/CarInsuranceCoverageCalculatorTool";
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

const tool = getToolBySlug("car-insurance-coverage-calculator")!;

const TITLE = "Car Insurance Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this car insurance coverage calculator to find a liability limit sized to your actual assets and income, not a generic minimum, plus checks on collision, gap, and umbrella coverage.";
const PAGE_URL = `${SITE_URL}/tools/auto/car-insurance-coverage-calculator`;

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
    question: "Does this car insurance coverage calculator give me a quote?",
    answer:
      "No. It recommends a liability limit tier and flags whether collision, gap, and umbrella coverage are worth considering, based on your own numbers. Pricing depends on your driving record, location, vehicle, and the insurer's underwriting, none of which this tool has access to. Use the recommendation when you request quotes so you're comparing the same coverage across insurers.",
  },
  {
    question: "Why does the calculator recommend more than my state's minimum?",
    answer:
      "State minimums are set as a legal floor, not a safety target, and they're usually far below what a serious accident actually costs. This calculator uses the asset-protection method instead: it sizes your liability limit to your assets plus a year of income, since a judgment against you in an at-fault accident can pursue both. Check your own state's exact minimum with your state's Department of Insurance before you buy, since this tool doesn't look that number up for you.",
  },
  {
    question: "What is the 10% rule for collision and comprehensive coverage?",
    answer:
      "It's a common rule of thumb: if your annual collision and comprehensive premium costs more than about 10% of your vehicle's actual cash value, some drivers choose to drop that coverage and self-insure instead, since a total loss would pay out roughly what you'd have saved in premiums anyway. It's a guideline, not a law of insurance, and it ignores whether you could actually afford to replace the car out of pocket.",
  },
  {
    question: "How is actual cash value different from what I paid for my car?",
    answer:
      "Actual cash value is what your car would sell for today, factoring in depreciation, mileage, and condition. It's typically lower than the purchase price and lower than the payoff balance on a newer loan, which is exactly the gap that gap insurance is built to cover.",
  },
  {
    question: "Do I need a personal umbrella policy on top of my auto liability limit?",
    answer:
      "It's worth considering once your assets plus income exceed what a 250/500 auto liability limit covers, since that's close to the highest limit most insurers offer directly on an auto policy. An umbrella policy extends liability protection beyond your auto and home policies for a relatively small added premium. This calculator flags when your numbers cross that line, but the decision to buy one is worth a conversation with a licensed agent.",
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

export default function CarInsuranceCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Car Insurance Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Figure out how much auto liability coverage actually protects you, based on what you own and
            earn, not a generic recommendation. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <CarInsuranceCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-car-insurance-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who This Car Insurance Coverage Calculator Is For
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for two moments: buying your first policy and deciding you&apos;ve been
            carrying the state minimum for too long. Both situations share the same underlying question,
            which is not &ldquo;what&apos;s the cheapest policy available&rdquo; but &ldquo;what limit actually protects what I
            have.&rdquo; Drivers with meaningful savings, home equity, or a steady income face more financial
            exposure in an at-fault accident than drivers just starting out, and the right liability
            limit reflects that difference rather than treating every driver the same way. If you&apos;re
            comparing quotes right now, run your numbers here first so you know what limit to request
            before a quote form nudges you toward whatever the insurer defaults to.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Recommendation Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator adds your entered assets (savings, investments, and home equity combined) to
            your annual income to produce a single exposure figure. That figure matters because a
            judgment against you after an at-fault accident isn&apos;t limited to what you own today; courts
            can also order wage garnishment, which is why income is part of the exposure number and not
            just a net worth snapshot. The tool then matches that exposure against three standard
            liability tiers available from most insurers, 100/300/100, 250/500/100, and 250/500/250, and
            recommends the smallest tier that covers your exposure, with a floor of 100/300/100
            regardless of how low your assets are today, since future earnings and future assets are
            still exposed even when current savings are thin.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Property damage liability gets a separate check: if your own vehicle is worth more than
            $50,000, the calculator bumps the recommended property damage limit up to at least $250,000,
            since a serious multi-vehicle accident involving a higher-value car can exceed a lower limit
            quickly. Collision and comprehensive get evaluated against the commonly cited 10% rule,
            comparing your entered annual premium against 10% of your vehicle&apos;s actual cash value. Gap
            insurance gets flagged whenever your entered loan balance exceeds your vehicle&apos;s actual cash
            value, since that&apos;s the exact scenario gap insurance is designed to close.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a driver with $75,000 in combined savings and home equity, an annual income of
            $65,000, a car worth $18,000, no remaining loan balance, and a $650 annual premium for
            collision and comprehensive. Their exposure figure is $140,000 ($75,000 plus $65,000), which
            falls under the calculator&apos;s $300,000 floor, so it recommends 100/300/100 rather than a
            higher tier, since the floor already covers this exposure with room to spare. Their $650
            premium is well under the $1,800 that the 10% rule would flag (10% of $18,000), so collision
            and comprehensive look reasonably priced for the coverage. With no loan balance, gap
            insurance isn&apos;t relevant. That&apos;s a materially different, and more defensible, answer than
            simply carrying whatever limit a quote form defaulted to.
          </p>

          <AdInArticle slot="tool-car-insurance-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is anchoring on the state minimum because it&apos;s the number a quote
            form shows first, without checking whether it actually covers a realistic accident. A close
            second is carrying collision and comprehensive on a vehicle that&apos;s dropped enough in value
            that the premium no longer makes sense relative to the payout, simply because the coverage
            was never revisited after the first year. A third is financing or leasing a new vehicle
            without gap insurance during the first two or three years, exactly the window when a loan
            balance is most likely to exceed a vehicle&apos;s rapidly depreciating value.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the asset-protection method, adding assets to a year of income and
            matching against standard liability tiers, is a reasonable way to size a limit, which is a
            common approach among insurance educators but not the only valid one. It does not know your
            state&apos;s actual minimum requirement, your driving record, your insurer&apos;s specific underwriting
            rules, or any state-specific coverage mandate such as no-fault or personal injury protection
            rules that apply in some states. The 10% rule for collision and comprehensive is a widely
            cited guideline, not a formula every advisor agrees with, and it doesn&apos;t account for whether
            you could actually afford to replace your vehicle out of pocket if you dropped that coverage.
            Treat every figure here as a planning number to bring into a conversation with a licensed
            insurance agent, not as a final decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Bodily injury liability</strong> — pays for injuries you cause to other people in an
              at-fault accident, expressed as a per-person and a per-accident limit.
            </li>
            <li>
              <strong>Property damage liability</strong> — pays for damage you cause to someone else&apos;s
              vehicle or property.
            </li>
            <li>
              <strong>Actual cash value</strong> — what your vehicle would sell for today, after
              depreciation, rather than what you paid for it.
            </li>
            <li>
              <strong>Gap insurance</strong> — covers the difference between what you owe on a loan or
              lease and your vehicle&apos;s actual cash value after a total loss.
            </li>
            <li>
              <strong>Uninsured/underinsured motorist coverage</strong> — pays for your losses when the
              at-fault driver has no insurance or not enough to cover the damage.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For coverage definitions beyond what&apos;s covered here, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on auto coverage types, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down what each part of a standard policy actually pays for. Before buying or changing
            coverage, confirm your exact state requirements with your{" "}
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
            category. Once you have a liability limit in mind, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to pair it with, and the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the same how-much-do-I-need question for other policy types. If you&apos;re ever comparing
            an actual settlement offer instead of planning ahead of a purchase, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            are the closer fit.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools is a library of free, browser-based calculators for understanding insurance
            coverage, costs, claims, and deductibles. Every calculator runs in your browser, asks for
            nothing but the numbers you choose to enter, and is built to help you show up to a
            conversation with a licensed agent already knowing what you&apos;re asking for.
          </p>
        </section>
      </div>
    </>
  );
}

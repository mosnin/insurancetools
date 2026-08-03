import type { Metadata } from "next";
import Link from "next/link";
import { PolicyUpgradeValueCalculatorTool } from "@/components/tools/PolicyUpgradeValueCalculatorTool";
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

const tool = getToolBySlug("policy-upgrade-value-calculator")!;

const TITLE = "Policy Upgrade Value Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this policy upgrade value calculator to see the added premium, added coverage, and cost per extra $1,000 of protection before you raise a limit or add an endorsement.";
const PAGE_URL = `${SITE_URL}/tools/coverage/policy-upgrade-value-calculator`;

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
    question: "Does this policy upgrade value calculator tell me if the upgrade is worth buying?",
    answer:
      "No, and that's deliberate. It calculates a neutral cost-per-additional-coverage figure from the numbers you enter, but whether an upgrade is worth its added premium depends on your own risk tolerance, what you could afford to pay out of pocket without it, and factors this tool has no way to know. Use the figure to compare upgrade options against each other, then decide for yourself or with a licensed agent.",
  },
  {
    question: "What counts as a good cost per $1,000 of added coverage?",
    answer:
      "There's no universal threshold, and this tool doesn't invent one. What makes a figure reasonable depends on the type of coverage, how much protection you already carry, and how the same insurer prices other limits on the same policy. The most useful way to read the number is comparatively: run two or three upgrade options through this calculator and see which one buys extra protection more cheaply per dollar, rather than judging any single figure in isolation.",
  },
  {
    question: "What's the difference between a coverage limit increase and adding an endorsement?",
    answer:
      "A coverage limit increase raises the maximum a policy already includes will pay out, like moving liability coverage from $100,000 to $300,000. An endorsement adds a type of protection that wasn't part of the base policy at all, such as adding water backup coverage to a homeowners policy. This calculator works the same way for both, since in both cases you're comparing a lower-cost, lower-protection baseline against a higher-cost, higher-protection option.",
  },
  {
    question: "Why is the cost per $1,000 sometimes very different from what the total premium increase suggests?",
    answer:
      "A large-looking premium increase can still be a cheap way to buy protection if it also buys a large increase in coverage, and a small premium increase can be an expensive way to buy protection if it only adds a small amount of coverage. Looking at the added premium alone, without dividing by how much extra protection it buys, is the single most common way people misjudge whether an upgrade is reasonably priced.",
  },
  {
    question: "Can I use this for any type of insurance policy?",
    answer:
      "Yes. The calculation is intentionally generic: it only needs a current limit, a current premium, an upgraded limit, and an upgraded premium, so it works the same way for auto liability limits, homeowners dwelling coverage, renters personal property limits, umbrella policies, or a single added endorsement. It doesn't apply to changes that don't involve a coverage limit, such as adding a named driver or changing a deductible, which are priced differently.",
  },
  {
    question: "What if the upgraded premium quote seems too high compared to my current premium?",
    answer:
      "Run the same coverage increase past a second insurer or ask your current agent whether the increase reflects the added limit itself or a change elsewhere on the policy, like a rate adjustment unrelated to the upgrade. This calculator only compares the two quotes you enter; it can't tell you whether either quote reflects a fair market price.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Coverage Tools", href: "/tools/coverage" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function PolicyUpgradeValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Policy Upgrade Value Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See exactly what a coverage upgrade costs and how much extra protection it buys, normalized
            into one comparable number. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="coverage" />
        </div>

        <div className="mt-2">
          <PolicyUpgradeValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-policy-upgrade-value-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why a Premium Increase Alone Doesn&apos;t Answer the Question
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            An agent or renewal notice offers a higher limit, and the only number that shows up in bold
            is the new total premium. That number by itself answers almost nothing, because it doesn&apos;t
            say how much additional protection you&apos;re getting for it. A $150 annual increase could be
            buying you an extra $50,000 of liability coverage or an extra $5,000, and those are very
            different deals even though the premium line looks identical on the renewal page. This
            policy upgrade value calculator exists to put those two numbers, added premium and added
            coverage, in the same frame so you can judge the trade rather than just the sticker price.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone weighing a specific, already-quoted upgrade: raising a
            liability limit on an auto or homeowners policy, adding an endorsement like water backup or
            scheduled personal property, or increasing a renters or umbrella limit. It assumes you
            already have two real numbers in hand, your current premium and limit, and a quoted
            upgraded premium and limit, rather than trying to estimate what an upgrade might cost before
            you&apos;ve asked for a quote. If you haven&apos;t settled on a target coverage amount yet, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            category has tools built to help you land on that number first.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How the Cost-Per-$1,000 Metric Is Calculated
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator subtracts your current premium from the upgraded premium to get the added
            annual cost, and subtracts your current limit from the upgraded limit to get the added
            coverage. Dividing the added premium by the added coverage, then multiplying by 1,000,
            produces the cost per additional $1,000 of coverage: a normalized rate that lets you compare
            upgrades of very different sizes on the same basis, the same way a price-per-ounce lets you
            compare a small and a large bottle of the same product. A lower rate means this specific
            upgrade buys protection more efficiently; a higher rate means the same extra protection costs
            more here than it might through a different limit change or a different insurer. The tool
            also shows the percentage increase in premium alongside the percentage increase in coverage,
            since a 40% premium jump paired with a 300% coverage increase reads very differently from a
            40% premium jump paired with a 10% coverage increase.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a driver currently carrying $100,000 in liability coverage for $650 a year, quoted
            $740 a year to raise that limit to $300,000. The added premium is $90, and the added
            coverage is $200,000, so the cost per additional $1,000 of coverage works out to $0.45.
            Compare that against a second scenario: the same driver is quoted an extra $60 a year to add
            a $25,000 rental reimbursement endorsement. That upgrade&apos;s added coverage is $25,000, so its
            cost per $1,000 works out to $2.40, more than five times higher. Neither number says which
            upgrade to buy, since rental reimbursement and liability protection solve different problems,
            but side by side the liability increase is clearly the more efficient way to buy raw coverage
            dollars, which is exactly the kind of comparison a bare premium total can&apos;t show.
          </p>

          <AdInArticle slot="tool-policy-upgrade-value-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is judging an upgrade purely by how big the premium increase looks
            in isolation, without asking how much extra protection that increase buys. A $200 annual
            increase can sound steep next to a $650 base premium, but if it doubles or triples your
            coverage limit it may be one of the cheapest forms of protection available on the entire
            policy. The reverse mistake is just as common: a small-looking $40 increase can be an
            expensive way to buy a modest amount of added coverage if the limit barely moves. Normalizing
            by the coverage added, rather than reacting to the premium change alone, is the entire point
            of the metric this calculator produces.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the premium and limit figures you enter are accurate and reflect
            like-for-like coverage, meaning the upgraded quote isn&apos;t bundling in an unrelated change
            such as a different deductible or a newly added driver. It has no knowledge of your policy&apos;s
            actual wording, exclusions, or your insurer&apos;s underwriting rules, and it cannot tell you
            whether a given cost per $1,000 is cheap or expensive in absolute terms, since that depends
            on the coverage type, your existing limits, and how the insurer prices risk generally. Most
            importantly, this tool does not and cannot tell you whether an upgrade is worth buying. That
            judgment depends on your risk tolerance and financial situation, and it belongs with you and,
            where appropriate, a licensed insurance agent, not with a calculator.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Coverage limit</strong> — the maximum dollar amount a policy will pay out for a
              covered loss under a specific type of protection.
            </li>
            <li>
              <strong>Endorsement</strong> — a change added to a base policy that adds, removes, or
              modifies coverage, such as adding water backup protection to a homeowners policy.
            </li>
            <li>
              <strong>Marginal cost of coverage</strong> — the added premium required to buy one more
              unit of coverage on top of what a policy already includes, which is what the cost-per-$1,000
              figure on this page measures.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how coverage limits and endorsements work within a standard policy, the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on coverage types, and the{" "}
            <a
              href="https://www.iii.org/article/how-buy-homeowners-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how endorsements and limit changes typically affect pricing. If you&apos;re also
            weighing a change to your deductible alongside a coverage upgrade, the{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s deductible guide
            </a>{" "}
            covers that mechanic separately, and your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            can confirm any state-specific rules that apply to the coverage you&apos;re changing.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              Coverage calculators
            </Link>{" "}
            category. If you&apos;re trying to find where your coverage might already be too thin before
            pricing an upgrade, the{" "}
            <Link href="/tools/coverage/coverage-gap-calculator" className="text-blue-600 hover:underline">
              coverage gap calculator
            </Link>{" "}
            is the tool to start with, and once you&apos;ve settled on a limit, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            can help you decide what deductible to pair it with.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that turn insurance renewal notices and quote
            comparisons into numbers you can actually reason about, right in your browser, without
            handing over an email address to see a result.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { MultiCarDiscountSavingsCalculatorTool } from "@/components/tools/MultiCarDiscountSavingsCalculatorTool";
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

const tool = getToolBySlug("multi-car-discount-savings-calculator")!;

const TITLE = "Multi-Car Discount Calculator: See Your Bundled Savings | Insurance Tools";
const DESCRIPTION =
  "This multi-car discount calculator turns your insurer's quoted percentage into real dollars, comparing separate per-vehicle premiums against one bundled multi-car policy.";
const PAGE_URL = `${SITE_URL}/tools/auto/multi-car-discount-savings-calculator`;

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
    question: "How much does a multi-car discount typically save?",
    answer:
      "Most insurers advertise a range of roughly 10% to 25% off the combined premium, though the exact figure depends on the insurer, your state, and how many vehicles you're adding. This calculator doesn't guess that number for you; enter the percentage your agent or quote actually quoted, and it converts it into a dollar figure using your own standalone premiums so you can see whether it's worth combining policies.",
  },
  {
    question: "Do multi-car discounts apply if my vehicles are insured with different companies?",
    answer:
      "Not automatically. A multi-car discount generally requires every vehicle to sit on the same policy with the same named insured, which means splitting vehicles across two different insurers usually forfeits it entirely. If that's your situation right now, it's still worth asking one of your current insurers for a combined multi-car quote before you assume the split arrangement is cheaper overall.",
  },
  {
    question: "Does adding a third or fourth vehicle increase the discount percentage?",
    answer:
      "Sometimes, but not reliably. Some insurers scale the discount up slightly for three or more vehicles on one policy, while others cap it at a flat percentage no matter how many cars you add. This tool combines two vehicles' premiums by design; if you're adding a third or fourth, fold their standalone premium into the second field and re-check the quoted percentage for that household size specifically.",
  },
  {
    question: "Will I lose the multi-car discount if I remove one vehicle from the policy?",
    answer:
      "Usually, yes, at least partially. Insurers recalculate the household discount at renewal based on how many vehicles remain on the policy, so selling a car, giving one to a teen driver on a separate policy, or moving a vehicle to another household member can shrink or eliminate the discount on the vehicles that stay. Ask your agent how the percentage changes before you restructure who's insured where.",
  },
  {
    question: "Is a multi-car discount the same thing as a multi-policy bundle discount?",
    answer:
      "No, they're separate discounts that some insurers let you stack. A multi-car discount rewards insuring more than one vehicle on the same auto policy; a multi-policy (or bundle) discount rewards combining auto with a different product, such as home or renters insurance, under the same company. This calculator only models the vehicle-based discount; a homeowners or renters bundle would be a separate savings figure on top of what's shown here.",
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

export default function MultiCarDiscountSavingsCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Multi-Car Discount Savings Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            A multi-car discount calculator that turns an insurer&apos;s quoted percentage into an actual
            dollar figure, so &ldquo;15% off&rdquo; stops being an abstraction and starts being a number you can
            compare against staying on separate policies.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <MultiCarDiscountSavingsCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-multi-car-discount-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How a Multi-Car Discount Calculator Turns a Percentage Into Dollars
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Insurers rarely lead a quote with a dollar amount for bundling; they lead with a percentage,
            because a percentage sounds appealing regardless of what it&apos;s actually a percentage of. Fifteen
            percent off a $400 premium and fifteen percent off a $2,400 premium are very different amounts
            of money, and the quote screen usually doesn&apos;t do that math for you. This calculator does two
            things a raw discount percentage can&apos;t: it adds your vehicles&apos; standalone premiums into a single
            combined figure, then applies your quoted discount to that figure so the savings show up in
            dollars per year and dollars per month, not just as a percentage sign next to an unfamiliar
            base number.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The inputs are deliberately simple: what each vehicle would cost insured on its own (from a
            current bill, a past quote, or a fresh standalone quote), and the multi-car discount percentage
            your insurer or agent quoted you. The calculator sums the two premiums, multiplies that total by
            the discount percentage, and reports the savings, the effective discount rate, and what the
            bundled annual and monthly total comes out to. Nothing about your driving history, your state,
            or an insurer&apos;s underwriting enters into it, because none of that changes the arithmetic once
            you already have both numbers in hand.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a household has a sedan that would cost $1,400 a year insured by itself and a second car,
            a few years newer, that would cost $1,100 a year on its own. Insured separately, that&apos;s $2,500
            combined. Their agent quotes a 15% multi-car discount for putting both vehicles on one policy.
            Fifteen percent of $2,500 is $375 a year, or about $31 a month, bringing the bundled total down
            to $2,125 a year. That $375 is the number worth comparing against any loyalty pricing, a
            different insurer&apos;s lower standalone rate, or the hassle of managing two separate policies,
            rather than treating &ldquo;15% off&rdquo; as self-evidently worth taking.
          </p>

          <AdInArticle slot="tool-multi-car-discount-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is most useful for a household that&apos;s currently splitting vehicles across two
            insurers, or for anyone about to add a second car, a new driver&apos;s car, or a teenager&apos;s car to
            an existing policy. It&apos;s also useful when a renewal notice arrives with a multi-car discount
            percentage buried in the declarations page and you want to know, in plain dollars, what that
            line item is actually saving you before you decide whether to shop the policy elsewhere. If
            you&apos;re weighing a specific liability limit rather than a bundling decision, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            answers that separate question.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Common Mistakes When Estimating Multi-Car Savings
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is comparing the discount percentage across two different insurers as
            if it were the whole story. An insurer offering a 20% multi-car discount on a higher base rate
            can still cost more in dollars than an insurer offering 12% on a lower base rate, which is
            exactly why this calculator asks for the underlying premiums rather than just the percentage.
            A second mistake is assuming the discount is permanent; it&apos;s recalculated at renewal and can
            shrink if a vehicle is removed from the policy. A third is forgetting that a multi-car discount
            and a multi-policy (home-plus-auto) bundle discount are separate line items that some insurers
            stack and others don&apos;t, so the total savings on a declarations page may reflect more than just
            the vehicle-bundling piece this tool estimates.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the two premium figures you enter are accurate standalone quotes or
            bills, and that the discount percentage you enter is the one your insurer actually applies to
            your specific vehicles and household. It doesn&apos;t verify eligibility rules, such as requiring
            every vehicle to be registered at the same address or requiring the same named insured across
            policies, and it doesn&apos;t account for other factors that shift a premium at the same time as a
            multi-car change, like adding a new driver or changing a deductible. Treat the output as a
            planning estimate to bring into a quote conversation, not as a guaranteed price. Discount rules
            and availability vary by insurer and by state, so confirm the exact terms with a licensed agent
            before assuming this figure will match your bill.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Multi-car discount</strong> — a percentage reduction some insurers apply when two or
              more vehicles from the same household are insured on a single auto policy.
            </li>
            <li>
              <strong>Named insured</strong> — the person or people listed on a policy as the primary
              policyholder; multi-car eligibility usually requires vehicles to share a named insured.
            </li>
            <li>
              <strong>Bundle (multi-policy) discount</strong> — a separate discount for combining different
              types of insurance, such as auto and home, with one insurer, distinct from a multi-car
              discount.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how insurers price auto policies and what discounts commonly factor in, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on auto coverage and shopping for a policy, and the{" "}
            <a
              href="https://www.iii.org/article/auto-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the factors, including household and vehicle bundling, that commonly affect an auto
            premium. Discount eligibility and state-specific rules ultimately sit with each insurer and
            your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>
            , so confirm the specifics there before relying on an estimate.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. For the broader question of how much coverage each of your bundled vehicles should
            actually carry, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover that decision across policy types once your multi-car savings are figured in.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn confusing policy math, like a
            discount percentage with no dollar figure attached, into a number you can actually act on. No
            account, no phone number, no email required to see a result.
          </p>
        </section>
      </div>
    </>
  );
}

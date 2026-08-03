import type { Metadata } from "next";
import Link from "next/link";
import { PayPerMileSavingsCalculatorTool } from "@/components/tools/PayPerMileSavingsCalculatorTool";
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

const tool = getToolBySlug("pay-per-mile-savings-calculator")!;

const TITLE = "Pay-Per-Mile Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "This pay per mile insurance calculator compares your traditional annual premium against a per-mile program's base fee and mileage rate, then finds the exact breakeven mileage.";
const PAGE_URL = `${SITE_URL}/tools/auto/pay-per-mile-savings-calculator`;

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
    question: "How does this pay-per-mile insurance calculator find the breakeven mileage?",
    answer:
      "It solves the equation traditional premium equals annual base fee plus per-mile rate times miles driven, then rearranges it to isolate miles: (traditional premium minus annual base fee) divided by the per-mile rate. That's the exact mileage where both options cost the same for the numbers you entered. Drive fewer miles than that figure and the per-mile program is likely cheaper; drive more and traditional coverage likely wins.",
  },
  {
    question: "What counts as a 'mile' for pay-per-mile insurance billing?",
    answer:
      "This varies by program and isn't something this calculator can know. Some programs bill every mile the vehicle's tracking device records, including short errands and highway trips alike; others exclude certain trip types, cap the maximum billable miles per day, or estimate mileage differently if a device malfunctions. Read your specific program's billing terms before assuming your odometer total will match your bill exactly.",
  },
  {
    question: "Why is the pay-per-mile total sometimes higher even at low mileage?",
    answer:
      "The monthly base fee is charged regardless of how little you drive, so a program with a high base fee can cost more than a traditional policy even at very low mileage. This calculator flags that case directly: if the breakeven math produces a mileage at or below zero, it tells you traditional insurance is cheaper at every mileage level for the quote you entered, rather than showing a confusing negative number.",
  },
  {
    question: "Is pay-per-mile insurance the same as other usage-based insurance programs?",
    answer:
      "No. Pay-per-mile bills primarily on distance driven, using a base fee plus a rate per mile, which is what this calculator models. Other usage-based programs instead track driving behavior, like braking, speed, and time of day, and adjust a more traditional premium up or down based on a risk score. The two approaches use different math and this tool is built specifically for the per-mile, per-fee structure.",
  },
  {
    question: "Should I switch to pay-per-mile insurance based on this calculator alone?",
    answer:
      "Treat the result as a starting estimate, not a final decision. This tool only compares the premium numbers you enter; it doesn't know your coverage limits, deductibles, or whether the per-mile program offers the same protection as your current policy. Confirm that coverage levels match before comparing price, and get an actual quote from the per-mile provider, since promotional rates and mileage tiers can differ from a generic per-mile estimate.",
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

export default function PayPerMileSavingsCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Pay-Per-Mile Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See exactly how much a pay-per-mile program would cost against your current premium, and the
            precise mileage where one stops beating the other. Free, instant, no sign-up.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <PayPerMileSavingsCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-pay-per-mile-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Should Run the Numbers on Pay-Per-Mile Insurance
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Pay-per-mile insurance was built for a specific kind of driver, and the sales pitch works
            best when you actually match that profile rather than assuming it applies to everyone. Remote
            workers who stopped commuting, retirees who drive mostly for errands, a household&apos;s second
            car that mostly sits in the garage, and city dwellers who lean on transit or rideshare for
            daily trips are the classic candidates, because their annual mileage sits low enough that a
            flat monthly base fee plus a small per-mile charge undercuts what a traditional insurer
            assumes about the average driver. The catch is that &ldquo;low mileage&rdquo; is a guess for a lot of
            people until they actually run the math against a real quote, which is exactly what this
            calculator is for. If you drive more than you think, or a program&apos;s base fee is higher than
            it looks at first glance, the traditional policy can still come out ahead even for someone who
            genuinely doesn&apos;t drive much.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Breakeven Math Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A pay-per-mile program&apos;s annual cost has two parts: a monthly base fee that repeats twelve
            times a year regardless of mileage, and a per-mile rate multiplied by however many miles you
            actually drive. The calculator adds those together to get a total annual pay-per-mile cost,
            then compares it against the traditional annual premium you entered. The more useful number,
            though, isn&apos;t just today&apos;s comparison at your current mileage — it&apos;s the exact mileage where
            the two totals cross. That&apos;s found by rearranging the cost equation: subtract the annual base
            fee from the traditional premium, then divide the remainder by the per-mile rate. The result
            is the annual mileage at which both options cost precisely the same amount.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Sometimes that subtraction produces a number at or below zero, which would normally mean a
            nonsensical negative breakeven mileage. When that happens, the calculator doesn&apos;t display a
            confusing negative figure; instead it tells you plainly that the traditional policy is cheaper
            at every mileage level for the quote you entered, including driving zero miles a year. That
            situation usually means the per-mile program&apos;s base fee alone already costs more than your
            traditional premium, which can happen with programs that charge a higher flat fee than their
            marketing emphasizes.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a driver paying $1,400 a year for a traditional policy who gets a pay-per-mile quote
            with a $29 monthly base fee and a $0.06 per-mile rate. The annual base fee comes to $348 (
            $29 × 12). If that driver expects to put 6,000 miles on the car this year, the mileage charge
            adds $360 ($0.06 × 6,000), bringing the pay-per-mile total to $708 — a savings of $692 a year
            compared to the traditional policy. Solving the breakeven formula for this same quote, ($1,400
            − $348) ÷ $0.06, shows the two options would cost the same at roughly 17,533 miles a year. As
            long as this driver stays meaningfully under that number, which 6,000 miles comfortably does,
            the per-mile program keeps winning on price; if their driving pattern changed and they started
            commuting again, the math would shift in the traditional policy&apos;s favor well before they hit
            that ceiling.
          </p>

          <AdInArticle slot="tool-pay-per-mile-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is estimating annual mileage from memory instead of checking an actual
            odometer reading or trip log, which tends to undercount trips people don&apos;t think of as
            &ldquo;real driving,&rdquo; like short errands, school pickups, or weekend trips that add up faster than
            expected. A second mistake is comparing the advertised per-mile rate against a traditional
            premium without adding in the base fee, which understates the pay-per-mile total and makes the
            program look cheaper than it actually is. A third is treating a single year&apos;s estimate as
            permanent; mileage changes with a new job, a move, or a change in household vehicles, and a
            program that looked like a clear win at last year&apos;s driving pattern can lose that edge quickly.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the pay-per-mile program bills a flat monthly base fee plus a constant
            rate per mile with no tiered pricing, mileage cap, or promotional discount period, since those
            program-specific details aren&apos;t something a generic calculator can know. It does not account
            for differences in coverage limits, deductibles, or included features between your current
            policy and the per-mile program; a lower total price is only a real win if the underlying
            coverage is comparable. It also doesn&apos;t factor in how some programs define a billable mile
            differently than a plain odometer reading. Treat the output as a planning estimate to bring
            into an actual quote request, not a guaranteed price.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Usage-based insurance</strong> — a broad category of auto insurance pricing that
              adjusts cost based on how, or how much, a vehicle is driven, of which pay-per-mile is one
              specific type.
            </li>
            <li>
              <strong>Pay-per-mile insurance</strong> — a usage-based program that bills a flat monthly
              base fee plus a per-mile rate for distance actually driven, rather than a flat annual or
              semiannual premium.
            </li>
            <li>
              <strong>Breakeven mileage</strong> — the annual mileage at which two pricing structures cost
              exactly the same amount; below it one option is cheaper, above it the other is.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how usage-based programs fit into standard auto coverage, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on auto insurance types and pricing factors, and the{" "}
            <a
              href="https://www.iii.org/article/usage-based-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how usage-based and telematics programs are structured across the industry. Before
            switching policies, confirm your state&apos;s specific rules on usage-based programs with your{" "}
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
            category. If you&apos;d rather start by sizing the right liability limit before comparing pricing
            structures, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            covers that question, and the broader{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            handle the how-much-do-I-need question for other policy types.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance math you&apos;d
            otherwise have to guess at, like a mileage breakeven point, into a number you can see and
            trust. Nothing you type is stored or sent anywhere, and every tool is designed to leave you
            better prepared for a real conversation with an agent or provider.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { NewCarVsUsedCarInsuranceCostCalculatorTool } from "@/components/tools/NewCarVsUsedCarInsuranceCostCalculatorTool";
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

const tool = getToolBySlug("new-car-vs-used-car-insurance-cost-calculator")!;

const TITLE = "New Car vs Used Car Insurance Cost Calculator | Insurance Tools";
const DESCRIPTION =
  "Compare two real insurance quotes side by side with this new car vs used car insurance cost calculator, and see which premium is actually high relative to what each vehicle is worth.";
const PAGE_URL = `${SITE_URL}/tools/auto/new-car-vs-used-car-insurance-cost-calculator`;

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
    question: "Does a new car really cost more to insure than a used car?",
    answer:
      "Usually yes in raw dollars, since a new car has a higher value to repair or replace and insurers price collision and comprehensive coverage partly off that value. But the dollar gap alone doesn't tell you whether either premium is reasonable. This calculator divides each premium by its vehicle's value so you can see whether the new car's higher premium is proportional to its higher value, or whether one quote is out of line relative to what that specific car is worth.",
  },
  {
    question: "Where do I get the premium numbers to enter into this calculator?",
    answer:
      "From actual quotes: your current policy's declarations page, or quotes you've requested from insurers for each vehicle. This tool doesn't generate or estimate a premium for you, since real pricing depends on your driving record, location, credit-based insurance score where allowed, and each insurer's own underwriting, none of which this calculator has access to. It only compares numbers you supply.",
  },
  {
    question: "What is the 10% rule this calculator uses?",
    answer:
      "It's a widely cited guideline suggesting that if your annual collision and comprehensive premium exceeds roughly 10% of your vehicle's value, the coverage may cost more than it's statistically worth carrying, since a total loss payout would be close to what you'd have spent on premiums over a comparable stretch of years. It's a planning heuristic, not a rule any insurer or regulator enforces, and it doesn't account for whether you could cover a total loss out of pocket.",
  },
  {
    question: "Should I buy the used car just because it's cheaper to insure?",
    answer:
      "Not on insurance cost alone. A used car's lower premium usually reflects its lower value, but you should also weigh reliability, expected repair frequency, remaining warranty coverage, financing terms, and how long you plan to keep the car. This calculator answers one specific question, whether each vehicle's premium looks proportionate to its value, and is meant to sit alongside those other factors, not replace them.",
  },
  {
    question: "Why does the calculator only look at collision and comprehensive, not my full premium?",
    answer:
      "Collision and comprehensive are the two coverage types that scale most directly with a vehicle's value, since they pay out based on repairing or replacing that specific car. Liability, medical payments, and uninsured motorist coverage are priced more around your driving history and location than the vehicle itself, so mixing them into a value-based comparison would blur the exact question this tool is built to answer.",
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

export default function NewCarVsUsedCarInsuranceCostCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            New Car vs. Used Car Insurance Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Put two real quotes side by side and see which one is actually high, measured against what
            each vehicle is worth rather than which sticker number looks bigger.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <NewCarVsUsedCarInsuranceCostCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-new-vs-used-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why &ldquo;Which Car Costs More to Insure&rdquo; Is the Wrong Question
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Shoppers cross-shopping a new car against a comparable used one almost always ask their agent
            or a quote form the same question: which one costs more to insure. The answer is nearly always
            the new car, in dollars, and that answer is nearly useless on its own. A $1,100 premium on a
            $32,000 car and a $780 premium on a $14,000 car aren&apos;t two numbers you can compare directly,
            because they&apos;re insuring two completely different amounts of exposure. The more useful
            question is whether each premium is proportionate to what it&apos;s protecting, and that requires
            dividing, not just subtracting. This new car vs used car insurance cost calculator does that
            division for you and lines the two scenarios up so the comparison actually means something.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Tool Is Built For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is for anyone holding two quotes at once: a buyer deciding between a new trim and a
            two- or three-year-old version of the same model, a shopper choosing between a certified
            pre-owned car and a new one, or a current owner wondering whether their collision and
            comprehensive coverage on an aging vehicle still makes financial sense next to a replacement
            they&apos;re considering. If you only have one quote and no second vehicle to compare it against,
            the site&apos;s{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            is a better starting point; this tool is specifically for weighing two vehicles against each
            other.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Comparison Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You enter a value and a quoted annual collision-and-comprehensive premium for each vehicle.
            The calculator divides each premium by its own vehicle&apos;s value to produce a premium-to-value
            percentage, then checks that percentage against the commonly cited 10% rule: when collision and
            comprehensive together cost more than roughly 10% of a vehicle&apos;s value in a year, some
            drivers conclude the coverage costs more than it&apos;s statistically worth carrying, since a
            total-loss payout would land close to what they&apos;d have paid in premiums anyway. The
            calculator applies that same check independently to both vehicles rather than assuming it
            applies only to the older or cheaper one, since a poorly priced quote can show up on either
            side. Nothing here estimates or fabricates a premium; both numbers come from you, typically
            from real quotes or your current declarations page.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say you&apos;re cross-shopping a new compact SUV valued at $32,000 with an $1,100 annual
            collision-and-comprehensive quote, against a three-year-old version of the same model valued
            at $14,000 with a $780 annual quote for the same coverage. In raw dollars the new car costs
            $320 more per year to insure. But as a share of value, the new car&apos;s premium is about 3.4%
            of its worth, while the used car&apos;s premium is about 5.6% of its worth, both comfortably under
            the 10% threshold, but the used car is proportionally more expensive to insure relative to what
            it&apos;s worth. That&apos;s the opposite conclusion you&apos;d reach by looking at the dollar figures
            alone, and it&apos;s the kind of detail worth raising with the insurer quoting the used car, since
            it may signal a pricing factor (like a model with historically higher claim costs) that&apos;s
            worth understanding before you buy.
          </p>

          <AdInArticle slot="tool-new-vs-used-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes When Comparing Vehicles</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is comparing raw premium dollars and concluding the more expensive
            quote is the worse deal, without adjusting for how much more valuable the vehicle actually is.
            A second is comparing quotes that don&apos;t include the same coverage types or limits; a new
            car quote with a lower deductible or added coverage like new-car replacement isn&apos;t directly
            comparable to a used car quote without those add-ons. A third is using a purchase price for the
            used car instead of its current actual cash value, which inflates the denominator and makes an
            aging vehicle&apos;s coverage look more reasonable than it actually is.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the premiums you enter are for matching collision and comprehensive
            coverage, meaning comparable deductibles and coverage terms on both vehicles; if the two quotes
            differ in what they actually cover, the percentage comparison will be misleading no matter how
            precisely it&apos;s calculated. It uses the 10% rule as a planning guideline, not a formula every
            insurance advisor endorses, and it doesn&apos;t weigh whether you could personally absorb a
            total-loss cost out of pocket if you dropped coverage. It also doesn&apos;t account for liability,
            uninsured motorist, or medical payments coverage, which are priced around your driving record
            and location rather than the vehicle&apos;s value. Treat the output as a way to sanity-check two
            quotes against each other, not as a final purchase or coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Collision coverage</strong> — pays to repair or replace your own vehicle after a
              collision with another vehicle or object, regardless of fault.
            </li>
            <li>
              <strong>Comprehensive coverage</strong> — pays for damage to your own vehicle from causes
              other than a collision, such as theft, weather, or an animal strike.
            </li>
            <li>
              <strong>Premium-to-value ratio</strong> — the annual premium for a coverage type divided by
              the vehicle&apos;s value, used here to compare two differently priced vehicles on equal footing.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how collision and comprehensive coverage work, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on standard auto policy coverage types, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down what each part of a policy pays for and how insurers weigh vehicle value in
            pricing. The Insurance Information Institute also covers{" "}
            <a
              href="https://www.iii.org/article/what-determines-cost-my-auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              what determines the cost of auto insurance
            </a>{" "}
            in more detail. Before buying either vehicle, confirm the exact coverage terms behind any quote
            with the insurer offering it, and check your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            if you have questions about how a quote was priced.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. Once you&apos;ve picked a vehicle, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to pair with that premium, and the broader{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover how much coverage to carry beyond just collision and comprehensive.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn raw insurance numbers, quotes,
            premiums, deductibles, and coverage limits, into answers you can actually act on. Nothing you
            type is stored or sent off your device, and every tool is designed to leave you better prepared
            for a conversation with a licensed agent, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

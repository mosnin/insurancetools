import type { Metadata } from "next";
import Link from "next/link";
import { RentalReimbursementCalculatorTool } from "@/components/tools/RentalReimbursementCalculatorTool";
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

const tool = getToolBySlug("rental-reimbursement-calculator")!;

const TITLE = "Rental Reimbursement Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this rental reimbursement coverage calculator to size a daily and total rental car limit from your own local rate and repair timeline, then check an existing policy for gaps.";
const PAGE_URL = `${SITE_URL}/tools/auto/rental-reimbursement-calculator`;

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
    question: "What does rental reimbursement coverage actually pay for?",
    answer:
      "Rental reimbursement (sometimes labeled transportation expense or loss-of-use coverage) pays toward a rental car while your own vehicle is laid up for repairs after a covered claim, such as a collision or a comprehensive loss like hail or theft. It does not pay out after every claim, and it does not cover routine maintenance or a car that's simply old and unreliable. It typically only applies when the underlying repair claim is itself covered by your collision or comprehensive coverage.",
  },
  {
    question: "How much rental reimbursement coverage do I need?",
    answer:
      "Multiply a realistic daily rental rate for a similar vehicle in your area by a realistic number of repair days, which is exactly what this calculator does. Most shortfalls happen because drivers accept a low default daily limit, often far under what a rental actually costs locally, or because they don't realize their total limit can run out before repairs are finished even when the daily limit looks fine.",
  },
  {
    question: "Why does my policy have both a daily limit and a total limit?",
    answer:
      "Insurers cap rental reimbursement two ways to control their own exposure: a per-day amount, and a maximum for the entire claim. A generous daily limit doesn't protect you if the total limit is small enough to run out after a week, and a generous total limit doesn't help if the daily limit is too low to cover your actual rental rate. This tool checks both caps separately because either one alone can leave you paying out of pocket.",
  },
  {
    question: "Does rental reimbursement cover a rental after a mechanical breakdown?",
    answer:
      "Generally no. Rental reimbursement is tied to a covered insurance claim, typically collision or comprehensive damage, not to mechanical failure or routine repairs. A blown engine or a dead transmission from ordinary wear isn't a claim this coverage responds to. Mechanical breakdown insurance and manufacturer warranties are the tools built for that situation, not rental reimbursement.",
  },
  {
    question: "Is rental reimbursement the same thing as the rental company's collision damage waiver?",
    answer:
      "No, and mixing them up is a common source of double coverage. Rental reimbursement pays for a rental car you need because your own car is being repaired after your claim. A rental company's collision damage waiver instead protects you against damage you might cause to the rental car itself while you're driving it. Many personal auto policies already extend some protection to a rental car you're driving, which is worth confirming with your agent before paying for the counter's waiver on top of it.",
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

export default function RentalReimbursementCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Rental Reimbursement Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size a daily and total rental car limit from your own local rental rate and repair
            timeline, then check whether an existing policy&apos;s limits would actually cover it.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <RentalReimbursementCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-rental-reimbursement-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Rental Reimbursement Coverage Covers</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Rental reimbursement is an optional add-on to collision and comprehensive coverage, not a
            standalone policy. It pays toward a rental car while your own vehicle sits in a body shop
            after an accident or a comprehensive loss like hail, a fallen tree, or theft, but only when
            the underlying repair itself is a covered claim. It&apos;s easy to assume this coverage works like
            a blank check for a replacement car, but the payout is bounded by two separate limits an
            insurer sets independently: a daily dollar amount, and a total dollar amount for the entire
            claim. Most drivers only notice the daily limit when they buy the policy and never check the
            total limit at all, which is exactly the blind spot this calculator is built to close.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run the Numbers Here</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is most useful in three situations: shopping for rental reimbursement coverage for
            the first time and needing a starting number instead of guessing, already carrying it and
            wanting to confirm the limits are still realistic after rental prices moved, or filing a
            claim right now and trying to figure out how much of the rental bill will land back on your
            card. If you don&apos;t yet carry this coverage at all, leave the two optional current-limit
            fields at $0 and use the calculator purely to see what a reasonable daily and total limit
            would look like before you call an agent.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Calculator Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You supply two numbers this tool intentionally does not guess for you: your local daily
            rental rate for a comparable vehicle, and how many days you expect your car to be in the shop
            for a covered repair. Multiplying those gives your total estimated rental need. National
            average rental prices and generic repair timelines vary too widely by region, vehicle class,
            and the nature of the damage to be useful as defaults, so the calculator asks for your own
            figures rather than presenting a borrowed average as fact. The repair-day field starts at 10
            as an editable placeholder to get you moving, not as a claim about how long your specific
            repair will take.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            If you enter a current policy&apos;s daily and total limits, the calculator checks each one
            separately. The daily check compares your entered rental rate against the daily limit and
            reports any per-day gap. The total check applies that same daily cap across your repair-day
            estimate and compares the result against the total limit, which is what catches the scenario
            where a total limit runs out well before repairs are finished even though the daily amount
            looked adequate on its own.
          </p>

          <AdInArticle slot="tool-rental-reimbursement-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Suppose a driver looks up a local rental rate of $52 a day for a car similar to their sedan,
            and their body shop estimates 12 days for a covered collision repair. Their total estimated
            need is $624 (12 days &times; $52). Their existing policy carries a $30 daily limit and a
            $900 total limit. The daily check flags a $22-per-day shortfall, since $52 minus the $30 cap
            leaves that difference uncovered every single day. The total check, though, comes back clean:
            at the capped $30-per-day rate the policy could pay for up to 30 days before the $900 total
            limit is exhausted, well past the 12 days estimated. The projected shortfall across the whole
            claim comes out to $264, driven entirely by the daily gap rather than the total limit. A
            different driver with a lower $40 daily rate but only a $300 total limit could see the
            opposite problem: an adequate daily amount that still runs out after 7 or 8 days if repairs
            stretch past that.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Where Drivers Get Caught Off Guard</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent surprise is a driver who checked the daily limit years ago, when it matched
            local rental prices, and never revisited it as rental rates climbed. A second is assuming a
            generous total limit means the coverage is generous overall, without noticing the daily cap
            is what actually constrains the rental choice available at the counter. A third is confusing
            rental reimbursement with a rental company&apos;s own collision damage waiver, and either paying
            for both or assuming one covers what only the other does. A fourth is expecting this coverage
            to respond to a mechanical breakdown rather than a covered accident or comprehensive claim,
            which it generally does not.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes your entered daily rate and repair-day estimate are reasonably
            accurate for your situation; it has no access to real rental pricing or to your specific
            claim, so the output is only as good as the two numbers you provide. It assumes a simple cap
            structure, a flat daily limit multiplied by days and bounded by a flat total limit, which
            matches how most rental reimbursement coverage is written but may not match every policy&apos;s
            exact wording, waiting periods, or exclusions. It does not know your insurer&apos;s specific
            available limit tiers, your state&apos;s rules, or whether your particular claim would even
            qualify for rental reimbursement in the first place. Treat every number here as a planning
            estimate to bring into a conversation with a licensed agent, not as a guaranteed payout.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Worth Knowing</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Rental reimbursement (transportation expense) coverage</strong> — an optional add-on
              that pays toward a rental car while your own vehicle is being repaired after a covered
              collision or comprehensive claim.
            </li>
            <li>
              <strong>Daily limit</strong> — the maximum amount the coverage pays per day of rental,
              regardless of what the rental actually costs.
            </li>
            <li>
              <strong>Total/max limit</strong> — the maximum the coverage pays for the entire claim, which
              can be reached before the repair is finished even if the daily limit is adequate.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how rental reimbursement fits into a standard auto policy, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on optional auto coverages, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down what each part of a personal auto policy pays for. Confirm your own policy&apos;s
            exact wording and available limit tiers with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or a licensed agent before buying or changing coverage.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you&apos;re deciding whether to add this coverage alongside your liability limits,
            the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            covers the bigger picture of what to buy. The{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            handle the how-much-do-I-need question for other optional add-ons, and if you&apos;re already in
            the middle of a claim rather than planning ahead, the{" "}
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
            Insurance Tools builds free, browser-based calculators for the coverage decisions insurers
            expect you to make alone: what limits to request, what a claim is likely worth, and what a
            policy actually protects. Nothing you type here is stored or sent anywhere, and every
            calculator is meant to leave you better prepared for the conversation with a licensed agent,
            not to replace it.
          </p>
        </section>
      </div>
    </>
  );
}

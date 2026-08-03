import type { Metadata } from "next";
import Link from "next/link";
import { TeenDriverCostPlannerTool } from "@/components/tools/TeenDriverCostPlannerTool";
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

const tool = getToolBySlug("teen-driver-cost-planner")!;

const TITLE = "Teen Driver Insurance Cost Planner: What Adding One Costs | Insurance Tools";
const DESCRIPTION =
  "Plug in your own quote to see exactly what adding a teen driver adds to your bill, in dollars, once your insurer's surcharge and discounts are factored in.";
const PAGE_URL = `${SITE_URL}/tools/auto/teen-driver-cost-planner`;

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
    question: "Why doesn't this tool just tell me the average cost of adding a teen driver?",
    answer:
      "Because there isn't one honest number to give. The surcharge for adding a teen driver depends on your state, your specific insurer's underwriting rules, your teen's grades and driving record, the vehicle they'll drive, and your household's own claims history, and these factors combine differently at every company. A single published average would be accurate for almost no one who read it. This planner instead takes the surcharge and discount percentages straight from your own quote and does the arithmetic, so the dollar figure you see is built from your real numbers, not a guess.",
  },
  {
    question: "Where do I find the surcharge percentage my insurer is charging?",
    answer:
      "Ask your agent directly for the percentage increase tied to adding your teen, or compare your renewal premium before and after the teen is added and back into the percentage yourself. Many insurers will state it as a flat dollar amount instead of a percentage; if so, divide the added dollar amount by your current premium and multiply by 100 to get the percentage this tool expects.",
  },
  {
    question: "Is it actually cheaper to keep my teen on my policy instead of buying them a separate one?",
    answer:
      "In most cases, yes, keeping a teen as an added driver on an established household policy costs meaningfully less than insuring them on a standalone policy, since insurers spread some of the teen's risk across a policy that already has an established history. It isn't universal, though, and the gap varies by insurer. Ask your agent to quote both ways before deciding, especially if your teen will be the primary driver of their own vehicle.",
  },
  {
    question: "Can a telematics or usage-based program make the cost go up instead of down?",
    answer:
      "Yes. These programs monitor real driving behavior, things like hard braking, speeding, and late-night driving, and some insurers can raise a quote for a teen who scores poorly rather than only offering a discount for scoring well. Ask your agent how the specific program handles a below-average score before enrolling your teen, since the terms differ by insurer.",
  },
  {
    question: "Why does the tool default the surcharge and discount fields to 0%?",
    answer:
      "So the result never implies a number you didn't provide. A 0% default means the calculator adds nothing to your premium until you type in a real surcharge from your own quote, rather than silently assuming a figure on your behalf. Once you enter your insurer's actual percentages, the added cost updates immediately.",
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

export default function TeenDriverCostPlannerPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Teen Driver Insurance Cost Planner
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Turn your insurer&apos;s actual quote into a clear dollar figure. This teen driver insurance cost
            planner runs the surcharge and discount percentages you provide through the math, live, so you
            see exactly what adding your teen adds to your bill instead of a guessed national average.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <TeenDriverCostPlannerTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-teen-driver-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Planner Is For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the two or three weeks between finding out a teen is about to start
            driving and actually getting them on a policy. That window is usually filled with a driver&apos;s
            ed schedule, a permit test, and a vague sense of dread about what the family&apos;s car insurance
            bill is about to do, with no easy way to turn a quoted percentage into an actual monthly number.
            A teen driver insurance cost planner closes that gap: enter the surcharge your insurer quoted,
            enter any discounts they mentioned, and see the added cost in dollars instead of trying to do
            the percentage math on a renewal notice. It&apos;s equally useful for a family comparing quotes from
            two insurers, since the same math applied to each insurer&apos;s numbers makes the comparison
            apples-to-apples.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why There&apos;s No Universal &ldquo;Adding a Teen Costs X%&rdquo; Number
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every state regulates auto insurance rating factors differently, and a handful of states
            restrict or ban the use of certain factors, like credit-based scoring, that other states allow.
            Layer on top of that each insurer&apos;s own underwriting model, which weighs the teen&apos;s age,
            grades, driver&apos;s ed completion, the specific vehicle they&apos;ll drive, and the household&apos;s prior
            claims differently, and the same teen can generate wildly different surcharges from two
            insurers in the same state. A single household even sees this play out directly: the surcharge
            for a 16-year-old on a sedan is rarely the same as the surcharge for the same teen on a sports
            coupe, because vehicle risk rating is layered on top of driver risk rating, not replaced by it.
            Publishing one average percentage would flatten all of that into a number that&apos;s wrong for
            almost every reader. This planner asks for your real numbers instead, because your real numbers
            are the only ones that are actually correct for your household.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Added Cost Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The formula is intentionally simple, since the complexity belongs in your insurer&apos;s
            underwriting model, not in this tool pretending to replicate it. Net added cost equals your
            current annual premium, multiplied by the surcharge percentage minus your good student discount
            percentage minus your telematics or usage-based program discount percentage, divided by 100.
            The result updates as you type, and the planner also shows the new estimated annual premium
            (your current premium plus the net added cost) and the monthly difference, since most families
            think in monthly terms even when the policy bills annually.
          </p>

          <AdInArticle slot="tool-teen-driver-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a household currently pays $2,200 a year for auto insurance, and their agent quotes a 90%
            surcharge for adding their newly licensed 16-year-old to the policy. That alone would add
            $1,980 a year. But the teen carries a B+ average, qualifying for a 10% good student discount,
            and the family enrolls in the insurer&apos;s telematics program, which the agent quotes as good for
            another 15% off once it&apos;s active. Net change: 90% minus 10% minus 15%, or 65%. Applied to the
            $2,200 base premium, that&apos;s $1,430 added for the year, or roughly $119 a month, bringing the
            new annual premium to about $3,630. That&apos;s a meaningfully different, and more actionable,
            number than the initial 90% headline figure the agent led with, and it&apos;s the exact scenario
            this planner is built to work through.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is reacting to the surcharge percentage alone without checking whether
            any discounts apply, since agents don&apos;t always lead with the good student or telematics
            discount unless asked directly. A close second is assuming a teen needs their own separate
            policy by default; for most households, staying on the parent&apos;s policy is the cheaper path,
            and a separate policy should be a deliberate comparison, not a default. A third mistake is
            enrolling in a telematics program without asking how it handles a below-average score, since
            some programs can raise a premium for risky driving rather than only lowering it for cautious
            driving.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This planner assumes the surcharge and discount percentages you enter are accurate reflections
            of your actual quote, and it performs no rate lookup of its own, by design, since state and
            insurer rules change too often and vary too widely for a static number to stay accurate. It
            does not know your state&apos;s specific rating rules, your insurer&apos;s underwriting model, or
            whether a discount you&apos;ve entered actually stacks with another discount on your policy the way
            the math here assumes; some insurers cap total discounts or apply them in a different order.
            Treat the output as a planning estimate to bring into a conversation with your agent, not as a
            locked-in quote.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Surcharge</strong> — a percentage or flat-dollar increase an insurer applies to a
              policy for a specific added risk, such as adding a newly licensed teen driver.
            </li>
            <li>
              <strong>Telematics / usage-based insurance program</strong> — a program that tracks real
              driving behavior through a mobile app or plug-in device, using that data to adjust a
              premium up or down instead of relying only on age and demographics.
            </li>
            <li>
              <strong>Named driver</strong> — a driver formally listed on a policy, as opposed to an
              excluded driver, who is specifically barred from coverage while operating the household&apos;s
              vehicles.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how personal auto policies rate drivers, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on auto coverage and rating factors, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains what a standard personal auto policy covers and how it&apos;s priced. Because rating
            rules differ by state, confirm what applies where you live with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            before treating any percentage as final.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This planner is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you haven&apos;t revisited your liability limits since before your teen started
            driving, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            is worth running next, since a new driver in the household is exactly the kind of change that
            should prompt a fresh look at your limits. For the how-much-coverage-do-I-need question more
            broadly across other policy types, see the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>
            .
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance paperwork into
            numbers you can actually act on. Nothing you type into this planner is stored or sent
            anywhere; it exists so a real quote, not a guessed statistic, is what drives the answer you
            see.
          </p>
        </section>
      </div>
    </>
  );
}

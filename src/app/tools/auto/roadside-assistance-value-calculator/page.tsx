import type { Metadata } from "next";
import Link from "next/link";
import { RoadsideAssistanceValueCalculatorTool } from "@/components/tools/RoadsideAssistanceValueCalculatorTool";
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

const tool = getToolBySlug("roadside-assistance-value-calculator")!;

const TITLE = "Roadside Assistance Value Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this roadside assistance value calculator to compare a policy add-on, a standalone membership, and paying per incident, and see which is cheapest for you.";
const PAGE_URL = `${SITE_URL}/tools/auto/roadside-assistance-value-calculator`;

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
    question: "Is roadside assistance worth it if I only drive locally?",
    answer:
      "It depends on how often you'd actually use it and what a local tow or lockout costs where you live, not on a universal rule. A driver in a dense city with cheap, fast towing options and a AAA-equivalent app already installed on their phone may realistically face a low per-incident cost. A driver in a rural area with one tow company covering fifty miles may face a much higher per-incident cost, which tilts the math toward coverage even at a low incidents-per-year estimate. Enter your own local tow price above rather than assuming a national average, since local pricing swings widely.",
  },
  {
    question: "AAA vs. insurance company roadside assistance: which is better?",
    answer:
      "Neither wins automatically. A standalone membership like AAA usually includes extras beyond towing, such as trip-interruption reimbursement, ID theft monitoring add-ons, or discounts unrelated to your car, and its price and service network don't depend on your auto insurer. A policy add-on is typically cheaper per year but is limited to what's listed in your policy's roadside assistance endorsement, and repeated use can sometimes draw attention at renewal in ways a standalone membership's use does not. Compare the two using their actual annual costs and what's included, not brand reputation alone.",
  },
  {
    question: "How much does a tow actually cost?",
    answer:
      "This calculator intentionally doesn't supply a number, because local tow pricing varies by region, distance, vehicle type, and time of day (many companies charge more for nights, weekends, or highway calls) by enough that a single national average would mislead more people than it would help. Call a local towing company or check a recent bill to get a realistic per-incident figure for your area before running the comparison.",
  },
  {
    question: "What does roadside assistance typically not cover?",
    answer:
      "Coverage details vary by insurer and by membership tier, but common exclusions include tows beyond a set mileage radius (with the excess billed to you), assistance for a vehicle that isn't running because of neglected maintenance, commercial-use vehicles, and a cap on how many service calls are included per policy term. Read your specific policy or membership terms rather than assuming the plans behave identically.",
  },
  {
    question: "Can I add roadside assistance to my policy mid-term, or only at renewal?",
    answer:
      "Most insurers let you add or remove a roadside assistance endorsement any time you contact them, not only at renewal, though the change typically takes effect on your next billing cycle rather than immediately. Ask your agent or insurer directly, since the exact process differs by company and by state.",
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

export default function RoadsideAssistanceValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Roadside Assistance Value Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Compare a policy add-on, a standalone membership, and paying out of pocket for the tows,
            lockouts, and jump starts you actually expect, using your own local numbers instead of a
            national average.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <RoadsideAssistanceValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-roadside-value-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Should Use This Roadside Assistance Value Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Roadside assistance is one of the few insurance add-ons that costs almost nothing to skip and
            almost nothing to add, which is exactly why so few people ever run the numbers on it. You add
            it once at signup, forget it exists, and either never use it or discover years later that
            you&apos;ve paid far more in premiums than you&apos;d ever have spent calling a tow truck directly.
            This tool is for anyone weighing that decision honestly: drivers deciding whether to keep an
            existing add-on, drivers comparing a policy add-on against a standalone membership like AAA,
            and drivers who&apos;ve simply never had roadside coverage and want to know if paying per incident
            has quietly been the cheaper path all along.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Comparison Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator lines up three ways people actually pay for roadside help and puts them on the
            same annual basis so they can be compared directly. The first is a policy add-on, the flat
            annual amount your insurer charges to attach roadside assistance to your existing auto policy.
            The second is a standalone membership, priced and billed independently of your insurer, which
            this tool treats as optional since not everyone is considering one. The third is paying per
            incident with no coverage at all, calculated by multiplying the cost you&apos;d pay for a single
            tow, lockout, jump start, or flat tire by the number of incidents you realistically expect in a
            year. That last number is the one most people get wrong in either direction, guessing zero
            because nothing has happened yet or guessing high because one bad winter is still fresh in
            memory, so the calculator lets you adjust it and see the comparison update immediately.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Once all three annual figures exist, the tool marks whichever is lowest as cheapest for your
            entered numbers, and it calculates a breakeven point: the number of incidents per year at which
            the policy add-on&apos;s cost exactly equals what you&apos;d pay going incident by incident. Below that
            number, paying as incidents happen is cheaper on paper; above it, the add-on wins. That
            breakeven framing matters more than a flat cheapest/most-expensive label, because it tells you
            how sensitive the decision is to your own usage estimate rather than presenting a single answer
            as if it were guaranteed.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a driver&apos;s insurer quotes $30 a year for the roadside assistance add-on. They call a local
            towing company and are quoted roughly $125 for an average tow in their area, and after thinking
            about it honestly, they expect about one roadside incident per year, mostly the odd dead
            battery or lockout. Paying per incident at that rate would run about $125 a year at their
            estimated usage, well above the $30 add-on, so the add-on comes out ahead by roughly $95 a year
            given those numbers. The calculator&apos;s breakeven figure confirms why: at $125 per incident, the
            add-on pays for itself at just 0.24 incidents a year, meaning even a driver who needs help once
            every four years comes out ahead with the add-on. If that same driver were instead quoted $65
            for a standalone membership, the add-on would still be the cheapest of the three options at
            their usage rate, and the membership would only pull ahead if it bundled in enough extra value,
            like trip-interruption coverage, to justify the difference on its own.
          </p>

          <AdInArticle slot="tool-roadside-value-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps You Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is anchoring on a national average tow price instead of a local one,
            when towing costs are heavily shaped by distance, region, and how many providers operate
            nearby. A close second is estimating incidents per year based on a single memorable bad
            experience rather than a realistic multi-year average, which skews the comparison toward
            whichever option feels emotionally safer instead of whichever is actually cheaper. A third is
            comparing a standalone membership against a policy add-on on price alone without accounting for
            what each one actually includes, since a membership&apos;s extra perks or a policy add-on&apos;s tighter
            mileage limit can change which option makes sense even when the sticker prices look close.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the three options you enter are directly comparable on an annual cost
            basis, which holds for the core towing, lockout, and jump-start scenario but breaks down if one
            option includes services the others don&apos;t, such as trip-interruption reimbursement on a
            membership or a higher covered towing distance on a policy add-on. It does not know your
            specific insurer&apos;s add-on price, a membership provider&apos;s actual dues in your area, or any
            per-incident mileage cap or annual service-call limit written into either plan&apos;s terms. It
            also can&apos;t predict how many incidents you&apos;ll actually have in a given year; the number you
            enter is your own estimate, and actual roadside needs are unpredictable by nature. Treat the
            result as a planning comparison to bring into a conversation with your insurer or a membership
            provider, not as a guarantee of what you&apos;ll pay or save.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Roadside assistance</strong> — coverage that pays for common roadside problems like
              towing, lockouts, jump starts, and flat tire changes, sold either as a policy add-on or a
              standalone membership.
            </li>
            <li>
              <strong>Per-incident cost</strong> — what you&apos;d pay out of pocket for a single roadside
              event with no coverage at all, which this tool asks you to estimate locally rather than
              assuming a fixed price.
            </li>
            <li>
              <strong>Breakeven point</strong> — the number of incidents per year at which a coverage
              option&apos;s annual cost exactly equals the cost of paying per incident; above it, coverage
              saves money, below it, paying as you go does.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on what optional coverages like roadside assistance typically add to a personal
            auto policy, the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down standard and optional policy parts, and the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes general consumer guidance on auto coverage types. If you want to confirm what your
            state requires or allows insurers to include in an auto policy, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            is the authoritative source, not this tool.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you&apos;re also reviewing your core liability and physical damage limits, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            sizes those separately, and the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the same how-much-do-I-need question for other optional add-ons and policy types.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance add-on decisions
            like this one into a straight numbers comparison instead of a guess. No account, no email
            capture, no data leaves your browser — just your own figures, compared side by side.
          </p>
        </section>
      </div>
    </>
  );
}

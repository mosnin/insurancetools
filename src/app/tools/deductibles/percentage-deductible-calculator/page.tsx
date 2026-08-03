import type { Metadata } from "next";
import Link from "next/link";
import { PercentageDeductibleCalculatorTool } from "@/components/tools/PercentageDeductibleCalculatorTool";
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

const tool = getToolBySlug("percentage-deductible-calculator")!;

const TITLE = "Percentage Deductible Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this percentage deductible calculator to see your exact hurricane or wind deductible in dollars, based on your dwelling limit rather than your claim amount.";
const PAGE_URL = `${SITE_URL}/tools/deductibles/percentage-deductible-calculator`;

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
    question: "Is a percentage deductible based on my claim amount or my dwelling coverage limit?",
    answer:
      "Your dwelling coverage limit, not the size of the claim. This is the detail most homeowners miss. A 2% deductible on a $400,000 Coverage A limit is an $8,000 deductible, and that $8,000 applies whether the qualifying claim is for $10,000 or $200,000 in damage. It does not shrink for smaller claims the way people often assume a percentage would. Pull your dwelling limit from your declarations page and use this calculator to see the exact dollar figure your percentage translates to.",
  },
  {
    question: "Which perils typically use a percentage deductible instead of a flat dollar amount?",
    answer:
      "Most commonly wind and hail, and hurricane or named-storm damage specifically. The National Association of Insurance Commissioners notes that a named storm deductible is a separate deductible an insurer applies only when a named storm causes the damage, distinct from the regular flat deductible that applies to every other claim on the same policy. Everything else on the policy, like a kitchen fire or a burst pipe, still uses your normal flat-dollar deductible.",
  },
  {
    question: "Can I choose to avoid a percentage deductible, or is it mandatory?",
    answer:
      "It depends on your state and how exposed your address is to storm risk. The Insurance Information Institute notes that insurers in many states must offer a menu of options, such as a flat $500 deductible alongside 2%, 5%, and 10% choices, letting the policyholder pick. In higher-risk coastal areas, insurers may decline to offer the flat-dollar option at all, making a percentage deductible mandatory for that address. Ask your agent directly whether your policy gives you a choice.",
  },
  {
    question: "Does a percentage deductible apply separately to every storm, or once per season?",
    answer:
      "For hurricane deductibles specifically, the Insurance Information Institute notes the deductible typically applies once per hurricane season, not once per individual storm, so a policyholder hit by two named storms in the same season generally is not charged the percentage deductible twice. Confirm this wording in your own policy, since exact season-versus-per-occurrence language can still vary by insurer and state.",
  },
  {
    question: "Is a hurricane deductible the same thing as a flood insurance deductible?",
    answer:
      "No, and this is a common point of confusion after a coastal storm. A homeowners policy's wind or named-storm deductible only applies to wind and rain damage the homeowners policy actually covers. Flood damage, including storm surge, is generally excluded from homeowners policies altogether and requires a separate policy, most often through the National Flood Insurance Program. That NFIP policy carries its own, separate deductible that this calculator does not model.",
  },
  {
    question: "Where do I find my exact percentage deductible and dwelling limit?",
    answer:
      "Both figures are on your policy's declarations page, usually the first page or two of the document your insurer sends when the policy is issued or renewed. Look for a line item labeled hurricane deductible, named storm deductible, or wind/hail deductible, shown either as a flat dollar figure or a percentage. If you cannot locate it or the wording is unclear, your agent or insurer can confirm the exact figure and which perils it applies to over the phone.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Deductible Tools", href: "/tools/deductibles" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function PercentageDeductibleCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Percentage Deductible Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Turn your policy&apos;s wind, hail, or hurricane percentage into the exact dollar amount you&apos;d
            actually owe, based on your dwelling limit rather than the size of any one claim.
          </p>
          <LastUpdated category="deductibles" />
        </div>

        <div className="mt-2">
          <PercentageDeductibleCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-percentage-deductible-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Percentage Deductible Calculator Solves
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most homeowners policies use a flat dollar deductible, something like $1,000 or $2,500 that applies
            the same way to every covered loss. But in many coastal and storm-exposed states, insurers instead
            apply a percentage deductible to specific perils, most often wind and hail or hurricane and
            named-storm damage. A percentage deductible calculator exists because that single word,
            &ldquo;percentage,&rdquo; hides a much bigger number than most policyholders expect, and the only way
            to know your real exposure is to run your own dwelling limit and percentage through the math rather
            than guess. This tool does exactly that: enter your own figures and it converts the abstract
            percentage on your declarations page into a concrete dollar amount, then shows what a common
            flat-dollar deductible would have cost by comparison so the difference is impossible to miss.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for homeowners in hurricane-prone or hail-prone regions who have noticed a line
            on their declarations page reading something like &ldquo;hurricane deductible: 2%&rdquo; or
            &ldquo;wind/hail deductible: 5%&rdquo; and want to know what that actually means in dollars before a
            storm forces the question. It&apos;s equally useful while shopping for a new policy, since two
            insurers quoting the same premium can carry very different real-world deductible exposure once their
            percentage figures and dwelling limits are compared side by side. If your policy uses only a flat
            dollar deductible for every peril, this calculator won&apos;t apply to your situation, and that&apos;s
            worth confirming on your declarations page either way.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Math: A Percentage of Your Dwelling Limit, Not Your Claim
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most misunderstood part of a percentage deductible is what the percentage is a percentage
            of. It is not a percentage of the damage, and it is not a percentage of the repair estimate. It is a
            percentage of your policy&apos;s dwelling coverage limit, also called Coverage A, the number your
            insurer would pay out to rebuild your home from a total loss. That means the deductible is a fixed
            dollar figure once your dwelling limit and percentage are set, and it stays fixed regardless of
            whether the actual damage is minor roof shingle loss or a partially collapsed structure. A
            homeowner with a $500,000 dwelling limit and a 5% named-storm deductible owes $25,000 out of pocket
            before any insurance payment kicks in for a qualifying wind claim, whether the repair bill comes to
            $18,000 or $180,000. The National Association of Insurance Commissioners describes named storm
            deductibles this way in its own consumer guidance, and nineteen states plus the District of Columbia
            currently have some form of hurricane or named-storm deductible in place, with percentages
            commonly ranging from about 1% to 10% of the home&apos;s insured value.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a homeowner with a $400,000 dwelling coverage limit whose policy carries a 2% hurricane
            deductible, which this calculator converts to an $8,000 out-of-pocket figure. A named storm causes
            $35,000 in roof and siding damage. Instead of the $1,000 flat deductible many homeowners are used to
            seeing on their auto or older home policies, this claim is reduced by the full $8,000, leaving a net
            insurance payout of $27,000. Run the same $400,000 dwelling limit against a flat $1,000 deductible
            for comparison and the homeowner would have kept $34,000 of that same claim, a $7,000 difference
            driven entirely by the deductible structure rather than anything about the damage itself. That gap
            is exactly what tends to surprise homeowners who assumed &ldquo;2%&rdquo; meant something small.
          </p>

          <AdInArticle slot="tool-percentage-deductible-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming the percentage applies to the claim amount rather than the
            dwelling limit, which leads homeowners to badly underestimate their exposure until a real claim
            arrives. A close second is assuming a percentage deductible works like a flat deductible and resets
            or shrinks for smaller losses, when in fact the dollar figure is fixed the moment the dwelling limit
            is set at renewal. A third mistake is confusing a wind or named-storm deductible with a flood
            insurance deductible; the two are entirely separate coverages with separate deductibles, and a
            homeowners policy&apos;s hurricane deductible has no bearing on a flood claim filed under a National
            Flood Insurance Program policy. Finally, some homeowners check their percentage once at purchase and
            never revisit it, even though raising a dwelling limit at renewal to keep pace with rebuild costs
            also raises the dollar value of a fixed percentage deductible without any separate notice calling
            that out.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator performs one calculation, dwelling limit multiplied by percentage, and does not
            know your state&apos;s rules, your insurer&apos;s specific policy language, or whether your address
            falls in a zone where a percentage deductible is optional or mandatory. It deliberately does not
            supply a &ldquo;typical&rdquo; percentage on your behalf, because that figure varies enormously by
            state, insurer, and coastal-zone designation, and presenting a default number as though it applied to
            you would risk badly understating or overstating your real exposure. Always read the exact
            percentage and the exact list of perils it applies to directly from your own declarations page, and
            confirm anything ambiguous with your agent or insurer before treating this estimate as final,
            particularly around whether the deductible applies once per season or once per storm in your
            specific policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Percentage deductible</strong> — a deductible expressed as a percentage of a policy value,
              most commonly a homeowners policy&apos;s dwelling coverage limit, rather than a flat dollar amount.
            </li>
            <li>
              <strong>Named storm deductible</strong> — a percentage or flat deductible that applies only to
              damage caused by a storm the National Weather Service has officially named, separate from the
              policy&apos;s regular deductible for every other type of claim.
            </li>
            <li>
              <strong>Dwelling coverage limit (Coverage A)</strong> — the maximum amount your homeowners policy
              would pay to rebuild your home&apos;s physical structure, and the figure a percentage deductible is
              calculated against.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the underlying mechanics of deductibles generally, the{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how deductibles work across policy types, and its{" "}
            <a
              href="https://www.iii.org/article/background-on-hurricane-and-windstorm-deductibles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              background on hurricane and windstorm deductibles
            </a>{" "}
            covers the flat-versus-percentage options insurers commonly offer. The{" "}
            <a
              href="https://content.naic.org/article/consumer-insight-what-are-named-storm-deductibles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance specifically on named storm deductibles, including which states
            currently allow or require them. Because flood damage is handled separately, the{" "}
            <a
              href="https://www.fema.gov/flood-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Federal Emergency Management Agency&apos;s National Flood Insurance Program
            </a>{" "}
            is the authoritative source on flood coverage and its own separate deductible. Confirm your exact
            state&apos;s rules on hurricane deductibles with your{" "}
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
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible tools
            </Link>{" "}
            category. If you haven&apos;t confirmed your dwelling limit is actually sized correctly, start with
            the{" "}
            <Link href="/tools/home/dwelling-coverage-calculator" className="text-blue-600 hover:underline">
              dwelling coverage calculator
            </Link>{" "}
            first, since that number directly drives the dollar size of a percentage deductible. To weigh a
            percentage deductible against other deductible structures and levels side by side, the{" "}
            <Link href="/tools/deductibles/deductible-comparison-calculator" className="text-blue-600 hover:underline">
              deductible comparison calculator
            </Link>{" "}
            is the closer fit.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn confusing policy language, like an
            abstract percentage tucked into a declarations page, into a plain dollar figure you can actually
            plan around. Nothing you enter here is saved or sent anywhere; every result is calculated on your
            own device using the numbers you choose to provide.
          </p>
        </section>
      </div>
    </>
  );
}

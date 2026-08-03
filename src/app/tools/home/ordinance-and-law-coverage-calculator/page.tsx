import type { Metadata } from "next";
import Link from "next/link";
import { OrdinanceAndLawCoverageCalculatorTool } from "@/components/tools/OrdinanceAndLawCoverageCalculatorTool";
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

const tool = getToolBySlug("ordinance-and-law-coverage-calculator")!;

const TITLE = "Ordinance and Law Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Check your ordinance and law coverage calculator gap: compare your current limit against a contractor-estimated code-upgrade cost and see if older-home rebuild risk is covered.";
const PAGE_URL = `${SITE_URL}/tools/home/ordinance-and-law-coverage-calculator`;

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
    question: "What does ordinance and law coverage actually pay for?",
    answer:
      "It pays the added cost of rebuilding to current building code after a covered loss, on the portion of the loss your dwelling coverage wouldn't otherwise reimburse. Standard dwelling coverage is priced to rebuild what was destroyed, not to upgrade the parts of the home that were never damaged but no longer meet current code once a rebuild is triggered. Ordinance and law coverage is what closes that specific gap.",
  },
  {
    question: "Why does this calculator ask me to enter my own code-upgrade cost instead of estimating it?",
    answer:
      "Because that figure depends on your home's specific construction, your municipality's current code, and how much of the structure a rebuild would actually need to bring up to code, none of which this tool can see. A contractor, a licensed appraiser, or your insurer's own replacement cost estimator can give you a defensible number; a generic formula applied to every home on the internet would not be trustworthy enough to act on.",
  },
  {
    question: "My policy shows ordinance and law coverage as a percentage, not a dollar amount. What do I enter?",
    answer:
      "Multiply that percentage by your dwelling coverage limit shown on your declarations page. For example, a 25% ordinance and law endorsement on a $350,000 dwelling limit works out to $87,500 — enter that dollar figure as your current limit.",
  },
  {
    question: "Is ordinance and law coverage only relevant after a total loss?",
    answer:
      "No. It can apply any time a covered loss is significant enough to trigger a rebuild-to-code requirement from your local building department, which in many jurisdictions happens once repair costs cross a set threshold relative to the home's value, sometimes well short of a total loss.",
  },
  {
    question: "Does a newly built home need ordinance and law coverage?",
    answer:
      "The exposure is usually smaller, since a newly built home was already constructed to a recent code, but it's rarely zero. Codes are revised on an ongoing cycle in most jurisdictions, so even a home built a few years ago can face some upgrade cost after a covered loss. The gap tends to grow with the home's age and with how many code cycles have passed since it was built or last substantially renovated.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Home Calculators", href: "/tools/home" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function OrdinanceAndLawCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Ordinance and Law Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Enter your own contractor or estimator figure for what a code-compliant rebuild would cost, and
            this ordinance and law coverage calculator shows whether your current limit actually closes
            that gap. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <OrdinanceAndLawCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-ordinance-law-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Check This Gap</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator matters most to owners of older homes, roughly anything built or last
            substantially renovated more than fifteen or twenty years ago, since those homes have
            accumulated the most distance between their original construction and whatever building code
            is in force in their city or county today. It&apos;s also worth a look for anyone in a jurisdiction
            that has recently adopted stricter energy, wind, seismic, or flood-resistant construction
            requirements, since a rebuild after a covered loss in one of those areas can trigger code
            upgrades that have nothing to do with the original cause of damage. If you already know your
            declarations page lists an ordinance and law limit, this tool turns that abstract percentage
            into a concrete answer: enough, or not.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What Ordinance and Law Coverage Is, and Why Older Homes Carry More of the Risk
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard homeowners policy&apos;s dwelling coverage is built around a single idea: pay to rebuild
            what was there. It is not built to pay for bringing the undamaged parts of a home up to a
            building code the home never had to meet when it was originally built. Ordinance and law
            coverage, sometimes called building ordinance or law coverage, exists specifically to fill that
            hole. It typically applies once local building officials require code-compliant construction as
            a condition of rebuilding after a covered loss, and it can cover the cost of demolishing and
            removing undamaged portions of the structure that code requires be replaced, along with the
            increased cost of construction itself.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Older homes carry a disproportionate share of this exposure for a simple reason: building codes
            are not static. Electrical systems, plumbing materials, foundation and structural bracing
            requirements, insulation and energy standards, and accessibility rules have all changed
            substantially across most jurisdictions over the past few decades. A home built in 1985 was
            legally compliant the day it was finished, but a serious fire or storm loss today could trigger
            a rebuild requirement that treats large portions of that same home as out of compliance, even
            the parts the fire never touched. The gap this calculator measures is the dollar distance
            between what that kind of code-driven rebuild would actually cost and what your current
            ordinance and law limit would actually pay.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Calculation Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tool takes three numbers you provide: your home&apos;s replacement cost, your own estimate of
            what it would cost to bring a full rebuild up to current code, and your current ordinance and
            law coverage limit expressed as a dollar amount. It does not generate the code-upgrade estimate
            for you, deliberately. That figure depends on details this tool has no way to see, including
            your home&apos;s specific construction type, your municipality&apos;s current code cycle, and how
            extensive a hypothetical rebuild would actually need to be, so a one-size-fits-all formula would
            be little more than a guess dressed up as a calculation. Once you enter a number from a
            contractor, a licensed appraiser, or your insurer&apos;s own replacement cost estimator, the
            calculator subtracts your current limit from that estimate. Any amount left over is your
            estimated coverage gap; if your limit meets or exceeds the estimate, the tool reports the
            surplus instead so you can see how much room you actually have.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tool also converts your current limit into a percentage of your entered replacement cost,
            since many insurers sell ordinance and law coverage in fixed tiers, commonly around 10%, 25%,
            or 50% of dwelling coverage, rather than letting policyholders choose an exact dollar figure.
            Seeing your limit as a percentage makes it easier to ask your agent a specific question: is
            there a higher tier available, and what does it cost to move up one.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a home built in 1978 with a $350,000 replacement cost on its declarations page. The
            owner calls two local contractors after reading about ordinance and law coverage, and both
            estimate that a full code-compliant rebuild, factoring in updated electrical service, foundation
            bracing, and energy code requirements for a home of that era, would run about $35,000 above the
            standard rebuild cost. The owner&apos;s policy carries a 10% ordinance and law endorsement, which on
            a $350,000 dwelling limit works out to $35,000 of current coverage. Entered into the calculator,
            those numbers show the current limit essentially matches the estimate, with no meaningful gap
            either way. If the same owner&apos;s contractors had instead come back with a $60,000 estimate,
            reflecting more extensive required upgrades, the calculator would show a $25,000 gap, a concrete
            number to bring into a conversation about raising the endorsement to a 25% tier.
          </p>

          <AdInArticle slot="tool-ordinance-law-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming ordinance and law coverage is automatically included at a
            meaningful limit, when many policies either omit it entirely or include only a small default
            amount that was never sized to the home&apos;s actual age or construction. A second mistake is
            confusing this coverage with a general cushion for cost overruns; ordinance and law coverage is
            specifically tied to code-compliance costs triggered by a covered loss, not to inflation or
            contractor pricing swings more broadly. A third is treating the percentage on the declarations
            page as meaningful on its own, without ever converting it to a dollar figure and comparing it
            against an actual estimate, which is exactly the step this calculator is built to make easy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator performs a single subtraction between two numbers you supply; it does not
            verify your replacement cost, does not know your local building code, and does not estimate
            code-upgrade costs on your behalf. The gap it reports is only as accurate as the code-upgrade
            estimate you enter, so a rough guess will produce a rough gap. It also does not account for
            policy-specific exclusions, sublimits, or definitions of what triggers a code-compliance
            requirement in your jurisdiction, since those vary by insurer and by local building department.
            Treat the result as a planning figure to bring into a conversation with a licensed insurance
            agent or a contractor, not as a guarantee of what a future claim would actually pay.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Ordinance or law coverage</strong> — an endorsement that pays the added cost of
              rebuilding to current building code after a covered loss, beyond what standard dwelling
              coverage pays to rebuild what was there.
            </li>
            <li>
              <strong>Replacement cost</strong> — the amount it would cost to rebuild a home at today&apos;s
              labor and materials prices, without deducting for depreciation.
            </li>
            <li>
              <strong>Dwelling coverage</strong> — the part of a homeowners policy that pays to repair or
              rebuild the physical structure of the home itself, separate from personal property or
              liability coverage.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how dwelling and replacement cost coverage work, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language overview of standard homeowners policy structure, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            maintains consumer guidance covering coverage types and definitions used across state markets.
            Local code-compliance requirements are set by municipal building departments rather than by
            insurers, so a{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state insurance department
            </a>{" "}
            is the right place to confirm how ordinance and law rules are regulated where you live, and a
            licensed contractor or building official is the right source for what your specific home would
            actually need.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. If you&apos;re still working out your baseline dwelling limit before layering on ordinance
            and law coverage, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover that groundwork. If you&apos;re comparing an actual settlement or rebuild estimate after a
            loss rather than planning ahead of one, the{" "}
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
            Insurance Tools builds free, browser-based calculators that turn dense policy language, like a
            percentage buried on a declarations page, into a number you can actually act on. Nothing you
            type here is collected or stored; every result runs locally in your browser so you can check a
            coverage gap in private before deciding whether it&apos;s worth a call to your agent.
          </p>
        </section>
      </div>
    </>
  );
}

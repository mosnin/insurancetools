import type { Metadata } from "next";
import Link from "next/link";
import { HomeInsuranceUnderinsuranceCalculatorTool } from "@/components/tools/HomeInsuranceUnderinsuranceCalculatorTool";
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

const tool = getToolBySlug("home-insurance-underinsurance-calculator")!;

const TITLE = "Home Insurance Underinsurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Run this home insurance underinsurance calculator to check your existing dwelling limit against your replacement cost, see the dollar and percentage gap, and spot coinsurance penalty risk.";
const PAGE_URL = `${SITE_URL}/tools/home/home-insurance-underinsurance-calculator`;

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
    question: "Am I underinsured on my home if my limit is close to replacement cost but not exact?",
    answer:
      "It depends on how close. A limit a few thousand dollars below replacement cost is a small gap you may choose to live with or close at your next renewal. A limit that sits noticeably below your replacement cost, especially anywhere near or under the 80% mark this calculator flags, is worth addressing sooner, since that's the range where a coinsurance clause, if your policy has one, can start reducing even a partial claim payout on top of the raw shortfall.",
  },
  {
    question: "What is a coinsurance penalty on a homeowners policy?",
    answer:
      "It's a clause some homeowners policies include that reduces a claim payout, even for a partial loss, if your dwelling limit falls below a set percentage of your home's replacement cost, commonly cited around 80% as an industry convention. The exact percentage, and whether your policy has this clause at all, varies by insurer and policy. This calculator flags when your numbers cross that common threshold, but confirming whether the clause applies to your specific policy requires checking your declarations page or asking your agent directly.",
  },
  {
    question: "Why would my home become underinsured if I never changed my policy?",
    answer:
      "Because your policy's limit doesn't automatically track construction costs unless your insurer applies an inflation guard endorsement, and even then that adjustment is typically a modest yearly percentage. Material and labor costs for rebuilding a home don't move in lockstep with that adjustment, particularly during periods when construction pricing rises quickly. The result is a limit that was accurate when you bought the policy quietly falling behind actual rebuild cost over several renewal cycles, with no single event that would have prompted you to check.",
  },
  {
    question: "Where do I find my current dwelling coverage limit?",
    answer:
      "It's labeled Coverage A on your policy's declarations page, the one- or two-page summary your insurer sends at each renewal listing your coverage types and dollar limits. If you can't locate it, your insurer's online account portal or a call to your agent will have the current figure.",
  },
  {
    question: "How is this different from the dwelling coverage calculator?",
    answer:
      "The dwelling coverage calculator builds a recommended Coverage A limit from scratch, starting with a rebuild cost and working forward to a target number. This tool works in the opposite direction: it takes a dwelling limit you already have and checks it against your replacement cost to see whether a gap already exists and how large it is. Use the dwelling coverage calculator when you're setting a limit for the first time, and this one when you want to audit a limit you're currently carrying.",
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

export default function HomeInsuranceUnderinsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Home Insurance Underinsurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Check the dwelling limit you already have against what it would actually cost to rebuild
            your home, and see the gap as both a dollar figure and a percentage. Free, instant, and
            nothing you enter leaves your browser.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <HomeInsuranceUnderinsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-underinsurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Tool Is For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This home insurance underinsurance calculator is built for homeowners who already have a
            policy in force and want to know whether the dwelling limit on it still matches reality,
            not homeowners shopping for a first policy from scratch. If you just pulled a renewal
            notice off the counter, had an appraisal done for a refinance, or got a contractor&apos;s
            walkthrough estimate after pricing out a remodel, this is the moment to run those two
            numbers, your current limit and your real replacement cost, against each other. The result
            tells you plainly whether you&apos;re carrying enough coverage or quietly exposed to a
            shortfall that would only surface after a fire, storm, or other total loss.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why Underinsurance Sneaks Up on Homeowners
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Underinsurance is more common than most owners assume, and it rarely happens because
            someone made a bad decision at renewal. It happens because a dwelling limit set correctly
            when a policy was first written can fall behind over time without anyone noticing. Some
            policies include an inflation guard endorsement that nudges the limit up automatically each
            year, but that adjustment is usually a modest, generic percentage, and it doesn&apos;t
            necessarily track what&apos;s actually happening to construction costs in your specific
            local market. When material and labor pricing for a rebuild rises faster than a policy&apos;s
            built-in inflation adjustment, which happens regularly and is a well-documented pattern in
            the property insurance industry, the gap between your limit and your real replacement cost
            widens a little every year until it&apos;s significant enough to matter.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Some policies compound the problem with a coinsurance clause. This is a provision that
            reduces a claim payout, sometimes even for a partial loss like a kitchen fire or a roof
            leak rather than a total loss, if your dwelling limit falls below a set percentage of your
            home&apos;s replacement cost. The percentage most commonly cited as an industry convention
            is around 80%, but that figure, and whether a given policy even includes the clause at all,
            varies by insurer and by policy language. This calculator checks your numbers against that
            80% convention and flags it as something to verify, not as a guaranteed feature of your
            specific policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Gap Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You enter two numbers: your current dwelling coverage limit, taken from the Coverage A line
            on your declarations page, and your estimated replacement cost, ideally from an appraisal,
            a contractor&apos;s written estimate, or this site&apos;s own replacement cost or dwelling
            coverage calculator. The tool subtracts your current limit from your replacement cost to get
            the dollar gap, floored at zero so a limit that already exceeds replacement cost shows no
            shortfall rather than a negative number. It divides that dollar gap by your replacement cost
            to express the same shortfall as a percentage, since a $30,000 gap means something very
            different on a $200,000 home than it does on a $600,000 home. Separately, it calculates your
            current limit as a percentage of replacement cost and compares that figure against the
            common 80% coinsurance convention, flagging a possible penalty risk whenever you fall below
            it.
          </p>

          <AdInArticle slot="tool-underinsurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say your declarations page shows a $280,000 dwelling limit, the figure you&apos;ve been
            renewing for the past several years without a second look. A contractor recently quoted
            $350,000 to rebuild the home at current material and labor prices after you asked out of
            curiosity following a neighbor&apos;s claim. The calculator subtracts $280,000 from $350,000
            for a $70,000 dollar gap, then divides that by $350,000 for a 20% shortfall. It also checks
            your coverage as a share of replacement cost: $280,000 divided by $350,000 is exactly 80%,
            right at the common coinsurance threshold rather than comfortably above it. That result
            means two things worth acting on: a $70,000 hole a total loss would leave you covering out
            of pocket, and a coverage ratio sitting exactly on the line where a coinsurance clause, if
            your policy has one, could still reduce a partial claim payout.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Catch</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is treating a policy&apos;s automatic inflation guard as a
            complete substitute for periodically checking replacement cost directly, when it&apos;s
            really just a partial patch. A close second is using a home&apos;s market value or purchase
            price as a stand-in for replacement cost when entering numbers here or anywhere else; market
            value reflects land and location, not what it costs to rebuild the structure, and the two
            can diverge sharply in either direction. A third is skipping this check entirely after a
            renovation, since a finished basement or a kitchen addition raises replacement cost
            immediately, while your dwelling limit stays exactly where it was until you request a
            change.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator only compares the two numbers you provide; it does not estimate your
            replacement cost itself and cannot verify that the figure you entered is accurate or
            current. It does not know whether your specific policy includes a coinsurance clause, what
            percentage that clause uses if it exists, or whether your insurer offers extended or
            guaranteed replacement cost coverage that would change how a shortfall gets handled at claim
            time. The 80% figure referenced throughout this page is a commonly cited industry
            convention, not a universal rule, a legal requirement, or a number this tool has confirmed
            against your policy. Treat every result here as a planning figure to bring into a
            conversation with your insurer or a licensed agent, not as a substitute for reading your own
            policy&apos;s coinsurance language.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Coinsurance clause</strong> — a policy provision that can reduce a claim payout,
              including for a partial loss, when the dwelling limit falls below a set percentage of the
              home&apos;s replacement cost.
            </li>
            <li>
              <strong>Replacement cost</strong> — what it would cost to rebuild your home today at
              current material and labor prices, as distinct from market value or purchase price.
            </li>
            <li>
              <strong>Inflation guard endorsement</strong> — an optional or automatic policy feature
              that raises a dwelling limit by a set percentage each year to help it keep pace with
              rising construction costs.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how dwelling coverage and replacement cost fit into a standard policy,
            the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language overview of what a homeowners policy covers, and its{" "}
            <a
              href="https://www.iii.org/article/replacement-cost-vs-actual-cash-value-whats-difference"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              replacement cost versus actual cash value guide
            </a>{" "}
            explains why those two figures diverge. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on coverage types, and if you want to confirm anything
            about your specific policy or a coinsurance clause, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            is the authoritative place to start.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. If you need to build a replacement cost or a target dwelling limit from scratch
            rather than auditing one you already have, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover that ground, and once your limit is where it should be, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to pair it with.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free, browser-based calculators that turn insurance questions
            into visible math instead of a locked quote form. Nothing you type here is collected or
            stored; every figure is computed on your own device and meant to prepare you for a sharper
            conversation with your insurer or agent.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { HomeReplacementCostCalculatorTool } from "@/components/tools/HomeReplacementCostCalculatorTool";
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

const tool = getToolBySlug("home-replacement-cost-calculator")!;

const TITLE = "Free Home Replacement Cost Calculator | Insurance Tools";
const DESCRIPTION =
  "Run a home replacement cost calculator using your own square footage and local build cost per square foot to estimate what rebuilding your house would actually cost.";
const PAGE_URL = `${SITE_URL}/tools/home/home-replacement-cost-calculator`;

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
    question: "Where do I find my local cost per square foot to build?",
    answer:
      "This calculator won't supply one, on purpose, because construction costs swing widely by region, by season, and by local labor and material pricing. Ask a local general contractor or builder for a rough per-square-foot new-construction estimate for your area, check a regional builders' association if your area publishes one, or use an online construction cost estimator that lets you filter by ZIP code. Enter whichever figure you trust most into the field above.",
  },
  {
    question: "Is my home's replacement cost the same number as its market value?",
    answer:
      "No, and mixing the two up is one of the most common homeowners insurance mistakes. Market value includes the price of the land under your home and reflects whatever local buyers happen to be paying right now. Replacement cost only covers rebuilding the structure itself and ignores land value entirely, since the land typically survives a fire, storm, or other total loss. In a hot real estate market, market value can run well above replacement cost; in a market with expensive labor and cheap land, the reverse can be true.",
  },
  {
    question: "Does this number include my basement, garage, or detached structures?",
    answer:
      "Only if you account for them yourself. The square footage field is meant for above-grade living area, matching how most local cost-per-square-foot estimates are quoted. If you have a detached garage, workshop, guest house, or finished basement you want reflected, either add its square footage to the total before entering it, or fold its estimated cost into the feature adjustment percentage instead.",
  },
  {
    question: "Why does the calculator have a feature adjustment percentage instead of asking about specific upgrades?",
    answer:
      "A single adjustable percentage keeps the tool honest about what it can and can't know. High-end finishes, custom millwork, multiple stories, steep rooflines, and detached structures all push a rebuild above a generic per-square-foot baseline, but by how much depends entirely on your specific home and your contractor's pricing, not on a formula this page could responsibly hardcode. Enter a percentage you're comfortable defending, based on how your home compares to a standard build in your area, and leave it at 0% if you're unsure.",
  },
  {
    question: "Should I set my homeowners dwelling coverage to exactly this number?",
    answer:
      "Treat it as a starting estimate to bring into a conversation with your agent, not a figure to type directly into a coverage limit field. Insurers that write homeowners policies typically run a formal replacement-cost estimate using proprietary construction-cost software, and many policies include extended or guaranteed replacement cost provisions that add a cushion above the stated dwelling limit. Your agent can tell you what estimating method your specific insurer uses and whether your current limit already reflects a reasonable margin.",
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

export default function HomeReplacementCostCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Home Replacement Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Estimate what it would actually cost to rebuild your house from the ground up, using your own
            square footage and a local construction cost you look up yourself — not a guessed regional
            average.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <HomeReplacementCostCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-home-replacement-cost-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Needs to Run This Number</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Three groups tend to land here. The first is a homeowner renewing a policy who wants to sanity
            check whether the dwelling coverage limit on the declarations page still reflects reality after
            a few years of inflation in building materials and labor. The second is a homebuyer trying to
            budget for insurance before closing, who needs a rough number that isn&apos;t the purchase price.
            The third is a homeowner who just finished a renovation, addition, or major remodel and knows
            their old coverage limit was set for a smaller or plainer house than the one that exists today.
            In every case, the goal is the same: get a defensible starting estimate before a conversation
            with an agent, not a replacement for the formal estimate an insurer will eventually run.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Replacement Cost Is Not the Same Thing as What Your Home Is Worth
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is the single most important distinction on this page. Your home&apos;s market value, the
            number a real estate listing or a recent comparable sale would suggest, includes the land it
            sits on and moves with whatever local buyers are willing to pay. Replacement cost strips the
            land out entirely and asks a narrower question: what would it cost, at today&apos;s labor and
            material prices, to rebuild the structure itself if it were destroyed. A homeowner in a
            desirable neighborhood with an ordinary house can have a market value well above replacement
            cost, purely because of land scarcity. A homeowner in a rural area with expensive custom
            finishes can see the opposite. Homeowners insurance dwelling coverage is meant to track
            replacement cost, not market value, which is exactly why this calculator never asks what your
            home would sell for.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Estimate Is Built</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The math itself is deliberately simple: your entered square footage multiplied by your entered
            local cost per square foot produces a base cost, and an optional feature adjustment percentage
            scales that base cost up or down. What matters more than the arithmetic is where the numbers
            come from. This tool does not preload a regional dollar figure for cost per square foot,
            because construction pricing depends on local labor rates, material availability, permitting
            costs, and even the season, and a single national or state-level default would be more likely
            to mislead than to help. Instead, you supply that figure after checking it against a local
            contractor&apos;s estimate, a regional builders&apos; association number, or an online construction
            cost estimator that lets you filter by location. The feature adjustment percentage exists for
            the same reason: rather than guessing a dollar value for a kitchen renovation or a
            multi-story addition, you decide how far your home sits above or below a standard build for
            its size, based on what you actually know about it.
          </p>

          <AdInArticle slot="tool-home-replacement-cost-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a homeowner has a 2,200 square foot single-story house and calls two local contractors, who
            quote new-construction costs of roughly $175 and $190 per square foot for a comparable build in
            their area. They enter $182.50 as a middle-ground figure. Their home has upgraded countertops
            and hardwood flooring throughout, which they judge to be about 8% above a standard build, so
            they set the feature adjustment to 8%. The base cost comes out to $401,500 (2,200 times $182.50),
            and the 8% adjustment adds roughly $32,120, for an estimated total replacement cost near
            $433,620. That figure, not their home&apos;s recent appraised sale value of $610,000 which
            includes a sought-after lot, is the number worth comparing against their current dwelling
            coverage limit.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Mistakes Worth Avoiding</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent error is plugging in a home&apos;s purchase price or recent appraisal instead of
            a construction cost, which conflates replacement cost with market value and can leave a home
            significantly underinsured in an expensive land market or overinsured in a cheap one. A second
            is using a national average cost per square foot pulled from a generic online source instead of
            a locally sourced figure, since national averages can be off by well over 30% in either
            direction depending on the metro area. A third is forgetting to revisit the estimate after a
            renovation, since added square footage and upgraded finishes both push replacement cost up, and
            a stale coverage limit doesn&apos;t catch up on its own.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the square footage and cost per square foot you enter are reasonably
            accurate, and it has no way to independently verify either one. It does not account for site-
            specific factors like difficult lot access, unusual foundation requirements, local permitting
            delays, or debris removal costs after a total loss, all of which a professional estimate would
            typically capture. It is not a substitute for the formal replacement-cost appraisal an insurer
            runs when writing or renewing a policy, often using dedicated estimating software such as
            Marshall &amp; Swift/Boeckh, which pulls from proprietary regional construction cost data this
            tool does not have access to. Use this estimate to inform a conversation with a licensed
            insurance agent or a local contractor, not as a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Few Terms Worth Knowing</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Replacement cost</strong> — what it would cost to rebuild your home at today&apos;s
              construction prices, excluding the value of the land.
            </li>
            <li>
              <strong>Actual cash value</strong> — replacement cost minus depreciation; some older or
              budget policies pay claims this way instead of at full replacement cost.
            </li>
            <li>
              <strong>Extended or guaranteed replacement cost</strong> — an optional policy provision that
              pays a percentage above your stated dwelling limit, or an unlimited amount, if rebuilding
              costs exceed your coverage after a major loss.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how dwelling coverage and replacement cost work within a homeowners policy,
            the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language overview, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            maintains consumer guidance on coverage types more broadly. The{" "}
            <a
              href="https://www.consumerfinance.gov/owning-a-home/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Consumer Financial Protection Bureau&apos;s homeownership resources
            </a>{" "}
            cover related costs to budget for around a purchase, and your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s insurance department
            </a>{" "}
            is the right place to confirm any state-specific homeowners insurance rules before you buy or
            change coverage.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. Once you have a replacement cost estimate, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            can help you think through how much of that number to insure against other risks, and the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to pair with the coverage limit you land on.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators that run entirely in your browser, so you can work
            through coverage, cost, and claim questions with real numbers before you ever talk to an agent
            or fill out a quote form. Nothing you type here gets stored or sent anywhere.
          </p>
        </section>
      </div>
    </>
  );
}

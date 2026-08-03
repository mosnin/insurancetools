import type { Metadata } from "next";
import Link from "next/link";
import { RoommateRentersInsuranceSplitCalculatorTool } from "@/components/tools/RoommateRentersInsuranceSplitCalculatorTool";
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

const tool = getToolBySlug("roommate-renters-insurance-split-calculator")!;

const TITLE = "Roommate Renters Insurance Split Calculator | Insurance Tools";
const DESCRIPTION =
  "Run the numbers with this roommate renters insurance split calculator: compare one shared policy against separate policies and see the real annual cost gap.";
const PAGE_URL = `${SITE_URL}/tools/renters/roommate-renters-insurance-split-calculator`;

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
    question: "Does a shared renters insurance policy automatically cover every roommate's belongings?",
    answer:
      "No. A renters insurance policy generally covers only the named insured and anyone specifically listed on the policy as a household member, not every person who happens to live in the unit or split the premium. If a roommate isn't named on the policy, their belongings typically aren't covered even if they're paying part of the bill each month. Confirm exactly who is listed on any shared policy in writing before assuming everyone is protected.",
  },
  {
    question: "What happens to a shared renters insurance policy when one roommate moves out?",
    answer:
      "The policy usually needs to be updated. That can mean removing the departing roommate, adjusting the personal property coverage amount, and adding a new roommate as a named insured if someone moves in. Skipping this step is a common way a shared policy quietly stops covering someone it was assumed to cover.",
  },
  {
    question: "Can one roommate's claim affect the whole household under a shared policy?",
    answer:
      "Often yes. A shared policy typically has a single claim history attached to it, so a claim filed by one roommate can affect the renewal premium or renewal eligibility for the entire household, not just the person who filed it. Separate policies keep each roommate's claim history isolated to that individual.",
  },
  {
    question: "Is one shared liability limit enough for a house full of roommates?",
    answer:
      "It depends on how many people and how much combined risk the policy is covering. A shared liability limit applies once to the household as a whole rather than multiplying per roommate, so a limit that felt generous for one person can feel thinner once it's backing four or five people's guests, pets, and daily activity. This calculator doesn't size a liability limit; it only compares premium cost, so pair it with a coverage-focused review of the limit itself.",
  },
  {
    question: "Is a shared renters insurance policy always cheaper than separate policies?",
    answer:
      "Usually cheaper in total premium, since one policy carries one administrative and underwriting cost instead of several, but not in every case, and this calculator exists precisely because the gap varies by household. Enter your own quotes rather than assuming the typical pattern applies to your situation.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Renters Insurance Tools", href: "/tools/renters" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function RoommateRentersInsuranceSplitCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Roommate Renters Insurance Split Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Add up what separate renters policies would cost your household against one shared policy
            quote, and see the actual dollar gap, not a generic rule about which roommates should choose.
          </p>
          <LastUpdated category="renters" />
        </div>

        <div className="mt-2">
          <RoommateRentersInsuranceSplitCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-roommate-renters-split-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Roommate Renters Insurance Split Calculator Is For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for roommates who already agree they need renters insurance and are stuck on a
            different question: buy it as one household policy, or have each person carry their own. That
            decision usually comes up the same week a lease gets signed, when everyone is comparing quotes
            and someone suggests splitting one policy to save money. The roommate renters insurance split
            calculator on this page doesn&apos;t answer the question for you. It totals what separate
            policies would cost across the household, sets that total against a single shared-policy
            quote, and shows the dollar difference, so the roommates weighing the tradeoffs have an actual
            number instead of a guess about which approach is cheaper.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Cost Comparison Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Enter how many roommates are in the household, then a rough belongings value and a separate
            renters insurance quote for each person. The calculator sums those individual quotes into a
            single &ldquo;total if separate&rdquo; figure. Separately, enter one quote for a shared policy
            that would name the whole household as insureds. The tool subtracts one total from the other
            and reports which approach costs less in total annual premium, along with what each roommate&apos;s
            share would be if the shared premium were simply split evenly across the household.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator intentionally stops at cost. It does not tell you a shared liability limit is
            &ldquo;enough,&rdquo; and it does not tell you separate policies are &ldquo;safer.&rdquo; Both of
            those are real considerations, but they depend on how much the roommates trust each other, how
            often people move in and out, and how much any one person owns, none of which a premium
            comparison can capture. The math here is meant to sit alongside that conversation, not replace
            it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Three roommates share a two-bedroom apartment. Two of them get individual renters insurance
            quotes of $175 and $190 per year, and the third, who owns more electronics and furniture, quotes
            at $210 per year. Added together, separate policies would run the household $575 per year. A
            single shared policy covering all three, sized to their combined belongings, quotes at $480 per
            year. The shared policy is $95 per year cheaper in total, or about $160 per person if split
            evenly. That $95 gap is the number this calculator surfaces; whether it&apos;s worth the shared
            liability limit and shared claim history that come with it is the part the roommates still have
            to decide together.
          </p>

          <AdInArticle slot="tool-roommate-renters-split-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is assuming a policy taken out in one roommate&apos;s name
            automatically covers everyone else&apos;s belongings because everyone chips in on the premium.
            Most renters insurance policies only cover the named insured and any household members
            specifically listed on the policy, not every person who happens to live in the unit. A
            roommate who isn&apos;t listed can end up with no coverage at all despite paying their share
            every month. A second common mistake is agreeing on a shared policy and never revisiting it
            when someone moves out, leaving a departed roommate&apos;s name on the policy or a new roommate
            entirely uninsured. A third is comparing only the sticker price of one option without
            considering that a claim on a shared policy touches everyone&apos;s renewal, not just the
            claimant&apos;s.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the premium quotes you enter are accurate and comparable, meaning they
            cover a similar level of personal property and liability protection. It does not verify that any
            insurer will actually name every roommate as an insured on a single policy, does not check your
            state&apos;s specific rules on renters insurance, and does not size a liability limit for you.
            The even-split figure is one reference point, not a recommendation; many households split a
            shared premium proportionally to each person&apos;s belongings value instead of evenly, and
            that&apos;s a conversation between roommates, not a calculation this tool makes for you. Treat
            every number here as a starting point for comparing quotes, not a final decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Named insured</strong> — the person or people specifically identified on a renters
              policy as the policyholder; only their belongings and liability are covered by default.
            </li>
            <li>
              <strong>Household member</strong> — someone living in the unit who is listed on the policy
              alongside the named insured, extending that same coverage to them specifically.
            </li>
            <li>
              <strong>Shared liability limit</strong> — a single liability coverage amount that applies to
              the policy as a whole, rather than a separate limit for each person named on it.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For more on what a renters policy actually covers, the{" "}
            <a
              href="https://www.iii.org/article/renters-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            outlines personal property and liability coverage for tenants, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on how policies define who is covered. Before finalizing a
            shared or separate policy, confirm any state-specific requirements with your{" "}
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
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              Renters insurance calculators
            </Link>{" "}
            category. If you still need to size how much personal property coverage to request in the
            first place, the{" "}
            <Link href="/tools/renters/renters-personal-property-value-calculator" className="text-blue-600 hover:underline">
              renters personal property value calculator
            </Link>{" "}
            helps build that number before you request quotes, and the{" "}
            <Link href="/tools/renters/renters-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              renters insurance coverage calculator
            </Link>{" "}
            covers liability and additional living expenses limits for the policy itself, shared or
            separate.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free calculators for the specific insurance decisions people actually get
            stuck on, roommate cost splits included. Nothing you type into this page is saved or sent
            anywhere; it&apos;s just the math, run in your browser, to make an already awkward roommate
            conversation a little more concrete.
          </p>
        </section>
      </div>
    </>
  );
}

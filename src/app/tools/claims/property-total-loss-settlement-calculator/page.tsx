import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { PropertyTotalLossSettlementCalculatorTool } from "@/components/tools/PropertyTotalLossSettlementCalculatorTool";
import { FAQSection } from "@/components/tools/FAQSection";
import { LastUpdated } from "@/components/tools/LastUpdated";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdInArticle } from "@/components/ads";
import {
  toolStructuredData,
  breadcrumbStructuredData,
  faqStructuredData,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

const tool: Tool = {
  slug: "property-total-loss-settlement-calculator",
  name: "Property Total Loss Settlement Calculator",
  description:
    "Estimate a home total loss settlement from your dwelling coverage limit, extended replacement cost percentage, and deductible, with land value shown separately.",
  category: "Claims",
  categorySlug: "claims",
  keywords: [
    "property total loss settlement calculator",
    "home total loss insurance settlement",
    "house total loss calculator",
    "property destroyed insurance payout",
    "total loss settlement home insurance",
    "home rebuild vs payout calculator",
  ],
  relatedTools: ["dwelling-coverage-calculator", "insurance-claim-payout-calculator"],
};

const TITLE = "Property Total Loss Settlement Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this property total loss settlement calculator to estimate your home total loss payout from the dwelling limit, extended replacement cost, and deductible.";
const PAGE_URL = `${SITE_URL}/tools/claims/property-total-loss-settlement-calculator`;

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
    question: "Does a home total loss payout include the value of my land?",
    answer:
      "No. Land is not destroyed in a fire or other catastrophic loss, so it is never part of a dwelling (Coverage A) total loss settlement. The insurer pays out your dwelling coverage limit, plus any extended or guaranteed replacement cost your policy includes, minus your deductible. The land itself remains yours, and its value simply isn't part of the check, which surprises homeowners who assumed their full property value, land included, would be paid out.",
  },
  {
    question: "What is extended replacement cost coverage, and how do I know if I have it?",
    answer:
      "Extended replacement cost is an optional endorsement that pays a percentage above your stated dwelling limit when the actual cost to rebuild runs over that limit, which happens often after a widespread disaster drives up local labor and material costs. The percentage is set by your specific insurer and policy, commonly somewhere in a 10% to 50% range, and is never a standard industry figure, so you need to check your own declarations page or ask your agent for your exact number rather than assuming a typical rate.",
  },
  {
    question: "How is a home declared a total loss, versus just badly damaged?",
    answer:
      "Most states apply a total loss threshold, often expressed as a percentage of the dwelling's insured or repair value (commonly in the 60% to 80% range depending on the state), above which repairing the structure is considered impractical and the insurer settles it as a total loss instead of paying for repairs. The exact threshold and method vary by state and by insurer, so this calculator does not determine total loss status for you; it estimates the payout once your insurer has already made that determination.",
  },
  {
    question: "Why is my estimated settlement different from what my adjuster quoted me?",
    answer:
      "The most common reasons are a different dwelling limit than what you entered, an extended replacement cost percentage you didn't account for (or overestimated), depreciation or other adjustments the insurer applied to certain claim components, or state-specific claims-handling rules this general calculator doesn't model. Ask your adjuster for a line-by-line breakdown of their worksheet and compare it directly against the figures you entered here.",
  },
  {
    question: "Does this calculator account for my mortgage or lienholder?",
    answer:
      "No. If you have a mortgage, your lender is typically named on the total loss settlement check alongside you, and the lender is paid off from the proceeds before you receive any remainder. This tool estimates the gross structure settlement only; it doesn't subtract a loan payoff, since that balance is specific to your loan and isn't something this tool has access to.",
  },
  {
    question: "What about my personal belongings and additional living expenses?",
    answer:
      "This calculator estimates only the dwelling (Coverage A) structure settlement. Personal property (Coverage C) and additional living expenses (Coverage D) are separate coverages with their own limits and their own claim processes, and a full total loss claim typically involves settling all three. Use this tool for the structure portion, and review your policy's personal property and loss-of-use limits separately.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Claims Tools", href: "/tools/claims" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function PropertyTotalLossSettlementCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Property Total Loss Settlement Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            When a home is destroyed beyond repair, the settlement math is not the same as a vehicle total
            loss. This property total loss settlement calculator estimates your structure payout from your
            dwelling limit, your policy&apos;s extended replacement cost, and your deductible, and keeps land
            value clearly separate from the check.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <PropertyTotalLossSettlementCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-property-total-loss-settlement-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What &ldquo;Total Loss&rdquo; Means for a Home, Not a Car
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A vehicle is declared a total loss when the repair cost, plus salvage considerations, exceeds a
            threshold measured against its actual cash value, and the entire vehicle, tires, engine, land it
            never touched, gets replaced with a check. A home total loss works differently, and the
            difference matters for what you should expect in the mail. When a house burns down or is
            otherwise destroyed beyond reasonable repair, the land underneath it is untouched. It didn&apos;t
            burn. It doesn&apos;t need replacing. Only the structure itself, along with anything attached to it,
            is what your dwelling coverage (usually labeled Coverage A on a homeowners policy) is built to
            replace. That single distinction, land stays, structure gets paid out, is the most consequential
            difference between a home total loss and a vehicle total loss, and it&apos;s the first thing this
            calculator is built to make explicit rather than leaving it as a surprise buried in a settlement
            letter.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for homeowners who have already received, or are anticipating, a total loss
            determination from their insurer after a fire, or other catastrophic damage that made the
            structure a candidate for a settlement rather than a repair estimate. It&apos;s also useful earlier,
            while you&apos;re still reviewing your policy, to understand what your current dwelling limit and any
            extended replacement cost endorsement would actually pay out if the worst happened, before you&apos;re
            in the middle of a claim and trying to learn the math under pressure. If you&apos;re instead comparing
            an actual settlement offer line by line, run your policy&apos;s numbers here first so you have an
            independent figure to check the insurer&apos;s worksheet against.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Settlement Estimate Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts with your dwelling coverage limit, the structure figure printed on your
            policy&apos;s declarations page, which is not the same as your home&apos;s market value or purchase
            price. If your policy includes an extended or guaranteed replacement cost endorsement, the tool
            adds the percentage you enter on top of that limit, since that endorsement exists specifically to
            pay for rebuilding cost overruns above the stated limit. That percentage is set entirely by your
            insurer and your specific policy, which is why this calculator asks you to enter your own number
            rather than assuming a standard figure; there isn&apos;t one. From that combined structure figure, the
            tool subtracts your dwelling deductible to arrive at an estimated net settlement. Land value is
            calculated and displayed, but it is never added into the payout, since land isn&apos;t destroyed and
            isn&apos;t part of what dwelling coverage insures.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a homeowner whose policy carries a $320,000 dwelling limit and a $2,500 deductible, with
            no extended replacement cost endorsement (0%). Their lot, separately, would sell for around
            $90,000 if it were vacant. After a total loss, the calculator estimates a structure settlement of
            $317,500 ($320,000 minus the $2,500 deductible), with the $90,000 land value shown separately as
            retained value, not part of that check. Now compare that to a second homeowner with the same
            $320,000 dwelling limit but a policy that includes 25% extended replacement cost, entered because
            that&apos;s the specific figure on their declarations page. Their estimated structure settlement rises
            to $397,500 ($320,000 plus $80,000 in extended coverage, minus the $2,500 deductible), a
            difference of exactly $80,000 driven entirely by an endorsement the first homeowner didn&apos;t have.
            That gap is the practical reason to know your own policy&apos;s extended replacement cost figure
            before, not after, a total loss.
          </p>

          <AdInArticle slot="tool-property-total-loss-settlement-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is expecting land value to show up in the settlement check at all.
            Homeowners often think in terms of total property value, land plus structure combined, and are
            caught off guard when the payout reflects only the structure. A close second is not knowing
            whether an extended or guaranteed replacement cost endorsement exists on the policy in the first
            place, which means never entering it into a claim conversation and potentially leaving real money,
            money the policy was already paying a premium for, unclaimed. A third is assuming the dwelling
            limit itself automatically tracks current rebuilding costs; limits can fall behind rising
            construction costs if a policy hasn&apos;t been reviewed in several years, which is exactly the gap
            extended replacement cost is designed to close, but only up to the percentage actually purchased.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes your insurer has already determined, or will determine, that the
            structure is a total loss under your state&apos;s and policy&apos;s own standards; it does not evaluate
            damage or make that determination itself. It assumes the extended replacement cost percentage you
            enter is accurate to your actual policy, since this figure varies by insurer and cannot be
            estimated generically. It does not account for personal property (Coverage C) or additional living
            expenses (Coverage D), which are separate coverages settled independently of the dwelling
            structure payout modeled here. It does not subtract a mortgage or lienholder payoff, since your
            lender is typically named on the settlement check and paid from the proceeds directly, a figure
            specific to your loan. Treat every number here as a planning estimate to bring into a conversation
            with your insurer or a licensed public adjuster, not as a final settlement figure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Extended replacement cost</strong> — an endorsement that pays a set percentage above
              your dwelling limit when actual rebuilding costs exceed that limit, with the exact percentage
              set by your individual policy.
            </li>
            <li>
              <strong>Guaranteed replacement cost</strong> — a stronger version of the same idea, found on
              some policies, that pays the full cost to rebuild with no percentage cap at all, though it is
              less common and often carries stricter underwriting requirements.
            </li>
            <li>
              <strong>Total loss threshold</strong> — the point, usually a percentage of insured or repair
              value set by state law or insurer practice, above which a structure is settled as destroyed
              rather than repaired.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For definitions and claims-handling guidance beyond what&apos;s covered here, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on filing and settling a homeowners claim, and the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how dwelling coverage and replacement cost provisions work in practice. Before relying on
            any settlement figure, confirm your policy&apos;s specific total loss and replacement cost language
            with your insurer, and verify your state&apos;s claims-handling rules with your{" "}
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
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            category. Before a total loss ever happens, the{" "}
            <Link href="/tools/home/dwelling-coverage-calculator" className="text-blue-600 hover:underline">
              dwelling coverage calculator
            </Link>{" "}
            helps you check whether your current limit is even close to adequate. If your claim covers more
            than the structure itself, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            walks through a broader settlement estimate for partial and non-structure claims.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the numbers that matter most after a
            loss: what a policy actually pays, what a claim is worth, and where the gaps in coverage tend to
            hide. Every calculator here runs entirely in your browser and asks for nothing but the figures you
            choose to type in.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { MultiPolicyDeductibleStackingCalculatorTool } from "@/components/tools/MultiPolicyDeductibleStackingCalculatorTool";
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

/**
 * This tool is new and not yet wired into the central `src/lib/tools.ts`
 * registry (that integration happens in a separate pass). The shape below
 * mirrors exactly what the registry entry will contain once added, so this
 * page's metadata and structured data won't need to change when it is.
 */
const tool: Tool = {
  slug: "multi-policy-deductible-stacking-calculator",
  name: "Multi-Policy Deductible Stacking Calculator",
  description:
    "Use this multi-policy deductible stacking calculator to add up the total out-of-pocket cost when a single event damages property covered under two separate insurance policies.",
  category: "Deductibles",
  categorySlug: "deductibles",
  keywords: [
    "multi policy deductible stacking calculator",
    "does one loss trigger two deductibles",
    "home and auto deductible same event",
    "multiple insurance deductibles one claim",
    "deductible stacking calculator",
    "car and home damaged same incident deductible",
  ],
  relatedTools: ["deductible-comparison-calculator", "insurance-claim-payout-calculator"],
};

const TITLE = "Multi-Policy Deductible Stacking Calculator | Insurance Tools";
const DESCRIPTION =
  "Use the multi policy deductible stacking calculator to see your total out-of-pocket cost when one event triggers two separate policy deductibles at once.";
const PAGE_URL = `${SITE_URL}/tools/deductibles/multi-policy-deductible-stacking-calculator`;

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
    question: "Can one storm or accident really trigger two separate insurance deductibles?",
    answer:
      "Yes, when the same event damages property insured under two separate policy contracts. A common example is a tree that falls during a storm, damaging both your house (homeowners policy) and a car parked in the driveway (auto policy). Each policy is a distinct legal contract with its own deductible, so each one is typically applied on its own; the deductibles do not combine into a single \"per event\" amount unless a specific endorsement says otherwise.",
  },
  {
    question: "Why doesn't my homeowners deductible cover the damage to my car in the same incident?",
    answer:
      "Because a standard homeowners policy and a standard auto policy are written and priced separately, covering different classes of property under different contract terms. The fact that both losses happened in the same storm doesn't merge the contracts. Your homeowners deductible applies to the homeowners claim, and your auto deductible applies to the auto claim, even though you experienced them as a single bad day.",
  },
  {
    question: "Does a personal umbrella policy help with a multi-policy loss like this?",
    answer:
      "An umbrella policy is built to extend liability protection above your underlying home and auto policies, not to absorb property-damage deductibles. It generally won't reduce or replace the deductibles on the underlying home or auto claims in a scenario like a tree falling on a house and a car. If you're unsure how your specific umbrella policy interacts with an underlying claim, ask your agent directly, since umbrella terms vary by insurer.",
  },
  {
    question: "What if my loss under one of the policies is smaller than that policy's deductible?",
    answer:
      "If a loss amount is below that policy's deductible, that policy typically won't pay anything toward it, and you'd cover the full amount yourself rather than just the deductible. This calculator reflects that: it caps each policy's out-of-pocket contribution at the smaller of the loss amount or the deductible, and flags when a loss falls under a policy's deductible so you're not overestimating what that policy would pay.",
  },
  {
    question: "Is this calculator telling me whether my claim is actually covered?",
    answer:
      "No. It only adds up the numbers you enter, assuming both losses are otherwise covered perils under their respective policies. It doesn't check your actual policy language, exclusions, endorsements, or policy limits, and it isn't a claims determination. Whether a specific loss is covered, and how a deductible actually applies, is decided by your policy's terms and your insurer's claims adjuster.",
  },
  {
    question: "Can three or more policies apply their own deductibles to the same event?",
    answer:
      "In principle, yes. A single severe event could touch a homeowners policy, a separate flood policy, a detached-structure endorsement, and an auto policy at once, each with its own deductible. This tool models two policies at a time to keep the scenario concrete and easy to check; if your situation involves more than two, run the extra policy pairs through a second pass and add the totals together.",
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

export default function MultiPolicyDeductibleStackingCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Multi-Policy Deductible Stacking Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See the real total you&apos;d pay out of pocket when one event, like a storm or a falling tree,
            damages property covered under two separate insurance policies. Free, instant, and it never
            asks who you are.
          </p>
          <LastUpdated category="deductibles" />
        </div>

        <div className="mt-2">
          <MultiPolicyDeductibleStackingCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-multi-policy-deductible-stacking-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why a Single Loss Event Can Trigger Two Separate Deductibles
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most people experience a deductible as a single, familiar rule: file a claim, subtract a fixed
            dollar amount, the insurer covers the rest. That mental model works fine as long as an
            incident only touches one policy. It breaks down the moment a single event damages property
            that happens to be insured under two separate contracts, because each policy contract carries
            its own deductible, independent of the other. A homeowners policy and an auto policy are
            underwritten separately, priced separately, and adjusted separately, even when the claims come
            from the exact same afternoon. Nothing about sharing a triggering event merges the two
            contracts into one.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is a well-established, unglamorous fact of how personal insurance is structured, not an
            edge case insurers invented to avoid paying claims. It shows up whenever damage crosses policy
            lines: a windstorm that peels shingles off the roof and also shatters a car&apos;s windshield in
            the driveway, a burst pipe that ruins a finished basement covered under a homeowners policy
            and a home office covered under a separate business policy endorsement, or a falling tree limb
            that hits both the main house and a detached garage insured under its own endorsement. The
            common thread isn&apos;t the type of peril, it&apos;s that the loss lands on two different contracts,
            and each contract answers for its own share on its own terms.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for anyone piecing together the real cost of a loss that touched more than one
            policy, most often a homeowner comparing storm damage to the house against damage to a vehicle
            parked outside, or someone with a detached structure, guest house, or home business
            endorsement that sits on its own deductible. It&apos;s also useful before a loss happens, as a way
            to understand what &ldquo;deductible stacking&rdquo; actually means in dollar terms, so a future claim
            doesn&apos;t come as a surprise. It is not a substitute for reading your actual policy documents
            or asking your adjuster how a specific claim will be handled.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Total Out-of-Pocket Math</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator treats each policy independently. For each one, it compares the loss amount you
            enter against that policy&apos;s deductible. If the loss is larger than the deductible, your cost
            under that policy is simply the deductible, and the insurer covers the remainder (subject to
            your actual policy limits, which this tool doesn&apos;t check). If the loss is smaller than the
            deductible, your cost under that policy is the full loss amount, since the policy likely
            wouldn&apos;t pay anything at all. Add the two policies&apos; individual out-of-pocket amounts
            together, and that sum is your total out-of-pocket cost for the event, not the single larger
            deductible many people instinctively expect to pay.
          </p>

          <AdInArticle slot="tool-multi-policy-deductible-stacking-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Picture a severe thunderstorm that drops a large tree limb across a driveway, damaging both
            the roof of the house and the car parked underneath. The homeowners policy has a $2,000
            deductible, and the repair estimate for the roof and gutters comes to $14,000. The auto
            policy&apos;s comprehensive deductible is $500, and the body shop estimate for the car comes to
            $9,000. Run through the calculator, the homeowners policy pays $12,000 after its $2,000
            deductible, and the auto policy pays $8,500 after its $500 deductible, for a combined insurer
            payout of $20,500. The homeowner&apos;s actual out-of-pocket cost is $2,000 plus $500, or $2,500
            total, not the $2,000 a person might assume if they expected only the larger of the two
            deductibles to apply.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is assuming a single occurrence means a single deductible, the same
            way a per-occurrence deductible works for perils inside one policy. A related mistake is
            expecting a personal umbrella policy to absorb one of the deductibles; an umbrella policy
            extends liability limits above underlying policies, it doesn&apos;t typically reduce the property
            deductibles on those underlying claims. A third mistake is forgetting that a loss below a
            policy&apos;s deductible pays nothing from that policy specifically, which can make a small
            secondary loss feel like it &ldquo;should&rdquo; be covered when, on paper, it falls entirely on the
            policyholder.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes every loss amount you enter is otherwise a covered peril under its
            respective policy, and it does not check exclusions, endorsements, sub-limits, or whether your
            specific policies apply a combined or waived deductible in some circumstance (some insurers
            offer bundled &ldquo;same-event&rdquo; deductible waivers as an optional endorsement, which this general
            tool cannot know about). It does not verify that either policy&apos;s coverage limit is high enough
            to pay the full amount above the deductible. It is a scenario-modeling tool built from the
            numbers you supply, not a claims determination, an adjuster&apos;s assessment, or legal or
            insurance advice. Confirm how your specific policies actually apply their deductibles with a
            licensed insurance agent or your claims adjuster before treating any total here as final.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Separate policy contracts</strong> — two distinct insurance agreements (for example
              a homeowners policy and an auto policy, or a base policy and a standalone endorsement), each
              with its own premium, terms, limits, and deductible, even when purchased from the same
              insurer.
            </li>
            <li>
              <strong>Named peril</strong> — a specific cause of loss (such as windstorm, fire, or falling
              objects) that a policy explicitly lists as covered. Whether the same named peril applies
              identically across two different policies affecting the same event is a question for your
              policy documents, not something this tool assumes.
            </li>
            <li>
              <strong>Umbrella policy&apos;s role in a multi-loss event</strong> — a personal umbrella policy
              sits above your home and auto liability limits and extends liability protection once those
              limits are exhausted; it is generally not designed to reduce or replace the property-damage
              deductibles on the underlying homeowners or auto claims themselves.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how deductibles function within a single policy, the{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the mechanics this tool is modeled on, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer-facing definitions for policy types and coverage terms. For how an
            umbrella policy is meant to interact with underlying home and auto coverage, the{" "}
            <a
              href="https://www.iii.org/article/what-is-personal-liability-umbrella-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s umbrella insurance guide
            </a>{" "}
            is a useful starting point. Always confirm how your specific policies apply in practice with
            your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or a licensed agent.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            category. To compare deductible levels within a single policy rather than across two, try the{" "}
            <Link
              href="/tools/deductibles/deductible-comparison-calculator"
              className="text-blue-600 hover:underline"
            >
              deductible comparison calculator
            </Link>
            . Once you know your total out-of-pocket cost, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            can help estimate what each individual policy would actually pay toward its own claim.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn confusing insurance mechanics,
            like how deductibles apply across separate policies, into numbers you can actually check. Every
            tool runs entirely in your browser and asks for nothing but the figures you choose to enter.
          </p>
        </section>
      </div>
    </>
  );
}

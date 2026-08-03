import type { Metadata } from "next";
import Link from "next/link";
import { RentersInsuranceCoverageCalculatorTool } from "@/components/tools/RentersInsuranceCoverageCalculatorTool";
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

const tool = getToolBySlug("renters-insurance-coverage-calculator")!;

const TITLE = "Renters Insurance Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this renters insurance coverage calculator to get a starting personal property range, an ALE estimate, and a place to sanity-check the liability limit and deductible you're considering.";
const PAGE_URL = `${SITE_URL}/tools/renters/renters-insurance-coverage-calculator`;

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
    question: "Is the personal property range this renters insurance coverage calculator shows an average?",
    answer:
      "No. It's a rough starting point built from your home size and a self-assessed furnishing level, meant to get a plausible range in front of you in seconds. It is not a survey result, a claims average, or industry data. The only way to get a number you can actually rely on when buying a policy is to walk through your own belongings, which is exactly what the personal property inventory calculator on this site is built for.",
  },
  {
    question: "My landlord has an insurance policy. Do I still need my own renters insurance?",
    answer:
      "Yes. A landlord's policy covers the building itself, structural repairs, and the landlord's own liability, not a tenant's personal belongings and not a tenant's personal liability. If a pipe bursts and ruins your furniture, or a guest is injured in your unit, the landlord's policy generally does not respond to either loss. This is one of the most common and most costly misunderstandings renters have about coverage.",
  },
  {
    question: "What does additional living expenses (ALE) coverage actually pay for?",
    answer:
      "ALE pays for reasonable extra costs of living somewhere else, temporary rent, hotel stays, storage, some meals, while your rental unit is being repaired after a covered loss like a fire. Many HO-4 renters policies set the ALE limit as a percentage of your personal property limit, commonly in the 20 to 30 percent range, though the exact percentage and any dollar cap varies by insurer and policy, so confirm it directly on your own policy documents.",
  },
  {
    question: "How is actual cash value different from replacement cost coverage for my belongings?",
    answer:
      "Actual cash value pays what your belongings were worth at the time of the loss, after depreciation, so a five-year-old couch might pay out a fraction of what a new one costs. Replacement cost coverage pays what it actually costs to buy a new equivalent item today, with no depreciation subtracted. Replacement cost coverage typically costs somewhat more in premium but closes a gap that surprises a lot of renters at claim time.",
  },
  {
    question: "Should I use the liability limit this tool suggests, or the liability coverage calculator?",
    answer:
      "This calculator only checks the liability limit you enter against common policy tiers, it doesn't size that number to your personal financial exposure. The renters liability coverage calculator on this site is built specifically to recommend a limit based on what you'd actually need to protect, so use that one when you want a sized recommendation rather than a sanity check.",
  },
  {
    question: "Why does the deductible I enter matter if it doesn't change my coverage limits?",
    answer:
      "Your deductible is what you pay out of pocket before your policy pays anything on a covered claim, so it doesn't change your personal property or liability limits, but it does change how much cash you need on hand if you file a claim, and it typically affects your premium. This tool flags when your entered deductible is a meaningful share of your personal property range so you can check whether you'd actually be able to cover it.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Renters Calculators", href: "/tools/renters" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function RentersInsuranceCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Renters Insurance Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Get a fast starting shape for a renters policy: a rough personal property range for your home
            size, an additional living expenses estimate, and a place to sanity-check the liability limit
            and deductible you&apos;re considering. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="renters" />
        </div>

        <div className="mt-2">
          <RentersInsuranceCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-renters-insurance-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What a Renters Insurance Coverage Calculator Actually Covers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard renters policy, usually written on an HO-4 form, bundles three separate protections
            into one package. Personal property coverage pays to repair or replace your belongings after a
            covered loss like fire, theft, or water damage. Liability coverage pays if you&apos;re legally
            responsible for someone else&apos;s injury or property damage, a guest slipping in your kitchen or
            your dog nipping a visitor, for example. Additional living expenses coverage, often shortened
            to ALE, pays reasonable extra costs of living elsewhere, temporary rent, a hotel, some meals,
            while your unit is being repaired after a covered loss makes it unlivable. This calculator
            gives you a starting shape across all three, which is a very different job than telling you an
            exact number to buy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is the right starting point if you&apos;re shopping for a first renters policy, moving into a
            new place and need a lease-compliant coverage number quickly, or you&apos;ve never actually looked
            at what your current policy&apos;s limits mean in practice. It&apos;s deliberately fast: pick a home
            size, pick roughly how much you own, and you get a shape for the policy in seconds, rather than
            answering a long inventory first. If you already know you want a precise personal property
            number, or you want a liability limit sized to your actual financial exposure rather than a
            generic tier, the two more detailed calculators linked at the bottom of this page are the
            better next step.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Moving From a Rough Starting Point to a Precise Number
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The personal property range above is intentionally rough. It comes from two inputs only, your
            home size and a self-assessed furnishing level, and it exists to give you a plausible range
            before you&apos;ve done any real work. It is not a survey result, a claims-data average, or
            anything published by an insurer or regulator, and it should never be treated as one. The
            reliable path to an actual number is a room-by-room inventory: walk through your home, list
            major items and their approximate replacement cost, and add up the total. The personal property
            inventory calculator on this site is built exactly for that walkthrough, and it will almost
            always produce a different number than the range shown here, sometimes noticeably higher, since
            most people underestimate the combined value of everything they own until they actually count
            it. Use this page to get oriented, then use that one before you buy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a tenant in a one-bedroom apartment who describes their furnishing level as average,
            a typical mix of furniture, a television, a laptop, kitchenware, and clothing, nothing
            especially high-value. That combination produces a starting personal property range of roughly
            $20,000 to $35,000 on this calculator, with an estimated ALE range of about $4,000 to $10,500
            based on the common 20 to 30 percent HO-4 structure. They enter a $100,000 liability limit,
            which lines up with the most common entry-level tier insurers offer, and a $500 deductible, a
            modest share of their property range. That gives them a concrete shape to bring to an agent:
            &ldquo;somewhere in the $20,000 to $35,000 range for belongings, $100,000 liability, $500
            deductible,&rdquo; instead of walking in with no starting number at all. Their next step, before
            actually buying, is running their own room-by-room count through the inventory calculator to
            replace that range with a real figure.
          </p>

          <AdInArticle slot="tool-renters-insurance-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common and most costly mistake renters make is assuming a landlord&apos;s
            insurance policy covers their own belongings or their own liability. It doesn&apos;t. A landlord&apos;s
            policy is written to protect the building structure and the landlord&apos;s own financial
            exposure, not a tenant&apos;s furniture, electronics, or clothing, and generally not a tenant&apos;s
            liability if a guest is hurt inside the unit. Renters who skip coverage because &ldquo;the
            building is insured&rdquo; frequently discover this gap only after a fire, theft, or water damage
            claim, at exactly the moment they can least afford the surprise.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The personal property range is a planning shortcut built from home size and a self-reported
            furnishing level only. It does not know what you actually own, whether you have high-value
            items like jewelry or musical instruments that need a separate rider, or your local cost of
            replacement. The ALE estimate assumes the common 20 to 30 percent-of-personal-property
            structure used on many HO-4 forms, but insurers vary this percentage and some apply a separate
            dollar cap instead, so treat it as directional, not exact. This tool does not size your
            liability limit to your actual financial exposure, does not know your state&apos;s specific
            requirements or your lease&apos;s insurance clause, and does not reflect any particular insurer&apos;s
            underwriting. Confirm every figure with a licensed insurance agent before buying or changing a
            policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>HO-4 policy</strong> — the standard insurance industry policy form for renters
              insurance, bundling personal property, liability, and additional living expenses coverage
              into a single package.
            </li>
            <li>
              <strong>Actual cash value vs. replacement cost</strong> — actual cash value pays what your
              belongings were worth at the time of loss after depreciation; replacement cost pays what it
              costs to buy a new equivalent item today, with no depreciation subtracted.
            </li>
            <li>
              <strong>Liability coverage</strong> — protects you financially if you&apos;re found legally
              responsible for someone else&apos;s injury or property damage, covering legal defense costs and
              any judgment or settlement up to your policy limit.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For coverage definitions beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.iii.org/article/renters-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language overview of what a renters policy includes, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on how policy coverage types work. For a tenant&apos;s
            perspective on renting and housing rights that can intersect with insurance requirements, the{" "}
            <a
              href="https://www.hud.gov/topics/rental_assistance/tenantrights"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of Housing and Urban Development
            </a>{" "}
            publishes tenant resources, and your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            is the authoritative source for any state-specific rule.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              Renters insurance calculators
            </Link>{" "}
            category. For a precise personal property number instead of a rough range, use the{" "}
            <Link href="/tools/renters/renters-personal-property-value-calculator" className="text-blue-600 hover:underline">
              personal property inventory calculator
            </Link>
            . For a liability limit sized to your actual financial exposure instead of a general tier, use
            the{" "}
            <Link href="/tools/renters/renters-liability-coverage-calculator" className="text-blue-600 hover:underline">
              renters liability coverage calculator
            </Link>
            . If you&apos;re comparing an actual settlement offer rather than planning ahead of a purchase,
            the{" "}
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
            Insurance Tools builds free, browser-based calculators that turn insurance shopping into a
            series of straightforward, private questions instead of a confusing quote form. Nothing you
            enter here leaves your browser, and every tool is designed to leave you better prepared for the
            conversation you eventually have with a licensed agent.
          </p>
        </section>
      </div>
    </>
  );
}

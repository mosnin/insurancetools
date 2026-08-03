import type { Metadata } from "next";
import Link from "next/link";
import { RentersLiabilityCoverageCalculatorTool } from "@/components/tools/RentersLiabilityCoverageCalculatorTool";
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

const tool = getToolBySlug("renters-liability-coverage-calculator")!;

const TITLE = "Renters Liability Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "This renters liability coverage calculator sizes your liability limit to your assets and risks like guests, a dog, or subletting. Free, instant, no sign-up.";
const PAGE_URL = `${SITE_URL}/tools/renters/renters-liability-coverage-calculator`;

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
    question: "How much personal liability coverage do renters actually need?",
    answer:
      "There's no single legal answer, since renters insurance liability limits aren't usually mandated the way auto liability minimums are. This calculator uses an asset-protection approach instead: it sizes your suggested limit to the savings, investments, and other property a lawsuit could put at risk, with a $100,000 floor since future earnings stay exposed even when current savings are thin. If your assets exceed the $500,000 ceiling this tool models for a standalone renters policy, pairing it with a personal umbrella policy is worth discussing with a licensed agent.",
  },
  {
    question: "Does renters insurance liability coverage cover a dog bite?",
    answer:
      "Personal liability coverage on a standard renters policy commonly extends to injuries a household pet causes to someone else, which is why this calculator treats dog ownership as a scenario worth flagging. That said, dog liability is specifically underwritten by many insurers: some exclude particular dog breeds, apply lower sub-limits to animal-related claims, or require a signed liability waiver. Confirm your own policy's exact dog liability terms directly with your insurer rather than assuming coverage applies.",
  },
  {
    question: "Does my landlord's insurance protect me if a guest is hurt in my apartment?",
    answer:
      "No. A landlord's policy generally covers the building itself and the landlord's own liability as property owner, not the tenant's personal liability for an incident inside the unit they rent. If a guest is injured in your apartment and decides to pursue a claim, it's typically your personal liability coverage, not your landlord's policy, that responds. This is one of the most common and most costly assumptions renters make about their coverage.",
  },
  {
    question: "What is medical payments to others, and how is it different from liability coverage?",
    answer:
      "Medical payments to others is a small, no-fault sub-limit, often in the low thousands of dollars, that pays a guest's minor medical bills after an injury in your rental regardless of whether you were legally at fault. Personal liability coverage is larger and only pays out when you're found legally responsible for the injury or damage, typically after a claim or lawsuit. This calculator suggests a medical payments figure alongside the liability limit because the two work together rather than substituting for each other.",
  },
  {
    question: "Why does subletting or hosting guests through a rental platform change my risk?",
    answer:
      "More turnover in a rental unit generally means more people passing through who could be injured, and a standard renters policy's liability coverage isn't always written with short-term or commercial hosting in mind. Some insurers treat frequent paid guests as a business activity that falls outside a personal policy's liability protection entirely. If you regularly sublet or host through a platform, it's worth asking your insurer directly whether your existing liability coverage applies or whether you need a separate endorsement.",
  },
  {
    question: "Should I buy a personal umbrella policy instead of raising my renters liability limit?",
    answer:
      "It depends on how much protection you need. A personal umbrella policy sits on top of an existing renters (or auto) policy and extends liability protection well beyond what a standalone renters policy can offer, which matters once your assets exceed the roughly $500,000 ceiling most standalone renters liability limits top out around. If your exposure is below that ceiling, raising your renters liability limit directly is usually the simpler and cheaper option. This calculator flags which situation you're in based on the assets you enter.",
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

export default function RentersLiabilityCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Renters Liability Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size your personal liability limit to your own assets and the specific risk factors your
            household actually has, from hosting guests to owning a dog. Free, instant, and nothing you
            type here leaves your browser.
          </p>
          <LastUpdated category="renters" />
        </div>

        <div className="mt-2">
          <RentersLiabilityCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-renters-liability-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What Renters Liability Coverage Actually Protects
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Renters insurance is usually sold as one bundle, but it&apos;s really two separate protections
            stitched together. One half reimburses you when your own belongings are stolen or damaged.
            The other half, personal liability coverage, protects you when someone else is hurt or their
            property is damaged and you&apos;re the one found responsible. A guest slips on a wet floor and
            breaks a wrist. Your dog nips a visitor while they&apos;re taking off their shoes. A candle you
            forgot about scorches a neighbor&apos;s ceiling below. In every one of these situations, it&apos;s the
            liability portion of your policy that pays a claim or a judgment against you, not the
            personal property portion, and not your landlord&apos;s insurance. This renters liability coverage
            calculator exists because most renters can tell you roughly how much personal property
            coverage they carry, but far fewer can say why their liability limit is set where it is or
            whether it actually matches what they stand to lose.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for renters who are past the point of just accepting whatever liability
            limit a quote defaults to. That includes anyone with meaningful savings or investments who
            hasn&apos;t reconsidered their limit since first signing up, anyone who has recently gotten a dog,
            anyone who regularly hosts guests or house-sits for friends, and anyone considering subletting
            their unit or listing it on a short-term rental platform. If you&apos;re comparing renters
            insurance quotes right now, running your numbers here first gives you a specific liability
            figure to request instead of accepting whatever tier the quote form nudges you toward by
            default.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Limit Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts with the assets figure you enter, savings, investments, and other
            property that a lawsuit could reach, and matches it against three common renters liability
            tiers offered by most insurers: $100,000, $300,000, and $500,000. Assets of $100,000 or less
            map to the $100,000 floor, since a judgment can still exceed your current savings even when
            those savings are modest today. Assets between $100,000 and $300,000 map to the $300,000 tier,
            and anything above that maps to $500,000, which is the ceiling this tool models for a
            standalone renters policy.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            On top of that asset-based baseline, the calculator checks four scenario factors: hosting
            guests often, owning a dog, keeping a water bed, trampoline, or similar item some insurers
            flag as higher risk, and subletting or hosting short-term guests through a rental platform.
            Selecting two or more of these bumps the suggested limit up one tier from the asset-based
            baseline, because liability exposure isn&apos;t only a function of what you own, it&apos;s also a
            function of how many opportunities exist for something to go wrong. You can override the
            suggested tier manually at any time using the buttons under the result. If your entered assets
            exceed the $500,000 standalone ceiling, the tool flags that a personal umbrella policy is
            worth discussing with a licensed agent rather than trying to stretch a renters policy past
            what it&apos;s typically built to cover.
          </p>

          <AdInArticle slot="tool-renters-liability-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a renter with $60,000 in combined savings and investments who owns a dog and hosts
            friends most weekends. Their assets alone would map to the $100,000 floor. But because they&apos;ve
            selected two scenario factors, frequent hosting and dog ownership, the calculator bumps the
            suggestion up one tier to $300,000, along with a $5,000 suggested medical payments to others
            figure instead of the base $1,000, since both flagged scenarios raise the odds of a minor
            guest injury that medical payments coverage is designed to resolve quickly without a formal
            liability claim. That&apos;s a materially different, and more defensible, answer than assuming the
            cheapest available tier is automatically enough simply because current savings are modest.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Most Common Mistake</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            By far the most common and most expensive assumption renters make is believing their
            landlord&apos;s insurance policy protects them personally. It doesn&apos;t. A landlord&apos;s policy is
            written to protect the landlord&apos;s own property and the landlord&apos;s own liability as the
            building owner; it is not a substitute for a tenant&apos;s personal liability coverage, and it
            generally will not pay a claim brought against you individually. A second common mistake is
            adding a dog to the household without checking whether the existing policy&apos;s liability
            coverage extends to animal-related claims at all, since some insurers apply separate sub-limits
            or exclusions for dog liability that a renter only discovers after filing a claim.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the asset-protection method, matching your liability limit to what
            you have to lose, is a reasonable starting point, which is a widely used principle in
            insurance education but not a formula every advisor applies the same way. It does not know
            your state&apos;s specific liability rules, your insurer&apos;s underwriting guidelines, or whether a
            given breed, item, or hosting arrangement is excluded under a specific policy, all of which
            vary by state and by insurer and can change the coverage that actually applies in a real
            claim. Treat the figures here as a planning number to bring into a conversation with a
            licensed insurance agent, not as a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Personal liability coverage</strong> — pays for injuries or property damage you or
              a resident household member (including, commonly, a pet) cause to someone else, up to your
              policy&apos;s limit, once you&apos;re found legally responsible.
            </li>
            <li>
              <strong>Medical payments to others</strong> — a smaller, no-fault sub-limit that pays a
              guest&apos;s minor medical bills after an injury in your rental, regardless of who was at fault.
            </li>
            <li>
              <strong>Umbrella policy</strong> — a separate liability policy that sits on top of an
              existing renters, homeowners, or auto policy and extends protection well beyond what the
              underlying policy alone provides.
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
            publishes a plain-language breakdown of what a standard renters policy covers, including the
            liability and medical payments sections this calculator focuses on. The{" "}
            <a
              href="https://content.naic.org/consumer/renters-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on renters insurance more broadly, and{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the NAIC&apos;s broader consumer insurance library
            </a>{" "}
            covers how personal liability protection generally works across different policy types.
            Before buying or changing coverage, confirm your exact policy terms, including any dog breed
            or item exclusions, directly with your{" "}
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
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              Renters insurance calculators
            </Link>{" "}
            category. If you also want to size your personal property and loss-of-use coverage, not just
            the liability side, the{" "}
            <Link href="/tools/renters/renters-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              renters insurance coverage calculator
            </Link>{" "}
            covers that broader question. If your assets outgrow what a standalone renters liability
            limit can cover, the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            hub includes tools for sizing the umbrella and broader coverage decisions that come next.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for people trying to understand their
            own coverage before they talk to an agent, not after. Nothing you enter is stored or sent
            anywhere; every result updates instantly in your own browser so you can test as many
            scenarios as you need before making a decision.
          </p>
        </section>
      </div>
    </>
  );
}

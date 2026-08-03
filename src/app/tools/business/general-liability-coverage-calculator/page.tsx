import type { Metadata } from "next";
import Link from "next/link";
import { GeneralLiabilityCoverageCalculatorTool } from "@/components/tools/GeneralLiabilityCoverageCalculatorTool";
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

const tool = getToolBySlug("general-liability-coverage-calculator")!;

const TITLE = "General Liability Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this general liability insurance calculator to find a common per-occurrence and aggregate coverage tier for your small business, then check any gap.";
const PAGE_URL = `${SITE_URL}/tools/business/general-liability-coverage-calculator`;

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
    question: "Is $1 million in general liability coverage a legal requirement?",
    answer:
      "No. Unlike auto insurance minimums, general liability limits aren't set by state law for most businesses. The $1M per-occurrence/$2M aggregate tier this calculator suggests as a baseline is a widely used commercial convention, not a legal floor. It shows up so often because it's the limit many commercial landlords, client contracts, and municipal permits ask for, not because a statute requires it. Your own lease, contracts, or industry may set a different number.",
  },
  {
    question: "Does general liability insurance cover a mistake in my professional advice or work?",
    answer:
      "No, and this is the single most common gap this tool sees. General liability covers third-party bodily injury, property damage, and personal and advertising injury, not the financial harm caused by a professional mistake, missed deadline, faulty design, or bad advice. That's what professional liability (errors and omissions) insurance is for. If your business gives advice, designs things, or performs a professional service, pair this calculator's result with the professional liability calculator rather than treating general liability as complete protection.",
  },
  {
    question: "What's the difference between a per-occurrence limit and an aggregate limit?",
    answer:
      "The per-occurrence limit is the most your policy pays for a single claim or incident. The aggregate limit is the total ceiling across every claim during the policy period, usually one year. A standard CGL policy sets the aggregate at twice the per-occurrence limit, which is why $1M/$2M and $2M/$4M are the two tiers this calculator works with, rather than arbitrary numbers.",
  },
  {
    question: "Why did the calculator recommend a higher tier than $1M/$2M for my business?",
    answer:
      "The calculator steps up to $2M/$4M when your entered revenue, customer visit volume, or client-premises work crosses a threshold associated with higher liability exposure — more revenue often means larger contracts with higher insurance requirements attached, higher foot traffic raises the odds of a premises claim, and working on a client's site is a common trigger for that client's contract to demand a specific limit. Check the “why the higher tier” panel in your result for the exact reason.",
  },
  {
    question: "What does adding a client as an additional insured actually do?",
    answer:
      "It extends a defined slice of your general liability policy to also protect the named client against claims arising from your work, without giving them their own separate policy. Client contracts that require you to work on their premises very commonly require this endorsement alongside a specific limit, so if this calculator flagged that factor, expect a contract to ask for it by name.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Business Insurance Tools", href: "/tools/business" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function GeneralLiabilityCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            General Liability Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Get a needs-based general liability coverage tier for your business in seconds, built from
            your revenue, customer traffic, and whether you work on client premises, then see the gap
            against what you already carry.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <GeneralLiabilityCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-general-liability-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What General Liability Insurance Actually Covers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard commercial general liability (CGL) policy, the form most U.S. insurers build from,
            is structured around three core protections: bodily injury, property damage, and personal and
            advertising injury. Bodily injury and property damage coverage responds when your business
            activity, product, or premises causes physical harm to a third party or damages something they
            own, such as a customer slipping in your store or a contractor accidentally damaging a client&apos;s
            fixture. Personal and advertising injury is a narrower, often overlooked piece: it covers
            claims like libel, slander, copyright infringement in your advertising, or wrongful eviction,
            none of which involve physical harm at all. What a CGL policy does not cover is just as
            important as what it does: it excludes your own business&apos;s product recalls, your own vehicles
            (that&apos;s commercial auto), your employees&apos; injuries (that&apos;s workers&apos; compensation), and, most
            consequentially for many small businesses, the financial harm caused by bad professional advice
            or faulty professional work.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Should Use This General Liability Insurance Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is the general-purpose calculator in the Business Insurance Tools category, built for any
            small business owner sizing up a first general liability policy or checking whether their
            current limits still make sense. It&apos;s the right starting point if your business doesn&apos;t fit a
            narrower profile. If your business is dominated by one specific exposure instead, a more
            tailored tool will get you a sharper answer: contractors and tradespeople doing on-site
            physical work should also run the{" "}
            <Link href="/tools/business/contractor-insurance-calculator" className="text-blue-600 hover:underline">
              contractor insurance calculator
            </Link>
            , and any business whose main product is advice, design, consulting, or a professional
            service should treat this calculator as step one and follow it with the{" "}
            <Link href="/tools/business/professional-liability-errors-omissions-calculator" className="text-blue-600 hover:underline">
              professional liability (errors and omissions) calculator
            </Link>
            , since general liability alone does not cover a professional mistake.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Tier Is Derived</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts every business at the $1M per-occurrence/$2M aggregate tier, which is
            worth naming plainly as a common commercial convention rather than a rule this tool invented or
            a legal minimum: it&apos;s the limit that shows up most often in commercial leases, client
            contracts, and municipal permit language, and the U.S. Small Business Administration&apos;s own
            guidance on business insurance points to general liability as foundational coverage for exactly
            this reason. From that baseline, the tool checks three signals you provide. Annual revenue
            above $2,000,000 often correlates with larger contracts that carry their own higher insurance
            requirements. More than 50,000 customer or client visits and interactions a year raises the
            statistical odds of a premises-based claim purely from higher foot traffic. And answering
            &ldquo;yes&rdquo; to working on a client&apos;s premises is flagged because that arrangement commonly triggers a
            contractual requirement for a specific limit and an additional insured endorsement. Any one of
            these three signals steps the recommendation up to the $2M per-occurrence/$4M aggregate tier,
            which follows the standard 2x aggregate multiplier used across the CGL market rather than an
            arbitrary jump. If you&apos;ve entered your current per-occurrence and aggregate limits, the tool
            then subtracts them from the suggested tier to show the exact dollar gap, or confirms your
            current limits already clear the bar.
          </p>

          <AdInArticle slot="tool-general-liability-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a small landscaping business with $650,000 in annual revenue, about 900 client visits
            a year, and regular work performed at clients&apos; homes and offices. Revenue is under the
            $2,000,000 step-up threshold and visit volume is well under 50,000, so those two signals stay
            at baseline, but answering &ldquo;yes&rdquo; to working on client premises is enough on its own to trigger
            the elevated $2M/$4M tier, reflecting how often client contracts in that line of work ask for
            that exact limit plus an additional insured endorsement. If this business currently carries a
            $500,000/$1,000,000 policy left over from its first year of operation, the calculator shows a
            $1,500,000 per-occurrence gap and a $3,000,000 aggregate gap versus the suggested tier, a
            concrete number to bring to an agent rather than a vague sense that coverage might be low.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most expensive mistake is assuming general liability insurance protects the business
            when a client claims the work itself, not a physical accident, was the problem — a missed
            deadline, a design flaw, bad financial or legal advice, or a service that didn&apos;t perform as
            promised. None of that falls under a CGL policy, which only responds to bodily injury, property
            damage, and personal or advertising injury to third parties. A second common mistake is buying
            whatever limit an insurer defaults to during signup rather than checking what your actual
            leases and client contracts require, which can leave a business technically in breach of its
            own contracts even while fully insured. A third is treating the aggregate limit as a soft cap
            that &ldquo;probably won&apos;t matter,&rdquo; when a single serious claim, or two moderate claims in the same
            policy year, can exhaust it and leave later claims in that same period unprotected.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the $1M/$2M and $2M/$4M tiers, both standard CGL market offerings, are
            reasonable planning reference points, and it uses three input signals — revenue, visit volume,
            and client-premises work — as proxies for liability exposure rather than a full underwriting
            assessment. It does not know your specific industry&apos;s claim history, your state&apos;s court
            outcomes, any lease or contract clause that names an exact required limit, or your insurer&apos;s
            underwriting rules, all of which can push the right number higher or lower than what&apos;s shown
            here. It also does not price a policy; premium depends on your industry classification, claims
            history, location, and payroll, none of which this tool collects. Treat the result as a
            starting figure for a conversation with a licensed commercial insurance agent, not a final
            purchase decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Per-occurrence limit</strong> — the most your policy pays out for a single covered
              claim or incident, regardless of how many other claims happen that policy year.
            </li>
            <li>
              <strong>Aggregate limit</strong> — the total ceiling your policy pays across every covered
              claim during the full policy period, typically one year, after which the policy stops paying
              even for a new, otherwise-covered claim.
            </li>
            <li>
              <strong>Additional insured</strong> — a person or business, often a landlord or client, added
              to your policy so they&apos;re also protected against claims arising from your work, without
              needing a separate policy of their own.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For a fuller breakdown of what a commercial general liability policy includes, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines the core coverage types most small businesses should consider, and the{" "}
            <a
              href="https://www.iii.org/article/general-liability-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how general liability responds to bodily injury, property damage, and advertising
            injury claims in practice. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on commercial coverage types, and the{" "}
            <a
              href="https://www.irmi.com/term/insurance-definitions/commercial-general-liability-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              International Risk Management Institute
            </a>{" "}
            maintains a widely cited glossary defining per-occurrence and aggregate limit structure across
            the CGL market. Confirm your business&apos;s exact requirements with your landlord, your client
            contracts, and a licensed commercial insurance agent before buying or changing a policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. If your business&apos;s main exposure comes from on-site physical work, the{" "}
            <Link href="/tools/business/contractor-insurance-calculator" className="text-blue-600 hover:underline">
              contractor insurance calculator
            </Link>{" "}
            is built specifically for that risk profile, and if your business sells advice, design, or
            professional services, pair this result with the{" "}
            <Link href="/tools/business/professional-liability-errors-omissions-calculator" className="text-blue-600 hover:underline">
              professional liability (errors and omissions) calculator
            </Link>{" "}
            to cover the gap general liability leaves open.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that help business owners and
            consumers reason through coverage, cost, and claims decisions before they talk to an agent.
            Every calculator on this site runs entirely in your browser and never asks for a name, an
            email, or a phone number just to see a result.
          </p>
        </section>
      </div>
    </>
  );
}

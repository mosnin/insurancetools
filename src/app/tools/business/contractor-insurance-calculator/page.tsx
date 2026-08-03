import type { Metadata } from "next";
import Link from "next/link";
import { ContractorInsuranceCalculatorTool } from "@/components/tools/ContractorInsuranceCalculatorTool";
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

const tool = getToolBySlug("contractor-insurance-calculator")!;

const TITLE = "Contractor Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this contractor insurance calculator to size a general liability limit to your largest job, value tools and equipment, and check if workers' comp applies.";
const PAGE_URL = `${SITE_URL}/tools/business/contractor-insurance-calculator`;

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
    question: "Does this contractor insurance calculator replace what my contract requires me to carry?",
    answer:
      "No. General contractors, property managers, and commercial clients typically write a required general liability limit directly into the contract or subcontractor agreement, and that number can be higher or lower than what this tool suggests. Use this calculator as a starting point for the conversation, then confirm the exact figure your specific contract, bid package, or client actually requires before you bind a policy.",
  },
  {
    question: "What is a tools and equipment floater, and why isn't it already part of my general liability policy?",
    answer:
      "A standard general liability policy is built to cover third-party bodily injury and property damage claims, not damage to or theft of your own tools and equipment. Most GL policies bundle in only a small tools sublimit, often just a few thousand dollars, which is why contractors who own real equipment value typically add a separate inland marine tools-and-equipment floater sized to what they actually own, including gear that moves between job sites.",
  },
  {
    question: "Why does the workers' compensation flag depend only on whether I have employees?",
    answer:
      "Because that is the trigger most states actually use: workers' compensation requirements are typically driven by whether you have employees on payroll, not by your revenue or project size. This tool flags the need the moment you indicate you have even one employee, but exact rules, exceptions for sole proprietors or family members, and penalties vary by state, so confirm your specific obligation with your state's workers' compensation board.",
  },
  {
    question: "Does this tool know my state or city's contractor license insurance requirements?",
    answer:
      "No, and it never guesses at them. Contractor license bonding and insurance minimums are set at the state or, in some cases, the municipal level, and they vary widely by trade and license type. Treat this calculator's output as a general contracting-industry planning number, then confirm your exact licensing requirement with your local contractor licensing board before you apply for or renew a license.",
  },
  {
    question: "Why does the calculator size general liability off my largest project instead of my total annual revenue?",
    answer:
      "Because that mirrors how the requirement actually shows up in practice. A client or general contractor sets a required GL limit based on the size and risk of the specific job in front of them, not your company's total yearly revenue. A contractor doing one large project and a contractor doing many small ones can have identical revenue but very different required limits, which is why this tool asks for your largest single project value directly.",
  },
  {
    question: "What is a certificate of insurance, and when will I need one?",
    answer:
      "A certificate of insurance (COI) is a document your insurer issues that summarizes your active coverage, limits, and policy dates. Most general contractors and property owners require a COI, often naming them as an additional insured, before they'll let you start work on site. Losing a job because a COI wasn't ready is a common and entirely avoidable mistake, so request one from your agent as soon as a policy is bound.",
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

export default function ContractorInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Contractor Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size a general liability limit to your largest job, value the tools and equipment you actually
            own, and see whether workers&apos; comp and builder&apos;s risk belong in your package. Free,
            instant, and it never asks who you are.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <ContractorInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-contractor-insurance-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Contractor Insurance Calculator Estimates
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A typical contractor insurance package is not one policy, it&apos;s several working together: a
            general liability (GL) policy sized to the jobs you take on, a tools-and-equipment floater
            sized to what you actually own, workers&apos; compensation the moment you have employees, and
            sometimes builder&apos;s risk on larger new-construction or renovation work. This calculator
            treats each of those as its own line rather than folding them into a single vague number, so a
            roofer with a pickup truck full of tools and a general contractor running a crew on a
            multi-million-dollar build get genuinely different answers, not the same output with the
            decimal point moved.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is built for tradespeople and general contractors who are either buying their first
            commercial policy or reviewing whether an existing one still fits their business. If you&apos;re
            about to bid on a job that requires proof of insurance before you can start, run your numbers
            here first so you walk into that conversation with a specific limit in mind rather than
            accepting whatever an agent quotes by default. It&apos;s equally useful mid-year, after your
            revenue grows, your project sizes change, or you hire your first employee, since all three of
            those shifts can change which coverages actually apply to you.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Limits Are Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The general liability recommendation is driven by your largest single project value, not your
            total revenue, because that&apos;s how the real requirement usually shows up: a general
            contractor or client writes a specific limit into the contract, and it&apos;s common industry
            practice for that required limit to scale with the size and risk of the job. Projects up to
            $1,000,000 typically pair with a $1,000,000 per-occurrence / $2,000,000 aggregate GL policy,
            which is a widely used baseline across most trades. Between $1,000,000 and $5,000,000, the
            calculator suggests stepping up to $2,000,000 per occurrence with a $4,000,000 aggregate. Above
            $5,000,000, it suggests keeping a $1,000,000 / $2,000,000 base GL policy and layering roughly
            $5,000,000 of umbrella or excess liability on top, which is often more cost-effective than
            buying a very high primary GL limit outright. Separately, if your revenue implies you&apos;re
            running four or more projects near your largest size every year, the tool flags that a shared
            aggregate limit can get drawn down faster with higher job volume, regardless of any single
            job&apos;s size.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tools-and-equipment figure works differently: it simply compares what you own against a
            commonly cited small-tools sublimit, often around $2,500, that many GL policies bundle in by
            default. Anything above that sublimit is flagged as a candidate for a separate inland marine
            floater, since that&apos;s the coverage actually designed to insure equipment against theft or
            damage, including gear you rent or lease and are contractually responsible for. Workers&apos;
            compensation is flagged purely on whether you indicated having employees, since that&apos;s the
            trigger most states use, and builder&apos;s risk gets a soft mention once your largest project
            crosses $250,000, a size where materials and work-in-progress exposure typically becomes worth
            a conversation.
          </p>

          <AdInArticle slot="tool-contractor-insurance-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a remodeling contractor with $350,000 in annual revenue, a largest single kitchen and
            addition project worth $180,000, $45,000 in owned tools and equipment including a truck-mounted
            compressor and several specialty saws, and two full-time employees. Because the largest project
            falls under $1,000,000, the calculator suggests a $1,000,000 per-occurrence / $2,000,000
            aggregate GL policy, no umbrella flag yet. Their revenue implies roughly two projects this size
            per year, below the four-job threshold that would trigger the aggregate-limit note. Their
            $45,000 in equipment sits about $42,500 above the typical $2,500 small-tools sublimit, so the
            tool flags a tools floater in that amount. Because they have employees, workers&apos;
            compensation is flagged as required, pending confirmation with their state. That&apos;s a
            materially more specific package than a generic &ldquo;get a $1 million policy&rdquo; answer, and
            one this contractor can bring directly into a quote request.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most expensive mistake is leaving rented or leased equipment off a tools floater
            entirely, on the assumption that a rental company&apos;s own insurance will cover it if it&apos;s
            damaged or stolen on your job site. Most rental agreements make the renter responsible for that
            equipment while it&apos;s in their possession, which means an uninsured piece of rented gear can
            turn into a direct out-of-pocket loss. A close second is showing up to a job site without a
            certificate of insurance ready to hand over, or without the general contractor added as an
            additional insured when the contract requires it. Contractors lose start dates, and sometimes
            entire jobs, over paperwork that a five-minute call to an agent could have prevented.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator models common contracting-industry practice for how required GL limits tend to
            scale with project size, and how tools coverage and workers&apos; comp needs typically show up
            in a contractor&apos;s package. Those are widely used conventions, not universal rules. It does
            not know your specific contract&apos;s required limit, your state or municipality&apos;s
            contractor-license insurance minimums, which vary and should be confirmed with your local
            licensing board, or your insurer&apos;s underwriting rules for your particular trade. It also
            can&apos;t account for trade-specific exposures such as professional liability for design work
            or pollution liability for certain specialty trades. Treat every number here as a planning
            figure to bring into a conversation with a licensed insurance agent, not a final answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Inland marine coverage</strong> — insures tools, equipment, and materials that move
              between job sites or are stored off-premises, filling the gap a standard GL policy&apos;s
              small tools sublimit leaves open.
            </li>
            <li>
              <strong>Certificate of insurance (COI)</strong> — a document your insurer issues showing your
              active coverage, limits, and policy dates, commonly required by a general contractor or
              property owner before work begins.
            </li>
            <li>
              <strong>Additional insured endorsement</strong> — an add-on to your GL policy that extends
              certain protections to another party, typically the general contractor or property owner, for
              claims arising out of your work on their project.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For general guidance beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            publishes an overview of common business insurance types, and the{" "}
            <a
              href="https://www.iii.org/business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down how commercial general liability and equipment coverage typically work. For
            workers&apos; compensation basics, the{" "}
            <a
              href="https://www.dol.gov/general/topic/workcomp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of Labor
            </a>{" "}
            outlines the federal role and how state systems generally operate. Before applying for or
            renewing a contractor license, confirm your exact insurance and bonding requirement with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or your local contractor licensing board.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance tools
            </Link>{" "}
            category. If you need to confirm the general liability figure in more depth, the{" "}
            <Link href="/tools/business/general-liability-coverage-calculator" className="text-blue-600 hover:underline">
              general liability coverage calculator
            </Link>{" "}
            walks through that limit on its own. Once you&apos;ve confirmed you have employees, the{" "}
            <Link href="/tools/business/workers-compensation-cost-estimator" className="text-blue-600 hover:underline">
              workers&apos; compensation cost estimator
            </Link>{" "}
            turns that requirement into an actual premium estimate.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the coverage decisions that actually
            come up running a business, not just carrying a personal policy. Every tool runs entirely in
            your browser, collects nothing about you, and is designed to leave you with a specific number
            to bring to a licensed agent instead of a vague sense of what you might need.
          </p>
        </section>
      </div>
    </>
  );
}

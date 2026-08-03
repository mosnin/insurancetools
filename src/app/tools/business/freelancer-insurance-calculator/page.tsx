import type { Metadata } from "next";
import Link from "next/link";
import { FreelancerInsuranceCalculatorTool } from "@/components/tools/FreelancerInsuranceCalculatorTool";
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

const tool = getToolBySlug("freelancer-insurance-calculator")!;

const TITLE = "Freelancer Insurance Calculator: GL + E&O Bundle Guide";
const DESCRIPTION =
  "Try this freelancer insurance calculator to size a combined liability and E&O bundle from your revenue and work type, plus equipment and platform notes.";
const PAGE_URL = `${SITE_URL}/tools/business/freelancer-insurance-calculator`;

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
    question: "Does my personal umbrella policy cover my freelance work?",
    answer:
      "Typically not. A personal umbrella policy extends the liability limits on your existing home and auto policies, and both of those are written to cover personal, non-business activity. Most personal umbrella policies specifically exclude claims arising from a business pursuit, including freelance work, even if you run it out of your own house. If a client claim came in, you'd likely be relying on a business policy, not your personal umbrella, to respond. Confirm the exact exclusion wording with your carrier or agent, since policy language varies.",
  },
  {
    question: "I only have one client and I'm paid on a 1099 — do I still need business insurance?",
    answer:
      "Being paid as a 1099 contractor for a single client doesn't remove your liability exposure; if anything, it confirms you're operating as an independent business rather than an employee, which is exactly the arrangement business insurance is built for. A single-client freelancer can still be sued over a missed deadline, a content dispute, or an on-site accident. The number of clients you have changes how concentrated your revenue is, not whether the underlying liability exists.",
  },
  {
    question: "What's the difference between general liability and professional liability (E&O) for a freelancer?",
    answer:
      "General liability responds to third-party bodily injury or property damage claims, like a client tripping over your equipment cord during an on-site shoot. Professional liability, also called errors and omissions or E&O, responds to claims that your work itself caused a financial loss, like a missed deadline, a coding error, or a factual mistake in delivered content. Most freelancers carry some exposure to both, which is why this calculator suggests a combined bundle limit rather than pricing either coverage alone.",
  },
  {
    question: "Why does the calculator ask about equipment value separately from revenue?",
    answer:
      "General liability and E&O coverage protect you against claims other people bring against you; neither one reimburses you for damage to your own gear. A dropped camera body, a stolen laptop, or damaged lighting equipment is a first-party loss, which typically needs its own business personal property or inland marine coverage. The calculator flags this separately so a photographer or videographer with real equipment value doesn't assume the liability bundle already has it covered.",
  },
  {
    question: "Do freelance marketplaces and clients actually require proof of insurance?",
    answer:
      "It's an increasingly common ask, particularly for larger contracts, on-site work, and corporate clients working with outside vendors. Requirements vary widely by platform and by client, from no requirement at all to a specific named minimum limit and an additional-insured endorsement. This calculator can't look up a specific platform's current policy, so treat any contract- or platform-stated minimum as the number to check your coverage against directly.",
  },
  {
    question: "How is this different from the professional liability (E&O) calculator on this site?",
    answer:
      "The E&O calculator sizes a per-claim limit around your single largest contract, which fits a consultant or firm with a few large, well-defined engagements. This tool is built for freelancers whose work is often spread across many smaller client relationships, so it sizes a combined bundle limit off total annual revenue instead, and adds work-type and equipment guidance that the contract-based tool doesn't cover.",
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

export default function FreelancerInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Freelancer Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size a combined liability and E&amp;O bundle limit from your freelance revenue and work type,
            with a note on equipment coverage and what clients or platforms may require. Free, instant, no
            sign-up.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <FreelancerInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-freelancer-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why So Many Freelancers Skip This Entirely</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most freelancers start out as a side project or a single client relationship, and business
            insurance rarely makes the list of first-year priorities next to finding clients and getting
            paid on time. The problem is that the underlying exposure doesn&apos;t wait for revenue to grow.
            A freelance writer can still be sued over a missed deadline that cost a client a launch date. A
            developer can still be blamed for a bug that took down a client&apos;s site. A photographer can
            still knock over a client&apos;s equipment during a shoot. None of that requires a large business,
            an office, or employees, and none of it is automatically covered by a health plan, a personal
            auto policy, or the homeowners policy on the apartment where the work happens. This calculator
            exists for the freelancer who has never had a reason to think about this until a client contract
            asks for proof of it, or until something has already gone wrong.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for solo, independent freelancers, writers, designers, developers,
            photographers, marketers, editors, and similar one-person operations, not for firms with
            employees or a payroll to account for. If you have staff, a workers&apos; compensation obligation
            and a different liability profile come into play that this tool doesn&apos;t model. If your
            business is built around a small number of large, well-scoped contracts rather than many
            smaller client relationships, the site&apos;s{" "}
            <Link href="/tools/business/professional-liability-errors-omissions-calculator" className="text-blue-600 hover:underline">
              professional liability (E&amp;O) calculator
            </Link>{" "}
            or{" "}
            <Link href="/tools/business/consultant-insurance-calculator" className="text-blue-600 hover:underline">
              consultant insurance calculator
            </Link>{" "}
            may fit your situation more closely.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Bundle Limit Is Derived</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator takes your entered annual revenue and multiplies it by an adjustable factor,
            defaulting to 1x, to produce a target bundle figure. That target is then rounded up to the
            nearest of four commonly sold combined general liability and E&amp;O bundle tiers ($250,000,
            $500,000, $1 million, or $2 million), rather than displayed as an artificially precise number.
            A revenue multiple is a reasonable starting point for freelancers specifically because, unlike a
            consultant sizing coverage around one dominant contract, a freelancer&apos;s exposure is usually
            spread across many smaller client relationships where no single contract defines the risk. The
            multiplier is yours to adjust; some freelancers with concentrated, higher-value clients may
            reasonably target a higher multiple, while others just starting out may target lower. Your
            selected work type doesn&apos;t change this math, but it changes which half of the bundle, general
            liability or E&amp;O, the tool flags as the higher priority for your specific risk pattern.
          </p>

          <AdInArticle slot="tool-freelancer-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a freelance photographer who billed $60,000 last year, carries about $8,000 in camera
            bodies, lenses, and lighting gear, and leaves the multiplier at the 1x default. The calculator
            targets $60,000, rounds it up to the $250,000 bundle tier, and flags general liability plus
            equipment coverage as the higher priority since in-person work carries more on-site accident
            exposure than a purely remote freelancer&apos;s work. It also flags the $8,000 of equipment value
            directly, since a $250,000 liability bundle does nothing for a dropped camera body, that&apos;s a
            first-party loss a business personal property or inland marine add-on is built to cover. If the
            same photographer later signs a corporate event contract that specifies a $1 million minimum
            and an additional-insured requirement, that contract clause becomes the binding number to check
            against, not the calculator&apos;s revenue-based estimate.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps You Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is assuming an existing personal umbrella policy, homeowners
            policy, or auto policy already extends to freelance work; nearly all personal lines policies
            carry a business-pursuits exclusion that specifically carves out paid business activity, even
            when it&apos;s conducted from a spare bedroom. A second common mistake is treating &ldquo;I&apos;m
            just a freelancer&rdquo; as a reason business insurance doesn&apos;t apply, when the sole-proprietor
            structure most freelancers operate under actually means business liabilities and personal
            assets aren&apos;t separated the way they would be inside an LLC or corporation. A third is buying
            equipment coverage and general liability but never asking whether either includes E&amp;O for
            the actual deliverable, the missed deadline or the disputed content, rather than physical
            damage or injury.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a revenue-multiple method is a reasonable starting point for a solo
            freelancer&apos;s bundle limit, which is a common approach among insurance educators but not a
            regulatory formula or a figure any specific insurer is bound to quote. It does not know your
            state&apos;s licensing rules, your specific client contract language, your claims history, or an
            underwriter&apos;s pricing. It assumes solo freelance work with no employees; if you hire even one
            part-time assistant, workers&apos; compensation and employment-related exposures enter the picture
            in ways this tool doesn&apos;t model. Treat every figure here as a planning number to bring into a
            conversation with a licensed insurance agent, not as a final quote or a guaranteed outcome.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Sole proprietor</strong> — the default legal structure for a freelancer who hasn&apos;t
              formed an LLC or corporation, where the business and the individual are legally the same
              entity, so business liabilities can reach personal assets without a separate business
              insurance policy in place.
            </li>
            <li>
              <strong>1099 contractor</strong> — an independent worker paid without payroll tax withholding,
              reported to the IRS on Form 1099 rather than a W-2, which reflects an independent business
              relationship rather than employee status, but does not by itself provide any liability
              protection.
            </li>
            <li>
              <strong>Business owner&apos;s policy (BOP)</strong> — a packaged policy that typically bundles
              general liability and business property coverage together, often at a lower combined cost
              than buying each separately; some BOPs can add E&amp;O or other endorsements depending on the
              carrier.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For guidance on the underlying coverage types this tool references, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            publishes an overview of common small business coverage types, and the{" "}
            <a
              href="https://www.iii.org/article/business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how general liability and professional liability differ in practice. For the tax side
            of freelance and 1099 work referenced above, the{" "}
            <a
              href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              IRS Self-Employed Individuals Tax Center
            </a>{" "}
            covers how sole proprietor and independent contractor status is defined. Confirm any
            state-specific requirement with your{" "}
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
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. If your freelance business grows into a small firm with a handful of large,
            well-defined engagements rather than many smaller ones, the{" "}
            <Link href="/tools/business/consultant-insurance-calculator" className="text-blue-600 hover:underline">
              consultant insurance calculator
            </Link>{" "}
            is built for that shift. For a deeper look at sizing a professional liability limit around one
            specific contract, see the{" "}
            <Link href="/tools/business/professional-liability-errors-omissions-calculator" className="text-blue-600 hover:underline">
              professional liability (E&amp;O) calculator
            </Link>
            .
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that walk through the actual math behind
            an insurance decision instead of just collecting your details for a quote request. Every tool on
            this site runs entirely in your browser and is meant to leave you better prepared for the
            conversation with a licensed agent, not to replace it.
          </p>
        </section>
      </div>
    </>
  );
}

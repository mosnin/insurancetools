import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { ConsultantInsuranceCalculatorTool } from "@/components/tools/ConsultantInsuranceCalculatorTool";
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
 * This tool is new to the current build batch, so it is not yet wired into
 * the central `src/lib/tools.ts` registry (a separate process integrates
 * that centrally). The Tool object below is authored locally so this page
 * does not depend on registry state that doesn't exist yet; once the
 * registry entry lands, the two should describe the same tool.
 */
const tool: Tool = {
  slug: "consultant-insurance-calculator",
  name: "Consultant Insurance Calculator",
  description:
    "Get a coverage checklist for independent consultants: a sized errors & omissions limit plus flags for general liability and cyber coverage based on how you work.",
  category: "Business",
  categorySlug: "business",
  keywords: [
    "consultant insurance calculator",
    "do consultants need insurance",
    "consultant liability insurance calculator",
    "business insurance for consultants",
    "independent consultant insurance cost",
    "consulting E&O insurance calculator",
  ],
  relatedTools: ["professional-liability-errors-omissions-calculator", "freelancer-insurance-calculator"],
};

const TITLE = "Consultant Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this consultant insurance calculator to size an E&O limit from your engagement value and client load, then check general liability and cyber coverage needs.";
const PAGE_URL = `${SITE_URL}/tools/business/consultant-insurance-calculator`;

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
    question: "Do consultants really need their own insurance if they work from home?",
    answer:
      "Yes, in most cases. A home-based consulting practice removes premises risk from your own property, but it doesn't remove the risk that a client loses money because of advice, analysis, or a deliverable you provided. That's what errors & omissions coverage responds to, and it exists whether you work from a home office, a coworking space, or a client site. Many client contracts also require proof of E&O or general liability coverage before you can start work, regardless of where you're based.",
  },
  {
    question: "How is this different from the professional liability (E&O) calculator?",
    answer:
      "The professional liability and errors & omissions calculator focuses on sizing a single E&O limit in detail. This tool is built specifically for consultants and advisors: it uses a simpler E&O sizing shortcut (average engagement value times concurrent clients) and adds a broader checklist covering general liability and cyber coverage, since consulting risk usually spans more than one policy type. If you already know you only need to size an E&O limit precisely, the dedicated calculator goes deeper on that one number.",
  },
  {
    question: "Why does meeting clients in person change the recommendation?",
    answer:
      "Errors & omissions coverage responds to financial harm from your advice or work product, not to a physical injury or property damage that happens during an in-person meeting. If you visit client offices, meet at a coworking space, or run in-person workshops, general liability coverage is what typically responds to a slip, fall, or accidental property damage claim. Consultants who work entirely by phone, video, and email carry meaningfully less of that particular exposure.",
  },
  {
    question: "Do I need cyber coverage if I only give advice and don't store much data?",
    answer:
      "It depends on what counts as \"not much.\" Even a spreadsheet of client financials, a shared drive with employee records, or notes from a confidential strategy session can trigger a data breach obligation if it's exposed, lost, or hacked, and that response cost is usually a cyber liability claim rather than an E&O claim. If you genuinely never receive, store, or transmit client data beyond a signed contract, the cyber flag matters less, but most consulting engagements involve more client information than people initially assume.",
  },
  {
    question: "What if I hire subcontractors to help deliver a consulting engagement?",
    answer:
      "Your own E&O and general liability policies typically cover your acts, not automatically a subcontractor's. If a subcontractor's mistake creates a claim, a client may come after you first since you hold the contract, and your policy may or may not extend to cover that depending on its wording. It's common practice to require subcontractors to carry their own E&O and general liability coverage and to name you as an additional insured or provide a certificate of insurance before they start work.",
  },
  {
    question: "Is the suggested E&O limit this tool gives me a guaranteed adequate amount?",
    answer:
      "No. It's a rough sizing shortcut, not an underwriting calculation. Some client contracts specify a required minimum limit directly, some industries carry materially higher claim sizes than others, and an insurer's actual quote depends on your specific services, claims history, and risk profile. Treat the suggested tier as a starting point for a conversation with a licensed broker, not as a final number.",
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

export default function ConsultantInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Consultant Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Independent consultants face advice-based risk, not product or premises risk, which is why one
            liability number rarely tells the whole story. This consultant insurance calculator sizes an
            E&amp;O limit from your own client load and flags the other coverage lines worth reviewing.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <ConsultantInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-consultant-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Consultants Carry a Different Risk Profile</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A retailer&apos;s biggest insurance worry is usually a customer slipping on a wet floor or a fire
            damaging inventory. A consultant&apos;s biggest worry looks nothing like that. The product a
            consultant sells is a recommendation, an analysis, a strategy, or a deliverable built on
            professional judgment, and the risk is that the judgment turns out to be wrong, incomplete, or
            poorly executed in a way that costs the client real money. General liability insurance, the
            policy most small businesses reach for first, is built around bodily injury and property
            damage. It typically doesn&apos;t respond to a client claiming your advice caused a financial loss.
            That gap is exactly what errors &amp; omissions (E&amp;O) coverage, sometimes called professional
            liability insurance, is built to close, which is why it sits at the center of this tool rather
            than at the bottom of a checklist.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for independent consultants, advisors, coaches, and small consulting firms
            trying to figure out what coverage actually applies to their specific way of working, rather
            than a generic small-business insurance checklist. It&apos;s a useful next step once you&apos;ve decided
            consulting is a real, ongoing business rather than the occasional side project, especially once
            client contracts start naming specific insurance requirements or you&apos;re juggling more than one
            engagement at a time. If you already know your exact E&amp;O limit and just want to fine-tune
            that single number, the site&apos;s dedicated professional liability calculator goes deeper on that
            calculation; this tool is for seeing the fuller coverage picture at once.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Checklist and E&amp;O Shortcut Work</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Rather than asking for a full income statement, this calculator uses a shortcut built around two
            numbers you already know off the top of your head: your average engagement value and roughly how
            many clients you work with at once. Multiplying the two approximates a rough worst-case exposure,
            the idea being that a serious dispute rarely stays contained to a single client relationship, and
            it&apos;s realistic to plan for more than one engagement being in question around the same time. That
            exposure figure is then matched to the smallest standard E&amp;O limit tier ($500,000, $1,000,000,
            $2,000,000, or $5,000,000) that covers it, since insurers sell E&amp;O in tiers like these rather
            than arbitrary dollar amounts.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            General liability gets flagged separately, driven entirely by whether you said you meet clients
            in person or work at their location, since that&apos;s the scenario where a physical injury or
            property damage claim, not a financial-loss claim, becomes possible. Cyber coverage is flagged
            the same way, based on whether you handle client financial, health, or otherwise confidential
            data, since a data exposure incident is typically a cyber liability claim regardless of how small
            your consulting practice is. None of these flags are legal requirements this tool is asserting;
            they&apos;re a starting checklist to bring into a conversation with a broker.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider an independent operations consultant with an average engagement value of $20,000 who
            typically juggles four active clients at once, meets occasionally on client premises for
            workshops, and regularly receives client financial data as part of the engagements. The rough
            exposure works out to $80,000 ($20,000 times four), which lands the E&amp;O suggestion at the
            $500,000 tier, the smallest standard limit available, since even this exposure figure sits well
            under it. Because this consultant meets clients in person, general liability gets flagged as
            recommended, and because client financial data is part of the work, cyber coverage gets flagged
            too. The result is a three-line starting checklist rather than a single number that would have
            ignored two of those three real exposures entirely.
          </p>

          <AdInArticle slot="tool-consultant-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming a home-based, one-person consulting business is too small or
            too informal to need real insurance, often right up until a client contract requires proof of
            coverage before a project can start, or a dispute over a deliverable turns into a demand letter.
            A second mistake is treating subcontractors as covered under your own policy by default; most
            E&amp;O and general liability policies respond to your own acts, not automatically to a
            subcontractor&apos;s, which is why serious consulting practices require subcontractors to carry their
            own coverage and provide a certificate of insurance before work begins. A third is buying a
            single policy and assuming it covers everything, when general liability, E&amp;O, and cyber
            liability each respond to genuinely different triggers.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the average-engagement-value times concurrent-clients shortcut is a
            reasonable rough proxy for exposure, which is a simplified planning heuristic, not an actuarial
            calculation an underwriter would use. It doesn&apos;t know your actual client contracts, any
            insurance minimums those contracts specify, your industry&apos;s typical claim severity, your claims
            history, or your state&apos;s specific rules. It also doesn&apos;t account for employees, which would bring
            workers&apos; compensation into the picture, or for owned property, which would bring commercial
            property coverage into the picture. Treat every result here as a starting checklist for a
            conversation with a licensed insurance broker, not as a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Indemnification clause</strong> &mdash; contract language where one party agrees to
              cover the other&apos;s losses or legal costs arising from specific events; many client contracts
              pair an indemnification clause with a required minimum insurance limit.
            </li>
            <li>
              <strong>Subcontractor liability</strong> &mdash; the question of whether a subcontractor&apos;s
              mistake is covered under your policy, theirs, or neither; most policies respond to your own
              acts and don&apos;t automatically extend to a subcontractor&apos;s without specific endorsement.
            </li>
            <li>
              <strong>Claims-made vs. occurrence policy</strong> &mdash; a claims-made policy only responds
              to claims filed while the policy is active (often requiring &ldquo;tail&rdquo; coverage after
              you stop consulting), while an occurrence policy responds to incidents that happened during the
              policy period regardless of when the claim is filed. Most E&amp;O policies are written on a
              claims-made basis.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For coverage guidance beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines the coverage types small businesses and independent consultants commonly need, and the{" "}
            <a
              href="https://www.iii.org/article/errors-and-omissions-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how errors &amp; omissions coverage works and what it typically excludes. The{" "}
            <a
              href="https://www.iii.org/article/what-does-cyber-insurance-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s cyber coverage guide
            </a>{" "}
            covers what a data breach policy responds to, and the{" "}
            <a
              href="https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-defined"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              IRS&apos;s independent contractor guidance
            </a>{" "}
            is a useful reference if you&apos;re also sorting out how subcontractor relationships are classified.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. For a deeper dive into sizing a single E&amp;O limit, see the{" "}
            <Link
              href="/tools/business/professional-liability-errors-omissions-calculator"
              className="text-blue-600 hover:underline"
            >
              professional liability (errors &amp; omissions) calculator
            </Link>
            . If you work independently on a project basis rather than running a consulting firm, the{" "}
            <Link href="/tools/business/freelancer-insurance-calculator" className="text-blue-600 hover:underline">
              freelancer insurance calculator
            </Link>{" "}
            is built around that slightly different working pattern.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that walk through real insurance
            decisions instead of just collecting your details. Nothing you type into this consultant
            calculator leaves your browser, and every recommendation is meant to prepare you for a sharper
            conversation with a licensed broker, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

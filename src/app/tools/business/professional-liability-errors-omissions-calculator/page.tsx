import type { Metadata } from "next";
import Link from "next/link";
import { ProfessionalLiabilityErrorsOmissionsCalculatorTool } from "@/components/tools/ProfessionalLiabilityErrorsOmissionsCalculatorTool";
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

const tool = getToolBySlug("professional-liability-errors-omissions-calculator")!;

const TITLE = "Professional Liability (E&O) Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this professional liability insurance calculator to size an E&O limit from your largest contract, active engagements, and any client-required minimum.";
const PAGE_URL = `${SITE_URL}/tools/business/professional-liability-errors-omissions-calculator`;

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
    question: "Does this professional liability insurance calculator give me an exact coverage limit to buy?",
    answer:
      "No. It suggests a starting point using a contract-multiple method common among brokers who work with consultants and service firms, then checks that suggestion against any client-required minimum you enter. Your actual limit should also reflect your industry's typical claim severity, your specific services, and your insurer's underwriting, none of which this calculator has access to. Bring the result into a conversation with a licensed agent rather than treating it as final.",
  },
  {
    question: "How is the suggested E&O coverage limit calculated?",
    answer:
      "The calculator starts from your largest single contract value and applies a 2x multiple, since a serious claim on your biggest engagement is a realistic worst case many brokers plan around. If you enter five or more concurrent active engagements, it steps the multiple up to 3x, since more simultaneous work raises the odds that two unrelated claims could land inside the same policy period. It then rounds up to a common policy tier and pairs the per-claim figure with a 2x aggregate, a structure frequently seen in E&O policies but not the only one insurers offer.",
  },
  {
    question: "What's the difference between professional liability (E&O) and general liability insurance?",
    answer:
      "Professional liability, also called errors and omissions insurance, covers financial loss a client claims resulted from your professional advice, a missed deadline, a design flaw, or a similar service mistake. General liability instead covers third-party bodily injury or property damage, like a client slipping in your office. Many service businesses need both; the general liability coverage calculator on this site handles that separate question.",
  },
  {
    question: "What is a claims-made policy, and why does it matter for E&O coverage?",
    answer:
      "Most E&O policies are written on a claims-made basis, meaning the policy in force when a claim is filed responds, not the policy that was active when the mistake actually happened. That makes the retroactive date, the earliest date a covered incident can have occurred, critical to check whenever you switch carriers, since a gap can leave earlier work unprotected. If you close a business or drop coverage, ask about extended reporting period (\"tail\") coverage, since claims can surface years after an engagement ends.",
  },
  {
    question: "Do solo consultants with no employees still need E&O insurance?",
    answer:
      "Usually yes. E&O responds to claims about the quality or accuracy of your professional work, not workplace injuries, so having zero employees doesn't reduce that exposure. It's also increasingly common for client contracts, RFPs, and vendor agreements to require proof of E&O coverage before a solo consultant can even be engaged, regardless of headcount.",
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

export default function ProfessionalLiabilityErrorsOmissionsCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Professional Liability (E&amp;O) Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size an errors &amp; omissions coverage limit from your largest contract, your concurrent
            workload, and any minimum a client contract already requires. Free, instant, and it never asks
            who you are.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <ProfessionalLiabilityErrorsOmissionsCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-professional-liability-eo-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Professional Liability Insurance Calculator Solves
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consultants, agencies, and other service businesses face a version of insurance shopping that
            general auto or home calculators don&apos;t address: there&apos;s no vehicle value or square footage to
            anchor a limit to, only the size of the work itself. This professional liability insurance
            calculator uses your largest single contract, since that&apos;s the engagement where a serious
            claim would do the most financial damage, and layers in how many engagements you&apos;re juggling
            at once and any minimum a client has already put in writing. The result is a defensible starting
            figure to bring into a quote, not a generic industry average that ignores your actual client
            base.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            E&amp;O Coverage vs. General Liability: Two Different Risks
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Professional liability, commonly shortened to E&amp;O for errors and omissions, responds when a
            client claims your professional advice, deliverable, or service caused them a financial loss:
            a marketing plan built on bad assumptions, a software bug that corrupted client data, an
            accountant&apos;s missed filing, or a designer&apos;s spec error. General liability covers a
            different category entirely, third-party bodily injury or property damage arising from your
            business operations, like a client tripping over a cord in your office. A service business
            with a physical location or client visits typically needs both policies, not one instead of
            the other. If you haven&apos;t sized that separate limit yet, the{" "}
            <Link href="/tools/business/general-liability-coverage-calculator" className="text-blue-600 hover:underline">
              general liability coverage calculator
            </Link>{" "}
            handles that question specifically.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone whose business is the advice or the work product itself:
            independent consultants, marketing and design agencies, IT and software contractors,
            financial and tax advisors, architects and engineers, recruiters, and any firm that bills
            clients for professional judgment rather than a physical product. If you&apos;re weighing a
            broader small-business insurance package rather than E&amp;O specifically, the{" "}
            <Link href="/tools/business/consultant-insurance-calculator" className="text-blue-600 hover:underline">
              consultant insurance calculator
            </Link>{" "}
            looks at the fuller picture of coverage types a solo or small consulting practice typically
            considers.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Limit Is Derived</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator multiplies your largest single contract value by 2, a common starting point
            among brokers who work with professional-services clients, on the reasoning that your biggest
            engagement represents the most plausible large claim you could face. If you report five or
            more concurrent active engagements, the multiple steps up to 3x instead, since more work in
            flight at once raises the odds that two unrelated claims could surface within the same policy
            period rather than years apart. That raw figure is then rounded up to a limit insurers
            actually sell in, such as $250,000, $500,000, $1 million, or $2 million, rather than displayed
            as an oddly precise number like $246,000. The tool pairs that per-claim figure with a 2x
            aggregate, a structure frequently seen in E&amp;O policies (for example, $1 million per claim and
            $2 million aggregate), though carriers do offer other ratios. Whenever a client-required
            minimum you enter is higher than this contract-multiple suggestion, the tool treats the
            contractual figure as the binding one, since a signed agreement generally overrides a rule of
            thumb.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider an independent marketing consultant with an average engagement value of $25,000,
            four active clients at once, and a largest single contract worth $120,000 for an annual
            retainer. With four concurrent engagements, the calculator applies the 2x multiple, producing
            a raw figure of $240,000, rounded up to the $250,000 tier as the suggested per-claim limit,
            paired with a $500,000 aggregate. If that consultant then signs a new contract requiring proof
            of at least $1 million in E&amp;O coverage, that clause becomes the binding figure instead, since
            it&apos;s a specific contractual obligation rather than a general guideline. Either way, the
            combined value of all four active engagements ($100,000) stays comfortably under the suggested
            aggregate, which is a useful secondary check beyond just the largest contract.
          </p>

          <AdInArticle slot="tool-professional-liability-eo-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most frequent mistake is assuming general liability insurance already covers a bad piece
            of professional advice; it doesn&apos;t, and a claim filed against the wrong policy type can be
            denied outright while the actual E&amp;O exposure sits uninsured. A second is sizing E&amp;O around
            average billings rather than the largest single contract, which understates the limit needed
            for the one engagement that would actually generate the biggest claim. A third is letting a
            policy lapse or switching carriers without checking the retroactive date on the new policy,
            which can leave earlier work outside the new policy&apos;s coverage window entirely.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes that sizing E&amp;O around a multiple of your largest contract, adjusted
            for concurrent workload, is a reasonable planning method, which reflects common broker
            practice rather than a regulatory formula. There is no universal state-mandated minimum for
            professional liability insurance the way there is for auto liability, so this tool cannot and
            does not check your figures against any such requirement. It also doesn&apos;t know your specific
            industry&apos;s typical claim severity, your prior claims history, or how a given insurer
            underwrites your particular services, all of which move the actual quoted premium and
            available limits. Treat the output as a planning figure for a conversation with a licensed
            insurance agent or broker, not as a final purchasing decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Errors &amp; omissions (E&amp;O) insurance</strong> — professional liability coverage
              that pays for a client&apos;s financial loss resulting from your professional mistake,
              negligent advice, or failure to perform a service as promised.
            </li>
            <li>
              <strong>Claims-made policy</strong> — a policy structure where coverage applies based on when
              a claim is filed, not when the underlying incident occurred, which is how most E&amp;O
              policies are written.
            </li>
            <li>
              <strong>Retroactive date</strong> — the earliest date an incident can have occurred and still
              be covered under a claims-made policy; work performed before this date typically isn&apos;t
              covered even if the claim is filed while the policy is active.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For broader guidance beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines common business insurance types and how to evaluate what a growing business needs,
            and the{" "}
            <a
              href="https://www.iii.org/article/business-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down how liability, property, and other core commercial coverage types fit together.
            The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on coverage terminology if you want definitions beyond
            what this page covers. Confirm any client-contract requirements and get an exact quote from a
            licensed agent before buying or changing a policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. Pair it with the{" "}
            <Link href="/tools/business/general-liability-coverage-calculator" className="text-blue-600 hover:underline">
              general liability coverage calculator
            </Link>{" "}
            to cover the bodily injury and property damage side of your risk, or the{" "}
            <Link href="/tools/business/consultant-insurance-calculator" className="text-blue-600 hover:underline">
              consultant insurance calculator
            </Link>{" "}
            if you&apos;re still deciding which coverage types your practice needs in the first place.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the coverage decisions people and
            small businesses actually face, from a first professional liability limit to a claim payout
            estimate. Every calculator runs entirely in your browser, collects nothing about who you are,
            and is designed to leave you with a clearer question to bring to a licensed agent, not a
            sales form to fill out.
          </p>
        </section>
      </div>
    </>
  );
}

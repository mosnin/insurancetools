import type { Metadata } from "next";
import type { Tool } from "@/types";
import Link from "next/link";
import { CyberInsuranceCoverageCalculatorTool } from "@/components/tools/CyberInsuranceCoverageCalculatorTool";
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
 * This tool is not yet wired into the central `src/lib/tools.ts` registry
 * (a separate process integrates new tools into that registry in bulk), so
 * the metadata this page needs is described locally in a `Tool`-shaped
 * object rather than fetched via `getToolBySlug`, which would return
 * `undefined` until the registry catches up.
 */
const tool: Tool = {
  slug: "cyber-insurance-coverage-calculator",
  name: "Cyber Insurance Coverage Calculator",
  description:
    "Size how much cyber insurance coverage your business may need by combining the customer records you hold with your own researched cost-per-record assumption, plus optional business-interruption exposure.",
  category: "Business",
  categorySlug: "business",
  keywords: [
    "cyber insurance coverage calculator",
    "how much cyber insurance do i need",
    "data breach insurance cost calculator",
    "small business cyber liability calculator",
    "cyber insurance coverage limits",
    "cost per record data breach calculator",
  ],
  relatedTools: ["general-liability-coverage-calculator", "ecommerce-business-insurance-calculator"],
};

const TITLE = "Cyber Insurance Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this cyber insurance coverage calculator to size breach-response and business-interruption exposure from your own record count and cost assumptions, free and instant.";
const PAGE_URL = `${SITE_URL}/tools/business/cyber-insurance-coverage-calculator`;

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
    question: "Where do I get a cost-per-record figure to enter into this calculator?",
    answer:
      "This calculator intentionally doesn't supply one for you, because per-record breach costs shift every year and vary widely by industry, record type, and breach size. Search for the current edition of IBM's Cost of a Data Breach Report or the Verizon Data Breach Investigations Report, look for a figure that matches your industry and region as closely as possible, and enter that number. Treat it as a planning assumption, not a guarantee of what an actual incident would cost your business.",
  },
  {
    question: "Does my general liability policy already cover a data breach?",
    answer:
      "Usually not. Standard general liability policies are built around bodily injury and property damage claims, and most insurers have added exclusions for data breaches, network security failures, and privacy violations over the past decade. Cyber incidents typically require a standalone cyber liability policy, or an endorsement added to an existing policy, specifically underwritten for data and network risk. Confirm your current policy's exclusions with your agent rather than assuming coverage exists.",
  },
  {
    question: "What's the difference between first-party and third-party cyber coverage?",
    answer:
      "First-party cyber coverage pays for costs your own business incurs directly after an incident, such as forensic investigation, system restoration, notification letters, credit monitoring, and lost income during downtime. Third-party cyber coverage pays for claims brought against your business by people affected by the breach, such as customers, patients, or business partners, including legal defense and settlement costs. This calculator's breach-response figure blends elements typically paid under first-party coverage; a full cyber policy usually includes both coverage types.",
  },
  {
    question: "Why does the calculator ask about business interruption separately from breach response?",
    answer:
      "They're different categories of loss that a cyber policy can cover in different ways. Breach-response exposure is about the direct cost of responding to a data incident, notification, monitoring, legal, and forensic work, driven by how many records were exposed. Business-interruption exposure is about lost revenue while systems are down, driven by how long the outage lasts and how much revenue depends on the affected systems. Separating them lets you see which risk actually drives your number, since a business with few records but heavy system dependence may need more interruption coverage than breach-response coverage.",
  },
  {
    question: "Is the total this calculator shows the coverage limit I should buy?",
    answer:
      "Treat it as a starting number for a conversation with a licensed agent, not a final limit to purchase. Actual cyber policies also involve sub-limits for specific costs like ransomware payments or regulatory fines, waiting periods before business-interruption coverage activates, and retentions you pay before coverage responds. An agent can translate this sizing estimate into an actual policy structure that accounts for those details.",
  },
  {
    question: "Does ransomware fall under this calculator's numbers?",
    answer:
      "Not explicitly. Ransomware response, including investigation, negotiation, and in some cases the ransom payment itself, is typically covered under the breach-response and business-interruption components of a standard cyber policy, but many insurers apply a separate sub-limit specifically for ransomware that can be lower than the policy's overall limit. If ransomware is a major concern for your business, ask an agent about that specific sub-limit rather than assuming your total coverage amount applies in full.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
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

export default function CyberInsuranceCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Cyber Insurance Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Turn the records your business holds and your own researched breach-cost assumptions into a
            sized coverage number to bring to a licensed agent. Free, instant, and nothing you type here
            leaves your browser.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <CyberInsuranceCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-cyber-insurance-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What a Cyber Insurance Policy Actually Covers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard small business cyber liability policy is built around a handful of recurring cost
            categories that show up after almost any data incident. Breach-response costs cover the
            immediate aftermath: hiring a forensic firm to determine what happened and what was exposed,
            legal counsel to navigate notification obligations, the mailing or emailing of notification
            letters to every affected individual, and typically a year or more of credit or identity
            monitoring offered to those individuals. Business-interruption coverage pays for income lost
            while systems are down or degraded, separate from the response costs themselves. Many policies
            also address ransomware specifically, often with its own sub-limit, since ransom negotiation
            and payment sit in a different risk category than a straightforward data exposure. This
            calculator focuses on the two cost categories most businesses can reasonably estimate on their
            own, breach response and business interruption, and leaves ransomware sub-limits and
            regulatory-fine sub-limits to a conversation with an agent who can quote the actual policy
            structure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for a small or mid-size business owner who has never bought cyber coverage
            and needs a starting number before calling an agent, not a large enterprise with a dedicated
            risk management function. If your business stores customer names alongside anything sensitive,
            Social Security numbers, dates of birth, health information, or payment card data, in any
            system, whether that&apos;s a point-of-sale platform, a booking system, an electronic health
            record, or a simple customer database, you carry breach exposure regardless of your size. The
            tool is equally useful for a business that depends heavily on a website or software platform to
            generate revenue and wants to understand what an extended outage would cost, separate from the
            breach-response question entirely.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How the Sizing Math Works, and Why You Supply the Cost Assumption
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator multiplies the number of records you enter by a cost-per-record figure you
            supply, producing a breach-response exposure estimate. It deliberately does not embed a
            specific per-record cost as a built-in fact, because that figure moves meaningfully from year
            to year and varies by industry, record sensitivity, and breach size in published research such
            as IBM&apos;s annual Cost of a Data Breach Report and the Verizon Data Breach Investigations
            Report. A number baked into this page would either go stale within months or mislead a
            business whose actual risk profile looks nothing like the industry average those reports
            describe. Instead, you look up a current figure that fits your situation and the calculator
            does the arithmetic transparently, so you can see exactly how the total was built and adjust
            either input as your assumptions change. The optional business-interruption side works the
            same way: interruption days multiplied by revenue at risk per day, added to the breach-response
            figure for a combined total suggested coverage amount.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a regional medical billing company holding 40,000 patient records. After searching a
            recent industry breach-cost report, the owner settles on an assumed cost of $180 per record for
            healthcare-related data, reflecting the higher notification and monitoring costs tied to
            protected health information. That produces a breach-response exposure of $7,200,000. The
            owner also estimates that a serious incident could take their billing platform offline for 4
            days, during which the business would lose roughly $15,000 per day in processing revenue,
            adding $60,000 of interruption exposure. The combined total suggested coverage to discuss with
            an agent comes to $7,260,000, overwhelmingly driven by the breach-response side because of the
            sensitivity and volume of the records involved. A retail business with the same 40,000 customer
            records but only names and email addresses, no health or payment data, would reasonably use a
            much lower cost-per-record assumption and land on a dramatically smaller number, which is
            exactly why this calculator refuses to assume one figure fits every business.
          </p>

          <AdInArticle slot="tool-cyber-insurance-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most expensive mistake is assuming a general liability or property policy already responds
            to a cyber incident. Most commercial general liability policies now carry explicit exclusions
            for data breaches, network failures, and privacy violations, meaning a business can carry
            liability insurance for years and still have zero coverage the day a breach actually happens.
            A second common mistake is counting only the records currently in an active database and
            ignoring archived records, backups, or records held by a third-party vendor on the business&apos;s
            behalf, all of which can still trigger notification obligations if exposed. A third is picking
            a cost-per-record figure from a headline statistic without checking whether it reflects the
            business&apos;s actual industry and record type, since healthcare and financial records
            consistently cost more to remediate than basic contact information in every published breach
            study.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes that multiplying records held by an assumed cost per record, plus
            optional interruption exposure, is a reasonable way to arrive at a starting coverage number. It
            does not know your industry&apos;s actual breach statistics, your business&apos;s security posture or
            incident-response readiness, the specific breach-notification law in your state, or any
            insurer&apos;s underwriting rules, sub-limits, or exclusions. It also does not account for
            regulatory fines, third-party liability judgments, or the cost of a ransom payment separately
            from general breach response, all of which a real cyber policy may treat as distinct coverage
            components with their own sub-limits. Every figure here is a planning estimate to bring into a
            conversation with a licensed insurance agent, not a substitute for an actual quote or a formal
            cyber risk assessment.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>PII (personally identifiable information)</strong> — data that can identify a
              specific person, such as a name combined with a Social Security number, date of birth,
              account number, or health record, which is what typically triggers breach-notification
              requirements.
            </li>
            <li>
              <strong>Breach-response costs</strong> — the bundle of expenses a business incurs after
              discovering an incident, commonly including forensic investigation, legal counsel,
              notification letters, and credit or identity monitoring for affected individuals.
            </li>
            <li>
              <strong>First-party vs. third-party cyber coverage</strong> — first-party coverage pays costs
              the business incurs directly (investigation, notification, lost income); third-party coverage
              pays claims brought against the business by people harmed by the breach.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For guidance on securing business data and understanding cyber risk, the{" "}
            <a
              href="https://www.cisa.gov/topics/cybersecurity-best-practices"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Cybersecurity and Infrastructure Security Agency
            </a>{" "}
            publishes small business cybersecurity best practices, and the{" "}
            <a
              href="https://www.ftc.gov/business-guidance/small-businesses/cybersecurity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Federal Trade Commission&apos;s small business guidance
            </a>{" "}
            covers data security and breach-response obligations. The{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines how cyber coverage fits into a broader business insurance plan, and the{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              FTC&apos;s data breach response guide
            </a>{" "}
            walks through the steps a business is expected to take after discovering an incident. For a
            current cost-per-record figure to enter above, search for the latest edition of IBM&apos;s Cost of
            a Data Breach Report or the Verizon Data Breach Investigations Report rather than relying on an
            older number.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. If you&apos;re also sizing your general risk exposure, the{" "}
            <Link href="/tools/business/general-liability-coverage-calculator" className="text-blue-600 hover:underline">
              general liability coverage calculator
            </Link>{" "}
            covers the bodily injury and property damage risks a cyber policy typically excludes, and if
            your business sells online, the{" "}
            <Link href="/tools/business/ecommerce-business-insurance-calculator" className="text-blue-600 hover:underline">
              e-commerce business insurance calculator
            </Link>{" "}
            looks at the wider set of coverage a digital storefront usually needs beyond cyber risk alone.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for figuring out coverage, cost, and
            claim questions without a sales call. Every tool on this site runs entirely in your browser, so
            the records, revenue, and cost assumptions you enter here for sizing coverage never get sent
            anywhere or stored.
          </p>
        </section>
      </div>
    </>
  );
}

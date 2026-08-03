import type { Metadata } from "next";
import Link from "next/link";
import { CommercialPropertyCoverageCalculatorTool } from "@/components/tools/CommercialPropertyCoverageCalculatorTool";
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

const tool = getToolBySlug("commercial-property-coverage-calculator")!;

const TITLE = "Commercial Property Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this commercial property insurance calculator to sum your building, contents, equipment, and inventory into one suggested coverage limit, free and instant.";
const PAGE_URL = `${SITE_URL}/tools/business/commercial-property-coverage-calculator`;

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
    question: "Does this commercial property insurance calculator give me a quote?",
    answer:
      "No. It adds up the replacement-cost figures you enter for your building, contents, equipment, inventory, and any tenant improvements to suggest a total coverage limit and a coinsurance target. Actual pricing depends on your industry classification, location, construction type, protective safeguards, and claims history, none of which this tool has access to. Bring the total to an agent when you request quotes so every insurer is pricing the same limit.",
  },
  {
    question: "What counts as business personal property?",
    answer:
      "Business personal property is everything inside the space that isn't the building itself and isn't specialized equipment or inventory: furniture, office fixtures, computers, shelving, signage, and general supplies. It's typically insured on its own limit separate from the building, equipment, and inventory categories, which is why this calculator asks for it separately rather than folding it into one lump sum.",
  },
  {
    question: "What are tenant improvements and betterments, and why do they matter if I lease?",
    answer:
      "Tenant improvements and betterments are permanent upgrades a tenant pays for in a space they don't own, things like custom flooring, built-in counters, electrical work, or interior walls. A landlord's building policy generally insures the building's original structure, not upgrades a tenant funded, which leaves that investment uninsured unless the tenant carries their own coverage for it. This is the category leased-space businesses miss most often.",
  },
  {
    question: "What is a coinsurance clause and how does the target get calculated?",
    answer:
      "A coinsurance clause requires you to insure your property to at least a set percentage of its value, commonly 80% or 90%, in exchange for a lower rate. This calculator multiplies your entered total by the coinsurance percentage you provide to show that target dollar amount. Carrying a limit below the target can trigger a coinsurance penalty on a claim, reducing your payout even on a partial loss, so check your own policy's exact percentage rather than assuming 80%.",
  },
  {
    question: "Should I insure inventory at its average level or its peak level?",
    answer:
      "Use whatever level you'd need to replace if a loss happened during your busiest stretch, since a fire or theft doesn't wait for the slow season. Businesses that size inventory coverage around an average or off-season count are commonly underinsured the moment stock builds up for a seasonal peak. If your inventory swings widely through the year, some insurers offer reporting-form policies that adjust the limit month to month instead of a single fixed number.",
  },
  {
    question: "Should I choose replacement cost or actual cash value coverage?",
    answer:
      "Replacement cost pays what it costs to rebuild or replace property today, with no deduction for depreciation, while actual cash value subtracts depreciation based on the property's age and condition. Replacement cost costs more in premium but is generally the more protective choice for a business, since actual cash value on older equipment or a building can leave a large gap between the payout and what it actually costs to replace it. This calculator assumes you're sizing a replacement-cost limit; ask your agent to confirm which basis your policy actually uses.",
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

export default function CommercialPropertyCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Commercial Property Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Add up what your business location, contents, equipment, and inventory would actually cost
            to replace, and get one suggested coverage limit plus a coinsurance target. Free, instant,
            and it never asks who you are.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <CommercialPropertyCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-commercial-property-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Commercial Property Insurance Calculator Covers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Commercial property insurance is built to pay for physical loss or damage to the things a
            business needs in order to keep operating: the building itself if the business owns it,
            everything inside that isn&apos;t the building or specialized machinery, the equipment used to
            actually do the work, the inventory sitting on shelves or in a warehouse, and any permanent
            upgrades a tenant paid for in a space someone else owns. This calculator treats each of those
            as its own line item and sums them into a single suggested limit, rather than asking for one
            vague &ldquo;how much coverage do you want&rdquo; number the way a lot of online quote forms do.
            Nothing here is estimated on your behalf; every dollar in the total is a figure you typed in.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for any business that occupies a physical space and owns equipment, inventory,
            or fixtures worth protecting, whether that&apos;s a retail storefront, a restaurant kitchen, a
            contractor&apos;s workshop, a professional office, or a small manufacturer. It works whether you
            own the building or lease it, since the building line item disappears from your total the
            moment you switch to leased, and the tenant improvements line item exists specifically for
            leased locations where you&apos;ve paid to customize the space. If you&apos;re shopping for your first
            commercial property policy, renewing an existing one, or just found out your current limit
            hasn&apos;t been touched since you signed the lease, running your current numbers here first gives
            you a concrete figure to bring into that conversation.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How Each Category Builds the Total</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Building replacement cost only applies if you own the structure; if you lease, that figure is
            set to zero automatically, since your landlord&apos;s own property policy is what insures the
            building&apos;s core structure. Business personal property covers furniture, fixtures, computers,
            and general supplies, deliberately kept separate from equipment and machinery, which covers
            the tools or production equipment your business actually uses to generate revenue, because
            those two categories are frequently priced and adjusted differently on a real policy.
            Inventory value should reflect what you&apos;d need to replace at your busiest point in the year,
            not an average across slower months. Tenant improvements and betterments capture anything a
            tenant paid to customize a leased space, flooring, built-in counters, dedicated wiring, since
            a landlord&apos;s policy generally doesn&apos;t extend to upgrades the tenant funded. The calculator
            adds all five figures together for the suggested total, then multiplies that total by the
            coinsurance percentage you enter to show the minimum limit most policies expect you to carry
            before a coinsurance penalty can reduce a claim payout.
          </p>

          <AdInArticle slot="tool-commercial-property-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a small bakery that leases its storefront. The owner enters $0 for building
            replacement cost since the landlord owns the structure, $85,000 for business personal
            property covering display cases, seating, and a point-of-sale system, $60,000 for baking
            equipment including ovens and mixers, $40,000 for inventory sized to a holiday-season peak
            rather than a typical Tuesday, and $28,000 for the walk-in cooler and custom counter build-out
            the owner paid for when the lease started. That totals $213,000. At an 80% coinsurance clause,
            the target is $170,400; a limit purchased anywhere below that could trigger a coinsurance
            penalty on a partial loss, even though $213,000 sounds like plenty of coverage at first glance.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is forgetting tenant improvements entirely, since a business that has
            leased the same space for years may no longer think of the flooring or built-in fixtures as
            something separate from &ldquo;the building,&rdquo; even though the landlord&apos;s policy was never
            written to cover them. A close second is sizing inventory coverage around an average month
            instead of the actual peak, which quietly underinsures a seasonal business at exactly the time
            a loss would be most expensive. A third is treating the original purchase price as the
            replacement cost for equipment or a building, when the real number to insure is what it would
            cost to replace that property today, which can run well above or below the original price
            depending on how construction and equipment costs have moved since the purchase.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes you want a replacement-cost-based limit, generally the more protective
            basis on a commercial property policy compared with actual cash value, since replacement cost
            doesn&apos;t subtract depreciation from the payout the way actual cash value does. It sums exactly
            the figures you enter with no independent estimate of construction costs, inventory turnover,
            or industry averages layered in anywhere. It does not know your business&apos;s industry
            classification, your building&apos;s construction type or protective safeguards, your state&apos;s
            specific requirements, or your insurer&apos;s underwriting rules, all of which affect actual
            pricing and, in some cases, available limits. The coinsurance target reflects the percentage
            you enter; confirm your own policy&apos;s exact coinsurance clause rather than assuming 80% is
            correct for your situation. Treat every figure here as a planning number to bring into a
            conversation with a licensed commercial insurance agent, not as a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Business personal property</strong> — furniture, fixtures, computers, and supplies
              inside a business location, insured separately from the building, equipment, and inventory.
            </li>
            <li>
              <strong>Tenant improvements and betterments</strong> — permanent upgrades a tenant pays for
              in a leased space, such as flooring, built-ins, or dedicated wiring, that a landlord&apos;s own
              policy generally does not cover.
            </li>
            <li>
              <strong>Coinsurance clause</strong> — a policy provision requiring you to insure your
              property to at least a set percentage of its value, with a penalty on claim payouts if you
              carry less.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For coverage definitions beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            publishes guidance on common business insurance types and how to evaluate coverage needs, and
            the{" "}
            <a
              href="https://www.iii.org/article/business-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down how commercial property and business personal property coverage typically work.
            The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer-facing definitions of coverage types including replacement cost and actual
            cash value. Before buying or changing coverage, confirm your exact state requirements with
            your{" "}
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
            category. If a covered loss would also stop your revenue while repairs happen, the{" "}
            <Link href="/tools/business/business-interruption-calculator" className="text-blue-600 hover:underline">
              business interruption calculator
            </Link>{" "}
            estimates that separate exposure, and restaurant owners specifically may prefer the{" "}
            <Link href="/tools/business/restaurant-insurance-calculator" className="text-blue-600 hover:underline">
              restaurant insurance calculator
            </Link>{" "}
            for coverage needs unique to food service. If you&apos;re deciding what deductible to pair with
            whatever limit you land on, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            cover that trade-off in more depth.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for figuring out what coverage a
            business, home, or individual actually needs. Nothing you enter is sent to a server, there&apos;s
            no account to create, and every tool is meant to leave you better prepared for a conversation
            with a licensed insurance professional, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

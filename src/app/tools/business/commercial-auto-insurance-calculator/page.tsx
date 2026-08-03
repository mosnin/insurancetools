import type { Metadata } from "next";
import Link from "next/link";
import { CommercialAutoInsuranceCalculatorTool } from "@/components/tools/CommercialAutoInsuranceCalculatorTool";
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

const tool = getToolBySlug("commercial-auto-insurance-calculator")!;

const TITLE = "Commercial Auto Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this commercial auto insurance calculator to size a liability limit for business vehicles and see if hired and non-owned auto (HNOA) coverage applies.";
const PAGE_URL = `${SITE_URL}/tools/business/commercial-auto-insurance-calculator`;

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
    question: "Will my personal auto insurance cover an accident that happens during work?",
    answer:
      "Usually not. Standard personal auto policies contain a business use exclusion that limits or denies coverage when the vehicle was being used for business purposes at the time of the accident — running deliveries, visiting clients, hauling equipment, or similar work activity. Commuting to a fixed workplace is typically fine under a personal policy; using the car as part of the job itself usually is not. That gap is exactly what commercial auto and hired and non-owned auto (HNOA) coverage exist to close.",
  },
  {
    question: "My business doesn't own any vehicles. Do I still need commercial auto coverage?",
    answer:
      "You may still need hired and non-owned auto (HNOA) coverage even with zero owned vehicles. If employees ever drive their own cars for work, or the business rents or borrows a vehicle, the business itself can be named in a lawsuit after an at-fault accident, separate from the driver's own personal auto claim. HNOA is usually added as an endorsement to an existing general liability or business owner's policy rather than sold as its own standalone commercial auto policy.",
  },
  {
    question: "What's the difference between hired auto coverage and non-owned auto coverage?",
    answer:
      "Hired auto coverage responds when the business rents, leases, or borrows a vehicle for business use, such as a rented moving van or a rental car on a business trip. Non-owned auto coverage responds when an employee (or in some cases a volunteer) uses a vehicle they personally own for business purposes. The two are usually sold together as a single HNOA endorsement because most businesses carry some exposure to both, but they cover distinct situations.",
  },
  {
    question: "How does this calculator arrive at a suggested liability limit?",
    answer:
      "The tool starts at a $1,000,000 combined single limit (CSL) for a small owned fleet, which is a widely used commercial convention rather than a legal floor, and steps up to $2,000,000 once the fleet reaches 10 vehicles, reflecting that more vehicles on the road at once raises the odds of separate simultaneous claims. From 5 vehicles up it also flags that many businesses pair the auto policy with a commercial umbrella or excess liability policy instead of only raising the auto limit itself. It is a planning reference, not a quote.",
  },
  {
    question: "Does my state set a minimum commercial auto liability limit I have to carry?",
    answer:
      "Most states do set a commercial auto minimum, but the exact figure varies by state and often by the vehicle's weight class, and this calculator does not attempt to state that number as fact. Heavier vehicles used in interstate commerce can also trigger separate federal financial-responsibility filing requirements administered by the Federal Motor Carrier Safety Administration, on top of whatever your state requires. Confirm your exact minimum with your state's DMV or Department of Insurance.",
  },
  {
    question: "If an employee causes an accident while running a business errand in their own car, who pays?",
    answer:
      "It can get complicated. The employee's personal auto insurer may deny or limit the claim under the business use exclusion, and the injured party can still pursue the business itself for negligent entrustment or vicarious liability, even though the business owns no vehicle involved in the accident. This is the specific scenario non-owned auto coverage is designed to respond to, which is why this calculator treats it as a coverage-gap decision rather than folding it into the owned-fleet number.",
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

export default function CommercialAutoInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Commercial Auto Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size a liability limit for the vehicles your business owns, and find out in seconds whether
            hired and non-owned auto (HNOA) coverage — a gap most personal auto policies never mention —
            applies to you.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <CommercialAutoInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-commercial-auto-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why Your Personal Auto Policy Doesn&apos;t Cover Business Use
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard personal auto policy is priced and underwritten around personal, non-commercial
            driving: commuting, errands, road trips. Buried in nearly every personal policy is a business
            use exclusion, which limits or denies coverage when the vehicle was being used for business
            purposes at the moment of the accident. That exclusion is a routine basis for a claim denial
            once an adjuster establishes the driver was making a delivery, visiting a client, hauling tools,
            or running any other work errand rather than commuting to a fixed workplace. Many small
            business owners and their employees never learn this until after an accident, at exactly the
            moment they most need the coverage to respond. Commercial auto insurance, and its close relative
            hired and non-owned auto (HNOA) coverage, exist specifically to close that gap.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Should Use This Commercial Auto Insurance Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for two overlapping groups. The first is any business that titles vehicles
            in the company&apos;s name — delivery vans, service trucks, a small fleet of sales cars — and needs
            a reasonable starting liability limit before talking to an agent. The second, often overlooked,
            group is any business with zero owned vehicles that still sends employees out driving on the
            company&apos;s behalf: a consulting firm whose staff drive to client sites in their own cars, a
            cleaning service whose crew drives personal vehicles between jobs, or a retailer that
            occasionally rents a van for a delivery run. If your business fits either description, or both,
            this calculator is the right starting point. If your primary exposure is a professional mistake
            rather than a vehicle, the{" "}
            <Link href="/tools/business/general-liability-coverage-calculator" className="text-blue-600 hover:underline">
              general liability coverage calculator
            </Link>{" "}
            is a better fit.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What Hired and Non-Owned Auto (HNOA) Coverage Actually Covers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            HNOA is really two coverages sold as one endorsement. Non-owned auto coverage protects the
            business when an employee uses a vehicle they personally own for company business, such as
            driving their own car to a client meeting or picking up supplies. Hired auto coverage protects
            the business when it rents, leases, or borrows a vehicle for business use, such as a rented
            moving truck or a rental car on a business trip. Both matter for a reason that surprises many
            owners: the business itself carries liability exposure in these situations even though it does
            not own the vehicle involved. If an employee causes an injury while running a business errand in
            their own car, the injured party can pursue the business for negligent entrustment or vicarious
            liability, on top of whatever the employee&apos;s own insurer pays or denies. A business with zero
            company-owned vehicles is not automatically free of auto liability exposure, which is why this
            calculator evaluates HNOA as its own yes-or-no decision rather than folding it into the
            owned-fleet dollar figure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Liability Limit Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            For businesses that do own vehicles, the calculator starts at a $1,000,000 combined single limit
            (CSL), a widely used small-fleet convention rather than a state-mandated minimum, and steps up
            to $2,000,000 once the fleet reaches 10 vehicles. That step-up reflects a simple exposure
            principle: more vehicles on the road at once raises the odds that more than one is involved in
            a claim within the same policy period, even if no single vehicle is any riskier on its own.
            Starting at 5 vehicles, the tool also flags that many businesses this size pair their commercial
            auto policy with a commercial umbrella or excess liability policy rather than only raising the
            auto limit itself. None of this replaces confirming your state&apos;s actual commercial auto
            minimum, which varies by state and by vehicle weight class, or checking whether heavier vehicles
            crossing state lines trigger separate federal financial-responsibility filing requirements.
          </p>

          <AdInArticle slot="tool-commercial-auto-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a home services business with 3 company-owned service vans, plus two office staff who
            occasionally drive their own personal cars to pick up parts or meet a client on-site. Entering 3
            vehicles keeps the calculator at the $1,000,000 CSL baseline rather than the elevated tier, since
            fleet size stays under the 5-vehicle threshold where an excess policy gets flagged and well
            under the 10-vehicle step-up. Because employees drive personal vehicles for company errands,
            though, the tool separately flags non-owned auto exposure regardless of that small fleet size.
            The owner&apos;s actual next step is two-fold: get a $1,000,000 CSL commercial auto quote for the
            three vans, and add an HNOA endorsement, most likely to the business owner&apos;s policy that
            already covers the office, to close the personal-vehicle gap the vans policy alone would miss.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common and most expensive mistake is assuming an employee&apos;s own personal auto policy
            protects the business, when in practice it protects the employee at best, and often only
            partially once the insurer identifies the business use exclusion. A close second is treating
            &ldquo;we don&apos;t own any vehicles&rdquo; as proof the business has no auto liability exposure at all,
            which overlooks non-owned and hired exposure entirely. A third is sizing a commercial auto limit
            off a remembered state minimum from years ago rather than the vehicle&apos;s current weight class
            and the state&apos;s current requirement, both of which can change the actual figure meaningfully.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a $1,000,000 to $2,000,000 combined single limit range, scaled by fleet
            size, is a reasonable planning reference for a small to mid-size business fleet; it is a
            commercial convention, not a legal requirement, and it does not know your state, your vehicles&apos;
            weight class, your drivers&apos; records, or your insurer&apos;s underwriting rules. The HNOA flag is a
            yes/no coverage-gap signal, not a dollar sizing formula, because the decision to add the
            endorsement matters more than a specific number at this stage. It also does not price a policy;
            premium depends on driver records, vehicle types, garaging location, and claims history, none of
            which this tool collects. Treat every result here as a starting point for a conversation with a
            licensed commercial insurance agent, not a final purchase decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Business use exclusion</strong> — the standard personal auto policy provision that
              limits or denies coverage when the vehicle was being used for business purposes at the time
              of an accident.
            </li>
            <li>
              <strong>Non-owned auto coverage</strong> — protects the business when an employee uses a
              vehicle they personally own for company business.
            </li>
            <li>
              <strong>Hired auto coverage</strong> — protects the business when it rents, leases, or borrows
              a vehicle for business use.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For a fuller explanation of commercial auto coverage as part of a broader business insurance
            program, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines commercial auto as core coverage for any business that uses vehicles, and the{" "}
            <a
              href="https://www.iii.org/article/business-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down how commercial auto and hired and non-owned auto coverage differ from a personal
            policy. The{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes general consumer guidance on auto liability structure, and businesses operating
            heavier vehicles across state lines should review the{" "}
            <a
              href="https://www.fmcsa.dot.gov/registration/insurance-filing-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Federal Motor Carrier Safety Administration&apos;s
            </a>{" "}
            insurance filing requirements, which apply on top of state rules. Confirm your exact state
            minimum with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            before buying or changing a policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. If your business also carries general liability exposure beyond its vehicles, pair
            this result with the{" "}
            <Link href="/tools/business/general-liability-coverage-calculator" className="text-blue-600 hover:underline">
              general liability coverage calculator
            </Link>
            . And if you&apos;re sizing coverage for your own personal vehicle rather than a business fleet,
            the{" "}
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category covers that question instead.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free, browser-based calculators that walk business owners and
            individuals through coverage, cost, and claims questions before they sit down with an agent.
            Nothing you enter here leaves your browser, and no tool asks for a name or an email address to
            show a result.
          </p>
        </section>
      </div>
    </>
  );
}

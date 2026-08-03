import type { Metadata } from "next";
import Link from "next/link";
import { RestaurantInsuranceCalculatorTool } from "@/components/tools/RestaurantInsuranceCalculatorTool";
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

const tool = getToolBySlug("restaurant-insurance-calculator")!;

const TITLE = "Restaurant Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this restaurant insurance calculator to build a coverage checklist for liquor liability, spoilage, equipment breakdown, and business interruption risk.";
const PAGE_URL = `${SITE_URL}/tools/business/restaurant-insurance-calculator`;

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
    question: "Does a general liability policy already cover liquor liability?",
    answer:
      "Usually not, or only barely. Most standard general liability policies for restaurants either exclude alcohol-related bodily injury and property damage entirely (a liquor liability, or dram shop, exclusion) or cap it at a much lower sublimit than the base policy. If your kitchen serves any beer, wine, or spirits, liquor liability generally needs to be added as its own endorsement or a separate policy, not assumed to already be part of your base general liability limit.",
  },
  {
    question: "What is dram shop liability and does it apply to my restaurant?",
    answer:
      "Dram shop liability is legal responsibility a business can face for over-serving a visibly intoxicated guest or a minor who then causes injury to themselves or someone else. Whether and how strongly it applies, and what limits make sense, depends heavily on your state's specific dram shop statute and liquor licensing rules, which this calculator does not look up. Check with your state's alcoholic beverage control authority and a licensed commercial insurance agent for the exact rules where you operate.",
  },
  {
    question: "How is the spoilage coverage suggestion calculated?",
    answer:
      "The tool rounds your entered walk-in cooler and freezer inventory value up to the nearest $500 and suggests that as a starting coverage limit. The idea is to cover what a mechanical failure, refrigerant leak, or extended power outage could spoil in a single event, not your total annual food purchases. If your inventory value swings seasonally, size this to your highest typical stocking level, not an average.",
  },
  {
    question: "Why does the general liability recommendation change with seating capacity?",
    answer:
      "A restaurant with more seats generally has more simultaneous foot traffic and a higher chance of a serious slip-and-fall or liquor-related incident producing a large claim, so this calculator suggests a higher general liability tier (and flags an umbrella conversation) once seating passes 100. That threshold is a planning heuristic used here, not a rule set by any regulator or insurer, and your actual underwriting will also weigh your location, hours, and claims history.",
  },
  {
    question: "What does equipment breakdown coverage add that property insurance doesn't?",
    answer:
      "Standard commercial property insurance is built around external causes of loss like fire, storm, and theft. It typically responds weakly, or not at all, to an internal mechanical or electrical failure, such as a walk-in compressor burning out or a fryer's control board failing. Equipment breakdown coverage (sometimes called boiler and machinery coverage) is the line built specifically for that kind of failure, which is why this calculator sizes it separately from your general property limit.",
  },
  {
    question: "Is the business interruption estimate a specific coverage limit I should buy?",
    answer:
      "No, it's a ballpark planning range, not a limit to write down and hand to an underwriter. The 3-to-12-month range reflects how differently a grease fire, a burst pipe, and a full kitchen rebuild can play out; a realistic restoration timeline for your specific building and equipment is something a commercial agent or broker needs to help you pin down.",
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

export default function RestaurantInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Restaurant Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Get a coverage checklist built around the risks specific to food service, not a generic
            small-business estimate. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <RestaurantInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-restaurant-insurance-calculator-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why Restaurant Insurance Isn&apos;t Generic Business Insurance
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A restaurant carries risks that a typical retail shop or office simply doesn&apos;t. Food is
            perishable and dependent on refrigeration that can fail without warning. Kitchens run
            expensive mechanical equipment under near-constant heat and load. And any restaurant that
            pours a drink takes on a distinct legal exposure the moment a guest who was over-served causes
            harm to themselves or someone else. A generic small-business insurance calculator that only
            asks about revenue and payroll misses all three of these, which is exactly why this restaurant
            insurance calculator asks about seating capacity, alcohol service, walk-in inventory value,
            and kitchen equipment value instead of just handing back one number.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for restaurant, bar, and cafe owners and operators who are assembling a
            commercial insurance package and want to walk into an agent conversation already knowing which
            coverage lines apply to their specific concept, not just a single premium guess. It&apos;s also
            useful for anyone reviewing an existing policy who wants a quick check on whether liquor
            liability, spoilage, or equipment breakdown got left out.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How Each Input Flags a Real Coverage Need</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Seating capacity drives the general liability recommendation. Below 100 seats, the calculator
            suggests a common starting tier of $1 million per occurrence and $2 million aggregate. Above
            that, it bumps the suggested tier to $2 million/$4 million and flags an umbrella policy
            conversation, on the reasoning that more simultaneous guests generally means more exposure to
            a single serious incident. Whether you serve alcohol is a yes-or-no switch that determines
            whether liquor liability (also called dram shop liability) gets flagged as its own line item,
            since it&apos;s a real, distinct coverage type that most general liability policies exclude or
            heavily sublimit rather than fully include.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Your walk-in cooler and freezer inventory value sizes the spoilage coverage suggestion,
            rounded up to the nearest $500, since that&apos;s roughly what a single refrigeration failure or
            extended power outage could ruin. Your kitchen equipment replacement value sizes the equipment
            breakdown suggestion the same way, because a burned-out compressor or a fryer&apos;s failed
            control board is a mechanical breakdown that standard property coverage is not built to
            respond to well. If you enter an average monthly revenue figure, the calculator adds a
            business interruption range of roughly three to twelve months of revenue, reflecting how
            differently a quick repair and a full kitchen rebuild can play out.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider an 80-seat neighborhood restaurant with a full bar, $8,000 in walk-in cooler and
            freezer inventory on a typical week, $45,000 in kitchen equipment replacement value, and
            $40,000 in average monthly revenue. Because seating is under 100, the tool suggests the
            standard general liability tier of $1 million/$2 million rather than the higher tier. Because
            alcohol is served, liquor liability gets flagged as needed, separate from that general
            liability limit. Spoilage coverage is sized to roughly $8,000, and equipment breakdown to
            roughly $45,000. Business interruption comes back as a range of $120,000 to $480,000, with a
            $240,000 midpoint, reflecting the difference between a short equipment repair and a total
            kitchen rebuild after a fire. That five-line checklist is a materially more complete starting
            point than a single blended premium estimate would be.
          </p>

          <AdInArticle slot="tool-restaurant-insurance-calculator-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake is assuming a general liability policy already includes liquor
            liability because alcohol sales weren&apos;t specifically discussed at binding. In practice, most
            GL forms either exclude alcohol-related claims outright or apply a sublimit far below the base
            policy, which only becomes visible after a claim is filed and denied or capped. A second
            mistake is insuring kitchen equipment only through standard commercial property coverage,
            which responds to fire, storm, and theft but often excludes or limits internal mechanical and
            electrical failure, exactly the loss equipment breakdown coverage is built for. A third is
            treating a walk-in cooler&apos;s contents as a rounding error inside a broader property limit
            rather than sizing spoilage coverage to the actual inventory value at risk in a single
            refrigeration failure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator uses seating capacity as a proxy for general liability exposure and a 100-seat
            threshold as a planning heuristic, not a rule set by any regulator, rating bureau, or insurer.
            Real underwriting also weighs your location, operating hours, claims history, and whether you
            offer delivery or catering. The spoilage and equipment breakdown suggestions are sized directly
            to whatever value you enter, so they&apos;re only as accurate as your own estimate of inventory
            and replacement cost. The business interruption range is a ballpark planning figure, not a
            calculated limit, since actual restoration time depends on your specific building, equipment,
            and local contractor availability. Liquor liability and dram shop rules vary significantly by
            state; this tool flags the need for that coverage but does not know your state&apos;s specific
            statute or your local liquor license requirements. Confirm those with your state&apos;s alcoholic
            beverage control authority and get exact limits and pricing from a licensed commercial
            insurance agent before buying or changing a policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Liquor liability (dram shop liability)</strong> — a distinct coverage line for legal
              responsibility arising from serving alcohol, such as over-serving a visibly intoxicated
              guest who then causes injury; typically excluded or heavily sublimited under a standard
              general liability policy.
            </li>
            <li>
              <strong>Spoilage coverage</strong> — coverage for the loss of perishable food or beverage
              inventory following a covered event such as a refrigeration breakdown or extended power
              outage.
            </li>
            <li>
              <strong>Equipment breakdown coverage</strong> — coverage for a sudden mechanical or
              electrical failure in equipment (also called boiler and machinery coverage), distinct from
              standard property coverage aimed at external perils like fire or storm.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For general guidance on assembling a small business insurance package, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines the common coverage types business owners consider, and the{" "}
            <a
              href="https://www.iii.org/article/business-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down how commercial property and liability coverage typically work. Because dram shop
            and liquor licensing rules are set at the state level, confirm your specific requirements with
            your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            and your state&apos;s alcoholic beverage control authority before buying or changing a policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              business insurance calculators
            </Link>{" "}
            category. If you&apos;re also insuring the building or leasehold improvements, the{" "}
            <Link
              href="/tools/business/commercial-property-coverage-calculator"
              className="text-blue-600 hover:underline"
            >
              commercial property coverage calculator
            </Link>{" "}
            covers that piece, and the{" "}
            <Link
              href="/tools/business/general-liability-coverage-calculator"
              className="text-blue-600 hover:underline"
            >
              general liability coverage calculator
            </Link>{" "}
            walks through sizing your base liability limit in more depth for businesses outside food
            service.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific coverage questions
            behind auto, home, business, and other everyday insurance decisions. Nothing you type into
            this restaurant insurance calculator is stored or sent anywhere; it&apos;s meant to prepare you
            for a sharper conversation with a licensed commercial insurance agent, not replace one.
          </p>
        </section>
      </div>
    </>
  );
}

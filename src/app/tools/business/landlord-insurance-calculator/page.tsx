import type { Metadata } from "next";
import Link from "next/link";
import { LandlordInsuranceCalculatorTool } from "@/components/tools/LandlordInsuranceCalculatorTool";
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

const tool = getToolBySlug("landlord-insurance-calculator")!;

const TITLE = "Landlord Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this landlord insurance calculator to size dwelling, loss of rent, and liability coverage for a rental property you own, separate from a homeowners policy.";
const PAGE_URL = `${SITE_URL}/tools/business/landlord-insurance-calculator`;

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
    question: "Will my regular homeowners insurance cover a property I rent out to someone else?",
    answer:
      "Usually not the way you'd expect. A standard homeowners policy is priced and underwritten around an owner-occupant living in the home, and most insurers either exclude or sharply restrict coverage once the home is rented to a tenant full-time. Some insurers will cancel or refuse to renew a homeowners policy if they learn the property is tenant-occupied and it wasn't disclosed. A landlord (dwelling fire) policy is written specifically for a non-owner-occupied rental, which is why it's treated as a separate product rather than an upgrade to a homeowners policy.",
  },
  {
    question: "What is a landlord or dwelling fire (DP-3) policy, exactly?",
    answer:
      "It's a property insurance form built for a residential property the owner does not live in and rents to a tenant. It typically covers the dwelling structure, other structures on the property, landlord-owned personal property used to service the rental (like appliances or lawn equipment), loss of rent coverage, and liability arising from the property, but it does not cover the tenant's own belongings. \"DP-3\" refers to the broad-form dwelling fire policy many insurers use as the base for landlord coverage, similar in structure to an HO-3 homeowners form but written for a non-owner-occupied rental.",
  },
  {
    question: "How much loss of rent coverage do I actually need?",
    answer:
      "Enough to cover your rent for as long as a realistic repair after a covered loss would plausibly take. Many owners choose somewhere between 6 and 12 months, since major repairs after a fire or serious water damage often run several months once permitting, contractor scheduling, and rebuild time are factored in. This calculator lets you set the exact number of months so you can size it against your own rent and repair-time expectations rather than guessing.",
  },
  {
    question: "Does landlord insurance cover my tenant's furniture or belongings if something happens?",
    answer:
      "No. A landlord policy only covers what the owner owns: the structure, landlord-owned appliances or equipment, and the owner's liability. A tenant's personal belongings are covered only by the tenant's own renters insurance policy, which is a separate product tenants buy for themselves. This is a common point of confusion after a loss, and it's worth telling tenants directly that their belongings aren't covered by your policy.",
  },
  {
    question: "How much landlord liability coverage should I carry?",
    answer:
      "A common starting point is to size it similarly to a homeowner's liability limit, often $300,000, and step up toward $500,000 or more if the property has multiple rental units or is higher in value, since more tenants and visitors on a property raises the odds of a premises-liability claim (a slip-and-fall or similar injury). This calculator applies that same step-up logic based on your rent, replacement cost, and unit count, but your exact exposure depends on the property and is worth confirming with a licensed commercial or landlord insurance agent.",
  },
  {
    question: "Do I need one landlord policy per property, or can several rentals share one policy?",
    answer:
      "Both exist in the market. A single dwelling fire policy typically covers one property, while owners with several rental properties often move to a landlord package or commercial habitational policy that covers a portfolio under one set of limits. This calculator estimates coverage for one property at a time; if you own multiple rentals, run each property separately and ask an agent about portfolio or blanket options once you have individual figures for each.",
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

export default function LandlordInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Landlord Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size dwelling, loss of rent, and liability coverage for a property you own and rent out to
            someone else, using a policy structure built for landlords rather than a homeowners policy
            that assumes you live there.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <LandlordInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-landlord-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who This Landlord Insurance Calculator Is For
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for the owner of a residential property that&apos;s rented to someone else, not
            the tenant living in it. If you&apos;re a tenant looking to protect your own belongings and
            personal liability, the{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              renters insurance tools
            </Link>{" "}
            are built for that instead. This calculator is for a first-time landlord insuring a rental
            property for the first time, an owner who has been renting a property out on a leftover
            homeowners policy and wants to check whether that&apos;s actually appropriate, or anyone
            comparing quotes for a single-family rental, a duplex, or a small multi-unit building and
            wanting a planning figure before talking to an agent.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why a Landlord Policy Is a Different Product From Homeowners Insurance
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard homeowners policy is underwritten around an owner living in the home full-time,
            which shapes almost every assumption baked into the policy: how quickly a loss would likely be
            noticed and reported, who is present to prevent vandalism or a break-in, and what kind of
            liability exposure the property carries. Once a property is rented out to a tenant, none of
            those assumptions hold, which is exactly why most insurers exclude or restrict coverage for a
            tenant-occupied home under a homeowners form, and some will cancel a policy outright if a
            rental arrangement wasn&apos;t disclosed at renewal. A landlord policy, often built on what
            insurers call a dwelling fire or &ldquo;DP-3&rdquo; form, is priced and written for exactly this
            situation instead: a non-owner-occupied residential property with a paying tenant in it. It
            typically covers the structure, landlord-owned equipment used to service the rental, loss of
            rent, and the owner&apos;s liability, but it does not cover a tenant&apos;s personal belongings,
            which remain the tenant&apos;s own responsibility to insure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Calculator Sizes Your Coverage</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts with your entered replacement cost, the amount it would take to rebuild
            the structure today, and suggests that figure as dwelling coverage, since replacement cost
            rather than market value or purchase price is the standard basis for sizing a property policy.
            It then multiplies your monthly rent by the number of months of loss of rent coverage you
            choose, a standard landlord-policy feature that replaces lost rental income while a covered
            loss makes the unit uninhabitable, conceptually similar to the additional living expense
            benefit on a homeowners policy but sized around lost income instead of a displaced household.
            Many landlord policies bundle in a default amount of loss of rent coverage, commonly in the
            neighborhood of 20% of the dwelling coverage limit, unless increased by endorsement; the
            calculator compares your requested figure against that typical default and flags when you may
            want to ask an agent about increasing it.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Liability gets a separate note rather than a hard dollar figure, using the same reasoning many
            owners apply to a homeowner&apos;s liability limit: a rented property carries a similar
            premises-liability exposure to an owner-occupied home, since a tenant or a tenant&apos;s guest
            can be injured on the property just as a homeowner&apos;s own guest could be. The calculator
            starts at a $300,000 baseline and steps up toward $500,000 when your inputs suggest higher
            exposure, specifically a property with two or more rental units, monthly rent above $3,000, or
            a replacement cost above $500,000, since each of those signals correlates with more tenants,
            more visitors, or a larger property to insure.
          </p>

          <AdInArticle slot="tool-landlord-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a single-family rental house with a $280,000 replacement cost, renting for $1,800 a
            month, where the owner wants a full year of loss of rent coverage in case a serious loss takes
            a long time to repair. The calculator suggests $280,000 of dwelling coverage and $21,600 of
            loss of rent coverage ($1,800 times 12 months). Because this is a single unit at a
            moderate rent and replacement cost, none of the step-up conditions apply, so the liability note
            stays at the $300,000 baseline. The typical built-in loss of rent default at 20% of dwelling
            coverage would be about $56,000, well above the requested $21,600, so no increase-by-endorsement
            flag appears here &mdash; a smaller portfolio owner&apos;s numbers often clear that bar
            comfortably, while a higher-rent or shorter-repair-window property might not.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common and most expensive mistake is simply keeping a homeowners policy in place after
            a property becomes a rental, often because the owner moved out gradually or started renting a
            former primary residence without updating the policy. Many homeowners policies exclude or
            severely limit coverage the moment a property is no longer owner-occupied, which can leave an
            owner with an unenforceable claim after a real loss. A second mistake is assuming loss of rent
            coverage is unlimited or automatically matches a full year of rent, when many policies cap it as
            a percentage of dwelling coverage or a fixed number of months unless increased by endorsement. A
            third is assuming a landlord policy protects a tenant&apos;s belongings, which leads to disputes
            after a loss when the tenant discovers their own possessions were never covered by the owner&apos;s
            policy at all.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator treats your entered replacement cost as an accurate rebuild estimate, which it
            cannot verify; a professional replacement cost estimate from an insurer or appraiser is more
            reliable than a rough guess. It uses rent, replacement cost, and unit count as proxies for
            liability exposure rather than a full underwriting assessment, and the $300,000/$500,000
            liability tiers are a common planning convention, not a legal requirement or a figure every
            insurer uses identically. The 20% loss-of-rent comparison is a commonly seen default structure,
            not a universal rule; exact percentages, monthly caps, and whether an increase is even available
            vary by insurer and by state. This tool also does not know your state or municipality&apos;s
            landlord-tenant law, any mortgage lender&apos;s insurance requirement, or your insurer&apos;s specific
            underwriting rules, and it does not price a policy. Treat every figure here as a starting point
            for a conversation with a licensed insurance agent, not a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Dwelling fire policy (DP-3)</strong> &mdash; a broad-form property policy built for a
              residential property the owner does not occupy, commonly used as the base for landlord
              insurance; distinct from a homeowners (HO-3) policy, which assumes owner-occupancy.
            </li>
            <li>
              <strong>Loss of rent coverage (fair rental value)</strong> &mdash; pays the landlord for rental
              income lost while a covered loss makes the unit temporarily uninhabitable, for a defined
              coverage period.
            </li>
            <li>
              <strong>Landlord liability coverage</strong> &mdash; pays for injuries or property damage the
              owner is found responsible for arising from the rental property, such as a tenant or visitor
              injury in a common area.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For further reading on how landlord and rental property coverage is structured, the{" "}
            <a
              href="https://www.iii.org/article/renting-out-your-home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains why a homeowners policy typically stops applying once a property is rented out and what
            a landlord policy covers instead. The{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines property and liability coverage considerations for owners running a rental as a small
            business. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes broader consumer guidance on property and liability coverage types, and the{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              directory of state insurance departments
            </a>{" "}
            is the right place to confirm any state-specific landlord insurance or landlord-tenant rule
            before buying or changing a policy.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. If you own the home you live in rather than renting it out, the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              home insurance tools
            </Link>{" "}
            are built around owner-occupied coverage instead, and if you&apos;re the tenant renting this or
            any other unit, the{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              renters insurance tools
            </Link>{" "}
            help you size coverage for your own belongings and liability.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free, browser-based calculators that help property owners, tenants,
            and everyday consumers work through coverage decisions with real numbers instead of guesswork.
            Nothing you type into this calculator leaves your browser, and no sign-up is ever required to
            see a result.
          </p>
        </section>
      </div>
    </>
  );
}

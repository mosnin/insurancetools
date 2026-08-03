import type { Metadata } from "next";
import Link from "next/link";
import { BusinessOwnerLifeInsuranceCalculatorTool } from "@/components/tools/BusinessOwnerLifeInsuranceCalculatorTool";
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

const tool = getToolBySlug("business-owner-life-insurance-calculator")!;

const TITLE = "Business Owner Life Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this business owner life insurance calculator to size personal coverage for guaranteed debt, a buy-sell agreement, and key-person replacement cost.";
const PAGE_URL = `${SITE_URL}/tools/life/business-owner-life-insurance-calculator`;

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
    question: "Is this business owner life insurance calculator for a commercial policy?",
    answer:
      "No. It sizes a personal life insurance policy, one that pays your beneficiaries, sized to cover business obligations that would otherwise fall on your estate or your family: personally guaranteed debt, a buy-sell obligation, and the cost of replacing your role. It's not general liability, commercial property, key-person insurance owned by the business itself, or any other commercial policy. If you're researching those, the site's business insurance tools cover general commercial coverage questions instead.",
  },
  {
    question: "What counts as personally guaranteed business debt?",
    answer:
      "Any loan, line of credit, equipment lease, or business credit card where you signed a personal guarantee, meaning the lender can pursue your personal assets or estate if the business can't pay, not just the business's assets. Many small business loans require this, especially for newer businesses without a long credit history. Check your loan documents or ask your lender directly if you're not sure whether a guarantee is personal or limited to the business entity.",
  },
  {
    question: "I don't have a buy-sell agreement yet. Should I still use this calculator?",
    answer:
      "Yes, and this is a common situation worth flagging: many multi-owner businesses operate for years without a funded buy-sell agreement, which can leave surviving owners and a deceased owner's family in a difficult, undefined negotiation instead of a pre-agreed buyout. Uncheck the co-owner box to see your debt and key-person numbers alone, or use the ownership percentage and valuation method to get a rough estimate while you and your co-owners work with an attorney to draft an actual agreement.",
  },
  {
    question: "Where do I get a business valuation to enter into the calculator?",
    answer:
      "This tool doesn't supply one, deliberately, since a fabricated valuation multiple would be misleading for a decision this consequential. Reasonable sources include a formal business appraisal, a formula already written into your buy-sell agreement (such as a multiple of EBITDA or revenue your accountant applies), or your own conservative estimate if neither exists yet. If you only have a rough guess, treat the buy-sell portion of the result as rough too, and revisit it once you have a real valuation.",
  },
  {
    question: "How is key-person replacement cost different from the buy-sell amount?",
    answer:
      "The buy-sell figure funds buying out your ownership stake from your family. Key-person cost is separate: it's what it would cost the business to function without you specifically, covering things like lost sales you personally generated, the cost of recruiting and training a replacement, or lost revenue while a critical relationship or skill gap gets filled. A solo owner with no co-owners can still have real key-person exposure if clients or revenue depend heavily on them personally.",
  },
  {
    question: "Should I add this total to my personal income-replacement coverage or buy separately?",
    answer:
      "Either works. Some owners buy one larger term policy sized to cover both their household's income replacement and their business obligations, which is often simpler and can be cheaper than two separate policies. Others prefer two distinct policies so the business-related portion can be reviewed or restructured (for example, split among co-owners or held in a trust) independently of household coverage. Run the life insurance needs calculator for the household side, then discuss the combined total with a licensed agent.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Life Insurance Tools", href: "/tools/life" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function BusinessOwnerLifeInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Business Owner Life Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Size the personal life insurance you&apos;d need to protect your family and co-owners from
            guaranteed business debt, an unfunded buy-sell agreement, and the cost of replacing you,
            built entirely from numbers you supply.
          </p>
          <LastUpdated category="life" />
        </div>

        <div className="mt-2">
          <BusinessOwnerLifeInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-business-owner-life-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Business Owner Life Insurance Calculator Does
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Owning a business creates financial obligations that a standard household life insurance
            estimate never sees. This business owner life insurance calculator is built specifically for
            those obligations: it adds up personally guaranteed business debt, a buy-sell funding need if
            you have co-owners, and the estimated cost of replacing your role if the business depends on
            you specifically. The result is a personal coverage figure sized to protect your family and
            any co-owners from the business side of your finances, kept deliberately separate from your
            household&apos;s income-replacement need so the two never get blended into one confusing number.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is not a substitute for commercial insurance research. It doesn&apos;t touch general
            liability, commercial property, workers&apos; compensation, or any policy the business itself
            owns. It answers one narrower question: how much personal life insurance protects the people
            around you from the financial obligations your business creates.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            It&apos;s built for small business owners who&apos;ve signed a personal guarantee on a loan or lease,
            partners in a multi-owner business with or without a buy-sell agreement in place, and any
            owner whose business would struggle to function without them personally, whether that&apos;s a
            solo consultant whose client relationships are the business, or a founder who still handles
            most of the sales. If your business has no debt, no co-owners, and could run fine without you
            for a stretch, this tool will correctly return a small or zero number, which is itself a
            useful answer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How Each Component Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            <strong>Personally guaranteed debt</strong> is a single number you enter directly: the total
            of any loans, lines of credit, or leases where you signed a personal guarantee, meaning a
            lender could pursue you or your estate, not just the business, if the debt isn&apos;t repaid.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            <strong>Buy-sell funding need</strong> only applies if you check the co-owner box, and you
            choose how to calculate it. If your buy-sell agreement already sets a dollar figure for your
            share, enter that agreed buyout value directly. If it doesn&apos;t, or you&apos;re estimating ahead
            of drafting one, enter your ownership percentage and a business valuation figure of your own,
            and the calculator multiplies the two. Nothing about the valuation or a typical buy-sell
            amount is assumed by this tool; both inputs come entirely from you.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            <strong>Key-person replacement cost</strong> only applies if you check the key-person box. You
            enter a monthly estimate of the cost or lost revenue the business would face without you,
            covering things like lost sales, client attrition, or the cost of recruiting and training a
            replacement, and a transition period in months. The calculator multiplies the two to produce
            a lump-sum figure. The three components are simply added together for the total.
          </p>

          <AdInArticle slot="tool-business-owner-life-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider two co-founders who each own 50% of a business. One has personally guaranteed
            $150,000 in equipment financing. The business has never had a buy-sell agreement, so she
            estimates her share using the ownership-percent method: 50% of an $800,000 valuation her
            accountant sketched out, or $400,000. She also handles nearly all of the client relationships
            herself, and estimates the business would lose about $12,000 a month in revenue and cost of a
            replacement hire during a nine-month transition, or $108,000. Adding the three components,
            $150,000 in debt, $400,000 for the buy-sell share, and $108,000 for key-person cost, produces
            a total business-related personal coverage need of $658,000, entirely separate from whatever
            she carries to replace her household income.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is forgetting personally guaranteed debt entirely, since it&apos;s easy
            to think of a business loan as the business&apos;s problem and not realize a personal guarantee
            means it becomes an estate problem too. A close second is having no buy-sell agreement at all,
            which leaves surviving co-owners and a deceased owner&apos;s family to negotiate a buyout from
            scratch, often under financial pressure and without the trust that existed while the owner was
            alive. A third is skipping key-person exposure for a solo owner, on the assumption that
            key-person insurance is only relevant to businesses with employees, when a business built
            around one person&apos;s relationships or expertise can be just as exposed.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator simply adds the three components you enter; it does not apply a business
            valuation formula, a typical buy-sell multiple, or an industry-standard key-person figure on
            your behalf, since inventing one of those numbers would be misleading rather than helpful. It
            does not know your business structure (sole proprietorship, partnership, LLC, or corporation),
            which can change how debt, ownership, and estate matters are actually handled, and it does not
            account for taxes, your health or age for underwriting purposes, or how an insurer will price
            a policy. It also does not replace a buy-sell agreement itself; a funding number without a
            signed, properly structured agreement between owners leaves real gaps a calculator cannot
            close. Treat the total as a starting figure for a conversation with a licensed insurance
            agent, a business attorney, and a tax professional, not a final coverage amount.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Personal guarantee</strong> — a promise attached to a business loan or lease that
              makes the signer personally liable for the debt if the business can&apos;t pay, exposing
              personal assets and the estate, not just the business.
            </li>
            <li>
              <strong>Buy-sell agreement</strong> — a contract between business co-owners that sets out
              how an owner&apos;s share will be bought out if they die, become disabled, or leave, often
              funded in advance with life insurance so the cash is available when it&apos;s needed.
            </li>
            <li>
              <strong>Key person insurance</strong> — life or disability insurance a business owns on an
              employee or owner whose loss would create serious financial harm, with the benefit paid to
              the business to cover replacement costs or lost revenue.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on personal guarantees and financing small businesses, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            publishes general guidance on business financing and insurance planning. The{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains needs-based life insurance methodology more broadly, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on how life insurance coverage works. Buy-sell agreements involve
            contract and estate matters beyond insurance, so confirm the structure of yours with a
            business attorney, and confirm any state-specific insurance rules with your{" "}
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
            <Link href="/tools/life" className="text-blue-600 hover:underline">
              Life insurance calculators
            </Link>{" "}
            category. For your household&apos;s own income-replacement side, separate from anything
            business-related, use the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              life insurance needs calculator
            </Link>
            . If you&apos;re researching commercial coverage the business itself should carry, general
            liability, property, or business owner&apos;s policies, the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              business insurance tools
            </Link>{" "}
            category covers that separate question.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free, browser-based calculators for coverage, cost, and claims
            decisions across auto, home, life, health, and business insurance. Every figure comes from
            what you type in, nothing is stored or transmitted, and each tool is built to leave you better
            prepared for a real conversation with a licensed professional.
          </p>
        </section>
      </div>
    </>
  );
}

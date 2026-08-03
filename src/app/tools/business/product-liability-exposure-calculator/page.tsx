import type { Metadata } from "next";
import Link from "next/link";
import { ProductLiabilityExposureCalculatorTool } from "@/components/tools/ProductLiabilityExposureCalculatorTool";
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

const tool = getToolBySlug("product-liability-exposure-calculator")!;

const TITLE = "Product Liability Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this product liability insurance calculator to turn your own units-shipped, defect-rate, and claim-cost estimates into a rough annual exposure figure for your broker.";
const PAGE_URL = `${SITE_URL}/tools/business/product-liability-exposure-calculator`;

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
    question: "Does this product liability insurance calculator give me an actual coverage limit to buy?",
    answer:
      "No. It produces a rough annual exposure estimate from three numbers you supply: units shipped, your own assumed defect rate, and an average cost per claim. It is a sizing exercise meant to start a conversation with a commercial insurance broker, not a substitute for underwriting, an actuarial study, or a specific limit recommendation.",
  },
  {
    question: "Why doesn't the calculator provide a default defect rate?",
    answer:
      "Defect rates differ enormously by product category. A children's toy, a power tool, and a packaged food product carry entirely different failure profiles, and a single default figure would be more misleading than helpful. Pull your own rate from quality-control rejection data, warranty claims, product returns, or a benchmark published by a trade association specific to your industry, then enter it yourself.",
  },
  {
    question: "Does product liability insurance cover a product recall?",
    answer:
      "Usually not automatically. Standard product liability coverage responds to third-party injury or property damage claims after a product has caused harm, while the cost of actually recalling, replacing, or repairing a defective product batch typically requires separate product recall coverage, either as an endorsement or a standalone policy. If your product category carries recall risk, ask your broker about it specifically.",
  },
  {
    question: "Is general liability insurance enough for a business that manufactures or sells physical products?",
    answer:
      "General liability (CGL) policies typically include product liability coverage as one insuring agreement within the same policy, but the per-occurrence and aggregate limits are usually shared across every claim type the policy covers, not reserved exclusively for product claims. A business shipping high volumes of a product with real injury potential can exhaust a shared limit faster than a low-product-exposure business would, which is exactly the gap this calculator is meant to help you notice before it becomes a problem.",
  },
  {
    question: "What counts as a 'unit' if my business sells a service, not a discrete product?",
    answer:
      "This calculator is built for businesses that manufacture, import, private-label, or distribute a physical product with a countable unit, such as a batch, SKU, or shipped item. If your business is purely service-based, professional liability or errors and omissions coverage is a closer fit than product liability, and a unit-based exposure estimate like this one won't apply cleanly.",
  },
  {
    question: "How often should I recalculate my product liability exposure?",
    answer:
      "Recalculate whenever unit volume changes meaningfully, such as after a large new retail or distribution contract, and whenever you get updated internal defect or return-rate data. Because both inputs are self-supplied, the estimate is only as current as the numbers you last entered.",
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

export default function ProductLiabilityExposureCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Product Liability Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            A rough sizing tool for manufacturers, importers, private-label sellers, and distributors: turn
            your own units-shipped, defect-rate, and claim-cost estimates into an annual exposure figure to
            bring into a broker conversation, not a fabricated industry benchmark.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <ProductLiabilityExposureCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-product-liability-exposure-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Product Liability Insurance Covers</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Product liability insurance responds when a product your business made, imported, private-labeled,
            or distributed causes injury or property damage to someone else. Product liability law generally
            recognizes three distinct legal theories a claim can be built on: a <strong>manufacturing defect</strong>,
            where an individual unit came off the line differently than intended, a <strong>design defect</strong>,
            where the product performed exactly as designed but the design itself created an unreasonable risk,
            and <strong>failure to warn</strong> (sometimes called a marketing defect), where the product itself
            was fine but the warnings, instructions, or labeling didn&apos;t adequately alert a user to a real risk.
            All three theories can trigger a claim under the same policy, but they arise from very different
            root causes, which is part of why a single flat coverage number rarely fits every product business.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Calculator Is Built For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is aimed at businesses with a physical product somewhere in their supply chain: contract
            manufacturers, importers who bring finished goods into the country, private-label sellers who put
            their own brand on someone else&apos;s manufacturing, and distributors who never touch the product but
            still sit in the chain of commerce a claim can reach. It&apos;s less useful for purely service-based
            businesses, where professional liability or errors and omissions coverage is the closer fit, since
            there&apos;s no shipped &ldquo;unit&rdquo; to run the math against.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Rough Exposure Math Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator multiplies three numbers you enter: units sold or shipped per year, your own assumed
            defect rate as a percentage, and an average cost per claim covering legal defense plus settlement.
            Units times defect rate gives a rough expected number of claims per year; multiplying that by the
            average cost per claim gives a rough annual expected-exposure figure. Because a self-estimated
            defect rate is rarely precise, the tool also shows a sensitivity range at half and double your
            entered rate, so the headline number doesn&apos;t read as more exact than the inputs behind it actually
            support. None of the three inputs comes pre-filled with an assumed industry figure. Defect rates
            and claim costs vary too much between product categories for a single default to be honest, so both
            numbers are yours to research and enter.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a small kitchenware importer shipping 80,000 units of a single product line per year. Based
            on two years of warranty-return data, the business estimates a 0.08% defect rate for units that
            generate a liability claim (as opposed to a simple return), and puts the average combined legal
            defense and settlement cost at $18,000 per claim, drawn from its broker&apos;s claims history for
            similar products. That works out to roughly 64 expected claims a year and a rough annual exposure
            estimate of about $1,152,000, with a sensitivity range of roughly $576,000 to $2,304,000 given how
            uncertain a self-estimated defect rate typically is. That range, not the single point estimate,
            is the useful number to bring into a broker conversation about whether a shared $1,000,000 CGL
            limit or a dedicated excess/umbrella layer makes more sense for this product line.
          </p>

          <AdInArticle slot="tool-product-liability-exposure-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming a standard general liability policy automatically provides
            enough product liability protection for a product-heavy business, without checking whether its
            per-occurrence and aggregate limits are shared across every claim type the policy covers, not
            reserved specifically for product claims. A second is ignoring product recall costs entirely,
            since a batch recall, replacement, or repair program is typically a separate coverage from product
            liability, not an automatic extension of it. A third is treating a single industry rumor about
            &ldquo;typical&rdquo; defect rates as reliable, when the honest answer is that rates vary by product category
            widely enough that only your own data or a category-specific trade association benchmark should
            drive the number you enter here.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is a rough sizing exercise, not an actuarial calculation. It assumes a simple linear
            relationship between units shipped, a self-estimated defect rate, and an average claim cost, and it
            does not model claim frequency distributions, litigation cost variability, jurisdictional
            differences in product liability law, contributory negligence, or the effect of any existing
            coverage limits, deductibles, or self-insured retentions your business already carries. It also
            does not include product recall costs, which typically sit under separate coverage. Treat the
            output as a starting figure for a conversation with a licensed commercial insurance broker, not as
            a final limit decision or a substitute for a proper actuarial or risk-management review.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Product liability</strong> — legal responsibility a business can hold for injury or
              property damage caused by a product it manufactured, imported, private-labeled, or distributed.
            </li>
            <li>
              <strong>Strict liability</strong> — a legal standard, applied to product liability claims in
              many jurisdictions, under which a business can be held liable for a defective product regardless
              of whether it was negligent, if the product was unreasonably dangerous when it left the business&apos;s
              control.
            </li>
            <li>
              <strong>Failure to warn</strong> — a product liability theory based on inadequate instructions or
              warnings, rather than a flaw in how the product was designed or manufactured.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For guidance beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines the common categories of business insurance and how to evaluate coverage needs, the{" "}
            <a
              href="https://www.iii.org/article/business-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how general liability and product liability coverage typically fit together, and the{" "}
            <a
              href="https://www.cpsc.gov/Business--Manufacturing/Recall-Guidance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Consumer Product Safety Commission
            </a>{" "}
            publishes recall guidance for manufacturers, importers, and distributors, which is the closer
            resource once recall risk, rather than a liability claim, is the concern.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              Business insurance calculators
            </Link>{" "}
            category. If your exposure estimate here is larger than your current general liability limit
            supports, the{" "}
            <Link
              href="/tools/business/general-liability-coverage-calculator"
              className="text-blue-600 hover:underline"
            >
              general liability coverage calculator
            </Link>{" "}
            helps size the underlying CGL limit itself, and the{" "}
            <Link
              href="/tools/business/ecommerce-business-insurance-calculator"
              className="text-blue-600 hover:underline"
            >
              e-commerce business insurance calculator
            </Link>{" "}
            is a closer fit if you sell products online alongside other business risks like shipping damage or
            payment disputes.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the coverage decisions that are hardest
            to reason about on your own, including the commercial exposure questions small manufacturers and
            product sellers rarely have an in-house actuary to answer. Every tool runs entirely in your
            browser, keeps the numbers you enter to yourself, and is designed to make your next conversation
            with a licensed broker more specific, not to replace it.
          </p>
        </section>
      </div>
    </>
  );
}

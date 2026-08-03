import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { EcommerceBusinessInsuranceCalculatorTool } from "@/components/tools/EcommerceBusinessInsuranceCalculatorTool";
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

const tool: Tool = {
  slug: "ecommerce-business-insurance-calculator",
  name: "E-Commerce Business Insurance Calculator",
  description:
    "Model the three insurance exposures specific to online sellers: product liability, cyber and data breach coverage, and business interruption from site or platform downtime.",
  category: "Business",
  categorySlug: "business",
  keywords: [
    "ecommerce business insurance calculator",
    "do online sellers need business insurance",
    "ecommerce product liability insurance",
    "online store insurance calculator",
    "ecommerce cyber insurance calculator",
    "dropshipping insurance requirements",
  ],
  relatedTools: ["cyber-insurance-coverage-calculator", "product-liability-exposure-calculator"],
};

const TITLE = "E-Commerce Business Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this ecommerce business insurance calculator to size product liability, cyber, and downtime exposure for your online store in one place, free and instant.";
const PAGE_URL = `${SITE_URL}/tools/business/ecommerce-business-insurance-calculator`;

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
    question: "Do online sellers actually need business insurance?",
    answer:
      "Most do, once real money and real customer data are involved. A home-based seller with no employees and no physical products might get by on very little, but the moment you manufacture or private-label a product, store customer payment or personal information, or depend on your site being reachable to make sales, you're carrying exposures a personal homeowners or renters policy was never built to cover. This calculator is a way to see the shape of that exposure before you talk to an agent, not a determination that you must buy every coverage it models.",
  },
  {
    question: "Does selling on Amazon, Etsy, or Shopify mean I'm already covered?",
    answer:
      "Not automatically. Marketplace platforms sometimes carry their own liability programs, and some require sellers to carry a minimum level of insurance once sales cross a certain volume, but the specifics change and vary by platform and seller category. This tool deliberately doesn't state what any specific marketplace requires, because that language sits inside each platform's seller agreement and changes over time. Check your current seller agreement or marketplace policy directly rather than assuming coverage exists.",
  },
  {
    question: "I dropship — do I still need product liability insurance?",
    answer:
      "Often the manufacturer or supplier carries the product liability coverage for a defective product, since they made it. But that only protects you if your supplier or vendor contract actually says so, and if you're named as an additional insured where relevant. It's a genuinely important nuance for dropshipping specifically, and it's worth confirming in writing rather than assuming your supplier's coverage extends to you.",
  },
  {
    question: "Why does an online store need cyber insurance if it never had a break-in?",
    answer:
      "Cyber and data breach coverage responds to a different kind of loss than a physical break-in: a payment processor compromise, a compromised admin account, or a vulnerability in your storefront platform that exposes customer names, addresses, or card data. Any store that processes customer payment information carries this exposure regardless of size, which is why the calculator ties its cyber guidance to your order volume rather than to whether you've had an incident before.",
  },
  {
    question: "How is the business interruption exposure figure calculated?",
    answer:
      "It's a direct calculation: your average daily online revenue multiplied by the number of downtime days you choose to model, such as a hosting outage, a DDoS attack, or a payment gateway failure taking your store offline. It's meant to show the scale of a plausible worst case, not to predict how often that scenario happens or to price a specific interruption insurance policy.",
  },
  {
    question: "Is PCI DSS compliance the same thing as cyber insurance?",
    answer:
      "No. PCI DSS (Payment Card Industry Data Security Standard) is a set of security requirements card networks and payment processors require merchants to follow when handling card data; it's a compliance obligation, not an insurance policy. Being PCI DSS compliant can reduce your risk and may be a condition some cyber insurers require before binding a policy, but compliance and coverage are two separate things.",
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

export default function EcommerceBusinessInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            E-Commerce Business Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See product liability, cyber, and downtime exposure for your online store side by side, sized
            to how you source your products and how your store actually runs. Free, instant, no account
            needed.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <EcommerceBusinessInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-ecommerce-business-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What Makes E-Commerce Business Insurance Different
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A general small business insurance calculator treats every business roughly the same way:
            general liability, property, maybe workers&apos; compensation. An online store carries a
            different mix. If you manufacture or private-label a physical product, a defect claim tied to
            that product is a product liability exposure your general liability policy may not fully
            absorb on its own. Every order that runs through your checkout touches customer payment
            information and personal data, which is a cyber and data breach exposure regardless of whether
            you ever have a physical location. And because your revenue depends entirely on your storefront
            being reachable, a hosting outage, a DDoS attack, or a payment gateway failure creates a
            business interruption loss that has nothing to do with fire, flood, or theft. This ecommerce
            business insurance calculator exists because those three exposures rarely show up together in
            one place, and a seller shopping for coverage benefits from seeing all three before calling an
            agent.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for anyone running a store that sells through their own website, a
            marketplace, or both — whether that&apos;s a single founder shipping orders from a spare room or a
            small team with a warehouse and a handful of employees. It&apos;s equally useful whether you make
            what you sell or resell someone else&apos;s product, since the calculator asks that question
            directly and changes its product liability guidance based on the answer. If you&apos;re just
            starting to research what &ldquo;business insurance for an online store&rdquo; even covers, or you&apos;re
            already insured and want to sanity-check whether your limits still match your order volume and
            revenue, this is the right starting point before a quote call.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How Each Exposure Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The business interruption figure is the only hard number this tool calculates: your average
            daily online revenue multiplied by the number of downtime days you choose to model. There&apos;s
            no hidden formula behind it — it&apos;s meant to make a plausible worst case concrete, whether
            that&apos;s a three-day hosting outage or a longer disruption during a DDoS attack or a payment
            processor failure. Product liability and cyber coverage don&apos;t work the same way, because
            actual premiums and limits depend on underwriting variables this page has no access to, so
            instead the calculator maps your annual revenue and annual order volume to commonly seen
            starting-point ranges. Revenue drives the product liability range because it&apos;s a rough proxy
            for how much product is out in the world generating potential claims; order volume drives the
            cyber range because it&apos;s a rough proxy for how much customer payment and personal data has
            passed through your systems. Selecting &ldquo;dropship or resell&rdquo; replaces the product liability
            range entirely with guidance to check your supplier contract, since a dropshipper&apos;s exposure
            depends on what that contract actually assigns, not on their own revenue.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a seller who private-labels a skincare line, does $300,000 a year in revenue, processes
            about 8,000 orders a year, averages $1,200 a day in online sales, and wants to model a three-day
            outage. The interruption figure comes out to $3,600 ($1,200 &times; 3), which is the direct cost of
            losing three days of sales if the store goes down. Because this seller manufactures the product
            rather than reselling it, the calculator&apos;s product liability guidance points to roughly a
            $1M/$2M product liability starting range at that revenue level, worth discussing with an agent
            given the product category is a topical skincare item that touches skin directly. At 8,000
            orders a year, the cyber guidance lands in the $1,000,000&ndash;$2,000,000 starting range. None of
            these three numbers would have been obvious from a single generic small business calculator,
            and seeing them side by side is what makes the shopping conversation with an agent faster.
          </p>

          <AdInArticle slot="tool-ecommerce-business-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Mistake This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake online sellers make is assuming the marketplace they sell
            through already insures them. Some platforms do carry programs that respond to certain
            third-party claims, and some require sellers past a given volume to carry their own coverage,
            but the details differ by platform, change over time, and typically apply narrowly rather than
            broadly. Treating a marketplace&apos;s program as a substitute for your own product liability, cyber,
            and interruption coverage is a gap that usually surfaces at the worst possible moment, which is
            during an actual claim. Read your current seller agreement directly rather than relying on
            what a forum post or a competitor&apos;s blog claims a platform requires.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The downtime exposure figure assumes every day of downtime costs you a full day of average
            revenue, which is a reasonable planning simplification but ignores factors like whether
            customers simply return and buy later, or whether a partial outage only affects part of your
            checkout flow. The product liability and cyber ranges are commonly seen starting points drawn
            from how commercial underwriters typically approach revenue and data volume, not a quote, a
            regulatory requirement, or a guarantee that any specific insurer will offer those exact limits.
            This tool does not know your product category, your claims history, your state, your payment
            processor&apos;s own security posture, or the specific terms of any marketplace seller agreement you
            operate under. Use every figure here as a planning input to bring into a conversation with a
            licensed commercial insurance agent, not as a final coverage decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Private label</strong> — selling a product manufactured by a third party under your
              own brand name, where you typically control the specification and branding but not the
              manufacturing process itself.
            </li>
            <li>
              <strong>Drop shipping</strong> — a sourcing model where you sell a product without holding
              inventory; a supplier or manufacturer ships the item directly to the customer on your behalf.
            </li>
            <li>
              <strong>PCI DSS compliance</strong> — the Payment Card Industry Data Security Standard, a set
              of security requirements merchants must follow to accept card payments; a compliance
              obligation set by the card networks, not an insurance policy.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on general small business coverage, the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines the main categories of business insurance and when each typically applies. The{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/start-security-guide-business"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Federal Trade Commission
            </a>{" "}
            publishes data security guidance for businesses that collect customer information, directly
            relevant to the cyber exposure this calculator models. The{" "}
            <a
              href="https://www.cisa.gov/topics/cyber-threats-and-advisories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Cybersecurity and Infrastructure Security Agency
            </a>{" "}
            tracks the categories of cyber threats, including DDoS attacks, that drive the downtime scenario
            this tool asks you to model. And the{" "}
            <a
              href="https://www.pcisecuritystandards.org/standards/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              PCI Security Standards Council
            </a>{" "}
            maintains the PCI DSS standard referenced above for merchants handling card payments.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              business insurance calculators
            </Link>{" "}
            category. For a deeper dive into the product liability figure sketched out above, the{" "}
            <Link href="/tools/business/product-liability-exposure-calculator" className="text-blue-600 hover:underline">
              product liability exposure calculator
            </Link>{" "}
            models that math in full, and the{" "}
            <Link href="/tools/business/cyber-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              cyber insurance coverage calculator
            </Link>{" "}
            does the same for data breach and cyber liability sizing.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the coverage, cost, and claims
            questions people actually search for. Every tool here runs entirely in your browser, collects
            no personal information to work, and aims to leave you better prepared for the conversation
            with a licensed agent that comes next.
          </p>
        </section>
      </div>
    </>
  );
}

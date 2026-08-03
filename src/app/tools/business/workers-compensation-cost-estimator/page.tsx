import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { WorkersCompensationCostEstimatorTool } from "@/components/tools/WorkersCompensationCostEstimatorTool";
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
 * This tool is new and not yet wired into the central tools registry (that
 * happens in a separate integration pass), so its metadata is built from a
 * locally defined `Tool` record rather than `getToolBySlug`. The shape
 * matches `src/types/index.ts` exactly so it drops into the registry later
 * without changes.
 */
const tool: Tool = {
  slug: "workers-compensation-cost-estimator",
  name: "Workers' Compensation Cost Estimator",
  description:
    "Estimate your workers' compensation premium from your own payroll, class code rate, and experience modification factor using the real, transparent formula rating bureaus use.",
  category: "Business",
  categorySlug: "business",
  keywords: [
    "workers compensation cost estimator",
    "how much does workers comp insurance cost",
    "workers compensation calculator",
    "workers comp premium estimator",
    "workers compensation class code rate calculator",
    "small business workers comp cost",
  ],
  relatedTools: [
    "general-liability-coverage-calculator",
    "contractor-insurance-calculator",
  ],
};

const TITLE = "Workers' Compensation Cost Estimator | Insurance Tools";
const DESCRIPTION =
  "Use this workers compensation cost estimator to calculate premium from payroll, your class code rate, and your experience modification factor, step by step.";
const PAGE_URL = `${SITE_URL}/tools/business/workers-compensation-cost-estimator`;

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
    question: "Does this workers compensation cost estimator give me my actual premium?",
    answer:
      "No. It applies the real premium formula, payroll divided by 100, multiplied by your class code rate, multiplied by your experience modification factor, to numbers you enter. Your actual bill also depends on state-specific rules, minimum premiums, deductible credits, safety group discounts, and your carrier's own underwriting, none of which this tool has access to. Use the estimate to sanity-check a quote, not to replace one.",
  },
  {
    question: "Where do I find my real class code rate?",
    answer:
      "Your class code rate is published either by NCCI (the National Council on Compensation Insurance, which sets rates in most states) or by your own state's independent rating bureau in states that don't use NCCI, such as California, Texas, Delaware, Minnesota, New York, and a few others. Your broker or current carrier can also give you the exact rate for your classification and state. This tool intentionally does not supply a rate, since a single class code can carry very different rates in different states and a wrong number here is worse than no number.",
  },
  {
    question: "What does an experience modification factor of 1.00 mean?",
    answer:
      "An X-Mod of 1.00 means your business is priced as an average risk for your class code and payroll size, with no credit or debit applied. Below 1.00 is a credit, reflecting a better-than-average claims history, and above 1.00 is a debit, reflecting a worse-than-average one. Most new businesses without enough claims history to calculate their own mod start at 1.00 by default.",
  },
  {
    question: "Do all small businesses have to carry workers' compensation insurance?",
    answer:
      "In most states, yes, once you have employees past a state-specific threshold, though the exact employee count, which owners are exempt, and which industries are covered all vary by state. A few states (Texas is the best-known example) do not universally require private employers to carry it. Check your own state's requirement with your state's labor department or workers' compensation board rather than assuming a number, since this tool does not track every state's threshold.",
  },
  {
    question: "Why would misclassifying an employee's class code raise my premium?",
    answer:
      "Class codes are tied to job duties, not job titles, and rates for higher-hazard duties (roofing, machine operation, delivery driving) run well above rates for clerical or low-hazard duties. If payroll for an employee doing lower-hazard work gets bundled into a higher-hazard code by mistake, you're paying that code's rate on wages that shouldn't carry it. Reviewing your payroll audit against each employee's actual duties is one of the more reliable ways to catch this.",
  },
  {
    question: "Can I lower my X-Mod once it's above 1.00?",
    answer:
      "It's worth reviewing your experience modification worksheet for errors, since mods are calculated from reported claims data and mistakes (a claim charged to the wrong policy, a reserve that was never closed out after a claim resolved, duplicate entries) do happen and can be disputed with your rating bureau. Beyond correcting errors, mods improve over time as claims age out of the calculation window and as your claims history gets safer, but there's no way to manually override a correctly calculated mod.",
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

export default function WorkersCompensationCostEstimatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Workers&apos; Compensation Cost Estimator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            A workers compensation cost estimator built around the same payroll x rate x experience
            modifier formula rating bureaus actually use, so you supply the real numbers and see exactly
            how each one moves your premium.
          </p>
          <LastUpdated category="business" />
        </div>

        <div className="mt-2">
          <WorkersCompensationCostEstimatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-workers-comp-cost-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why Workers&apos; Compensation Is Usually Mandatory Once You Have Employees
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            In most states, hiring even one employee past a state-specific threshold triggers a legal
            requirement to carry workers&apos; compensation insurance, and the coverage exists to do two
            things at once: guarantee an injured employee gets medical care and lost-wage benefits
            regardless of who caused the accident, and protect the employer from being sued directly over
            a workplace injury in most circumstances. What counts as an employee, which owners or officers
            can opt out, and what the exact minimum headcount is all vary by state, and a handful of
            states (Texas is the most commonly cited) don&apos;t universally mandate it for private
            employers the way most others do. This estimator doesn&apos;t attempt to answer &ldquo;does my
            state require this for my business&rdquo; because that answer changes by state and by industry;
            your state&apos;s workers&apos; compensation board or labor department is the source that actually
            tracks it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Premium Formula, Step by Step</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nearly every state prices a standard workers&apos; comp policy using the same three-factor
            formula. First, payroll for employees under a given classification gets divided by 100,
            because rates are always expressed per $100 of payroll. Second, that figure gets multiplied by
            the class code rate for that classification and state, which reflects how hazardous the
            rating bureau considers that specific job duty to be, not the industry as a whole. That
            product is the manual premium, the baseline cost before any adjustment for your own claims
            history. Third, the manual premium gets multiplied by your experience modification factor, or
            X-Mod, which raises or lowers the manual premium based on whether your business&apos;s claims
            history has run better or worse than average for your classification and payroll size. A
            business with no claims history yet is typically assigned an X-Mod of 1.00, meaning no
            adjustment either way. This calculator runs exactly that formula on the numbers you enter and
            shows the manual premium and the mod adjustment separately, so you can see how much of your
            estimated cost comes from your payroll and rate versus your own claims history.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Finding Your Real Class Code Rate and X-Mod
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool deliberately does not supply a class code rate, because a single classification can
            carry very different rates from one state to the next, and publishing a placeholder number
            that looks authoritative would be worse than leaving the field blank. In most states, class
            code rates are set by NCCI, the National Council on Compensation Insurance, which maintains
            the classification system and files rates with state regulators. A smaller group of states run
            their own independent rating bureaus instead, including California, Texas, Delaware,
            Minnesota, and New York among others, so the first thing to confirm is whether your state uses
            NCCI or its own bureau. Either way, your current broker or carrier can read the exact rate for
            your classification and state directly off your policy or your renewal quote, which is often
            the fastest path if you already have a policy in place. Your X-Mod, if you have one, appears on
            your experience modification worksheet, issued annually by the same bureau that sets your
            rates; new businesses without three years of claims history typically start at the neutral
            1.00 this calculator defaults to.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            These numbers are illustrative only, not real published rates. Say a small general
            contracting business has $500,000 in annual payroll under a single class code, obtains a rate
            of $8.50 per $100 of payroll from its state&apos;s rating bureau, and carries an X-Mod of 1.05
            from a claim two years ago. Dividing payroll by 100 gives 5,000 units; multiplying by the
            $8.50 rate gives a manual premium of $42,500. Multiplying that manual premium by the 1.05 X-Mod
            adds $2,125, for an estimated annual premium of $44,625, or roughly $3,719 a month if billed
            evenly. If that same business later disputes and corrects an error on its mod worksheet and its
            X-Mod drops to 0.95, the same payroll and rate instead produce a $4,250 credit, for an
            estimated premium of $40,375. The formula doesn&apos;t change; only the inputs do, which is the
            whole point of entering your own real numbers here instead of reading someone else&apos;s
            example as if it applied to you.
          </p>

          <AdInArticle slot="tool-workers-comp-cost-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most expensive recurring mistake is misclassification: assigning an employee to a class
            code based on the business&apos;s industry rather than that specific employee&apos;s actual job
            duties, which can bundle clerical or low-hazard payroll into a higher-hazard code and
            overpay for coverage that role never needed. A close second is accepting a debit X-Mod without
            reviewing the worksheet it came from; mod calculations run off reported claims data, and
            errors, a claim charged to the wrong policy, a reserve left open long after the claim closed, a
            duplicate entry, do happen and can be formally disputed with the rating bureau that issued the
            worksheet. A third is forgetting that overtime pay is typically counted at straight-time value
            for premium purposes in most states, not the inflated overtime rate, which means payroll
            entered for this calculator should reflect that adjustment if a meaningful share of payroll is
            overtime.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This estimator assumes a single class code and applies the standard three-factor formula
            without any of the additional adjustments a real policy can include, such as a deductible
            credit for a business that shares in claims costs, a schedule rating credit or debit applied at
            underwriting discretion, a premium discount for larger policies, or a minimum premium floor
            that some carriers apply regardless of how small the calculated number comes out. Businesses
            with employees across multiple class codes need a separate calculation per code, summed
            together, which this single-code tool does not automate. It also does not apply any state&apos;s
            payroll cap, a rule some states use to limit how much of a high earner&apos;s (often an executive
            officer&apos;s) payroll counts toward the premium calculation; where that applies, it is set and
            published by the same state rating bureau or NCCI, not by this tool. Treat every figure here as
            a planning estimate to bring into a conversation with a licensed broker, not as a bindable
            quote.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Class code</strong> — a numeric code that classifies a specific job duty (not an
              entire company) for workers&apos; comp rating purposes; each code carries its own published
              rate per state.
            </li>
            <li>
              <strong>Experience modification factor (X-Mod)</strong> — a multiplier applied to the manual
              premium that reflects whether a business&apos;s claims history has run better (a credit, below
              1.00) or worse (a debit, above 1.00) than average for its classification and payroll size.
            </li>
            <li>
              <strong>Payroll cap for premium purposes</strong> — a limit some states apply to how much of
              an individual&apos;s payroll, most often an executive officer&apos;s, counts toward the premium
              calculation, set and published by that state&apos;s rating bureau rather than a fixed
              nationwide figure.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For the classification system and rate-filing process behind the numbers this tool asks you to
            supply, {" "}
            <a
              href="https://www.ncci.com/pages/default.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the National Council on Compensation Insurance
            </a>{" "}
            publishes the classification system used in most states, and the{" "}
            <a
              href="https://www.sba.gov/business-guide/manage-your-business/get-business-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Small Business Administration
            </a>{" "}
            outlines when small businesses generally need coverage. The{" "}
            <a
              href="https://www.dol.gov/general/topic/workcomp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of Labor
            </a>{" "}
            maintains an overview of how workers&apos; compensation programs are administered state by state.
            Before budgeting against any figure from this calculator, confirm your exact class code rate,
            X-Mod, and your state&apos;s specific requirements with{" "}
            <a
              href="https://www.naic.org/state_web_map.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              your state&apos;s insurance regulator
            </a>{" "}
            or a licensed broker.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/business" className="text-blue-600 hover:underline">
              business insurance tools
            </Link>{" "}
            category. If you&apos;re building out coverage beyond workers&apos; comp, the{" "}
            <Link
              href="/tools/business/general-liability-coverage-calculator"
              className="text-blue-600 hover:underline"
            >
              general liability coverage calculator
            </Link>{" "}
            covers the other policy most small businesses carry, and contractors specifically may also
            want the{" "}
            <Link
              href="/tools/business/contractor-insurance-calculator"
              className="text-blue-600 hover:underline"
            >
              contractor insurance calculator
            </Link>{" "}
            for coverage needs specific to project-based work.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn real insurance formulas and
            regulator guidance into something a business owner can actually run themselves, without
            handing over contact information or waiting on a callback. Every tool here runs entirely in
            your browser and is meant to prepare you for a sharper conversation with a licensed broker, not
            replace one.
          </p>
        </section>
      </div>
    </>
  );
}

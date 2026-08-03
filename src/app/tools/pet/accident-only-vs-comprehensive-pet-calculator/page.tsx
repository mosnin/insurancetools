import type { Metadata } from "next";
import Link from "next/link";
import { AccidentOnlyVsComprehensivePetCalculatorTool } from "@/components/tools/AccidentOnlyVsComprehensivePetCalculatorTool";
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

const tool = getToolBySlug("accident-only-vs-comprehensive-pet-calculator")!;

const TITLE = "Accident-Only vs. Comprehensive Pet Insurance Calculator | Insurance Tools";
const DESCRIPTION =
  "Compare accident-only vs. comprehensive pet insurance using your own quotes and vet bill to see exactly what each plan pays, including the illness coverage gap.";
const PAGE_URL = `${SITE_URL}/tools/pet/accident-only-vs-comprehensive-pet-calculator`;

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
    question: "Does accident-only pet insurance ever cover illnesses?",
    answer:
      "No, not under a standard accident-only policy. Accident-only coverage is built specifically around injuries from accidents, things like broken bones, swallowed objects, or being hit by a car, and it excludes illness claims (infections, cancer, chronic conditions) as a matter of policy design, not underwriting discretion. If you want any illness protection at all, you need an accident-and-illness (comprehensive) plan, which this calculator labels the comprehensive tier.",
  },
  {
    question: "Why is the comprehensive plan's premium so much higher than accident-only?",
    answer:
      "Comprehensive plans insure a much wider range of claims, most notably chronic and age-related illnesses that tend to be both more common and more expensive than accidental injuries over a pet's lifetime. Insurers price that added exposure into the premium. The calculator's premium-difference figure shows you exactly what that gap costs per year for the two quotes you entered, so you can weigh it against your own tolerance for an uncovered illness bill.",
  },
  {
    question: "What if my pet's condition is partly an accident and partly an illness, like a torn ligament?",
    answer:
      "This is a genuinely gray area, and insurers classify it differently. Some torn ligaments (like a cruciate tear from a fall or hard landing) are treated as accident claims; others, especially when a vet's notes point to gradual degeneration rather than a specific traumatic event, get classified as illness or even excluded as a pre-existing or hereditary condition. This calculator can't make that judgment call for you; run the scenario both ways to see the range, then confirm the classification with the insurer's actual policy wording before you rely on either number.",
  },
  {
    question: "Does this calculator account for annual or per-incident payout caps?",
    answer:
      "No. It applies your deductible and reimbursement rate to the vet bill you enter with no additional annual or per-incident limit, since those limits vary by insurer, by plan tier, and sometimes by condition. If your actual policy has an annual payout cap, a real payout on a large bill could be lower than what this tool shows. Check your policy's benefit schedule for any cap before treating either figure as final.",
  },
  {
    question: "Should I buy accident-only now and upgrade to comprehensive later?",
    answer:
      "You can, but there's a catch worth knowing before you count on it: most insurers apply new waiting periods and re-underwrite for pre-existing conditions when you upgrade tiers, so any illness your pet develops while on the accident-only plan is likely to be excluded from the comprehensive plan too, even after you switch. This calculator doesn't model that timing risk; it only compares what each tier would pay for a bill today.",
  },
  {
    question: "Does this tool store or send my premium quotes or vet bill anywhere?",
    answer:
      "No. Every number you enter stays in your browser and is used only to run the comparison live on this page. Nothing is saved, transmitted, or associated with you, and reloading the page resets every field to its starting value.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Pet Insurance Tools", href: "/tools/pet" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function AccidentOnlyVsComprehensivePetCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Accident-Only vs. Comprehensive Pet Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            This accident-only vs. comprehensive pet insurance calculator uses your own two quotes, your
            own deductible and reimbursement rate for each, and a vet bill you choose, to show what each
            plan tier actually pays for an accident scenario and for an illness scenario, side by side.
          </p>
          <LastUpdated category="pet" />
        </div>

        <div className="mt-2">
          <AccidentOnlyVsComprehensivePetCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-accident-only-vs-comprehensive-pet-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs This Accident-Only vs. Comprehensive Pet Insurance Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for anyone holding two pet insurance quotes side by side and trying to decide
            whether the cheaper, accident-only option is actually enough, or whether the bigger premium
            for a comprehensive accident-and-illness plan is worth it. Most shoppers are told the two
            options exist but rarely see a concrete dollar comparison of what each would pay on an actual
            bill, so the decision comes down to premium price alone. That&apos;s a risky way to choose,
            because the two tiers aren&apos;t a cheaper and pricier version of the same protection; they
            cover meaningfully different sets of claims, and the difference only shows up the day you
            actually file one.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Scenario-Based Comparison Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Enter your accident-only plan&apos;s annual premium, deductible, and reimbursement rate, then do
            the same for your comprehensive plan&apos;s quote. The two tiers are allowed to have different
            deductibles and reimbursement rates, since insurers often price and structure them separately
            even within the same company. Next, choose a scenario: an accident event (a broken bone or a
            swallowed object are common examples) or an illness event (something like cancer or a chronic
            condition), and enter your own estimate of what that vet visit would cost. The calculator
            never assumes a bill amount for you; every dollar in the result traces back to what you typed
            in.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            For an accident scenario, both plans run the same math: reimbursement rate multiplied by the
            bill above the deductible. For an illness scenario, the comprehensive plan runs that same
            math, but the accident-only plan&apos;s payout is fixed at $0, because illness claims fall
            outside what an accident-only policy insures at all, no matter how the deductible or
            reimbursement rate is set. That $0 line is the calculator&apos;s way of making a real
            product-tier exclusion visible instead of leaving it buried in policy language you&apos;d only
            read after a claim was denied.
          </p>

          <AdInArticle slot="tool-accident-only-vs-comprehensive-pet-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a pet owner has two quotes for the same dog: an accident-only plan at $204 a year with a
            $250 deductible and 80% reimbursement, and a comprehensive plan at $636 a year with the same
            $250 deductible and 80% reimbursement. Picking the accident scenario with a $1,200 estimated
            bill, both plans pay the same $760 (80% of the $950 left after the deductible), so the only
            real difference that year is the $432 extra premium for comprehensive. Now switch the
            scenario to illness with a $3,800 estimated bill for a chronic condition: the comprehensive
            plan pays $2,840 (80% of $3,550 after the deductible), while the accident-only plan pays $0.
            The owner&apos;s out-of-pocket jumps from a manageable $960 with comprehensive to the full
            $3,800 with accident-only, a $2,840 swing that the premium savings alone never hinted at.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is treating &ldquo;pet insurance&rdquo; as one uniform product and
            comparing quotes on price alone, the way you might compare two quotes for the exact same
            coverage. Accident-only and comprehensive plans aren&apos;t the same coverage at different
            prices; they insure different sets of events, and a lower premium on an accident-only plan
            isn&apos;t a discount, it&apos;s a narrower policy. A second mistake is assuming a young, healthy
            pet makes accident-only the obvious choice, without weighing that most pets eventually develop
            some illness, and the plan that excludes illness claims won&apos;t protect against exactly the
            costs that tend to grow with a pet&apos;s age. A third is comparing only the premiums and
            ignoring that the two plans in this example can also carry their own separate deductible and
            reimbursement rate, which changes the actual payout gap beyond just the coverage exclusion
            itself.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes a straightforward reimbursement model: the entered rate applied to
            whatever portion of the vet bill exceeds the entered deductible, with no other adjustment. It
            does not model annual or per-incident payout caps, waiting periods before coverage starts,
            pre-existing condition exclusions, or hereditary and congenital condition limits, all of which
            vary by insurer and by plan and can reduce a real payout below what this tool shows. It also
            does not classify borderline conditions (a torn ligament, for example, can be coded as either
            an accident or an illness depending on the vet&apos;s notes and the insurer&apos;s rules) or
            account for switching tiers mid-policy, which usually triggers new waiting periods and
            re-underwriting. Every premium, deductible, reimbursement rate, and vet bill comes from what
            you enter; the tool has no independent knowledge of typical costs for your pet, breed, or
            region and never presents an estimate as a guaranteed claim outcome.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Accident-only coverage</strong> — a pet insurance tier that pays for injuries from
              accidents, such as broken bones, cuts, or swallowed objects, and excludes illness claims
              entirely regardless of deductible or reimbursement rate.
            </li>
            <li>
              <strong>Accident-and-illness (comprehensive) coverage</strong> — a broader tier that pays for
              both accidental injuries and illnesses, such as infections, cancer, and chronic conditions,
              typically at a meaningfully higher premium than accident-only.
            </li>
            <li>
              <strong>Hereditary and congenital condition coverage</strong> — coverage for conditions a pet
              is born with or predisposed to by breed, such as hip dysplasia in certain large breeds; some
              comprehensive plans include it standard, others limit or exclude it, so it&apos;s worth
              confirming in the policy&apos;s own wording rather than assuming either answer.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For consumer guidance on how these plan tiers are typically structured, the{" "}
            <a
              href="https://content.naic.org/consumer/pet-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes a consumer overview of pet insurance terms and shopping questions. The{" "}
            <a
              href="https://www.aspca.org/pet-care/pet-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ASPCA
            </a>{" "}
            explains what accident-only and comprehensive plans typically cover from an animal welfare
            perspective, and the{" "}
            <a
              href="https://www.iii.org/article/what-you-need-know-about-pet-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down deductibles, reimbursement rates, and common exclusions across the pet insurance
            market. Confirm your exact policy&apos;s definitions and exclusions directly with your insurer
            before relying on any comparison, including this one, to choose a plan.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/pet" className="text-blue-600 hover:underline">
              Pet insurance tools
            </Link>{" "}
            category. If you haven&apos;t decided whether pet insurance makes sense at all yet, start with
            the{" "}
            <Link href="/tools/pet/pet-insurance-value-calculator" className="text-blue-600 hover:underline">
              pet insurance value calculator
            </Link>
            . If you already have a plan and are weighing an add-on, the{" "}
            <Link href="/tools/pet/pet-wellness-plan-value-calculator" className="text-blue-600 hover:underline">
              pet wellness plan value calculator
            </Link>{" "}
            checks whether a routine-care rider pays for itself the same way this tool checks accident-only
            against comprehensive.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn dense policy comparisons into
            numbers you can actually act on. This one runs entirely on the quotes and vet bill you type in,
            asks for no account and no contact details, and is meant to help you walk into a pet insurance
            purchase already knowing which tier fits the risk you&apos;re actually trying to cover.
          </p>
        </section>
      </div>
    </>
  );
}

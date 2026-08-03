import type { Metadata } from "next";
import Link from "next/link";
import { PetInsuranceValueCalculatorTool } from "@/components/tools/PetInsuranceValueCalculatorTool";
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

const tool = getToolBySlug("pet-insurance-value-calculator")!;

const TITLE = "Pet Insurance Value Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this pet insurance value calculator to weigh your premium against a vet bill scenario you choose, applying real deductible and reimbursement math.";
const PAGE_URL = `${SITE_URL}/tools/pet/pet-insurance-value-calculator`;

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
    question: "Does this pet insurance value calculator tell me if I should buy a policy?",
    answer:
      "It shows you the math for one scenario at a time, comparing what you'd pay in premium against what a policy would reimburse if your vet bill matched the figure you entered. It doesn't predict whether your pet will actually get sick or how much a future bill will cost, since no calculator can know that. Run it with a few different vet bill scenarios, from a quiet year to a major surgery, to see how the math shifts before deciding.",
  },
  {
    question: "Why doesn't the calculator include an out-of-pocket maximum?",
    answer:
      "Because most pet insurance policies don't have one. Once your deductible is met, the policy reimburses a fixed percentage of the remaining bill, and that same percentage split keeps applying no matter how high the bill climbs. That's a meaningful structural difference from most human health plans, which cap your annual out-of-pocket cost after a certain point. If a specific policy you're quoting does advertise an annual coverage cap or per-incident limit, that cap sits on top of this math and isn't modeled here.",
  },
  {
    question: "Why do I have to enter my own vet bill estimate instead of getting a typical cost?",
    answer:
      "Vet costs vary enormously by species, breed, region, and the specific procedure involved, to the point that a single 'average' figure would be misleading for most pets. A torn ligament repair in a large dog and a routine illness in a cat can differ by thousands of dollars. Get a real number from your own vet, a treatment estimate, a friend's recent bill, or your own pet's claim history, then run it through the calculator so the result reflects your actual situation.",
  },
  {
    question: "Will my premium stay the same as my pet gets older?",
    answer:
      "Typically not. Pet insurers commonly reprice premiums upward as a pet ages, since older pets statistically file more and larger claims. This calculator asks for your pet's current age so you can note that context, but it doesn't project a specific future premium, because insurers publish their own age-based rating tables and don't make a single public formula available. Ask your insurer directly for a renewal projection if you want to see how your premium might change over your pet's lifetime.",
  },
  {
    question: "Does pet insurance cover a condition my pet already has?",
    answer:
      "Almost never. Pre-existing condition exclusions are standard across the pet insurance industry: a condition your pet showed symptoms of, was diagnosed with, or was treated for before the policy started (or during a waiting period after enrollment) is typically excluded from coverage permanently, even if you switch insurers later. This calculator's reimbursement math assumes the vet bill you enter is fully eligible for reimbursement; if part of a real bill relates to a pre-existing condition, your actual reimbursement would be lower than what's shown here.",
  },
  {
    question: "What's the difference between an annual and a per-incident deductible?",
    answer:
      "An annual deductible is met once per policy year and then applies to every eligible claim for the rest of that year. A per-incident deductible resets separately for each new condition, so a pet with two unrelated issues in one year could effectively pay the deductible twice. This calculator models an annual deductible, since that's the more common structure sold today; if your quote uses a per-incident deductible, adjust the deductible field per scenario to approximate it.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
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

export default function PetInsuranceValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Pet Insurance Value Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See whether a pet insurance policy pays off against a vet bill scenario you choose, using the
            deductible-then-reimbursement math real policies actually run on. Free, instant, and it never
            asks who you are.
          </p>
          <LastUpdated category="pet" />
        </div>

        <div className="mt-2">
          <PetInsuranceValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-pet-insurance-value-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who This Pet Insurance Value Calculator Is For
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This pet insurance value calculator is built for the moment right after a quote lands in your
            inbox and you&apos;re staring at a monthly premium with no idea whether it&apos;s actually a good deal.
            It&apos;s also useful for a pet owner who&apos;s carried a policy for a few years and wants to check,
            honestly, whether last year&apos;s claims made the premium worth it or whether that money would have
            covered the vet bill just as well sitting in a savings account. Either way, the question is the
            same: does the reimbursement math work out in your favor for a vet bill you can actually
            picture, not a generic industry average that may have nothing to do with your dog, cat, breed,
            or region.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How Pet Insurance Reimbursement Actually Works
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most pet insurance policies sold in the U.S. use a three-part structure: an annual deductible,
            a reimbursement percentage, and, for some policies, a per-condition or annual coverage cap. You
            pay the full vet bill up front in most cases, then submit a claim. The insurer first subtracts
            your deductible from the eligible portion of the bill, then reimburses the stated percentage of
            whatever remains. A $250 deductible with 80% reimbursement on a $1,500 bill works out to $250
            absorbed by you, then 80% of the remaining $1,250, or $1,000 reimbursed, leaving you responsible
            for $500 of the bill plus whatever you paid in premium that year.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The detail that catches new pet insurance buyers off guard is what&apos;s missing from that
            structure: an out-of-pocket maximum. Most U.S. health insurance plans cap your total annual
            out-of-pocket cost once you hit a certain spending threshold, after which the plan pays 100%.
            Pet insurance typically doesn&apos;t work that way. The deductible-then-percentage split keeps
            applying no matter how large the bill grows, so a $20,000 emergency surgery is reimbursed at the
            same percentage as a $2,000 one, with no ceiling that shifts the remaining cost entirely onto
            the insurer. This calculator models that reality directly instead of borrowing the out-of-pocket
            maximum concept from health insurance, where it doesn&apos;t apply.
          </p>

          <AdInArticle slot="tool-pet-insurance-value-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Premiums Tend to Rise With Age</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Pet insurers commonly increase premiums as a pet gets older, a pattern documented across the
            industry even though the exact rate schedule differs by insurer, breed, and state. The logic
            mirrors why term life insurance costs more to start later in life: older pets statistically file
            more claims and more expensive ones, so insurers price the risk accordingly at renewal. This
            calculator asks for your pet&apos;s current age so the result carries that context, but it
            deliberately doesn&apos;t project what your premium will be in five years, since no single public
            rate table applies across insurers, breeds, and states. If you want a real projection, ask your
            insurer for a multi-year rate history or renewal estimate directly.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a three-year-old dog insured for $45 a month ($540 a year), with a $250 annual
            deductible and 80% reimbursement. The owner picks the &ldquo;one unexpected illness&rdquo;
            scenario and, based on a recent estimate from their own vet for a similar case, enters a $1,500
            vet bill. After the $250 deductible, $1,250 remains, and 80% of that is $1,000 reimbursed by the
            policy. The owner still pays $500 of the bill directly, plus the $540 annual premium, for
            $1,040 total out of pocket against a $1,500 bill. Because the $1,000 reimbursement exceeds the
            $540 premium, the policy nets a $460 benefit in this specific scenario. Run the same numbers
            against a quiet year with only routine visits, and the premium alone likely costs more than
            whatever gets reimbursed, since preventive care is often excluded or capped separately from the
            main deductible-and-reimbursement structure this calculator models.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake Worth Avoiding</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common misunderstanding about pet insurance is assuming it will cover a
            condition your pet already shows signs of. It typically won&apos;t. Pre-existing condition
            exclusions are close to universal in the industry: if a vet noted symptoms, ran tests, or
            treated a condition before your policy started, or during an initial waiting period after
            enrollment, claims related to that condition are usually denied for as long as you hold the
            policy, and often even if you later switch insurers. That makes timing matter more than most
            people expect. A policy purchased while a pet is young and healthy behaves very differently from
            one purchased after a diagnosis already exists, even if the premium and reimbursement percentage
            look identical on paper.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every dollar figure in this calculator, the premium, deductible, reimbursement percentage, and
            vet bill scenario, comes from what you type in. It doesn&apos;t assume a &ldquo;typical&rdquo; vet
            bill on your behalf, doesn&apos;t model pre-existing condition exclusions or waiting periods, and
            doesn&apos;t apply an annual or per-incident coverage cap that some policies layer on top of the
            deductible-and-reimbursement math. It also doesn&apos;t project how your premium will change at
            future renewals. Treat the result as a single-scenario comparison, not a lifetime cost forecast,
            and re-run it with a few different vet bill amounts, from routine-only to a worst-case
            emergency, to see the range of outcomes rather than relying on one number.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Reimbursement percentage</strong> — the share of an eligible vet bill, after the
              deductible is subtracted, that the insurer pays back to you, commonly 70%, 80%, or 90%
              depending on the plan you chose.
            </li>
            <li>
              <strong>Pre-existing condition exclusion</strong> — a policy term that permanently excludes
              coverage for any condition a pet showed symptoms of, was diagnosed with, or was treated for
              before the policy&apos;s effective date or during its initial waiting period.
            </li>
            <li>
              <strong>Annual vs. per-incident deductible</strong> — an annual deductible is met once per
              policy year and applies to all claims after that; a per-incident deductible resets separately
              for each distinct condition, which can mean paying it more than once in a single year.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For consumer guidance on how pet insurance policies are structured,{" "}
            <a
              href="https://content.naic.org/consumer/pet-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the National Association of Insurance Commissioners
            </a>{" "}
            publishes a consumer overview of common terms and shopping questions. The{" "}
            <a
              href="https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains how deductibles function across insurance types generally, which underlies the
            deductible-then-reimbursement math this calculator applies to pet policies specifically. For
            general veterinary care and pet health context that can inform the vet bill figure you enter,
            the{" "}
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              American Veterinary Medical Association
            </a>{" "}
            publishes pet owner resources on common veterinary topics. Before buying or renewing a policy,
            confirm your exact state&apos;s consumer protections with your{" "}
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
            <Link href="/tools/pet" className="text-blue-600 hover:underline">
              Pet insurance calculators
            </Link>{" "}
            category. If you&apos;re specifically weighing a bare-bones accident-only plan against a full
            accident-and-illness policy, the{" "}
            <Link
              href="/tools/pet/accident-only-vs-comprehensive-pet-calculator"
              className="text-blue-600 hover:underline"
            >
              accident-only vs. comprehensive pet insurance calculator
            </Link>{" "}
            walks through that specific tradeoff. If routine visits and preventive care matter more to your
            situation than emergency scenarios, the{" "}
            <Link href="/tools/pet/pet-wellness-plan-value-calculator" className="text-blue-600 hover:underline">
              pet wellness plan value calculator
            </Link>{" "}
            covers that add-on separately, since wellness coverage runs on a different structure than the
            deductible-and-reimbursement math modeled here.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the moments insurance decisions
            actually happen: comparing a quote, sizing a deductible, or checking whether a policy paid off.
            Every tool here runs on the numbers you provide, keeps them in your browser, and is meant to
            leave you better prepared for a conversation with a licensed agent, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

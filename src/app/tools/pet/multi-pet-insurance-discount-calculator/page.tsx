import type { Metadata } from "next";
import Link from "next/link";
import { MultiPetInsuranceDiscountCalculatorTool } from "@/components/tools/MultiPetInsuranceDiscountCalculatorTool";
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

const tool = getToolBySlug("multi-pet-insurance-discount-calculator")!;

const TITLE = "Multi-Pet Insurance Discount Calculator: Compare Bundled vs. Separate Costs | Insurance Tools";
const DESCRIPTION =
  "This multi-pet insurance discount calculator turns your insurer's quoted percentage into real dollars, comparing bundled pricing against separate pet policies.";
const PAGE_URL = `${SITE_URL}/tools/pet/multi-pet-insurance-discount-calculator`;

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
    question: "Does every pet insurer offer a multi-pet discount?",
    answer:
      "No. A multi-pet discount is common but not universal, and the size of it is set independently by each provider, often somewhere in the single digits to around 10%, though some insurers offer more and others offer none at all. This calculator never assumes a number for you; enter the exact percentage from your quote or renewal notice so the dollar figure reflects your actual provider, not an industry average.",
  },
  {
    question: "Why does this tool ask for one combined premium instead of each pet's individual cost?",
    answer:
      "Because the discount itself is typically applied to the household total, not recalculated pet by pet, adding up what every pet would cost separately and applying the discount to that single figure mirrors how the bundled quote is actually built. If you only know a per-pet estimate, add those numbers together before entering them; the calculator divides the bundled total back out to an effective per-pet cost in the results.",
  },
  {
    question: "Will insuring all of my pets on one policy affect my rates if one pet gets sick?",
    answer:
      "It can, depending on how the specific policy is structured. Some multi-pet policies price the entire group's renewal off a shared claims history, so a pet with a run of expensive claims can push up the renewal quote for every animal on that policy, not just the one that filed claims. Other insurers underwrite and renew each pet independently even while billing them on one combined invoice. Ask your provider directly which structure your policy uses before assuming bundling has no downside.",
  },
  {
    question: "Is bundling always cheaper than insuring each pet with a different company?",
    answer:
      "Not necessarily. A multi-pet discount lowers your total relative to that same insurer's own separate pricing, but it says nothing about whether a competing insurer's standalone rate for one of your pets, particularly an older pet or a breed with higher claims risk, might already be lower than your current insurer's discounted bundled rate for that animal. It's worth pricing at least one pet as a standalone policy elsewhere before assuming the bundled discount is the best available deal.",
  },
  {
    question: "What's the difference between a multi-pet discount and a shared deductible?",
    answer:
      "They're separate features that don't always come together. A multi-pet discount is a price reduction on the combined premium. A shared or per-pet deductible describes how claims are processed: most multi-pet policies still apply a separate annual deductible to each pet individually, so one pet meeting its deductible doesn't reduce what another pet owes. A smaller number of plans offer a combined household deductible across all insured pets. Confirm which structure applies to your quote, since it changes what you'll actually pay out of pocket at claim time.",
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

export default function MultiPetInsuranceDiscountCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Multi-Pet Insurance Discount Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            A multi-pet insurance discount calculator built for households with more than one animal on the
            same policy: enter the discount your provider quoted and see what it actually saves in dollars,
            not just as a percentage on a renewal notice.
          </p>
          <LastUpdated category="pet" />
        </div>

        <div className="mt-2">
          <MultiPetInsuranceDiscountCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-multi-pet-discount-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How Multi-Pet Discounts Work, and What They Don&apos;t Tell You
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A household with two or more dogs and cats often qualifies for a multi-pet discount simply by
            insuring every animal with the same provider on the same policy or account. The provider quotes
            that discount as a percentage, which is easy to advertise but hard to evaluate on its own,
            since a discount applied to a small combined premium and the same discount applied to a large
            one produce very different amounts of actual savings. This calculator exists to close that gap:
            it takes what your pets would cost insured completely separately, applies your specific quoted
            percentage, and reports the savings in dollars per year, dollars per month, and an effective
            cost per pet under the bundled policy, so the number you compare against other options is one
            you can actually spend or save.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The tool is deliberately built around a single combined separate-premium figure rather than a
            field for every individual pet, because that mirrors how most multi-pet discounts are actually
            priced. An insurer typically totals what each pet would cost on its own and then discounts that
            total, rather than recalculating a bespoke discount pet by pet. If you only have per-pet
            standalone estimates on hand, add them together before entering the total here.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is most useful for households adopting a second pet, or a third, and deciding whether
            to add the new animal to an existing pet insurance policy or shop it separately. It&apos;s equally
            useful when a renewal notice shows a multi-pet discount line item and you want to know, in
            plain dollars, what that percentage is actually worth before deciding whether to keep every pet
            on one insurer or split coverage. If you&apos;re still deciding whether pet insurance is worth
            buying at all for a specific animal, the{" "}
            <Link href="/tools/pet/pet-insurance-value-calculator" className="text-blue-600 hover:underline">
              pet insurance value calculator
            </Link>{" "}
            answers that earlier question first.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Savings Math Behind the Result</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculation itself is simple by design, since the goal is transparency rather than a black
            box. Your combined separate-pet premium is multiplied by your quoted discount percentage to
            produce the annual dollar savings. Subtracting that savings from the combined premium produces
            the bundled annual total, which is then divided by the number of pets you entered to produce an
            effective bundled cost per pet, shown next to what each pet would have cost insured separately
            for direct comparison. Nothing about breed, age, species mix, location, or claims history
            enters into the math, because the calculator only ever works with the two dollar figures and
            one percentage you provide.
          </p>

          <AdInArticle slot="tool-multi-pet-discount-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Multi-Pet Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a household with three pets: a senior dog that would cost $650 a year insured on its
            own, a younger dog at $500, and a cat at $200, for a combined separate total of $1,350. Their
            provider quotes a 10% multi-pet discount for insuring all three on one account. Ten percent of
            $1,350 is $135 a year, or about $11 a month, bringing the bundled total to $1,215. Divided across
            three pets, that works out to an effective bundled cost of about $405 per pet, compared with an
            average of $450 per pet insured separately. That $135 is a real number worth weighing against
            whatever the household would give up by consolidating claims history across three animals with
            one provider, rather than treating &ldquo;10% off&rdquo; as automatically worth taking without doing
            the arithmetic.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps You Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming that whatever multi-pet discount percentage an insurer
            quotes automatically makes bundling the cheapest option, without checking whether a different
            insurer&apos;s standalone rate for any single pet, especially an older pet with higher expected
            claims, might beat the current insurer&apos;s discounted bundled rate for that same animal. A
            second mistake is treating the discount percentage as fixed once quoted; it is typically
            reassessed at renewal and can shift if a pet is added, removed, or ages into a different
            underwriting bracket. A third is overlooking whether the policy shares claims history across
            every pet for renewal pricing purposes, since that structure means one pet&apos;s bad year can
            raise the bill for pets that filed no claims at all.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the combined separate-premium figure you enter reflects accurate
            standalone quotes or bills for each pet, and that the discount percentage you enter is the one
            your provider actually applies to your specific pets and account. It does not verify bundling
            eligibility rules, which vary by insurer and can depend on species, age limits, or whether pets
            share the same address and policyholder. It also cannot tell you whether your specific policy
            shares claims history across pets for renewal pricing, a genuine and often overlooked tradeoff
            of bundling that some insurers apply and others don&apos;t; that detail sits in your policy&apos;s
            underwriting rules, not in this arithmetic, so confirm it directly with your provider. Treat
            every figure here as a planning estimate to bring into a quote conversation, not as a guaranteed
            price.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pet Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Multi-pet discount</strong> — a percentage reduction some insurers apply to the
              combined premium when two or more pets from the same household are insured together.
            </li>
            <li>
              <strong>Per-pet deductible vs. shared deductible</strong> — most multi-pet policies apply a
              separate annual deductible to each animal individually; a smaller number of plans instead use
              one combined deductible across every insured pet on the account.
            </li>
            <li>
              <strong>Policy bundling</strong> — insuring multiple pets, or multiple types of coverage,
              under a single provider or account to qualify for household-level pricing.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how pet insurance policies are typically structured, the{" "}
            <a
              href="https://content.naic.org/consumer/pet-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on pet insurance terms and shopping considerations. The{" "}
            <a
              href="https://www.aspca.org/pet-care/general-pet-care/pet-health-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ASPCA
            </a>{" "}
            explains what pet health insurance generally covers and what multi-pet households commonly
            weigh when deciding how to structure coverage. The{" "}
            <a
              href="https://naphia.org/industry/resources/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              North American Pet Health Insurance Association
            </a>{" "}
            tracks industry-wide trends in how pet policies are priced and sold. Discount eligibility and
            claims-history rules ultimately sit with each insurer and your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>
            , so confirm the specifics there before relying on an estimate.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/pet" className="text-blue-600 hover:underline">
              Pet insurance calculators
            </Link>{" "}
            category. Before deciding how to bundle multiple pets, the{" "}
            <Link href="/tools/pet/pet-insurance-value-calculator" className="text-blue-600 hover:underline">
              pet insurance value calculator
            </Link>{" "}
            helps you decide whether a policy is worth carrying on a given pet in the first place, and the{" "}
            <Link
              href="/tools/pet/accident-only-vs-comprehensive-pet-calculator"
              className="text-blue-600 hover:underline"
            >
              accident-only vs. comprehensive pet insurance calculator
            </Link>{" "}
            compares plan types once you know which pets you&apos;re insuring.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that take the numbers already sitting on
            a quote or renewal notice and turn them into a decision you can actually act on, without
            creating an account or handing over contact information first.
          </p>
        </section>
      </div>
    </>
  );
}

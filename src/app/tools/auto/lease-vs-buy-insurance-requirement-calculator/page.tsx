import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { LeaseVsBuyInsuranceRequirementCalculatorTool } from "@/components/tools/LeaseVsBuyInsuranceRequirementCalculatorTool";
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
 * This tool is not yet wired into the central registry in `src/lib/tools`,
 * so metadata and structured data are built from a locally scoped `Tool`
 * object rather than `getToolBySlug`. The shape matches the registry entry
 * this page expects to receive once another process adds it there.
 */
const tool: Tool = {
  slug: "lease-vs-buy-insurance-requirement-calculator",
  name: "Lease vs. Buy Insurance Cost Calculator",
  description:
    "Compare the insurance cost of leasing or financing a car against owning it outright, using the full coverage and gap insurance a lessor or lender typically requires versus liability-only.",
  category: "Auto",
  categorySlug: "auto",
  keywords: [
    "lease vs buy car insurance cost calculator",
    "does leasing a car require full coverage",
    "lease car insurance requirements",
    "lease vs buy insurance cost",
    "gap insurance for leased car",
    "full coverage requirement for leased vehicle",
    "insurance cost of leasing vs owning a car",
  ],
  relatedTools: ["car-insurance-coverage-calculator"],
};

const TITLE = "Lease vs. Buy Insurance Cost Calculator | Insurance Tools";
const DESCRIPTION =
  "Run the lease vs buy car insurance cost calculator to see what full coverage and gap insurance add over liability-only, based on your own premiums and loan or lease term.";
const PAGE_URL = `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`;

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
    question: "Does leasing a car always require full coverage?",
    answer:
      "Almost always, yes, for as long as the lease runs. The leasing company retains ownership of the vehicle, so its lease agreement typically requires collision and comprehensive coverage, often with a maximum deductible, to protect the asset it still owns. Financed vehicles usually carry the same requirement from the lender until the loan is paid off. The exact terms live in your lease or loan contract, not in state law, so confirm the specific limits and deductible cap with your leasing company or lender rather than assuming a generic minimum applies.",
  },
  {
    question: "Is gap insurance required on a leased car, or just recommended?",
    answer:
      "Many leases build gap coverage into the monthly payment automatically, while others require you to buy it separately, and a smaller number leave it optional. It matters because a new vehicle depreciates faster than a typical loan or lease balance shrinks in the first year or two, so a total loss early on can leave you owing more than a standard collision payout covers. Check your specific lease agreement, since this tool assumes you already know whether gap is required and simply asks you to enter its premium.",
  },
  {
    question: "Why is the liability-only scenario labeled 'owned' instead of 'buy'?",
    answer:
      "Because the cost difference this tool measures isn't really about the purchase transaction, it's about what coverage a lender or lessor requires while they have a financial stake in the vehicle. A financed purchase still typically requires full coverage until the loan is paid off, at which point an owner can choose liability-only. This tool compares the required-coverage period against the paid-off period, which is why the second scenario is described as owning a vehicle free and clear rather than simply 'buying' one.",
  },
  {
    question: "Does a bigger insurance cost difference mean leasing is the worse financial choice?",
    answer:
      "Not by itself. This calculator isolates only the insurance-cost piece of a much larger decision that also includes the vehicle's price, lease or loan payments, interest, depreciation, mileage limits, and resale or trade-in value. A driver could see a meaningful insurance cost difference here and still come out ahead overall once the rest of the financial picture is included. Use this result as one input alongside a full lease-vs-buy cost comparison, not as the whole answer.",
  },
  {
    question: "How do I find my liability-only premium if I currently have full coverage?",
    answer:
      "Your insurer can usually quote a liability-only price on request, since it's just your existing policy with the collision and comprehensive coverages removed. If you can't get a quote quickly, a reasonable placeholder is your current full-coverage premium minus the collision and comprehensive line item shown on your declarations page, though an actual quote will be more accurate than that estimate.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Auto Calculators", href: "/tools/auto" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function LeaseVsBuyInsuranceRequirementCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Lease vs. Buy Car Insurance Cost Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See exactly what the full coverage and gap insurance a lessor or lender typically requires
            cost compared to liability-only on a vehicle you own outright, over your actual lease or loan
            term.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <LeaseVsBuyInsuranceRequirementCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-lease-vs-buy-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why This Calculator Exists</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most lease-vs-buy comparisons online focus entirely on the payment: monthly lease cost against
            a loan payment, sometimes with depreciation thrown in. Insurance rarely gets more than a
            passing mention, even though it&apos;s one of the few costs that changes in a predictable,
            calculable way depending on which path you take. This lease vs buy car insurance cost
            calculator isolates that one piece. Enter what full coverage and gap insurance would cost you
            while a lessor or lender has a stake in the vehicle, enter what liability-only would cost once
            it&apos;s paid off, and see the dollar difference over your actual term instead of guessing at it.
            It&apos;s built for someone who already has quotes or premium estimates in hand and wants a clean
            side-by-side, not a general lease-vs-buy explainer.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What Coverage Lessors and Lenders Typically Require, and Why
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A lease is, at its core, a long-term rental. The leasing company holds title to the vehicle for
            the length of the agreement, which means a total loss or major accident is a direct financial
            risk to them, not just to you. Lease agreements typically require the driver to carry full
            coverage, meaning collision and comprehensive on top of liability, often with a maximum
            deductible the driver isn&apos;t allowed to exceed. Financed purchases work similarly through the
            lender&apos;s lien on the vehicle: most auto loan agreements also require full coverage until the
            loan is satisfied. Once a vehicle is paid off, whether it was financed or purchased outright,
            the owner is generally free to drop down to liability-only and self-insure the vehicle&apos;s own
            value, since nobody else has a financial claim on it anymore.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Gap insurance often comes up alongside this requirement, but it&apos;s a separate coverage with a
            separate purpose. It&apos;s not about repairing your car, it&apos;s about the gap between what a new
            vehicle actually owes on it and what it&apos;s worth right after a total loss, which can be
            substantial in the first couple of years given how quickly new vehicles depreciate. Some
            leases include gap automatically, some require it as an add-on, and some leave it optional
            with a strong recommendation. None of this is set by state law the way liability minimums are;
            it&apos;s set by the specific lease or loan contract, so the requirement, deductible cap, and
            whether gap is included all vary by leasing company and lender. This calculator assumes you
            already know your own requirement and simply asks for the resulting premiums.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Comparison Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator adds your entered full coverage premium and gap insurance premium together to
            get an annual cost for the leased or financed scenario, then multiplies that by your term in
            years to get a total. Separately, it multiplies your entered liability-only premium by the
            same number of years to get a total for the owned, paid-off scenario. The difference between
            those two totals is the number the calculator leads with: what the required coverage costs you,
            in total dollars, over the exact period you&apos;d be carrying it. Because both totals use the same
            term length, the comparison isolates the coverage difference itself rather than mixing in any
            difference in how long you&apos;d hold the vehicle under each path.
          </p>

          <AdInArticle slot="tool-lease-vs-buy-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a driver is comparing a 3-year lease against buying the same model outright. Their leasing
            company quotes require full coverage, and their insurer prices that portion at $1,400 a year,
            with a separate $150-a-year gap policy required by the lease. That&apos;s $1,550 a year, or $4,650
            over the 3-year term. For comparison, the same insurer quotes $650 a year for liability-only
            coverage on a paid-off version of the same vehicle, which comes to $1,950 over 3 years. The
            insurance cost difference is $2,700 over the lease term, or $900 a year, for the coverage the
            lease requires. That figure doesn&apos;t tell the driver whether leasing or buying is the better
            overall choice; it tells them precisely what the insurance side of that decision costs, which
            they can then weigh against the payment, depreciation, and mileage terms that this tool
            doesn&apos;t touch.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A frequent mistake is comparing a full-coverage lease quote against a full-coverage purchase
            quote, which erases the actual variable this tool is meant to isolate; the fair comparison is
            required coverage on the leased or financed vehicle against the coverage an owner would
            actually choose once it&apos;s paid off. Another is forgetting gap insurance entirely when it&apos;s
            bundled into a lease payment rather than billed as a separate line item, which understates the
            leased scenario&apos;s true cost. A third is treating the insurance cost difference as the entire
            lease-vs-buy verdict, when it&apos;s genuinely just one input among several, including ones this
            calculator was never built to model.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator only compares insurance costs. It does not model the vehicle&apos;s purchase price,
            monthly lease or loan payments, interest, depreciation, mileage limits or overage fees, wear
            and tear charges, or resale and trade-in value, all of which matter to a complete lease-vs-buy
            decision. It also assumes your entered premiums stay flat across the term, when in reality
            premiums typically change at each renewal based on claims history, rate changes, and other
            factors outside this tool&apos;s control. It does not know your specific lease or loan contract&apos;s
            required deductible cap or whether your agreement bundles gap insurance automatically. Treat
            the result as one clearly defined data point, not a full financial recommendation, and confirm
            your exact coverage requirement with your leasing company or lender before you buy or change a
            policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Full coverage</strong> — an informal term for carrying collision and comprehensive
              coverage alongside liability, rather than a specific named policy type.
            </li>
            <li>
              <strong>Gap insurance</strong> — covers the difference between what you owe on a loan or
              lease and your vehicle&apos;s actual cash value after a total loss.
            </li>
            <li>
              <strong>Liability-only coverage</strong> — a policy that pays for injury or damage you cause
              to others, but nothing toward repairing or replacing your own vehicle.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how each coverage type works, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on auto coverage types, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down what collision, comprehensive, and gap coverage each actually pay for. Before
            signing a lease or loan, confirm the exact coverage and deductible requirement in your own
            contract, and check your state&apos;s minimum liability requirement with your{" "}
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
            <Link href="/tools/auto" className="text-blue-600 hover:underline">
              Auto insurance calculators
            </Link>{" "}
            category. If you want a broader liability-limit recommendation instead of just this
            insurance-cost comparison, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            sizes a limit to your assets and income. Once you know your numbers here, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to pair with full coverage, and the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the how-much-do-I-need question for other policy types.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the specific coverage and cost
            questions insurance shoppers actually have. Nothing you type is collected or sent anywhere,
            and every result is meant to prepare you for a sharper conversation with a licensed agent, not
            replace one.
          </p>
        </section>
      </div>
    </>
  );
}

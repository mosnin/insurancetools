import type { Metadata } from "next";
import Link from "next/link";
import { GapInsuranceCalculatorTool } from "@/components/tools/GapInsuranceCalculatorTool";
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

const tool = getToolBySlug("gap-insurance-calculator")!;

const TITLE = "Gap Insurance Calculator: Do You Need It? | Insurance Tools";
const DESCRIPTION =
  "This gap insurance calculator tracks your loan balance against your car's depreciating value now, at 6 months, and at payoff, then gives a worth-it verdict.";
const PAGE_URL = `${SITE_URL}/tools/auto/gap-insurance-calculator`;

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
    question: "How is this different from just checking if I'm upside down on my loan today?",
    answer:
      "Checking today's numbers only answers half the question. A loan balance and a vehicle's value depreciate at very different speeds — the balance (roughly) in a straight line, the vehicle geometrically, losing a percentage of what's left each month. That means the gap between them can actually widen for a while even after you've been paying on time, before it eventually shrinks. This calculator projects both forward so you can see whether your gap is about to grow before it closes, not just where it stands right now.",
  },
  {
    question: "Where do I find my actual loan or lease payoff balance?",
    answer:
      "Your payoff balance isn't the same as your latest statement balance — it's the exact amount that would close the loan today, including any interest that's accrued since your last payment. Most lenders and leasing companies post this in your online account under a \"payoff quote\" or similar label, or you can call and request one directly. Using a statement balance instead will make the projection slightly optimistic.",
  },
  {
    question: "Why does the calculator let me change the depreciation rate instead of picking one for me?",
    answer:
      "Depreciation speed varies a lot by make, model, mileage, and vehicle age, and no single number is accurate for every car. Rather than quietly baking in a rate that might be wrong for your vehicle, the slider makes the assumption visible and adjustable. If you know your vehicle depreciates unusually fast (some EVs and luxury models do) or unusually slowly (some trucks and SUVs hold value well), move the slider before trusting the verdict.",
  },
  {
    question: "The tool says my loan pays down in a straight line — is that how my actual loan works?",
    answer:
      "No, and this is the calculator's biggest simplification. Real installment loans use amortization, where early payments are weighted heavily toward interest and the principal balance drops slowly at first, then faster as the loan matures. A straight-line reduction is easier to project without your interest rate and payment schedule, but it tends to understate your real balance in the early months of the loan — which means your actual gap exposure early on could be larger than this tool shows.",
  },
  {
    question: "If the calculator says gap insurance is 'probably not needed,' should I cancel my policy?",
    answer:
      "Not automatically. The verdict is based on the numbers you entered and a couple of modeling assumptions, not a review of your actual policy, loan documents, or state rules. If you're close to the calculator's threshold, financed a low down payment, or aren't confident in your depreciation estimate, it's worth rerunning the numbers with more conservative assumptions or asking your lender or insurance agent before dropping coverage.",
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

export default function GapInsuranceCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Gap Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Don&apos;t just check today&apos;s balance. This gap insurance calculator projects your loan or
            lease balance against your vehicle&apos;s depreciating value over the months ahead, so you can
            see whether the gap is closing, holding steady, or about to get worse.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <GapInsuranceCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-gap-insurance-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Snapshot Isn&apos;t Enough</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most &ldquo;do I need gap insurance&rdquo; advice boils down to a single comparison: is your loan
            balance bigger than your car&apos;s value right now? That&apos;s a reasonable starting point, but it
            misses something important. A car loan or lease balance and a car&apos;s market value don&apos;t
            shrink at the same rate. The balance falls roughly evenly, payment by payment, while the
            vehicle&apos;s value falls faster in percentage terms early on and slower later, since
            depreciation compounds off whatever value is left. Depending on how those two curves line up,
            a driver who&apos;s not upside down today can end up meaningfully upside down six months from
            now, especially in the first year or two of a new loan when depreciation runs hottest. This
            tool is built for buyers, lessees, and refinancers who want to see that whole curve, not just
            a single point on it, before deciding whether a gap policy is worth paying for.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Projection Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You enter four numbers: your current loan or lease payoff balance, your vehicle&apos;s current
            actual cash value, an assumed monthly depreciation rate, and how many months remain on the
            loan. The calculator then walks the clock forward. Your vehicle&apos;s projected value is
            reduced by the depreciation rate compounding each month, the same way a percentage-based
            decline actually behaves, so a 1.5% monthly rate removes 1.5% of whatever value is left, not
            1.5% of the original price. Your loan balance, by contrast, is reduced in a straight line down
            to zero by the month you enter as your payoff date. At every point along that timeline, the
            gap is whatever&apos;s left after subtracting the projected vehicle value from the projected loan
            balance, floored at zero once the vehicle is worth more than what&apos;s owed.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The results panel highlights four numbers: the gap today, the largest gap the projection finds
            anywhere in the remaining term, roughly when that peak occurs, and the month the gap is
            projected to close entirely, if it does within your loan term. A small table below that shows
            the loan balance, vehicle value, and gap at a few checkpoints (now, six months out, twelve
            months out, and payoff) so you can see the shape of the trend rather than a single verdict
            with no context behind it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say you just financed a car with a $24,000 payoff balance, the car&apos;s actual cash value is
            $19,000 the day you drove it off the lot, you&apos;ve left the default 1.5% monthly depreciation
            assumption in place, and you have 48 months left on the loan. Today&apos;s gap is already $5,000,
            since the balance is well above the vehicle&apos;s value. Run the projection forward and the
            picture doesn&apos;t improve quickly at first: at six months, the balance has dropped to roughly
            $21,000 while the vehicle has depreciated to around $17,400, so the gap has only narrowed to
            about $3,600. By twelve months the gap has closed further as the straight-line balance
            reduction starts catching up with the slowing depreciation curve, and by payoff, both figures
            converge toward zero as intended. The peak gap in this example is actually the day-one number,
            which tells you the exposure is front-loaded, and a policy would matter most in the loan&apos;s
            early months, not its later ones.
          </p>

          <AdInArticle slot="tool-gap-insurance-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is using a rough guess of your car&apos;s value instead of an actual
            current appraisal, which skews the entire projection in one direction. A second is entering
            your last statement balance instead of a true payoff quote, understating how much you actually
            owe. A third is assuming the &ldquo;probably not needed&rdquo; verdict is permanent: refinancing,
            rolling negative equity from a trade-in into a new loan, or extending a loan term can all push
            a healthy-looking projection back into gap territory, so it&apos;s worth rerunning the numbers
            any time one of those things changes. A fourth is ignoring the depreciation slider entirely and
            assuming the default rate applies to every vehicle, when in reality some models hold value far
            better or worse than average.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Two simplifications drive this projection, and both are worth understanding before you trust
            the verdict. First, the loan balance is reduced in a straight line to zero, which is not how
            amortized loans actually behave — real loans pay down slowly at first because early payments
            are weighted toward interest, so your true balance in the first year or two is likely higher
            than this tool projects, which understates early-term gap exposure. Second, the depreciation
            rate is a single, constant monthly percentage you choose, when real depreciation is uneven,
            often steeper in the first year and flattening later, and different for every make and model.
            This tool doesn&apos;t know your specific loan&apos;s interest rate, your vehicle&apos;s actual
            depreciation curve, your state&apos;s insurance rules, or your lender&apos;s specific gap coverage
            terms. Treat every number here as a planning estimate to bring into a conversation with your
            lender, dealer, or a licensed insurance agent, not as a guaranteed payout or a substitute for
            an actual amortization schedule.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Gap insurance</strong> — an optional coverage that pays the difference between what
              you owe on a financed or leased vehicle and its actual cash value if it&apos;s totaled or
              stolen and not recovered.
            </li>
            <li>
              <strong>Actual cash value (ACV)</strong> — what a vehicle would sell for today, after
              depreciation, rather than what you paid or what&apos;s left on the loan.
            </li>
            <li>
              <strong>Amortization</strong> — the real schedule by which a loan&apos;s principal balance
              declines over time, weighted toward interest early on; this calculator approximates it with
              a straight line for simplicity, which the results panel and disclaimer both call out.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how gap coverage fits into a standard auto policy, the{" "}
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
            explains what a standard policy does and doesn&apos;t pay for after a total loss. For how
            depreciation and total-loss valuations actually get determined, the{" "}
            <a
              href="https://www.iii.org/article/what-total-loss-my-car"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s guide to total losses
            </a>{" "}
            is a useful primer. Before buying or canceling gap coverage, confirm your state&apos;s specific
            rules with your{" "}
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
            category. If you haven&apos;t sized your liability limits yet, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            covers that alongside its own gap-need check. Once you know your gap exposure, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            help you decide what deductible to carry on the rest of the policy, and if you&apos;re working
            through an actual total-loss claim rather than planning ahead of one, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            are the closer fit.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that model real insurance math instead
            of generic rules of thumb. Every tool runs entirely in your browser, doesn&apos;t require an
            account, and is meant to leave you better prepared for a conversation with a lender, dealer,
            or licensed agent than you were before you opened the page.
          </p>
        </section>
      </div>
    </>
  );
}

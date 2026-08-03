import type { Metadata } from "next";
import Link from "next/link";
import { RentalCarReimbursementTrackerCalculatorTool } from "@/components/tools/RentalCarReimbursementTrackerCalculatorTool";
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

const tool = getToolBySlug("rental-car-reimbursement-tracker-calculator")!;

const TITLE = "Rental Car Reimbursement Tracker | Insurance Tools";
const DESCRIPTION =
  "Use this rental car reimbursement tracker to check how much of your daily and per-claim rental limit is left and how many more days your rental car is covered.";
const PAGE_URL = `${SITE_URL}/tools/claims/rental-car-reimbursement-tracker-calculator`;

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
    question: "Is this the same as the rental reimbursement calculator in the Auto category?",
    answer:
      "No, and the two are built for different moments. The Auto category's rental reimbursement calculator is a pre-purchase sizing tool: it helps someone who doesn't have a claim yet decide what daily and total limits to request when buying or renewing a policy. This tracker is for someone already mid-claim with a rental car in hand, entering the limits their policy already has and the days they've already used, to see what's left. If you haven't filed a claim yet, the Auto category tool is the better starting point.",
  },
  {
    question: "Why do I have both a daily limit and a per-claim limit on the same coverage?",
    answer:
      "Rental reimbursement (also called transportation expense or loss of use coverage) is typically written with two independent caps: a daily rate the policy will pay, and a separate ceiling on the total dollars it will pay across the whole claim. Insurers structure it this way to limit their exposure on both a short, expensive rental and a long, ordinary one. Either cap can be the one that actually limits your payout, which is why this tracker checks both instead of just one.",
  },
  {
    question: "My repair shop keeps pushing back my car's pickup date. How do I know when to worry?",
    answer:
      "Watch the \"days still covered\" figure this tracker gives you, not just the calendar date the shop quotes. If that figure drops to a day or two remaining while the shop still has meaningful work left, that's the moment to call your adjuster about the timeline, ask whether an extension is possible, and start planning for the gap rather than being surprised by it when the rental company or insurer stops paying.",
  },
  {
    question: "What happens once my per-claim limit runs out?",
    answer:
      "Once the total dollars paid under rental reimbursement reach your policy's per-claim limit, further rental days are typically your own responsibility unless your adjuster approves an exception, which isn't guaranteed. Some drivers switch to a cheaper rental car, arrange alternate transportation, or push the shop to prioritize finishing repairs once they see the limit approaching. This tracker flags that point in advance so it isn't a surprise at the rental counter.",
  },
  {
    question: "Can I trust the daily limit and per-claim limit I remember from when I bought the policy?",
    answer:
      "Not without checking. Endorsements, renewals, and policy changes can shift these limits over time, and it's easy to misremember a number from a purchase conversation that happened months or years ago. Your declarations page or your claims adjuster can confirm both figures exactly; entering a guessed number into this tracker will only be as accurate as the guess.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Claims Tools", href: "/tools/claims" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function RentalCarReimbursementTrackerCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Rental Car Reimbursement Tracker
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Already have a rental car under an open claim? Enter your policy&apos;s daily and per-claim
            rental limits along with the days you&apos;ve used so far, and this rental car reimbursement
            tracker shows exactly how much coverage is left and how many more days it lasts.
          </p>
          <LastUpdated category="claims" />
        </div>

        <div className="mt-2">
          <RentalCarReimbursementTrackerCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-rental-car-reimbursement-tracker-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs a Rental Car Reimbursement Tracker
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for a specific moment: your car is in the shop after an accident, you&apos;re
            driving a rental under your policy&apos;s rental reimbursement (sometimes labeled
            transportation expense or loss of use) coverage, and the repair is taking longer than you
            expected. You already know your policy&apos;s limits, or can find them on your declarations
            page, and what you actually want to know is a simple, practical number: how many more days
            can you keep this rental before the coverage runs out. That question is different from
            deciding what limits to buy in the first place, which is a pre-purchase decision the site&apos;s{" "}
            <Link href="/tools/auto/rental-reimbursement-calculator" className="text-blue-600 hover:underline">
              Auto category rental reimbursement calculator
            </Link>{" "}
            is built for. This tracker assumes the coverage already exists and a claim is already open,
            and it tracks usage against the limits you already have rather than recommending new ones.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How Rental Reimbursement&apos;s Two-Part Limit Actually Works
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most rental reimbursement coverage is written with two limits stacked on top of each other,
            not one. The first is a daily rate cap: the maximum your policy pays for each day of rental,
            commonly somewhere in the range of $20 to $50 a day depending on the policy, though the exact
            figure is set by your own contract and this tool never assumes a number for you. The second
            is a per-claim limit: a separate, overall ceiling on the total dollars the coverage pays out
            across the entire claim, regardless of how many days that took to reach. The two limits are
            independent of each other. A generous daily rate does not protect you from a low per-claim
            total, and a high per-claim total does not help if the daily rate is too low to cover an
            actual rental in your area. This tracker checks both at once: it multiplies your daily rate
            by the days you&apos;ve used, caps that running total at your per-claim limit, and reports
            whichever number is actually binding.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Track Your Remaining Days</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Pull your policy&apos;s declarations page or call your adjuster to confirm two numbers: the
            daily rental limit and the per-claim total limit. These are usually printed together, often
            as a pair like &ldquo;$30/900,&rdquo; meaning $30 a day up to $900 total. Then count the days
            since you picked up the rental car through today and enter that as days used. The tracker
            multiplies your daily limit by days used to get the amount already claimed, compares that
            figure against your per-claim total, and converts whatever is left into a plain count of full
            days still covered at your daily rate, plus any partial-day balance too small for one more
            full day. Update the days-used figure every few days while the claim is open; the further a
            repair drags on, the more useful it is to know in advance exactly when the coverage runs dry
            rather than finding out at the rental counter.
          </p>

          <AdInArticle slot="tool-rental-car-reimbursement-tracker-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say your policy has a $30 daily rental limit and a $900 per-claim total limit, and you&apos;ve
            had the rental for 22 days while a parts backorder holds up your repair. At $30 a day, 22 days
            works out to $660 already reimbursed, which is still under the $900 per-claim ceiling, leaving
            $240 remaining. At the same $30 daily rate, $240 covers 8 more full days of rental. If the
            shop tells you the part won&apos;t arrive for another two weeks, that 8-day figure is the exact
            number that tells you it&apos;s time to call your adjuster about the gap, rather than assuming
            the coverage will simply keep paying until repairs are done. Compare that with a driver whose
            daily limit is only $25 but whose per-claim total is $1,500: after the same 22 days, they&apos;ve
            used $550 of that $1,500, leaving $950, or roughly 38 more days at the same daily rate. Same
            style of coverage, very different runway, entirely because of how the two limits combine.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming the daily limit is the only number that matters and never
            checking the per-claim total at all, which means the coverage can run out mid-repair with no
            warning even though the daily rate looked perfectly adequate. A close second is forgetting
            that a long repair timeline compounds quickly against a fixed per-claim ceiling: a shop delay
            that seems minor day to day can consume the remaining balance faster than expected once
            multiplied across a week or two of unplanned extra rental days. A third is waiting until the
            rental company or insurer flags the limit before reacting, instead of tracking the balance
            proactively and raising the timeline with the shop or adjuster while there&apos;s still room to
            plan around it.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tracker assumes your daily rate has stayed constant across the days you&apos;ve used and
            that reimbursement has been applied consistently against both limits, which is the standard
            structure but not universal; some policies apply the caps slightly differently, and some
            insurers pay the rental company directly rather than reimbursing you, which can change how the
            running total is tracked on their end. It does not know your actual claim number, your
            insurer&apos;s specific approval process for extensions, or whether your adjuster has discretion
            to make an exception in your situation. Treat every figure here as a planning estimate to
            bring into a conversation with your adjuster, not as the insurer&apos;s own official balance,
            which only your claims file can confirm with certainty.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Daily rate cap</strong> — the maximum amount your rental reimbursement coverage pays
              for each day of a rental car, regardless of what the rental actually costs.
            </li>
            <li>
              <strong>Per-claim limit</strong> — the separate, overall ceiling on total dollars your
              rental reimbursement coverage pays across one claim, independent of the daily rate cap.
            </li>
            <li>
              <strong>Loss of use coverage</strong> — another common name for rental reimbursement
              coverage, describing what it replaces: your use of your own vehicle while it&apos;s being
              repaired after a covered loss.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on what optional coverages like this fit into a standard auto policy, the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down each part of a typical policy, and{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              the National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on optional auto coverages including rental reimbursement. For
            the claims process itself, the NAIC&apos;s{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              guidance on filing a claim
            </a>{" "}
            covers what to expect from your insurer while a claim is open. If your policy&apos;s rules seem
            to differ from general guidance, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            can clarify what your state requires insurers to disclose.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This tracker is part of the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              Claims calculators
            </Link>{" "}
            category. If you haven&apos;t filed a claim yet and are instead deciding what rental
            reimbursement limits to buy, the{" "}
            <Link href="/tools/auto/rental-reimbursement-calculator" className="text-blue-600 hover:underline">
              Auto category&apos;s rental reimbursement calculator
            </Link>{" "}
            is the better fit. If your car was declared a total loss rather than repaired, the{" "}
            <Link href="/tools/claims/insurance-claim-payout-calculator" className="text-blue-600 hover:underline">
              insurance claim payout calculator
            </Link>{" "}
            estimates that separate settlement figure.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that work through real insurance
            numbers with you, from first policy purchase through an open claim. Nothing you type here is
            collected or sent anywhere; every result is meant to make your next conversation with an
            adjuster or agent more informed, not to replace it.
          </p>
        </section>
      </div>
    </>
  );
}

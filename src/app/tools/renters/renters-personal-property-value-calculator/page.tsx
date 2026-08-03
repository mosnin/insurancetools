import type { Metadata } from "next";
import Link from "next/link";
import { RentersPersonalPropertyValueCalculatorTool } from "@/components/tools/RentersPersonalPropertyValueCalculatorTool";
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

const tool = getToolBySlug("renters-personal-property-value-calculator")!;

const TITLE = "Renters Personal Property Value Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this renters personal property value calculator to itemize your belongings room by room and find the right personal property limit for your policy.";
const PAGE_URL = `${SITE_URL}/tools/renters/renters-personal-property-value-calculator`;

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
    question: "Does this renters personal property value calculator estimate what my belongings are worth?",
    answer:
      "No. It only adds up the values you enter for each item you list — it never guesses a dollar figure on your behalf and it never assumes belongings are worth a percentage of your rent or apartment size. That itemized-only approach is the point: the total is exactly as accurate as the list you build, and nothing about a typical apartment gets assumed for you.",
  },
  {
    question: "How is this different from a renters insurance coverage calculator?",
    answer:
      "A coverage calculator typically works top-down, starting from a rough figure like your total rent or square footage and applying a percentage to estimate a personal property limit. This tool works bottom-up: you list your actual belongings, room by room, and the total is simply the sum of what you entered. Run both if you want a sanity check — a coverage estimate that's wildly different from your itemized total is worth a closer look either way.",
  },
  {
    question: "What does the 'consider scheduling' checkbox next to an item mean?",
    answer:
      "It flags an item you think might exceed what your standard renters policy would pay out for its category. Most renters policies cap certain categories, such as jewelry, watches, furs, firearms, and sometimes electronics or musical instruments, at a special sub-limit that's far lower than your overall personal property limit. Checking the box doesn't change your coverage; it just keeps a running subtotal so you know which items are worth asking your agent about a scheduled personal property endorsement, sometimes called a personal articles floater.",
  },
  {
    question: "What if I don't know exactly what an item is worth today?",
    answer:
      "Use your best realistic estimate of what it would cost to replace the item today, not what you originally paid for it years ago, since prices and depreciation both move over time. A quick search for a similar item currently for sale is usually close enough for planning purposes. This tool can't verify any value you enter, so the more realistic each entry is, the more useful the running total becomes.",
  },
  {
    question: "Do I still need photos or receipts if I already have this itemized list?",
    answer:
      "Yes. This list helps you decide what personal property limit to carry, but it isn't proof of ownership or value on its own. If you ever need to file a claim, your insurer will typically ask for a proof of loss that photos, receipts, serial numbers, or appraisals can support far better than a list alone. Keep this list alongside that documentation rather than instead of it, ideally stored somewhere other than the apartment itself.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Renters Insurance Tools", href: "/tools/renters" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function RentersPersonalPropertyValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Renters Personal Property Value Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Build a real, itemized list of what you own instead of guessing at a round number. Add each
            belonging as you go, watch the total update instantly, and see whether your current policy
            limit actually covers it.
          </p>
          <LastUpdated category="renters" />
        </div>

        <div className="mt-2">
          <RentersPersonalPropertyValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-renters-personal-property-value-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why an Itemized List Beats a Rule-of-Thumb Estimate
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Plenty of renters insurance guidance starts from a shortcut: take your rent, your square
            footage, or a flat percentage of a homeowner&apos;s dwelling coverage and call that your personal
            property limit. The problem is that shortcut has no idea what&apos;s actually in your apartment. A
            renter who works from home with two monitors and a standing desk owns a meaningfully different
            set of belongings than a renter who mostly lives out of a gym bag and a mattress, even if they
            pay identical rent in the same building. This renters personal property value calculator skips
            the shortcut entirely. You add what you actually own, one line at a time, and the total is
            never anything more or less than the sum of those entries. It&apos;s slower than typing in your
            rent and getting an instant number, but the number it produces is one you can actually defend
            when you&apos;re deciding how much coverage to buy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Tool Is For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is built for a renter who is about to buy a policy and doesn&apos;t want to guess at a limit,
            or a renter who already has a policy and wants to check whether the limit on it still matches
            reality. It&apos;s also useful right after a move, a big purchase, or simply the first time you&apos;ve
            sat down and actually thought about what a full loss, like a fire or a burst pipe upstairs,
            would mean for everything you own. If you&apos;re comparing quotes, bring the suggested limit this
            tool produces into that conversation instead of accepting whatever limit a quote form defaults
            to.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Build Your List Efficiently</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Work room by room instead of trying to remember everything from memory in one sitting.
            Bedroom, living room, kitchen, closets, and any storage area each tend to surface items the
            others don&apos;t. Open drawers and closets rather than only counting what&apos;s in plain sight —
            clothing, shoes, and linens rarely feel individually valuable but add up fast as a category.
            For anything with real resale value, jewelry, electronics, a bike, sports equipment, take a
            quick photo and note the value while you&apos;re already looking at it, rather than planning to
            come back later. That habit does double duty: it fills in this calculator faster, and it
            leaves you with exactly the kind of documentation an insurer expects to see if you ever need
            to file a proof of loss.
          </p>

          <AdInArticle slot="tool-renters-personal-property-value-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a one-bedroom apartment where the renter lists a bed frame and mattress at $900, a
            couch at $600, a television at $450, a laptop at $1,200, a work monitor and desk setup at
            $500, a bike at $350, roughly $800 of clothing and shoes across several rows, $400 of
            cookware and small kitchen appliances, and a grandmother&apos;s ring worth $2,500 that they flag as
            worth scheduling. The itemized total comes out to $7,700. The calculator suggests requesting an
            $8,000 personal property limit, rounding the raw total up to a cleaner number. If their current
            policy only carries a $5,000 limit, the comparison panel flags a $2,700 shortfall immediately —
            a gap that&apos;s easy to miss when a limit was chosen years ago and never revisited, but obvious
            once every belonging is actually on the list.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes to Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is forgetting the handful of items that are worth far more than
            everything else combined, jewelry, a musical instrument, a high-end camera, or a collectible,
            and letting them blend into the general total instead of flagging them for a closer look.
            Standard renters policies routinely cap what they&apos;ll pay for those specific categories, so an
            item can be fully counted in your total and still be underinsured on its own. A second common
            mistake is treating this list as a one-time project. A single large purchase, a holiday&apos;s worth
            of gifts, or a move that adds furniture can shift your real total meaningfully, and a list built
            two years ago stops reflecting what a claim would actually need to replace. Revisit it after any
            purchase that would have changed the total by a noticeable amount.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes every value you enter is a reasonable estimate of what that item would
            cost to replace today, and it has no way to verify any of them. It doesn&apos;t know your specific
            policy&apos;s wording, whether your coverage is written at replacement cost or actual cash value, or
            what your insurer&apos;s exact sub-limits are for categories like jewelry or electronics — those
            figures vary by insurer and by state. The suggested limit is a rounding convention applied to
            your own itemized total, not a recommendation that any particular dollar amount is correct or
            sufficient for your situation. Treat this list as preparation for a conversation with a
            licensed insurance agent, not as a substitute for reading your actual policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Renters Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Scheduled personal property</strong> — a separate endorsement, sometimes called a
              personal articles floater, that insures a specific high-value item at its own agreed or
              appraised amount instead of leaving it subject to your policy&apos;s general sub-limits.
            </li>
            <li>
              <strong>Replacement cost</strong> — what it would cost to buy a new equivalent item today, as
              opposed to what the item is worth used, right now, after wear and depreciation.
            </li>
            <li>
              <strong>Proof of loss</strong> — the documentation, typically including an itemized list,
              receipts, and photos, that an insurer requires before paying out a claim for damaged, lost, or
              stolen belongings.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For more on how personal property coverage works on a renters policy, the{" "}
            <a
              href="https://www.iii.org/article/renters-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language breakdown of what&apos;s typically covered. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            maintains consumer guidance on coverage types including scheduled personal property, and its
            page on{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              filing a claim
            </a>{" "}
            explains what a proof of loss generally involves. To confirm your policy&apos;s exact limits and any
            state-specific rules, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            can point you to a licensed agent or your insurer directly.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              Renters insurance tools
            </Link>{" "}
            category. If you&apos;d rather start from a quick top-down estimate before itemizing everything,
            the{" "}
            <Link href="/tools/renters/renters-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              renters insurance coverage calculator
            </Link>{" "}
            is the faster starting point. Splitting a shared apartment&apos;s coverage with roommates is a
            separate question the{" "}
            <Link href="/tools/renters/roommate-renters-insurance-split-calculator" className="text-blue-600 hover:underline">
              roommate renters insurance split calculator
            </Link>{" "}
            is built to handle.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that help people make sense of
            coverage, costs, and claims without a sales pitch attached. Every tool in this library runs
            entirely on your device, keeps whatever you type to yourself, and is meant to leave you better
            prepared the next time you talk to a licensed agent.
          </p>
        </section>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ScheduledJewelryCoverageCalculatorTool } from "@/components/tools/ScheduledJewelryCoverageCalculatorTool";
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

const tool = getToolBySlug("scheduled-jewelry-coverage-calculator")!;

const TITLE = "Scheduled Jewelry Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Try this scheduled jewelry coverage calculator to list your rings, watches, and heirlooms, compare the total to your policy's sublimit, and see the exact gap.";
const PAGE_URL = `${SITE_URL}/tools/home/scheduled-jewelry-coverage-calculator`;

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
    question: "Do I need a jewelry floater if I already have homeowners or renters insurance?",
    answer:
      "Possibly, depending on what your jewelry is worth. Standard homeowners and renters policies do cover jewelry against named perils like fire and theft, but almost always through a special sublimit buried inside the personal property section, one that's typically far lower than what a household's rings and watches actually add up to. A floater (also called a rider or scheduling an item) removes specific pieces from that shared sublimit and insures each one individually, usually with broader coverage for accidental loss and no deductible.",
  },
  {
    question: "How do I find my policy's actual jewelry sublimit instead of guessing?",
    answer:
      "Look at your homeowners or renters declarations page for a section usually labeled 'special limits of liability' or 'special limits on certain property.' Jewelry, watches, and furs are almost always listed by name with a specific dollar figure for theft, separate from the general personal property limit. If you can't find it, your agent or insurer's customer service line can read it to you in a two-minute call. This calculator can't look that number up for you because it varies by insurer, state, and even by policy edition.",
  },
  {
    question: "Why does one expensive item matter even if my total jewelry value is under the sublimit?",
    answer:
      "Because a jewelry sublimit is a cap on the whole category, not a per-item allowance that stacks. If your policy caps jewelry theft at $1,500 and a single ring is worth $4,000, a claim on that ring alone is still capped near the category sublimit; the other jewelry you own doesn't lend it headroom. That's why this calculator flags any single item over your entered sublimit separately from the aggregate gap, since that item needs its own rider regardless of what else you own.",
  },
  {
    question: "Does scheduling jewelry always mean I need a professional appraisal?",
    answer:
      "Often for higher-value pieces, yes. Most insurers require a recent written appraisal, a jeweler's replacement estimate, or a purchase receipt with photos before adding an item to a floater, particularly above a few thousand dollars. Lower-value pieces sometimes qualify with just a receipt. Ask your agent what documentation your specific insurer requires before you schedule anything, since requirements differ by company.",
  },
  {
    question: "Is a jewelry floater expensive to add to a policy?",
    answer:
      "It's usually inexpensive relative to the value it protects, commonly cited in the range of roughly 1 to 2 percent of an item's appraised value per year, though the exact rate depends on your insurer, the item's value, your location, and any security measures like a home safe. Ask a licensed agent for an exact quote once you know which items you want scheduled; this calculator only tells you which items are worth asking about.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Home Calculators", href: "/tools/home" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function ScheduledJewelryCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Scheduled Jewelry Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            List your rings, watches, and heirlooms, enter your policy&apos;s jewelry sublimit, and this
            scheduled jewelry coverage calculator shows exactly how much value would need its own floater.
            Free, instant, and nothing you type leaves your browser.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <ScheduledJewelryCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-jewelry-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Needs to Run This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            If you own an engagement ring, a family heirloom, a nice watch, or anything you&apos;d call a
            valuable rather than just an accessory, this tool is for you. It&apos;s especially useful right
            after an engagement, a wedding, an inheritance, or any point where jewelry has quietly
            accumulated in a drawer without anyone updating the insurance that&apos;s supposed to protect it.
            Most people assume homeowners or renters insurance already covers their jewelry at full value
            because the policy technically covers &ldquo;personal property.&rdquo; It does, but almost always
            through a much smaller special limit that most policyholders never read until after a claim
            gets denied or capped.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What a Scheduled Personal Property Floater Actually Does
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A standard homeowners or renters policy treats jewelry as one line item inside &ldquo;unscheduled
            personal property,&rdquo; the broad category that also covers your furniture, electronics, and
            clothing. Buried inside that section is a special limit, sometimes called a sublimit, that caps
            how much the insurer will pay for theft or mysterious disappearance of jewelry specifically,
            regardless of how much your total personal property coverage is. Many policies default to a
            modest sublimit somewhere in the general range of $1,000 to $2,500, though this varies by
            insurer, state, and policy form &mdash; yours may be higher or lower, so check your own
            declarations page rather than assuming. Scheduling an item, also called adding a jewelry
            floater or rider, moves a specific piece off that shared sublimit and insures it individually,
            typically at its full appraised value, often with broader &ldquo;all risk&rdquo; coverage that
            includes accidental loss (like a ring slipping off in a pool) rather than only the named perils
            a standard policy covers.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The gap catches people off guard because it&apos;s invisible until a claim happens. A policyholder
            can pay premiums for years believing a $10,000 collection of jewelry is fully covered, only to
            learn during a burglary claim that the policy caps the payout at a fraction of that. The
            sublimit isn&apos;t hidden exactly, but it lives in a section of the declarations page that most
            people never read closely, which is exactly why comparing your own items against your own
            sublimit, rather than relying on a rule of thumb, matters.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Calculator Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Add each valuable item you want to check, giving it a name and an estimated current value, then
            enter your policy&apos;s jewelry theft/loss sublimit from your declarations page. The calculator
            sums every item you&apos;ve entered into a total items value, then subtracts your sublimit from
            that total. If the total is higher than your sublimit, the difference is the amount likely
            needing a floater, the portion of your jewelry that a standard claim probably wouldn&apos;t fully
            pay out today. Separately, the calculator checks each item individually against the sublimit,
            because a single expensive piece that exceeds the sublimit on its own needs its own rider
            regardless of what your total looks like &mdash; insurers generally won&apos;t let unused sublimit
            capacity from other items cover one large loss.
          </p>

          <AdInArticle slot="tool-jewelry-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a household enters four items: a $6,000 engagement ring, a $2,500 watch, a $1,200 necklace
            inherited from a grandparent, and a $900 pair of earrings, for a total items value of $10,600.
            Their declarations page lists a $1,500 jewelry theft sublimit. The calculator subtracts $1,500
            from $10,600 and returns $9,100 as the amount likely needing a floater, roughly 507% above the
            sublimit. It also flags the engagement ring and the watch individually, since $6,000 and $2,500
            each exceed the $1,500 sublimit on their own; the necklace and earrings don&apos;t trigger the
            individual flag, but they still contribute to the aggregate gap. That household&apos;s realistic
            next step is scheduling the ring and the watch at minimum, and considering whether the necklace
            and earrings are also worth adding given how little headroom the shared sublimit leaves.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming &ldquo;I have homeowners insurance&rdquo; is the same statement as
            &ldquo;my jewelry is fully covered,&rdquo; without ever checking the special limits section of the
            declarations page. A second is scheduling one obvious item, like an engagement ring right after
            a wedding, and forgetting that other pieces (an inherited watch, a family necklace) are still
            sitting exposed under the same thin sublimit. A third is using an outdated appraisal or purchase
            price instead of current replacement value, especially for items bought years ago when gold and
            diamond prices were meaningfully different than they are today.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the values you enter reflect current replacement cost, not original
            purchase price or sentimental value, and it takes your entered sublimit at face value rather
            than looking up your actual policy, which it has no access to. It doesn&apos;t know whether your
            specific insurer requires an appraisal to schedule an item, what your floater premium would
            cost, whether your state imposes any specific rules on valuable-item coverage, or whether your
            policy uses &ldquo;actual cash value&rdquo; or &ldquo;replacement cost&rdquo; language for jewelry claims, all of
            which can change the real-world payout. Treat the result as a starting point for a conversation
            with a licensed insurance agent and, where needed, a professional appraiser, not as a
            coverage decision on its own.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Sublimit (special limit)</strong> &mdash; a cap within a broader coverage category, here
              limiting how much a policy pays for jewelry theft or loss regardless of the overall personal
              property limit.
            </li>
            <li>
              <strong>Scheduled personal property / floater / rider</strong> &mdash; an endorsement that adds a
              specific item to a policy at its own appraised value, typically with broader coverage and no
              deductible, separate from the shared sublimit.
            </li>
            <li>
              <strong>Mysterious disappearance</strong> &mdash; a loss with no clear explanation, such as
              noticing a ring is simply gone, which standard policies often exclude but scheduled floaters
              commonly include.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For background on how personal property coverage and special limits fit into a standard
            homeowners policy, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language overview, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            maintains consumer guidance covering how coverage types and endorsements generally work. The{" "}
            <a
              href="https://content.naic.org/consumer/renters-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NAIC&apos;s renters insurance guidance
            </a>{" "}
            covers the same sublimit issue for renters policies specifically. Before scheduling any item,
            confirm your insurer&apos;s exact appraisal and documentation requirements with a{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              licensed agent in your state
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator sits in the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category, alongside the tools that help you size your broader{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage
            </Link>{" "}
            beyond jewelry specifically. If a piece is ever lost, damaged, or stolen, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            can help you think through what a settlement should look like once you&apos;re actually filing.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the coverage questions that don&apos;t
            have a simple answer on a rate page, including how much of your own belongings a standard
            policy quietly caps. Every tool runs entirely on your device and asks for nothing beyond the
            numbers you choose to type in.
          </p>
        </section>
      </div>
    </>
  );
}

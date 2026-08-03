import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { PersonalPropertyCoverageCalculatorTool } from "@/components/tools/PersonalPropertyCoverageCalculatorTool";
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
  slug: "personal-property-coverage-calculator",
  name: "Personal Property Coverage Calculator",
  description:
    "Add up what your belongings would cost to replace by category, then see how that total compares to the illustrative default personal property limit many homeowners policies set.",
  category: "Home",
  categorySlug: "home",
  keywords: [
    "personal property coverage calculator",
    "how much personal property coverage do i need",
    "home contents coverage calculator",
    "personal property insurance estimate",
    "homeowners contents value calculator",
  ],
  relatedTools: [],
};

const TITLE = "Personal Property Coverage Calculator for Homeowners | Insurance Tools";
const DESCRIPTION =
  "Use this personal property coverage calculator to total your belongings by category and see how it compares to a policy's typical default coverage limit.";
const PAGE_URL = `${SITE_URL}/tools/home/personal-property-coverage-calculator`;

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
    question: "Is the 50-70% default range this calculator shows a guarantee of my actual coverage?",
    answer:
      "No. It's an illustrative range that many homeowners policies use as a starting point for Coverage C (personal property), commonly set somewhere between 50% and 70% of the Coverage A dwelling limit. Insurers and states vary, some policies default higher or lower, and yours may have been adjusted when you bought the policy. Your actual personal property limit is printed on your declarations page, and that number is the one that governs a real claim, not this illustrative range.",
  },
  {
    question: "Why would my belongings be worth more than the illustrative default suggests?",
    answer:
      "The default percentage is set as a rough average across many households, not measured against what you specifically own. Households with more electronics, a home office, higher-end furniture, or simply more years of accumulated belongings often add up to more than a generic percentage of dwelling coverage would predict, since the dwelling limit reflects rebuilding costs for the structure, not the volume or value of what's inside it.",
  },
  {
    question: "Does this calculator account for special limits on jewelry, art, or collectibles?",
    answer:
      "No. Standard homeowners and renters policies typically cap coverage for categories like jewelry, watches, firearms, and collectibles far below their replacement cost unless you add a scheduled personal property endorsement or rider. If any single item or category is worth a meaningful amount, this calculator's category totals won't reflect the sub-limit that would actually apply in a claim, so it's worth asking your agent about scheduling those items separately.",
  },
  {
    question: "Should I use replacement cost or what I originally paid for each category?",
    answer:
      "Use what it would cost to replace the items today, not what you paid when you bought them. Most homeowners policies pay out on either an actual cash value basis (replacement cost minus depreciation) or a replacement cost basis, depending on the policy, but either way, entering your original purchase prices will usually understate current replacement cost, especially for older furniture and appliances.",
  },
  {
    question: "What should I do if my estimated total is above the illustrative default range?",
    answer:
      "Check your declarations page to confirm your actual personal property limit rather than assuming it matches the illustrative range. If your real limit is lower than your estimated belongings value, ask your agent about increasing Coverage C, since being underinsured on personal property means a major loss like a fire or theft could leave a meaningful gap between what you lose and what the policy pays.",
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

export default function PersonalPropertyCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Personal Property Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Add up what it would actually cost to replace your belongings, category by category, and see
            how that number stacks up against the illustrative default many homeowners policies fall back
            on. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <PersonalPropertyCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-personal-property-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs a Personal Property Coverage Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Most homeowners never actually calculate what their belongings are worth. They buy a policy,
            skim the declarations page for the dwelling number because that&apos;s the figure tied to their
            mortgage, and never look closely at the personal property line underneath it. That&apos;s fine
            right up until a fire, burglary, or burst pipe destroys a room full of furniture, electronics,
            and clothing all at once, and the payout turns out to be smaller than the replacement bill.
            This tool is built for the homeowner who wants to check that number before a loss happens, not
            after, whether you&apos;re shopping for a new policy, reviewing one at renewal, or simply curious
            whether years of accumulated belongings have quietly outgrown the coverage a policy defaulted
            you into when you first signed up.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why the Default Percentage Often Falls Short
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Insurers commonly set Coverage C, the personal property portion of a homeowners policy, as a
            percentage of Coverage A, the dwelling limit, often somewhere in the range of 50% to 70%. That
            shortcut exists because pricing a policy is faster when personal property coverage is derived
            from a number the insurer already has to calculate anyway. The problem is that the dwelling
            limit reflects what it would cost to rebuild the structure itself, which has almost nothing to
            do with how much stuff is inside it. A household that has lived in the same home for fifteen
            years, works from home with a full office setup, or simply owns more than the statistical
            average will often own more in belongings than a flat percentage of the rebuild cost would
            predict, while a newer homeowner with sparse furnishings might actually be carrying more
            personal property coverage than they need. The only way to know which situation applies to you
            is to add up what you actually own, which is exactly what this calculator does.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Calculator Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Rather than asking you to inventory every item you own, the calculator uses a room-by-room,
            top-down approach: you enter one rough total for each of six broad categories &mdash; furniture,
            electronics, clothing, appliances, kitchenware and housewares, and everything else &mdash; based on
            what it would cost to replace that category today, not what you originally paid for it. The
            calculator adds those six numbers into a single estimated personal property value. Separately,
            you enter your current Coverage A dwelling limit, which the calculator multiplies by 50% and by
            70% to show the illustrative range many policies default to. Placing your estimated total next
            to that range makes it immediately visible whether your actual belongings are within the range
            a typical policy assumes, above it, or comfortably below it, without requiring a full line-item
            inventory to get a useful directional answer.
          </p>

          <AdInArticle slot="tool-personal-property-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a couple who bought their home eight years ago and insures the structure for
            $300,000 in dwelling coverage. Under the illustrative 50-70% range, their policy&apos;s personal
            property default would land somewhere between $150,000 and $210,000. When they actually total
            their belongings &mdash; $14,000 in furniture accumulated over two furniture sets, $9,000 in
            electronics including a home office setup and gaming equipment, $6,000 in clothing for a family
            of four, $5,000 in appliances they&apos;ve bought over the years, $4,000 in kitchenware, and $6,500
            in miscellaneous items like tools and hobby gear &mdash; their estimated total comes to $44,500. In
            this case, they&apos;re carrying far more personal property coverage than they&apos;d likely ever need,
            which might be worth a conversation with their agent about whether that premium dollar would do
            more work elsewhere, such as a higher liability limit or an umbrella policy. A different
            household with a home office full of professional equipment, a large wardrobe collection, and
            higher-end furniture could just as easily land above the range instead, which is the scenario
            where being underinsured actually becomes a real risk.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is never checking the personal property number at all, since it sits
            below the dwelling limit on a declarations page and rarely gets a second look after the policy
            is bound. A close second is estimating belongings at original purchase price instead of current
            replacement cost, which tends to understate electronics and furniture that have gone up in
            price since they were bought. A third is forgetting that standard policies cap categories like
            jewelry, firearms, and collectibles well below their real value, so a household with a few
            expensive items can pass this calculator&apos;s category totals while still being badly underinsured
            on those specific items unless they&apos;re scheduled separately.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the 50-70% illustrative range is a reasonable reference point for how
            some homeowners policies set a personal property default, which is a commonly cited industry
            figure but not a universal rule; your insurer&apos;s actual percentage, and your policy&apos;s real
            personal property limit, may be different and are only found on your own declarations page. It
            does not know whether your policy pays claims on a replacement cost or actual cash value basis,
            does not apply the special sub-limits that typically cap categories like jewelry or firearms,
            and does not account for scheduled endorsements you may already have in place. Treat the output
            as a planning estimate to bring into a conversation with a licensed insurance agent, not as a
            substitute for reviewing your actual policy documents.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Coverage A (dwelling coverage)</strong> &mdash; the portion of a homeowners policy that
              pays to rebuild the physical structure of the home itself.
            </li>
            <li>
              <strong>Coverage C (personal property coverage)</strong> &mdash; the portion of a homeowners
              policy that pays to repair or replace belongings inside the home, such as furniture,
              electronics, and clothing.
            </li>
            <li>
              <strong>Scheduled personal property</strong> &mdash; an endorsement added to a policy that
              provides higher, item-specific coverage for valuables like jewelry or collectibles that would
              otherwise fall under a standard category sub-limit.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For more on how dwelling and personal property coverage fit together, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes an overview of standard homeowners coverage parts, and the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            maintains consumer guidance on coverage types and definitions. For help documenting what you
            own, the{" "}
            <a
              href="https://www.iii.org/article/how-to-create-a-home-inventory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s home inventory guide
            </a>{" "}
            outlines a more detailed, item-level approach than this calculator&apos;s category totals. Before
            changing coverage, confirm your exact policy terms with your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            or a licensed agent.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. For the broader how-much-coverage-do-I-need question across other policy types, see
            the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>
            . Renting rather than owning? The same room-by-room question applies to a{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              renters insurance policy&apos;s
            </Link>{" "}
            personal property limit, just without a dwelling coverage figure to compare against.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that help homeowners and renters
            understand coverage, costs, and claims without a sales pitch attached. Nothing you type into
            this calculator leaves your browser, and every tool is designed to leave you better prepared
            for a real conversation with your agent, not to replace one.
          </p>
        </section>
      </div>
    </>
  );
}

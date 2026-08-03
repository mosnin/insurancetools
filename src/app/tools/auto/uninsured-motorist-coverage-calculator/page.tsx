import type { Metadata } from "next";
import Link from "next/link";
import { UninsuredMotoristCoverageCalculatorTool } from "@/components/tools/UninsuredMotoristCoverageCalculatorTool";
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

const tool = getToolBySlug("uninsured-motorist-coverage-calculator")!;

const TITLE = "Uninsured Motorist Coverage Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this uninsured motorist coverage calculator to size a UM/UIM limit that matches your own liability coverage, then compare it against what you carry now.";
const PAGE_URL = `${SITE_URL}/tools/auto/uninsured-motorist-coverage-calculator`;

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
    question: "What's the actual difference between uninsured and underinsured motorist coverage?",
    answer:
      "Uninsured motorist (UM) coverage pays when the at-fault driver carries no liability insurance at all, including most hit-and-run accidents where no other policy can be identified. Underinsured motorist (UIM) coverage pays when the at-fault driver does have insurance, but their liability limit is too low to cover your medical bills, lost income, or other damages. Most policies bundle both under a single UM/UIM limit, which is the number this calculator estimates.",
  },
  {
    question: "Why would this calculator recommend a UM/UIM limit above my state's minimum?",
    answer:
      "Because state minimums are a legal floor, not a safety target, and many states set UM/UIM minimums at the same low level as their bodily injury liability minimum. This calculator uses the mirroring method instead: it recommends matching your own bodily injury liability limit, on the reasoning that you shouldn't be less protected from an underinsured driver than you're required to protect other people. Your state's exact minimum and any opt-out rules are worth confirming with your state's Department of Insurance before you buy.",
  },
  {
    question: "Does UM/UIM coverage pay for damage to my car, or only injuries?",
    answer:
      "In most states, bodily injury UM/UIM coverage pays for medical bills, lost income, and pain and suffering from injuries the at-fault driver caused, not vehicle damage. Some states offer a separate uninsured motorist property damage (UMPD) coverage or rely on your own collision coverage to repair your car after a hit by an uninsured driver. This calculator focuses on the bodily injury side, since that's where the mirroring method against your liability limits applies most directly.",
  },
  {
    question: "Where does the hypothetical serious-accident cost number in this tool come from?",
    answer:
      "It's a placeholder you're meant to adjust, not a statistic about a real accident or a typical claim. Serious injury costs vary enormously by the type of injury, whether surgery or long-term care is involved, and how much income is lost during recovery, so the tool starts with a round illustrative figure and lets you change it to model your own situation or a scenario a claims professional has described to you.",
  },
  {
    question: "Is uninsured motorist coverage worth paying extra for if I already have health insurance?",
    answer:
      "Health insurance typically covers your medical treatment regardless of fault, but it generally doesn't cover lost income, pain and suffering, or costs your health plan excludes, and it may seek reimbursement from any settlement you receive. UM/UIM coverage is designed to fill exactly those gaps when the at-fault driver can't pay. Whether the added premium is worth it for your situation is a question worth bringing to a licensed insurance agent alongside the numbers this calculator gives you.",
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

export default function UninsuredMotoristCoverageCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Uninsured Motorist Coverage Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Find a UM/UIM limit sized to your own liability coverage, then see the dollar gap between
            what you carry today and what a serious accident with an uninsured driver could actually
            cost you.
          </p>
          <LastUpdated category="auto" />
        </div>

        <div className="mt-2">
          <UninsuredMotoristCoverageCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-um-coverage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What Uninsured Motorist Coverage Actually Covers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Every other calculator on this site helps you figure out what you owe someone else after an
            accident. This one runs the question in reverse: what happens when the other driver is the
            one who can&apos;t pay? Uninsured motorist coverage steps in when the at-fault driver carries no
            liability insurance, and underinsured motorist coverage steps in when they have insurance but
            not enough of it to cover what you&apos;re owed. Industry estimates of how common this is vary by
            state and by year, but the figure is commonly cited to be in the range of roughly one in eight
            drivers nationally carrying no insurance at all, and a further share carrying only their
            state&apos;s bare minimum liability limit, which can be exhausted quickly in a serious injury
            claim. If either of those drivers hits you, your own UM/UIM coverage, not theirs, is what pays.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How This Calculator Picks a Recommended Limit</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator uses the mirroring method that insurance educators commonly recommend: set
            your UM/UIM limit equal to your own bodily injury liability limit. The logic is symmetrical.
            You&apos;re required to carry enough liability coverage to pay for injuries you cause to someone
            else, so it follows that you deserve at least that same level of protection when someone else
            injures you and can&apos;t pay. The tool takes the per-person and per-accident bodily injury
            limits you enter, applies a modest floor so a very low or blank entry doesn&apos;t produce an
            unrealistic $0 recommendation, and mirrors those numbers back as your recommended UM/UIM
            limit. It then compares that recommendation against what you say you currently carry, and
            separately against a hypothetical accident cost you can edit, so you can see both a coverage
            gap in limit terms and a shortfall in dollar terms.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            These are two different questions worth keeping separate. The coverage gap compares limit to
            limit: is your UM/UIM number as high as your liability number? The shortfall compares limit to
            a real-world cost estimate: if a serious accident actually happened, would your current limit
            be enough? A driver can have no coverage gap at all under the mirroring method and still face
            a shortfall, if their liability limit itself was set too low to begin with.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a driver carrying 50/100 bodily injury liability ($50,000 per person, $100,000 per
            accident), a common but modest limit, with a UM/UIM limit still sitting at their state&apos;s
            $25,000 per-person minimum from when they first bought the policy. The mirroring method
            recommends raising UM/UIM to $50,000 per person and $100,000 per accident to match the
            liability side, a $25,000 coverage gap at today&apos;s limit. Now suppose this driver enters a
            hypothetical serious-accident cost of $150,000, reflecting a broken bone requiring surgery
            plus a few months of lost income. Against their current $25,000 UM/UIM limit, that leaves an
            estimated $125,000 shortfall, a considerably larger number than the coverage gap alone, and
            one that shows why raising the liability limit itself, not just the UM/UIM limit, is often
            part of the same conversation.
          </p>

          <AdInArticle slot="tool-um-coverage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes With UM/UIM Coverage</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is never revisiting UM/UIM after the first policy purchase, so it
            quietly stays at a state-minimum number for years while liability limits get raised. A second
            is assuming health insurance makes UM/UIM unnecessary, when health plans typically don&apos;t
            cover lost income or pain and suffering and can seek reimbursement from any settlement you
            later receive. A third is declining UM/UIM entirely to save a relatively small amount on
            premium, in states where that&apos;s allowed, without weighing that decision against how many
            underinsured drivers share the road. A fourth is confusing UM/UIM bodily injury coverage with
            coverage for damage to your own vehicle, which in many states is a separate line item or
            relies on collision coverage instead.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the mirroring method, matching UM/UIM to your bodily injury liability
            limit, is a reasonable starting point, which is a widely used approach among insurance
            educators but not a universal rule every advisor applies the same way. It does not know your
            state&apos;s actual UM/UIM minimum, whether your state requires UM/UIM at all or allows you to
            reject it in writing, whether your state stacks coverage across multiple vehicles, or how your
            specific insurer defines and settles UM/UIM claims. The hypothetical accident cost field is an
            illustrative placeholder for you to adjust, not a real statistic drawn from claims data, and
            actual settlement amounts depend on the specific injury, medical treatment, and negotiation
            involved. Treat every figure here as a starting point for a conversation with a licensed
            insurance agent, not as a final number.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Uninsured motorist (UM) coverage</strong> — pays for your injuries when the at-fault
              driver carries no liability insurance, including most hit-and-run accidents.
            </li>
            <li>
              <strong>Underinsured motorist (UIM) coverage</strong> — pays for your injuries when the
              at-fault driver has liability insurance, but not enough to cover what you&apos;re owed.
            </li>
            <li>
              <strong>Bodily injury liability</strong> — the coverage that pays for injuries you cause to
              other people; this calculator uses your own limit as the basis for its UM/UIM recommendation.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For consumer-facing definitions of UM/UIM and other auto coverage types, the{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes guidance built for policyholders, and the{" "}
            <a
              href="https://www.iii.org/article/what-does-my-personal-auto-policy-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            breaks down how UM/UIM fits alongside the other parts of a standard auto policy. The NAIC also
            maintains a broader glossary of{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              consumer insurance terms
            </a>{" "}
            if you run into unfamiliar language elsewhere on a policy. Before buying or changing UM/UIM
            coverage, confirm your exact state&apos;s rules, including whether it&apos;s mandatory and whether it
            stacks across vehicles, with your{" "}
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
            category. If you haven&apos;t sized your own liability limit yet, start with the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            first, since this tool&apos;s recommendation is built directly on top of that number. The{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            cover the same how-much-do-I-need question for other policy types, and if you&apos;re working
            through an actual claim rather than planning ahead of one, the{" "}
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
            Insurance Tools builds free, browser-based calculators that help you understand coverage,
            costs, and claims before you talk to an agent, not after. Every tool runs entirely in your
            browser, keeps whatever numbers you enter to yourself, and aims to leave you with a specific
            figure to bring into that conversation rather than a generic rule of thumb.
          </p>
        </section>
      </div>
    </>
  );
}

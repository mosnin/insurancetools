import type { Metadata } from "next";
import Link from "next/link";
import { UmbrellaPolicyNeedCalculatorTool } from "@/components/tools/UmbrellaPolicyNeedCalculatorTool";
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

const tool = getToolBySlug("umbrella-policy-need-calculator")!;

const TITLE = "Umbrella Policy Need Calculator | Insurance Tools";
const DESCRIPTION =
  "This umbrella policy need calculator sizes your suggested umbrella limit to your net worth and income, then flags gaps in your auto and home liability limits.";
const PAGE_URL = `${SITE_URL}/tools/coverage/umbrella-policy-need-calculator`;

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
    question: "Do I actually need an umbrella insurance policy?",
    answer:
      "It's worth serious consideration once your net worth and future income add up to more than your auto and home (or renters) liability limits already cover, since that gap is exactly what a large judgment could reach. This calculator sizes that gap using your own numbers rather than a one-size-fits-all rule. Households with meaningful savings, a paid-off home, a pool or trampoline, teen drivers, or a public-facing job or social media presence tend to face more liability exposure than the underlying auto and home limits alone are built to absorb.",
  },
  {
    question: "What underlying liability limits do I need before I can buy an umbrella policy?",
    answer:
      "Every personal umbrella insurer requires you to already carry your auto and home (or renters) liability limits at or above a minimum threshold before they'll issue the policy, and that threshold is set individually by each carrier rather than standardized industry-wide. It commonly falls somewhere in the low hundreds of thousands of dollars per policy, but treat that as a ballpark, not a number to rely on. Ask your prospective umbrella insurer directly what their specific requirement is, and use the optional minimum field in this calculator to check your current limits against it once you know the number.",
  },
  {
    question: "What happens if my underlying limits don't meet the umbrella insurer's requirement?",
    answer:
      "Most umbrella insurers won't issue the policy at all until your underlying auto and home liability limits are raised to meet their minimum, so in practice you'd need to increase those limits first. In the less common case where a carrier does issue the umbrella anyway, a gap between an under-limit underlying policy and the umbrella's starting point can leave part of a claim uncovered by either policy, which defeats the point of buying the extra protection.",
  },
  {
    question: "Why does the calculator use my income, not just my net worth?",
    answer:
      "A liability judgment isn't limited to what you own on the day of the accident. Courts can also order wage garnishment, which means future earnings stay exposed even for someone with modest current savings. This calculator lets you choose how many years of future income to fold into the target protection figure, defaulting to five, so the number reflects ongoing earning capacity, not just a net worth snapshot.",
  },
  {
    question: "Why is the suggested umbrella limit rounded up to $1,000,000 increments?",
    answer:
      "Personal umbrella policies are commonly sold starting at $1,000,000 and in $1,000,000 increments above that, rather than in arbitrary dollar amounts. Rounding the suggested limit up to the nearest increment reflects what's actually available to buy, rather than a precise figure that doesn't correspond to a real policy option.",
  },
  {
    question: "Does this replace the advice of a licensed insurance agent?",
    answer:
      "No. This tool applies a common asset-and-income protection method to the numbers you enter, but it doesn't know your state's rules, your specific insurer's underwriting guidelines, or your full financial picture. Use the result as a starting figure to bring into a conversation with a licensed insurance agent, not as a final coverage decision.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Coverage Tools", href: "/tools/coverage" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function UmbrellaPolicyNeedCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Umbrella Policy Need Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Find out how much personal umbrella coverage actually closes the gap between what your auto
            and home liability limits protect today and what your net worth and income put at risk. Free,
            instant, and nothing you enter leaves your browser.
          </p>
          <LastUpdated category="coverage" />
        </div>

        <div className="mt-2">
          <UmbrellaPolicyNeedCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-umbrella-policy-need-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What an Umbrella Policy Actually Does</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A personal umbrella policy is a separate liability policy that sits on top of your existing
            auto and home (or renters) insurance. It does not pay for damage to your own car or home, and
            it does not replace either underlying policy. What it does is extend liability protection past
            the point where your auto or home policy&apos;s own limit runs out, so a judgment large enough to
            exceed a $300,000 home liability limit, for example, doesn&apos;t stop there and start reaching
            into your savings, your home equity, or your future paychecks. The product exists because
            serious liability judgments, especially ones involving a lasting injury, can run well past what
            a standard auto or home policy&apos;s liability section was ever sized to absorb on its own. This
            umbrella policy need calculator exists because most people can guess roughly what their auto or
            home liability limit is, but far fewer have actually compared that limit against what they
            personally stand to lose.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Run This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for households whose financial picture has outgrown a basic auto and home
            policy, not for every driver or homeowner. That includes anyone with meaningful savings,
            investments, or home equity, anyone whose income has grown enough that garnishment would be a
            real consequence of a judgment, anyone with a pool, trampoline, or dog that raises the odds of a
            guest injury, anyone with a teen driver in the household, and anyone whose job or public profile
            makes them a more visible target for a lawsuit. If your current auto and home limits already
            comfortably exceed what you have to lose, an umbrella policy may add little, and this
            calculator will show that directly instead of pushing you toward an unnecessary purchase.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Suggested Limit Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts by adding your entered net worth to your annual income multiplied by the
            number of years you choose to protect, defaulting to five. That total is your target liability
            protection figure. It then looks at your current auto and home (or renters) liability limits
            and takes the lower of the two, since umbrella coverage for any specific claim only extends
            above whichever policy&apos;s limit actually applies to that claim, so the weaker of the two limits
            is the honest measure of what&apos;s protected today. Subtracting that underlying limit from your
            target protection figure produces the gap an umbrella policy would need to close, and the tool
            rounds that gap up to the nearest common $1,000,000 increment, since personal umbrella policies
            are typically sold starting at $1,000,000 and in $1,000,000 steps above that rather than
            arbitrary amounts.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator also checks your underlying limits against a minimum you can optionally enter if
            you already know what your prospective umbrella insurer requires. That requirement is not
            standardized across the industry; each umbrella carrier sets its own minimum underlying limit,
            and it commonly falls somewhere in the low hundreds of thousands of dollars per policy, though
            the exact figure varies enough by carrier that this tool won&apos;t state one as fact. Leave that
            field blank and the tool shows a generic reminder to confirm the number directly with the
            insurer instead.
          </p>

          <AdInArticle slot="tool-umbrella-policy-need-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a couple with $600,000 in combined net worth (home equity, retirement accounts, and
            savings), a combined income of $140,000, a $300,000 auto liability limit, and a $300,000
            homeowners liability limit. Protecting five years of income alongside their net worth puts
            their target protection figure at $1,300,000 ($600,000 plus five times $140,000). Their
            underlying limit, the lower of the two policies, is $300,000, leaving a $1,000,000 gap. Rounded
            to the nearest common increment, the calculator suggests a $1,000,000 umbrella policy, which
            would bring their total liability protection to roughly $1,300,000, matching their target. If
            they later learn their prospective umbrella insurer requires a $300,000 minimum on both
            policies, their current limits already clear that bar; if the insurer&apos;s minimum turns out to be
            higher, they&apos;d need to raise one or both underlying limits before the umbrella could be issued
            at all.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Mistake That Voids the Extra Protection</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most damaging mistake in umbrella shopping is assuming a policy is fully in force
            without ever confirming that the underlying auto and home limits meet what the specific
            umbrella insurer actually requires. Underlying limit requirements are set by the umbrella
            carrier, not by the auto or home insurer, and they can be higher than whatever limit a
            household happened to already be carrying. A household that buys an umbrella policy while
            quietly carrying an underlying limit below the carrier&apos;s stated minimum can end up with a real
            coverage gap between the two policies exactly when a serious claim tests it, which is the worst
            possible moment to discover the shortfall. A second common mistake is treating net worth alone
            as the target figure and ignoring future income entirely, which understates real exposure for
            anyone still years away from their peak earnings.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator models a commonly cited asset-and-income protection method for sizing liability
            coverage, which is a widely used planning approach among insurance educators but not a formula
            every advisor applies identically. It uses the lower of your two entered underlying limits as a
            simplified stand-in for what&apos;s protected today, which is a reasonable planning shortcut but not
            how a specific claim gets adjudicated policy by policy. It does not know your state&apos;s specific
            liability rules, your household&apos;s full asset picture beyond what you enter, or any individual
            umbrella insurer&apos;s underwriting guidelines, including their exact required underlying minimum,
            which varies by carrier and is not fabricated or looked up by this tool. Treat every figure here
            as a planning number to bring into a conversation with a licensed insurance agent, not as a
            final coverage decision or a guarantee that any specific insurer will offer the suggested limit
            at any particular price.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Umbrella policy</strong> — a separate liability policy that sits on top of an
              existing auto and home (or renters) policy and extends liability protection well past the
              point where the underlying policy&apos;s own limit is exhausted.
            </li>
            <li>
              <strong>Underlying limits requirement</strong> — the minimum auto and home (or renters)
              liability limit an umbrella insurer requires you to already carry before it will issue the
              umbrella policy, set individually by each carrier rather than standardized industry-wide.
            </li>
            <li>
              <strong>Excess liability coverage</strong> — coverage that only responds after an underlying
              policy&apos;s limit has been used up on a covered claim; a personal umbrella policy is one common
              form of excess liability coverage sold to individuals and households.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For coverage definitions beyond what&apos;s covered here, the{" "}
            <a
              href="https://www.iii.org/article/what-is-personal-liability-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes a plain-language explanation of personal liability coverage and where umbrella
            policies fit above it. The{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            maintains consumer guidance on liability coverage definitions across policy types, and the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s homeowners coverage guide
            </a>{" "}
            covers how personal liability protection works on the home side specifically. Before buying or
            changing coverage, confirm your exact underlying limit requirement and pricing with your{" "}
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
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>{" "}
            category. For a fuller picture of every asset an umbrella needs to sit above, the{" "}
            <Link href="/tools/coverage/net-worth-protection-calculator" className="text-blue-600 hover:underline">
              net worth protection calculator
            </Link>{" "}
            walks through your broader balance sheet. If your underlying exposure runs through a rental
            unit rather than a home you own, start with the{" "}
            <Link href="/tools/renters/renters-liability-coverage-calculator" className="text-blue-600 hover:underline">
              renters liability coverage calculator
            </Link>{" "}
            to size that policy before layering an umbrella on top of it.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools publishes free, browser-based calculators for sizing coverage before you talk
            to an agent, not instead of talking to one. Every result here recalculates instantly as you
            type, nothing you enter is saved or transmitted, and the goal is always a number you can bring
            into that conversation already understanding where it came from.
          </p>
        </section>
      </div>
    </>
  );
}

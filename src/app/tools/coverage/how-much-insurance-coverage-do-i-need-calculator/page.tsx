import type { Metadata } from "next";
import Link from "next/link";
import type { Tool } from "@/types";
import { HowMuchInsuranceCoverageDoINeedCalculatorTool } from "@/components/tools/HowMuchInsuranceCoverageDoINeedCalculatorTool";
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
 * This tool is the flagship, cross-line entry point for the Coverage
 * category. It is intentionally not wired to `getToolBySlug` because it is
 * new: the site-wide tool registry in `src/lib/tools.ts` is integrated
 * centrally in a separate pass. The `tool` object below matches that
 * registry's `Tool` shape so `toolStructuredData` and the metadata builders
 * work exactly as they will once the registry entry lands.
 */
const tool: Tool = {
  slug: "how-much-insurance-coverage-do-i-need-calculator",
  name: "How Much Insurance Coverage Do I Need? Calculator",
  description:
    "A guided questionnaire that routes you to the specific Insurance Tools calculator for your situation, auto, home, renters, life, business, or umbrella, instead of guessing at one blended number.",
  category: "Coverage",
  categorySlug: "coverage",
  keywords: [
    "how much insurance coverage do i need calculator",
    "how much insurance coverage do i need",
    "insurance needs questionnaire",
    "cross line insurance coverage checklist",
    "what insurance do i need calculator",
    "comprehensive insurance needs assessment",
  ],
  relatedTools: [
    "car-insurance-coverage-calculator",
    "renters-insurance-coverage-calculator",
    "life-insurance-needs-calculator",
  ],
};

const TITLE = "How Much Insurance Coverage Do I Need? Calculator | Insurance Tools";
const DESCRIPTION =
  "This how much insurance coverage do I need calculator asks quick questions, then routes you to the exact auto, home, life, or business tool for your situation.";
const PAGE_URL = `${SITE_URL}/tools/coverage/how-much-insurance-coverage-do-i-need-calculator`;

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
    question: "Does this tool tell me exactly how much insurance coverage I need, in dollars?",
    answer:
      "No, and that is by design. Auto liability, home replacement cost, life insurance income replacement, and business liability are each sized by completely different math. Blending them into a single dollar figure would look precise while actually being a fabricated number. Instead, this questionnaire routes you to the specific calculator built for each line, so the dollar figure you eventually get is grounded in that line's real inputs, not a generic guess.",
  },
  {
    question: "Why does the calculator ask about net worth instead of just my income?",
    answer:
      "Income tells you how much life insurance to replace if something happens to you. Net worth tells you how much a liability judgment could actually reach after an at-fault accident or a lawsuit, which is a completely different question. Standard auto and home policies usually cap liability protection somewhere around $500,000; once your net worth approaches or passes that range, an umbrella policy becomes worth investigating, which is why this questionnaire asks about both separately.",
  },
  {
    question: "What if I answer yes to several questions at once?",
    answer:
      "That is common and the tool is built for it. Someone who owns a home, drives a car, has a family, and freelances on the side will see four or five recommended tools at once, each addressing a different, real gap in their coverage picture. There is no penalty for a long checklist; it simply reflects that your insurance picture has more moving parts than someone who rents, has no dependents, and does not own a business.",
  },
  {
    question: "How is this different from just searching \"how much insurance do I need\"?",
    answer:
      "Most search results answer that question for one line of coverage at a time, usually whichever one the page happens to sell, and many blend unrelated coverage types into a single misleading number. This questionnaire looks at your whole situation first and only then points you to line-specific tools, each of which explains its own methodology, assumptions, and limitations rather than asserting one figure without showing the work.",
  },
  {
    question: "I don't own a home, a car, or a business. Do I still need insurance?",
    answer:
      "Possibly less than you'd think, and the tool reflects that honestly rather than manufacturing a recommendation to fill the page. If none of the boxes apply to you yet, the questionnaire will say so and suggest revisiting it after a life change, a lease, a first car, a new dependent, or a new business, rather than pushing you toward a policy you may not need today.",
  },
  {
    question: "How often should I redo this questionnaire?",
    answer:
      "Whenever something in your situation changes materially: you buy or sell a home, take on or pay off a car, have a child, start a business or meaningful side income, or your net worth moves by a large amount. None of those events send you a reminder to update your coverage, so treat this as a five-minute check-in whenever one of them happens.",
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

export default function HowMuchInsuranceCoverageDoINeedCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            How Much Insurance Coverage Do I Need? Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Answer a handful of questions about your home, car, family, business, and net worth, and get
            routed straight to the specific calculator built for each part of your coverage picture.
            Nothing here fabricates a single blended dollar figure.
          </p>
          <LastUpdated category="coverage" />
        </div>

        <div className="mt-2">
          <HowMuchInsuranceCoverageDoINeedCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-coverage-needs-questionnaire-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why &ldquo;How Much Insurance Coverage Do I Need&rdquo; Doesn&apos;t Have One Answer
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Search for how much insurance coverage do I need and most results try to hand you a single
            number, or worse, a single rule of thumb stretched across every kind of policy. That approach
            breaks down immediately once you look at how each line is actually priced and sized. Auto
            liability is sized against your assets and income, because a judgment can reach both. Home and
            renters coverage is sized against replacement cost, not resale value. Life insurance is sized
            against income replacement years and future obligations like a mortgage or college costs.
            Business liability is sized against revenue, clients, and the specific risks of what you do.
            None of those four calculations share an input, so there is no honest way to average them into
            one figure. This tool exists to solve the actual problem behind that search: not &ldquo;give me a
            number&rdquo; but &ldquo;tell me which parts of my coverage picture need attention, and where to go for
            each one.&rdquo;
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Questionnaire</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for the moment before you know which specific calculator you need, not
            after. If you already know you want to check your auto liability limit, the car insurance
            calculator is the faster path. This questionnaire is for someone just starting to think about
            their overall insurance picture: a new homeowner who hasn&apos;t touched renters coverage since
            college, someone who just had a child and hasn&apos;t looked at life insurance, or a freelancer
            who added a business license without ever asking whether their personal auto and home policies
            still cover them. It is also useful as a periodic check-in, since most people only revisit
            insurance coverage when a bill arrives or a claim gets denied, rather than on any regular
            schedule.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Routing Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Each question above maps to a specific, real gap and a specific tool built to size it.
            Answering that you own your home routes you to the home insurance calculators, since dwelling
            replacement cost and personal property coverage are the two figures most homeowners get wrong.
            Renting instead routes you to the renters coverage calculator, which handles the fact that a
            landlord&apos;s policy covers the building but not your belongings or your liability inside the
            unit. Owning or driving a car routes you to the car insurance coverage calculator, which sizes
            liability against your assets and income rather than a flat state minimum. Having dependents
            who rely on your income routes you to the life insurance needs calculator, an entirely
            separate calculation built around income replacement and future obligations. Running a
            business or meaningful side income routes you to the business insurance tools, since a
            personal auto or home policy typically excludes business activity outright. Net worth is
            handled on its own track: entering any figure surfaces the net worth protection calculator for
            a precise read, and crossing roughly the $500,000 range, close to where standard auto and home
            liability limits stop, additionally surfaces the umbrella policy need calculator. Anyone who
            already holds several policies can flag that they want the seams between those policies
            checked, which routes to the coverage gap calculator built specifically for finding overlaps
            and blind spots between existing coverage.
          </p>

          <AdInArticle slot="tool-coverage-needs-questionnaire-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a household that bought a first home last year, still owes payments on one car, had
            their first child eight months ago, and has a combined net worth around $180,000 once home
            equity and retirement savings are added up. Running this questionnaire, they check &ldquo;I own my
            home,&rdquo; check &ldquo;I own or regularly drive a car,&rdquo; check &ldquo;I have dependents who rely on my
            income,&rdquo; and enter $180,000 for net worth. The tool immediately returns three tool
            recommendations: the home insurance calculators, since they haven&apos;t revisited dwelling
            coverage since closing; the car insurance coverage calculator, since their liability limit was
            likely set at whatever the dealership&apos;s insurer defaulted to; and the life insurance needs
            calculator, which they hadn&apos;t considered at all before having a child. Because their entered
            net worth sits below the roughly $500,000 range, the umbrella policy recommendation doesn&apos;t
            appear, and the questionnaire doesn&apos;t manufacture one just to look thorough. That is the
            entire value of this tool: three specific, justified next steps instead of one invented dollar
            figure that would have meant nothing without knowing the household&apos;s actual assets, mortgage,
            and family situation.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Mistake This Tool Is Built to Prevent
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The single most common mistake in this space is expecting one dollar figure to answer every
            insurance decision at once, whether that figure comes from a rule of thumb, a single blog
            post, or a calculator that quietly averages unrelated coverage types together. That expectation
            leads people to either under-insure lines that got no attention in the blended number, or
            over-insure lines that got double-counted, and it leaves no way to tell which is which. A
            close second mistake is treating a coverage review as a one-time task done at the first policy
            purchase, rather than something to revisit after the life changes, a new car, a new dependent,
            a new business, a jump in net worth, that actually change what each line of coverage should
            look like.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This questionnaire assumes your answers are accurate and current; it does not verify anything
            against a policy document, a credit report, or a public record. The $500,000 net worth range
            used to flag umbrella coverage reflects a commonly cited ceiling on standard auto and home
            liability limits, not a rule that applies to every insurer or every state. This tool does not
            know your state&apos;s specific minimum coverage requirements, your existing policy limits, your
            claims history, or any underwriting rules an insurer might apply to you individually. It cannot
            tell you whether you are currently correctly insured, only which specific tools are worth
            running next given what you&apos;ve described. Treat every recommendation here as a starting point
            for research, and confirm anything that affects a real purchase decision with a licensed
            insurance agent or a financial professional.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Coverage gap</strong> — a loss that isn&apos;t covered by any policy you hold, often
              created at the seam between two separate policies, such as business activity a homeowners
              policy excludes.
            </li>
            <li>
              <strong>Underinsurance</strong> — carrying a lower limit, or a lower value of coverage, than
              your actual exposure requires, so a real loss exceeds what the policy pays out.
            </li>
            <li>
              <strong>Risk transfer</strong> — the basic mechanism behind insurance itself: shifting the
              financial consequence of a possible loss from you to an insurer in exchange for a premium.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For broader context on how these coverage types are defined, the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance covering most personal lines of coverage, and the{" "}
            <a
              href="https://www.iii.org/article/how-much-life-insurance-do-i-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains the income-replacement approach behind life insurance needs specifically. For the
            homeowners and renters side, the Insurance Information Institute&apos;s{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              homeowners insurance basics
            </a>{" "}
            and{" "}
            <a
              href="https://www.iii.org/article/renters-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              renters insurance basics
            </a>{" "}
            pages lay out what each policy type actually covers. Before making any coverage decision,
            confirm your exact state requirements with your{" "}
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
            This questionnaire is the entry point to the{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              Coverage Tools
            </Link>{" "}
            category. Once it points you to a specific line, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              Car Insurance Coverage Calculator
            </Link>
            , the{" "}
            <Link href="/tools/renters/renters-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              Renters Insurance Coverage Calculator
            </Link>
            , and the{" "}
            <Link href="/tools/life/life-insurance-needs-calculator" className="text-blue-600 hover:underline">
              Life Insurance Needs Calculator
            </Link>{" "}
            each produce their own line-specific estimate. If your situation spans several policies
            already, the{" "}
            <Link href="/tools/coverage/coverage-gap-calculator" className="text-blue-600 hover:underline">
              Coverage Gap Calculator
            </Link>{" "}
            checks the seams between them.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for figuring out coverage, costs,
            claims, and deductibles across every major line of personal and business insurance. Every tool
            runs entirely in your browser, keeps whatever you type to yourself, and links onward to the
            next tool that actually fits your situation instead of stopping at one generic answer.
          </p>
        </section>
      </div>
    </>
  );
}

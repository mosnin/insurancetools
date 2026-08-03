import type { Metadata } from "next";
import Link from "next/link";
import { PetWellnessPlanValueCalculatorTool } from "@/components/tools/PetWellnessPlanValueCalculatorTool";
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

const tool = getToolBySlug("pet-wellness-plan-value-calculator")!;

const TITLE = "Pet Wellness Plan Value Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this pet wellness plan value calculator to compare your plan's cost and reimbursement cap against your own routine vet care spending, so you can see the real annual math.";
const PAGE_URL = `${SITE_URL}/tools/pet/pet-wellness-plan-value-calculator`;

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
    question: "Is a pet wellness plan the same thing as pet insurance?",
    answer:
      "No. Accident and illness pet insurance is risk transfer: you pay a premium so the insurer absorbs the financial risk of something unpredictable, like a torn ligament or an unexpected diagnosis. A wellness plan reimburses routine, scheduled care you already know is coming, like an annual exam or a core vaccine. Many providers sell a wellness plan as an add-on to an accident/illness policy, but it works more like a prepaid budgeting tool for predictable costs than like insurance against a bad outcome.",
  },
  {
    question: "Is a pet wellness plan worth it?",
    answer:
      "It depends entirely on whether your actual routine care spending, reimbursed at your plan's rate and capped at its annual limit, exceeds what the plan costs you per year. This calculator runs that exact comparison using the routine care costs you enter, since typical vet pricing varies too much by clinic and region for a single national number to mean much for your situation.",
  },
  {
    question: "What does a wellness plan usually cover?",
    answer:
      "Coverage varies by provider, but wellness plans are generally built around routine, preventive services: annual or biannual wellness exams, core vaccinations, routine bloodwork or screening panels, and sometimes dental cleanings or a portion of spay/neuter costs. Check your specific plan's schedule of covered services and per-item limits rather than assuming it matches another provider's plan.",
  },
  {
    question: "Why does the reimbursement cap matter if my plan reimburses 100%?",
    answer:
      "Because the cap is usually the binding constraint, not the percentage. A plan that reimburses 100% up to a $400 annual cap only pays out $400 total even if your itemized routine spending comes to $600 for the year. This calculator applies both the rate and the cap so the reimbursed figure reflects whichever one actually limits your payout.",
  },
  {
    question: "Should I buy a wellness plan instead of accident and illness coverage?",
    answer:
      "They answer different questions, so this isn't really an either/or decision. A wellness plan helps you budget for costs you were going to pay anyway. Accident and illness coverage protects you against a cost you can't predict and might not be able to afford out of pocket, like emergency surgery. If you're weighing that broader decision, the accident-only vs. comprehensive pet insurance comparison is the more relevant tool.",
  },
  {
    question: "Can I estimate this without knowing my exact vet costs yet?",
    answer:
      "You can enter your best estimate for each category, but the result is only as reliable as the numbers you put in. Check your own vet's fee schedule, a recent invoice, or your wellness plan's list of reimbursable services and their typical amounts before relying on the comparison for a purchase decision.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
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

export default function PetWellnessPlanValueCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Pet Wellness Plan Value Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Compare your wellness plan&apos;s cost and reimbursement cap against your own estimated
            routine vet care spending, so you can see whether the plan actually pays for itself this
            year. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="pet" />
        </div>

        <div className="mt-2">
          <PetWellnessPlanValueCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-pet-wellness-plan-value-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What a Wellness Plan Actually Covers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A pet wellness plan reimburses routine, scheduled care: the annual exam, core vaccines,
            routine bloodwork, and often a dental cleaning. These are predictable expenses that happen
            on a known calendar, which is exactly why most accident and illness pet insurance policies
            exclude them by default. Insurers price accident and illness coverage around unpredictable
            risk, and a scheduled annual exam isn&apos;t risk in the insurance sense; it&apos;s a known cost you
            can plan a budget around. A wellness plan fills that gap, but it does it by collecting a
            fixed annual fee and reimbursing a portion of costs you were largely going to pay anyway,
            not by transferring the financial risk of something going wrong.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            That distinction matters more than it sounds. Insurance, properly understood, protects you
            against a loss you can&apos;t predict and might not be able to absorb, like emergency
            abdominal surgery after your dog swallows something it shouldn&apos;t have. A wellness plan
            protects you against nothing in that sense. It&apos;s closer to a subscription that prepays
            and slightly discounts costs you&apos;ve already decided to pay. That framing isn&apos;t a knock
            on wellness plans, since a lot of pet owners genuinely benefit from spreading predictable
            costs into a level annual fee. It just means the &ldquo;is this worth it&rdquo; question is a
            budgeting math problem, not a risk question, and this calculator is built to answer exactly
            that math problem using your own numbers.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for anyone who already has, or is considering, a wellness plan or wellness
            rider and wants to know whether it will actually save money this year, rather than trusting
            a provider&apos;s marketing that it &ldquo;pays for itself.&rdquo; It&apos;s especially useful once you have a
            real number for what your vet charges for an exam, vaccines, or a dental cleaning, since
            plugging in your actual costs instead of a national average is what makes the comparison
            meaningful. If you&apos;re instead trying to decide whether to carry accident and illness
            coverage at all, that&apos;s a different question this tool doesn&apos;t answer; the accident-only
            vs. comprehensive pet insurance comparison and the pet insurance value calculator below are
            built for that decision.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Comparison Works</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You enter your wellness plan&apos;s annual cost, its reimbursement rate, and its annual
            reimbursement cap, all taken from your own plan&apos;s schedule. Then you itemize your
            estimated annual routine care spending by category: exam, vaccines, bloodwork, dental, and
            anything else your plan covers. The calculator applies your reimbursement rate to that
            itemized total, then caps the result at your plan&apos;s annual maximum, since the cap is
            frequently the number that actually limits your payout, not the percentage. It compares
            your total annual cost with the plan (the plan&apos;s fee plus whatever routine spending isn&apos;t
            reimbursed) against your total cost without the plan (the full itemized spending, paid
            directly), and reports the difference as a net benefit or net cost for the year.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            It also calculates a break-even spending level: the amount of eligible routine care spending
            you&apos;d need in a year, at your entered reimbursement rate, just to recoup the plan&apos;s fee
            before the cap comes into play. That number is useful on its own, separate from your
            itemized entries, if you want a quick gut check on whether your typical routine visits come
            anywhere close.
          </p>

          <AdInArticle slot="tool-pet-wellness-plan-value-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a wellness plan that costs $300 a year, reimburses 100% of eligible services, and
            caps annual reimbursement at $400. A dog owner estimates a $60 annual exam, $90 in core
            vaccines, $75 in routine bloodwork, and a $250 dental cleaning, for an itemized total of
            $475. At a 100% reimbursement rate, that would come to $475 in eligible reimbursement, but
            the plan&apos;s $400 cap binds first, so the plan actually pays out $400. The owner&apos;s total
            cost with the plan is the $300 plan fee plus the $75 of spending above the cap that wasn&apos;t
            reimbursed, for $375 total. Without the plan, the same routine care would have cost the full
            $475 out of pocket. In this example the plan nets roughly $100 in savings for the year, but
            change the dental cleaning to a year when it isn&apos;t due and the itemized total drops well
            below the cap, at which point the plan&apos;s $300 fee may cost more than it returns. That
            swing from year to year is exactly why this calculator asks for your specific numbers rather
            than assuming a fixed annual result.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is treating a wellness plan as protection against a bad outcome,
            the way you&apos;d think about accident and illness coverage, when it actually only reimburses
            costs you already expected to pay. A second is ignoring the reimbursement cap and assuming
            the advertised percentage applies to unlimited spending, which is rarely how these plans are
            structured. A third is comparing a wellness plan&apos;s value using a single unusually expensive
            year, like one that happened to include a dental cleaning, instead of a typical year, which
            can make an otherwise break-even plan look artificially valuable or artificially wasteful.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator performs only the arithmetic you give it. It does not know typical veterinary
            prices in your area, your pet&apos;s specific plan terms, which services your provider actually
            classifies as eligible, or whether your plan applies the cap per service, per category, or
            per year in aggregate, which varies by provider. It assumes your reimbursement rate applies
            uniformly across every category you enter, which may not match a plan that reimburses
            different services at different rates. Treat every result as a planning estimate to bring
            into a conversation with your wellness plan provider or veterinarian, not as a guaranteed
            annual outcome, and re-run the numbers whenever your routine care schedule changes, such as
            adding a dental cleaning in a given year.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Wellness plan</strong> — an add-on or standalone product that reimburses routine,
              scheduled pet care rather than transferring the risk of an unexpected accident or illness.
            </li>
            <li>
              <strong>Preventive care</strong> — routine services meant to catch problems early or
              prevent them, such as annual exams, core vaccines, and screening bloodwork.
            </li>
            <li>
              <strong>Reimbursement schedule / cap</strong> — the specific list of covered services and
              the maximum dollar amount a plan will reimburse per service, per category, or per year.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For consumer guidance on how pet insurance products are structured and regulated, the{" "}
            <a
              href="https://content.naic.org/consumer/pet-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes plain-language consumer resources on pet insurance terms. The{" "}
            <a
              href="https://www.aspca.org/pet-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ASPCA
            </a>{" "}
            publishes general pet care guidance that can help you plan what routine services to budget
            for, and the{" "}
            <a
              href="https://www.avma.org/resources-tools/pet-owners/petcare/preventive-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              American Veterinary Medical Association
            </a>{" "}
            explains what preventive veterinary care typically includes. If you&apos;re comparing plans
            across states, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            can confirm how wellness add-ons are regulated where you live.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/pet" className="text-blue-600 hover:underline">
              Pet insurance tools
            </Link>{" "}
            category. If you&apos;re also weighing whether accident and illness coverage is worth carrying
            at all, the{" "}
            <Link href="/tools/pet/pet-insurance-value-calculator" className="text-blue-600 hover:underline">
              pet insurance value calculator
            </Link>{" "}
            runs that separate risk-based comparison, and the{" "}
            <Link href="/tools/pet/accident-only-vs-comprehensive-pet-calculator" className="text-blue-600 hover:underline">
              accident-only vs. comprehensive pet insurance comparison
            </Link>{" "}
            helps you choose between policy types before you add a wellness rider on top.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance product details
            like reimbursement rates and annual caps into a plain comparison you can actually use. No
            account, no email, and no data leaves your browser — just the math, run on the numbers you
            supply.
          </p>
        </section>
      </div>
    </>
  );
}

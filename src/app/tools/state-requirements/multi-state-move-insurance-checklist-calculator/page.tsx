import type { Metadata } from "next";
import Link from "next/link";
import { MultiStateMoveInsuranceChecklistCalculatorTool } from "@/components/tools/MultiStateMoveInsuranceChecklistCalculatorTool";
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

const tool = getToolBySlug("multi-state-move-insurance-checklist-calculator")!;

const TITLE = "Moving to Another State Insurance Checklist | Insurance Tools";
const DESCRIPTION =
  "Use this moving to another state insurance checklist calculator to time your auto, home, and health insurance tasks and size your valuables-in-transit risk.";
const PAGE_URL = `${SITE_URL}/tools/state-requirements/multi-state-move-insurance-checklist-calculator`;

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
    question: "Does my car insurance automatically transfer when I move to another state?",
    answer:
      "Usually not without action on your part. Many insurers can keep covering you through the move itself, but most require you to update your address and, in many cases, rewrite the policy once you register your vehicle and license in the new state, since rates, required minimum coverage, and available discounts are all set at the state level. Contact your insurer as soon as you have a move date so nothing lapses.",
  },
  {
    question: "How long do I have to register my car and get a new license after moving?",
    answer:
      "It depends entirely on the state you're moving to, and the window can be measured in days or months depending on where you land. This tool intentionally does not guess that number for you, since giving the wrong deadline would be worse than giving none. Check directly with your new state's DMV or motor vehicle agency as soon as you arrive.",
  },
  {
    question: "Will my homeowners or renters insurance carry over to my new home?",
    answer:
      "Not automatically. Homeowners and renters insurers are licensed on a state-by-state basis, so even a large national brand may write policies in your old state through a different licensed entity than the one operating in your new one. Ask your agent directly whether your existing policy transfers, needs to be reissued, or has to be replaced entirely.",
  },
  {
    question: "Who is responsible if my belongings are damaged during the move itself?",
    answer:
      "It depends on how you're moving and what coverage you arranged in advance, which is exactly why this checklist puts that question early rather than treating it as an afterthought. If you hire a mover, ask what their basic liability option actually pays out and how it's calculated before the truck is loaded. If you&apos;re moving yourself, ask your homeowners or renters insurer whether your policy&apos;s off-premises coverage extends to a personal or rented vehicle during the trip.",
  },
  {
    question: "Do I need to do anything with my health insurance when I move states?",
    answer:
      "Yes, in most cases. A permanent move to a new state is generally treated as a qualifying life event that can open a special enrollment window for marketplace coverage, and it can also mean your current doctors and hospitals are out of network in your new location. Confirm your options with your insurer, your employer's benefits team, or the marketplace before you need care.",
  },
  {
    question: "Why does this tool ask how many days are left until my move instead of just listing tasks?",
    answer:
      "Because the same checklist item means something different at 60 days out than it does the week you arrive. Shopping auto insurance quotes early is useful; waiting until moving day to start is not. This tool reorders the same seven tasks into what's due now, what to plan for, and what to handle after you arrive, based on the timeline you enter, instead of handing you one flat, undated list.",
  },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData([
    { name: "Home", url: SITE_URL },
    { name: "State Requirements Tools", url: `${SITE_URL}/tools/state-requirements` },
    { name: tool.name, url: PAGE_URL },
  ]),
  faqStructuredData(faqs),
];

export default function MultiStateMoveInsuranceChecklistCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav
            items={[
              { name: "Home", href: "/" },
              { name: "State Requirements Tools", href: "/tools/state-requirements" },
              { name: tool.name },
            ]}
          />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Multi-State Move Insurance Checklist Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            A moving to another state insurance checklist that reorders itself around your actual
            timeline, plus a quick way to size how much of what you own is riding in a truck with no
            insurance backing it up yet. Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="state-requirements" />
        </div>

        <div className="mt-2">
          <MultiStateMoveInsuranceChecklistCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-multi-state-move-checklist-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Changes When You Move Across State Lines</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            An interstate move touches more insurance policies than most people expect, and it does so on
            different clocks. Auto insurance is the most time-sensitive, since states set their own rules
            for how quickly a new resident must register a vehicle and switch over a driver&apos;s license, and
            premiums themselves can shift meaningfully once you&apos;re rated in a different state&apos;s risk pool.
            Homeowners and renters coverage is a separate problem entirely, because insurers are licensed
            state by state; a policy that has covered you for years may not be sold by the same company,
            under the same name, in your destination state. Health insurance adds a third clock, since a
            permanent move is commonly treated as a qualifying event that opens a special enrollment
            window, on top of the more basic question of whether your current doctors are even in-network
            where you&apos;re headed. None of this is exotic — it&apos;s just spread across several insurers, several
            deadlines, and, for auto and property coverage, several sets of state rules that this tool
            deliberately does not try to memorize on your behalf.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Checklist Calculator</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is built for anyone with a move date and a truck, whether that&apos;s a cross-country relocation
            for a new job or a shorter move just over a state line. It&apos;s most useful the moment you have a
            rough date, since the tool&apos;s whole point is timing: run it early and it tells you what to start
            now versus what can wait, and run it again the week of the move to see the same checklist
            resolve into what&apos;s left to finish and what only matters once you&apos;ve arrived. If you&apos;re
            comparing moving companies or weighing a self-move against hiring one, the valuables-in-transit
            section is worth checking before you commit either way.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Timeline and Exposure Figures Work</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Enter the number of days until your move and the tool sorts into one of four phases: planning
            (45-plus days out), active preparation (15 to 45 days), final countdown (1 to 14 days), or
            moving day and just after. Each of the seven checklist items — covering auto, home and renters,
            health, and life and disability insurance — is tagged to the phase where it&apos;s actually
            actionable, so tasks flip from &ldquo;plan ahead&rdquo; to &ldquo;do this now&rdquo; automatically as your
            countdown shortens, rather than showing you one undated wall of text. The valuables-in-transit
            figure works differently: it takes the total value you enter for the belongings being
            transported and pairs it with whether a professional mover is involved, since that single fact
            determines who has any liability at all if something is lost or damaged. With a mover, there is
            typically a baseline liability option required by federal rule, but it&apos;s usually calculated by
            shipment weight rather than replacement value, which is why comparing your entered total against
            that valuation option matters. Without a mover, that carrier liability generally doesn&apos;t exist,
            which shifts the question to whether your homeowners or renters policy&apos;s off-premises coverage
            reaches a personal or rented vehicle during the trip.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Consider a household moving from Ohio to North Carolina in 22 days, hiring a moving company, and
            transporting roughly $35,000 in furniture, electronics, and other belongings. At 22 days out,
            the tool lands in the active preparation phase, which flags confirming homeowners coverage and
            reviewing the health insurance network as due now, while auto quotes and the valuables-in-transit
            conversation with the mover show as already handled if they were addressed earlier, or still
            urgent if they weren&apos;t. The $35,000 figure prompts a direct comparison against whatever
            weight-based valuation option the mover offers, since a shipment that size can easily exceed a
            basic liability payout by a wide margin. DMV registration and the life insurance address update
            sit in the after-arrival phase, correctly separated from the pre-move tasks that actually have a
            deadline before the truck leaves.
          </p>

          <AdInArticle slot="tool-multi-state-move-checklist-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Checklist Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming an existing auto policy simply continues unchanged in a new
            state with no further action required, which can leave a driver technically under-registered or
            paying a rate that no longer reflects where they actually live. A close second is booking a
            mover and never asking what their liability coverage actually pays for a loss, discovering only
            after a damaged shipment that the payout is based on weight and falls far short of the items&apos;
            real value. A third is treating homeowners or renters insurance as something that just moves with
            you, when in many cases it needs to be replaced with a new policy from an insurer actually
            licensed in the destination state.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is a process checklist and a rough exposure figure, not a state rules database. It does
            not know your destination state&apos;s actual DMV deadlines, insurance minimums, or any
            state-specific mandate, and it does not know your mover&apos;s actual contract terms or your
            insurer&apos;s actual policy language. The four timing phases are general planning guidance, not a
            legal deadline schedule, and the valuables-in-transit figure is only as accurate as the estimate
            you enter. Treat every result here as a starting point for calls to your insurer, your moving
            company, and your new state&apos;s DMV, not as a substitute for any of them.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Domicile</strong> — your true, fixed, permanent home state, the one you intend to
              return to. It matters for vehicle registration, licensing, and sometimes for how life
              insurance and estate matters are handled after a move.
            </li>
            <li>
              <strong>Released value protection</strong> — the baseline liability option movers are
              required to offer on interstate moves, valuing your goods by weight rather than replacement
              cost, which is why it typically covers only a fraction of what a shipment is actually worth.
            </li>
            <li>
              <strong>Admitted insurer</strong> — an insurance company formally licensed by a specific
              state&apos;s insurance department to sell coverage there. It&apos;s part of why a homeowners or specialty
              insurer that covered you in one state may not be able to simply carry the policy into another.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For coverage and licensing questions this checklist doesn&apos;t answer directly, the{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NAIC&apos;s directory of state insurance departments
            </a>{" "}
            is the fastest way to reach your destination state&apos;s actual regulator. The{" "}
            <a
              href="https://www.fmcsa.dot.gov/protect-your-move"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Federal Motor Carrier Safety Administration&apos;s Protect Your Move program
            </a>{" "}
            explains released value protection and your rights during an interstate move in detail. For
            homeowners and renters basics, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            is a useful starting point, and HealthCare.gov explains{" "}
            <a
              href="https://www.healthcare.gov/coverage-outside-open-enrollment/moving/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              how a move can qualify you for a special enrollment period
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator lives in the{" "}
            <Link href="/tools/state-requirements" className="text-blue-600 hover:underline">
              State Requirements tools
            </Link>{" "}
            category. Before the truck arrives, the{" "}
            <Link
              href="/tools/renters/renters-personal-property-value-calculator"
              className="text-blue-600 hover:underline"
            >
              renters personal property value calculator
            </Link>{" "}
            helps itemize what you own room by room, and the{" "}
            <Link href="/tools/home/home-inventory-value-calculator" className="text-blue-600 hover:underline">
              home inventory value calculator
            </Link>{" "}
            builds a fuller record worth having on file regardless of which state you&apos;re leaving or
            arriving in.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators for the moments insurance actually
            matters, like a cross-state move where several policies and deadlines all shift at once. Nothing
            you type here is stored or sent anywhere; every result is meant to make the next call to your
            agent, insurer, or state DMV shorter and more specific.
          </p>
        </section>
      </div>
    </>
  );
}

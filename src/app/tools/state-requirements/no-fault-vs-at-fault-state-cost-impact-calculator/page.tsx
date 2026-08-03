import type { Metadata } from "next";
import Link from "next/link";
import { NoFaultVsAtFaultStateCostImpactCalculatorTool } from "@/components/tools/NoFaultVsAtFaultStateCostImpactCalculatorTool";
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

const tool = getToolBySlug("no-fault-vs-at-fault-state-cost-impact-calculator")!;

const TITLE = "No-Fault vs. At-Fault State Insurance Calculator";
const DESCRIPTION =
  "Use this no fault vs at fault state insurance calculator to check your PIP or liability limit against a medical bill estimate and confirm your state's system.";
const PAGE_URL = `${SITE_URL}/tools/state-requirements/no-fault-vs-at-fault-state-cost-impact-calculator`;

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
    question: "Does this tool tell me whether my state is a no-fault or at-fault state?",
    answer:
      "No, and on purpose. Which states use a no-fault, at-fault, or hybrid \"choice\" system is a legal fact set by state statute, and while it rarely changes, it does occasionally shift when a legislature revises its auto insurance law. Hardcoding that list here would eventually go stale. Instead, this tool asks you to self-identify your system (or pick \"not sure\") and points you to your declarations page and the NAIC's directory of state insurance departments so you're confirming the current, correct answer rather than trusting a list that could be out of date.",
  },
  {
    question: "If my state is \"no-fault,\" does that mean no one is legally at fault for the accident?",
    answer:
      "No, this is the single most common misunderstanding of the term. \"No-fault\" describes how your initial medical bills get paid, through your own Personal Injury Protection coverage, regardless of who caused the crash. It does not erase fault as a legal concept. Fault still gets determined for property damage claims, for insurance surcharges and rate increases, and for any lawsuit that becomes possible once injuries or costs cross your state's tort threshold.",
  },
  {
    question: "What happens if my medical bills are higher than my PIP limit?",
    answer:
      "In many no-fault states, once your costs or the severity of your injury cross a threshold set by state law, sometimes called a tort threshold, you may be able to step outside the no-fault system and pursue the at-fault driver's insurer directly for the remainder. The exact threshold, and whether it's a dollar amount or a description of injury severity, varies by state and is worth confirming with a licensed agent or attorney rather than assumed.",
  },
  {
    question: "In an at-fault state, does the other driver's insurer always pay quickly?",
    answer:
      "Not necessarily. Because at-fault (tort) states require fault to be established before a liability insurer pays, claims can take longer than a no-fault PIP claim, which is designed to pay your own bills without waiting on that determination. If the at-fault driver has too little liability coverage, or none at all, your own uninsured or underinsured motorist coverage is typically what closes that gap, not the at-fault driver's policy.",
  },
  {
    question: "Can my own insurer recover money after paying my no-fault claim?",
    answer:
      "Sometimes, through a process called subrogation. If your no-fault insurer pays your medical bills and it's later established that another driver caused the accident, your insurer may seek reimbursement from that driver's insurance company. This happens between insurers and typically doesn't change what you were paid, though it can affect how the claim is recorded.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "State Requirements Tools", href: "/tools/state-requirements" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function NoFaultVsAtFaultStateCostImpactCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            No-Fault vs. At-Fault State Insurance Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            See how your medical bills actually get paid after an accident under a no-fault or an
            at-fault system, check your PIP or liability limit against a real cost estimate, and find out
            how to confirm which system your own state uses.
          </p>
          <LastUpdated category="state-requirements" />
        </div>

        <div className="mt-2">
          <NoFaultVsAtFaultStateCostImpactCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-no-fault-vs-at-fault-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Who Needs a No-Fault vs. At-Fault State Insurance Calculator
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is built for a specific moment of confusion: you&apos;ve just been in an accident, or
            you&apos;re reading a policy quote, and you keep seeing the terms &ldquo;no-fault&rdquo; and &ldquo;PIP&rdquo; without a
            clear sense of what they change about how you get paid. It&apos;s also useful if you&apos;ve recently
            moved states and your old assumptions about how claims work no longer apply, since the two
            systems handle the same accident in structurally different ways. Rather than telling you which
            system your state uses, which this tool deliberately does not claim to know with certainty,
            it walks you through what each system means for your own numbers once you&apos;ve confirmed the
            answer elsewhere.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What No-Fault and At-Fault Actually Change
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            In an at-fault (also called a tort) state, the driver who caused the accident is legally
            responsible for the resulting losses, and that driver&apos;s liability insurer is expected to pay
            for the other party&apos;s medical bills, lost wages, and property damage once fault is
            established. If the at-fault driver&apos;s insurer disputes fault or the driver has no insurance,
            the injured party can end up negotiating, filing a claim against their own uninsured motorist
            coverage, or in some cases suing.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            In a no-fault state, the law requires drivers to carry Personal Injury Protection (PIP), which
            pays for your own medical bills and often a portion of lost wages after an accident, up to your
            policy&apos;s limit, regardless of who caused it. The point of the system is speed: you&apos;re not
            waiting on a fault investigation before your own bills start getting paid. Property damage is
            typically still handled on a fault basis even in a no-fault state, and if your injury or costs
            cross your state&apos;s tort threshold, described below, you may be able to pursue the at-fault
            driver directly for anything beyond what PIP covers. A few states let drivers choose between a
            no-fault option and a traditional tort option when they buy a policy, which is why this tool
            treats the choice as something you confirm rather than something tied to where you live.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How to Find Out Which System Your State Actually Uses
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The fastest way to confirm this is your own declarations page: a line item labeled &ldquo;Personal
            Injury Protection&rdquo; or &ldquo;PIP&rdquo; is a strong sign you&apos;re in a no-fault state, while its absence
            usually points to an at-fault system. For an authoritative answer, the{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NAIC&apos;s directory of state insurance departments
            </a>{" "}
            links directly to your state regulator, who publishes the current, legally accurate answer.
            This calculator will not guess on your behalf, since a wrong guess here could lead you to
            expect the wrong claims process entirely.
          </p>

          <AdInArticle slot="tool-no-fault-vs-at-fault-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A No-Fault Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say you carry a $10,000 PIP limit and, after a rear-end collision, your ER visit, imaging, and
            two months of physical therapy add up to $12,000. Your PIP coverage pays the first $10,000
            regardless of who caused the crash, no fault investigation required, leaving a $2,000
            shortfall. Depending on your state&apos;s tort threshold, either measured in dollars or described by
            injury severity, you may be able to pursue the at-fault driver&apos;s liability insurer for that
            remaining $2,000, or your own health insurance or MedPay coverage may pick up part of it
            instead. The PIP payment itself, however, was never in question once the bills came in.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">An At-Fault Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Now say you&apos;re in an at-fault state, another driver runs a red light and hits you, and your
            medical costs total $60,000 for a fracture requiring surgery. If that driver carries a
            $50,000 per-person bodily injury liability limit, their insurer is expected to pay up to that
            limit once fault is established, leaving a $10,000 gap. That gap is exactly what your own
            underinsured motorist coverage is designed to close, not something the at-fault driver&apos;s
            insurer owes beyond their policy limit. Note the difference in timing, too: this payment
            depends on fault being established first, while a no-fault PIP claim in the earlier example
            didn&apos;t wait on that determination at all.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Mistake This Tool Is Built to Prevent
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming &ldquo;no-fault&rdquo; means fault stops mattering entirely. It
            doesn&apos;t. Fault still gets determined for property damage, still affects whether your premium
            gets surcharged after the accident, and still matters if your case crosses the tort threshold
            into a potential lawsuit. &ldquo;No-fault&rdquo; describes a payment mechanism for your initial medical
            bills, not a legal statement about who caused the crash. A second common mistake is treating
            PIP and bodily injury liability as if they&apos;re the same coverage with different names; they pay
            different people, under different triggers, and comparing your PIP limit to someone else&apos;s
            liability limit, or vice versa, compares two different things.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes you&apos;ve already confirmed which system your state uses; it does not
            look that up, verify it, or maintain a list of no-fault, at-fault, or hybrid states, since that
            list is a legal fact that occasionally changes and deserves a current, authoritative source
            rather than a hardcoded table. The medical cost ranges shown are general planning references,
            not a prediction for any specific injury, region, or provider. The tool also doesn&apos;t know your
            actual policy limits, your state&apos;s specific tort threshold, whether your state allows a choice
            between systems, or the facts of any real accident. Treat every result here as a starting point
            for a conversation with a licensed insurance agent, a claims professional, or an attorney, not
            as a claims determination or legal advice.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Personal Injury Protection (PIP)</strong> — coverage required in no-fault states that
              pays your own medical bills and often a portion of lost wages after an accident, regardless
              of who caused it, up to your policy&apos;s limit.
            </li>
            <li>
              <strong>Tort threshold</strong> — the dollar amount or injury severity a no-fault claim must
              cross before the injured party can step outside the no-fault system and pursue the at-fault
              driver directly for damages beyond PIP.
            </li>
            <li>
              <strong>Subrogation</strong> — the process by which an insurer that has already paid a claim
              seeks reimbursement from the insurer of the party later found to be at fault.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For a fuller explanation of how the two systems developed and how they compare, the{" "}
            <a
              href="https://www.iii.org/article/background-on-no-fault-auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute&apos;s background on no-fault auto insurance
            </a>{" "}
            covers the policy reasoning behind no-fault laws, and the{" "}
            <a
              href="https://content.naic.org/article/what-does-auto-insurance-cover"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NAIC&apos;s guidance on what auto insurance covers
            </a>{" "}
            breaks down PIP, medical payments, and liability coverage side by side. The{" "}
            <a
              href="https://content.naic.org/consumer/auto-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NAIC&apos;s consumer auto insurance guidance
            </a>{" "}
            is a good next stop for general coverage terminology, and your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            remains the authoritative source for your state&apos;s exact system and tort threshold.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/state-requirements" className="text-blue-600 hover:underline">
              State Requirements tools
            </Link>{" "}
            category. If you&apos;re building out your liability limits rather than checking a claim, the{" "}
            <Link href="/tools/auto/car-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              car insurance coverage calculator
            </Link>{" "}
            sizes a limit to your actual assets and income instead of a state minimum.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that explain how coverage actually
            works instead of just quoting a price. Nothing you type here leaves your browser, and every
            tool is designed to leave you better prepared for the conversation you eventually have with a
            licensed agent, claims adjuster, or regulator.
          </p>
        </section>
      </div>
    </>
  );
}

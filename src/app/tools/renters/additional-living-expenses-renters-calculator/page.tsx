import type { Metadata } from "next";
import Link from "next/link";
import { AdditionalLivingExpensesRentersCalculatorTool } from "@/components/tools/AdditionalLivingExpensesRentersCalculatorTool";
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

const tool = getToolBySlug("additional-living-expenses-renters-calculator")!;

const TITLE = "Additional Living Expenses Calculator for Renters";
const DESCRIPTION =
  "Use this additional living expenses calculator for renters to estimate loss-of-use costs, plus whether your lease still requires rent while you're displaced.";
const PAGE_URL = `${SITE_URL}/tools/renters/additional-living-expenses-renters-calculator`;

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
    question: "Does renters insurance pay for a hotel while my apartment is being repaired?",
    answer:
      "It can, but only through the policy's loss of use (sometimes called ALE, or additional living expenses) coverage, and only when the reason you can't live there is a peril your policy actually covers, such as a fire, a burst pipe, or wind damage. It reimburses the increase over your normal cost of living, so it pays the gap between what a hotel or short-term rental costs and what you'd normally spend on housing, not the full nightly rate. If the damage came from something excluded on your policy, like a slow maintenance issue the landlord never fixed, loss of use typically doesn't apply.",
  },
  {
    question: "Do I still have to pay rent if I can't live in my apartment?",
    answer:
      "It depends on your specific lease and your state's landlord-tenant law, and the honest answer is that it varies enough that no calculator can tell you for certain. Some leases and some states release a tenant from rent once a unit becomes legally uninhabitable; others don't automatically end the obligation without a formal process. This tool lets you enter a monthly rent figure if you believe you're still on the hook, so you can see the total displacement cost, but you should confirm the actual answer against your lease and your local tenant rights resources before assuming either way.",
  },
  {
    question: "Is my landlord's insurance responsible for my temporary housing?",
    answer:
      "No. A landlord's policy is built to protect the building structure and the landlord's own liability, not the tenant's personal belongings or the tenant's cost of living somewhere else during repairs. That gap is exactly the reason renters insurance and its loss of use coverage exist, and it's the most common misunderstanding this tool is built to correct before a tenant discovers it during an actual displacement.",
  },
  {
    question: "How much loss of use coverage do I actually need as a renter?",
    answer:
      "Enough to cover a realistic local hotel or short-term rental rate for as long as a typical covered repair takes in your area, plus any extra recurring costs like pet boarding or a longer commute. This calculator asks for those specific numbers instead of assuming a number for you, because hotel rates and repair timelines vary enormously by city and by the type of damage. If you already know your policy's loss of use limit, enter it to see whether a realistic scenario would exhaust it.",
  },
  {
    question: "What's the difference between loss of use coverage and constructive eviction?",
    answer:
      "Loss of use is an insurance term describing what your renters policy reimburses after a covered loss displaces you. Constructive eviction is a legal concept describing when a landlord's failure to maintain a habitable unit is serious enough that a tenant is treated as having been effectively evicted, even without a formal eviction filing. The two can overlap in the same situation, but one is a policy benefit and the other is a legal claim, and this calculator only estimates the insurance side of that overlap.",
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

export default function AdditionalLivingExpensesRentersCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Additional Living Expenses Calculator for Renters
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Estimate what a covered displacement from your rented home would actually cost, and see the
            one nuance a homeowner never has to think about: whether your lease still expects rent while
            you&apos;re living somewhere else.
          </p>
          <LastUpdated category="renters" />
        </div>

        <div className="mt-2">
          <AdditionalLivingExpensesRentersCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-ale-renters-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What This Additional Living Expenses Calculator for Renters Does
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            When a covered loss, a kitchen fire, a burst supply line, storm damage to the roof above your
            unit, makes a rented apartment or house temporarily unlivable, a renters insurance policy&apos;s
            loss of use coverage is what reimburses the extra cost of living somewhere else while it&apos;s
            repaired. This calculator turns that abstract benefit into an actual number by asking for the
            three things that drive it: a realistic local temporary housing rate you look up yourself, how
            long the displacement is likely to run, and any other extra daily costs the move creates.
            Enter a current loss of use limit from your declarations page and the tool checks it against
            the scenario immediately, no waiting on a quote or a claims adjuster to tell you if you&apos;re
            underinsured.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use This Tool</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            It&apos;s built for two different moments. The first is before anything happens: a renter
            comparing policies or reviewing an existing one who wants to know whether the loss of use
            limit is actually large enough for their city&apos;s hotel rates, not just a default number the
            insurer picked. The second is during an active displacement, when a tenant staying in a hotel
            or short-term rental needs a fast, concrete estimate of what they should be tracking and
            claiming, rather than guessing at what &ldquo;reasonable additional expenses&rdquo; means in
            practice.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Rent Question a Homeowner Never Has to Ask
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A homeowner displaced by a covered loss still has a mortgage that doesn&apos;t pause for the
            repair, so their added cost is simply the temporary housing on top of a payment that was
            already happening. A renter&apos;s situation branches. Some leases end a tenant&apos;s rent obligation
            once a unit is legally uninhabitable, and some states&apos; landlord-tenant law does the same
            automatically; other leases and other states don&apos;t release the tenant without a formal
            process, which can leave a displaced renter paying for an apartment they can&apos;t use while also
            paying for the place they&apos;re staying instead. This calculator has a field for exactly that:
            enter a monthly rent figure only if you believe your lease still holds you to it, and the tool
            shows that prorated amount as its own line, separate from the loss of use estimate, since your
            policy&apos;s loss of use coverage was never designed to reimburse a continuing rent payment. The
            honest answer to whether your specific lease still applies is one this tool can&apos;t give you;
            that requires reading the actual lease language and checking your state or local tenant rights
            organization.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Estimate Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator multiplies your entered nightly temporary housing rate plus any extra daily
            costs by the number of displacement days you expect, producing the total loss of use need.
            That&apos;s the same core mechanic behind a homeowner&apos;s ALE claim, because the underlying
            insurance concept is identical: reimburse the increase over normal living costs, not the full
            cost of the replacement housing. If you enter a current policy limit, the tool subtracts it
            from the estimate to show a shortfall or a surplus, and converts your limit into roughly how
            many days of coverage it actually buys at your entered daily rate, which is a more useful
            number than the dollar limit alone.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Realistic Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A tenant&apos;s unit floods from an upstairs neighbor&apos;s burst washing machine hose, a covered
            water damage loss under most renters policies. Repairs are expected to take three weeks, so
            they enter 21 displacement days. A nearby extended-stay hotel runs $95 a night, and boarding
            their dog adds another $25 a day, for a combined daily cost of $120. That comes to an
            estimated $2,520 loss of use need. Their renters policy carries a $3,000 loss of use limit, so
            the tool shows a $480 surplus and confirms the limit would stretch to roughly 25 days at that
            daily rate. Their lease doesn&apos;t address displacement rent explicitly, so they leave that
            field blank and instead plan to ask their landlord directly, rather than assume either answer.
          </p>

          <AdInArticle slot="tool-ale-renters-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Common Mistake This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The mistake this page exists to correct is assuming the landlord&apos;s own insurance will cover
            a tenant&apos;s hotel bill after a covered loss. It won&apos;t. A landlord&apos;s policy is scoped to the
            building and the landlord&apos;s liability, not a tenant&apos;s personal displacement costs, which is
            precisely the coverage gap renters insurance and its loss of use provision are built to close.
            A second, quieter mistake is carrying a loss of use limit that was set as a policy default
            years ago and never checked against what local hotel rates actually cost today.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool simply multiplies the numbers you enter; it doesn&apos;t know your policy&apos;s exact
            wording, any per-day or total dollar cap your insurer applies to loss of use, actual local
            hotel or rental pricing, how long your specific repair will run, or how your lease and state
            treat rent during displacement. It also can&apos;t tell you whether a given loss is covered at
            all, since that depends on the peril and your policy&apos;s exclusions. Treat every figure here as
            a planning estimate to bring into a conversation with your agent, your adjuster, or a tenant
            rights organization, not as a guaranteed claim outcome.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Loss of use coverage</strong> — the part of a renters policy, sometimes labeled
              additional living expenses or ALE, that reimburses the increase in living costs when a
              covered loss makes your rented home temporarily uninhabitable.
            </li>
            <li>
              <strong>Habitability</strong> — the legal standard requiring a rental unit to meet basic
              safety and living conditions; a serious failure to meet it can trigger tenant remedies under
              state or local law.
            </li>
            <li>
              <strong>Constructive eviction</strong> — a legal claim that a landlord&apos;s failure to keep a
              unit habitable was severe enough to force the tenant out, treated similarly to an actual
              eviction even without a formal filing.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For more on what a renters policy typically covers, the{" "}
            <a
              href="https://www.iii.org/article/renters-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            explains loss of use alongside a policy&apos;s other core coverages, and its{" "}
            <a
              href="https://www.iii.org/article/your-renters-insurance-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              renters insurance guide
            </a>{" "}
            walks through how to size coverage limits. For the rent-during-displacement question, the{" "}
            <a
              href="https://www.hud.gov/topics/rental_assistance/tenantrights"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              U.S. Department of Housing and Urban Development
            </a>{" "}
            links to state-specific tenant rights resources, since that answer depends on where you live.
            To confirm your own state&apos;s insurance rules or find your regulator, use the{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NAIC&apos;s directory of state insurance departments
            </a>
            .
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/renters" className="text-blue-600 hover:underline">
              Renters insurance tools
            </Link>{" "}
            category. To check whether your overall personal property and liability limits make sense
            alongside this loss of use estimate, try the{" "}
            <Link href="/tools/renters/renters-insurance-coverage-calculator" className="text-blue-600 hover:underline">
              renters insurance coverage calculator
            </Link>
            . Homeowners facing the same displacement question, minus the lease complication, can use the{" "}
            <Link href="/tools/home/additional-living-expenses-calculator" className="text-blue-600 hover:underline">
              additional living expenses calculator for homeowners
            </Link>
            .
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that turn insurance policy language
            into numbers you can actually use. Nothing you type here is saved or sent anywhere, and every
            tool is designed to leave you better prepared for a conversation with a licensed agent, an
            adjuster, or, when a policy question turns into a legal one, a tenant rights organization.
          </p>
        </section>
      </div>
    </>
  );
}

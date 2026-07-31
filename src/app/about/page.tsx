import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { DisplayHeading, DitherField, Eyebrow, SectionRule } from "@/components/brand";
import { CatalogChart } from "@/components/about/CatalogChart";
import { CATEGORY_AUTHORITY } from "@/lib/sources";
import { CATEGORY_ORDER } from "@/lib/category-content";

const CATEGORY_COUNT = CATEGORY_ORDER.length;

const TITLE = "About Insurance Tools | Free Insurance Calculators";
const DESCRIPTION =
  "Insurance Tools publishes free insurance calculators built on standard, checkable coverage math. Read how the tools are built, funded, and kept current.";
const CANONICAL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
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

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: TITLE,
  description: DESCRIPTION,
  url: CANONICAL,
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: `Publisher of free insurance calculators covering auto, home, life, health, business, and ${CATEGORY_COUNT - 5} more coverage categories.`,
  },
};

/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    index: "01",
    title: "You bring the question",
    body:
      "Search the spotlight for the decision in front of you, or open the category it belongs to. There is one calculator per question rather than one estimator with a mode switch, so the tool you land on asks only for the inputs your situation actually has.",
  },
  {
    index: "02",
    title: "Your numbers stay with you",
    body:
      "Every calculation runs in your browser. Nothing you type is posted to a server, attached to an account, or stored, which is what makes it safe to put a real salary or a real debt balance into the form instead of a rounded guess.",
  },
  {
    index: "03",
    title: "The math is on the page",
    body:
      "Results recompute on every keystroke, and the math behind them is stated openly. A coverage recommendation arrives split into dwelling and liability; a deductible comparison arrives split into premium savings and break-even point.",
  },
  {
    index: "04",
    title: "You can check the work",
    body:
      "Because the formula is standard rather than proprietary, you can verify any result against a textbook, a lender, or the agency that publishes the underlying figures. That is the whole point: a number you cannot check is not much better than a guess.",
  },
];

const PRINCIPLES = [
  {
    title: "Standard coverage math, checked against a named source",
    body:
      "Needs analysis, deductible break-even, and claims math as used across the industry. Every tool page names the specific regulatory or industry body its category is checked against and links directly to that body's own published guidance, not a summary of it.",
  },
  {
    title: "Free, with no second tier",
    body:
      "Advertising funds the site. There is no paid plan, so there is no feature held back to create one, and no calculator that stops halfway to ask for an email address.",
  },
  {
    title: "Estimates labelled as estimates",
    body:
      "A result here is a planning number, not an offer. Fees, underwriting, and rounding sit outside what we can see, so we say where a figure is likely to move rather than implying a precision we do not have.",
  },
  {
    title: "No claims we cannot support",
    body:
      "You will not find visitor counts, testimonials, or trust badges on this site. The verifiable facts are the size of the catalog and the math inside it, so those are the only things we point at.",
  },
];

export default function AboutPage() {
  return (
    <>
      <StructuredData data={orgSchema} />

      {/* Opening */}
      <section className="relative overflow-hidden border-b border-hairline bg-white px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 dot-field pattern-fade-b opacity-70"
        />
        <div className="relative z-10 mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-6 text-[2.1rem] font-light leading-[1.1] tracking-[-0.03em] text-slate-400 sm:text-5xl lg:text-6xl">
              Quote forms are everywhere.{" "}
              <span className="font-medium text-slate-900">
                Coverage math you can check is not.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Insurance Tools is a library of free insurance calculators across {CATEGORY_COUNT}{" "}
              categories. It exists because the gap between a coverage question and a trustworthy
              answer is usually not knowledge, it is math nobody wants to set up before the quote
              form asks for a phone number.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why it exists */}
      <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="panel aspect-[4/3] overflow-hidden bg-slate-50">
              <DitherField variant="peak" columns={38} aspect={1.33} className="text-slate-900" />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Why it exists</Eyebrow>
              <DisplayHeading
                className="mt-6"
                lead="Most people do not need an agent"
                emphasis="to answer the question they actually have"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-7 space-y-4 text-sm leading-relaxed text-slate-500 sm:text-base">
                <p>
                  How much liability coverage actually protects me? Is a $500 or $1,000 deductible
                  the better deal? What would a total loss actually pay out? These are math questions
                  with defensible answers, and the only thing standing between you and the answer is
                  the setup: knowing the formula, gathering the inputs, and trusting the result.
                </p>
                <p>
                  Doing that once is fine. Doing it for every policy, and doing it while a quote form
                  is already asking for your phone number, is where people give up and accept
                  whichever coverage amount they were handed. That is the gap this site is built to
                  close.
                </p>
                <p>
                  So each calculator here is narrow on purpose. It asks for what its question needs
                  and nothing else, it answers as you type, and it shows the working. That is a
                  lower bar than insurance advice and a much more useful one, because you can verify
                  it yourself.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <Eyebrow>How it works</Eyebrow>
            <DisplayHeading
              className="mt-6"
              lead="Four things happen"
              emphasis="between your question and your answer"
            />
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {STEPS.map((step) => (
              <StaggerItem key={step.index}>
                <div className="border-t border-hairline-strong pt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="label-mono text-blue-600">{step.index}</span>
                    <h2 className="text-sm font-semibold text-slate-900">{step.title}</h2>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Catalog composition, straight from the registry. */}
      <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>The catalog</Eyebrow>
            <DisplayHeading
              className="mt-6 mb-10"
              lead="What is actually here,"
              emphasis="counted rather than claimed"
            />
          </Reveal>
          <Reveal delay={0.06}>
            <CatalogChart />
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <Eyebrow>What we hold to</Eyebrow>
            <DisplayHeading
              className="mt-6"
              lead="Four commitments that decide"
              emphasis="what ships and what does not"
            />
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <StaggerItem key={principle.title} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-hairline-strong bg-white p-7">
                  <h2 className="text-[15px] font-semibold text-slate-900">{principle.title}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{principle.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Sources: who "reviews" this, stated as what it actually is. */}
      <section id="sources" className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-3xl">
            <Eyebrow>Who checks the numbers</Eyebrow>
            <DisplayHeading
              className="mt-6"
              lead="Not a named reviewer."
              emphasis={`${CATEGORY_COUNT} named authorities, linked directly.`}
            />
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              No one on this team is a licensed insurance agent, and a byline claiming otherwise
              would be worse than none at all. Instead, every one of the {CATEGORY_COUNT} categories
              below is tied to the specific regulatory or industry body that actually publishes the
              definitions, rules, or guidance its calculators are built on. Every tool page links to
              that body&apos;s own page in its Last Updated line, and the same citation is embedded
              in the page&apos;s structured data.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CATEGORY_AUTHORITY).map(([slug, authority]) => (
              <StaggerItem key={slug}>
                <a
                  href={authority.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-hairline-strong bg-white p-6 transition-colors hover:border-blue-200"
                >
                  <span className="label-mono text-slate-400">{slug.toUpperCase()}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[15px] font-semibold text-slate-900 group-hover:text-blue-600">
                    {authority.shortName}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 text-sm capitalize leading-relaxed text-slate-500">
                    {authority.description}
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Funding, stated plainly */}
      <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Eyebrow>How it is paid for</Eyebrow>
            <SectionRule className="mt-6" label="01" />
            <h2 className="mt-8 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              Advertising, and nothing else
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-600">
              <p>
                The site carries advertising. That is the entire business model, and it is worth
                saying plainly because it explains the things you would otherwise have to guess at:
                why there is no account, why nothing asks for your email, and why no calculator
                stops at the interesting part and offers to show you the rest for a fee.
              </p>
              <p>
                It also sets a limit we hold to. We do not sell the figures you enter, because they
                never reach us. We do not broker leads to insurers, so no result is tilted toward a
                policy that pays us. If a calculator tells you a coverage upgrade is not worth it,
                that is simply what the math said.
              </p>
              <p>
                Nothing on this site is insurance advice. It is math applied to numbers you supply,
                offered for educational and informational purposes, and it works best as preparation
                for a conversation with a licensed agent who knows your full situation. The{" "}
                <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-700">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-700">
                  privacy policy
                </Link>{" "}
                spell out the rest.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Close */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.16]">
          <DitherField variant="basin" columns={64} aspect={2.8} className="text-blue-700" />
        </div>
        <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="text-[1.7rem] font-light leading-[1.15] tracking-[-0.03em] text-slate-400 sm:text-4xl">
            The catalog is open.{" "}
            <span className="font-medium text-slate-900">No sign-up, no meter.</span>
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/explore"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
            >
              Explore all {CATEGORY_COUNT} categories
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
            >
              Report an error
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

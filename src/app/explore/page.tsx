import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { SearchBox } from "@/components/search";
import { AdLeaderboard, AdInArticle, AdMultiplex } from "@/components/ads";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import {
  generatePageMetadata,
  breadcrumbStructuredData,
  faqStructuredData,
  collectionPageStructuredData,
  SITE_URL,
} from "@/lib/seo";
import { EXPLORE_CATEGORIES, TOTAL_CATEGORY_COUNT, EXPLORE_FAQS } from "./data";
import { CategoryGrid } from "./CategoryGrid";

const PAGE_TITLE = "Explore Insurance Calculators | Insurance Tools";
const PAGE_DESCRIPTION =
  "Explore insurance calculators for every coverage decision: auto, home, life, health, business, claims, and more. Browse 12 categories or search.";

export const metadata: Metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/explore",
  keywords: [
    "explore insurance calculators",
    "insurance calculators",
    "free insurance tools",
    "coverage calculators",
    "online insurance tools",
  ],
});

const breadcrumbJsonLd = breadcrumbStructuredData([
  { name: "Home", url: SITE_URL },
  { name: "Explore", url: `${SITE_URL}/explore` },
]);

const collectionJsonLd = collectionPageStructuredData({
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/explore`,
  items: EXPLORE_CATEGORIES.map((category) => ({
    name: `${category.name} Insurance`,
    url: `${SITE_URL}/tools/${category.slug}`,
  })),
});

const faqJsonLd = faqStructuredData(EXPLORE_FAQS);

export default function ExplorePage() {
  return (
    <>
      <StructuredData data={[breadcrumbJsonLd, collectionJsonLd, faqJsonLd]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BreadcrumbNav items={[{ name: "Home", href: "/" }, { name: "Explore" }]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center">
        <Reveal>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            Explore Insurance Calculators
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Every insurance calculator category on Insurance Tools in one place. Browse{" "}
            {TOTAL_CATEGORY_COUNT} categories, or search to jump straight to the one you need.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBox size="lg" />
          </div>
        </Reveal>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdLeaderboard slot="explore-top" className="mb-10" />
      </div>

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Reveal>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Browse by category</h2>
            <p className="text-slate-600">
              Every category links to a full hub page. Calculators ship into each one over time.
            </p>
          </div>
        </Reveal>
        <CategoryGrid categories={EXPLORE_CATEGORIES} />
      </section>

      {/* SEO article */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Reveal>
          <article className="prose-like">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How to Choose the Right Insurance Calculator
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Whether you are buying your first car insurance policy, comparing deductible options on
              a homeowners renewal, or trying to work out what a claim might actually pay, the right
              insurance calculator turns a vague question into a concrete number. That is the entire
              purpose of this Explore page: it is the single place to explore insurance calculators
              covering every stage of a coverage decision, from figuring out how much you need to
              understanding what a settlement offer should look like. Instead of guessing or filling
              out a quote form just to see a number, you can plug in your own figures and see the
              result instantly, with no sign-up and no cost.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our free insurance tools are organized into 12 categories so you can narrow down
              quickly.{" "}
              <Link href="/tools/coverage" className="text-blue-600 hover:underline">
                Coverage
              </Link>{" "}
              calculators answer the question that should come before any quote: how much insurance
              do you actually need. If you are managing an active loss, the{" "}
              <Link href="/tools/claims" className="text-blue-600 hover:underline">
                Claims
              </Link>{" "}
              category walks through payout and settlement math step by step. Anyone comparing
              deductible levels will want the{" "}
              <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
                Deductibles
              </Link>{" "}
              hub, while auto, home, life, health, and business coverage each have their own
              dedicated category below.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">
              Why Use an Insurance Calculator Instead of a Quote Form
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              A quote form is built to collect your contact information, not to help you decide how
              much coverage you need. It&apos;s easy to under-request or over-request coverage when the
              form is the first thing you interact with. Our insurance calculators use the same
              standard coverage and claims methodology used across the industry, tested against
              public regulatory guidance, so you get a defensible starting number before a single
              form asks for your name or phone number. Each calculator also explains what the inputs
              mean and what the output represents, so you are not just getting a figure, you are
              building an understanding of the coverage math behind it. That matters most for
              higher-stakes decisions like liability limits, life insurance amounts, or deductible
              levels, where a misunderstanding can cost real money.
            </p>

            <AdInArticle slot="explore-mid" />

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">
              Insurance Calculators for Every Stage
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Before you buy, the{" "}
              <Link href="/tools/coverage" className="text-blue-600 hover:underline">
                coverage calculators
              </Link>{" "}
              and category-specific tools help you size a policy correctly. As you compare offers,
              the{" "}
              <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
                deductible calculators
              </Link>{" "}
              show the break-even math between options. After a loss, the{" "}
              <Link href="/tools/claims" className="text-blue-600 hover:underline">
                claims calculators
              </Link>{" "}
              estimate what a settlement should look like before you accept an offer. No matter where
              you are in that process, the goal of every calculator here is the same: turn
              uncertainty into a clear, actionable number.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              For rules that go beyond what any calculator can model, it is worth consulting primary
              sources directly. The{" "}
              <a
                href="https://content.naic.org/consumer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                NAIC <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>{" "}
              publishes consumer guidance across every line of insurance, while your state&apos;s
              Department of Insurance explains the specific minimum requirements and consumer
              protections that apply where you live. For health plan terminology and rules, the{" "}
              <a
                href="https://www.healthcare.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                HealthCare.gov <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>{" "}
              glossary is a reliable, unbiased starting point.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Getting the Most Accurate Results</h3>
            <p className="text-slate-700 leading-relaxed">
              Insurance calculators are only as good as the numbers you put into them. Use your
              actual home value, income, or vehicle value, not a rounded estimate, and account for
              state-specific requirements where a tool allows it, since those factors change the
              right answer meaningfully. Revisit your calculations periodically, especially after a
              move, a major purchase, or a life event, because a coverage amount sized to last year&apos;s
              circumstances can drift out of date quickly. When in doubt, run the same scenario
              through two related tools, for example a coverage calculator and a deductible
              calculator, to sanity check the result before making a purchase decision.
            </p>
          </article>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently asked questions</h2>
        </Reveal>
        <Stagger className="space-y-4" delay={0.05}>
          {EXPLORE_FAQS.map((faq) => (
            <StaggerItem key={faq.question}>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AdMultiplex slot="explore-bottom" />
      </div>

      {/* Closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <Reveal>
          <div className="rounded-2xl bg-blue-600 px-8 py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Can&apos;t find the calculator you need?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Try the search page for a more detailed view, or browse straight to a category above.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
            >
              Go to search
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem, AnimatedNumber } from "@/components/motion";
import { Eyebrow } from "@/components/brand";
import { TOTAL_CATEGORY_COUNT } from "./data";

/**
 * The numbers band.
 *
 * Every figure here is a structural fact about how the site works. There
 * are no traffic counts, no user totals, and no "trusted by N teams",
 * because we do not have those numbers and inventing them on a site about
 * insurance would be indefensible. What is here is verifiable by anyone who
 * opens the catalog, which is a stronger claim than a statistic nobody can
 * check.
 *
 * It also earns its place for search: the copy carries the focus keyword and
 * category terms in context, and the two links push authority into the
 * highest value hubs rather than dead-ending on a decorative band.
 */

export function SocialProof() {
  return (
    <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Eyebrow>By the numbers</Eyebrow>
            <h2 className="mt-6 text-[2rem] font-light leading-[1.08] tracking-[-0.035em] text-slate-400 sm:text-5xl lg:text-6xl">
              Figures you can{" "}
              <span className="font-medium text-slate-900">check for yourself</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-slate-500">
              No traffic claims and no logo wall. Every number below is a fact about the catalog,
              countable by opening it.
            </p>
            <Link
              href="/explore"
              className="mt-4 inline-flex items-center gap-1.5 border-b border-slate-300 pb-0.5 text-sm font-medium text-slate-900 transition-colors hover:border-blue-600 hover:text-blue-600"
            >
              Explore the full catalog
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Lead card: the shape of the catalog. */}
          <StaggerItem className="md:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline-strong bg-blue-600 p-6 sm:p-8">
              <div className="flex items-baseline gap-2.5">
                <p className="text-5xl font-semibold tracking-[-0.04em] text-white tabular-nums sm:text-7xl">
                  <AnimatedNumber value={TOTAL_CATEGORY_COUNT} />
                </p>
                <span className="text-base font-medium text-blue-100 sm:text-lg">
                  categories, live from day one
                </span>
              </div>
              <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-blue-50 sm:text-sm">
                Auto, home, life, health, and business coverage, plus claims, deductibles, coverage
                needs, and state requirements. Calculators ship into this structure category by
                category, so nothing here is a placeholder waiting to be renamed later.
              </p>
            </div>
          </StaggerItem>

          {/* No lead-gen business model. */}
          <StaggerItem>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline-strong bg-white p-6 sm:p-8">
              <div className="flex items-baseline gap-1.5">
                <p className="text-5xl font-semibold tracking-[-0.04em] text-slate-900 tabular-nums sm:text-7xl">
                  <AnimatedNumber value={0} />
                </p>
                <span className="text-xl font-medium text-slate-400 sm:text-3xl">leads sold</span>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-slate-500 sm:text-sm">
                This isn&apos;t a quote funnel. No calculator asks who you are before showing a
                result, and your information is never sold to an insurer.
              </p>
            </div>
          </StaggerItem>

          {/* Cost. */}
          <StaggerItem>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline-strong bg-white p-6 sm:p-8">
              <div className="flex items-baseline gap-1">
                <p className="text-5xl font-semibold tracking-[-0.04em] text-slate-900 tabular-nums sm:text-7xl">
                  <AnimatedNumber value={0} prefix="$" />
                </p>
                <span className="text-xl font-medium text-slate-400 sm:text-3xl">forever</span>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-slate-500 sm:text-sm">
                The site is funded by advertising, so there is no paywall to hit, no upgrade prompt,
                and no feature held back for a paid tier.
              </p>
            </div>
          </StaggerItem>

          {/* Privacy, stated as a number. */}
          <StaggerItem className="md:col-span-2">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-hairline-strong bg-slate-900 p-6 sm:p-8">
              <div className="flex items-baseline gap-2.5">
                <p className="text-5xl font-semibold tracking-[-0.04em] text-white tabular-nums sm:text-7xl">
                  <AnimatedNumber value={0} />
                </p>
                <span className="text-base font-medium text-slate-300 sm:text-lg">
                  figures sent to a server
                </span>
              </div>
              <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-slate-400 sm:text-sm">
                Calculations run entirely in your browser. Salary, debt balances, and savings totals
                never leave the page, are never attached to an account, and are never stored,
                because there is no account to attach them to.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

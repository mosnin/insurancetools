import Link from "next/link";
import { Reveal } from "@/components/motion";
import { ArrowRight } from "lucide-react";
import { Marquee, Eyebrow, CategoryIcon, type CategoryIconName } from "@/components/brand";
import { CATEGORY_ORDER, CATEGORY_CONTENT } from "@/lib/category-content";

/**
 * Two counter-travelling bands of category chips.
 *
 * This exists to do a job, not to move: it puts every category link in the
 * server-rendered HTML, twice over. The motion is a bonus on top of that,
 * and it pauses the moment a visitor hovers or tabs into the row so a
 * moving target never costs them a click. Once individual calculators ship,
 * this can graduate to tool-level chips the same way the reference build
 * did; until then, category chips are the real, non-empty thing to show.
 */

const ROW_ONE: CategoryIconName[] = ["auto", "home", "life", "health", "business", "renters"];
const ROW_TWO: CategoryIconName[] = ["travel", "pet", "claims", "deductibles", "coverage", "state-requirements"];

function Chip({ slug }: { slug: CategoryIconName }) {
  const content = CATEGORY_CONTENT[slug];
  return (
    <Link
      href={`/tools/${slug}`}
      className="group flex shrink-0 items-center gap-3 rounded-xl border border-hairline-strong bg-white py-3 pl-3 pr-5 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-900 transition-colors group-hover:bg-white group-hover:text-blue-600">
        <CategoryIcon name={slug} size={22} />
      </span>
      <span className="flex flex-col">
        <span className="whitespace-nowrap text-sm font-medium text-slate-900">
          {content.displayName} Insurance
        </span>
        <span className="label-mono text-slate-400">CALCULATORS</span>
      </span>
    </Link>
  );
}

export function ToolMarquee() {
  return (
    <section className="overflow-hidden border-b border-hairline bg-white py-16 sm:py-20">
      <Reveal className="mx-auto mb-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <Eyebrow>Every category, one search away</Eyebrow>
        <p className="mt-5 max-w-2xl text-[1.6rem] font-light leading-[1.15] tracking-[-0.03em] text-slate-400 sm:text-3xl">
          A calculator for the coverage in front of you,{" "}
          <span className="font-medium text-slate-900">not the closest match to it</span>
        </p>
      </Reveal>

      <div className="space-y-4">
        <Marquee duration={50}>
          {ROW_ONE.map((slug) => (
            <Chip key={slug} slug={slug} />
          ))}
        </Marquee>
        <Marquee duration={56} reverse>
          {ROW_TWO.map((slug) => (
            <Chip key={slug} slug={slug} />
          ))}
        </Marquee>
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-t border-hairline-strong pt-8 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-base font-semibold text-slate-900">Every category</h3>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Full directory of all {CATEGORY_ORDER.length} categories
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_ORDER.map((slug) => (
            <Link
              key={slug}
              href={`/tools/${slug}`}
              className="group flex items-center justify-between gap-4 border-b border-hairline py-3.5 transition-colors hover:border-blue-200"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-1 w-1 shrink-0 bg-slate-300 transition-colors group-hover:bg-blue-600"
                />
                <span className="truncate text-sm text-slate-700 transition-colors group-hover:text-slate-900">
                  {CATEGORY_CONTENT[slug].displayName} Calculators
                </span>
              </span>
              <span className="label-mono shrink-0 text-slate-300 transition-colors group-hover:text-blue-600">
                {slug.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

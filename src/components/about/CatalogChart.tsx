import Link from "next/link";
import { CATEGORY_ORDER, CATEGORY_CONTENT } from "@/lib/category-content";
import { TOOLS } from "@/lib/tools";

/**
 * Catalog composition chart.
 *
 * Every column is a real category from the taxonomy, and every bar height
 * is a live count of published calculators in that category, read from the
 * registry at build time. The library launched with the full taxonomy in
 * place and zero calculators, so every bar starts flat; nothing here is a
 * placeholder, so the chart cannot drift out of date as tools are added.
 *
 * Each column is a link into its category hub, which makes the chart a
 * genuine internal linking surface rather than decoration.
 */

interface Bar {
  slug: string;
  name: string;
  count: number;
}

function catalogBars(): Bar[] {
  const counts = new Map<string, number>();
  for (const tool of TOOLS) {
    counts.set(tool.categorySlug, (counts.get(tool.categorySlug) ?? 0) + 1);
  }
  return CATEGORY_ORDER.map((slug) => ({
    slug,
    name: CATEGORY_CONTENT[slug].displayName,
    count: counts.get(slug) ?? 0,
  }));
}

/** Split a bar into three stacked segments so it reads as measured, not painted. */
function segments(pct: number): number[] {
  const base = pct * 0.46;
  const mid = pct * 0.32;
  return [base, mid, pct - base - mid];
}

export function CatalogChart() {
  const bars = catalogBars();
  const max = Math.max(1, ...bars.map((b) => b.count));
  const total = bars.reduce((sum, b) => sum + b.count, 0);
  const deepest = bars.reduce((best, b) => (b.count > best.count ? b : best), bars[0]);

  return (
    <figure className="rounded-2xl border border-hairline-strong bg-white p-6 sm:p-8">
      <figcaption className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-2xl">
            What the catalog covers
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Published calculators per category, counted from the live registry.
          </p>
        </div>
        <span className="label-mono shrink-0 self-start rounded-full border border-hairline-strong px-3 py-1.5 text-slate-500">
          {total} TOTAL
        </span>
      </figcaption>

      <div className="flex h-52 items-end justify-between gap-1.5 sm:h-60 sm:gap-3">
        {bars.map((bar, i) => {
          const pct = (bar.count / max) * 100;
          const [base, mid, top] = segments(pct);
          const isDeepest = total > 0 && bar.slug === deepest.slug;
          return (
            <div key={bar.slug} className="contents">
              {i > 0 && (
                <div className="hidden h-40 items-stretch sm:flex" aria-hidden="true">
                  <div className="w-px border-l border-dotted border-slate-300" />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end justify-center">
                  <Link
                    href={`/tools/${bar.slug}`}
                    aria-label={`${bar.name}: ${bar.count} calculators`}
                    className="group flex h-full w-7 flex-col justify-end overflow-hidden rounded-full border border-hairline-strong bg-slate-50 transition-colors hover:border-blue-300 sm:w-9"
                  >
                    <span
                      className={`w-full transition-colors ${isDeepest ? "bg-blue-200" : "bg-slate-200 group-hover:bg-blue-100"}`}
                      style={{ height: `${base}%` }}
                    />
                    <span
                      className={`w-full transition-colors ${isDeepest ? "bg-blue-400" : "bg-slate-300 group-hover:bg-blue-200"}`}
                      style={{ height: `${mid}%` }}
                    />
                    <span
                      className={`w-full transition-colors ${isDeepest ? "bg-blue-600" : "bg-slate-400 group-hover:bg-blue-400"}`}
                      style={{ height: `${top}%` }}
                    />
                  </Link>

                  {isDeepest ? (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2">
                      <span className="label-mono rounded-full bg-slate-900 px-2 py-1 text-white">
                        {bar.count}
                      </span>
                    </span>
                  ) : (
                    <span className="label-mono absolute -top-6 left-1/2 -translate-x-1/2 text-slate-500">
                      {bar.count}
                    </span>
                  )}
                </div>
                <span
                  className={`w-full truncate text-center text-[10px] sm:text-[11px] ${
                    isDeepest ? "font-semibold text-slate-900" : "text-slate-500"
                  }`}
                >
                  {bar.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-hairline pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-full border border-hairline-strong bg-blue-600"
          />
          Calculators published in each category
        </span>
        <p>
          {bars.length} categories, {total > 0 ? "growing" : "launching first"}
        </p>
      </div>
    </figure>
  );
}

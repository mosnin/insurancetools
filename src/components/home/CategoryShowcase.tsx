import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { CategoryMark } from "@/components/category/icons";
import { DisplayHeading, Eyebrow } from "@/components/brand";
import {
  CATEGORY_META,
  getCategoryFeaturedTools,
  getCategoryToolCount,
  TOTAL_CATEGORY_COUNT,
} from "./data";

function categoryLinkLabel(name: string, count: number): string {
  const lower = name.toLowerCase();
  if (count === 0) return `Browse ${lower} calculators`;
  return `All ${count} ${lower} calculators`;
}

export function CategoryShowcase() {
  // Ordered by how much is actually behind each category. Presenting a two
  // tool category with the same weight as a 129 tool one overstated the thin
  // ones and buried the deep ones.
  const ordered = [...CATEGORY_META].sort(
    (a, b) => getCategoryToolCount(b.slug) - getCategoryToolCount(a.slug)
  );

  return (
    <section
      id="categories"
      className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>The catalog</Eyebrow>
            <DisplayHeading
              className="mt-6"
              lead="Browse every calculator"
              emphasis="by the decision it answers"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Sorted into {TOTAL_CATEGORY_COUNT} categories, from everyday auto coverage to business
            liability. Open a category for the full list as calculators ship.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((meta) => {
            const featured = getCategoryFeaturedTools(meta).slice(0, 4);
            const count = getCategoryToolCount(meta.slug);
            return (
              <StaggerItem key={meta.slug}>
                <div className="group flex flex-col rounded-2xl border border-hairline-strong bg-white p-6 transition-colors hover:border-blue-200">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span className="text-slate-900 transition-colors group-hover:text-blue-600">
                        <CategoryMark name={meta.slug} size={44} />
                      </span>
                      <Link
                        href={`/tools/${meta.slug}`}
                        className="text-[15px] font-semibold text-slate-900 transition-colors hover:text-blue-600"
                      >
                        {meta.name}
                      </Link>
                    </span>
                    <span className="label-mono text-slate-400">{count}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{meta.description}</p>

                  <ul className="mt-5 space-y-1.5 border-t border-hairline pt-4">
                    {featured.map((tool) => (
                      <li key={tool.slug}>
                        <Link
                          href={`/tools/${tool.categorySlug}/${tool.slug}`}
                          className="text-[13px] text-slate-500 transition-colors hover:text-blue-600"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/tools/${meta.slug}`}
                    className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    {categoryLinkLabel(meta.name, count)}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

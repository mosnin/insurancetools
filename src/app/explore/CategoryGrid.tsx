import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem, HoverLift } from "@/components/motion";
import { CategoryMark } from "@/components/category/icons";
import type { ExploreCategory } from "./data";

export function CategoryGrid({ categories }: { categories: ExploreCategory[] }) {
  return (
    <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" delay={0.08}>
      {categories.map((category) => {
        const toolCount = category.tools.length;

        return (
          <StaggerItem key={category.slug}>
            <HoverLift className="h-full">
              <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
                    <CategoryMark name={category.icon} size={24} />
                  </span>
                  <span className="text-right">
                    <span className="block text-xs font-semibold text-slate-400">
                      {toolCount > 0 ? toolCount : "Soon"}
                    </span>
                    <span className="block text-xs text-slate-400 font-medium">
                      {toolCount > 0 ? "tools" : "launching"}
                    </span>
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                  <Link href={`/tools/${category.slug}`} className="hover:text-blue-600 transition-colors">
                    {category.name}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">{category.description}</p>

                <Link
                  href={`/tools/${category.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {toolCount > 0 ? `View all ${toolCount} calculators` : `Browse ${category.name.toLowerCase()} calculators`}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </HoverLift>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

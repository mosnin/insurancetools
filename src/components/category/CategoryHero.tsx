import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { FadeIn } from "@/components/motion";
import { CategoryMark } from "./icons";

interface CategoryHeroProps {
  breadcrumbs: { name: string; href?: string }[];
  icon: string;
  h1: string;
  intro: string;
  toolCount: number;
}

export function CategoryHero({ breadcrumbs, icon, h1, intro, toolCount }: CategoryHeroProps) {
  return (
    <div className="pt-8 pb-2">
      <BreadcrumbNav items={breadcrumbs} />
      <FadeIn className="mt-6 flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-fit shrink-0 rounded-2xl border border-hairline-strong bg-white p-4 text-slate-900">
          <CategoryMark name={icon} size={56} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {h1}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">{intro}</p>
          <p className="mt-3 text-sm font-medium text-slate-400">
            {toolCount > 0
              ? `${toolCount} free ${toolCount === 1 ? "calculator" : "calculators"}, updated regularly, no sign-up required.`
              : "New calculators launching soon, always free, no sign-up required."}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

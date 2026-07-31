import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HoverLift, AnimatedNumber } from "@/components/motion";
import { CategoryMark } from "./icons";

interface CategoryIndexCardProps {
  slug: string;
  displayName: string;
  icon: string;
  intro: string;
  toolCount: number;
}

export function CategoryIndexCard({ slug, displayName, icon, intro, toolCount }: CategoryIndexCardProps) {
  return (
    <HoverLift className="h-full">
      <Link
        href={`/tools/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-hairline-strong bg-white p-6 transition-colors hover:border-blue-200"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="text-slate-900 transition-colors group-hover:text-blue-600">
            <CategoryMark name={icon} size={52} />
          </div>
          <ArrowRight
            className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
            aria-hidden="true"
          />
        </div>
        <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
          {displayName} Calculators
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{intro}</p>
        <p className="text-sm font-medium text-slate-400">
          {toolCount > 0 ? (
            <>
              <AnimatedNumber value={toolCount} className="text-slate-900 font-bold" /> free tools
            </>
          ) : (
            "Launching soon"
          )}
        </p>
      </Link>
    </HoverLift>
  );
}

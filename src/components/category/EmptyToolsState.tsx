import Link from "next/link";
import { Reveal } from "@/components/motion";

interface EmptyToolsStateProps {
  categoryName: string;
}

/**
 * Shown on a category page instead of the tool grid while its calculator
 * library is still empty. Insurance Tools launched with the full category
 * taxonomy in place before any individual calculators shipped, so every
 * category page needs to read as "not built yet" rather than broken.
 */
export function EmptyToolsState({ categoryName }: EmptyToolsStateProps) {
  return (
    <Reveal>
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
        <p className="text-base font-semibold text-slate-900">
          {categoryName} calculators are launching soon
        </p>
        <p className="max-w-md text-sm text-slate-500">
          We&apos;re building out this category first. Check back soon, or browse another category
          below in the meantime.
        </p>
        <Link
          href="/tools"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Browse all categories
        </Link>
      </div>
    </Reveal>
  );
}

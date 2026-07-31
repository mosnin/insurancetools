import Link from "next/link";
import type { Tool } from "@/types";

interface RecommendedToolsProps {
  tools: Tool[];
}

export function RecommendedTools({ tools }: RecommendedToolsProps) {
  if (!tools.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.categorySlug}/${tool.slug}`}
            className="group block p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-blue-100 transition-all"
          >
            <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors mb-1">
              {tool.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
            <span className="inline-block mt-2 text-xs font-medium text-blue-600">Open →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

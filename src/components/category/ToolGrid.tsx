import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/types";
import { Reveal, Stagger, StaggerItem, HoverLift } from "@/components/motion";

export interface ToolGroup {
  heading: string;
  tools: Tool[];
}

interface ToolGridProps {
  groups: ToolGroup[];
}

/**
 * Renders the complete grid of every tool in a category, grouped into
 * logical sub-sections with H2 headings when a category has more than one
 * group. This is the internal-linking backbone of each category page, so
 * every tool must be present and every card must link to its own page.
 */
export function ToolGrid({ groups }: ToolGridProps) {
  const showHeadings = groups.length > 1;

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.heading}>
          {showHeadings && (
            <Reveal>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{group.heading}</h2>
            </Reveal>
          )}
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.tools.map((tool) => (
              <StaggerItem key={tool.slug}>
                <HoverLift className="h-full">
                  <Link
                    href={`/tools/${tool.categorySlug}/${tool.slug}`}
                    className="group flex h-full flex-col justify-between p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-blue-100 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                        <ArrowRight
                          className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
                    </div>
                  </Link>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ))}
    </div>
  );
}

"use client";

/**
 * Filter box for a category hub.
 *
 * A hub listing sixty calculators is hard to work through by eye, so this
 * narrows the list as you type. It filters the already-rendered set on the
 * client rather than navigating, which matters for SEO: every tool link for
 * the category stays in the server-rendered HTML and stays crawlable, and
 * filtering only changes what is displayed, never what is in the document.
 *
 * The beam frame appears on focus, matching the homepage spotlight and the
 * command palette, so every search surface on the site behaves the same way.
 */

import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { BeamFrame } from "@/components/brand";
import { ToolCard } from "@/components/brand/ToolCard";
import type { Tool } from "@/types";

export interface CategorySearchProps {
  tools: Tool[];
  categoryName: string;
  /**
   * The default, server-rendered grouped grid. Shown whenever the filter is
   * empty, which is the state every crawler and every first paint sees, so
   * the category's full sub-heading structure and every tool link stay in
   * the delivered HTML. Filtering only ever narrows what is displayed.
   */
  children: ReactNode;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** Avoids "filter 15 calculators calculators" for self-describing names. */
const SELF_DESCRIBING = new Set(["calculators", "planners", "converters"]);

export function CategorySearch({ tools, categoryName, children }: CategorySearchProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const lowerName = categoryName.toLowerCase();
  const filterPlaceholder = SELF_DESCRIBING.has(lowerName)
    ? `Filter ${tools.length} ${lowerName}`
    : `Filter ${tools.length} ${lowerName} calculators`;

  const index = useMemo(
    () =>
      tools.map((tool) => ({
        tool,
        haystack: normalize(
          [tool.name, tool.description, tool.keywords.join(" ")].join(" ")
        ),
      })),
    [tools]
  );

  const terms = normalize(query).split(" ").filter(Boolean);
  const results = useMemo(() => {
    if (!terms.length) return tools;
    return index.filter((e) => terms.every((t) => e.haystack.includes(t))).map((e) => e.tool);
  }, [index, terms, tools]);

  const field = (
    <div
      className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-colors ${
        focused ? "border-blue-200" : "border-hairline-strong"
      }`}
    >
      <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={filterPlaceholder}
        aria-label={`Filter ${categoryName} calculators`}
        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear filter"
          className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="mx-auto max-w-xl">
        {focused ? <BeamFrame strength={0.8}>{field}</BeamFrame> : field}
      </div>

      <p className="mt-3 text-center label-mono text-slate-400" aria-live="polite">
        {terms.length
          ? `${results.length} OF ${tools.length} MATCH "${query.trim().toUpperCase()}"`
          : `${tools.length} CALCULATORS`}
      </p>

      {!terms.length ? (
        <div className="mt-10">{children}</div>
      ) : results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          No {categoryName.toLowerCase()} calculator matches that. Try a shorter phrase, or clear
          the filter to see all {tools.length}.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

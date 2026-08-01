"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight } from "lucide-react";
import { searchAll, getStartingResults, type SearchResult } from "@/lib/search";

interface SearchResultsClientProps {
  initialQuery: string;
}

/** Wraps every case-insensitive occurrence of any term in `text` with <mark>. */
function highlightMatch(text: string, terms: string[]): ReactNode {
  const cleanTerms = terms.map((t) => t.trim()).filter(Boolean);
  if (cleanTerms.length === 0) return text;

  const pattern = cleanTerms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");
  if (!pattern) return text;

  const regex = new RegExp(`(${pattern})`, "gi");
  // split() with a capturing group interleaves matches at odd indices:
  // [nonMatch, match, nonMatch, match, ...]. Using index parity avoids
  // relying on a stateful global RegExp's .test()/.lastIndex.
  const parts = text.split(regex);

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * Live search results view for /search. Seeded with the ?q= value from the
 * server so its first render (including SSR) already contains every
 * matching tool and category for crawlability. After hydration it
 * re-filters instantly as the user types and keeps the URL's ?q= in sync
 * (debounced) so results stay shareable and bookmarkable.
 */
export function SearchResultsClient({ initialQuery }: SearchResultsClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmed = query.trim();
  const terms = useMemo(() => trimmed.split(/\s+/).filter(Boolean), [trimmed]);

  const results = useMemo(() => (trimmed ? searchAll(query) : []), [query, trimmed]);
  const starting = useMemo(() => getStartingResults(), []);

  // Keep the URL's ?q= in sync with the live query, debounced, without
  // spamming history entries.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search";
      router.replace(next, { scroll: false });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed]);

  return (
    <div>
      <div className="relative max-w-xl mb-8">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search insurance calculators..."
          aria-label="Search insurance calculators"
          autoFocus
          className="w-full h-14 rounded-xl border border-slate-200 bg-white pl-12 pr-11 text-base text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div aria-live="polite" className="sr-only">
        {trimmed
          ? `${results.length} result${results.length === 1 ? "" : "s"} for ${trimmed}`
          : "Enter a search term"}
      </div>

      {!trimmed && <EmptyState results={starting} />}

      {trimmed && results.length === 0 && <NoResultsState query={trimmed} results={starting} />}

      {trimmed && results.length > 0 && (
        <div>
          <p className="text-sm text-slate-500 mb-6">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{trimmed}&rdquo;
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((result) => (
              <li key={result.href}>
                <Link
                  href={result.href}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <span>
                    <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {highlightMatch(result.name, terms)}
                    </span>
                    <span className="block text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {highlightMatch(result.description, terms)}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmptyState({ results }: { results: SearchResult[] }) {
  return (
    <div className="py-6">
      <p className="text-slate-600 mb-6">
        Start typing to search every insurance calculator and category by name, keyword, or the decision
        it answers.
      </p>
      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Browse</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((result) => (
          <li key={result.href}>
            <Link
              href={result.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                {result.name}
              </span>
              <ArrowUpRight
                className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-slate-500">
        Or browse the full catalog on the{" "}
        <Link href="/explore" className="text-blue-600 hover:underline">
          Explore page
        </Link>
        .
      </p>
    </div>
  );
}

function NoResultsState({ query, results }: { query: string; results: SearchResult[] }) {
  return (
    <div className="py-6">
      <p className="text-slate-700 mb-2">
        Nothing matches &ldquo;{query}&rdquo;.
      </p>
      <p className="text-slate-500 mb-6">
        Try a shorter or more general term, check your spelling, or browse the{" "}
        <Link href="/explore" className="text-blue-600 hover:underline">
          Explore page
        </Link>{" "}
        to see every category, including{" "}
        <Link href="/tools/auto" className="text-blue-600 hover:underline">
          Auto
        </Link>
        ,{" "}
        <Link href="/tools/home" className="text-blue-600 hover:underline">
          Home
        </Link>
        , and{" "}
        <Link href="/tools/business" className="text-blue-600 hover:underline">
          Business
        </Link>
        .
      </p>
      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
        You might be looking for
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.slice(0, 6).map((result) => (
          <li key={result.href}>
            <Link
              href={result.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                {result.name}
              </span>
              <ArrowUpRight
                className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

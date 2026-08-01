"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { searchAll, type SearchResult } from "@/lib/search";

export interface SearchBoxProps {
  /** Initial value of the input, e.g. the current ?q= on the search page. */
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Show a live suggestions dropdown while typing. Defaults to true. */
  suggestions?: boolean;
  autoFocus?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<SearchBoxProps["size"]>, string> = {
  sm: "h-10 pl-10 pr-4 text-sm",
  md: "h-12 pl-11 pr-4 text-sm",
  lg: "h-14 pl-12 pr-4 text-base",
};

/**
 * Inline search input. Submits to /search?q=<value>. Optionally shows a
 * live, keyboard navigable suggestions dropdown while the user types.
 * Used in the homepage hero and on the search results page.
 */
export function SearchBox({
  defaultValue = "",
  placeholder = "Search insurance calculators...",
  className = "",
  size = "md",
  suggestions = true,
  autoFocus = false,
}: SearchBoxProps) {
  const router = useRouter();
  const listboxId = useId();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: SearchResult[] = useMemo(() => {
    if (!suggestions) return [];
    return searchAll(value, { limit: 6 });
  }, [value, suggestions]);

  // Clear the highlighted suggestion when the value changes. Adjusted during
  // render rather than in an effect, matching SearchDialog and the header.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setActiveIndex(-1);
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function goToResult(result: SearchResult) {
    setOpen(false);
    router.push(result.href);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      goToResult(results[activeIndex]);
      return;
    }
    goToSearch(value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = suggestions && open && value.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form role="search" onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            role={suggestions ? "combobox" : undefined}
            aria-autocomplete={suggestions ? "list" : undefined}
            aria-expanded={suggestions ? showDropdown : undefined}
            aria-controls={suggestions ? listboxId : undefined}
            aria-activedescendant={
              activeIndex >= 0 && results[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined
            }
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Search insurance calculators"
            className={`w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${SIZE_CLASSES[size]}`}
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-30 mt-2 w-full max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg py-2"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">
              Nothing matches &ldquo;{value.trim()}&rdquo;.{" "}
              <button
                type="button"
                onClick={() => goToSearch(value)}
                className="text-blue-600 hover:underline"
              >
                Search anyway
              </button>
            </li>
          ) : (
            results.map((result, i) => (
              <li key={result.href} id={`${listboxId}-opt-${i}`} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => goToResult(result)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === activeIndex ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{result.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">{result.meta}</span>
                </button>
              </li>
            ))
          )}
          {results.length > 0 && (
            <li className="border-t border-slate-100 mt-1 pt-1">
              <button
                type="button"
                onClick={() => goToSearch(value)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                See all results for &ldquo;{value.trim()}&rdquo;
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

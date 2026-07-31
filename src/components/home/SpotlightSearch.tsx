"use client";

/**
 * The hero centrepiece: a working spotlight over the site's category
 * taxonomy.
 *
 * This is deliberately not a screenshot. It is the real search index, so a
 * first-time visitor can type a question and land on the category that
 * answers it without ever scrolling. Empty state shows every category, the
 * placeholder cycles through real queries, and arrow keys plus Enter behave
 * the way they do in the Ctrl+K palette. Once individual calculators ship
 * into TOOLS, this graduates to tool-level results the same way the
 * reference build's spotlight worked; category results are the real,
 * non-empty content today.
 */

import { useEffect, useId, useMemo, useRef, useState, useTransition, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { CornerDownLeft, Search } from "lucide-react";
import { BeamFrame, ProcessingOrb } from "@/components/brand";
import { searchCategories, getAllCategories, type CategoryResult } from "@/lib/search";
import { TOTAL_CATEGORY_COUNT } from "./data";

/** Queries the placeholder types out, chosen to mirror real search demand. */
const SAMPLE_QUERIES = [
  "how much car insurance do I need",
  "$500 vs $1,000 deductible",
  "life insurance for a stay at home parent",
  "what does a total loss pay",
  "HSA vs PPO",
  "general liability for a small business",
];

const RESULT_LIMIT = 6;
const TYPE_SPEED_MS = 68;
const HOLD_MS = 1500;

interface TypedState {
  phrase: number;
  text: string;
  erasing: boolean;
}

/**
 * Types a sample query out, holds it, erases it, and moves to the next one.
 * Every transition happens inside the timer callback rather than in the
 * effect body, so a render never immediately schedules another render.
 */
function useTypedPlaceholder(enabled: boolean): string {
  const [state, setState] = useState<TypedState>({ phrase: 0, text: "", erasing: false });
  const { phrase, text, erasing } = state;

  useEffect(() => {
    if (!enabled) return;
    const target = SAMPLE_QUERIES[phrase % SAMPLE_QUERIES.length];
    const settled = !erasing && text === target;
    const delay = settled ? HOLD_MS : erasing ? TYPE_SPEED_MS / 2 : TYPE_SPEED_MS;

    const timer = window.setTimeout(() => {
      setState((prev) => {
        const current = SAMPLE_QUERIES[prev.phrase % SAMPLE_QUERIES.length];
        if (!prev.erasing) {
          return prev.text === current
            ? { ...prev, erasing: true }
            : { ...prev, text: current.slice(0, prev.text.length + 1) };
        }
        return prev.text === ""
          ? { phrase: prev.phrase + 1, text: "", erasing: false }
          : { ...prev, text: prev.text.slice(0, -1) };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [enabled, phrase, text, erasing]);

  return text;
}

export function SpotlightSearch() {
  const router = useRouter();
  const listboxId = useId();
  const shouldReduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  // Opening a category is the one genuinely async step here, so it is the
  // only thing that gets a busy indicator.
  const [navigating, startNavigation] = useTransition();

  const trimmed = query.trim();
  const animatePlaceholder = !shouldReduceMotion && !focused && trimmed.length === 0;
  const typed = useTypedPlaceholder(animatePlaceholder);

  const starting = useMemo(() => getAllCategories(RESULT_LIMIT), []);

  const results: CategoryResult[] = useMemo(() => {
    if (!trimmed) return starting;
    return searchCategories(query, { limit: RESULT_LIMIT });
  }, [query, trimmed, starting]);

  // Reset the highlighted row whenever the query changes. Adjusted during
  // render (React's recommended pattern, also used by the site header)
  // rather than in an effect, so it lands before paint.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  function open(category: CategoryResult) {
    startNavigation(() => {
      router.push(category.href);
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        open(results[activeIndex]);
      } else if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    } else if (e.key === "Escape") {
      setQuery("");
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Drafting frame: the panel sits on a grid so it reads as a drawn
          component rather than a floating card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -inset-y-6 z-0 blueprint-grid pattern-fade opacity-70 sm:-inset-x-16"
      />

      {/* Beam framing the spotlight input. This is the one element on the
          page we want the eye to land on first, so it runs slightly hotter
          than the other framed panels. */}
      <div className="relative z-10">
      <BeamFrame strength={0.85}>
        <div className="panel overflow-hidden text-left">
          {/* Command row */}
          <div className="flex items-center gap-3 border-b border-hairline px-4 py-3.5 sm:px-5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={
                  results[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined
                }
                aria-label="Search every insurance calculator category"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={animatePlaceholder ? "" : `Search ${TOTAL_CATEGORY_COUNT} insurance categories`}
                className="w-full bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
              />
              {animatePlaceholder && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[15px] text-slate-400 sm:text-base"
                >
                  {typed}
                  <span className="it-caret" />
                </span>
              )}
            </div>
            {navigating ? (
              <ProcessingOrb
                state="shaping"
                size={20}
                speed={1.65}
                label="Opening category"
                hideLabel
                className="shrink-0"
              />
            ) : (
              <kbd className="label-mono hidden shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-1 text-slate-400 sm:inline-block">
                CTRL K
              </kbd>
            )}
          </div>

          {/* Results. Height changes as the query filters the list, so the
              panel tweens between sizes instead of snapping. */}
          <div className="t-resize px-2 py-2">
            <p className="eyebrow px-3 pb-1.5 pt-2">
              {trimmed ? `${results.length ? "Matches" : "No matches"} for "${trimmed}"` : "Start here"}
            </p>

            {results.length === 0 ? (
              <div className="px-3 py-6 text-sm text-slate-500">
                Nothing matches that phrase yet.{" "}
                <Link
                  href={`/search?q=${encodeURIComponent(trimmed)}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Search the full catalog
                </Link>
                , or browse the{" "}
                <Link href="/tools" className="font-medium text-blue-600 hover:underline">
                  tools directory
                </Link>
                .
              </div>
            ) : (
              <ul id={listboxId} role="listbox" aria-label="Category results">
                {results.map((category, i) => (
                  <li
                    key={category.slug}
                    id={`${listboxId}-opt-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                  >
                    <Link
                      href={category.href}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors ${
                        i === activeIndex ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`block h-1.5 w-1.5 shrink-0 ${
                            i === activeIndex ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        />
                        <span className="truncate text-sm font-medium text-slate-900">{category.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2.5">
                        <span className="label-mono hidden text-slate-400 sm:inline">
                          {category.slug.toUpperCase()}
                        </span>
                        {i === activeIndex && (
                          <CornerDownLeft className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between gap-3 border-t border-hairline bg-slate-50/60 px-4 py-2.5 sm:px-5">
            <span className="label-mono text-slate-400">{TOTAL_CATEGORY_COUNT} CATEGORIES INDEXED</span>
            <Link
              href={trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/explore"}
              className="label-mono text-blue-600 transition-colors hover:text-blue-700"
            >
              {trimmed ? "SEE ALL MATCHES" : "BROWSE EVERYTHING"}
            </Link>
          </div>
        </div>
      </BeamFrame>
      </div>
    </div>
  );
}

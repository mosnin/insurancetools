"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, ArrowRight, CornerDownLeft, X } from "lucide-react";
import { BeamFrame } from "@/components/brand";
import { searchCategories, getAllCategories, type CategoryResult } from "@/lib/search";

export interface SearchDialogProps {
  /**
   * Custom trigger content. Rendered inside a button that opens the dialog.
   * If omitted (and the component is uncontrolled), a default
   * "Search... Ctrl K" pill button is rendered. Ignored entirely in
   * controlled mode, see `open` below.
   */
  children?: ReactNode;
  /** className applied to the trigger button (uncontrolled mode only). */
  className?: string;
  /**
   * Controlled open state. When provided, SearchDialog renders no trigger
   * of its own (the parent, e.g. the header, supplies its own button and
   * keyboard shortcut) and defers open/close entirely to `onOpenChange`.
   * Omit both `open` and `onOpenChange` to let SearchDialog manage its own
   * state and render a built-in trigger.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Command palette style search overlay. Opens on Cmd+K / Ctrl+K from
 * anywhere on the page, or by clicking its trigger. Arrow keys move the
 * selection, Enter navigates, Escape closes. Traps focus and locks page
 * scroll while open.
 *
 * Supports both controlled usage (pass `open` + `onOpenChange`, typically
 * from a header that owns its own trigger button) and uncontrolled usage
 * (omit both, SearchDialog manages its own state and renders a trigger).
 */
export function SearchDialog({ children, className = "", open: controlledOpen, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const listboxId = useId();
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  const trimmed = query.trim();
  const results: CategoryResult[] = useMemo(() => {
    if (!trimmed) return getAllCategories(8);
    return searchCategories(query, { limit: 8 });
  }, [query, trimmed]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, [setOpen]);

  const openDialog = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  // Global Cmd+K / Ctrl+K listener. Always opens (never toggles), so it is
  // safe even if a parent (e.g. the header) also binds its own shortcut.
  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  // Scroll lock + initial focus while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  // Reset the highlighted row when the query changes. Adjusted during render
  // rather than in an effect so it lands before paint, matching the pattern
  // the header and the homepage spotlight already use.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function goToCategory(category: CategoryResult) {
    close();
    router.push(category.href);
  }

  function goToSearch() {
    if (!trimmed) return;
    close();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        goToCategory(results[activeIndex]);
      } else {
        goToSearch();
      }
      return;
    }
    if (e.key === "Tab") {
      // Simple focus trap: cycle focus within the dialog.
      const container = dialogRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'input, button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <>
      {/* In controlled mode the parent (e.g. the header) supplies its own
          trigger button, so SearchDialog renders no trigger at all here. */}
      {!isControlled &&
        (children ? (
          <button type="button" onClick={openDialog} className={className} aria-label="Open search">
            {children}
          </button>
        ) : (
          <button
            type="button"
            onClick={openDialog}
            aria-label="Open search"
            className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-700 ${className}`}
          >
            <Search className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Search categories...</span>
            <kbd className="ml-1 hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              <span aria-hidden="true">Ctrl</span>K
            </kbd>
          </button>
        ))}

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">
            <motion.div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
              aria-hidden="true"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Search insurance calculators"
              onKeyDown={handleKeyDown}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-xl"
            >
              {/* Same beam as the homepage spotlight: the palette is that
                  component in modal form, so it carries the same framing. */}
              <BeamFrame radius={16} strength={0.85}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                    <Search className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      ref={inputRef}
                      type="text"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded="true"
                      aria-controls={listboxId}
                      aria-activedescendant={results[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search insurance categories..."
                      aria-label="Search insurance categories"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close search"
                      className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto py-2">
                    {!trimmed && (
                      <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Categories
                      </p>
                    )}
                    {results.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No categories match &ldquo;{trimmed}&rdquo;.
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={goToSearch}
                            className="text-blue-600 hover:underline"
                          >
                            Search all results anyway
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ul id={listboxId} role="listbox" aria-label="Search results">
                        {results.map((category, i) => (
                          <li
                            key={category.slug}
                            id={`${listboxId}-opt-${i}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            ref={i === activeIndex ? activeItemRef : undefined}
                          >
                            <button
                              type="button"
                              onMouseEnter={() => setActiveIndex(i)}
                              onClick={() => goToCategory(category)}
                              className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                                i === activeIndex ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span className="truncate">{category.name}</span>
                              <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                                {category.slug}
                                {i === activeIndex && <CornerDownLeft className="w-3 h-3" aria-hidden="true" />}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {trimmed && results.length > 0 && (
                    <div className="border-t border-slate-100 px-4 py-2.5">
                      <button
                        type="button"
                        onClick={goToSearch}
                        className="flex w-full items-center justify-between text-left text-sm font-medium text-blue-600 hover:underline"
                      >
                        See all results for &ldquo;{trimmed}&rdquo;
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  <div className="hidden sm:flex items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-medium">↑</kbd>
                      <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-medium">↓</kbd>
                      to navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-medium">Enter</kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-medium">Esc</kbd>
                      to close
                    </span>
                  </div>
                </div>
              </BeamFrame>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

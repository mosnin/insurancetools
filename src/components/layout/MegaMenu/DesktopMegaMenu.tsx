"use client";

/**
 * Desktop mega menu (Team 9: Header, Mega Menu, Footer).
 *
 * Renders the top level nav buttons plus a full width dropdown panel for
 * whichever item is active. Opens on hover and on click/focus, closes on
 * Escape, outside click, and route change. Supports Left/Right arrow
 * roving between top level items.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "@/lib/nav";
import { HoverLift } from "@/components/motion";

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;

function MegaPanelContent({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-6 lg:px-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Cap accounts for the 4rem header plus the panel's own 3rem of
              vertical padding, so the tallest menu scrolls internally instead
              of running off the bottom of the screen. */}
          <div className="col-span-9 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
            </div>
          </div>

          {/* Deliberately not a Stagger: those primitives reveal on scroll
              (whileInView, once), and menu contents are never scrolled into
              view, so every link after the first panel stayed at opacity 0.
              The panel's own entrance transition is the animation here. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {item.categories.map((cat) => (
              <div key={cat.name}>
                <div>
                  <Link
                    href={cat.href}
                    onClick={onNavigate}
                    className="group mb-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400 transition-colors hover:text-blue-600"
                  >
                    {cat.name}
                  </Link>
                  <ul className="space-y-0.5">
                    {cat.tools.map((tool) => (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          onClick={onNavigate}
                          className="-mx-2 block rounded-md px-2 py-1.5 text-[13px] leading-snug text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3">
          <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Popular in {item.label}
            </p>
            <ul className="flex-1 space-y-1">
              {item.featured.map((tool) => (
                <li key={tool.href}>
                  <HoverLift>
                    <Link
                      href={tool.href}
                      onClick={onNavigate}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-white hover:text-blue-700"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                      {tool.name}
                    </Link>
                  </HoverLift>
                </li>
              ))}
            </ul>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse all {item.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopMegaMenu() {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const panelId = useId();

  const activeItem = NAV_ITEMS.find((i) => i.label === openLabel) ?? null;

  const close = useCallback(() => setOpenLabel(null), []);

  // Close on route change. Adjusted during render rather than in an effect
  // so it applies before paint instead of triggering an extra render pass.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (openLabel !== null) setOpenLabel(null);
  }

  // Close on outside click / touch.
  useEffect(() => {
    if (!openLabel) return;
    function onPointerDown(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openLabel, close]);

  // Close on focus leaving the whole nav + panel.
  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const next = e.relatedTarget as Node | null;
    if (!next || !wrapperRef.current.contains(next)) {
      close();
    }
  }, [close]);

  // Escape closes and returns focus to the trigger.
  useEffect(() => {
    if (!openLabel) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        const label = openLabel;
        close();
        const btn = wrapperRef.current?.querySelector<HTMLButtonElement>(
          `[data-nav-trigger="${CSS.escape(label ?? "")}"]`
        );
        btn?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openLabel, close]);

  const openNow = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenLabel(label);
  }, []);

  const closeSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenLabel(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>, idx: number) => {
    const triggers = wrapperRef.current?.querySelectorAll<HTMLButtonElement>("[data-nav-trigger]");
    if (!triggers || triggers.length === 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      triggers[(idx + 1) % triggers.length]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      triggers[(idx - 1 + triggers.length) % triggers.length]?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpenLabel(NAV_ITEMS[idx].label);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative hidden xl:block"
      onMouseLeave={closeSoon}
      onBlur={handleBlur}
    >
      <nav aria-label="Main navigation" className="flex items-center gap-0.5">
        {NAV_ITEMS.map((item, idx) => {
          const isOpen = openLabel === item.label;
          return (
            <button
              key={item.label}
              type="button"
              data-nav-trigger={item.label}
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onMouseEnter={() => openNow(item.label)}
              onFocus={() => openNow(item.label)}
              onClick={() => setOpenLabel(isOpen ? null : item.label)}
              onKeyDown={(e) => handleTriggerKeyDown(e, idx)}
              className={`relative flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors 2xl:px-3 ${
                isOpen ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.label}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-blue-500" : "text-slate-400"
                }`}
                aria-hidden="true"
              />
              {isOpen && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-[1px] left-2 right-2 h-0.5 rounded-full bg-blue-600"
                  transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${activeItem.label} menu`}
            onMouseEnter={cancelClose}
            onMouseLeave={closeSoon}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: PANEL_EASE }}
            className="fixed left-0 right-0 top-16 z-40 border-b border-slate-200 bg-white shadow-xl"
            style={{ transformOrigin: "top center" }}
          >
            <MegaPanelContent item={activeItem} onNavigate={close} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

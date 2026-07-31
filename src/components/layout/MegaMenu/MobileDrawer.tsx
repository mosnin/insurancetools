"use client";

/**
 * Mobile navigation drawer (Team 9: Header, Mega Menu, Footer).
 *
 * A full height, animated, slide in drawer with accordion category
 * sections. Traps focus while open, locks body scroll, and closes on
 * Escape, backdrop click, or route change.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDown, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Wordmark } from "@/components/brand";

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openTop, setOpenTop] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Close on route change.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Reset accordion state whenever the drawer opens fresh. Adjusted during
  // render rather than in an effect so it applies before paint.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setOpenTop(null);
      setOpenSub(null);
    }
  }

  // Focus trap + Escape to close.
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      );

    const first = focusables()[0];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;
      const firstEl = els[0];
      const lastEl = els[els.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/30 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl xl:hidden"
            initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.32, ease: EASE }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
              <Link href="/" onClick={onClose} aria-label="Insurance Tools home">
                <Wordmark asLink={false} />
              </Link>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <nav aria-label="Mobile navigation categories" className="mt-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isTopOpen = openTop === item.label;
                  return (
                    <div key={item.label} className="border-b border-slate-100">
                      <button
                        onClick={() => {
                          setOpenTop(isTopOpen ? null : item.label);
                          setOpenSub(null);
                        }}
                        className="flex w-full items-center justify-between py-4 text-left"
                        aria-expanded={isTopOpen}
                      >
                        <span className="flex items-center gap-2.5 text-base font-semibold text-slate-900">
                          <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                            isTopOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isTopOpen && (
                          <motion.div
                            initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0.1 : 0.25, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pb-4">
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className="block py-1.5 text-sm font-medium text-blue-600"
                              >
                                Browse all {item.label} tools
                              </Link>
                              {item.categories.map((cat) => {
                                const isSubOpen = openSub === cat.name;
                                return (
                                  <div key={cat.name}>
                                    <button
                                      onClick={() => setOpenSub(isSubOpen ? null : cat.name)}
                                      className="flex w-full items-center justify-between py-2 text-left"
                                      aria-expanded={isSubOpen}
                                    >
                                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                        {cat.name}
                                      </span>
                                      <ChevronDown
                                        className={`h-3.5 w-3.5 text-slate-300 transition-transform duration-200 ${
                                          isSubOpen ? "rotate-180" : ""
                                        }`}
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <AnimatePresence initial={false}>
                                      {isSubOpen && (
                                        <motion.ul
                                          initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                                          transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: EASE }}
                                          className="overflow-hidden pl-1"
                                        >
                                          {cat.tools.map((tool) => (
                                            <li key={tool.href}>
                                              <Link
                                                href={tool.href}
                                                onClick={onClose}
                                                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                              >
                                                <span className="h-1 w-1 shrink-0 rounded-full bg-blue-400" aria-hidden="true" />
                                                {tool.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-6 space-y-1">
                <Link
                  href="/tools"
                  onClick={onClose}
                  className="block border-b border-slate-100 py-3 text-base font-semibold text-slate-900"
                >
                  All Tools
                </Link>
                <Link
                  href="/explore"
                  onClick={onClose}
                  className="block border-b border-slate-100 py-3 text-base font-semibold text-slate-900"
                >
                  Explore
                </Link>
                <Link
                  href="/about"
                  onClick={onClose}
                  className="block border-b border-slate-100 py-3 text-base font-semibold text-slate-900"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="block border-b border-slate-100 py-3 text-base font-semibold text-slate-900"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

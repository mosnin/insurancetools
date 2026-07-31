"use client";

/**
 * Site header (Team 9: Header, Mega Menu, Footer).
 *
 * Sticky header with a full width mega menu on desktop (src/components/layout/MegaMenu),
 * an animated full height drawer on mobile, and the shared command palette search dialog.
 * Gains a subtle elevation and blur once the page scrolls, plus a scroll progress bar.
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowRight, Menu, Search } from "lucide-react";
import { DesktopMegaMenu, MobileDrawer } from "@/components/layout/MegaMenu";
import { SearchDialog } from "@/components/search";
import { Wordmark } from "@/components/brand";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  // Close the mobile drawer whenever the route changes. Adjusted during
  // render (React's recommended pattern) rather than in an effect, so it
  // takes effect before paint instead of triggering an extra render pass.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur transition-colors duration-200 ${
          scrolled ? "border-hairline-strong" : "border-hairline"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            <Wordmark collapse />

            <div className="flex min-w-0 flex-1 items-center">
              <DesktopMegaMenu />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <SearchDialog className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 xl:px-3 xl:py-1.5">
                <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden xl:inline">Search</span>
                <kbd className="label-mono hidden items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-400 2xl:inline-flex">
                  CTRL K
                </kbd>
              </SearchDialog>

              <div className="hidden items-center gap-3 xl:flex">
                <Link
                  href="/about"
                  className="hidden text-sm text-slate-600 transition-colors hover:text-slate-900 2xl:inline"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="hidden text-sm text-slate-600 transition-colors hover:text-slate-900 2xl:inline"
                >
                  Contact
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  All Tools
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 xl:hidden"
                aria-label="Open navigation menu"
                aria-haspopup="dialog"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-blue-600"
          style={shouldReduceMotion ? undefined : { scaleX: scrollYProgress }}
        />
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

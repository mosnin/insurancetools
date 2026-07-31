import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { DitherField, Eyebrow, MetalButton } from "@/components/brand";
import { TOTAL_CATEGORY_COUNT } from "./data";

const QUICK_LINKS = [
  { name: "Auto insurance calculators", href: "/tools/auto" },
  { name: "Home insurance calculators", href: "/tools/home" },
  { name: "Life insurance calculators", href: "/tools/life" },
  { name: "Health insurance calculators", href: "/tools/health" },
  { name: "Coverage calculators", href: "/tools/coverage" },
  { name: "Claims calculators", href: "/tools/claims" },
];

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.18]">
        <DitherField variant="peak" columns={64} aspect={2.6} className="text-blue-700" />
      </div>

      <Reveal className="relative z-10 mx-auto max-w-3xl text-center">
        <Eyebrow align="center">Start here</Eyebrow>
        <p className="mt-7 text-[1.85rem] font-light leading-[1.15] tracking-[-0.03em] text-slate-400 sm:text-4xl lg:text-[2.7rem]">
          Stop guessing at coverage.{" "}
          <span className="font-medium text-slate-900">Run the numbers instead.</span>
        </p>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Press Ctrl and K from anywhere on the site to open the spotlight, or pick one of the
          {` ${TOTAL_CATEGORY_COUNT} `}
          categories below. Every calculator is free, and none of them ask who you are.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MetalButton className="w-full sm:w-auto">
            <Link
              href="/tools"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
            >
              Browse all categories
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </MetalButton>
          <Link
            href="/explore"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
          >
            Search all calculators
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="relative z-10 mx-auto mt-14 max-w-4xl">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-hairline-strong bg-hairline-strong sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center justify-between gap-3 bg-white px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <span className="text-sm text-slate-700 transition-colors group-hover:text-slate-900">
                  {link.name}
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-blue-600"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { Eyebrow, MetalButton } from "@/components/brand";
import { SpotlightSearch } from "./SpotlightSearch";
import { TOTAL_CATEGORY_COUNT } from "./data";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-white px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 dot-field pattern-fade-b opacity-70"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <FadeIn>
          <Eyebrow align="center">Free, instant, no sign-up</Eyebrow>
        </FadeIn>

        <FadeIn delay={0.05}>
          <h1 className="mt-6 text-[2.15rem] font-light leading-[1.1] tracking-[-0.03em] text-slate-400 sm:text-5xl lg:text-[3.5rem]">
            Free insurance calculators for{" "}
            <span className="font-medium text-slate-900">every coverage decision you face</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Insurance Tools helps you work out what coverage you need, how much of it, what a claim
            might pay, and whether a policy is worth it, across {TOTAL_CATEGORY_COUNT} categories.
            Search the decision you are weighing, enter your own numbers, and read both the result
            and the working behind it.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={0.15} className="relative z-10 mt-12 sm:mt-14">
        <SpotlightSearch />
      </FadeIn>

      <FadeIn delay={0.2} className="relative z-10">
        <div className="mx-auto mt-9 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
          {/* The page's single primary action, and the only button above the
              fold carrying the metal treatment. */}
          <MetalButton className="w-full sm:w-auto">
            <Link
              href="/tools"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
            >
              Browse all {TOTAL_CATEGORY_COUNT} categories
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </MetalButton>
          <Link
            href="#how-it-works"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
          >
            See how a calculation works
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

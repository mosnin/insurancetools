import Link from "next/link";
import { Reveal } from "@/components/motion";
import { DisplayHeading, Eyebrow } from "@/components/brand";
import { LiveDemo } from "./LiveDemo";

export function DemoSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 dot-field pattern-fade opacity-60"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>See it work</Eyebrow>
            <DisplayHeading
              className="mt-6"
              lead="Not a screenshot of a calculator."
              emphasis="An actual calculator."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-7 space-y-4 text-sm leading-relaxed text-slate-500 sm:text-base">
              <p>
                Drag any slider on the right and every figure moves at once: the break-even point,
                the cumulative savings curve, and the threshold line it has to cross. That separation
                is the point. A lower premium sounds good on its own, but it only actually saves you
                money once the accumulated savings outweigh what a higher deductible costs you in a
                claim year.
              </p>
              <p>
                The formula printed along the bottom of the panel is the one doing the work, plain
                division, with no adjustment factors hiding behind the result. Every calculator on
                the site is built this way: standard math, stated openly, so you can check it
                yourself rather than take our word for it.
              </p>
              <p>
                This particular panel is a preview of the full{" "}
                <Link href="/tools/deductibles" className="font-medium text-blue-600 hover:text-blue-700">
                  deductible calculators
                </Link>
                , which will add per-policy claim history and side-by-side comparisons. For the
                question that usually comes before this one, how much coverage to carry in the first
                place, the{" "}
                <Link href="/tools/coverage" className="font-medium text-blue-600 hover:text-blue-700">
                  coverage calculators
                </Link>{" "}
                start from the other end.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="lg:col-span-7">
          <LiveDemo />
        </Reveal>
      </div>
    </section>
  );
}

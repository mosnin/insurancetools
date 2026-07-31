import { Reveal } from "@/components/motion";
import { DisplayHeading, DitherField, Eyebrow } from "@/components/brand";

const PILLARS = [
  {
    index: "01",
    title: "Coverage math, not guesswork",
    body:
      "Every calculator is built on the coverage, deductible, and claims math used across the industry, income replacement for life insurance, replacement cost for property, out-of-pocket maximums for health plans. Nothing is estimated by a model whose workings we cannot show you.",
  },
  {
    index: "02",
    title: "Checked against public guidance",
    body:
      "Tools tied to state requirements, plan terminology, or coverage rules are checked against published guidance from bodies like the NAIC, HealthCare.gov, and individual state insurance departments, and updated when that guidance changes.",
  },
  {
    index: "03",
    title: "Estimates, stated as estimates",
    body:
      "A result here is a planning number, not a quote or an offer. Insurers apply underwriting, risk factors, and state rules we cannot see, so we tell you where a figure is likely to move rather than implying precision we do not have.",
  },
  {
    index: "04",
    title: "Your figures never leave the page",
    body:
      "Calculations run in your browser. There is no account, so income, home value, and medical spending figures are never transmitted, never stored, and never sold to an insurer.",
  },
];

export function TrustSection() {
  return (
    <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Methodology</Eyebrow>
            <DisplayHeading
              className="mt-6"
              lead="Free to use."
              emphasis="Not casually assembled."
            />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
              Anyone can put a form on a page and call the output a projection. These are the four
              commitments that decide what ships here and what does not.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel mt-8 hidden aspect-[5/3] overflow-hidden bg-slate-50 lg:block">
              <DitherField variant="ridge" columns={34} aspect={1.66} className="text-blue-700" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="lg:col-span-7">
          <dl className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.index} className="border-t border-hairline-strong pt-5">
                <dt className="flex items-baseline gap-3">
                  <span className="label-mono text-blue-600">{pillar.index}</span>
                  <span className="text-sm font-semibold text-slate-900">{pillar.title}</span>
                </dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-slate-500">{pillar.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

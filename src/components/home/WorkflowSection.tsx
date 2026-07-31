import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { DisplayHeading, Eyebrow } from "@/components/brand";

/* -------------------------------------------------------------------------- */
/* Three drawn mocks, one per step of using a calculator.                      */
/* Static markup rather than images: they stay crisp at any density, cost no   */
/* bytes to download, and cannot go stale against the real interface.          */
/* -------------------------------------------------------------------------- */

function MockInputs() {
  const fields = [
    { label: "Dwelling value", value: "$385,000" },
    { label: "Personal property", value: "$115,000" },
    { label: "Deductible", value: "$1,000" },
    { label: "Liability limit", value: "$300,000" },
  ];
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {fields.map((field, i) => (
        <div
          key={field.label}
          className={`flex items-center justify-between rounded-lg border bg-white px-3 py-2.5 ${
            i === 2 ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"
          }`}
        >
          <span className="text-[11px] font-medium text-slate-400">{field.label}</span>
          <span className="text-[13px] font-semibold tabular-nums text-slate-900">{field.value}</span>
        </div>
      ))}
    </div>
  );
}

function MockResult() {
  const bars = [38, 46, 52, 61, 68, 74, 83, 91];
  return (
    <div className="flex h-full flex-col justify-between" aria-hidden="true">
      <div className="rounded-lg border border-slate-200 bg-white p-3.5">
        <p className="label-mono text-slate-400">RECOMMENDED COVERAGE</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.03em] text-slate-900">
          $500,000
        </p>
        <div className="mt-2.5 flex gap-1.5">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            Dwelling $385K
          </span>
          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
            Liability $300K
          </span>
        </div>
      </div>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-blue-600" : "bg-slate-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

function MockCompare() {
  const rows = [
    { option: "$500 deductible", monthly: "$142", note: "Higher premium" },
    { option: "$1,000 deductible", monthly: "$118", note: "Break-even: 14mo" },
    { option: "$2,000 deductible", monthly: "$101", note: "Break-even: 24mo" },
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white" aria-hidden="true">
      <div className="grid grid-cols-3 gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
        {["OPTION", "MONTHLY", "NOTE"].map((h) => (
          <span key={h} className="label-mono text-slate-400 last:text-right">
            {h}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.option}
          className="grid grid-cols-3 gap-2 border-b border-slate-100 px-3 py-2 last:border-b-0"
        >
          <span className="label-mono text-slate-700">{row.option}</span>
          <span className="label-mono text-slate-700">{row.monthly}</span>
          <span className="label-mono text-right text-slate-900">{row.note}</span>
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  {
    index: "01",
    title: "Enter your own numbers",
    body:
      "Fields are labelled in plain English and pre-filled with realistic defaults, so you can change the one figure you care about, like dwelling value or a deductible, and leave the rest alone.",
    mock: <MockInputs />,
  },
  {
    index: "02",
    title: "Read the result and its parts",
    body:
      "The headline figure comes with the breakdown behind it. On a coverage calculator that means the split between dwelling, liability, and personal property, not just a total you have to trust.",
    mock: <MockResult />,
  },
  {
    index: "03",
    title: "Compare your real options",
    body:
      "Where more than one option makes sense, you get all of them side by side. A deductible comparison shows the break-even point for each choice, not just the cheapest premium.",
    mock: <MockCompare />,
  },
];

export function WorkflowSection() {
  return (
    <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <Eyebrow>Three steps</Eyebrow>
          <DisplayHeading
            className="mt-6"
            lead="Question to answer"
            emphasis="without a spreadsheet in between"
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <StaggerItem key={step.index} className="h-full">
              <div className="flex h-full flex-col">
                <div className="panel flex min-h-[13.5rem] flex-col justify-center bg-slate-50/50 p-4">
                  {step.mock}
                </div>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="label-mono text-blue-600">{step.index}</span>
                  <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

"use client";

/**
 * Stay-at-home parent life insurance calculator.
 *
 * Values the unpaid household and caregiving labor a stay-at-home (or
 * primarily at-home) parent provides using a replacement-cost method: what
 * would it cost, per week, to hire out the tasks that parent currently
 * handles unpaid. The site does not supply a default wage or hourly rate for
 * any task, since childcare, cleaning, and driving rates vary enormously by
 * region and by who is actually available to hire locally. Instead the user
 * enters their own rate (either one blended rate for everything, or a
 * separate rate per task) and the tool does the arithmetic: weekly hours to
 * annual replacement cost to a total coverage suggestion over however many
 * years of coverage they want to plan for.
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const USD2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

interface TaskRow {
  key: "childcare" | "housekeeping" | "mealPrep" | "transport" | "tutoring";
  label: string;
  hint: string;
}

const TASKS: TaskRow[] = [
  { key: "childcare", label: "Childcare", hint: "Direct supervision and care of children" },
  { key: "housekeeping", label: "Housekeeping", hint: "Cleaning, laundry, general upkeep" },
  { key: "mealPrep", label: "Meal preparation", hint: "Planning, cooking, cleanup" },
  { key: "transport", label: "Transportation & errands", hint: "School runs, activities, shopping" },
  { key: "tutoring", label: "Tutoring & homework help", hint: "Schoolwork support, reading, projects" },
];

type Hours = Record<TaskRow["key"], number>;
type Rates = Record<TaskRow["key"], number>;

const ZERO_HOURS: Hours = {
  childcare: 0,
  housekeeping: 0,
  mealPrep: 0,
  transport: 0,
  tutoring: 0,
};

const ZERO_RATES: Rates = {
  childcare: 0,
  housekeeping: 0,
  mealPrep: 0,
  transport: 0,
  tutoring: 0,
};

interface HoursFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function HoursField({ label, hint, value, onChange, max = 168 }: HoursFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-16 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          hrs/week
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface RateFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function RateField({ label, hint, value, onChange }: RateFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={500}
          step={0.5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 500) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-16 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          /hr
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function StayAtHomeParentCoverageCalculatorTool() {
  const [hours, setHours] = useState<Hours>(ZERO_HOURS);
  const [rateMode, setRateMode] = useState<"blended" | "perTask">("blended");
  const [blendedRate, setBlendedRate] = useState(0);
  const [rates, setRates] = useState<Rates>(ZERO_RATES);
  const [years, setYears] = useState(10);
  const [copied, setCopied] = useState(false);

  function setHour(key: TaskRow["key"], value: number) {
    setHours((prev) => ({ ...prev, [key]: value }));
  }

  function setRate(key: TaskRow["key"], value: number) {
    setRates((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => {
    const totalWeeklyHours = TASKS.reduce((sum, t) => sum + hours[t.key], 0);

    const rowValues = TASKS.map((t) => {
      const rate = rateMode === "blended" ? blendedRate : rates[t.key];
      const weeklyValue = hours[t.key] * rate;
      const annualValue = weeklyValue * 52;
      return { key: t.key, label: t.label, hoursPerWeek: hours[t.key], rate, weeklyValue, annualValue };
    });

    const weeklyReplacementValue = rowValues.reduce((sum, r) => sum + r.weeklyValue, 0);
    const annualReplacementValue = weeklyReplacementValue * 52;
    const hasAnyRate =
      rateMode === "blended" ? blendedRate > 0 : TASKS.some((t) => rates[t.key] > 0);
    const totalCoverageSuggestion = annualReplacementValue * years;

    return {
      totalWeeklyHours,
      rowValues,
      weeklyReplacementValue,
      annualReplacementValue,
      hasAnyRate,
      totalCoverageSuggestion,
    };
  }, [hours, rateMode, blendedRate, rates, years]);

  async function copyResult() {
    const lines = [
      "Stay-at-home parent replacement-cost estimate",
      `Total unpaid work: ${result.totalWeeklyHours} hrs/week`,
      `Weekly replacement value: ${USD2.format(result.weeklyReplacementValue)}`,
      `Annual replacement value: ${USD.format(result.annualReplacementValue)}`,
      `Suggested coverage over ${years} years: ${USD.format(result.totalCoverageSuggestion)}`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/life/stay-at-home-parent-coverage-calculator",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the
      // result stays fully visible on screen either way.
    }
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="label-mono text-slate-500">STAY-AT-HOME PARENT COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="border-b border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        This tool does not supply a default hourly rate for any task. Rates for childcare,
        cleaning, and similar services vary enormously by region, so enter your own number below.
        If you want a data-backed starting point, the{" "}
        <a
          href="https://www.bls.gov/oes/current/oes_stru.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          Bureau of Labor Statistics Occupational Employment and Wage Statistics
        </a>{" "}
        publishes median hourly wages by metro area for comparable paid roles, such as childcare
        workers and maids/housekeeping cleaners.
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono mb-3 text-slate-400">WEEKLY HOURS BY TASK</p>
            <div className="space-y-4">
              {TASKS.map((t) => (
                <HoursField key={t.key} label={t.label} hint={t.hint} value={hours[t.key]} onChange={(v) => setHour(t.key, v)} />
              ))}
            </div>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="label-mono mb-3 text-slate-400">REPLACEMENT RATE</p>
            <div className="mb-3 inline-flex rounded-lg border border-slate-200 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setRateMode("blended")}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  rateMode === "blended" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                One blended rate
              </button>
              <button
                type="button"
                onClick={() => setRateMode("perTask")}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  rateMode === "perTask" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Rate per task
              </button>
            </div>

            {rateMode === "blended" ? (
              <RateField
                label="Blended hourly rate"
                hint="Applied to every hour entered above, across all tasks"
                value={blendedRate}
                onChange={setBlendedRate}
              />
            ) : (
              <div className="space-y-4">
                {TASKS.map((t) => (
                  <RateField key={t.key} label={`${t.label} rate`} value={rates[t.key]} onChange={(v) => setRate(t.key, v)} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-hairline pt-4">
            <label className="block">
              <span className="block text-[13px] font-medium text-slate-600">Years of coverage to plan for</span>
              <span className="mt-1.5 block">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => {
                    const raw = Number(e.target.value);
                    const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 1), 30) : 1;
                    setYears(clamped);
                  }}
                  className="w-28 rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                Many families plan until the youngest child is grown or the working parent could
                realistically replace the income another way. Adjust to match your own situation.
              </span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED COVERAGE ({years} YEARS)</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.hasAnyRate ? USD.format(result.totalCoverageSuggestion) : "$0"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasAnyRate
                ? `Based on ${result.totalWeeklyHours} hrs/week of unpaid work at the rates you entered.`
                : "Enter hours and a rate to see a coverage suggestion."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Weekly replacement value" value={USD2.format(result.weeklyReplacementValue)} />
            <Figure label="Annual replacement value" value={USD.format(result.annualReplacementValue)} tone="accent" />
          </div>

          <div className="space-y-2 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Breakdown by task</p>
            <div className="space-y-1.5">
              {result.rowValues
                .filter((r) => r.hoursPerWeek > 0)
                .map((r) => (
                  <div key={r.key} className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {r.label} ({r.hoursPerWeek} hrs/wk × {USD2.format(r.rate)}/hr)
                    </span>
                    <span className="font-medium tabular-nums text-slate-900">{USD.format(r.annualValue)}/yr</span>
                  </div>
                ))}
              {result.totalWeeklyHours === 0 && (
                <p className="text-xs text-slate-400">No hours entered yet.</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={copyResult}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy result"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This tool multiplies the hours and rates you enter to model a
        replacement-cost value for unpaid household and caregiving labor; it is not a needs
        analysis, a quote, or a substitute for the full income-replacement picture (which should
        also include the working spouse&apos;s own life insurance need). Rates are not supplied by
        this tool and should reflect what it would actually cost in your area to hire the
        equivalent help. Talk to a licensed insurance agent before buying or changing a policy.
      </div>
    </div>
  );
}

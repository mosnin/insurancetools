"use client";

/**
 * Lost wages claim calculator.
 *
 * Estimates the gross and net lost wages a claimant might document after
 * missing work because of an accident or injury. Supports both hourly and
 * salaried pay, since the two require different math: an hourly worker's
 * daily wage is direct (hourly rate times hours in a typical workday), while
 * a salaried worker's daily wage has to be derived by dividing annual salary
 * by the number of days they actually work in a year (never 365, since that
 * would understate the daily rate for anyone who doesn't work weekends and
 * holidays).
 *
 * An optional "partial income received" field nets out any partial
 * disability pay or used paid time off against the gross figure, since
 * claimants frequently forget that offset exists until an adjuster points it
 * out. A self-employed toggle surfaces a plain-language note about the
 * different documentation path (tax returns / profit-and-loss statements
 * instead of pay stubs) without inventing a specific insurer's paperwork
 * requirements, since those vary by company and by claim.
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

type IncomeMode = "hourly" | "salary";

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 1_000_000,
  step = 1,
  prefix,
  suffix,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : min;
            onChange(clamped);
          }}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-14" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
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

export function LostWagesClaimCalculatorTool() {
  const [incomeMode, setIncomeMode] = useState<IncomeMode>("hourly");
  const [hourlyWage, setHourlyWage] = useState(22);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [annualSalary, setAnnualSalary] = useState(55_000);
  const [workDaysPerYear, setWorkDaysPerYear] = useState(260);
  const [daysMissed, setDaysMissed] = useState(10);
  const [partialIncome, setPartialIncome] = useState(0);
  const [selfEmployed, setSelfEmployed] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const safeWorkDays = Math.max(1, workDaysPerYear);
    const dailyWage =
      incomeMode === "hourly" ? hourlyWage * hoursPerDay : annualSalary / safeWorkDays;

    const grossLostWages = dailyWage * daysMissed;
    const rawNet = grossLostWages - partialIncome;
    const netLostWages = Math.max(0, rawNet);
    const offsetExceedsGross = partialIncome > grossLostWages && grossLostWages > 0;

    return {
      dailyWage,
      grossLostWages,
      netLostWages,
      offsetExceedsGross,
    };
  }, [incomeMode, hourlyWage, hoursPerDay, annualSalary, workDaysPerYear, daysMissed, partialIncome]);

  async function copyResult() {
    const lines = [
      "Lost wages claim estimate",
      `Pay type: ${incomeMode === "hourly" ? "Hourly" : "Salaried"}`,
      `Estimated daily wage: ${USD2.format(result.dailyWage)}`,
      `Work days missed: ${daysMissed}`,
      `Gross lost wages: ${USD.format(result.grossLostWages)}`,
      partialIncome > 0
        ? `Partial income received (PTO used / partial disability pay): ${USD.format(partialIncome)}`
        : "Partial income received: none entered",
      `Net lost wages to document: ${USD.format(result.netLostWages)}`,
      selfEmployed
        ? "Self-employed: document with tax returns / profit-and-loss statements, not a simple pay stub."
        : "",
      "Estimate only, not a claim valuation or insurance advice. insurancetools.org/tools/claims/lost-wages-claim-calculator",
    ].filter(Boolean);
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
        <span className="label-mono text-slate-500">LOST WAGES CLAIM CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <span className="block text-[13px] font-medium text-slate-600">Pay type</span>
            <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setIncomeMode("hourly")}
                className={`rounded-md py-2 text-xs font-semibold transition-colors ${
                  incomeMode === "hourly" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Hourly wage
              </button>
              <button
                type="button"
                onClick={() => setIncomeMode("salary")}
                className={`rounded-md py-2 text-xs font-semibold transition-colors ${
                  incomeMode === "salary" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Annual salary
              </button>
            </div>
          </div>

          {incomeMode === "hourly" ? (
            <>
              <NumberField
                label="Hourly wage"
                hint="Your regular pay rate before taxes"
                value={hourlyWage}
                onChange={setHourlyWage}
                max={500}
                step={0.5}
                prefix="$"
              />
              <NumberField
                label="Hours in a typical workday"
                hint="Used to turn your hourly rate into a daily wage"
                value={hoursPerDay}
                onChange={setHoursPerDay}
                max={24}
                step={0.5}
                suffix="hrs/day"
              />
            </>
          ) : (
            <>
              <NumberField
                label="Annual salary"
                hint="Gross salary before taxes"
                value={annualSalary}
                onChange={setAnnualSalary}
                max={2_000_000}
                step={500}
                prefix="$"
              />
              <NumberField
                label="Typical work days per year"
                hint="Not 365 — exclude your usual weekends, holidays, and vacation"
                value={workDaysPerYear}
                onChange={setWorkDaysPerYear}
                min={1}
                max={366}
                step={1}
                suffix="days/yr"
              />
            </>
          )}

          <NumberField
            label="Work days missed"
            hint="Count only days you were actually scheduled to work"
            value={daysMissed}
            onChange={setDaysMissed}
            max={3650}
            step={1}
            suffix="days"
          />

          <NumberField
            label="Partial income received during recovery"
            hint="Optional — partial disability pay or PTO/sick days used"
            value={partialIncome}
            onChange={setPartialIncome}
            max={1_000_000}
            step={50}
            prefix="$"
          />

          <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
            <input
              type="checkbox"
              checked={selfEmployed}
              onChange={(e) => setSelfEmployed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs leading-relaxed text-slate-600">
              I&apos;m self-employed or a 1099 contractor
            </span>
          </label>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">NET LOST WAGES TO DOCUMENT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.netLostWages)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {partialIncome > 0
                ? `Gross lost wages of ${USD.format(result.grossLostWages)} minus ${USD.format(partialIncome)} already received`
                : "Equal to your gross lost wages since no partial income was entered"}
            </p>
          </div>

          {result.offsetExceedsGross && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              The partial income you entered ({USD.format(partialIncome)}) is more than your gross lost
              wages ({USD.format(result.grossLostWages)}), so the net figure is floored at $0. Double-check
              what you entered as &ldquo;partial income received&rdquo; — it may include pay for days you
              weren&apos;t actually scheduled to work.
            </div>
          )}

          {selfEmployed && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Self-employed and 1099 claimants generally need to document lost income differently than
              hourly or salaried employees, typically through tax returns and profit-and-loss statements
              rather than a simple pay stub, since there is no employer to verify a daily wage. This
              calculator can still give you a rough estimate, but treat the figure below as a starting
              point to refine with your own financial records.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Daily wage" value={USD2.format(result.dailyWage)} />
            <Figure label="Gross lost wages" value={USD.format(result.grossLostWages)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">How this is calculated</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {incomeMode === "hourly"
                  ? `Daily wage = ${USD2.format(hourlyWage)}/hour × ${hoursPerDay} hours = ${USD2.format(result.dailyWage)}. That daily wage is multiplied by ${daysMissed} missed work day${daysMissed === 1 ? "" : "s"}.`
                  : `Daily wage = ${USD.format(annualSalary)} ÷ ${Math.max(1, workDaysPerYear)} typical work days/year = ${USD2.format(result.dailyWage)}. That daily wage is multiplied by ${daysMissed} missed work day${daysMissed === 1 ? "" : "s"}.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Partial income offset</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {partialIncome > 0
                  ? `${USD.format(partialIncome)} in partial disability pay or used PTO is subtracted from your gross lost wages before you claim the remainder, since a claim generally shouldn't double-count income you already received.`
                  : "If you used paid time off or received partial disability pay while recovering, enter it above so it's netted out of your claim automatically."}
              </p>
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
        Estimate only. This tool models a straightforward daily-wage-times-days-missed method for
        documenting lost income; it is not a claim valuation, a legal calculation, or insurance advice, and
        it does not know your insurer&apos;s specific documentation requirements or your state&apos;s claim
        rules. Keep pay stubs, a doctor&apos;s note excusing you from work, and (if self-employed) tax
        returns or profit-and-loss statements to support whatever figure you submit.
      </div>
    </div>
  );
}

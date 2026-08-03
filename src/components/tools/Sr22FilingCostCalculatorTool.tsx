"use client";

/**
 * SR-22 filing cost calculator.
 *
 * SR-22 (and equivalent) requirements are set state by state, and not every
 * state uses the SR-22 system at all. This tool does not know, and does not
 * guess, what any specific state charges or how long any specific state or
 * court requires a filing to stay active. It only totals figures the user
 * supplies: a one-time filing fee, a monthly insurance surcharge tied to the
 * SR-22 requirement, and a required filing period in months. Everything runs
 * client-side; nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
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
  max = 10_000,
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
          min={0}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-12" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function Sr22FilingCostCalculatorTool() {
  const [filingFee, setFilingFee] = useState(0);
  const [monthlySurcharge, setMonthlySurcharge] = useState(0);
  const [months, setMonths] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const surchargeTotal = monthlySurcharge * months;
    const totalCost = filingFee + surchargeTotal;
    const hasAnyInput = filingFee > 0 || monthlySurcharge > 0 || months > 0;
    const monthlyAverage = months > 0 ? totalCost / months : 0;

    return {
      filingFee,
      monthlySurcharge,
      months,
      surchargeTotal,
      totalCost,
      hasAnyInput,
      monthlyAverage,
    };
  }, [filingFee, monthlySurcharge, months]);

  async function copyResult() {
    const lines = [
      "SR-22 filing cost estimate",
      `One-time filing fee: ${USD.format(result.filingFee)}`,
      `Monthly SR-22 surcharge: ${USD.format(result.monthlySurcharge)} x ${result.months} month(s) = ${USD.format(result.surchargeTotal)}`,
      `Total cost over the filing period: ${USD.format(result.totalCost)}`,
      "Based on user-entered figures only. Confirm your exact fee, surcharge, and required filing length with your state's Department of Insurance, DMV, or the court, since SR-22 rules vary by state.",
      "insurancetools.org/tools/auto/sr22-filing-cost-calculator",
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
        <span className="label-mono text-slate-500">SR-22 FILING COST CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="One-time SR-22 filing fee"
            hint="What your insurer or state charges to file the certificate. Check your quote or policy documents."
            value={filingFee}
            onChange={setFilingFee}
            prefix="$"
            step={5}
          />
          <NumberField
            label="Monthly SR-22 insurance surcharge"
            hint="The extra amount added to your premium each month specifically for the SR-22 requirement, not your full premium."
            value={monthlySurcharge}
            onChange={setMonthlySurcharge}
            prefix="$"
            step={1}
          />
          <NumberField
            label="Required filing period"
            hint="How many months your state or court ordered the SR-22 to stay active. This varies by state and offense, so use your own order or notice."
            value={months}
            onChange={setMonths}
            suffix="months"
            max={120}
            step={1}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">TOTAL COST OVER FILING PERIOD</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalCost)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasAnyInput
                ? `${USD.format(result.filingFee)} filing fee + ${USD.format(result.surchargeTotal)} in surcharges over ${result.months} month(s)`
                : "Enter your fee, surcharge, and filing length to see a total."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Surcharge total" value={USD.format(result.surchargeTotal)} />
            <Figure
              label="Average monthly cost"
              value={result.months > 0 ? USD.format(result.monthlyAverage) : "—"}
              tone="accent"
            />
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-900">
            This total only adds up the numbers you entered. It does not know your state&apos;s actual SR-22
            fee, surcharge, or required filing length, because those are set individually by each state
            (and some states use a different form or no SR-22 system at all). Confirm your exact
            requirement with your state&apos;s DMV, Department of Insurance, or the court that ordered it.
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
        Estimate only, built from figures you enter yourself. This tool does not fabricate or assume any
        state&apos;s SR-22 filing fee, surcharge amount, or required filing duration, since those requirements
        vary by state and by individual case and not every state uses the SR-22 system. Verify your exact
        cost and required filing period with your insurer, your state&apos;s DMV or Department of Insurance, or
        the court before relying on this number.
      </div>
    </div>
  );
}

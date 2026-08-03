"use client";

/**
 * Income replacement calculator.
 *
 * Answers one narrow question precisely: what lump sum, invested at a rate
 * the user supplies, would fund a chosen number of years of a chosen annual
 * income? It uses the standard present-value-of-an-ordinary-annuity formula
 *
 *   PV = PMT × [(1 − (1 + r)^−n) / r]
 *
 * where PMT is the annual income to replace, r is the discount/investment
 * rate as a decimal, and n is the number of years. When r = 0 the formula
 * divides by zero, so that case is handled separately as PV = PMT × n.
 *
 * This is deliberately not the site's general life insurance needs
 * calculator or DIME method calculator, both of which combine several
 * inputs (debts, mortgage, education, existing assets) into a broader
 * coverage recommendation. This tool isolates the present-value step alone
 * so a user can see exactly how the discount rate assumption changes the
 * answer, then optionally layer a lump sum for debts or final expenses on
 * top of it.
 *
 * The discount rate has no default. A rate presented as a fact would be a
 * fabricated assumption about future investment returns, so the field
 * starts empty and the tool will not compute a present value until the
 * user types in a rate they are choosing to test.
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

const MIN_YEARS = 1;
const MAX_YEARS = 60;
const MIN_RATE = 0;
const MAX_RATE = 15;

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CurrencyField({ label, hint, value, onChange, max = 5_000_000 }: CurrencyFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          $
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={100}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface YearsFieldProps {
  value: number;
  onChange: (value: number) => void;
}

function YearsField({ value, onChange }: YearsFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">Years of income to replace</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={MIN_YEARS}
          max={MAX_YEARS}
          step={1}
          value={Number.isFinite(value) ? value : MIN_YEARS}
          onChange={(e) => {
            const raw = Math.round(Number(e.target.value));
            const clamped = Number.isFinite(raw)
              ? Math.min(Math.max(raw, MIN_YEARS), MAX_YEARS)
              : MIN_YEARS;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          years
        </span>
      </span>
      <span className="mt-1 block text-xs text-slate-400">
        Until children are grown, a mortgage is paid off, or retirement age
      </span>
    </label>
  );
}

interface RateFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

function RateField({ value, onChange }: RateFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">
        Annual discount / investment rate
      </span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={MIN_RATE}
          max={MAX_RATE}
          step={0.1}
          placeholder="e.g. 4"
          value={value === null ? "" : value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange(null);
              return;
            }
            const num = Number(raw);
            if (!Number.isFinite(num)) {
              onChange(null);
              return;
            }
            onChange(Math.min(Math.max(num, MIN_RATE), MAX_RATE));
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      <span className="mt-1 block text-xs text-slate-400">
        This is your own assumption, not a guaranteed or recommended return. Leave it blank until you
        decide what to test.
      </span>
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

export function IncomeReplacementCalculatorTool() {
  const [annualIncome, setAnnualIncome] = useState(60_000);
  const [years, setYears] = useState(20);
  const [ratePercent, setRatePercent] = useState<number | null>(null);
  const [lumpSum, setLumpSum] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalUndiscounted = annualIncome * years;
    const hasRate = ratePercent !== null;

    let presentValue: number | null = null;
    let discountBenefit: number | null = null;

    if (hasRate) {
      const r = ratePercent! / 100;
      const n = years;
      presentValue = r === 0 ? annualIncome * n : annualIncome * ((1 - Math.pow(1 + r, -n)) / r);
      discountBenefit = totalUndiscounted - presentValue;
    }

    const totalNeeded = presentValue !== null ? presentValue + lumpSum : null;

    return {
      totalUndiscounted,
      hasRate,
      presentValue,
      discountBenefit,
      totalNeeded,
    };
  }, [annualIncome, years, ratePercent, lumpSum]);

  async function copyResult() {
    const lines = [
      "Income replacement calculation",
      `Annual income to replace: ${USD.format(annualIncome)} for ${years} years`,
      result.hasRate && result.presentValue !== null
        ? `Present value at ${ratePercent}% annual return: ${USD.format(result.presentValue)}`
        : "Discount rate not entered — enter a rate to calculate a present value",
      lumpSum > 0 && result.totalNeeded !== null
        ? `Plus ${USD.format(lumpSum)} for debts/final expenses = ${USD.format(result.totalNeeded)} total`
        : null,
      "Estimate only, not financial or insurance advice. insurancetools.org/tools/life/income-replacement-calculator",
    ].filter(Boolean) as string[];
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
        <span className="label-mono text-slate-500">INCOME REPLACEMENT CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <CurrencyField
            label="Annual income to replace"
            hint="The income your household would need to replace each year"
            value={annualIncome}
            onChange={setAnnualIncome}
          />
          <YearsField value={years} onChange={setYears} />
          <RateField value={ratePercent} onChange={setRatePercent} />
          <CurrencyField
            label="Lump sum to add (optional)"
            hint="Debts, final expenses, or a mortgage payoff on top of income replacement"
            value={lumpSum}
            onChange={setLumpSum}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">LUMP SUM NEEDED</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.totalNeeded !== null ? USD.format(result.totalNeeded) : "Enter a rate"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasRate
                ? `Invested at ${ratePercent}% a year and drawn down over ${years} years${
                    lumpSum > 0 ? ", plus your added lump sum" : ""
                  }`
                : `Type a discount rate on the left to calculate the present value of ${USD.format(
                    annualIncome
                  )}/year for ${years} years`}
            </p>
          </div>

          {result.hasRate && result.presentValue !== null && result.discountBenefit !== null && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Replacing {USD.format(annualIncome)}/year for {years} years by simply saving cash would take{" "}
              {USD.format(result.totalUndiscounted)}. Because this lump sum keeps earning{" "}
              {ratePercent}% while it&apos;s being drawn down, it only takes{" "}
              {USD.format(result.presentValue)} — about {USD.format(result.discountBenefit)} less.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Income × years (undiscounted)" value={USD.format(result.totalUndiscounted)} />
            <Figure
              label="Present value of income"
              value={result.presentValue !== null ? USD.format(result.presentValue) : "—"}
              tone="accent"
            />
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Why the lump sum is smaller</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              A dollar received ten years from now is worth less today than a dollar in hand right now,
              because today&apos;s dollar can be invested and grow in the meantime. Present value math runs
              that logic in reverse: it finds the smaller amount that, invested today at your chosen rate
              and drawn down every year, still fully funds the income stream you specified. A higher rate
              assumption produces a smaller required lump sum; a lower or zero rate assumption produces a
              larger one.
            </p>
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
        Estimate only. This tool computes a present value using the rate you enter; it is not a rate of
        return any investment or insurance product guarantees, and it does not model inflation
        separately. To account for inflation, use a lower rate that reflects your expected return net of
        inflation rather than a raw market return. This is not financial, tax, or insurance advice —
        confirm any life insurance purchase amount with a licensed insurance agent or financial
        professional.
      </div>
    </div>
  );
}

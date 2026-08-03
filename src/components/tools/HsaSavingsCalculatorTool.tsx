"use client";

/**
 * HSA savings calculator.
 *
 * Projects year-by-year HSA growth as a starting balance compounding
 * annually plus a level annual contribution added at each year end (future
 * value of an ordinary annuity), using a rate of return the user supplies
 * themselves. This tool never asserts a "typical" or "expected" market
 * return, and it never states a specific IRS contribution limit, since both
 * change over time and fabricating either would be exactly the kind of
 * invented figure this site avoids. It also estimates the current-year tax
 * savings from pre-tax contributions using the user's own marginal tax
 * rate, entered voluntarily and never inferred.
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

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function DollarField({ label, hint, value, onChange, max = 1_000_000 }: DollarFieldProps) {
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
          step={50}
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

interface PercentFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function PercentField({ label, hint, value, onChange, max = 30, step = 0.1 }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
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
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function YearsField({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[13px] font-medium text-slate-600">
        <span>Years to project</span>
        <span className="tabular-nums text-slate-900">{value}</span>
      </span>
      <input
        type="range"
        min={1}
        max={40}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-blue-600"
      />
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

interface YearRow {
  year: number;
  contributed: number;
  balance: number;
  growth: number;
}

/** Picks a readable subset of years for the on-screen table: every 5th year, plus year 1 and the final year. */
function selectDisplayYears(rows: YearRow[]): YearRow[] {
  if (rows.length <= 8) return rows;
  const picked = new Map<number, YearRow>();
  rows.forEach((row) => {
    if (row.year === 1 || row.year % 5 === 0 || row.year === rows.length) {
      picked.set(row.year, row);
    }
  });
  return Array.from(picked.values()).sort((a, b) => a.year - b.year);
}

export function HsaSavingsCalculatorTool() {
  const [balance, setBalance] = useState(3_000);
  const [contribution, setContribution] = useState(4_000);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(6);
  const [taxRate, setTaxRate] = useState(22);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = returnRate / 100;
    const rows: YearRow[] = [];
    let running = balance;
    let contributed = 0;

    for (let year = 1; year <= years; year++) {
      running = running * (1 + r) + contribution;
      contributed += contribution;
      rows.push({
        year,
        contributed,
        balance: running,
        growth: running - balance - contributed,
      });
    }

    const finalBalance = rows.length ? rows[rows.length - 1].balance : balance;
    const totalContributed = rows.length ? rows[rows.length - 1].contributed : 0;
    const totalGrowth = finalBalance - balance - totalContributed;

    const annualTaxSavings = contribution * (taxRate / 100);
    const lifetimeTaxSavings = totalContributed * (taxRate / 100);

    return {
      rows,
      displayRows: selectDisplayYears(rows),
      finalBalance,
      totalContributed,
      totalGrowth,
      annualTaxSavings,
      lifetimeTaxSavings,
    };
  }, [balance, contribution, years, returnRate, taxRate]);

  async function copyResult() {
    const lines = [
      "HSA savings projection",
      `Starting balance: ${USD.format(balance)}, contributing ${USD.format(contribution)}/year for ${years} years at an assumed ${returnRate}% annual return`,
      `Projected balance after ${years} years: ${USD.format(result.finalBalance)}`,
      `Total contributed over that period: ${USD.format(result.totalContributed)}`,
      `Estimated investment growth: ${USD.format(result.totalGrowth)}`,
      taxRate > 0
        ? `Estimated tax savings from pre-tax contributions: ${USD.format(result.annualTaxSavings)}/year, ${USD.format(result.lifetimeTaxSavings)} over ${years} years at a ${taxRate}% marginal rate`
        : "Enter a marginal tax rate to see estimated tax savings from pre-tax contributions",
      "Projection only, not a guarantee. Actual returns vary and IRS contribution limits change annually. insurancetools.org/tools/health/hsa-savings-calculator",
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
        <span className="label-mono text-slate-500">HSA SAVINGS CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Current HSA balance"
            hint="What's sitting in the account today"
            value={balance}
            onChange={setBalance}
          />
          <DollarField
            label="Annual contribution"
            hint="Your own contributions plus any employer contribution, combined"
            value={contribution}
            onChange={setContribution}
            max={50_000}
          />
          <YearsField value={years} onChange={setYears} />
          <PercentField
            label="Expected annual investment return"
            hint="Your own assumption — this tool doesn't guess a market return for you"
            value={returnRate}
            onChange={setReturnRate}
            max={20}
          />
          <PercentField
            label="Your marginal tax rate (optional)"
            hint="Used only to estimate the tax savings on your contributions"
            value={taxRate}
            onChange={setTaxRate}
            max={50}
            step={1}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">PROJECTED BALANCE AFTER {years} YEARS</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.finalBalance)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(balance)} starting balance + {USD.format(result.totalContributed)} contributed +{" "}
              {USD.format(result.totalGrowth)} estimated growth
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total contributed" value={USD.format(result.totalContributed)} />
            <Figure label="Estimated growth" value={USD.format(result.totalGrowth)} tone="accent" />
          </div>

          {taxRate > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              At a {taxRate}% marginal tax rate, contributing {USD.format(contribution)} this year could lower
              your taxable income enough to save roughly {USD.format(result.annualTaxSavings)} in tax, and about{" "}
              {USD.format(result.lifetimeTaxSavings)} across all {years} years of contributions shown here.
            </div>
          )}

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Year-end balance</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400">
                    <th className="py-1 pr-3 font-medium">Year</th>
                    <th className="py-1 pr-3 font-medium">Contributed</th>
                    <th className="py-1 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.displayRows.map((row) => (
                    <tr key={row.year} className="border-t border-hairline text-slate-700">
                      <td className="py-1.5 pr-3 tabular-nums">{row.year}</td>
                      <td className="py-1.5 pr-3 tabular-nums">{USD.format(row.contributed)}</td>
                      <td className="py-1.5 tabular-nums font-medium text-slate-900">
                        {USD.format(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        Estimate only. This projection assumes a constant annual contribution and a constant annual
        return you choose yourself; real markets don&apos;t compound in a straight line, and IRS HSA
        contribution limits change every year, so confirm your current limit before contributing.
        Nothing here is investment, tax, or insurance advice.
      </div>
    </div>
  );
}

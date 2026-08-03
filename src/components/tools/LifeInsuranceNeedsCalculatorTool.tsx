"use client";

/**
 * Life insurance needs calculator.
 *
 * Deliberately does not use a fixed income-multiple rule of thumb (e.g.
 * "buy 10x your income"). Every dollar in the total is either entered by
 * the user or a clearly labeled, editable placeholder. The tool builds the
 * number the same way a fee-only planner would sketch it on paper: add up
 * what your household would need to replace or pay for, then subtract what
 * you already have set aside to cover it.
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

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 10_000_000, step = 100 }: NumberFieldProps) {
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
          step={step}
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
          min={0}
          max={40}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), 40) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          years
        </span>
      </span>
      <span className="mt-1 block text-xs text-slate-400">
        How many years your household would need this income covered, e.g. until the youngest child is
        financially independent or until retirement savings take over.
      </span>
    </label>
  );
}

interface LineItemProps {
  label: string;
  value: number;
  sign: "+" | "-";
}

function LineItem({ label, value, sign }: LineItemProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-xs text-slate-600">{label}</span>
      <span className={`text-sm font-medium tabular-nums ${sign === "-" ? "text-red-600" : "text-slate-900"}`}>
        {sign === "-" && value > 0 ? "−" : ""}
        {USD.format(value)}
      </span>
    </div>
  );
}

export function LifeInsuranceNeedsCalculatorTool() {
  const [annualIncome, setAnnualIncome] = useState(65_000);
  const [yearsToReplace, setYearsToReplace] = useState(15);
  const [mortgageBalance, setMortgageBalance] = useState(220_000);
  const [otherDebt, setOtherDebt] = useState(8_000);
  const [finalExpenses, setFinalExpenses] = useState(15_000);
  const [futureExpenses, setFutureExpenses] = useState(80_000);
  const [liquidAssets, setLiquidAssets] = useState(20_000);
  const [existingCoverage, setExistingCoverage] = useState(50_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const incomeReplacement = annualIncome * yearsToReplace;
    const debts = mortgageBalance + otherDebt;
    const grossNeed = incomeReplacement + debts + finalExpenses + futureExpenses;
    const offsets = liquidAssets + existingCoverage;
    const netNeed = Math.max(0, grossNeed - offsets);

    return {
      incomeReplacement,
      debts,
      grossNeed,
      offsets,
      netNeed,
      isZero: grossNeed > 0 && netNeed === 0,
    };
  }, [
    annualIncome,
    yearsToReplace,
    mortgageBalance,
    otherDebt,
    finalExpenses,
    futureExpenses,
    liquidAssets,
    existingCoverage,
  ]);

  async function copyResult() {
    const lines = [
      "Life insurance needs estimate",
      `Income replacement (${yearsToReplace} yrs x ${USD.format(annualIncome)}): ${USD.format(result.incomeReplacement)}`,
      `Debts (mortgage + other): ${USD.format(result.debts)}`,
      `Final expenses: ${USD.format(finalExpenses)}`,
      `Future expenses (e.g. college): ${USD.format(futureExpenses)}`,
      `Subtotal need: ${USD.format(result.grossNeed)}`,
      `Less liquid assets: -${USD.format(liquidAssets)}`,
      `Less existing life insurance: -${USD.format(existingCoverage)}`,
      `Estimated coverage gap: ${USD.format(result.netNeed)}`,
      "Estimate only, not financial or insurance advice. insurancetools.org/tools/life/life-insurance-needs-calculator",
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
        <span className="label-mono text-slate-500">LIFE INSURANCE NEEDS CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Annual income you want replaced"
            hint="What your household would lose without your paycheck"
            value={annualIncome}
            onChange={setAnnualIncome}
          />
          <YearsField value={yearsToReplace} onChange={setYearsToReplace} />
          <NumberField
            label="Remaining mortgage balance"
            hint="Enter $0 if you rent or the home is paid off"
            value={mortgageBalance}
            onChange={setMortgageBalance}
          />
          <NumberField
            label="Other debt to pay off"
            hint="Credit cards, auto loans, student loans, personal loans"
            value={otherDebt}
            onChange={setOtherDebt}
          />
          <NumberField
            label="Final expenses"
            hint="Funeral and burial costs; $15,000 is a common planning placeholder, edit freely"
            value={finalExpenses}
            onChange={setFinalExpenses}
          />
          <NumberField
            label="Future expenses"
            hint="Lump sum for things like college tuition, enter $0 if none apply"
            value={futureExpenses}
            onChange={setFutureExpenses}
          />
          <NumberField
            label="Liquid assets already available"
            hint="Savings and investments your family could use right away"
            value={liquidAssets}
            onChange={setLiquidAssets}
          />
          <NumberField
            label="Existing life insurance"
            hint="Coverage you already have through work or a separate policy"
            value={existingCoverage}
            onChange={setExistingCoverage}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED COVERAGE GAP</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.netNeed)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.isZero
                ? "Your entered assets and existing coverage already cover the need below. Re-check this as your income, debts, or coverage change."
                : "The amount of new or additional life insurance this scenario points to, built entirely from the numbers you entered."}
            </p>
          </div>

          <div className="space-y-0.5 border-t border-hairline pt-4">
            <p className="mb-1 text-xs font-semibold text-slate-700">How this number was built</p>
            <LineItem label={`Income replacement (${yearsToReplace} yrs)`} value={result.incomeReplacement} sign="+" />
            <LineItem label="Debts (mortgage + other)" value={result.debts} sign="+" />
            <LineItem label="Final expenses" value={finalExpenses} sign="+" />
            <LineItem label="Future expenses" value={futureExpenses} sign="+" />
            <div className="flex items-baseline justify-between gap-3 border-t border-hairline py-1.5">
              <span className="text-xs font-semibold text-slate-700">Subtotal need</span>
              <span className="text-sm font-semibold tabular-nums text-slate-900">{USD.format(result.grossNeed)}</span>
            </div>
            <LineItem label="Liquid assets" value={liquidAssets} sign="-" />
            <LineItem label="Existing life insurance" value={existingCoverage} sign="-" />
            <div className="flex items-baseline justify-between gap-3 border-t border-hairline pt-1.5">
              <span className="text-xs font-semibold text-slate-700">Estimated coverage gap</span>
              <span className="text-sm font-semibold tabular-nums text-blue-600">{USD.format(result.netNeed)}</span>
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
        Estimate only. This tool adds up the needs you enter and subtracts the assets and coverage you
        already have; it does not apply an income-multiple rule of thumb, does not know your health,
        age, or policy pricing, and is not a quote or personalized financial advice. Review the result
        with a licensed insurance agent or financial professional before buying or changing a policy.
      </div>
    </div>
  );
}

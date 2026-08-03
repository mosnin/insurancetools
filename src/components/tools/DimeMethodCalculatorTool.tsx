"use client";

/**
 * DIME method life insurance calculator.
 *
 * Implements the widely-taught DIME shorthand for a quick life insurance
 * need estimate:
 *   D — non-mortgage Debt the household carries today
 *   I — Income the policy should replace, multiplied by the number of years
 *       the household wants that income replaced
 *   M — remaining Mortgage balance
 *   E — future Education costs (e.g. a per-child college estimate)
 * Total = D + I + M + E, then existing coverage and liquid assets already
 * earmarked for this purpose are subtracted to produce a net additional
 * coverage figure.
 *
 * DIME is a flat multiplier method, not a customized needs analysis. It is
 * one standard shorthand among several, and the tool says so both in the
 * disclaimer and in the linked alternative (the site's general-purpose
 * life insurance needs calculator) for anyone who wants a more detailed
 * model. All math runs client-side; nothing typed here is sent anywhere.
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
}

function NumberField({ label, hint, value, onChange, max = 10_000_000 }: NumberFieldProps) {
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
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function YearsField({ label, hint, value, onChange, min = 1, max = 30 }: YearsFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : min}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), min), max) : min;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          years
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function DimeRow({
  letter,
  label,
  detail,
  value,
}: {
  letter: string;
  label: string;
  detail: string;
  value: number;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-600"
        >
          {letter}
        </span>
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="text-xs leading-relaxed text-slate-500">{detail}</p>
        </div>
      </div>
      <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">{USD.format(value)}</p>
    </div>
  );
}

export function DimeMethodCalculatorTool() {
  const [debt, setDebt] = useState(15_000);
  const [annualIncome, setAnnualIncome] = useState(65_000);
  const [yearsToReplace, setYearsToReplace] = useState(10);
  const [mortgageBalance, setMortgageBalance] = useState(220_000);
  const [educationCost, setEducationCost] = useState(60_000);
  const [existingCoverage, setExistingCoverage] = useState(50_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const incomeComponent = annualIncome * yearsToReplace;
    const total = debt + incomeComponent + mortgageBalance + educationCost;
    const netNeed = Math.max(0, total - existingCoverage);
    const covered = existingCoverage >= total;

    return {
      incomeComponent,
      total,
      netNeed,
      covered,
    };
  }, [debt, annualIncome, yearsToReplace, mortgageBalance, educationCost, existingCoverage]);

  async function copyResult() {
    const lines = [
      "DIME method life insurance estimate",
      `D — Non-mortgage debt: ${USD.format(debt)}`,
      `I — Income replacement (${USD.format(annualIncome)} x ${yearsToReplace} years): ${USD.format(result.incomeComponent)}`,
      `M — Remaining mortgage balance: ${USD.format(mortgageBalance)}`,
      `E — Future education costs: ${USD.format(educationCost)}`,
      `DIME total: ${USD.format(result.total)}`,
      `Existing coverage and liquid assets: ${USD.format(existingCoverage)}`,
      result.covered
        ? "Estimated additional coverage needed: $0 (existing coverage already meets the DIME total)"
        : `Estimated additional coverage needed: ${USD.format(result.netNeed)}`,
      "Estimate only, not insurance or financial advice. insurancetools.org/tools/life/dime-method-calculator",
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
        <span className="label-mono text-slate-500">DIME METHOD CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Non-mortgage debt (D)"
            hint="Credit cards, car loans, student loans, personal loans — everything except the mortgage"
            value={debt}
            onChange={setDebt}
          />
          <NumberField
            label="Annual income to replace"
            hint="Gross income the household would lose"
            value={annualIncome}
            onChange={setAnnualIncome}
          />
          <YearsField
            label="Years of income to replace (I)"
            hint="How many years of that income the payout should cover"
            value={yearsToReplace}
            onChange={setYearsToReplace}
          />
          <NumberField
            label="Remaining mortgage balance (M)"
            hint="Current payoff balance, not the original loan amount"
            value={mortgageBalance}
            onChange={setMortgageBalance}
          />
          <NumberField
            label="Future education costs (E)"
            hint="Your own estimate — e.g. a per-child college total"
            value={educationCost}
            onChange={setEducationCost}
          />
          <NumberField
            label="Existing life insurance + liquid assets"
            hint="Coverage already in force plus savings earmarked for this"
            value={existingCoverage}
            onChange={setExistingCoverage}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED ADDITIONAL COVERAGE NEEDED</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-blue-600">
              {USD.format(result.netNeed)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              DIME total {USD.format(result.total)} minus {USD.format(existingCoverage)} of existing
              coverage and liquid assets
            </p>
          </div>

          {result.covered && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Your existing coverage and liquid assets already meet or exceed the DIME total, so this
              method doesn&apos;t point to a coverage gap. Recheck it whenever your debt, income, mortgage,
              or education estimate changes.
            </div>
          )}

          <div className="divide-y divide-hairline border-t border-hairline">
            <DimeRow
              letter="D"
              label="Debt"
              detail="Non-mortgage debt entered above"
              value={debt}
            />
            <DimeRow
              letter="I"
              label="Income"
              detail={`${USD.format(annualIncome)} per year x ${yearsToReplace} years`}
              value={result.incomeComponent}
            />
            <DimeRow
              letter="M"
              label="Mortgage"
              detail="Remaining mortgage balance entered above"
              value={mortgageBalance}
            />
            <DimeRow
              letter="E"
              label="Education"
              detail="Future education costs entered above"
              value={educationCost}
            />
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
        Estimate only. DIME is a flat, four-factor multiplier method, not an individualized needs
        analysis — it doesn&apos;t account for inflation, existing retirement savings growth, a
        surviving spouse&apos;s own future income, funeral costs, or final medical expenses. It also
        doesn&apos;t know your health, age, or an insurer&apos;s underwriting. Use this figure as a
        starting point and confirm it with a licensed insurance agent or financial professional before
        buying a policy.
      </div>
    </div>
  );
}

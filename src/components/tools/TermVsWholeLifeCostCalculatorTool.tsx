"use client";

/**
 * Term vs. whole life insurance cost calculator.
 *
 * This tool does not price either product. It never fabricates a term or
 * whole life premium — the user types in numbers from their own quote and
 * illustration. What the tool computes is the classic "buy term, invest
 * the difference" (BTID) math: the total premium outlay for each option
 * over a chosen horizon, and the future value of investing the annual
 * premium gap between the two at a rate of return the user chooses,
 * compared against a whole life cash-value figure the user can optionally
 * enter from their own illustration.
 *
 * The output is a math comparison, not a recommendation. Whole life's
 * guaranteed insurability and lifelong coverage, and the market risk
 * inherent in the invested-difference side, are both called out in the
 * page copy and the in-tool disclaimer rather than priced in here.
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
  step?: number;
}

function DollarField({ label, hint, value, onChange, max = 1_000_000, step = 10 }: DollarFieldProps) {
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
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function YearsField({ label, hint, value, onChange, min = 1, max = 40 }: YearsFieldProps) {
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
            const raw = Math.round(Number(e.target.value));
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : min;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-12 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          years
        </span>
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
  min?: number;
  max?: number;
}

function PercentField({ label, hint, value, onChange, min = 0, max = 12 }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={0.1}
          value={Number.isFinite(value) ? value : min}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : min;
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

export function TermVsWholeLifeCostCalculatorTool() {
  const [termPremium, setTermPremium] = useState(450);
  const [wholePremium, setWholePremium] = useState(2600);
  const [horizonYears, setHorizonYears] = useState(20);
  const [returnRate, setReturnRate] = useState(6);
  const [cashValueAtHorizon, setCashValueAtHorizon] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalTermOutlay = termPremium * horizonYears;
    const totalWholeOutlay = wholePremium * horizonYears;
    const annualGap = wholePremium - termPremium;
    const hasPositiveGap = annualGap > 0;

    const r = returnRate / 100;
    const investedValue = !hasPositiveGap
      ? 0
      : r === 0
        ? annualGap * horizonYears
        : annualGap * ((Math.pow(1 + r, horizonYears) - 1) / r);

    const hasCashValue = cashValueAtHorizon > 0;
    const cashValueDelta = hasCashValue ? investedValue - cashValueAtHorizon : null;

    const netCostWhole = totalWholeOutlay - cashValueAtHorizon;
    const netCostBTID = totalTermOutlay; // term expires with no residual value

    const highReturnAssumption = returnRate > 8;

    return {
      totalTermOutlay,
      totalWholeOutlay,
      annualGap,
      hasPositiveGap,
      investedValue,
      hasCashValue,
      cashValueDelta,
      netCostWhole,
      netCostBTID,
      highReturnAssumption,
    };
  }, [termPremium, wholePremium, horizonYears, returnRate, cashValueAtHorizon]);

  async function copyResult() {
    const lines = [
      `Term vs. whole life cost comparison over ${horizonYears} years`,
      `Total term premiums paid: ${USD.format(result.totalTermOutlay)}`,
      `Total whole life premiums paid: ${USD.format(result.totalWholeOutlay)}`,
      result.hasPositiveGap
        ? `Annual premium gap invested at ${returnRate}%/yr: ${USD.format(result.investedValue)}`
        : "Whole life premium is not higher than term, so there is no positive gap to invest.",
      result.hasCashValue
        ? `Whole life illustrated cash value entered: ${USD.format(cashValueAtHorizon)} (difference vs. invested gap: ${USD.format(Math.abs(result.cashValueDelta ?? 0))})`
        : "No whole life cash value entered for comparison.",
      "Math comparison only, not investment or insurance advice. insurancetools.org/tools/life/term-vs-whole-life-cost-calculator",
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
        <span className="label-mono text-slate-500">TERM VS. WHOLE LIFE COST CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Your annual term life premium"
            hint="From an actual term quote you've received"
            value={termPremium}
            onChange={setTermPremium}
          />
          <DollarField
            label="Your annual whole life premium"
            hint="From an actual whole life illustration you've received"
            value={wholePremium}
            onChange={setWholePremium}
          />
          <YearsField
            label="Comparison horizon"
            hint="How many years you want to compare, e.g. the term length"
            value={horizonYears}
            onChange={setHorizonYears}
          />
          <PercentField
            label="Assumed annual return on invested difference"
            hint="A hypothetical rate you choose to test, not a guarantee"
            value={returnRate}
            onChange={setReturnRate}
          />
          <DollarField
            label="Whole life cash value at end of horizon (optional)"
            hint="From your illustration's cash value column, if you have one"
            value={cashValueAtHorizon}
            onChange={setCashValueAtHorizon}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">INVESTED VALUE OF THE PREMIUM GAP</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-blue-600">
              {result.hasPositiveGap ? USD.format(result.investedValue) : USD.format(0)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasPositiveGap
                ? `If you invested the ${USD.format(result.annualGap)}/year premium gap every year for ${horizonYears} years at a hypothetical ${returnRate}% annual return, compounded annually.`
                : "Your whole life premium isn't higher than your term premium, so there's no positive gap to invest in this scenario."}
            </p>
          </div>

          {result.highReturnAssumption && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              A sustained {returnRate}%/year return is an optimistic assumption for a diversified portfolio
              over {horizonYears} years. Try re-running this with a more conservative rate to see how much
              the comparison depends on that single number.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total term outlay" value={USD.format(result.totalTermOutlay)} />
            <Figure label="Total whole life outlay" value={USD.format(result.totalWholeOutlay)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Annual premium gap</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasPositiveGap
                  ? `Whole life costs ${USD.format(result.annualGap)} more per year than term at the premiums you entered. That gap is what the "buy term, invest the difference" scenario assumes you invest.`
                  : "Whole life doesn't cost more per year than term at the premiums you entered, so this comparison has nothing to invest on the term side."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Vs. whole life cash value</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasCashValue
                  ? "Enter your illustration's cash value at this horizon to compare it against the invested-difference figure above."
                  : result.hasPositiveGap
                    ? (result.cashValueDelta ?? 0) >= 0
                      ? `At your assumed ${returnRate}% return, the invested gap (${USD.format(result.investedValue)}) is ${USD.format(result.cashValueDelta ?? 0)} higher than the ${USD.format(cashValueAtHorizon)} illustrated cash value you entered.`
                      : `At your assumed ${returnRate}% return, the invested gap (${USD.format(result.investedValue)}) is ${USD.format(Math.abs(result.cashValueDelta ?? 0))} lower than the ${USD.format(cashValueAtHorizon)} illustrated cash value you entered.`
                    : "There's no invested gap to compare against the cash value you entered, since the whole life premium isn't higher than term here."}
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
        This is a math comparison of the numbers you entered, not investment or insurance advice, and it
        does not know or estimate any real premium or cash value for you. The invested-difference figure
        assumes a constant hypothetical rate of return with no fees, taxes, or missed contributions,
        which real investment accounts rarely deliver every single year. It also does not price in
        features unique to whole life, such as guaranteed insurability, lifelong coverage, and cash
        value that doesn&apos;t carry market risk the way an invested difference does. Review both an actual
        term quote and an actual whole life illustration with a licensed insurance agent or financial
        professional before deciding between them.
      </div>
    </div>
  );
}

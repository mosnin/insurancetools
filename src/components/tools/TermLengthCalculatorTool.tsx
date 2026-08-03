"use client";

/**
 * Term life insurance length calculator.
 *
 * Deliberately does not output a single "everyone needs a 20-year term"
 * answer. Term length is really a question of "how many years does someone
 * depend on my income or my debt," and that number is different for a new
 * parent with a 25-year mortgage than for an empty-nester five years from
 * retirement. So this tool computes up to three independent horizons from
 * the user's own numbers — years left on a mortgage, years until the
 * youngest child reaches a chosen independence age, and years until planned
 * retirement — and recommends covering the longest one that actually
 * applies, rounded up to the nearest term length insurers commonly sell
 * (10, 15, 20, 25, or 30 years).
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

/** Term lengths most term life insurers commonly offer as standard products. */
const AVAILABLE_TERMS = [10, 15, 20, 25, 30];

function roundUpToAvailableTerm(years: number): { term: number; exceedsLongest: boolean } {
  if (years <= 0) return { term: AVAILABLE_TERMS[0], exceedsLongest: false };
  const match = AVAILABLE_TERMS.find((t) => t >= years);
  if (match) return { term: match, exceedsLongest: false };
  return { term: AVAILABLE_TERMS[AVAILABLE_TERMS.length - 1], exceedsLongest: true };
}

interface YearFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

function YearField({ label, hint, value, onChange, max = 100, disabled = false }: YearFieldProps) {
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
          disabled={disabled}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          yrs
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface ToggleRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  children?: ReactNode;
}

function ToggleRow({ checked, onChange, label, children }: ToggleRowProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-3.5">
      <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        {label}
      </label>
      {checked && <div className="mt-3 grid grid-cols-2 gap-3">{children}</div>}
    </div>
  );
}

interface HorizonRowProps {
  label: string;
  detail: string;
  years: number | null;
  isLongest: boolean;
}

function HorizonRow({ label, detail, years, isLongest }: HorizonRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${
        isLongest ? "bg-blue-50" : ""
      }`}
    >
      <div>
        <p className={`text-xs font-semibold ${isLongest ? "text-blue-800" : "text-slate-700"}`}>{label}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p>
      </div>
      <p className={`text-sm font-semibold tabular-nums ${isLongest ? "text-blue-700" : "text-slate-900"}`}>
        {years === null ? "—" : `${years} yrs`}
      </p>
    </div>
  );
}

export function TermLengthCalculatorTool() {
  const [includeMortgage, setIncludeMortgage] = useState(true);
  const [mortgageYears, setMortgageYears] = useState(22);

  const [includeChild, setIncludeChild] = useState(true);
  const [childAge, setChildAge] = useState(7);
  const [independenceAge, setIndependenceAge] = useState(18);

  const [includeRetirement, setIncludeRetirement] = useState(true);
  const [currentAge, setCurrentAge] = useState(39);
  const [retirementAge, setRetirementAge] = useState(65);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const mortgageHorizon = includeMortgage ? Math.max(0, mortgageYears) : null;
    const childHorizon = includeChild ? Math.max(0, independenceAge - childAge) : null;
    const retirementHorizon = includeRetirement ? Math.max(0, retirementAge - currentAge) : null;

    const horizons = [
      { key: "mortgage", years: mortgageHorizon },
      { key: "child", years: childHorizon },
      { key: "retirement", years: retirementHorizon },
    ].filter((h): h is { key: string; years: number } => h.years !== null);

    const anySelected = horizons.length > 0;
    const rawMax = anySelected ? Math.max(...horizons.map((h) => h.years)) : 0;
    const longestKey = anySelected
      ? horizons.find((h) => h.years === rawMax)?.key ?? null
      : null;

    const { term, exceedsLongest } = anySelected
      ? roundUpToAvailableTerm(rawMax)
      : { term: 0, exceedsLongest: false };

    return {
      mortgageHorizon,
      childHorizon,
      retirementHorizon,
      anySelected,
      rawMax,
      longestKey,
      term,
      exceedsLongest,
    };
  }, [
    includeMortgage,
    mortgageYears,
    includeChild,
    childAge,
    independenceAge,
    includeRetirement,
    currentAge,
    retirementAge,
  ]);

  async function copyResult() {
    const lines = [
      "Term life insurance length estimate",
      result.anySelected
        ? `Recommended term: ${result.term}-year term (longest horizon entered was ${result.rawMax} years, rounded up to the nearest commonly sold length)`
        : "Select at least one horizon (mortgage, children, or retirement) to get a recommendation",
      result.mortgageHorizon !== null ? `Mortgage payoff horizon: ${result.mortgageHorizon} years` : null,
      result.childHorizon !== null
        ? `Years until youngest child reaches age ${independenceAge}: ${result.childHorizon} years`
        : null,
      result.retirementHorizon !== null ? `Years until planned retirement: ${result.retirementHorizon} years` : null,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/life/term-length-calculator",
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText((lines as string[]).join("\n"));
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
        <span className="label-mono text-slate-500">TERM LIFE INSURANCE LENGTH CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-3 bg-white p-5 sm:p-6">
          <p className="text-xs text-slate-500">
            Check each horizon that applies to you and fill in the numbers. The calculator recommends
            covering the longest one.
          </p>

          <ToggleRow checked={includeMortgage} onChange={setIncludeMortgage} label="Mortgage payoff">
            <div className="col-span-2">
              <YearField
                label="Years remaining on mortgage"
                hint="How many years left until it's paid off"
                value={mortgageYears}
                onChange={setMortgageYears}
                max={40}
              />
            </div>
          </ToggleRow>

          <ToggleRow checked={includeChild} onChange={setIncludeChild} label="Dependent children">
            <YearField
              label="Youngest child's current age"
              value={childAge}
              onChange={setChildAge}
              max={25}
            />
            <YearField
              label="Cover until age"
              hint="Independence age"
              value={independenceAge}
              onChange={setIndependenceAge}
              max={30}
            />
          </ToggleRow>

          <ToggleRow checked={includeRetirement} onChange={setIncludeRetirement} label="Working years until retirement">
            <YearField label="Your current age" value={currentAge} onChange={setCurrentAge} max={90} />
            <YearField
              label="Planned retirement age"
              value={retirementAge}
              onChange={setRetirementAge}
              max={95}
            />
          </ToggleRow>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          {result.anySelected ? (
            <>
              <div>
                <p className="label-mono text-slate-400">RECOMMENDED TERM LENGTH</p>
                <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
                  {result.term}-year term
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {result.exceedsLongest
                    ? `Your longest horizon is ${result.rawMax} years, longer than the longest term (30 years) most insurers sell as a standard product. Rounded up to the ${result.term}-year ceiling — see the note below.`
                    : `Your longest horizon is ${result.rawMax} years, rounded up to the nearest term length commonly sold (10, 15, 20, 25, or 30 years).`}
                </p>
              </div>

              <div className="space-y-1 border-t border-hairline pt-4">
                <HorizonRow
                  label="Mortgage payoff"
                  detail={
                    includeMortgage ? `${mortgageYears} years remaining` : "Not selected"
                  }
                  years={result.mortgageHorizon}
                  isLongest={result.longestKey === "mortgage"}
                />
                <HorizonRow
                  label="Youngest child's independence"
                  detail={
                    includeChild
                      ? `Age ${childAge} now, covered until age ${independenceAge}`
                      : "Not selected"
                  }
                  years={result.childHorizon}
                  isLongest={result.longestKey === "child"}
                />
                <HorizonRow
                  label="Years to retirement"
                  detail={includeRetirement ? `Age ${currentAge} now, retiring at ${retirementAge}` : "Not selected"}
                  years={result.retirementHorizon}
                  isLongest={result.longestKey === "retirement"}
                />
              </div>

              {result.exceedsLongest && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
                  A single term policy longer than 30 years isn&apos;t a standard offering from most term
                  insurers. Options worth asking a licensed agent about include laddering two policies
                  (for example a 20-year and a 30-year term stacked together) or reviewing whether a
                  permanent policy fits part of the need.
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Select at least one horizon on the left — mortgage payoff, dependent children, or years to
              retirement — to get a term length recommendation.
            </div>
          )}

          <button
            type="button"
            onClick={copyResult}
            disabled={!result.anySelected}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy result"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This tool recommends a term length based on the financial horizons you enter — it
        does not know your health, your budget, your existing coverage, or your state&apos;s available
        products. It is not a quote or insurance advice. Confirm underwriting, pricing, and available
        term lengths with a licensed life insurance agent before buying or changing a policy.
      </div>
    </div>
  );
}

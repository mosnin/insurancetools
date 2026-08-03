"use client";

/**
 * Per-occurrence vs. annual aggregate deductible calculator.
 *
 * Most deductible comparisons only vary the deductible amount. This tool
 * varies the *structure* instead: it takes one entered deductible figure and
 * runs it two ways across the same list of hypothetical claims for a policy
 * year.
 *
 * - Per-occurrence: the deductible resets and applies in full to every
 *   single claim, no matter how many claims happen in the year.
 * - Annual aggregate: the deductible is a single cap on the TOTAL the
 *   policyholder pays across every claim combined for the year. Once the
 *   running total of what the policyholder has paid reaches that cap, the
 *   insurer covers 100% of every further loss for the rest of the policy
 *   year.
 *
 * The two structures produce an identical result when there is exactly one
 * claim in the year. The gap only opens up once a second or third claim
 * occurs, which is the entire point of the comparison.
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy, Plus, X } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const MAX_AMOUNT = 25_000_000;
const MAX_CLAIMS = 8;
const MIN_CLAIMS = 1;

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = MAX_AMOUNT }: NumberFieldProps) {
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

function ClaimRow({
  index,
  value,
  onChange,
  onRemove,
  removable,
}: {
  index: number;
  value: number;
  onChange: (value: number) => void;
  onRemove: () => void;
  removable: boolean;
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <NumberField label={`Claim ${index + 1} amount`} value={value} onChange={onChange} />
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={!removable}
        aria-label={`Remove claim ${index + 1}`}
        className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
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

export function PerOccurrenceVsAnnualAggregateDeductibleCalculatorTool() {
  const [deductible, setDeductible] = useState(10_000);
  const [claims, setClaims] = useState<number[]>([4_000, 12_000, 25_000]);
  const [copied, setCopied] = useState(false);

  function updateClaim(index: number, value: number) {
    setClaims((prev) => prev.map((c, i) => (i === index ? value : c)));
  }

  function addClaim() {
    setClaims((prev) => (prev.length >= MAX_CLAIMS ? prev : [...prev, 0]));
  }

  function removeClaim(index: number) {
    setClaims((prev) => (prev.length <= MIN_CLAIMS ? prev : prev.filter((_, i) => i !== index)));
  }

  const result = useMemo(() => {
    const d = Math.max(0, deductible);

    const rows = claims.reduce<
      { claim: number; perOccurrenceOOP: number; perOccurrenceInsurerPays: number; aggregateOOP: number; aggregateInsurerPays: number; cumulativeAggregatePaid: number }[]
    >((acc, claimAmount) => {
      const claim = Math.max(0, claimAmount);
      const perOccurrenceOOP = Math.min(d, claim);
      const paidSoFar = acc.length > 0 ? acc[acc.length - 1].cumulativeAggregatePaid : 0;
      const remainingCap = Math.max(0, d - paidSoFar);
      const aggregateOOP = Math.min(claim, remainingCap);

      acc.push({
        claim,
        perOccurrenceOOP,
        perOccurrenceInsurerPays: claim - perOccurrenceOOP,
        aggregateOOP,
        aggregateInsurerPays: claim - aggregateOOP,
        cumulativeAggregatePaid: paidSoFar + aggregateOOP,
      });
      return acc;
    }, []);

    const totalClaims = rows.reduce((sum, r) => sum + r.claim, 0);
    const perOccurrenceTotalOOP = rows.reduce((sum, r) => sum + r.perOccurrenceOOP, 0);
    const aggregateTotalOOP = rows.reduce((sum, r) => sum + r.aggregateOOP, 0);
    const difference = perOccurrenceTotalOOP - aggregateTotalOOP;

    const claimsWithLosses = rows.filter((r) => r.claim > 0).length;
    const capReachedAtIndex = rows.findIndex((r) => r.cumulativeAggregatePaid >= d && d > 0);

    return {
      rows,
      totalClaims,
      perOccurrenceTotalOOP,
      aggregateTotalOOP,
      difference,
      claimsWithLosses,
      capReachedAtIndex,
      deductible: d,
    };
  }, [deductible, claims]);

  async function copyResult() {
    const lines = [
      "Per-occurrence vs. annual aggregate deductible comparison",
      `Deductible amount: ${USD.format(result.deductible)}`,
      `Claims entered: ${result.rows.map((r) => USD.format(r.claim)).join(", ")}`,
      `Total out-of-pocket, per-occurrence structure: ${USD.format(result.perOccurrenceTotalOOP)}`,
      `Total out-of-pocket, annual aggregate structure: ${USD.format(result.aggregateTotalOOP)}`,
      result.difference > 0
        ? `The per-occurrence structure costs ${USD.format(result.difference)} more out of pocket across this set of claims.`
        : "Both structures produce the same out-of-pocket total for this set of claims.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/deductibles/per-occurrence-vs-annual-aggregate-deductible-calculator",
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
        <span className="label-mono text-slate-500">PER-OCCURRENCE VS. AGGREGATE DEDUCTIBLE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Deductible amount"
            hint="The same figure, tested as a per-occurrence deductible and as an annual aggregate cap"
            value={deductible}
            onChange={setDeductible}
          />

          <div className="space-y-3 border-t border-hairline pt-4">
            <p className="text-[13px] font-medium text-slate-600">Hypothetical claims for the policy year</p>
            <div className="space-y-3">
              {claims.map((claim, i) => (
                <ClaimRow
                  key={i}
                  index={i}
                  value={claim}
                  onChange={(v) => updateClaim(i, v)}
                  onRemove={() => removeClaim(i)}
                  removable={claims.length > MIN_CLAIMS}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addClaim}
              disabled={claims.length >= MAX_CLAIMS}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add another claim
            </button>
            {claims.length >= MAX_CLAIMS && (
              <p className="text-xs text-slate-400">Limited to {MAX_CLAIMS} claims to keep the comparison readable.</p>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">STRUCTURE MAKES A DIFFERENCE OF</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.difference)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.claimsWithLosses <= 1
                ? "With only one claim entered, both structures produce the same out-of-pocket total. Add a second claim to see the gap open up."
                : `Total out-of-pocket across ${result.claimsWithLosses} claims this year, comparing the two structures.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Per-occurrence OOP" value={USD.format(result.perOccurrenceTotalOOP)} />
            <Figure label="Annual aggregate OOP" value={USD.format(result.aggregateTotalOOP)} tone="accent" />
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Claim-by-claim breakdown</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400">
                    <th className="pb-1.5 pr-2 font-medium">Claim</th>
                    <th className="pb-1.5 pr-2 font-medium">Per-occurrence OOP</th>
                    <th className="pb-1.5 font-medium">Aggregate OOP</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {result.rows.map((r, i) => (
                    <tr key={i} className="border-t border-hairline">
                      <td className="py-1.5 pr-2 tabular-nums">{USD.format(r.claim)}</td>
                      <td className="py-1.5 pr-2 tabular-nums">{USD.format(r.perOccurrenceOOP)}</td>
                      <td className="py-1.5 tabular-nums">{USD.format(r.aggregateOOP)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.capReachedAtIndex >= 0 && (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Under the aggregate structure, the {USD.format(result.deductible)} cap is fully met by claim{" "}
                {result.capReachedAtIndex + 1}. The insurer pays 100% of every claim after that point for the
                rest of the policy year.
              </p>
            )}
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
        Estimate only. This tool applies one entered deductible figure under two different structural rules;
        it does not know your actual policy&apos;s deductible type, aggregate cap, or reinstatement terms,
        and every claim amount here is hypothetical unless you enter your own. Confirm how your policy
        actually structures its deductible with your policy documents or a licensed insurance agent before
        relying on this for a real coverage decision.
      </div>
    </div>
  );
}

"use client";

/**
 * Deductible affordability calculator.
 *
 * This is a liquidity check, not a premium-savings tool (that's the
 * separate deductible-savings-calculator). It answers a narrower question:
 * if a claim happened today, could you actually cover the deductible out of
 * cash you already have, without touching retirement accounts, borrowing,
 * or going into debt?
 *
 * The user enters liquid emergency savings (cash they could access within a
 * few days, not home equity or a 401(k)) plus the deductible on each policy
 * they carry. The tool reports two ratios: what a single deductible would
 * consume, and what every entered deductible combined would consume if more
 * than one claim landed around the same time, which is the realistic
 * worst case a lot of households never actually check. It deliberately does
 * not assert a fixed "safe" percentage; it reports the math and frames the
 * judgment call as the user's own comfort with paying that amount today.
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

const PERCENT = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 2_000_000 }: NumberFieldProps) {
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

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "warn" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "warn" ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

type Bucket = "none" | "light" | "moderate" | "heavy" | "exceeds";

function bucketFor(pct: number): Bucket {
  if (!Number.isFinite(pct) || pct <= 0) return "none";
  if (pct <= 25) return "light";
  if (pct <= 50) return "moderate";
  if (pct <= 100) return "heavy";
  return "exceeds";
}

export function DeductibleAffordabilityCalculatorTool() {
  const [emergencyFund, setEmergencyFund] = useState(4_000);
  const [homeDeductible, setHomeDeductible] = useState(2_000);
  const [autoDeductible, setAutoDeductible] = useState(1_000);
  const [otherDeductible, setOtherDeductible] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const entries = [
      { label: "Homeowners/renters deductible", value: homeDeductible },
      { label: "Auto deductible", value: autoDeductible },
      { label: "Other policy deductible", value: otherDeductible },
    ].filter((e) => e.value > 0);

    const hasFund = emergencyFund > 0;
    const largest = entries.reduce((max, e) => Math.max(max, e.value), 0);
    const combined = entries.reduce((sum, e) => sum + e.value, 0);

    const pctSingle = hasFund ? (largest / emergencyFund) * 100 : 0;
    const pctCombined = hasFund ? (combined / emergencyFund) * 100 : 0;

    const remainingAfterSingle = emergencyFund - largest;
    const remainingAfterCombined = emergencyFund - combined;

    const shortfallSingle = Math.max(0, largest - emergencyFund);
    const shortfallCombined = Math.max(0, combined - emergencyFund);

    return {
      entries,
      hasFund,
      largest,
      combined,
      pctSingle,
      pctCombined,
      remainingAfterSingle,
      remainingAfterCombined,
      shortfallSingle,
      shortfallCombined,
      singleBucket: bucketFor(pctSingle),
      combinedBucket: bucketFor(pctCombined),
    };
  }, [emergencyFund, homeDeductible, autoDeductible, otherDeductible]);

  function combinedMessage(): string {
    if (!result.hasFund) {
      return "Enter your liquid emergency savings to see what share of it your deductibles would use.";
    }
    if (result.combined === 0) {
      return "Enter at least one deductible amount to run the check.";
    }
    switch (result.combinedBucket) {
      case "light":
        return `If every policy you entered needed its deductible paid at once, that's ${USD.format(result.combined)}, about ${PERCENT.format(result.pctCombined / 100)} of your emergency fund. That leaves a meaningful cushion, which is generally the more comfortable position to be in.`;
      case "moderate":
        return `If every policy you entered needed its deductible paid at once, that's ${USD.format(result.combined)}, about ${PERCENT.format(result.pctCombined / 100)} of your emergency fund. That's a real chunk of your available cash — worth deciding for yourself whether you'd still feel steady after paying it.`;
      case "heavy":
        return `If every policy you entered needed its deductible paid at once, that's ${USD.format(result.combined)}, ${PERCENT.format(result.pctCombined / 100)} of your emergency fund. That would use up most or all of what you have set aside, with ${USD.format(Math.max(0, result.remainingAfterCombined))} left over. Consider whether that's a level of exposure you're comfortable carrying.`;
      case "exceeds":
        return `If every policy you entered needed its deductible paid at once, that's ${USD.format(result.combined)}, which is more than your ${USD.format(emergencyFund)} in liquid savings by ${USD.format(result.shortfallCombined)}. You'd likely need to borrow, use a credit card, or delay a repair to cover the gap. That's the scenario worth planning around before it happens, not during a claim.`;
      default:
        return "";
    }
  }

  async function copyResult() {
    const lines = [
      "Deductible affordability check",
      `Liquid emergency savings entered: ${USD.format(emergencyFund)}`,
      result.entries.length
        ? `Deductibles entered: ${result.entries.map((e) => `${e.label} ${USD.format(e.value)}`).join(", ")}`
        : "No deductibles entered yet",
      result.hasFund && result.largest > 0
        ? `Largest single deductible: ${USD.format(result.largest)} (${PERCENT.format(result.pctSingle / 100)} of your fund)`
        : "Largest single deductible: enter a deductible and a fund amount",
      result.hasFund && result.combined > 0
        ? `All deductibles combined (worst case): ${USD.format(result.combined)} (${PERCENT.format(result.pctCombined / 100)} of your fund)`
        : "Combined deductibles: enter your deductibles to see the worst-case total",
      "Estimate only, not financial advice. insurancetools.org/tools/deductibles/deductible-affordability-calculator",
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
        <span className="label-mono text-slate-500">DEDUCTIBLE AFFORDABILITY CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Liquid emergency savings"
            hint="Cash you could actually access within a few days — not retirement accounts or home equity"
            value={emergencyFund}
            onChange={setEmergencyFund}
          />
          <NumberField
            label="Homeowners or renters deductible"
            hint="Leave at $0 if you don't carry this policy"
            value={homeDeductible}
            onChange={setHomeDeductible}
          />
          <NumberField
            label="Auto deductible"
            hint="Use your collision or comprehensive deductible"
            value={autoDeductible}
            onChange={setAutoDeductible}
          />
          <NumberField
            label="Other policy deductible"
            hint="Umbrella, health, pet, or any other deductible you carry"
            value={otherDeductible}
            onChange={setOtherDeductible}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SHARE OF YOUR FUND, ONE DEDUCTIBLE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.hasFund && result.largest > 0 ? PERCENT.format(result.pctSingle / 100) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.largest > 0
                ? `Based on your largest single deductible, ${USD.format(result.largest)}`
                : "Enter at least one deductible to see this figure"}
            </p>
          </div>

          <div
            className={`rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${
              result.combinedBucket === "exceeds"
                ? "border-red-100 bg-red-50 text-red-800"
                : result.combinedBucket === "heavy"
                  ? "border-amber-100 bg-amber-50 text-amber-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
            }`}
          >
            {combinedMessage()}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Combined deductibles" value={USD.format(result.combined)} />
            <Figure
              label="Worst-case share of fund"
              value={result.hasFund && result.combined > 0 ? PERCENT.format(result.pctCombined / 100) : "—"}
              tone={result.combinedBucket === "exceeds" || result.combinedBucket === "heavy" ? "warn" : "accent"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Cash left after one claim</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasFund && result.largest > 0
                  ? result.shortfallSingle > 0
                    ? `Your largest deductible alone is ${USD.format(result.shortfallSingle)} more than your emergency fund.`
                    : `${USD.format(result.remainingAfterSingle)} would remain in your fund after paying your largest single deductible.`
                  : "Enter your emergency fund and at least one deductible."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Cash left if every claim hits at once</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasFund && result.combined > 0
                  ? result.shortfallCombined > 0
                    ? `Your combined deductibles are ${USD.format(result.shortfallCombined)} more than your fund — the realistic gap you'd have to cover another way.`
                    : `${USD.format(result.remainingAfterCombined)} would remain in your fund even in the worst case of paying every deductible at once.`
                  : "This is the multi-claim scenario households most often forget to check."}
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
        Estimate only. This tool reports the ratio between your entered deductibles and your entered
        liquid savings; it does not know your actual account balances, your other monthly obligations, or
        whether a claim is likely. It intentionally does not tell you a &ldquo;safe&rdquo; percentage to
        target &mdash; that comfort level is a personal decision. Talk with a licensed insurance agent or
        financial professional before changing a deductible based on this result.
      </div>
    </div>
  );
}

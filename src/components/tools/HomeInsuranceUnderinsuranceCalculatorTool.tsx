"use client";

/**
 * Home insurance underinsurance calculator.
 *
 * Unlike a dwelling-coverage calculator that recommends a target limit from
 * scratch, this tool starts from a limit the user already has (their
 * declarations page) and checks it against a replacement cost figure they
 * supply, expressing the shortfall as both a dollar amount and a percentage.
 * It also flags the well-known coinsurance convention many policies use: if
 * coverage falls below roughly 80% of replacement cost, a partial claim
 * payout can be reduced beyond the raw dollar gap. That threshold varies by
 * insurer and policy, so it is presented as a common convention to check for,
 * not a universal rule.
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

const COINSURANCE_THRESHOLD_PCT = 80;

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
          step={1000}
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
  const toneClass =
    tone === "accent" ? "text-blue-600" : tone === "warn" ? "text-amber-600" : "text-slate-900";
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}

export function HomeInsuranceUnderinsuranceCalculatorTool() {
  const [currentLimit, setCurrentLimit] = useState(280_000);
  const [replacementCost, setReplacementCost] = useState(350_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasReplacementCost = replacementCost > 0;
    const gapDollars = Math.max(0, replacementCost - currentLimit);
    const gapPct = hasReplacementCost ? (gapDollars / replacementCost) * 100 : 0;
    const isUnderinsured = gapDollars > 0;
    const coveredPct = hasReplacementCost
      ? Math.min(100, (currentLimit / replacementCost) * 100)
      : 100;
    const coinsuranceRisk = hasReplacementCost && coveredPct < COINSURANCE_THRESHOLD_PCT;
    const amountToRaise = gapDollars;

    return {
      hasReplacementCost,
      gapDollars,
      gapPct,
      isUnderinsured,
      coveredPct,
      coinsuranceRisk,
      amountToRaise,
    };
  }, [currentLimit, replacementCost]);

  async function copyResult() {
    const lines = [
      "Home insurance underinsurance check",
      `Current dwelling limit: ${USD.format(currentLimit)}`,
      `Estimated replacement cost: ${USD.format(replacementCost)}`,
      result.isUnderinsured
        ? `Coverage gap: ${USD.format(result.gapDollars)} (${result.gapPct.toFixed(1)}% short of replacement cost)`
        : "Coverage gap: none, current limit meets or exceeds estimated replacement cost",
      `Coverage as % of replacement cost: ${result.coveredPct.toFixed(1)}%`,
      result.coinsuranceRisk
        ? `Coinsurance penalty risk: coverage is below the common ${COINSURANCE_THRESHOLD_PCT}% convention, a partial claim payout could be reduced beyond the raw dollar gap`
        : "Coinsurance penalty risk: coverage is at or above the common 80% convention",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/home/home-insurance-underinsurance-calculator",
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
        <span className="label-mono text-slate-500">HOME INSURANCE UNDERINSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Current dwelling coverage limit"
            hint="Coverage A limit from your declarations page"
            value={currentLimit}
            onChange={setCurrentLimit}
          />
          <NumberField
            label="Estimated replacement cost"
            hint="From an appraisal, contractor estimate, or our replacement cost calculator"
            value={replacementCost}
            onChange={setReplacementCost}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              {result.isUnderinsured ? "COVERAGE GAP" : "COVERAGE STATUS"}
            </p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.isUnderinsured ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {result.isUnderinsured ? USD.format(result.gapDollars) : "No gap found"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.isUnderinsured
                ? `Your current limit is ${result.gapPct.toFixed(1)}% below your estimated replacement cost.`
                : `Your current limit meets or exceeds your estimated replacement cost of ${USD.format(replacementCost)}.`}
            </p>
          </div>

          {result.coinsuranceRisk && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your coverage is at {result.coveredPct.toFixed(1)}% of replacement cost, below the common{" "}
              {COINSURANCE_THRESHOLD_PCT}% convention some policies use to apply a coinsurance penalty.
              If your policy includes a coinsurance clause, even a partial claim payout could be reduced
              beyond the {USD.format(result.gapDollars)} dollar gap above. This threshold and clause vary
              by insurer and policy, so confirm your own policy&apos;s wording with your agent.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Coverage gap %" value={`${result.gapPct.toFixed(1)}%`} tone={result.isUnderinsured ? "warn" : "default"} />
            <Figure label="Coverage as % of RCV" value={`${result.coveredPct.toFixed(1)}%`} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">What to do next</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.isUnderinsured
                  ? `Consider asking your insurer to raise your dwelling limit by about ${USD.format(result.amountToRaise)} to close this gap, or request a fresh replacement cost estimate if you think the figure you entered is outdated.`
                  : "No action needed based on the numbers entered. Recheck this periodically, since rebuilding costs can rise between policy renewals even when your limit stays flat."}
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
        Estimate only. This tool compares two numbers you enter; it does not verify your replacement cost
        or look up your policy&apos;s actual coinsurance clause, which varies by insurer. Confirm your
        dwelling limit and any coinsurance requirement with your declarations page or a licensed agent
        before assuming you are adequately covered.
      </div>
    </div>
  );
}

"use client";

/**
 * Insurance claim payout calculator.
 *
 * The flagship, cross-line claim payout tool: it works for any depreciable
 * property claim (home contents, auto, renters' belongings, business
 * equipment) because it does not hard-code a single item category. Instead
 * of guessing a "typical" depreciation schedule — which would mean
 * fabricating a universal table that doesn't actually match any insurer's
 * real claims manual — the user supplies their own replacement cost, age,
 * and useful life estimate, and the tool runs straight-line depreciation on
 * those numbers.
 *
 * The core teaching point, and the thing most claimants get wrong, is that
 * a policy pays out either Actual Cash Value (ACV) or Replacement Cost
 * Value (RCV) depending on the policy language, never both automatically.
 * This tool shows both payout paths side by side so a user can see exactly
 * what changes depending on which type of policy they hold.
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

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function DollarField({ label, hint, value, onChange, max = 5_000_000 }: DollarFieldProps) {
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

interface YearsFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function YearsField({ label, hint, value, onChange, min = 0, max = 100 }: YearsFieldProps) {
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
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : min;
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

export function InsuranceClaimPayoutCalculatorTool() {
  const [rcv, setRcv] = useState(3_000);
  const [ageYears, setAgeYears] = useState(5);
  const [usefulLifeYears, setUsefulLifeYears] = useState(12);
  const [deductible, setDeductible] = useState(500);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const safeUsefulLife = usefulLifeYears > 0 ? usefulLifeYears : 1;
    const depreciationRatio = Math.min(1, Math.max(0, ageYears) / safeUsefulLife);
    const depreciation = rcv * depreciationRatio;
    const acv = Math.max(0, rcv - depreciation);

    const acvPayout = Math.max(0, acv - deductible);
    const rcvPayout = Math.max(0, rcv - deductible);
    const recoverableDepreciation = Math.max(0, rcvPayout - acvPayout);

    const deductibleExceedsAcv = deductible > acv && acv > 0;
    const claimBelowDeductible = rcv > 0 && rcvPayout === 0;
    const fullyDepreciated = depreciationRatio >= 1 && rcv > 0;

    return {
      depreciationRatio,
      depreciation,
      acv,
      acvPayout,
      rcvPayout,
      recoverableDepreciation,
      deductibleExceedsAcv,
      claimBelowDeductible,
      fullyDepreciated,
    };
  }, [rcv, ageYears, usefulLifeYears, deductible]);

  async function copyResult() {
    const lines = [
      "Insurance claim payout estimate",
      `Replacement cost value (RCV): ${USD.format(rcv)}, ${ageYears} years old, ${usefulLifeYears}-year useful life, ${USD.format(deductible)} deductible`,
      `Depreciation: ${USD.format(result.depreciation)} (${PERCENT.format(result.depreciationRatio)})`,
      `Actual Cash Value (ACV) payout: ${USD.format(result.acvPayout)}`,
      `Replacement Cost Value (RCV) payout: ${USD.format(result.rcvPayout)}`,
      `Recoverable depreciation (paid later on an RCV policy, after replacement): ${USD.format(result.recoverableDepreciation)}`,
      "Estimate only, not a claims decision. insurancetools.org/tools/claims/insurance-claim-payout-calculator",
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
        <span className="label-mono text-slate-500">INSURANCE CLAIM PAYOUT CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Replacement cost of the item or property"
            hint="What it would cost to buy new or rebuild today, not what you paid"
            value={rcv}
            onChange={setRcv}
          />
          <YearsField
            label="Age of the item"
            hint="How long you've owned or used it"
            value={ageYears}
            onChange={setAgeYears}
          />
          <YearsField
            label="Useful life estimate"
            hint="Your own estimate of how long this item type typically lasts — check your policy, adjuster, or manufacturer guidance; this varies by item and isn't looked up for you"
            value={usefulLifeYears}
            onChange={setUsefulLifeYears}
            min={1}
          />
          <DollarField
            label="Policy deductible"
            hint="Subtracted from both payout types below"
            value={deductible}
            onChange={setDeductible}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">DEPRECIATION APPLIED</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.depreciation)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {PERCENT.format(result.depreciationRatio)} of replacement cost, based on {ageYears} of {usefulLifeYears}{" "}
              years of useful life
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <div className="rounded-lg border border-slate-200 px-3.5 py-3">
              <p className="label-mono text-slate-400">ACV PAYOUT</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
                {USD.format(result.acvPayout)}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-slate-500">
                If your policy pays Actual Cash Value
              </p>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3">
              <p className="label-mono text-blue-400">RCV PAYOUT</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-blue-700">
                {USD.format(result.rcvPayout)}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-blue-700/80">
                If your policy pays Replacement Cost Value
              </p>
            </div>
          </div>

          {result.deductibleExceedsAcv && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your deductible ({USD.format(deductible)}) is higher than the item&apos;s Actual Cash Value (
              {USD.format(result.acv)}). Under an ACV policy this claim would pay $0, since a deductible
              never turns into a payment owed to you. Many adjusters and policyholders skip filing when this
              happens, since the claim can also affect future premiums.
            </div>
          )}

          {result.fullyDepreciated && !result.deductibleExceedsAcv && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-600">
              This item has reached the end of its entered useful life, so its Actual Cash Value has
              depreciated to $0. The RCV payout column is the only one still paying out, and only on a
              policy that actually covers replacement cost.
            </div>
          )}

          <div className="border-t border-hairline pt-4">
            <Figure
              label="Recoverable depreciation"
              value={USD.format(result.recoverableDepreciation)}
              tone="accent"
            />
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              The gap between the two payouts above. On most RCV policies, this amount is held back and paid
              as a second check only after you complete the repair or replacement and submit proof of the
              cost, not automatically at the time of the first check.
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
        Estimate only. This tool uses straight-line depreciation (replacement cost × age ÷ useful life) as a
        simplified, transparent model; real claims may apply a different depreciation method, per-category
        schedules, or a state-specific formula that your insurer&apos;s claims manual defines. It does not know
        whether your policy is ACV or RCV, your state&apos;s claims-handling rules, or your specific policy
        language. Confirm your policy type and get an exact figure from your insurer or a licensed claims
        professional before treating any number here as final.
      </div>
    </div>
  );
}

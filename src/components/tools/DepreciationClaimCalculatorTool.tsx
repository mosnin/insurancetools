"use client";

/**
 * Insurance depreciation calculator.
 *
 * A general-purpose, single-item teaching tool: it does not price a claim
 * end to end (see the claim payout and recoverable depreciation calculators
 * for that), it exists to make the straight-line depreciation math an
 * adjuster applies to a single item fully transparent, one step at a time.
 *
 * Straight-line depreciation = replacement cost value (RCV) x min(1, age /
 * useful life). Actual cash value (ACV) = RCV - depreciation, floored at
 * $0. Useful life is never assumed or hard-coded for a given item type; the
 * user supplies it, because insurers, item categories, and even individual
 * adjusters can apply different useful-life figures to the same kind of
 * item.
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

const USD2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function DollarField({ label, hint, value, onChange, max = 2_000_000 }: DollarFieldProps) {
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
          step={10}
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
  max?: number;
  step?: number;
}

function YearsField({ label, hint, value, onChange, max = 100, step = 1 }: YearsFieldProps) {
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
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
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

export function DepreciationClaimCalculatorTool() {
  const [rcv, setRcv] = useState(1_200);
  const [itemAge, setItemAge] = useState(3);
  const [usefulLife, setUsefulLife] = useState(5);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const safeUsefulLife = usefulLife > 0 ? usefulLife : 0.01;
    const rawRatio = itemAge / safeUsefulLife;
    const ratio = Math.min(1, Math.max(0, rawRatio));
    const depreciationPct = ratio * 100;
    const depreciationAmount = rcv * ratio;
    const acv = Math.max(0, rcv - depreciationAmount);
    const remainingPct = rcv > 0 ? (acv / rcv) * 100 : 0;
    const pastUsefulLife = usefulLife > 0 && itemAge >= usefulLife;
    const usefulLifeMissing = usefulLife <= 0;

    return {
      ratio,
      depreciationPct,
      depreciationAmount,
      acv,
      remainingPct,
      pastUsefulLife,
      usefulLifeMissing,
    };
  }, [rcv, itemAge, usefulLife]);

  async function copyResult() {
    const lines = [
      "Insurance depreciation calculation",
      `Replacement cost value (RCV): ${USD.format(rcv)}`,
      `Item age: ${itemAge} years / Useful life: ${usefulLife} years`,
      `Depreciation applied: ${result.depreciationPct.toFixed(1)}% (${USD.format(result.depreciationAmount)})`,
      `Actual cash value (ACV): ${USD.format(result.acv)}`,
      "Formula: Depreciation = RCV x (age / useful life), capped at 100%. ACV = RCV - Depreciation, floored at $0.",
      "Estimate only, not a claim determination. insurancetools.org/tools/claims/depreciation-claim-calculator",
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
        <span className="label-mono text-slate-500">INSURANCE DEPRECIATION CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Replacement cost value (RCV)"
            hint="What it costs to buy the item new today"
            value={rcv}
            onChange={setRcv}
          />
          <YearsField
            label="Item's current age"
            hint="Years since it was purchased or installed"
            value={itemAge}
            onChange={setItemAge}
            step={0.5}
          />
          <YearsField
            label="Useful life for this item"
            hint="Check your claim paperwork or ask your adjuster — useful life varies by item type (electronics generally wear out faster than furniture, for example) and by insurer, so there is no single universal figure"
            value={usefulLife}
            onChange={setUsefulLife}
            step={0.5}
          />
          {result.usefulLifeMissing && (
            <p className="text-xs text-amber-700">
              Enter a useful life greater than 0 to run the calculation.
            </p>
          )}
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ACTUAL CASH VALUE (ACV)</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.acv)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.remainingPct.toFixed(0)}% of replacement cost value remaining
            </p>
          </div>

          {result.pastUsefulLife && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              This item is at or past the useful life you entered, so depreciation is capped at 100% and
              the actual cash value floors at $0. That does not necessarily mean the item has no
              settlement value at all — some insurers apply a small residual or salvage value even on
              fully depreciated items, so confirm the exact treatment with your adjuster.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Depreciation applied" value={`${result.depreciationPct.toFixed(1)}%`} />
            <Figure label="Depreciation amount" value={USD.format(result.depreciationAmount)} tone="accent" />
          </div>

          <div className="space-y-2.5 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">The math, step by step</p>
            <ol className="space-y-2 text-xs leading-relaxed text-slate-600">
              <li>
                <span className="font-medium text-slate-700">1. Depreciation ratio</span> — {itemAge} years
                &divide; {usefulLife} years = {result.ratio.toFixed(3)} ({result.depreciationPct.toFixed(1)}%)
              </li>
              <li>
                <span className="font-medium text-slate-700">2. Depreciation amount</span> —{" "}
                {USD.format(rcv)} &times; {result.depreciationPct.toFixed(1)}% ={" "}
                {USD2.format(result.depreciationAmount)}
              </li>
              <li>
                <span className="font-medium text-slate-700">3. Actual cash value</span> — {USD.format(rcv)}{" "}
                &minus; {USD2.format(result.depreciationAmount)} = {USD.format(result.acv)}
              </li>
            </ol>
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
        Estimate only. This tool models a standard straight-line depreciation formula using the
        replacement cost, age, and useful-life figures you enter; it is not a claim determination and does
        not know your insurer&apos;s specific depreciation schedule, your policy language, or your state&apos;s
        claims regulations. Some insurers depreciate certain item types (rooms, materials, or equipment
        with irregular wear patterns) on a non-straight-line schedule. Confirm the useful-life figure and
        depreciation method your insurer applied with your adjuster before treating any number here as
        final.
      </div>
    </div>
  );
}

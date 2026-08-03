"use client";

/**
 * Roof replacement claim calculator.
 *
 * Models a standard actual cash value (ACV) roof claim: the insurer pays
 * out the roof's replacement cost value (RCV) minus depreciation minus the
 * deductible. Depreciation is modeled as straight-line against an
 * insurer-supplied useful-life figure that the user enters themselves —
 * this tool does not assume a fixed lifespan for any roofing material,
 * since that figure varies by insurer, roof type, and claim documentation.
 *
 * When the policy carries recoverable depreciation (replacement-cost
 * coverage), the withheld depreciation is shown as a second, separate
 * line item the homeowner may be able to recover after the repair is
 * completed and documented — not part of the initial ACV check.
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
  max?: number;
}

function YearsField({ label, hint, value, onChange, max = 100 }: YearsFieldProps) {
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

export function RoofReplacementClaimCalculatorTool() {
  const [rcv, setRcv] = useState(14_000);
  const [roofAge, setRoofAge] = useState(12);
  const [usefulLife, setUsefulLife] = useState(20);
  const [deductible, setDeductible] = useState(1_500);
  const [hasRecoverable, setHasRecoverable] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const safeUsefulLife = usefulLife > 0 ? usefulLife : 1;
    const depreciationPct = Math.min(100, (roofAge / safeUsefulLife) * 100);
    const depreciatedAmount = rcv * (depreciationPct / 100);
    const acvBeforeDeductible = Math.max(0, rcv - depreciatedAmount);
    const acvPayout = Math.max(0, acvBeforeDeductible - deductible);
    const deductibleExceedsAcv = deductible > acvBeforeDeductible;
    const recoverableAmount = hasRecoverable ? depreciatedAmount : 0;
    const totalIfRecovered = hasRecoverable
      ? Math.max(0, rcv - deductible)
      : acvPayout;

    return {
      depreciationPct,
      depreciatedAmount,
      acvBeforeDeductible,
      acvPayout,
      deductibleExceedsAcv,
      recoverableAmount,
      totalIfRecovered,
    };
  }, [rcv, roofAge, usefulLife, deductible, hasRecoverable]);

  async function copyResult() {
    const lines = [
      "Roof replacement claim estimate",
      `Replacement cost value (RCV): ${USD.format(rcv)}`,
      `Depreciation: ${result.depreciationPct.toFixed(0)}% (${USD.format(result.depreciatedAmount)}), based on ${roofAge} of ${usefulLife} years of useful life`,
      `Deductible: ${USD.format(deductible)}`,
      `Initial actual cash value (ACV) payout: ${USD.format(result.acvPayout)}`,
      hasRecoverable
        ? `Recoverable depreciation: up to ${USD.format(result.recoverableAmount)} more after the repair is completed and documented, for a possible total of ${USD.format(result.totalIfRecovered)}`
        : "Recoverable depreciation: not applicable — this policy does not carry replacement-cost recoverable depreciation",
      "Estimate only, not a claim determination. insurancetools.org/tools/home/roof-replacement-claim-calculator",
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
        <span className="label-mono text-slate-500">ROOF REPLACEMENT CLAIM CALCULATOR</span>
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
            hint="Contractor estimate or insurer figure for a full new roof"
            value={rcv}
            onChange={setRcv}
          />
          <YearsField
            label="Current age of the roof"
            hint="Years since it was installed"
            value={roofAge}
            onChange={setRoofAge}
          />
          <YearsField
            label="Useful life your insurer is applying"
            hint="Check your claim documentation, or ask your adjuster directly — this varies by roofing material and insurer"
            value={usefulLife}
            onChange={setUsefulLife}
          />
          <DollarField
            label="Your deductible"
            hint="The amount you pay before coverage applies"
            value={deductible}
            onChange={setDeductible}
          />
          <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-3">
            <input
              type="checkbox"
              checked={hasRecoverable}
              onChange={(e) => setHasRecoverable(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs leading-relaxed text-slate-600">
              My policy has recoverable depreciation (replacement-cost coverage, not actual cash value
              coverage)
            </span>
          </label>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">INITIAL ACV PAYOUT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.acvPayout)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.acvBeforeDeductible)} actual cash value minus your {USD.format(deductible)}{" "}
              deductible
            </p>
          </div>

          {result.deductibleExceedsAcv && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your deductible ({USD.format(deductible)}) is larger than the actual cash value before the
              deductible ({USD.format(result.acvBeforeDeductible)}), so the initial payout is $0. This can
              happen on older roofs with heavy depreciation.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Depreciation applied" value={`${result.depreciationPct.toFixed(0)}%`} />
            <Figure label="Depreciated amount" value={USD.format(result.depreciatedAmount)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Recoverable depreciation</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {hasRecoverable
                  ? `If you complete the roof repair and submit the contractor's final invoice, you may be able to recover up to ${USD.format(result.recoverableAmount)} of the withheld depreciation, bringing your potential total payout to ${USD.format(result.totalIfRecovered)}. Insurers typically require the work to be finished and documented before releasing this second payment.`
                  : "This policy is modeled as actual cash value coverage rather than replacement-cost coverage, so the depreciated amount above is not recoverable later. Check your policy declarations page to confirm which type of coverage you carry."}
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
        Estimate only. This tool models a standard straight-line actual cash value calculation using the
        replacement cost, age, and useful-life figures you enter; it is not a claim determination and does
        not know your specific policy language, your insurer&apos;s depreciation schedule, or your state&apos;s
        claims regulations. Confirm the useful-life figure your insurer applied and review the full claim
        estimate with your adjuster or a licensed public adjuster before treating any number here as final.
      </div>
    </div>
  );
}

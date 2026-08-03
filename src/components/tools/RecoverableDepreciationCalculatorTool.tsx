"use client";

/**
 * Recoverable depreciation calculator.
 *
 * Models the two-check payment mechanic used on most replacement cost
 * value (RCV) property claims: the insurer first pays out actual cash
 * value (ACV) minus the deductible, withholds the difference between RCV
 * and ACV as "recoverable depreciation," then releases that holdback in a
 * second check once the policyholder completes the repair or replacement
 * and submits proof (paid invoices, receipts, or a contractor's final
 * bill).
 *
 * Unlike a single-asset claim tool, this calculator is deliberately
 * asset-agnostic: it takes RCV, ACV, and the deductible directly rather
 * than deriving ACV from an age/useful-life schedule, so it works for a
 * roof, a vehicle, an appliance, or any other item on an RCV policy. The
 * deductible is modeled as a single amount subtracted once from the total
 * claim (RCV minus deductible), consistent with how insurers commonly
 * structure the two checks: if the ACV payment is smaller than the
 * deductible, the remainder of the deductible reduces the second check
 * instead of creating a negative first check.
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

export function RecoverableDepreciationCalculatorTool() {
  const [rcv, setRcv] = useState(24_000);
  const [acv, setAcv] = useState(16_800);
  const [deductible, setDeductible] = useState(1_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const acvExceedsRcv = acv > rcv;
    // ACV cannot exceed RCV by definition (ACV = RCV minus depreciation).
    // If a user enters it that way, treat depreciation as $0 for the math
    // rather than silently producing a negative recoverable amount.
    const safeAcv = acvExceedsRcv ? rcv : acv;

    const totalEntitled = Math.max(0, rcv - deductible);
    const firstCheck = Math.min(totalEntitled, Math.max(0, safeAcv - deductible));
    const secondCheck = Math.max(0, totalEntitled - firstCheck);
    const fullDepreciationAmount = Math.max(0, rcv - safeAcv);
    const deductibleAbsorbedBySecondCheck = Math.max(0, fullDepreciationAmount - secondCheck);
    const deductibleExceedsTotal = deductible >= rcv && rcv > 0;
    const pctHeldBack = totalEntitled > 0 ? (secondCheck / totalEntitled) * 100 : 0;

    return {
      acvExceedsRcv,
      totalEntitled,
      firstCheck,
      secondCheck,
      fullDepreciationAmount,
      deductibleAbsorbedBySecondCheck,
      deductibleExceedsTotal,
      pctHeldBack,
    };
  }, [rcv, acv, deductible]);

  async function copyResult() {
    const lines = [
      "Recoverable depreciation estimate",
      `Replacement cost value (RCV): ${USD.format(rcv)}`,
      `Actual cash value (ACV): ${USD.format(result.acvExceedsRcv ? rcv : acv)}`,
      `Deductible: ${USD.format(deductible)}`,
      `First check (paid now): ${USD.format(result.firstCheck)}`,
      `Second check (recoverable depreciation, paid after repairs are completed and documented): ${USD.format(result.secondCheck)}`,
      `Total if fully recovered: ${USD.format(result.totalEntitled)}`,
      "Estimate only, not a claim determination. insurancetools.org/tools/claims/recoverable-depreciation-calculator",
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
        <span className="label-mono text-slate-500">RECOVERABLE DEPRECIATION CALCULATOR</span>
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
            hint="What your insurer says it costs to repair or replace with new materials"
            value={rcv}
            onChange={setRcv}
          />
          <DollarField
            label="Actual cash value (ACV)"
            hint="RCV minus depreciation — check your claim estimate or adjuster's worksheet"
            value={acv}
            onChange={setAcv}
          />
          <DollarField
            label="Your deductible"
            hint="Subtracted once from your total entitled payout"
            value={deductible}
            onChange={setDeductible}
          />

          {result.acvExceedsRcv && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Actual cash value can&apos;t be higher than replacement cost value — ACV is RCV minus
              depreciation. This calculator is treating your ACV as equal to your RCV, meaning $0 of
              depreciation was withheld. Double-check the figure against your claim paperwork.
            </div>
          )}
          {result.deductibleExceedsTotal && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your deductible ({USD.format(deductible)}) meets or exceeds your replacement cost value, so
              this claim would produce $0 in net payout either way.
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">FIRST CHECK — PAID NOW</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.firstCheck)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Actual cash value minus your deductible, issued near the time of loss
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            <span className="font-semibold">Second check — {USD.format(result.secondCheck)}: </span>
            paid only after you complete the repair or replacement and send your insurer proof, such as a
            paid invoice or contractor&apos;s final bill. This is your recoverable depreciation.
            {result.deductibleAbsorbedBySecondCheck > 0 && (
              <>
                {" "}
                {USD.format(result.deductibleAbsorbedBySecondCheck)} of your deductible reduces this second
                check because your first check wasn&apos;t large enough to absorb the full deductible.
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total if fully recovered" value={USD.format(result.totalEntitled)} tone="accent" />
            <Figure label="Held back until repairs" value={`${result.pctHeldBack.toFixed(0)}%`} />
          </div>

          <div className="space-y-1.5 border-t border-hairline pt-4 text-xs leading-relaxed text-slate-500">
            <p>
              <strong className="text-slate-700">Full withheld depreciation:</strong>{" "}
              {USD.format(result.fullDepreciationAmount)} (RCV minus ACV, before the deductible is applied)
            </p>
            <p>
              Your policy sets the specific deadline to complete repairs and submit proof — it commonly
              ranges from several months to a couple of years depending on the insurer and policy language,
              so confirm your own deadline in your policy documents rather than assuming a standard window.
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
        Estimate only. This tool models the standard two-check replacement cost value claims process; it
        assumes your policy actually carries a recoverable depreciation provision (not an actual-cash-value
        only policy), and it is not a claim determination. It does not know your insurer&apos;s specific
        depreciation schedule, your policy&apos;s exact deadline for submitting repair proof, or your state&apos;s
        claims regulations. Confirm your policy&apos;s recoverable depreciation deadline and documentation
        requirements with your adjuster or agent before relying on any figure here.
      </div>
    </div>
  );
}

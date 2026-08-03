"use client";

/**
 * Coinsurance calculator for a single medical bill.
 *
 * Deliberately narrow in scope: this tool answers "what will I owe on this
 * one bill" given a bill amount, whether the deductible is already met, a
 * user-supplied coinsurance percentage, and (optionally) how much room is
 * left under the annual out-of-pocket maximum. It does not model a full
 * plan year, multiple bills, or family aggregation — that broader waterfall
 * lives in the medical bill responsibility calculator. Nothing typed here
 * leaves the browser, and no coinsurance percentage is assumed; the user
 * always supplies their own plan's number from their insurance card or
 * summary of benefits.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const USD0 = new Intl.NumberFormat("en-US", {
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
  disabled?: boolean;
}

function NumberField({ label, hint, value, onChange, max = 1_000_000, disabled = false }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          disabled={disabled}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        />
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function PercentField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 100) : 0;
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

export function CoinsuranceCalculatorTool() {
  const [billAmount, setBillAmount] = useState(2500);
  const [deductibleMet, setDeductibleMet] = useState(false);
  const [remainingDeductible, setRemainingDeductible] = useState(500);
  const [coinsurancePercent, setCoinsurancePercent] = useState(20);
  const [oopMaxRemaining, setOopMaxRemaining] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const bill = Math.max(0, billAmount);
    const hasOopMax = oopMaxRemaining > 0;

    // Step 1: the deductible portion, if any, comes off the top of the bill.
    const deductiblePortion = deductibleMet ? 0 : Math.min(remainingDeductible, bill);
    const afterDeductible = bill - deductiblePortion;

    // Step 2: coinsurance applies to whatever the bill leaves after the
    // deductible is satisfied.
    const coinsurancePortion = afterDeductible * (coinsurancePercent / 100);
    const insurerShareBeforeCap = afterDeductible - coinsurancePortion;

    const rawResponsibility = deductiblePortion + coinsurancePortion;

    // Step 3: the out-of-pocket maximum, if the user has room remaining,
    // caps total patient responsibility for the year — including this bill.
    const patientResponsibility = hasOopMax ? Math.min(rawResponsibility, oopMaxRemaining) : rawResponsibility;
    const oopSavings = Math.max(0, rawResponsibility - patientResponsibility);
    const hitOopCap = hasOopMax && oopSavings > 0.005;

    const insurerPays = Math.max(0, bill - patientResponsibility);

    const deductibleShare = bill > 0 ? (deductiblePortion / bill) * 100 : 0;
    const coinsuranceShare = bill > 0 ? ((patientResponsibility - deductiblePortion) / bill) * 100 : 0;
    const insurerShare = bill > 0 ? (insurerPays / bill) * 100 : 0;

    return {
      bill,
      hasOopMax,
      deductiblePortion,
      afterDeductible,
      coinsurancePortion,
      insurerShareBeforeCap,
      rawResponsibility,
      patientResponsibility,
      oopSavings,
      hitOopCap,
      insurerPays,
      deductibleShare: Math.max(0, Math.min(100, deductibleShare)),
      coinsuranceShare: Math.max(0, Math.min(100, coinsuranceShare)),
      insurerShare: Math.max(0, Math.min(100, insurerShare)),
    };
  }, [billAmount, deductibleMet, remainingDeductible, coinsurancePercent, oopMaxRemaining]);

  async function copyResult() {
    const lines = [
      "Coinsurance calculator result",
      `Bill amount: ${USD0.format(result.bill)}`,
      result.deductiblePortion > 0
        ? `Applied to deductible: ${USD.format(result.deductiblePortion)}`
        : "Deductible: already met, none of this bill applies to it",
      `Coinsurance (${coinsurancePercent}% of ${USD0.format(result.afterDeductible)} remaining): ${USD.format(result.coinsurancePortion)}`,
      result.hitOopCap
        ? `Capped by remaining out-of-pocket max: saved ${USD.format(result.oopSavings)}`
        : result.hasOopMax
          ? "Within your remaining out-of-pocket max, no cap applied"
          : "No out-of-pocket max entered",
      `You owe: ${USD.format(result.patientResponsibility)}`,
      `Insurer pays: ${USD.format(result.insurerPays)}`,
      "Estimate only, not a claim determination. insurancetools.org/tools/health/coinsurance-calculator",
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
        <span className="label-mono text-slate-500">COINSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Total bill amount"
            hint="The full charge for this visit, procedure, or service"
            value={billAmount}
            onChange={setBillAmount}
          />

          <div>
            <span className="block text-[13px] font-medium text-slate-600">
              Have you already met your deductible for the year?
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeductibleMet(true)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  deductibleMet
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
                aria-pressed={deductibleMet}
              >
                Yes, it&apos;s met
              </button>
              <button
                type="button"
                onClick={() => setDeductibleMet(false)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  !deductibleMet
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
                aria-pressed={!deductibleMet}
              >
                No, not yet
              </button>
            </div>
          </div>

          {!deductibleMet && (
            <NumberField
              label="Remaining deductible"
              hint="How much of your deductible is still unpaid this year"
              value={remainingDeductible}
              onChange={setRemainingDeductible}
            />
          )}

          <PercentField
            label="Your plan's coinsurance percentage"
            hint="The share you pay after the deductible — check your insurance card or summary of benefits, plans vary"
            value={coinsurancePercent}
            onChange={setCoinsurancePercent}
          />

          <NumberField
            label="Remaining out-of-pocket maximum (optional)"
            hint="Leave at $0 if you don't know it or want to skip this cap"
            value={oopMaxRemaining}
            onChange={setOopMaxRemaining}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">YOU OWE (ESTIMATE)</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.patientResponsibility)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Insurer pays {USD.format(result.insurerPays)} of the {USD0.format(result.bill)} bill
            </p>
          </div>

          {/* Waterfall bar */}
          <div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              {result.deductibleShare > 0 && (
                <span
                  className="h-full bg-amber-400"
                  style={{ width: `${result.deductibleShare}%` }}
                  aria-hidden="true"
                />
              )}
              {result.coinsuranceShare > 0 && (
                <span
                  className="h-full bg-blue-600"
                  style={{ width: `${result.coinsuranceShare}%` }}
                  aria-hidden="true"
                />
              )}
              {result.insurerShare > 0 && (
                <span
                  className="h-full bg-emerald-400"
                  style={{ width: `${result.insurerShare}%` }}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="block h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" /> Deductible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="block h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" /> Coinsurance
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="block h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" /> Insurer pays
              </span>
            </div>
          </div>

          {result.hitOopCap && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Without your remaining out-of-pocket max, this bill would have cost you{" "}
              {USD.format(result.rawResponsibility)}. Because you&apos;re only {USD.format(oopMaxRemaining)} away from
              your annual limit, this calculator capped your responsibility there, saving you{" "}
              {USD.format(result.oopSavings)} on this bill.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Applied to deductible" value={USD.format(result.deductiblePortion)} />
            <Figure label="Coinsurance owed" value={USD.format(result.patientResponsibility - result.deductiblePortion)} tone="accent" />
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">How this bill breaks down</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {result.deductiblePortion > 0
                ? `${USD.format(result.deductiblePortion)} of this bill goes toward your remaining deductible first. `
                : "Your deductible is already met, so none of this bill applies there. "}
              The remaining {USD0.format(result.afterDeductible)} is split {coinsurancePercent}% to you and{" "}
              {100 - coinsurancePercent}% to your insurer under coinsurance
              {result.hitOopCap ? ", though your out-of-pocket max caps what you actually pay." : "."}
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
        Estimate only. This tool assumes the deductible and coinsurance percentage you enter are correct for
        this specific service and that the billed amount matches your plan&apos;s allowed amount; out-of-network
        care, non-covered services, and balance billing can all change what you actually owe. It does not
        assume any typical coinsurance rate for you — that number always comes from your own plan documents.
        Confirm the final amount on your Explanation of Benefits or with your insurer before paying a bill.
      </div>
    </div>
  );
}

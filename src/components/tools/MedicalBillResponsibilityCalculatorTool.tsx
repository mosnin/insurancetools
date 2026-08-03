"use client";

/**
 * Medical bill responsibility calculator.
 *
 * The distinguishing feature versus the site's coinsurance-calculator is
 * that this tool is mid-year aware: it asks how much of the annual
 * deductible and out-of-pocket max the user has already met before this
 * bill, then walks a single new bill through the full waterfall step by
 * step (remaining deductible -> coinsurance -> out-of-pocket max cap) and
 * shows every intermediate number, not just the final total.
 *
 * All math runs client-side against numbers the user types in from their
 * own plan documents or EOB. Nothing here is a typical, average, or
 * fabricated plan figure — every input is the user's own.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  suffix?: string;
}

function NumberField({ label, hint, value, onChange, max = 1_000_000, suffix }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        {!suffix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            $
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={suffix ? 1 : 1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            suffix ? "pl-3 pr-8" : "pl-7 pr-3"
          } text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function WaterfallLine({
  step,
  label,
  value,
  tone = "default",
}: {
  step: string;
  label: string;
  value: string;
  tone?: "default" | "accent" | "muted";
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
          {step}
        </span>
        <span className={`text-xs leading-relaxed ${tone === "muted" ? "text-slate-400" : "text-slate-600"}`}>
          {label}
        </span>
      </div>
      <span
        className={`shrink-0 text-sm font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "muted" ? "text-slate-400" : "text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function MedicalBillResponsibilityCalculatorTool() {
  const [deductible, setDeductible] = useState(2000);
  const [deductibleMet, setDeductibleMet] = useState(500);
  const [coinsurance, setCoinsurance] = useState(20);
  const [oopMax, setOopMax] = useState(6000);
  const [oopMet, setOopMet] = useState(1200);
  const [billAmount, setBillAmount] = useState(3500);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    // Step 1: remaining deductible before this bill.
    const remainingDeductible = Math.max(0, deductible - deductibleMet);

    // Step 2: portion of the new bill that goes toward the remaining deductible.
    const deductiblePortion = Math.min(billAmount, remainingDeductible);

    // Step 3: what's left of the bill after the deductible portion, subject to coinsurance.
    const remainderAfterDeductible = Math.max(0, billAmount - deductiblePortion);
    const coinsuranceRate = Math.min(Math.max(coinsurance, 0), 100) / 100;
    const coinsurancePortion = remainderAfterDeductible * coinsuranceRate;
    const insurerPortionBeforeCap = remainderAfterDeductible - coinsurancePortion;

    // Step 4: uncapped total new patient responsibility for this bill.
    const uncappedNewResponsibility = deductiblePortion + coinsurancePortion;

    // Step 5: out-of-pocket max cap, aware of what's already been met this year.
    const remainingOopMax = Math.max(0, oopMax - oopMet);
    const cappedNewResponsibility = Math.min(uncappedNewResponsibility, remainingOopMax);
    const oopMaxReached = uncappedNewResponsibility >= remainingOopMax && remainingOopMax >= 0;
    const amountAboveOopMax = Math.max(0, uncappedNewResponsibility - remainingOopMax);

    const totalMetAfterBill = Math.min(oopMax, oopMet + uncappedNewResponsibility);
    const insurerPays = billAmount - cappedNewResponsibility;

    return {
      remainingDeductible,
      deductiblePortion,
      remainderAfterDeductible,
      coinsuranceRate,
      coinsurancePortion,
      insurerPortionBeforeCap,
      uncappedNewResponsibility,
      remainingOopMax,
      cappedNewResponsibility,
      oopMaxReached,
      amountAboveOopMax,
      totalMetAfterBill,
      insurerPays,
    };
  }, [deductible, deductibleMet, coinsurance, oopMax, oopMet, billAmount]);

  async function copyResult() {
    const lines = [
      "Medical bill responsibility breakdown",
      `Bill amount: ${USD.format(billAmount)}`,
      `Step 1 — Remaining deductible before this bill: ${USD.format(result.remainingDeductible)}`,
      `Step 2 — Applied to deductible: ${USD.format(result.deductiblePortion)}`,
      `Step 3 — Remainder subject to ${coinsurance}% coinsurance: ${USD.format(result.remainderAfterDeductible)}`,
      `Step 4 — Your coinsurance share: ${USD.format(result.coinsurancePortion)}`,
      `Step 5 — Your total responsibility for this bill (before OOP max cap): ${USD.format(result.uncappedNewResponsibility)}`,
      result.amountAboveOopMax > 0
        ? `Out-of-pocket max cap: this bill pushes you past your remaining out-of-pocket max, capping what you owe at ${USD.format(result.cappedNewResponsibility)} — the insurer should cover the remaining ${USD.format(result.amountAboveOopMax)}`
        : `Your responsibility for this bill: ${USD.format(result.cappedNewResponsibility)} (within your remaining out-of-pocket max of ${USD.format(result.remainingOopMax)})`,
      `Estimated insurer payment on this bill: ${USD.format(result.insurerPays)}`,
      "Based on the numbers you entered from your own plan and EOB. Not a bill, quote, or guarantee. insurancetools.org/tools/health/medical-bill-responsibility-calculator",
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
        <span className="label-mono text-slate-500">MEDICAL BILL RESPONSIBILITY CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Your new medical bill amount"
            hint="The allowed amount owed on this bill, from your EOB"
            value={billAmount}
            onChange={setBillAmount}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Annual deductible"
              hint="From your plan summary"
              value={deductible}
              onChange={setDeductible}
            />
            <NumberField
              label="Deductible met so far"
              hint="Already paid this plan year"
              value={deductibleMet}
              onChange={setDeductibleMet}
            />
          </div>
          <NumberField
            label="Coinsurance rate"
            hint="Your share after the deductible is met"
            value={coinsurance}
            onChange={(v) => setCoinsurance(Math.min(v, 100))}
            max={100}
            suffix="%"
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Annual out-of-pocket max"
              hint="From your plan summary"
              value={oopMax}
              onChange={setOopMax}
            />
            <NumberField
              label="Out-of-pocket met so far"
              hint="Already paid this plan year"
              value={oopMet}
              onChange={setOopMet}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-1 bg-white p-5 sm:p-6">
          <div className="mb-2">
            <p className="label-mono text-slate-400">YOUR RESPONSIBILITY FOR THIS BILL</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.cappedNewResponsibility)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Estimated insurer payment: {USD.format(result.insurerPays)}
            </p>
          </div>

          {result.amountAboveOopMax > 0 && (
            <div className="mb-2 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-800">
              This bill is large enough to carry you past your remaining out-of-pocket max of{" "}
              {USD.format(result.remainingOopMax)}. Based on what you entered, your plan should cover the
              remaining {USD.format(result.amountAboveOopMax)} of this bill, and further covered care this
              plan year should be paid in full.
            </div>
          )}

          <div className="divide-y divide-hairline border-t border-hairline">
            <WaterfallLine
              step="1"
              label="Remaining deductible before this bill"
              value={USD.format(result.remainingDeductible)}
              tone="muted"
            />
            <WaterfallLine
              step="2"
              label="Applied to your deductible"
              value={USD.format(result.deductiblePortion)}
            />
            <WaterfallLine
              step="3"
              label={`Remainder subject to ${coinsurance}% coinsurance`}
              value={USD.format(result.remainderAfterDeductible)}
              tone="muted"
            />
            <WaterfallLine
              step="4"
              label={`Your coinsurance share (${coinsurance}%)`}
              value={USD.format(result.coinsurancePortion)}
            />
            <WaterfallLine
              step="5"
              label="Total new responsibility before the OOP max cap"
              value={USD.format(result.uncappedNewResponsibility)}
              tone="muted"
            />
            <WaterfallLine
              step="6"
              label={
                result.amountAboveOopMax > 0
                  ? "Capped at your remaining out-of-pocket max"
                  : "Within your remaining out-of-pocket max"
              }
              value={USD.format(result.cappedNewResponsibility)}
              tone="accent"
            />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <div>
              <p className="label-mono text-slate-400">OOP MAX MET AFTER THIS BILL</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                {USD.format(result.totalMetAfterBill)}{" "}
                <span className="text-xs font-normal text-slate-400">of {USD.format(oopMax)}</span>
              </p>
            </div>
            <div>
              <p className="label-mono text-slate-400">REMAINING OOP MAX BEFORE THIS BILL</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                {USD.format(result.remainingOopMax)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyResult}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy result"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only, based entirely on the numbers you enter from your own plan documents and
        explanation of benefits (EOB). This tool assumes an in-network bill at the allowed amount your
        insurer already negotiated; it does not model out-of-network billing, balance billing, denied
        claims, or bills still pending insurer review. Confirm your actual responsibility on your EOB or
        by calling your insurer before paying a bill.
      </div>
    </div>
  );
}

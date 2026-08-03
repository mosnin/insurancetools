"use client";

/**
 * Deductible savings calculator.
 *
 * A deliberately narrow tool: enter the premium you pay today at your
 * current deductible and the premium an insurer has quoted you at a higher
 * deductible, and see three numbers derived only from those two quotes —
 * the annual dollar and percent savings, the increased out-of-pocket risk
 * (the deductible difference itself), and how many years of that savings it
 * takes to recoup the larger deductible if a claim happened the day after
 * you switched.
 *
 * This intentionally does not model claim frequency, a multi-year outlook,
 * or a table of deductible tiers — that is what the deductible comparison
 * calculator is for. This tool answers one question fast: does raising my
 * deductible from what I have to what I was quoted actually save money, and
 * by how much. No premium-savings percentage is assumed or hard-coded;
 * every figure here comes directly from the two numbers entered.
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

const USD_CENTS = new Intl.NumberFormat("en-US", {
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
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 20_000, step = 25 }: NumberFieldProps) {
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
          step={step}
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

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "muted" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "muted" ? "text-slate-400" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatYears(years: number): string {
  if (years < 1) {
    const months = Math.round(years * 12);
    if (months <= 0) return "under 1 month";
    return months === 1 ? "about 1 month" : `about ${months} months`;
  }
  return `${years.toFixed(1)} years`;
}

export function DeductibleSavingsCalculatorTool() {
  const [currentPremium, setCurrentPremium] = useState(1450);
  const [currentDeductible, setCurrentDeductible] = useState(500);
  const [newPremium, setNewPremium] = useState(1300);
  const [newDeductible, setNewDeductible] = useState(1000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const deductibleIncrease = newDeductible - currentDeductible;
    const annualSavings = currentPremium - newPremium;
    const savingsPercent = currentPremium > 0 ? (annualSavings / currentPremium) * 100 : 0;

    const hasValidIncrease = deductibleIncrease > 0;
    const hasSavings = annualSavings > 0;
    const yearsToRecoup = hasValidIncrease && hasSavings ? deductibleIncrease / annualSavings : null;

    // Recoup inside the first year the increased risk is already offset by
    // that year's premium savings, so the "extra risk you're carrying" is
    // effectively already paid for going forward.
    const alreadyRecouped = yearsToRecoup !== null && yearsToRecoup <= 1;

    return {
      deductibleIncrease,
      annualSavings,
      savingsPercent,
      hasValidIncrease,
      hasSavings,
      yearsToRecoup,
      alreadyRecouped,
    };
  }, [currentPremium, currentDeductible, newPremium, newDeductible]);

  async function copyResult() {
    const lines = [
      "Deductible savings calculation",
      `Current: ${USD.format(currentPremium)}/year at a ${USD.format(currentDeductible)} deductible`,
      `New quote: ${USD.format(newPremium)}/year at a ${USD.format(newDeductible)} deductible`,
      result.hasSavings
        ? `Annual premium savings: ${USD_CENTS.format(result.annualSavings)} (${result.savingsPercent.toFixed(1)}%)`
        : `Annual premium change: ${USD_CENTS.format(result.annualSavings)} (this is not a savings)`,
      result.hasValidIncrease
        ? `Increased out-of-pocket risk per claim: ${USD.format(result.deductibleIncrease)}`
        : "Deductible did not increase between the two quotes entered",
      result.yearsToRecoup !== null
        ? `Years of savings to recoup the deductible increase: ${formatYears(result.yearsToRecoup)}`
        : "Recoup time: not applicable with these numbers",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/deductibles/deductible-savings-calculator",
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
        <span className="label-mono text-slate-500">DEDUCTIBLE SAVINGS CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Current annual premium"
            hint="What you pay now, at your current deductible"
            value={currentPremium}
            onChange={setCurrentPremium}
          />
          <NumberField
            label="Current deductible"
            hint="The deductible your current premium is priced at"
            value={currentDeductible}
            onChange={setCurrentDeductible}
            step={50}
          />
          <NumberField
            label="New quoted annual premium"
            hint="What your insurer quoted at the higher deductible"
            value={newPremium}
            onChange={setNewPremium}
          />
          <NumberField
            label="New (higher) deductible"
            hint="The deductible the new quote is priced at"
            value={newDeductible}
            onChange={setNewDeductible}
            step={50}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              {result.hasSavings ? "ANNUAL PREMIUM SAVINGS" : "ANNUAL PREMIUM CHANGE"}
            </p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.hasSavings ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {USD_CENTS.format(Math.abs(result.annualSavings))}
              {!result.hasSavings && result.annualSavings < 0 ? " more" : ""}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasSavings
                ? `${result.savingsPercent.toFixed(1)}% lower than your current premium`
                : result.annualSavings < 0
                  ? "The new quote costs more than your current premium, not less"
                  : "No change between the two premiums entered"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Increased out-of-pocket risk"
              value={result.hasValidIncrease ? USD.format(result.deductibleIncrease) : "$0"}
              tone={result.hasValidIncrease ? "default" : "muted"}
            />
            <Figure
              label="Recoup time"
              value={result.yearsToRecoup !== null ? formatYears(result.yearsToRecoup) : "N/A"}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            {!result.hasValidIncrease && (
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
                Your new deductible ({USD.format(newDeductible)}) isn&apos;t higher than your current
                deductible ({USD.format(currentDeductible)}). This tool is built for the raise-your-deductible
                scenario — double-check your two quotes, since a lower or equal deductible priced lower
                would be unusual.
              </div>
            )}

            {result.hasValidIncrease && !result.hasSavings && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
                Based on the two numbers entered, raising your deductible from {USD.format(currentDeductible)}{" "}
                to {USD.format(newDeductible)} doesn&apos;t lower your premium. That can happen — ask your
                insurer for an updated quote, or confirm the deductible level on both quotes is correct.
              </div>
            )}

            {result.hasValidIncrease && result.hasSavings && (
              <div>
                <p className="text-xs font-semibold text-slate-700">What this means</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Raising your deductible from {USD.format(currentDeductible)} to {USD.format(newDeductible)}{" "}
                  saves {USD_CENTS.format(result.annualSavings)} a year. That extra {USD.format(result.deductibleIncrease)}{" "}
                  of risk is offset by premium savings alone in {formatYears(result.yearsToRecoup ?? 0)}
                  {result.alreadyRecouped
                    ? ", meaning the first year of savings already covers the increase."
                    : ". If you expect to file a claim sooner than that, the extra out-of-pocket cost would land before the savings caught up."}
                </p>
              </div>
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
        Estimate only. This tool compares only the two quotes you enter — it does not know your claim
        history, your insurer&apos;s underwriting, or any typical savings percentage for raising a
        deductible, because no such figure is reliable across insurers. Confirm both premium numbers
        directly with your insurer before changing a policy, and make sure you could actually cover the
        higher deductible in cash before choosing it for the lower premium alone.
      </div>
    </div>
  );
}

"use client";

/**
 * Lease vs. buy insurance cost calculator.
 *
 * Leasing companies and most auto lenders typically require the driver to
 * carry full coverage (collision + comprehensive) for as long as the lease
 * or loan runs, and often require gap insurance on top of it, since the
 * leasing company or lender still owns (or has a lien on) the vehicle. An
 * owner with a paid-off vehicle is free to drop down to liability-only.
 * This tool does not decide whether leasing or buying is the better
 * financial move overall — it isolates and compares just the insurance
 * cost difference between the two scenarios over a chosen term, so a driver
 * can see what that specific requirement is worth in dollars.
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

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  prefix?: string;
  suffix?: string;
  step?: number;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  max = 1_000_000,
  prefix = "$",
  suffix,
  step = 50,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
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
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-12" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
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

export function LeaseVsBuyInsuranceRequirementCalculatorTool() {
  const [fullCoveragePremium, setFullCoveragePremium] = useState(1_400);
  const [gapPremium, setGapPremium] = useState(150);
  const [liabilityOnlyPremium, setLiabilityOnlyPremium] = useState(650);
  const [years, setYears] = useState(3);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const safeYears = Math.max(0, years);
    const leaseAnnual = fullCoveragePremium + gapPremium;
    const leaseTotal = leaseAnnual * safeYears;
    const buyTotal = liabilityOnlyPremium * safeYears;
    const difference = leaseTotal - buyTotal;
    const annualDifference = leaseAnnual - liabilityOnlyPremium;
    const hasInputs = fullCoveragePremium > 0 || liabilityOnlyPremium > 0;

    return {
      safeYears,
      leaseAnnual,
      leaseTotal,
      buyTotal,
      difference,
      annualDifference,
      hasInputs,
    };
  }, [fullCoveragePremium, gapPremium, liabilityOnlyPremium, years]);

  async function copyResult() {
    const lines = [
      "Lease vs. buy insurance cost comparison",
      `Term: ${result.safeYears} year${result.safeYears === 1 ? "" : "s"}`,
      `Leased/financed scenario (full coverage${gapPremium > 0 ? " + gap" : ""}): ${USD.format(result.leaseAnnual)}/year, ${USD.format(result.leaseTotal)} over the term`,
      `Owned/paid-off scenario (liability-only): ${USD.format(liabilityOnlyPremium)}/year, ${USD.format(result.buyTotal)} over the term`,
      `Insurance cost difference: ${USD.format(Math.abs(result.difference))} ${result.difference >= 0 ? "more" : "less"} to carry the coverage a lessor or lender typically requires`,
      "Estimate only, covers insurance cost alone, not the full lease-vs-buy decision. insurancetools.org/tools/auto/lease-vs-buy-insurance-requirement-calculator",
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
        <span className="label-mono text-slate-500">LEASE VS. BUY INSURANCE COST CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Annual full coverage premium"
            hint="Collision + comprehensive portion, the piece a lessor or lender typically requires"
            value={fullCoveragePremium}
            onChange={setFullCoveragePremium}
          />
          <NumberField
            label="Annual gap insurance premium"
            hint="Leave at $0 if you're not leasing or financing, or if gap is bundled elsewhere"
            value={gapPremium}
            onChange={setGapPremium}
          />
          <NumberField
            label="Annual liability-only premium"
            hint="What you'd pay if the vehicle were paid off and you dropped full coverage"
            value={liabilityOnlyPremium}
            onChange={setLiabilityOnlyPremium}
          />
          <NumberField
            label="Lease or loan term"
            hint="Years the required coverage would apply"
            value={years}
            onChange={setYears}
            prefix=""
            suffix="years"
            max={10}
            step={1}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">INSURANCE COST DIFFERENCE OVER TERM</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(Math.abs(result.difference))}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.difference >= 0
                ? `More than the liability-only scenario over ${result.safeYears} year${result.safeYears === 1 ? "" : "s"}`
                : `Less than the liability-only scenario over ${result.safeYears} year${result.safeYears === 1 ? "" : "s"} (unusual — double-check your inputs)`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Leased/financed total" value={USD.format(result.leaseTotal)} tone="accent" />
            <Figure label="Owned (paid off) total" value={USD.format(result.buyTotal)} />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Leased/financed per year" value={USD.format(result.leaseAnnual)} />
            <Figure label="Owned per year" value={USD.format(liabilityOnlyPremium)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">What this compares</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasInputs
                  ? "Enter your premiums above to see the comparison."
                  : `This isolates the insurance-cost effect of the coverage a lessor or lender typically requires (full coverage${gapPremium > 0 ? " plus gap insurance" : ""}) against the liability-only coverage an owner of a paid-off vehicle can choose to carry instead. It doesn't include the vehicle's purchase price, lease payments, depreciation, interest, or resale value.`}
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
        Estimate only, and limited to the insurance cost piece of a much bigger decision. This tool does
        not model lease payments, loan interest, depreciation, resale or trade-in value, mileage
        penalties, or maintenance, all of which matter to a real lease-vs-buy decision. Leasing companies
        and most lenders typically require full coverage and often gap insurance for the life of the
        lease or loan, but exact requirements vary by leasing company, lender, and contract. Confirm your
        specific requirement with your leasing company or lender, and get an exact price from a licensed
        agent before buying or changing a policy.
      </div>
    </div>
  );
}

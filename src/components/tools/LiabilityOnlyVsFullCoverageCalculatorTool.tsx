"use client";

/**
 * Liability-only vs. full coverage calculator.
 *
 * The user supplies their own two premium quotes (full coverage and
 * liability-only) rather than having a price difference guessed for them,
 * since collision/comprehensive pricing varies too much by driver, vehicle,
 * and insurer to model honestly. The tool's job is just the comparison
 * math: what dropping full coverage would save per year, whether a loan or
 * lease removes that option entirely, and — when it doesn't — how many
 * years of savings it would take to equal the car's actual cash value,
 * which is the commonly cited "10% rule" restated as a payback period
 * instead of a single threshold.
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

export function LiabilityOnlyVsFullCoverageCalculatorTool() {
  const [vehicleValue, setVehicleValue] = useState(9_000);
  const [fullPremium, setFullPremium] = useState(1_650);
  const [liabilityPremium, setLiabilityPremium] = useState(950);
  const [loanBalance, setLoanBalance] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasVehicleValue = vehicleValue > 0;
    const hasBothPremiums = fullPremium > 0 && liabilityPremium > 0;
    const annualSavings = fullPremium - liabilityPremium;
    const lienHolderBlocksIt = loanBalance > 0;

    const paybackYears =
      hasVehicleValue && annualSavings > 0 ? vehicleValue / annualSavings : null;

    // A common restatement of the "10% rule": if the annual full-coverage
    // premium already exceeds roughly 10% of the car's value, dropping it
    // pays for itself in under ten years, which most people consider fast.
    const tenPercentThreshold = vehicleValue * 0.1;
    const premiumAboveTenPercent = hasVehicleValue && fullPremium > tenPercentThreshold;

    let verdict: "loan" | "no-savings" | "fast-payback" | "slow-payback" | "incomplete";
    if (!hasBothPremiums) {
      verdict = "incomplete";
    } else if (lienHolderBlocksIt) {
      verdict = "loan";
    } else if (annualSavings <= 0) {
      verdict = "no-savings";
    } else if (paybackYears !== null && paybackYears <= 10) {
      verdict = "fast-payback";
    } else {
      verdict = "slow-payback";
    }

    return {
      hasVehicleValue,
      hasBothPremiums,
      annualSavings,
      lienHolderBlocksIt,
      paybackYears,
      tenPercentThreshold,
      premiumAboveTenPercent,
      verdict,
    };
  }, [vehicleValue, fullPremium, liabilityPremium, loanBalance]);

  async function copyResult() {
    const lines = [
      "Liability-only vs. full coverage comparison",
      `Full coverage premium: ${USD.format(fullPremium)}/year`,
      `Liability-only premium: ${USD.format(liabilityPremium)}/year`,
      `Potential annual savings if liability-only: ${USD.format(Math.max(0, result.annualSavings))}`,
      result.lienHolderBlocksIt
        ? "Remaining loan/lease balance is above $0, so most lenders require full coverage right now — dropping it isn't an option until the loan is paid off or refinanced."
        : result.paybackYears !== null
          ? `Years of savings to equal the car's value: ${result.paybackYears.toFixed(1)}`
          : "Not enough savings to calculate a payback period.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/liability-only-vs-full-coverage-calculator",
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
        <span className="label-mono text-slate-500">LIABILITY-ONLY VS. FULL COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Vehicle's actual cash value"
            hint="What it would sell for today, not what you paid"
            value={vehicleValue}
            onChange={setVehicleValue}
          />
          <NumberField
            label="Annual full coverage premium"
            hint="Your total premium including collision and comprehensive"
            value={fullPremium}
            onChange={setFullPremium}
          />
          <NumberField
            label="Annual liability-only premium"
            hint="A quote for liability alone, with collision and comprehensive removed"
            value={liabilityPremium}
            onChange={setLiabilityPremium}
          />
          <NumberField
            label="Remaining loan or lease balance"
            hint="Leave at $0 if you own the car outright"
            value={loanBalance}
            onChange={setLoanBalance}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ANNUAL SAVINGS IF LIABILITY-ONLY</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.hasBothPremiums ? USD.format(result.annualSavings) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasBothPremiums
                ? `${USD.format(fullPremium)}/year full coverage minus ${USD.format(liabilityPremium)}/year liability-only`
                : "Enter both premiums to see the difference"}
            </p>
          </div>

          {result.verdict === "loan" && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              You still owe {USD.format(loanBalance)} on this vehicle. Almost every lender and lease
              contract requires full coverage while a loan or lease balance is outstanding, so dropping
              to liability-only usually isn&apos;t an option yet, whatever the savings look like above.
            </div>
          )}

          {result.verdict === "no-savings" && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-700">
              Your liability-only quote isn&apos;t actually cheaper than your full coverage quote. Double-check
              both numbers — if they&apos;re correct, there&apos;s no premium savings to weigh against the loss of
              collision and comprehensive protection.
            </div>
          )}

          {result.verdict === "fast-payback" && result.paybackYears !== null && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              At {USD.format(result.annualSavings)}/year saved, dropping full coverage would recoup your
              car&apos;s entire {USD.format(vehicleValue)} value in about {result.paybackYears.toFixed(1)}{" "}
              years. That&apos;s a fast payback, which is the situation the commonly cited 10% rule points
              toward dropping full coverage.
            </div>
          )}

          {result.verdict === "slow-payback" && result.paybackYears !== null && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-700">
              At {USD.format(result.annualSavings)}/year saved, it would take about{" "}
              {result.paybackYears.toFixed(1)} years of savings to equal your car&apos;s{" "}
              {USD.format(vehicleValue)} value. That&apos;s a slow payback, so keeping full coverage
              protects a higher-value vehicle relative to what you&apos;d save.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Years to recoup value"
              value={result.paybackYears !== null ? `${result.paybackYears.toFixed(1)} yrs` : "—"}
              tone="accent"
            />
            <Figure
              label="10% rule threshold"
              value={result.hasVehicleValue ? USD.format(result.tenPercentThreshold) : "—"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">The 10% rule, applied to your numbers</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasVehicleValue
                  ? "Enter your vehicle's value to check this."
                  : result.premiumAboveTenPercent
                    ? `Your ${USD.format(fullPremium)}/year full coverage premium is above the common 10% guideline (${USD.format(result.tenPercentThreshold)}) for a ${USD.format(vehicleValue)} vehicle, which is the guideline some drivers use as a signal to compare liability-only pricing.`
                    : `Your ${USD.format(fullPremium)}/year full coverage premium is within the common 10% guideline (${USD.format(result.tenPercentThreshold)}) for a ${USD.format(vehicleValue)} vehicle.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Loan or lease status</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.lienHolderBlocksIt
                  ? `You have ${USD.format(loanBalance)} remaining. Most financing agreements require full coverage until that balance is gone.`
                  : "No loan or lease balance entered, so this decision is entirely yours to make based on savings and risk tolerance."}
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
        Estimate only. This tool compares the two premiums you enter and applies a commonly cited
        payback rule of thumb; it is not a quote, and it does not know your lender&apos;s specific
        requirements or an insurer&apos;s underwriting rules. Confirm your loan or lease contract&apos;s coverage
        requirement and get exact pricing from a licensed agent before changing a policy.
      </div>
    </div>
  );
}

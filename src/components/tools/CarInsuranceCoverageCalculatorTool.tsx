"use client";

/**
 * Car insurance coverage calculator.
 *
 * Recommends a liability limit tier using the asset-protection method
 * (protect what you own plus a year of income, since a judgment can also
 * attach future wages), not a flat "everyone needs 100/300/100" rule of
 * thumb. Also flags whether collision/comprehensive is likely worth its
 * premium (the common 10% rule), whether gap insurance is needed, and what
 * uninsured/underinsured motorist limit to pair with the liability limit.
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

interface LiabilityTier {
  label: string;
  biPerPerson: number;
  biPerAccident: number;
  pd: number;
}

const TIERS: LiabilityTier[] = [
  { label: "100/300/100", biPerPerson: 100_000, biPerAccident: 300_000, pd: 100_000 },
  { label: "250/500/100", biPerPerson: 250_000, biPerAccident: 500_000, pd: 100_000 },
  { label: "250/500/250", biPerPerson: 250_000, biPerAccident: 500_000, pd: 250_000 },
];

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

export function CarInsuranceCoverageCalculatorTool() {
  const [assets, setAssets] = useState(75_000);
  const [income, setIncome] = useState(65_000);
  const [vehicleValue, setVehicleValue] = useState(18_000);
  const [loanBalance, setLoanBalance] = useState(0);
  const [fullCoveragePremium, setFullCoveragePremium] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const exposure = assets + income;

    const tier =
      exposure <= 300_000 ? TIERS[0] : exposure <= 500_000 ? TIERS[1] : TIERS[2];

    const umbrellaGap = Math.max(0, exposure - 500_000);
    const recommendedPD = vehicleValue > 50_000 ? Math.max(tier.pd, 250_000) : tier.pd;

    const tenPercentThreshold = vehicleValue * 0.1;
    const hasPremium = fullCoveragePremium > 0;
    const hasVehicleValue = vehicleValue > 0;
    const premiumOverThreshold = hasPremium && hasVehicleValue && fullCoveragePremium > tenPercentThreshold;
    const lowValueVehicle = hasVehicleValue && vehicleValue < 4_000;

    const gapAmount = Math.max(0, loanBalance - vehicleValue);
    const needsGap = gapAmount > 0;

    const umLimit = `${tier.biPerPerson / 1000}/${tier.biPerAccident / 1000}`;

    return {
      exposure,
      tier,
      umbrellaGap,
      recommendedPD,
      tenPercentThreshold,
      hasPremium,
      hasVehicleValue,
      premiumOverThreshold,
      lowValueVehicle,
      gapAmount,
      needsGap,
      umLimit,
    };
  }, [assets, income, vehicleValue, loanBalance, fullCoveragePremium]);

  async function copyResult() {
    const lines = [
      "Car insurance coverage recommendation",
      `Liability: ${result.tier.label} ($${result.tier.biPerPerson / 1000}k/$${result.tier.biPerAccident / 1000}k bodily injury, $${result.recommendedPD / 1000}k property damage)`,
      `Uninsured/underinsured motorist: match your liability limit (${result.umLimit})`,
      result.needsGap
        ? `Gap insurance: recommended, roughly ${USD.format(result.gapAmount)} of exposure`
        : "Gap insurance: not currently needed based on your loan balance and vehicle value",
      result.hasPremium
        ? result.premiumOverThreshold
          ? "Collision/comprehensive: premium is above the common 10% rule of thumb relative to vehicle value, worth reviewing"
          : "Collision/comprehensive: premium is within the common 10% guideline relative to vehicle value"
        : "Collision/comprehensive: enter your premium to check it against the 10% rule",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/car-insurance-coverage-calculator",
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
        <span className="label-mono text-slate-500">CAR INSURANCE COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Assets you want to protect"
            hint="Savings, investments, home equity combined"
            value={assets}
            onChange={setAssets}
          />
          <NumberField
            label="Annual income"
            hint="A judgment can also attach future wages"
            value={income}
            onChange={setIncome}
          />
          <NumberField
            label="Vehicle's actual cash value"
            hint="What it would sell for today, not what you paid"
            value={vehicleValue}
            onChange={setVehicleValue}
          />
          <NumberField
            label="Remaining loan or lease balance"
            hint="Leave at $0 if you own the car outright"
            value={loanBalance}
            onChange={setLoanBalance}
          />
          <NumberField
            label="Annual collision + comprehensive premium"
            hint="Optional — the portion covering damage to your own car"
            value={fullCoveragePremium}
            onChange={setFullCoveragePremium}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">RECOMMENDED LIABILITY LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.tier.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.tier.biPerPerson)} per person / {USD.format(result.tier.biPerAccident)} per
              accident bodily injury, {USD.format(result.recommendedPD)} property damage
            </p>
          </div>

          {result.umbrellaGap > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Your assets and income add up to {USD.format(result.exposure)}, which is above what a 250/500
              auto policy alone typically covers. Consider pairing this limit with a personal umbrella
              policy for roughly {USD.format(result.umbrellaGap)} of additional protection.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total exposure" value={USD.format(result.exposure)} />
            <Figure label="UM/UIM limit" value={result.umLimit} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Collision &amp; comprehensive</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasVehicleValue
                  ? "Enter your vehicle's value to check this."
                  : result.lowValueVehicle
                    ? `At ${USD.format(vehicleValue)}, your vehicle is low enough in value that many drivers choose to drop collision and comprehensive and self-insure instead.`
                    : !result.hasPremium
                      ? `Enter your annual premium to compare it against the common 10% rule (about ${USD.format(result.tenPercentThreshold)}/year for a ${USD.format(vehicleValue)} vehicle).`
                      : result.premiumOverThreshold
                        ? `Your ${USD.format(fullCoveragePremium)}/year premium is above the common 10% guideline (${USD.format(result.tenPercentThreshold)}) for a ${USD.format(vehicleValue)} vehicle. Worth comparing against self-insuring the vehicle's value.`
                        : `Your ${USD.format(fullCoveragePremium)}/year premium is within the common 10% guideline (${USD.format(result.tenPercentThreshold)}) for a ${USD.format(vehicleValue)} vehicle.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Gap insurance</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.needsGap
                  ? `Your loan balance is ${USD.format(result.gapAmount)} more than the vehicle's value. A total loss would leave that gap uncovered without gap insurance.`
                  : "Your loan balance doesn't currently exceed the vehicle's value, so gap insurance isn't adding coverage right now. Recheck this if you refinance or the balance grows."}
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
        Estimate only. This tool models a commonly used asset-protection method for choosing liability
        limits; it is not a quote, and it does not know your state&apos;s specific requirements or an
        insurer&apos;s underwriting rules. Confirm your state&apos;s minimum and get an exact price from a
        licensed agent before buying or changing a policy.
      </div>
    </div>
  );
}

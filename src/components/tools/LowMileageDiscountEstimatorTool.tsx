"use client";

/**
 * Low-mileage discount estimator.
 *
 * This tool does exactly one calculation: it applies a user-supplied
 * discount percentage (pulled from their own quote or insurer's low-mileage
 * program) to their current annual premium. It does not invent a discount
 * rate, because insurers set low-mileage thresholds and percentages
 * individually and those numbers are not publicly standardized. What it adds
 * beyond a plain multiplication is guidance on where that percentage
 * typically comes from and how confident the user should be in their
 * mileage estimate before acting on the result.
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const MILES = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

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

function NumberField({ label, hint, value, onChange, max = 1_000_000, prefix, suffix, step = 1 }: NumberFieldProps) {
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
          } ${suffix ? "pr-10" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function LowMileageDiscountEstimatorTool() {
  const [annualPremium, setAnnualPremium] = useState(1_400);
  const [annualMileage, setAnnualMileage] = useState(6_000);
  const [discountPct, setDiscountPct] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasDiscount = discountPct > 0;
    const annualSavings = annualPremium * (discountPct / 100);
    const monthlySavings = annualSavings / 12;
    const newPremium = annualPremium - annualSavings;

    // Purely informational band check, not a computed rule — insurers set
    // their own low-mileage thresholds, and this only flags where the
    // entered mileage tends to fall relative to commonly cited ranges.
    let mileageBand: "likely" | "borderline" | "unlikely";
    if (annualMileage <= 7_500) {
      mileageBand = "likely";
    } else if (annualMileage <= 12_000) {
      mileageBand = "borderline";
    } else {
      mileageBand = "unlikely";
    }

    return { hasDiscount, annualSavings, monthlySavings, newPremium, mileageBand };
  }, [annualPremium, annualMileage, discountPct]);

  async function copyResult() {
    const lines = [
      "Low-mileage discount estimate",
      `Current annual premium: ${USD.format(annualPremium)}`,
      `Estimated annual mileage: ${MILES.format(annualMileage)} miles/year`,
      `Discount percentage used: ${discountPct}%`,
      result.hasDiscount
        ? `Estimated savings: ${USD.format(result.annualSavings)}/year (${USD.format(result.monthlySavings)}/month), new premium roughly ${USD.format(result.newPremium)}/year`
        : "Enter the discount percentage from your insurer's low-mileage program to see estimated savings",
      "Estimate only, not a quote. insurancetools.org/tools/auto/low-mileage-discount-estimator",
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
        <span className="label-mono text-slate-500">LOW-MILEAGE DISCOUNT ESTIMATOR</span>
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
            hint="What you pay for this vehicle over a full year, before any discount"
            value={annualPremium}
            onChange={setAnnualPremium}
            prefix="$"
            step={10}
          />
          <NumberField
            label="Estimated annual mileage"
            hint="Not sure? See the tracking tip below the results"
            value={annualMileage}
            onChange={setAnnualMileage}
            suffix="mi/yr"
            step={100}
            max={100_000}
          />
          <NumberField
            label="Insurer's quoted low-mileage discount"
            hint="From your quote or policy documents — this tool doesn't guess it for you"
            value={discountPct}
            onChange={setDiscountPct}
            suffix="%"
            step={1}
            max={100}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED ANNUAL SAVINGS</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.hasDiscount ? USD.format(result.annualSavings) : "$0.00"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasDiscount
                ? `Based on a ${discountPct}% discount applied to your ${USD.format(annualPremium)}/year premium`
                : "Enter a discount percentage from your insurer to see estimated savings"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Monthly savings" value={result.hasDiscount ? USD.format(result.monthlySavings) : "$0.00"} />
            <Figure
              label="New estimated premium"
              value={result.hasDiscount ? USD.format(result.newPremium) : USD.format(annualPremium)}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Where your mileage typically falls</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.mileageBand === "likely" &&
                  `At ${MILES.format(annualMileage)} miles/year, you're in the range many insurers consider for a low-mileage discount, though the exact cutoff and the size of the discount vary by insurer. Confirm your specific program's threshold with your agent or quote.`}
                {result.mileageBand === "borderline" &&
                  `At ${MILES.format(annualMileage)} miles/year, you're in a range some insurers include in a low-mileage program and others don't. It's worth asking directly whether your mileage qualifies rather than assuming either way.`}
                {result.mileageBand === "unlikely" &&
                  `At ${MILES.format(annualMileage)} miles/year, you're above the range most low-mileage programs target. You may still qualify for other usage-based discounts, but a low-mileage discount specifically is less likely at this level.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Not sure of your actual mileage?</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Check your odometer today, then check it again after two or three weeks of normal driving.
                Multiply the difference by roughly 17 to 26 to get a rough annual estimate, or just check
                again after a full month and multiply by 12. A guessed number that&apos;s too low can get
                flagged if an insurer later verifies mileage, so it&apos;s worth a few minutes to get close.
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
        Estimate only. This tool multiplies your premium by a discount percentage you supply; it does not
        know your insurer&apos;s actual low-mileage threshold, verification method, or whether you qualify.
        Confirm eligibility and the exact discount amount with your insurer or a licensed agent before
        assuming these savings apply to your policy.
      </div>
    </div>
  );
}

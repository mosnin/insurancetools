"use client";

/**
 * Multi-car discount savings calculator.
 *
 * Multi-car (also called "multi-vehicle" or "bundle") discounts are quoted
 * as a percentage off, but insurers rarely show the dollar amount that
 * percentage actually represents. This tool takes what each vehicle would
 * cost insured on its own, adds them together, and applies the insurer's
 * quoted multi-car discount percentage to show the actual savings in
 * dollars, plus what the bundled annual and monthly total works out to.
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
}

function NumberField({ label, hint, value, onChange, max = 1_000_000 }: NumberFieldProps) {
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
          step={25}
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
          max={60}
          step={0.5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 60) : 0;
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

export function MultiCarDiscountSavingsCalculatorTool() {
  const [vehicle1Premium, setVehicle1Premium] = useState(1_400);
  const [vehicle2Premium, setVehicle2Premium] = useState(1_100);
  const [discountPct, setDiscountPct] = useState(15);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const combinedPremium = vehicle1Premium + vehicle2Premium;
    const hasPremiums = combinedPremium > 0;
    const savings = hasPremiums ? combinedPremium * (discountPct / 100) : 0;
    const bundledTotal = combinedPremium - savings;
    const monthlySavings = savings / 12;
    const bundledMonthly = bundledTotal / 12;
    const effectiveRate = hasPremiums ? (savings / combinedPremium) * 100 : 0;

    return {
      combinedPremium,
      hasPremiums,
      savings,
      bundledTotal,
      monthlySavings,
      bundledMonthly,
      effectiveRate,
    };
  }, [vehicle1Premium, vehicle2Premium, discountPct]);

  async function copyResult() {
    const lines = [
      "Multi-car discount savings estimate",
      `Combined premium if insured separately: ${USD.format(result.combinedPremium)}/year`,
      `Multi-car discount applied: ${discountPct}%`,
      `Estimated savings: ${USD.format(result.savings)}/year (about ${USD_CENTS.format(result.monthlySavings)}/month)`,
      `Estimated bundled total: ${USD.format(result.bundledTotal)}/year (about ${USD_CENTS.format(result.bundledMonthly)}/month)`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/multi-car-discount-savings-calculator",
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
        <span className="label-mono text-slate-500">MULTI-CAR DISCOUNT SAVINGS CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Vehicle 1 annual premium if insured separately"
            hint="What that car would cost on its own policy or with a different insurer"
            value={vehicle1Premium}
            onChange={setVehicle1Premium}
          />
          <NumberField
            label="Vehicle 2 annual premium if insured separately"
            hint="Add a third or fourth vehicle's premium into this field if you have more than two"
            value={vehicle2Premium}
            onChange={setVehicle2Premium}
          />
          <PercentField
            label="Multi-car discount your insurer quoted"
            hint="Ask your agent for this exact number; it's usually 10% to 25%"
            value={discountPct}
            onChange={setDiscountPct}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED ANNUAL SAVINGS</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-blue-600">
              {USD.format(result.savings)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              about {USD_CENTS.format(result.monthlySavings)}/month, {result.effectiveRate.toFixed(1)}% off the
              combined separate-policy total
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Combined premium (separate)" value={USD.format(result.combinedPremium)} />
            <Figure label="Bundled total (multi-car)" value={USD.format(result.bundledTotal)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Figure label="Bundled monthly" value={USD_CENTS.format(result.bundledMonthly)} />
            <Figure label="Discount applied" value={`${discountPct}%`} tone="accent" />
          </div>

          {!result.hasPremiums && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Enter each vehicle&apos;s standalone premium to see your savings. A $0 combined premium can&apos;t
              produce a meaningful dollar estimate.
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
            Multi-car discounts typically apply once every vehicle is insured on the same policy under the
            same named insured or household. If your vehicles are currently split across different
            insurers, it&apos;s still worth asking your agent for a combined multi-car quote; the discount
            can outweigh whatever loyalty pricing you have with a separate insurer on a single car.
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
        Estimate only. This tool multiplies the discount percentage you enter by the combined standalone
        premium you enter; it does not know your actual policy terms, state, driving record, or an
        insurer&apos;s specific eligibility rules for bundling. Multi-car discount availability and size vary
        by insurer and by state, and some insurers restrict eligibility to vehicles registered at the same
        address. Confirm your exact discount and eligibility with a licensed agent before assuming these
        savings apply to your policy.
      </div>
    </div>
  );
}

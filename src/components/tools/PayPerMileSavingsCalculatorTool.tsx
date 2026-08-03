"use client";

/**
 * Pay-per-mile insurance savings calculator.
 *
 * Compares a traditional annual premium against a usage-based, pay-per-mile
 * program quoted as a flat monthly base fee plus a per-mile rate. Beyond a
 * simple side-by-side total, it solves for the breakeven annual mileage —
 * the point at which both options cost exactly the same — so a low-mileage
 * driver can see not just "which is cheaper today" but "how much driving
 * room do I have before that stops being true."
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

const MILES = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  max?: number;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  max = 1_000_000,
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
          inputMode="decimal"
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
          } ${suffix ? "pr-14" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function PayPerMileSavingsCalculatorTool() {
  const [traditionalPremium, setTraditionalPremium] = useState(1400);
  const [baseFee, setBaseFee] = useState(29);
  const [perMileRate, setPerMileRate] = useState(0.06);
  const [annualMiles, setAnnualMiles] = useState(6000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const annualBaseFee = baseFee * 12;
    const mileageCost = perMileRate * annualMiles;
    const payPerMileTotal = annualBaseFee + mileageCost;
    const difference = traditionalPremium - payPerMileTotal;
    const payPerMileCheaper = difference > 0;
    const traditionalCheaper = difference < 0;

    // Breakeven: traditionalPremium = annualBaseFee + perMileRate * miles
    // => miles = (traditionalPremium - annualBaseFee) / perMileRate
    const hasRate = perMileRate > 0;
    const rawBreakEven = hasRate ? (traditionalPremium - annualBaseFee) / perMileRate : NaN;
    const traditionalAlwaysCheaper = !hasRate || rawBreakEven <= 0;
    const breakEvenMiles = hasRate && rawBreakEven > 0 ? rawBreakEven : null;

    return {
      annualBaseFee,
      mileageCost,
      payPerMileTotal,
      difference,
      payPerMileCheaper,
      traditionalCheaper,
      breakEvenMiles,
      traditionalAlwaysCheaper,
    };
  }, [traditionalPremium, baseFee, perMileRate, annualMiles]);

  async function copyResult() {
    const lines = [
      "Pay-per-mile insurance savings comparison",
      `Traditional annual premium: ${USD.format(traditionalPremium)}`,
      `Pay-per-mile estimated annual cost: ${USD.format(result.payPerMileTotal)} (${USD.format(result.annualBaseFee)} base + ${USD.format(result.mileageCost)} for ${MILES.format(annualMiles)} miles)`,
      result.payPerMileCheaper
        ? `Pay-per-mile saves about ${USD.format(Math.abs(result.difference))}/year at this mileage`
        : result.traditionalCheaper
          ? `Traditional insurance costs about ${USD.format(Math.abs(result.difference))}/year less at this mileage`
          : "Both options cost about the same at this mileage",
      result.traditionalAlwaysCheaper
        ? "Breakeven: traditional insurance is cheaper at every mileage level for this quote"
        : `Breakeven mileage: about ${MILES.format(result.breakEvenMiles ?? 0)} miles/year`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/pay-per-mile-savings-calculator",
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
        <span className="label-mono text-slate-500">PAY-PER-MILE INSURANCE SAVINGS CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Current traditional annual premium"
            hint="What you pay now (or a quote) for a standard 6- or 12-month policy, annualized"
            value={traditionalPremium}
            onChange={setTraditionalPremium}
            prefix="$"
            step={25}
          />
          <NumberField
            label="Pay-per-mile monthly base fee"
            hint="The flat monthly charge the program bills regardless of mileage"
            value={baseFee}
            onChange={setBaseFee}
            prefix="$"
            step={1}
          />
          <NumberField
            label="Pay-per-mile rate"
            hint="Cents charged per mile driven, e.g. 0.06 for 6 cents/mile"
            value={perMileRate}
            onChange={setPerMileRate}
            prefix="$"
            suffix="/ mile"
            step={0.01}
            max={5}
          />
          <NumberField
            label="Expected annual mileage"
            hint="Your realistic yearly total, not an odometer guess from years ago"
            value={annualMiles}
            onChange={setAnnualMiles}
            suffix="mi/yr"
            step={100}
            max={100_000}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              {result.payPerMileCheaper
                ? "PAY-PER-MILE SAVES YOU"
                : result.traditionalCheaper
                  ? "TRADITIONAL SAVES YOU"
                  : "COST DIFFERENCE"}
            </p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.payPerMileCheaper ? "text-blue-600" : "text-slate-900"
              }`}
            >
              {USD.format(Math.abs(result.difference))}
              <span className="ml-1 text-base font-medium text-slate-400">/year</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              At {MILES.format(annualMiles)} miles/year: {USD.format(traditionalPremium)} traditional vs{" "}
              {USD.format(result.payPerMileTotal)} pay-per-mile
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            {result.traditionalAlwaysCheaper ? (
              <>
                Based on this quote, traditional insurance stays cheaper than pay-per-mile at every mileage
                level, including zero. The per-mile rate and base fee together never fall below your
                traditional premium.
              </>
            ) : (
              <>
                Breakeven point: at about{" "}
                <strong>{MILES.format(result.breakEvenMiles ?? 0)} miles/year</strong>, both options cost
                the same. Drive fewer miles than that and pay-per-mile is likely cheaper; drive more and
                traditional coverage likely wins.
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Base fee (12 mo)" value={USD.format(result.annualBaseFee)} />
            <Figure label="Mileage charge" value={USD_CENTS.format(result.mileageCost)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Pay-per-mile total (annual)</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {USD.format(result.annualBaseFee)} in base fees (${baseFee.toFixed(2)}/month × 12) plus{" "}
                {USD_CENTS.format(result.mileageCost)} in mileage charges ({USD_CENTS.format(perMileRate)}/mile
                × {MILES.format(annualMiles)} miles) equals {USD.format(result.payPerMileTotal)} per year.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Breakeven mileage</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.traditionalAlwaysCheaper
                  ? "This program's base fee alone is high enough relative to your traditional premium that no realistic mileage level makes pay-per-mile the cheaper option. Try a lower base fee or per-mile rate to see where that changes."
                  : `Solved from (traditional premium − annual base fee) ÷ per-mile rate. Below ${MILES.format(result.breakEvenMiles ?? 0)} miles/year, pay-per-mile costs less; above it, the mileage charges outweigh the savings on the base fee.`}
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
        Estimate only. This tool compares the numbers you enter; it does not know your driving record,
        vehicle, location, or a specific insurer&apos;s underwriting, and pay-per-mile programs vary in how
        they define a billable mile, cap monthly charges, or apply discounts. Confirm exact pricing and
        program rules with a licensed insurance agent or the program provider before switching policies.
      </div>
    </div>
  );
}

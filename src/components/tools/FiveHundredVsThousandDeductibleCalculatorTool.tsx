"use client";

/**
 * $500 vs $1,000 deductible calculator.
 *
 * The decision between a $500 and a $1,000 collision/comprehensive
 * deductible comes down to a simple trade: raising the deductible lowers
 * the premium, but raises what you pay out of pocket the next time you
 * file an at-fault claim. This tool turns that trade into a single
 * comparable number: how many years of premium savings it takes to make
 * up the extra $500 you'd pay out of pocket, then lets the user weigh
 * that break-even point against how often they actually expect to file a
 * claim.
 *
 * It does not predict claim frequency. The user supplies that assumption
 * themselves; the tool only does the arithmetic and shows both numbers
 * side by side so the final judgment call stays with the user.
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

const USD_DECIMAL = new Intl.NumberFormat("en-US", {
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
  prefix?: string;
  suffix?: string;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  max = 100_000,
  step = 10,
  prefix = "$",
  suffix,
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

export function FiveHundredVsThousandDeductibleCalculatorTool() {
  const [premium500, setPremium500] = useState(1450);
  const [premium1000, setPremium1000] = useState(1250);
  const [claimYears, setClaimYears] = useState(5);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const annualSavings = premium500 - premium1000;
    const hasSavings = annualSavings > 0;
    const breakEvenYears = hasSavings ? 500 / annualSavings : Infinity;
    const validClaimYears = claimYears > 0;

    let favors: "higher" | "lower" | "unclear" = "unclear";
    if (hasSavings && validClaimYears) {
      favors = breakEvenYears < claimYears ? "higher" : "lower";
    } else if (!hasSavings) {
      favors = "lower";
    }

    const lifetimeYears = 10;
    const claimsOverLifetime = validClaimYears ? lifetimeYears / claimYears : 0;
    const extraOutOfPocketOverLifetime = claimsOverLifetime * 500;
    const savingsOverLifetime = hasSavings ? annualSavings * lifetimeYears : 0;
    const netOverLifetime = savingsOverLifetime - extraOutOfPocketOverLifetime;

    return {
      annualSavings,
      hasSavings,
      breakEvenYears,
      validClaimYears,
      favors,
      netOverLifetime,
    };
  }, [premium500, premium1000, claimYears]);

  async function copyResult() {
    const lines = [
      "$500 vs $1,000 deductible comparison",
      `Premium at $500 deductible: ${USD.format(premium500)}/year`,
      `Premium at $1,000 deductible: ${USD.format(premium1000)}/year`,
      result.hasSavings
        ? `Annual savings from raising the deductible: ${USD.format(result.annualSavings)}`
        : "The $1,000 deductible does not lower the premium in the numbers entered",
      result.hasSavings
        ? `Break-even point: ${result.breakEvenYears.toFixed(1)} years of savings to cover the extra $500 out of pocket`
        : "Break-even point: not applicable, no premium savings entered",
      `Assumed years between at-fault claims: ${claimYears}`,
      result.favors === "higher"
        ? "Based on these numbers, the $1,000 deductible tends to favor the lower long-run cost."
        : result.favors === "lower"
          ? "Based on these numbers, the $500 deductible tends to favor the lower long-run cost."
          : "Enter valid numbers to compare.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/500-vs-1000-deductible-calculator",
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
        <span className="label-mono text-slate-500">$500 VS $1,000 DEDUCTIBLE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Annual premium at a $500 deductible"
            hint="From a quote or your current declarations page"
            value={premium500}
            onChange={setPremium500}
            max={20_000}
          />
          <NumberField
            label="Annual premium at a $1,000 deductible"
            hint="Same coverage, only the deductible changed"
            value={premium1000}
            onChange={setPremium1000}
            max={20_000}
          />
          <NumberField
            label="Years between at-fault claims (your estimate)"
            hint="Default of 5 reflects a typical careful driver; adjust to your own record"
            value={claimYears}
            onChange={setClaimYears}
            max={40}
            step={1}
            prefix=""
            suffix="years"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">BREAK-EVEN POINT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.hasSavings ? `${result.breakEvenYears.toFixed(1)} years` : "N/A"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasSavings
                ? `Years of premium savings needed to make up the extra $500 you'd pay out of pocket on a claim`
                : "Enter a higher premium for the $500 deductible than the $1,000 deductible to calculate a break-even point"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Annual savings"
              value={result.hasSavings ? USD_DECIMAL.format(result.annualSavings) : USD.format(0)}
              tone="accent"
            />
            <Figure label="Your claim assumption" value={`${claimYears} yrs`} />
          </div>

          <div
            className={`rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${
              result.favors === "higher"
                ? "border-blue-100 bg-blue-50 text-blue-800"
                : "border-amber-100 bg-amber-50 text-amber-800"
            }`}
          >
            {result.favors === "higher" && (
              <>
                Your break-even point ({result.breakEvenYears.toFixed(1)} years) is shorter than the{" "}
                {claimYears}-year gap you expect between at-fault claims. Based on these numbers alone,
                the <strong>$1,000 deductible</strong> tends to come out ahead over time &mdash; but this is
                arithmetic, not a prediction of when you&apos;ll actually file a claim.
              </>
            )}
            {result.favors === "lower" && result.hasSavings && (
              <>
                Your break-even point ({result.breakEvenYears.toFixed(1)} years) is longer than the{" "}
                {claimYears}-year gap you expect between at-fault claims. Based on these numbers alone,
                the <strong>$500 deductible</strong> tends to come out ahead over time &mdash; but this is
                arithmetic, not a prediction of when you&apos;ll actually file a claim.
              </>
            )}
            {!result.hasSavings && (
              <>
                The $1,000 deductible isn&apos;t saving you anything in the numbers entered, so the{" "}
                <strong>$500 deductible</strong> gives you the same or lower long-run cost with less risk
                exposure per claim.
              </>
            )}
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Rough 10-year outlook</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {result.hasSavings
                ? `Over 10 years, at your assumed claim frequency, choosing the $1,000 deductible nets out to roughly ${USD.format(Math.abs(result.netOverLifetime))} ${result.netOverLifetime >= 0 ? "in your favor" : "against you"} compared to keeping the $500 deductible, combining premium savings and extra out-of-pocket cost on claims.`
                : "Enter premiums for both deductible levels to see a 10-year outlook."}
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
        Estimate only. This tool compares two premium figures you supply against a claim-frequency
        assumption you choose; it does not know your actual driving record, your insurer&apos;s pricing, or
        when you will next file a claim. It is not a quote and not insurance advice. Confirm actual
        premiums for both deductible levels with a licensed agent before changing your policy.
      </div>
    </div>
  );
}

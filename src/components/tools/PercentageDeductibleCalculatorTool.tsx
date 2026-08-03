"use client";

/**
 * Percentage deductible calculator.
 *
 * Some homeowners and commercial property policies replace the usual flat
 * dollar deductible with a PERCENTAGE deductible for specific perils, most
 * commonly wind/hail or hurricane/named-storm damage in coastal and
 * catastrophe-exposed states. The critical, frequently misunderstood detail:
 * that percentage is applied to the DWELLING COVERAGE LIMIT (Coverage A),
 * not to the amount of the claim. A 2% deductible on a $400,000 dwelling
 * limit is an $8,000 deductible on every qualifying claim, whether the claim
 * is for $15,000 or $150,000.
 *
 * This tool never fabricates a "typical" percentage for the user. It asks
 * for the user's own policy figures (dwelling limit and their percentage,
 * read off their declarations page) and does the arithmetic, then contrasts
 * the result against common flat-dollar deductible amounts so the real
 * dollar exposure of a percentage deductible becomes concrete.
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

const USD_PRECISE = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const FLAT_COMPARISON_AMOUNTS = [500, 1_000, 2_500, 5_000];

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
  max = 10_000_000,
  step = 1000,
  prefix,
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
          } ${suffix ? "pr-9" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function PercentageDeductibleCalculatorTool() {
  const [dwellingLimit, setDwellingLimit] = useState(400_000);
  const [percentage, setPercentage] = useState(2);
  const [claimAmount, setClaimAmount] = useState(35_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const clampedPct = Math.min(Math.max(percentage, 0), 25);
    const percentageDeductibleDollars = dwellingLimit * (clampedPct / 100);

    const hasClaim = claimAmount > 0;
    const netPayout = hasClaim ? Math.max(0, claimAmount - percentageDeductibleDollars) : null;
    const deductibleExceedsClaim = hasClaim && percentageDeductibleDollars >= claimAmount;

    // What each flat-dollar deductible would have meant on the same claim,
    // purely for contrast — this tool does not claim any of these is what
    // the user's policy actually offers.
    const flatComparisons = FLAT_COMPARISON_AMOUNTS.map((flat) => ({
      flat,
      difference: percentageDeductibleDollars - flat,
    }));

    const multipleOfLowestFlat =
      FLAT_COMPARISON_AMOUNTS[0] > 0 ? percentageDeductibleDollars / FLAT_COMPARISON_AMOUNTS[0] : 0;

    return {
      clampedPct,
      percentageDeductibleDollars,
      hasClaim,
      netPayout,
      deductibleExceedsClaim,
      flatComparisons,
      multipleOfLowestFlat,
    };
  }, [dwellingLimit, percentage, claimAmount]);

  async function copyResult() {
    const lines = [
      "Percentage deductible calculator result",
      `Dwelling coverage limit: ${USD.format(dwellingLimit)}`,
      `Percentage deductible: ${result.clampedPct}%`,
      `Dollar amount of deductible: ${USD_PRECISE.format(result.percentageDeductibleDollars)}`,
      result.hasClaim
        ? `On a ${USD.format(claimAmount)} claim, net payout after deductible: ${USD.format(result.netPayout ?? 0)}`
        : "Enter a claim amount to see the net payout after this deductible.",
      `For comparison, a flat $1,000 deductible on the same dwelling limit would be $1,000 instead of ${USD_PRECISE.format(result.percentageDeductibleDollars)}.`,
      "Estimate only, not a quote. Confirm your actual percentage and which perils it applies to on your policy declarations page. insurancetools.org/tools/deductibles/percentage-deductible-calculator",
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
        <span className="label-mono text-slate-500">PERCENTAGE DEDUCTIBLE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Dwelling coverage limit (Coverage A)"
            hint="From your declarations page, not your home's market value"
            value={dwellingLimit}
            onChange={setDwellingLimit}
            prefix="$"
          />
          <NumberField
            label="Your policy's percentage deductible"
            hint="Read this from your own declarations page — it varies by state, insurer, and coastal zone"
            value={percentage}
            onChange={(v) => setPercentage(Math.min(Math.max(v, 0), 25))}
            max={25}
            step={0.5}
            suffix="%"
          />
          <NumberField
            label="Claim amount (optional)"
            hint="A repair or rebuild estimate for a qualifying wind/hail or named-storm loss"
            value={claimAmount}
            onChange={setClaimAmount}
            prefix="$"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">YOUR ACTUAL DEDUCTIBLE IN DOLLARS</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD_PRECISE.format(result.percentageDeductibleDollars)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.clampedPct}% of your {USD.format(dwellingLimit)} dwelling limit — applied to your dwelling
              limit, not to the size of the claim.
            </p>
          </div>

          {result.hasClaim && (
            <div
              className={`rounded-lg border px-3.5 py-3 text-xs ${
                result.deductibleExceedsClaim
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
              }`}
            >
              {result.deductibleExceedsClaim ? (
                <>
                  Your {USD_PRECISE.format(result.percentageDeductibleDollars)} deductible meets or exceeds this{" "}
                  {USD.format(claimAmount)} claim, so this loss would likely pay out {USD.format(0)} from your
                  insurer. You would be responsible for the full repair cost yourself.
                </>
              ) : (
                <>
                  On a {USD.format(claimAmount)} claim, your net payout after the{" "}
                  {USD_PRECISE.format(result.percentageDeductibleDollars)} deductible would be roughly{" "}
                  {USD.format(result.netPayout ?? 0)}.
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Dwelling limit" value={USD.format(dwellingLimit)} />
            <Figure label="Percentage applied" value={`${result.clampedPct}%`} tone="accent" />
          </div>

          <div className="space-y-2.5 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">
              What a flat-dollar deductible would have been instead
            </p>
            <div className="space-y-1.5">
              {result.flatComparisons.map(({ flat, difference }) => (
                <div key={flat} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{USD.format(flat)} flat deductible</span>
                  <span className="font-medium tabular-nums text-slate-700">
                    {difference > 0
                      ? `${USD_PRECISE.format(difference)} less than yours`
                      : difference < 0
                        ? `${USD_PRECISE.format(Math.abs(difference))} more than yours`
                        : "same as yours"}
                  </span>
                </div>
              ))}
            </div>
            {result.multipleOfLowestFlat > 1 && (
              <p className="pt-1 text-xs leading-relaxed text-slate-500">
                Your percentage deductible is about {result.multipleOfLowestFlat.toFixed(1)}x larger than a common
                $500 flat deductible on the same dwelling limit.
              </p>
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
        Estimate only. This tool does not know your actual percentage deductible, which peril it applies to, or
        whether your policy uses one at all — those figures vary enormously by state, insurer, and coastal-zone
        designation. Enter the exact percentage and dwelling limit from your own declarations page, and confirm
        both with your insurer or agent before you rely on this number.
      </div>
    </div>
  );
}

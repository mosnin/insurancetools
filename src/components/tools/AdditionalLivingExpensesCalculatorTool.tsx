"use client";

/**
 * Additional living expenses (ALE) / loss of use calculator.
 *
 * ALE coverage reimburses the extra cost of living somewhere else while a
 * covered home is being repaired or rebuilt — it does not pay your normal
 * rent or mortgage, only the *increase* over your normal cost of living.
 * This tool asks for the three numbers that actually drive that increase
 * (a local temporary housing rate the user researches themselves, an
 * editable displacement length, and any other extra daily costs) and
 * multiplies them out, rather than guessing a number for the user. If they
 * know their current ALE limit, the tool compares the two so they can see
 * whether a realistic displacement would exhaust it.
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

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function DollarField({ label, hint, value, onChange, max = 5_000, step = 5 }: DollarFieldProps) {
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

interface DaysFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function DaysField({ label, hint, value, onChange }: DaysFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={730}
          step={5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 730) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          days
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "warn" }) {
  const toneClass =
    tone === "accent" ? "text-blue-600" : tone === "warn" ? "text-amber-600" : "text-slate-900";
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}

export function AdditionalLivingExpensesCalculatorTool() {
  const [dailyHousingCost, setDailyHousingCost] = useState(0);
  const [displacementDays, setDisplacementDays] = useState(60);
  const [extraDailyCosts, setExtraDailyCosts] = useState(0);
  const [currentALELimit, setCurrentALELimit] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const dailyTotal = dailyHousingCost + extraDailyCosts;
    const totalALENeed = dailyTotal * displacementDays;
    const hasLimit = currentALELimit > 0;
    const shortfall = hasLimit ? Math.max(0, totalALENeed - currentALELimit) : 0;
    const surplus = hasLimit ? Math.max(0, currentALELimit - totalALENeed) : 0;
    const daysLimitWouldCover =
      hasLimit && dailyTotal > 0 ? Math.floor(currentALELimit / dailyTotal) : null;

    return { dailyTotal, totalALENeed, hasLimit, shortfall, surplus, daysLimitWouldCover };
  }, [dailyHousingCost, displacementDays, extraDailyCosts, currentALELimit]);

  async function copyResult() {
    const lines = [
      "Additional living expenses (ALE) coverage estimate",
      `Daily temporary housing cost: ${USD.format(dailyHousingCost)}`,
      `Extra daily costs while displaced: ${USD.format(extraDailyCosts)}`,
      `Estimated displacement: ${displacementDays} days`,
      `Estimated total ALE need: ${USD.format(result.totalALENeed)}`,
      result.hasLimit
        ? result.shortfall > 0
          ? `Current ALE limit of ${USD.format(currentALELimit)} falls short by ${USD.format(result.shortfall)} for this scenario`
          : `Current ALE limit of ${USD.format(currentALELimit)} covers this scenario with ${USD.format(result.surplus)} to spare`
        : "Enter your current ALE limit to compare it against this estimate",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/home/additional-living-expenses-calculator",
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
        <span className="label-mono text-slate-500">ADDITIONAL LIVING EXPENSES CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Estimated local temporary housing cost"
            hint="What a hotel or short-term rental runs per night in your area — check local listings, this tool doesn't guess it for you"
            value={dailyHousingCost}
            onChange={setDailyHousingCost}
          />
          <DaysField
            label="Estimated displacement length"
            hint="Adjustable — 60 days is only an illustrative starting point, not a prediction for your repair"
            value={displacementDays}
            onChange={setDisplacementDays}
          />
          <DollarField
            label="Extra daily costs while displaced"
            hint="Dining-out difference, pet boarding, storage — combined, above your normal spending"
            value={extraDailyCosts}
            onChange={setExtraDailyCosts}
          />
          <DollarField
            label="Your current ALE limit (optional)"
            hint="Find this on your declarations page under 'Loss of Use' or 'Coverage D'"
            value={currentALELimit}
            onChange={setCurrentALELimit}
            max={200_000}
            step={500}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED TOTAL ALE NEED</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalALENeed)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.dailyTotal)}/day &times; {displacementDays} days
            </p>
          </div>

          {result.hasLimit && (
            <div
              className={`rounded-lg border px-3.5 py-3 text-xs ${
                result.shortfall > 0
                  ? "border-amber-100 bg-amber-50 text-amber-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
              }`}
            >
              {result.shortfall > 0
                ? `Your current ${USD.format(currentALELimit)} limit falls short of this scenario by ${USD.format(result.shortfall)}. At ${USD.format(result.dailyTotal)}/day, that limit would cover about ${result.daysLimitWouldCover} days, not ${displacementDays}.`
                : `Your current ${USD.format(currentALELimit)} limit covers this scenario with ${USD.format(result.surplus)} to spare, based on ${displacementDays} days at ${USD.format(result.dailyTotal)}/day.`}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Combined daily cost" value={USD.format(result.dailyTotal)} tone="accent" />
            <Figure
              label="Days your limit covers"
              value={result.hasLimit ? (result.daysLimitWouldCover !== null ? `${result.daysLimitWouldCover}` : "—") : "—"}
              tone={result.hasLimit && result.shortfall > 0 ? "warn" : "default"}
            />
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">About the 20% rule of thumb</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              This figure isn&apos;t part of the calculation above. It&apos;s informational only: many
              homeowners policies default ALE (loss of use) coverage to roughly 20% of your dwelling
              coverage limit. That default may or may not be enough for your actual displacement costs —
              check your own declarations page for your specific limit rather than assuming 20% applies.
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
        Estimate only. This tool multiplies the daily costs and displacement length you enter; it does
        not know your actual policy language, your insurer&apos;s ALE sub-limit, local hotel or rental
        rates, or how long your specific repair will take. Confirm your exact ALE/loss-of-use limit and
        any time or dollar caps on your declarations page, and talk to your agent or adjuster before
        relying on this figure during an actual claim.
      </div>
    </div>
  );
}

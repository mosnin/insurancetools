"use client";

/**
 * Rental reimbursement coverage calculator.
 *
 * Rental reimbursement (sometimes called "transportation expense" or "loss
 * of use" coverage) is unusual among optional auto add-ons because it caps
 * payouts two separate ways at once: a daily dollar limit and a total dollar
 * limit for the whole claim. A driver can be well covered on one axis and
 * badly exposed on the other, so this tool checks both independently rather
 * than collapsing them into a single "you're covered" or "you're not"
 * verdict.
 *
 * The daily rental cost and repair-day estimate are numbers the user
 * supplies themselves; this tool does not assert a national average rental
 * price or a universal repair timeline, since both vary enormously by
 * location, vehicle class, and the nature of the claim. Repair days ships
 * with an editable placeholder so the tool is usable immediately, not
 * because 10 days is presented as a researched constant.
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
  max = 10_000,
  prefix = "$",
  suffix,
  step = 1,
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

export function RentalReimbursementCalculatorTool() {
  const [dailyRentalCost, setDailyRentalCost] = useState(0);
  const [repairDays, setRepairDays] = useState(10);
  const [currentDailyLimit, setCurrentDailyLimit] = useState(0);
  const [currentTotalLimit, setCurrentTotalLimit] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasDailyCost = dailyRentalCost > 0;
    const hasCurrentDailyLimit = currentDailyLimit > 0;
    const hasCurrentTotalLimit = currentTotalLimit > 0;
    const hasAnyCurrentLimit = hasCurrentDailyLimit || hasCurrentTotalLimit;

    const totalNeed = dailyRentalCost * repairDays;

    // What the daily cap alone would actually pay per day.
    const cappedDailyPayout = hasCurrentDailyLimit
      ? Math.min(dailyRentalCost, currentDailyLimit)
      : dailyRentalCost;
    const dailyShortfall = hasCurrentDailyLimit ? Math.max(0, dailyRentalCost - currentDailyLimit) : 0;

    // What the daily cap would pay out over the full repair window, before
    // applying the separate total/max limit.
    const payoutBeforeTotalCap = cappedDailyPayout * repairDays;

    // The total/max limit can cut the claim off before repairDays is
    // reached, independent of whether the daily limit is adequate.
    const daysCoveredByTotalLimit =
      hasCurrentTotalLimit && cappedDailyPayout > 0
        ? Math.floor(currentTotalLimit / cappedDailyPayout)
        : null;
    const totalLimitRunsOutEarly =
      hasCurrentTotalLimit && daysCoveredByTotalLimit !== null && daysCoveredByTotalLimit < repairDays;

    const projectedPayout = hasCurrentTotalLimit
      ? Math.min(payoutBeforeTotalCap, currentTotalLimit)
      : payoutBeforeTotalCap;

    const totalShortfall = hasAnyCurrentLimit ? Math.max(0, totalNeed - projectedPayout) : 0;

    // Suggested amounts to request, rounded to figures usually offered on a
    // quote form ($5 daily increments, $50 total increments). These are
    // suggestions to bring to an agent, not a guarantee any specific insurer
    // sells exactly this tier.
    const suggestedDailyLimit = hasDailyCost ? Math.ceil(dailyRentalCost / 5) * 5 : 0;
    const suggestedTotalLimit = hasDailyCost ? Math.ceil(totalNeed / 50) * 50 : 0;

    return {
      hasDailyCost,
      hasCurrentDailyLimit,
      hasCurrentTotalLimit,
      hasAnyCurrentLimit,
      totalNeed,
      dailyShortfall,
      daysCoveredByTotalLimit,
      totalLimitRunsOutEarly,
      projectedPayout,
      totalShortfall,
      suggestedDailyLimit,
      suggestedTotalLimit,
    };
  }, [dailyRentalCost, repairDays, currentDailyLimit, currentTotalLimit]);

  async function copyResult() {
    const lines = [
      "Rental reimbursement coverage check",
      `Estimated need: ${USD.format(dailyRentalCost)}/day for ${repairDays} days = ${USD.format(result.totalNeed)} total`,
      `Suggested limits to request: ${USD.format(result.suggestedDailyLimit)}/day, ${USD.format(result.suggestedTotalLimit)} total`,
      result.hasCurrentDailyLimit
        ? result.dailyShortfall > 0
          ? `Daily limit gap: your ${USD.format(currentDailyLimit)}/day limit falls short by ${USD.format(result.dailyShortfall)}/day`
          : `Daily limit: your ${USD.format(currentDailyLimit)}/day limit covers the estimated daily cost`
        : "Daily limit: not entered",
      result.hasCurrentTotalLimit
        ? result.totalLimitRunsOutEarly
          ? `Total limit gap: your ${USD.format(currentTotalLimit)} total limit runs out after about ${result.daysCoveredByTotalLimit} of ${repairDays} days`
          : `Total limit: your ${USD.format(currentTotalLimit)} total limit covers the full ${repairDays}-day estimate`
        : "Total limit: not entered",
      result.hasAnyCurrentLimit
        ? `Projected out-of-pocket shortfall: ${USD.format(result.totalShortfall)}`
        : "Enter your policy's current limits to see a projected shortfall",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/rental-reimbursement-calculator",
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
        <span className="label-mono text-slate-500">RENTAL REIMBURSEMENT COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Daily rental car cost in your area"
            hint="Look up a rate for a car similar to yours — a rental counter, Google, or a local rental site works"
            value={dailyRentalCost}
            onChange={setDailyRentalCost}
            max={500}
            step={1}
          />
          <NumberField
            label="Expected days your car would be in the shop"
            hint="10 is a common starting point — adjust it for your vehicle and repair shop"
            value={repairDays}
            onChange={setRepairDays}
            max={90}
            prefix=""
            suffix="days"
            step={1}
          />
          <div className="border-t border-hairline pt-4">
            <p className="text-[13px] font-medium text-slate-600">
              Optional: check against a policy you already have
            </p>
            <div className="mt-3 space-y-4">
              <NumberField
                label="Current policy's daily limit"
                hint="Leave at $0 if you don't have this coverage yet or don't know the limit"
                value={currentDailyLimit}
                onChange={setCurrentDailyLimit}
                max={500}
                step={1}
              />
              <NumberField
                label="Current policy's total/max limit"
                hint="The maximum the policy pays for the whole claim, separate from the daily cap"
                value={currentTotalLimit}
                onChange={setCurrentTotalLimit}
                max={10_000}
                step={10}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED RENTAL COST NEEDED</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalNeed)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(dailyRentalCost)}/day &times; {repairDays} day{repairDays === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Suggested daily limit" value={USD.format(result.suggestedDailyLimit)} tone="accent" />
            <Figure label="Suggested total limit" value={USD.format(result.suggestedTotalLimit)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Daily limit check</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasCurrentDailyLimit
                  ? "Enter your policy's current daily limit to check it against your estimated daily rental cost."
                  : result.dailyShortfall > 0
                    ? `Your ${USD.format(currentDailyLimit)}/day limit is ${USD.format(result.dailyShortfall)} short of the ${USD.format(dailyRentalCost)}/day you'd likely pay, meaning you'd cover that difference out of pocket every day of the rental.`
                    : `Your ${USD.format(currentDailyLimit)}/day limit covers the ${USD.format(dailyRentalCost)}/day estimate with no daily gap.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Total limit check</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasCurrentTotalLimit
                  ? "Enter your policy's total/max limit to check whether it runs out before repairs finish."
                  : result.totalLimitRunsOutEarly
                    ? `At the covered daily rate, your ${USD.format(currentTotalLimit)} total limit runs out after about ${result.daysCoveredByTotalLimit} of the ${repairDays} days you estimated, even if the daily limit itself is adequate.`
                    : `Your ${USD.format(currentTotalLimit)} total limit is enough to cover all ${repairDays} estimated days at the covered daily rate.`}
              </p>
            </div>
            {result.hasAnyCurrentLimit && (
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
                {result.totalShortfall > 0
                  ? `Projected out-of-pocket shortfall across the full claim: ${USD.format(result.totalShortfall)}.`
                  : "Based on these numbers, your current limits appear to cover the full estimated rental need."}
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
        Estimate only. This tool does the arithmetic on the numbers you enter; it does not know your
        actual rental market rate, your vehicle&apos;s real repair timeline, or any specific insurer&apos;s
        available limit tiers. Confirm exact pricing and available limits with a licensed agent before
        buying or changing coverage.
      </div>
    </div>
  );
}

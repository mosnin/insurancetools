"use client";

/**
 * Rental car reimbursement tracker.
 *
 * This is an in-claim tracking tool, not a pre-purchase sizing tool (that's
 * the separate Rental Reimbursement Coverage Calculator in the Auto
 * category). The audience here already has a rental reimbursement claim
 * open: they picked up a rental car days ago, the shop keeps pushing the
 * return date, and they want to know how many more days they can keep the
 * rental before their policy's own limit runs out.
 *
 * Rental reimbursement (also called "transportation expense" or "loss of
 * use" coverage) almost always caps payouts two separate ways at once: a
 * daily rate limit, and a total per-claim limit. Either one can run out
 * first. This tool tracks actual usage against both limits simultaneously,
 * using only the policy numbers and days-used figure the person enters
 * themselves. It never asserts a typical daily limit or typical claim
 * duration as fact.
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

const USD2 = new Intl.NumberFormat("en-US", {
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

export function RentalCarReimbursementTrackerCalculatorTool() {
  const [dailyLimit, setDailyLimit] = useState(30);
  const [perClaimLimit, setPerClaimLimit] = useState(900);
  const [daysUsed, setDaysUsed] = useState(0);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasDailyLimit = dailyLimit > 0;
    const hasPerClaimLimit = perClaimLimit > 0;
    const hasDaysUsed = daysUsed > 0;

    // Amount the daily limit alone would have paid out for the days already
    // used, before the separate per-claim ceiling is applied.
    const rawUsageFromDaily = hasDailyLimit ? dailyLimit * daysUsed : 0;

    // The per-claim total is the second, independent ceiling: it can be hit
    // before all of daysUsed is actually reimbursed at the daily rate.
    const usedSoFar = hasPerClaimLimit ? Math.min(rawUsageFromDaily, perClaimLimit) : rawUsageFromDaily;

    const remaining = hasPerClaimLimit ? Math.max(0, perClaimLimit - usedSoFar) : Infinity;

    // Whether the per-claim ceiling was already reached strictly before the
    // days-used count would otherwise suggest.
    const perClaimAlreadyExhausted = hasPerClaimLimit && hasDaysUsed && usedSoFar >= perClaimLimit && rawUsageFromDaily > perClaimLimit;

    // Full days of rental still payable within the remaining per-claim
    // balance, at the same daily rate. Zero when there's no daily limit to
    // divide by, or nothing left.
    const daysRemaining =
      hasDailyLimit && hasPerClaimLimit
        ? Math.max(0, Math.floor(remaining / dailyLimit))
        : null;

    // Any leftover dollars in the final partial day, smaller than a full
    // day's rate but still technically owed.
    const partialDayAmount =
      hasDailyLimit && hasPerClaimLimit && daysRemaining !== null
        ? Math.max(0, remaining - daysRemaining * dailyLimit)
        : 0;

    const percentUsed = hasPerClaimLimit ? Math.min(100, (usedSoFar / perClaimLimit) * 100) : 0;

    const isRunningLow = hasPerClaimLimit && daysRemaining !== null && daysRemaining <= 2 && remaining > 0;
    const isExhausted = hasPerClaimLimit && remaining <= 0 && hasDaysUsed;

    return {
      hasDailyLimit,
      hasPerClaimLimit,
      hasDaysUsed,
      rawUsageFromDaily,
      usedSoFar,
      remaining,
      perClaimAlreadyExhausted,
      daysRemaining,
      partialDayAmount,
      percentUsed,
      isRunningLow,
      isExhausted,
    };
  }, [dailyLimit, perClaimLimit, daysUsed]);

  async function copyResult() {
    const lines = [
      "Rental car reimbursement tracker",
      `Policy limits: ${USD.format(dailyLimit)}/day, ${USD.format(perClaimLimit)} per claim`,
      `Days used so far: ${daysUsed}`,
      `Amount used so far: ${USD.format(result.usedSoFar)}`,
      result.hasPerClaimLimit
        ? `Amount remaining: ${USD.format(result.remaining)}`
        : "Amount remaining: enter a per-claim limit to see this",
      result.daysRemaining !== null
        ? `Full days of rental still covered: ${result.daysRemaining}${
            result.partialDayAmount > 0 ? ` plus ${USD2.format(result.partialDayAmount)} toward one more partial day` : ""
          }`
        : "Days remaining: enter both a daily limit and a per-claim limit to see this",
      result.perClaimAlreadyExhausted
        ? "Note: the per-claim total ran out before the daily rate alone would suggest, based on days used entered."
        : "",
      "Estimate only, not a claims decision or insurance advice. insurancetools.org/tools/claims/rental-car-reimbursement-tracker-calculator",
    ].filter(Boolean);
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
        <span className="label-mono text-slate-500">RENTAL CAR REIMBURSEMENT TRACKER</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Your policy's daily rental limit"
            hint="Check your declarations page or ask your adjuster — this figure comes only from your own policy"
            value={dailyLimit}
            onChange={setDailyLimit}
            max={500}
            step={1}
          />
          <NumberField
            label="Your policy's per-claim total limit"
            hint="The separate, overall cap for this one claim — often shown right next to the daily limit"
            value={perClaimLimit}
            onChange={setPerClaimLimit}
            max={10_000}
            step={10}
          />
          <NumberField
            label="Days you've already had the rental"
            hint="Count from the day you picked up the rental car through today"
            value={daysUsed}
            onChange={setDaysUsed}
            max={365}
            prefix=""
            suffix="days"
            step={1}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              {result.hasPerClaimLimit ? "AMOUNT REMAINING ON YOUR CLAIM" : "AMOUNT USED SO FAR"}
            </p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.isExhausted ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {result.hasPerClaimLimit ? USD.format(result.remaining) : USD.format(result.usedSoFar)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.usedSoFar)} used of {result.hasPerClaimLimit ? USD.format(perClaimLimit) : "no entered per-claim limit"} so far
            </p>
          </div>

          {result.hasPerClaimLimit && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  result.percentUsed >= 100 ? "bg-amber-500" : result.percentUsed >= 75 ? "bg-amber-400" : "bg-blue-600"
                }`}
                style={{ width: `${result.percentUsed}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Days still covered"
              value={result.daysRemaining !== null ? `${result.daysRemaining}` : "—"}
              tone="accent"
            />
            <Figure label="Used so far" value={USD.format(result.usedSoFar)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">What this means for your rental</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasDailyLimit || !result.hasPerClaimLimit
                  ? "Enter both your daily limit and your per-claim total limit to see how many more days of rental your remaining balance covers."
                  : result.isExhausted
                    ? `Based on ${daysUsed} days used at ${USD.format(dailyLimit)}/day, your ${USD.format(perClaimLimit)} per-claim limit is already used up. Any further rental days would likely come out of your own pocket unless the limit changes.`
                    : result.daysRemaining === 0 && result.partialDayAmount > 0
                      ? `You have ${USD2.format(result.partialDayAmount)} left, which is less than a full day at your ${USD.format(dailyLimit)}/day rate. One more full day would likely exceed your remaining balance.`
                      : `At your ${USD.format(dailyLimit)}/day rate, your remaining ${USD.format(result.remaining)} covers about ${result.daysRemaining} more full day${result.daysRemaining === 1 ? "" : "s"} of rental${result.partialDayAmount > 0 ? ` plus ${USD2.format(result.partialDayAmount)} toward one additional partial day` : ""}.`}
              </p>
            </div>
            {result.perClaimAlreadyExhausted && (
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
                Your per-claim total limit ran out before the daily rate alone would suggest. This is the
                two-part limit structure working as designed: a healthy daily limit does not guarantee a
                healthy total limit.
              </div>
            )}
            {result.isRunningLow && !result.isExhausted && (
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
                You&apos;re within {result.daysRemaining} day{result.daysRemaining === 1 ? "" : "s"} of your
                per-claim limit. If repairs are running long, this is a good time to call your adjuster
                about the timeline before you&apos;re covering the rental yourself.
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
        Estimate only. This tracker does arithmetic on the daily limit, per-claim limit, and days used
        that you enter; it does not know your actual policy language, your claim number, or your
        insurer&apos;s specific rules for extensions or exceptions. Confirm your remaining balance directly
        with your adjuster before deciding whether to keep or return a rental car.
      </div>
    </div>
  );
}

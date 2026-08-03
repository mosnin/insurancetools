"use client";

/**
 * Business interruption CLAIM calculator (post-loss).
 *
 * This is deliberately NOT the pre-loss sizing tool at
 * /tools/business/business-interruption-calculator, which estimates how
 * much coverage a business owner should request before a loss happens using
 * assumed monthly averages. This tool instead reconstructs an ACTUAL claim
 * amount after a covered loss has already occurred (or is far enough along
 * that the outage period is known), using the business's own real or
 * estimated lost revenue for that specific outage window.
 *
 * The math: a standard business income claim reimburses the net income the
 * business lost plus the normal fixed operating expenses that kept running
 * during the outage (rent, continuing payroll, loan payments, and similar).
 * Those continuing expenses are not an addition on top of lost revenue —
 * they are part of what lost revenue already represents, since "lost
 * revenue" is money the business would have collected and then used, in
 * part, to pay exactly those bills. The one adjustment insurers do apply on
 * top is subtracting any expenses the business avoided or saved specifically
 * because it was shut down (reduced utility usage, temporary staff let go,
 * paused subscriptions), since the business never actually incurred those
 * costs and reimbursing them would overpay the claim.
 *
 *   Claim amount = lost revenue during the outage − saved/avoided expenses
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
  step?: number;
  suffix?: string;
}

function NumberField({ label, hint, value, onChange, max = 10_000_000, step = 100, suffix }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        {!suffix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            $
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
            suffix ? "pl-3 pr-16" : "pl-7 pr-3"
          } text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function BusinessInterruptionClaimCalculatorTool() {
  const [lostRevenue, setLostRevenue] = useState(90_000);
  const [continuingExpenses, setContinuingExpenses] = useState(22_000);
  const [savedExpenses, setSavedExpenses] = useState(6_000);
  const [extraExpense, setExtraExpense] = useState(4_000);
  const [outageDays, setOutageDays] = useState(45);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const netClaim = Math.max(0, lostRevenue - savedExpenses);
    const totalClaim = netClaim + extraExpense;
    const savedPct = lostRevenue > 0 ? (savedExpenses / lostRevenue) * 100 : 0;
    const continuingPct = lostRevenue > 0 ? (continuingExpenses / lostRevenue) * 100 : 0;

    const hasInputs = lostRevenue > 0;
    const noSavings = savedExpenses === 0 && lostRevenue > 0;
    const highSavings = savedPct > 40 && lostRevenue > 0;
    const continuingExceedsRevenue = continuingExpenses > lostRevenue && lostRevenue > 0;
    const dailyClaim = outageDays > 0 ? totalClaim / outageDays : 0;

    return {
      netClaim,
      totalClaim,
      savedPct,
      continuingPct,
      hasInputs,
      noSavings,
      highSavings,
      continuingExceedsRevenue,
      dailyClaim,
    };
  }, [lostRevenue, continuingExpenses, savedExpenses, extraExpense, outageDays]);

  async function copyResult() {
    const lines = [
      "Business interruption claim estimate (post-loss)",
      `Lost revenue during outage: ${USD.format(lostRevenue)}`,
      `Continuing normal operating expenses during outage (reference only, already inside lost revenue): ${USD.format(continuingExpenses)}`,
      `Saved / avoided expenses during outage: ${USD.format(savedExpenses)}`,
      `Extra expense (temporary space, expediting, etc.): ${USD.format(extraExpense)}`,
      `Net business income claim: ${USD.format(result.netClaim)}`,
      `Estimated total claim (business income + extra expense): ${USD.format(result.totalClaim)}`,
      `Outage length: ${outageDays} day${outageDays === 1 ? "" : "s"}`,
      "This is a planning estimate built from figures you entered, not a filed claim, adjuster determination, or guaranteed payout.",
      "insurancetools.org/tools/claims/business-interruption-claim-calculator",
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
        <span className="label-mono text-slate-500">BUSINESS INTERRUPTION CLAIM CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Lost revenue during the outage"
            hint="What you actually collected minus what a comparable period (last year, or a similar nearby period) would have brought in — from your own records, not an estimate this tool supplies"
            value={lostRevenue}
            onChange={setLostRevenue}
          />
          <NumberField
            label="Continuing normal operating expenses"
            hint="Rent, loan payments, payroll you kept paying — reference only, already counted inside lost revenue, not added separately"
            value={continuingExpenses}
            onChange={setContinuingExpenses}
          />
          <NumberField
            label="Saved or avoided expenses"
            hint="Costs you did NOT pay because you were shut down: reduced utilities, laid-off hourly staff, paused subscriptions"
            value={savedExpenses}
            onChange={setSavedExpenses}
          />
          <NumberField
            label="Extra expense incurred"
            hint="Costs paid specifically to reduce the shutdown or keep operating — temporary space, expedited shipping, a backup site"
            value={extraExpense}
            onChange={setExtraExpense}
          />
          <NumberField
            label="Length of the outage"
            hint="Calendar days from the loss until operations were reasonably back to normal (the period of restoration)"
            value={outageDays}
            onChange={setOutageDays}
            max={730}
            step={1}
            suffix="days"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED TOTAL CLAIM</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalClaim)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.netClaim)} net business income + {USD.format(extraExpense)} extra expense
            </p>
          </div>

          {result.continuingExceedsRevenue && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Your continuing expenses ({USD.format(continuingExpenses)}) are higher than your lost
              revenue ({USD.format(lostRevenue)}). That can be real for a business running near or below
              breakeven, but double-check the two figures — continuing expenses should be a subset of
              what lost revenue would have covered, not a separate number that exceeds it.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Lost revenue" value={USD.format(lostRevenue)} />
            <Figure label="Saved expenses" value={USD.format(savedExpenses)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Saved expenses check</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasInputs
                  ? "Enter your lost revenue to see this check."
                  : result.noSavings
                    ? "You've entered $0 in saved expenses. Most shutdowns avoid at least some cost — reduced utility usage, fewer hourly staff hours, paused software or supply orders. Review your outage-period expenses again before assuming nothing was saved."
                    : result.highSavings
                      ? `Saved expenses equal ${Math.round(result.savedPct)}% of lost revenue, which is a large share. Confirm each saved item was actually avoided (not simply deferred to later) before submitting a claim with this big an offset.`
                      : `Saved expenses equal ${Math.round(result.savedPct)}% of lost revenue, a moderate offset. Keep records showing exactly which costs were reduced and by how much.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Continuing expenses reminder</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Continuing expenses equal {result.hasInputs ? `${Math.round(result.continuingPct)}%` : "a portion"}{" "}
                of lost revenue in your numbers. They are shown here for your own documentation, not added
                a second time into the claim total — business income coverage reimburses lost net income
                plus the fixed costs baked into that lost revenue, and double-counting them is the single
                most common overstatement in a self-prepared claim worksheet.
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
        Estimate only. This tool reconstructs a post-loss business income claim from figures you supply
        about an outage that has happened or is underway; it is not a filed claim, an adjuster&apos;s
        determination, or a guaranteed payout. Real claims are typically supported by financial
        statements, tax returns, and point-of-sale records for the loss period, and larger or disputed
        claims often involve a forensic accountant retained by the policyholder, the insurer, or both.
        Confirm your policy&apos;s period of restoration, any coinsurance requirement, and documentation
        standards with your insurer, a public adjuster, or an attorney before relying on this number.
      </div>
    </div>
  );
}

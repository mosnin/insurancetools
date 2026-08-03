"use client";

/**
 * Additional living expenses (ALE) / loss of use calculator for renters.
 *
 * The mechanic is the same one that drives a homeowner's ALE claim: a
 * renters policy's loss-of-use coverage reimburses the *increase* in living
 * costs while a covered loss (fire, burst pipe, etc.) makes the rented unit
 * temporarily uninhabitable, not the tenant's normal cost of living. But a
 * renter's math has one nuance a homeowner's doesn't share — a mortgage
 * simply doesn't stop while a house is rebuilt, while a lease may or may not
 * release the tenant from rent during a displacement. That obligation
 * depends on the lease terms and the state's landlord-tenant law, so this
 * tool asks about it directly and shows it as its own line rather than
 * folding it into the ALE estimate or guessing an answer for the user.
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
          max={365}
          step={5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 365) : 0;
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

export function AdditionalLivingExpensesRentersCalculatorTool() {
  const [nightlyRate, setNightlyRate] = useState(0);
  const [displacementDays, setDisplacementDays] = useState(21);
  const [extraDailyCosts, setExtraDailyCosts] = useState(0);
  const [rentStillDue, setRentStillDue] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const dailyTotal = nightlyRate + extraDailyCosts;
    const totalALENeed = dailyTotal * displacementDays;

    const hasLimit = currentLimit > 0;
    const shortfall = hasLimit ? Math.max(0, totalALENeed - currentLimit) : 0;
    const surplus = hasLimit ? Math.max(0, currentLimit - totalALENeed) : 0;
    const daysLimitWouldCover =
      hasLimit && dailyTotal > 0 ? Math.floor(currentLimit / dailyTotal) : null;

    const owesRentWhileDisplaced = rentStillDue > 0;
    const proratedRent = owesRentWhileDisplaced ? (rentStillDue / 30) * displacementDays : 0;
    const totalOutOfPocketExposure = totalALENeed + proratedRent;

    return {
      dailyTotal,
      totalALENeed,
      hasLimit,
      shortfall,
      surplus,
      daysLimitWouldCover,
      owesRentWhileDisplaced,
      proratedRent,
      totalOutOfPocketExposure,
    };
  }, [nightlyRate, displacementDays, extraDailyCosts, rentStillDue, currentLimit]);

  async function copyResult() {
    const lines = [
      "Additional living expenses (ALE) estimate for renters",
      `Temporary housing cost: ${USD.format(nightlyRate)}/night`,
      `Extra daily costs while displaced: ${USD.format(extraDailyCosts)}/day`,
      `Estimated displacement length: ${displacementDays} days`,
      `Estimated ALE / loss-of-use need: ${USD.format(result.totalALENeed)}`,
      result.hasLimit
        ? result.shortfall > 0
          ? `Current ALE limit of ${USD.format(currentLimit)} falls short by ${USD.format(result.shortfall)} for this scenario`
          : `Current ALE limit of ${USD.format(currentLimit)} covers this scenario with ${USD.format(result.surplus)} to spare`
        : "Enter your current ALE/loss-of-use limit to compare it against this estimate",
      result.owesRentWhileDisplaced
        ? `Rent still owed under the lease during displacement (prorated): about ${USD.format(result.proratedRent)}, on top of ALE — verify against your lease and local tenant law`
        : "No continuing rent obligation entered",
      "Estimate only, not a quote, legal advice, or insurance advice. insurancetools.org/tools/renters/additional-living-expenses-renters-calculator",
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
        <span className="label-mono text-slate-500">ALE CALCULATOR FOR RENTERS</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Temporary housing cost"
            hint="What a nearby hotel, extended-stay, or short-term rental runs per night — check local listings, this tool doesn't guess it for you"
            value={nightlyRate}
            onChange={setNightlyRate}
          />
          <DaysField
            label="Estimated displacement length"
            hint="Adjustable — 21 days is only an illustrative starting point for a repair, not a prediction for yours"
            value={displacementDays}
            onChange={setDisplacementDays}
          />
          <DollarField
            label="Extra daily costs while displaced"
            hint="Pet boarding, extra commute mileage or transit, laundry, dining-out difference — combined, above your normal spending"
            value={extraDailyCosts}
            onChange={setExtraDailyCosts}
          />
          <DollarField
            label="Monthly rent you'd still owe during displacement"
            hint="Only if your lease keeps you on the hook for rent while your unit is uninhabitable — see the lease nuance below. Leave at $0 if your obligation pauses or the landlord waives it."
            value={rentStillDue}
            onChange={setRentStillDue}
            max={10_000}
            step={25}
          />
          <DollarField
            label="Your current ALE / loss-of-use limit (optional)"
            hint="Find this on your renters policy declarations page, often labeled 'Loss of Use' or 'Coverage D'"
            value={currentLimit}
            onChange={setCurrentLimit}
            max={100_000}
            step={250}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED ALE / LOSS-OF-USE NEED</p>
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
                ? `Your current ${USD.format(currentLimit)} limit falls short of this scenario by ${USD.format(result.shortfall)}. At ${USD.format(result.dailyTotal)}/day, that limit would cover about ${result.daysLimitWouldCover} days, not ${displacementDays}.`
                : `Your current ${USD.format(currentLimit)} limit covers this scenario with ${USD.format(result.surplus)} to spare, based on ${displacementDays} days at ${USD.format(result.dailyTotal)}/day.`}
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

          {result.owesRentWhileDisplaced && (
            <div className="border-t border-hairline pt-4">
              <p className="text-xs font-semibold text-slate-700">Rent obligation during displacement</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Based on {USD.format(rentStillDue)}/month, you may still owe roughly{" "}
                {USD.format(result.proratedRent)} in rent across this displacement, separate from ALE.
                That would put your total out-of-pocket exposure — temporary housing plus rent — around{" "}
                {USD.format(result.totalOutOfPocketExposure)}. ALE coverage reimburses the temporary
                housing increase, not a rent payment you may still owe your landlord under the lease.
              </p>
            </div>
          )}

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Why rent might not stop</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Whether a lease releases a tenant from rent when a unit becomes uninhabitable depends on
              the lease&apos;s own terms and the landlord-tenant law in that specific state — it is not the
              same answer everywhere. This tool cannot look up your lease or your state&apos;s rule for you.
              Review your lease and check with your state or local tenant rights organization before
              assuming either way.
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
        not know your actual policy language, your insurer&apos;s ALE sub-limit or time cap, local hotel or
        rental rates, your specific lease terms, or your state&apos;s landlord-tenant law. Confirm your exact
        loss-of-use limit on your declarations page, review your lease&apos;s habitability and rent-abatement
        language, and talk to your agent, adjuster, or a local tenant rights organization before relying
        on this figure during an actual claim.
      </div>
    </div>
  );
}

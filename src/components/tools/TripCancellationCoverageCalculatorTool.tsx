"use client";

/**
 * Trip cancellation insurance calculator.
 *
 * This is deliberately not a probability model. No general, evidence-backed
 * figure exists for "how often trips get cancelled," and publishing one
 * would be exactly the kind of fabricated statistic the rest of this site
 * avoids. Instead the tool frames trip cancellation coverage for what it
 * actually is: a one-time risk-transfer decision. It separates the portion
 * of a trip that is genuinely non-refundable (what you would actually lose
 * if you had to cancel today) from the portion that is refundable anyway,
 * then compares the quoted premium against that specific at-risk amount so
 * the user can judge the trade for themselves.
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

const PERCENT = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
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

export function TripCancellationCoverageCalculatorTool() {
  const [totalTripCost, setTotalTripCost] = useState(4_000);
  const [nonRefundableCost, setNonRefundableCost] = useState(3_200);
  const [premium, setPremium] = useState(220);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasTripCost = totalTripCost > 0;
    const atRisk = hasTripCost ? Math.min(nonRefundableCost, totalTripCost) : 0;
    const refundable = hasTripCost ? Math.max(0, totalTripCost - atRisk) : 0;
    const hasPremium = premium > 0;

    const pctOfTrip = hasTripCost ? (premium / totalTripCost) * 100 : 0;
    const pctOfAtRisk = atRisk > 0 ? (premium / atRisk) * 100 : 0;
    const atRiskShare = hasTripCost ? atRisk / totalTripCost : 0;
    const protectionRatio = hasPremium ? atRisk / premium : 0;

    // A simple, non-probabilistic band for how the premium compares to what
    // it is protecting, so the visible copy line doesn't overstate what a
    // single ratio can tell someone.
    let band: "low" | "moderate" | "high" = "moderate";
    if (hasPremium && atRisk > 0) {
      if (pctOfAtRisk < 4) band = "low";
      else if (pctOfAtRisk > 10) band = "high";
    }

    return { hasTripCost, atRisk, refundable, hasPremium, pctOfTrip, pctOfAtRisk, atRiskShare, protectionRatio, band };
  }, [totalTripCost, nonRefundableCost, premium]);

  async function copyResult() {
    const lines = [
      "Trip cancellation insurance calculation",
      `Non-refundable trip cost at risk: ${USD.format(result.atRisk)} of ${USD.format(totalTripCost)} total`,
      `Quoted premium: ${USD.format(premium)}`,
      result.hasPremium && result.atRisk > 0
        ? `That premium is ${PERCENT.format(result.pctOfAtRisk / 100)} of the amount you'd lose, or roughly ${USD.format(result.protectionRatio)} of at-risk trip cost protected per $1 of premium.`
        : "Enter your non-refundable cost and quoted premium to see the comparison.",
      "This is a risk-transfer comparison, not a probability of cancellation. Not a quote or insurance advice. insurancetools.org/tools/travel/trip-cancellation-coverage-calculator",
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
        <span className="label-mono text-slate-500">TRIP CANCELLATION INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Total trip cost"
            hint="Everything you've paid or will pay: flights, lodging, tours, deposits"
            value={totalTripCost}
            onChange={setTotalTripCost}
          />
          <NumberField
            label="Non-refundable portion"
            hint="What you'd actually lose if you cancelled today — some deposits are refundable, some aren't"
            value={nonRefundableCost}
            onChange={setNonRefundableCost}
            max={totalTripCost || 1_000_000}
          />
          <NumberField
            label="Quoted trip cancellation premium"
            hint="The price of the policy you're comparing, not the trip itself"
            value={premium}
            onChange={setPremium}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">NON-REFUNDABLE AMOUNT AT RISK</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.atRisk)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasTripCost
                ? `${PERCENT.format(result.atRiskShare)} of your ${USD.format(totalTripCost)} trip cost. The remaining ${USD.format(result.refundable)} is refundable on its own, with or without a policy.`
                : "Enter a total trip cost to see the split."}
            </p>
          </div>

          {result.hasPremium && result.atRisk > 0 && (
            <div
              className={`rounded-lg border px-3.5 py-3 text-xs ${
                result.band === "high"
                  ? "border-amber-100 bg-amber-50 text-amber-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
              }`}
            >
              This policy costs {PERCENT.format(result.pctOfAtRisk / 100)} of the {USD.format(result.atRisk)} you
              stand to lose if you have to cancel for a covered reason. The question isn&apos;t how likely that is
              &mdash; it&apos;s whether paying {USD.format(premium)} now to avoid a possible {USD.format(result.atRisk)}{" "}
              loss later is worth it for your own risk tolerance and budget.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Premium vs. trip cost"
              value={result.hasTripCost && result.hasPremium ? PERCENT.format(result.pctOfTrip / 100) : "—"}
            />
            <Figure
              label="Premium vs. at-risk cost"
              value={result.atRisk > 0 && result.hasPremium ? PERCENT.format(result.pctOfAtRisk / 100) : "—"}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Protection per premium dollar</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasPremium
                  ? "Enter a quoted premium to see how much at-risk cost it covers per dollar spent."
                  : result.atRisk <= 0
                    ? "Enter a non-refundable cost above $0 to compare it against the premium."
                    : `Roughly ${USD.format(result.protectionRatio)} of non-refundable trip cost is protected for every $1 of premium.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Does this cover a simple change of mind?</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                No. Standard trip cancellation coverage only pays out for the covered reasons listed in the
                policy, such as a documented illness, injury, or a death in the family. Cancelling because
                you changed your mind, found a cheaper trip, or no longer want to go requires a &ldquo;cancel
                for any reason&rdquo; (CFAR) upgrade, purchased separately and at an added cost.
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
        Estimate only. This tool compares a quoted premium against the trip cost you enter; it does not know
        which reasons your specific policy covers, whether your destination or trip type is eligible, or how
        your insurer defines a covered event. There is no reliable general figure for how often any given
        trip gets cancelled, so this calculator deliberately does not estimate one. Read the policy&apos;s
        list of covered reasons and confirm eligibility with the issuer or a licensed travel insurance agent
        before buying.
      </div>
    </div>
  );
}

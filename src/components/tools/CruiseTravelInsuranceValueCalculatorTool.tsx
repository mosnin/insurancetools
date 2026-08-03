"use client";

/**
 * Cruise travel insurance calculator.
 *
 * Cruise vacations carry financial exposure that generic trip-cancellation
 * math doesn't fully capture: a missed embarkation because a connecting
 * flight was delayed, a day or two spent quarantined in your cabin by the
 * ship's own medical staff, or an itinerary that skips a port you booked the
 * trip around. This tool keeps the same non-refundable-fare-at-risk
 * calculation used across the site's trip-cancellation tooling, then adds a
 * cruise-specific checklist so the user knows exactly which named coverage
 * features to look for in a policy, rather than treating every travel
 * insurance policy as if it automatically includes them.
 *
 * It never fabricates a payout table for missed port, cabin confinement, or
 * itinerary change coverage, since actual benefit amounts vary by insurer
 * and by plan tier. It only flags relevance and tells the user what to
 * confirm before buying.
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

interface FareTier {
  label: string;
  detail: string;
}

function fareTierFor(fare: number): FareTier {
  if (fare < 1000) {
    return {
      label: "Lower financial exposure",
      detail: "A cancellation would still sting, but many cruisers in this range self-insure the fare itself and buy insurance mainly for medical and evacuation coverage.",
    };
  }
  if (fare < 4000) {
    return {
      label: "Moderate financial exposure",
      detail: "This is the range where most cruisers find trip cancellation coverage worth its cost relative to what's actually at risk.",
    };
  }
  return {
    label: "High financial exposure",
    detail: "At this fare level, losing the trip cost outright would be a meaningful financial hit, which is exactly the scenario trip cancellation coverage is built for.",
  };
}

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function DollarField({ label, hint, value, onChange, max = 100_000 }: DollarFieldProps) {
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
          step={50}
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
          min={1}
          max={60}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 60) : 1;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          days
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface ScenarioToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ScenarioToggle({ label, description, checked, onChange }: ScenarioToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3.5 py-3 transition-colors hover:border-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      <span>
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{description}</span>
      </span>
    </label>
  );
}

interface ChecklistItem {
  key: string;
  featureName: string;
  relevant: boolean;
  note: string;
}

export function CruiseTravelInsuranceValueCalculatorTool() {
  const [fare, setFare] = useState(1800);
  const [days, setDays] = useState(7);
  const [tightConnection, setTightConnection] = useState(false);
  const [itineraryConcern, setItineraryConcern] = useState(true);
  const [healthConcern, setHealthConcern] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const perDayValue = days > 0 ? fare / days : 0;
    const tier = fareTierFor(fare);

    const checklist: ChecklistItem[] = [
      {
        key: "missed-port",
        featureName: "Missed connection / missed port coverage",
        relevant: tightConnection,
        note: tightConnection
          ? "You flagged a tight connection to embarkation, which is the exact situation this coverage addresses: a covered delay causes you to miss the ship or a port, and the policy responds to that specific gap."
          : "Less of a priority based on your answer, but still worth checking if your travel plans to the port change.",
      },
      {
        key: "itinerary-change",
        featureName: "Itinerary change coverage",
        relevant: itineraryConcern,
        note: itineraryConcern
          ? "You said a changed or skipped port would matter to you, so confirm the policy addresses itinerary changes specifically, since cruise lines can and do alter routes for weather, mechanical, or safety reasons."
          : "Lower priority based on your answer, though most cruisers still want to know how a policy treats a skipped port.",
      },
      {
        key: "cabin-confinement",
        featureName: "Cabin confinement coverage",
        relevant: healthConcern,
        note: healthConcern
          ? "You flagged concern about getting sick onboard, so look specifically for cabin confinement coverage: a real, documented benefit some cruise-specific policies pay if the ship's own medical staff quarantines you to your cabin."
          : "Lower priority based on your answer, but this is one of the most commonly overlooked cruise-specific benefits, so it's worth a quick check regardless.",
      },
    ];

    const relevantCount = checklist.filter((c) => c.relevant).length;

    return { perDayValue, tier, checklist, relevantCount };
  }, [fare, days, tightConnection, itineraryConcern, healthConcern]);

  async function copyResult() {
    const lines = [
      "Cruise travel insurance value check",
      `Non-refundable cruise fare at risk: ${USD.format(fare)} over ${days} day${days === 1 ? "" : "s"} (${USD.format(result.perDayValue)}/day)`,
      `Financial exposure tier: ${result.tier.label}`,
      "Cruise-specific coverage to check for:",
      ...result.checklist.map(
        (c) => `- ${c.featureName}: ${c.relevant ? "flagged as relevant to your trip" : "lower priority based on your answers"}`
      ),
      "Estimate and checklist only, not a quote or a guarantee any specific policy includes these features. insurancetools.org/tools/travel/cruise-travel-insurance-value-calculator",
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
        <span className="label-mono text-slate-500">CRUISE TRAVEL INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Non-refundable cruise fare"
            hint="The portion you'd lose today if you cancelled, not the full sticker price"
            value={fare}
            onChange={setFare}
          />
          <DaysField
            label="Cruise length"
            hint="Total nights or days onboard, port to port"
            value={days}
            onChange={setDays}
          />

          <div className="pt-1">
            <p className="text-[13px] font-medium text-slate-600 mb-2">
              Which of these apply to your trip?
            </p>
            <div className="space-y-2">
              <ScenarioToggle
                label="Tight connection to embarkation"
                description="Flying in the same day, or a short connection window to reach the port"
                checked={tightConnection}
                onChange={setTightConnection}
              />
              <ScenarioToggle
                label="A changed port would bother me"
                description="You'd want compensation if the ship skips or swaps a port on the itinerary"
                checked={itineraryConcern}
                onChange={setItineraryConcern}
              />
              <ScenarioToggle
                label="Concerned about getting sick onboard"
                description="Worried about being confined to your cabin by the ship's medical staff"
                checked={healthConcern}
                onChange={setHealthConcern}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">NON-REFUNDABLE FARE AT RISK</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(fare)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.perDayValue)} per day across {days} day{days === 1 ? "" : "s"} onboard
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            <span className="font-semibold">{result.tier.label}.</span> {result.tier.detail}
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">
              Cruise-specific coverage checklist ({result.relevantCount} of 3 flagged as relevant)
            </p>
            {result.checklist.map((item) => (
              <div key={item.key} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    item.relevant ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  {item.relevant && <Check className="h-2.5 w-2.5 text-white" />}
                </span>
                <span>
                  <span className="block text-xs font-semibold text-slate-800">{item.featureName}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{item.note}</span>
                </span>
              </div>
            ))}
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
        Estimate and checklist only. This tool does not calculate specific dollar payouts for missed
        port, itinerary change, or cabin confinement coverage, since actual benefit amounts vary by
        insurer and by plan. It flags which cruise-specific protections are worth checking for based on
        your answers. Confirm exact benefits, exclusions, and dollar limits in a policy&apos;s certificate
        of coverage, or with a licensed travel insurance agent, before buying.
      </div>
    </div>
  );
}

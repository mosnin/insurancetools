"use client";

/**
 * Commercial auto insurance calculator.
 *
 * This tool answers two separate questions, because they are genuinely
 * separate risks: (1) how much liability limit is reasonable for the
 * vehicles the business itself owns, and (2) whether the business has
 * "hired and non-owned auto" (HNOA) exposure — liability that exists even
 * when the business owns zero vehicles, because an employee drove their own
 * car, or the business rented/borrowed one, on business errands.
 *
 * The owned-fleet liability figure is a scaled commercial convention (a
 * $1,000,000 combined single limit as the common small-fleet baseline,
 * stepping up to $2,000,000 as fleet size grows, since more vehicles on the
 * road at once raises the odds of simultaneous claims), not a state-mandated
 * minimum — state minimums vary by state and by vehicle weight class, and
 * this tool deliberately does not attempt to look those up or state one as
 * fact.
 *
 * The HNOA question is intentionally framed as a yes/no coverage-gap flag,
 * not a dollar formula, because whether a business needs the endorsement at
 * all is the real decision point; once flagged, the actual limit rides on
 * top of whatever liability policy (commercial auto, BOP, or general
 * liability) the endorsement attaches to.
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

interface FleetTier {
  label: string;
  csl: number;
}

const TIER_SMALL: FleetTier = { label: "$1,000,000 CSL", csl: 1_000_000 };
const TIER_LARGE: FleetTier = { label: "$2,000,000 CSL", csl: 2_000_000 };

type YesNo = "yes" | "no";

interface CountFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CountField({ label, hint, value, onChange, max = 500 }: CountFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        step={1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const raw = Math.round(Number(e.target.value));
          const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
          onChange(clamped);
        }}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface ToggleFieldProps {
  label: string;
  hint?: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}

function ToggleField({ label, hint, value, onChange }: ToggleFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="mt-1.5 flex gap-2">
        {(["no", "yes"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
              value === option
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {option}
          </button>
        ))}
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "warn" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "warn" ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function CommercialAutoInsuranceCalculatorTool() {
  const [vehicleCount, setVehicleCount] = useState(2);
  const [employeesUsePersonalVehicles, setEmployeesUsePersonalVehicles] = useState<YesNo>("no");
  const [businessRentsVehicles, setBusinessRentsVehicles] = useState<YesNo>("no");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasFleet = vehicleCount > 0;

    let tier: FleetTier | null = null;
    let suggestExcess = false;
    if (hasFleet) {
      tier = vehicleCount >= 10 ? TIER_LARGE : TIER_SMALL;
      suggestExcess = vehicleCount >= 5;
    }

    const needsNonOwned = employeesUsePersonalVehicles === "yes";
    const needsHired = businessRentsVehicles === "yes";
    const needsHNOA = needsNonOwned || needsHired;
    const zeroFleetHNOAOnly = !hasFleet && needsHNOA;

    return { hasFleet, tier, suggestExcess, needsNonOwned, needsHired, needsHNOA, zeroFleetHNOAOnly };
  }, [vehicleCount, employeesUsePersonalVehicles, businessRentsVehicles]);

  async function copyResult() {
    const lines = [
      "Commercial auto insurance planning result",
      `Business-owned vehicles: ${vehicleCount}`,
      result.tier
        ? `Suggested liability limit: ${result.tier.label} (${USD.format(result.tier.csl)} combined single limit)${
            result.suggestExcess ? ", plus consider a commercial umbrella/excess policy given fleet size" : ""
          }`
        : "No business-owned vehicles entered, so no owned-fleet liability limit is suggested",
      result.needsHNOA
        ? `Hired and non-owned auto (HNOA) coverage: flagged as needed — ${
            result.needsNonOwned && result.needsHired
              ? "employees drive personal vehicles for work AND the business rents/borrows vehicles"
              : result.needsNonOwned
                ? "employees drive their own personal vehicles for work"
                : "the business rents or borrows vehicles for work"
          }`
        : "Hired and non-owned auto (HNOA) coverage: not flagged based on what you entered",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/business/commercial-auto-insurance-calculator",
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
        <span className="label-mono text-slate-500">COMMERCIAL AUTO INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <CountField
            label="Business-owned vehicles"
            hint="Cars, vans, or trucks titled to the business — enter 0 if the business owns none"
            value={vehicleCount}
            onChange={setVehicleCount}
          />
          <ToggleField
            label="Do employees drive their own personal vehicles for business purposes?"
            hint="Errands, client visits, or deliveries in an employee's own car — not their commute"
            value={employeesUsePersonalVehicles}
            onChange={setEmployeesUsePersonalVehicles}
          />
          <ToggleField
            label="Does the business rent, lease, or borrow vehicles for business use?"
            hint="E.g. a rented van for a delivery, or a rental car on a business trip"
            value={businessRentsVehicles}
            onChange={setBusinessRentsVehicles}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED OWNED-FLEET LIABILITY LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.tier ? result.tier.label : "Not applicable"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.tier
                ? `${USD.format(result.tier.csl)} combined single limit (bodily injury and property damage combined)`
                : "No business-owned vehicles entered above"}
            </p>
          </div>

          {result.tier && result.suggestExcess && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              With {vehicleCount} vehicles on the road, more of them can be involved in separate incidents at
              the same time. Many businesses this size pair their commercial auto policy with a commercial
              umbrella or excess liability policy rather than only raising the auto limit itself.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Vehicles entered" value={String(vehicleCount)} />
            <Figure
              label="HNOA needed?"
              value={result.needsHNOA ? "Yes" : "Not flagged"}
              tone={result.needsHNOA ? "warn" : "default"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Hired and non-owned auto (HNOA)</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.zeroFleetHNOAOnly
                  ? "This business owns no vehicles, but that doesn't mean there's no auto liability exposure. Because employees drive their own cars or the business rents vehicles for work, the business itself can still be named in a lawsuit after an at-fault accident during business use. HNOA coverage exists exactly for this gap and is typically added as an endorsement, not sold as a standalone owned-auto policy."
                  : result.needsHNOA
                    ? "Based on what you entered, this business has non-owned or hired auto exposure in addition to (or instead of) its owned fleet. Ask an agent to add an HNOA endorsement to the commercial auto, business owner's, or general liability policy that best fits."
                    : "Based on what you entered, no hired or non-owned exposure was flagged. Revisit this if employees start using personal vehicles for work, or the business begins renting or borrowing vehicles."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Why personal auto insurance isn&apos;t enough</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Standard personal auto policies typically exclude business use. An employee&apos;s own insurer
                can deny a claim, or limit it, when the accident happened while working, which is exactly the
                scenario hired and non-owned auto coverage is built to close for the business.
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
        Estimate only. The owned-fleet figure models a common commercial convention that scales modestly
        with fleet size; it is not a state-mandated minimum. Actual commercial auto minimums vary by state
        and by vehicle weight class, and heavier commercial vehicles operating across state lines can also
        trigger separate federal financial-responsibility rules. This tool does not know your state, your
        vehicles&apos; weight class, or your insurer&apos;s underwriting rules. Confirm exact requirements with your
        state&apos;s DMV or Department of Insurance and a licensed commercial insurance agent before buying or
        changing a policy.
      </div>
    </div>
  );
}

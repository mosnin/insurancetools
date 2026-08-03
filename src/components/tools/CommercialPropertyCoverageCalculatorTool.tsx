"use client";

/**
 * Commercial property insurance calculator.
 *
 * Builds a suggested commercial property coverage limit from the bottom up,
 * summing five categories a business owner enters directly: building
 * replacement cost (zero if the space is leased), business personal
 * property (furniture, fixtures, supplies), equipment and machinery,
 * inventory value, and tenant improvements/betterments (customizations made
 * to a leased space). No per-square-foot cost, industry average, or
 * inventory turnover figure is assumed or injected anywhere in this file —
 * every dollar in the total came from a field the user typed.
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
  disabled?: boolean;
}

function NumberField({ label, hint, value, onChange, max = 50_000_000, disabled = false }: NumberFieldProps) {
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
          step={500}
          value={Number.isFinite(value) ? value : 0}
          disabled={disabled}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
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

type Occupancy = "own" | "lease";

export function CommercialPropertyCoverageCalculatorTool() {
  const [occupancy, setOccupancy] = useState<Occupancy>("own");
  const [buildingValue, setBuildingValue] = useState(450_000);
  const [personalProperty, setPersonalProperty] = useState(85_000);
  const [equipmentValue, setEquipmentValue] = useState(60_000);
  const [inventoryValue, setInventoryValue] = useState(40_000);
  const [tenantImprovements, setTenantImprovements] = useState(0);
  const [coinsurancePct, setCoinsurancePct] = useState(80);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const effectiveBuilding = occupancy === "own" ? buildingValue : 0;
    const total =
      effectiveBuilding + personalProperty + equipmentValue + inventoryValue + tenantImprovements;

    const clampedCoinsurance = Math.min(Math.max(coinsurancePct, 1), 100) / 100;
    const coinsuranceTarget = total * clampedCoinsurance;

    const shares = [
      { label: "Building", value: effectiveBuilding },
      { label: "Business personal property", value: personalProperty },
      { label: "Equipment & machinery", value: equipmentValue },
      { label: "Inventory", value: inventoryValue },
      { label: "Tenant improvements & betterments", value: tenantImprovements },
    ].filter((s) => s.value > 0);

    const largestShare = shares.reduce(
      (max, s) => (s.value > max.value ? s : max),
      { label: "", value: 0 }
    );

    const hasTenantImprovementsRisk = occupancy === "lease" && tenantImprovements === 0;
    const hasNoBuildingButOwns = occupancy === "own" && buildingValue === 0;

    return {
      effectiveBuilding,
      total,
      coinsuranceTarget,
      clampedCoinsurance,
      shares,
      largestShare,
      hasTenantImprovementsRisk,
      hasNoBuildingButOwns,
    };
  }, [occupancy, buildingValue, personalProperty, equipmentValue, inventoryValue, tenantImprovements, coinsurancePct]);

  async function copyResult() {
    const lines = [
      "Commercial property insurance coverage estimate",
      `Occupancy: ${occupancy === "own" ? "Own the building" : "Lease the space"}`,
      `Building replacement cost: ${USD.format(result.effectiveBuilding)}`,
      `Business personal property: ${USD.format(personalProperty)}`,
      `Equipment & machinery: ${USD.format(equipmentValue)}`,
      `Inventory: ${USD.format(inventoryValue)}`,
      `Tenant improvements & betterments: ${USD.format(tenantImprovements)}`,
      `Suggested total coverage limit: ${USD.format(result.total)}`,
      `Coinsurance target at ${Math.round(result.clampedCoinsurance * 100)}%: ${USD.format(result.coinsuranceTarget)}`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/business/commercial-property-coverage-calculator",
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
        <span className="label-mono text-slate-500">COMMERCIAL PROPERTY INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <span className="block text-[13px] font-medium text-slate-600">Do you own or lease this location?</span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOccupancy("own")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  occupancy === "own"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                I own it
              </button>
              <button
                type="button"
                onClick={() => setOccupancy("lease")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  occupancy === "lease"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                I lease it
              </button>
            </div>
          </div>

          <NumberField
            label="Building replacement cost"
            hint={occupancy === "lease" ? "Not applicable — your landlord insures the building" : "Cost to rebuild at today's construction prices, not market value"}
            value={occupancy === "own" ? buildingValue : 0}
            onChange={setBuildingValue}
            disabled={occupancy === "lease"}
          />
          <NumberField
            label="Business personal property"
            hint="Furniture, fixtures, computers, and supplies you'd need to replace"
            value={personalProperty}
            onChange={setPersonalProperty}
          />
          <NumberField
            label="Equipment & machinery"
            hint="Tools, production equipment, or specialized machinery used to operate"
            value={equipmentValue}
            onChange={setEquipmentValue}
          />
          <NumberField
            label="Inventory value"
            hint="Use your typical peak-season level, not an average or off-season count"
            value={inventoryValue}
            onChange={setInventoryValue}
          />
          <NumberField
            label="Tenant improvements & betterments"
            hint="Build-outs, flooring, or fixtures you paid for in a leased space"
            value={tenantImprovements}
            onChange={setTenantImprovements}
          />
          <label className="block">
            <span className="block text-[13px] font-medium text-slate-600">Coinsurance requirement</span>
            <span className="relative mt-1.5 block">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={100}
                step={5}
                value={Number.isFinite(coinsurancePct) ? coinsurancePct : 80}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 100) : 80;
                  setCoinsurancePct(clamped);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                %
              </span>
            </span>
            <span className="mt-1 block text-xs text-slate-400">
              Check your policy — 80% and 90% are common clauses
            </span>
          </label>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED TOTAL COVERAGE LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.total)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Sum of every category you entered below, at replacement cost
            </p>
          </div>

          {result.hasTenantImprovementsRisk && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              You marked this space as leased but entered $0 for tenant improvements & betterments. If
              you&apos;ve paid for any build-out, flooring, lighting, or custom fixtures, your landlord&apos;s
              policy typically won&apos;t cover that investment — only yours can.
            </div>
          )}

          {result.hasNoBuildingButOwns && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              You marked this location as owned but entered $0 for building replacement cost. Add the
              cost to rebuild the structure, or switch to &ldquo;I lease it&rdquo; if that&apos;s not accurate.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Coinsurance target" value={USD.format(result.coinsuranceTarget)} tone="accent" />
            <Figure
              label="Largest exposure"
              value={result.largestShare.value > 0 ? result.largestShare.label : "—"}
            />
          </div>

          <div className="space-y-2 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Coverage breakdown</p>
            {result.shares.length === 0 ? (
              <p className="text-xs text-slate-500">Enter values on the left to see your breakdown.</p>
            ) : (
              <ul className="space-y-1.5">
                {result.shares.map((s) => (
                  <li key={s.label} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-600">{s.label}</span>
                    <span className="font-medium tabular-nums text-slate-900">{USD.format(s.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Why the coinsurance target matters</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Most commercial property policies include a coinsurance clause requiring you to insure at
              least {Math.round(result.clampedCoinsurance * 100)}% of the property&apos;s value. If you carry a
              limit below {USD.format(result.coinsuranceTarget)} and file a partial-loss claim, the insurer
              can apply a coinsurance penalty and pay out less than the actual damage, even if your limit
              is technically above the damage amount.
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
        Estimate only. This tool sums the replacement-cost figures you enter into a suggested coverage
        limit; it does not know your insurer&apos;s underwriting rules, your policy&apos;s exact coinsurance
        clause, or any state-specific commercial property requirement. Every figure above came from a
        field you typed — no per-square-foot cost, inventory average, or industry statistic was assumed.
        Confirm an exact limit and coinsurance percentage with a licensed commercial insurance agent
        before buying or changing a policy.
      </div>
    </div>
  );
}

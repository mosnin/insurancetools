"use client";

/**
 * Restaurant insurance calculator.
 *
 * Restaurant risk is genuinely multi-line, so unlike a generic small
 * business calculator this tool does not collapse everything into one
 * dollar figure. It reads four inputs specific to food service (seating
 * capacity, whether alcohol is served, walk-in cooler/freezer inventory
 * value, and kitchen equipment replacement value) and turns each one into a
 * distinct, sized coverage recommendation: general liability, liquor
 * liability (dram shop) when alcohol is served, spoilage coverage, equipment
 * breakdown coverage, and a business interruption estimate when monthly
 * revenue is entered.
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

interface CountFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CountField({ label, hint, value, onChange, max = 5_000 }: CountFieldProps) {
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
          const raw = Number(e.target.value);
          const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), max) : 0;
          onChange(clamped);
        }}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 10_000_000 }: NumberFieldProps) {
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
          step={100}
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

function ChecklistItem({
  title,
  status,
  statusTone,
  detail,
}: {
  title: string;
  status: string;
  statusTone: "core" | "flagged" | "clear" | "sized" | "muted";
  detail: string;
}) {
  const toneClasses: Record<typeof statusTone, string> = {
    core: "bg-blue-50 text-blue-700",
    flagged: "bg-amber-50 text-amber-700",
    clear: "bg-slate-100 text-slate-500",
    sized: "bg-emerald-50 text-emerald-700",
    muted: "bg-slate-100 text-slate-400",
  };

  return (
    <div className="border-t border-hairline pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-700">{title}</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${toneClasses[statusTone]}`}>
          {status}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
    </div>
  );
}

export function RestaurantInsuranceCalculatorTool() {
  const [seatingCapacity, setSeatingCapacity] = useState(80);
  const [servesAlcohol, setServesAlcohol] = useState(true);
  const [coolerInventoryValue, setCoolerInventoryValue] = useState(8_000);
  const [kitchenEquipmentValue, setKitchenEquipmentValue] = useState(45_000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(40_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const largeVenue = seatingCapacity > 100;
    const glOccurrence = largeVenue ? 2_000_000 : 1_000_000;
    const glAggregate = largeVenue ? 4_000_000 : 2_000_000;

    const hasCoolerValue = coolerInventoryValue > 0;
    const spoilageLimit = Math.ceil(coolerInventoryValue / 500) * 500;

    const hasEquipmentValue = kitchenEquipmentValue > 0;
    const equipmentBreakdownLimit = kitchenEquipmentValue;

    const hasRevenue = monthlyRevenue > 0;
    const biLow = monthlyRevenue * 3;
    const biMid = monthlyRevenue * 6;
    const biHigh = monthlyRevenue * 12;

    const linesFlagged = 2 + (servesAlcohol ? 1 : 0) + (hasCoolerValue ? 1 : 0) + (hasEquipmentValue ? 1 : 0) + (hasRevenue ? 1 : 0);

    return {
      largeVenue,
      glOccurrence,
      glAggregate,
      hasCoolerValue,
      spoilageLimit,
      hasEquipmentValue,
      equipmentBreakdownLimit,
      hasRevenue,
      biLow,
      biMid,
      biHigh,
      linesFlagged,
    };
  }, [seatingCapacity, servesAlcohol, coolerInventoryValue, kitchenEquipmentValue, monthlyRevenue]);

  async function copyResult() {
    const lines = [
      "Restaurant insurance coverage checklist",
      `General liability: ${USD.format(result.glOccurrence)} per occurrence / ${USD.format(result.glAggregate)} aggregate${result.largeVenue ? " (higher tier suggested for a larger dining room; ask about an umbrella or excess policy)" : ""}`,
      servesAlcohol
        ? "Liquor liability (dram shop): needed as a separate line — general liability typically excludes or heavily sublimits alcohol-related claims"
        : "Liquor liability (dram shop): not flagged, no alcohol service entered",
      result.hasCoolerValue
        ? `Spoilage coverage: size to roughly ${USD.format(result.spoilageLimit)} based on walk-in cooler/freezer inventory value`
        : "Spoilage coverage: enter your walk-in cooler/freezer inventory value to size this",
      result.hasEquipmentValue
        ? `Equipment breakdown coverage: size to roughly ${USD.format(result.equipmentBreakdownLimit)} based on kitchen equipment replacement value`
        : "Equipment breakdown coverage: enter your kitchen equipment replacement value to size this",
      result.hasRevenue
        ? `Business interruption: ballpark ${USD.format(result.biLow)} to ${USD.format(result.biHigh)} (roughly 3 to 12 months of revenue, midpoint ${USD.format(result.biMid)})`
        : "Business interruption: enter your average monthly revenue to estimate a limit",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/business/restaurant-insurance-calculator",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the
      // checklist stays fully visible on screen either way.
    }
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="label-mono text-slate-500">RESTAURANT INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <CountField
            label="Seating capacity"
            hint="Number of guest seats, dining room plus bar"
            value={seatingCapacity}
            onChange={setSeatingCapacity}
          />

          <div>
            <span className="block text-[13px] font-medium text-slate-600">Do you serve alcohol?</span>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setServesAlcohol(true)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  servesAlcohol
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
                aria-pressed={servesAlcohol}
              >
                Yes, beer/wine/liquor
              </button>
              <button
                type="button"
                onClick={() => setServesAlcohol(false)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  !servesAlcohol
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
                aria-pressed={!servesAlcohol}
              >
                No alcohol
              </button>
            </div>
          </div>

          <NumberField
            label="Walk-in cooler/freezer inventory value"
            hint="What it would cost to replace food currently stored"
            value={coolerInventoryValue}
            onChange={setCoolerInventoryValue}
          />
          <NumberField
            label="Kitchen equipment replacement value"
            hint="Ranges, hoods, fryers, dish machines, walk-in units"
            value={kitchenEquipmentValue}
            onChange={setKitchenEquipmentValue}
          />
          <NumberField
            label="Average monthly revenue"
            hint="Optional — used to estimate a business interruption limit"
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
          />
        </div>

        {/* Results */}
        <div className="space-y-3 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="label-mono text-slate-400">SUGGESTED COVERAGE CHECKLIST</p>
            <span className="label-mono text-slate-400">{result.linesFlagged} LINES</span>
          </div>

          <ChecklistItem
            title="General liability"
            status="Core"
            statusTone="core"
            detail={`${USD.format(result.glOccurrence)} per occurrence / ${USD.format(result.glAggregate)} aggregate is a common starting limit for a restaurant this size.${result.largeVenue ? " With over 100 seats, ask an agent about a higher tier or an umbrella policy for excess liability." : ""}`}
          />

          <ChecklistItem
            title="Liquor liability (dram shop)"
            status={servesAlcohol ? "Needed" : "Not flagged"}
            statusTone={servesAlcohol ? "flagged" : "clear"}
            detail={
              servesAlcohol
                ? "Since you serve alcohol, this needs to be its own line item. General liability policies commonly exclude alcohol-related bodily injury and property damage entirely, or cap it far below the base limit."
                : "You indicated no alcohol service, so dram shop exposure isn't flagged. Revisit this immediately if you add a beer, wine, or full liquor license."
            }
          />

          <ChecklistItem
            title="Spoilage coverage"
            status={result.hasCoolerValue ? `~${USD.format(result.spoilageLimit)}` : "Add value"}
            statusTone={result.hasCoolerValue ? "sized" : "muted"}
            detail={
              result.hasCoolerValue
                ? `Sized to your entered inventory value, rounded up to the nearest $500. This is what a mechanical breakdown or extended power outage could spoil in your walk-in cooler and freezer.`
                : "Enter your walk-in cooler/freezer inventory value to size this line."
            }
          />

          <ChecklistItem
            title="Equipment breakdown coverage"
            status={result.hasEquipmentValue ? `~${USD.format(result.equipmentBreakdownLimit)}` : "Add value"}
            statusTone={result.hasEquipmentValue ? "sized" : "muted"}
            detail={
              result.hasEquipmentValue
                ? "Sized to your entered kitchen equipment replacement value. This covers a mechanical or electrical failure in equipment like a hood, fryer, or compressor, which standard property coverage typically doesn't handle well."
                : "Enter your kitchen equipment replacement value to size this line."
            }
          />

          <ChecklistItem
            title="Business interruption"
            status={result.hasRevenue ? `${USD.format(result.biLow)}–${USD.format(result.biHigh)}` : "Add revenue"}
            statusTone={result.hasRevenue ? "sized" : "muted"}
            detail={
              result.hasRevenue
                ? `A ballpark range of 3 to 12 months of revenue, depending on how long it would realistically take to reopen. Midpoint estimate: ${USD.format(result.biMid)}.`
                : "Enter your average monthly revenue to estimate a limit that would replace lost income while you rebuild or relocate."
            }
          />

          <button
            type="button"
            onClick={copyResult}
            className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy result"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This checklist models common food-service coverage structures; it is not a quote,
        and it does not know your state&apos;s liquor licensing rules, your lease terms, or an
        insurer&apos;s underwriting requirements. Liquor liability and dram shop rules vary significantly by
        state — confirm requirements with your state&apos;s alcoholic beverage control authority, and
        confirm exact limits and pricing with a licensed commercial insurance agent before buying or
        changing a policy.
      </div>
    </div>
  );
}

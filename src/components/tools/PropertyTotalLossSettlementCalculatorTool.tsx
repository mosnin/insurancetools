"use client";

/**
 * Property total loss settlement calculator.
 *
 * Models the settlement math for a home or other structure that has been
 * declared a total loss (destroyed beyond reasonable repair by fire or
 * other catastrophic damage), which is a fundamentally different
 * calculation from a vehicle total loss:
 *
 * 1. Land is never destroyed, so a dwelling total loss payout is built
 *    entirely from the dwelling coverage limit (plus any extended
 *    replacement cost), never from the land's value. Homeowners routinely
 *    expect land value to be folded into the check and it isn't.
 * 2. Many (not all) homeowners policies include an extended or guaranteed
 *    replacement cost endorsement that pays a percentage above the stated
 *    dwelling limit when rebuilding costs run over. That percentage is
 *    entirely policy-specific, so this tool asks the user to enter their
 *    own policy's figure rather than assuming a standard rate.
 *
 * This does not reproduce any single insurer's actual claim worksheet. It
 * gives a homeowner a realistic estimate to compare an actual settlement
 * letter against. All math runs client-side; nothing typed here is sent
 * anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const USD0 = new Intl.NumberFormat("en-US", {
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
}

function NumberField({ label, hint, value, onChange, max = 5_000_000, step = 1_000 }: NumberFieldProps) {
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

interface PercentFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function PercentField({ label, hint, value, onChange, max = 100 }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function LineItem({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={`text-sm ${emphasis ? "font-semibold text-slate-900" : "text-slate-600"}`}>{label}</span>
      <span className={`tabular-nums text-sm ${emphasis ? "font-semibold text-slate-900" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

export function PropertyTotalLossSettlementCalculatorTool() {
  const [dwellingLimit, setDwellingLimit] = useState(320_000);
  const [extendedRcPercent, setExtendedRcPercent] = useState(0);
  const [landValue, setLandValue] = useState(90_000);
  const [deductible, setDeductible] = useState(2_500);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const extendedAmount = dwellingLimit * (extendedRcPercent / 100);
    const grossStructurePayout = dwellingLimit + extendedAmount;
    const deductibleApplied = Math.min(deductible, grossStructurePayout);
    const netSettlement = Math.max(0, grossStructurePayout - deductible);
    const deductibleExceedsPayout = deductible > grossStructurePayout;
    const hasExtendedRc = extendedRcPercent > 0;
    const totalPropertyValueForContext = netSettlement + landValue;

    return {
      extendedAmount,
      grossStructurePayout,
      deductibleApplied,
      netSettlement,
      deductibleExceedsPayout,
      hasExtendedRc,
      totalPropertyValueForContext,
    };
  }, [dwellingLimit, extendedRcPercent, landValue, deductible]);

  async function copyResult() {
    const lines = [
      "Property total loss settlement estimate",
      `Dwelling coverage limit: ${USD.format(dwellingLimit)}`,
      result.hasExtendedRc
        ? `+ Extended replacement cost (${extendedRcPercent}%): ${USD.format(result.extendedAmount)}`
        : "+ Extended replacement cost: not included",
      `− Deductible: −${USD.format(result.deductibleApplied)}`,
      `= Estimated structure settlement: ${USD.format(result.netSettlement)}`,
      `Land value (retained, not part of this payout): ${USD.format(landValue)}`,
      "Estimate only, not a settlement offer. insurancetools.org/tools/claims/property-total-loss-settlement-calculator",
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
        <span className="label-mono text-slate-500">PROPERTY TOTAL LOSS SETTLEMENT CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Dwelling coverage limit (Coverage A)"
            hint="The structure limit shown on your policy declarations page, not your home's market value"
            value={dwellingLimit}
            onChange={setDwellingLimit}
          />
          <PercentField
            label="Extended or guaranteed replacement cost, if any"
            hint="Enter your own policy's specific percentage. Leave at 0% if you don't have this endorsement — check your declarations page or ask your agent, since it varies by insurer and is never a standard figure"
            value={extendedRcPercent}
            onChange={setExtendedRcPercent}
          />
          <NumberField
            label="Land value"
            hint="Shown for context only. Land isn't destroyed in a total loss and isn't part of the dwelling payout below"
            value={landValue}
            onChange={setLandValue}
          />
          <NumberField
            label="Dwelling (Coverage A) deductible"
            hint="Your policy deductible, subtracted from the structure payout"
            value={deductible}
            onChange={setDeductible}
            max={50_000}
            step={250}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED STRUCTURE SETTLEMENT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD0.format(result.netSettlement)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Before any mortgage lender or lienholder is paid from the check
            </p>
          </div>

          {result.deductibleExceedsPayout && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your deductible is larger than the estimated gross structure payout, so this scenario nets to $0.
              Double-check the dwelling limit and any extended replacement cost your policy actually carries
              before assuming you&apos;d receive nothing.
            </div>
          )}

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            Land value of {USD.format(landValue)} is not included above. In a total loss, the land itself isn&apos;t
            damaged, so it isn&apos;t part of the dwelling settlement, it stays with you as the property owner.
          </div>

          <div className="space-y-0.5 border-t border-hairline pt-3">
            <LineItem label="Dwelling coverage limit" value={USD.format(dwellingLimit)} />
            <LineItem
              label={result.hasExtendedRc ? `+ Extended replacement cost (${extendedRcPercent}%)` : "+ Extended replacement cost"}
              value={result.hasExtendedRc ? USD.format(result.extendedAmount) : "Not included"}
            />
            <LineItem label="− Deductible" value={`−${USD.format(result.deductibleApplied)}`} />
            <div className="mt-1 border-t border-hairline pt-1.5">
              <LineItem label="= Estimated structure settlement" value={USD.format(result.netSettlement)} emphasis />
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
        Estimate only, not a settlement offer or insurance advice. This tool models the common structure of a
        dwelling total loss settlement; it does not know your policy&apos;s actual language, your state&apos;s specific
        claims-handling rules, or how your insurer determined its total loss threshold or replacement cost
        figure. If you have a mortgage, your lender is typically named on the settlement check and paid first
        from any proceeds. Compare this estimate against your insurer&apos;s written settlement explanation, and
        if the figures don&apos;t match, ask your adjuster to walk through their worksheet line by line.
      </div>
    </div>
  );
}

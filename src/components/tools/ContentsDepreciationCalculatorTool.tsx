"use client";

/**
 * Contents depreciation calculator.
 *
 * This is an itemized, multi-item CLAIM worksheet, not a coverage-planning
 * inventory (see HomeInventoryValueCalculatorTool for that use case). The
 * user adds one row per damaged or destroyed item with its replacement
 * cost, its age in years, and its useful life in years. Useful life varies
 * enormously by item type (a sofa and a laptop do not depreciate at the
 * same rate) and is never fabricated here as a lookup table; the user
 * supplies it per row, ideally from their insurer's depreciation schedule
 * or their own judgment about how long the item was expected to last.
 *
 * For each row the tool applies straight-line depreciation:
 *   depreciation = replacementCost x min(age / usefulLife, 1)
 *   ACV = replacementCost - depreciation
 *
 * The tool then sums replacement cost and ACV across every row to produce
 * a total RCV claim figure (if the policy pays replacement cost, generally
 * after repair or replacement receipts are submitted) and a total ACV
 * claim figure (what a straight-line depreciation method estimates the
 * damaged items were worth immediately before the loss).
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const USD_WHOLE = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const PERCENT = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

interface ClaimItem {
  id: string;
  name: string;
  replacementCost: number;
  ageYears: number;
  usefulLifeYears: number;
}

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `row-${nextId}-${Date.now()}`;
}

function seedItems(): ClaimItem[] {
  // Pre-seeded row placeholders only, so a blank worksheet doesn't feel
  // broken. Replacement cost starts at $0 so nothing is assumed about what
  // was damaged; the user edits every field or deletes the row before it
  // contributes anything to the totals. Useful life is left at a neutral
  // default the user is expected to change, never presented as a fact.
  return [
    { id: makeId(), name: "Sofa", replacementCost: 0, ageYears: 3, usefulLifeYears: 10 },
    { id: makeId(), name: "Refrigerator", replacementCost: 0, ageYears: 5, usefulLifeYears: 13 },
    { id: makeId(), name: "Laptop", replacementCost: 0, ageYears: 2, usefulLifeYears: 5 },
  ];
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </label>
  );
}

interface RowNumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function RowNumberField({ label, value, onChange, max = 1_000_000, step = 1, prefix, suffix }: RowNumberFieldProps) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <span className="relative block">
        {prefix && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
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
          className={`w-full rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            prefix ? "pl-6" : "pl-2"
          } ${suffix ? "pr-6" : "pr-2"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

export function ContentsDepreciationCalculatorTool() {
  const [items, setItems] = useState<ClaimItem[]>(() => seedItems());
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rows = items.map((item) => {
      const usefulLife = item.usefulLifeYears > 0 ? item.usefulLifeYears : 0;
      // Straight-line depreciation, clamped so an item can never depreciate
      // past its full replacement cost (a fully depreciated item still has
      // some claim value under most policies' ACV methodology, but this
      // tool floors it at zero rather than modeling salvage value, which
      // varies by insurer).
      const depreciationFraction = usefulLife > 0 ? Math.min(item.ageYears / usefulLife, 1) : 1;
      const depreciation = item.replacementCost * depreciationFraction;
      const acv = Math.max(0, item.replacementCost - depreciation);
      const isFullyDepreciated = depreciationFraction >= 1 && item.replacementCost > 0;
      const hasUsefulLife = usefulLife > 0;
      return { ...item, depreciation, depreciationFraction, acv, isFullyDepreciated, hasUsefulLife };
    });

    const validRows = rows.filter((row) => row.name.trim() !== "" && row.replacementCost > 0);
    const totalRCV = validRows.reduce((sum, row) => sum + row.replacementCost, 0);
    const totalACV = validRows.reduce((sum, row) => sum + row.acv, 0);
    const totalDepreciation = validRows.reduce((sum, row) => sum + row.depreciation, 0);
    const holdback = totalRCV - totalACV;
    const missingUsefulLife = rows.some((row) => row.name.trim() !== "" && row.replacementCost > 0 && !row.hasUsefulLife);

    return { rows, validRows, totalRCV, totalACV, totalDepreciation, holdback, missingUsefulLife };
  }, [items]);

  function addRow() {
    setItems((prev) => [
      ...prev,
      { id: makeId(), name: "", replacementCost: 0, ageYears: 1, usefulLifeYears: 10 },
    ]);
  }

  function removeRow(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateRow(id: string, patch: Partial<ClaimItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function copyResult() {
    const lines = [
      "Contents depreciation claim worksheet",
      "",
      ...result.validRows.map(
        (row) =>
          `${row.name}: replacement cost ${USD.format(row.replacementCost)}, ${row.ageYears}yr old / ${row.usefulLifeYears}yr useful life -> ${PERCENT.format(row.depreciationFraction)} depreciated, ACV ${USD.format(row.acv)}`
      ),
      "",
      `Total replacement cost (RCV): ${USD.format(result.totalRCV)}`,
      `Total actual cash value (ACV): ${USD.format(result.totalACV)}`,
      `Total depreciation held back: ${USD.format(result.totalDepreciation)}`,
      "Estimate only, based on straight-line depreciation and the values you entered. Not a claim decision or a guarantee of what an insurer will pay.",
      "insurancetools.org/tools/claims/contents-depreciation-calculator",
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
        <span className="label-mono text-slate-500">CONTENTS DEPRECIATION CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      {/* Running totals, pinned near the top so they update visibly as rows change */}
      <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2">
        <div className="border-b border-hairline bg-blue-50/60 px-5 py-4 sm:border-b-0 sm:px-6">
          <p className="label-mono text-blue-700">TOTAL ACV CLAIM VALUE</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
            {USD.format(result.totalACV)}
          </p>
          <p className="mt-1 text-xs text-slate-500">What straight-line depreciation estimates the damaged items were worth</p>
        </div>
        <div className="border-b border-hairline bg-slate-50 px-5 py-4 sm:border-b-0 sm:px-6">
          <p className="label-mono text-slate-500">TOTAL RCV CLAIM VALUE</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
            {USD.format(result.totalRCV)}
          </p>
          <p className="mt-1 text-xs text-slate-500">What a replacement-cost policy pays after replacement, minus any holdback</p>
        </div>
      </div>

      {/* Item rows */}
      <div className="bg-white p-5 sm:p-6">
        <div className="hidden grid-cols-[1fr_108px_84px_96px_100px_36px] gap-2 px-1 pb-2 sm:grid">
          <span className="label-mono text-slate-400">ITEM</span>
          <span className="label-mono text-slate-400">REPLACEMENT COST</span>
          <span className="label-mono text-slate-400">AGE (YR)</span>
          <span className="label-mono text-slate-400">USEFUL LIFE (YR)</span>
          <span className="label-mono text-right text-slate-400">ACV</span>
          <span aria-hidden="true" />
        </div>

        <div className="space-y-2.5">
          {result.rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-2 gap-2 rounded-lg border border-slate-100 p-2.5 sm:grid-cols-[1fr_108px_84px_96px_100px_36px] sm:items-center sm:border-0 sm:p-0"
            >
              <div className="col-span-2 sm:col-span-1">
                <TextField
                  label="Item name for row"
                  value={row.name}
                  placeholder="e.g. Living room sofa"
                  onChange={(value) => updateRow(row.id, { name: value })}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-400 sm:hidden">Replacement cost</span>
                <RowNumberField
                  label="Replacement cost"
                  value={row.replacementCost}
                  prefix="$"
                  step={10}
                  onChange={(value) => updateRow(row.id, { replacementCost: value })}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-400 sm:hidden">Age (years)</span>
                <RowNumberField
                  label="Age in years"
                  value={row.ageYears}
                  max={100}
                  suffix="yr"
                  onChange={(value) => updateRow(row.id, { ageYears: value })}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-400 sm:hidden">Useful life (years)</span>
                <RowNumberField
                  label="Useful life in years"
                  value={row.usefulLifeYears}
                  max={100}
                  suffix="yr"
                  onChange={(value) => updateRow(row.id, { usefulLifeYears: value })}
                />
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:pr-1">
                <span className="text-[11px] font-medium text-slate-400 sm:hidden">ACV</span>
                <span className="text-sm font-semibold tabular-nums text-slate-900">{USD.format(row.acv)}</span>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove ${row.name.trim() || "item"} row`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              {row.name.trim() !== "" && row.replacementCost > 0 && !row.hasUsefulLife && (
                <p className="col-span-2 text-xs font-medium text-amber-600 sm:col-span-6">
                  Enter a useful life above 0 years for this item, or its full replacement cost is treated as
                  depreciated.
                </p>
              )}
              {row.isFullyDepreciated && row.hasUsefulLife && (
                <p className="col-span-2 text-xs text-slate-400 sm:col-span-6">
                  This item has reached the useful life you entered, so it&apos;s shown at full depreciation
                  ($0 ACV). Many insurers still apply a minimum salvage value here; confirm with your adjuster.
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add item
        </button>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-hairline pt-4 sm:grid-cols-3">
          <div>
            <p className="label-mono text-slate-400">TOTAL RCV</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">{USD_WHOLE.format(result.totalRCV)}</p>
          </div>
          <div>
            <p className="label-mono text-slate-400">TOTAL ACV</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-blue-600">{USD_WHOLE.format(result.totalACV)}</p>
          </div>
          <div>
            <p className="label-mono text-slate-400">HOLDBACK</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">{USD_WHOLE.format(result.holdback)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
          <p className="text-xs text-slate-500">
            {result.validRows.length} {result.validRows.length === 1 ? "item" : "items"} counted toward the
            totals above
          </p>
          <button
            type="button"
            onClick={copyResult}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy itemized worksheet"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only, using straight-line depreciation on the replacement cost, age, and useful life you
        enter for each item. This tool does not know your policy&apos;s depreciation method, any minimum
        salvage floor your insurer applies, or the specific useful-life schedule your adjuster will use;
        useful life varies by item type and must be entered per row rather than assumed. Keep photos and
        receipts alongside this worksheet and confirm the actual depreciation method with your policy
        documents, your adjuster, or a licensed agent before relying on these figures in a claim.
      </div>
    </div>
  );
}

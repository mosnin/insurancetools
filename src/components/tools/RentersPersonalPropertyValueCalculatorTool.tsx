"use client";

/**
 * Renters personal property value calculator.
 *
 * This is a bottom-up itemized inventory, not a top-down rule-of-thumb
 * estimator: the renter adds one row per belonging with its own quantity and
 * per-item value, in whatever categories make sense to them (nothing is
 * pre-filled), and the running total is the sum of (quantity x value) across
 * every row. The result is framed around a specific renters-insurance
 * decision — what personal property limit to carry, and whether the limit
 * already on a policy is enough — rather than general household
 * record-keeping. A separate "consider scheduling" flag lets a renter mark
 * higher-value items (jewelry, certain electronics, musical instruments,
 * collectibles) that standard renters policies commonly cap with a special
 * sub-limit, so those items don't quietly disappear into the overall total.
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

interface BelongingRow {
  id: string;
  name: string;
  quantity: number;
  value: number;
  scheduleFlag: boolean;
}

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `row-${nextId}-${Date.now()}`;
}

function seedRows(): BelongingRow[] {
  // Placeholder row labels only, so the list doesn't open blank and
  // unfamiliar. Every value starts at $0 — nothing is assumed about what a
  // given renter owns or what it's worth. The renter renames, re-values, adds
  // to, or deletes every row before it contributes anything to the total.
  return [
    { id: makeId(), name: "Bed frame & mattress", quantity: 1, value: 0, scheduleFlag: false },
    { id: makeId(), name: "Laptop", quantity: 1, value: 0, scheduleFlag: false },
    { id: makeId(), name: "Kitchen cookware set", quantity: 1, value: 0, scheduleFlag: false },
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
}

function RowNumberField({ label, value, onChange, max = 500_000, step = 1, prefix }: RowNumberFieldProps) {
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
            prefix ? "pl-6 pr-2" : "px-2"
          }`}
        />
      </span>
    </label>
  );
}

export function RentersPersonalPropertyValueCalculatorTool() {
  const [rows, setRows] = useState<BelongingRow[]>(() => seedRows());
  const [policyLimit, setPolicyLimit] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const lineItems = rows.map((row) => ({
      ...row,
      lineTotal: row.quantity * row.value,
    }));
    const total = lineItems.reduce((sum, row) => sum + row.lineTotal, 0);
    const itemCount = lineItems.reduce((sum, row) => sum + (row.quantity > 0 ? row.quantity : 0), 0);
    const namedRows = lineItems.filter((row) => row.name.trim() !== "" && row.lineTotal > 0);
    const scheduleCandidates = lineItems.filter((row) => row.scheduleFlag && row.lineTotal > 0);
    const scheduleTotal = scheduleCandidates.reduce((sum, row) => sum + row.lineTotal, 0);

    // Rounding a raw itemized sum up to the next $1,000 gives a cleaner
    // number to actually request from an agent, since personal property
    // limits are typically offered in round increments rather than to the
    // dollar. This is a rounding convention applied to the user's own
    // figures, not an estimate of what anything is worth.
    const suggestedLimit = total > 0 ? Math.ceil(total / 1000) * 1000 : 0;

    const hasPolicyLimit = policyLimit > 0;
    const shortfall = hasPolicyLimit ? Math.max(0, total - policyLimit) : 0;
    const surplus = hasPolicyLimit ? Math.max(0, policyLimit - total) : 0;
    const isShort = hasPolicyLimit && shortfall > 0;

    return {
      lineItems,
      total,
      itemCount,
      namedRows,
      scheduleCandidates,
      scheduleTotal,
      suggestedLimit,
      hasPolicyLimit,
      shortfall,
      surplus,
      isShort,
    };
  }, [rows, policyLimit]);

  function addRow() {
    setRows((prev) => [...prev, { id: makeId(), name: "", quantity: 1, value: 0, scheduleFlag: false }]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function updateRow(id: string, patch: Partial<BelongingRow>) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  async function copyResult() {
    const lines = [
      "Renters personal property value estimate",
      "",
      ...result.namedRows.map(
        (row) =>
          `${row.name} x${row.quantity} @ ${USD.format(row.value)} = ${USD.format(row.lineTotal)}${row.scheduleFlag ? " (flagged for scheduling)" : ""}`
      ),
      "",
      `Total items counted: ${result.itemCount}`,
      `Itemized total value: ${USD.format(result.total)}`,
      `Suggested personal property limit (rounded up): ${USD.format(result.suggestedLimit)}`,
      result.scheduleTotal > 0
        ? `Flagged for possible scheduling: ${USD.format(result.scheduleTotal)}`
        : "No items flagged for possible scheduling",
      result.hasPolicyLimit
        ? result.isShort
          ? `Your current policy limit of ${USD.format(policyLimit)} is ${USD.format(result.shortfall)} short of your itemized total`
          : `Your current policy limit of ${USD.format(policyLimit)} covers your itemized total with ${USD.format(result.surplus)} to spare`
        : "Enter your current policy limit to compare it against this total",
      "Estimate only, based entirely on the values you entered. Not a professional appraisal or a coverage guarantee.",
      "insurancetools.org/tools/renters/renters-personal-property-value-calculator",
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
        <span className="label-mono text-slate-500">RENTERS PERSONAL PROPERTY VALUE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      {/* Running total, pinned near the top so it updates visibly as rows change */}
      <div className="border-b border-hairline bg-blue-50/60 px-5 py-4 sm:px-6">
        <p className="label-mono text-blue-700">ITEMIZED TOTAL</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
          {USD.format(result.total)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Across {result.lineItems.length} {result.lineItems.length === 1 ? "row" : "rows"} and{" "}
          {result.itemCount} {result.itemCount === 1 ? "item" : "items"} counted
        </p>
      </div>

      {/* Item rows */}
      <div className="bg-white p-5 sm:p-6">
        <div className="hidden grid-cols-[1fr_64px_104px_92px_120px_36px] gap-2 px-1 pb-2 sm:grid">
          <span className="label-mono text-slate-400">BELONGING</span>
          <span className="label-mono text-slate-400">QTY</span>
          <span className="label-mono text-slate-400">VALUE EACH</span>
          <span className="label-mono text-right text-slate-400">LINE TOTAL</span>
          <span className="label-mono text-slate-400">SCHEDULE?</span>
          <span aria-hidden="true" />
        </div>

        <div className="space-y-2.5">
          {result.lineItems.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-2 gap-2 rounded-lg border border-slate-100 p-2.5 sm:grid-cols-[1fr_64px_104px_92px_120px_36px] sm:items-center sm:border-0 sm:p-0"
            >
              <div className="col-span-2 sm:col-span-1">
                <TextField
                  label="Belonging name"
                  value={row.name}
                  placeholder="e.g. Winter coat"
                  onChange={(value) => updateRow(row.id, { name: value })}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-400 sm:hidden">Qty</span>
                <RowNumberField
                  label="Quantity"
                  value={row.quantity}
                  onChange={(value) => updateRow(row.id, { quantity: value })}
                  max={200}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-400 sm:hidden">Value each</span>
                <RowNumberField
                  label="Estimated value each"
                  value={row.value}
                  prefix="$"
                  step={5}
                  onChange={(value) => updateRow(row.id, { value })}
                />
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:pr-1">
                <span className="text-[11px] font-medium text-slate-400 sm:hidden">Line total</span>
                <span className="text-sm font-semibold tabular-nums text-slate-900">
                  {USD.format(row.quantity * row.value)}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:justify-start">
                <label className="flex items-center gap-1.5 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={row.scheduleFlag}
                    onChange={(e) => updateRow(row.id, { scheduleFlag: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Consider scheduling
                </label>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove ${row.name.trim() || "item"} row`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:hidden"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden sm:flex sm:justify-end">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove ${row.name.trim() || "item"} row`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add belonging
        </button>

        {result.scheduleTotal > 0 && (
          <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
            {USD.format(result.scheduleTotal)} across{" "}
            {result.scheduleCandidates.length === 1 ? "1 item is" : `${result.scheduleCandidates.length} items are`}{" "}
            flagged for possible scheduling. Standard renters policies commonly cap categories like jewelry,
            electronics, musical instruments, and collectibles with a special sub-limit well below your
            overall personal property limit, so these flagged items may need a separate scheduled
            endorsement to be fully covered.
          </div>
        )}

        {/* Policy limit comparison */}
        <div className="mt-5 border-t border-hairline pt-5">
          <p className="label-mono mb-2 text-slate-400">COMPARE TO YOUR POLICY</p>
          <div className="max-w-xs">
            <RowNumberField
              label="Current personal property limit on your renters policy"
              value={policyLimit}
              prefix="$"
              step={500}
              max={2_000_000}
              onChange={setPolicyLimit}
            />
            <p className="mt-1 text-xs text-slate-400">
              Optional — find this figure on your declarations page. Leave at $0 to skip the comparison.
            </p>
          </div>

          {result.hasPolicyLimit && (
            <div
              className={`mt-3 rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${
                result.isShort
                  ? "border-red-100 bg-red-50 text-red-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
              }`}
            >
              {result.isShort
                ? `Your itemized total is ${USD.format(result.shortfall)} more than your current ${USD.format(policyLimit)} limit. A total loss right now would likely leave that difference unreimbursed.`
                : `Your current ${USD.format(policyLimit)} limit covers your itemized total, with ${USD.format(result.surplus)} of room to spare.`}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-4">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED LIMIT TO REQUEST</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
              {USD_WHOLE.format(result.suggestedLimit)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Your itemized total, rounded up to the nearest $1,000</p>
          </div>
          <button
            type="button"
            onClick={copyResult}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy itemized result"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only, built entirely from the values you enter. This tool does not know your actual
        policy&apos;s wording, its special limits for categories like jewelry or electronics, or whether
        your coverage is written at replacement cost or actual cash value. Keep photos and receipts
        alongside this list and confirm your real coverage limit and any sub-limits with your policy
        documents or a licensed agent before assuming any amount is fully insured.
      </div>
    </div>
  );
}

"use client";

/**
 * Home inventory value calculator.
 *
 * Unlike a top-down rough estimator (assets grouped into a handful of broad
 * categories with a percentage-of-dwelling shortcut), this tool is a
 * bottom-up itemized inventory builder: the user adds a row per belonging
 * with a quantity and an estimated per-item value, and the running total is
 * the sum of (quantity x value) across every row. That is the same method a
 * claims adjuster expects to see in a proof-of-loss inventory, just built
 * interactively in the browser instead of on a spreadsheet.
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

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `row-${nextId}-${Date.now()}`;
}

function seedItems(): InventoryItem[] {
  // Pre-seeded row placeholders only, so a blank list doesn't feel broken.
  // Values start at $0 so nothing is assumed about what the user owns; the
  // user edits the name, quantity, and value (or deletes the row) before it
  // contributes anything to the total.
  return [
    { id: makeId(), name: "Sofa", quantity: 1, value: 0 },
    { id: makeId(), name: "Television", quantity: 1, value: 0 },
    { id: makeId(), name: "Laptop", quantity: 1, value: 0 },
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

function RowNumberField({ label, value, onChange, max = 1_000_000, step = 1, prefix }: RowNumberFieldProps) {
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

export function HomeInventoryValueCalculatorTool() {
  const [items, setItems] = useState<InventoryItem[]>(() => seedItems());
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rows = items.map((item) => ({
      ...item,
      lineTotal: item.quantity * item.value,
    }));
    const total = rows.reduce((sum, row) => sum + row.lineTotal, 0);
    const itemCount = rows.reduce((sum, row) => sum + (row.quantity > 0 ? row.quantity : 0), 0);
    const rowsWithValue = rows.filter((row) => row.name.trim() !== "" && row.lineTotal > 0);
    return { rows, total, itemCount, rowsWithValue };
  }, [items]);

  function addRow() {
    setItems((prev) => [...prev, { id: makeId(), name: "", quantity: 1, value: 0 }]);
  }

  function removeRow(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateRow(id: string, patch: Partial<InventoryItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function copyResult() {
    const lines = [
      "Home inventory value estimate",
      "",
      ...result.rowsWithValue.map(
        (row) => `${row.name} x${row.quantity} @ ${USD.format(row.value)} = ${USD.format(row.lineTotal)}`
      ),
      "",
      `Total items counted: ${result.itemCount}`,
      `Estimated total value: ${USD.format(result.total)}`,
      "Estimate only, based on values you entered. Not a professional appraisal or a coverage guarantee.",
      "insurancetools.org/tools/home/home-inventory-value-calculator",
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
        <span className="label-mono text-slate-500">HOME INVENTORY VALUE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      {/* Running total, pinned near the top so it updates visibly as rows change */}
      <div className="border-b border-hairline bg-blue-50/60 px-5 py-4 sm:px-6">
        <p className="label-mono text-blue-700">RUNNING TOTAL</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
          {USD.format(result.total)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Across {result.rows.length} {result.rows.length === 1 ? "row" : "rows"} and {result.itemCount}{" "}
          {result.itemCount === 1 ? "item" : "items"} counted
        </p>
      </div>

      {/* Item rows */}
      <div className="bg-white p-5 sm:p-6">
        <div className="hidden grid-cols-[1fr_88px_120px_100px_36px] gap-2 px-1 pb-2 sm:grid">
          <span className="label-mono text-slate-400">ITEM</span>
          <span className="label-mono text-slate-400">QTY</span>
          <span className="label-mono text-slate-400">VALUE EACH</span>
          <span className="label-mono text-right text-slate-400">LINE TOTAL</span>
          <span aria-hidden="true" />
        </div>

        <div className="space-y-2.5">
          {result.rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-2 gap-2 rounded-lg border border-slate-100 p-2.5 sm:grid-cols-[1fr_88px_120px_100px_36px] sm:items-center sm:border-0 sm:p-0"
            >
              <div className="col-span-2 sm:col-span-1">
                <TextField
                  label={`Item name for row`}
                  value={row.name}
                  placeholder="e.g. Dining table"
                  onChange={(value) => updateRow(row.id, { name: value })}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-400 sm:hidden">Qty</span>
                <RowNumberField
                  label="Quantity"
                  value={row.quantity}
                  onChange={(value) => updateRow(row.id, { quantity: value })}
                  max={500}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-400 sm:hidden">Value each</span>
                <RowNumberField label="Estimated value each" value={row.value} prefix="$" step={10} onChange={(value) => updateRow(row.id, { value })} />
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:pr-1">
                <span className="text-[11px] font-medium text-slate-400 sm:hidden">Line total</span>
                <span className="text-sm font-semibold tabular-nums text-slate-900">
                  {USD.format(row.quantity * row.value)}
                </span>
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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED TOTAL VALUE</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">{USD_WHOLE.format(result.total)}</p>
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
        Estimate only, built entirely from the values you enter. This tool does not know your policy&apos;s
        personal property coverage limit, any special limits on categories like jewelry or electronics, or
        depreciation your insurer would apply at claim time. Keep photos and receipts alongside this list
        and confirm your actual coverage limit with your policy documents or a licensed agent.
      </div>
    </div>
  );
}

"use client";

/**
 * Funeral & final expense calculator.
 *
 * Deliberately bottom-up: every line item starts at $0 and the user enters
 * their own estimate for each one. This tool does not present a single
 * fabricated "average funeral cost" figure as if it were current data —
 * funeral costs vary enormously by region, service type, and provider, and
 * a stale national average would mislead more people than it helps. Users
 * who want a benchmark are pointed to the National Funeral Directors
 * Association's own published survey to fill in numbers themselves.
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
}

function NumberField({ label, hint, value, onChange, max = 100_000 }: NumberFieldProps) {
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
          placeholder="0"
          onChange={(e) => {
            const raw = e.target.value === "" ? 0 : Number(e.target.value);
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

interface LineItem {
  key: string;
  label: string;
  hint: string;
  max?: number;
}

const COST_ITEMS: LineItem[] = [
  {
    key: "funeralHome",
    label: "Funeral home services & staff",
    hint: "Basic services fee, viewing, ceremony, use of facilities and vehicles",
    max: 30_000,
  },
  {
    key: "casketOrUrn",
    label: "Casket or urn",
    hint: "Whichever applies to burial or cremation",
    max: 20_000,
  },
  {
    key: "burialOrCremation",
    label: "Burial plot, vault, or cremation fee",
    hint: "Cemetery plot and vault, or the crematory's own charge",
    max: 25_000,
  },
  {
    key: "headstone",
    label: "Headstone or grave marker",
    hint: "Leave at $0 if this isn't planned",
    max: 15_000,
  },
  {
    key: "adminFees",
    label: "Obituary, death certificates & admin fees",
    hint: "Newspaper notice, certified copies, permits",
    max: 5_000,
  },
  {
    key: "medicalBills",
    label: "Outstanding medical bills",
    hint: "Final hospital, hospice, or care bills not covered by health insurance",
    max: 250_000,
  },
  {
    key: "otherDebts",
    label: "Other outstanding debts",
    hint: "Credit cards, personal loans, or other bills you'd want cleared quickly",
    max: 250_000,
  },
];

export function FuneralFinalExpenseCalculatorTool() {
  const [amounts, setAmounts] = useState<Record<string, number>>(
    Object.fromEntries(COST_ITEMS.map((item) => [item.key, 0]))
  );
  const [existingFunds, setExistingFunds] = useState(0);
  const [copied, setCopied] = useState(false);

  function setAmount(key: string, value: number) {
    setAmounts((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => {
    const itemsTotal = COST_ITEMS.reduce((sum, item) => sum + (amounts[item.key] || 0), 0);
    const hasAnyCostInput = itemsTotal > 0;
    const hasExistingFunds = existingFunds > 0;
    const gap = Math.max(0, itemsTotal - existingFunds);
    const suggestedFace = gap > 0 ? Math.ceil(gap / 1000) * 1000 : 0;
    const fullyCovered = hasAnyCostInput && existingFunds >= itemsTotal;

    const breakdown = COST_ITEMS.map((item) => {
      const value = amounts[item.key] || 0;
      const pct = itemsTotal > 0 ? Math.round((value / itemsTotal) * 100) : 0;
      return { ...item, value, pct };
    }).filter((item) => item.value > 0);

    return { itemsTotal, hasAnyCostInput, hasExistingFunds, gap, suggestedFace, fullyCovered, breakdown };
  }, [amounts, existingFunds]);

  async function copyResult() {
    const lines = [
      "Funeral & final expense estimate",
      ...COST_ITEMS.filter((item) => (amounts[item.key] || 0) > 0).map(
        (item) => `${item.label}: ${USD.format(amounts[item.key])}`
      ),
      `Estimated total cost: ${USD.format(result.itemsTotal)}`,
      result.hasExistingFunds
        ? `Existing savings/coverage earmarked: ${USD.format(existingFunds)}`
        : null,
      result.gap > 0
        ? `Coverage gap: ${USD.format(result.gap)}`
        : "No coverage gap based on the numbers entered",
      result.suggestedFace > 0
        ? `Suggested final expense policy face amount: ${USD.format(result.suggestedFace)} (rounded up to the nearest $1,000)`
        : null,
      "Estimate only, based on user-entered figures, not a quote or insurance advice. insurancetools.org/tools/life/funeral-final-expense-calculator",
    ].filter((line): line is string => Boolean(line));
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
        <span className="label-mono text-slate-500">FUNERAL &amp; FINAL EXPENSE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="text-xs leading-relaxed text-slate-500">
            Enter your own estimate for each line item below. Every field starts at $0 — nothing here is
            prefilled with a &ldquo;typical&rdquo; cost, because funeral costs vary too much by region and provider
            for a single number to be meaningful for your situation.
          </p>
          {COST_ITEMS.map((item) => (
            <NumberField
              key={item.key}
              label={item.label}
              hint={item.hint}
              value={amounts[item.key]}
              onChange={(v) => setAmount(item.key, v)}
              max={item.max}
            />
          ))}
          <div className="border-t border-hairline pt-4">
            <NumberField
              label="Savings or coverage already earmarked for this"
              hint="Existing burial fund, small policy, or cash set aside — optional"
              value={existingFunds}
              onChange={setExistingFunds}
              max={500_000}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED TOTAL COST</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.itemsTotal)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasAnyCostInput
                ? "Sum of the line items you entered on the left."
                : "Enter costs on the left to see a running total here."}
            </p>
          </div>

          {result.gap > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Based on your numbers, there&apos;s a {USD.format(result.gap)} gap between the estimated cost and
              what&apos;s already set aside. A final expense or burial policy with a face amount around{" "}
              {USD.format(result.suggestedFace)} (rounded up to the nearest $1,000, since policies are
              typically sold in round increments) would close that gap.
            </div>
          )}

          {result.fullyCovered && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-xs text-emerald-800">
              The savings or coverage you entered already meets or exceeds your estimated total cost. You
              may not need additional final expense coverage based on these numbers alone.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Coverage gap" value={USD.format(result.gap)} tone="accent" />
            <Figure
              label="Suggested face amount"
              value={result.suggestedFace > 0 ? USD.format(result.suggestedFace) : "—"}
            />
          </div>

          {result.breakdown.length > 0 && (
            <div className="space-y-2 border-t border-hairline pt-4">
              <p className="text-xs font-semibold text-slate-700">Cost breakdown</p>
              <div className="space-y-1.5">
                {result.breakdown.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <span className="w-40 shrink-0 truncate text-xs text-slate-500" title={item.label}>
                      {item.label}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-blue-500"
                        style={{ width: `${Math.max(item.pct, 2)}%` }}
                      />
                    </span>
                    <span className="w-10 shrink-0 text-right text-xs tabular-nums text-slate-500">
                      {item.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
        Estimate only, built entirely from the numbers you enter — this tool does not use or display a
        fabricated national average funeral cost. Actual prices vary by funeral home, region, and service
        choices; get an itemized general price list from a local funeral home for real numbers. This is
        not a quote, not insurance advice, and not a guarantee that any insurer will issue coverage at a
        given price. Confirm underwriting requirements and pricing with a licensed insurance agent.
      </div>
    </div>
  );
}

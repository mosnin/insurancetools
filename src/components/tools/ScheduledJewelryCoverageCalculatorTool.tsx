"use client";

/**
 * Scheduled jewelry coverage calculator.
 *
 * Standard homeowners and renters policies bundle jewelry, watches, and
 * similar valuables into "unscheduled personal property" and then cap theft
 * and mysterious-disappearance payouts for that whole category with a
 * sublimit that's often far below what a household's jewelry is actually
 * worth. This tool lets a user list their individual pieces, compare the
 * total against their policy's stated sublimit (which they enter, since
 * sublimits vary by insurer and policy), and see both the aggregate gap and
 * any single item that would blow through the sublimit on its own, since an
 * insurer generally won't split one item's payout across the category limit
 * for other items.
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface JewelryItem {
  id: string;
  name: string;
  value: number;
}

let nextId = 3;

function makeId(): string {
  nextId += 1;
  return `item-${nextId}`;
}

const DEFAULT_ITEMS: JewelryItem[] = [
  { id: "item-1", name: "Engagement ring", value: 6_000 },
  { id: "item-2", name: "Watch", value: 2_500 },
];

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

export function ScheduledJewelryCoverageCalculatorTool() {
  const [items, setItems] = useState<JewelryItem[]>(DEFAULT_ITEMS);
  const [sublimit, setSublimit] = useState(1_500);
  const [copied, setCopied] = useState(false);

  function addItem() {
    setItems((prev) => [...prev, { id: makeId(), name: "", value: 0 }]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateItem(id: string, patch: Partial<Omit<JewelryItem, "id">>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  const result = useMemo(() => {
    const valuedItems = items.filter((item) => item.value > 0);
    const totalItemsValue = valuedItems.reduce((sum, item) => sum + item.value, 0);
    const amountNeedingFloater = Math.max(0, totalItemsValue - sublimit);
    const overSublimitAlone = valuedItems
      .filter((item) => item.value > sublimit && sublimit > 0)
      .sort((a, b) => b.value - a.value);
    const hasGap = amountNeedingFloater > 0;
    const percentOverSublimit =
      sublimit > 0 && totalItemsValue > sublimit ? Math.round(((totalItemsValue - sublimit) / sublimit) * 100) : 0;

    return {
      totalItemsValue,
      amountNeedingFloater,
      overSublimitAlone,
      hasGap,
      percentOverSublimit,
      itemCount: valuedItems.length,
    };
  }, [items, sublimit]);

  async function copyResult() {
    const lines = [
      "Scheduled jewelry coverage results",
      `Total jewelry value entered: ${USD.format(result.totalItemsValue)} across ${result.itemCount} item${result.itemCount === 1 ? "" : "s"}`,
      `Policy jewelry sublimit entered: ${USD.format(sublimit)}`,
      result.hasGap
        ? `Amount likely needing a floater/rider: ${USD.format(result.amountNeedingFloater)} (about ${result.percentOverSublimit}% over the sublimit)`
        : "Total jewelry value is within the entered sublimit, based on the numbers provided",
      result.overSublimitAlone.length > 0
        ? `Items exceeding the sublimit individually: ${result.overSublimitAlone.map((i) => `${i.name || "Unnamed item"} (${USD.format(i.value)})`).join(", ")}`
        : "No single item exceeds the sublimit on its own",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/home/scheduled-jewelry-coverage-calculator",
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
        <span className="label-mono text-slate-500">SCHEDULED JEWELRY COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-600">Your jewelry, watches &amp; valuables</span>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
                Add item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    aria-label={`Item ${index + 1} name`}
                    placeholder="e.g. Wedding ring"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="relative w-28 shrink-0">
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      aria-label={`Item ${index + 1} estimated value`}
                      inputMode="numeric"
                      min={0}
                      step={50}
                      value={Number.isFinite(item.value) ? item.value : 0}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        const clamped = Number.isFinite(raw) ? Math.max(raw, 0) : 0;
                        updateItem(item.id, { value: clamped });
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-5 pr-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name || `item ${index + 1}`}`}
                    className="shrink-0 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">
                  No items yet. Add your first piece above.
                </p>
              )}
            </div>
          </div>

          <NumberField
            label="Your policy's jewelry theft/loss sublimit"
            hint="Check your declarations page under 'special limits' or 'jewelry'"
            value={sublimit}
            onChange={setSublimit}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">AMOUNT LIKELY NEEDING A FLOATER</p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.hasGap ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {USD.format(result.amountNeedingFloater)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasGap
                ? `Your entered items total ${USD.format(result.totalItemsValue)}, about ${result.percentOverSublimit}% above your ${USD.format(sublimit)} sublimit.`
                : `Your entered items total ${USD.format(result.totalItemsValue)}, within your ${USD.format(sublimit)} sublimit.`}
            </p>
          </div>

          {result.overSublimitAlone.length > 0 && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              <p className="font-semibold">
                {result.overSublimitAlone.length === 1 ? "One item" : `${result.overSublimitAlone.length} items`}{" "}
                exceed{result.overSublimitAlone.length === 1 ? "s" : ""} the sublimit on its own:
              </p>
              <ul className="mt-1.5 space-y-0.5">
                {result.overSublimitAlone.map((item) => (
                  <li key={item.id}>
                    {item.name || "Unnamed item"} — {USD.format(item.value)}
                  </li>
                ))}
              </ul>
              <p className="mt-1.5">
                These would likely need their own rider regardless of the total, since a single loss typically
                can&apos;t draw against the category sublimit meant for the rest of your jewelry.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total items value" value={USD.format(result.totalItemsValue)} />
            <Figure
              label="Items over sublimit"
              value={String(result.overSublimitAlone.length)}
              tone={result.overSublimitAlone.length > 0 ? "warn" : "default"}
            />
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
        Estimate only. Many policies default to a modest jewelry theft/loss sublimit somewhere in the general
        neighborhood of $1,000&ndash;$2,500, but sublimits vary by insurer, state, and policy form &mdash; check
        your own declarations page rather than trusting the default shown here. This tool does not know your
        insurer&apos;s exact policy language, appraisal requirements, or rider pricing. Confirm scheduling
        requirements and get an exact quote from a licensed agent before relying on this for a claim.
      </div>
    </div>
  );
}

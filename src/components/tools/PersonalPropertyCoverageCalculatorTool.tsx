"use client";

/**
 * Personal property coverage calculator.
 *
 * Uses a room-by-room, top-down estimate: the user fills in rough total
 * values for six broad belongings categories, which are summed into an
 * estimated personal property value. That figure is then compared against
 * the illustrative default many homeowners policies use for Coverage C
 * (commonly cited as roughly 50-70% of the Coverage A dwelling limit), so
 * the user can see whether their actual belongings likely exceed what a
 * policy would automatically provide without them ever having priced
 * anything out room by room.
 *
 * This is explicitly framed as an illustrative range, not a rule, since the
 * 50-70% figure varies by insurer and by state. Users are told to confirm
 * their own personal property limit on their declarations page.
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

interface CategoryDef {
  key: string;
  label: string;
  hint?: string;
  defaultValue: number;
}

const CATEGORIES: CategoryDef[] = [
  { key: "furniture", label: "Furniture", hint: "Sofas, beds, tables, dressers, outdoor furniture", defaultValue: 8_000 },
  { key: "electronics", label: "Electronics", hint: "TVs, computers, phones, gaming systems, cameras", defaultValue: 5_000 },
  { key: "clothing", label: "Clothing", hint: "Everyday wear, shoes, coats, accessories for the household", defaultValue: 4_000 },
  { key: "appliances", label: "Appliances", hint: "Portable/owned appliances not built into the home", defaultValue: 3_000 },
  { key: "kitchenware", label: "Kitchenware & housewares", hint: "Cookware, dishes, small appliances, linens, decor", defaultValue: 2_500 },
  { key: "other", label: "Other / miscellaneous", hint: "Tools, hobby gear, books, toys, everything else", defaultValue: 3_500 },
];

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 2_000_000 }: NumberFieldProps) {
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

export function PersonalPropertyCoverageCalculatorTool() {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.key, c.defaultValue]))
  );
  const [dwellingCoverage, setDwellingCoverage] = useState(300_000);
  const [copied, setCopied] = useState(false);

  function setCategory(key: string, next: number) {
    setValues((prev) => ({ ...prev, [key]: next }));
  }

  const result = useMemo(() => {
    const estimatedTotal = CATEGORIES.reduce((sum, c) => sum + (values[c.key] || 0), 0);
    const hasDwelling = dwellingCoverage > 0;
    const defaultLow = dwellingCoverage * 0.5;
    const defaultHigh = dwellingCoverage * 0.7;
    const withinDefaultRange = hasDwelling && estimatedTotal >= defaultLow && estimatedTotal <= defaultHigh;
    const aboveDefaultRange = hasDwelling && estimatedTotal > defaultHigh;
    const belowDefaultRange = hasDwelling && estimatedTotal < defaultLow;
    const shortfallVsHigh = Math.max(0, estimatedTotal - defaultHigh);

    return {
      estimatedTotal,
      hasDwelling,
      defaultLow,
      defaultHigh,
      withinDefaultRange,
      aboveDefaultRange,
      belowDefaultRange,
      shortfallVsHigh,
    };
  }, [values, dwellingCoverage]);

  async function copyResult() {
    const lines = [
      "Personal property coverage estimate",
      ...CATEGORIES.map((c) => `${c.label}: ${USD.format(values[c.key] || 0)}`),
      `Estimated total belongings value: ${USD.format(result.estimatedTotal)}`,
      result.hasDwelling
        ? `Illustrative policy default range (50-70% of ${USD.format(dwellingCoverage)} dwelling coverage): ${USD.format(result.defaultLow)} - ${USD.format(result.defaultHigh)}`
        : "Enter your dwelling coverage limit to compare against an illustrative default range.",
      result.hasDwelling
        ? result.aboveDefaultRange
          ? "Your estimated belongings value is above that illustrative range — worth checking your actual personal property limit."
          : result.belowDefaultRange
            ? "Your estimated belongings value is below that illustrative range."
            : "Your estimated belongings value falls within that illustrative range."
        : "",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/home/personal-property-coverage-calculator",
    ].filter(Boolean);
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
        <span className="label-mono text-slate-500">PERSONAL PROPERTY COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="text-xs text-slate-500">
            Estimate what it would roughly cost to replace everything in each category, not what you
            originally paid. Round numbers are fine — this is a starting point, not an inventory.
          </p>
          {CATEGORIES.map((c) => (
            <NumberField
              key={c.key}
              label={c.label}
              hint={c.hint}
              value={values[c.key]}
              onChange={(next) => setCategory(c.key, next)}
            />
          ))}
          <div className="border-t border-hairline pt-4">
            <NumberField
              label="Your dwelling coverage limit (Coverage A)"
              hint="Found on your declarations page, or the amount you're insuring the structure for"
              value={dwellingCoverage}
              onChange={setDwellingCoverage}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED PERSONAL PROPERTY VALUE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.estimatedTotal)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Sum of the six belongings categories entered on the left.
            </p>
          </div>

          {result.hasDwelling && (
            <div
              className={`rounded-lg border px-3.5 py-3 text-xs ${
                result.aboveDefaultRange
                  ? "border-amber-100 bg-amber-50 text-amber-800"
                  : "border-blue-100 bg-blue-50 text-blue-800"
              }`}
            >
              Many policies default Coverage C (personal property) to roughly 50-70% of Coverage A, which
              on a {USD.format(dwellingCoverage)} dwelling limit works out to an illustrative{" "}
              {USD.format(result.defaultLow)}&ndash;{USD.format(result.defaultHigh)} range. This varies by
              insurer and state, so treat it as a reference point, not your actual limit &mdash; check your
              declarations page for the real number.{" "}
              {result.aboveDefaultRange
                ? `Your estimated belongings value is about ${USD.format(result.shortfallVsHigh)} above the top of that range, which is worth a closer look.`
                : result.belowDefaultRange
                  ? "Your estimated belongings value falls under that range, so the illustrative default would likely be more than enough."
                  : "Your estimated belongings value falls within that range."}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Illustrative default low"
              value={result.hasDwelling ? USD.format(result.defaultLow) : "—"}
            />
            <Figure
              label="Illustrative default high"
              value={result.hasDwelling ? USD.format(result.defaultHigh) : "—"}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Category breakdown</p>
              <ul className="mt-1 space-y-1 text-xs leading-relaxed text-slate-500">
                {CATEGORIES.map((c) => (
                  <li key={c.key} className="flex items-center justify-between gap-3">
                    <span>{c.label}</span>
                    <span className="tabular-nums text-slate-700">{USD.format(values[c.key] || 0)}</span>
                  </li>
                ))}
              </ul>
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
        Estimate only. The 50-70% figure is an illustrative range commonly cited for how some homeowners
        policies set a personal property default relative to dwelling coverage; it is not a universal
        rule, and your insurer&apos;s actual percentage and your real personal property limit may differ.
        This tool does not know your policy&apos;s actual terms, any special limits on categories like
        jewelry or electronics, or your state&apos;s rules. Confirm your real personal property limit on your
        declarations page and talk to a licensed insurance agent before changing coverage.
      </div>
    </div>
  );
}

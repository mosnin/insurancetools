"use client";

/**
 * Deductible comparison calculator.
 *
 * This is the site's general-purpose deductible tool: it makes no
 * assumption about which line of insurance the deductible belongs to. A
 * user can compare $500 vs $1,000 vs $2,500 auto deductibles, three
 * homeowners deductible options, a renters policy's flat-dollar choices,
 * or any other set of deductible/premium pairs a quote presents, because
 * the underlying arithmetic never depends on what the deductible is
 * attached to. All it needs is a deductible dollar amount and a premium
 * dollar amount per option.
 *
 * Two questions get answered for every option the user enters:
 *
 * 1. Pairwise break-even: comparing any two options, how many years of
 *    premium savings does it take for the cheaper-premium (higher
 *    deductible) option to make up the larger out-of-pocket cost it would
 *    create on a single claim?
 * 2. Ranked annualized cost: at a claim-frequency assumption the user
 *    supplies (or a set of preset assumptions), which option has the
 *    lowest expected annual cost once premium and amortized deductible
 *    risk are combined?
 *
 * The tool never predicts how often a claim will actually happen. That
 * assumption always comes from the user; the tool only does the
 * arithmetic and shows it from every angle so the judgment call stays
 * with the person paying the premium.
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

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;
const PRESET_YEARS = [2, 3, 5, 7, 10, 15, 20];

interface DeductibleOption {
  id: number;
  deductible: number;
  premium: number;
}

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  max = 100_000,
  min = 0,
  step = 10,
  prefix = "$",
  suffix,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : min;
            onChange(clamped);
          }}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-14" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function optionLabel(deductible: number): string {
  return `${USD.format(deductible)} deductible`;
}

function formatYears(years: number): string {
  if (!Number.isFinite(years)) return "never";
  return `${years.toFixed(1)} yr${years.toFixed(1) === "1.0" ? "" : "s"}`;
}

export function DeductibleComparisonCalculatorTool() {
  const [nextId, setNextId] = useState(4);
  const [options, setOptions] = useState<DeductibleOption[]>([
    { id: 1, deductible: 500, premium: 1450 },
    { id: 2, deductible: 1000, premium: 1250 },
    { id: 3, deductible: 2500, premium: 980 },
  ]);
  const [claimFrequency, setClaimFrequency] = useState(5);
  const [copied, setCopied] = useState(false);

  function updateOption(id: number, field: "deductible" | "premium", value: number) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  }

  function addOption() {
    setOptions((prev) => {
      if (prev.length >= MAX_OPTIONS) return prev;
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          id: nextId,
          deductible: Math.round((last.deductible * 2) / 50) * 50,
          premium: Math.max(0, Math.round(last.premium * 0.85)),
        },
      ];
    });
    setNextId((n) => n + 1);
  }

  function removeOption(id: number) {
    setOptions((prev) => (prev.length <= MIN_OPTIONS ? prev : prev.filter((o) => o.id !== id)));
  }

  const result = useMemo(() => {
    const sorted = [...options].sort((a, b) => a.deductible - b.deductible);
    const safeFrequency = claimFrequency > 0 ? claimFrequency : 1;

    const ranked = [...sorted]
      .map((o) => ({ ...o, annualizedCost: o.premium + o.deductible / safeFrequency }))
      .sort((a, b) => a.annualizedCost - b.annualizedCost);

    const pairs = sorted.flatMap((a, i) =>
      sorted.slice(i + 1).map((b) => {
        const premiumSavings = a.premium - b.premium;
        const deductibleDelta = b.deductible - a.deductible;
        const breakEvenYears = premiumSavings > 0 ? deductibleDelta / premiumSavings : Infinity;
        const higherWins = premiumSavings > 0 && breakEvenYears < claimFrequency;
        return { a, b, premiumSavings, deductibleDelta, breakEvenYears, higherWins };
      })
    );

    const frequencyScenarios = Array.from(new Set([claimFrequency, ...PRESET_YEARS]))
      .filter((y) => y > 0)
      .sort((a, b) => a - b)
      .map((years) => {
        const scored = sorted.map((o) => ({ ...o, cost: o.premium + o.deductible / years }));
        const winner = scored.reduce((best, cur) => (cur.cost < best.cost ? cur : best), scored[0]);
        return { years, winner, isUserAssumption: years === claimFrequency };
      });

    const hasDuplicateDeductibles =
      new Set(sorted.map((o) => o.deductible)).size !== sorted.length;

    return {
      sorted,
      ranked,
      pairs,
      frequencyScenarios,
      hasDuplicateDeductibles,
      validFrequency: claimFrequency > 0,
    };
  }, [options, claimFrequency]);

  async function copyResult() {
    const lines = [
      "Deductible comparison calculator",
      ...result.sorted.map(
        (o) => `${optionLabel(o.deductible)}: ${USD.format(o.premium)}/year premium`
      ),
      `Assumed years between claims: ${claimFrequency}`,
      `Lowest effective annual cost at that assumption: ${optionLabel(result.ranked[0]?.deductible ?? 0)} (${USD.format(
        Math.round(result.ranked[0]?.annualizedCost ?? 0)
      )}/year)`,
      "Break-even points:",
      ...result.pairs.map(
        (p) =>
          `  ${optionLabel(p.a.deductible)} -> ${optionLabel(p.b.deductible)}: ${
            p.premiumSavings > 0
              ? `breaks even at ${formatYears(p.breakEvenYears)}`
              : "no premium savings, lower deductible wins outright"
          }`
      ),
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/deductibles/deductible-comparison-calculator",
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
        <span className="label-mono text-slate-500">DEDUCTIBLE COMPARISON CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div className="space-y-4">
            {result.sorted.map((o, i) => (
              <div key={o.id} className="rounded-lg border border-slate-200 p-3.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">OPTION {i + 1}</span>
                  {options.length > MIN_OPTIONS && (
                    <button
                      type="button"
                      onClick={() => removeOption(o.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-red-600"
                      aria-label={`Remove ${optionLabel(o.deductible)} option`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Deductible"
                    value={o.deductible}
                    onChange={(v) => updateOption(o.id, "deductible", v)}
                    max={50_000}
                    step={50}
                  />
                  <NumberField
                    label="Annual premium"
                    value={o.premium}
                    onChange={(v) => updateOption(o.id, "premium", v)}
                    max={100_000}
                    step={10}
                  />
                </div>
              </div>
            ))}
          </div>

          {result.hasDuplicateDeductibles && (
            <p className="text-xs text-amber-700">
              Two of your options share the same deductible amount. Give each option a different
              deductible so the break-even comparisons stay meaningful.
            </p>
          )}

          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add another deductible option
            </button>
          )}

          <div className="border-t border-hairline pt-4">
            <NumberField
              label="How often do you expect to file a claim?"
              hint="Your own estimate, in years between claims — not a prediction this tool makes for you"
              value={claimFrequency}
              onChange={setClaimFrequency}
              min={1}
              max={50}
              step={1}
              prefix=""
              suffix="years"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">LOWEST COST AT YOUR ASSUMPTION</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.ranked[0] ? optionLabel(result.ranked[0].deductible) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.ranked[0]
                ? `Roughly ${USD.format(Math.round(result.ranked[0].annualizedCost))}/year in effective cost, assuming a claim every ${claimFrequency} year${claimFrequency === 1 ? "" : "s"}`
                : "Enter at least two options to compare"}
            </p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Ranked by effective annual cost</p>
            {result.ranked.map((o, i) => (
              <div
                key={o.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                  i === 0 ? "border border-blue-100 bg-blue-50 text-blue-800" : "text-slate-600"
                }`}
              >
                <span className="font-medium">
                  {i + 1}. {optionLabel(o.deductible)}
                  <span className="ml-1.5 font-normal text-slate-400">
                    ({USD.format(o.premium)}/yr premium)
                  </span>
                </span>
                <span className="tabular-nums font-semibold">
                  {USD.format(Math.round(o.annualizedCost))}/yr
                </span>
              </div>
            ))}
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

      {/* Claim-frequency scenario table */}
      <div className="border-t border-hairline bg-white p-5 sm:p-6">
        <p className="mb-3 text-xs font-semibold text-slate-700">
          Which option wins at different claim frequencies
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-xs">
            <thead>
              <tr className="border-b border-hairline text-left text-slate-400">
                <th className="py-2 pr-4 font-medium">Claim every&hellip;</th>
                <th className="py-2 pr-4 font-medium">Winning option</th>
                <th className="py-2 font-medium">Effective annual cost</th>
              </tr>
            </thead>
            <tbody>
              {result.frequencyScenarios.map((s) => (
                <tr
                  key={s.years}
                  className={`border-b border-hairline last:border-0 ${
                    s.isUserAssumption ? "bg-blue-50/60" : ""
                  }`}
                >
                  <td className="py-2 pr-4 text-slate-600">
                    {s.years} year{s.years === 1 ? "" : "s"}
                    {s.isUserAssumption && (
                      <span className="ml-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                        YOUR ASSUMPTION
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 font-medium text-slate-900">
                    {optionLabel(s.winner.deductible)}
                  </td>
                  <td className="py-2 tabular-nums text-slate-600">
                    {USD.format(Math.round(s.winner.cost))}/yr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pairwise break-even matrix */}
      <div className="border-t border-hairline bg-slate-50/40 p-5 sm:p-6">
        <p className="mb-3 text-xs font-semibold text-slate-700">
          Break-even point for every pair of options
        </p>
        <div className="space-y-2">
          {result.pairs.map((p) => (
            <div
              key={`${p.a.id}-${p.b.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs"
            >
              <span className="font-medium text-slate-700">
                {optionLabel(p.a.deductible)} <span className="text-slate-400">vs.</span>{" "}
                {optionLabel(p.b.deductible)}
              </span>
              {p.premiumSavings > 0 ? (
                <span className="text-slate-600">
                  Saves {USD.format(p.premiumSavings)}/yr &middot; breaks even at{" "}
                  <strong className="text-slate-900">{formatYears(p.breakEvenYears)}</strong> &middot;{" "}
                  {p.higherWins ? (
                    <span className="font-semibold text-blue-700">
                      {optionLabel(p.b.deductible)} favored at your assumption
                    </span>
                  ) : (
                    <span className="font-semibold text-amber-700">
                      {optionLabel(p.a.deductible)} favored at your assumption
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-amber-700">
                  No premium savings from the higher deductible &mdash; {optionLabel(p.a.deductible)}{" "}
                  wins outright
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This calculator only does arithmetic on the deductible and premium numbers you
        enter and the claim-frequency assumption you choose; it does not know your actual claim
        history, your insurer&apos;s pricing, or which insurance line these numbers belong to. It is not
        a quote and not insurance advice. Confirm actual premiums at each deductible level with a
        licensed agent before changing a policy.
      </div>
    </div>
  );
}

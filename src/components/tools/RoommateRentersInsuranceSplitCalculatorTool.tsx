"use client";

/**
 * Roommate renters insurance split calculator.
 *
 * Roommates choosing renters insurance face a genuine, situational tradeoff:
 * one shared policy covering the whole household is often cheaper in total
 * premium, but it means every roommate shares a single liability limit and a
 * single claim history, and a roommate moving out requires updating the
 * policy. Separate individual policies usually cost more in total, but keep
 * each person's coverage, claims, and liability fully independent.
 *
 * This tool does not decide which approach is "better" — that depends on
 * trust between roommates, how often the household turns over, and how much
 * each person owns. Instead it does the cost math: it totals what separate
 * policies would cost against a single shared policy quote, so roommates can
 * see the real dollar difference and weigh it against the tradeoffs
 * themselves.
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy, Minus, Plus } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const MIN_ROOMMATES = 2;
const MAX_ROOMMATES = 8;
const DEFAULT_BELONGINGS = 15_000;
const DEFAULT_SEPARATE_PREMIUM = 200;
const DEFAULT_SHARED_PREMIUM = 480;

function resize(arr: number[], length: number, fallback: number): number[] {
  if (length === arr.length) return arr;
  if (length < arr.length) return arr.slice(0, length);
  return [...arr, ...Array(length - arr.length).fill(fallback)];
}

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CurrencyField({ label, hint, value, onChange, max = 1_000_000 }: CurrencyFieldProps) {
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

export function RoommateRentersInsuranceSplitCalculatorTool() {
  const [roommateCount, setRoommateCount] = useState(3);
  const [belongings, setBelongings] = useState<number[]>([15_000, 12_000, 18_000]);
  const [separatePremiums, setSeparatePremiums] = useState<number[]>([190, 175, 210]);
  const [sharedPremium, setSharedPremium] = useState(DEFAULT_SHARED_PREMIUM);
  const [copied, setCopied] = useState(false);

  function changeRoommateCount(next: number) {
    const clamped = Math.min(Math.max(Math.round(next), MIN_ROOMMATES), MAX_ROOMMATES);
    setRoommateCount(clamped);
    setBelongings((prev) => resize(prev, clamped, DEFAULT_BELONGINGS));
    setSeparatePremiums((prev) => resize(prev, clamped, DEFAULT_SEPARATE_PREMIUM));
  }

  function updateBelongings(index: number, value: number) {
    setBelongings((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function updateSeparatePremium(index: number, value: number) {
    setSeparatePremiums((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  const result = useMemo(() => {
    const totalBelongings = belongings.reduce((sum, v) => sum + v, 0);
    const totalSeparateCost = separatePremiums.reduce((sum, v) => sum + v, 0);
    const totalSharedCost = sharedPremium;

    const hasSeparateInputs = totalSeparateCost > 0;
    const hasSharedInput = totalSharedCost > 0;
    const canCompare = hasSeparateInputs && hasSharedInput;

    const difference = totalSeparateCost - totalSharedCost;
    const cheaperOption: "shared" | "separate" | "tie" =
      difference > 0 ? "shared" : difference < 0 ? "separate" : "tie";

    const perPersonSharedSplit = totalSharedCost / roommateCount;
    const highestBelongings = Math.max(...belongings);
    const belongingsSpreadIsUneven =
      highestBelongings > 0 && totalBelongings > 0 && highestBelongings / totalBelongings > 0.5;

    return {
      totalBelongings,
      totalSeparateCost,
      totalSharedCost,
      hasSeparateInputs,
      hasSharedInput,
      canCompare,
      difference,
      cheaperOption,
      perPersonSharedSplit,
      belongingsSpreadIsUneven,
    };
  }, [belongings, separatePremiums, sharedPremium, roommateCount]);

  async function copyResult() {
    const lines = [
      "Roommate renters insurance split calculator",
      `Household size: ${roommateCount} roommates`,
      `Total belongings value entered: ${USD.format(result.totalBelongings)}`,
      `Total annual cost if separate policies: ${USD.format(result.totalSeparateCost)}`,
      `Annual cost of one shared policy: ${USD.format(result.totalSharedCost)}`,
      result.canCompare
        ? result.cheaperOption === "tie"
          ? "Both approaches cost the same in total premium based on the numbers entered."
          : `${result.cheaperOption === "shared" ? "One shared policy" : "Separate policies"} is cheaper in total by ${USD.format(Math.abs(result.difference))}/year based on the numbers entered.`
        : "Enter both a shared policy quote and separate policy quotes to see the cost difference.",
      "This is a cost comparison only, not a recommendation. One shared policy means one liability limit and one claim history for the whole household; separate policies keep coverage, claims, and liability independent per person.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/renters/roommate-renters-insurance-split-calculator",
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
        <span className="label-mono text-slate-500">ROOMMATE RENTERS INSURANCE SPLIT CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <span className="block text-[13px] font-medium text-slate-600">Number of roommates</span>
            <div className="mt-1.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => changeRoommateCount(roommateCount - 1)}
                disabled={roommateCount <= MIN_ROOMMATES}
                aria-label="Remove a roommate"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="w-8 text-center text-lg font-semibold tabular-nums text-slate-900">
                {roommateCount}
              </span>
              <button
                type="button"
                onClick={() => changeRoommateCount(roommateCount + 1)}
                disabled={roommateCount >= MAX_ROOMMATES}
                aria-label="Add a roommate"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <span className="mt-1 block text-xs text-slate-400">Including yourself, from {MIN_ROOMMATES} to {MAX_ROOMMATES}</span>
          </div>

          <div className="space-y-3">
            {Array.from({ length: roommateCount }).map((_, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3">
                <p className="mb-2 text-xs font-semibold text-slate-700">Roommate {i + 1}</p>
                <div className="grid grid-cols-2 gap-3">
                  <CurrencyField
                    label="Belongings value"
                    value={belongings[i] ?? 0}
                    onChange={(v) => updateBelongings(i, v)}
                    max={500_000}
                  />
                  <CurrencyField
                    label="Separate policy quote/yr"
                    value={separatePremiums[i] ?? 0}
                    onChange={(v) => updateSeparatePremium(i, v)}
                    max={10_000}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-hairline pt-4">
            <CurrencyField
              label="One shared policy quote (annual, whole household)"
              hint="A single policy naming everyone as an insured, sized to the combined belongings above"
              value={sharedPremium}
              onChange={setSharedPremium}
              max={20_000}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">CHEAPER OPTION IN TOTAL PREMIUM</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {!result.canCompare
                ? "Enter both quotes"
                : result.cheaperOption === "tie"
                  ? "Same cost"
                  : result.cheaperOption === "shared"
                    ? "One shared policy"
                    : "Separate policies"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.canCompare
                ? result.cheaperOption === "tie"
                  ? "Both approaches total the same annual premium with the numbers entered."
                  : `Cheaper by ${USD.format(Math.abs(result.difference))} per year in total premium, based on the quotes entered.`
                : "Enter separate-policy quotes for each roommate and one shared-policy quote to compare."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total if separate" value={USD.format(result.totalSeparateCost)} />
            <Figure label="Shared policy cost" value={USD.format(result.totalSharedCost)} tone="accent" />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Household belongings" value={USD.format(result.totalBelongings)} />
            <Figure label="Shared cost per person, split evenly" value={USD.format(result.perPersonSharedSplit)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">What a shared policy means</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                One policy typically means one shared liability limit and one shared claim history for the
                whole household, and the policy usually needs to be updated whenever a roommate moves out
                or in.{" "}
                {result.belongingsSpreadIsUneven &&
                  "One roommate here owns more than half of the household's total belongings value, which is worth noting since that person's claim could affect everyone's renewal."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">What separate policies mean</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Each roommate keeps an independent liability limit and an independent claim history, and
                moving out doesn&apos;t require anyone else&apos;s policy to change. That independence is the
                main reason separate policies usually cost more in total.
              </p>
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
        Estimate only. This tool totals the premiums and belongings values you enter; it does not know
        which insurers offer either option in your area, whether a shared policy would actually list every
        roommate as a named insured, or your state&apos;s specific renters insurance rules. Confirm exactly
        who is covered under a shared policy, in writing, before relying on it, and get final pricing from a
        licensed agent.
      </div>
    </div>
  );
}

"use client";

/**
 * Umbrella policy need calculator.
 *
 * This is the site's canonical umbrella-sizing tool. It answers two
 * separate questions that get conflated everywhere else on the web:
 *
 * 1. How much total liability protection should this household be
 *    carrying? Modeled here as net worth plus a chosen number of years of
 *    future income, since a liability judgment can reach both current
 *    assets and future wages through garnishment.
 * 2. Given the underlying auto and home/renters liability limits already
 *    in place, how much umbrella limit is needed on top to close the gap
 *    between that target and what the underlying policies already cover?
 *
 * It deliberately does NOT state a specific universal dollar figure for
 * the underlying-limit requirement umbrella insurers impose before they'll
 * issue a policy. That figure is set individually by each umbrella carrier
 * and varies. The tool instead lets the user enter their own insurer's
 * stated minimum (if they know it) and checks their current limits against
 * it, and otherwise shows a generic caution to confirm the number directly
 * with the carrier.
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

const MILLION = 1_000_000;

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function DollarField({ label, hint, value, onChange, max = 50_000_000, step = 1_000 }: DollarFieldProps) {
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

function YearsField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const presets = [3, 5, 10];
  return (
    <div>
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={30}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 30) : 0;
            onChange(clamped);
          }}
          className="w-20 rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-xs text-slate-400">years</span>
        <span className="ml-auto flex gap-1">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                value === p
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </span>
      </div>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </div>
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

export function UmbrellaPolicyNeedCalculatorTool() {
  const [netWorth, setNetWorth] = useState(600_000);
  const [income, setIncome] = useState(140_000);
  const [protectionYears, setProtectionYears] = useState(5);
  const [autoLimit, setAutoLimit] = useState(300_000);
  const [homeLimit, setHomeLimit] = useState(300_000);
  const [insurerMinimum, setInsurerMinimum] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const targetProtection = netWorth + protectionYears * income;

    // The weaker of the two underlying limits, since umbrella coverage for
    // any single claim only extends above whichever specific policy limit
    // applies to that claim. Using the lower of the two is the conservative
    // read of what's actually protected today.
    const effectiveUnderlying = Math.min(autoLimit, homeLimit);

    const gap = Math.max(0, targetProtection - effectiveUnderlying);
    const suggestedUmbrella = gap > 0 ? Math.ceil(gap / MILLION) * MILLION : 0;
    const totalAfterUmbrella = effectiveUnderlying + suggestedUmbrella;

    const hasInsurerMinimum = insurerMinimum > 0;
    const autoMeetsMinimum = !hasInsurerMinimum || autoLimit >= insurerMinimum;
    const homeMeetsMinimum = !hasInsurerMinimum || homeLimit >= insurerMinimum;
    const meetsKnownMinimum = autoMeetsMinimum && homeMeetsMinimum;

    const alreadyCovered = gap === 0;

    return {
      targetProtection,
      effectiveUnderlying,
      gap,
      suggestedUmbrella,
      totalAfterUmbrella,
      hasInsurerMinimum,
      autoMeetsMinimum,
      homeMeetsMinimum,
      meetsKnownMinimum,
      alreadyCovered,
    };
  }, [netWorth, income, protectionYears, autoLimit, homeLimit, insurerMinimum]);

  async function copyResult() {
    const lines = [
      "Umbrella policy need estimate",
      `Target liability protection: ${USD.format(result.targetProtection)} (net worth + ${protectionYears} years of income)`,
      `Current underlying limit (lower of auto/home): ${USD.format(result.effectiveUnderlying)}`,
      result.alreadyCovered
        ? "Suggested umbrella limit: your underlying limits already reach the target, though umbrella policies are typically sold starting at $1,000,000 if you want an added buffer"
        : `Suggested umbrella limit: ${USD.format(result.suggestedUmbrella)} (rounded up to the nearest common $1,000,000 increment)`,
      result.hasInsurerMinimum
        ? result.meetsKnownMinimum
          ? "Underlying limits meet the minimum you entered for your umbrella insurer"
          : "Underlying limits fall short of the minimum you entered — raise auto and/or home liability limits before this umbrella can be issued"
        : "Underlying limit minimum not entered — confirm the specific required minimum with your umbrella insurer before assuming your current limits qualify",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/coverage/umbrella-policy-need-calculator",
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
        <span className="label-mono text-slate-500">UMBRELLA POLICY NEED CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Net worth"
            hint="Ballpark: total assets minus debts"
            value={netWorth}
            onChange={setNetWorth}
          />
          <DollarField
            label="Annual income"
            hint="A judgment can also reach future wages through garnishment"
            value={income}
            onChange={setIncome}
          />
          <YearsField
            label="Years of future income to protect"
            hint="Common guidance protects several years of future earnings, not just current assets. Adjust to your own comfort level."
            value={protectionYears}
            onChange={setProtectionYears}
          />
          <DollarField
            label="Current auto liability limit"
            hint="Your policy's per-accident bodily injury limit"
            value={autoLimit}
            onChange={setAutoLimit}
            step={5_000}
          />
          <DollarField
            label="Current home / renters liability limit"
            hint="Your policy's per-occurrence personal liability limit"
            value={homeLimit}
            onChange={setHomeLimit}
            step={5_000}
          />
          <DollarField
            label="Your umbrella insurer's required minimum (if known)"
            hint="Optional — leave at $0 if you haven't asked yet"
            value={insurerMinimum}
            onChange={setInsurerMinimum}
            step={5_000}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED UMBRELLA LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.alreadyCovered ? "$0" : USD.format(result.suggestedUmbrella)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.alreadyCovered
                ? "Your underlying limits already reach your target protection level. Umbrella policies are typically sold starting at $1,000,000 in $1,000,000 increments if you'd still like a buffer above that."
                : `Rounded up to the nearest common $1,000,000 increment most umbrella insurers sell in.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Target protection" value={USD.format(result.targetProtection)} />
            <Figure label="Current underlying limit" value={USD.format(result.effectiveUnderlying)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Underlying limit requirement</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasInsurerMinimum
                  ? "You haven't entered a required minimum. Umbrella insurers won't issue a policy until your auto and home/renters liability limits already meet a minimum the carrier sets itself, and that figure varies by insurer. Ask your prospective umbrella insurer directly what theirs is before assuming your current limits qualify."
                  : result.meetsKnownMinimum
                    ? `Both your auto and home/renters limits meet the ${USD.format(insurerMinimum)} minimum you entered.`
                    : `At least one of your limits is below the ${USD.format(insurerMinimum)} minimum you entered${
                        !result.autoMeetsMinimum && !result.homeMeetsMinimum
                          ? " (both auto and home/renters)"
                          : !result.autoMeetsMinimum
                            ? " (auto liability)"
                            : " (home/renters liability)"
                      }. Raise the affected limit first, since carrying an umbrella without meeting the underlying requirement can leave part of a claim uncovered.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Total protection after this umbrella</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.alreadyCovered
                  ? `Your current underlying limits alone already total ${USD.format(result.effectiveUnderlying)}, at or above your ${USD.format(result.targetProtection)} target.`
                  : `${USD.format(result.effectiveUnderlying)} underlying plus ${USD.format(result.suggestedUmbrella)} umbrella brings total liability protection to about ${USD.format(result.totalAfterUmbrella)}, at or above your ${USD.format(result.targetProtection)} target.`}
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
        Estimate only. This tool models a commonly used asset-and-income protection method for sizing an
        umbrella limit; it is not a quote, and it does not know a specific umbrella insurer&apos;s underwriting
        rules or their exact required underlying minimum, which varies by carrier. Confirm both the exact
        underlying limit requirement and the price with a licensed insurance agent before buying or
        changing a policy.
      </div>
    </div>
  );
}

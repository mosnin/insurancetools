"use client";

/**
 * Dwelling coverage (Coverage A) calculator.
 *
 * Unlike a formula-driven estimator, this tool starts from a rebuild cost
 * the user already has in hand — from a licensed appraisal, a contractor
 * estimate, or InsuranceTools' own replacement cost calculator — since
 * fabricating a per-square-foot rebuild figure here would be exactly the
 * kind of invented data point this site avoids. From that number it layers
 * two decisions the user actually controls: whether to fold a detached
 * structure's value into Coverage A, and whether to add a voluntary buffer
 * against rising material and labor costs.
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
  prefix?: string;
  suffix?: string;
  step?: number;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  max = 10_000_000,
  prefix = "$",
  suffix,
  step = 100,
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
          min={0}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-10" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
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

export function DwellingCoverageCalculatorTool() {
  const [rebuildCost, setRebuildCost] = useState(0);
  const [detachedValue, setDetachedValue] = useState(0);
  const [includeDetached, setIncludeDetached] = useState(false);
  const [bufferPct, setBufferPct] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasRebuildCost = rebuildCost > 0;
    const clampedBuffer = Number.isFinite(bufferPct) ? Math.min(Math.max(bufferPct, 0), 50) : 0;
    const bufferedCost = rebuildCost * (1 + clampedBuffer / 100);
    const bufferAmount = bufferedCost - rebuildCost;
    const detachedApplied = includeDetached ? detachedValue : 0;
    const recommendedDwellingCoverage = bufferedCost + detachedApplied;
    const coverageBSuggestion = includeDetached ? 0 : detachedValue;

    return {
      hasRebuildCost,
      clampedBuffer,
      bufferedCost,
      bufferAmount,
      detachedApplied,
      recommendedDwellingCoverage,
      coverageBSuggestion,
    };
  }, [rebuildCost, detachedValue, includeDetached, bufferPct]);

  async function copyResult() {
    const lines = [
      "Dwelling coverage (Coverage A) estimate",
      `Rebuild cost entered: ${USD.format(rebuildCost)}`,
      result.clampedBuffer > 0
        ? `Cost-inflation buffer: +${result.clampedBuffer}% (${USD.format(result.bufferAmount)})`
        : "Cost-inflation buffer: none applied",
      includeDetached
        ? `Detached structures folded into Coverage A: ${USD.format(detachedValue)}`
        : detachedValue > 0
          ? `Detached structures kept separate (suggested Coverage B): ${USD.format(detachedValue)}`
          : "Detached structures: none entered",
      `Recommended dwelling coverage (Coverage A): ${USD.format(result.recommendedDwellingCoverage)}`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/home/dwelling-coverage-calculator",
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
        <span className="label-mono text-slate-500">DWELLING COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Estimated rebuild cost"
            hint="From an appraisal, contractor estimate, or a replacement cost calculator — not your home's market value"
            value={rebuildCost}
            onChange={setRebuildCost}
          />
          <NumberField
            label="Detached structures value"
            hint="Optional — a detached garage, shed, or fence you want reflected here"
            value={detachedValue}
            onChange={setDetachedValue}
          />

          <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
            <input
              type="checkbox"
              checked={includeDetached}
              onChange={(e) => setIncludeDetached(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              <span className="block text-[13px] font-medium text-slate-700">
                Fold detached structures into Coverage A
              </span>
              <span className="mt-0.5 block text-xs text-slate-400">
                Leave unchecked to keep it as a separate Coverage B figure instead. Most standard
                policies already include a set percentage of Coverage A for Coverage B automatically —
                check your own policy before assuming you need to add this manually.
              </span>
            </span>
          </label>

          <NumberField
            label="Cost-inflation buffer"
            hint="Optional cushion some homeowners add against rising material and labor costs, not a required figure"
            value={bufferPct}
            onChange={setBufferPct}
            prefix=""
            suffix="%"
            max={50}
            step={1}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">RECOMMENDED DWELLING COVERAGE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.hasRebuildCost ? USD.format(result.recommendedDwellingCoverage) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasRebuildCost
                ? "This is the Coverage A limit to compare against your current policy declarations page."
                : "Enter your rebuild cost to see a recommended Coverage A limit."}
            </p>
          </div>

          {result.hasRebuildCost && (
            <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
              <Figure label="Rebuild cost" value={USD.format(rebuildCost)} />
              <Figure
                label="Inflation buffer"
                value={result.clampedBuffer > 0 ? `+${USD.format(result.bufferAmount)}` : "None"}
                tone={result.clampedBuffer > 0 ? "accent" : "default"}
              />
            </div>
          )}

          {result.coverageBSuggestion > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              You entered {USD.format(detachedValue)} for detached structures but left them out of
              Coverage A above. Check your policy&apos;s Coverage B (Other Structures) limit to confirm it
              already accounts for this amount.
            </div>
          )}

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">How this number is built</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasRebuildCost
                  ? "Enter a rebuild cost to see the breakdown."
                  : includeDetached && detachedValue > 0
                    ? `${USD.format(rebuildCost)} rebuild cost, plus ${USD.format(result.bufferAmount)} buffer, plus ${USD.format(detachedValue)} in detached structures folded into Coverage A.`
                    : `${USD.format(rebuildCost)} rebuild cost, plus ${USD.format(result.bufferAmount)} buffer. Detached structures were kept out of this total.`}
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
        Estimate only. This tool does not calculate a rebuild cost for you and does not know your home&apos;s
        construction type, square footage, finishes, or local labor and material costs — it only totals
        the figures you supply. Confirm your actual rebuild cost with a licensed appraiser, a contractor,
        or your insurer, and review the resulting limit with a licensed insurance agent before changing a
        policy.
      </div>
    </div>
  );
}

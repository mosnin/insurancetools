"use client";

/**
 * Uninsured/underinsured motorist (UM/UIM) coverage calculator.
 *
 * Uses the standard, widely cited "mirror your own liability limit" method:
 * your UM/UIM limit should match your own bodily injury liability limit, so
 * you're protected against an at-fault driver at least as well as you're
 * required to protect other people. The tool also lets a user compare that
 * recommendation against what they currently carry, and against a
 * user-editable hypothetical serious-accident cost, to see the dollar size
 * of any gap.
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

function NumberField({ label, hint, value, onChange, max = 10_000_000 }: NumberFieldProps) {
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
          step={1000}
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

export function UninsuredMotoristCoverageCalculatorTool() {
  const [biPerPerson, setBiPerPerson] = useState(100_000);
  const [biPerAccident, setBiPerAccident] = useState(300_000);
  const [currentUmPerPerson, setCurrentUmPerPerson] = useState(0);
  const [hypotheticalCost, setHypotheticalCost] = useState(150_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    // Standard mirroring method: recommend the same limit you already carry
    // for bodily injury liability, with a sane floor so a very low or
    // unentered liability limit doesn't produce a $0 recommendation.
    const recommendedPerPerson = Math.max(biPerPerson, 25_000);
    const recommendedPerAccident = Math.max(biPerAccident, recommendedPerPerson, 50_000);

    const hasCurrentUm = currentUmPerPerson > 0;
    const limitGap = hasCurrentUm ? Math.max(0, recommendedPerPerson - currentUmPerPerson) : null;
    const isUnderinsured = hasCurrentUm && limitGap !== null && limitGap > 0;

    const hasHypothetical = hypotheticalCost > 0;
    const shortfall =
      hasCurrentUm && hasHypothetical ? Math.max(0, hypotheticalCost - currentUmPerPerson) : null;
    const hasShortfall = shortfall !== null && shortfall > 0;

    return {
      recommendedPerPerson,
      recommendedPerAccident,
      hasCurrentUm,
      limitGap,
      isUnderinsured,
      hasHypothetical,
      shortfall,
      hasShortfall,
    };
  }, [biPerPerson, biPerAccident, currentUmPerPerson, hypotheticalCost]);

  async function copyResult() {
    const lines = [
      "Uninsured/underinsured motorist coverage recommendation",
      `Recommended UM/UIM limit: ${USD.format(result.recommendedPerPerson)} per person / ${USD.format(result.recommendedPerAccident)} per accident (matches your bodily injury liability limit)`,
      result.hasCurrentUm
        ? result.isUnderinsured
          ? `Current UM/UIM carried: ${USD.format(currentUmPerPerson)} per person, which is ${USD.format(result.limitGap ?? 0)} below your recommended limit`
          : `Current UM/UIM carried: ${USD.format(currentUmPerPerson)} per person, which already meets or exceeds your recommended limit`
        : "Current UM/UIM carried: not entered",
      result.hasShortfall
        ? `Hypothetical serious-accident cost of ${USD.format(hypotheticalCost)} vs. your current limit leaves an estimated shortfall of ${USD.format(result.shortfall ?? 0)}`
        : "Hypothetical serious-accident cost: enter your current UM/UIM limit to compare it against this figure",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/uninsured-motorist-coverage-calculator",
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
        <span className="label-mono text-slate-500">UNINSURED MOTORIST COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Your bodily injury liability limit, per person"
            hint="Found on your policy declarations page"
            value={biPerPerson}
            onChange={setBiPerPerson}
          />
          <NumberField
            label="Your bodily injury liability limit, per accident"
            hint="The total cap across everyone injured in one accident"
            value={biPerAccident}
            onChange={setBiPerAccident}
          />
          <NumberField
            label="UM/UIM limit you currently carry, per person"
            hint="Optional — leave at $0 if you're not sure or don't have this coverage yet"
            value={currentUmPerPerson}
            onChange={setCurrentUmPerPerson}
          />
          <NumberField
            label="Hypothetical serious-accident cost estimate"
            hint="Editable placeholder for medical bills plus lost income, not a real statistic — adjust it to model your own scenario"
            value={hypotheticalCost}
            onChange={setHypotheticalCost}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">RECOMMENDED UM/UIM LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.recommendedPerPerson)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              per person / {USD.format(result.recommendedPerAccident)} per accident, mirroring your own
              bodily injury liability limit
            </p>
          </div>

          {result.hasCurrentUm && result.isUnderinsured && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              The {USD.format(currentUmPerPerson)} you currently carry is {USD.format(result.limitGap ?? 0)}{" "}
              below the limit that would match your own liability coverage. If an underinsured driver hurt
              you, your own policy would only make up part of that difference.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Current UM/UIM"
              value={result.hasCurrentUm ? USD.format(currentUmPerPerson) : "Not entered"}
            />
            <Figure
              label={result.hasShortfall ? "Estimated shortfall" : "Coverage gap"}
              value={
                result.hasShortfall
                  ? USD.format(result.shortfall ?? 0)
                  : result.hasCurrentUm
                    ? USD.format(result.limitGap ?? 0)
                    : "—"
              }
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Why UM/UIM coverage matters</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Uninsured motorist coverage pays for your injuries when the at-fault driver has no
                liability insurance at all; underinsured motorist coverage makes up the difference when
                their limit is too low to cover your losses. A meaningful share of drivers on the road
                carry no insurance or only their state&apos;s minimum required limit, which is exactly the
                gap this coverage is built to close.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Hypothetical scenario</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasCurrentUm
                  ? "Enter what you currently carry to see how it compares against the hypothetical cost estimate above."
                  : result.hasShortfall
                    ? `If a serious accident cost ${USD.format(hypotheticalCost)} in medical bills and lost income and the at-fault driver couldn't pay, your current ${USD.format(currentUmPerPerson)} UM/UIM limit would leave roughly ${USD.format(result.shortfall ?? 0)} uncovered.`
                    : `Your current ${USD.format(currentUmPerPerson)} UM/UIM limit would cover the ${USD.format(hypotheticalCost)} hypothetical cost above, based on the figures entered.`}
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
        Estimate only. This tool models the commonly used &ldquo;match your own liability limit&rdquo; method for
        sizing UM/UIM coverage; it is not a quote, and it does not know your state&apos;s specific UM/UIM
        rules, which vary and in some states are opt-out or capped differently than liability limits. The
        hypothetical cost figure is an editable placeholder for you to adjust, not a real statistic about
        any specific accident. Confirm your state&apos;s UM/UIM rules and get an exact price from a licensed
        agent before buying or changing a policy.
      </div>
    </div>
  );
}

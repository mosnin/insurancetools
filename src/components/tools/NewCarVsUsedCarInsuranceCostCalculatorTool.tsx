"use client";

/**
 * New car vs. used car insurance cost calculator.
 *
 * This tool does not estimate or invent a premium for either vehicle — the
 * user supplies their own quoted (or estimated) annual collision and
 * comprehensive premium for each scenario, since actual pricing depends on
 * underwriting factors this tool has no access to (driving record, location,
 * insurer, credit-based score where allowed, etc.). What the tool does
 * calculate is how each entered premium compares to the vehicle's value:
 * premium as a percentage of value, and whether that percentage crosses the
 * commonly cited "10% rule" threshold used elsewhere on this site to flag
 * when collision/comprehensive may be worth reconsidering relative to a
 * vehicle's value. Side by side, this turns two disconnected quotes into a
 * single, comparable answer to "does the new car really cost that much more
 * to insure, relative to what it's worth?"
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

const PCT = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 500_000 }: NumberFieldProps) {
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

interface ScenarioInput {
  label: string;
  value: number;
  premium: number;
}

interface ScenarioResult extends ScenarioInput {
  pctOfValue: number;
  tenPercentThreshold: number;
  overThreshold: boolean;
  hasData: boolean;
}

function scoreScenario(input: ScenarioInput): ScenarioResult {
  const hasData = input.value > 0 && input.premium > 0;
  const pctOfValue = input.value > 0 ? (input.premium / input.value) * 100 : 0;
  const tenPercentThreshold = input.value * 0.1;
  const overThreshold = hasData && input.premium > tenPercentThreshold;
  return { ...input, pctOfValue, tenPercentThreshold, overThreshold, hasData };
}

export function NewCarVsUsedCarInsuranceCostCalculatorTool() {
  const [newValue, setNewValue] = useState(32_000);
  const [newPremium, setNewPremium] = useState(1_100);
  const [usedValue, setUsedValue] = useState(14_000);
  const [usedPremium, setUsedPremium] = useState(780);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const newCar = scoreScenario({ label: "New car", value: newValue, premium: newPremium });
    const usedCar = scoreScenario({ label: "Used car", value: usedValue, premium: usedPremium });

    const bothEntered = newCar.hasData && usedCar.hasData;
    const premiumDifference = newCar.premium - usedCar.premium;
    const pctPointDifference = newCar.pctOfValue - usedCar.pctOfValue;

    return { newCar, usedCar, bothEntered, premiumDifference, pctPointDifference };
  }, [newValue, newPremium, usedValue, usedPremium]);

  async function copyResult() {
    const { newCar, usedCar } = result;
    const lines = [
      "New car vs. used car insurance cost comparison",
      `New car: ${USD.format(newCar.value)} value, ${USD.format(newCar.premium)}/year collision+comprehensive (${PCT.format(newCar.pctOfValue / 100)} of value)${newCar.hasData ? (newCar.overThreshold ? " — above the 10% guideline" : " — within the 10% guideline") : ""}`,
      `Used car: ${USD.format(usedCar.value)} value, ${USD.format(usedCar.premium)}/year collision+comprehensive (${PCT.format(usedCar.pctOfValue / 100)} of value)${usedCar.hasData ? (usedCar.overThreshold ? " — above the 10% guideline" : " — within the 10% guideline") : ""}`,
      result.bothEntered
        ? `Difference: ${USD.format(Math.abs(result.premiumDifference))}/year ${result.premiumDifference >= 0 ? "more" : "less"} to insure the new car, a ${Math.abs(result.pctPointDifference).toFixed(1)} point difference in premium as a percentage of value.`
        : "Enter both premiums to see the comparison.",
      "Premiums are user-entered quotes, not generated by this tool. Estimate only, not insurance advice. insurancetools.org/tools/auto/new-car-vs-used-car-insurance-cost-calculator",
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

  const { newCar, usedCar } = result;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="label-mono text-slate-500">NEW VS USED CAR INSURANCE COST CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2">
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="label-mono text-blue-600">VEHICLE A — NEW CAR</p>
          <NumberField
            label="New car's value"
            hint="Purchase price or current market value"
            value={newValue}
            onChange={setNewValue}
          />
          <NumberField
            label="Quoted annual collision + comprehensive premium"
            hint="The portion of your quote covering damage to this car"
            value={newPremium}
            onChange={setNewPremium}
          />
        </div>
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="label-mono text-slate-500">VEHICLE B — USED CAR</p>
          <NumberField
            label="Used car's value"
            hint="Actual cash value, what it would sell for today"
            value={usedValue}
            onChange={setUsedValue}
          />
          <NumberField
            label="Quoted annual collision + comprehensive premium"
            hint="The portion of your quote covering damage to this car"
            value={usedPremium}
            onChange={setUsedPremium}
          />
        </div>
      </div>

      <div className="border-t border-hairline bg-white p-5 sm:p-6">
        <p className="label-mono text-slate-400">SIDE-BY-SIDE COMPARISON</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs text-slate-400">
                <th className="py-2 pr-3 font-medium">Scenario</th>
                <th className="py-2 pr-3 font-medium">Value</th>
                <th className="py-2 pr-3 font-medium">Annual premium</th>
                <th className="py-2 pr-3 font-medium">% of value</th>
                <th className="py-2 font-medium">10% rule</th>
              </tr>
            </thead>
            <tbody>
              {[newCar, usedCar].map((car) => (
                <tr key={car.label} className="border-b border-hairline last:border-0">
                  <td className="py-3 pr-3 font-medium text-slate-900">{car.label}</td>
                  <td className="py-3 pr-3 tabular-nums text-slate-700">{USD.format(car.value)}</td>
                  <td className="py-3 pr-3 tabular-nums text-slate-700">{USD.format(car.premium)}</td>
                  <td className="py-3 pr-3 tabular-nums text-slate-700">
                    {car.hasData ? PCT.format(car.pctOfValue / 100) : "—"}
                  </td>
                  <td className="py-3">
                    {!car.hasData ? (
                      <span className="text-xs text-slate-400">Enter value &amp; premium</span>
                    ) : car.overThreshold ? (
                      <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Above 10%
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Within 10%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 border-t border-hairline pt-4">
          {result.bothEntered ? (
            <p className="text-xs leading-relaxed text-slate-600">
              The new car costs{" "}
              <span className="font-semibold tabular-nums text-slate-900">
                {USD.format(Math.abs(result.premiumDifference))}
              </span>{" "}
              {result.premiumDifference >= 0 ? "more" : "less"} per year to insure than the used car, a
              difference of{" "}
              <span className="font-semibold tabular-nums text-slate-900">
                {Math.abs(result.pctPointDifference).toFixed(1)} percentage points
              </span>{" "}
              when each premium is measured against its own vehicle&apos;s value. A bigger dollar premium on
              the new car isn&apos;t automatically a worse deal — what matters is whether that premium is
              reasonable relative to what the car is actually worth, which is exactly what the % of value
              column above shows.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-slate-500">
              Enter a value and an annual collision + comprehensive premium for both vehicles to see the
              full comparison.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={copyResult}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. Both premiums are numbers you enter, typically from real quotes; this tool does not
        generate or look up pricing for you. The 10% rule is a commonly cited guideline, not a formula
        every advisor agrees with, and it does not account for whether you could actually afford to
        replace a vehicle out of pocket. Confirm actual pricing and coverage terms with a licensed
        insurance agent before buying or changing a policy.
      </div>
    </div>
  );
}

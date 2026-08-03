"use client";

/**
 * Product liability exposure calculator.
 *
 * This is a rough sizing tool, not an actuarial model. There is no universal
 * "industry standard" defect rate or claim cost that applies across product
 * categories, so both inputs are left for the business to supply from its
 * own quality-control data, claims history, or trade association benchmarks.
 * The calculator simply multiplies units shipped by the user's own assumed
 * defect rate and average cost per claim to produce a rough annual expected
 * exposure figure, meant to open a conversation with a commercial insurance
 * broker about product liability limits, not to replace one.
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

const UNITS = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function CurrencyField({ label, hint, value, onChange, max = 10_000_000, step = 100 }: CurrencyFieldProps) {
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

interface UnitFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function UnitField({ label, hint, value, onChange, max = 1_000_000_000, step = 100 }: UnitFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
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
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-12 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          units
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface PercentFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function PercentField({ label, hint, value, onChange, max = 100, step = 0.01 }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
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

export function ProductLiabilityExposureCalculatorTool() {
  const [unitsPerYear, setUnitsPerYear] = useState(50_000);
  const [defectRatePercent, setDefectRatePercent] = useState(0);
  const [avgClaimCost, setAvgClaimCost] = useState(25_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasUnits = unitsPerYear > 0;
    const hasDefectRate = defectRatePercent > 0;
    const hasClaimCost = avgClaimCost > 0;

    const expectedClaims = unitsPerYear * (defectRatePercent / 100);
    const exposure = expectedClaims * avgClaimCost;

    // A rough sensitivity band, not a confidence interval: defect-rate
    // estimates that come from a single internal QC snapshot are commonly
    // off by a factor of two in either direction, so showing half and
    // double the entered rate keeps the headline figure from reading as
    // more precise than the inputs behind it actually are.
    const lowExposure = exposure * 0.5;
    const highExposure = exposure * 2;

    const readyForEstimate = hasUnits && hasDefectRate && hasClaimCost;

    return {
      hasUnits,
      hasDefectRate,
      hasClaimCost,
      readyForEstimate,
      expectedClaims,
      exposure,
      lowExposure,
      highExposure,
    };
  }, [unitsPerYear, defectRatePercent, avgClaimCost]);

  async function copyResult() {
    const lines = [
      "Product liability exposure estimate",
      `Units per year: ${UNITS.format(unitsPerYear)}`,
      `Assumed defect rate: ${defectRatePercent}%`,
      `Average cost per claim: ${USD.format(avgClaimCost)}`,
      result.readyForEstimate
        ? `Rough expected claims per year: ${result.expectedClaims.toFixed(2)}`
        : "Enter units, a defect rate, and a cost per claim to generate an estimate.",
      result.readyForEstimate
        ? `Rough annual exposure estimate: ${USD.format(result.exposure)} (sensitivity range ${USD.format(result.lowExposure)}–${USD.format(result.highExposure)})`
        : "",
      "Rough sizing exercise only, not an actuarial calculation or a quote. Confirm actual limits with a commercial insurance broker. insurancetools.org/tools/business/product-liability-exposure-calculator",
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
        <span className="label-mono text-slate-500">PRODUCT LIABILITY EXPOSURE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <UnitField
            label="Units sold or shipped per year"
            hint="Total finished units your business ships annually"
            value={unitsPerYear}
            onChange={setUnitsPerYear}
          />
          <PercentField
            label="Your assumed defect rate"
            hint="No industry default exists here — use your own QC data, returns history, or a trade association benchmark for your specific product category"
            value={defectRatePercent}
            onChange={setDefectRatePercent}
          />
          <CurrencyField
            label="Average cost per claim"
            hint="Legal defense plus settlement average, based on your own research; a conservative starting placeholder is provided below for you to overwrite"
            value={avgClaimCost}
            onChange={setAvgClaimCost}
            step={500}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ROUGH ANNUAL EXPOSURE ESTIMATE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.readyForEstimate ? USD.format(result.exposure) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.readyForEstimate
                ? `Sensitivity range ${USD.format(result.lowExposure)}–${USD.format(result.highExposure)}, reflecting how uncertain a self-estimated defect rate typically is`
                : "Enter units per year, your assumed defect rate, and an average cost per claim to see an estimate."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Expected claims / year"
              value={result.hasUnits && result.hasDefectRate ? result.expectedClaims.toFixed(2) : "—"}
            />
            <Figure label="Units per year" value={UNITS.format(unitsPerYear)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Reading this number</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasDefectRate
                  ? "This calculator deliberately does not supply a default defect rate. Rates vary enormously between, say, a food product and a power tool, so an assumed default here would be more misleading than useful. Pull a rate from your own quality-control rejects, warranty returns, or a trade association study of your product category."
                  : result.readyForEstimate
                    ? `At ${defectRatePercent}% of ${UNITS.format(unitsPerYear)} units, roughly ${result.expectedClaims.toFixed(2)} claims a year at ${USD.format(avgClaimCost)} each produces this rough exposure figure. Use it to size a coverage-limit conversation, not as a claims forecast.`
                    : "Enter a cost per claim to complete the estimate."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">What this figure is not</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                It is not a substitute for an actuarial study, it does not include product recall costs (which
                typically need separate recall coverage), and it does not reflect how many standard commercial
                general liability policies apply a shared per-occurrence and aggregate limit across every claim
                type, not just product claims. A broker can translate this figure into an actual limit
                recommendation.
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
        Rough sizing exercise only, not an actuarial calculation, a quote, or insurance advice. Both the defect
        rate and the average cost per claim are numbers you supply; this tool does not fabricate or assume an
        industry-standard figure for either one. Confirm actual coverage limits, recall coverage, and pricing
        with a licensed commercial insurance broker before buying or changing a policy.
      </div>
    </div>
  );
}

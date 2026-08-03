"use client";

/**
 * Home replacement cost calculator.
 *
 * This tool deliberately does not supply a default local construction cost
 * per square foot. Construction costs vary by region, labor market, and
 * material pricing in ways this static tool cannot responsibly guess, and a
 * fabricated regional figure would be exactly the kind of made-up number the
 * project standards forbid. Instead the user researches their own local
 * cost-per-square-foot (from a local contractor, a regional builders'
 * association estimate, or an online construction cost estimator) and enters
 * it here. The tool's job is the arithmetic and the interpretation, not the
 * regional data.
 *
 * baseCost = squareFootage x costPerSqft
 * totalReplacementCost = baseCost x (1 + featureAdjustmentPct / 100)
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

const USD2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

interface SqftFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function SqftField({ label, hint, value, onChange }: SqftFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={50_000}
          step={10}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 50_000) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          sq ft
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface CostPerSqftFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function CostPerSqftField({ label, hint, value, onChange }: CostPerSqftFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={2_000}
          step={0.5}
          value={value === 0 ? "" : value}
          placeholder="0.00"
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 2_000) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-16 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          / sq ft
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
}

function PercentField({ label, hint, value, onChange }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={-50}
          max={200}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, -50), 200) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

export function HomeReplacementCostCalculatorTool() {
  const [squareFootage, setSquareFootage] = useState(2_000);
  const [costPerSqft, setCostPerSqft] = useState(0);
  const [featureAdjustmentPct, setFeatureAdjustmentPct] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasCost = costPerSqft > 0;
    const hasSqft = squareFootage > 0;
    const baseCost = squareFootage * costPerSqft;
    const adjustmentAmount = baseCost * (featureAdjustmentPct / 100);
    const totalReplacementCost = baseCost + adjustmentAmount;
    const isReady = hasCost && hasSqft;

    return {
      hasCost,
      hasSqft,
      baseCost,
      adjustmentAmount,
      totalReplacementCost,
      isReady,
    };
  }, [squareFootage, costPerSqft, featureAdjustmentPct]);

  async function copyResult() {
    const lines = [
      "Home replacement cost estimate",
      `Square footage: ${squareFootage.toLocaleString()} sq ft`,
      `Local cost per sq ft entered: ${result.hasCost ? USD2.format(costPerSqft) : "not entered"}`,
      `Feature adjustment: ${featureAdjustmentPct > 0 ? "+" : ""}${featureAdjustmentPct}%`,
      result.isReady
        ? `Base cost: ${USD.format(result.baseCost)}`
        : "Enter square footage and a local cost per square foot to calculate.",
      result.isReady ? `Estimated total replacement cost: ${USD.format(result.totalReplacementCost)}` : "",
      "Rough owner estimate only, not a professional replacement-cost appraisal. insurancetools.org/tools/home/home-replacement-cost-calculator",
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
        <span className="label-mono text-slate-500">HOME REPLACEMENT COST CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <SqftField
            label="Home's above-grade square footage"
            hint="Living area only — most local estimators exclude basements and garages"
            value={squareFootage}
            onChange={setSquareFootage}
          />
          <CostPerSqftField
            label="Local construction cost per sq ft"
            hint="Look this up from a local contractor, builders' association, or online construction cost estimator — this tool does not supply a default"
            value={costPerSqft}
            onChange={setCostPerSqft}
          />
          <PercentField
            label="Feature adjustment"
            hint="Optional. Use a positive % for high-end finishes, multiple stories, or detached structures; negative for a simpler-than-average build. Default 0%."
            value={featureAdjustmentPct}
            onChange={setFeatureAdjustmentPct}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED TOTAL REPLACEMENT COST</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.isReady ? USD.format(result.totalReplacementCost) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.isReady
                ? `${squareFootage.toLocaleString()} sq ft × ${USD2.format(costPerSqft)}/sq ft${
                    featureAdjustmentPct !== 0
                      ? `, adjusted ${featureAdjustmentPct > 0 ? "up" : "down"} ${Math.abs(featureAdjustmentPct)}%`
                      : ""
                  }`
                : "Enter your square footage and a local cost per square foot to see an estimate."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Base cost" value={result.hasSqft && result.hasCost ? USD.format(result.baseCost) : "—"} />
            <Figure
              label="Feature adjustment"
              value={
                result.hasSqft && result.hasCost
                  ? `${result.adjustmentAmount >= 0 ? "+" : "-"}${USD.format(Math.abs(result.adjustmentAmount))}`
                  : "—"
              }
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Where this number comes from</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasCost
                  ? "This tool intentionally leaves the cost-per-square-foot field blank. Construction costs vary too much by region and by month to responsibly default, so enter a figure you sourced locally."
                  : "This total is your square footage multiplied by the local cost per square foot you entered, then adjusted by your feature percentage. It reflects the accuracy of the number you put in, not an independent appraisal."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Replacement cost vs. market value</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Replacement cost is what it would cost to rebuild your home. It is not your home&apos;s sale
                price, and the two numbers can differ substantially, especially on land value or in a hot
                resale market.
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
        Rough owner-estimate only. This calculator does a single multiplication and percentage adjustment
        on the numbers you enter; it is not a professional replacement-cost appraisal and does not
        replicate the output of a formal insurer estimating tool such as Marshall &amp; Swift/Boeckh. Insurers
        typically order a dedicated replacement-cost estimate when writing or renewing a homeowners policy.
        Use this figure as a starting point for a conversation with a licensed agent or a local contractor,
        not as a final coverage amount.
      </div>
    </div>
  );
}

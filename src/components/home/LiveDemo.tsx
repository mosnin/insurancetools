"use client";

/**
 * A real calculator embedded in the landing page.
 *
 * The rest of the page can claim that results update as you type and that
 * the working is visible. This section proves both without asking anyone to
 * click through: move a slider and the break-even point, the savings curve,
 * and the threshold line all move with it.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BeamFrame } from "@/components/brand";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface YearPoint {
  year: number;
  cumulativeSavings: number;
}

/**
 * Cumulative premium savings from carrying a higher deductible, year by
 * year. This is the same math a deductible comparison calculator runs:
 * the point where cumulative savings crosses the extra out-of-pocket cost
 * is the break-even point.
 */
function project(monthlySavings: number, years: number): YearPoint[] {
  const points: YearPoint[] = [];
  for (let year = 0; year <= years; year++) {
    points.push({ year, cumulativeSavings: monthlySavings * 12 * year });
  }
  return points;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}

function Slider({ label, value, min, max, step, onChange, format }: SliderProps) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-slate-600">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-slate-900">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
      />
    </label>
  );
}

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1.5 text-lg font-semibold tabular-nums tracking-[-0.02em] sm:text-xl ${
          tone === "accent" ? "text-blue-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function LiveDemo() {
  const [monthlySavings, setMonthlySavings] = useState(28);
  const [deductibleIncrease, setDeductibleIncrease] = useState(500);
  const [years, setYears] = useState(5);

  const points = useMemo(() => project(monthlySavings, years), [monthlySavings, years]);
  const final = points[points.length - 1];
  const breakEvenMonths = monthlySavings > 0 ? deductibleIncrease / monthlySavings : Infinity;
  const netAtHorizon = final.cumulativeSavings - deductibleIncrease;
  const max = Math.max(final.cumulativeSavings, deductibleIncrease, 1);

  // Two lines: cumulative premium savings (grows), and the flat deductible
  // increase threshold. Where they cross is the break-even point.
  const width = 100;
  const height = 46;
  const toX = (i: number) => (i / Math.max(points.length - 1, 1)) * width;
  const toY = (v: number) => height - (v / max) * height;

  const savingsPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(2)},${toY(p.cumulativeSavings).toFixed(2)}`)
    .join(" ");
  const savingsArea = `${savingsPath} L${width},${height} L0,${height} Z`;
  const thresholdY = toY(deductibleIncrease).toFixed(2);
  const thresholdPath = `M0,${thresholdY} L${width},${thresholdY}`;

  return (
    <BeamFrame>
      <div className="panel overflow-hidden">
        {/* Panel chrome, so the demo reads as a tool rather than a form. */}
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
          <span className="label-mono text-slate-500">DEDUCTIBLE BREAK-EVEN CALCULATOR</span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="label-mono text-slate-400">LIVE</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2">
          <div className="space-y-5 bg-white p-5 sm:p-6">
            <Slider
              label="Monthly premium savings"
              value={monthlySavings}
              min={5}
              max={100}
              step={1}
              onChange={setMonthlySavings}
              format={(v) => USD.format(v)}
            />
            <Slider
              label="Deductible increase"
              value={deductibleIncrease}
              min={250}
              max={2000}
              step={50}
              onChange={setDeductibleIncrease}
              format={(v) => USD.format(v)}
            />
            <Slider
              label="Years without a claim"
              value={years}
              min={1}
              max={10}
              step={1}
              onChange={setYears}
              format={(v) => `${v} ${v === 1 ? "year" : "years"}`}
            />
          </div>

          <div className="flex flex-col justify-between gap-6 bg-white p-5 sm:p-6">
            <div>
              <p className="label-mono text-slate-400">BREAK-EVEN POINT</p>
              <p
                className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.03em] text-slate-900 sm:text-4xl"
                aria-live="polite"
              >
                {Number.isFinite(breakEvenMonths) ? `${breakEvenMonths.toFixed(1)} months` : "Never"}
              </p>
            </div>

            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              className="h-24 w-full"
              role="img"
              aria-label={`Cumulative premium savings reach ${USD.format(final.cumulativeSavings)} after ${years} years, crossing the ${USD.format(deductibleIncrease)} deductible increase at about ${Number.isFinite(breakEvenMonths) ? `${breakEvenMonths.toFixed(1)} months` : "no point in this window"}.`}
            >
              <path d={savingsArea} className="fill-blue-100" />
              <path d={savingsPath} className="fill-none stroke-blue-600" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
              <path
                d={thresholdPath}
                className="fill-none stroke-slate-400"
                strokeWidth="0.9"
                strokeDasharray="3 2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
              <Figure label={`Savings after ${years}y`} value={USD.format(final.cumulativeSavings)} />
              <Figure label={`Net after ${years}y`} value={USD.format(netAtHorizon)} tone="accent" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline bg-slate-50/60 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-slate-400">
            BREAK-EVEN MONTHS = DEDUCTIBLE INCREASE / MONTHLY PREMIUM SAVINGS
          </p>
          <Link
            href="/tools/deductibles"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Open deductible calculators
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </BeamFrame>
  );
}

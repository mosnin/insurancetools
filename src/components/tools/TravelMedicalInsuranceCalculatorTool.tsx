"use client";

/**
 * Travel medical insurance calculator.
 *
 * The core problem this tool solves: most U.S. travelers assume their
 * existing health insurance travels with them internationally. For many
 * plans, especially Original Medicare, that assumption is wrong or only
 * partly true. This tool does not look up country-specific medical costs
 * (that data is not something we fabricate) — instead it takes a daily
 * worst-case cost estimate the traveler supplies (informed by their own
 * research via travel.state.gov or their insurer) and multiplies it across
 * the trip length to show the uninsured exposure a travel medical policy is
 * priced against.
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

const EXPOSURE_CEILING_DEFAULT = 250_000;

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function NumberField({ label, hint, value, onChange, max = 1_000_000, step = 1, prefix, suffix }: NumberFieldProps) {
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
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${prefix ? "pl-7" : "pl-3"} ${
            suffix ? "pr-12" : "pr-3"
          } text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function TravelMedicalInsuranceCalculatorTool() {
  const [tripDays, setTripDays] = useState(10);
  const [dailyWorstCase, setDailyWorstCase] = useState(2_500);
  const [exposureCeiling, setExposureCeiling] = useState(EXPOSURE_CEILING_DEFAULT);
  const [quotedPremium, setQuotedPremium] = useState(85);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rawExposure = tripDays * dailyWorstCase;
    const cappedExposure = Math.min(rawExposure, exposureCeiling);
    const wasCapped = rawExposure > exposureCeiling;

    const hasPremium = quotedPremium > 0;
    const leverage = hasPremium ? cappedExposure / quotedPremium : 0;
    const premiumAsPercentOfExposure = cappedExposure > 0 && hasPremium ? (quotedPremium / cappedExposure) * 100 : 0;

    return {
      rawExposure,
      cappedExposure,
      wasCapped,
      hasPremium,
      leverage,
      premiumAsPercentOfExposure,
    };
  }, [tripDays, dailyWorstCase, exposureCeiling, quotedPremium]);

  async function copyResult() {
    const lines = [
      "Travel medical insurance exposure estimate",
      `Trip length: ${tripDays} day${tripDays === 1 ? "" : "s"}`,
      `Assumed worst-case daily medical cost: ${USD.format(dailyWorstCase)}`,
      `Estimated uninsured exposure: ${USD.format(result.cappedExposure)}${result.wasCapped ? ` (capped at ${USD.format(exposureCeiling)})` : ""}`,
      result.hasPremium
        ? `Quoted travel medical premium: ${USD.format(quotedPremium)} — that's roughly ${result.leverage.toFixed(0)}x leverage against the estimated exposure`
        : "Enter a quoted premium to compare it against the exposure",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/travel/travel-medical-insurance-calculator",
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
        <span className="label-mono text-slate-500">TRAVEL MEDICAL INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Trip length"
            hint="Total days abroad, including travel days"
            value={tripDays}
            onChange={setTripDays}
            max={365}
            suffix="days"
          />
          <NumberField
            label="Assumed worst-case daily medical cost"
            hint="Your own estimate for the destination — see the State Department link below before guessing"
            value={dailyWorstCase}
            onChange={setDailyWorstCase}
            max={100_000}
            step={100}
            prefix="$"
          />
          <NumberField
            label="Exposure ceiling"
            hint="Caps the worst-case math at a realistic maximum (e.g. a single serious hospitalization or evacuation)"
            value={exposureCeiling}
            onChange={setExposureCeiling}
            max={2_000_000}
            step={10_000}
            prefix="$"
          />
          <NumberField
            label="Quoted travel medical policy premium"
            hint="The total premium quoted for this trip"
            value={quotedPremium}
            onChange={setQuotedPremium}
            max={50_000}
            step={5}
            prefix="$"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED UNINSURED EXPOSURE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.cappedExposure)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {tripDays} day{tripDays === 1 ? "" : "s"} × {USD.format(dailyWorstCase)}/day
              {result.wasCapped ? `, capped at your ${USD.format(exposureCeiling)} ceiling` : ""} — this is what you
              could owe out of pocket abroad with no travel medical coverage.
            </p>
          </div>

          {result.hasPremium && result.cappedExposure > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              A {USD.format(quotedPremium)} premium against {USD.format(result.cappedExposure)} of estimated
              exposure is about {result.premiumAsPercentOfExposure < 1 ? "under 1%" : `${result.premiumAsPercentOfExposure.toFixed(1)}%`} of
              the exposure it&apos;s covering — roughly {result.leverage.toFixed(0)}x leverage for the premium.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Raw exposure (uncapped)" value={USD.format(result.rawExposure)} />
            <Figure
              label="Leverage vs. premium"
              value={result.hasPremium ? `${result.leverage.toFixed(0)}x` : "—"}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Does your current health plan already cover this?</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Original Medicare generally does not cover care received outside the United States except in
                narrow, specific circumstances. Many employer and marketplace PPO plans also shrink to
                out-of-network or emergency-only terms once you leave their network&apos;s geographic area, which
                usually stops at the U.S. border. Confirm your own plan&apos;s exact international terms directly
                with your insurer before assuming any of this exposure is already covered.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">What this number does not include</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                This is a rough worst-case exposure estimate, not a prediction of what you&apos;ll actually spend.
                It doesn&apos;t include medical evacuation costs on its own (often priced and purchased separately,
                and frequently far larger than routine treatment costs), trip cancellation, or lost baggage.
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
        Estimate only. The daily worst-case cost is a figure you supply, not a looked-up medical cost for any
        country; this tool does not know actual healthcare prices anywhere in the world. It is not a quote, and
        it does not know your existing health plan&apos;s specific international coverage terms. Confirm your
        plan&apos;s international terms with your insurer and compare travel medical policy details directly
        with a licensed agent before you buy or travel without coverage.
      </div>
    </div>
  );
}

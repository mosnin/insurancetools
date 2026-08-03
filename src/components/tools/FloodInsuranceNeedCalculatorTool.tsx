"use client";

/**
 * Flood insurance need calculator.
 *
 * This tool deliberately does NOT attempt to determine a user's FEMA flood
 * zone or actual flood risk — that requires real geographic/parcel data
 * this browser-only tool has no access to. What it does instead is compute
 * financial EXPOSURE: the dollar amount a homeowner would have zero
 * insurance coverage for in a flood, because standard homeowners policies
 * exclude flood damage (a well-established, widely published fact — see
 * FloodSmart.gov / NFIP). If the user optionally enters a flood insurance
 * premium quote, the tool frames that premium as a small fraction of the
 * exposure it would protect, to make the value proposition concrete without
 * ever claiming to know the user's actual risk.
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
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 10_000_000, step = 100 }: NumberFieldProps) {
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

export function FloodInsuranceNeedCalculatorTool() {
  const [dwellingValue, setDwellingValue] = useState(280_000);
  const [personalPropertyValue, setPersonalPropertyValue] = useState(60_000);
  const [annualPremiumQuote, setAnnualPremiumQuote] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalUninsuredFloodExposure = dwellingValue + personalPropertyValue;
    const hasPremium = annualPremiumQuote > 0;
    const hasExposure = totalUninsuredFloodExposure > 0;

    const exposureToPremiumRatio =
      hasPremium && annualPremiumQuote > 0 ? totalUninsuredFloodExposure / annualPremiumQuote : null;

    const premiumAsPercentOfExposure =
      hasPremium && hasExposure ? (annualPremiumQuote / totalUninsuredFloodExposure) * 100 : null;

    return {
      totalUninsuredFloodExposure,
      hasPremium,
      hasExposure,
      exposureToPremiumRatio,
      premiumAsPercentOfExposure,
    };
  }, [dwellingValue, personalPropertyValue, annualPremiumQuote]);

  async function copyResult() {
    const lines = [
      "Flood insurance exposure estimate",
      `Uninsured flood exposure (dwelling + personal property): ${USD.format(result.totalUninsuredFloodExposure)}`,
      "This is the amount a standard homeowners policy would leave uncovered in a flood, since flood damage is a standard homeowners exclusion.",
      result.hasPremium && result.premiumAsPercentOfExposure !== null
        ? `Entered flood insurance premium of ${USD.format(annualPremiumQuote)}/year is about ${result.premiumAsPercentOfExposure.toFixed(1)}% of the exposure it would protect.`
        : "Enter a flood insurance premium quote to see it compared against your exposure.",
      "This tool does not determine your FEMA flood zone or actual flood risk. Check your zone and get a quote at FloodSmart.gov.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/home/flood-insurance-need-calculator",
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
        <span className="label-mono text-slate-500">FLOOD INSURANCE NEED CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Dwelling value"
            hint="Rebuild/replacement cost of the structure itself, not market value"
            value={dwellingValue}
            onChange={setDwellingValue}
            step={1_000}
          />
          <NumberField
            label="Personal property value"
            hint="Furniture, appliances, electronics, and belongings inside the home"
            value={personalPropertyValue}
            onChange={setPersonalPropertyValue}
            step={1_000}
          />
          <NumberField
            label="Flood insurance premium quote"
            hint="Optional — enter an annual quote to see it compared against your exposure"
            value={annualPremiumQuote}
            onChange={setAnnualPremiumQuote}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">UNINSURED FLOOD EXPOSURE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalUninsuredFloodExposure)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              What a standard homeowners policy would leave you paying for out of pocket after a flood,
              since flood damage is a standard exclusion on those policies.
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            This number is not a risk score. It does not know your FEMA flood zone, elevation, or local
            flood history. It only totals what you&apos;d have zero coverage for if a flood happened and you
            had no flood policy.
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Dwelling" value={USD.format(dwellingValue)} />
            <Figure label="Personal property" value={USD.format(personalPropertyValue)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Premium vs. exposure</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasPremium && result.premiumAsPercentOfExposure !== null ? (
                  <>
                    A {USD.format(annualPremiumQuote)}/year premium is about{" "}
                    <span className="font-semibold text-slate-700">
                      {result.premiumAsPercentOfExposure.toFixed(1)}%
                    </span>{" "}
                    of your {USD.format(result.totalUninsuredFloodExposure)} exposure, roughly{" "}
                    {result.exposureToPremiumRatio ? Math.round(result.exposureToPremiumRatio) : "—"}x coverage
                    for every $1 of annual premium.
                  </>
                ) : (
                  "Enter a flood insurance premium quote to see what fraction of your exposure it would cost to cover per year."
                )}
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
        Estimate only. This tool cannot determine your FEMA flood zone, your property&apos;s actual flood
        risk, or whether flood insurance is legally required for your mortgage. It only totals your
        uninsured financial exposure from the numbers you enter. Check your flood zone and get an actual
        quote at{" "}
        <a
          href="https://www.floodsmart.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          FloodSmart.gov
        </a>
        , the National Flood Insurance Program&apos;s official site, or from a licensed insurance agent.
      </div>
    </div>
  );
}

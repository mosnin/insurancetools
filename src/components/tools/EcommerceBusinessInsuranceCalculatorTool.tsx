"use client";

/**
 * E-commerce business insurance calculator.
 *
 * Online sellers face three exposures a generic small business calculator
 * doesn't separate out: product liability (if you manufacture or
 * private-label what you sell), cyber/data breach liability (because every
 * order that runs through your store touches customer payment and personal
 * data), and business interruption from site or platform downtime, which has
 * nothing to do with a fire or flood and everything to do with a hosting
 * outage, a DDoS attack, or a payment processor failure.
 *
 * This tool does not price a policy. It sizes the interruption exposure
 * directly from numbers the seller already knows (daily revenue and a
 * downtime scenario), and it routes the product liability and cyber
 * questions to tiered starting-point guidance, since those two depend on
 * variables — product category, claims history, data volume, underwriting —
 * this page can't see. It also asks the one question that changes the
 * product liability answer entirely: does the seller manufacture or
 * private-label the product, or dropship/resell someone else's.
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

const INT_FORMAT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

type SourcingModel = "manufacture" | "dropship";

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CurrencyField({ label, hint, value, onChange, max = 50_000_000 }: CurrencyFieldProps) {
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
          step={100}
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

interface CountFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  suffix?: string;
}

function CountField({ label, hint, value, onChange, max = 1_000_000, suffix }: CountFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

interface Tier {
  min: number;
  label: string;
}

const PRODUCT_LIABILITY_TIERS: Tier[] = [
  { min: 0, label: "$1M per occurrence / $2M aggregate general liability with a product liability endorsement" },
  { min: 250_000, label: "$1M/$2M product liability, with underwriters looking closely at your product category" },
  { min: 1_000_000, label: "$2M/$4M or higher, often layered with a commercial umbrella policy" },
];

const CYBER_TIERS: Tier[] = [
  { min: 0, label: "$500,000–$1,000,000 in cyber liability" },
  { min: 5_000, label: "$1,000,000–$2,000,000 in cyber liability" },
  { min: 50_000, label: "$2,000,000–$5,000,000 in cyber liability" },
];

function tierFor(tiers: Tier[], value: number): string {
  let match = tiers[0].label;
  for (const tier of tiers) {
    if (value >= tier.min) match = tier.label;
  }
  return match;
}

export function EcommerceBusinessInsuranceCalculatorTool() {
  const [sourcing, setSourcing] = useState<SourcingModel>("manufacture");
  const [annualRevenue, setAnnualRevenue] = useState(300_000);
  const [annualOrders, setAnnualOrders] = useState(8_000);
  const [dailyRevenue, setDailyRevenue] = useState(1_200);
  const [downtimeDays, setDowntimeDays] = useState(3);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const interruptionExposure = dailyRevenue * downtimeDays;
    const productLiabilityTier = tierFor(PRODUCT_LIABILITY_TIERS, annualRevenue);
    const cyberTier = tierFor(CYBER_TIERS, annualOrders);
    const isDropship = sourcing === "dropship";

    return { interruptionExposure, productLiabilityTier, cyberTier, isDropship };
  }, [sourcing, annualRevenue, annualOrders, dailyRevenue, downtimeDays]);

  async function copyResult() {
    const lines = [
      "E-commerce business insurance planning summary",
      result.isDropship
        ? "Product liability: you dropship/resell, so the manufacturer's product liability coverage often applies first — confirm this in your supplier or vendor contract rather than assuming it."
        : `Product liability: you manufacture or private-label, so a starting point commonly seen is ${result.productLiabilityTier}.`,
      `Cyber/data breach: a starting point commonly seen at your order volume is ${result.cyberTier}.`,
      `Business interruption exposure: ${USD.format(dailyRevenue)}/day x ${downtimeDays} day(s) of downtime = ${USD.format(result.interruptionExposure)}.`,
      "Planning estimates only, not a quote or insurance advice. insurancetools.org/tools/business/ecommerce-business-insurance-calculator",
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
        <span className="label-mono text-slate-500">E-COMMERCE BUSINESS INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <span className="block text-[13px] font-medium text-slate-600">How do you source what you sell?</span>
            <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSourcing("manufacture")}
                aria-pressed={sourcing === "manufacture"}
                className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  sourcing === "manufacture"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                I manufacture or private-label my products
              </button>
              <button
                type="button"
                onClick={() => setSourcing("dropship")}
                aria-pressed={sourcing === "dropship"}
                className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  sourcing === "dropship"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                I dropship or resell products made by others
              </button>
            </div>
          </div>

          <CurrencyField
            label="Average annual online revenue"
            hint="Used to size product liability, only relevant if you manufacture or private-label"
            value={annualRevenue}
            onChange={setAnnualRevenue}
          />
          <CountField
            label="Customer orders processed per year"
            hint="A proxy for how much payment and personal data flows through your store"
            value={annualOrders}
            onChange={setAnnualOrders}
            suffix="orders/yr"
          />
          <CurrencyField
            label="Average daily online revenue"
            hint="Total sales on a typical day, before fees"
            value={dailyRevenue}
            onChange={setDailyRevenue}
          />
          <CountField
            label="Downtime scenario to model"
            hint="Days your store could plausibly be down from a hosting outage, DDoS attack, or platform failure"
            value={downtimeDays}
            onChange={setDowntimeDays}
            max={90}
            suffix="days"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED DOWNTIME EXPOSURE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.interruptionExposure)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(dailyRevenue)}/day of lost revenue &times; {INT_FORMAT.format(downtimeDays)} day
              {downtimeDays === 1 ? "" : "s"} of modeled downtime
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Orders per year" value={INT_FORMAT.format(annualOrders)} />
            <Figure label="Sourcing model" value={result.isDropship ? "Dropship / resell" : "Manufacture / private-label"} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Product liability</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.isDropship
                  ? "Dropshippers commonly rely on the manufacturer's or supplier's product liability coverage rather than carrying their own, but that only holds up if your supplier contract actually says so. Confirm it in writing rather than assuming it, and ask whether you're named as an additional insured."
                  : `At ${USD.format(annualRevenue)}/year in revenue, a starting point commonly seen is ${result.productLiabilityTier}. Exact needs depend on your product category and claims history — the product liability exposure calculator linked below models this in more depth.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Cyber / data breach coverage</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {`At about ${INT_FORMAT.format(annualOrders)} orders/year, a starting point commonly seen is ${result.cyberTier}. Storing or processing any customer payment or personal data raises this regardless of sourcing model — the cyber insurance coverage calculator linked below sizes this more precisely.`}
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
        Estimate only. The downtime figure is a direct calculation from the numbers you enter; the product
        liability and cyber coverage ranges are commonly seen starting points, not underwritten quotes, and
        they don&apos;t know your product category, claims history, payment processor, or state. Confirm your
        actual exposure and any marketplace-specific insurance requirement with a licensed commercial
        insurance agent and your platform&apos;s current seller agreement before buying or changing coverage.
      </div>
    </div>
  );
}

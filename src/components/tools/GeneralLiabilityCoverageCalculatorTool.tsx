"use client";

/**
 * General liability insurance calculator.
 *
 * This is the flagship, most general tool in the Business category — it is
 * intentionally broad (any small business, any industry) rather than tuned
 * to one profession's exposures the way the contractor, restaurant,
 * consultant, and freelancer calculators built alongside it are. Those
 * narrower tools should be reached for when a business's exposure is
 * dominated by one specific risk; this one is the general-purpose starting
 * point.
 *
 * The recommendation is a needs-based tier, not a legal minimum: general
 * liability limits are not set by state law the way auto liability minimums
 * are. Instead, the calculator applies a widely used commercial convention —
 * a $1,000,000 per-occurrence / $2,000,000 aggregate CGL policy as the
 * common baseline many landlords, client contracts, and municipal permits
 * ask for — and steps up to a $2,000,000 / $4,000,000 tier (the standard 2x
 * aggregate multiplier used across the CGL market) when revenue, customer
 * foot traffic, or working on clients' premises raises the business's
 * exposure. Every figure is clearly labeled as common practice, not a
 * requirement, and the user's own current limits (if entered) are compared
 * against the suggested tier to show the gap.
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

const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const REVENUE_STEP_UP_THRESHOLD = 2_000_000;
const INTERACTIONS_STEP_UP_THRESHOLD = 50_000;

interface LiabilityTier {
  label: string;
  perOccurrence: number;
  aggregate: number;
}

const BASELINE_TIER: LiabilityTier = { label: "$1M / $2M", perOccurrence: 1_000_000, aggregate: 2_000_000 };
const ELEVATED_TIER: LiabilityTier = { label: "$2M / $4M", perOccurrence: 2_000_000, aggregate: 4_000_000 };

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CurrencyField({ label, hint, value, onChange, max = 100_000_000 }: CurrencyFieldProps) {
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
}

function CountField({ label, hint, value, onChange, max = 5_000_000 }: CountFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        step={10}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const raw = Number(e.target.value);
          const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
          onChange(clamped);
        }}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "warn" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "warn" ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function GeneralLiabilityCoverageCalculatorTool() {
  const [annualRevenue, setAnnualRevenue] = useState(350_000);
  const [annualInteractions, setAnnualInteractions] = useState(4_000);
  const [worksOnClientPremises, setWorksOnClientPremises] = useState<"yes" | "no">("no");
  const [currentPerOccurrence, setCurrentPerOccurrence] = useState(0);
  const [currentAggregate, setCurrentAggregate] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const reasons: string[] = [];
    const revenueTriggers = annualRevenue > REVENUE_STEP_UP_THRESHOLD;
    const interactionsTrigger = annualInteractions > INTERACTIONS_STEP_UP_THRESHOLD;
    const premisesTrigger = worksOnClientPremises === "yes";

    if (revenueTriggers) {
      reasons.push(
        `Annual revenue above ${USD.format(REVENUE_STEP_UP_THRESHOLD)} often brings larger contracts with higher insurance requirements attached.`
      );
    }
    if (interactionsTrigger) {
      reasons.push(
        `More than ${COMPACT.format(INTERACTIONS_STEP_UP_THRESHOLD)} customer visits or interactions a year raises the odds of a slip-and-fall or property-damage claim simply from higher foot traffic.`
      );
    }
    if (premisesTrigger) {
      reasons.push(
        "Working on a client's premises is a common trigger for that client's contract to require a specific liability limit and an additional insured endorsement."
      );
    }

    const stepUp = revenueTriggers || interactionsTrigger || premisesTrigger;
    const tier = stepUp ? ELEVATED_TIER : BASELINE_TIER;

    const hasCurrentLimits = currentPerOccurrence > 0 || currentAggregate > 0;
    const perOccurrenceGap = hasCurrentLimits ? Math.max(0, tier.perOccurrence - currentPerOccurrence) : 0;
    const aggregateGap = hasCurrentLimits ? Math.max(0, tier.aggregate - currentAggregate) : 0;
    const meetsOrExceeds = hasCurrentLimits && perOccurrenceGap === 0 && aggregateGap === 0;

    return {
      tier,
      reasons,
      stepUp,
      hasCurrentLimits,
      perOccurrenceGap,
      aggregateGap,
      meetsOrExceeds,
      premisesTrigger,
    };
  }, [annualRevenue, annualInteractions, worksOnClientPremises, currentPerOccurrence, currentAggregate]);

  async function copyResult() {
    const lines = [
      "General liability coverage recommendation",
      `Suggested tier: ${result.tier.label} (${USD.format(result.tier.perOccurrence)} per occurrence / ${USD.format(result.tier.aggregate)} aggregate)`,
      result.reasons.length
        ? `Reasons for the higher tier: ${result.reasons.length} factor(s) flagged — see the tool for details`
        : "Baseline tier applies — no elevated-exposure factors flagged",
      result.hasCurrentLimits
        ? result.meetsOrExceeds
          ? "Your current limits already meet or exceed this suggested tier"
          : `Gap vs. current limits: ${USD.format(result.perOccurrenceGap)} per occurrence, ${USD.format(result.aggregateGap)} aggregate`
        : "Enter your current limits to see the gap vs. this suggested tier",
      "Estimate only, not a quote, legal requirement, or insurance advice. insurancetools.org/tools/business/general-liability-coverage-calculator",
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
        <span className="label-mono text-slate-500">GENERAL LIABILITY INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <CurrencyField
            label="Annual business revenue"
            hint="Gross revenue for the last 12 months"
            value={annualRevenue}
            onChange={setAnnualRevenue}
          />
          <CountField
            label="Client or customer visits/interactions per year"
            hint="A foot-traffic proxy — count in-person visits, deliveries, or service calls"
            value={annualInteractions}
            onChange={setAnnualInteractions}
          />
          <label className="block">
            <span className="block text-[13px] font-medium text-slate-600">
              Do you or your employees work at clients&apos; premises?
            </span>
            <span className="mt-1.5 flex gap-2">
              {(["no", "yes"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setWorksOnClientPremises(option)}
                  aria-pressed={worksOnClientPremises === option}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                    worksOnClientPremises === option
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </span>
            <span className="mt-1 block text-xs text-slate-400">
              E.g. on-site service, installation, consulting, or repair work
            </span>
          </label>
          <div className="border-t border-hairline pt-4">
            <p className="mb-3 text-[13px] font-medium text-slate-600">Current limits (optional)</p>
            <div className="space-y-4">
              <CurrencyField
                label="Current per-occurrence limit"
                hint="Leave at $0 if you don't have a policy yet"
                value={currentPerOccurrence}
                onChange={setCurrentPerOccurrence}
                max={10_000_000}
              />
              <CurrencyField
                label="Current aggregate limit"
                hint="The total cap across all claims in the policy period"
                value={currentAggregate}
                onChange={setCurrentAggregate}
                max={20_000_000}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED COVERAGE TIER</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.tier.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.tier.perOccurrence)} per occurrence / {USD.format(result.tier.aggregate)} aggregate
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            {result.stepUp ? (
              <>
                <p className="font-semibold">Why the higher tier</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4">
                  {result.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>
                Based on what you entered, the $1M/$2M tier is a reasonable starting point — the common
                baseline that many landlords, client contracts, and municipal permits ask for. This isn&apos;t
                a legal minimum; general liability limits aren&apos;t set by state law the way auto insurance
                minimums are.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Per-occurrence limit" value={USD.format(result.tier.perOccurrence)} />
            <Figure label="Aggregate limit" value={USD.format(result.tier.aggregate)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Gap vs. your current limits</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasCurrentLimits
                  ? "Enter your current per-occurrence and aggregate limits to see how they compare to the suggested tier."
                  : result.meetsOrExceeds
                    ? "Your current limits already meet or exceed the suggested tier based on what you entered."
                    : `Your current limits fall short by ${USD.format(result.perOccurrenceGap)} per occurrence and ${USD.format(result.aggregateGap)} in aggregate compared to the suggested tier.`}
              </p>
            </div>
            {result.premisesTrigger && (
              <div>
                <p className="text-xs font-semibold text-slate-700">Additional insured</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Since you work on clients&apos; premises, expect some client contracts to ask you to add
                  them as an additional insured on your policy, which is a standard endorsement rather than
                  a separate policy.
                </p>
              </div>
            )}
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
        Estimate only. This tool models a common commercial convention — a $1M/$2M or $2M/$4M CGL tier —
        for planning purposes. It is not a quote, not legal advice, and it does not know your state, your
        industry&apos;s specific risk profile, or any contract, lease, or permit language that may set its own
        required limit. General liability does not cover professional errors, advice, or workmanship
        disputes; that falls under professional liability (errors and omissions) coverage instead. Confirm
        your actual requirements with your landlord, client contracts, and a licensed insurance agent
        before buying or changing a policy.
      </div>
    </div>
  );
}

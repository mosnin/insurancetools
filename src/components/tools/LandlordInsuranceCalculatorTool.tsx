"use client";

/**
 * Landlord insurance calculator.
 *
 * Landlord policies (often written on a "dwelling fire" DP-3 form) are a
 * different product from a standard homeowners policy, because a homeowners
 * policy is priced and underwritten around an owner-occupant living in the
 * home. This tool is for the owner of a rented-out property, not the tenant
 * living in it — tenants should use the renters insurance tools instead.
 *
 * It suggests three figures from three inputs:
 *   1. Dwelling coverage — passed through from the entered replacement cost,
 *      since that figure (not market value) is what a landlord policy should
 *      insure the structure for.
 *   2. Loss of rent coverage — monthly rent charged x the number of months
 *      of coverage the owner wants, a standard landlord-policy feature that
 *      replaces lost rental income while a covered loss makes the unit
 *      uninhabitable (conceptually similar to a homeowners policy's
 *      additional living expense benefit, but for lost income rather than a
 *      displaced household).
 *   3. A liability tier note, sized on the same logic used for a homeowner's
 *      liability limit, since a rented unit carries similar premises
 *      liability exposure, with a step-up flag for multi-unit properties or
 *      higher-value rentals.
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

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function DollarField({ label, hint, value, onChange, max = 10_000_000 }: DollarFieldProps) {
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

interface CountFieldProps {
  label: string;
  hint?: string;
  suffix: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function CountField({ label, hint, suffix, value, onChange, min = 0, max = 999 }: CountFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : min}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), min), max) : min;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-16 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          {suffix}
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

const LIABILITY_BASE = 300_000;
const LIABILITY_STEP_UP = 500_000;

export function LandlordInsuranceCalculatorTool() {
  const [replacementCost, setReplacementCost] = useState(280_000);
  const [monthlyRent, setMonthlyRent] = useState(1_800);
  const [coverageMonths, setCoverageMonths] = useState(12);
  const [units, setUnits] = useState(1);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const months = Math.min(Math.max(coverageMonths, 1), 24);
    const dwellingCoverage = replacementCost;
    const lossOfRentCoverage = monthlyRent * months;
    const totalConsidered = dwellingCoverage + lossOfRentCoverage;

    const highValueProperty = replacementCost > 500_000;
    const highRent = monthlyRent > 3_000;
    const multiUnit = units >= 2;
    const stepUpLiability = highValueProperty || highRent || multiUnit;
    const liabilityTier = stepUpLiability ? LIABILITY_STEP_UP : LIABILITY_BASE;

    const stepUpReasons: string[] = [];
    if (multiUnit) stepUpReasons.push(`${units} rental units on one property means more tenants and more premises-liability exposure events`);
    if (highRent) stepUpReasons.push("monthly rent above $3,000 typically signals a higher-value rental");
    if (highValueProperty) stepUpReasons.push("a replacement cost above $500,000 typically signals a larger or higher-value property");

    // Many landlord/dwelling fire policies bundle in loss of rent (also
    // called "fair rental value") automatically at a percentage of dwelling
    // coverage, commonly in the neighborhood of 20%, unless increased by
    // endorsement -- conceptually the same structure homeowners policies use
    // to size additional living expense off Coverage A. We flag, not assert,
    // since the exact percentage and whether it can be increased varies by
    // insurer and state.
    const typicalBuiltInLossOfRent = dwellingCoverage * 0.2;
    const exceedsTypicalBuiltIn = lossOfRentCoverage > typicalBuiltInLossOfRent;

    return {
      months,
      dwellingCoverage,
      lossOfRentCoverage,
      totalConsidered,
      liabilityTier,
      stepUpLiability,
      stepUpReasons,
      typicalBuiltInLossOfRent,
      exceedsTypicalBuiltIn,
    };
  }, [replacementCost, monthlyRent, coverageMonths, units]);

  async function copyResult() {
    const lines = [
      "Landlord insurance coverage estimate",
      `Suggested dwelling coverage: ${USD.format(result.dwellingCoverage)} (based on entered replacement cost)`,
      `Suggested loss of rent coverage: ${USD.format(result.lossOfRentCoverage)} (${USD.format(monthlyRent)}/mo x ${result.months} months)`,
      `Liability coverage note: consider at least ${USD.format(result.liabilityTier)}${result.stepUpLiability ? " (stepped up based on your inputs)" : ""}`,
      result.exceedsTypicalBuiltIn
        ? "Your requested loss of rent coverage is above the roughly 20% of dwelling coverage many landlord policies include by default -- ask your agent whether it needs to be increased by endorsement."
        : "Your requested loss of rent coverage is within the range many landlord policies include by default, but confirm the exact figure with your policy.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/business/landlord-insurance-calculator",
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
        <span className="label-mono text-slate-500">LANDLORD INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Property replacement cost"
            hint="Cost to rebuild the structure today, not its market or sale value"
            value={replacementCost}
            onChange={setReplacementCost}
          />
          <DollarField
            label="Monthly rent charged"
            hint="The rent you currently collect for this unit"
            value={monthlyRent}
            onChange={setMonthlyRent}
            max={100_000}
          />
          <CountField
            label="Loss of rent coverage period"
            hint="Months of lost rent you want covered if the unit becomes uninhabitable"
            suffix="months"
            value={coverageMonths}
            onChange={setCoverageMonths}
            min={1}
            max={24}
          />
          <CountField
            label="Rental units at this property"
            hint="1 for a single-family rental; 2+ for a duplex or small multi-unit building"
            suffix="units"
            value={units}
            onChange={setUnits}
            min={1}
            max={20}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED DWELLING + LOSS OF RENT COVERAGE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalConsidered)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.dwellingCoverage)} dwelling coverage + {USD.format(result.lossOfRentCoverage)}{" "}
              loss of rent coverage ({result.months} months), shown together for planning only -- these are
              separate limits on a policy, not one combined number.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Dwelling coverage" value={USD.format(result.dwellingCoverage)} />
            <Figure label="Loss of rent coverage" value={USD.format(result.lossOfRentCoverage)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Liability coverage note</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Consider at least {USD.format(result.liabilityTier)} in landlord liability coverage, sized
                using the same logic many owners use for a homeowner&apos;s liability limit, since a rented
                unit carries similar premises-liability exposure (a tenant or visitor injury on the
                property).
                {result.stepUpLiability && result.stepUpReasons.length > 0 && (
                  <> Stepped up from the {USD.format(LIABILITY_BASE)} baseline because {result.stepUpReasons.join(" and ")}.</>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Loss of rent vs. what&apos;s typically built in</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.exceedsTypicalBuiltIn
                  ? `Many landlord (dwelling fire) policies include loss of rent coverage automatically around 20% of dwelling coverage (about ${USD.format(result.typicalBuiltInLossOfRent)} here) unless increased by endorsement. Your requested ${USD.format(result.lossOfRentCoverage)} is above that typical default, so ask your agent to confirm it's increased to match.`
                  : `Your requested ${USD.format(result.lossOfRentCoverage)} is within the range many landlord policies include by default (commonly around 20% of dwelling coverage, or roughly ${USD.format(result.typicalBuiltInLossOfRent)} here). Confirm the exact percentage and any monthly cap in your own policy.`}
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
        Estimate only. This tool is for owners of a rented-out property, not tenants -- if you rent your
        home, use the renters insurance tools instead. It models common landlord (dwelling fire / DP-3)
        policy structure; it is not a quote, and it does not know your insurer&apos;s underwriting rules,
        your state or municipality&apos;s landlord-tenant law, or any lender requirement on your mortgage.
        Confirm exact figures with a licensed insurance agent before buying or changing a policy.
      </div>
    </div>
  );
}

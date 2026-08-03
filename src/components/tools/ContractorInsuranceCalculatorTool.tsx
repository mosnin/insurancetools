"use client";

/**
 * Contractor insurance calculator.
 *
 * Contractors face a package-shaped insurance decision, not a single-number
 * one: general liability sized to what the job actually requires, a
 * tools-and-equipment (inland marine) floater sized to what they own, and a
 * workers' comp flag the moment they carry a single employee. This tool
 * treats those as three separate, additive lines instead of collapsing them
 * into one generic "how much insurance do I need" answer.
 *
 * The general liability tier is driven by the largest single project value
 * the user enters, not their revenue. That mirrors how GL requirements show
 * up in the real world: a general contractor, property manager, or client
 * writes a required minimum limit into the contract itself, and that
 * required limit tends to scale with the size and risk of the job, not with
 * the contractor's total annual revenue. Revenue still matters, which is why
 * a high revenue split across many mid-size jobs gets its own aggregate-limit
 * note, since a shared aggregate can run out faster with more jobs per year.
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

interface GLTier {
  label: string;
  perOccurrence: number;
  aggregate: number;
  umbrellaSuggested: number;
}

const GL_TIERS: GLTier[] = [
  { label: "$1M / $2M", perOccurrence: 1_000_000, aggregate: 2_000_000, umbrellaSuggested: 0 },
  { label: "$2M / $4M", perOccurrence: 2_000_000, aggregate: 4_000_000, umbrellaSuggested: 1_000_000 },
  { label: "$1M / $2M + excess", perOccurrence: 1_000_000, aggregate: 2_000_000, umbrellaSuggested: 5_000_000 },
];

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 50_000_000 }: NumberFieldProps) {
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
          step={500}
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

export function ContractorInsuranceCalculatorTool() {
  const [annualRevenue, setAnnualRevenue] = useState(350_000);
  const [largestProject, setLargestProject] = useState(180_000);
  const [equipmentValue, setEquipmentValue] = useState(45_000);
  const [hasEmployees, setHasEmployees] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const tier =
      largestProject <= 1_000_000
        ? GL_TIERS[0]
        : largestProject <= 5_000_000
          ? GL_TIERS[1]
          : GL_TIERS[2];

    // Many general contractor and client agreements write a required GL
    // limit directly into the contract, and that required limit commonly
    // scales with the size and risk of the job rather than the
    // contractor's total revenue — this is a widely used contracting
    // convention, not a fixed rule every contract follows.
    const jobsPerYear = largestProject > 0 ? annualRevenue / largestProject : 0;
    const manySmallerJobs = jobsPerYear >= 4 && annualRevenue > 0;

    const smallToolsSublimit = 2_500;
    const equipmentGapAboveSublimit = Math.max(0, equipmentValue - smallToolsSublimit);
    const needsToolsFloater = equipmentGapAboveSublimit > 0;

    const suggestsBuildersRisk = largestProject >= 250_000;

    return {
      tier,
      jobsPerYear,
      manySmallerJobs,
      smallToolsSublimit,
      equipmentGapAboveSublimit,
      needsToolsFloater,
      suggestsBuildersRisk,
    };
  }, [annualRevenue, largestProject, equipmentValue]);

  async function copyResult() {
    const lines = [
      "Contractor insurance package estimate",
      `General liability: ${result.tier.label} (${USD.format(result.tier.perOccurrence)} per occurrence / ${USD.format(result.tier.aggregate)} aggregate)`,
      result.tier.umbrellaSuggested > 0
        ? `Consider an umbrella or excess liability policy of roughly ${USD.format(result.tier.umbrellaSuggested)} on top of the general liability limit`
        : "No umbrella/excess policy flagged at this project size",
      `Tools & equipment (inland marine): ${
        result.needsToolsFloater
          ? `schedule roughly ${USD.format(equipmentValue)} — most GL policies only include a small tools sublimit (around ${USD.format(result.smallToolsSublimit)})`
          : "your entered equipment value fits inside a typical small-tools sublimit"
      }`,
      hasEmployees
        ? "Workers' compensation: required in most states once you have employees — confirm your state's exact rule"
        : "Workers' compensation: not flagged since you indicated no employees, but re-check this the moment you hire your first one",
      result.suggestsBuildersRisk
        ? "Builder's risk: worth discussing for this project size if you're the party responsible for materials or work in progress"
        : "Builder's risk: usually most relevant on larger new-construction or renovation jobs",
      "Estimate only, not a quote, contract review, or insurance advice. insurancetools.org/tools/business/contractor-insurance-calculator",
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
        <span className="label-mono text-slate-500">CONTRACTOR INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Annual revenue"
            hint="Total billed across all jobs this year"
            value={annualRevenue}
            onChange={setAnnualRevenue}
          />
          <NumberField
            label="Largest single project value"
            hint="Many contracts set a required liability limit tied to this"
            value={largestProject}
            onChange={setLargestProject}
          />
          <NumberField
            label="Value of owned tools & equipment"
            hint="Replacement cost of everything you own, not what you paid"
            value={equipmentValue}
            onChange={setEquipmentValue}
          />

          <div>
            <span className="block text-[13px] font-medium text-slate-600">Do you have employees?</span>
            <div className="mt-1.5 inline-flex rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setHasEmployees(true)}
                aria-pressed={hasEmployees}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  hasEmployees ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setHasEmployees(false)}
                aria-pressed={!hasEmployees}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  !hasEmployees ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                No
              </button>
            </div>
            <span className="mt-1 block text-xs text-slate-400">
              Subcontractors you don&apos;t directly employ don&apos;t count here
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED GENERAL LIABILITY LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.tier.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.tier.perOccurrence)} per occurrence / {USD.format(result.tier.aggregate)}{" "}
              general aggregate, sized to your largest entered project
            </p>
          </div>

          {result.tier.umbrellaSuggested > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              At {USD.format(largestProject)}, this project size commonly comes with a client-required limit
              above a standalone GL policy. Many contractors pair their GL with roughly{" "}
              {USD.format(result.tier.umbrellaSuggested)} of umbrella or excess liability coverage instead of
              raising the underlying GL limit itself.
            </div>
          )}

          {result.manySmallerJobs && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your revenue implies roughly {result.jobsPerYear.toFixed(1)} jobs this size per year. A general
              aggregate limit is shared across every job in the policy period, so a high volume of similarly
              sized projects can draw that aggregate down faster than one large project would.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Tools & equipment to schedule" value={USD.format(equipmentValue)} tone="accent" />
            <Figure
              label="Above typical GL sublimit"
              value={USD.format(result.equipmentGapAboveSublimit)}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Tools &amp; equipment (inland marine)</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.needsToolsFloater
                  ? `A standard GL policy commonly includes only a small tools sublimit, often around ${USD.format(result.smallToolsSublimit)}. Your ${USD.format(equipmentValue)} in equipment leaves roughly ${USD.format(result.equipmentGapAboveSublimit)} that a tools-and-equipment (inland marine) floater is built to cover, including rented or leased equipment you're responsible for.`
                  : `Your entered equipment value fits within a typical small-tools sublimit, so a separate floater may not be necessary yet. Recheck this if you add owned equipment.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Workers&apos; compensation</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {hasEmployees
                  ? "Most states require workers' compensation the moment you have even one employee, and many general contractors won't let a crew on site without proof of it. State rules and exceptions vary, so confirm your exact requirement with your state's workers' comp board."
                  : "Not flagged since you indicated no employees. The requirement usually turns on the moment you hire your first one, so revisit this before your first payroll run."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Builder&apos;s risk</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.suggestsBuildersRisk
                  ? "At this project size, builder's risk coverage for materials, fixtures, and work in progress is commonly discussed on new construction or major renovation jobs. Whether you or the property owner needs to carry it usually depends on the contract."
                  : "Builder's risk is usually most relevant on larger new-construction or renovation jobs; smaller projects often skip it entirely."}
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
        Estimate only. This tool models common contracting-industry practice for sizing general liability,
        tools/equipment, and workers&apos; comp coverage; it is not a quote, a contract review, or insurance
        advice, and it does not know your state or municipal contractor-license insurance requirements,
        which vary and should be confirmed with your local licensing board. Confirm exact contract-required
        limits with the general contractor or client, and get final numbers from a licensed insurance agent
        before buying or changing a policy.
      </div>
    </div>
  );
}

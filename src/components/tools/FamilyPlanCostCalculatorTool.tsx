"use client";

/**
 * Family health plan cost calculator.
 *
 * Answers a specific dual-income-household question: is it cheaper to put
 * everyone on one employer's family plan, or to keep each person on their
 * own individual plan (a spouse's own employer plan, a marketplace plan for
 * a child, etc.)? Real employer plans price dependents one of two ways —
 * a single flat family-tier premium, or a per-additional-dependent add-on —
 * so this tool supports both structures and lets the user pick which one
 * their plan actually uses.
 *
 * Every number in the calculation is typed in by the user. Nothing about
 * typical premium differences is assumed or looked up; the math is pure
 * arithmetic on the figures entered.
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

type PricingStructure = "flat" | "perDependent";

interface MoneyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function MoneyField({ label, hint, value, onChange, max = 20_000 }: MoneyFieldProps) {
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
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-16 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          /month
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface DependentFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function DependentField({ label, hint, value, onChange }: DependentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={10}
        step={1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const raw = Math.round(Number(e.target.value));
          const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 10) : 0;
          onChange(clamped);
        }}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
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

export function FamilyPlanCostCalculatorTool() {
  const [structure, setStructure] = useState<PricingStructure>("flat");
  const [individualPremium, setIndividualPremium] = useState(410);
  const [flatFamilyPremium, setFlatFamilyPremium] = useState(1180);
  const [perDependentPremium, setPerDependentPremium] = useState(340);
  const [dependents, setDependents] = useState(2);
  const [separatePremium, setSeparatePremium] = useState(360);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const monthlyIndividual = individualPremium;
    const monthlyFamily =
      structure === "flat" ? flatFamilyPremium : individualPremium + perDependentPremium * dependents;
    const monthlySeparateTotal = monthlyIndividual + separatePremium * dependents;

    const annualFamily = monthlyFamily * 12;
    const annualSeparateTotal = monthlySeparateTotal * 12;
    const annualSavings = annualSeparateTotal - annualFamily;
    const familyWins = annualSavings > 0;
    const tie = annualSavings === 0;

    // Break-even dependent count, meaningful only for the flat-tier
    // structure: the count of separately-priced dependents at which the
    // flat family premium equals the sum of individual plans.
    let breakevenDependents: number | null = null;
    let familyAlwaysCheaper = false;
    let familyNeverCheaper = false;

    if (structure === "flat") {
      if (separatePremium <= 0) {
        breakevenDependents = null;
      } else {
        const raw = (flatFamilyPremium - individualPremium) / separatePremium;
        if (raw <= 0) {
          familyAlwaysCheaper = true;
        } else {
          breakevenDependents = Math.ceil(raw - 1e-9);
        }
      }
    } else {
      // Per-dependent structure: the marginal cost per added dependent is
      // constant, so whichever option is marginally cheaper wins at every
      // dependent count above zero.
      const marginalDiff = separatePremium - perDependentPremium; // positive => employer add-on cheaper
      if (marginalDiff > 0) familyAlwaysCheaper = true;
      if (marginalDiff < 0) familyNeverCheaper = true;
    }

    return {
      monthlyIndividual,
      monthlyFamily,
      monthlySeparateTotal,
      annualFamily,
      annualSeparateTotal,
      annualSavings,
      familyWins,
      tie,
      breakevenDependents,
      familyAlwaysCheaper,
      familyNeverCheaper,
    };
  }, [structure, individualPremium, flatFamilyPremium, perDependentPremium, dependents, separatePremium]);

  async function copyResult() {
    const winnerLine = result.tie
      ? "Both options cost exactly the same at these numbers."
      : result.familyWins
        ? `The family plan saves ${USD.format(Math.abs(result.annualSavings))} per year.`
        : `Separate individual plans save ${USD.format(Math.abs(result.annualSavings))} per year.`;

    const lines = [
      "Family health plan cost comparison",
      `Family plan (annual): ${USD.format(result.annualFamily)}`,
      `Separate individual plans for ${dependents} dependent${dependents === 1 ? "" : "s"} + you (annual): ${USD.format(result.annualSeparateTotal)}`,
      winnerLine,
      structure === "flat" && result.breakevenDependents !== null
        ? `Break-even: the family plan overtakes separate plans at ${result.breakevenDependents} dependent${result.breakevenDependents === 1 ? "" : "s"}.`
        : "",
      "Compares premiums only, not deductibles or out-of-pocket maximums. Verify against your plan documents.",
      "insurancetools.org/tools/health/family-plan-cost-calculator",
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
        <span className="label-mono text-slate-500">FAMILY HEALTH PLAN COST CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <MoneyField
            label="Your individual plan premium"
            hint="What this same plan would cost to cover just you"
            value={individualPremium}
            onChange={setIndividualPremium}
          />

          <div>
            <span className="block text-[13px] font-medium text-slate-600">
              How does this plan price dependents?
            </span>
            <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStructure("flat")}
                className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  structure === "flat"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                One flat family-tier premium
                <span className="mt-0.5 block text-[11px] font-normal text-slate-400">
                  Same total no matter how many dependents you add
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStructure("perDependent")}
                className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  structure === "perDependent"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Charged per added dependent
                <span className="mt-0.5 block text-[11px] font-normal text-slate-400">
                  Each spouse or child adds its own cost
                </span>
              </button>
            </div>
          </div>

          {structure === "flat" ? (
            <MoneyField
              label="Family-tier premium"
              hint="The single rate that covers you plus every dependent"
              value={flatFamilyPremium}
              onChange={setFlatFamilyPremium}
            />
          ) : (
            <MoneyField
              label="Added cost per dependent"
              hint="What the plan charges to add each additional spouse or child"
              value={perDependentPremium}
              onChange={setPerDependentPremium}
            />
          )}

          <DependentField
            label="Number of dependents"
            hint="Spouse and/or children who'd otherwise need their own separate plan"
            value={dependents}
            onChange={setDependents}
          />

          <MoneyField
            label="Separate individual plan premium per dependent"
            hint="E.g. a spouse's own employer premium, or a marketplace premium for a child"
            value={separatePremium}
            onChange={setSeparatePremium}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ANNUAL COST COMPARISON</p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.tie ? "text-slate-900" : result.familyWins ? "text-blue-600" : "text-slate-900"
              }`}
            >
              {result.tie
                ? "It's a tie"
                : result.familyWins
                  ? `Family plan wins by ${USD.format(Math.abs(result.annualSavings))}`
                  : `Separate plans win by ${USD.format(Math.abs(result.annualSavings))}`}
            </p>
            <p className="mt-1 text-xs text-slate-500">Based on the premiums you entered, per year</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="One family plan" value={USD.format(result.annualFamily)} />
            <Figure
              label={`${dependents} separate plan${dependents === 1 ? "" : "s"} + you`}
              value={USD.format(result.annualSeparateTotal)}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Break-even point</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {structure === "flat" ? (
                  result.familyAlwaysCheaper ? (
                    "At this family-tier premium, the family plan costs the same or less than separate plans even with zero dependents on it, so it wins at any number of dependents."
                  ) : result.breakevenDependents === null ? (
                    "Enter a separate individual plan premium above $0 to calculate a break-even dependent count."
                  ) : (
                    <>
                      The family plan overtakes separate plans once you have{" "}
                      <strong className="text-slate-700">{result.breakevenDependents}</strong>{" "}
                      {result.breakevenDependents === 1 ? "dependent" : "dependents"} who would otherwise need
                      their own plan. You entered {dependents}, which is{" "}
                      {dependents >= result.breakevenDependents ? "at or above" : "below"} that count.
                    </>
                  )
                ) : result.familyAlwaysCheaper ? (
                  "The per-dependent add-on costs less than a separate plan, so adding each dependent to this plan is cheaper no matter how many you add."
                ) : result.familyNeverCheaper ? (
                  "The per-dependent add-on costs more than a separate plan, so keeping each dependent on their own plan is cheaper no matter how many dependents you have."
                ) : (
                  "The per-dependent add-on costs the same as a separate individual plan, so the two options are a wash per dependent added."
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">What this comparison leaves out</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                This only compares monthly premiums. Each plan can carry its own deductible, copay
                structure, and out-of-pocket maximum, and a family plan&apos;s out-of-pocket maximum applies
                once across everyone on it. Pull those numbers from each plan&apos;s summary of benefits
                before deciding.
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
        Estimate only, based entirely on the premiums you enter. This tool does not know your actual plan
        documents, does not compare deductibles or out-of-pocket maximums, and does not fabricate any
        typical premium figures on your behalf. Confirm exact family-tier and per-dependent pricing with
        your employer&apos;s benefits summary or a marketplace quote before enrolling, and check your
        plan&apos;s open enrollment window before making a change.
      </div>
    </div>
  );
}

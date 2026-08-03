"use client";

/**
 * Pet wellness plan value calculator.
 *
 * A wellness plan (sometimes sold as a "wellness rider" or "preventive care
 * add-on") is a separate product from accident/illness pet insurance. It
 * reimburses routine, predictable care — annual exams, core vaccines,
 * routine bloodwork, dental cleanings — items that a base accident/illness
 * policy typically excludes because they are scheduled expenses, not
 * insurable risk. This tool never assumes what those routine visits cost.
 * Every dollar figure is entered by the user; the calculator only does the
 * arithmetic of plan cost vs. reimbursed spending.
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

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 20_000, step = 5 }: NumberFieldProps) {
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
          inputMode="numeric"
          min={0}
          max={100}
          step={5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 100) : 0;
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

export function PetWellnessPlanValueCalculatorTool() {
  const [planCost, setPlanCost] = useState(300);
  const [reimbursementCap, setReimbursementCap] = useState(400);
  const [reimbursementRate, setReimbursementRate] = useState(100);

  const [examCost, setExamCost] = useState(60);
  const [vaccineCost, setVaccineCost] = useState(90);
  const [bloodworkCost, setBloodworkCost] = useState(75);
  const [dentalCost, setDentalCost] = useState(250);
  const [otherCost, setOtherCost] = useState(0);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const itemizedTotal = examCost + vaccineCost + bloodworkCost + dentalCost + otherCost;

    // The plan only reimburses up to its cap, and only at its stated rate.
    // Both are entered by the user (from their own plan's schedule), never
    // assumed by this tool.
    const rateApplied = itemizedTotal * (reimbursementRate / 100);
    const reimbursedAmount = Math.min(rateApplied, reimbursementCap);
    const capBinds = rateApplied > reimbursementCap && reimbursementCap > 0;

    const outOfPocketWithPlan = Math.max(0, itemizedTotal - reimbursedAmount) + planCost;
    const outOfPocketWithoutPlan = itemizedTotal;

    const netBenefit = outOfPocketWithoutPlan - outOfPocketWithPlan;
    const worthIt = netBenefit > 0;
    const breakEvenSpend = reimbursementRate > 0 ? planCost / (reimbursementRate / 100) : Infinity;

    const hasAnySpend = itemizedTotal > 0;

    return {
      itemizedTotal,
      reimbursedAmount,
      capBinds,
      outOfPocketWithPlan,
      outOfPocketWithoutPlan,
      netBenefit,
      worthIt,
      breakEvenSpend,
      hasAnySpend,
    };
  }, [planCost, reimbursementCap, reimbursementRate, examCost, vaccineCost, bloodworkCost, dentalCost, otherCost]);

  async function copyResult() {
    const lines = [
      "Pet wellness plan value estimate",
      `Estimated annual routine care spending: ${USD.format(result.itemizedTotal)}`,
      `Estimated reimbursement from wellness plan: ${USD.format(result.reimbursedAmount)}`,
      `Annual wellness plan cost: ${USD.format(planCost)}`,
      `Total out of pocket with the plan: ${USD.format(result.outOfPocketWithPlan)}`,
      `Total out of pocket without the plan: ${USD.format(result.outOfPocketWithoutPlan)}`,
      result.worthIt
        ? `Net benefit of the plan: about ${USD.format(result.netBenefit)} saved this year based on the numbers entered`
        : `Net cost of the plan: about ${USD.format(Math.abs(result.netBenefit))} more than paying out of pocket, based on the numbers entered`,
      "Estimate only, based on user-entered figures. Not insurance advice. insurancetools.org/tools/pet/pet-wellness-plan-value-calculator",
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
        <span className="label-mono text-slate-500">PET WELLNESS PLAN VALUE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your wellness plan
            </p>
            <div className="space-y-4">
              <NumberField
                label="Annual wellness plan cost"
                hint="What you pay per year for the wellness add-on itself"
                value={planCost}
                onChange={setPlanCost}
              />
              <NumberField
                label="Annual reimbursement cap"
                hint="Maximum your plan pays back per year — check your plan schedule"
                value={reimbursementCap}
                onChange={setReimbursementCap}
              />
              <PercentField
                label="Reimbursement rate"
                hint="Percent of each covered item your plan reimburses, before the cap"
                value={reimbursementRate}
                onChange={setReimbursementRate}
              />
            </div>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your estimated routine care costs (annual)
            </p>
            <div className="space-y-4">
              <NumberField label="Annual exam / wellness visit" value={examCost} onChange={setExamCost} step={5} />
              <NumberField label="Core vaccines" value={vaccineCost} onChange={setVaccineCost} step={5} />
              <NumberField label="Routine bloodwork / screening" value={bloodworkCost} onChange={setBloodworkCost} step={5} />
              <NumberField label="Dental cleaning" value={dentalCost} onChange={setDentalCost} step={10} />
              <NumberField
                label="Other routine care"
                hint="Flea/tick or heartworm prevention, nail trims, or anything else your plan covers"
                value={otherCost}
                onChange={setOtherCost}
                step={5}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Enter your own estimates or the amounts your vet actually charged. This tool doesn&apos;t
              supply typical prices, since routine care costs vary widely by clinic, region, and species.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              {result.worthIt ? "ESTIMATED NET BENEFIT" : "ESTIMATED NET COST"}
            </p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.worthIt ? "text-blue-600" : "text-amber-600"
              }`}
            >
              {USD.format(Math.abs(result.netBenefit))}
              <span className="ml-1 text-base font-medium text-slate-400">/ year</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {!result.hasAnySpend
                ? "Enter your estimated routine care costs to see whether the plan pays off."
                : result.worthIt
                  ? "Based on the numbers entered, the plan reimburses more than it costs this year."
                  : "Based on the numbers entered, paying for routine care directly costs less than the plan this year."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Routine spending entered" value={USD.format(result.itemizedTotal)} />
            <Figure
              label="Reimbursed by plan"
              value={USD.format(result.reimbursedAmount)}
              tone={result.capBinds ? "warn" : "accent"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total cost with plan" value={USD.format(result.outOfPocketWithPlan)} />
            <Figure label="Total cost without plan" value={USD.format(result.outOfPocketWithoutPlan)} />
          </div>

          {result.capBinds && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your entered routine spending, reimbursed at {reimbursementRate}%, would come to more than
              your plan&apos;s {USD.format(reimbursementCap)} annual cap. The extra amount above the cap
              is not reimbursed, which is why the reimbursed figure above is lower than a simple percentage
              of your spending.
            </div>
          )}

          <div className="space-y-2 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Break-even routine spending</p>
            <p className="text-xs leading-relaxed text-slate-500">
              {Number.isFinite(result.breakEvenSpend)
                ? `At a ${reimbursementRate}% reimbursement rate, you'd need about ${USD2.format(result.breakEvenSpend)} in eligible routine care spending in a year just to break even on the ${USD.format(planCost)} plan cost, before the cap is considered.`
                : "Set a reimbursement rate above 0% to see the break-even spending level."}
            </p>
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
        Estimate only, based entirely on the figures you enter. This tool does not know actual veterinary
        prices in your area, your pet&apos;s specific plan terms, or how your insurer defines &ldquo;eligible&rdquo;
        routine care. A wellness plan is a budgeting product for predictable expenses, not risk-transfer
        insurance; it does not protect against the cost of an unexpected illness or injury. Confirm your
        exact reimbursement schedule and cap with your provider before relying on this comparison.
      </div>
    </div>
  );
}

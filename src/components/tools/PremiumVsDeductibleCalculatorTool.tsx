"use client";

/**
 * Premium vs. deductible calculator.
 *
 * A focused, exactly-two-plan, single-spending-scenario comparison. The user
 * enters Plan A and Plan B (monthly premium, annual deductible, coinsurance
 * percent) plus one expected annual medical spending figure of their own
 * choosing. The tool totals annual premium plus patient responsibility
 * (deductible plus coinsurance on spending beyond it) for each plan, shows
 * the dollar difference and the winner at that spending level, and also
 * solves for the crossover spending point where the two plans cost exactly
 * the same, so the user can see how sensitive the answer is to guessing
 * their spending wrong.
 *
 * This intentionally does not model 3+ plans (see the health plan
 * comparison calculator for that) and does not make breakeven spending the
 * primary output (see the break-even medical spending calculator for that
 * more detailed treatment). Every dollar figure is supplied by the user;
 * nothing here is a fabricated "typical" premium or deductible.
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

const USD_PRECISE = new Intl.NumberFormat("en-US", {
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

function NumberField({ label, hint, value, onChange, max = 1_000_000, step = 10 }: NumberFieldProps) {
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

function PercentField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          step={1}
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

interface PlanInputs {
  label: string;
  monthlyPremium: number;
  deductible: number;
  coinsurance: number;
}

/** Annual premium plus patient responsibility for a given spending level. */
function planTotalCost(plan: PlanInputs, spend: number): number {
  const annualPremium = plan.monthlyPremium * 12;
  const patientResponsibility =
    spend <= plan.deductible ? spend : plan.deductible + (spend - plan.deductible) * (plan.coinsurance / 100);
  return annualPremium + patientResponsibility;
}

/**
 * Find the spending level where two plans cost the same, by walking the
 * piecewise-linear cost difference between its knots (0, each deductible,
 * and a $1,000,000 ceiling used only to bound the search). Returns null if
 * the two lines never cross within that range, meaning one plan wins at
 * every realistic spending level.
 */
function findCrossoverSpend(a: PlanInputs, b: PlanInputs): number | null {
  const CEILING = 1_000_000;
  const knots = Array.from(new Set([0, a.deductible, b.deductible, CEILING]))
    .filter((k) => k >= 0 && k <= CEILING)
    .sort((x, y) => x - y);

  const diffAt = (s: number) => planTotalCost(a, s) - planTotalCost(b, s);

  for (let i = 0; i < knots.length - 1; i++) {
    const s0 = knots[i];
    const s1 = knots[i + 1];
    const d0 = diffAt(s0);
    const d1 = diffAt(s1);

    if (Math.abs(d0) < 0.005) return s0;
    if ((d0 > 0 && d1 < 0) || (d0 < 0 && d1 > 0)) {
      const t = d0 / (d0 - d1);
      return s0 + t * (s1 - s0);
    }
  }

  const dLast = diffAt(CEILING);
  return Math.abs(dLast) < 0.005 ? CEILING : null;
}

export function PremiumVsDeductibleCalculatorTool() {
  const [planA, setPlanA] = useState<PlanInputs>({
    label: "Plan A",
    monthlyPremium: 420,
    deductible: 2_000,
    coinsurance: 20,
  });
  const [planB, setPlanB] = useState<PlanInputs>({
    label: "Plan B",
    monthlyPremium: 260,
    deductible: 6_000,
    coinsurance: 30,
  });
  const [expectedSpend, setExpectedSpend] = useState(4_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const costA = planTotalCost(planA, expectedSpend);
    const costB = planTotalCost(planB, expectedSpend);
    const difference = Math.abs(costA - costB);
    const cheaper = costA < costB ? "A" : costB < costA ? "B" : "tie";

    const crossover = findCrossoverSpend(planA, planB);

    // Which plan wins at very low spending vs. very high spending, so the
    // sensitivity note can describe the tradeoff in plain language.
    const diffAtZero = planTotalCost(planA, 0) - planTotalCost(planB, 0);
    const winnerAtLowSpend = diffAtZero < 0 ? "A" : diffAtZero > 0 ? "B" : "tie";
    const diffAtCeiling = planTotalCost(planA, 1_000_000) - planTotalCost(planB, 1_000_000);
    const winnerAtHighSpend = diffAtCeiling < 0 ? "A" : diffAtCeiling > 0 ? "B" : "tie";

    return {
      costA,
      costB,
      difference,
      cheaper,
      crossover,
      winnerAtLowSpend,
      winnerAtHighSpend,
      sameWinnerThroughout: winnerAtLowSpend === winnerAtHighSpend,
    };
  }, [planA, planB, expectedSpend]);

  async function copyResult() {
    const lines = [
      "Premium vs. deductible comparison",
      `At ${USD.format(expectedSpend)}/year in expected medical spending:`,
      `Plan A total annual cost: ${USD.format(result.costA)}`,
      `Plan B total annual cost: ${USD.format(result.costB)}`,
      result.cheaper === "tie"
        ? "Both plans cost the same at this spending level."
        : `Plan ${result.cheaper} costs ${USD.format(result.difference)} less per year at this spending level.`,
      result.crossover !== null
        ? `Crossover point: the two plans cost the same at about ${USD.format(result.crossover)} in annual spending.`
        : "No crossover point: one plan stays cheaper across the full range tested.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/health/premium-vs-deductible-calculator",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail; the result stays fully visible either way.
    }
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="label-mono text-slate-500">PREMIUM VS. DEDUCTIBLE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2">
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Plan A</p>
          <NumberField
            label="Monthly premium"
            hint="What you pay each month for this plan"
            value={planA.monthlyPremium}
            onChange={(v) => setPlanA((p) => ({ ...p, monthlyPremium: v }))}
            max={5_000}
            step={5}
          />
          <NumberField
            label="Annual deductible"
            hint="What you pay before coinsurance starts"
            value={planA.deductible}
            onChange={(v) => setPlanA((p) => ({ ...p, deductible: v }))}
            max={20_000}
            step={100}
          />
          <PercentField
            label="Coinsurance after deductible"
            hint="Your share of costs once the deductible is met"
            value={planA.coinsurance}
            onChange={(v) => setPlanA((p) => ({ ...p, coinsurance: v }))}
          />
        </div>

        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Plan B</p>
          <NumberField
            label="Monthly premium"
            hint="What you pay each month for this plan"
            value={planB.monthlyPremium}
            onChange={(v) => setPlanB((p) => ({ ...p, monthlyPremium: v }))}
            max={5_000}
            step={5}
          />
          <NumberField
            label="Annual deductible"
            hint="What you pay before coinsurance starts"
            value={planB.deductible}
            onChange={(v) => setPlanB((p) => ({ ...p, deductible: v }))}
            max={20_000}
            step={100}
          />
          <PercentField
            label="Coinsurance after deductible"
            hint="Your share of costs once the deductible is met"
            value={planB.coinsurance}
            onChange={(v) => setPlanB((p) => ({ ...p, coinsurance: v }))}
          />
        </div>
      </div>

      <div className="border-t border-hairline bg-white p-5 sm:p-6">
        <NumberField
          label="Your expected annual medical spending"
          hint="Your own estimate of covered medical costs for the year, before insurance pays anything"
          value={expectedSpend}
          onChange={setExpectedSpend}
          max={200_000}
          step={100}
        />
      </div>

      <div className="border-t border-hairline bg-white p-5 sm:p-6">
        <p className="label-mono text-slate-400">TOTAL ANNUAL COST AT {USD.format(expectedSpend)} IN SPENDING</p>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Plan A</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD_PRECISE.format(result.costA)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Plan B</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD_PRECISE.format(result.costB)}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-sm text-blue-900">
          {result.cheaper === "tie" ? (
            <>Both plans cost the same at this spending level: {USD_PRECISE.format(result.costA)}/year.</>
          ) : (
            <>
              <strong>Plan {result.cheaper}</strong> costs less at this spending level, by{" "}
              <strong>{USD.format(result.difference)} per year</strong>.
            </>
          )}
        </div>

        <div className="mt-4 border-t border-hairline pt-4">
          <p className="text-xs font-semibold text-slate-700">Sensitivity: how much does this depend on your spending guess?</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            {result.crossover === null ? (
              <>
                Across every spending level from $0 to {USD.format(1_000_000)}, Plan{" "}
                {result.winnerAtLowSpend === "tie" ? "A and Plan B tie" : result.winnerAtLowSpend} never becomes
                more expensive than the alternative, so your answer above isn&apos;t sensitive to guessing your
                spending wrong.
              </>
            ) : (
              <>
                These two plans cost the same at about <strong>{USD.format(result.crossover)}</strong> in annual
                spending. Below that point, Plan {result.winnerAtLowSpend} tends to cost less; above it, Plan{" "}
                {result.winnerAtHighSpend} tends to cost less. If your {USD.format(expectedSpend)} estimate could
                plausibly be off by a lot, this crossover number tells you how much room for error you actually
                have before the cheaper plan flips.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={copyResult}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This tool assumes coinsurance applies uniformly to every dollar of spending above the
        deductible and does not model an out-of-pocket maximum, copays for specific services, network status,
        or plan-specific exclusions, all of which can lower your real cost below what&apos;s shown here. It is
        not a quote and does not replace reading a plan&apos;s actual Summary of Benefits and Coverage.
      </div>
    </div>
  );
}

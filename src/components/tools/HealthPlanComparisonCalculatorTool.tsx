"use client";

/**
 * Health plan comparison calculator.
 *
 * Every dollar figure in this tool — premiums, deductibles, coinsurance,
 * out-of-pocket maximums, and the spending scenarios themselves — comes from
 * the user. Nothing here is a published national average or a fabricated
 * "typical" plan; the starting numbers are placeholders meant to be
 * overwritten, not statistics.
 *
 * For each plan and each spending scenario, the tool applies the standard
 * cost-sharing waterfall used by nearly all major-medical plans: spending is
 * applied to the deductible first, then coinsurance applies to the remainder,
 * and the total a member pays out of pocket for care (not counting premium)
 * is capped at the plan's out-of-pocket maximum. That patient-responsibility
 * figure is added to twelve months of premium to produce a single, comparable
 * total annual cost per plan per scenario, so the user can see which plan
 * wins at each spending level rather than guessing from the premium alone.
 *
 * This is the flagship multi-scenario, multi-plan comparison tool on the
 * site. Two narrower, related tools exist for simpler questions: the
 * premium-vs-deductible calculator (one plan, one trade-off) and the
 * break-even medical spending calculator (exactly two plans, one crossover
 * point). This tool is for comparing up to three real plans across several
 * spending levels at once.
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
  prefix?: string;
  suffix?: string;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  max = 1_000_000,
  step = 50,
  prefix = "$",
  suffix,
}: NumberFieldProps) {
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
          inputMode="decimal"
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
            suffix ? "pr-9" : "pr-3"
          } text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function NameField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      maxLength={24}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      aria-label="Plan name"
    />
  );
}

function ScenarioLabelField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      maxLength={18}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      aria-label="Spending scenario label"
    />
  );
}

interface PlanInput {
  id: string;
  name: string;
  premium: number;
  deductible: number;
  coinsurance: number;
  oopMax: number;
  enabled: boolean;
}

interface ScenarioInput {
  id: string;
  label: string;
  amount: number;
}

/**
 * The standard deductible -> coinsurance -> OOP-max waterfall. `oopMax <= 0`
 * is treated as "not entered" rather than a real zero-dollar cap, since a
 * plan with a genuine $0 out-of-pocket max does not exist among major-medical
 * plans and would otherwise silently zero out every result.
 */
function patientResponsibility(spending: number, deductible: number, coinsurancePct: number, oopMax: number): number {
  const afterDeductible = Math.max(0, spending - deductible);
  const raw = Math.min(spending, deductible) + (coinsurancePct / 100) * afterDeductible;
  const cap = oopMax > 0 ? oopMax : Infinity;
  return Math.min(raw, cap);
}

function totalAnnualCost(plan: PlanInput, spending: number): { patientCost: number; total: number; hitOopMax: boolean } {
  const uncapped =
    Math.min(spending, plan.deductible) + (plan.coinsurance / 100) * Math.max(0, spending - plan.deductible);
  const patientCost = patientResponsibility(spending, plan.deductible, plan.coinsurance, plan.oopMax);
  const hitOopMax = plan.oopMax > 0 && uncapped > plan.oopMax;
  return { patientCost, total: plan.premium * 12 + patientCost, hitOopMax };
}

export function HealthPlanComparisonCalculatorTool() {
  const [plans, setPlans] = useState<PlanInput[]>([
    { id: "a", name: "Plan A", premium: 350, deductible: 1500, coinsurance: 20, oopMax: 6000, enabled: true },
    { id: "b", name: "Plan B", premium: 480, deductible: 500, coinsurance: 20, oopMax: 4000, enabled: true },
    { id: "c", name: "Plan C", premium: 260, deductible: 3500, coinsurance: 30, oopMax: 8000, enabled: false },
  ]);
  const [scenarios, setScenarios] = useState<ScenarioInput[]>([
    { id: "low", label: "Low", amount: 500 },
    { id: "moderate", label: "Moderate", amount: 3_000 },
    { id: "high", label: "High", amount: 12_000 },
  ]);
  const [copied, setCopied] = useState(false);

  function updatePlan(id: string, patch: Partial<PlanInput>) {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function updateScenario(id: string, patch: Partial<ScenarioInput>) {
    setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  const activePlans = useMemo(() => plans.filter((p) => p.enabled), [plans]);

  const matrix = useMemo(() => {
    return scenarios.map((scenario) => {
      const cells = activePlans.map((plan) => ({
        planId: plan.id,
        planName: plan.name,
        ...totalAnnualCost(plan, scenario.amount),
      }));
      const cheapest = cells.length
        ? cells.reduce((min, c) => (c.total < min.total ? c : min), cells[0])
        : null;
      return { scenario, cells, cheapestPlanId: cheapest?.planId ?? null };
    });
  }, [scenarios, activePlans]);

  const overallWinner = useMemo(() => {
    if (activePlans.length === 0) return null;
    const totals = activePlans.map((plan) => ({
      planId: plan.id,
      planName: plan.name,
      sum: scenarios.reduce((acc, s) => acc + totalAnnualCost(plan, s.amount).total, 0),
    }));
    return totals.reduce((min, t) => (t.sum < min.sum ? t : min), totals[0]);
  }, [activePlans, scenarios]);

  const winnerVariesByScenario = useMemo(() => {
    const winners = new Set(matrix.map((row) => row.cheapestPlanId).filter(Boolean));
    return winners.size > 1;
  }, [matrix]);

  function addThirdPlan() {
    setPlans((prev) => prev.map((p) => (p.id === "c" ? { ...p, enabled: true } : p)));
  }

  function removeThirdPlan() {
    setPlans((prev) => prev.map((p) => (p.id === "c" ? { ...p, enabled: false } : p)));
  }

  async function copyResult() {
    const lines = [
      "Health plan comparison",
      ...activePlans.map(
        (p) =>
          `${p.name}: ${USD.format(p.premium)}/mo premium, ${USD.format(p.deductible)} deductible, ${p.coinsurance}% coinsurance, ${USD.format(p.oopMax)} out-of-pocket max`
      ),
      "",
      ...matrix.map((row) => {
        const parts = row.cells.map(
          (c) => `${c.planName} ${USD.format(c.total)}${c.planId === row.cheapestPlanId ? " (lowest)" : ""}`
        );
        return `${row.scenario.label} spending (${USD.format(row.scenario.amount)}): ${parts.join(", ")}`;
      }),
      overallWinner
        ? `Lowest total cost across all entered scenarios (equal weighting): ${overallWinner.planName}`
        : "",
      "Every figure above was entered by the user; this tool does not supply premiums, deductibles, or spending averages. Estimate only, not insurance advice. insurancetools.org/tools/health/health-plan-comparison-calculator",
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

  const thirdPlanActive = plans.find((p) => p.id === "c")?.enabled ?? false;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="label-mono text-slate-500">HEALTH PLAN COMPARISON CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      {/* Plan inputs */}
      <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {plans
          .filter((p) => p.enabled)
          .map((plan) => (
            <div key={plan.id} className="space-y-3.5 bg-white p-5 sm:p-6">
              <NameField value={plan.name} onChange={(v) => updatePlan(plan.id, { name: v })} />
              <NumberField
                label="Monthly premium"
                value={plan.premium}
                step={10}
                max={5_000}
                onChange={(v) => updatePlan(plan.id, { premium: v })}
              />
              <NumberField
                label="Annual deductible"
                value={plan.deductible}
                step={100}
                max={50_000}
                onChange={(v) => updatePlan(plan.id, { deductible: v })}
              />
              <NumberField
                label="Coinsurance after deductible"
                hint="Your share of costs once the deductible is met"
                value={plan.coinsurance}
                onChange={(v) => updatePlan(plan.id, { coinsurance: Math.min(v, 100) })}
                max={100}
                step={5}
                prefix=""
                suffix="%"
              />
              <NumberField
                label="Out-of-pocket maximum"
                hint="Max you'd pay for covered care in a year, not counting premium"
                value={plan.oopMax}
                step={250}
                max={50_000}
                onChange={(v) => updatePlan(plan.id, { oopMax: v })}
              />
              {plan.id === "c" && (
                <button
                  type="button"
                  onClick={removeThirdPlan}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  Remove this plan
                </button>
              )}
            </div>
          ))}
        {!thirdPlanActive && (
          <div className="flex items-center justify-center bg-white p-5 sm:p-6">
            <button
              type="button"
              onClick={addThirdPlan}
              className="rounded-lg border border-dashed border-slate-300 px-4 py-3 text-xs font-semibold text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600"
            >
              + Add a third plan to compare
            </button>
          </div>
        )}
      </div>

      {/* Scenario inputs */}
      <div className="border-t border-hairline bg-white p-5 sm:p-6">
        <p className="label-mono text-slate-400">EXPECTED ANNUAL MEDICAL SPENDING SCENARIOS</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          These three scenarios are editable starting points, not published averages. Rename them and set
          each amount to whatever you think a low, typical, and high year of your own medical spending
          would look like.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="space-y-2 rounded-lg border border-slate-200 p-3">
              <ScenarioLabelField
                value={scenario.label}
                onChange={(v) => updateScenario(scenario.id, { label: v })}
              />
              <NumberField
                label="Expected spending"
                value={scenario.amount}
                step={250}
                max={200_000}
                onChange={(v) => updateScenario(scenario.id, { amount: v })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="border-t border-hairline bg-white p-5 sm:p-6">
        <p className="label-mono text-slate-400">TOTAL ANNUAL COST BY SCENARIO</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs text-slate-400">
                <th className="py-2 pr-3 font-medium">Spending scenario</th>
                {activePlans.map((plan) => (
                  <th key={plan.id} className="py-2 pr-3 font-medium">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.scenario.id} className="border-b border-hairline last:border-0">
                  <td className="py-3 pr-3 align-top">
                    <span className="font-medium text-slate-900">{row.scenario.label}</span>
                    <span className="block text-xs text-slate-400">{USD.format(row.scenario.amount)} spent</span>
                  </td>
                  {row.cells.map((cell) => (
                    <td key={cell.planId} className="py-3 pr-3 align-top">
                      <span
                        className={`tabular-nums font-semibold ${
                          cell.planId === row.cheapestPlanId ? "text-blue-600" : "text-slate-700"
                        }`}
                      >
                        {USD.format(cell.total)}
                      </span>
                      {cell.planId === row.cheapestPlanId && (
                        <span className="ml-1.5 inline-flex rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                          LOWEST
                        </span>
                      )}
                      <span className="block text-[11px] text-slate-400">
                        {USD.format(cell.patientCost)} of care costs{cell.hitOopMax ? " (OOP max reached)" : ""}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 border-t border-hairline pt-4">
          {overallWinner && (
            <p className="text-xs leading-relaxed text-slate-600">
              Adding up all {scenarios.length} scenarios with equal weight,{" "}
              <span className="font-semibold text-slate-900">{overallWinner.planName}</span> has the lowest
              combined total cost. That is not automatically the right pick: it only tells you which plan
              wins if each scenario is equally likely for you.{" "}
              {winnerVariesByScenario
                ? "The cheapest plan actually changes depending on the spending level, so weight the scenario closest to your real health situation more heavily than the simple total above."
                : "In this comparison the same plan wins at every spending level entered, which is a stronger signal than when the winner changes across scenarios."}
            </p>
          )}
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
        Estimate only. This tool models the standard deductible, coinsurance, and out-of-pocket maximum
        waterfall used by most major-medical plans; it does not model copay-only plan designs, provider
        network differences, drug formularies, or HSA tax savings (use the HSA savings calculator for
        that). Every premium, deductible, coinsurance percentage, and spending amount above is a number you
        entered, not a published average, and this is not a quote or a recommendation to buy a specific
        plan. Confirm exact plan terms with the plan&apos;s Summary of Benefits and Coverage or a licensed
        insurance agent before enrolling.
      </div>
    </div>
  );
}

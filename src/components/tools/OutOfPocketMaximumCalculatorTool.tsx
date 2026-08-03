"use client";

/**
 * Out-of-pocket maximum calculator.
 *
 * This tool answers exactly one question: "what is the absolute worst this
 * plan can cost me in a year?" It deliberately does not model a deductible
 * -> coinsurance waterfall across spending scenarios the way the health plan
 * comparison calculator does. It only adds twelve months of premium to the
 * plan's stated annual out-of-pocket maximum, because once a member's
 * covered, in-network spending reaches that maximum, federal rules require
 * the plan to pay 100% of further covered, in-network essential health
 * benefits for the rest of the plan year. That makes premium + OOP max a
 * real, calculable ceiling, not an estimate of typical spending.
 *
 * The ceiling has real edges the tool is explicit about: it only caps
 * in-network care for essential health benefits, it never includes the
 * premium itself by definition, and it does nothing for out-of-network
 * bills or services a plan simply doesn't cover. Every premium and every
 * out-of-pocket maximum is a number the user enters from their own plan
 * documents; nothing here is a published national average or a current
 * regulatory figure.
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

function NumberField({ label, hint, value, onChange, max = 100_000, step = 50 }: NumberFieldProps) {
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

interface PlanInput {
  id: string;
  name: string;
  premium: number;
  oopMax: number;
  enabled: boolean;
}

interface PlanResult {
  id: string;
  name: string;
  premium: number;
  oopMax: number;
  annualPremium: number;
  worstCase: number;
  counted: boolean;
}

export function OutOfPocketMaximumCalculatorTool() {
  const [plans, setPlans] = useState<PlanInput[]>([
    { id: "a", name: "Plan A", premium: 350, oopMax: 6000, enabled: true },
    { id: "b", name: "Plan B", premium: 220, oopMax: 9100, enabled: true },
    { id: "c", name: "Plan C", premium: 140, oopMax: 17400, enabled: false },
  ]);
  const [copied, setCopied] = useState(false);

  function updatePlan(id: string, patch: Partial<PlanInput>) {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function addThirdPlan() {
    setPlans((prev) => prev.map((p) => (p.id === "c" ? { ...p, enabled: true } : p)));
  }

  function removeThirdPlan() {
    setPlans((prev) => prev.map((p) => (p.id === "c" ? { ...p, enabled: false } : p)));
  }

  const thirdPlanActive = plans.find((p) => p.id === "c")?.enabled ?? false;

  const results = useMemo<PlanResult[]>(() => {
    return plans
      .filter((p) => p.enabled)
      .map((p) => {
        const annualPremium = p.premium * 12;
        const counted = p.oopMax > 0;
        return {
          id: p.id,
          name: p.name,
          premium: p.premium,
          oopMax: p.oopMax,
          annualPremium,
          worstCase: annualPremium + p.oopMax,
          counted,
        };
      });
  }, [plans]);

  const ranked = useMemo(() => {
    const countedResults = results.filter((r) => r.counted);
    return [...countedResults].sort((a, b) => a.worstCase - b.worstCase);
  }, [results]);

  const cheapest = ranked[0] ?? null;
  const priciest = ranked.length > 1 ? ranked[ranked.length - 1] : null;
  const spread = cheapest && priciest ? priciest.worstCase - cheapest.worstCase : 0;

  async function copyResult() {
    const lines = [
      "Out-of-pocket maximum worst-case cost comparison",
      ...ranked.map((r, i) => {
        const rank = ranked.length > 1 ? `#${i + 1} ` : "";
        return `${rank}${r.name}: ${USD.format(r.premium)}/mo premium (${USD.format(r.annualPremium)}/yr) + ${USD.format(r.oopMax)} OOP max = ${USD.format(r.worstCase)} worst-case annual cost`;
      }),
      cheapest && priciest
        ? `Gap between lowest and highest worst-case cost: ${USD.format(spread)}`
        : "",
      "This ceiling covers in-network essential health benefits only. It does not include out-of-network care or services your plan doesn't cover, and it does not include the premium by definition of the term.",
      "Estimate only, not insurance advice. Figures entered by the user. insurancetools.org/tools/health/out-of-pocket-maximum-calculator",
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
        <span className="label-mono text-slate-500">OUT-OF-POCKET MAXIMUM CALCULATOR</span>
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
                hint="What you pay each month for this plan"
                value={plan.premium}
                step={10}
                max={5_000}
                onChange={(v) => updatePlan(plan.id, { premium: v })}
              />
              <NumberField
                label="Annual out-of-pocket maximum"
                hint="From your plan's Summary of Benefits and Coverage, in-network figure"
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

      {/* Results */}
      <div className="border-t border-hairline bg-white p-5 sm:p-6">
        <p className="label-mono text-slate-400">WORST-CASE ANNUAL COST, RANKED</p>

        <div className="mt-3 space-y-2.5">
          {ranked.length === 0 && (
            <p className="text-xs leading-relaxed text-slate-500">
              Enter an out-of-pocket maximum greater than $0 for at least one plan to see its worst-case
              annual cost.
            </p>
          )}
          {ranked.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 ${
                i === 0 ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    i === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {USD.format(r.annualPremium)}/yr premium + {USD.format(r.oopMax)} OOP max
                  </p>
                </div>
              </div>
              <p
                className={`text-lg font-semibold tabular-nums ${i === 0 ? "text-blue-600" : "text-slate-900"}`}
              >
                {USD.format(r.worstCase)}
              </p>
            </div>
          ))}
        </div>

        {cheapest && priciest && (
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 px-3.5 py-3 text-xs leading-relaxed text-blue-800">
            <span className="font-semibold">{cheapest.name}</span> has the lowest worst-case ceiling of the
            plans entered, {USD.format(spread)} less than <span className="font-semibold">{priciest.name}</span>
            &apos;s worst case. A bad medical year is the scenario where that gap matters most; a plan with a
            higher premium and lower OOP max can still be the safer bet even if it looks more expensive
            month to month.
          </div>
        )}

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
        Estimate only. This ceiling covers in-network spending on essential health benefits only; it does
        not cap out-of-network bills or services your plan doesn&apos;t cover, and by definition it never
        includes the premium itself. Every premium and out-of-pocket maximum above is a number you entered
        from your own plan documents, not a published or current regulatory figure. Confirm the exact
        in-network out-of-pocket maximum on your plan&apos;s Summary of Benefits and Coverage before relying
        on this number, and talk to a licensed insurance agent about your specific plan.
      </div>
    </div>
  );
}

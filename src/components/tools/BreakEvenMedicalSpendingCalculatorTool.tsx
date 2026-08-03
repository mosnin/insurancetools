"use client";

/**
 * Break-even medical spending calculator.
 *
 * This is the flagship precision tool in the Health category. Rather than
 * building a scenario table (see HealthPlanComparisonCalculatorTool) or a
 * single-spending-point comparison (see PremiumVsDeductibleCalculatorTool),
 * this tool solves algebraically for the one exact annual medical spending
 * dollar figure at which two plans cost exactly the same.
 *
 * Each plan's total annual cost is modeled as a piecewise linear function of
 * annual medical spending x:
 *
 *   segment 1 (x <= deductible):            patient pays x, dollar for dollar
 *   segment 2 (deductible < x <= cap point): patient pays deductible +
 *                                            coinsurance% x (x - deductible)
 *   segment 3 (x > cap point):               patient pays the out-of-pocket max
 *
 * where "cap point" is the spending level at which patient responsibility
 * first reaches the out-of-pocket maximum. TotalCost(x) = 12 x monthly
 * premium + patient responsibility(x).
 *
 * The tool builds the sorted list of every breakpoint from both plans
 * (0, each deductible, each cap point), evaluates the cost difference
 * Plan A - Plan B at each breakpoint, and walks the segments looking for a
 * sign change (or an exact zero). Because the difference function is
 * genuinely affine within any two adjacent breakpoints, the exact crossover
 * is solved with a single linear interpolation inside that segment -- no
 * scenario guessing, no rounding to the nearest hundred dollars.
 *
 * Every premium, deductible, coinsurance percentage, and out-of-pocket
 * maximum below is a number the user typed in. Nothing here is sourced from
 * a real insurer, a published average, or a "typical" plan. All math runs
 * client-side; nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface PlanInput {
  name: string;
  premium: number;
  deductible: number;
  coinsurance: number;
  oopMax: number;
}

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

/** Patient responsibility (excludes premium) for a given spending level. */
function patientCost(spending: number, p: PlanInput): number {
  const afterDeductible = Math.max(0, spending - p.deductible);
  const raw = Math.min(spending, p.deductible) + (p.coinsurance / 100) * afterDeductible;
  const cap = p.oopMax > 0 ? p.oopMax : Infinity;
  return Math.min(raw, cap);
}

function totalCost(spending: number, p: PlanInput): number {
  return p.premium * 12 + patientCost(spending, p);
}

/**
 * The spending level at which patient responsibility first reaches the
 * out-of-pocket maximum. Infinity means the plan's coinsurance never
 * actually reaches its entered out-of-pocket max (0% coinsurance) or no
 * out-of-pocket max was entered.
 */
function capPoint(p: PlanInput): number {
  if (p.oopMax <= 0) return Infinity;
  if (p.oopMax <= p.deductible) return p.oopMax;
  if (p.coinsurance <= 0) return Infinity;
  return p.deductible + (p.oopMax - p.deductible) / (p.coinsurance / 100);
}

function segmentLabel(x: number, p: PlanInput): string {
  const cap = capPoint(p);
  if (x <= p.deductible) return "before its deductible is met";
  if (x < cap) return "in its coinsurance phase";
  return "at its out-of-pocket maximum";
}

type CrossoverStatus = "crossover" | "always-a" | "always-b" | "tied";

interface CrossoverResult {
  status: CrossoverStatus;
  spending: number | null;
  costAtCrossover: number | null;
  cheaperBelow: "A" | "B" | null;
  cheaperAbove: "A" | "B" | null;
  segmentA: string | null;
  segmentB: string | null;
}

/**
 * Solves TotalCost_A(x) = TotalCost_B(x) exactly. Because both cost
 * functions are piecewise linear, the difference function A - B is affine
 * between any two adjacent breakpoints (0, each deductible, each cap
 * point). Evaluating the difference at every breakpoint and one far-out
 * point beyond the last breakpoint (to capture an uncapped final segment)
 * lets a single sign-change scan find the exact segment the true crossover
 * falls in, then a linear interpolation inside that segment gives the
 * dollar-exact answer without ever building a scenario table.
 */
function solveCrossover(a: PlanInput, b: PlanInput): CrossoverResult {
  const diff = (x: number) => totalCost(x, a) - totalCost(x, b);
  const EPS = 0.005;

  const rawBreakpoints = [0, a.deductible, b.deductible, capPoint(a), capPoint(b)].filter(
    (v) => Number.isFinite(v) && v >= 0
  );
  const breakpoints = Array.from(new Set(rawBreakpoints)).sort((x, y) => x - y);
  const points = breakpoints.map((x) => ({ x, y: diff(x) }));
  const lastX = points[points.length - 1].x;
  const farX = lastX + 2_000_000;
  const farY = diff(farX);

  // If every breakpoint (plus the far-out point covering an uncapped final
  // segment) ties exactly, the two cost curves are identical across the
  // entire modeled range -- report that directly rather than picking $0 as
  // an arbitrary "crossover."
  const allTied = points.every((p) => Math.abs(p.y) < EPS) && Math.abs(farY) < EPS;
  if (allTied) {
    return {
      status: "tied",
      spending: null,
      costAtCrossover: null,
      cheaperBelow: null,
      cheaperAbove: null,
      segmentA: null,
      segmentB: null,
    };
  }

  let crossover: number | null = null;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    if (Math.abs(p1.y) < EPS) {
      crossover = p1.x;
      break;
    }
    const p2 = i < points.length - 1 ? points[i + 1] : { x: farX, y: farY };
    const sameSign = p1.y > 0 === p2.y > 0;
    if (!sameSign) {
      const slope = (p2.y - p1.y) / (p2.x - p1.x);
      crossover = p1.x - p1.y / slope;
      break;
    }
  }

  if (crossover === null) {
    const tied = Math.abs(points[0].y) < EPS && Math.abs(farY) < EPS;
    if (tied) {
      return {
        status: "tied",
        spending: null,
        costAtCrossover: null,
        cheaperBelow: null,
        cheaperAbove: null,
        segmentA: null,
        segmentB: null,
      };
    }
    return {
      status: points[0].y < 0 ? "always-a" : "always-b",
      spending: null,
      costAtCrossover: null,
      cheaperBelow: null,
      cheaperAbove: null,
      segmentA: null,
      segmentB: null,
    };
  }

  const before = diff(Math.max(0, crossover - 1));
  const after = diff(crossover + 1);
  const cheaperBelow: "A" | "B" | null = before < -EPS ? "A" : before > EPS ? "B" : null;
  const cheaperAbove: "A" | "B" | null = after < -EPS ? "A" : after > EPS ? "B" : null;

  return {
    status: "crossover",
    spending: crossover,
    costAtCrossover: totalCost(crossover, a),
    cheaperBelow,
    cheaperAbove,
    segmentA: segmentLabel(crossover, a),
    segmentB: segmentLabel(crossover, b),
  };
}

export function BreakEvenMedicalSpendingCalculatorTool() {
  const [planA, setPlanA] = useState<PlanInput>({
    name: "Plan A",
    premium: 450,
    deductible: 500,
    coinsurance: 20,
    oopMax: 4_000,
  });
  const [planB, setPlanB] = useState<PlanInput>({
    name: "Plan B",
    premium: 300,
    deductible: 3_000,
    coinsurance: 20,
    oopMax: 6_500,
  });
  const [copied, setCopied] = useState(false);

  function updateA(patch: Partial<PlanInput>) {
    setPlanA((prev) => ({ ...prev, ...patch }));
  }
  function updateB(patch: Partial<PlanInput>) {
    setPlanB((prev) => ({ ...prev, ...patch }));
  }

  const result = useMemo(() => solveCrossover(planA, planB), [planA, planB]);

  const zeroSpendingDiff = useMemo(
    () => totalCost(0, planA) - totalCost(0, planB),
    [planA, planB]
  );

  async function copyResult() {
    const lines: string[] = [
      "Break-even medical spending calculator",
      `${planA.name}: ${USD.format(planA.premium)}/mo premium, ${USD.format(planA.deductible)} deductible, ${planA.coinsurance}% coinsurance, ${USD.format(planA.oopMax)} out-of-pocket max`,
      `${planB.name}: ${USD.format(planB.premium)}/mo premium, ${USD.format(planB.deductible)} deductible, ${planB.coinsurance}% coinsurance, ${USD.format(planB.oopMax)} out-of-pocket max`,
    ];
    if (result.status === "crossover" && result.spending !== null) {
      lines.push(`Exact crossover spending: ${USD.format(result.spending)}`);
      if (result.cheaperBelow && result.cheaperAbove) {
        lines.push(
          `Below ${USD.format(result.spending)}, ${result.cheaperBelow === "A" ? planA.name : planB.name} is cheaper. Above it, ${result.cheaperAbove === "A" ? planA.name : planB.name} is cheaper.`
        );
      }
      if (result.costAtCrossover !== null) {
        lines.push(`Total annual cost at the crossover: ${USD.format(result.costAtCrossover)} for either plan.`);
      }
    } else if (result.status === "always-a") {
      lines.push(`${planA.name} is cheaper at every annual spending level tested; these plans never cross.`);
    } else if (result.status === "always-b") {
      lines.push(`${planB.name} is cheaper at every annual spending level tested; these plans never cross.`);
    } else if (result.status === "tied") {
      lines.push("These two plans produce the same total annual cost at every spending level entered.");
    }
    lines.push(
      "Estimate only, based on a linear cost model; not a quote or insurance advice. insurancetools.org/tools/health/break-even-medical-spending-calculator"
    );
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
        <span className="label-mono text-slate-500">BREAK-EVEN MEDICAL SPENDING CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <p className="border-b border-hairline bg-white px-5 py-3 text-xs leading-relaxed text-slate-500 sm:px-6">
        The starting numbers below are editable placeholders, not published premiums or averages. Replace
        every field with your own two plans&apos; actual terms.
      </p>

      {/* Plan inputs */}
      <div className="grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2">
        <div className="space-y-3.5 bg-white p-5 sm:p-6">
          <NameField value={planA.name} onChange={(v) => updateA({ name: v })} />
          <NumberField
            label="Monthly premium"
            value={planA.premium}
            step={10}
            max={5_000}
            onChange={(v) => updateA({ premium: v })}
          />
          <NumberField
            label="Annual deductible"
            value={planA.deductible}
            step={100}
            max={50_000}
            onChange={(v) => updateA({ deductible: v })}
          />
          <NumberField
            label="Coinsurance after deductible"
            hint="Your share of costs once the deductible is met"
            value={planA.coinsurance}
            onChange={(v) => updateA({ coinsurance: Math.min(v, 100) })}
            max={100}
            step={5}
            prefix=""
            suffix="%"
          />
          <NumberField
            label="Out-of-pocket maximum"
            hint="Max you'd pay for covered care in a year, not counting premium"
            value={planA.oopMax}
            step={250}
            max={50_000}
            onChange={(v) => updateA({ oopMax: v })}
          />
        </div>

        <div className="space-y-3.5 bg-white p-5 sm:p-6">
          <NameField value={planB.name} onChange={(v) => updateB({ name: v })} />
          <NumberField
            label="Monthly premium"
            value={planB.premium}
            step={10}
            max={5_000}
            onChange={(v) => updateB({ premium: v })}
          />
          <NumberField
            label="Annual deductible"
            value={planB.deductible}
            step={100}
            max={50_000}
            onChange={(v) => updateB({ deductible: v })}
          />
          <NumberField
            label="Coinsurance after deductible"
            hint="Your share of costs once the deductible is met"
            value={planB.coinsurance}
            onChange={(v) => updateB({ coinsurance: Math.min(v, 100) })}
            max={100}
            step={5}
            prefix=""
            suffix="%"
          />
          <NumberField
            label="Out-of-pocket maximum"
            hint="Max you'd pay for covered care in a year, not counting premium"
            value={planB.oopMax}
            step={250}
            max={50_000}
            onChange={(v) => updateB({ oopMax: v })}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-5 border-t border-hairline bg-white p-5 sm:p-6">
        {result.status === "crossover" && result.spending !== null && (
          <>
            <div>
              <p className="label-mono text-slate-400">EXACT CROSSOVER SPENDING</p>
              <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-blue-600">
                {USD.format(result.spending)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Annual medical spending at which {planA.name} and {planB.name} cost exactly the same,
                solved directly from your inputs rather than read off a scenario table.
              </p>
            </div>

            {result.cheaperBelow && result.cheaperAbove && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-800">
                Below {USD.format(result.spending)} in annual medical spending,{" "}
                <strong>{result.cheaperBelow === "A" ? planA.name : planB.name}</strong> costs less. Above{" "}
                {USD.format(result.spending)}, <strong>{result.cheaperAbove === "A" ? planA.name : planB.name}</strong>{" "}
                costs less.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
              <Figure
                label="Total cost at crossover"
                value={result.costAtCrossover !== null ? USD.format(result.costAtCrossover) : "—"}
                tone="accent"
              />
              <Figure
                label="Premium-only gap"
                value={`${zeroSpendingDiff >= 0 ? "+" : "-"}${USD.format(Math.abs(zeroSpendingDiff))}/yr`}
              />
            </div>

            <div className="space-y-1.5 border-t border-hairline pt-4 text-xs leading-relaxed text-slate-500">
              <p>
                At the crossover, {planA.name} is {result.segmentA}, and {planB.name} is {result.segmentB}.
              </p>
              <p>
                This figure is mathematically exact for the linear cost model above, given exactly what you
                entered. Real medical bills rarely land on a clean round number, so treat it as a precise
                planning estimate, not a guarantee about what any single year of care will cost.
              </p>
            </div>
          </>
        )}

        {(result.status === "always-a" || result.status === "always-b") && (
          <div>
            <p className="label-mono text-slate-400">RESULT</p>
            <p className="mt-1.5 text-2xl font-semibold text-slate-900">No crossover point</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Based on the numbers entered,{" "}
              <strong>{result.status === "always-a" ? planA.name : planB.name}</strong> costs less than the
              other plan at every annual medical spending level, from $0 up through at least{" "}
              {USD.format(2_000_000)} of spending. There is no dollar amount of medical care that would make
              the other plan the cheaper choice under these exact terms. Double-check the numbers if that
              seems surprising; a lower premium almost always wins at very low spending, so this usually
              means one plan is genuinely better on every input, not just the premium.
            </p>
          </div>
        )}

        {result.status === "tied" && (
          <div>
            <p className="label-mono text-slate-400">RESULT</p>
            <p className="mt-1.5 text-2xl font-semibold text-slate-900">Plans are equivalent</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {planA.name} and {planB.name} produce the same total annual cost at every spending level
              entered. Check whether you accidentally entered the same terms for both plans, since two
              genuinely different real-world plans essentially never tie exactly across the entire spending
              range.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={copyResult}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This tool models the standard deductible, coinsurance, and out-of-pocket maximum
        waterfall used by most major-medical plans as a straight-line function of spending; it does not
        model copay-only plan designs, provider network differences, drug formularies, mid-year plan
        changes, or an HSA&apos;s tax advantages (use the HSA savings calculator for that). Every premium,
        deductible, coinsurance percentage, and out-of-pocket maximum above is a number you entered, not a
        published average, and this is not a quote or a recommendation to buy a specific plan. Confirm exact
        plan terms with the plan&apos;s Summary of Benefits and Coverage or a licensed insurance agent before
        enrolling.
      </div>
    </div>
  );
}

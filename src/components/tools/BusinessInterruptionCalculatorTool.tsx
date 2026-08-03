"use client";

/**
 * Business interruption (business income) insurance sizing calculator.
 *
 * This is a pre-loss SIZING tool: it estimates how much business income
 * coverage a business owner might want to request before a loss happens.
 * It is deliberately distinct from a post-loss claim calculator (planned
 * for the Claims category as business-interruption-claim-calculator),
 * which would instead reconstruct an actual claim amount after a covered
 * loss has already occurred, using real financial records for the loss
 * period. This tool has no such records to work from — it only has the
 * assumptions the user enters.
 *
 * The math follows the standard business income insurance formula used by
 * commercial property underwriters: monthly fixed costs that continue even
 * while the business is shut down, PLUS the monthly net profit the
 * business would have earned, multiplied by however many months of
 * recovery the user expects to need. This is deliberately NOT gross
 * revenue times months, which is the most common sizing mistake business
 * owners make (see the "common mistakes" section on the tool page).
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
  suffix?: string;
}

function NumberField({ label, hint, value, onChange, max = 10_000_000, step = 100, suffix }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        {!suffix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            $
          </span>
        )}
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
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            suffix ? "pl-3 pr-12" : "pl-7 pr-3"
          } text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function BusinessInterruptionCalculatorTool() {
  const [fixedCosts, setFixedCosts] = useState(8_000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(30_000);
  const [profitMargin, setProfitMargin] = useState(15);
  const [recoveryMonths, setRecoveryMonths] = useState(6);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const clampedMargin = Math.min(Math.max(profitMargin, 0), 100);
    const monthlyNetProfit = monthlyRevenue * (clampedMargin / 100);
    const monthlyCoverageNeed = fixedCosts + monthlyNetProfit;
    const recommendedCoverage = monthlyCoverageNeed * recoveryMonths;

    // The gross-revenue mistake, shown side by side so users can see how
    // large the overstatement usually is when someone sizes coverage off
    // total revenue instead of fixed costs plus lost profit.
    const grossRevenueMethod = monthlyRevenue * recoveryMonths;
    const overstatement = grossRevenueMethod - recommendedCoverage;
    const overstatementPct =
      recommendedCoverage > 0 ? (overstatement / recommendedCoverage) * 100 : 0;

    const hasInputs = fixedCosts > 0 || monthlyRevenue > 0;
    const thinMargin = clampedMargin < 5 && monthlyRevenue > 0;
    const shortRecovery = recoveryMonths <= 2;
    const longRecovery = recoveryMonths >= 12;

    return {
      clampedMargin,
      monthlyNetProfit,
      monthlyCoverageNeed,
      recommendedCoverage,
      grossRevenueMethod,
      overstatement,
      overstatementPct,
      hasInputs,
      thinMargin,
      shortRecovery,
      longRecovery,
    };
  }, [fixedCosts, monthlyRevenue, profitMargin, recoveryMonths]);

  async function copyResult() {
    const lines = [
      "Business interruption (business income) coverage estimate",
      `Monthly fixed costs: ${USD.format(fixedCosts)}`,
      `Monthly net profit (${result.clampedMargin}% margin on ${USD.format(monthlyRevenue)} revenue): ${USD.format(result.monthlyNetProfit)}`,
      `Monthly coverage need: ${USD.format(result.monthlyCoverageNeed)}`,
      `Recovery period: ${recoveryMonths} month${recoveryMonths === 1 ? "" : "s"}`,
      `Suggested business income coverage limit: ${USD.format(result.recommendedCoverage)}`,
      "This is a pre-loss sizing estimate, not a claim amount, quote, or coverage recommendation.",
      "insurancetools.org/tools/business/business-interruption-calculator",
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
        <span className="label-mono text-slate-500">BUSINESS INTERRUPTION CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Average monthly fixed costs"
            hint="Rent, payroll you'd keep paying, loan payments, utilities, insurance — costs that continue even if you close"
            value={fixedCosts}
            onChange={setFixedCosts}
          />
          <NumberField
            label="Average monthly revenue"
            hint="Typical monthly sales before expenses, in a normal operating month"
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
          />
          <NumberField
            label="Net profit margin"
            hint="Net profit as a percent of revenue, after all expenses (check your income statement)"
            value={profitMargin}
            onChange={setProfitMargin}
            max={100}
            step={1}
            suffix="%"
          />
          <NumberField
            label="Expected recovery period"
            hint="Months you estimate to reopen and rebuild volume — based on your lease terms, equipment lead times, and local contractors, not a generic average"
            value={recoveryMonths}
            onChange={setRecoveryMonths}
            max={36}
            step={1}
            suffix="months"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED COVERAGE LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.recommendedCoverage)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.monthlyCoverageNeed)}/month &times; {recoveryMonths} month
              {recoveryMonths === 1 ? "" : "s"} of estimated recovery
            </p>
          </div>

          {result.overstatement > 0 && result.hasInputs && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Sizing this off gross revenue instead (a common mistake) would suggest{" "}
              {USD.format(result.grossRevenueMethod)} — about {Math.round(result.overstatementPct)}% higher
              than the fixed-costs-plus-lost-profit method, because gross revenue includes costs your
              business would stop paying once it&apos;s closed.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Monthly fixed costs" value={USD.format(fixedCosts)} />
            <Figure label="Monthly net profit" value={USD.format(result.monthlyNetProfit)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Profit margin check</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.thinMargin
                  ? `A ${result.clampedMargin}% margin is thin. Double-check this against your actual income statement — an understated margin will understate the coverage you need.`
                  : `At a ${result.clampedMargin}% margin, your monthly net profit is ${USD.format(result.monthlyNetProfit)}. Pull this figure from your actual financials rather than estimating, since it drives most of the coverage number.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Recovery period check</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.shortRecovery
                  ? "Two months or less is short for a serious property loss involving rebuilding, permitting, or specialized equipment. Consider your actual lease terms and equipment lead times before settling on this number."
                  : result.longRecovery
                    ? "12 months or more is a long recovery window. That's realistic for some total losses, but confirm it against your specific rebuild scenario rather than defaulting to a round number."
                    : "This period only makes sense if it reflects your own lease terms, equipment lead times, and local contractor availability — not an industry average, which this tool does not use."}
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
        Estimate only. This tool models the standard fixed-costs-plus-lost-profit business income
        formula for pre-loss coverage sizing; it is not a quote, an actual claim amount, or a substitute
        for a commercial property agent&apos;s review of your policy, extra expense needs, and period of
        restoration. Recovery time varies enormously by business type, lease terms, and location — this
        tool does not assume or fabricate a typical figure for you.
      </div>
    </div>
  );
}

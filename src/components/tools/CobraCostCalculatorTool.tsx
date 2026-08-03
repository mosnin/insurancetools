"use client";

/**
 * COBRA cost calculator.
 *
 * COBRA continuation coverage lets a qualified beneficiary keep the exact
 * group health plan they had through an employer after a qualifying event,
 * but the employer stops absorbing its share of the premium. Under 29
 * U.S.C. § 1162 (the COBRA continuation coverage statute administered by
 * the Department of Labor), the plan may charge up to 102% of the total
 * premium — both the employee's former payroll deduction and the
 * employer's former contribution — with the extra 2% covering plan
 * administration. For certain months of an approved Social Security
 * disability extension, the statute allows the cap to rise to 150% of the
 * total premium. This tool applies both figures directly; it does not
 * treat them as estimates.
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const USD0 = new Intl.NumberFormat("en-US", {
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
  suffix?: string;
}

function NumberField({ label, hint, value, onChange, max = 20_000, suffix }: NumberFieldProps) {
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
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
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

export function CobraCostCalculatorTool() {
  const [totalMonthlyPremium, setTotalMonthlyPremium] = useState(650);
  const [currentEmployeeShare, setCurrentEmployeeShare] = useState(150);
  const [disabilityExtension, setDisabilityExtension] = useState(false);
  const [marketplacePremium, setMarketplacePremium] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const employerShare = Math.max(0, totalMonthlyPremium - currentEmployeeShare);
    const adminRate = disabilityExtension ? 1.5 : 1.02;
    const cobraMonthly = totalMonthlyPremium * adminRate;
    const adminFee = totalMonthlyPremium * (adminRate - 1);
    const increaseOverPayrollDeduction = cobraMonthly - currentEmployeeShare;
    const cobraAnnual = cobraMonthly * 12;

    const hasMarketplace = marketplacePremium > 0;
    const marketplaceAnnual = marketplacePremium * 12;
    const monthlyDifference = cobraMonthly - marketplacePremium;
    const annualDifference = cobraAnnual - marketplaceAnnual;
    const cheaperOption = monthlyDifference > 0 ? "marketplace" : monthlyDifference < 0 ? "cobra" : "tie";

    return {
      employerShare,
      adminRate,
      cobraMonthly,
      adminFee,
      increaseOverPayrollDeduction,
      cobraAnnual,
      hasMarketplace,
      marketplaceAnnual,
      monthlyDifference,
      annualDifference,
      cheaperOption,
    };
  }, [totalMonthlyPremium, currentEmployeeShare, disabilityExtension, marketplacePremium]);

  async function copyResult() {
    const lines = [
      "COBRA cost estimate",
      `Total premium (employee + employer share): ${USD.format(totalMonthlyPremium)}/month`,
      `COBRA premium at ${disabilityExtension ? "150%" : "102%"} of total premium: ${USD.format(result.cobraMonthly)}/month (${USD.format(result.cobraAnnual)}/year)`,
      `Increase over your old payroll deduction of ${USD.format(currentEmployeeShare)}/month: +${USD.format(result.increaseOverPayrollDeduction)}/month`,
      result.hasMarketplace
        ? result.cheaperOption === "tie"
          ? `Marketplace premium of ${USD.format(marketplacePremium)}/month costs about the same as COBRA`
          : `Marketplace premium of ${USD.format(marketplacePremium)}/month is ${USD.format(Math.abs(result.monthlyDifference))}/month ${result.cheaperOption === "marketplace" ? "cheaper" : "more expensive"} than COBRA`
        : "Enter a marketplace premium to compare against COBRA",
      "Estimate only, not a benefits determination. insurancetools.org/tools/health/cobra-cost-calculator",
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
        <span className="label-mono text-slate-500">COBRA COST CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Total monthly premium (employee + employer share)"
            hint="Find this on your COBRA election notice, or ask HR — it's not just what was deducted from your paycheck"
            value={totalMonthlyPremium}
            onChange={setTotalMonthlyPremium}
            suffix="/mo"
          />
          <NumberField
            label="Your old payroll deduction"
            hint="What you personally paid per month while still employed"
            value={currentEmployeeShare}
            onChange={setCurrentEmployeeShare}
            max={totalMonthlyPremium}
            suffix="/mo"
          />

          <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-3">
            <input
              type="checkbox"
              checked={disabilityExtension}
              onChange={(e) => setDisabilityExtension(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs leading-relaxed text-slate-600">
              I qualify for the Social Security disability extension for these specific months
              <span className="mt-1 block text-slate-400">
                Applies only to certain months under an approved disability determination, where the
                cap rises to 150% of the total premium instead of the general 102% rule.
              </span>
            </span>
          </label>

          <NumberField
            label="Marketplace plan premium (optional)"
            hint="A comparable plan's full monthly premium from healthcare.gov or your state exchange"
            value={marketplacePremium}
            onChange={setMarketplacePremium}
            suffix="/mo"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              COBRA PREMIUM AT {disabilityExtension ? "150%" : "102%"}
            </p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.cobraMonthly)}
              <span className="ml-1 text-base font-medium text-slate-400">/mo</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD0.format(result.cobraAnnual)}/year total, including the{" "}
              {disabilityExtension ? "50%" : "2%"} administrative charge of {USD.format(result.adminFee)}/mo
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            You&apos;ll now pay {USD.format(result.increaseOverPayrollDeduction)}/mo more than your old
            payroll deduction of {USD.format(currentEmployeeShare)}, because your employer&apos;s former
            share of {USD.format(result.employerShare)}/mo becomes your responsibility under COBRA.
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Employer's former share" value={USD.format(result.employerShare)} />
            <Figure
              label="Admin charge"
              value={`${disabilityExtension ? "50" : "2"}% (${USD.format(result.adminFee)}/mo)`}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">COBRA vs. marketplace</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasMarketplace
                  ? "Enter a marketplace plan's premium above to see which option costs less for comparable coverage."
                  : result.cheaperOption === "tie"
                    ? `At ${USD.format(marketplacePremium)}/mo, the marketplace plan costs about the same as COBRA.`
                    : result.cheaperOption === "marketplace"
                      ? `The marketplace plan at ${USD.format(marketplacePremium)}/mo is ${USD.format(Math.abs(result.monthlyDifference))}/mo cheaper than COBRA (${USD0.format(Math.abs(result.annualDifference))}/year), though it likely means a different network, plan design, or deductible than your COBRA plan.`
                      : `COBRA is ${USD.format(Math.abs(result.monthlyDifference))}/mo cheaper than the marketplace plan you entered (${USD0.format(Math.abs(result.annualDifference))}/year), which can happen when an employer plan is unusually generous or the marketplace quote includes a richer plan tier.`}
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
        Estimate only. The 102% and 150% figures come directly from the COBRA statute (29 U.S.C. § 1162)
        as administered by the U.S. Department of Labor, but this tool does not know your plan&apos;s exact
        premium, your state&apos;s mini-COBRA rules if your employer has fewer than 20 employees, or your
        plan administrator&apos;s billing schedule. Confirm your exact premium and payment deadlines with
        your plan administrator or the COBRA election notice you were sent.
      </div>
    </div>
  );
}

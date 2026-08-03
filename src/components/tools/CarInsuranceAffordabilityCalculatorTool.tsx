"use client";

/**
 * Car insurance affordability calculator.
 *
 * Answers "can I afford this car insurance premium" using a budgeting
 * guideline approach rather than a fabricated statistic: consumer-finance
 * educators commonly suggest keeping total transportation costs (car
 * payment, insurance, fuel, and maintenance combined) to roughly 15-20% of
 * take-home pay. This tool backs a suggested insurance-only budget out of
 * that range by subtracting the user's car payment, then compares an
 * entered or quoted premium against that suggested range. It also flags a
 * simple debt-to-income caution using the commonly cited 36% guideline.
 *
 * Everything here is a guideline, not a rule, and the copy says so
 * throughout. All math runs client-side; nothing typed here is sent
 * anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const PERCENT = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 50_000 }: NumberFieldProps) {
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
          step={10}
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

export function CarInsuranceAffordabilityCalculatorTool() {
  const [monthlyIncome, setMonthlyIncome] = useState(4_200);
  const [carPayment, setCarPayment] = useState(350);
  const [otherDebt, setOtherDebt] = useState(300);
  const [actualPremium, setActualPremium] = useState(150);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasIncome = monthlyIncome > 0;

    const transportLow = monthlyIncome * 0.15;
    const transportHigh = monthlyIncome * 0.2;

    const insuranceBudgetLow = Math.max(0, transportLow - carPayment);
    const insuranceBudgetHigh = Math.max(0, transportHigh - carPayment);

    const dti = hasIncome ? (carPayment + otherDebt) / monthlyIncome : 0;
    const dtiCaution = hasIncome && dti > 0.36;

    const hasPremium = actualPremium > 0;
    const premiumBelow = hasPremium && actualPremium < insuranceBudgetLow;
    const premiumWithin = hasPremium && actualPremium >= insuranceBudgetLow && actualPremium <= insuranceBudgetHigh;
    const premiumAbove = hasPremium && actualPremium > insuranceBudgetHigh;

    const carPaymentExceedsBudget = carPayment > transportHigh;

    return {
      hasIncome,
      transportLow,
      transportHigh,
      insuranceBudgetLow,
      insuranceBudgetHigh,
      dti,
      dtiCaution,
      hasPremium,
      premiumBelow,
      premiumWithin,
      premiumAbove,
      carPaymentExceedsBudget,
    };
  }, [monthlyIncome, carPayment, otherDebt, actualPremium]);

  async function copyResult() {
    const lines = [
      "Car insurance affordability estimate",
      `Suggested total transportation budget: ${USD.format(result.transportLow)}–${USD.format(result.transportHigh)}/month (15–20% of take-home pay, a common guideline)`,
      `Suggested insurance-only budget after car payment: ${USD.format(result.insuranceBudgetLow)}–${USD.format(result.insuranceBudgetHigh)}/month`,
      result.hasPremium
        ? result.premiumWithin
          ? `Your ${USD.format(actualPremium)}/month premium falls within the suggested range`
          : result.premiumAbove
            ? `Your ${USD.format(actualPremium)}/month premium is above the suggested range`
            : `Your ${USD.format(actualPremium)}/month premium is below the suggested range`
        : "Enter your premium to compare it against the suggested range",
      result.dtiCaution
        ? `Caution: car payment + other debt is ${PERCENT.format(result.dti)} of take-home pay, above the commonly cited 36% debt-to-income guideline`
        : `Car payment + other debt is ${PERCENT.format(result.dti)} of take-home pay`,
      "General budgeting guideline, not personalized financial advice. insurancetools.org/tools/auto/car-insurance-affordability-calculator",
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
        <span className="label-mono text-slate-500">CAR INSURANCE AFFORDABILITY CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Monthly take-home income"
            hint="Pay after taxes and deductions, not gross salary"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
          />
          <NumberField
            label="Monthly car payment"
            hint="Leave at $0 if you own the car outright"
            value={carPayment}
            onChange={setCarPayment}
          />
          <NumberField
            label="Other monthly debt payments"
            hint="Credit cards, student loans, personal loans — not car insurance"
            value={otherDebt}
            onChange={setOtherDebt}
          />
          <NumberField
            label="Actual or quoted monthly premium"
            hint="Optional — what you're paying or being quoted"
            value={actualPremium}
            onChange={setActualPremium}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED INSURANCE BUDGET</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.insuranceBudgetLow)}–{USD.format(result.insuranceBudgetHigh)}
              <span className="ml-1 text-base font-normal text-slate-400">/mo</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Based on a {USD.format(result.transportLow)}–{USD.format(result.transportHigh)}/month total
              transportation budget (15–20% of take-home pay), minus your {USD.format(carPayment)} car
              payment.
            </p>
          </div>

          {result.carPaymentExceedsBudget && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your car payment alone ({USD.format(carPayment)}) is above the high end of the suggested total
              transportation budget ({USD.format(result.transportHigh)}), before insurance, fuel, or
              maintenance are even added in.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Total transportation budget"
              value={`${USD.format(result.transportLow)}–${USD.format(result.transportHigh)}`}
            />
            <Figure
              label="Debt-to-income (car + other debt)"
              value={result.hasIncome ? PERCENT.format(result.dti) : "—"}
              tone={result.dtiCaution ? "accent" : "default"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Your premium vs. the suggested range</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasPremium
                  ? "Enter your actual or quoted monthly premium to see how it compares."
                  : result.premiumWithin
                    ? `Your ${USD.format(actualPremium)}/month premium falls inside the suggested ${USD.format(result.insuranceBudgetLow)}–${USD.format(result.insuranceBudgetHigh)} range.`
                    : result.premiumAbove
                      ? `Your ${USD.format(actualPremium)}/month premium is above the suggested ${USD.format(result.insuranceBudgetLow)}–${USD.format(result.insuranceBudgetHigh)} range. That doesn't mean the price is wrong, but it's worth comparing quotes or reviewing your coverage and deductible.`
                      : `Your ${USD.format(actualPremium)}/month premium is below the suggested ${USD.format(result.insuranceBudgetLow)}–${USD.format(result.insuranceBudgetHigh)} range, which leaves room in your transportation budget for fuel and maintenance.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Debt-to-income check</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasIncome
                  ? "Enter your monthly take-home income to run this check."
                  : result.dtiCaution
                    ? `Your car payment and other debt add up to ${PERCENT.format(result.dti)} of take-home pay, above the commonly cited 36% debt-to-income guideline some lenders use. Consider that context before adding a new premium.`
                    : `Your car payment and other debt add up to ${PERCENT.format(result.dti)} of take-home pay, under the commonly cited 36% debt-to-income guideline.`}
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
        Estimate only, and a general budgeting guideline rather than personalized financial advice. The
        15–20% transportation and 36% debt-to-income figures are commonly cited rules of thumb among
        consumer-finance educators, not fixed formulas, government mandates, or lender requirements. Your
        own budget, goals, and other expenses may reasonably justify spending more or less. For advice
        specific to your situation, talk with a licensed insurance agent or a financial professional.
      </div>
    </div>
  );
}

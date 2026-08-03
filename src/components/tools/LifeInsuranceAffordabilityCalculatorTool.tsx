"use client";

/**
 * Life insurance affordability calculator.
 *
 * Answers "how much life insurance premium can I actually sustain" using an
 * editable budgeting guideline rather than a fabricated rule: some financial
 * planners suggest keeping total insurance premiums, life insurance
 * included, to roughly 1-3% of income. That range is a commonly cited
 * starting point, not a formula every advisor agrees with, so this tool
 * exposes the percentage as a field the user can change rather than baking
 * it in as a fixed fact. The suggested monthly budget that percentage
 * produces is then compared against an optional quoted premium, and a
 * simple debt-to-income style context line shows how existing debt is
 * already competing for the same paycheck.
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

const PERCENT = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const MIN_PERCENT = 0.5;
const MAX_PERCENT = 6;
const MAX_INCOME = 100_000;
const MAX_DEBT = 50_000;
const MAX_PREMIUM = 5_000;

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
}

function CurrencyField({ label, hint, value, onChange, max }: CurrencyFieldProps) {
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

interface PercentFieldProps {
  value: number;
  onChange: (value: number) => void;
}

function PercentField({ value, onChange }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">
        Budget percentage of income
      </span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={MIN_PERCENT}
          max={MAX_PERCENT}
          step={0.1}
          value={Number.isFinite(value) ? value : MIN_PERCENT}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw)
              ? Math.min(Math.max(raw, MIN_PERCENT), MAX_PERCENT)
              : MIN_PERCENT;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      <span className="mt-1 block text-xs text-slate-400">
        Editable. Some planners cite roughly 1–3% of income for total insurance premiums; this is your
        own assumption to test, not a rule this tool enforces.
      </span>
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

export function LifeInsuranceAffordabilityCalculatorTool() {
  const [monthlyIncome, setMonthlyIncome] = useState(5_000);
  const [monthlyDebt, setMonthlyDebt] = useState(400);
  const [budgetPercent, setBudgetPercent] = useState(2);
  const [quotedPremium, setQuotedPremium] = useState(45);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasIncome = monthlyIncome > 0;

    const suggestedBudget = monthlyIncome * (budgetPercent / 100);

    const hasPremium = quotedPremium > 0;
    const premiumWithinBudget = hasPremium && quotedPremium <= suggestedBudget;
    const premiumOverBudget = hasPremium && quotedPremium > suggestedBudget;
    const overAmount = premiumOverBudget ? quotedPremium - suggestedBudget : 0;
    const roomRemaining = hasPremium && premiumWithinBudget ? suggestedBudget - quotedPremium : 0;

    const premiumForContext = hasPremium ? quotedPremium : suggestedBudget;
    const totalObligations = monthlyDebt + premiumForContext;
    const obligationShare = hasIncome ? totalObligations / monthlyIncome : 0;
    const obligationCaution = hasIncome && obligationShare > 0.36;

    return {
      hasIncome,
      suggestedBudget,
      hasPremium,
      premiumWithinBudget,
      premiumOverBudget,
      overAmount,
      roomRemaining,
      totalObligations,
      obligationShare,
      obligationCaution,
    };
  }, [monthlyIncome, monthlyDebt, budgetPercent, quotedPremium]);

  async function copyResult() {
    const lines = [
      "Life insurance affordability estimate",
      `Suggested monthly premium budget: ${USD.format(result.suggestedBudget)} (${budgetPercent}% of monthly income, a common guideline you set yourself)`,
      result.hasPremium
        ? result.premiumWithinBudget
          ? `Your ${USD.format(quotedPremium)}/month quoted premium fits within the suggested budget`
          : `Your ${USD.format(quotedPremium)}/month quoted premium is ${USD.format(result.overAmount)} above the suggested budget`
        : "Enter a quoted premium to compare it against the suggested budget",
      result.obligationCaution
        ? `Caution: existing debt plus this premium is ${PERCENT.format(result.obligationShare)} of monthly income, above the commonly cited 36% debt-to-income guideline`
        : `Existing debt plus this premium is ${PERCENT.format(result.obligationShare)} of monthly income`,
      "General budgeting guideline, not personalized financial or insurance advice. insurancetools.org/tools/life/life-insurance-affordability-calculator",
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
        <span className="label-mono text-slate-500">LIFE INSURANCE AFFORDABILITY CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <CurrencyField
            label="Monthly take-home income"
            hint="Pay after taxes and deductions, not gross salary"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            max={MAX_INCOME}
          />
          <CurrencyField
            label="Existing monthly debt payments"
            hint="Credit cards, student loans, car loans, personal loans — not this premium"
            value={monthlyDebt}
            onChange={setMonthlyDebt}
            max={MAX_DEBT}
          />
          <PercentField value={budgetPercent} onChange={setBudgetPercent} />
          <CurrencyField
            label="Premium you've been quoted"
            hint="Optional — a monthly quote for the coverage you're considering"
            value={quotedPremium}
            onChange={setQuotedPremium}
            max={MAX_PREMIUM}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED PREMIUM BUDGET</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.suggestedBudget)}
              <span className="ml-1 text-base font-normal text-slate-400">/mo</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {budgetPercent}% of your {USD.format(monthlyIncome)}/month take-home income — a percentage
              you set, not a figure this tool fixes for you.
            </p>
          </div>

          {result.premiumOverBudget && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your quoted premium is {USD.format(result.overAmount)} above the {budgetPercent}% budget
              you set. That doesn&apos;t mean the quote is wrong, but it&apos;s worth comparing term length,
              coverage amount, and other insurers before committing to it.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total monthly obligations" value={USD.format(result.totalObligations)} />
            <Figure
              label="Debt + premium share of income"
              value={result.hasIncome ? PERCENT.format(result.obligationShare) : "—"}
              tone={result.obligationCaution ? "accent" : "default"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Your quote vs. the suggested budget</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasPremium
                  ? "Enter a quoted or expected monthly premium to see how it compares."
                  : result.premiumWithinBudget
                    ? `Your ${USD.format(quotedPremium)}/month quote fits inside the ${USD.format(result.suggestedBudget)} budget, leaving about ${USD.format(result.roomRemaining)} of headroom at the ${budgetPercent}% level you set.`
                    : `Your ${USD.format(quotedPremium)}/month quote is above the ${USD.format(result.suggestedBudget)} suggested budget by ${USD.format(result.overAmount)}. Consider a longer-term level premium, a lower coverage amount, or shopping additional insurers before deciding it's unaffordable.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Debt-to-income style context</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {!result.hasIncome
                  ? "Enter your monthly take-home income to run this check."
                  : result.obligationCaution
                    ? `Your existing debt plus this premium add up to ${PERCENT.format(result.obligationShare)} of take-home pay, above the commonly cited 36% debt-to-income guideline some lenders use as a caution line. That's a reason to look closely at the premium before adding it, not an automatic disqualifier.`
                    : `Your existing debt plus this premium add up to ${PERCENT.format(result.obligationShare)} of take-home pay, under the commonly cited 36% debt-to-income guideline.`}
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
        Estimate only, and a general budgeting guideline rather than personalized financial or insurance
        advice. The 1–3% starting point some planners cite for total insurance premiums, and the 36%
        debt-to-income line shown above, are commonly referenced rules of thumb, not fixed formulas,
        regulatory requirements, or underwriting standards. Your own priorities, dependents, and other
        expenses may reasonably justify a different number. For advice specific to your situation, talk
        with a licensed insurance agent or a financial professional.
      </div>
    </div>
  );
}

"use client";

/**
 * Mortgage protection insurance calculator.
 *
 * Mortgage protection (and mortgage life) policies are almost always sold
 * as decreasing term insurance matched to the loan's own amortization
 * schedule: the death benefit shrinks every year as the payoff balance
 * shrinks, but the premium is typically quoted level for the life of the
 * policy. That mismatch — a level premium paying for a shrinking benefit —
 * is the single most misunderstood part of this product category, and it's
 * the thing this tool is built to make visible.
 *
 * The calculator shows two numbers side by side: the flat coverage amount
 * that matches today's payoff balance, and where that balance is
 * projected to be in 5 and 10 years using the standard loan amortization
 * formula applied to the user's own remaining balance, term, and rate. It
 * does not compare to real mortgage protection premiums or real term life
 * premiums, since this site does not have access to underwritten pricing —
 * it only projects the balance itself.
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

const USD_CENTS = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const PCT = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function DollarField({ label, hint, value, onChange, max = 5_000_000 }: DollarFieldProps) {
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
          step={1000}
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

interface YearsFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function YearsField({ label, hint, value, onChange }: YearsFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={40}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Math.round(Number(e.target.value));
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 40) : 1;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          years
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface RateFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function RateField({ label, hint, value, onChange }: RateFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={15}
          step={0.05}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 15) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
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

/** Standard fixed-rate monthly payment for a loan amortized over n months at monthly rate r. */
function monthlyPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  const pow = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * pow) / (pow - 1);
}

/** Remaining balance after `monthsElapsed` of a standard amortization schedule. */
function balanceAfter(principal: number, monthlyRate: number, totalMonths: number, monthsElapsed: number): number {
  if (principal <= 0 || totalMonths <= 0) return 0;
  const m = Math.min(monthsElapsed, totalMonths);
  const payment = monthlyPayment(principal, monthlyRate, totalMonths);
  if (monthlyRate === 0) {
    return Math.max(0, principal - payment * m);
  }
  const pow = Math.pow(1 + monthlyRate, m);
  const balance = principal * pow - payment * ((pow - 1) / monthlyRate);
  return Math.max(0, Math.round(balance));
}

export function MortgageProtectionCalculatorTool() {
  const [balance, setBalance] = useState(300_000);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(6.5);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalMonths = Math.round(years * 12);
    const monthlyRate = rate / 100 / 12;
    const payment = monthlyPayment(balance, monthlyRate, totalMonths);

    const balanceIn5 = balanceAfter(balance, monthlyRate, totalMonths, 60);
    const balanceIn10 = balanceAfter(balance, monthlyRate, totalMonths, 120);

    const paidOffBy5 = totalMonths <= 60;
    const paidOffBy10 = totalMonths <= 120;

    const declinePct5 = balance > 0 ? (balance - balanceIn5) / balance : 0;
    const declinePct10 = balance > 0 ? (balance - balanceIn10) / balance : 0;

    return {
      levelCoverage: Math.round(balance),
      payment,
      balanceIn5,
      balanceIn10,
      paidOffBy5,
      paidOffBy10,
      declinePct5,
      declinePct10,
      totalMonths,
    };
  }, [balance, years, rate]);

  async function copyResult() {
    const lines = [
      "Mortgage protection insurance calculator results",
      `Flat coverage amount (today's payoff balance): ${USD.format(result.levelCoverage)}`,
      `Projected balance in 5 years: ${result.paidOffBy5 ? "paid off" : USD.format(result.balanceIn5)}`,
      `Projected balance in 10 years: ${result.paidOffBy10 ? "paid off" : USD.format(result.balanceIn10)}`,
      "A decreasing term mortgage protection policy's death benefit typically follows this same declining schedule, while a level term life policy bought separately keeps a fixed death benefit and stays portable if you refinance or move.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/life/mortgage-protection-calculator",
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
        <span className="label-mono text-slate-500">MORTGAGE PROTECTION INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Remaining mortgage balance"
            hint="Today's payoff amount, not your original loan amount"
            value={balance}
            onChange={setBalance}
          />
          <YearsField
            label="Remaining amortization term"
            hint="Years left on the loan, not the original term"
            value={years}
            onChange={setYears}
          />
          <RateField
            label="Interest rate"
            hint="Your mortgage's own rate, so the balance projection matches your loan"
            value={rate}
            onChange={setRate}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">FLAT COVERAGE AMOUNT TODAY</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.levelCoverage)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              A level death benefit sized to pay off the mortgage in full if something happened to you
              today.
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            Most mortgage protection policies are sold as decreasing term insurance: the benefit shrinks
            on roughly this same schedule as your loan balance, not the flat amount above. Here&apos;s where
            your balance is projected to be at two future check-in points.
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Balance in 5 years"
              value={result.paidOffBy5 ? "Paid off" : USD.format(result.balanceIn5)}
              tone="accent"
            />
            <Figure
              label="Balance in 10 years"
              value={result.paidOffBy10 ? "Paid off" : USD.format(result.balanceIn10)}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">How much the need declines</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.paidOffBy5
                  ? `At this rate and remaining term, the loan is fully amortized before your 5-year check-in, so a decreasing term benefit tied to it would fall to $0 well before then.`
                  : `By year 5, the payoff balance is projected to be about ${PCT.format(result.declinePct5)} lower than today. By year 10, it's projected to be about ${PCT.format(result.declinePct10)} lower${result.paidOffBy10 ? " (the loan is fully paid off by then)" : ""}.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Estimated monthly payment</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Based on your entered balance, term, and rate, principal and interest come to about{" "}
                {USD_CENTS.format(result.payment)}/month. This is what the amortization schedule above is
                built from — it does not include taxes, homeowners insurance, or PMI.
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
        Estimate only. This tool projects your mortgage&apos;s own payoff balance using the standard loan
        amortization formula; it does not know your lender&apos;s actual schedule, any extra payments
        you&apos;ve made, rate changes on an adjustable loan, or real underwritten mortgage protection or
        term life premiums. Confirm your exact payoff balance with your loan servicer and get an exact
        price from a licensed insurance agent before buying or changing a policy.
      </div>
    </div>
  );
}

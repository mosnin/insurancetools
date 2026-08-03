"use client";

/**
 * Net worth protection calculator.
 *
 * Two things happen here, in one live-updating tool:
 *
 * 1. A standard net worth calculation: itemized assets (home value,
 *    investment/retirement accounts, vehicles, savings) minus itemized
 *    liabilities (mortgage balance, other debts).
 * 2. A liability-adequacy check: the resulting net worth is compared
 *    against the user's own entered TOTAL current liability protection
 *    (auto liability + home/renters liability + any umbrella limit,
 *    summed), using the common asset-protection principle that liability
 *    limits ideally cover the assets a lawsuit could reach.
 *
 * This tool does not size a specific umbrella policy — see
 * /tools/coverage/umbrella-policy-need-calculator for that. This tool
 * answers the step before it: what is my net worth, and does my current
 * liability protection, added up across all my policies, already cover it?
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
}

function NumberField({ label, hint, value, onChange, max = 20_000_000 }: NumberFieldProps) {
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
          step={100}
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

export function NetWorthProtectionCalculatorTool() {
  // Assets
  const [homeValue, setHomeValue] = useState(350_000);
  const [investmentRetirement, setInvestmentRetirement] = useState(45_000);
  const [vehicleValue, setVehicleValue] = useState(25_000);
  const [savings, setSavings] = useState(15_000);

  // Liabilities (debts, not insurance limits)
  const [mortgageBalance, setMortgageBalance] = useState(220_000);
  const [otherDebts, setOtherDebts] = useState(8_000);

  // Current liability protection, summed across policies
  const [autoLiability, setAutoLiability] = useState(300_000);
  const [homeRentersLiability, setHomeRentersLiability] = useState(300_000);
  const [umbrellaLimit, setUmbrellaLimit] = useState(0);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const totalAssets = homeValue + investmentRetirement + vehicleValue + savings;
    const totalDebt = mortgageBalance + otherDebts;
    const netWorth = totalAssets - totalDebt;

    const totalLiabilityProtection = autoLiability + homeRentersLiability + umbrellaLimit;

    // Only positive net worth is theoretically reachable in a judgment.
    const atRiskAmount = Math.max(0, netWorth);
    const exposedAmount = Math.max(0, atRiskAmount - totalLiabilityProtection);
    const isCovered = exposedAmount <= 0;

    const coveragePercent =
      atRiskAmount <= 0 ? 100 : Math.min(100, Math.round((totalLiabilityProtection / atRiskAmount) * 100));

    const homeEquity = homeValue - mortgageBalance;

    return {
      totalAssets,
      totalDebt,
      netWorth,
      totalLiabilityProtection,
      atRiskAmount,
      exposedAmount,
      isCovered,
      coveragePercent,
      homeEquity,
    };
  }, [
    homeValue,
    investmentRetirement,
    vehicleValue,
    savings,
    mortgageBalance,
    otherDebts,
    autoLiability,
    homeRentersLiability,
    umbrellaLimit,
  ]);

  async function copyResult() {
    const lines = [
      "Net worth protection check",
      `Net worth: ${USD.format(result.netWorth)} (assets ${USD.format(result.totalAssets)} minus debts ${USD.format(result.totalDebt)})`,
      `Current total liability protection: ${USD.format(result.totalLiabilityProtection)} (auto + home/renters + umbrella)`,
      result.isCovered
        ? `Coverage check: current liability limits cover an estimated ${result.coveragePercent}% of at-risk net worth`
        : `Coverage check: roughly ${USD.format(result.exposedAmount)} of net worth exceeds current liability protection`,
      "Planning estimate only, not legal or insurance advice. insurancetools.org/tools/coverage/net-worth-protection-calculator",
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
        <span className="label-mono text-slate-500">NET WORTH PROTECTION CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Assets</p>
            <div className="space-y-4">
              <NumberField
                label="Home value"
                hint="Current market value, not what you paid"
                value={homeValue}
                onChange={setHomeValue}
              />
              <NumberField
                label="Investment & retirement accounts"
                hint="Brokerage, 401(k), IRA, and similar balances combined"
                value={investmentRetirement}
                onChange={setInvestmentRetirement}
              />
              <NumberField
                label="Vehicles"
                hint="Combined value of cars, boats, or other titled vehicles"
                value={vehicleValue}
                onChange={setVehicleValue}
              />
              <NumberField
                label="Savings & cash"
                hint="Checking, savings, and cash equivalents"
                value={savings}
                onChange={setSavings}
              />
            </div>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Debts</p>
            <div className="space-y-4">
              <NumberField
                label="Remaining mortgage balance"
                hint="Leave at $0 if you own your home outright"
                value={mortgageBalance}
                onChange={setMortgageBalance}
              />
              <NumberField
                label="Other debts"
                hint="Credit cards, auto loans, student loans, personal loans"
                value={otherDebts}
                onChange={setOtherDebts}
              />
            </div>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Current liability protection
            </p>
            <div className="space-y-4">
              <NumberField
                label="Auto liability limit"
                hint="Your policy's total per-accident liability limit"
                value={autoLiability}
                onChange={setAutoLiability}
              />
              <NumberField
                label="Home or renters liability limit"
                hint="The personal liability section of that policy"
                value={homeRentersLiability}
                onChange={setHomeRentersLiability}
              />
              <NumberField
                label="Umbrella policy limit"
                hint="Enter $0 if you don't carry one"
                value={umbrellaLimit}
                onChange={setUmbrellaLimit}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">YOUR NET WORTH</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.netWorth)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.totalAssets)} in assets minus {USD.format(result.totalDebt)} in debts, including{" "}
              {USD.format(result.homeEquity)} of home equity.
            </p>
          </div>

          <div
            className={`rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${
              result.isCovered
                ? "border-blue-100 bg-blue-50 text-blue-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {result.isCovered ? (
              <>
                Your current liability protection ({USD.format(result.totalLiabilityProtection)}) is at or above
                your net worth. Based on the common asset-protection guideline of matching liability limits to
                what a lawsuit could reach, your current limits look adequate.
              </>
            ) : (
              <>
                Your net worth ({USD.format(result.atRiskAmount)}) is above your current total liability protection
                ({USD.format(result.totalLiabilityProtection)}) by an estimated {USD.format(result.exposedAmount)}.
                Under the common asset-protection guideline, this is the amount that could be exposed in a
                judgment beyond what your policies would pay. Many people in this position size a personal
                umbrella policy to close the gap.
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total liability protection" value={USD.format(result.totalLiabilityProtection)} />
            <Figure
              label="Coverage of at-risk net worth"
              value={`${result.coveragePercent}%`}
              tone={result.isCovered ? "accent" : "warn"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">What counts as &ldquo;at risk&rdquo; here</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                This tool treats your full positive net worth as the amount a judgment could theoretically
                reach. In practice, some assets, most notably certain retirement accounts and, in some states, a
                portion of home equity, may have legal protection from creditors. Those protections vary
                significantly by state and by account type, so treat the gap above as a starting point for a
                conversation, not a legal conclusion.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Next step</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                If a gap shows above, the{" "}
                <a href="/tools/coverage/umbrella-policy-need-calculator" className="text-blue-600 hover:underline">
                  umbrella policy need calculator
                </a>{" "}
                sizes a specific umbrella limit to close it.
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
        Estimate only. This tool models a commonly cited asset-protection guideline, matching liability limits
        to net worth, not a personalized legal or financial analysis. It does not know your state&apos;s specific
        homestead or retirement-account exemption rules, your insurer&apos;s underwriting rules, or the facts of
        any actual claim. Confirm exemption rules with an attorney and get exact liability limit pricing from a
        licensed insurance agent before changing coverage.
      </div>
    </div>
  );
}

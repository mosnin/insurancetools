"use client";

/**
 * Business owner life insurance calculator.
 *
 * This is deliberately narrow: it sizes the *personal* life insurance an
 * owner needs to cover business-created obligations, not a commercial
 * policy and not general household income replacement. It sums three
 * independent components the owner enters directly:
 *
 *   1. Personally guaranteed business debt — loans or lines of credit the
 *      owner signed for personally, which survive the business and become
 *      the owner's estate's problem if the owner dies.
 *   2. A buy-sell funding need — either a fixed buyout figure from an
 *      existing agreement, or an estimate built from the owner's own
 *      ownership percentage times a business valuation they supply.
 *   3. Key-person replacement cost — a monthly cost/lost-revenue estimate
 *      the owner supplies, multiplied by a transition period they choose.
 *
 * No valuation multiple, typical buy-sell figure, or key-person cost
 * assumption is invented anywhere in this file. Every dollar in the total
 * traces back to a number the user typed in. All math runs client-side;
 * nothing typed here is sent anywhere.
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
  max = 10_000_000,
  step = 100,
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
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-14" : "pr-3"}`}
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

interface PercentFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function PercentField({ label, hint, value, onChange }: PercentFieldProps) {
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

function LineItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-xs text-slate-600">{label}</span>
      <span className="text-sm font-medium tabular-nums text-slate-900">{USD.format(value)}</span>
    </div>
  );
}

type BuySellMethod = "fixed" | "estimate";

export function BusinessOwnerLifeInsuranceCalculatorTool() {
  const [guaranteedDebt, setGuaranteedDebt] = useState(150_000);

  const [hasBuySell, setHasBuySell] = useState(true);
  const [buySellMethod, setBuySellMethod] = useState<BuySellMethod>("fixed");
  const [fixedBuyoutValue, setFixedBuyoutValue] = useState(400_000);
  const [ownershipPercent, setOwnershipPercent] = useState(50);
  const [businessValuation, setBusinessValuation] = useState(800_000);

  const [hasKeyPersonRisk, setHasKeyPersonRisk] = useState(true);
  const [monthlyKeyPersonImpact, setMonthlyKeyPersonImpact] = useState(12_000);
  const [transitionMonths, setTransitionMonths] = useState(9);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const debtComponent = guaranteedDebt;

    const buySellComponent = !hasBuySell
      ? 0
      : buySellMethod === "fixed"
        ? fixedBuyoutValue
        : (ownershipPercent / 100) * businessValuation;

    const keyPersonComponent = hasKeyPersonRisk ? monthlyKeyPersonImpact * transitionMonths : 0;

    const total = debtComponent + buySellComponent + keyPersonComponent;

    return { debtComponent, buySellComponent, keyPersonComponent, total };
  }, [
    guaranteedDebt,
    hasBuySell,
    buySellMethod,
    fixedBuyoutValue,
    ownershipPercent,
    businessValuation,
    hasKeyPersonRisk,
    monthlyKeyPersonImpact,
    transitionMonths,
  ]);

  async function copyResult() {
    const lines = [
      "Business owner life insurance coverage estimate",
      `Personally guaranteed business debt: ${USD.format(result.debtComponent)}`,
      hasBuySell
        ? `Buy-sell funding need (${buySellMethod === "fixed" ? "agreed buyout value" : `${ownershipPercent}% of ${USD.format(businessValuation)} valuation`}): ${USD.format(result.buySellComponent)}`
        : "Buy-sell funding need: not applicable (no co-owners entered)",
      hasKeyPersonRisk
        ? `Key-person replacement cost (${USD.format(monthlyKeyPersonImpact)}/mo x ${transitionMonths} mo transition): ${USD.format(result.keyPersonComponent)}`
        : "Key-person replacement cost: not applicable",
      `Total business-related personal coverage need: ${USD.format(result.total)}`,
      "This is business-obligation coverage only, separate from personal income-replacement needs.",
      "Estimate only, not insurance, tax, or legal advice. insurancetools.org/tools/life/business-owner-life-insurance-calculator",
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
        <span className="label-mono text-slate-500">BUSINESS OWNER LIFE INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <NumberField
            label="Personally guaranteed business debt"
            hint="Loans, lines of credit, or leases you signed for personally, not just the business's name"
            value={guaranteedDebt}
            onChange={setGuaranteedDebt}
          />

          <div className="space-y-3 border-t border-hairline pt-4">
            <label className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded accent-blue-600"
                checked={hasBuySell}
                onChange={(e) => setHasBuySell(e.target.checked)}
              />
              I have one or more co-owners
            </label>

            {hasBuySell && (
              <div className="space-y-3 pl-0.5">
                <div className="flex gap-2 text-xs">
                  <label
                    className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center transition-colors ${
                      buySellMethod === "fixed"
                        ? "border-blue-300 bg-blue-50 text-blue-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="buySellMethod"
                      className="sr-only"
                      checked={buySellMethod === "fixed"}
                      onChange={() => setBuySellMethod("fixed")}
                    />
                    Agreed buyout value
                  </label>
                  <label
                    className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center transition-colors ${
                      buySellMethod === "estimate"
                        ? "border-blue-300 bg-blue-50 text-blue-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="buySellMethod"
                      className="sr-only"
                      checked={buySellMethod === "estimate"}
                      onChange={() => setBuySellMethod("estimate")}
                    />
                    Ownership % x valuation
                  </label>
                </div>

                {buySellMethod === "fixed" ? (
                  <NumberField
                    label="Agreed buyout value"
                    hint="The dollar figure your buy-sell agreement already sets for your share"
                    value={fixedBuyoutValue}
                    onChange={setFixedBuyoutValue}
                  />
                ) : (
                  <div className="space-y-3">
                    <PercentField
                      label="Your ownership percentage"
                      hint="Your share of the business"
                      value={ownershipPercent}
                      onChange={setOwnershipPercent}
                    />
                    <NumberField
                      label="Business valuation"
                      hint="A figure from an appraisal, formula, or your own estimate — not supplied by this tool"
                      value={businessValuation}
                      onChange={setBusinessValuation}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <label className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded accent-blue-600"
                checked={hasKeyPersonRisk}
                onChange={(e) => setHasKeyPersonRisk(e.target.checked)}
              />
              The business depends heavily on me specifically
            </label>

            {hasKeyPersonRisk && (
              <div className="space-y-3">
                <NumberField
                  label="Monthly cost or lost revenue if you were suddenly gone"
                  hint="Recruiting, training, or replacing your sales, client relationships, or specialized role"
                  value={monthlyKeyPersonImpact}
                  onChange={setMonthlyKeyPersonImpact}
                  step={500}
                />
                <NumberField
                  label="Transition period to cover"
                  hint="Months a replacement or the business would need to get back to normal"
                  value={transitionMonths}
                  onChange={(v) => setTransitionMonths(Math.round(v))}
                  max={36}
                  step={1}
                  prefix=""
                  suffix="months"
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">BUSINESS-RELATED PERSONAL COVERAGE NEEDED</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.total)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              The personal life insurance this scenario points to for covering business obligations only —
              not your household&apos;s income replacement.
            </p>
          </div>

          <div className="space-y-0.5 border-t border-hairline pt-4">
            <p className="mb-1 text-xs font-semibold text-slate-700">How this number was built</p>
            <LineItem label="Personally guaranteed debt" value={result.debtComponent} />
            <LineItem
              label={hasBuySell ? "Buy-sell funding need" : "Buy-sell funding need (no co-owners)"}
              value={result.buySellComponent}
            />
            <LineItem
              label={hasKeyPersonRisk ? "Key-person replacement cost" : "Key-person replacement cost (n/a)"}
              value={result.keyPersonComponent}
            />
            <div className="flex items-baseline justify-between gap-3 border-t border-hairline pt-1.5">
              <span className="text-xs font-semibold text-slate-700">Total coverage need</span>
              <span className="text-sm font-semibold tabular-nums text-blue-600">{USD.format(result.total)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-800">
            This total does not include personal income replacement for your household. Add that
            separately with the{" "}
            <a href="/tools/life/life-insurance-needs-calculator" className="font-medium underline underline-offset-2">
              life insurance needs calculator
            </a>{" "}
            and either buy two policies or one larger policy sized to cover both.
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
        Estimate only. This tool sums exactly what you enter for guaranteed debt, buy-sell funding, and
        key-person cost; it does not supply a business valuation, a buy-sell multiple, or a typical
        key-person figure on your behalf, and it does not know your health, age, or how an insurer will
        price a policy for you. It is not insurance, tax, or legal advice. Review the result with a
        licensed insurance agent, an attorney, and a tax professional before buying a policy or drafting
        or funding a buy-sell agreement.
      </div>
    </div>
  );
}

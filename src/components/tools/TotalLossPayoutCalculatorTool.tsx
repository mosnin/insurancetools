"use client";

/**
 * Total loss payout calculator.
 *
 * Models the common line-item structure of a total loss settlement: the
 * insurer's actual cash value (ACV) for the vehicle, an optional sales tax
 * add-back (many, not all, insurers and states include this when a total
 * loss forces the owner to go buy a replacement vehicle and pay sales tax
 * on it again), a small title/transfer fee add-back, and the policy
 * deductible, which is subtracted out. This is not a state-mandated
 * formula and does not reproduce any single insurer's actual worksheet; it
 * gives an owner a realistic estimate to compare an actual settlement
 * letter against.
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
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 500_000, step = 100 }: NumberFieldProps) {
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

interface PercentFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function PercentField({ label, hint, value, onChange, disabled }: PercentFieldProps) {
  return (
    <label className="block">
      <span className={`block text-[13px] font-medium ${disabled ? "text-slate-400" : "text-slate-600"}`}>
        {label}
      </span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={15}
          step={0.1}
          disabled={disabled}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 15) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function LineItem({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={`text-sm ${emphasis ? "font-semibold text-slate-900" : "text-slate-600"}`}>{label}</span>
      <span className={`tabular-nums text-sm ${emphasis ? "font-semibold text-slate-900" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

export function TotalLossPayoutCalculatorTool() {
  const [acv, setAcv] = useState(15_000);
  const [includeTax, setIncludeTax] = useState(true);
  const [taxRate, setTaxRate] = useState(7);
  const [fees, setFees] = useState(150);
  const [deductible, setDeductible] = useState(500);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const taxAddBack = includeTax ? acv * (taxRate / 100) : 0;
    const grossPayout = acv + taxAddBack + fees;
    const deductibleApplied = Math.min(deductible, grossPayout);
    const netPayout = Math.max(0, grossPayout - deductible);
    const deductibleExceedsPayout = deductible > grossPayout;

    return {
      taxAddBack,
      grossPayout,
      deductibleApplied,
      netPayout,
      deductibleExceedsPayout,
    };
  }, [acv, includeTax, taxRate, fees, deductible]);

  async function copyResult() {
    const lines = [
      "Total loss payout estimate",
      `Actual cash value: ${USD.format(acv)}`,
      includeTax
        ? `+ Sales tax add-back (${taxRate}%): ${USD.format(result.taxAddBack)}`
        : "+ Sales tax add-back: not included",
      `+ Title/transfer fees: ${USD.format(fees)}`,
      `- Deductible: -${USD.format(result.deductibleApplied)}`,
      `= Estimated payout: ${USD.format(result.netPayout)}`,
      "Estimate only, not a settlement offer. insurancetools.org/tools/auto/total-loss-payout-calculator",
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
        <span className="label-mono text-slate-500">TOTAL LOSS PAYOUT CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Vehicle's actual cash value (ACV)"
            hint="Your insurer's appraised value, or your own estimate from comparable local listings"
            value={acv}
            onChange={setAcv}
          />

          <div className="rounded-lg border border-slate-200 p-3.5">
            <label className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={includeTax}
                onChange={(e) => setIncludeTax(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[13px] font-medium text-slate-600">
                Include a sales tax add-back
                <span className="mt-0.5 block text-xs font-normal text-slate-400">
                  Many, not all, insurers add back sales tax on a total loss since you&apos;ll owe it again on a
                  replacement vehicle. Whether this applies depends on your state and insurer, so confirm it
                  with your adjuster.
                </span>
              </span>
            </label>
            <div className="mt-3">
              <PercentField
                label="Local sales tax rate"
                hint="Your state or local combined sales tax rate"
                value={taxRate}
                onChange={setTaxRate}
                disabled={!includeTax}
              />
            </div>
          </div>

          <NumberField
            label="Title, transfer, and registration fee add-back"
            hint="A small estimate for the fees you'll pay again on a replacement vehicle"
            value={fees}
            onChange={setFees}
            max={2_000}
            step={25}
          />
          <NumberField
            label="Your collision or comprehensive deductible"
            hint="Subtracted from the payout unless you're not at fault and recovering from the other driver's insurer"
            value={deductible}
            onChange={setDeductible}
            max={10_000}
            step={50}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED PAYOUT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD0.format(result.netPayout)}
            </p>
            <p className="mt-1 text-xs text-slate-500">Before any lienholder payoff is deducted by your lender</p>
          </div>

          {result.deductibleExceedsPayout && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your deductible is larger than the estimated gross payout, so this scenario nets to $0. Double-check
              the ACV your insurer is using before assuming you&apos;d receive nothing.
            </div>
          )}

          <div className="space-y-0.5 border-t border-hairline pt-3">
            <LineItem label="Actual cash value" value={USD.format(acv)} />
            <LineItem
              label={includeTax ? `+ Sales tax add-back (${taxRate}%)` : "+ Sales tax add-back"}
              value={includeTax ? USD.format(result.taxAddBack) : "Not included"}
            />
            <LineItem label="+ Title/transfer fees" value={USD.format(fees)} />
            <LineItem label="− Deductible" value={`−${USD.format(result.deductibleApplied)}`} />
            <div className="mt-1 border-t border-hairline pt-1.5">
              <LineItem label="= Estimated payout" value={USD.format(result.netPayout)} emphasis />
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
        Estimate only, not a settlement offer or insurance advice. This tool models a common total loss payout
        structure, but it does not know your policy language, your state&apos;s specific rules on sales tax
        add-backs, or how your insurer determined its actual cash value. If you have a loan or lease, the payout
        shown here goes to pay off the lienholder first, and any remainder comes to you. Compare this estimate
        against your insurer&apos;s written settlement explanation and, if the numbers don&apos;t match, ask your
        adjuster to walk through their worksheet line by line.
      </div>
    </div>
  );
}

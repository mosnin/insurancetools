"use client";

/**
 * Workers' compensation cost estimator.
 *
 * This tool does not, and cannot, know your real class code rate. Class
 * code rates are published per classification and per state by NCCI or a
 * state's own rating bureau (in monopolistic-fund and independent-bureau
 * states such as California, Texas, and a handful of others), and they vary
 * enormously by job duties and by state. Fabricating a rate table here would
 * violate the project's "never fabricate state requirements or industry
 * figures" standard directly, and would hand a business owner a wrong
 * premium estimate with real financial consequences.
 *
 * Instead this tool teaches and applies the real, standard workers'
 * compensation premium formula that every state uses in some form:
 *
 *   Premium = (Payroll / 100) x Class Code Rate x Experience Modification
 *   Factor (X-Mod)
 *
 * The user supplies their own payroll, their own class code rate (obtained
 * from NCCI, their state's rating bureau, or their broker), and their own
 * X-Mod (defaulting to 1.0, which represents an average-risk business with
 * neither a credit nor a debit). The calculator shows each factor's
 * contribution transparently rather than collapsing straight to a single
 * number, so the user can see exactly where the estimate comes from.
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

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function DollarField({ label, hint, value, onChange, max = 50_000_000 }: DollarFieldProps) {
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

interface RateFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  placeholder?: string;
}

function RateField({ label, hint, value, onChange, min, max, step, suffix, placeholder }: RateFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? "" : value}
          placeholder={placeholder}
          onChange={(e) => {
            const raw = e.target.value === "" ? 0 : Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-14 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

const PAYROLL_MAX = 50_000_000;
const RATE_MAX = 100; // per $100 of payroll; extreme high-hazard codes rarely exceed this
const XMOD_MIN = 0.1;
const XMOD_MAX = 3;

export function WorkersCompensationCostEstimatorTool() {
  const [payroll, setPayroll] = useState(500_000);
  const [classCodeRate, setClassCodeRate] = useState(0);
  const [xMod, setXMod] = useState(1);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasRate = classCodeRate > 0;
    const payrollUnits = payroll / 100;
    const manualPremium = payrollUnits * classCodeRate;
    const modAdjustment = manualPremium * (xMod - 1);
    const estimatedPremium = manualPremium * xMod;
    const monthlyEstimate = estimatedPremium / 12;
    const effectiveRatePerHundred = payroll > 0 ? (estimatedPremium / payrollUnits) : 0;

    const modStanding: "credit" | "neutral" | "debit" =
      xMod < 1 ? "credit" : xMod > 1 ? "debit" : "neutral";

    return {
      hasRate,
      payrollUnits,
      manualPremium,
      modAdjustment,
      estimatedPremium,
      monthlyEstimate,
      effectiveRatePerHundred,
      modStanding,
    };
  }, [payroll, classCodeRate, xMod]);

  async function copyResult() {
    const lines = [
      "Workers' compensation cost estimate",
      `Annual payroll used: ${USD.format(payroll)}`,
      result.hasRate
        ? `Class code rate: ${USD_CENTS.format(classCodeRate)} per $100 of payroll`
        : "Class code rate: not entered yet",
      `Experience modification factor (X-Mod): ${xMod.toFixed(2)}`,
      result.hasRate
        ? `Manual (unmodified) premium: ${USD.format(result.manualPremium)}`
        : "Manual premium: enter a class code rate to calculate",
      result.hasRate
        ? `X-Mod adjustment: ${result.modAdjustment >= 0 ? "+" : ""}${USD.format(result.modAdjustment)}`
        : "",
      result.hasRate
        ? `Estimated annual premium: ${USD.format(result.estimatedPremium)} (about ${USD.format(result.monthlyEstimate)}/month)`
        : "",
      "Estimate only, not a quote or a substitute for your rating bureau's or broker's figures.",
      "insurancetools.org/tools/business/workers-compensation-cost-estimator",
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
        <span className="label-mono text-slate-500">WORKERS&apos; COMPENSATION COST ESTIMATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <DollarField
            label="Annual gross payroll"
            hint="Total wages for employees under this class code, before any state payroll cap applies"
            value={payroll}
            onChange={setPayroll}
            max={PAYROLL_MAX}
          />
          <RateField
            label="Class code rate"
            hint="Per $100 of payroll, from NCCI, your state's rating bureau, or your broker. This tool cannot look it up for you."
            value={classCodeRate}
            onChange={setClassCodeRate}
            min={0}
            max={RATE_MAX}
            step={0.01}
            suffix="per $100"
            placeholder="e.g. 2.15"
          />
          <RateField
            label="Experience modification factor (X-Mod)"
            hint="Default 1.00 = average risk for your class code. Below 1.00 is a credit (better than average claims history); above 1.00 is a debit."
            value={xMod}
            onChange={setXMod}
            min={XMOD_MIN}
            max={XMOD_MAX}
            step={0.01}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED ANNUAL PREMIUM</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.hasRate ? USD.format(result.estimatedPremium) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasRate
                ? `About ${USD.format(result.monthlyEstimate)} per month if billed evenly across the year`
                : "Enter your class code rate to calculate a premium"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Manual premium"
              value={result.hasRate ? USD.format(result.manualPremium) : "—"}
            />
            <Figure
              label="X-Mod adjustment"
              value={
                result.hasRate
                  ? `${result.modAdjustment >= 0 ? "+" : ""}${USD.format(result.modAdjustment)}`
                  : "—"
              }
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">How this breaks down</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasRate
                  ? `(${USD.format(payroll)} / 100) x ${USD_CENTS.format(classCodeRate)} = ${USD.format(result.manualPremium)} manual premium. Multiplied by your ${xMod.toFixed(2)} X-Mod gives an estimated ${USD.format(result.estimatedPremium)} annual premium.`
                  : "Enter a class code rate on the left to see the formula applied to your own numbers."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Your experience modifier standing</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.modStanding === "neutral"
                  ? "An X-Mod of 1.00 means your business is priced as an average risk for this class code, neither a credit nor a debit."
                  : result.modStanding === "credit"
                    ? `An X-Mod below 1.00 is a credit mod, meaning your claims history for this class code has been better than average, which is lowering your premium by ${USD.format(Math.abs(result.modAdjustment))}.`
                    : `An X-Mod above 1.00 is a debit mod, meaning your claims history for this class code has been worse than average, which is raising your premium by ${USD.format(result.modAdjustment)}. It's worth confirming this figure is accurate; mod worksheets can contain claim data errors.`}
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
        Estimate only. This calculator applies the standard payroll x class code rate x experience
        modifier formula to numbers you supply; it does not know, look up, or guess your actual class
        code rate, your state&apos;s specific rules, or your insurer&apos;s underwriting. Class code rates and
        payroll caps vary by state and by classification. Confirm your real rate with NCCI, your
        state&apos;s rating bureau, or a licensed broker before budgeting against this number.
      </div>
    </div>
  );
}

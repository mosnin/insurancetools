"use client";

/**
 * PPO vs. HDHP calculator.
 *
 * Models the total annual cost of a PPO plan against a high-deductible
 * health plan (HDHP) at a single spending level the user chooses, then nets
 * the HDHP's cost against HSA contributions, since only HDHPs are
 * HSA-eligible under IRS rules (Publication 969) and HSA dollars can be
 * spent dollar-for-dollar on the deductible and coinsurance. If the user
 * supplies their own marginal tax rate, the tool also shows the extra
 * effective savings from contributing pre-tax, without assuming any
 * specific rate or hardcoding a contribution limit that changes every year.
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
  disabled?: boolean;
}

function NumberField({ label, hint, value, onChange, max = 200_000, disabled = false }: NumberFieldProps) {
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
          step={50}
          disabled={disabled}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
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
  max?: number;
}

function PercentField({ label, hint, value, onChange, max = 100 }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "muted" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "muted" ? "text-slate-400" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/** Patient out-of-pocket medical cost for a given plan design and spending level. */
function planOutOfPocket(spending: number, deductible: number, coinsurancePct: number, oopMax: number): number {
  if (spending <= 0) return 0;
  const coinsuranceFraction = coinsurancePct / 100;
  const raw = spending <= deductible ? spending : deductible + coinsuranceFraction * (spending - deductible);
  return Math.min(raw, oopMax, spending);
}

const SPENDING_PRESETS = [
  { label: "Low year", value: 500 },
  { label: "Moderate year", value: 3_000 },
  { label: "High year", value: 10_000 },
];

export function PpoVsHdhpCalculatorTool() {
  const [ppoPremium, setPpoPremium] = useState(6_000);
  const [ppoDeductible, setPpoDeductible] = useState(1_500);
  const [ppoCoinsurance, setPpoCoinsurance] = useState(20);
  const [ppoOopMax, setPpoOopMax] = useState(6_000);

  const [hdhpPremium, setHdhpPremium] = useState(4_200);
  const [hdhpDeductible, setHdhpDeductible] = useState(3_300);
  const [hdhpCoinsurance, setHdhpCoinsurance] = useState(20);
  const [hdhpOopMax, setHdhpOopMax] = useState(6_900);

  const [hsaEligible, setHsaEligible] = useState(true);
  const [employerHsaContribution, setEmployerHsaContribution] = useState(500);
  const [userHsaContribution, setUserHsaContribution] = useState(2_000);
  const [marginalTaxRate, setMarginalTaxRate] = useState(22);

  const [spending, setSpending] = useState(3_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const ppoOop = planOutOfPocket(spending, ppoDeductible, ppoCoinsurance, ppoOopMax);
    const ppoTotal = ppoPremium + ppoOop;

    const hdhpOop = planOutOfPocket(spending, hdhpDeductible, hdhpCoinsurance, hdhpOopMax);
    const hdhpTotalBeforeHsa = hdhpPremium + hdhpOop;

    const effectiveEmployerHsa = hsaEligible ? employerHsaContribution : 0;
    const effectiveUserHsa = hsaEligible ? userHsaContribution : 0;
    const hsaTotal = effectiveEmployerHsa + effectiveUserHsa;

    const hdhpNet = hdhpTotalBeforeHsa - hsaTotal;
    const taxSavings = hsaEligible ? effectiveUserHsa * (marginalTaxRate / 100) : 0;
    const hdhpEffective = hdhpNet - taxSavings;

    const difference = ppoTotal - hdhpEffective;
    const cheaperPlan: "HDHP" | "PPO" | "Tie" = difference > 0.5 ? "HDHP" : difference < -0.5 ? "PPO" : "Tie";

    const oopMaxWarningPpo = ppoOopMax < ppoDeductible;
    const oopMaxWarningHdhp = hdhpOopMax < hdhpDeductible;
    const hsaLeftover = hsaTotal - hdhpOop;

    return {
      ppoOop,
      ppoTotal,
      hdhpOop,
      hdhpTotalBeforeHsa,
      hsaTotal,
      hdhpNet,
      taxSavings,
      hdhpEffective,
      difference: Math.abs(difference),
      cheaperPlan,
      oopMaxWarningPpo,
      oopMaxWarningHdhp,
      hsaLeftover,
    };
  }, [
    spending,
    ppoPremium,
    ppoDeductible,
    ppoCoinsurance,
    ppoOopMax,
    hdhpPremium,
    hdhpDeductible,
    hdhpCoinsurance,
    hdhpOopMax,
    hsaEligible,
    employerHsaContribution,
    userHsaContribution,
    marginalTaxRate,
  ]);

  async function copyResult() {
    const lines = [
      "PPO vs. HDHP total annual cost comparison",
      `Modeled at ${USD.format(spending)} of annual medical spending`,
      `PPO total cost: ${USD.format(result.ppoTotal)} (${USD.format(ppoPremium)} premium + ${USD.format(result.ppoOop)} out of pocket)`,
      `HDHP total cost before HSA: ${USD.format(result.hdhpTotalBeforeHsa)} (${USD.format(hdhpPremium)} premium + ${USD.format(result.hdhpOop)} out of pocket)`,
      hsaEligible
        ? `HSA contributions: ${USD.format(result.hsaTotal)} (employer ${USD.format(employerHsaContribution)} + you ${USD.format(userHsaContribution)})`
        : "HSA contributions: $0 (marked not HSA-eligible)",
      `HDHP net cost after HSA: ${USD.format(result.hdhpNet)}`,
      result.taxSavings > 0
        ? `Plus pre-tax savings at ${marginalTaxRate}%: ${USD.format(result.taxSavings)}, for an effective HDHP cost of ${USD.format(result.hdhpEffective)}`
        : `Effective HDHP cost: ${USD.format(result.hdhpEffective)}`,
      result.cheaperPlan === "Tie"
        ? "The two plans come out roughly even at this spending level."
        : `${result.cheaperPlan} is cheaper by about ${USD.format(result.difference)} at this spending level.`,
      "Estimate only, not a quote or tax advice. insurancetools.org/tools/health/ppo-vs-hdhp-calculator",
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
        <span className="label-mono text-slate-500">PPO VS. HDHP CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      {/* Spending level */}
      <div className="border-b border-hairline bg-slate-50/60 px-5 py-4 sm:px-6">
        <NumberField
          label="Expected annual medical spending to model"
          hint="Total covered costs before any insurance pays, e.g. an average year vs. a high-spend year"
          value={spending}
          onChange={setSpending}
          max={500_000}
        />
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SPENDING_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setSpending(preset.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                spending === preset.value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {preset.label} ({USD.format(preset.value)})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* PPO inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="label-mono text-slate-400">PPO PLAN</p>
          <NumberField label="Annual premium" hint="What you pay per year in paycheck deductions" value={ppoPremium} onChange={setPpoPremium} max={40_000} />
          <NumberField label="Annual deductible" value={ppoDeductible} onChange={setPpoDeductible} max={20_000} />
          <PercentField label="Coinsurance after deductible" hint="Your share of costs once the deductible is met, e.g. 20" value={ppoCoinsurance} onChange={setPpoCoinsurance} />
          <NumberField label="Out-of-pocket maximum" hint="Most you'd pay in a year, deductible included" value={ppoOopMax} onChange={setPpoOopMax} max={40_000} />
          {result.oopMaxWarningPpo && (
            <p className="text-xs text-amber-700">
              Your PPO out-of-pocket maximum is lower than its deductible. Double-check these two figures on
              your plan&apos;s summary of benefits.
            </p>
          )}
        </div>

        {/* HDHP inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <p className="label-mono text-slate-400">HDHP PLAN</p>
          <NumberField label="Annual premium" hint="What you pay per year in paycheck deductions" value={hdhpPremium} onChange={setHdhpPremium} max={40_000} />
          <NumberField label="Annual deductible" value={hdhpDeductible} onChange={setHdhpDeductible} max={20_000} />
          <PercentField label="Coinsurance after deductible" hint="Your share of costs once the deductible is met, e.g. 20" value={hdhpCoinsurance} onChange={setHdhpCoinsurance} />
          <NumberField label="Out-of-pocket maximum" hint="Most you'd pay in a year, deductible included" value={hdhpOopMax} onChange={setHdhpOopMax} max={40_000} />
          {result.oopMaxWarningHdhp && (
            <p className="text-xs text-amber-700">
              Your HDHP out-of-pocket maximum is lower than its deductible. Double-check these two figures on
              your plan&apos;s summary of benefits.
            </p>
          )}
        </div>
      </div>

      {/* HSA inputs */}
      <div className="space-y-4 border-t border-hairline bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="label-mono text-slate-400">HSA CONTRIBUTIONS (HDHP ONLY)</p>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={hsaEligible}
              onChange={(e) => setHsaEligible(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            This HDHP is HSA-eligible
          </label>
        </div>
        {!hsaEligible && (
          <p className="text-xs leading-relaxed text-amber-700">
            Only HDHPs that meet the IRS&apos;s minimum-deductible and maximum-out-of-pocket rules qualify for
            HSA contributions. Confirm eligibility on your plan&apos;s summary of benefits before assuming you
            can open or fund an HSA.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumberField
            label="Employer HSA seed money"
            hint="A lump sum or per-pay-period amount your employer adds"
            value={employerHsaContribution}
            onChange={setEmployerHsaContribution}
            max={20_000}
            disabled={!hsaEligible}
          />
          <NumberField
            label="Your own HSA contribution"
            hint="Stay within your own known annual IRS limit for your coverage tier"
            value={userHsaContribution}
            onChange={setUserHsaContribution}
            max={20_000}
            disabled={!hsaEligible}
          />
          <PercentField
            label="Your marginal tax rate (optional)"
            hint="Federal + state combined, to see pre-tax savings"
            value={marginalTaxRate}
            onChange={setMarginalTaxRate}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-5 border-t border-hairline bg-white p-5 sm:p-6">
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3.5">
          <p className="label-mono text-blue-500">AT {USD.format(spending)} OF MEDICAL SPENDING</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
            {result.cheaperPlan === "Tie"
              ? "The two plans cost about the same"
              : `${result.cheaperPlan} costs about ${USD.format(result.difference)} less`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Figure label="PPO total cost" value={USD.format(result.ppoTotal)} />
          <Figure label="HDHP before HSA" value={USD.format(result.hdhpTotalBeforeHsa)} tone="muted" />
          <Figure label="HDHP net of HSA" value={USD.format(result.hdhpNet)} />
          <Figure label="HDHP effective cost" value={USD.format(result.hdhpEffective)} tone="accent" />
        </div>

        <div className="space-y-3 border-t border-hairline pt-4 text-xs leading-relaxed text-slate-500">
          <p>
            <span className="font-semibold text-slate-700">HDHP net of HSA</span> subtracts the{" "}
            {USD.format(result.hsaTotal)} in employer and personal HSA contributions from the HDHP&apos;s
            {" "}
            {USD.format(result.hdhpTotalBeforeHsa)} premium-plus-out-of-pocket total, since that HSA money can
            be spent dollar-for-dollar on the deductible and coinsurance.{" "}
            <span className="font-semibold text-slate-700">HDHP effective cost</span> goes one step further
            and subtracts the tax savings on your own contribution, {USD.format(result.taxSavings)} at a{" "}
            {marginalTaxRate}% marginal rate, since HSA contributions are typically made pre-tax.
          </p>
          {result.hsaLeftover > 0 && (
            <p>
              Your HSA contributions cover this year&apos;s modeled spending with about {USD.format(result.hsaLeftover)}{" "}
              left over. Unlike an FSA, unused HSA funds roll over and keep growing, so that isn&apos;t wasted
              money, it&apos;s savings for a future year.
            </p>
          )}
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

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This tool models total annual cost at a single spending level you choose using the
        premium, deductible, coinsurance, and out-of-pocket maximum you enter; it does not know your actual
        plan documents, network, drug formulary, or state rules, and it does not verify HSA eligibility or
        contribution limits, which change annually and depend on your coverage tier. Confirm both plans&apos;
        exact terms and your current HSA limit before enrolling, and talk to a licensed benefits advisor or
        tax professional about your specific situation.
      </div>
    </div>
  );
}

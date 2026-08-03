"use client";

/**
 * Multi-pet insurance discount calculator.
 *
 * Multi-pet discounts are quoted as a percentage off, the same way multi-car
 * discounts are, but the household math is different: instead of two fixed
 * vehicles, a pet household can have two, three, or more animals, and the
 * relevant question is usually "what does insuring all of them together
 * actually save me in dollars, and what does that work out to per pet?"
 * This tool takes the number of pets, the combined premium those pets would
 * cost insured on completely separate policies, and the insurer's quoted
 * multi-pet discount percentage, then reports the dollar savings, the
 * bundled total, and the effective per-pet cost under the bundled policy.
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

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 1_000_000 }: NumberFieldProps) {
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

function IntegerField({
  label,
  hint,
  value,
  onChange,
  min = 1,
  max = 20,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={Number.isFinite(value) ? value : min}
          onChange={(e) => {
            const raw = Math.round(Number(e.target.value));
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : min;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function PercentField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={50}
          step={0.5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 50) : 0;
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

export function MultiPetInsuranceDiscountCalculatorTool() {
  const [petCount, setPetCount] = useState(3);
  const [combinedSeparatePremium, setCombinedSeparatePremium] = useState(1_350);
  const [discountPct, setDiscountPct] = useState(10);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasPremium = combinedSeparatePremium > 0;
    const savings = hasPremium ? combinedSeparatePremium * (discountPct / 100) : 0;
    const bundledTotal = combinedSeparatePremium - savings;
    const monthlySavings = savings / 12;
    const bundledMonthly = bundledTotal / 12;
    const separatePerPet = hasPremium ? combinedSeparatePremium / petCount : 0;
    const bundledPerPet = hasPremium ? bundledTotal / petCount : 0;
    const perPetSavings = separatePerPet - bundledPerPet;

    return {
      hasPremium,
      savings,
      bundledTotal,
      monthlySavings,
      bundledMonthly,
      separatePerPet,
      bundledPerPet,
      perPetSavings,
    };
  }, [petCount, combinedSeparatePremium, discountPct]);

  async function copyResult() {
    const lines = [
      "Multi-pet insurance discount estimate",
      `Pets on this policy: ${petCount}`,
      `Combined premium if each pet were insured separately: ${USD.format(combinedSeparatePremium)}/year`,
      `Multi-pet discount applied: ${discountPct}%`,
      `Estimated savings: ${USD.format(result.savings)}/year (about ${USD_CENTS.format(result.monthlySavings)}/month)`,
      `Estimated bundled total: ${USD.format(result.bundledTotal)}/year (about ${USD_CENTS.format(result.bundledMonthly)}/month)`,
      `Effective cost per pet, bundled: ${USD.format(result.bundledPerPet)}/year vs. ${USD.format(result.separatePerPet)}/year separately`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/pet/multi-pet-insurance-discount-calculator",
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
        <span className="label-mono text-slate-500">MULTI-PET INSURANCE DISCOUNT CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <IntegerField
            label="Number of pets on this policy"
            hint="This calculator is built for multi-pet households; use 2 or more"
            value={petCount}
            onChange={setPetCount}
            min={1}
            max={20}
          />
          <NumberField
            label="Combined annual premium if every pet were insured separately"
            hint="Add up what each pet would cost on its own policy or from separate quotes"
            value={combinedSeparatePremium}
            onChange={setCombinedSeparatePremium}
          />
          <PercentField
            label="Multi-pet discount your insurer quoted"
            hint="Enter the exact percentage from your quote or declarations page; providers set this individually"
            value={discountPct}
            onChange={setDiscountPct}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED ANNUAL SAVINGS</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-blue-600">
              {USD.format(result.savings)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              about {USD_CENTS.format(result.monthlySavings)}/month across {petCount}{" "}
              {petCount === 1 ? "pet" : "pets"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Combined premium (separate)" value={USD.format(combinedSeparatePremium)} />
            <Figure label="Bundled total (multi-pet)" value={USD.format(result.bundledTotal)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Figure label="Effective cost per pet, bundled" value={USD.format(result.bundledPerPet)} tone="accent" />
            <Figure label="Cost per pet, separate" value={USD.format(result.separatePerPet)} />
          </div>

          {!result.hasPremium && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Enter the combined standalone premium for all of your pets to see a savings estimate. A $0
              combined premium can&apos;t produce a meaningful dollar figure.
            </div>
          )}

          {petCount < 2 && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Multi-pet discounts require at least two pets on the same policy. With one pet entered, this
              result reflects the discount as if it applied, but no insurer offers a multi-pet discount on a
              single animal.
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
            One tradeoff worth thinking through before bundling: on some multi-pet policies, all of your
            pets share the same overall claims history for renewal pricing purposes, so a run of expensive
            claims on one animal can influence the renewal quote for the whole group, not just that pet.
            This does not happen with every insurer or every plan structure, so ask directly how your
            specific policy handles renewal pricing when one pet on a shared policy files several claims.
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
        Estimate only. This tool multiplies the discount percentage you enter by the combined standalone
        premium you enter; it does not know your species mix, breed, age, location, claims history, or an
        insurer&apos;s specific eligibility rules for bundling multiple pets. Multi-pet discount availability
        and size vary by insurer, and this calculator never assumes a percentage on your behalf. Confirm
        your exact quoted discount and any shared-claims-history rules with your insurer or a licensed
        agent before assuming these savings will match your bill.
      </div>
    </div>
  );
}

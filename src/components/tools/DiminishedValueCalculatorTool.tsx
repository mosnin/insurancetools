"use client";

/**
 * Diminished value calculator.
 *
 * Implements the "17c" formula, a specific step-by-step methodology that
 * originated from a 2001 Georgia insurance claims dispute (Mabry v. State
 * Farm) and is now widely referenced by consumer advocates and some claims
 * adjusters as one way to estimate inherent diminished value after an
 * accident. It is not a universal industry standard: many insurers use
 * their own internal formulas, some states limit or reject first-party
 * diminished value claims entirely, and no formula guarantees what any
 * insurer will actually pay. That context is repeated in the UI on purpose
 * so the number never reads as a promised payout.
 *
 * Formula:
 *   1. Base loss = 10% of the vehicle's pre-accident value (this 10% cap is
 *      part of the 17c formula itself, not a separate assumption).
 *   2. Damage multiplier, selected by severity: Severe 1.00, Moderate 0.75,
 *      Minor 0.50, Structural/frame damage 0.25 (historically excluded or
 *      valued very low under 17c).
 *   3. Mileage multiplier, selected by odometer tier, stepping down from
 *      1.00 under 20,000 miles to 0.00 at 100,000+ miles.
 *   diminishedValue = baseLoss x damageMultiplier x mileageMultiplier
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
  maximumFractionDigits: 0,
});

interface Tier {
  value: string;
  label: string;
  hint: string;
  multiplier: number;
}

const DAMAGE_TIERS: Tier[] = [
  { value: "severe", label: "Severe", hint: "Major structural repair, airbags deployed", multiplier: 1.0 },
  { value: "moderate", label: "Moderate", hint: "Significant panel and mechanical repair", multiplier: 0.75 },
  { value: "minor", label: "Minor", hint: "Cosmetic panel or bumper repair only", multiplier: 0.5 },
  { value: "structural", label: "Structural / frame", hint: "Frame or unibody damage, historically valued lowest", multiplier: 0.25 },
];

const MILEAGE_TIERS: Tier[] = [
  { value: "t1", label: "0 – 19,999 mi", hint: "", multiplier: 1.0 },
  { value: "t2", label: "20,000 – 39,999 mi", hint: "", multiplier: 0.8 },
  { value: "t3", label: "40,000 – 59,999 mi", hint: "", multiplier: 0.6 },
  { value: "t4", label: "60,000 – 79,999 mi", hint: "", multiplier: 0.4 },
  { value: "t5", label: "80,000 – 99,999 mi", hint: "", multiplier: 0.2 },
  { value: "t6", label: "100,000+ mi", hint: "Formula reduces this tier to $0", multiplier: 0.0 },
];

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 500_000 }: NumberFieldProps) {
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

interface TierSelectProps {
  label: string;
  hint?: string;
  tiers: Tier[];
  selected: string;
  onChange: (value: string) => void;
}

function TierSelect({ label, hint, tiers, selected, onChange }: TierSelectProps) {
  return (
    <div>
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
      <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {tiers.map((tier) => {
          const active = tier.value === selected;
          return (
            <button
              key={tier.value}
              type="button"
              onClick={() => onChange(tier.value)}
              aria-pressed={active}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                active
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="block font-semibold">{tier.label}</span>
              {tier.hint && <span className="mt-0.5 block text-[11px] text-slate-400">{tier.hint}</span>}
            </button>
          );
        })}
      </div>
    </div>
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

export function DiminishedValueCalculatorTool() {
  const [preAccidentValue, setPreAccidentValue] = useState(22_000);
  const [damageTier, setDamageTier] = useState("moderate");
  const [mileageTier, setMileageTier] = useState("t2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const damage = DAMAGE_TIERS.find((t) => t.value === damageTier) ?? DAMAGE_TIERS[0];
    const mileage = MILEAGE_TIERS.find((t) => t.value === mileageTier) ?? MILEAGE_TIERS[0];

    const baseLoss = preAccidentValue * 0.1;
    const afterDamage = baseLoss * damage.multiplier;
    const diminishedValue = afterDamage * mileage.multiplier;

    return { damage, mileage, baseLoss, afterDamage, diminishedValue };
  }, [preAccidentValue, damageTier, mileageTier]);

  async function copyResult() {
    const lines = [
      "17c diminished value estimate",
      `Pre-accident value: ${USD.format(preAccidentValue)}`,
      `Step 1 — Base loss (10% cap): ${USD.format(result.baseLoss)}`,
      `Step 2 — Damage severity (${result.damage.label}, x${result.damage.multiplier.toFixed(2)}): ${USD.format(result.afterDamage)}`,
      `Step 3 — Mileage (${result.mileage.label}, x${result.mileage.multiplier.toFixed(2)}): ${USD.format(result.diminishedValue)}`,
      `Estimated diminished value: ${USD.format(result.diminishedValue)}`,
      "This is one commonly referenced methodology (the 17c formula), not a guarantee of what any insurer will pay. insurancetools.org/tools/auto/diminished-value-calculator",
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
        <span className="label-mono text-slate-500">DIMINISHED VALUE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <NumberField
            label="Vehicle's pre-accident value"
            hint="Fair market value right before the accident, not what you paid new"
            value={preAccidentValue}
            onChange={setPreAccidentValue}
          />
          <TierSelect
            label="Damage severity"
            hint="Based on the repair, not the original point of impact"
            tiers={DAMAGE_TIERS}
            selected={damageTier}
            onChange={setDamageTier}
          />
          <TierSelect
            label="Mileage at time of accident"
            tiers={MILEAGE_TIERS}
            selected={mileageTier}
            onChange={setMileageTier}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED DIMINISHED VALUE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.diminishedValue)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              One commonly referenced methodology (the &ldquo;17c&rdquo; formula), not a guaranteed payout from any
              insurer.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Step-by-step math</p>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>1. Base loss: 10% of {USD.format(preAccidentValue)}</span>
              <span className="font-medium tabular-nums text-slate-900">{USD.format(result.baseLoss)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                2. x {result.damage.label} multiplier ({PERCENT.format(result.damage.multiplier)})
              </span>
              <span className="font-medium tabular-nums text-slate-900">{USD.format(result.afterDamage)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                3. x mileage multiplier ({result.mileage.label}, {PERCENT.format(result.mileage.multiplier)})
              </span>
              <span className="font-medium tabular-nums text-slate-900">
                {USD.format(result.diminishedValue)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Damage tier" value={`x${result.damage.multiplier.toFixed(2)}`} />
            <Figure label="Mileage tier" value={`x${result.mileage.multiplier.toFixed(2)}`} tone="accent" />
          </div>

          {result.mileage.multiplier === 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              At 100,000+ miles, the 17c formula&apos;s mileage multiplier reduces the estimate to $0. Some
              adjusters and appraisers still recognize diminished value on high-mileage vehicles using a
              different methodology; this formula simply does not.
            </div>
          )}

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
        Estimate only. This tool applies the &ldquo;17c&rdquo; formula, one commonly referenced methodology for
        estimating inherent diminished value, not a universal industry standard or a guarantee of what any
        insurer will pay. Some insurers use their own internal formulas, some states restrict or disallow
        first-party diminished value claims, and appraisers may reach a different figure. Confirm your
        state&apos;s rules and get an independent appraisal before filing or negotiating a claim.
      </div>
    </div>
  );
}

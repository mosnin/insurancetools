"use client";

/**
 * Water damage claim calculator.
 *
 * Estimates a rough insurance payout for a water damage repair: the smaller
 * of the repair cost and any policy-specific water damage sublimit (some
 * policies cap certain water losses, like sewer or drain backup, separately
 * from the dwelling limit), minus the deductible, floored at zero.
 *
 * This tool does not decide whether a loss is covered at all. It also asks
 * the user what caused the damage and surfaces the general, widely known
 * distinction between sudden/accidental water damage (typically covered),
 * gradual damage (typically excluded), and flood water (typically excluded
 * and requiring separate flood insurance) so the payout estimate is read in
 * context rather than treated as a guarantee.
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

type CauseKey = "sudden" | "gradual" | "flood";

interface CauseOption {
  key: CauseKey;
  label: string;
  note: string;
  tone: "positive" | "negative";
}

const CAUSE_OPTIONS: CauseOption[] = [
  {
    key: "sudden",
    label: "Sudden and accidental (burst pipe, appliance failure, ice dam, sudden overflow)",
    note:
      "Damage from a sudden, accidental water discharge like a burst pipe or a washing machine hose failure is typically covered by a standard homeowners or renters policy. Coverage still depends on your exact policy language and any maintenance-related exclusions, so this is a general pattern, not a guarantee for your specific claim.",
    tone: "positive",
  },
  {
    key: "gradual",
    label: "Gradual leak or long-term seepage (slow drip, hidden leak over weeks or months)",
    note:
      "Damage that built up gradually, such as a slow pipe drip or ongoing seepage behind a wall, is typically excluded from a standard homeowners policy. Insurers generally treat gradual damage as a maintenance issue the homeowner was responsible for catching, not a sudden loss. Confirm your policy's exact wording before assuming this payout estimate applies.",
    tone: "negative",
  },
  {
    key: "flood",
    label: "Flood or rising water (groundwater, surface water, storm surge, overflowing river)",
    note:
      "Water that enters from outside the home, such as rising groundwater, surface water, or storm surge, is typically excluded from a standard homeowners policy entirely and instead requires a separate flood insurance policy, such as one through the National Flood Insurance Program or a private flood carrier. This payout estimate likely would not apply under a standard policy for this cause.",
    tone: "negative",
  },
];

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 5_000_000 }: NumberFieldProps) {
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

export function WaterDamageClaimCalculatorTool() {
  const [repairCost, setRepairCost] = useState(12_000);
  const [deductible, setDeductible] = useState(1_000);
  const [sublimit, setSublimit] = useState(0);
  const [cause, setCause] = useState<CauseKey>("sudden");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasSublimit = sublimit > 0;
    const cappedAmount = hasSublimit ? Math.min(repairCost, sublimit) : repairCost;
    const sublimitReducesPayout = hasSublimit && sublimit < repairCost;
    const payout = Math.max(0, cappedAmount - deductible);
    const outOfPocket = Math.max(0, repairCost - payout);
    const deductibleAppliesFully = cappedAmount >= deductible;
    const selectedCause = CAUSE_OPTIONS.find((c) => c.key === cause)!;

    return {
      hasSublimit,
      cappedAmount,
      sublimitReducesPayout,
      payout,
      outOfPocket,
      deductibleAppliesFully,
      selectedCause,
    };
  }, [repairCost, deductible, sublimit, cause]);

  async function copyResult() {
    const lines = [
      "Water damage claim estimate",
      `Repair/remediation cost entered: ${USD.format(repairCost)}`,
      result.hasSublimit ? `Water damage sublimit: ${USD.format(sublimit)}` : "Water damage sublimit: none entered",
      `Deductible: ${USD.format(deductible)}`,
      `Estimated payout: ${USD.format(result.payout)}`,
      `Estimated out of pocket: ${USD.format(result.outOfPocket)}`,
      `Cause of damage: ${result.selectedCause.label.split(" (")[0]}`,
      "Estimate only, not a claim decision or insurance advice. insurancetools.org/tools/home/water-damage-claim-calculator",
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
        <span className="label-mono text-slate-500">WATER DAMAGE CLAIM CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Estimated repair or remediation cost"
            hint="From a contractor or restoration company estimate"
            value={repairCost}
            onChange={setRepairCost}
          />
          <NumberField
            label="Your deductible"
            hint="The standard dwelling deductible on your policy"
            value={deductible}
            onChange={setDeductible}
          />
          <NumberField
            label="Water damage sublimit (optional)"
            hint="Leave at $0 if your policy has no separate cap, such as for sewer or drain backup"
            value={sublimit}
            onChange={setSublimit}
          />

          <div>
            <span className="block text-[13px] font-medium text-slate-600">What caused the water damage?</span>
            <div className="mt-1.5 space-y-2">
              {CAUSE_OPTIONS.map((option) => (
                <label
                  key={option.key}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs leading-relaxed transition-colors ${
                    cause === option.key
                      ? "border-blue-300 bg-blue-50 text-blue-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="cause"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-blue-600"
                    checked={cause === option.key}
                    onChange={() => setCause(option.key)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED PAYOUT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.payout)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasSublimit && result.sublimitReducesPayout
                ? `Capped by your ${USD.format(sublimit)} water damage sublimit, then reduced by your ${USD.format(deductible)} deductible.`
                : `${USD.format(repairCost)} repair cost minus your ${USD.format(deductible)} deductible.`}
            </p>
          </div>

          <div
            className={`rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${
              result.selectedCause.tone === "positive"
                ? "border-blue-100 bg-blue-50 text-blue-800"
                : "border-amber-100 bg-amber-50 text-amber-900"
            }`}
          >
            {result.selectedCause.note}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Repair cost entered" value={USD.format(repairCost)} />
            <Figure label="Est. out of pocket" value={USD.format(result.outOfPocket)} tone="accent" />
          </div>

          {!result.deductibleAppliesFully && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
              Your deductible ({USD.format(deductible)}) is at or above the amount available to pay
              {result.hasSublimit ? " under your entered sublimit" : ""}, so this claim would likely pay
              $0. Filing a claim that pays little or nothing can still count against your claims
              history, so many homeowners pay small losses out of pocket instead.
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
        Estimate only. This tool applies simple deductible and sublimit math to numbers you enter; it is
        not a claim decision, adjuster estimate, or coverage determination, and it does not read your
        actual policy. Whether a water damage loss is covered at all depends on your policy&apos;s exact
        language and the cause of loss. Confirm coverage and get a firm payout figure from your insurer
        or a licensed claims adjuster before making repair decisions.
      </div>
    </div>
  );
}

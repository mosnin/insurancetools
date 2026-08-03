"use client";

/**
 * Deductible claim calculator.
 *
 * Distinct from the premium-vs-deductible comparison tools in the
 * Deductibles category: this is a claims-side tool. It answers a narrower,
 * more immediate question — "I already have a loss and a deductible, so
 * what would I actually net if I filed?" — rather than "which deductible
 * should I choose when buying a policy."
 *
 * Net payout = max(0, loss amount - deductible). The tool also surfaces a
 * hedged "is it worth filing" read: a small payout relative to the
 * deductible is flagged as marginal, and a note about claims-history
 * frequency is shown when the user has filed multiple claims recently,
 * without inventing a specific premium-increase percentage anywhere in the
 * calculation or the copy.
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
          step={50}
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

interface CountFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CountField({ label, hint, value, onChange, max = 10 }: CountFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        step={1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const raw = Number(e.target.value);
          const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), max) : 0;
          onChange(clamped);
        }}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
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

type Verdict = "no-loss" | "under-deductible" | "marginal" | "moderate" | "clear";

export function DeductibleClaimCalculatorTool() {
  const [lossAmount, setLossAmount] = useState(3_200);
  const [deductible, setDeductible] = useState(1_000);
  const [claimsFiled, setClaimsFiled] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasLoss = lossAmount > 0;
    const netPayout = Math.max(0, lossAmount - deductible);
    const outOfPocket = Math.min(lossAmount, deductible);
    const payoutShare = hasLoss ? netPayout / lossAmount : 0;
    const ratioToDeductible = deductible > 0 ? netPayout / deductible : netPayout > 0 ? Infinity : 0;

    let verdict: Verdict = "no-loss";
    if (hasLoss) {
      if (lossAmount <= deductible) verdict = "under-deductible";
      else if (ratioToDeductible < 0.5) verdict = "marginal";
      else if (ratioToDeductible < 2) verdict = "moderate";
      else verdict = "clear";
    }

    const frequentClaims = claimsFiled >= 2;

    return {
      hasLoss,
      netPayout,
      outOfPocket,
      payoutShare,
      ratioToDeductible,
      verdict,
      frequentClaims,
    };
  }, [lossAmount, deductible, claimsFiled]);

  const verdictCopy: Record<Verdict, { label: string; tone: "slate" | "amber" | "blue" | "green" }> = {
    "no-loss": { label: "Enter a loss amount to see a read", tone: "slate" },
    "under-deductible": { label: "Not worth filing — nothing to pay out", tone: "slate" },
    marginal: { label: "Marginal — weigh it carefully", tone: "amber" },
    moderate: { label: "Worth considering", tone: "blue" },
    clear: { label: "Clearer case for filing", tone: "green" },
  };

  const toneClasses: Record<string, string> = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };

  async function copyResult() {
    const lines = [
      "Deductible claim calculator result",
      `Loss/repair amount: ${USD.format(lossAmount)}`,
      `Deductible: ${USD.format(deductible)}`,
      `Net payout from insurer: ${USD.format(result.netPayout)}`,
      `Your out-of-pocket amount: ${USD.format(result.outOfPocket)}`,
      `Read: ${verdictCopy[result.verdict].label}`,
      result.frequentClaims
        ? "Note: multiple recent claims on file — consider whether the net payout is worth the potential claims-history impact before filing another."
        : "",
      "Estimate only, not a claims decision or insurance advice. insurancetools.org/tools/claims/deductible-claim-calculator",
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
        <span className="label-mono text-slate-500">DEDUCTIBLE CLAIM CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Loss or repair cost"
            hint="The estimate or bill for the damage, before insurance"
            value={lossAmount}
            onChange={setLossAmount}
          />
          <NumberField
            label="Your deductible"
            hint="The per-occurrence amount on your policy for this type of claim"
            value={deductible}
            onChange={setDeductible}
          />
          <CountField
            label="Claims filed in the last 3 years"
            hint="Across any policy with this insurer, as a rough count"
            value={claimsFiled}
            onChange={setClaimsFiled}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">NET PAYOUT FROM INSURER</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.netPayout)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(lossAmount)} loss minus {USD.format(deductible)} deductible, floored at $0
            </p>
          </div>

          <div className={`rounded-lg border px-3.5 py-3 text-xs font-medium ${toneClasses[verdictCopy[result.verdict].tone]}`}>
            {verdictCopy[result.verdict].label}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Your out-of-pocket" value={USD.format(result.outOfPocket)} />
            <Figure
              label="Share of loss insurer pays"
              value={result.hasLoss ? PERCENT.format(result.payoutShare) : "—"}
              tone="accent"
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Is it worth filing?</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.verdict === "no-loss" &&
                  "Enter a loss or repair cost above to see how it compares against your deductible."}
                {result.verdict === "under-deductible" &&
                  `Your loss is at or below your ${USD.format(deductible)} deductible, so a claim would pay out nothing here. You'd cover the full ${USD.format(result.outOfPocket)} yourself either way.`}
                {result.verdict === "marginal" &&
                  `The insurer's ${USD.format(result.netPayout)} payout is less than half of your ${USD.format(deductible)} deductible. Filing is an option, but it's worth weighing a relatively small payout against the time a claim takes and any effect on your claims history.`}
                {result.verdict === "moderate" &&
                  `The ${USD.format(result.netPayout)} payout is a meaningful amount relative to your ${USD.format(deductible)} deductible. Many drivers and homeowners would file here, but it still comes down to how you weigh that payout against your claims history.`}
                {result.verdict === "clear" &&
                  `The ${USD.format(result.netPayout)} payout is well above your ${USD.format(deductible)} deductible, which is the kind of loss deductibles exist to let you file for.`}
              </p>
            </div>
            {result.frequentClaims && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
                You&apos;ve entered {claimsFiled} claims in the last 3 years. Filing frequency is a general
                consideration some insurers weigh at renewal, alongside the size and type of each claim.
                This tool doesn&apos;t know your insurer&apos;s specific rules or predict any premium change —
                weigh the net payout above against whether another claim is worth that added claims-history
                exposure, and ask your agent if you&apos;re unsure.
              </div>
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
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This tool assumes a single, flat per-occurrence deductible and a loss amount you
        already have a reasonably firm estimate for; it does not model percentage-based deductibles,
        per-item sublimits, or how your specific insurer weighs claims history when setting a renewal
        premium. Confirm your policy&apos;s exact deductible and get a real damage estimate before deciding
        whether to file, and talk to your agent or insurer about how a claim could affect your policy.
      </div>
    </div>
  );
}

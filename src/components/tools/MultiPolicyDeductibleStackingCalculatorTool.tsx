"use client";

/**
 * Multi-policy deductible stacking calculator.
 *
 * Models a narrow but genuinely confusing scenario: a single event (a storm,
 * a falling tree, one bad afternoon) damages property that happens to be
 * insured under two separate policy contracts, for example a house and a
 * car parked in its driveway, or a home policy and a separate endorsement
 * covering a detached structure. Because each policy is its own legal
 * contract, each one typically applies its own deductible independently.
 * Deductibles do not net against each other or share a single "per event"
 * amount across policies the way many people assume.
 *
 * This tool does not decide what is or is not covered. It takes the loss
 * amount the user attributes to each policy and each policy's deductible,
 * and adds up the total out-of-pocket cost of paying both deductibles
 * separately versus what a single-deductible assumption would have cost.
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

function NumberField({ label, hint, value, onChange, max = 2_000_000 }: NumberFieldProps) {
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

function TextField({
  label,
  value,
  onChange,
  maxLength = 40,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
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

export function MultiPolicyDeductibleStackingCalculatorTool() {
  const [policy1Name, setPolicy1Name] = useState("Homeowners policy");
  const [loss1, setLoss1] = useState(14_000);
  const [deductible1, setDeductible1] = useState(2_000);

  const [policy2Name, setPolicy2Name] = useState("Auto policy");
  const [loss2, setLoss2] = useState(9_000);
  const [deductible2, setDeductible2] = useState(500);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const policy1Applies = loss1 > 0;
    const policy2Applies = loss2 > 0;
    const bothApply = policy1Applies && policy2Applies;

    const outOfPocket1 = policy1Applies ? Math.min(loss1, deductible1) : 0;
    const outOfPocket2 = policy2Applies ? Math.min(loss2, deductible2) : 0;
    const totalOutOfPocket = outOfPocket1 + outOfPocket2;

    const payout1 = policy1Applies ? Math.max(0, loss1 - deductible1) : 0;
    const payout2 = policy2Applies ? Math.max(0, loss2 - deductible2) : 0;
    const totalPayout = payout1 + payout2;

    const totalLoss = loss1 + loss2;

    // The common misconception: assuming only the larger single deductible
    // applies to the whole event, as if the two policies shared one
    // "per occurrence" deductible the way coverages inside a single policy
    // sometimes do.
    const singleDeductibleAssumption = bothApply ? Math.max(deductible1, deductible2) : totalOutOfPocket;
    const unexpectedExtra = Math.max(0, totalOutOfPocket - singleDeductibleAssumption);

    const belowDeductible1 = policy1Applies && loss1 < deductible1;
    const belowDeductible2 = policy2Applies && loss2 < deductible2;

    return {
      policy1Applies,
      policy2Applies,
      bothApply,
      outOfPocket1,
      outOfPocket2,
      totalOutOfPocket,
      payout1,
      payout2,
      totalPayout,
      totalLoss,
      singleDeductibleAssumption,
      unexpectedExtra,
      belowDeductible1,
      belowDeductible2,
    };
  }, [loss1, deductible1, loss2, deductible2]);

  async function copyResult() {
    const p1 = policy1Name || "Policy 1";
    const p2 = policy2Name || "Policy 2";
    const lines = [
      "Multi-policy deductible stacking result",
      `${p1}: loss ${USD.format(loss1)}, deductible ${USD.format(deductible1)}, your cost ${USD.format(result.outOfPocket1)}`,
      `${p2}: loss ${USD.format(loss2)}, deductible ${USD.format(deductible2)}, your cost ${USD.format(result.outOfPocket2)}`,
      `Total out-of-pocket across both policies: ${USD.format(result.totalOutOfPocket)}`,
      result.unexpectedExtra > 0
        ? `That's ${USD.format(result.unexpectedExtra)} more than if only one deductible applied to the whole event.`
        : "Only one policy's deductible is actually in play for these numbers.",
      "Scenario estimate from user-entered figures, not a claims determination. insurancetools.org/tools/deductibles/multi-policy-deductible-stacking-calculator",
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
        <span className="label-mono text-slate-500">MULTI-POLICY DEDUCTIBLE STACKING CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div className="space-y-3 rounded-lg border border-slate-200 p-3.5">
            <p className="label-mono text-slate-400">POLICY 1</p>
            <TextField label="Policy label" value={policy1Name} onChange={setPolicy1Name} />
            <NumberField
              label="Loss amount under this policy"
              hint="The damage attributable to this policy, before the deductible"
              value={loss1}
              onChange={setLoss1}
            />
            <NumberField
              label="This policy's deductible"
              value={deductible1}
              onChange={setDeductible1}
              max={50_000}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 p-3.5">
            <p className="label-mono text-slate-400">POLICY 2</p>
            <TextField label="Policy label" value={policy2Name} onChange={setPolicy2Name} />
            <NumberField
              label="Loss amount under this policy"
              hint="The damage attributable to this policy, before the deductible"
              value={loss2}
              onChange={setLoss2}
            />
            <NumberField
              label="This policy's deductible"
              value={deductible2}
              onChange={setDeductible2}
              max={50_000}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">TOTAL OUT-OF-POCKET</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalOutOfPocket)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Across both policies, before either insurer pays a claim.
            </p>
          </div>

          {result.bothApply && result.unexpectedExtra > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Because these are two separate policy contracts, you&apos;re paying {USD.format(deductible1)} +{" "}
              {USD.format(deductible2)}, not just the larger single deductible. That&apos;s{" "}
              {USD.format(result.unexpectedExtra)} more than a single-deductible assumption would suggest.
            </div>
          )}

          {!result.bothApply && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-600">
              Only one policy currently has a loss amount above $0, so this isn&apos;t a stacking scenario yet.
              Enter a loss amount for the second policy to see both deductibles applied at once.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label={`${policy1Name || "Policy 1"} cost`} value={USD.format(result.outOfPocket1)} />
            <Figure label={`${policy2Name || "Policy 2"} cost`} value={USD.format(result.outOfPocket2)} tone="accent" />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total loss entered" value={USD.format(result.totalLoss)} />
            <Figure label="Est. combined insurer payout" value={USD.format(result.totalPayout)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            {result.belowDeductible1 && (
              <p className="text-xs leading-relaxed text-slate-500">
                {policy1Name || "Policy 1"}&apos;s loss ({USD.format(loss1)}) is below its {USD.format(deductible1)}{" "}
                deductible, so that policy likely wouldn&apos;t pay anything and you&apos;d cover the full amount
                yourself.
              </p>
            )}
            {result.belowDeductible2 && (
              <p className="text-xs leading-relaxed text-slate-500">
                {policy2Name || "Policy 2"}&apos;s loss ({USD.format(loss2)}) is below its {USD.format(deductible2)}{" "}
                deductible, so that policy likely wouldn&apos;t pay anything and you&apos;d cover the full amount
                yourself.
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
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only, from the figures you enter. This tool assumes both losses are otherwise covered
        perils under their respective policies and doesn&apos;t check policy limits, exclusions,
        endorsements, or whether a loss is actually covered at all. Whether a single event really
        triggers two separate deductibles depends on your actual policy language and how the loss is
        adjusted. Confirm coverage and deductible application with a licensed insurance agent or your
        insurer before assuming any number here is final.
      </div>
    </div>
  );
}

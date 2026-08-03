"use client";

/**
 * Professional liability (errors & omissions) coverage calculator.
 *
 * E&O limits are conventionally sized around the largest single engagement a
 * professional is exposed on, since that contract is what a single bad piece
 * of advice, a missed deadline, or a design error could realistically put at
 * risk. This tool suggests a per-claim limit as a multiple of the user's
 * largest contract value (2x by default, 3x when several engagements run
 * concurrently, since overlapping work raises the odds two claims land in
 * the same policy period), pairs it with a commonly seen 2x aggregate
 * structure, and checks the result against any client-contract-mandated
 * minimum the user enters. All of this is framed as common practice, not a
 * regulatory formula — there is no state-mandated E&O minimum this tool
 * could look up, and it says so.
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

// Common policy limit tiers most E&O carriers actually offer. The suggested
// per-claim limit is rounded up to the nearest of these rather than shown as
// a precise, made-up figure like $274,000.
const TIERS = [250_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000];

function suggestedTierFor(rawValue: number): number {
  if (rawValue <= 0) return TIERS[0];
  const found = TIERS.find((t) => t >= rawValue);
  if (found) return found;
  return Math.ceil(rawValue / 1_000_000) * 1_000_000;
}

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  prefix?: string;
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 25_000_000, prefix = "$", step = 500 }: NumberFieldProps) {
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
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${prefix ? "pl-7" : "pl-3"} pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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

export function ProfessionalLiabilityErrorsOmissionsCalculatorTool() {
  const [averageContract, setAverageContract] = useState(25_000);
  const [activeClients, setActiveClients] = useState(6);
  const [largestContract, setLargestContract] = useState(120_000);
  const [mandatedMinimum, setMandatedMinimum] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasLargestContract = largestContract > 0;

    // More concurrent engagements raises the odds that two unrelated claims
    // land inside the same policy period, so the multiplier steps up rather
    // than staying fixed at 2x for every professional.
    const concurrencyMultiplier = activeClients >= 5 ? 3 : 2;
    const rawPerClaim = largestContract * concurrencyMultiplier;
    const tieredPerClaim = suggestedTierFor(rawPerClaim);

    const hasMandate = mandatedMinimum > 0;
    const mandateDrivesLimit = hasMandate && mandatedMinimum > tieredPerClaim;
    const finalPerClaim = mandateDrivesLimit ? mandatedMinimum : tieredPerClaim;

    // A 2x per-claim/aggregate split (e.g. $1M per claim / $2M aggregate) is
    // a commonly seen E&O policy structure, not a rule every carrier uses.
    const finalAggregate = finalPerClaim * 2;

    const totalEngagementExposure = averageContract * activeClients;
    const exposureAboveAggregate = totalEngagementExposure > finalAggregate;

    return {
      hasLargestContract,
      concurrencyMultiplier,
      tieredPerClaim,
      hasMandate,
      mandateDrivesLimit,
      finalPerClaim,
      finalAggregate,
      totalEngagementExposure,
      exposureAboveAggregate,
    };
  }, [averageContract, activeClients, largestContract, mandatedMinimum]);

  async function copyResult() {
    const lines = [
      "Professional liability (E&O) coverage estimate",
      result.hasLargestContract
        ? `Suggested limit: ${USD.format(result.finalPerClaim)} per claim / ${USD.format(result.finalAggregate)} aggregate`
        : "Enter your largest single contract value to get a suggested limit",
      result.mandateDrivesLimit
        ? "Driven by your client-required minimum, which is higher than the contract-multiple suggestion"
        : `Based on ${result.concurrencyMultiplier}x your largest single contract value`,
      result.exposureAboveAggregate
        ? `Note: your combined active-engagement value (${USD.format(result.totalEngagementExposure)}) exceeds the suggested aggregate limit`
        : "Your combined active-engagement value is within the suggested aggregate limit",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/business/professional-liability-errors-omissions-calculator",
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
        <span className="label-mono text-slate-500">PROFESSIONAL LIABILITY (E&amp;O) CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Average contract or engagement value"
            hint="Typical fee for one client engagement"
            value={averageContract}
            onChange={setAverageContract}
          />
          <NumberField
            label="Active clients or concurrent engagements"
            hint="How many engagements you're actively working at once"
            value={activeClients}
            onChange={(v) => setActiveClients(Math.min(Math.max(Math.round(v), 0), 500))}
            prefix=""
            step={1}
            max={500}
          />
          <NumberField
            label="Largest single contract value"
            hint="Your biggest engagement by total contract value, not just fees billed so far"
            value={largestContract}
            onChange={setLargestContract}
          />
          <NumberField
            label="Client-required minimum E&O limit (optional)"
            hint="Enter it only if a client contract specifies one; otherwise leave at $0"
            value={mandatedMinimum}
            onChange={setMandatedMinimum}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          {!result.hasLargestContract ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-600">
              Enter your largest single contract value to see a suggested professional liability limit.
            </div>
          ) : (
            <>
              <div>
                <p className="label-mono text-slate-400">SUGGESTED PER-CLAIM LIMIT</p>
                <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
                  {USD.format(result.finalPerClaim)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Paired with a {USD.format(result.finalAggregate)} aggregate limit, a common 2x per-claim/aggregate
                  policy structure
                </p>
              </div>

              {result.mandateDrivesLimit && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
                  Your client-required minimum of {USD.format(mandatedMinimum)} is higher than the{" "}
                  {result.concurrencyMultiplier}x-contract suggestion, so it drives the recommended limit here.
                  Confirm the exact wording of that contract clause before you buy, since some contracts specify
                  per-claim, others aggregate, and some both.
                </div>
              )}

              {result.exposureAboveAggregate && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
                  Your combined active-engagement value ({USD.format(result.totalEngagementExposure)}) is higher
                  than the suggested aggregate limit. That does not mean a claim is likely, but if two unrelated
                  claims landed in the same policy period, a lower aggregate could be exhausted faster than
                  expected. Worth a conversation with a broker about whether a higher aggregate makes sense for
                  your caseload.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
                <Figure label="Contract multiple used" value={`${result.concurrencyMultiplier}x largest contract`} />
                <Figure label="Combined engagement value" value={USD.format(result.totalEngagementExposure)} tone="accent" />
              </div>

              <div className="space-y-3 border-t border-hairline pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Why this multiple</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {activeClients >= 5
                      ? `With ${activeClients} active engagements running at once, this tool uses a 3x multiple of your largest contract instead of the more common 2x baseline, since more concurrent work means more chances for overlapping claims to hit the same policy period.`
                      : `With ${activeClients || "a small number of"} active engagement${activeClients === 1 ? "" : "s"}, this tool uses a common 2x multiple of your largest contract value as a starting point for the per-claim limit.`}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Client-required minimum</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {result.hasMandate
                      ? result.mandateDrivesLimit
                        ? "Your entered minimum is already reflected in the suggested limit above."
                        : `Your entered minimum of ${USD.format(mandatedMinimum)} is below the contract-multiple suggestion, so it isn't currently the binding figure. It could still specify per-claim vs. aggregate differently than assumed here — check the actual clause.`
                      : "No client-required minimum entered. Many contracts, RFPs, and vendor agreements specify one directly, so check any signed agreement before finalizing a limit."}
                  </p>
                </div>
              </div>
            </>
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
        Estimate only. This tool models a commonly used contract-multiple method for sizing a professional
        liability (errors &amp; omissions) limit; it is not a quote, and it does not know your industry&apos;s
        typical claim severity, your state&apos;s rules, or an insurer&apos;s underwriting guidelines. There is no
        universal state-mandated E&amp;O minimum this tool can check against. Confirm any client contract
        language and get an exact price from a licensed agent before buying or changing a policy.
      </div>
    </div>
  );
}

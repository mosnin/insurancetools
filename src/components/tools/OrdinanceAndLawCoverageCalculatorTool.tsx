"use client";

/**
 * Ordinance and law coverage gap calculator.
 *
 * Ordinance or law coverage pays the added cost of bringing a damaged home
 * up to *current* building code during a covered rebuild — code compliance
 * a standard dwelling policy otherwise ignores, since dwelling coverage is
 * priced to rebuild what was there, not what code now requires. This tool
 * does not estimate that added cost for the user (code upgrade costs are
 * too dependent on the specific home, municipality, and current code cycle
 * to model responsibly). Instead it asks the user for their own estimate —
 * ideally from a contractor, builder, or their agent's replacement cost
 * estimator — and shows whether their current ordinance & law limit likely
 * closes that gap.
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

function NumberField({ label, hint, value, onChange, max = 10_000_000 }: NumberFieldProps) {
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

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "warn" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "warn" ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function OrdinanceAndLawCoverageCalculatorTool() {
  const [replacementCost, setReplacementCost] = useState(350_000);
  const [codeUpgradeCost, setCodeUpgradeCost] = useState(35_000);
  const [currentLimit, setCurrentLimit] = useState(35_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasEstimate = codeUpgradeCost > 0;
    const gap = Math.max(0, codeUpgradeCost - currentLimit);
    const covered = hasEstimate && gap === 0;
    const surplus = Math.max(0, currentLimit - codeUpgradeCost);
    const limitAsPercentOfReplacement = replacementCost > 0 ? (currentLimit / replacementCost) * 100 : 0;
    const commonTierPercentages = [10, 25, 50];
    const nearestTier = commonTierPercentages.reduce((closest, tier) => {
      const tierAmount = replacementCost * (tier / 100);
      return Math.abs(tierAmount - codeUpgradeCost) < Math.abs(replacementCost * (closest / 100) - codeUpgradeCost)
        ? tier
        : closest;
    }, commonTierPercentages[0]);

    return {
      hasEstimate,
      gap,
      covered,
      surplus,
      limitAsPercentOfReplacement,
      nearestTier,
    };
  }, [replacementCost, codeUpgradeCost, currentLimit]);

  async function copyResult() {
    const lines = [
      "Ordinance and law coverage gap check",
      `Estimated replacement cost: ${USD.format(replacementCost)}`,
      `Estimated cost to meet current code on a full rebuild: ${USD.format(codeUpgradeCost)}`,
      `Current ordinance & law coverage limit: ${USD.format(currentLimit)}`,
      result.hasEstimate
        ? result.covered
          ? `Result: current limit appears to cover the estimate, with ${USD.format(result.surplus)} of headroom`
          : `Result: possible gap of ${USD.format(result.gap)} not covered by the current limit`
        : "Result: enter an estimated code-upgrade cost to check for a gap",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/home/ordinance-and-law-coverage-calculator",
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
        <span className="label-mono text-slate-500">ORDINANCE AND LAW COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Home's replacement cost"
            hint="What it would cost to rebuild the home today, from your declarations page"
            value={replacementCost}
            onChange={setReplacementCost}
          />
          <NumberField
            label="Estimated cost to meet current code"
            hint="A contractor or replacement-cost estimator figure — this tool won't guess it for you"
            value={codeUpgradeCost}
            onChange={setCodeUpgradeCost}
          />
          <NumberField
            label="Current ordinance & law coverage limit"
            hint="Often shown as a % of dwelling coverage on your declarations page — enter the dollar amount"
            value={currentLimit}
            onChange={setCurrentLimit}
          />
          <p className="text-xs leading-relaxed text-slate-400">
            Some insurers price ordinance &amp; law coverage as a fixed percentage of dwelling coverage
            (commonly around 10%, 25%, or 50%) rather than letting you set a dollar figure directly. If
            that&apos;s how your policy works, multiply your dwelling limit by that percentage to get the
            dollar amount to enter above.
          </p>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">GAP CHECK</p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                !result.hasEstimate ? "text-slate-400" : result.covered ? "text-slate-900" : "text-amber-600"
              }`}
            >
              {!result.hasEstimate ? "—" : result.covered ? "Likely covered" : USD.format(result.gap)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {!result.hasEstimate
                ? "Enter an estimated code-upgrade cost to check your current limit against it."
                : result.covered
                  ? `Your ${USD.format(currentLimit)} limit meets or exceeds the ${USD.format(codeUpgradeCost)} estimate, with ${USD.format(result.surplus)} of headroom.`
                  : `Your ${USD.format(currentLimit)} limit falls ${USD.format(result.gap)} short of the ${USD.format(codeUpgradeCost)} estimate.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Estimated need" value={USD.format(codeUpgradeCost)} />
            <Figure
              label="Coverage gap"
              value={result.hasEstimate ? USD.format(result.gap) : "—"}
              tone={result.gap > 0 ? "warn" : "accent"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Limit as a share of replacement cost</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {replacementCost > 0
                  ? `Your current ${USD.format(currentLimit)} ordinance & law limit is about ${result.limitAsPercentOfReplacement.toFixed(1)}% of your ${USD.format(replacementCost)} replacement cost. Many insurers offer preset tiers near ${result.nearestTier}% of dwelling coverage — ask your agent which tiers are available on your policy.`
                  : "Enter your home's replacement cost to see this as a percentage."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Why this matters most for older homes</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Building codes are revised over time, so a home built or last renovated decades ago is
                more likely to need demolition, foundation, electrical, plumbing, or accessibility work
                that current code requires but the original structure never had. The older the home
                relative to the current code cycle, the larger this gap tends to be.
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
        Estimate only. This tool does not calculate or fabricate a code-upgrade cost on your behalf — that
        figure should come from a contractor, a licensed appraiser, or your insurer&apos;s own replacement
        cost estimator, since it depends on your home&apos;s construction, your municipality&apos;s current
        building code, and the scope of a hypothetical rebuild. This is not a quote or insurance advice.
        Confirm your policy&apos;s actual ordinance &amp; law limit and any exclusions with a licensed
        insurance agent before relying on it.
      </div>
    </div>
  );
}

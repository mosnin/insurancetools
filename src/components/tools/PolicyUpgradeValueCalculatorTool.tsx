"use client";

/**
 * Policy upgrade value calculator.
 *
 * Cross-line tool for a question that comes up whenever an insurer or
 * agent offers a higher limit or an added endorsement: how much extra
 * premium does the upgrade actually cost, and how much extra protection
 * does it buy? The tool normalizes those two numbers into a cost-per
 * additional-$1,000-of-coverage figure so upgrades of very different
 * sizes (a small endorsement vs. doubling a liability limit) can be
 * compared on the same basis.
 *
 * This tool deliberately does not tell the user whether the upgrade is
 * "worth it" — that verdict depends on risk tolerance, what they can
 * afford to lose out of pocket, and factors this tool has no way to
 * know. It computes the neutral metric and explains how to read it; the
 * user supplies the judgment.
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
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 10_000_000, step = 100 }: NumberFieldProps) {
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

export function PolicyUpgradeValueCalculatorTool() {
  const [currentLimit, setCurrentLimit] = useState(100_000);
  const [currentPremium, setCurrentPremium] = useState(650);
  const [upgradedLimit, setUpgradedLimit] = useState(300_000);
  const [upgradedPremium, setUpgradedPremium] = useState(740);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const addedPremium = upgradedPremium - currentPremium;
    const addedCoverage = upgradedLimit - currentLimit;

    const hasValidCoverageIncrease = addedCoverage > 0;
    const hasValidPremiumEntry = currentPremium > 0 && upgradedPremium > 0;
    const isDowngrade = addedCoverage < 0;
    const isFlatCoverageNoPremiumChange = addedCoverage === 0;

    const costPerThousand = hasValidCoverageIncrease ? (addedPremium / addedCoverage) * 1000 : null;

    const percentPremiumIncrease = currentPremium > 0 ? (addedPremium / currentPremium) * 100 : null;
    const percentCoverageIncrease = currentLimit > 0 ? (addedCoverage / currentLimit) * 100 : null;

    return {
      addedPremium,
      addedCoverage,
      hasValidCoverageIncrease,
      hasValidPremiumEntry,
      isDowngrade,
      isFlatCoverageNoPremiumChange,
      costPerThousand,
      percentPremiumIncrease,
      percentCoverageIncrease,
    };
  }, [currentLimit, currentPremium, upgradedLimit, upgradedPremium]);

  async function copyResult() {
    const lines = [
      "Policy upgrade value calculation",
      `Current: ${USD.format(currentLimit)} limit at ${USD.format(currentPremium)}/year`,
      `Upgraded: ${USD.format(upgradedLimit)} limit at ${USD.format(upgradedPremium)}/year`,
      `Added annual premium: ${USD.format(result.addedPremium)}`,
      `Added coverage: ${USD.format(result.addedCoverage)}`,
      result.costPerThousand !== null
        ? `Cost per additional $1,000 of coverage: ${USD_CENTS.format(result.costPerThousand)}`
        : "Cost per additional $1,000 of coverage: not calculable (upgraded limit is not higher than current limit)",
      "This is a neutral cost metric, not a recommendation. Estimate only, not a quote or insurance advice.",
      "insurancetools.org/tools/coverage/policy-upgrade-value-calculator",
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
        <span className="label-mono text-slate-500">POLICY UPGRADE VALUE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Current coverage limit"
            hint="Your policy's current limit, or $0 if this is a new endorsement"
            value={currentLimit}
            onChange={setCurrentLimit}
            step={1_000}
          />
          <NumberField
            label="Current annual premium"
            hint="What you pay now for this coverage"
            value={currentPremium}
            onChange={setCurrentPremium}
            step={10}
            max={1_000_000}
          />
          <NumberField
            label="Upgraded coverage limit"
            hint="The higher limit you're considering"
            value={upgradedLimit}
            onChange={setUpgradedLimit}
            step={1_000}
          />
          <NumberField
            label="Upgraded annual premium (quoted)"
            hint="The new total premium quoted for the upgraded limit"
            value={upgradedPremium}
            onChange={setUpgradedPremium}
            step={10}
            max={1_000_000}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">COST PER ADDITIONAL $1,000 OF COVERAGE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.costPerThousand !== null ? USD_CENTS.format(result.costPerThousand) : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.isDowngrade
                ? "The upgraded limit you entered is lower than your current limit, so this isn't an upgrade. Enter a higher limit to see the added cost per dollar of protection."
                : result.isFlatCoverageNoPremiumChange
                  ? "The two limits you entered are equal, so there's no additional coverage to price."
                  : "How much the added premium costs for every $1,000 of additional coverage. Lower is a cheaper way to buy extra protection; higher means the same extra protection costs more here than it might elsewhere."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Added annual premium"
              value={USD.format(result.addedPremium)}
              tone={result.addedPremium > 0 ? "accent" : "default"}
            />
            <Figure label="Added coverage" value={USD.format(result.addedCoverage)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">In relative terms</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.percentPremiumIncrease !== null && result.percentCoverageIncrease !== null
                  ? `This upgrade raises your premium by about ${result.percentPremiumIncrease.toFixed(1)}% while raising your coverage limit by about ${result.percentCoverageIncrease.toFixed(1)}%.`
                  : "Enter a current premium above $0 to see the relative premium and coverage increase."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">How to use this number</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                This figure is a normalized cost, not a verdict. A low cost per $1,000 means this
                particular upgrade is a relatively efficient way to buy extra protection compared to
                other upgrades priced the same way; whether that protection is worth buying at all
                still depends on your own risk tolerance, assets, and what you could afford to pay
                out of pocket without it.
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
        Estimate only. This tool compares the numbers you enter; it does not know your policy&apos;s
        exact wording, your insurer&apos;s underwriting rules, or your personal risk tolerance, and it
        does not tell you whether a given upgrade is worth buying. Confirm exact terms and pricing
        with a licensed insurance agent before changing coverage.
      </div>
    </div>
  );
}

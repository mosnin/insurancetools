"use client";

/**
 * State minimum vs. recommended coverage gap calculator.
 *
 * This tool intentionally does NOT know any state's actual minimum
 * liability requirement. State minimums are real, legally defined figures
 * that vary by state and change over time as legislatures update them —
 * hardcoding a number here would risk telling a user the wrong legal
 * requirement. Instead, the user looks up and enters their own state's
 * current minimum bodily injury and property damage limits (with a link to
 * the NAIC's directory of state insurance departments so they can find the
 * correct, current source themselves), and the tool computes a recommended
 * liability limit using the same asset-protection method used elsewhere on
 * this site: size liability to the assets and income a judgment could
 * reach, not to an arbitrary flat number. The "gap" is simply the dollar
 * difference between the two, calculated entirely from what the user typed
 * in.
 *
 * All math runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface LiabilityTier {
  label: string;
  biPerPerson: number;
  biPerAccident: number;
  pd: number;
}

const TIERS: LiabilityTier[] = [
  { label: "100/300/100", biPerPerson: 100_000, biPerAccident: 300_000, pd: 100_000 },
  { label: "250/500/100", biPerPerson: 250_000, biPerAccident: 500_000, pd: 100_000 },
  { label: "250/500/250", biPerPerson: 250_000, biPerAccident: 500_000, pd: 250_000 },
];

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

export function StateMinimumVsRecommendedCoverageGapCalculatorTool() {
  // The user's own state minimum, looked up from their state DOI. Defaults
  // to 0 on purpose — this tool never pre-fills a guess at what any state
  // requires.
  const [stateBiPerPerson, setStateBiPerPerson] = useState(0);
  const [stateBiPerAccident, setStateBiPerAccident] = useState(0);
  const [statePD, setStatePD] = useState(0);

  // Inputs for the asset-protection recommended limit.
  const [assets, setAssets] = useState(50_000);
  const [income, setIncome] = useState(60_000);
  const [vehicleValue, setVehicleValue] = useState(20_000);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const exposure = assets + income;
    const tier = exposure <= 300_000 ? TIERS[0] : exposure <= 500_000 ? TIERS[1] : TIERS[2];
    const recommendedPD = vehicleValue > 50_000 ? Math.max(tier.pd, 250_000) : tier.pd;

    const hasStateMin = stateBiPerPerson > 0 || stateBiPerAccident > 0 || statePD > 0;

    const gapBiPerPerson = Math.max(0, tier.biPerPerson - stateBiPerPerson);
    const gapBiPerAccident = Math.max(0, tier.biPerAccident - stateBiPerAccident);
    const gapPD = Math.max(0, recommendedPD - statePD);
    const combinedGap = gapBiPerAccident + gapPD;

    const exposureCoveredByStateMinPct =
      hasStateMin && exposure > 0 ? Math.min(100, (stateBiPerAccident / exposure) * 100) : null;

    const meetsRecommended = hasStateMin && gapBiPerPerson === 0 && gapBiPerAccident === 0 && gapPD === 0;

    const umbrellaGap = Math.max(0, exposure - 500_000);

    return {
      exposure,
      tier,
      recommendedPD,
      hasStateMin,
      gapBiPerPerson,
      gapBiPerAccident,
      gapPD,
      combinedGap,
      exposureCoveredByStateMinPct,
      meetsRecommended,
      umbrellaGap,
    };
  }, [assets, income, vehicleValue, stateBiPerPerson, stateBiPerAccident, statePD]);

  async function copyResult() {
    const lines = [
      "State minimum vs. recommended coverage gap",
      result.hasStateMin
        ? `Your entered state minimum: ${USD.format(stateBiPerPerson)}/${USD.format(stateBiPerAccident)}/${USD.format(statePD)}`
        : "State minimum: not entered",
      `Recommended limit (asset-protection method): ${result.tier.label} (${USD.format(result.tier.biPerPerson)}/${USD.format(result.tier.biPerAccident)} bodily injury, ${USD.format(result.recommendedPD)} property damage)`,
      result.hasStateMin
        ? result.meetsRecommended
          ? "Your entered state minimum already meets or exceeds the recommended limit."
          : `Gap: ${USD.format(result.gapBiPerPerson)} per person, ${USD.format(result.gapBiPerAccident)} per accident bodily injury, ${USD.format(result.gapPD)} property damage`
        : "Enter your own state's minimum limits above to see your specific gap.",
      "Figures are based on user-entered numbers only; this tool does not look up or assert any state's actual minimum. Verify your state's current requirement with your state's Department of Insurance.",
      "Estimate only, not a quote or legal or insurance advice. insurancetools.org/tools/state-requirements/state-minimum-vs-recommended-coverage-gap-calculator",
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
        <span className="label-mono text-slate-500">STATE MINIMUM VS. RECOMMENDED COVERAGE GAP CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="mb-3 text-[13px] font-semibold text-slate-700">
              Step 1 — Your state&apos;s minimum (enter your own figures)
            </p>
            <div className="space-y-4">
              <NumberField
                label="State minimum bodily injury, per person"
                value={stateBiPerPerson}
                onChange={setStateBiPerPerson}
              />
              <NumberField
                label="State minimum bodily injury, per accident"
                value={stateBiPerAccident}
                onChange={setStateBiPerAccident}
              />
              <NumberField
                label="State minimum property damage liability"
                value={statePD}
                onChange={setStatePD}
              />
            </div>
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
            >
              Look up your state&apos;s official minimum
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="mb-3 text-[13px] font-semibold text-slate-700">
              Step 2 — Your asset-protection inputs
            </p>
            <div className="space-y-4">
              <NumberField
                label="Assets you want to protect"
                hint="Savings, investments, home equity combined"
                value={assets}
                onChange={setAssets}
              />
              <NumberField
                label="Annual income"
                hint="A judgment can also attach future wages"
                value={income}
                onChange={setIncome}
              />
              <NumberField
                label="Vehicle's actual cash value"
                hint="What it would sell for today, not what you paid"
                value={vehicleValue}
                onChange={setVehicleValue}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">RECOMMENDED LIABILITY LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.tier.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {USD.format(result.tier.biPerPerson)} per person / {USD.format(result.tier.biPerAccident)} per
              accident bodily injury, {USD.format(result.recommendedPD)} property damage — sized to your
              entered assets and income, not to any state&apos;s minimum.
            </p>
          </div>

          {!result.hasStateMin ? (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Enter your state&apos;s actual minimum limits on the left to see your specific dollar gap. This
              tool will not guess that number for you.
            </div>
          ) : result.meetsRecommended ? (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-xs text-emerald-800">
              The state minimum you entered already meets or exceeds the recommended limit above. No gap
              based on these numbers.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 border-t border-hairline pt-4">
              <Figure label="BI/person gap" value={USD.format(result.gapBiPerPerson)} tone="accent" />
              <Figure label="BI/accident gap" value={USD.format(result.gapBiPerAccident)} tone="accent" />
              <Figure label="Prop. damage gap" value={USD.format(result.gapPD)} tone="accent" />
            </div>
          )}

          {result.hasStateMin && !result.meetsRecommended && (
            <div className="border-t border-hairline pt-4">
              <p className="text-xs font-semibold text-slate-700">Combined per-accident + property damage gap</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                {USD.format(result.combinedGap)}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                A simple sum of the per-accident bodily injury gap and the property damage gap — the rough
                additional limit dollars a serious at-fault accident could leave uncovered at your entered
                state minimum, compared to the recommended limit above.
              </p>
            </div>
          )}

          {result.exposureCoveredByStateMinPct !== null && (
            <div className="border-t border-hairline pt-4">
              <p className="text-xs font-semibold text-slate-700">Your state minimum vs. your total exposure</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Your entered per-accident bodily injury minimum ({USD.format(stateBiPerAccident)}) covers
                about {result.exposureCoveredByStateMinPct.toFixed(0)}% of your combined assets and income (
                {USD.format(result.exposure)}). The remainder would be exposed to an out-of-pocket judgment
                in a serious at-fault accident.
              </p>
            </div>
          )}

          {result.umbrellaGap > 0 && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Your assets and income add up to {USD.format(result.exposure)}, above what a 250/500 auto
              policy alone typically covers. Consider pairing your recommended limit with a personal
              umbrella policy for roughly {USD.format(result.umbrellaGap)} of additional protection.
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
        Estimate only. This tool never looks up or assumes any state&apos;s minimum requirement — every state
        minimum figure above comes from what you typed in. It models a commonly used asset-protection
        method for the recommended side of the comparison; it is not a quote and does not know your driving
        record, your insurer&apos;s underwriting rules, or state-specific mandates such as no-fault or personal
        injury protection requirements. Confirm your state&apos;s current minimum with your state&apos;s
        Department of Insurance and get an exact price from a licensed agent before buying or changing a
        policy.
      </div>
    </div>
  );
}

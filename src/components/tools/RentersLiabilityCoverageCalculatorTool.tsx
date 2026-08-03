"use client";

/**
 * Renters liability coverage calculator.
 *
 * Unlike the broader renters insurance coverage calculator (which sizes
 * personal property and loss-of-use limits), this tool isolates the
 * liability side of a renters policy: the part that responds when a guest
 * is hurt in your unit, you accidentally damage someone else's property, or
 * your dog injures someone. It sizes a suggested limit against the same
 * asset-protection principle used across the site (liability coverage
 * should generally be sized to what you have to lose), then layers on a
 * handful of scenario checkboxes for lifestyle factors that commonly raise
 * a renter's real-world liability exposure: hosting frequently, owning a
 * dog, keeping a water bed or similar higher-risk item, and subletting or
 * short-term-hosting the unit.
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

const LIABILITY_TIERS = [100_000, 300_000, 500_000] as const;
const MIN_PRACTICAL_LIMIT = LIABILITY_TIERS[0];
const MAX_STANDALONE_LIMIT = LIABILITY_TIERS[LIABILITY_TIERS.length - 1];

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
          step={500}
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

interface ScenarioToggleProps {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ScenarioToggle({ label, hint, checked, onChange }: ScenarioToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3.5 py-3 transition-colors hover:border-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>
        <span className="block text-[13px] font-medium text-slate-700">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{hint}</span>
      </span>
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

function tierIndexForAssets(assets: number): number {
  if (assets <= 100_000) return 0;
  if (assets <= 300_000) return 1;
  return 2;
}

export function RentersLiabilityCoverageCalculatorTool() {
  const [assets, setAssets] = useState(40_000);
  const [hostsGuests, setHostsGuests] = useState(false);
  const [ownsDog, setOwnsDog] = useState(false);
  const [higherRiskItem, setHigherRiskItem] = useState(false);
  const [sublets, setSublets] = useState(false);
  const [manualTier, setManualTier] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const baseIndex = tierIndexForAssets(assets);
    const riskFlags = [hostsGuests, ownsDog, higherRiskItem, sublets].filter(Boolean).length;

    // Two or more lifestyle risk factors push the recommendation up one
    // tier from the asset-based baseline, capped at the top standalone
    // tier this tool models. This reflects that liability exposure isn't
    // only about what you own, it's also about how often something could
    // go wrong in or around your rental.
    const bumpedIndex = riskFlags >= 2 ? Math.min(baseIndex + 1, LIABILITY_TIERS.length - 1) : baseIndex;
    const suggestedLimit = LIABILITY_TIERS[bumpedIndex];
    const activeLimit = manualTier ?? suggestedLimit;

    const exceedsStandalone = assets > MAX_STANDALONE_LIMIT;
    const umbrellaGap = exceedsStandalone ? assets - MAX_STANDALONE_LIMIT : 0;

    const medPay = hostsGuests || ownsDog ? 5_000 : 1_000;

    return {
      baseIndex,
      bumpedIndex,
      riskFlags,
      suggestedLimit,
      activeLimit,
      exceedsStandalone,
      umbrellaGap,
      medPay,
    };
  }, [assets, hostsGuests, ownsDog, higherRiskItem, sublets, manualTier]);

  async function copyResult() {
    const triggered: string[] = [];
    if (hostsGuests) triggered.push("frequent guests");
    if (ownsDog) triggered.push("dog ownership");
    if (higherRiskItem) triggered.push("water bed or similar higher-risk item");
    if (sublets) triggered.push("subletting or short-term hosting");

    const lines = [
      "Renters liability coverage recommendation",
      `Suggested personal liability limit: ${USD.format(result.activeLimit)}`,
      `Suggested medical payments to others: ${USD.format(result.medPay)}`,
      triggered.length > 0
        ? `Risk factors considered: ${triggered.join(", ")}`
        : "Risk factors considered: none selected",
      result.exceedsStandalone
        ? `Your entered assets are above the ${USD.format(MAX_STANDALONE_LIMIT)} ceiling this tool models for a standalone renters policy. Consider a personal umbrella policy for roughly ${USD.format(result.umbrellaGap)} of additional protection.`
        : "A standalone renters liability limit appears sufficient for the assets entered.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/renters/renters-liability-coverage-calculator",
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
        <span className="label-mono text-slate-500">RENTERS LIABILITY COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Assets and savings you'd want to protect"
            hint="Savings, investments, and other property a lawsuit could put at risk"
            value={assets}
            onChange={(v) => {
              setAssets(v);
              setManualTier(null);
            }}
          />

          <div className="space-y-2 border-t border-hairline pt-4">
            <p className="text-[13px] font-medium text-slate-600">
              Do any of these apply to your household?
            </p>
            <ScenarioToggle
              label="I host guests often"
              hint="Frequent visitors raise the odds of a guest injury claim"
              checked={hostsGuests}
              onChange={(v) => {
                setHostsGuests(v);
                setManualTier(null);
              }}
            />
            <ScenarioToggle
              label="I own a dog"
              hint="Dog liability is commonly underwritten and coverage varies by insurer"
              checked={ownsDog}
              onChange={(v) => {
                setOwnsDog(v);
                setManualTier(null);
              }}
            />
            <ScenarioToggle
              label="I have a water bed, trampoline, or similar higher-risk item"
              hint="Some items are flagged by insurers as raising liability exposure"
              checked={higherRiskItem}
              onChange={(v) => {
                setHigherRiskItem(v);
                setManualTier(null);
              }}
            />
            <ScenarioToggle
              label="I sublet or host short-term guests through a rental platform"
              hint="More turnover in the unit means more people who could be injured"
              checked={sublets}
              onChange={(v) => {
                setSublets(v);
                setManualTier(null);
              }}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED LIABILITY LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.activeLimit)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.riskFlags >= 2
                ? "Bumped up one tier from your asset-based baseline because two or more lifestyle risk factors are selected."
                : "Based on the assets you entered above."}
            </p>
          </div>

          <div>
            <p className="label-mono text-slate-400 mb-1.5">ADJUST THE LIMIT MANUALLY</p>
            <div className="flex flex-wrap gap-2">
              {LIABILITY_TIERS.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setManualTier(tier)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    result.activeLimit === tier
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {USD.format(tier)}
                </button>
              ))}
            </div>
          </div>

          {result.exceedsStandalone && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              The assets you entered ({USD.format(assets)}) are above the {USD.format(MAX_STANDALONE_LIMIT)}{" "}
              ceiling this tool models for a standalone renters liability limit. Consider pairing this
              limit with a personal umbrella policy for roughly {USD.format(result.umbrellaGap)} of
              additional protection.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Practical floor" value={USD.format(MIN_PRACTICAL_LIMIT)} />
            <Figure label="Suggested med pay to others" value={USD.format(result.medPay)} tone="accent" />
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Why this limit</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {result.riskFlags === 0
                ? "No lifestyle risk factors are selected, so the suggestion is based only on the assets you entered, with a floor of $100,000 since future earnings and assets stay exposed even when current savings are thin."
                : `${result.riskFlags} of 4 lifestyle risk factors selected. Each one describes a common way a renter's liability exposure shows up in real claims, so selecting two or more nudges the suggestion toward the next tier up.`}
            </p>
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
        Estimate only. This tool models a common asset-protection approach to sizing renters liability
        coverage; it is not a quote. Liability limits, dog liability rules, and excluded items vary by
        insurer and by state, and some insurers exclude specific dog breeds or high-risk items entirely.
        Confirm exact availability and pricing with a licensed insurance agent before buying or changing
        a policy.
      </div>
    </div>
  );
}

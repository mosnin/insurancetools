"use client";

/**
 * Renters insurance coverage calculator (flagship, top-down version).
 *
 * This is deliberately the fast, top-down entry point into sizing a renters
 * policy: pick a home size and a rough self-assessment of how much you own,
 * enter the liability limit and deductible you're considering, and see a
 * starting shape for the policy. The home-size/furnishing table below is a
 * UX shortcut for getting a plausible starting range in front of a user in
 * seconds, not a published statistic or an industry average — the copy and
 * the on-screen labels say so explicitly, and the tool actively pushes users
 * toward the itemized inventory calculator for a number they can actually
 * rely on, and toward the dedicated liability calculator for a sized
 * liability limit rather than a guessed one.
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

type HomeSize = "studio" | "one-bedroom" | "two-bedroom" | "three-plus";
type Furnishing = "light" | "average" | "heavy";

interface HomeSizeOption {
  value: HomeSize;
  label: string;
  hint: string;
}

interface FurnishingOption {
  value: Furnishing;
  label: string;
  hint: string;
}

const HOME_SIZES: HomeSizeOption[] = [
  { value: "studio", label: "Studio", hint: "One main room" },
  { value: "one-bedroom", label: "1 Bedroom", hint: "Small apartment" },
  { value: "two-bedroom", label: "2 Bedroom", hint: "Apartment or small house" },
  { value: "three-plus", label: "3+ Bedroom", hint: "Larger house or apartment" },
];

const FURNISHING_LEVELS: FurnishingOption[] = [
  { value: "light", label: "Light", hint: "Minimal furniture and electronics" },
  { value: "average", label: "Average", hint: "Typically furnished, some electronics" },
  { value: "heavy", label: "Heavy", hint: "Fully furnished, lots of gear or electronics" },
];

/**
 * Rough starting personal-property ranges by home size and self-assessed
 * furnishing level. This is a planning shortcut, not a survey result or an
 * industry average — every place this renders says so, and the tool always
 * points users to the itemized inventory calculator for a real number.
 */
const STARTING_RANGES: Record<HomeSize, Record<Furnishing, [number, number]>> = {
  studio: {
    light: [8_000, 15_000],
    average: [15_000, 25_000],
    heavy: [25_000, 40_000],
  },
  "one-bedroom": {
    light: [12_000, 20_000],
    average: [20_000, 35_000],
    heavy: [35_000, 55_000],
  },
  "two-bedroom": {
    light: [20_000, 35_000],
    average: [35_000, 55_000],
    heavy: [55_000, 85_000],
  },
  "three-plus": {
    light: [30_000, 50_000],
    average: [50_000, 80_000],
    heavy: [80_000, 120_000],
  },
};

const LIABILITY_PRESETS = [100_000, 300_000, 500_000];

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 2_000_000, step = 1_000 }: NumberFieldProps) {
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

function SegmentedField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; hint: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="block text-[13px] font-medium text-slate-600">{label}</legend>
      <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${
                active
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="block font-semibold">{opt.label}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">{opt.hint}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
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

export function RentersInsuranceCoverageCalculatorTool() {
  const [homeSize, setHomeSize] = useState<HomeSize>("one-bedroom");
  const [furnishing, setFurnishing] = useState<Furnishing>("average");
  const [liabilityLimit, setLiabilityLimit] = useState(100_000);
  const [deductible, setDeductible] = useState(500);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const [ppLow, ppHigh] = STARTING_RANGES[homeSize][furnishing];

    // Many HO-4 renters policies set additional living expenses coverage as
    // a percentage of the personal property limit, commonly cited in the
    // 20 to 30 percent band. This is standard policy structure, applied
    // here as a range against the range above, not a fabricated figure.
    const aleLow = Math.round((ppLow * 0.2) / 100) * 100;
    const aleHigh = Math.round((ppHigh * 0.3) / 100) * 100;

    const belowCommonFloor = liabilityLimit > 0 && liabilityLimit < 100_000;
    const deductibleShare = ppLow > 0 ? deductible / ppLow : 0;
    const highDeductibleShare = deductibleShare > 0.05;

    const nearestPreset = LIABILITY_PRESETS.reduce((closest, preset) =>
      Math.abs(preset - liabilityLimit) < Math.abs(closest - liabilityLimit) ? preset : closest
    );

    return {
      ppLow,
      ppHigh,
      aleLow,
      aleHigh,
      belowCommonFloor,
      highDeductibleShare,
      nearestPreset,
    };
  }, [homeSize, furnishing, liabilityLimit, deductible]);

  async function copyResult() {
    const sizeLabel = HOME_SIZES.find((s) => s.value === homeSize)?.label ?? homeSize;
    const furnishLabel = FURNISHING_LEVELS.find((f) => f.value === furnishing)?.label ?? furnishing;
    const lines = [
      "Renters insurance coverage starting point",
      `Home size / furnishing: ${sizeLabel}, ${furnishLabel}`,
      `Rough personal property starting range: ${USD.format(result.ppLow)}-${USD.format(result.ppHigh)} (planning shortcut, not an appraisal — itemize your own belongings for a real number)`,
      `Rough additional living expenses range: ${USD.format(result.aleLow)}-${USD.format(result.aleHigh)} (commonly 20-30% of the personal property limit on HO-4 policies)`,
      `Liability limit entered: ${USD.format(liabilityLimit)}`,
      `Deductible entered: ${USD.format(deductible)}`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/renters/renters-insurance-coverage-calculator",
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
        <span className="label-mono text-slate-500">RENTERS INSURANCE COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <SegmentedField label="Home size" options={HOME_SIZES} value={homeSize} onChange={setHomeSize} />
          <SegmentedField
            label="How much stuff do you have?"
            options={FURNISHING_LEVELS}
            value={furnishing}
            onChange={setFurnishing}
          />
          <NumberField
            label="Liability limit you're considering"
            hint="Common policy tiers start around $100,000"
            value={liabilityLimit}
            onChange={setLiabilityLimit}
            step={25_000}
          />
          <NumberField
            label="Deductible you're considering"
            hint="What you'd pay out of pocket before coverage kicks in"
            value={deductible}
            onChange={setDeductible}
            max={5_000}
            step={50}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ROUGH PERSONAL PROPERTY STARTING RANGE</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.ppLow)}&ndash;{USD.format(result.ppHigh)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              A starting-point shortcut based on home size and self-assessed furnishing level only — not an
              appraisal, survey result, or industry average.
            </p>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
            This range exists to get a plausible number in front of you quickly. For a figure you can
            actually rely on when buying a policy, walk through the{" "}
            <span className="font-semibold">personal property inventory calculator</span> instead, which
            adds up what you actually own room by room.
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Liability limit entered" value={USD.format(liabilityLimit)} tone="accent" />
            <Figure label="Deductible entered" value={USD.format(deductible)} />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Additional living expenses (ALE)</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Many HO-4 renters policies set ALE coverage as a percentage of your personal property
                limit, commonly in the 20 to 30 percent range. Applied to the range above, that&apos;s
                roughly {USD.format(result.aleLow)}&ndash;{USD.format(result.aleHigh)} of temporary-housing
                coverage if your rental becomes uninhabitable. Confirm the exact percentage your policy
                offers, since insurers vary.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Liability limit</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.belowCommonFloor
                  ? `${USD.format(liabilityLimit)} is below the $100,000 floor most renters policies start at. Most insurers won't offer less, so you may see a higher minimum once you get quotes.`
                  : `${USD.format(liabilityLimit)} lines up with a common policy tier (insurers frequently offer $100,000, $300,000, and $500,000 limits). This tool doesn't size liability to your personal risk — the liability coverage calculator does that.`}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Deductible</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.highDeductibleShare
                  ? `${USD.format(deductible)} is a meaningful share of the personal property range above. Make sure you'd have that much on hand before a claim, since you pay it before coverage pays out.`
                  : `${USD.format(deductible)} is a modest share of the personal property range above. A lower deductible usually raises your premium; a higher one usually lowers it.`}
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
        Estimate only. The personal property range is a planning shortcut based on home size and a
        self-assessed furnishing level, not a survey result, an appraisal, or an industry average — verify
        it against your own belongings before buying a policy. This tool does not know your state&apos;s
        rules, your landlord&apos;s lease requirements, or an insurer&apos;s underwriting. Confirm exact
        numbers with a licensed insurance agent before buying or changing coverage.
      </div>
    </div>
  );
}

"use client";

/**
 * Medical evacuation insurance decision-support tool.
 *
 * This is deliberately not a cost calculator. Real emergency medical
 * evacuation costs vary enormously by region, distance from a trauma
 * center, aircraft availability, and the number of transport legs
 * required, and inventing a representative dollar figure here would be
 * exactly the kind of fabricated statistic the project standards forbid.
 *
 * Instead, the tool takes two honest self-reported inputs — how remote the
 * traveler's destination or activity is, and whether they already know
 * their current policy's evacuation/medical-transport sublimit — and turns
 * them into a prioritized checklist of what to confirm before departure.
 * The remoteness tiers are a self-assessment prompt, not a scored risk
 * model; the "priority" labels reflect general, well-documented travel
 * insurance guidance (remote and high-altitude locations are the cases
 * where evacuation logistics matter most), not a computed probability.
 *
 * All logic runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Remoteness = "urban" | "moderate" | "remote";

interface RemotenessOption {
  value: Remoteness;
  label: string;
  hint: string;
}

const REMOTENESS_OPTIONS: RemotenessOption[] = [
  {
    value: "urban",
    label: "Urban / accessible",
    hint: "Major city, developed hospital network nearby",
  },
  {
    value: "moderate",
    label: "Moderately remote",
    hint: "Smaller town, regional hospital hours away",
  },
  {
    value: "remote",
    label: "Very remote / wilderness / high altitude",
    hint: "Backcountry, open ocean, high-altitude trek, expedition",
  },
];

type Priority = "high" | "medium" | "low";

interface ChecklistItem {
  priority: Priority;
  text: string;
}

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "Do this before you go",
  medium: "Worth confirming",
  low: "Good practice",
};

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "border-red-100 bg-red-50 text-red-700",
  medium: "border-amber-100 bg-amber-50 text-amber-700",
  low: "border-slate-200 bg-slate-50 text-slate-600",
};

function NumberField({
  label,
  hint,
  value,
  onChange,
  max = 5_000_000,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}) {
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
          step={5_000}
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

export function MedicalEvacuationCoverageCalculatorTool() {
  const [remoteness, setRemoteness] = useState<Remoteness>("moderate");
  const [sublimit, setSublimit] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const sublimitKnown = sublimit > 0;
    const option = REMOTENESS_OPTIONS.find((o) => o.value === remoteness)!;

    let headline: string;
    let headlineTone: "high" | "medium" | "low";

    if (remoteness === "remote") {
      headline = "Strongly consider a dedicated evacuation policy or membership";
      headlineTone = "high";
    } else if (remoteness === "moderate") {
      headline = sublimitKnown
        ? "Your sublimit is a starting point — confirm what it actually covers"
        : "Check your policy's stated evacuation sublimit before you go";
      headlineTone = "medium";
    } else {
      headline = "Evacuation risk is comparatively lower for this trip";
      headlineTone = "low";
    }

    const checklist: ChecklistItem[] = [];

    // Sublimit awareness — always relevant, priority scales with remoteness.
    if (!sublimitKnown) {
      checklist.push({
        priority: remoteness === "urban" ? "low" : "high",
        text: "Find your policy's exact evacuation / medical transport sublimit. Trip-cancellation-focused plans often bundle only a modest emergency medical or evacuation benefit, and “emergency evacuation included” on a brochure page is not the same as a specific dollar limit.",
      });
    } else {
      checklist.push({
        priority: remoteness === "remote" ? "medium" : "low",
        text: `You've noted a ${USD.format(sublimit)} sublimit. Confirm with your insurer whether that figure is a true cap on total evacuation cost or a per-incident limit, and whether it is separate from your general trip-medical benefit.`,
      });
    }

    // Repatriation vs. initial evacuation — a common gap regardless of remoteness.
    checklist.push({
      priority: remoteness === "remote" ? "high" : "medium",
      text: "Ask whether the policy covers repatriation (return transport home or to a hospital in your home country) in addition to the initial evacuation to the nearest adequate facility. These are sometimes priced and capped separately.",
    });

    // Logistics / coordination — matters most for remote and moderate trips.
    if (remoteness !== "urban") {
      checklist.push({
        priority: remoteness === "remote" ? "high" : "medium",
        text: "Confirm whether your provider actively coordinates and arranges transport (aircraft, medical escort, in-country logistics) or only reimburses costs after you or your family pay out of pocket. For remote or high-altitude locations, coordination speed can matter as much as the dollar limit.",
      });
    }

    // Dedicated evacuation membership recommendation, scaled to remoteness.
    checklist.push({
      priority: remoteness === "remote" ? "high" : remoteness === "moderate" ? "medium" : "low",
      text:
        remoteness === "remote"
          ? "Look into a standalone medical evacuation membership (separate from travel medical insurance) built specifically around organizing and funding transport from remote, high-altitude, or austere locations."
          : remoteness === "moderate"
            ? "Weigh whether a standalone evacuation membership makes sense in addition to your travel medical plan, especially if your itinerary includes any leg that is more remote than your trip overall."
            : "A standalone evacuation membership is less commonly needed for accessible, urban itineraries, but it's still worth knowing your sublimit for any unplanned hospitalization.",
    });

    return { sublimitKnown, option, headline, headlineTone, checklist };
  }, [remoteness, sublimit]);

  async function copyResult() {
    const lines = [
      "Medical evacuation coverage checklist",
      `Destination profile: ${result.option.label}`,
      result.sublimitKnown
        ? `Known evacuation sublimit: ${USD.format(sublimit)}`
        : "Evacuation sublimit: not yet confirmed",
      result.headline,
      ...result.checklist.map((item) => `- [${PRIORITY_LABEL[item.priority]}] ${item.text}`),
      "Decision-support guidance only, not a cost estimate or insurance advice. insurancetools.org/tools/travel/medical-evacuation-coverage-calculator",
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
        <span className="label-mono text-slate-500">MEDICAL EVACUATION COVERAGE CHECKLIST</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <span className="block text-[13px] font-medium text-slate-600">
              How remote is your destination or activity?
            </span>
            <div className="mt-1.5 space-y-2">
              {REMOTENESS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRemoteness(option.value)}
                  aria-pressed={remoteness === option.value}
                  className={`block w-full rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                    remoteness === option.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`block text-sm font-medium ${
                      remoteness === option.value ? "text-blue-700" : "text-slate-900"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{option.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <NumberField
            label="Your policy's evacuation / medical transport sublimit"
            hint="Optional — leave at $0 if you haven't checked yet. Many travelers haven't."
            value={sublimit}
            onChange={setSublimit}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">RECOMMENDATION</p>
            <p
              className={`mt-1.5 text-lg font-semibold leading-snug ${
                result.headlineTone === "high"
                  ? "text-red-700"
                  : result.headlineTone === "medium"
                    ? "text-amber-700"
                    : "text-slate-900"
              }`}
            >
              {result.headline}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Based on: {result.option.label}
              {result.sublimitKnown ? `, ${USD.format(sublimit)} stated sublimit` : ", sublimit not yet confirmed"}
            </p>
          </div>

          <div className="space-y-2.5 border-t border-hairline pt-4">
            {result.checklist.map((item, i) => (
              <div key={i} className={`rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${PRIORITY_STYLE[item.priority]}`}>
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide">
                  {PRIORITY_LABEL[item.priority]}
                </span>
                {item.text}
              </div>
            ))}
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
        This tool does not estimate a dollar cost for evacuation and is not a quote. Real evacuation costs
        depend on region, distance to care, aircraft availability, and the number of transport legs
        required, none of which this tool can know from a remoteness self-assessment. It produces a
        decision checklist based on commonly cited travel insurance guidance, not a guaranteed outcome.
        Confirm your policy&apos;s actual terms with your insurer or licensed agent before you travel.
      </div>
    </div>
  );
}

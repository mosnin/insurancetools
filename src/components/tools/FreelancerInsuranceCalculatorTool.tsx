"use client";

/**
 * Freelancer insurance calculator.
 *
 * Built for solo freelancers (writers, designers, developers, photographers,
 * and similar independent contractors) rather than multi-employee consulting
 * firms — no payroll or employee count inputs here, since a one-person
 * freelance operation carries a materially different risk profile than a
 * small firm with staff.
 *
 * The user enters annual freelance revenue and picks a primary work type.
 * The work type doesn't change the math; it changes which coverage the tool
 * flags as the higher priority, since a photographer's dominant risk (gear
 * damage, on-site accidents) is genuinely different from a developer's or
 * writer's (a missed deadline, a bug, a content or IP dispute) — these are
 * commonly cited freelance risk patterns, not a statistic this tool invents.
 *
 * The suggested bundle limit is a combined general liability + professional
 * liability (E&O) figure sized as an adjustable multiple of annual revenue,
 * rounded to a common policy tier. It is framed throughout as one common
 * approach, not a formula every broker or insurer follows.
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

// Common combined GL + E&O bundle limits sold to solo freelancers and small
// service providers. Freelancer bundles are typically written at or below
// these tiers, well under the multi-million-dollar limits larger consulting
// firms carry, since a single freelancer's contract sizes are usually
// smaller. The suggested figure is rounded up to the nearest tier rather
// than shown as a falsely precise number like $286,000.
const TIERS = [250_000, 500_000, 1_000_000, 2_000_000] as const;

function tierFor(rawValue: number): number {
  if (rawValue <= 0) return TIERS[0];
  const found = TIERS.find((t) => t >= rawValue);
  return found ?? Math.ceil(rawValue / 1_000_000) * 1_000_000;
}

type WorkType = "creative" | "technical" | "inperson";

const WORK_TYPES: { id: WorkType; label: string; hint: string }[] = [
  { id: "creative", label: "Creative & content", hint: "Writing, design, marketing, editing" },
  { id: "technical", label: "Technical & development", hint: "Software, IT, data, consulting-by-code" },
  { id: "inperson", label: "In-person services", hint: "Photography, video, staging, events" },
];

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

function NumberField({
  label,
  hint,
  value,
  onChange,
  max = 5_000_000,
  min = 0,
  step = 500,
  prefix = "$",
  suffix,
}: NumberFieldProps) {
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
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, min), max) : min;
            onChange(clamped);
          }}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-10" : "pr-3"} text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
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

const WORK_TYPE_NOTES: Record<WorkType, { priority: string; note: string }> = {
  creative: {
    priority: "Professional liability (E&O)",
    note:
      "Writers, designers, and marketers rarely damage a client's property in person, but a missed deadline, a factual error in published copy, or a dispute over who owns the final files is a realistic claim. Weight E&O coverage first within the bundle and treat general liability as the secondary layer.",
  },
  technical: {
    priority: "Professional liability (E&O) and tech-specific extensions",
    note:
      "Developers and IT freelancers face the same missed-deadline and dispute exposure as other creative work, plus code that breaks something in production or a data-handling mistake. Ask whether the E&O portion of the bundle includes technology errors and omissions language specifically, since a generic E&O form doesn't always contemplate software work the way a tech-focused endorsement does.",
  },
  inperson: {
    priority: "General liability, plus equipment coverage",
    note:
      "Photographers, videographers, and other on-location freelancers are the ones actually inside a client's home, venue, or office, so bodily injury and property damage exposure is higher and general liability deserves the larger share of attention. Camera bodies, lenses, and lighting gear also usually need a separate business personal property or inland marine add-on, since general liability doesn't cover damage to your own equipment.",
  },
};

export function FreelancerInsuranceCalculatorTool() {
  const [revenue, setRevenue] = useState(45_000);
  const [workType, setWorkType] = useState<WorkType>("creative");
  const [equipmentValue, setEquipmentValue] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasRevenue = revenue > 0;
    const rawTarget = revenue * multiplier;
    const suggestedLimit = tierFor(rawTarget);
    const workNote = WORK_TYPE_NOTES[workType];

    const equipmentThreshold = 2_500;
    const flagEquipment = equipmentValue > equipmentThreshold;

    return {
      hasRevenue,
      rawTarget,
      suggestedLimit,
      workNote,
      flagEquipment,
      equipmentThreshold,
    };
  }, [revenue, multiplier, workType, equipmentValue]);

  async function copyResult() {
    const lines = [
      "Freelancer insurance bundle estimate",
      result.hasRevenue
        ? `Suggested combined GL + E&O limit: ${USD.format(result.suggestedLimit)} (about ${multiplier}x annual revenue)`
        : "Enter your annual freelance revenue to get a suggested bundle limit",
      `Priority coverage for this work type: ${result.workNote.priority}`,
      result.flagEquipment
        ? `Equipment: consider a separate business personal property or inland marine add-on for your ${USD.format(equipmentValue)} of gear`
        : "Equipment: no separate add-on flagged at this equipment value",
      "Many freelance platforms and larger client contracts increasingly ask for proof of liability insurance before work begins — check your specific contracts.",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/business/freelancer-insurance-calculator",
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
        <span className="label-mono text-slate-500">FREELANCER INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Annual freelance revenue"
            hint="Total billed to clients in a typical year, before expenses"
            value={revenue}
            onChange={setRevenue}
          />

          <div>
            <span className="block text-[13px] font-medium text-slate-600">Primary work type</span>
            <div className="mt-1.5 grid grid-cols-1 gap-1.5">
              {WORK_TYPES.map((wt) => (
                <button
                  key={wt.id}
                  type="button"
                  aria-pressed={workType === wt.id}
                  onClick={() => setWorkType(wt.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                    workType === wt.id
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span className="block font-medium">{wt.label}</span>
                  <span className="block text-[11px] text-slate-400">{wt.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <NumberField
            label="Business equipment value (optional)"
            hint="Cameras, computers, lighting, tools you'd need to replace"
            value={equipmentValue}
            onChange={setEquipmentValue}
          />

          <NumberField
            label="Bundle limit multiplier"
            hint="How many times your annual revenue to target — adjust this to see other tiers"
            value={multiplier}
            onChange={(v) => setMultiplier(Math.min(Math.max(v, 0.5), 3))}
            prefix=""
            suffix="x"
            step={0.5}
            min={0.5}
            max={3}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          {!result.hasRevenue ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-600">
              Enter your annual freelance revenue to see a suggested coverage bundle.
            </div>
          ) : (
            <>
              <div>
                <p className="label-mono text-slate-400">SUGGESTED GL + E&amp;O BUNDLE LIMIT</p>
                <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
                  {USD.format(result.suggestedLimit)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Based on {multiplier}x your {USD.format(revenue)} annual revenue, rounded to a commonly sold
                  bundle tier
                </p>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
                <span className="font-semibold">{result.workNote.priority}</span> is the higher priority for your
                work type. {result.workNote.note}
              </div>

              {result.flagEquipment && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
                  Your entered equipment value ({USD.format(equipmentValue)}) is above{" "}
                  {USD.format(result.equipmentThreshold)}. A standalone GL or E&amp;O bundle typically will
                  not reimburse damage to your own gear — ask about a business personal property or inland
                  marine add-on for that specifically.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
                <Figure label="Revenue entered" value={USD.format(revenue)} />
                <Figure label="Multiplier used" value={`${multiplier}x`} tone="accent" />
              </div>

              <div className="space-y-3 border-t border-hairline pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Why a revenue multiple</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Sizing a bundle limit to a multiple of revenue is one common shorthand freelancers and
                    brokers use when there isn&apos;t a single dominant contract to size against, unlike a
                    consultant with one large retainer. It&apos;s a starting point for a conversation, not a
                    guarantee that this exact figure matches what any specific client or platform requires.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Platform and client requirements</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Freelance marketplaces and larger clients increasingly ask for proof of liability
                    insurance before a bigger contract starts, especially for on-site work or corporate
                    clients. If a specific platform or client contract names a minimum limit, treat that
                    number as the floor and compare it against the estimate above.
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
        Estimate only. This tool models one common way solo freelancers size a combined general liability
        and professional liability bundle; it is not a quote, and it does not know your state&apos;s rules,
        your specific client contracts, or an insurer&apos;s underwriting guidelines. It also doesn&apos;t
        account for employees, since it&apos;s built for solo freelance work rather than a staffed small
        business. Confirm any client- or platform-required minimum and get an exact price from a licensed
        agent before buying or changing a policy.
      </div>
    </div>
  );
}

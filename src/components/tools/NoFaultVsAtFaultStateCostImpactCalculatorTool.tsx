"use client";

/**
 * No-fault vs. at-fault state insurance calculator.
 *
 * This tool does not maintain, and must never fabricate, a list of which
 * states are legally "no-fault." That list is a real, authoritative legal
 * fact that changes rarely but does occasionally change (a state can add or
 * drop a "choice no-fault" option, or revise its PIP statute), so hardcoding
 * it here would eventually go stale and would be exactly the kind of
 * unverifiable claim the project standards forbid. Instead, the user
 * self-identifies their system with a toggle, and a "not sure" option links
 * out to the NAIC state insurance department directory so the user can
 * confirm the current, correct answer for their own state.
 *
 * Once a system is chosen, the tool explains how the practical claims
 * process and cost exposure differ between the two systems and, for the
 * no-fault path, checks the user's PIP limit against a rough national
 * average medical cost range so they can see whether their limit is likely
 * to run out. All of this is a structural explanation of how the two
 * systems work, not a state-specific data lookup.
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

type SystemType = "no-fault" | "at-fault" | "unsure";

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

// A widely cited, non-state-specific planning range for what a single
// moderate-severity auto injury claim can run in medical costs, used only to
// give a "does my PIP limit look thin" gut check, never a claim about any
// specific state's typical payout.
const MODERATE_INJURY_LOW = 5_000;
const MODERATE_INJURY_HIGH = 25_000;

const PIP_PRESETS = [2_000, 10_000, 25_000, 50_000];

export function NoFaultVsAtFaultStateCostImpactCalculatorTool() {
  const [system, setSystem] = useState<SystemType>("no-fault");
  const [pipLimit, setPipLimit] = useState(10_000);
  const [pipKnown, setPipKnown] = useState(true);
  const [liabilityBI, setLiabilityBI] = useState(50_000);
  const [medicalEstimate, setMedicalEstimate] = useState(12_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const withinLowEstimate = medicalEstimate <= MODERATE_INJURY_LOW;
    const aboveHighEstimate = medicalEstimate >= MODERATE_INJURY_HIGH;

    // No-fault path: check the entered PIP limit against the entered medical
    // estimate.
    const pipShortfall = pipKnown ? Math.max(0, medicalEstimate - pipLimit) : 0;
    const pipCoversIt = pipKnown && pipLimit >= medicalEstimate;

    // At-fault path: liability-only check. If the driver is not at fault,
    // the other driver's BI liability limit is what matters, which this
    // user does not control and this tool does not know. The comparison
    // here is illustrative: how the entered medical estimate compares to a
    // typical minimum-range BI limit the user entered for reference.
    const atFaultShortfall = Math.max(0, medicalEstimate - liabilityBI);
    const liabilityCoversIt = liabilityBI >= medicalEstimate;

    return {
      withinLowEstimate,
      aboveHighEstimate,
      pipShortfall,
      pipCoversIt,
      atFaultShortfall,
      liabilityCoversIt,
    };
  }, [medicalEstimate, pipLimit, pipKnown, liabilityBI]);

  async function copyResult() {
    const lines = [
      "No-fault vs. at-fault state insurance calculator",
      `Self-identified system: ${
        system === "no-fault" ? "No-fault (PIP)" : system === "at-fault" ? "At-fault (tort)" : "Not sure yet"
      }`,
      system === "no-fault"
        ? pipKnown
          ? `PIP limit ${USD.format(pipLimit)} vs. estimated medical cost ${USD.format(medicalEstimate)}: ${
              result.pipCoversIt
                ? "your PIP limit appears sufficient for this estimate"
                : `possible shortfall of about ${USD.format(result.pipShortfall)} beyond your PIP limit`
            }`
          : "PIP limit not entered — check your declarations page for the exact figure"
        : system === "at-fault"
          ? `Reference bodily injury liability limit ${USD.format(liabilityBI)} vs. estimated medical cost ${USD.format(medicalEstimate)}: ${
              result.liabilityCoversIt
                ? "within the reference limit"
                : `possible shortfall of about ${USD.format(result.atFaultShortfall)} beyond that limit`
            }`
          : "System not yet confirmed — verify with your state's Department of Insurance before assuming either system applies",
      "This does not identify your state's legal system and is not a claim, coverage, or legal determination. insurancetools.org/tools/state-requirements/no-fault-vs-at-fault-state-cost-impact-calculator",
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
        <span className="label-mono text-slate-500">NO-FAULT VS. AT-FAULT STATE CALCULATOR</span>
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
              Which system does your state use?
            </span>
            <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(
                [
                  { key: "no-fault", label: "No-fault" },
                  { key: "at-fault", label: "At-fault" },
                  { key: "unsure", label: "Not sure" },
                ] as { key: SystemType; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSystem(opt.key)}
                  aria-pressed={system === opt.key}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    system === opt.key
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {system === "unsure" && (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                This tool does not look your state up for you, since that list changes occasionally and a
                stale answer here would be worse than no answer. Check your declarations page for a
                &ldquo;Personal Injury Protection&rdquo; or &ldquo;PIP&rdquo; line (a strong sign you&apos;re in a no-fault
                state), or confirm directly with the{" "}
                <a
                  href="https://content.naic.org/state-insurance-departments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  NAIC directory of state insurance departments
                </a>
                .
              </p>
            )}
          </div>

          {system === "no-fault" && (
            <>
              <div>
                <span className="block text-[13px] font-medium text-slate-600">
                  Do you know your PIP limit?
                </span>
                <div className="mt-1.5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPipKnown(true)}
                    aria-pressed={pipKnown}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      pipKnown
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPipKnown(false)}
                    aria-pressed={!pipKnown}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      !pipKnown
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Not sure
                  </button>
                </div>
              </div>

              {pipKnown && (
                <div>
                  <NumberField
                    label="Your PIP limit"
                    hint="Found on your declarations page, sometimes called Personal Injury Protection"
                    value={pipLimit}
                    onChange={setPipLimit}
                    max={1_000_000}
                    step={500}
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PIP_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPipLimit(preset)}
                        className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                          pipLimit === preset
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {USD.format(preset)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {system === "at-fault" && (
            <NumberField
              label="Reference bodily injury liability limit"
              hint="Yours or a typical limit you want to compare against, per person"
              value={liabilityBI}
              onChange={setLiabilityBI}
              max={2_000_000}
              step={5_000}
            />
          )}

          <NumberField
            label="Estimated medical cost from the accident"
            hint="A rough figure — ER visit, imaging, follow-up care, physical therapy"
            value={medicalEstimate}
            onChange={setMedicalEstimate}
            max={5_000_000}
            step={500}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">HOW YOUR MEDICAL BILLS GET PAID</p>
            <p className="mt-1.5 text-xl font-semibold leading-snug text-slate-900">
              {system === "no-fault"
                ? "Your own PIP coverage pays first, regardless of fault"
                : system === "at-fault"
                  ? "The at-fault driver's liability insurer pays"
                  : "Confirm your state's system before assuming either applies"}
            </p>
          </div>

          {system === "no-fault" && (
            <>
              <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
                <Figure label="Your PIP limit" value={pipKnown ? USD.format(pipLimit) : "Unknown"} />
                <Figure
                  label={result.pipCoversIt ? "Within limit" : "Possible shortfall"}
                  value={pipKnown ? (result.pipCoversIt ? USD.format(0) : USD.format(result.pipShortfall)) : "—"}
                  tone={pipKnown && !result.pipCoversIt ? "accent" : "default"}
                />
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
                {!pipKnown
                  ? "Enter your PIP limit to see whether it likely covers this estimate. In the meantime, your PIP pays your own medical bills up to whatever limit is on your declarations page, before anyone determines who caused the accident."
                  : result.pipCoversIt
                    ? "Based on this estimate, your PIP limit looks sufficient to cover these medical costs directly, without waiting on a fault determination. If bills exceed your limit later, your own health insurance, MedPay, or a claim against the at-fault driver (where your state's tort threshold allows it) may come into play."
                    : `Based on this estimate, costs could exceed your PIP limit by roughly ${USD.format(result.pipShortfall)}. In many no-fault states, once your injury or costs cross a "tort threshold," you may be able to step outside no-fault and pursue the at-fault driver directly for the remainder — the exact threshold and process vary by state and are worth confirming with a licensed agent or attorney.`}
              </div>
            </>
          )}

          {system === "at-fault" && (
            <>
              <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
                <Figure label="Reference BI limit" value={USD.format(liabilityBI)} />
                <Figure
                  label={result.liabilityCoversIt ? "Within limit" : "Possible shortfall"}
                  value={result.liabilityCoversIt ? USD.format(0) : USD.format(result.atFaultShortfall)}
                  tone={!result.liabilityCoversIt ? "accent" : "default"}
                />
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
                {result.liabilityCoversIt
                  ? "In an at-fault state, this estimate falls within the reference liability limit entered, so the at-fault driver's insurer would typically be expected to pay it directly, once fault is established. Payment can still take time while the claim is investigated."
                  : `This estimate exceeds the reference liability limit by roughly ${USD.format(result.atFaultShortfall)}. If the at-fault driver's limit is this low, your own uninsured/underinsured motorist coverage is what typically closes that gap, not the at-fault driver's policy. Also remember that in at-fault states, fault must generally be established before either insurer pays, which can add delay compared to a no-fault claim.`}
              </div>
            </>
          )}

          {system === "unsure" && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
              Choose &ldquo;No-fault&rdquo; or &ldquo;At-fault&rdquo; above once you&apos;ve confirmed your state&apos;s system to see
              how your entered medical estimate compares to typical coverage limits for that system. Every
              state legally defines itself as one or the other (or a hybrid &ldquo;choice&rdquo; system), and that
              designation determines who pays your medical bills first.
            </div>
          )}

          <div className="border-t border-hairline pt-4 text-xs leading-relaxed text-slate-500">
            For context, a single moderate-severity auto injury (an ER visit plus follow-up care) commonly
            runs in the {USD.format(MODERATE_INJURY_LOW)}–{USD.format(MODERATE_INJURY_HIGH)} range, though
            actual costs vary enormously by injury type and region. This is a planning reference, not a
            prediction for any specific accident.
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
        Estimate only, and not a determination of your state&apos;s legal system. This tool does not maintain
        a list of which states are no-fault, at-fault, or hybrid &ldquo;choice&rdquo; states, since that list is a
        legal fact that occasionally changes and should be confirmed with your state&apos;s Department of
        Insurance or your policy&apos;s declarations page, not assumed from a toggle. It also does not know
        your policy&apos;s actual limits, your state&apos;s specific tort threshold, or the facts of any accident.
        Consult a licensed insurance agent, a claims professional, or an attorney before relying on this for
        an actual claim.
      </div>
    </div>
  );
}

"use client";

/**
 * Accident-only vs. comprehensive (accident-and-illness) pet insurance
 * calculator.
 *
 * Unlike a general "is pet insurance worth it" value calculator, this tool
 * makes one specific, concrete comparison: given the user's own two premium
 * quotes for the same pet — one accident-only, one accident-and-illness —
 * and their own deductible and reimbursement rate for each tier, what would
 * each plan actually pay toward a vet bill the user enters, for an accident
 * scenario versus an illness scenario?
 *
 * The accident-only payout is forced to $0 whenever the illness scenario is
 * selected. That isn't a modeling shortcut; it reflects the standard
 * product-tier distinction in the pet insurance market, where accident-only
 * policies exclude illness claims entirely by design, regardless of
 * deductible or reimbursement rate. Showing that as a real $0 line item,
 * next to what the comprehensive tier would pay on the same bill, is the
 * whole point of the tool.
 *
 * All math runs client-side from numbers the user enters. Nothing typed
 * here is sent anywhere, and no vet bill or premium amount is assumed or
 * looked up — every dollar figure on the page traces back to an input.
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
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 100_000, step = 25 }: NumberFieldProps) {
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

interface PercentFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

function PercentField({ label, hint, value, onChange }: PercentFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          step={5}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 100) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-7 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Figure({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent";
}) {
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

type Scenario = "accident" | "illness";

export function AccidentOnlyVsComprehensivePetCalculatorTool() {
  const [accidentPremium, setAccidentPremium] = useState(204);
  const [accidentDeductible, setAccidentDeductible] = useState(250);
  const [accidentReimbursement, setAccidentReimbursement] = useState(80);

  const [compPremium, setCompPremium] = useState(636);
  const [compDeductible, setCompDeductible] = useState(250);
  const [compReimbursement, setCompReimbursement] = useState(80);

  const [scenario, setScenario] = useState<Scenario>("illness");
  const [vetBill, setVetBill] = useState(3_800);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const isIllness = scenario === "illness";

    // Accident-only plans exclude illness claims by product design, not by
    // this tool's assumption, so an illness scenario always pays $0 from
    // that tier regardless of its deductible or reimbursement rate.
    const accidentOnlyPayout = isIllness
      ? 0
      : (accidentReimbursement / 100) * Math.max(0, vetBill - accidentDeductible);

    // The comprehensive (accident-and-illness) tier pays the same way in
    // either scenario, using its own deductible and reimbursement rate.
    const comprehensivePayout = (compReimbursement / 100) * Math.max(0, vetBill - compDeductible);

    const accidentOnlyOutOfPocket = Math.max(0, vetBill - accidentOnlyPayout);
    const comprehensiveOutOfPocket = Math.max(0, vetBill - comprehensivePayout);

    const totalCostAccidentOnly = accidentPremium + accidentOnlyOutOfPocket;
    const totalCostComprehensive = compPremium + comprehensiveOutOfPocket;

    const premiumDifference = compPremium - accidentPremium;
    const coverageGap = comprehensivePayout - accidentOnlyPayout;

    return {
      isIllness,
      accidentOnlyPayout,
      comprehensivePayout,
      accidentOnlyOutOfPocket,
      comprehensiveOutOfPocket,
      totalCostAccidentOnly,
      totalCostComprehensive,
      premiumDifference,
      coverageGap,
    };
  }, [
    scenario,
    vetBill,
    accidentDeductible,
    accidentReimbursement,
    compDeductible,
    compReimbursement,
    accidentPremium,
    compPremium,
  ]);

  async function copyResult() {
    const lines = [
      "Accident-only vs. comprehensive pet insurance comparison",
      `Scenario: ${result.isIllness ? "illness event" : "accident event"}, estimated vet bill ${USD.format(vetBill)}`,
      `Accident-only plan payout: ${USD.format(result.accidentOnlyPayout)} (annual premium ${USD.format(accidentPremium)})`,
      `Comprehensive plan payout: ${USD.format(result.comprehensivePayout)} (annual premium ${USD.format(compPremium)})`,
      result.isIllness
        ? `Coverage gap: accident-only pays $0 toward this illness claim; comprehensive would pay ${USD.format(result.comprehensivePayout)}`
        : `Both tiers can pay toward this accident claim; comprehensive costs ${USD.format(Math.abs(result.premiumDifference))}/year ${result.premiumDifference >= 0 ? "more" : "less"} for its added illness protection`,
      `Total cost this year — accident-only: ${USD.format(result.totalCostAccidentOnly)}, comprehensive: ${USD.format(result.totalCostComprehensive)}`,
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/pet/accident-only-vs-comprehensive-pet-calculator",
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
        <span className="label-mono text-slate-500">ACCIDENT-ONLY VS. COMPREHENSIVE PET CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold text-slate-700">Scenario</p>
            <p className="mt-1 text-xs text-slate-500">
              Pick the kind of vet visit you want to test both quotes against.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScenario("accident")}
                aria-pressed={scenario === "accident"}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  scenario === "accident"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Accident event
                <span className="block text-[11px] font-normal text-slate-400">
                  e.g. broken bone, swallowed object
                </span>
              </button>
              <button
                type="button"
                onClick={() => setScenario("illness")}
                aria-pressed={scenario === "illness"}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  scenario === "illness"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                Illness event
                <span className="block text-[11px] font-normal text-slate-400">
                  e.g. cancer, chronic condition
                </span>
              </button>
            </div>
          </div>

          <NumberField
            label="Estimated vet bill for this scenario"
            hint="Use your own vet's estimate or a quote you already received"
            value={vetBill}
            onChange={setVetBill}
            max={100_000}
            step={50}
          />

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Accident-only plan quote</p>
            <div className="mt-3 space-y-4">
              <NumberField label="Annual premium" value={accidentPremium} onChange={setAccidentPremium} max={20_000} />
              <NumberField
                label="Annual deductible"
                value={accidentDeductible}
                onChange={setAccidentDeductible}
                max={5_000}
              />
              <PercentField
                label="Reimbursement rate"
                hint="The % of a covered bill the insurer pays after your deductible"
                value={accidentReimbursement}
                onChange={setAccidentReimbursement}
              />
            </div>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">Comprehensive (accident-and-illness) plan quote</p>
            <div className="mt-3 space-y-4">
              <NumberField label="Annual premium" value={compPremium} onChange={setCompPremium} max={20_000} />
              <NumberField label="Annual deductible" value={compDeductible} onChange={setCompDeductible} max={5_000} />
              <PercentField label="Reimbursement rate" value={compReimbursement} onChange={setCompReimbursement} />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              {result.isIllness ? "ILLNESS CLAIM PAYOUT" : "ACCIDENT CLAIM PAYOUT"}
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
                  {USD.format(result.accidentOnlyPayout)}
                </p>
                <p className="text-xs text-slate-500">Accident-only plan</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums tracking-[-0.02em] text-blue-600">
                  {USD.format(result.comprehensivePayout)}
                </p>
                <p className="text-xs text-slate-500">Comprehensive plan</p>
              </div>
            </div>
          </div>

          {result.isIllness ? (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Accident-only policies exclude illness claims by design, so this {USD.format(vetBill)} illness
              bill gets $0 from that plan. The comprehensive plan would pay {USD.format(result.comprehensivePayout)}{" "}
              toward the same bill — a {USD.format(result.coverageGap)} coverage gap on this one claim alone.
            </div>
          ) : (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Accident claims are typically covered by both tiers, so the gap here is mostly the{" "}
              {USD.format(Math.abs(result.premiumDifference))}/year premium difference you&apos;re paying{" "}
              {result.premiumDifference >= 0 ? "extra" : "less"} for the comprehensive plan&apos;s added
              illness protection, which this scenario doesn&apos;t use.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Total cost, accident-only" value={USD.format(result.totalCostAccidentOnly)} />
            <Figure label="Total cost, comprehensive" value={USD.format(result.totalCostComprehensive)} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Out-of-pocket for this bill</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Accident-only: {USD.format(result.accidentOnlyOutOfPocket)} of the {USD.format(vetBill)} bill.
                Comprehensive: {USD.format(result.comprehensiveOutOfPocket)} of the same bill.
                &ldquo;Total cost&rdquo; above adds each plan&apos;s annual premium to its out-of-pocket share, so
                you can compare a full year&apos;s cost, not just the single claim.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Premium difference</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                The comprehensive quote costs {USD.format(Math.abs(result.premiumDifference))}/year{" "}
                {result.premiumDifference >= 0 ? "more" : "less"} than the accident-only quote you entered.
                That difference buys illness coverage the accident-only tier doesn&apos;t include at any
                price.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyResult}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy result"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. Every dollar figure above — both premiums, both deductibles, both reimbursement
        rates, and the vet bill — comes from what you entered; this tool does not know typical costs for
        your pet, breed, or region. It also doesn&apos;t model annual or per-incident payout caps, waiting
        periods, or pre-existing and hereditary condition exclusions, all of which vary by insurer and can
        further reduce a real payout. Confirm exact terms with your policy documents or a licensed agent
        before relying on this comparison to choose a plan.
      </div>
    </div>
  );
}

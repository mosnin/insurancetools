"use client";

/**
 * Pet insurance value calculator.
 *
 * Models the reimbursement structure most pet insurance policies actually
 * use: an annual deductible, then a reimbursement percentage of whatever
 * vet bill remains, with no out-of-pocket maximum (the biggest structural
 * difference from human health insurance). Every vet-spending figure is
 * supplied by the user for a scenario they pick; this tool does not assume
 * or fabricate a "typical" vet bill, since costs vary enormously by species,
 * breed, region, and procedure.
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

type Scenario = "routine" | "illness" | "surgery";

const SCENARIO_LABEL: Record<Scenario, string> = {
  routine: "Routine care only",
  illness: "One unexpected illness",
  surgery: "A major surgery or emergency",
};

interface DollarFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function DollarField({ label, hint, value, onChange, max = 100_000, step = 1 }: DollarFieldProps) {
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

export function PetInsuranceValueCalculatorTool() {
  const [petAge, setPetAge] = useState(3);
  const [monthlyPremium, setMonthlyPremium] = useState(45);
  const [annualDeductible, setAnnualDeductible] = useState(250);
  const [reimbursementPct, setReimbursementPct] = useState(80);
  const [scenario, setScenario] = useState<Scenario>("illness");
  const [vetSpend, setVetSpend] = useState(1500);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const annualPremium = monthlyPremium * 12;
    const afterDeductible = Math.max(0, vetSpend - annualDeductible);
    const reimbursed = afterDeductible * (reimbursementPct / 100);
    const ownerPaid = vetSpend - reimbursed;
    const netVsNoInsurance = reimbursed - annualPremium;
    const totalOutlayWithInsurance = annualPremium + ownerPaid;
    const worthIt = netVsNoInsurance > 0;

    return {
      annualPremium,
      afterDeductible,
      reimbursed,
      ownerPaid,
      netVsNoInsurance,
      totalOutlayWithInsurance,
      worthIt,
    };
  }, [monthlyPremium, annualDeductible, reimbursementPct, vetSpend]);

  async function copyResult() {
    const lines = [
      "Pet insurance value calculator result",
      `Pet age: ${petAge} years, scenario: ${SCENARIO_LABEL[scenario]}`,
      `Estimated annual vet spend entered: ${USD.format(vetSpend)}`,
      `Annual premium: ${USD.format(result.annualPremium)} (${USD.format(monthlyPremium)}/month)`,
      `After ${USD.format(annualDeductible)} deductible and ${reimbursementPct}% reimbursement: ${USD.format(result.reimbursed)} paid by the policy`,
      `You'd pay ${USD.format(result.ownerPaid)} of the vet bill yourself, plus ${USD.format(result.annualPremium)} in premium`,
      result.worthIt
        ? `Net benefit vs. no insurance in this scenario: ${USD.format(result.netVsNoInsurance)}`
        : `Net cost vs. no insurance in this scenario: ${USD.format(Math.abs(result.netVsNoInsurance))}`,
      "Estimate only, based on the scenario and figures you entered, not a quote or guarantee. insurancetools.org/tools/pet/pet-insurance-value-calculator",
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
        <span className="label-mono text-slate-500">PET INSURANCE VALUE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <label className="block">
            <span className="block text-[13px] font-medium text-slate-600">Pet&apos;s current age (years)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={30}
              step={1}
              value={petAge}
              onChange={(e) => {
                const raw = Number(e.target.value);
                const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 30) : 0;
                setPetAge(clamped);
              }}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="mt-1 block text-xs text-slate-400">
              Used only to note how age typically affects premiums, not in the math below
            </span>
          </label>

          <DollarField
            label="Monthly premium quote"
            hint="The exact quote you received or are comparing"
            value={monthlyPremium}
            onChange={setMonthlyPremium}
            max={500}
          />
          <DollarField
            label="Annual deductible"
            hint="Amount you pay before reimbursement starts"
            value={annualDeductible}
            onChange={setAnnualDeductible}
            max={5_000}
          />

          <label className="block">
            <span className="block text-[13px] font-medium text-slate-600">Reimbursement percentage</span>
            <span className="relative mt-1.5 block">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={100}
                step={5}
                value={reimbursementPct}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 100) : 0;
                  setReimbursementPct(clamped);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                %
              </span>
            </span>
            <span className="mt-1 block text-xs text-slate-400">
              Applied to the vet bill after the deductible is met, not the full bill
            </span>
          </label>

          <div className="border-t border-hairline pt-4">
            <span className="block text-[13px] font-medium text-slate-600">Scenario you&apos;re estimating</span>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(Object.keys(SCENARIO_LABEL) as Scenario[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    scenario === key
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {SCENARIO_LABEL[key]}
                </button>
              ))}
            </div>
          </div>

          <DollarField
            label="Your estimated vet bill for that scenario"
            hint="Get this from your own vet, a quote, or your own records — costs vary hugely by species, breed, region, and procedure, so this tool never guesses it for you"
            value={vetSpend}
            onChange={setVetSpend}
            max={50_000}
            step={50}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">
              {result.worthIt ? "NET BENEFIT IN THIS SCENARIO" : "NET COST IN THIS SCENARIO"}
            </p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.worthIt ? "text-slate-900" : "text-amber-600"
              }`}
            >
              {USD.format(Math.abs(result.netVsNoInsurance))}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.worthIt
                ? `Insurance paid out more than the premium cost, in the ${SCENARIO_LABEL[scenario].toLowerCase()} scenario you entered.`
                : `The premium cost more than insurance paid out, in the ${SCENARIO_LABEL[scenario].toLowerCase()} scenario you entered.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Annual premium" value={USD.format(result.annualPremium)} />
            <Figure label="Reimbursed by policy" value={USD.format(result.reimbursed)} tone="accent" />
            <Figure label="You pay of the vet bill" value={USD.format(result.ownerPaid)} />
            <Figure
              label="Total out of pocket"
              value={USD.format(result.totalOutlayWithInsurance)}
              tone={result.totalOutlayWithInsurance > vetSpend ? "warn" : "default"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">How this scenario breaks down</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Of your {USD.format(vetSpend)} vet bill, the first {USD.format(Math.min(annualDeductible, vetSpend))}{" "}
                is your deductible. The policy then reimburses {reimbursementPct}% of the remaining{" "}
                {USD.format(result.afterDeductible)}, which is {USD.format(result.reimbursed)}. You cover the rest
                of the bill, {USD.format(result.ownerPaid)}, plus the {USD.format(result.annualPremium)} annual
                premium regardless of whether you filed a claim.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">No out-of-pocket maximum</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Unlike most human health plans, typical pet insurance policies don&apos;t cap your annual
                out-of-pocket cost once a deductible and reimbursement percentage are applied — the{" "}
                {reimbursementPct}% split above continues no matter how large the bill gets. Re-run this
                scenario at a higher vet bill to see how the gap grows.
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
        Estimate only, built entirely from the numbers you enter. This tool does not know your pet&apos;s actual
        premium at renewal, does not assume a &ldquo;typical&rdquo; vet bill on your behalf, and does not model
        pre-existing condition exclusions, waiting periods, or annual coverage caps some policies apply. Confirm
        exact terms with the insurer&apos;s policy documents or a licensed agent before buying or renewing.
      </div>
    </div>
  );
}

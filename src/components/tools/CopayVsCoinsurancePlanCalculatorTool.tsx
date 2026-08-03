"use client";

/**
 * Copay vs. coinsurance plan calculator.
 *
 * Compares two whole plan structures for the same expected year of care
 * rather than comparing a single office visit:
 *
 * - Plan A (copay-structured): the user enters how many primary care visits,
 *   specialist visits, ER visits, and prescription fills they expect in a
 *   year, each with its own flat copay dollar amount. Those get summed.
 * - Plan B (coinsurance-structured): the user enters a deductible, a
 *   coinsurance percentage, and one expected total annual billed amount for
 *   that same care. Cost runs through the standard deductible-then-
 *   coinsurance waterfall: the deductible is paid in full first, then the
 *   coinsurance percentage applies to whatever billed amount remains.
 *
 * Each plan's monthly premium x 12 is added on top to make the two annual
 * totals directly comparable. Every dollar amount and every visit count is
 * something the user typed in; nothing here is a published average or a
 * claim about what a "typical" plan charges.
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

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CurrencyField({ label, hint, value, onChange, max = 200_000 }: CurrencyFieldProps) {
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
          step={10}
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

interface CountFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function CountField({ label, hint, value, onChange, max = 365 }: CountFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        step={1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const raw = Number(e.target.value);
          const clamped = Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), max) : 0;
          onChange(clamped);
        }}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
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
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 100) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
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

export function CopayVsCoinsurancePlanCalculatorTool() {
  // Plan A — copay-structured plan
  const [premiumA, setPremiumA] = useState(380);
  const [primaryVisits, setPrimaryVisits] = useState(3);
  const [primaryCopay, setPrimaryCopay] = useState(30);
  const [specialistVisits, setSpecialistVisits] = useState(2);
  const [specialistCopay, setSpecialistCopay] = useState(50);
  const [erVisits, setErVisits] = useState(0);
  const [erCopay, setErCopay] = useState(300);
  const [rxFills, setRxFills] = useState(6);
  const [rxCopay, setRxCopay] = useState(20);

  // Plan B — coinsurance-structured plan
  const [premiumB, setPremiumB] = useState(280);
  const [deductible, setDeductible] = useState(2_000);
  const [coinsurance, setCoinsurance] = useState(20);
  const [expectedBilled, setExpectedBilled] = useState(2_600);

  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const planACareCost =
      primaryVisits * primaryCopay +
      specialistVisits * specialistCopay +
      erVisits * erCopay +
      rxFills * rxCopay;
    const planAAnnualPremium = premiumA * 12;
    const planATotal = planAAnnualPremium + planACareCost;

    const deductiblePortion = Math.min(expectedBilled, deductible);
    const remainingBilled = Math.max(0, expectedBilled - deductible);
    const coinsuranceOwed = remainingBilled * (coinsurance / 100);
    const planBCareCost = deductiblePortion + coinsuranceOwed;
    const planBAnnualPremium = premiumB * 12;
    const planBTotal = planBAnnualPremium + planBCareCost;

    const difference = Math.abs(planATotal - planBTotal);
    const cheaper: "A" | "B" | "tie" =
      planATotal < planBTotal ? "A" : planBTotal < planATotal ? "B" : "tie";

    return {
      planACareCost,
      planAAnnualPremium,
      planATotal,
      deductiblePortion,
      remainingBilled,
      coinsuranceOwed,
      planBCareCost,
      planBAnnualPremium,
      planBTotal,
      difference,
      cheaper,
    };
  }, [
    premiumA,
    primaryVisits,
    primaryCopay,
    specialistVisits,
    specialistCopay,
    erVisits,
    erCopay,
    rxFills,
    rxCopay,
    premiumB,
    deductible,
    coinsurance,
    expectedBilled,
  ]);

  async function copyResult() {
    const lines = [
      "Copay vs. coinsurance plan comparison",
      `Plan A (copay plan) — annual total: ${USD.format(result.planATotal)} (premium ${USD.format(result.planAAnnualPremium)} + copays ${USD.format(result.planACareCost)})`,
      `Plan B (coinsurance plan) — annual total: ${USD.format(result.planBTotal)} (premium ${USD.format(result.planBAnnualPremium)} + deductible/coinsurance ${USD.format(result.planBCareCost)})`,
      result.cheaper === "tie"
        ? "Based on the usage entered, both plans come out roughly the same for the year."
        : `Based on the usage entered, Plan ${result.cheaper} is cheaper by about ${USD.format(result.difference)} for the year.`,
      "This compares one described year of usage only; a year with a major illness could change which plan wins. Estimate only, not insurance advice. insurancetools.org/tools/health/copay-vs-coinsurance-plan-calculator",
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
        <span className="label-mono text-slate-500">COPAY VS. COINSURANCE PLAN CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-6 bg-white p-5 sm:p-6">
          <div className="space-y-4">
            <p className="label-mono text-blue-600">PLAN A — COPAY PLAN</p>
            <CurrencyField label="Monthly premium" value={premiumA} onChange={setPremiumA} max={5_000} />
            <div className="grid grid-cols-2 gap-3">
              <CountField
                label="Primary care visits / year"
                value={primaryVisits}
                onChange={setPrimaryVisits}
              />
              <CurrencyField label="Copay per visit" value={primaryCopay} onChange={setPrimaryCopay} max={2_000} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CountField
                label="Specialist visits / year"
                value={specialistVisits}
                onChange={setSpecialistVisits}
              />
              <CurrencyField label="Copay per visit" value={specialistCopay} onChange={setSpecialistCopay} max={2_000} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CountField label="ER visits / year" value={erVisits} onChange={setErVisits} max={50} />
              <CurrencyField label="Copay per ER visit" value={erCopay} onChange={setErCopay} max={5_000} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CountField
                label="Prescription fills / year"
                value={rxFills}
                onChange={setRxFills}
                max={365}
              />
              <CurrencyField label="Copay per fill" value={rxCopay} onChange={setRxCopay} max={2_000} />
            </div>
          </div>

          <div className="space-y-4 border-t border-hairline pt-5">
            <p className="label-mono text-blue-600">PLAN B — COINSURANCE PLAN</p>
            <CurrencyField label="Monthly premium" value={premiumB} onChange={setPremiumB} max={5_000} />
            <CurrencyField
              label="Annual deductible"
              hint="Paid in full before coinsurance starts"
              value={deductible}
              onChange={setDeductible}
              max={50_000}
            />
            <PercentField
              label="Coinsurance you pay after the deductible"
              hint="The plan pays the rest, e.g. an 80/20 plan is 20% here"
              value={coinsurance}
              onChange={setCoinsurance}
            />
            <CurrencyField
              label="Expected total billed amount for the year"
              hint="The full allowed cost of the same care, before insurance pays anything"
              value={expectedBilled}
              onChange={setExpectedBilled}
              max={500_000}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">CHEAPER FOR THE YEAR YOU DESCRIBED</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {result.cheaper === "tie" ? "Roughly a tie" : `Plan ${result.cheaper}`}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.cheaper === "tie"
                ? "Both plans land within a rounding error of each other for this usage."
                : `About ${USD.format(result.difference)} cheaper over the year, based only on the usage entered above.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Plan A total"
              value={USD.format(result.planATotal)}
              tone={result.cheaper === "A" ? "accent" : "default"}
            />
            <Figure
              label="Plan B total"
              value={USD.format(result.planBTotal)}
              tone={result.cheaper === "B" ? "accent" : "default"}
            />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Plan A breakdown</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {USD.format(result.planAAnnualPremium)} in premium (
                {USD.format(premiumA)}/month) plus {USD.format(result.planACareCost)} in copays across
                the visits and fills you entered.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Plan B breakdown</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {USD.format(result.planBAnnualPremium)} in premium (
                {USD.format(premiumB)}/month) plus {USD.format(result.deductiblePortion)} toward your
                deductible and {USD.format(result.coinsuranceOwed)} in coinsurance on the remaining{" "}
                {USD.format(result.remainingBilled)} billed.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-900">
            This result reflects only the year of usage you described above. A single major illness,
            surgery, or hospital stay can push Plan B&apos;s billed amount far higher than what&apos;s entered
            here, which changes which plan actually costs less. Check both plans&apos; worst-case exposure
            with the out-of-pocket maximum calculator before deciding based on cost alone.
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
        Estimate only. Every dollar figure and visit count above is something you entered, not a
        published average; this tool does not know your plan&apos;s actual contract, network status, or
        whether your care would be billed at the amounts you assumed. It also does not model an
        out-of-pocket maximum, so it will not automatically cap Plan B&apos;s cost the way a real policy
        would in a severe year. Confirm the exact copay, deductible, and coinsurance terms on your
        plan&apos;s summary of benefits before enrolling, and involve a licensed insurance agent or your
        HR benefits contact for anything you&apos;re unsure about.
      </div>
    </div>
  );
}

"use client";

/**
 * Cyber insurance coverage calculator.
 *
 * This tool deliberately does not embed a per-record breach cost figure.
 * Published breach-cost research (e.g. IBM's annual Cost of a Data Breach
 * Report, or the Verizon Data Breach Investigations Report) updates every
 * year and varies enormously by industry, record type, and breach size, so
 * baking in a single number here would go stale within months and could
 * understate or overstate a real business's exposure. Instead the user
 * supplies their own researched cost-per-record assumption, and the tool
 * does the sizing arithmetic: records held x assumed cost per record for a
 * breach-response exposure figure, plus an optional business-interruption
 * exposure (days without normal operations x daily revenue at risk) for a
 * fuller picture. The output is explicitly framed as a sizing exercise
 * built on the user's own assumptions, not a prediction of what a breach
 * would actually cost this business.
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

const USD_PRECISE = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface CountFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

function CountField({ label, hint, value, onChange, max = 50_000_000, step = 1 }: CountFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
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
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface CurrencyFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
  precise?: boolean;
}

function CurrencyField({ label, hint, value, onChange, max = 100_000_000, step = 1, precise = false }: CurrencyFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">{label}</span>
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          step={precise ? 0.01 : step}
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

export function CyberInsuranceCoverageCalculatorTool() {
  const [records, setRecords] = useState(25_000);
  const [costPerRecord, setCostPerRecord] = useState(0);
  const [interruptionDays, setInterruptionDays] = useState(5);
  const [dailyRevenueLoss, setDailyRevenueLoss] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasCostInput = costPerRecord > 0;
    const hasRecords = records > 0;
    const breachResponseExposure = records * costPerRecord;

    const hasInterruptionInputs = interruptionDays > 0 && dailyRevenueLoss > 0;
    const interruptionExposure = interruptionDays * dailyRevenueLoss;

    const totalSuggestedCoverage = breachResponseExposure + interruptionExposure;

    const breachShare =
      totalSuggestedCoverage > 0 ? Math.round((breachResponseExposure / totalSuggestedCoverage) * 100) : 0;
    const interruptionShare = totalSuggestedCoverage > 0 ? 100 - breachShare : 0;

    return {
      hasCostInput,
      hasRecords,
      breachResponseExposure,
      hasInterruptionInputs,
      interruptionExposure,
      totalSuggestedCoverage,
      breachShare,
      interruptionShare,
    };
  }, [records, costPerRecord, interruptionDays, dailyRevenueLoss]);

  async function copyResult() {
    const lines = [
      "Cyber insurance coverage sizing estimate",
      `Records held: ${records.toLocaleString("en-US")}`,
      `Assumed cost per record: ${USD_PRECISE.format(costPerRecord)} (user-supplied research figure)`,
      `Breach-response exposure: ${USD.format(result.breachResponseExposure)}`,
      result.hasInterruptionInputs
        ? `Business-interruption exposure: ${USD.format(result.interruptionExposure)} (${interruptionDays} days x ${USD.format(dailyRevenueLoss)}/day)`
        : "Business-interruption exposure: not entered",
      `Total suggested coverage to discuss with an agent: ${USD.format(result.totalSuggestedCoverage)}`,
      "This is a sizing exercise built on your own assumptions, not a prediction of breach costs or a quote.",
      "insurancetools.org/tools/business/cyber-insurance-coverage-calculator",
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
        <span className="label-mono text-slate-500">CYBER INSURANCE COVERAGE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <CountField
            label="Customer or client records held"
            hint="Records containing names, SSNs, health, or payment data (PII/PHI)"
            value={records}
            onChange={setRecords}
          />
          <CurrencyField
            label="Assumed cost per record"
            hint="Research your own figure — see the methodology below for where to look"
            value={costPerRecord}
            onChange={setCostPerRecord}
            precise
            max={2000}
          />
          <div className="border-t border-hairline pt-4">
            <p className="mb-3 text-xs font-semibold text-slate-700">Optional: business interruption</p>
            <div className="space-y-4">
              <CountField
                label="Days of disrupted operations"
                hint="How long systems might realistically be down after an incident"
                value={interruptionDays}
                onChange={setInterruptionDays}
                max={365}
              />
              <CurrencyField
                label="Revenue at risk per day"
                hint="Average daily revenue you couldn't process during an outage"
                value={dailyRevenueLoss}
                onChange={setDailyRevenueLoss}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">TOTAL SUGGESTED COVERAGE TO DISCUSS</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.totalSuggestedCoverage)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              A sizing estimate built entirely on the numbers you entered, not a prediction of what a
              breach would cost or a quote.
            </p>
          </div>

          {!result.hasCostInput && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Enter an assumed cost per record to see a breach-response exposure figure. This calculator
              will not guess one for you — look up a current estimate from a source like IBM&apos;s annual
              Cost of a Data Breach Report or the Verizon Data Breach Investigations Report first.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Breach-response exposure" value={USD.format(result.breachResponseExposure)} />
            <Figure
              label="Interruption exposure"
              value={result.hasInterruptionInputs ? USD.format(result.interruptionExposure) : "Not entered"}
              tone="accent"
            />
          </div>

          {result.totalSuggestedCoverage > 0 && (
            <div className="space-y-1.5 border-t border-hairline pt-4">
              <p className="text-xs font-semibold text-slate-700">How the total splits</p>
              <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full bg-blue-600" style={{ width: `${result.breachShare}%` }} />
                <span className="block h-full bg-blue-300" style={{ width: `${result.interruptionShare}%` }} />
              </div>
              <p className="text-xs text-slate-500">
                {result.breachShare}% breach response, {result.interruptionShare}% business interruption
              </p>
            </div>
          )}

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">What breach-response exposure covers</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasRecords
                  ? `Sized off ${records.toLocaleString("en-US")} records at ${USD_PRECISE.format(costPerRecord)} each. This range of costs typically bundles forensic investigation, legal counsel, mandatory notification letters, and a period of credit or identity monitoring for affected individuals.`
                  : "Enter how many records your business holds to size this figure."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">What interruption exposure covers</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasInterruptionInputs
                  ? `Sized off ${interruptionDays} day${interruptionDays === 1 ? "" : "s"} of disrupted operations at ${USD.format(dailyRevenueLoss)}/day of revenue at risk. This estimates lost income while systems are down, separate from the breach-response costs above.`
                  : "Enter both interruption days and revenue at risk per day to size this figure. Skip it entirely if your business could keep operating with minimal disruption during an incident."}
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
        Sizing exercise only, not a data breach cost prediction or an insurance quote. The cost-per-record
        figure is entirely user-supplied; this tool does not know your industry, your actual security
        posture, your state&apos;s specific breach-notification law, or an insurer&apos;s underwriting rules.
        Confirm coverage limits, sub-limits, and exclusions with a licensed insurance agent before buying
        or changing a policy.
      </div>
    </div>
  );
}

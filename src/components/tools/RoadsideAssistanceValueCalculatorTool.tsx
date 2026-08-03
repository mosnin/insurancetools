"use client";

/**
 * Roadside assistance value calculator.
 *
 * Roadside assistance is sold three different ways — as a small add-on
 * line on an auto policy, as a standalone membership (the AAA-style
 * model), or not at all, leaving you to pay a tow truck or locksmith out
 * of pocket when something happens. Which of those three is actually
 * cheapest depends entirely on two numbers only the user knows: what a
 * real incident costs near them, and how often they realistically expect
 * to need help. This tool does not assume a national average tow price —
 * it asks for the user's own estimate and compares the three payment
 * structures against each other using that number.
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

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  prefix?: string;
}

function NumberField({ label, hint, value, onChange, max = 10_000, prefix = "$" }: NumberFieldProps) {
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
          min={0}
          max={max}
          step={prefix ? 5 : 1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${
            prefix ? "pl-7" : "pl-3"
          } pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface OptionRowProps {
  label: string;
  sublabel: string;
  amount: number;
  cheapest: boolean;
  applicable: boolean;
}

function OptionRow({ label, sublabel, amount, cheapest, applicable }: OptionRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 ${
        cheapest ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
      } ${!applicable ? "opacity-50" : ""}`}
    >
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${cheapest ? "text-blue-800" : "text-slate-800"}`}>
          {label}
          {cheapest && applicable && (
            <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Cheapest for you
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>
      </div>
      <p className={`shrink-0 text-lg font-semibold tabular-nums ${cheapest ? "text-blue-700" : "text-slate-900"}`}>
        {applicable ? USD.format(amount) : "—"}
      </p>
    </div>
  );
}

export function RoadsideAssistanceValueCalculatorTool() {
  const [addonCost, setAddonCost] = useState(30);
  const [perIncidentCost, setPerIncidentCost] = useState(125);
  const [incidentsPerYear, setIncidentsPerYear] = useState(1);
  const [membershipCost, setMembershipCost] = useState(65);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasMembership = membershipCost > 0;
    const hasPerIncident = perIncidentCost > 0;

    const payPerIncidentAnnualCost = perIncidentCost * incidentsPerYear;

    const options = [
      {
        key: "addon" as const,
        label: "Policy add-on",
        sublabel: "Added to your auto insurance policy",
        amount: addonCost,
        applicable: true,
      },
      {
        key: "membership" as const,
        label: "Standalone membership",
        sublabel: "e.g. an auto club style membership, billed separately",
        amount: membershipCost,
        applicable: hasMembership,
      },
      {
        key: "payPerIncident" as const,
        label: "Pay out of pocket per incident",
        sublabel: `${incidentsPerYear} incident${incidentsPerYear === 1 ? "" : "s"}/year x ${USD.format(perIncidentCost)}`,
        amount: payPerIncidentAnnualCost,
        applicable: hasPerIncident,
      },
    ];

    const applicableOptions = options.filter((o) => o.applicable);
    const cheapest =
      applicableOptions.length > 0
        ? applicableOptions.reduce((min, o) => (o.amount < min.amount ? o : min))
        : null;
    const priciestApplicable =
      applicableOptions.length > 1
        ? applicableOptions.reduce((max, o) => (o.amount > max.amount ? o : max))
        : null;
    const annualSavings =
      cheapest && priciestApplicable && priciestApplicable.key !== cheapest.key
        ? priciestApplicable.amount - cheapest.amount
        : 0;

    // Breakeven: how many incidents/year would it take for the add-on to
    // cost the same as paying out of pocket, given the entered per-incident
    // cost. Below this number, paying per incident is cheaper; above it,
    // the add-on is cheaper.
    const addonBreakevenIncidents = hasPerIncident ? addonCost / perIncidentCost : null;
    const membershipBreakevenIncidents =
      hasPerIncident && hasMembership ? membershipCost / perIncidentCost : null;

    return {
      options,
      cheapest,
      annualSavings,
      payPerIncidentAnnualCost,
      addonBreakevenIncidents,
      membershipBreakevenIncidents,
      hasMembership,
      hasPerIncident,
    };
  }, [addonCost, perIncidentCost, incidentsPerYear, membershipCost]);

  async function copyResult() {
    const lines = [
      "Roadside assistance value comparison (based on your numbers)",
      `Policy add-on: ${USD.format(addonCost)}/year`,
      result.hasMembership ? `Standalone membership: ${USD.format(membershipCost)}/year` : "Standalone membership: not entered",
      result.hasPerIncident
        ? `Pay per incident: ${USD.format(result.payPerIncidentAnnualCost)}/year (${incidentsPerYear} incident${incidentsPerYear === 1 ? "" : "s"} x ${USD.format(perIncidentCost)})`
        : "Pay per incident: enter a per-incident cost to compare",
      result.cheapest
        ? `Cheapest option for these numbers: ${result.cheapest.label} at ${USD.format(result.cheapest.amount)}/year`
        : "Enter at least one cost to compare",
      result.addonBreakevenIncidents !== null
        ? `Breakeven: the add-on pays for itself at ${result.addonBreakevenIncidents.toFixed(2)} incidents/year at your entered per-incident cost`
        : "",
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/auto/roadside-assistance-value-calculator",
    ].filter(Boolean);
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
        <span className="label-mono text-slate-500">ROADSIDE ASSISTANCE VALUE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Annual cost of the policy add-on"
            hint="What your insurer charges per year to add roadside assistance"
            value={addonCost}
            onChange={setAddonCost}
            max={500}
          />
          <NumberField
            label="Standalone membership cost (optional)"
            hint="An auto club style membership billed on its own, if you're considering one"
            value={membershipCost}
            onChange={setMembershipCost}
            max={500}
          />
          <NumberField
            label="What you'd pay out of pocket per incident"
            hint="Look up a local tow, lockout, or jump-start price — this varies a lot by area, so don't guess a national average"
            value={perIncidentCost}
            onChange={setPerIncidentCost}
            max={1000}
          />
          <NumberField
            label="Incidents you expect per year"
            hint="Tows, lockouts, jump starts, or flats combined — most drivers estimate 0 to 2"
            value={incidentsPerYear}
            onChange={setIncidentsPerYear}
            max={20}
            prefix=""
          />
        </div>

        {/* Results */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">BASED ON YOUR NUMBERS</p>
            <p className="mt-1.5 text-lg font-semibold text-slate-900">
              {result.cheapest ? `${result.cheapest.label} looks cheapest` : "Enter your costs to compare"}
            </p>
            {result.cheapest && result.annualSavings > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                About {USD.format(result.annualSavings)}/year less than the priciest option below, at the
                usage rate you entered.
              </p>
            )}
          </div>

          <div className="space-y-2">
            {result.options.map((o) => (
              <OptionRow
                key={o.key}
                label={o.label}
                sublabel={o.sublabel}
                amount={o.amount}
                applicable={o.applicable}
                cheapest={result.cheapest?.key === o.key}
              />
            ))}
          </div>

          {result.addonBreakevenIncidents !== null && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
              At {USD.format(perIncidentCost)} per incident, the policy add-on breaks even at{" "}
              <span className="font-semibold text-slate-900">
                {result.addonBreakevenIncidents.toFixed(2)} incidents/year
              </span>
              . Expect fewer than that and paying per incident is cheaper on paper; expect more and the
              add-on wins.
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
        Estimate only. This tool compares the three options using the exact numbers you enter; it does not
        know your insurer&apos;s actual add-on price, a membership provider&apos;s actual dues, or what towing
        costs in your area, and it does not account for extras some plans bundle in, like trip interruption
        reimbursement or a higher covered towing distance. Confirm exact pricing and coverage details with
        your insurer or the membership provider before deciding. This is not insurance advice.
      </div>
    </div>
  );
}

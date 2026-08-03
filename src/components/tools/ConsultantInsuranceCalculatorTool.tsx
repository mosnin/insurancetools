"use client";

/**
 * Consultant insurance calculator.
 *
 * Independent consultants and advisors don't have one insurance question,
 * they have three: how much errors & omissions coverage is defensible given
 * what a single mistake could cost a client, whether general liability is
 * needed on top of that, and whether handling client data pulls cyber
 * coverage into the picture too. A single dollar figure would flatten that
 * down to something misleading, so this tool outputs a short coverage
 * checklist instead of one number.
 *
 * The E&O sizing shortcut multiplies the average engagement value by the
 * number of concurrent clients to approximate the consultant's realistic
 * exposure if more than one relationship went wrong around the same time,
 * then rounds up to the nearest standard limit tier insurers actually sell.
 * General liability and cyber flags are driven by two yes/no questions about
 * how the consultant actually works, not by revenue.
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

const EO_TIERS = [500_000, 1_000_000, 2_000_000, 5_000_000];

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  prefix?: string;
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 5_000_000, prefix = "$", step = 500 }: NumberFieldProps) {
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
          step={step}
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

interface ToggleFieldProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleField({ label, hint, checked, onChange }: ToggleFieldProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-3 transition-colors hover:border-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      <span>
        <span className="block text-[13px] font-medium text-slate-700">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
      </span>
    </label>
  );
}

interface ChecklistItem {
  name: string;
  status: "recommended" | "consider" | "not-flagged";
  detail: string;
}

function StatusBadge({ status }: { status: ChecklistItem["status"] }) {
  const styles =
    status === "recommended"
      ? "bg-blue-50 text-blue-700 border-blue-100"
      : status === "consider"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-slate-50 text-slate-500 border-slate-100";
  const text = status === "recommended" ? "Recommended" : status === "consider" ? "Worth reviewing" : "Not flagged";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles}`}>
      {text}
    </span>
  );
}

export function ConsultantInsuranceCalculatorTool() {
  const [avgEngagementValue, setAvgEngagementValue] = useState(15_000);
  const [concurrentClients, setConcurrentClients] = useState(5);
  const [meetsClientsInPerson, setMeetsClientsInPerson] = useState(false);
  const [handlesClientData, setHandlesClientData] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const exposure = avgEngagementValue * concurrentClients;
    const recommendedEO = EO_TIERS.find((tier) => tier >= exposure) ?? EO_TIERS[EO_TIERS.length - 1];
    const exceedsTopTier = exposure > EO_TIERS[EO_TIERS.length - 1];

    const checklist: ChecklistItem[] = [
      {
        name: "Professional liability (errors & omissions)",
        status: "recommended",
        detail: exceedsTopTier
          ? `Your rough exposure (${USD.format(exposure)}) is above the top standard tier this shortcut checks. Ask a broker about an excess or umbrella E&O layer on top of a ${USD.format(recommendedEO)} primary limit.`
          : `Sized from your average engagement value times your concurrent client count, rounded up to a standard limit insurers actually sell: ${USD.format(recommendedEO)}.`,
      },
      {
        name: "General liability",
        status: meetsClientsInPerson ? "recommended" : "not-flagged",
        detail: meetsClientsInPerson
          ? "You meet clients in person or work at their location, which is the classic trigger for a slip, fall, or property damage claim that E&O does not cover."
          : "Not flagged because you indicated you don't meet clients in person or work on their premises. Revisit this if that changes, e.g. an on-site engagement or a client office visit.",
      },
      {
        name: "Cyber / data breach coverage",
        status: handlesClientData ? "recommended" : "not-flagged",
        detail: handlesClientData
          ? "You indicated you handle client confidential data. A breach of that data is typically a cyber liability claim, not an E&O claim, even if the underlying engagement was advisory work."
          : "Not flagged because you indicated you don't handle client confidential data. If that changes, cyber coverage is worth adding even without new liability limits.",
      },
      {
        name: "Business owner's policy (GL + property bundle)",
        status: meetsClientsInPerson ? "consider" : "not-flagged",
        detail: meetsClientsInPerson
          ? "Consultants who see clients in person or rent office space often bundle general liability with property coverage into a BOP, which is frequently cheaper than buying each policy separately."
          : "Usually only relevant once you lease office space or meet clients in person regularly.",
      },
    ];

    return { exposure, recommendedEO, exceedsTopTier, checklist };
  }, [avgEngagementValue, concurrentClients, meetsClientsInPerson, handlesClientData]);

  async function copyResult() {
    const lines = [
      "Consultant insurance coverage checklist",
      `Rough exposure (avg engagement value x concurrent clients): ${USD.format(result.exposure)}`,
      `Suggested E&O limit tier: ${USD.format(result.recommendedEO)}${result.exceedsTopTier ? " (plus excess/umbrella E&O — exposure exceeds standard tiers)" : ""}`,
      ...result.checklist.map(
        (item) => `${item.name}: ${item.status === "recommended" ? "Recommended" : item.status === "consider" ? "Worth reviewing" : "Not flagged"}`
      ),
      "Estimate only, not a quote or insurance advice. insurancetools.org/tools/business/consultant-insurance-calculator",
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
        <span className="label-mono text-slate-500">CONSULTANT INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Average engagement value"
            hint="Typical total revenue per client or project"
            value={avgEngagementValue}
            onChange={setAvgEngagementValue}
          />
          <NumberField
            label="Concurrent clients"
            hint="Roughly how many active clients you work with at once"
            value={concurrentClients}
            onChange={(v) => setConcurrentClients(Math.round(v))}
            prefix=""
            step={1}
            max={200}
          />
          <div className="space-y-3 pt-1">
            <ToggleField
              label="I meet clients in person or work at their location"
              hint="On-site visits, client offices, coworking spaces, workshops"
              checked={meetsClientsInPerson}
              onChange={setMeetsClientsInPerson}
            />
            <ToggleField
              label="I handle client financial, health, or other confidential data"
              hint="Client records, financials, personal data, or proprietary files"
              checked={handlesClientData}
              onChange={setHandlesClientData}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED E&amp;O LIMIT</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.recommendedEO)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Based on a rough exposure of {USD.format(result.exposure)} ({USD.format(avgEngagementValue)} average
              engagement &times; {concurrentClients} concurrent client{concurrentClients === 1 ? "" : "s"})
            </p>
          </div>

          {result.exceedsTopTier && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              Your rough exposure is above the highest standard E&amp;O tier this shortcut checks. Ask a broker
              about an excess or umbrella E&amp;O layer stacked on top of a {USD.format(result.recommendedEO)}{" "}
              primary policy.
            </div>
          )}

          <div className="space-y-2.5 border-t border-hairline pt-4">
            <p className="label-mono text-slate-400">COVERAGE CHECKLIST</p>
            {result.checklist.map((item) => (
              <div key={item.name} className="rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.detail}</p>
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
        Estimate only. This tool applies a common exposure-based shortcut (average engagement value times
        concurrent clients) to suggest an E&amp;O limit tier, and flags general liability and cyber coverage
        based on how you say you work. It does not know your actual contracts, client-required minimums, state
        rules, or an insurer&apos;s underwriting criteria. Many client contracts specify a minimum E&amp;O limit
        directly, check yours before buying. Confirm final limits and pricing with a licensed insurance agent
        or broker.
      </div>
    </div>
  );
}

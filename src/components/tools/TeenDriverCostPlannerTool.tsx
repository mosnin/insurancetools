"use client";

/**
 * Teen driver insurance cost planner.
 *
 * Deliberately does not guess a national average surcharge for adding a
 * teen driver. That number swings enormously by state, insurer, the teen's
 * grades, the vehicle they'll drive, and the household's own claims
 * history, so publishing a single "expect a 90% increase"-style figure
 * would be inventing a statistic the site cannot stand behind. Instead this
 * tool takes the surcharge and discount percentages straight from the
 * user's own quote or renewal notice and does the arithmetic live: net
 * added cost = current premium x (surcharge % - good student discount % -
 * telematics discount %) / 100.
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

const USD_SIGNED = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "always",
});

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

function NumberField({ label, hint, value, onChange, max = 100_000 }: NumberFieldProps) {
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
          step={50}
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
          inputMode="decimal"
          min={0}
          max={300}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 300) : 0;
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

const DISCOUNT_CHECKLIST = [
  {
    title: "Good student discount",
    detail:
      "Most insurers offer a discount for a B average or better, but the required GPA, required proof, and discount size all vary by company.",
  },
  {
    title: "Driver's education / defensive driving completion",
    detail:
      "Completing a state-approved driver's ed or defensive driving course can qualify for a discount separate from the good student discount.",
  },
  {
    title: "Telematics or usage-based programs",
    detail:
      "App- or device-based monitoring programs can lower the surcharge for a demonstrably cautious teen driver, though some can also raise it for risky driving patterns.",
  },
  {
    title: "Staying on the parent's policy vs. a separate policy",
    detail:
      "A teen is usually far more expensive to insure on their own separate policy than as an added driver on an established household policy. Ask an agent to quote both ways.",
  },
  {
    title: "Multi-car bundling",
    detail:
      "If the household has more than one vehicle, ask whether adding the teen as a driver on the lowest-value car, rather than the household's most expensive one, changes the quote.",
  },
];

export function TeenDriverCostPlannerTool() {
  const [currentPremium, setCurrentPremium] = useState(2_200);
  const [surchargePct, setSurchargePct] = useState(0);
  const [goodStudentDiscountPct, setGoodStudentDiscountPct] = useState(0);
  const [telematicsDiscountPct, setTelematicsDiscountPct] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const netPct = surchargePct - goodStudentDiscountPct - telematicsDiscountPct;
    const netAddedCost = (currentPremium * netPct) / 100;
    const newAnnualPremium = currentPremium + netAddedCost;
    const monthlyAdded = netAddedCost / 12;
    const hasPremium = currentPremium > 0;
    const hasSurcharge = surchargePct > 0;
    const discountsExceedSurcharge = hasSurcharge && netPct < 0;

    return {
      netPct,
      netAddedCost,
      newAnnualPremium,
      monthlyAdded,
      hasPremium,
      hasSurcharge,
      discountsExceedSurcharge,
    };
  }, [currentPremium, surchargePct, goodStudentDiscountPct, telematicsDiscountPct]);

  async function copyResult() {
    const lines = [
      "Teen driver insurance cost plan",
      `Current annual premium: ${USD.format(currentPremium)}`,
      `Insurer-quoted surcharge for adding teen: ${surchargePct}%`,
      `Good student discount: ${goodStudentDiscountPct}%  |  Telematics/usage-based discount: ${telematicsDiscountPct}%`,
      `Net change: ${result.netPct >= 0 ? "+" : ""}${result.netPct.toFixed(1)}%`,
      `Estimated added annual cost: ${USD_SIGNED.format(result.netAddedCost)} (${USD_SIGNED.format(result.monthlyAdded)}/mo)`,
      `New estimated annual premium: ${USD.format(result.newAnnualPremium)}`,
      "Based on percentages you entered from your own quote, not a published national average. Confirm with a licensed agent. insurancetools.org/tools/auto/teen-driver-cost-planner",
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
        <span className="label-mono text-slate-500">TEEN DRIVER INSURANCE COST PLANNER</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Current annual premium"
            hint="Your policy's premium today, before adding your teen"
            value={currentPremium}
            onChange={setCurrentPremium}
          />
          <PercentField
            label="Insurer-quoted surcharge for adding your teen"
            hint="From your own quote or renewal notice — leave at 0% until you have a real number, since this varies too much by state and insurer to estimate"
            value={surchargePct}
            onChange={setSurchargePct}
          />
          <PercentField
            label="Good student discount (if quoted)"
            hint="Enter the percentage your insurer quoted, not an assumed amount"
            value={goodStudentDiscountPct}
            onChange={setGoodStudentDiscountPct}
          />
          <PercentField
            label="Telematics / usage-based program discount (if quoted)"
            hint="Programs like a monitored driving app or plug-in device"
            value={telematicsDiscountPct}
            onChange={setTelematicsDiscountPct}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">ESTIMATED ADDED ANNUAL COST</p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.netAddedCost < 0 ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              {result.hasPremium ? USD_SIGNED.format(result.netAddedCost) : USD.format(0)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasPremium
                ? `${USD_SIGNED.format(result.monthlyAdded)} per month, based on a net change of ${result.netPct >= 0 ? "+" : ""}${result.netPct.toFixed(1)}%`
                : "Enter your current annual premium to see a dollar figure."}
            </p>
          </div>

          {result.discountsExceedSurcharge && (
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
              The discounts you entered add up to more than the surcharge itself. That&apos;s an unusual
              combination — double-check the percentages against your actual quote before relying on this
              number, since it&apos;s more common for discounts to reduce a surcharge than fully cancel it.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="New estimated premium" value={USD.format(result.newAnnualPremium)} tone="accent" />
            <Figure
              label="Net rate change"
              value={`${result.netPct >= 0 ? "+" : ""}${result.netPct.toFixed(1)}%`}
            />
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="text-xs font-semibold text-slate-700">
              Discount categories worth asking your agent about
            </p>
            <ul className="mt-2 space-y-2.5">
              {DISCOUNT_CHECKLIST.map((item) => (
                <li key={item.title} className="text-xs leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-700">{item.title}.</span> {item.detail}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-slate-400">
              These are categories to ask about, not guaranteed savings amounts or a promise that any
              apply to your policy.
            </p>
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
        Estimate only. This tool does not know, and does not assume, what your insurer will actually
        charge for adding a teen driver — that figure depends on your state, your insurer&apos;s underwriting
        rules, your teen&apos;s driving record, the vehicle they&apos;ll drive, and your household&apos;s own claims
        history. Enter the surcharge and discount percentages from your own quote or renewal notice, and
        confirm the final number with a licensed insurance agent before you rely on it.
      </div>
    </div>
  );
}

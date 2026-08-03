"use client";

/**
 * Gap insurance calculator.
 *
 * Gap insurance only matters when a loan or lease balance can outrun a
 * vehicle's actual cash value (ACV) after a total loss. This tool doesn't
 * just check that today; it projects the balance and the ACV forward, month
 * by month, using two simplified models:
 *
 *  - ACV decays geometrically at a user-set monthly depreciation rate
 *    (default 1.5%/month, an adjustable assumption, not a published fact).
 *  - The loan/lease balance is reduced in a straight line to zero over the
 *    months remaining, which is NOT how amortization actually works (real
 *    loans pay down slower at first because early payments are mostly
 *    interest). This is a simplification clearly labeled as such.
 *
 * The gap at any month is max(0, projected balance − projected ACV). The
 * tool reports the gap today, the largest gap over the remaining term, and
 * when (if ever) the gap closes, then gives a plain-language verdict.
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

/** Dollar figure below which a projected gap is treated as noise rather
 * than a meaningful reason to buy a policy — chosen because typical gap
 * insurance add-ons cost roughly $200–$700, so a smaller exposure rarely
 * clears the cost of the coverage itself. This is a modeling threshold,
 * not a published industry figure. */
const MEANINGFUL_GAP = 500;

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  prefix?: string;
  suffix?: string;
  step?: number;
}

function NumberField({ label, hint, value, onChange, max = 500_000, prefix, suffix, step = 100 }: NumberFieldProps) {
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
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 ${prefix ? "pl-7" : "pl-3"} ${
            suffix ? "pr-14" : "pr-3"
          } text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface DepreciationSliderProps {
  value: number;
  onChange: (value: number) => void;
}

function DepreciationSlider({ value, onChange }: DepreciationSliderProps) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="block text-[13px] font-medium text-slate-600">Assumed monthly depreciation rate</span>
        <span className="text-sm font-semibold tabular-nums text-blue-600">{value.toFixed(1)}%/mo</span>
      </span>
      <input
        type="range"
        min={0.3}
        max={3}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 w-full accent-blue-600"
        aria-label="Assumed monthly depreciation rate"
      />
      <span className="mt-1 block text-xs text-slate-400">
        An adjustable assumption, not a published fact — most vehicles lose roughly 1–2% of value per month in
        the first few years, faster for new cars and slower for older ones.
      </span>
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

interface Checkpoint {
  month: number;
  label: string;
  loan: number;
  acv: number;
  gap: number;
}

export function GapInsuranceCalculatorTool() {
  const [loanBalance, setLoanBalance] = useState(24_000);
  const [vehicleValue, setVehicleValue] = useState(19_000);
  const [monthlyDepreciation, setMonthlyDepreciation] = useState(1.5);
  const [monthsRemaining, setMonthsRemaining] = useState(48);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rate = monthlyDepreciation / 100;
    const term = Math.max(0, Math.round(monthsRemaining));

    const acvAt = (month: number) => vehicleValue * Math.pow(1 - rate, month);
    const loanAt = (month: number) => {
      if (term <= 0) return 0;
      const fraction = Math.max(0, 1 - month / term);
      return loanBalance * fraction;
    };
    const gapAt = (month: number) => Math.max(0, loanAt(month) - acvAt(month));

    const currentGap = gapAt(0);

    // Full monthly series over the remaining term, used to find the peak
    // gap and the month (if any) it first closes. Capped implicitly by the
    // months-remaining input field's own max.
    let peakGap = currentGap;
    let peakMonth = 0;
    let closesAtMonth: number | null = currentGap <= 0.5 ? 0 : null;

    for (let m = 1; m <= term; m++) {
      const g = gapAt(m);
      if (g > peakGap) {
        peakGap = g;
        peakMonth = m;
      }
      if (closesAtMonth === null && g <= 0.5) {
        closesAtMonth = m;
      }
    }

    const checkpointMonths = Array.from(
      new Set([0, Math.min(6, term), Math.min(12, term), term].filter((m) => m >= 0))
    ).sort((a, b) => a - b);

    const checkpoints: Checkpoint[] = checkpointMonths.map((m) => ({
      month: m,
      label: m === 0 ? "Now" : m === term ? `Payoff (mo. ${m})` : `Month ${m}`,
      loan: loanAt(m),
      acv: acvAt(m),
      gap: gapAt(m),
    }));

    const worthIt = currentGap >= MEANINGFUL_GAP || peakGap >= MEANINGFUL_GAP;

    let trend: string;
    if (peakGap < 0.5) {
      trend = "Your loan balance doesn't outpace the vehicle's projected value at any point in this term.";
    } else if (peakMonth === 0) {
      trend = "The gap is largest today and shrinks from here as the loan pays down.";
    } else if (closesAtMonth !== null && closesAtMonth < term) {
      trend = `The gap grows for about ${peakMonth} month${peakMonth === 1 ? "" : "s"}, then closes entirely by month ${closesAtMonth}.`;
    } else {
      trend = `The gap grows for about ${peakMonth} month${peakMonth === 1 ? "" : "s"} and doesn't fully close before the loan is scheduled to pay off.`;
    }

    return {
      currentGap,
      peakGap,
      peakMonth,
      closesAtMonth,
      checkpoints,
      worthIt,
      trend,
      term,
    };
  }, [loanBalance, vehicleValue, monthlyDepreciation, monthsRemaining]);

  async function copyResult() {
    const lines = [
      "Gap insurance projection",
      `Current gap (loan balance minus vehicle value): ${USD.format(result.currentGap)}`,
      `Largest projected gap over the term: ${USD.format(result.peakGap)}${result.peakMonth > 0 ? ` (around month ${result.peakMonth})` : ""}`,
      result.closesAtMonth !== null
        ? `Gap closes by month ${result.closesAtMonth}`
        : "Gap does not fully close within the entered loan term",
      result.worthIt
        ? "Verdict: gap insurance is likely worth it"
        : "Verdict: gap insurance is probably not needed based on these numbers",
      "Checkpoints (loan balance / vehicle value / gap):",
      ...result.checkpoints.map(
        (c) => `  ${c.label}: ${USD.format(c.loan)} / ${USD.format(c.acv)} / ${USD.format(c.gap)}`
      ),
      "Estimate only, uses a simplified straight-line loan payoff and an adjustable depreciation assumption. Not a quote or payoff schedule. insurancetools.org/tools/auto/gap-insurance-calculator",
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
        <span className="label-mono text-slate-500">GAP INSURANCE CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Current loan or lease balance"
            hint="The exact payoff amount, from your lender or lease company"
            value={loanBalance}
            onChange={setLoanBalance}
            prefix="$"
          />
          <NumberField
            label="Vehicle's current actual cash value"
            hint="What it would sell for today, not what you paid or financed"
            value={vehicleValue}
            onChange={setVehicleValue}
            prefix="$"
          />
          <DepreciationSlider value={monthlyDepreciation} onChange={setMonthlyDepreciation} />
          <NumberField
            label="Months remaining on the loan or lease"
            hint="How many months until it's scheduled to pay off"
            value={monthsRemaining}
            onChange={setMonthsRemaining}
            max={96}
            step={1}
            suffix="months"
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">VERDICT</p>
            <p
              className={`mt-1.5 text-2xl font-semibold tracking-[-0.02em] ${
                result.worthIt ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {result.worthIt ? "Gap insurance likely worth it" : "Gap insurance probably not needed"}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{result.trend}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure
              label="Gap today"
              value={USD.format(result.currentGap)}
              tone={result.currentGap > 0 ? "warn" : "default"}
            />
            <Figure
              label="Peak projected gap"
              value={USD.format(result.peakGap)}
              tone={result.peakGap >= MEANINGFUL_GAP ? "warn" : "default"}
            />
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="label-mono mb-2 text-slate-400">PROJECTION CHECKPOINTS</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[380px] text-xs">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="pb-1.5 pr-2 font-medium">Checkpoint</th>
                    <th className="pb-1.5 pr-2 font-medium">Loan balance</th>
                    <th className="pb-1.5 pr-2 font-medium">Vehicle value</th>
                    <th className="pb-1.5 font-medium">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {result.checkpoints.map((c) => (
                    <tr key={c.month} className="border-t border-hairline">
                      <td className="py-1.5 pr-2 font-medium text-slate-700">{c.label}</td>
                      <td className="py-1.5 pr-2 tabular-nums text-slate-600">{USD.format(c.loan)}</td>
                      <td className="py-1.5 pr-2 tabular-nums text-slate-600">{USD.format(c.acv)}</td>
                      <td
                        className={`py-1.5 tabular-nums font-medium ${
                          c.gap > 0 ? "text-amber-600" : "text-slate-400"
                        }`}
                      >
                        {USD.format(c.gap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        Estimate only, not a payoff schedule or a quote. The loan balance is projected using a simplified
        straight-line reduction to zero over the months you enter, which is not how amortization actually
        works — real loans pay down slower at first because early payments are weighted toward interest, so
        an early payoff gap can be larger than this tool shows. The depreciation rate is an adjustable
        assumption you control, not a guaranteed rate for your specific vehicle. Confirm your exact payoff
        balance with your lender and get an exact gap insurance price from a licensed agent or your dealer
        before buying.
      </div>
    </div>
  );
}

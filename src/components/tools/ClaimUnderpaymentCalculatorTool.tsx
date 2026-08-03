"use client";

/**
 * Insurance claim underpayment calculator.
 *
 * This tool does not compute a claim value itself — it compares two numbers
 * the user already has: the insurer's settlement offer, and the user's own
 * independently-derived replacement or actual cash value estimate (ideally
 * produced with the site's insurance-claim-payout-calculator, linked from
 * the page around this component). It reports the dollar and percentage
 * gap between those two figures and translates the size of that gap into a
 * plain-language read, without ever asserting that a gap proves bad faith
 * or wrongdoing on the insurer's part.
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
}

function NumberField({ label, hint, value, onChange, max = 10_000_000 }: NumberFieldProps) {
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
          step={100}
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

type GapBand = "none" | "minor" | "moderate" | "large" | "severe";

function bandForGap(pct: number): GapBand {
  if (pct <= 0) return "none";
  if (pct < 5) return "minor";
  if (pct < 15) return "moderate";
  if (pct < 30) return "large";
  return "severe";
}

export function ClaimUnderpaymentCalculatorTool() {
  const [offerAmount, setOfferAmount] = useState(12_000);
  const [ownEstimate, setOwnEstimate] = useState(15_500);
  const [deductible, setDeductible] = useState(1_000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasOffer = offerAmount > 0;
    const hasEstimate = ownEstimate > 0;
    const netExpected = Math.max(0, ownEstimate - deductible);
    const gapAmount = netExpected - offerAmount;
    const gapPct = netExpected > 0 ? (gapAmount / netExpected) * 100 : 0;
    const band: GapBand = hasOffer && hasEstimate ? bandForGap(gapPct) : "none";
    const isUnderpaid = gapAmount > 0;
    const isOverOffer = gapAmount < 0;

    return {
      hasOffer,
      hasEstimate,
      netExpected,
      gapAmount,
      gapPct,
      band,
      isUnderpaid,
      isOverOffer,
    };
  }, [offerAmount, ownEstimate, deductible]);

  const bandCopy: Record<GapBand, { label: string; tone: string; text: string }> = {
    none: {
      label: "No meaningful gap",
      tone: "border-slate-200 bg-slate-50 text-slate-700",
      text: "The insurer's offer is at or above your own estimate after your deductible. There's nothing here that signals underpayment on its own.",
    },
    minor: {
      label: "Small gap — likely normal",
      tone: "border-slate-200 bg-slate-50 text-slate-700",
      text: "A gap this small is common and often comes down to rounding, minor differences in depreciation schedules, or small line-item disagreements. It's usually not worth escalating on its own.",
    },
    moderate: {
      label: "Worth a closer look",
      tone: "border-blue-100 bg-blue-50 text-blue-800",
      text: "This gap is large enough to ask the insurer for an itemized, written explanation of how the settlement was calculated. Compare it line by line against your own estimate before deciding whether to push back.",
    },
    large: {
      label: "Meaningful gap — investigate",
      tone: "border-amber-200 bg-amber-50 text-amber-800",
      text: "A gap this size is a signal worth investigating, not proof of anything. Request the insurer's full calculation in writing, get an independent contractor or appraisal estimate if you haven't already, and compare methodologies before drawing conclusions.",
    },
    severe: {
      label: "Large gap — consider next steps",
      tone: "border-red-200 bg-red-50 text-red-800",
      text: "A gap this large is worth taking seriously, but it still is not, by itself, evidence of bad faith. Legitimate reasons can produce large gaps too. Get the insurer's written basis for the offer, consider an independent appraisal, and consult a public adjuster or attorney if the dispute is significant.",
    },
  };

  async function copyResult() {
    const band = bandCopy[result.band];
    const lines = [
      "Insurance claim underpayment check",
      `Insurer's offer: ${USD.format(offerAmount)}`,
      `Your independent estimate after deductible: ${USD.format(result.netExpected)}`,
      result.isUnderpaid
        ? `Gap: ${USD.format(result.gapAmount)} (${result.gapPct.toFixed(1)}% below your estimate)`
        : result.isOverOffer
          ? `Gap: offer is ${USD.format(Math.abs(result.gapAmount))} above your estimate`
          : "Gap: none",
      `Read: ${band.label}`,
      "A gap does not by itself prove bad faith or wrongdoing. Estimate only, not legal or insurance advice.",
      "insurancetools.org/tools/claims/claim-underpayment-calculator",
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

  const band = bandCopy[result.band];

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="label-mono text-slate-500">CLAIM UNDERPAYMENT CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Insurer's settlement offer"
            hint="The dollar amount the insurer has offered or paid"
            value={offerAmount}
            onChange={setOfferAmount}
          />
          <NumberField
            label="Your independent estimate"
            hint="From your own research, a contractor bid, or the claim payout calculator"
            value={ownEstimate}
            onChange={setOwnEstimate}
          />
          <NumberField
            label="Your deductible"
            hint="Subtracted from your estimate before comparing, since the insurer's offer is net of it too"
            value={deductible}
            onChange={setDeductible}
          />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">GAP BETWEEN OFFER AND YOUR ESTIMATE</p>
            <p
              className={`mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] ${
                result.isUnderpaid ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {result.isUnderpaid
                ? `-${USD.format(result.gapAmount)}`
                : result.isOverOffer
                  ? `+${USD.format(Math.abs(result.gapAmount))}`
                  : USD.format(0)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.hasOffer && result.hasEstimate
                ? result.isUnderpaid
                  ? `The offer is ${Math.abs(result.gapPct).toFixed(1)}% below your net expected value of ${USD.format(result.netExpected)}.`
                  : result.isOverOffer
                    ? `The offer is ${Math.abs(result.gapPct).toFixed(1)}% above your net expected value of ${USD.format(result.netExpected)}.`
                    : "The offer matches your net expected value."
                : "Enter both an offer and your own estimate to see the gap."}
            </p>
          </div>

          <div className={`rounded-lg border px-3.5 py-3 text-xs leading-relaxed ${band.tone}`}>
            <p className="font-semibold">{band.label}</p>
            <p className="mt-1">{band.text}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Net expected value" value={USD.format(result.netExpected)} />
            <Figure
              label="Gap %"
              value={result.hasOffer && result.hasEstimate ? `${result.gapPct.toFixed(1)}%` : "—"}
              tone={result.isUnderpaid ? "warn" : "accent"}
            />
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
        Estimate only. This tool compares two numbers you provide; it does not verify either figure and
        has no access to your policy, your claim file, or the insurer&apos;s own calculation. A gap between
        an offer and your own estimate is a signal worth investigating, never proof of bad faith or legal
        wrongdoing on its own. For a real dispute, request the insurer&apos;s written settlement
        calculation, and consult a licensed public adjuster, attorney, or your state insurance regulator.
      </div>
    </div>
  );
}

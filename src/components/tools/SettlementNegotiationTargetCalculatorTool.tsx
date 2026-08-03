"use client";

/**
 * Settlement negotiation target calculator.
 *
 * Takes the two numbers a policyholder actually has mid-negotiation — their
 * own independently documented claim value (their own estimate, ideally
 * built with a professional repair estimate, contractor bid, or this site's
 * insurance-claim-payout-calculator) and the insurer's current offer — and
 * turns them into a suggested opening counter-offer RANGE.
 *
 * The "cushion" that expands the documented value into an opening counter is
 * a user-set field, defaulted to 0%. This tool does not fabricate an
 * "industry standard negotiation percentage" because no such standardized,
 * sourceable figure exists for insurance claim negotiation; instead it
 * explains general negotiation practice (opening somewhat above your true
 * target to leave room to concede) as strategy, not as insurance-specific
 * data, and leaves the exact number entirely up to the user.
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

const PCT = new Intl.NumberFormat("en-US", {
  style: "percent",
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

interface CushionFieldProps {
  value: number;
  onChange: (value: number) => void;
}

function CushionField({ value, onChange }: CushionFieldProps) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">
        Your opening cushion above documented value
      </span>
      <span className="relative mt-1.5 block">
        <input
          type="number"
          inputMode="numeric"
          min={-25}
          max={100}
          step={1}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, -25), 100) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </span>
      <span className="mt-1 block text-xs text-slate-400">
        A number you choose, not an insurance-industry standard. Defaults to 0% (open at your documented
        value) — see the article below before changing it.
      </span>
    </label>
  );
}

function Figure({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "accent" | "muted" }) {
  return (
    <div>
      <p className="label-mono text-slate-400">{label.toUpperCase()}</p>
      <p
        className={`mt-1 text-lg font-semibold tabular-nums ${
          tone === "accent" ? "text-blue-600" : tone === "muted" ? "text-slate-400" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function SettlementNegotiationTargetCalculatorTool() {
  const [documentedValue, setDocumentedValue] = useState(18_500);
  const [insurerOffer, setInsurerOffer] = useState(12_000);
  const [cushionPercent, setCushionPercent] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hasValue = documentedValue > 0;
    const hasOffer = insurerOffer > 0;

    const suggestedCounter = documentedValue * (1 + cushionPercent / 100);
    const cushionAmount = suggestedCounter - documentedValue;

    const gapOfferToValue = documentedValue - insurerOffer;
    const gapCounterToOffer = suggestedCounter - insurerOffer;

    const offerAsPercentOfValue = hasValue ? insurerOffer / documentedValue : null;

    const offerBelowValue = hasValue && hasOffer && insurerOffer < documentedValue;
    const offerAtOrAboveValue = hasValue && hasOffer && insurerOffer >= documentedValue;
    const noOfferYet = !hasOffer;

    return {
      hasValue,
      hasOffer,
      suggestedCounter,
      cushionAmount,
      gapOfferToValue,
      gapCounterToOffer,
      offerAsPercentOfValue,
      offerBelowValue,
      offerAtOrAboveValue,
      noOfferYet,
    };
  }, [documentedValue, insurerOffer, cushionPercent]);

  async function copyResult() {
    const lines = [
      "Settlement negotiation target",
      `Insurer's current offer: ${result.hasOffer ? USD.format(insurerOffer) : "not entered"}`,
      `Your documented claim value: ${result.hasValue ? USD.format(documentedValue) : "not entered"}`,
      `Suggested opening counter (your value + your ${cushionPercent}% cushion): ${USD.format(result.suggestedCounter)}`,
      `Gap between insurer's offer and your documented value: ${USD.format(Math.abs(result.gapOfferToValue))}`,
      `Gap between your counter and insurer's offer: ${USD.format(Math.abs(result.gapCounterToOffer))}`,
      "This is a negotiation planning estimate, not legal advice, and not a guaranteed outcome.",
      "insurancetools.org/tools/claims/settlement-negotiation-target-calculator",
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
        <span className="label-mono text-slate-500">SETTLEMENT NEGOTIATION TARGET CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <NumberField
            label="Your independently documented claim value"
            hint="Your own estimate — a contractor bid, repair shop estimate, or this site's claim payout calculator, not the insurer's number"
            value={documentedValue}
            onChange={setDocumentedValue}
          />
          <NumberField
            label="Insurer's current offer"
            hint="What the adjuster has offered so far, in dollars"
            value={insurerOffer}
            onChange={setInsurerOffer}
          />
          <CushionField value={cushionPercent} onChange={setCushionPercent} />
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">SUGGESTED OPENING COUNTER</p>
            <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
              {USD.format(result.suggestedCounter)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {cushionPercent === 0
                ? "Equal to your documented value — no cushion added."
                : cushionPercent > 0
                  ? `Your documented value plus a ${cushionPercent}% cushion you set (${USD.format(result.cushionAmount)}).`
                  : `Your documented value minus a ${Math.abs(cushionPercent)}% reduction you set (${USD.format(Math.abs(result.cushionAmount))}).`}
            </p>
          </div>

          {result.noOfferYet ? (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              Enter the insurer&apos;s current offer to see the exact gap between what they&apos;ve offered and
              your suggested counter.
            </div>
          ) : result.offerBelowValue ? (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-800">
              The insurer&apos;s offer is {USD.format(result.gapOfferToValue)} below your documented value
              {result.offerAsPercentOfValue !== null &&
                ` (about ${PCT.format(result.offerAsPercentOfValue)} of it)`}
              . That gap is what a counter-offer conversation is meant to close.
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-600">
              The insurer&apos;s offer already meets or exceeds your documented value. Before countering,
              double check that your documented value fully accounts for every loss category you&apos;re
              entitled to.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-4">
            <Figure label="Insurer's offer" value={result.hasOffer ? USD.format(insurerOffer) : "—"} tone={result.hasOffer ? "default" : "muted"} />
            <Figure label="Your documented value" value={result.hasValue ? USD.format(documentedValue) : "—"} tone="accent" />
          </div>

          <div className="space-y-3 border-t border-hairline pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-700">Gap: offer to documented value</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasOffer
                  ? `${USD.format(Math.abs(result.gapOfferToValue))} ${result.offerBelowValue ? "below" : "at or above"} your documented value.`
                  : "Enter the insurer's offer to see this gap."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Gap: counter to offer</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {result.hasOffer
                  ? `Your suggested counter is ${USD.format(Math.abs(result.gapCounterToOffer))} ${result.gapCounterToOffer >= 0 ? "above" : "below"} the insurer's current offer — that's the room a negotiation would need to cover.`
                  : "Enter the insurer's offer to see this gap."}
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
        Planning estimate only, not legal advice or a guaranteed negotiation outcome. This tool does not
        know your policy language, your state&apos;s claims-handling rules, or the specific facts of your
        claim. The &ldquo;cushion&rdquo; percentage is a number you choose yourself, never a fabricated
        insurance-industry standard. For a claim of real value, or one that is stalled, talk to a licensed
        public adjuster or an attorney before finalizing any settlement.
      </div>
    </div>
  );
}

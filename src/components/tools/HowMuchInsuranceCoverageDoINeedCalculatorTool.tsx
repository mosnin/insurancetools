"use client";

/**
 * "How much insurance coverage do I need?" calculator.
 *
 * This is deliberately not a single-number calculator. Auto, home, renters,
 * life, business, and umbrella coverage are each sized by completely
 * different math (replacement cost, income replacement, liability exposure,
 * revenue at risk), so blending them into one dollar figure would be a
 * fabricated number dressed up as a result. Instead, this tool works as a
 * short cross-line triage questionnaire: answer a handful of yes/no
 * questions about your situation, and it routes you to the specific
 * Insurance Tools calculator built for that line, live, as you answer.
 *
 * All logic runs client-side. Nothing typed here is sent anywhere.
 */

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Rough net worth line above which a standard auto or home liability limit
 * often stops covering a serious judgment. Most insurers cap auto and home
 * liability somewhere around $500,000, so this mirrors that commonly cited
 * ceiling rather than inventing a new threshold. */
const UMBRELLA_THRESHOLD = 500_000;

type Housing = "own" | "rent" | "neither";

interface Recommendation {
  key: string;
  title: string;
  why: string;
  href: string;
  linkLabel: string;
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

function HousingField({ value, onChange }: { value: Housing; onChange: (v: Housing) => void }) {
  const options: { value: Housing; label: string }[] = [
    { value: "own", label: "I own my home" },
    { value: "rent", label: "I rent" },
    { value: "neither", label: "Neither" },
  ];
  return (
    <div>
      <span className="block text-[13px] font-medium text-slate-600">Your housing situation</span>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
              value === opt.value
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NetWorthField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const max = 20_000_000;
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-slate-600">
        Rough net worth (savings, investments, home equity, minus debt)
      </span>
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          $
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          step={1000}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const clamped = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), max) : 0;
            onChange(clamped);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </span>
      <span className="mt-1 block text-xs text-slate-400">
        A ballpark figure is fine. Leave at $0 if you&apos;d rather skip this question.
      </span>
    </label>
  );
}

export function HowMuchInsuranceCoverageDoINeedCalculatorTool() {
  const [housing, setHousing] = useState<Housing>("own");
  const [hasCar, setHasCar] = useState(true);
  const [hasDependents, setHasDependents] = useState(false);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [netWorth, setNetWorth] = useState(0);
  const [wantsGapCheck, setWantsGapCheck] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const recs: Recommendation[] = [];

    if (housing === "own") {
      recs.push({
        key: "home",
        title: "You own your home",
        why: "Homeowners coverage is sized around dwelling replacement cost and personal property, not the home's market value, and that gap is easy to get wrong.",
        href: "/tools/home",
        linkLabel: "Home Insurance Tools",
      });
    } else if (housing === "rent") {
      recs.push({
        key: "renters",
        title: "You rent your home",
        why: "A landlord's policy covers the building, not your belongings or your liability inside the unit. This calculator sizes both.",
        href: "/tools/renters/renters-insurance-coverage-calculator",
        linkLabel: "Renters Insurance Coverage Calculator",
      });
    }

    if (hasCar) {
      recs.push({
        key: "auto",
        title: "You own or regularly drive a car",
        why: "Auto liability limits should reflect what a judgment could actually reach, your assets plus your income, not just the state minimum on the quote form.",
        href: "/tools/auto/car-insurance-coverage-calculator",
        linkLabel: "Car Insurance Coverage Calculator",
      });
    }

    if (hasDependents) {
      recs.push({
        key: "life",
        title: "You have dependents who rely on your income",
        why: "Life insurance needs are driven by income replacement years, debts, and future costs like college, a very different calculation from any other line here.",
        href: "/tools/life/life-insurance-needs-calculator",
        linkLabel: "Life Insurance Needs Calculator",
      });
    }

    if (hasBusiness) {
      recs.push({
        key: "business",
        title: "You own a business or do paid side work",
        why: "A homeowners or personal auto policy typically excludes business activity entirely. Business exposure needs its own coverage, sized to what you do.",
        href: "/tools/business",
        linkLabel: "Business Insurance Tools",
      });
    }

    if (netWorth > 0) {
      recs.push({
        key: "net-worth",
        title: `You entered a net worth of ${USD.format(netWorth)}`,
        why: "Run the exact numbers instead of relying on the rough $500,000 threshold this questionnaire uses, so you know precisely how much excess liability protection makes sense.",
        href: "/tools/coverage/net-worth-protection-calculator",
        linkLabel: "Net Worth Protection Calculator",
      });
    }

    if (netWorth >= UMBRELLA_THRESHOLD) {
      recs.push({
        key: "umbrella",
        title: `Your net worth is above the ${USD.format(UMBRELLA_THRESHOLD)} range`,
        why: "That's close to where standard auto and home liability limits stop, so a serious judgment could reach savings those policies don't cover.",
        href: "/tools/coverage/umbrella-policy-need-calculator",
        linkLabel: "Umbrella Policy Need Calculator",
      });
    }

    if (wantsGapCheck) {
      recs.push({
        key: "gap",
        title: "You already have several policies in place",
        why: "Individually reasonable policies can still leave a gap between them, or overlap and duplicate premium. This checks the seams between what you already own.",
        href: "/tools/coverage/coverage-gap-calculator",
        linkLabel: "Coverage Gap Calculator",
      });
    }

    const nothingFlagged = recs.length === 0;

    return { recs, nothingFlagged };
  }, [housing, hasCar, hasDependents, hasBusiness, netWorth, wantsGapCheck]);

  async function copyResult() {
    const lines = [
      "Insurance coverage checklist — recommended next tools",
      ...(result.nothingFlagged
        ? ["No areas flagged yet. Revisit this after a major life change: a home purchase, a new car, a child, or starting a business."]
        : result.recs.map((r) => `${r.title} -> ${r.linkLabel}: insurancetools.org${r.href}`)),
      "This is a routing tool, not a coverage amount. Each linked calculator produces its own line-specific estimate.",
      "insurancetools.org/tools/coverage/how-much-insurance-coverage-do-i-need-calculator",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the
      // checklist stays fully visible on screen either way.
    }
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <span className="label-mono text-slate-500">HOW MUCH INSURANCE COVERAGE DO I NEED CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <HousingField value={housing} onChange={setHousing} />
          <div className="space-y-3">
            <ToggleField
              label="I own or regularly drive a car"
              checked={hasCar}
              onChange={setHasCar}
            />
            <ToggleField
              label="I have dependents who rely on my income"
              hint="A spouse, children, aging parents, or anyone your income supports"
              checked={hasDependents}
              onChange={setHasDependents}
            />
            <ToggleField
              label="I own a business, freelance, or do paid side work"
              checked={hasBusiness}
              onChange={setHasBusiness}
            />
          </div>
          <NetWorthField value={netWorth} onChange={setNetWorth} />
          <ToggleField
            label="I already have several of these policies and want to check for overlaps or gaps"
            hint="Useful once you've bought coverage across more than one line"
            checked={wantsGapCheck}
            onChange={setWantsGapCheck}
          />
        </div>

        {/* Results */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">YOUR NEXT STEPS</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              {result.nothingFlagged
                ? "No areas flagged yet"
                : `${result.recs.length} area${result.recs.length === 1 ? "" : "s"} to look at`}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Not a dollar figure. Each item below is a specific tool sized for that one line of coverage.
            </p>
          </div>

          {result.nothingFlagged ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-600">
              Nothing here is flagged yet, which usually means your situation is either simple today or
              this questionnaire is missing an answer above. Revisit this after a major change: buying a
              home or car, having a child, starting a business, or a jump in savings.
            </div>
          ) : (
            <ul className="space-y-3 border-t border-hairline pt-4">
              {result.recs.map((r) => (
                <li key={r.key} className="rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-3">
                  <p className="text-xs font-semibold text-slate-800">{r.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{r.why}</p>
                  <a
                    href={r.href}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                  >
                    Try the {r.linkLabel} &rarr;
                  </a>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={copyResult}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy checklist"}
          </button>
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        This tool routes you to the right calculator for each line of coverage; it does not calculate a
        combined dollar amount, because auto, home, life, business, and umbrella coverage are each sized
        by different math and blending them would produce a misleading number. Treat every recommendation
        as a starting point for research, not a final decision, and confirm specifics with a licensed
        insurance agent or financial professional.
      </div>
    </div>
  );
}

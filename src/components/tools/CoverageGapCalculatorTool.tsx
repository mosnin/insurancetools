"use client";

/**
 * Coverage gap calculator.
 *
 * This is deliberately a cross-line gap finder, not another needs-analysis
 * calculator. It never estimates how much coverage anyone needs — that math
 * already lives in four dedicated tools elsewhere on this site (dwelling,
 * auto liability, life insurance, umbrella). What it does is take the
 * "needed" figure the user already worked out on those pages, compare it
 * against what they currently carry, and rank the resulting dollar gaps so
 * the user knows which policy to fix first.
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

type CategoryKey = "dwelling" | "auto" | "life" | "umbrella";

interface CategoryDef {
  key: CategoryKey;
  label: string;
  currentLabel: string;
  neededLabel: string;
  hint: string;
  toolHref: string;
  toolLabel: string;
}

const CATEGORY_DEFS: CategoryDef[] = [
  {
    key: "dwelling",
    label: "Home dwelling coverage",
    currentLabel: "Current Coverage A limit",
    neededLabel: "Needed dwelling coverage",
    hint: "Get the needed figure from the Dwelling Coverage Calculator first.",
    toolHref: "/tools/home/dwelling-coverage-calculator",
    toolLabel: "Dwelling Coverage Calculator",
  },
  {
    key: "auto",
    label: "Auto liability coverage",
    currentLabel: "Current combined liability limit",
    neededLabel: "Needed liability limit",
    hint: "Get the needed figure from the Car Insurance Coverage Calculator first.",
    toolHref: "/tools/auto/car-insurance-coverage-calculator",
    toolLabel: "Car Insurance Coverage Calculator",
  },
  {
    key: "life",
    label: "Life insurance coverage",
    currentLabel: "Current total death benefit",
    neededLabel: "Needed death benefit",
    hint: "Get the needed figure from the Life Insurance Needs Calculator first.",
    toolHref: "/tools/life/life-insurance-needs-calculator",
    toolLabel: "Life Insurance Needs Calculator",
  },
  {
    key: "umbrella",
    label: "Umbrella / excess liability coverage",
    currentLabel: "Current umbrella limit",
    neededLabel: "Needed umbrella limit",
    hint: "Get the needed figure from the Umbrella Policy Need Calculator first.",
    toolHref: "/tools/coverage/umbrella-policy-need-calculator",
    toolLabel: "Umbrella Policy Need Calculator",
  },
];

interface RowState {
  enabled: boolean;
  current: number;
  needed: number;
}

const DEFAULT_ROWS: Record<CategoryKey, RowState> = {
  dwelling: { enabled: true, current: 280_000, needed: 340_000 },
  auto: { enabled: true, current: 100_000, needed: 300_000 },
  life: { enabled: true, current: 250_000, needed: 750_000 },
  umbrella: { enabled: true, current: 0, needed: 1_000_000 },
};

const MAX_VALUE = 20_000_000;

function clamp(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  return Math.min(Math.max(raw, 0), MAX_VALUE);
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function NumberField({ label, value, onChange, disabled }: NumberFieldProps) {
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
          max={MAX_VALUE}
          step={1000}
          disabled={disabled}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        />
      </span>
    </label>
  );
}

interface GapResult {
  def: CategoryDef;
  current: number;
  needed: number;
  gapDollar: number;
  gapPercent: number;
  status: "underinsured" | "surplus" | "matched";
}

export function CoverageGapCalculatorTool() {
  const [rows, setRows] = useState<Record<CategoryKey, RowState>>(DEFAULT_ROWS);
  const [copied, setCopied] = useState(false);

  function updateRow(key: CategoryKey, patch: Partial<RowState>) {
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  const result = useMemo(() => {
    const active: GapResult[] = CATEGORY_DEFS.filter((def) => rows[def.key].enabled).map((def) => {
      const { current, needed } = rows[def.key];
      const gapDollar = needed - current;
      const gapPercent = needed > 0 ? (gapDollar / needed) * 100 : 0;
      const status: GapResult["status"] =
        gapDollar > 0 ? "underinsured" : gapDollar < 0 ? "surplus" : "matched";
      return { def, current, needed, gapDollar, gapPercent, status };
    });

    const ranked = [...active].sort((a, b) => b.gapDollar - a.gapDollar);
    const totalGap = active.reduce((sum, r) => sum + Math.max(0, r.gapDollar), 0);
    const totalSurplus = active.reduce((sum, r) => sum + Math.max(0, -r.gapDollar), 0);
    const underinsuredCount = active.filter((r) => r.status === "underinsured").length;
    const topGap = ranked.find((r) => r.status === "underinsured") ?? null;

    return { active, ranked, totalGap, totalSurplus, underinsuredCount, topGap };
  }, [rows]);

  async function copyResult() {
    if (result.active.length === 0) {
      return;
    }
    const lines = [
      "Coverage gap summary (largest gap first)",
      ...result.ranked.map((r) => {
        const tag =
          r.status === "underinsured"
            ? `underinsured by ${USD.format(r.gapDollar)} (${r.gapPercent.toFixed(0)}%)`
            : r.status === "surplus"
              ? `${USD.format(Math.abs(r.gapDollar))} above the needed amount`
              : "matches the needed amount";
        return `${r.def.label}: current ${USD.format(r.current)}, needed ${USD.format(r.needed)} — ${tag}`;
      }),
      `Total dollars of underinsurance across selected categories: ${USD.format(result.totalGap)}`,
      "Estimate only, based on figures you entered. Not insurance advice. insurancetools.org/tools/coverage/coverage-gap-calculator",
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
        <span className="label-mono text-slate-500">COVERAGE GAP CALCULATOR</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="border-b border-hairline bg-blue-50/60 px-5 py-3 text-xs leading-relaxed text-blue-800">
        This tool compares numbers you already have. For each category below, get the &ldquo;needed&rdquo;
        amount from the linked calculator first, then enter both figures here to see and rank the gaps.
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          {CATEGORY_DEFS.map((def) => {
            const row = rows[def.key];
            return (
              <div
                key={def.key}
                className={`rounded-lg border p-4 transition-colors ${
                  row.enabled ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/60"
                }`}
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) => updateRow(def.key, { enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-slate-900">{def.label}</span>
                </label>
                <p className="mt-1 pl-6 text-xs text-slate-500">
                  {def.hint}{" "}
                  <a
                    href={def.toolHref}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Open the {def.toolLabel}
                  </a>
                  .
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 pl-6">
                  <NumberField
                    label={def.currentLabel}
                    value={row.current}
                    disabled={!row.enabled}
                    onChange={(v) => updateRow(def.key, { current: v })}
                  />
                  <NumberField
                    label={def.neededLabel}
                    value={row.needed}
                    disabled={!row.enabled}
                    onChange={(v) => updateRow(def.key, { needed: v })}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          {result.active.length === 0 ? (
            <p className="text-sm text-slate-500">
              Select at least one category on the left to see your coverage gaps.
            </p>
          ) : (
            <>
              <div>
                <p className="label-mono text-slate-400">TOTAL UNDERINSURANCE ACROSS SELECTED LINES</p>
                <p className="mt-1.5 text-3xl font-semibold tabular-nums tracking-[-0.02em] text-slate-900">
                  {USD.format(result.totalGap)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {result.underinsuredCount === 0
                    ? "No gaps found across your selected categories — current coverage meets or exceeds every needed amount you entered."
                    : `Across ${result.underinsuredCount} of ${result.active.length} selected ${
                        result.active.length === 1 ? "category" : "categories"
                      } where current coverage falls short of the needed amount you entered.`}
                </p>
              </div>

              {result.topGap && (
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
                  Largest gap: <strong>{result.topGap.def.label}</strong> is underinsured by{" "}
                  {USD.format(result.topGap.gapDollar)} ({result.topGap.gapPercent.toFixed(0)}% short of the
                  needed amount). If you can only address one policy first, this is the one with the
                  biggest dollar exposure.
                </div>
              )}

              <div className="space-y-3 border-t border-hairline pt-4">
                <p className="text-xs font-semibold text-slate-700">Ranked by dollar gap, largest first</p>
                <ol className="space-y-2.5">
                  {result.ranked.map((r, i) => (
                    <li
                      key={r.def.key}
                      className="rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-800">
                          {i + 1}. {r.def.label}
                        </span>
                        <span
                          className={`text-xs font-semibold tabular-nums ${
                            r.status === "underinsured"
                              ? "text-red-600"
                              : r.status === "surplus"
                                ? "text-emerald-600"
                                : "text-slate-500"
                          }`}
                        >
                          {r.status === "underinsured"
                            ? `-${USD.format(r.gapDollar)}`
                            : r.status === "surplus"
                              ? `+${USD.format(Math.abs(r.gapDollar))}`
                              : "On target"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Current {USD.format(r.current)} vs. needed {USD.format(r.needed)}
                        {r.status !== "matched" && ` (${Math.abs(r.gapPercent).toFixed(0)}% ${
                          r.status === "underinsured" ? "short" : "over"
                        })`}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {result.totalSurplus > 0 && (
                <p className="border-t border-hairline pt-3 text-xs text-slate-500">
                  You also carry {USD.format(result.totalSurplus)} more than the needed amount in at least
                  one category above. That is not necessarily wasted, since needs analyses carry their own
                  assumptions, but it is worth a second look if premium cost is a concern.
                </p>
              )}

              <button
                type="button"
                onClick={copyResult}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {copied ? "Copied" : "Copy result"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-hairline bg-slate-50/60 px-5 py-3.5 text-xs leading-relaxed text-slate-500">
        Estimate only. This tool only compares numbers you enter; it does not calculate how much coverage
        you need in any category. The quality of the result depends entirely on the accuracy of the
        &ldquo;needed&rdquo; figures you bring in, ideally from this site&apos;s dedicated calculators. It is not a
        quote, an underwriting review, or insurance advice. Confirm any coverage change with a licensed
        insurance agent before you buy or cancel a policy.
      </div>
    </div>
  );
}

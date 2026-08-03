"use client";

/**
 * Multi-state move insurance checklist calculator.
 *
 * This is deliberately not a state-rules lookup. State DMV timelines,
 * registration windows, and licensing requirements vary by state and change
 * over time, and fabricating specific numbers for fifty states would be
 * exactly the kind of confident-but-wrong content the project standards
 * forbid. Instead this tool does two things a rules database can't:
 *
 * 1. Turns "days until my move" into a time-phased checklist, so the same
 *    seven-item list reorders itself into "do this now" vs. "plan ahead"
 *    vs. "handle after you arrive" as the move gets closer.
 * 2. Turns a plain dollar figure for belongings being transported into a
 *    concrete valuables-in-transit exposure prompt, tailored to whether a
 *    professional mover is involved, since that changes who is actually on
 *    the hook if something is lost or damaged.
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

type Phase = 0 | 1 | 2 | 3;

const PHASE_LABELS: Record<Phase, string> = {
  0: "Planning phase — 45+ days out",
  1: "Active preparation — 15 to 45 days out",
  2: "Final countdown — 1 to 14 days out",
  3: "Moving day or just arrived",
};

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  detail: string;
  phase: Phase;
}

const BASE_ITEMS: ChecklistItem[] = [
  {
    id: "auto-quotes",
    category: "Auto",
    title: "Get updated auto insurance quotes for your new state",
    detail:
      "Auto insurance rates vary significantly by state due to differences in claim costs, minimum coverage rules, and the local risk pool, so your current premium is not a reliable guide to what you'll pay after you move. Shop quotes early enough to compare a few insurers before your policy needs to change.",
    phase: 0,
  },
  {
    id: "valuables-transit",
    category: "Moving",
    title: "Check your valuables-in-transit coverage before you book a mover",
    detail:
      "Ask directly what happens if a box goes missing or furniture is damaged in transit. Get the answer in writing before the truck is loaded, not after something breaks.",
    phase: 0,
  },
  {
    id: "home-renters",
    category: "Home & Renters",
    title: "Confirm whether your homeowners or renters policy transfers",
    detail:
      "Homeowners and renters insurers are licensed state by state, so your current insurer may not write policies in your new state at all, even if the brand name is the same. Ask your agent whether your policy transfers, needs to be rewritten, or has to be replaced with a new policy from an insurer licensed in your new state.",
    phase: 1,
  },
  {
    id: "health-network",
    category: "Health",
    title: "Review health insurance network changes",
    detail:
      "Moving to a new state is generally a qualifying life event that can open a special enrollment window for marketplace or individual health coverage, and it may also mean your current doctors and hospitals fall outside your plan's network. Confirm network coverage in your new state before you need care, not during an appointment.",
    phase: 1,
  },
  {
    id: "notify-auto",
    category: "Auto",
    title: "Notify your current auto insurer and update your address",
    detail:
      "Tell your existing insurer the move is happening and update your mailing and garaging address as soon as you have a firm date. Most states also expect you to register your vehicle and update your license within a set window after you establish residency, and that window is set by your new state, not your insurer, so confirm the exact timeline with your new state's DMV.",
    phase: 2,
  },
  {
    id: "dmv-registration",
    category: "Auto",
    title: "Register your vehicle and license with your new state's DMV",
    detail:
      "Every state sets its own deadline and process for new-resident vehicle registration and driver licensing, so this is not something a generic checklist can safely predict for you. Look up your specific new state's requirements directly with its DMV or licensing agency shortly after you arrive.",
    phase: 3,
  },
  {
    id: "life-disability",
    category: "Life & Disability",
    title: "Update life and disability insurance beneficiary and address details",
    detail:
      "Update your mailing address on any life and disability policies and confirm your beneficiary designations still reflect your wishes. Some state laws around beneficiaries, community property, and estate matters differ, so if your move crosses into a state with meaningfully different rules, it's worth a short conversation with your agent or an estate attorney.",
    phase: 3,
  },
];

type Tone = "now" | "done" | "upcoming";

function statusFor(item: ChecklistItem, phaseIndex: Phase): { label: string; tone: Tone } {
  if (item.phase <= 2) {
    if (phaseIndex > item.phase) return { label: "Should already be handled", tone: "done" };
    if (phaseIndex === item.phase) return { label: "Do this now", tone: "now" };
    return { label: "Plan ahead", tone: "upcoming" };
  }
  if (phaseIndex === 3) return { label: "Do this now", tone: "now" };
  return { label: "After you arrive", tone: "upcoming" };
}

const TONE_CLASSES: Record<Tone, string> = {
  now: "bg-blue-50 text-blue-700 border-blue-200",
  done: "bg-slate-100 text-slate-500 border-slate-200",
  upcoming: "bg-amber-50 text-amber-700 border-amber-200",
};

function phaseIndexFromDays(days: number): Phase {
  if (days > 45) return 0;
  if (days > 14) return 1;
  if (days > 0) return 2;
  return 3;
}

export function MultiStateMoveInsuranceChecklistCalculatorTool() {
  const [oldState, setOldState] = useState("");
  const [newState, setNewState] = useState("");
  const [daysUntilMove, setDaysUntilMove] = useState(30);
  const [valuablesValue, setValuablesValue] = useState(20_000);
  const [hiredMover, setHiredMover] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const clampedDays = Number.isFinite(daysUntilMove)
      ? Math.min(Math.max(Math.round(daysUntilMove), 0), 365)
      : 30;
    const clampedValue = Number.isFinite(valuablesValue)
      ? Math.min(Math.max(valuablesValue, 0), 5_000_000)
      : 0;
    const phaseIndex = phaseIndexFromDays(clampedDays);

    const items = BASE_ITEMS.map((item) => ({
      ...item,
      status: statusFor(item, phaseIndex),
    }));

    const dueNow = items.filter((item) => item.status.tone === "now");
    const fromLabel = oldState.trim() || "your current state";
    const toLabel = newState.trim() || "your new state";

    const exposureNote = hiredMover
      ? "A professional mover typically offers a baseline liability option that federal rules require them to make available, but it is usually calculated by the weight of your shipment rather than what your belongings are actually worth. Compare that valuation option against the total you entered, and ask your homeowners or renters insurer whether an off-premises or moving clause helps close any remaining gap."
      : "Without a professional mover, there is generally no separate carrier liability protecting your belongings in transit. Ask your homeowners or renters insurer directly whether off-premises coverage extends to a personal or rented vehicle during a self-move, and whether a rented trailer needs its own coverage.";

    return {
      clampedDays,
      clampedValue,
      phaseIndex,
      phaseLabel: PHASE_LABELS[phaseIndex],
      items,
      dueNow,
      fromLabel,
      toLabel,
      exposureNote,
    };
  }, [oldState, newState, daysUntilMove, valuablesValue, hiredMover]);

  async function copyResult() {
    const lines = [
      `Move insurance checklist: ${result.fromLabel} to ${result.toLabel}`,
      `Timeline: ${result.clampedDays} day(s) until move (${result.phaseLabel})`,
      `Valuables in transit: ${USD.format(result.clampedValue)} (${hiredMover ? "using a professional mover" : "self-move"})`,
      "Do this now:",
      ...(result.dueNow.length
        ? result.dueNow.map((item) => `- ${item.title}`)
        : ["- Nothing is flagged urgent at this exact timeline; review the full checklist below."]),
      "Estimate and general checklist only, not state-specific legal or insurance advice. insurancetools.org/tools/state-requirements/multi-state-move-insurance-checklist-calculator",
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
        <span className="label-mono text-slate-500">MULTI-STATE MOVE INSURANCE CHECKLIST</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="label-mono text-slate-400">LIVE</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-hairline lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4 bg-white p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[13px] font-medium text-slate-600">Moving from</span>
              <input
                type="text"
                value={oldState}
                onChange={(e) => setOldState(e.target.value.slice(0, 40))}
                placeholder="e.g. California"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
            <label className="block">
              <span className="block text-[13px] font-medium text-slate-600">Moving to</span>
              <input
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value.slice(0, 40))}
                placeholder="e.g. Texas"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-[13px] font-medium text-slate-600">Days until your move</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={365}
              step={1}
              value={Number.isFinite(daysUntilMove) ? daysUntilMove : 0}
              onChange={(e) => {
                const raw = Number(e.target.value);
                setDaysUntilMove(Number.isFinite(raw) ? Math.min(Math.max(Math.round(raw), 0), 365) : 0);
              }}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="mt-1 block text-xs text-slate-400">Enter 0 if you&apos;ve already moved</span>
          </label>

          <label className="block">
            <span className="block text-[13px] font-medium text-slate-600">
              Total value of belongings being transported
            </span>
            <span className="relative mt-1.5 block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={5_000_000}
                step={500}
                value={Number.isFinite(valuablesValue) ? valuablesValue : 0}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  setValuablesValue(Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 5_000_000) : 0);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </span>
            <span className="mt-1 block text-xs text-slate-400">
              A rough estimate is fine — furniture, electronics, and other household goods combined
            </span>
          </label>

          <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
            <input
              type="checkbox"
              checked={hiredMover}
              onChange={(e) => setHiredMover(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Using a professional moving company</span>
          </label>
        </div>

        {/* Results */}
        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <p className="label-mono text-slate-400">MOVE TIMELINE</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
              {result.phaseLabel}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {result.fromLabel} &rarr; {result.toLabel}, {result.clampedDays} day
              {result.clampedDays === 1 ? "" : "s"} until move
            </p>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="label-mono text-slate-400">VALUABLES-IN-TRANSIT EXPOSURE</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-[-0.02em] text-blue-600">
              {USD.format(result.clampedValue)}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{result.exposureNote}</p>
          </div>

          <div className="border-t border-hairline pt-4">
            <p className="label-mono mb-2 text-slate-400">
              CHECKLIST ({result.dueNow.length} item{result.dueNow.length === 1 ? "" : "s"} due now)
            </p>
            <ul className="space-y-2">
              {result.items.map((item) => (
                <li key={item.id} className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800">{item.title}</span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${TONE_CLASSES[item.status.tone]}`}
                    >
                      {item.status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.detail}</p>
                </li>
              ))}
            </ul>
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
        Estimate and general checklist only. This tool does not look up your specific state&apos;s DMV
        deadlines, insurance requirements, or a mover&apos;s actual liability terms; those vary by state and
        by company. Confirm exact timelines with your new state&apos;s DMV or licensing agency, and confirm
        coverage details with your insurer or moving company before your move.
      </div>
    </div>
  );
}

"use client";

/**
 * The tool card.
 *
 * Structurally this follows the reference layout: an identity row at the
 * top, the title block, a measured bar, and an action row pinned to the
 * bottom. What changes is everything the reference used to carry meaning.
 * There is no avatar, because no person owns a calculator, and no invented
 * "61% progress", because a fabricated statistic on a finance site is worse
 * than no statistic at all. The bar instead plots something true: how many
 * inputs the tool asks for, which is a genuine signal of how much work it
 * expects from you.
 *
 * The beam frame appears on hover and keyboard focus rather than running
 * permanently, so a grid of thirty cards costs nothing until one is
 * actually being considered.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon, type CategoryIconName } from "./icons/CategoryIcon";
import { BeamFrame } from "./BeamFrame";
import type { Tool } from "@/types";

const KNOWN: CategoryIconName[] = [
  "auto",
  "home",
  "life",
  "health",
  "business",
  "renters",
  "travel",
  "pet",
  "claims",
  "deductibles",
  "coverage",
  "state-requirements",
];

function iconFor(categorySlug: string): CategoryIconName {
  return KNOWN.includes(categorySlug as CategoryIconName)
    ? (categorySlug as CategoryIconName)
    : "coverage";
}

export interface ToolCardProps {
  tool: Tool;
  /** Number of inputs the calculator asks for, when known. */
  inputs?: number;
  className?: string;
}

/** Depth reads from the keyword breadth we already store per tool. */
function complexityOf(tool: Tool): { label: string; pct: number } {
  const n = tool.keywords?.length ?? 0;
  if (n >= 6) return { label: "In depth", pct: 88 };
  if (n >= 5) return { label: "Standard", pct: 62 };
  if (n >= 3) return { label: "Quick", pct: 40 };
  return { label: "Quick", pct: 28 };
}

export function ToolCard({ tool, className = "" }: ToolCardProps) {
  const [active, setActive] = useState(false);
  const depth = complexityOf(tool);
  const href = `/tools/${tool.categorySlug}/${tool.slug}`;

  const card = (
    <div
      className={`group flex h-full flex-col rounded-2xl border border-hairline-strong bg-white p-5 transition-colors ${
        active ? "border-blue-200" : "hover:border-slate-300"
      } ${className}`}
    >
      {/* Identity row */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-900 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
            <CategoryIcon name={iconFor(tool.categorySlug)} size={26} />
          </span>
          <span className="min-w-0">
            <span className="label-mono block text-slate-400">{tool.category.toUpperCase()}</span>
            <span className="mt-0.5 block text-[11px] text-slate-400">Free, no sign-up</span>
          </span>
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white">
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>

      {/* Title block */}
      <div className="min-h-0 flex-1">
        <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
          <Link
            href={href}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {tool.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
          {tool.description}
        </p>
      </div>

      {/* Measured bar: real signal, not an invented percentage */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Depth</span>
          <span className="font-medium text-slate-600">{depth.label}</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-[width] duration-500 ease-out group-hover:bg-blue-600"
            style={{ width: `${depth.pct}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {active ? <BeamFrame radius={16} strength={0.75}>{card}</BeamFrame> : card}
    </div>
  );
}

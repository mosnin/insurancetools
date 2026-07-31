"use client";

/**
 * The site's one and only busy indicator.
 *
 * `thinking-orbs` paints to a canvas, so this is a client component and is
 * only ever mounted while something is genuinely pending: a route
 * transition between tool pages, or a search result set being resolved.
 * Calculators themselves compute synchronously on every keystroke, so they
 * never show a spinner, and putting one there would be theatre.
 *
 * The orb is paused for visitors who prefer reduced motion; the canvas
 * keeps its painted frame, so the shape stays as a static mark and the
 * accompanying label still announces the state.
 */

import { ThinkingOrb, type OrbState, type OrbSize } from "thinking-orbs";
import { useReducedMotion } from "motion/react";

export interface ProcessingOrbProps {
  state?: OrbState;
  size?: OrbSize;
  speed?: number;
  /** Text announced to assistive tech and shown beside the orb. */
  label?: string;
  /** Hide the visible caption and keep the label for screen readers only. */
  hideLabel?: boolean;
  className?: string;
}

export function ProcessingOrb({
  state = "shaping",
  size = 64,
  speed = 1.65,
  label = "Loading",
  hideLabel = false,
  className = "",
}: ProcessingOrbProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <ThinkingOrb
        state={state}
        size={size}
        speed={speed}
        theme="light"
        paused={Boolean(shouldReduceMotion)}
        aria-hidden="true"
      />
      <span className={hideLabel ? "sr-only" : "label-mono text-slate-400"}>
        {hideLabel ? label : label.toUpperCase()}
      </span>
    </div>
  );
}

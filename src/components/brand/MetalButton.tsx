"use client";

/**
 * House wrapper around `metal-fx`, used only on a page's single primary
 * call to action.
 *
 * MetalFx runs a shared WebGL renderer. One shader canvas per page is a
 * fair trade for the hero action; one per button is not, and this site's
 * entire acquisition strategy rests on Core Web Vitals across 443 static
 * tool pages. So the primitive exists to make the effect easy to apply
 * consistently in the two or three places it earns its cost, and awkward to
 * scatter everywhere else.
 *
 * Notes on configuration:
 * - `theme="light"` is pinned because the site is all-white by design. The
 *   library's `reflectionTargets` prop only paints in dark mode, so it is
 *   intentionally unused here rather than passed and silently ignored.
 * - The shader is paused for visitors who prefer reduced motion. MetalFx
 *   keeps the last painted frame, so the metallic ring stays visible and
 *   only the animation stops.
 */

import type { ReactNode } from "react";
import { MetalFx, type MetalFxPreset } from "metal-fx";
import { useReducedMotion } from "motion/react";

export interface MetalButtonProps {
  /** A single interactive element: a button, or a Next.js Link. */
  children: ReactNode;
  preset?: MetalFxPreset;
  /** Ring strength, 0 to 1. Kept below 1 so the effect reads as a rim, not a coating. */
  strength?: number;
  /** Corner radius in CSS pixels. Defaults to 8px, matching `rounded-lg`. */
  radius?: number;
  className?: string;
}

export function MetalButton({
  children,
  preset = "silver",
  strength = 0.9,
  radius = 8,
  className,
}: MetalButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MetalFx
      variant="button"
      preset={preset}
      theme="light"
      strength={strength}
      borderRadius={radius}
      paused={Boolean(shouldReduceMotion)}
      className={className}
    >
      {children}
    </MetalFx>
  );
}

"use client";

/**
 * House wrapper around `border-beam`.
 *
 * Centralising the configuration keeps the effect consistent everywhere it
 * appears and stops individual surfaces from drifting into louder presets.
 * Defaults are deliberately restrained: the ocean variant stays inside the
 * blue family the rest of the site uses, and `pulse-inner` breathes within
 * the element's own border rather than blooming past it, so panels keep
 * their hairline edge instead of gaining a halo.
 *
 * The beam is disabled outright when the visitor prefers reduced motion,
 * matching every other animated primitive in `src/components/motion`.
 */

import type { ReactNode } from "react";
import { BorderBeam, type BorderBeamProps } from "border-beam";
import { useReducedMotion } from "motion/react";

export interface BeamFrameProps
  extends Pick<BorderBeamProps, "size" | "colorVariant" | "strength" | "duration" | "className"> {
  children: ReactNode;
  /** Corner radius in pixels. Defaults to 12px, matching `rounded-xl`. */
  radius?: number;
}

export function BeamFrame({
  children,
  size = "pulse-inner",
  colorVariant = "ocean",
  strength = 0.7,
  duration,
  radius = 12,
  className,
}: BeamFrameProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <BorderBeam
      size={size}
      colorVariant={colorVariant}
      theme="light"
      strength={strength}
      duration={duration}
      borderRadius={radius}
      active={!shouldReduceMotion}
      className={className}
    >
      {children}
    </BorderBeam>
  );
}

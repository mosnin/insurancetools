import type { ReactNode } from "react";

export interface EyebrowProps {
  children: ReactNode;
  /** Center the marker and label, for centered section headers. */
  align?: "left" | "center";
  className?: string;
}

/**
 * Uppercase micro-label that sits above every section heading.
 *
 * It carried a small drawn rule and dot marker at first. That read as
 * decoration rather than structure at every size it appeared, so the label
 * now stands on its own: the tracking and the weight do the work.
 */
export function Eyebrow({ children, align = "left", className = "" }: EyebrowProps) {
  return (
    <p className={`eyebrow ${align === "center" ? "text-center" : ""} ${className}`}>{children}</p>
  );
}

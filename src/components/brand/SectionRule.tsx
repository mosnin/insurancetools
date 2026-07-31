import type { ReactNode } from "react";

export interface SectionRuleProps {
  /** Optional label pinned to the left of the rule, e.g. a section number. */
  label?: ReactNode;
  className?: string;
}

/**
 * Full width hairline with tick marks at each end, the divider that
 * separates landing page sections. Reads as a measurement guide rather than
 * a border, which is what keeps long stretches of white space feeling
 * deliberate instead of empty.
 */
export function SectionRule({ label, className = "" }: SectionRuleProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-2 w-px bg-slate-300" />
      {label != null && (
        <span className="label-mono shrink-0 text-slate-400">{label}</span>
      )}
      <span className="h-px flex-1 bg-hairline" />
      <span className="h-2 w-px bg-slate-300" />
    </div>
  );
}
